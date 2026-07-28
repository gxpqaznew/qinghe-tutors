import { env } from "cloudflare:workers";
import { and, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { creatorMedia, creatorProfiles } from "../../../db/schema";

export async function GET(request: Request) {
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) {
    return Response.json({ error: "文件参数无效" }, { status: 400 });
  }

  try {
    const [media] = await getDb()
      .select({
        objectKey: creatorMedia.objectKey,
        contentType: creatorMedia.contentType,
        fileName: creatorMedia.fileName,
      })
      .from(creatorMedia)
      .innerJoin(creatorProfiles, eq(creatorMedia.creatorProfileId, creatorProfiles.id))
      .where(and(eq(creatorMedia.id, id), eq(creatorProfiles.status, "published")))
      .limit(1);

    if (!media) return Response.json({ error: "文件不存在或尚未公开" }, { status: 404 });

    const bucket = (env as unknown as { MEDIA?: R2Bucket }).MEDIA;
    if (!bucket) return Response.json({ error: "文件存储暂不可用" }, { status: 503 });
    const object = await bucket.get(media.objectKey);
    if (!object) return Response.json({ error: "文件不存在" }, { status: 404 });

    return new Response(object.body, {
      headers: {
        "Content-Type": media.contentType,
        "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(media.fileName)}`,
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "文件加载失败" }, { status: 500 });
  }
}
