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
  const imagePreview = document.getElementById('handwritten-preview');
  const imagePreviewImg = imagePreview?.querySelector('img');
  const imageCaption = document.getElementById('handwritten-caption');
  const handwriteNote = document.getElementById('handwrite-note');
  const handwriteCollection = document.getElementById('handwrite-collection');
  const previewCurrent = document.getElementById('tag-preview-current');
  const previewStage = document.querySelector('.tag-preview-stage');
  const personalizedFields = [toField.closest('.tag-field'), fromField.closest('.tag-field'), greeting.closest('.tag-field'), customWrap];
  const styleInputs = [...document.querySelectorAll('[name="tag-style"]')];
  const handwriteThumbs = [...document.querySelectorAll('.handwrite-thumb')];

  let selectedHandwritten = handwriteThumbs[0] || null;

  function selectHandwrittenThumb(button) {
    if (!button) return;
    selectedHandwritten = button;
    handwriteThumbs.forEach(thumb => {
      const active = thumb === button;
      thumb.classList.toggle('is-active', active);
      thumb.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    if (imagePreviewImg) {
      imagePreviewImg.src = button.dataset.handwrittenImage;
      imagePreviewImg.alt = button.dataset.handwrittenAlt || '';
    }
    if (imageCaption) imageCaption.textContent = button.dataset.handwrittenName || 'Handwritten Keepsake';
  }

  function buildPrintSheet(sourceEl, handwritten) {
    printSheet.replaceChildren();
    const number = Math.min(6, Math.max(1, parseInt(count.value, 10) || 6));
    for (let i = 0; i < number; i++) {
      const tag = sourceEl.cloneNode(true);
      tag.removeAttribute('id');
      tag.removeAttribute('aria-label');
      tag.removeAttribute('hidden');
      tag.classList.add(handwritten ? 'tag-print-image' : 'tag-print');
      printSheet.append(tag);
    }
  }

  function update() {
    const style = styleInputs.find(input => input.checked)?.value || 'holly';
    const handwritten = style === 'handwritten';

    if (selectedHandwritten) selectHandwrittenThumb(selectedHandwritten);

    document.body.dataset.printMode = handwritten ? 'handwritten' : 'generated';
    preview.dataset.style = handwritten ? 'holly' : style;
    preview.hidden = handwritten;
    imagePreview.hidden = !handwritten;
    handwriteNote.hidden = !handwritten;
    handwriteCollection.hidden = !handwritten;
    previewStage.classList.toggle('is-handwritten-mode', handwritten);

    personalizedFields.forEach(field => {
      if (!field || field === customWrap) return;
      field.classList.toggle('is-disabled', handwritten);
      const input = field.querySelector('input, select');
      if (input) input.disabled = handwritten;
    });

    customWrap.hidden = handwritten || greeting.value !== 'custom';
    customMessage.disabled = handwritten || greeting.value !== 'custom';

    const message = greeting.value === 'custom'
      ? (customMessage.value.trim() || 'With love and Christmas cheer!')
      : greeting.value;

    preview.querySelector('[data-tag-message]').textContent = message;
    preview.querySelector('[data-tag-to]').textContent = toField.value.trim() || 'Someone special';
    preview.querySelector('[data-tag-from]').textContent = fromField.value.trim() || 'Our Christmas kitchen';

    if (previewCurrent) {
      const labelMap = {
        holly: 'Selected design: Holly & Ivory',
        cranberry: 'Selected design: Cranberry & Gold',
        evergreen: 'Selected design: Evergreen Keepsake'
      };
      previewCurrent.textContent = handwritten
        ? `Selected design: Handwritten Keepsake — ${selectedHandwritten?.dataset.handwrittenName || 'Cookie Tin Flourish'}`
        : (labelMap[style] || 'Selected design');
    }

    buildPrintSheet(handwritten ? imagePreview : preview, handwritten);
  }

  handwriteThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const handwrittenRadio = styleInputs.find(input => input.value === 'handwritten');
      if (handwrittenRadio) handwrittenRadio.checked = true;
      selectHandwrittenThumb(thumb);
      update();
    });
  });

  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', event => event.preventDefault());
  document.getElementById('print-gift-tags').addEventListener('click', () => {
    update();
    window.print();
  });
  window.addEventListener('afterprint', () => {
    document.body.dataset.printMode = styleInputs.find(input => input.checked)?.value === 'handwritten' ? 'handwritten' : 'generated';
  });

  update();
})();
