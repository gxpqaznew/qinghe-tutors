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

export const creatorProfiles = sqliteTable("creator_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  locationScope: text("location_scope").notNull().default("china"),
  province: text("province").notNull().default(""),
  country: text("country").notNull().default(""),
  city: text("city").notNull(),
  university: text("university").notNull(),
  majorGrade: text("major_grade").notNull(),
  skill: text("skill").notNull(),
  mode: text("mode").notNull(),
  serviceIntro: text("service_intro").notNull(),
  workUrl: text("work_url").notNull().default(""),
  portfolioLinks: text("portfolio_links").notNull().default("[]"),
  contact: text("contact").notNull(),
  individualConfirmed: integer("individual_confirmed").notNull().default(0),
  schoolVerificationStatus: text("school_verification_status").notNull().default("unverified"),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const creatorMedia = sqliteTable("creator_media", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  creatorProfileId: integer("creator_profile_id").notNull(),
  objectKey: text("object_key").notNull(),
  fileName: text("file_name").notNull(),
  contentType: text("content_type").notNull(),
  mediaType: text("media_type").notNull(),
  size: integer("size").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const creatorReviews = sqliteTable("creator_reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  creatorProfileId: integer("creator_profile_id").notNull(),
  reviewerName: text("reviewer_name").notNull(),
  reviewerUniversity: text("reviewer_university").notNull().default(""),
  rating: integer("rating").notNull(),
  content: text("content").notNull(),
  contact: text("contact").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const skillRequests = sqliteTable("skill_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  university: text("university").notNull().default(""),
  category: text("category").notNull(),
  mode: text("mode").notNull(),
  budget: text("budget").notNull(),
  deadline: text("deadline").notNull(),
  description: text("description").notNull(),
  contact: text("contact").notNull(),
  individualConfirmed: integer("individual_confirmed").notNull().default(0),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const experiencePosts = sqliteTable("experience_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  authorName: text("author_name").notNull(),
  university: text("university").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  sourceUrl: text("source_url").notNull().default(""),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  individualConfirmed: integer("individual_confirmed").notNull().default(0),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
