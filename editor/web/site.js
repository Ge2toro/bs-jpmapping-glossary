'use strict';
const search = document.querySelector('#site-search');
search?.addEventListener('input', () => {
  const query = search.value.trim().toLocaleLowerCase();
  let visible = 0;
  document.querySelectorAll('.entry').forEach(entry => {
    entry.hidden = query !== '' && !(entry.dataset.search || entry.textContent).toLocaleLowerCase().includes(query);
    if (!entry.hidden) visible++;
  });
  document.querySelectorAll('#entries section').forEach(section => section.hidden = ![...section.querySelectorAll('.entry')].some(e => !e.hidden));
  document.querySelector('#site-empty').hidden = visible !== 0;
});
// Following a glossary link clears a search which might otherwise hide its target.
document.addEventListener('click',event => {
  const link = event.target.closest('a[href^="#term-"]');
  if (link && search?.value) { search.value = ''; search.dispatchEvent(new Event('input')); }
});
