import { env } from "cloudflare:workers";
import { desc, eq, inArray } from "drizzle-orm";
import { getDb } from "../../../../db";
import { creatorMedia, creatorProfiles, experiencePosts, skillRequests } from "../../../../db/schema";

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

function parsePortfolioLinks(value: string, legacyUrl = "") {
  const result: Array<{ label: string; url: string }> = [];
  const isSafeUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
      return false;
    }
  };
  try {
    const parsed = JSON.parse(value) as Array<{ label?: string; url?: string }>;
    if (Array.isArray(parsed)) {
      for (const item of parsed) {
        if (item.label && item.url && isSafeUrl(item.url)) result.push({ label: item.label, url: item.url });
      }
    }
  } catch {
    // Older records may not contain the JSON field yet.
  }
  if (legacyUrl && isSafeUrl(legacyUrl) && !result.some((item) => item.url === legacyUrl)) {
    result.unshift({ label: "个人主页 / 作品集", url: legacyUrl });
  }
  return result.slice(0, 5);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) return unauthorized();

  try {
    const db = getDb();
    const [creatorRows, requests, experiences] = await Promise.all([
      db.select().from(creatorProfiles).where(eq(creatorProfiles.status, "pending")).orderBy(desc(creatorProfiles.createdAt)).limit(100),
      db.select().from(skillRequests).where(eq(skillRequests.status, "pending")).orderBy(desc(skillRequests.createdAt)).limit(100),
      db.select().from(experiencePosts).where(eq(experiencePosts.status, "pending")).orderBy(desc(experiencePosts.createdAt)).limit(100),
    ]);

    const media = creatorRows.length
      ? await db
          .select({
            id: creatorMedia.id,
            creatorProfileId: creatorMedia.creatorProfileId,
            fileName: creatorMedia.fileName,
            mediaType: creatorMedia.mediaType,
            size: creatorMedia.size,
          })
          .from(creatorMedia)
          .where(inArray(creatorMedia.creatorProfileId, creatorRows.map((creator) => creator.id)))
      : [];
    const creators = creatorRows.map((creator) => ({
      ...creator,
      media: media.filter((item) => item.creatorProfileId === creator.id),
      links: parsePortfolioLinks(creator.portfolioLinks, creator.workUrl),
    }));

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

    const db = getDb();
    await db.update(table).set({ status }).where(eq(table.id, id));

    if (body.kind === "creator" && status === "rejected") {
      const media = await db
        .select({ id: creatorMedia.id, objectKey: creatorMedia.objectKey })
        .from(creatorMedia)
        .where(eq(creatorMedia.creatorProfileId, id));
      const bucket = (env as unknown as { MEDIA?: R2Bucket }).MEDIA;
      if (bucket && media.length) {
        await Promise.all(media.map((item) => bucket.delete(item.objectKey).catch(() => undefined)));
      }
      await db.delete(creatorMedia).where(eq(creatorMedia.creatorProfileId, id));
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "审核操作失败" }, { status: 500 });
  }
}
