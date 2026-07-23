import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const teacherApplications = sqliteTable("teacher_applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  gender: text("gender").notNull().default(""),
  education: text("education").notNull().default(""),
  teachingExperience: text("teaching_experience").notNull().default(""),
  demoUrl: text("demo_url").notNull().default(""),
  contact: text("contact").notNull().default(""),
  phone: text("phone").notNull(),
  city: text("city").notNull(),
  subject: text("subject").notNull(),
  school: text("school").notNull(),
  degree: text("degree").notNull(),
  teachingMode: text("teaching_mode").notNull(),
  classSize: text("class_size").notNull().default(""),
  rate: text("rate").notNull(),
  introduction: text("introduction").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const parentNeeds = sqliteTable("parent_needs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  gradeSubject: text("grade_subject").notNull(),
  area: text("area").notNull(),
  schedule: text("schedule").notNull(),
  budget: text("budget").notNull(),
  description: text("description").notNull(),
  contact: text("contact").notNull(),
  fastMatch: integer("fast_match").notNull().default(0),
  paymentStatus: text("payment_status").notNull().default("awaiting_payment"),
  status: text("status").notNull().default("draft"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
