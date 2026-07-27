import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { skillRequests } from "../../../db/schema";

const clean = (value: unknown, max = 200) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function GET() {
  try {
    const requests = await getDb()
      .select({
        id: skillRequests.id,
        title: skillRequests.title,
        university: skillRequests.university,
        category: skillRequests.category,
        mode: skillRequests.mode,
        budget: skillRequests.budget,
        deadline: skillRequests.deadline,
        description: skillRequests.description,
        createdAt: skillRequests.createdAt,
      })
      .from(skillRequests)
      .where(eq(skillRequests.status, "published"))
      .orderBy(desc(skillRequests.createdAt))
      .limit(50);

    return Response.json({ requests });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "需求加载失败" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    if (clean(body.website)) return Response.json({ ok: true }, { status: 201 });
    if (body.consent !== "on" && body.consent !== true) {
      return Response.json({ error: "请确认资料使用与平台规则" }, { status: 400 });
    }
    if (body.individualConfirmed !== "on" && body.individualConfirmed !== true) {
      return Response.json({ error: "平台仅接受个人需求，请确认个人身份" }, { status: 400 });
    }

    const values = {
      title: clean(body.title, 100),
      university: clean(body.university, 100),
      category: clean(body.category, 40),
      mode: clean(body.mode, 80),
      budget: clean(body.budget, 60),
      deadline: clean(body.deadline, 80),
      description: clean(body.description, 1000),
      contact: clean(body.contact, 80),
      individualConfirmed: 1,
      status: "pending",
    };

    if (!values.title || !values.university || !values.category || !values.mode || !values.budget || !values.deadline || !values.description || !values.contact) {
      return Response.json({ error: "请完整填写必填信息" }, { status: 400 });
    }

    const [skillRequest] = await getDb()
      .insert(skillRequests)
      .values(values)
      .returning({ id: skillRequests.id });

    return Response.json({ request: skillRequest }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "提交失败，请稍后再试" }, { status: 500 });
  }
}
