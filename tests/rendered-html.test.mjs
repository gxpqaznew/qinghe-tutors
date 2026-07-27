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

  assert.match(marketplace, /拒绝代写与作弊/);
  assert.match(marketplace, /不得代写课程作业、实验报告或论文/);
});
