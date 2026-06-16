const fs = require('fs');
const text = fs.readFileSync('src/data/knowledge.ts','utf8');
const m = text.match(/name: "([^"]+)/);
const s = m[1];
console.log(s);
console.log([...s].slice(0,20).map(ch => `${ch}:${ch.codePointAt(0).toString(16)}`).join(' '));
