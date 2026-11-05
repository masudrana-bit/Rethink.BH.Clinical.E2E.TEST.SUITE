// Turns the raw Xray "Test details" text captured from Jira into structured steps.
// In:  docs/xray/rhd-60204-steps.jsonl   Out: docs/xray/rhd-60204-tests.json, docs/xray/rhd-60204-tests.md
import fs from 'node:fs';

const rows = fs.readFileSync('docs/xray/rhd-60204-steps.jsonl', 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const latest = new Map();
for (const r of rows) if (r.ok) latest.set(r.key, r);

const clean = (s) => s.replace(/\n{2,}/g, '\n').trim().replace(/^None$/, '');

const tests = [...latest.values()].sort((a, b) => a.key.localeCompare(b.key)).map(({ key, title, text }) => {
  const folder = (text.match(/Test Repository\n\/\n([\s\S]*?)\nTest Type/) || [, ''])[1].split('\n/\n').map((s) => s.trim()).join(' / ');
  const body = text.slice(text.indexOf('Add Step') + 'Add Step'.length, text.lastIndexOf('New Step'));
  const steps = body.split(/\nAttachments \(\d+\)\n?/).map((chunk) => {
    const m = chunk.match(/^\s*(\d+)\nAction\n([\s\S]*?)\nData\n([\s\S]*?)\nExpected Result\n([\s\S]*)$/);
    return m && { n: Number(m[1]), action: clean(m[2]), data: clean(m[3]), expected: clean(m[4]) };
  }).filter(Boolean);
  return { key, title, folder, steps };
});

fs.writeFileSync('docs/xray/rhd-60204-tests.json', JSON.stringify(tests, null, 2) + '\n');

const md = [
  '# Xray test execution RHD-60204: test steps',
  '',
  `${tests.length} tests, ${tests.reduce((n, t) => n + t.steps.length, 0)} steps. Read from Jira on ${new Date().toISOString().slice(0, 10)}.`,
  '',
  ...tests.flatMap((t) => [
    `## ${t.key} ${t.title}`,
    '',
    t.folder ? `Folder: ${t.folder}` : '',
    '',
    '| # | Action | Data | Expected result |',
    '|---|---|---|---|',
    ...t.steps.map((s) => `| ${s.n} | ${[s.action, s.data, s.expected].map((c) => c.replace(/\|/g, '\\|').replace(/\n/g, '<br>')).join(' | ')} |`),
    '',
  ]),
].join('\n');
fs.writeFileSync('docs/xray/rhd-60204-tests.md', md);

const noSteps = tests.filter((t) => !t.steps.length).map((t) => t.key);
console.log(`${tests.length} tests, ${tests.reduce((n, t) => n + t.steps.length, 0)} steps; without steps: ${noSteps.join(', ') || 'none'}`);
