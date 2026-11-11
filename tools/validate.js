/* Data integrity checker for the VitaMap bundle.
 * Run: node tools/validate.js
 * Exits non-zero if any relation points at a nutrient that does not exist,
 * if ids are duplicated, or if a required bilingual field is missing.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const assets = path.join(__dirname, '..', 'app', 'src', 'main', 'assets');
const files = [
  path.join(assets, 'js', 'data-nutrients-1.js'),
  path.join(assets, 'js', 'data-nutrients-2.js'),
  path.join(assets, 'js', 'data-symptoms.js')
];

const ctx = { console };
vm.createContext(ctx);
for (const f of files) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });

const data = vm.runInContext('({ NUTRIENTS, SYMPTOMS, GROUPS, NUTRIENT_BY_ID })', ctx);
const NUTRIENTS = data.NUTRIENTS;
const SYMPTOMS = data.SYMPTOMS;
const GROUPS = data.GROUPS;
const byId = data.NUTRIENT_BY_ID;

let errors = 0;
let warnings = 0;
function err(msg) { errors++; console.log('ERROR  ' + msg); }
function warn(msg) { warnings++; console.log('WARN   ' + msg); }

console.log('nutrients: ' + NUTRIENTS.length + '   symptoms: ' + SYMPTOMS.length + '   groups: ' + GROUPS.length);

// duplicate ids
const seen = new Set();
for (const n of NUTRIENTS) {
  if (seen.has(n.id)) err('duplicate nutrient id: ' + n.id);
  seen.add(n.id);
}
const seenS = new Set();
for (const s of SYMPTOMS) {
  if (seenS.has(s.id)) err('duplicate symptom id: ' + s.id);
  seenS.add(s.id);
}

// required fields
for (const n of NUTRIENTS) {
  ['zh', 'en', 'db', 'cat'].forEach(k => { if (!n[k]) err(n.id + ' missing ' + k); });
  ['f', 'r', 'u', 'c'].forEach(k => {
    if (!n[k] || !n[k].zh || !n[k].en) err(n.id + ' missing bilingual ' + k);
  });
  if (!['vitamin', 'mineral', 'amino', 'fatty', 'botanical', 'protein', 'other'].includes(n.cat)) {
    err(n.id + ' bad category ' + n.cat);
  }
  (n.syn || []).forEach(id => { if (!byId[id]) warn(n.id + ' synergy points at unknown id: ' + id); });
}

// relations
const used = new Set();
let relationCount = 0;
for (const s of SYMPTOMS) {
  if (!GROUPS.some(g => g.id === s.g)) err(s.id + ' bad group ' + s.g);
  if (!s.note || !s.note.zh || !s.note.en) err(s.id + ' missing bilingual note');
  for (const r of s.r) {
    relationCount++;
    const [id, level, note] = r;
    if (!byId[id]) err(s.id + ' relation -> unknown nutrient ' + id);
    else used.add(id);
    if (!['core', 'support', 'adjunct'].includes(level)) err(s.id + ' bad level ' + level);
    if (!note || !note.zh || !note.en) err(s.id + ' relation note not bilingual (' + id + ')');
  }
}

// nutrients never referenced by any symptom
for (const n of NUTRIENTS) if (!used.has(n.id)) warn('nutrient never suggested by a symptom: ' + n.id);

// long text sanity (UI overflow / readability)
for (const n of NUTRIENTS) {
  if (n.u.zh.length > 120) warn(n.id + ' upper-limit text very long (' + n.u.zh.length + ')');
}

console.log('relations: ' + relationCount);
console.log(errors ? ('FAILED with ' + errors + ' error(s), ' + warnings + ' warning(s)') : ('OK — 0 errors, ' + warnings + ' warning(s)'));
process.exit(errors ? 1 : 0);
