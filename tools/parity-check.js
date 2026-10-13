/* Deep parity check: PWA data files vs the native app's data files.
 *
 * Usage:
 *   npx tsc TrainWeek/src/data/plan.ts TrainWeek/src/data/sakshi-plan.ts \
 *     TrainWeek/src/data/exinfo.ts TrainWeek/src/data/exdemo.ts \
 *     --ignoreConfig --outDir /tmp/native-data --module commonjs --target es2020 --skipLibCheck
 *   node tools/parity-check.js /tmp/native-data
 *
 * Exits non-zero when any difference is found.
 */
const fs = require('fs');
const path = require('path');

const PWA = path.join(__dirname, '..');
const NATIVE = process.argv[2];
if (!NATIVE) { console.error('usage: node tools/parity-check.js <transpiled-native-data-dir>'); process.exit(2); }

function loadPwa(file, names) {
  const src = fs.readFileSync(path.join(PWA, file), 'utf8');
  return new Function(src + `; return { ${names.join(', ')} };`)();
}

const pwaPlan = loadPwa('plan.js', ['PLAN']).PLAN;
const pwaSak = loadPwa('sakshi-plan.js', ['SAKSHI_PLAN']).SAKSHI_PLAN;
const pwaS2 = loadPwa('shubham2-plan.js', ['SHUBHAM2_PLAN']).SHUBHAM2_PLAN;
const pwaInfo = loadPwa('exinfo.js', ['MUSCLES', 'EXINFO', 'EQUIP', 'equipFor']);
const pwaDemo = loadPwa('exdemo.js', ['DEMOS', 'VIDEOS', 'demoFor']);

const natPlan = require(path.resolve(NATIVE, 'plan.js')).PLAN;
const natSak = require(path.resolve(NATIVE, 'sakshi-plan.js')).SAKSHI_PLAN;
const natS2 = require(path.resolve(NATIVE, 'shubham2-plan.js')).SHUBHAM2_PLAN;
const natInfo = require(path.resolve(NATIVE, 'exinfo.js'));
const natDemo = require(path.resolve(NATIVE, 'exdemo.js'));

const diffs = [];
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function comparePlans(label, pwa, nat) {
  if (pwa.length !== nat.length) { diffs.push(`${label}: day count ${pwa.length} vs ${nat.length}`); return; }
  pwa.forEach((pd, i) => {
    const nd = nat[i];
    for (const f of ['id', 'num', 'name', 'short', 'focus', 'subtitle', 'time', 'cut']) {
      if (pd[f] !== nd[f]) diffs.push(`${label} ${pd.id}.${f}: "${pd[f]}" vs "${nd[f]}"`);
    }
    if (!eq(pd.target, nd.targetMin)) diffs.push(`${label} ${pd.id}: target vs targetMin`);
    if (pd.sections.length !== nd.sections.length) { diffs.push(`${label} ${pd.id}: section count ${pd.sections.length} vs ${nd.sections.length}`); return; }
    pd.sections.forEach((ps, si) => {
      const ns = nd.sections[si];
      for (const f of ['title', 'meta', 'tag', 'note']) {
        if ((ps[f] ?? null) !== (ns[f] ?? null)) diffs.push(`${label} ${pd.id}/${ps.title}.${f}: "${ps[f]}" vs "${ns[f]}"`);
      }
      if (!eq(ps.callout ?? null, ns.callout ?? null)) diffs.push(`${label} ${pd.id}/${ps.title}: callout differs`);
      if (!eq(ps.items, ns.items)) {
        const detail = ps.items.length !== ns.items.length
          ? `item count ${ps.items.length} vs ${ns.items.length}`
          : ps.items.map((it, ii) => eq(it, ns.items[ii]) ? null : `#${ii} ${it.name}`).filter(Boolean).join(', ');
        diffs.push(`${label} ${pd.id}/${ps.title}: items differ (${detail})`);
      }
    });
  });
}

function compareMaps(label, pwa, nat) {
  const pk = Object.keys(pwa), nk = Object.keys(nat);
  const onlyP = pk.filter(k => !(k in nat)), onlyN = nk.filter(k => !(k in pwa));
  if (onlyP.length) diffs.push(`${label}: only in PWA: ${onlyP.join(' | ')}`);
  if (onlyN.length) diffs.push(`${label}: only in native: ${onlyN.join(' | ')}`);
  for (const k of pk) if (k in nat && !eq(pwa[k], nat[k])) diffs.push(`${label}["${k}"]: values differ`);
}

comparePlans('PLAN', pwaPlan, natPlan);
comparePlans('SAKSHI', pwaSak, natSak);
comparePlans('SHUBHAM2', pwaS2, natS2);
compareMaps('MUSCLES', pwaInfo.MUSCLES, natInfo.MUSCLES);
compareMaps('EXINFO', pwaInfo.EXINFO, natInfo.EXINFO);
compareMaps('EQUIP', pwaInfo.EQUIP, natInfo.EQUIP);

/* EXEQUIP and DEMOS/VIDEOS are private on native — compare behaviorally
   over every name either app can ever render (plan items, EXINFO keys,
   and every clickable alternate). */
const allNames = new Set();
for (const plan of [pwaPlan, pwaSak, pwaS2, natPlan, natSak, natS2])
  for (const d of plan) for (const s of d.sections) for (const it of s.items) allNames.add(it.name);
for (const info of [pwaInfo.EXINFO, natInfo.EXINFO])
  for (const [k, v] of Object.entries(info)) { allNames.add(k); (v.alt ?? []).forEach(a => allNames.add(a)); }
for (const n of allNames) {
  if (!eq(pwaDemo.demoFor(n), natDemo.demoFor(n))) diffs.push(`demoFor("${n}") differs`);
}
for (const k of Object.keys(pwaInfo.EXINFO))
  if (!eq(pwaInfo.equipFor(k), natInfo.equipFor(k))) diffs.push(`equipFor("${k}") differs`);
const untagged = Object.keys(pwaInfo.EXINFO).filter(k => pwaInfo.equipFor(k).length === 0);
if (untagged.length) diffs.push(`untagged exercises: ${untagged.join(' | ')}`);

/* Every plan item must resolve in EXINFO (directly or via section-tag fallback is
   NOT enough for main content — flag items with no entry at all). */
const noInfo = [];
for (const [label, plan] of [['PLAN', pwaPlan], ['SAKSHI', pwaSak], ['SHUBHAM2', pwaS2]])
  for (const d of plan) for (const s of d.sections) for (const it of s.items)
    if (!pwaInfo.EXINFO[it.name]) noInfo.push(`${label} ${d.id}/${s.title}: ${it.name}`);

const totals = {
  shubhamWeek: [pwaPlan, natPlan].map(p => p.reduce((n, d) => n + d.sections.reduce((m, s) => m + s.items.length, 0), 0)),
  sakshiWeek: [pwaSak, natSak].map(p => p.reduce((n, d) => n + d.sections.reduce((m, s) => m + s.items.length, 0), 0)),
  shubham2Week: [pwaS2, natS2].map(p => p.reduce((n, d) => n + d.sections.reduce((m, s) => m + s.items.length, 0), 0)),
  exinfoKeys: [Object.keys(pwaInfo.EXINFO).length, Object.keys(natInfo.EXINFO).length],
  demoNamesChecked: allNames.size,
};

console.log(JSON.stringify({ diffCount: diffs.length, diffs: diffs.slice(0, 30), planItemsMissingInfo: noInfo, totals }, null, 2));
process.exit(diffs.length || noInfo.length ? 1 : 0);
