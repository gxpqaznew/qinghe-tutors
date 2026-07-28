import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { creatorMedia } from "../../../../db/schema";

function safeEqual(left: string, right: string) {
  if (!left || !right || left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

export async function GET(request: Request) {
  const configuredKey = (env as unknown as { ADMIN_KEY?: string }).ADMIN_KEY || "";
  const suppliedKey = request.headers.get("x-admin-key") || "";
  if (!safeEqual(configuredKey, suppliedKey)) {
    return Response.json({ error: "管理密码不正确" }, { status: 401 });
  }

  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) {
    return Response.json({ error: "文件参数无效" }, { status: 400 });
  }

  try {
    const [media] = await getDb()
      .select()
      .from(creatorMedia)
      .where(eq(creatorMedia.id, id))
      .limit(1);
    if (!media) return Response.json({ error: "文件不存在" }, { status: 404 });

    const bucket = (env as unknown as { MEDIA?: R2Bucket }).MEDIA;
    if (!bucket) return Response.json({ error: "文件存储暂不可用" }, { status: 503 });
    const object = await bucket.get(media.objectKey);
    if (!object) return Response.json({ error: "文件不存在" }, { status: 404 });

    return new Response(object.body, {
      headers: {
        "Content-Type": media.contentType,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "文件加载失败" }, { status: 500 });
  }
}
