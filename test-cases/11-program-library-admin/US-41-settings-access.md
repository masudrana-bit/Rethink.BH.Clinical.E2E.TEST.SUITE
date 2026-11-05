# US-41 — Reach the clinical settings area

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Program Library Administration |
| Role | Program Administrator (simulated with the BCBA login until an admin account is provided); RBT |
| Automation | `tests/stories/11-program-library-admin/us-41-settings-access.spec.ts` |
| Watch for | Test locations in list |

**Acceptance:** Settings available to the admin role only; Locations list.

**Observed on dev2 (Oct 19):**
- **Settings** in the main navigation opens `/settings/clinical/program-library`. Clinical sections: Program Library, Data Collection Types, Locations, Custom Domains, ABC Settings.
- No dedicated Program Administrator login is configured (`ADMIN_USERNAME` blank), so the BCBA login is used — the "admin only" part needs the real admin and a non-admin BCBA login.

---

## TC-US41-01 — Admin opens Settings from the navigation; every clinical section and the Locations list load

**Xray:** [RHD-60122](https://rethinkautism.atlassian.net/browse/RHD-60122)

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as Program Administrator → **Settings** | Program Library section |
| 2 | Open each section | Program Library, Data Collection Types, Locations, Custom Domains, ABC Settings all load |
| 3 | **Locations** | Organization locations listed; no test/QA locations |

## TC-US41-02 — Settings is not offered in the RBT view @negative

**Xray:** [RHD-60360](https://rethinkautism.atlassian.net/browse/RHD-60360), [RHD-60380](https://rethinkautism.atlassian.net/browse/RHD-60380)

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as RBT | RBT Home; no Settings in the navigation |
| 2 | Type `/settings/clinical/program-library` in the address bar | Settings does not open (redirect or access denied) (**fails today**: in the RBT view the direct URL opens Settings — tested with the view toggle, confirm with a real RBT login) |
| 3 | Manual (needs a non-admin BCBA login): sign in as a BCBA without admin rights | Settings hidden |

## TC-US41-03 — Admin reopens Settings from a copied URL after signing out, and stays there on refresh

**Xray:** [RHD-60380](https://rethinkautism.atlassian.net/browse/RHD-60380)

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as Program Admin → Settings → **Locations** → copy the URL | Settings opens |
| 2 | Sign out | Sign-in screen |
| 3 | Open the copied URL → sign in | Back on the copied Settings page (dev3 Nov 5: yes) |
| 4 | Refresh the browser | Still on the same Settings page, not sent home |
