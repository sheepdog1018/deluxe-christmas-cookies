(() => {
  'use strict';
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      toggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
      nav.classList.toggle('is-open', !expanded);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
    }));
  }

  const checkboxes = [...document.querySelectorAll('.checklist input[type="checkbox"][data-id]')];
  const storageKey = 'sheepdogvalley-christmas-cookie-checklists-v1';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch { saved = {}; }
  const progress = document.getElementById('shopping-progress');
  function updateProgress() {
    const shopping = checkboxes.filter(el => el.closest('[data-list="shopping"]'));
    if (progress) progress.textContent = `${shopping.filter(el => el.checked).length} of ${shopping.length} gathered`;
  }
  checkboxes.forEach(box => {
    box.checked = Boolean(saved[box.dataset.id]);
    box.addEventListener('change', () => {
      saved[box.dataset.id] = box.checked;
      try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch { /* storage unavailable: checklist still works */ }
      updateProgress();
    });
  });
  updateProgress();
  document.getElementById('reset-shopping')?.addEventListener('click', () => {
    checkboxes.filter(el => el.closest('[data-list="shopping"]')).forEach(el => { el.checked = false; saved[el.dataset.id] = false; });
    try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch { /* storage unavailable */ }
    updateProgress();
  });
  document.getElementById('print-recipes')?.addEventListener('click', () => window.print());

  const countEl = document.getElementById('countdown-text');
  if (countEl) {
    const format = n => String(n).padStart(2, '0');
    function updateCountdown() {
      const now = new Date();
      // Christmas at midnight in the visitor's local time.
      let year = now.getFullYear();
      if (now >= new Date(year, 11, 26)) year += 1;
      const christmas = new Date(year, 11, 25);
      const remaining = christmas.getTime() - now.getTime();
      if (remaining <= 0) { countEl.textContent = 'Merry Christmas! 🎄'; return; }
      const seconds = Math.floor(remaining / 1000);
      const d = Math.floor(seconds / 86400), h = Math.floor(seconds % 86400 / 3600), m = Math.floor(seconds % 3600 / 60), s = seconds % 60;
      countEl.textContent = `Santa arrives in ${d}d ${format(h)}h ${format(m)}m ${format(s)}s`;
    }
    updateCountdown();
    window.setInterval(updateCountdown, 1000);
  }
})();
