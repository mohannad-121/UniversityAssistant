const fs = require('fs');
const cp = require('child_process');
const files = cp.execSync('rg -l "[\\x{00D8}\\x{00D9}\\x{00E2}\\x{00C2}]" src supabase public package.json package-lock.json', { encoding: 'utf8', shell: true })
  .split(/\r?\n/).filter(Boolean);
const bad = /[\u00c2\u00c3\u00d8\u00d9\u00e2]/;
function repair(s) {
  if (!bad.test(s)) return s;
  const out = [];
  for (const ch of s) {
    const code = ch.charCodeAt(0);
    if (code <= 255) out.push(code);
    else out.push(...Buffer.from(ch, 'utf8'));
  }
  const fixed = Buffer.from(out).toString('utf8');
  return fixed.includes('\uFFFD') ? s : fixed;
}
function repairQuoted(match) {
  const q = match[0];
  const body = match.slice(1, -1);
  return q + repair(body) + q;
}
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const fixed = text.replace(/(['"`])(?:\\[\s\S]|(?!\1)[\s\S])*?\1/g, repairQuoted)
                    .replace(/â€”/g, '-')
                    .replace(/â€“/g, '-')
                    .replace(/Â·/g, '-');
  if (fixed !== text) fs.writeFileSync(file, fixed, 'utf8');
}
console.log(`processed ${files.length} files`);
