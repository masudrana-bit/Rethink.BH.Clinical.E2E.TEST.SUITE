#!/usr/bin/env node
// Builds site/coverage.json for the dashboard's "Automation coverage" view. Node 18+, no dependencies.
//
// Usage:
//   node scripts/build-coverage.mjs [--cases test-cases] [--specs tests/stories] [--stories stories.json] [--out site/coverage.json]
//
// Sources:
//   - Written test cases: every "## TC-USxx-yy — title" heading in test-cases/**/US-*.md. A case is a happy path unless its
//     heading carries @negative (error, validation, permission) or @edge (edge case, layout, long-running).
//   - Automation: a spec test whose title starts with the case id. test.fixme placeholders count as manual.
// A story is "fully automated" when every happy-path case is automated; negative and edge cases are reported separately.
import fs from 'node:fs';
import path from 'node:path';

const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i > -1 && process.argv[i + 1] !== undefined ? process.argv[i + 1] : d;
};
const casesDir = arg('cases', 'test-cases');
const specsDir = arg('specs', 'tests/stories');
const storiesFile = arg('stories', 'stories.json');
const outFile = arg('out', 'site/coverage.json');

const walk = (dir, test) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const full = path.join(dir, d.name);
    return d.isDirectory() ? walk(full, test) : test(d.name) ? [full] : [];
  });
const rel = (f) => path.relative(process.cwd(), f).split(path.sep).join('/');
const storyOfCase = (id) => `US-${Number(id.match(/^TC-US(\d+)-/)[1])}`;

const storiesMeta = fs.existsSync(storiesFile) ? JSON.parse(fs.readFileSync(storiesFile, 'utf8')) : {};

const automation = new Map();
for (const file of walk(specsDir, (n) => n.endsWith('.spec.ts'))) {
  const src = fs.readFileSync(file, 'utf8');
  for (const m of src.matchAll(/\btest(\.fixme)?\(\s*['"`](TC-US\d+-\d+)/g)) {
    automation.set(m[2], { file: rel(file), placeholder: Boolean(m[1]) });
  }
}

const cases = [];
const docs = new Map();
for (const file of walk(casesDir, (n) => /^US-\d+.*\.md$/.test(n))) {
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^##\s+(TC-US\d+-\d+)\s+[—-]+\s+(.*)$/);
    if (!m) continue;
    const [, id, rest] = m;
    const tags = [...rest.matchAll(/@([\w-]+)/g)].map((t) => t[1].toLowerCase());
    const title = rest.replace(/\s*@[\w-]+/g, '').replace(/\s*\((manual)[^)]*\)/i, '').trim();
    const spec = automation.get(id);
    const automated = Boolean(spec && !spec.placeholder);
    const story = storyOfCase(id);
    docs.set(story, rel(file));
    cases.push({
      id,
      story,
      title,
      type: tags.includes('negative') ? 'negative' : tags.includes('edge') ? 'edge' : 'happy',
      automated,
      file: spec?.file ?? null,
      note: spec?.placeholder ? `Only a placeholder test exists (test.fixme in ${rel(spec.file)})` : spec ? null : 'No automated test written yet',
    });
  }
}

const keys = [...new Set([...Object.keys(storiesMeta), ...cases.map((c) => c.story)])].sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
const stories = keys.map((key) => {
  const meta = storiesMeta[key] ?? {};
  const own = cases.filter((c) => c.story === key).sort((a, b) => a.id.localeCompare(b.id));
  const happy = own.filter((c) => c.type === 'happy');
  const other = own.filter((c) => c.type !== 'happy');
  const level = !own.some((c) => c.automated) ? 'none' : happy.length && happy.every((c) => c.automated) ? 'full' : 'partial';
  return {
    key,
    title: meta.title ?? key,
    epic: meta.epic ?? null,
    priority: meta.priority ?? 'P2',
    doc: docs.get(key) ?? meta.doc ?? null,
    level,
    happy: { total: happy.length, automated: happy.filter((c) => c.automated).length },
    other: { total: other.length, automated: other.filter((c) => c.automated).length },
    cases: own,
  };
});

const count = (f) => stories.filter(f).length;
const coverage = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  rule: 'A feature is fully automated when every happy-path test case written for it runs as an automated test. Error, validation and edge cases are counted separately and do not change the label.',
  totals: {
    stories: stories.length,
    full: count((s) => s.level === 'full'),
    partial: count((s) => s.level === 'partial'),
    none: count((s) => s.level === 'none'),
    cases: cases.length,
    automated: cases.filter((c) => c.automated).length,
    happy: cases.filter((c) => c.type === 'happy').length,
    happyAutomated: cases.filter((c) => c.type === 'happy' && c.automated).length,
  },
  stories,
};

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(coverage, null, 2));
const t = coverage.totals;
console.log(`Wrote ${outFile}: ${t.full} of ${t.stories} features fully automated, ${t.partial} partly, ${t.none} not automated; ${t.automated} of ${t.cases} test cases automated.`);
