/* ============================================================
   Anatomical body model — reusable muscle-map component.

   Structure, back to front:
     1. silhouette  — full body shape, so the figure always reads
                      as a body and the gaps between muscles look
                      like definition rather than holes
     2. muscles     — one path per group, dark when resting,
                      accent when worked
     3. detail      — head, joints, hands, feet

   Every shape is authored as ONE half-path (left of centre, on a
   200×400 canvas) and mirrored at render time: guaranteed symmetry,
   half the data.

   Use:  bodyMap(['chest','triceps'])         → front + back pair
         bodyFigure('front', keys, 160)       → a single view
   ============================================================ */

/* Body outline: neck → shoulder → arm → torso → leg → foot → up the inside. */
const SILHOUETTE = `M100,49 L87,52 C75,57 64,66 56,78
  C48,84 44,94 44,105 C43,123 41,141 39,158
  C37,176 35,192 35,202 C35,212 38,219 43,219
  C48,219 51,213 52,206 C54,188 56,170 58,154
  C60,136 62,120 65,108 C67,101 70,97 73,96
  C76,112 78,132 78,150 C78,168 76,182 73,194
  C69,202 66,210 64,222 C61,244 60,266 62,286
  C63,296 65,303 67,311 C69,327 70,344 71,358
  C72,368 71,376 73,383 L91,383
  C93,377 92,366 92,356 C93,338 94,320 95,304
  C96,292 97,278 97,262 C98,244 99,228 100,213 Z`;

/* Head, joints, hands, feet — drawn last, never highlighted. */
const BODY_DETAIL = `
  <ellipse cx="100" cy="30" rx="17" ry="21"/>
  <ellipse cx="43" cy="215" rx="8" ry="9"/>
  <ellipse cx="157" cy="215" rx="8" ry="9"/>
  <ellipse cx="78" cy="298" rx="11" ry="8"/>
  <ellipse cx="122" cy="298" rx="11" ry="8"/>
  <path d="M72,368 c-2,9 -1,15 1,15 h18 c2,-5 1,-10 1,-15 Z"/>
  <path d="M128,368 c2,9 1,15 -1,15 h-18 c-2,-5 -1,-10 -1,-15 Z"/>`;

/* [muscleKey, half-path] — mirrored on render. */
const BODY = {
  front: [
    ['traps', 'M98,53 C88,55 76,61 59,77 C72,72 85,68 98,66 Z'],
    ['side-delts', 'M59,77 C50,83 45,94 45,106 C55,110 66,104 70,93 C71,84 66,78 59,77 Z'],
    ['chest', 'M98,70 C87,69 77,73 71,81 C67,90 69,102 76,109 C86,114 95,108 98,100 Z'],
    ['biceps', 'M53,111 C48,123 46,136 48,149 C54,155 61,151 63,143 C64,130 61,118 58,111 Z'],
    ['forearms', 'M49,156 C43,169 41,183 42,196 C48,202 55,199 57,191 C59,177 56,165 53,156 Z'],
    ['abs', 'M98,116 L87,118 C85,125 85,131 87,137 L98,137 Z M98,141 L87,141 C85,148 85,154 87,160 L98,160 Z M98,164 L88,164 C87,174 89,183 94,190 L98,190 Z'],
    ['obliques', 'M85,118 C78,124 75,136 75,148 C76,160 80,170 85,177 C82,163 81,138 85,118 Z'],
    ['hip-flexors', 'M86,183 C82,190 84,199 91,205 L98,199 L98,186 Z'],
    ['quads', 'M73,212 C65,230 63,255 67,280 C73,290 84,290 89,283 C93,262 94,235 92,214 C86,209 78,209 73,212 Z'],
    ['adductors', 'M93,221 C87,232 85,245 88,258 C93,252 95,238 95,224 Z'],
    ['tibialis', 'M79,309 C73,323 71,340 73,355 C79,359 85,356 86,348 C88,331 85,319 83,309 Z'],
  ],
  back: [
    ['traps', 'M100,53 C88,55 75,63 59,79 C73,74 86,70 100,70 Z M100,73 C90,77 82,86 76,99 C84,110 92,118 100,122 Z'],
    ['rear-delts', 'M59,79 C50,84 45,95 45,107 C55,111 66,105 70,94 C71,85 66,80 59,79 Z'],
    ['upper-back', 'M77,90 C69,97 67,108 71,118 C79,120 87,113 90,103 C88,95 83,90 77,90 Z'],
    ['lats', 'M73,108 C64,120 64,142 71,160 C81,166 91,158 96,148 C97,133 94,118 89,110 C84,105 78,105 73,108 Z'],
    ['triceps', 'M53,110 C47,122 45,136 48,150 C54,155 61,151 63,143 C64,130 61,117 58,110 Z'],
    ['forearms', 'M49,156 C43,169 41,183 42,196 C48,202 55,199 57,191 C59,177 56,165 53,156 Z'],
    ['lower-back', 'M100,150 C92,153 88,160 88,170 C90,180 94,188 100,192 Z'],
    ['glutes', 'M100,196 C88,195 78,202 74,214 C73,229 81,241 92,243 C96,242 100,240 100,237 Z'],
    ['hamstrings', 'M75,247 C69,263 69,281 73,298 C81,304 90,301 93,293 C96,274 96,257 93,247 C87,243 81,243 75,247 Z'],
    ['calves', 'M79,311 C72,325 70,342 75,355 C81,361 88,357 90,347 C92,333 87,320 83,311 Z'],
  ],
};

/* Keys without their own shape borrow another region's. */
const REGION_ALIAS = {
  'upper-chest': 'chest',
  'front-delts': 'side-delts',
  'glute-med': 'glutes',
  'lower-abs': 'abs',
  core: 'abs',
  achilles: 'calves',
  'plantar-fascia': 'calves',
  knee: 'quads',
  hips: 'glutes',
  'rotator-cuff': 'upper-back',
  grip: 'forearms',
  wrists: 'forearms',
  't-spine': 'upper-back',
  ankle: 'tibialis',
};

const mirror = d => `<path d="${d}" transform="translate(200,0) scale(-1,1)"/>`;
const both = d => `<path d="${d}"/>${mirror(d)}`;

function bodyFigure(side, keys, size) {
  const on = new Set(keys.map(k => REGION_ALIAS[k] || k));
  const muscles = BODY[side].map(([k, d]) =>
    `<g class="reg ${on.has(k) ? 'on' : ''}">${both(d)}</g>`).join('');
  return `
    <svg viewBox="0 0 200 400" class="bmap" width="${size}" aria-hidden="true">
      <g class="sil">${both(SILHOUETTE)}</g>
      ${muscles}
      <g class="detail">${BODY_DETAIL}</g>
    </svg>`;
}

/* Front + back pair, as used in the exercise sheet. */
function bodyMap(keys, opts = {}) {
  const size = opts.size || 112;
  return `
    <div class="bmap-wrap">
      <div>${bodyFigure('front', keys, size)}<span class="label">Front</span></div>
      <div>${bodyFigure('back', keys, size)}<span class="label">Back</span></div>
    </div>`;
}
