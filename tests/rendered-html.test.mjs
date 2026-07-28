import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("uses the university skill-exchange positioning and both role entry points", async () => {
  const marketplace = await readFile(new URL("app/marketplace.tsx", root), "utf8");

  assert.match(marketplace, /大学生技能交换所/);
  assert.match(marketplace, /我想学 \/ 我需要/);
  assert.match(marketplace, /我会这个/);
  assert.match(marketplace, /技能名片/);
  assert.match(marketplace, /学习心得/);
  assert.match(marketplace, /高数与线代梳理/);
  assert.match(marketplace, /大学课程/);
});

test("supports creator, request, and experience submissions", async () => {
  const marketplace = await readFile(new URL("app/marketplace.tsx", root), "utf8");

  assert.match(marketplace, /\/api\/creator-profiles/);
  assert.match(marketplace, /\/api\/skill-requests/);
  assert.match(marketplace, /\/api\/experience-posts/);
  assert.match(marketplace, /name="university"/);
  assert.match(marketplace, /name="skill"/);
  assert.match(marketplace, /name="consent"/);
});

test("never returns request contact details from the public endpoint", async () => {
  const api = await readFile(new URL("app/api/skill-requests/route.ts", root), "utf8");
  const getHandler = api.slice(api.indexOf("export async function GET"), api.indexOf("export async function POST"));

  assert.ok(getHandler.length > 0);
  assert.doesNotMatch(getHandler, /contact:\s*skillRequests\.contact/);
});

test("states the academic integrity boundary", async () => {
  const marketplace = await readFile(new URL("app/marketplace.tsx", root), "utf8");

  assert.match(marketplace, /不得代写课程作业、实验报告或论文/);
});

test("enforces individual-to-individual participation and rejects intermediaries", async () => {
  const [marketplace, creatorApi, requestApi] = await Promise.all([
    readFile(new URL("app/marketplace.tsx", root), "utf8"),
    readFile(new URL("app/api/creator-profiles/route.ts", root), "utf8"),
    readFile(new URL("app/api/skill-requests/route.ts", root), "utf8"),
  ]);

  assert.match(marketplace, /个人对个人/);
  assert.match(marketplace, /严禁中介/);
  assert.match(marketplace, /name="individualConfirmed"/);
  assert.match(creatorApi, /平台仅接受个人入驻/);
  assert.match(requestApi, /平台仅接受个人需求/);
});

test("supports same-school discovery without presenting self-reported schools as verified", async () => {
  const [marketplace, requestApi, schema] = await Promise.all([
    readFile(new URL("app/marketplace.tsx", root), "utf8"),
    readFile(new URL("app/api/skill-requests/route.ts", root), "utf8"),
    readFile(new URL("db/schema.ts", root), "utf8"),
  ]);

  assert.match(marketplace, /我的学校/);
  assert.match(marketplace, /只看同校/);
  assert.match(marketplace, /不等于学生身份已认证/);
  assert.match(marketplace, /同校 · 待认证/);
  assert.match(requestApi, /university:\s*skillRequests\.university/);
  assert.match(schema, /schoolVerificationStatus/);
  assert.match(schema, /default\("unverified"\)/);
});

test("publishes approved submissions while keeping contacts out of public endpoints", async () => {
  const [marketplace, creatorApi, requestApi, experienceApi, adminApi] = await Promise.all([
    readFile(new URL("app/marketplace.tsx", root), "utf8"),
    readFile(new URL("app/api/creator-profiles/route.ts", root), "utf8"),
    readFile(new URL("app/api/skill-requests/route.ts", root), "utf8"),
    readFile(new URL("app/api/experience-posts/route.ts", root), "utf8"),
    readFile(new URL("app/api/admin/submissions/route.ts", root), "utf8"),
  ]);

  assert.match(marketplace, /fetch\("\/api\/creator-profiles"\)/);
  assert.match(marketplace, /fetch\("\/api\/experience-posts"\)/);
  assert.match(creatorApi, /creatorProfiles\.status,\s*"published"/);
  assert.match(experienceApi, /experiencePosts\.status,\s*"published"/);
  assert.doesNotMatch(creatorApi.slice(creatorApi.indexOf("export async function GET"), creatorApi.indexOf("export async function POST")), /contact:\s*creatorProfiles\.contact/);
  assert.doesNotMatch(requestApi.slice(requestApi.indexOf("export async function GET"), requestApi.indexOf("export async function POST")), /contact:\s*skillRequests\.contact/);
  assert.match(adminApi, /x-admin-key/);
  assert.match(adminApi, /"published"/);
  assert.match(adminApi, /"rejected"/);
});

test("supports moderated image and video portfolios backed by private object storage", async () => {
  const [marketplace, creatorApi, mediaApi, adminMediaApi, schema, hosting] = await Promise.all([
    readFile(new URL("app/marketplace.tsx", root), "utf8"),
    readFile(new URL("app/api/creator-profiles/route.ts", root), "utf8"),
    readFile(new URL("app/api/creator-media/route.ts", root), "utf8"),
    readFile(new URL("app/api/admin/media/route.ts", root), "utf8"),
    readFile(new URL("db/schema.ts", root), "utf8"),
    readFile(new URL(".openai/hosting.json", root), "utf8"),
  ]);

  assert.match(marketplace, /name="media"/);
  assert.match(marketplace, /image\/jpeg,image\/png,image\/webp,video\/mp4,video\/webm/);
  assert.match(marketplace, /个人作品展示/);
  assert.match(marketplace, /<b>个人作品<\/b>/);
  assert.match(marketplace, /暂未上传图片或视频/);
  assert.match(creatorApi, /最多上传 4 个作品文件/);
  assert.match(creatorApi, /MEDIA\?:\s*R2Bucket/);
  assert.match(mediaApi, /creatorProfiles\.status,\s*"published"/);
  assert.match(adminMediaApi, /x-admin-key/);
  assert.match(schema, /creatorMedia/);
  assert.match(hosting, /"r2":\s*"MEDIA"/);
});
