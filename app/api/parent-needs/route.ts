import { getDb } from "../../../db";
import { parentNeeds } from "../../../db/schema";

const clean = (value: unknown, max = 200) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    if (clean(body.website)) return Response.json({ ok: true }, { status: 201 });
    const values = {
      gradeSubject: clean(body.gradeSubject, 80), area: clean(body.area, 100), schedule: clean(body.schedule, 100),
      budget: clean(body.budget, 50), description: clean(body.description, 800), contact: clean(body.contact, 60),
    };
    if (Object.values(values).some(value => !value)) return Response.json({ error: "请完整填写必填信息" }, { status: 400 });
    const [need] = await getDb().insert(parentNeeds).values(values).returning({ id: parentNeeds.id });
    return Response.json({ need }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "提交失败，请稍后再试" }, { status: 500 });
  }
}
