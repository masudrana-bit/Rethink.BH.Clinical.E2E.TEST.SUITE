#!/usr/bin/env node
// Replaces login values with *** in a folder that is about to be published.
//
// The app shows the signed-in user's name in page snapshots and history entries, and on the shared test accounts that
// name can equal the username or password, so keeping typed values out of step titles is not enough. Playwright HTML
// reports keep their test data in a base64 zip inside index.html; that zip is rewritten too.
//
// Usage: node scripts/mask-secrets.mjs <folder> [...]
// Values come from the environment variables in MASK_VARS (default: the BCBA, RBT, ADMIN and DEFAULT logins).
// Exits 1 if a value is still present afterwards, so a publish step that runs after it does not run.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const defaultVars = ['BCBA', 'RBT', 'ADMIN', 'DEFAULT'].flatMap((role) => [`${role}_USERNAME`, `${role}_PASSWORD`]);
const names = (process.env.MASK_VARS ?? defaultVars.join(' ')).split(/\s+/).filter(Boolean);
const secrets = [...new Set(names.map((n) => (process.env[n] ?? '').trim()).filter((v) => v.length >= 4))].sort((a, b) => b.length - a.length);
const textTypes = new Set(['.html', '.json', '.md', '.txt', '.js', '.csv']);

const mask = (text) => secrets.reduce((t, s) => t.split(s).join('***'), text);
const count = (text) => secrets.reduce((n, s) => n + text.split(s).length - 1, 0);

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

/** Reads a zip without zip64 or encryption, which is what the Playwright HTML reporter writes. */
function readZip(buf) {
  let eocd = buf.length - 22;
  while (eocd >= 0 && buf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error('embedded report data is not a zip');
  const entries = [];
  for (let i = 0, p = buf.readUInt32LE(eocd + 16); i < buf.readUInt16LE(eocd + 10); i++) {
    const method = buf.readUInt16LE(p + 10);
    const size = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const name = buf.subarray(p + 46, p + 46 + nameLen).toString('utf8');
    const local = buf.readUInt32LE(p + 42);
    const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const raw = buf.subarray(start, start + size);
    entries.push({ name, data: method === 8 ? zlib.inflateRawSync(raw) : Buffer.from(raw) });
    p += 46 + nameLen + buf.readUInt16LE(p + 30) + buf.readUInt16LE(p + 32);
  }
  return entries;
}

function writeZip(entries) {
  const locals = [];
  const central = [];
  let offset = 0;
  for (const { name, data } of entries) {
    const nameBuf = Buffer.from(name, 'utf8');
    const packed = zlib.deflateRawSync(data);
    const crc = crc32(data);
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(0x0800, 6);
    header.writeUInt16LE(8, 8);
    header.writeUInt32LE(crc, 14);
    header.writeUInt32LE(packed.length, 18);
    header.writeUInt32LE(data.length, 22);
    header.writeUInt16LE(nameBuf.length, 26);
    const dir = Buffer.alloc(46);
    dir.writeUInt32LE(0x02014b50, 0);
    dir.writeUInt16LE(20, 4);
    dir.writeUInt16LE(20, 6);
    dir.writeUInt16LE(0x0800, 8);
    dir.writeUInt16LE(8, 10);
    dir.writeUInt32LE(crc, 16);
    dir.writeUInt32LE(packed.length, 20);
    dir.writeUInt32LE(data.length, 24);
    dir.writeUInt16LE(nameBuf.length, 28);
    dir.writeUInt32LE(offset, 42);
    locals.push(header, nameBuf, packed);
    central.push(dir, nameBuf);
    offset += header.length + nameBuf.length + packed.length;
  }
  const dirBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(dirBuf.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, dirBuf, end]);
}

const embeddedZip = /(data:application\/zip;base64,)([A-Za-z0-9+/=]+)/;

function maskReportHtml(html) {
  const match = html.match(embeddedZip);
  if (!match) return { html: mask(html), left: count(html) };
  let left = 0;
  const entries = readZip(Buffer.from(match[2], 'base64')).map(({ name, data }) => {
    const text = mask(data.toString('utf8'));
    left += count(text);
    return { name, data: Buffer.from(text, 'utf8') };
  });
  const rebuilt = html.replace(embeddedZip, () => match[1] + writeZip(entries).toString('base64'));
  return { html: mask(rebuilt), left: left + count(mask(rebuilt)) };
}

function* files(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* files(full);
    else if (textTypes.has(path.extname(entry.name).toLowerCase())) yield full;
  }
}

if (!secrets.length) {
  console.log('mask-secrets: no login values set, nothing to mask');
  process.exit(0);
}
let changed = 0;
let remaining = 0;
for (const folder of process.argv.slice(2).length ? process.argv.slice(2) : ['.']) {
  for (const file of files(folder)) {
    const original = fs.readFileSync(file, 'utf8');
    const { html: updated, left } = path.basename(file) === 'index.html' ? maskReportHtml(original) : { html: mask(original), left: 0 };
    if (updated !== original) {
      fs.writeFileSync(file, updated);
      changed++;
    }
    remaining += left;
  }
}
console.log(`mask-secrets: masked login values in ${changed} file(s)`);
if (remaining) {
  console.error(`mask-secrets: ${remaining} login value(s) still present`);
  process.exit(1);
}
