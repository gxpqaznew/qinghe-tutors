import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("includes both role entry points and the teacher onboarding fields", async () => {
  const marketplace = await readFile(new URL("app/marketplace.tsx", root), "utf8");

  assert.match(marketplace, /我是家长/);
  assert.match(marketplace, /我是老师/);
  assert.match(marketplace, /求贤广场/);
  assert.match(marketplace, /name="name"/);
  assert.match(marketplace, /name="gender"/);
  assert.match(marketplace, /name="education"/);
  assert.match(marketplace, /name="teachingExperience"/);
  assert.match(marketplace, /name="demoUrl"/);
  assert.match(marketplace, /name="contact"/);
});

test("keeps publishing free and makes fast matching optional", async () => {
  const [marketplace, parentApi] = await Promise.all([
    readFile(new URL("app/marketplace.tsx", root), "utf8"),
    readFile(new URL("app/api/parent-needs/route.ts", root), "utf8"),
  ]);

  assert.match(marketplace, /默认免费发布/);
  assert.match(marketplace, /name="fastMatch"/);
  assert.match(marketplace, /¥18 极速筛选/);
  assert.match(parentApi, /paymentStatus: fastMatch \? "awaiting_payment" : "free"/);
});

test("never returns parent contact details from the plaza endpoint", async () => {
  const parentApi = await readFile(new URL("app/api/parent-needs/route.ts", root), "utf8");
  const getHandler = parentApi.slice(parentApi.indexOf("export async function GET"), parentApi.indexOf("export async function POST"));

  assert.ok(getHandler.length > 0);
  assert.doesNotMatch(getHandler, /contact:\s*parentNeeds\.contact/);
});
