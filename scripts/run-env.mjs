#!/usr/bin/env node
// Runs Playwright against one environment. Accounts and test data come from .env.<name> (falling back to .env).
//
// Usage:
//   node scripts/run-env.mjs <dev2|dev3|uat> [playwright test options]
//   npm run test:uat -- --project=stories          npm run ui:dev3
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ENVIRONMENTS = ['dev2', 'dev3', 'uat'];
const [name, ...args] = process.argv.slice(2);
if (!ENVIRONMENTS.includes(name)) {
  console.error(`Usage: node scripts/run-env.mjs <${ENVIRONMENTS.join('|')}> [playwright test options]`);
  process.exit(2);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cli = path.join(root, 'node_modules', '@playwright', 'test', 'cli.js');
const child = spawn(process.execPath, [cli, 'test', ...args], { cwd: root, stdio: 'inherit', env: { ...process.env, TEST_ENV: name } });
child.on('exit', (code, signal) => process.exit(code ?? (signal ? 1 : 0)));
