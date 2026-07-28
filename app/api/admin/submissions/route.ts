import { env } from "cloudflare:workers";
import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { creatorProfiles, experiencePosts, skillRequests } from "../../../../db/schema";

type SubmissionKind = "creator" | "request" | "experience";

function safeEqual(left: string, right: string) {
  if (!left || !right || left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

function isAuthorized(request: Request) {
  const configuredKey = (env as unknown as { ADMIN_KEY?: string }).ADMIN_KEY || "";
  const suppliedKey = request.headers.get("x-admin-key") || "";
  return safeEqual(configuredKey, suppliedKey);
}

function unauthorized() {
  return Response.json({ error: "管理密码不正确" }, { status: 401 });
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) return unauthorized();

  try {
    const db = getDb();
    const [creators, requests, experiences] = await Promise.all([
      db.select().from(creatorProfiles).where(eq(creatorProfiles.status, "pending")).orderBy(desc(creatorProfiles.createdAt)).limit(100),
      db.select().from(skillRequests).where(eq(skillRequests.status, "pending")).orderBy(desc(skillRequests.createdAt)).limit(100),
      db.select().from(experiencePosts).where(eq(experiencePosts.status, "pending")).orderBy(desc(experiencePosts.createdAt)).limit(100),
    ]);

    return Response.json({ creators, requests, experiences });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "审核数据加载失败" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) return unauthorized();

  try {
    const body = await request.json() as { kind?: SubmissionKind; id?: number; status?: string };
    const id = Number(body.id);
    const status = body.status === "published" || body.status === "rejected" ? body.status : "";

    if (!Number.isInteger(id) || id < 1 || !status || !body.kind) {
      return Response.json({ error: "审核参数无效" }, { status: 400 });
    }

    const table = body.kind === "creator"
      ? creatorProfiles
      : body.kind === "request"
        ? skillRequests
        : body.kind === "experience"
          ? experiencePosts
          : null;

    if (!table) return Response.json({ error: "审核类型无效" }, { status: 400 });

    await getDb().update(table).set({ status }).where(eq(table.id, id));
    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "审核操作失败" }, { status: 500 });
  }
}
