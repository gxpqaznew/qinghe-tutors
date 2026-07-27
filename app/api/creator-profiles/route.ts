import { getDb } from "../../../db";
import { creatorProfiles } from "../../../db/schema";

const clean = (value: unknown, max = 200) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    if (clean(body.website)) return Response.json({ ok: true }, { status: 201 });
    if (body.consent !== "on" && body.consent !== true) {
      return Response.json({ error: "请确认资料使用与平台规则" }, { status: 400 });
    }

    const values = {
      name: clean(body.name, 40),
      city: clean(body.city, 40),
      university: clean(body.university, 100),
      majorGrade: clean(body.majorGrade, 100),
      skill: clean(body.skill, 80),
      mode: clean(body.mode, 80),
      serviceIntro: clean(body.serviceIntro, 1200),
      workUrl: clean(body.workUrl, 300),
      contact: clean(body.contact, 80),
      status: "pending",
    };

    if (!values.name || !values.city || !values.university || !values.majorGrade || !values.skill || !values.mode || !values.serviceIntro || !values.contact) {
      return Response.json({ error: "请完整填写必填信息" }, { status: 400 });
    }

    const [profile] = await getDb()
      .insert(creatorProfiles)
      .values(values)
      .returning({ id: creatorProfiles.id });

    return Response.json({ profile }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "提交失败，请稍后再试" }, { status: 500 });
  }
}
