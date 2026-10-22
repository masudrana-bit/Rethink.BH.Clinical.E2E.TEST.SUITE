# US-28 — Review each target on its own chart

| Field | Value |
| --- | --- |
| Jira | [RHD-57736](https://rethinkautism.atlassian.net/browse/RHD-57736) — Program-Level Analysis |
| Role | BCBA (RBT for the session) |
| Automation | `tests/stories/08-program-analysis/us-28-per-target-charts.spec.ts` |
| Watch for | Manual phase change not shown (NGC-61) |

**Acceptance:** Per-target chart incl. phase changes reflected.

**Observed on dev2 (Oct 19):**
- Data tab → **Targets** shows small multiples, one chart per target, each described as "<target>: N recorded points, measured in %". Targets with no data yet get no chart.
- Phase changes are made per target in **Manage Targets** → phase control → **Change phase** (see US-32).

---

## TC-US28-01 — Each target gets its own chart with its session data; a phase change shows on that chart (NGC-61)

| # | Action | Expected result |
| --- | --- | --- |
| 1 | BCBA: seeded client → create an Opportunity Based program with targets Touch nose, Clap hands, Stand up | Program saved |
| 2 | RBT: ad-hoc session with the program → Touch nose: Independent, Full Physical; Clap hands: Independent → conclude and finalize | Session finalized |
| 3 | BCBA: program → Data → **Targets** | One chart per target with data: "Touch nose: 1 recorded point", "Clap hands: 1 recorded point" (Stand up has no data and no chart) |
| 4 | Manage Targets → Touch nose → **Change phase** → Intervention, reason → **Record change** | Phase reads Intervention |
| 5 | Data → Targets again | Touch nose chart shows the phase change line (**fails today** if missing, NGC-61) |
| 6 | Clean-up: delete the program | Removed |
