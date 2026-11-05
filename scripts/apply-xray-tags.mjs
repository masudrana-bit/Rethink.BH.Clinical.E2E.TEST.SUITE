// Writes the Xray keys from docs/xray/mapping.json onto the automated tests and their test-case docs:
//   test('TC-US02-01 [RHD-60114] Title', { tag: ['@xray', '@RHD-60114'] }, async …)
//   **Xray:** [RHD-60114](…) under the "## TC-US02-01 — …" heading.
// Safe to re-run: earlier keys and tags are replaced, not duplicated.
// Usage: node scripts/apply-xray-tags.mjs [--check]
import fs from 'node:fs';
import path from 'node:path';

const JIRA = 'https://rethinkautism.atlassian.net/browse/';
const check = process.argv.includes('--check');
const mapping = JSON.parse(fs.readFileSync('docs/xray/mapping.json', 'utf8'));

const keysOf = new Map();
for (const x of mapping.tests) for (const tc of x.tests) keysOf.set(tc, [...(keysOf.get(tc) ?? []), x.key]);
for (const [tc, keys] of keysOf) keysOf.set(tc, [...new Set(keys)].sort());

const walk = (dir, ok) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const full = path.join(dir, d.name);
    return d.isDirectory() ? walk(full, ok) : ok(d.name) ? [full] : [];
  });

/** Index just past the closing quote of the string literal that opens at `start`. */
const stringEnd = (src, start) => {
  const q = src[start];
  for (let i = start + 1; i < src.length; i++) {
    if (src[i] === '\\') i++;
    else if (src[i] === q) return i + 1;
  }
  throw new Error(`Unterminated string at ${start}`);
};

const seen = new Set();
const changed = [];

for (const file of walk('tests', (n) => n.endsWith('.spec.ts'))) {
  const src = fs.readFileSync(file, 'utf8');
  let out = '';
  let last = 0;
  for (const m of src.matchAll(/\btest(?:\.fixme|\.skip)?\(\s*(['"`])(TC-US\d+-\d+)/g)) {
    const id = m[2];
    seen.add(id);
    const qStart = m.index + m[0].length - id.length - 1;
    const qEnd = stringEnd(src, qStart);
    const quote = src[qStart];
    const body = src.slice(qStart + 1, qEnd - 1).replace(/^(TC-US\d+-\d+) (?:\[RHD-\d+(?:, RHD-\d+)*\] )?/, '');
    const keys = keysOf.get(id) ?? [];
    const title = keys.length ? `${id} [${keys.join(', ')}] ${body}` : `${id} ${body}`;

    let rest = qEnd;
    const old = src.slice(qEnd).match(/^,\s*\{\s*tag:\s*\[[^\]]*\]\s*\}/);
    if (old) rest += old[0].length;
    const details = keys.length ? `, { tag: [${['@xray', ...keys.map((k) => `@${k}`)].map((t) => `'${t}'`).join(', ')}] }` : '';

    out += src.slice(last, qStart) + quote + title + quote + details;
    last = rest;
  }
  out += src.slice(last);
  if (out !== src) {
    changed.push(file);
    if (!check) fs.writeFileSync(file, out);
  }
}

for (const file of walk('test-cases', (n) => /^US-\d+.*\.md$/.test(n))) {
  const src = fs.readFileSync(file, 'utf8');
  const nl = src.includes('\r\n') ? '\r\n' : '\n';
  // An Xray line is always written as: heading, blank, Xray line, blank, rest.
  const lines = src.split(/\r?\n/);
  const clean = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^\*\*Xray:\*\* /.test(lines[i])) {
      if (lines[i + 1] === '') i++;
      continue;
    }
    clean.push(lines[i]);
  }
  const out = [];
  for (const line of clean) {
    out.push(line);
    const id = line.match(/^##\s+(TC-US\d+-\d+)\s/)?.[1];
    const keys = id && keysOf.get(id);
    if (keys) out.push('', `**Xray:** ${keys.map((k) => `[${k}](${JIRA}${k})`).join(', ')}`);
  }
  for (let i = out.length - 1; i > 0; i--) {
    if (/^\*\*Xray:\*\* /.test(out[i - 1]) && out[i] !== '') out.splice(i, 0, '');
  }
  const text = out.join(nl);
  if (text !== src) {
    changed.push(file);
    if (!check) fs.writeFileSync(file, text);
  }
}

const titles = new Map(JSON.parse(fs.readFileSync('docs/xray/rhd-60204-tests.json', 'utf8')).map((t) => [t.key, t.title]));
const LEVEL = { full: 'Covered', partial: 'Partly covered', gap: 'Not covered' };
const count = (l) => mapping.tests.filter((x) => x.level === l).length;
const table = [
  `# Xray ${mapping.execution} mapped to the automated suite`,
  '',
  `Compared on ${mapping.comparedOn} using the Xray test steps. ${mapping.tests.length} Xray tests: ${count('full')} covered, ${count('partial')} partly covered, ${count('gap')} not covered.`,
  '',
  'Run the automated tests for one Xray case with `npx playwright test --grep @RHD-60282`, or all mapped tests with `--grep @xray`.',
  '',
  '| Xray test | Title | Coverage | Automated tests | Not covered yet |',
  '|---|---|---|---|---|',
  ...mapping.tests.map((x) => `| [${x.key}](${JIRA}${x.key}) | ${titles.get(x.key) ?? ''} | ${LEVEL[x.level]} | ${x.tests.join(', ') || '—'} | ${x.missing || '—'} |`),
  '',
].join('\n');
if (!check) fs.writeFileSync('docs/xray/mapping.md', table);

const unknown = [...keysOf.keys()].filter((tc) => !seen.has(tc));
if (unknown.length) {
  console.error(`Mapped test cases with no spec: ${unknown.join(', ')}`);
  process.exitCode = 1;
}
console.log(`${check ? 'Would change' : 'Changed'} ${changed.length} files; ${keysOf.size} test cases carry Xray keys.`);
