# US-1 — Select / switch active client context

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — section 2, Plan Setup & Library Context |
| Role | BCBA / clinical lead |
| Automation | `tests/stories/01-plan-setup-library/us-01-select-switch-client.spec.ts` |
| Watch for | Client Info / File Cabinet open legacy BH in a new tab (expected). Switching client inside Settings should stay in Settings (NGC-48). |

**Acceptance (what to verify):** Clients page lists name, DOB, ID, status; search by name/ID; switcher reloads every tab; header shows client DOB.

---

## TC-US01-01 — Find a client on the Clients page and open their workspace @smoke

**Preconditions:** BCBA account; seeded client exists (`SEEDED_CLIENT_ID`).TC-01: Templates page lists the built-in Phase 1 template as Default
Preconditions:

User is logged in as a Clinical Admin.
The account has not set any custom default Funder Report template.
Steps:

Go to Settings > Templates.
Filter or look at the Funder Report templates.
Find "NextGen Funder Report - ABA Treatment Plan".
Expected Result:

The template is listed with status Published and version v1.
A "Default" chip is shown on the row.
It is marked as built-in.
TC-02: Built-in template opens read-only with the Phase 1 sections in order
Preconditions:

User is logged in as a Clinical Admin.
Steps:

Go to Settings > Templates.
Open the row menu of "NextGen Funder Report - ABA Treatment Plan".
Click View.
Expected Result:

The row menu offers View and Duplicate. It does not offer Edit or Delete.
The builder opens in read-only mode, with no editable inputs and no Save or Publish actions.
Three sections are shown in this order: Client & Family Information, Goals, Signatures.
TC-03: Built-in template cannot be modified through the API (negative)
Preconditions:

You have a Clinical Admin auth token.
You have the built-in template's ID.
Steps:

Send an update (PUT/PATCH) request to the built-in template.
Send a Publish request to the built-in template.
Send a Delete request to the built-in template.
Expected Result:

Every request returns HTTP 409 Conflict.
The template is unchanged: same name, sections and version, still Published, still present.
TC-04: Duplicate the built-in template to get an editable copy
Preconditions:

User is logged in as a Clinical Admin.
Steps:

Go to Settings > Templates.
Open the row menu of the built-in template and click Duplicate.
Open the new copy.
Expected Result:

A new template is created (the API returns 201).
The copy has a distinguishable name (for example "Copy of …"), status Draft, and no Default chip.
The copy has the same three sections in the same order.
The copy can be edited.
The original built-in template is unchanged.
TC-05: Create a new Funder Report template from scratch
Preconditions:

User is logged in as a Clinical Admin.
Steps:

Go to Settings > Templates and click Create.
Select type Funder Report.
Enter a template name.
Add sections such as "Background" and "Assessment Results".
Add fields to each section (for example text and date fields) with custom labels and wording.
Add a graph placeholder to one section.
Click Save.
Expected Result:

The template saves successfully with status Draft.
It appears in the Templates list.
After reopening, all sections, fields, wording and the graph placeholder are kept.
TC-06: Reorder sections and fields
Preconditions:

A draft Funder Report template exists with at least 3 sections, and one section has at least 2 fields.
Steps:

Open the draft template.
Move the 3rd section to the 1st position.
Reorder the fields inside one section.
Save, then reload the page.
Expected Result:

The new order of sections and fields is kept after the reload.
The preview, if available, shows the new order.
TC-07: Publish a draft template
Preconditions:

A saved draft Funder Report template exists.
Steps:

Open the draft template.
Click Publish and confirm.
Expected Result:

The publish succeeds (200).
The status changes to Published with version v1.
The list row shows Published / v1.
TC-08: Editing a published template creates a new version
Preconditions:

A published custom template exists at v1.
Steps:

Open the published template.
Change a field label and add a new section.
Save, then publish.
Expected Result:

A new version (v2) is created.
v1 is kept and is not overwritten. If version history is shown, v1 still has its original content.
The list shows the latest version, v2.
TC-09: Validation when saving a template without required data (negative)
Preconditions:

User is logged in as a Clinical Admin.
Steps:

Click Create and select Funder Report.
Leave the name empty and click Save.
Enter a name, add a section with an empty title, and click Save.
Try to publish a template that has no sections.
Expected Result:

Each case shows a clear validation message.
Nothing is saved or published while the data is invalid.
TC-10: Set a published custom template as Default
Preconditions:

A published custom Funder Report template exists.
The built-in template is currently the Default.
Steps:

In Settings > Templates, open the row menu of the custom template.
Click Set as Default.
Expected Result:

