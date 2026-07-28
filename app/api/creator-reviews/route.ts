import { and, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { creatorProfiles, creatorReviews } from "../../../db/schema";

const clean = (value: unknown, max = 200) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    if (clean(body.website)) return Response.json({ ok: true }, { status: 201 });
    if (body.consent !== true && body.consent !== "on") {
      return Response.json({ error: "请确认评价规则" }, { status: 400 });
    }

    const creatorProfileId = Number(body.creatorProfileId);
    const rating = Number(body.rating);
    const values = {
      creatorProfileId,
      reviewerName: clean(body.reviewerName, 40),
      reviewerUniversity: clean(body.reviewerUniversity, 100),
      rating,
      content: clean(body.content, 500),
      contact: clean(body.contact, 80),
      status: "pending",
    };

    if (!Number.isInteger(creatorProfileId) || creatorProfileId < 1) {
      return Response.json({ error: "评价对象无效" }, { status: 400 });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return Response.json({ error: "请选择 1–5 星评分" }, { status: 400 });
    }
    if (!values.reviewerName || !values.content || !values.contact) {
      return Response.json({ error: "请完整填写评价内容和联系方式" }, { status: 400 });
    }

    const db = getDb();
    const [profile] = await db
      .select({ id: creatorProfiles.id })
      .from(creatorProfiles)
      .where(and(eq(creatorProfiles.id, creatorProfileId), eq(creatorProfiles.status, "published")))
      .limit(1);
    if (!profile) return Response.json({ error: "该技能主页暂不接受评价" }, { status: 404 });

    const [review] = await db
      .insert(creatorReviews)
      .values(values)
      .returning({ id: creatorReviews.id });

    return Response.json({ review }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "评价提交失败，请稍后再试" }, { status: 500 });
  }
}
