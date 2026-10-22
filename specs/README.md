# Specs

Output directory for the Playwright **planner** agent (`.claude/agents/playwright-test-planner.md`).

The reviewed, story-by-story test cases for RHD-57736 live in [`../test-cases`](../test-cases/00-index.md).
When the planner produces a new plan here, copy the agreed scenarios into the matching `test-cases/<area>/US-nn-*.md`
file and let the **generator** agent write the spec under `tests/stories/<area>/` using the page objects in `src/pages`.
The seed test is `tests/stories/seed.spec.ts` (signs in as BCBA and opens the seeded client).
