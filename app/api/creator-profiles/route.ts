import { env } from "cloudflare:workers";
import { and, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "../../../db";
import { creatorMedia, creatorProfiles, creatorReviews } from "../../../db/schema";

const clean = (value: unknown, max = 200) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

type PortfolioLink = { label: string; url: string };

function parseStoredLinks(value: string, legacyUrl = ""): PortfolioLink[] {
  const isSafeUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
      return false;
    }
  };
  try {
    const parsed = JSON.parse(value) as PortfolioLink[];
    const links = Array.isArray(parsed) ? parsed.filter((item) => item?.label && item?.url && isSafeUrl(item.url)) : [];
    if (legacyUrl && isSafeUrl(legacyUrl) && !links.some((item) => item.url === legacyUrl)) {
      links.unshift({ label: "个人主页 / 作品集", url: legacyUrl });
    }
    return links.slice(0, 5);
  } catch {
    return legacyUrl && isSafeUrl(legacyUrl) ? [{ label: "个人主页 / 作品集", url: legacyUrl }] : [];
  }
}

function parseSubmittedLinks(value: unknown) {
  const raw = clean(value, 2000);
  if (!raw) return { links: [] as PortfolioLink[] };
  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length > 5) return { error: "站外链接最多填写 5 个" };

  const links: PortfolioLink[] = [];
  for (const line of lines) {
    const separator = line.indexOf("|");
    const label = separator >= 0 ? line.slice(0, separator).trim().slice(0, 40) : "站外作品";
    const url = separator >= 0 ? line.slice(separator + 1).trim() : line;
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error("invalid protocol");
      links.push({ label: label || "站外作品", url: parsed.toString() });
    } catch {
      return { error: `站外链接格式不正确：${line.slice(0, 50)}` };
    }
  }
  return { links };
}

function parseOptionalUrl(value: unknown) {
  const raw = clean(value, 300);
  if (!raw) return { url: "" };
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error("invalid protocol");
    return { url: parsed.toString() };
  } catch {
    return { error: "个人主页链接格式不正确" };
  }
}

