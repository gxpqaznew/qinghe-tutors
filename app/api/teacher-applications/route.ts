import { getDb } from "../../../db";
import { teacherApplications } from "../../../db/schema";

const clean = (value: unknown, max = 200) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    if (clean(body.website)) return Response.json({ ok: true }, { status: 201 });

    const name = clean(body.name, 40);
    const gender = clean(body.gender, 10);
    const education = clean(body.education, 100);
    const teachingExperience = clean(body.teachingExperience, 1200);
    const demoUrl = clean(body.demoUrl, 300);
    const contact = clean(body.contact, 60);

    if (!name || !gender || !education || !teachingExperience || !contact) {
      return Response.json({ error: "请完整填写必填信息" }, { status: 400 });
    }

    const values = {
      name,
      gender,
      education,
      teachingExperience,
      demoUrl,
      contact,
      phone: contact,
      city: "",
      subject: "",
      school: "",
      degree: education,
      teachingMode: "",
      classSize: "",
      rate: "",
      introduction: teachingExperience,
    };

    const [application] = await getDb()
      .insert(teacherApplications)
      .values(values)
      .returning({ id: teacherApplications.id });

    return Response.json({ application }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "提交失败，请稍后再试" }, { status: 500 });
  }
}
