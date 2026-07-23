import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { parentNeeds } from "../../../db/schema";

const clean = (value: unknown, max = 200) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function GET() {
  try {
    const needs = await getDb()
      .select({
        id: parentNeeds.id,
        gradeSubject: parentNeeds.gradeSubject,
        area: parentNeeds.area,
        schedule: parentNeeds.schedule,
        budget: parentNeeds.budget,
        description: parentNeeds.description,
        createdAt: parentNeeds.createdAt,
      })
      .from(parentNeeds)
      .where(eq(parentNeeds.status, "pending"))
      .orderBy(desc(parentNeeds.createdAt))
      .limit(50);

    return Response.json({ needs });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "需求加载失败" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    if (clean(body.website)) return Response.json({ ok: true }, { status: 201 });

    const fastMatch = body.fastMatch === "on" || body.fastMatch === true;
    const values = {
      gradeSubject: clean(body.gradeSubject, 80),
      area: clean(body.area, 100),
      schedule: clean(body.schedule, 100),
      budget: clean(body.budget, 50),
      description: clean(body.description, 800),
      contact: clean(body.contact, 60),
      fastMatch: fastMatch ? 1 : 0,
      paymentStatus: fastMatch ? "awaiting_payment" : "free",
      status: "pending",
    };

    if (!values.gradeSubject || !values.area || !values.schedule || !values.budget || !values.description || !values.contact) {
      return Response.json({ error: "请完整填写必填信息" }, { status: 400 });
    }

    const [need] = await getDb()
      .insert(parentNeeds)
      .values(values)
      .returning({ id: parentNeeds.id });

    return Response.json({ need }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "提交失败，请稍后再试" }, { status: 500 });
  }
}
