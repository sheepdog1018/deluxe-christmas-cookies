(() => {
  'use strict';
  const buttons = [...document.querySelectorAll('[data-scale]')];
  if (!buttons.length) return;
  const syncToggle = document.getElementById('batch-sync-shopping');
  const status = document.getElementById('batch-status');
  const halfTip = document.getElementById('batch-egg-tip');
  const shopNote = document.getElementById('shopping-batch-note');
  const storageKey = 'sheepdogvalley-cookie-batch-v1';
  const options = [0.5, 1, 2, 3];
  const amountSpec = {
    'sugar-margarine': {n: 1, unit: 'cup', note: ', softened'},
    'sugar-powdered': {n: 1.5, unit: 'cup'},
    'sugar-egg': {n: 1, unit: 'egg'},
    'sugar-vanilla': {n: 1, unit: 'tsp'},
    'sugar-almond': {n: 0.5, unit: 'tsp'},
    'sugar-flour': {n: 2.5, unit: 'cup', note: ' (+ extra as needed)'},
    'sugar-soda': {n: 1, unit: 'tsp'},
    'sugar-tartar': {n: 1, unit: 'tsp'},
    'icing-sugar': {n: 1, unit: 'lb', note: ' (confectioners’ sugar)'},
    'icing-milk': {n: 4, unit: 'tbsp', note: ' (adjust as needed)'},
    'icing-butter': {n: 6, unit: 'tbsp', note: ' (unsalted, for consistency)'},
    'icing-vanilla': {n: 1, unit: 'tsp'},
    'icing-almond': {n: 3, unit: 'tsp', note: ' (to taste)'}
  };
  const displayFractions = {0.25: '¼', 0.5: '½', 0.75: '¾'};
  function quantity(n) {
    const whole = Math.floor(n);
    const fraction = +(n - whole).toFixed(2);
    return whole && fraction ? `${whole} ${displayFractions[fraction] || fraction}`
      : fraction ? displayFractions[fraction] || String(fraction) : String(whole);
  }
  function ingredientLabel(spec, scale) {
    const value = +(spec.n * scale).toFixed(2);
    if (spec.unit === 'egg') return `${quantity(value)} ${value <= 1 ? 'egg' : 'eggs'}`;
    return `${quantity(value)} ${spec.unit === 'cup' ? (value === 1 ? 'cup' : 'cups') : spec.unit}${spec.note || ''}`;
  }
  const shoppingBase = {
    'shop-powdered': '2 lb bag confectioners’ sugar',
    'shop-milk': 'quart milk',
    'shop-butter': '1 lb box unsalted butter',
    'shop-margarine': '1 lb box margarine',
    'shop-eggs': 'dozen large eggs',
    'shop-vanilla': '2 oz bottle vanilla extract',
    'shop-almond': '2 oz bottle almond extract',
    'shop-flour': '5 lb bag all-purpose flour',
    'shop-soda': '1 lb box baking soda',
    'shop-tartar': '3 oz jar cream of tartar',
    'shop-sprinkles': 'container holiday sprinkles',
    'shop-cutters': 'set cookie cutters',
    'shop-red': 'bottle red food coloring',
    'shop-green': 'bottle green food coloring'
  };
  const shoppingCount = {
    // Assumptions: powdered sugar ~4 oz/cup; 2 oz extracts ~12 tsp/bottle;
    // flour ~18 cups/5 lb bag. These are approximate purchase suggestions,
    // not ingredient amounts. Some pantry items are purchased once per session.
    'shop-powdered': s => Math.ceil(1.375 * s / 2),
    'shop-milk': s => Math.ceil((4 * s) / 64), // 64 tbsp per quart
    'shop-butter': s => Math.ceil((6 * s) / 32), // 32 tbsp per pound
    'shop-margarine': s => Math.ceil((16 * s) / 32),
    'shop-eggs': s => Math.ceil(s / 12),
    'shop-vanilla': s => Math.ceil((2 * s) / 12),
    'shop-almond': s => Math.ceil((3.5 * s) / 12),
    'shop-flour': s => Math.ceil((2.5 * s) / 18),
    'shop-soda': () => 1,
    'shop-tartar': () => 1,
    'shop-sprinkles': () => 1,
    'shop-cutters': () => 1,
    'shop-red': () => 1,
    'shop-green': () => 1
  };
  let state = {scale: 1, sync: true};
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (stored && options.includes(stored.scale)) {
      state.scale = stored.scale;
      state.sync = stored.sync !== false;
    }
  } catch { /* storage might be blocked */ }
  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* optional */ }
  }
  function redraw() {
    for (const button of buttons) {
      const chosen = Number(button.dataset.scale) === state.scale;
      button.classList.toggle('is-active', chosen);
      button.setAttribute('aria-pressed', String(chosen));
    }
    if (syncToggle) syncToggle.checked = state.sync;
    document.querySelectorAll('[data-ingredient]').forEach(el => {
      const spec = amountSpec[el.dataset.ingredient];
      if (spec) el.textContent = ingredientLabel(spec, state.scale);
    });
    document.querySelectorAll('[data-shopping-text]').forEach(el => {
      const key = el.dataset.shoppingText;
      if (!shoppingBase[key]) return;
      const packs = state.sync ? shoppingCount[key](state.scale) : 1;
      el.textContent = `(${packs}) ${shoppingBase[key]}`;
    });
    const labels = {0.5:'½ batch', 1:'original batch', 2:'double batch', 3:'triple batch'};
    if (status) status.textContent = `Showing ${labels[state.scale]} ingredient amounts.${state.sync ? ' Shopping suggestions are updated.' : ' Shopping suggestions remain at the original amounts.'}`;
    if (shopNote) shopNote.textContent = state.sync
      ? `Suggested store packages for the ${labels[state.scale]}; package sizes may leave leftovers. Check what you already have, and allow extra flour if needed.`
      : 'Shopping list is showing the original one-batch store packages. Recipe ingredient quantities above are scaled separately.';
    if (halfTip) halfTip.hidden = state.scale !== 0.5;
  }
  buttons.forEach(b => b.addEventListener('click', () => { state.scale = Number(b.dataset.scale); persist(); redraw(); }));
  syncToggle?.addEventListener('change', () => { state.sync = syncToggle.checked; persist(); redraw(); });
  redraw();
})();
