# US-46 — Publish a draft

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Program Library Administration |
| Role | Program Administrator, BCBA |
| Automation | `tests/stories/11-program-library-admin/us-46-publish-draft.spec.ts` |
| Watch for | No confirmation |

**Acceptance:** Confirmation before publish; published version visible to clients.

---

## TC-US46-01 — A draft is not offered to clients; publishing asks for confirmation and makes it available in Add Program

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Admin → New Program → fill → **Save as Draft** | Status Draft |
| 2 | Clean client → Skills Programs → **Add Program** → search the title (System and My Programs) | Not offered |
| 3 | Program Library → **Edit** the draft → **Publish** | Confirmation first (**fails today**: publishes immediately, no confirmation) → Status Active; offered under "System Programs" in Add Program |
| 4 | Clean client → Add Program → search the title | Offered |
| 5 | Clean-up: deactivate the program | — |
