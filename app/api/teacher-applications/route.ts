import { getDb } from "../../../db";
import { teacherApplications } from "../../../db/schema";

const clean = (value: unknown, max = 200) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    if (clean(body.website)) return Response.json({ ok: true }, { status: 201 });
    const values = {
      name: clean(body.name, 40), phone: clean(body.phone, 30), city: clean(body.city, 60),
      subject: clean(body.subject, 80), school: clean(body.school, 100), degree: clean(body.degree, 60),
      teachingMode: clean(body.teachingMode, 30), classSize: clean(body.classSize, 30),
      rate: clean(body.rate, 40), introduction: clean(body.introduction, 800),
    };
    if (Object.entries(values).some(([key, value]) => key !== "classSize" && !value)) {
      return Response.json({ error: "请完整填写必填信息" }, { status: 400 });
    }
    if (!/^1\d{10}$/.test(values.phone)) return Response.json({ error: "请输入正确的中国大陆手机号" }, { status: 400 });
    const [application] = await getDb().insert(teacherApplications).values(values).returning({ id: teacherApplications.id });
    return Response.json({ application }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "提交失败，请稍后再试" }, { status: 500 });
  }
}
