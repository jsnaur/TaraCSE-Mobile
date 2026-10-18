// Fails on any high or critical npm advisory that is not in the reviewed allowlist.
// Each allowlisted advisory must have no patched release and be documented in
// docs/SECURITY.md with the reason it does not reach the shipped app.
import { execSync } from 'node:child_process';

const ALLOWLIST = new Set([
  // braces 3.0.3 (latest) via @expo/metro > metro-file-map > micromatch. Dev server only.
  'GHSA-vfj7-8cjw-p6xm',
  // node-forge 1.4.0 (latest) via @expo/cli code signing. CLI tooling only.
  'GHSA-86w9-cpqp-85rv',
]);
const BLOCKING = new Set(['high', 'critical']);

let raw;
try {
  raw = execSync('npm audit --json', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
} catch (error) {
  // npm audit exits non-zero when it finds anything; the JSON is still on stdout.
  raw = error.stdout;
}

const { vulnerabilities = {} } = JSON.parse(raw);
const blocking = [];
for (const [name, info] of Object.entries(vulnerabilities)) {
  for (const via of info.via) {
    if (typeof via !== 'object' || !BLOCKING.has(via.severity)) continue;
    const id = via.url?.split('/').pop();
    if (!ALLOWLIST.has(id)) blocking.push(`${name}: ${via.title} [${via.severity}] ${via.url}`);
  }
}

if (blocking.length > 0) {
  console.error('Unreviewed high/critical advisories:\n' + blocking.join('\n'));
  process.exit(1);
}
console.log('npm audit: no unreviewed high/critical advisories.');