export async function GET() {
  try {
    const db = getDb();
    const profiles = await db
      .select({
        id: creatorProfiles.id,
        name: creatorProfiles.name,
        locationScope: creatorProfiles.locationScope,
        province: creatorProfiles.province,
        country: creatorProfiles.country,
        city: creatorProfiles.city,
        university: creatorProfiles.university,
        majorGrade: creatorProfiles.majorGrade,
        skill: creatorProfiles.skill,
        mode: creatorProfiles.mode,
        serviceIntro: creatorProfiles.serviceIntro,
        workUrl: creatorProfiles.workUrl,
        portfolioLinks: creatorProfiles.portfolioLinks,
        schoolVerificationStatus: creatorProfiles.schoolVerificationStatus,
        createdAt: creatorProfiles.createdAt,
      })
      .from(creatorProfiles)
      .where(eq(creatorProfiles.status, "published"))
      .orderBy(desc(creatorProfiles.createdAt))
      .limit(50);

    const media = profiles.length
      ? await db
          .select({
            id: creatorMedia.id,
            creatorProfileId: creatorMedia.creatorProfileId,
            mediaType: creatorMedia.mediaType,
            fileName: creatorMedia.fileName,
          })
          .from(creatorMedia)
          .where(inArray(creatorMedia.creatorProfileId, profiles.map((profile) => profile.id)))
      : [];
    const reviews = profiles.length
      ? await db
          .select({
            id: creatorReviews.id,
            creatorProfileId: creatorReviews.creatorProfileId,
            reviewerName: creatorReviews.reviewerName,
            reviewerUniversity: creatorReviews.reviewerUniversity,
            rating: creatorReviews.rating,
            content: creatorReviews.content,
            createdAt: creatorReviews.createdAt,
          })
          .from(creatorReviews)
          .where(and(
            inArray(creatorReviews.creatorProfileId, profiles.map((profile) => profile.id)),
            eq(creatorReviews.status, "published"),
          ))
          .orderBy(desc(creatorReviews.createdAt))
      : [];

    return Response.json({
      profiles: profiles.map((profile) => ({
        ...profile,
        media: media
          .filter((item) => item.creatorProfileId === profile.id)
          .map((item) => ({
            id: item.id,
            type: item.mediaType,
            fileName: item.fileName,
            url: `/api/creator-media?id=${item.id}`,
          })),
        links: parseStoredLinks(profile.portfolioLinks, profile.workUrl),
        reviews: reviews
          .filter((review) => review.creatorProfileId === profile.id)
          .map(({ creatorProfileId: _creatorProfileId, ...review }) => review),
      })),
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "技能名片加载失败" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const uploadedKeys: string[] = [];
  let profileId: number | null = null;
  try {
    const isMultipart = request.headers.get("content-type")?.includes("multipart/form-data");
    const formData = isMultipart ? await request.formData() : null;
    const body = formData
      ? Object.fromEntries(formData.entries())
      : await request.json() as Record<string, unknown>;
    const files = formData
      ? formData.getAll("media").filter((item): item is File => item instanceof File && item.size > 0)
      : [];

    if (clean(body.website)) return Response.json({ ok: true }, { status: 201 });
    if (body.consent !== "on" && body.consent !== true) {
      return Response.json({ error: "请确认资料使用与平台规则" }, { status: 400 });
    }
    if (body.individualConfirmed !== "on" && body.individualConfirmed !== true) {
      return Response.json({ error: "平台仅接受个人入驻，请确认个人身份" }, { status: 400 });
    }

    const parsedLinks = parseSubmittedLinks(body.portfolioLinks);
    if (parsedLinks.error) {
      return Response.json({ error: parsedLinks.error }, { status: 400 });
    }
    const parsedWorkUrl = parseOptionalUrl(body.workUrl);
    if (parsedWorkUrl.error) {
      return Response.json({ error: parsedWorkUrl.error }, { status: 400 });
    }

    const locationScope = body.locationScope === "overseas" ? "overseas" : "china";
    const values = {
      name: clean(body.name, 40),
      locationScope,
      province: locationScope === "china" ? clean(body.province, 40) : "",
      country: locationScope === "overseas" ? clean(body.country, 80) : "",
      city: clean(body.city, 40),
      university: clean(body.university, 100),
      majorGrade: clean(body.majorGrade, 100),
      skill: clean(body.skill, 80),
      mode: clean(body.mode, 80),
      serviceIntro: clean(body.serviceIntro, 1200),
      workUrl: parsedWorkUrl.url,
      portfolioLinks: JSON.stringify(parsedLinks.links),
      contact: clean(body.contact, 80),
      individualConfirmed: 1,
      schoolVerificationStatus: "unverified",
      status: "pending",
    };

    if (
      !values.name
      || (locationScope === "china" ? !values.province : !values.country)
      || !values.city
      || !values.university
      || !values.majorGrade
      || !values.skill
      || !values.mode
      || !values.serviceIntro
      || !values.contact
    ) {
      return Response.json({ error: "请完整填写必填信息" }, { status: 400 });
    }

    if (files.length > 4) {
      return Response.json({ error: "最多上传 4 个作品文件" }, { status: 400 });
    }

    const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
    const allowedVideoTypes = new Set(["video/mp4", "video/webm"]);
    let totalSize = 0;
    for (const file of files) {
      const isImage = allowedImageTypes.has(file.type);
      const isVideo = allowedVideoTypes.has(file.type);
      if (!isImage && !isVideo) {
        return Response.json({ error: "仅支持 JPG、PNG、WebP 图片和 MP4、WebM 视频" }, { status: 400 });
      }
      if (isImage && file.size > 8 * 1024 * 1024) {
        return Response.json({ error: "单张图片不能超过 8MB" }, { status: 400 });
      }
      if (isVideo && file.size > 80 * 1024 * 1024) {
        return Response.json({ error: "单个视频不能超过 80MB" }, { status: 400 });
      }
      totalSize += file.size;
    }
    if (totalSize > 100 * 1024 * 1024) {
      return Response.json({ error: "全部作品文件合计不能超过 100MB" }, { status: 400 });
    }

    const mediaBucket = (env as unknown as { MEDIA?: R2Bucket }).MEDIA;
    if (files.length && !mediaBucket) {
      return Response.json({ error: "作品存储暂不可用，请稍后再试" }, { status: 503 });
    }

    const preparedMedia = [];
    for (const file of files) {
      const objectKey = `creator-media/${crypto.randomUUID()}`;
      await mediaBucket!.put(objectKey, file.stream(), {
        httpMetadata: { contentType: file.type },
        customMetadata: { originalName: file.name.slice(0, 150) },
      });
      uploadedKeys.push(objectKey);
      preparedMedia.push({
        objectKey,
        fileName: file.name.slice(0, 150),
        contentType: file.type,
        mediaType: file.type.startsWith("video/") ? "video" : "image",
        size: file.size,
      });
    }

    const db = getDb();
    const [profile] = await db
      .insert(creatorProfiles)
      .values(values)
      .returning({ id: creatorProfiles.id });
    profileId = profile.id;

    if (preparedMedia.length) {
      await db.insert(creatorMedia).values(
        preparedMedia.map((item) => ({ ...item, creatorProfileId: profile.id })),
      );
    }

    return Response.json({ profile }, { status: 201 });
  } catch (error) {
    console.error(error);
    const mediaBucket = (env as unknown as { MEDIA?: R2Bucket }).MEDIA;
    if (mediaBucket && uploadedKeys.length) {
      await Promise.all(uploadedKeys.map((key) => mediaBucket.delete(key).catch(() => undefined)));
    }
    if (profileId) {
      await getDb().delete(creatorProfiles).where(eq(creatorProfiles.id, profileId)).catch(() => undefined);
    }
    return Response.json({ error: "提交失败，请稍后再试" }, { status: 500 });
  }
}
