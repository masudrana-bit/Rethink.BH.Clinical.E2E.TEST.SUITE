# US-26 — Enter the app from a BH tile already authenticated

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Platform Enablement |
| Role | BCBA (RBT via view toggle) |
| Automation | `tests/stories/07-platform/us-26-bh-tile-entry.spec.ts` (TC-01 to TC-03); TC-04 and TC-05 are **manual — not automatable on dev2** |
| Watch for | Not available on dev2 (NGC-66); ~30-minute session expiry seen on 25 Sep |

**Acceptance:** Launch from the BH dashboard with no second sign-in; correct role; no forced sign-out within a 90-minute session with idle gaps.

**Observed on dev2 (Oct 19):**
- Opening any Clinical URL while signed out lands on "Sign in to continue — Open Clinical from your Rethink dashboard and your session will start automatically". The only option on dev2 is **Preview sign-in** (username/password). There is no BH dashboard tile hand-off on dev2, so the tile launch itself (NGC-66) cannot be exercised here.
- Once signed in, the header has a **Rethink BH** switch (`legacy-bh-switch`) that opens the BH dashboard (`https://rta-bh-dev-analytics-web.azurewebsites.net/Healthcare#/Main`) in a new tab.
- The signed-in session is kept in the browser: reloading or opening Clinical in a second tab does not ask to sign in again.
- **Defect — role label:** the user menu shows the role as "Role 4 a" instead of a role name (e.g. BCBA).
- Right after sign-in the caseload request sometimes returns 401 ("Your caseload could not be loaded"); **Try again** recovers.

---

## TC-US26-01 — Signed-out deep link asks for the BH hand-off; after sign-in the session is reused without a second sign-in

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Signed out, open `/clients/{seeded}/analyze-data` directly | Redirected to **Sign in to continue** with "Open Clinical from your Rethink dashboard…" |
| 2 | Sign in (Preview sign-in on dev2; BH tile on dev3+) | Header shows the user's name and role |
| 3 | Open the client and go to Analyze Data | Page loads |
| 4 | Reload the page | Still signed in, same page, no sign-in screen |
| 5 | Open Clinical in a second tab of the same browser on `/clients` | Clients list loads without signing in |
| 6 | Close the second tab | First tab still signed in |

## TC-US26-02 — The user lands with the correct role; the RBT view lands on RBT Home

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA | Lands on the clinical shell (not `/rbt`); user menu shows the role by name (**fails today**: "Role 4 a") |
| 2 | Switch to the RBT view (or sign in with the RBT account) and reload | Lands on RBT Home `/rbt`; BCBA navigation (Clients, Settings) is not offered |
| 3 | Switch back to the BCBA view | Clinical shell again |

## TC-US26-03 — Header link back to Rethink BH and session survives an idle gap

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Signed in, check the **Rethink BH** header switch | Points to the BH dashboard and opens in a new tab |
| 2 | Leave the app idle for `SESSION_IDLE_MINUTES` (default 2 in automation; 20 in the manual run) | — |
| 3 | Click Clients / open the seeded client | Works without being sent to the sign-in screen; no "session expired" message |

## TC-US26-04 — Launch from the BH dashboard tile (manual — not available on dev2, NGC-66)

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in to Rethink BH (legacy) with the BCBA account | BH dashboard |
| 2 | Click the **NextGen Clinical** tile | Clinical opens already signed in — no second sign-in screen |
| 3 | Check the user menu | Correct user and BCBA role |
| 4 | Repeat with the RBT account | Lands on RBT Home |
| 5 | Repeat with the Program Administrator account | Settings is available |

## TC-US26-05 — No forced sign-out over a 90-minute session with idle gaps (manual) @edge

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Launch from the BH tile, open the seeded client | — |
| 2 | Work for 10 minutes, then leave idle 20 minutes; repeat until 90 minutes have passed | — |
| 3 | After each idle gap, switch tab back to Clinical and open a program | Token refreshes on tab focus; never redirected to sign-in; if it happens, note the time and the sign-out reason |
