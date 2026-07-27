import { getDb } from "../../../db";
import { experiencePosts } from "../../../db/schema";

const clean = (value: unknown, max = 200) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    if (clean(body.website)) return Response.json({ ok: true }, { status: 201 });
    if (body.consent !== "on" && body.consent !== true) {
      return Response.json({ error: "请确认原创与公开展示授权" }, { status: 400 });
    }

    const values = {
      authorName: clean(body.authorName, 40),
      university: clean(body.university, 100),
      title: clean(body.title, 120),
      category: clean(body.category, 40),
      sourceUrl: clean(body.sourceUrl, 300),
      summary: clean(body.summary, 300),
      content: clean(body.content, 3000),
      status: "pending",
    };

    if (!values.authorName || !values.university || !values.title || !values.category || !values.summary || !values.content) {
      return Response.json({ error: "请完整填写必填信息" }, { status: 400 });
    }

    const [post] = await getDb()
      .insert(experiencePosts)
      .values(values)
      .returning({ id: experiencePosts.id });

    return Response.json({ post }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "提交失败，请稍后再试" }, { status: 500 });
  }
}
