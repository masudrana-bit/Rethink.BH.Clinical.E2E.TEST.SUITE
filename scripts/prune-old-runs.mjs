#!/usr/bin/env node
// Retention for the published dashboard site: keeps at most 60 run files. Deletes the oldest nightly and pr
// runs first, never deletes release runs from the last 26 weeks, removes each pruned run's reports/<id>/
// folder, and rewrites index.json without the pruned runs.
// Usage: node scripts/prune-old-runs.mjs <siteDir>
import fs from 'node:fs';
import path from 'node:path';

const MAX_RUNS = 60;
const KEEP_RELEASES_MS = 26 * 7 * 24 * 60 * 60 * 1000;

const site = process.argv[2] ?? 'site';
const indexFile = path.join(site, 'index.json');
if (!fs.existsSync(indexFile)) {
  console.log(`No ${indexFile}; nothing to prune.`);
  process.exit(0);
}

const index = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
const runs = [...index.runs].sort((a, b) => a.startedAt.localeCompare(b.startedAt));
const now = Date.now();
const protectedRun = (r) => r.kind === 'release' && now - Date.parse(r.startedAt) < KEEP_RELEASES_MS;

const candidates = [
  ...runs.filter((r) => r.kind !== 'release'),
  ...runs.filter((r) => r.kind === 'release' && !protectedRun(r)),
];
const excess = Math.max(0, runs.length - MAX_RUNS);
const pruned = new Set(candidates.slice(0, excess).map((r) => r.runId));

for (const r of runs.filter((x) => pruned.has(x.runId))) {
  fs.rmSync(path.join(site, r.file), { force: true });
  fs.rmSync(path.join(site, 'reports', String(r.runId)), { recursive: true, force: true });
}

if (pruned.size) {
  index.runs = index.runs.filter((r) => !pruned.has(r.runId));
  fs.writeFileSync(indexFile, JSON.stringify(index, null, 2));
}
console.log(`Pruned ${pruned.size} run(s); ${index.runs.length} kept.`);
