import test from "node:test";
import assert from "node:assert/strict";
import { buildItemQueue, freshItem, itemCounts, RATING, review } from "./engine.js";

function entry(id, schedule) {
  return { id, schedule };
}

test("case examples use the same daily introduction limit as noun cards", () => {
  const now = Date.now();
  const entries = Array.from({ length: 20 }, (_, index) => entry(`case-${index}`, freshItem(now)));
  assert.equal(buildItemQueue(entries, { newPerDay: 15, now }).length, 15);
  assert.deepEqual(itemCounts(entries), { due: 0, fresh: 20, learned: 0, total: 20 });
});

test("each case example receives its own FSRS schedule", () => {
  const now = Date.now();
  const first = entry("nominative", freshItem(now));
  const second = entry("dative", freshItem(now));
  const reviewed = { ...first, schedule: review(first.schedule, RATING.EASY, now).item };

  assert.notDeepEqual(reviewed.schedule, second.schedule);
  assert.equal(buildItemQueue([reviewed, second], { newPerDay: 15, now }).map((item) => item.id).includes("dative"), true);
});
