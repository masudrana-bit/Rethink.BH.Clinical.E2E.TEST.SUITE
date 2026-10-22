/**
 * Tests that fail because of a confirmed product defect. They run as "expected to fail" (test.fail):
 * the suite stays green while the defect reproduces, and the test fails with "Expected to fail, but passed"
 * once the defect is fixed — then check the fix and remove its entry here. Details are in the story's md file.
 *
 * `match` must match every error the test reports; any other error is a real failure and is reported as one.
 * `envs` limits an entry to some environments (TEST_ENV); without it the entry applies everywhere.
 * A test can have a list of entries when environments run different builds; the first one for the environment is used.
 */
export interface KnownDefect {
  summary: string;
  match: RegExp;
  envs?: string[];
}

const OLDER_BUILDS = ['uat'];
const FIXED_ON_DEV3 = ['dev2', 'uat'];

export const KNOWN_DEFECTS: Record<string, KnownDefect | KnownDefect[]> = {
  'TC-US03-01': { summary: 'NGC-16: British spelling "Uncategorised" (fixed on dev2)', match: /Uncategorised/, envs: OLDER_BUILDS },
  'TC-US15-01': { summary: 'NGC-90: no Model prompt level on the data sheet (fixed on dev2)', match: /NGC-90/, envs: OLDER_BUILDS },
  'TC-US24-03': { summary: 'NGC-65: ABC entries cannot be corrected (fixed on dev2)', match: /NGC-65/, envs: OLDER_BUILDS },
  'TC-US27-01': { summary: 'NGC-59: no goal line on the combined chart; UAT x-axis shows session numbers, not dates', match: /NGC-59|x-axis shows the real session date/, envs: OLDER_BUILDS },
  'TC-US28-01': { summary: 'NGC-61: phase change not drawn on the target chart', match: /NGC-61/, envs: ['uat'] },
  'TC-US30-01': { summary: 'Annotations are listed but not drawn on the chart', match: /annotation drawn on the chart/, envs: ['uat'] },
  'TC-US02-01': { summary: 'Library keyword search takes 4–4.6 s (target 3 s); NGC-22: Area blank on system programs', match: /respond within 3 s|NGC-22/ },
  'TC-US04-02': { summary: 'NGC-21: no duplicate warning when adding from a stale second tab', match: /NGC-21/ },
  'TC-US07-01': { summary: "Renaming a target and changing another target's group in one save fails (412 StaleVersion)", match: /412 Conflict|StaleVersion/ },
  'TC-US09-03': { summary: 'Frequency/Rate mastery: Save stays disabled with "Maintenance: enter a threshold value" (fixed on dev3)', match: /Maintenance: enter a threshold/, envs: FIXED_ON_DEV3 },
  'TC-US10-01': { summary: 'After switching to the RBT view, Home schedule and New Session clients load only after a refresh (fixed on dev3)', match: /load after switching to the RBT view|without a refresh/, envs: FIXED_ON_DEV3 },
  'TC-US10-02': { summary: 'NGC-47: RBT view is not kept after signing in again', match: /NGC-47/ },
  'TC-US11-01': { summary: 'NGC-49: RBT schedule and client filter include clients outside the caseload (passes on dev2 and UAT)', match: /NGC-49/, envs: ['dev3'] },
  'TC-US12-02': { summary: 'Start Live Session from the client page does not pre-select the client', match: /pre-selected when starting from the client page/ },
  'TC-US14-01': { summary: 'Backfill with blank times shows the entry time as session start and end', match: /should not default to the entry time/ },
  'TC-US20-01': { summary: 'Duration recorder no longer offers High / Medium / Low intensity levels (confirm with product)', match: /intensity levels/, envs: ['dev2', 'dev3'] },
  'TC-US22-02': { summary: "Group session: Record ABC Data from a client card pre-selects the first client", match: /should target that client/ },
  'TC-US23-01': [
    {
      summary: 'Pre-session note template not applied; note fields Client Name / Staff Assigned / Location not pre-filled, so the note cannot be submitted; NGC-86; RBT Home still shows Open',
      match: /template picked on the pre-session page|every required note field|NGC-86|RBT Home also shows|behavior support card/,
      envs: OLDER_BUILDS,
    },
    {
      summary: 'Pre-session note template not applied; finalize says "removed from this device" (NGC-86); RBT Home still shows Open',
      match: /template picked on the pre-session page|NGC-86|RBT Home also shows|behavior support card/,
    },
  ],
  'TC-US24-02': { summary: 'Undo last trial leaves no entry in the session audit trail', match: /undone trial appears in the audit trail/ },
  'TC-US26-02': { summary: 'Role shown as "Role 4 a" instead of a role name', match: /role is shown by name/ },
  'TC-US31-01': { summary: 'NGC-44: Observations grid Setting is "—" and the AG Grid trial watermark shows', match: /NGC-44/ },
  'TC-US32-01': { summary: 'Phase history names the user as "Unknown" (fixed on dev3)', match: /names the user who made each change/, envs: FIXED_ON_DEV3 },
  'TC-US33-01': { summary: 'Skip baseline leaves targets in Baseline; no mastery determination raised', match: /skip baseline|determination|mastery-evaluation-review/i },
  'TC-US37-01': {
    summary: 'Only one linked measure: no replacement skill graphed beside the behavior; co-graph has no accessible name (Oct 20)',
    match: /replacement skill is linked|local day|labelled with the behavior/,
  },
  'TC-US38-01': { summary: 'Review tab: "Publishing is unavailable for this plan." (fixed on dev3)', match: /publishing is available for the plan/, envs: FIXED_ON_DEV3 },
  'TC-US41-02': { summary: 'RBT view can open Settings by URL', match: /Settings blocked for a non-admin role/ },
  'TC-US42-01': [
    { summary: 'NGC-68: no Author / Last edited columns; Domain and Area blank on most programs', match: /author column|last edited|NGC-68|area|domain/i, envs: [...OLDER_BUILDS, 'dev3'] },
    { summary: 'NGC-68: no Author / Last edited columns; Area blank on most programs', match: /author column|last edited|NGC-68|area/i },
  ],
  'TC-US45-01': { summary: 'Edit on a standard program edits it in place, no "adapt a copy"', match: /adapted, not edited in place/ },
  'TC-US46-01': { summary: 'Publish has no confirmation', match: /confirmation before publishing/ },
  'TC-US47-01': { summary: 'Deactivate has no confirmation', match: /confirmation before deactivating/ },
  'TC-US47-02': { summary: 'NGC-30: deactivating a standard program has no confirmation or "Adapt a copy"', match: /confirmation before deactivating|NGC-30/ },
};