The request succeeds (200).
The Default chip moves to the custom template.
The built-in template no longer shows the Default chip.
TC-11: Default setting persists after reload and in a new session
Preconditions:

TC-10 is completed.
Steps:

Refresh the Templates page.
Log out, then log in again in a new or incognito browser.
Go to Settings > Templates.
Expected Result:

The custom template still shows the Default chip.
TC-12: Only one Default per template type per account
Preconditions:

Two published custom Funder Report templates exist (A and B).
A is the Default.
Steps:

Set B as Default.
Check the list.
Expected Result:

Only B shows the Default chip, and A loses it.
If a Session Notes default exists, it is not affected.
TC-13: "Set as Default" is not available for draft templates (edge case)
Preconditions:

A draft (unpublished) Funder Report template exists.
Steps:

Open the row menu of the draft template.
Optionally, call the Set as Default API for the draft template directly.
Expected Result:

The Set as Default option is hidden or disabled in the menu.
The API rejects the request with an error status, and the Default does not change.
TC-14: Deleting the current default falls back to the built-in template
Preconditions:

A custom Funder Report template is the Default.
Steps:

Open the row menu of the default custom template and click Delete.
Confirm the deletion.
Check the list.
Expected Result:

The custom template is removed.
The built-in "NextGen Funder Report - ABA Treatment Plan" shows the Default chip again.
TC-15: Default template is isolated per account
Preconditions:

Account A and Account B both exist, each with a Clinical Admin user.
Steps:

In Account A, set a custom template as Default.
Log in to Account B and go to Settings > Templates.
Expected Result:

Account B still shows its own default (the built-in one, if it never changed it).
Account A's custom template is not visible in Account B.
TC-16: Built-in template is visible in every account
Preconditions:

At least two accounts exist, including a newly created account.
Steps:

Log in to each account and go to Settings > Templates.
Expected Result:

The built-in template is listed as Published v1 in every account.
It is the Default in every account that has not chosen another default.
TC-17: Non-admin users cannot manage templates (negative)
Preconditions:

User is logged in as a Clinician without admin permissions.
Steps:

Try to open Settings > Templates.
Call the create, publish and set-default APIs with the clinician's token.
Expected Result:

The Templates management page is not reachable, or create, edit, publish and set-default actions are hidden.
The API calls return 403.
TC-18: Duplicate, publish and set the copy as Default (end to end)
Preconditions:

User is logged in as a Clinical Admin.
The built-in template is the Default.
Steps:

Duplicate the built-in template.
Edit the copy's wording and publish it.
Set the copy as Default and reload.
Delete the copy.
Expected Result:

Duplicate returns 201, Publish returns 200 and Set as Default returns 200.
After step 3, the Default chip is on the copy and stays there after the reload.

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Open the Clinical URL and sign in with the BCBA account | Lands on **Clients** ("View and select active clients"), header shows user name and role |
| 2 | Look at the client table header | Columns are **Client Name, D.O.B., Client ID, Status** |
| 3 | Read the first row | Name, DOB (e.g. *Jan 1, 2001*) and status (*Active/Inactive*) are filled |
| 4 | Type the seeded client's name in **Search by name** | List narrows to rows containing that name |
| 5 | Click **Clear Filters** | Full list is back |
| 6 | Click the seeded client's name | Client workspace opens on **Skills Programs**; tab bar shows Client Info, File Cabinet, Sessions, Skills Programs, Behavior Support, Analyze Data, Funder Reports |
| 7 | Look at the header | Client switcher shows the client name and **DOB** |

## TC-US01-02 — Switch client from the header and every tab reloads for the new client

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA and open the seeded client | Skills Programs shows the seeded client's programs |
| 2 | Open **Sessions** tab | URL is `/clients/<seeded>/sessions` |
| 3 | Use the header client switcher to pick the clean client | Header shows the clean client and its DOB; URL now contains the clean client ID and stays on Sessions |
| 4 | Open **Skills Programs**, **Behavior Support**, **Analyze Data** | Each tab URL uses the clean client ID; none of the seeded client's program names are shown |
| 5 | Switch back to the seeded client | Seeded client's programs are visible again |

## TC-US01-03 — Search by Client ID and hand-off to legacy BH

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Sign in as BCBA, go to **Clients** | Clients list loaded |
| 2 | Note a client that has a Client ID number; type it into **Search by Client ID** | Only rows with that Client ID remain |
| 3 | Open that client, click **Client Info** | Legacy BH opens in a **new tab** at `/core/clients/<id>` for the same client |
| 4 | Click **File Cabinet** | Legacy BH opens in a new tab at `/core/clients/<id>/files` |
