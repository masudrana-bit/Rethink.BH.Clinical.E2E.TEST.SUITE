// Prints status, annotations and first error lines from a Playwright JSON report.
// Usage: node scripts/print-results.cjs reports/results.json [more.json ...]
const path = require('path');

const strip = (s) => (s || '').replace(/\x1b\[[0-9;]*m/g, '');
const quiet = /^(known-defect|role)$/;

for (const file of process.argv.slice(2)) {
  console.log(`=== ${file}`);
  const report = require(path.resolve(file));
  const walk = (suite) => {
    for (const child of suite.suites || []) walk(child);
    for (const spec of suite.specs || []) {
      for (const t of spec.tests) {
        const res = t.results.at(-1) || {};
        console.log(`${res.status} | ${spec.title} | ${Math.round((res.duration || 0) / 1000)}s`);
        for (const a of t.annotations) if (!quiet.test(a.type)) console.log(`    ${a.type}: ${(a.description || '').slice(0, 260)}`);
        for (const e of res.errors || []) console.log(`    ERR ${strip(e.message).split('\n').slice(0, 8).join(' / ').slice(0, 450)}`);
      }
    }
  };
  report.suites.forEach(walk);
}
