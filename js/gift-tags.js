(() => {
  'use strict';
  const preview = document.getElementById('tag-preview');
  if (!preview) return;
  const form = document.getElementById('gift-tag-form');
  const toField = document.getElementById('tag-to');
  const fromField = document.getElementById('tag-from');
  const greeting = document.getElementById('tag-greeting');
  const customWrap = document.getElementById('custom-greeting-wrap');
  const customMessage = document.getElementById('tag-custom-greeting');
  const count = document.getElementById('tag-count');
  const printSheet = document.getElementById('print-sheet');
  const styleInputs = [...document.querySelectorAll('[name="tag-style"]')];
  function update() {
    const style = styleInputs.find(input => input.checked)?.value || 'holly';
    preview.dataset.style = style;
    customWrap.hidden = greeting.value !== 'custom';
    const message = greeting.value === 'custom'
      ? (customMessage.value.trim() || 'With love and Christmas cheer!')
      : greeting.value;
    preview.querySelector('[data-tag-message]').textContent = message;
    preview.querySelector('[data-tag-to]').textContent = toField.value.trim() || 'Someone special';
    preview.querySelector('[data-tag-from]').textContent = fromField.value.trim() || 'Our Christmas kitchen';

    // Reuse the *exact* preview markup for printed tags. All user text is
    // assigned via textContent above, never interpreted as HTML.
    printSheet.replaceChildren();
    const number = Math.min(6, Math.max(1, parseInt(count.value, 10) || 6));
    for (let i = 0; i < number; i++) {
      const tag = preview.cloneNode(true);
      tag.removeAttribute('id');
      tag.removeAttribute('aria-label');
      tag.classList.add('tag-print');
      printSheet.append(tag);
    }
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', event => event.preventDefault());
  document.getElementById('print-gift-tags').addEventListener('click', () => {
    update();
    window.print();
  });
  update();
})();
