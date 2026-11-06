import {inlinePreview, ImagePicker, uploadImages, installShell, initialSelection} from './shared.mjs';
'use strict';
const $ = (selector) => document.querySelector(selector);
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let store, assets = [], selectedId, editSequence = 0, savedSequence = 0;
let saveTimer, toastTimer, savedRange, linkKind, switching = false, fatalConflict = false;
let saveChain = Promise.resolve(true);
const editor = $('#meaning');
const imagePicker = new ImagePicker($('#images-picker'),() => markDirty());
const schedulePreview = inlinePreview({request:api,getId:()=>selectedId,getDoc:()=>term() ? readForm() : null,root:$('#entry-preview'),warning:$('#preview-warnings')});
const term = () => store?.terms.find(t => t.id === selectedId);
// Property order is normalized by the server/importer, and comparison here is structural.
const canonical = (v) => JSON.stringify(v, (_, value) => value && !Array.isArray(value) && typeof value === 'object' ? Object.fromEntries(Object.entries(value).sort(([a],[b]) => a.localeCompare(b))) : value);
const hasChanges = (t) => canonical(t.draft) !== canonical(store._output?.terms?.[t.id] || null);

async function api(path, data) {
  const options = data === undefined ? {} : {method:'POST', headers:{'Content-Type':'application/json','X-Glossary-Editor':'1'}, body:JSON.stringify(data)};
  let response;
  try { response = await fetch(path, options); } catch { throw new Error('保存先に接続できません。起動用のウィンドウが開いているか確認してください。'); }
  const result = await response.json();
  if (!response.ok) { if (response.status === 409) fatalConflict = true; throw new Error(result.error || '操作に失敗しました。'); }
  return result;
}
function showError(error) { $('#error-banner').textContent = error.message || String(error); $('#error-banner').hidden = false; }
function clearError() { if (!fatalConflict) $('#error-banner').hidden = true; }
function toast(text) { $('#toast').textContent = text; $('#toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').hidden = true, 3600); }
function textOf(doc) { return doc.body.map(n => n.type === 'break' ? '\n' : n.text).join(''); }

function renderList() {
  const scrollPosition = $('#term-list').scrollTop;
  const query = $('#search').value.trim().toLocaleLowerCase();
  const filter = $('#filter').value;
  let items = store.terms.filter(t => (!query || [t.draft.name, t.draft.reading, t.draft.displayReading, textOf(t.draft)].join(' ').toLocaleLowerCase().includes(query)) && (filter !== 'changed' || hasChanges(t)) && (filter !== 'new' || !store._output?.terms?.[t.id]));
  items.sort($('#sort').value === 'reading' ? (a,b) => a.draft.reading.localeCompare(b.draft.reading, 'ja') : (a,b) => a.order-b.order);
  $('#total-count').textContent = store.terms.length;
  $('#shown-count').textContent = `${items.length}件`;
  $('#term-list').innerHTML = items.map(t => `<button class="term-item ${t.id === selectedId ? 'selected' : ''}" data-id="${escapeHTML(t.id)}" role="listitem" aria-current="${t.id === selectedId ? 'true' : 'false'}"><span class="term-number">${String(t.order).padStart(3,'0')}</span><span class="term-item-text"><strong>${escapeHTML(t.draft.name || '名称未入力')}</strong><small>${escapeHTML(t.draft.displayReading || t.draft.reading || '新しい下書き')}</small></span>${hasChanges(t) ? '<span class="change-dot" title="下書きに変更があります"></span>' : ''}</button>`).join('');
  $('#empty-list').hidden = items.length !== 0;
  $('#term-list').scrollTop = scrollPosition;
}

function nodesToHTML(nodes) {
  return nodes.map(n => {
    if (n.type === 'break') return '<br>';
    let value = escapeHTML(n.text);
    if (n.type === 'termLink') value = `<a href="#${escapeHTML(n.target)}" data-term-id="${escapeHTML(n.target)}">${value}</a>`;
    if (n.type === 'externalLink') value = `<a href="${escapeHTML(n.url)}" data-url="${escapeHTML(n.url)}">${value}</a>`;
    if (n.noAutoLink) value = `<span data-no-auto="true">${value}</span>`;
    if (n.bold) value = `<strong>${value}</strong>`;
    if (n.italic) value = `<em>${value}</em>`;
    return value;
  }).join('');
}

function readNodes() {
  const result = [];
  const append = (n) => {
    const previous = result.at(-1);
    if (n.type !== 'break' && !n.text) return;
    if (previous && n.type !== 'break' && previous.type !== 'break' && canonical({...previous,text:''}) === canonical({...n,text:''})) previous.text += n.text;
    else result.push(n);
  };
  function walk(node, marks = {}) {
    if (node.nodeType === Node.TEXT_NODE) {
      const pieces = node.textContent.replace(/\u00a0/g, ' ').split('\n');
      pieces.forEach((text,i) => { if (i) append({type:'break'}); append({type:'text',text,...marks}); });
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const tag = node.tagName;
    if (tag === 'BR') { append({type:'break'}); return; }
    const next = {...marks};
    if (tag === 'STRONG' || tag === 'B') next.bold = true;
    if (tag === 'EM' || tag === 'I') next.italic = true;
    if (node.dataset.noAuto) next.noAutoLink = true;
    if (tag === 'A') {
      if (node.dataset.termId) { next.type = 'termLink'; next.target = node.dataset.termId; }
      else { next.type = 'externalLink'; next.url = node.dataset.url || node.getAttribute('href') || ''; }
    }
    const block = ['DIV','P','LI','H1','H2','H3','BLOCKQUOTE'].includes(tag);
    if (block && result.length && result.at(-1).type !== 'break') append({type:'break',_block:true});
    for (const child of node.childNodes) walk(child,next);
    if (block && result.at(-1)?.type !== 'break') append({type:'break',_block:true});
  }
  for (const node of editor.childNodes) walk(node);
  if (result.at(-1)?._block) result.pop();
  for (const node of result) delete node._block;
  return result.some(n => n.type !== 'break' && n.text) ? result : [];
}

function readForm() {
  return {name:$('#term-name').value, reading:$('#term-reading').value, displayReading:$('#term-display').value, images:[...imagePicker.value], autoLink:$('#term-autolink').checked, body:readNodes()};
}
function imageOptions(value) { imagePicker.setAssets(assets); imagePicker.setValue(value); imagePicker.refresh(); }

function renderStatus() {
  const current = term();
  if (!current) return;
  const doc = readForm();
  const baseline = store._output?.terms?.[current.id];
  const changed = canonical(doc) !== canonical(baseline || null);
  $('#draft-badge').textContent = !store._output?.docsHash ? '出力履歴なし' : !baseline ? '未出力' : changed ? '前回出力から変更あり' : '出力済み';
  $('#draft-badge').classList.toggle('unchanged', !changed);
  $('#character-count').textContent = `${textOf(doc).length.toLocaleString()}文字`;
  schedulePreview();
}

function markDirty() {
  editSequence++;
  $('#save-status').textContent = '未保存の変更があります';
  $('#save-status').className = 'pending';
  clearTimeout(saveTimer); saveTimer = setTimeout(() => saveNow(), 1000);
  renderStatus();
}

async function saveNow() {
  clearTimeout(saveTimer);
  if (!store || !term()) return false;
  if (fatalConflict) return false;
  const sequence = editSequence, id = selectedId, doc = readForm();
  saveChain = saveChain.then(async () => {
    if (fatalConflict) return false;
    if (sequence <= savedSequence) return true;
    $('#save-status').textContent = '保存中…';
    try {
      const result = await api('/api/save', {id,doc,revision:store.revision});
      store = result.store;
      savedSequence = sequence;
      if (editSequence === savedSequence) { $('#save-status').textContent = '✓ このPCに保存しました'; $('#save-status').className = 'saved'; }
      renderList(); renderStatus(); clearError();
      return true;
    } catch (error) { $('#save-status').textContent = '保存できませんでした'; $('#save-status').className = 'failed'; showError(error); return false; }
  });
  return saveChain;
}

function populate(id) {
  selectedId = id;
  const doc = term().draft;
  $('#term-name').value = doc.name;
  $('#term-reading').value = doc.reading;
  $('#term-display').value = doc.displayReading;
  $('#term-autolink').checked = doc.autoLink;
  editor.innerHTML = nodesToHTML(doc.body);
  imageOptions(doc.images);
  savedRange = null;
  renderList(); renderStatus();
  const item = [...$('#term-list').querySelectorAll('[data-id]')].find(button => button.dataset.id === id);
  if (item && window.innerWidth > 650) item.scrollIntoView({block:'nearest'});
  $('#save-status').textContent = '✓ このPCに保存済み'; $('#save-status').className = 'saved';
}

async function selectTerm(id) {
  if (switching || id === selectedId) return;
  switching = true;
  $('.workspace').inert = true;
  try { if (await saveNow()) { populate(id); $('.writing-area').scrollTop = 0; } }
  finally { switching = false; $('.workspace').inert = false; }
}

async function action(kind) {
  if (switching) return;
  switching = true;
  $('.workspace').inert = true;
  try {
    if (!await saveNow()) return;
    const result = await api(`/api/${kind}`, {id:selectedId,revision:store.revision});
    store = result.store;
    populate(result.selectedId);
    if (kind === 'new') { $('#filter').value = 'all'; $('#search').value = ''; renderList(); $('#term-name').focus(); }
    toast('新しい下書きを追加しました');
  } catch (error) { showError(error); }
  finally { switching = false; $('.workspace').inert = false; }
}

function selectionRange() {
  const selection = window.getSelection();
  return selection.rangeCount && editor.contains(selection.getRangeAt(0).commonAncestorContainer) ? selection.getRangeAt(0).cloneRange() : savedRange;
}
function restoreSelection() {
  editor.focus();
  const range = savedRange && editor.contains(savedRange.commonAncestorContainer) ? savedRange : document.createRange();
  if (range !== savedRange) { range.selectNodeContents(editor); range.collapse(false); }
  const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
  return range;
}
function insertNode(node) {
  const range = restoreSelection();
  range.deleteContents(); range.insertNode(node); range.setStartAfter(node); range.collapse(true);
  const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
  savedRange = range.cloneRange(); markDirty();
}
function formatSelection(kind) {
  savedRange = selectionRange();
  if (!savedRange || savedRange.collapsed) return toast('書式を付けたい文字を選択してください');
  const wrapper = document.createElement(kind === 'bold' ? 'strong' : 'em');
  wrapper.append(savedRange.extractContents()); insertNode(wrapper);
}
function fillTargets() {
  const search = $('#link-search').value.trim().toLocaleLowerCase();
  const current = $('#link-target').value;
  const matches = store.terms.filter(t => t.draft.name && [t.draft.name,t.draft.reading].join(' ').toLocaleLowerCase().includes(search));
  $('#link-target').innerHTML = matches.map(t => `<option value="${escapeHTML(t.id)}">${escapeHTML(t.draft.name)}</option>`).join('');
  if (matches.some(t => t.id === current)) $('#link-target').value = current;
}
function openLink(kind) {
  linkKind = kind; savedRange = selectionRange();
  const label = savedRange?.toString() || '';
  $('#link-label').value = label;
  $('#link-search').value = ''; $('#link-url').value = '';
  $('#term-target-fields').hidden = kind !== 'term'; $('#url-target-field').hidden = kind !== 'url';
  $('#link-target').required = kind === 'term'; $('#link-url').required = kind === 'url';
  $('#link-dialog-title').textContent = kind === 'term' ? '用語へのリンク' : '外部サイトへのリンク';
  $('#link-error').hidden = true;
  fillTargets(); $('#link-dialog').showModal();
  (kind === 'term' ? $('#link-search') : $('#link-url')).focus();
}
function unwrap(node) { node.replaceWith(...node.childNodes); }
function unlinkSelection() {
  savedRange = selectionRange();
  if (!savedRange) return toast('手動リンクの中にカーソルを置くか、文字を選択してください');
  let parent = savedRange.startContainer.nodeType === Node.ELEMENT_NODE ? savedRange.startContainer : savedRange.startContainer.parentElement;
  const anchor = parent.closest('a');
  const links = anchor && editor.contains(anchor) ? [anchor] : [...editor.querySelectorAll('a')].filter(a => savedRange.intersectsNode(a));
  if (!links.length) return toast('選択箇所に手動リンクがありません。自動リンクは「自動リンクを除外」で調整できます');
  links.forEach(unwrap); savedRange = null; markDirty();
}
function excludeAuto() {
  savedRange = selectionRange();
  if (!savedRange || savedRange.collapsed) return toast('自動リンクから除外したい文字を選択してください');
  let parent = savedRange.startContainer.nodeType === Node.ELEMENT_NODE ? savedRange.startContainer : savedRange.startContainer.parentElement;
  const existing = parent.closest('[data-no-auto]');
  if (existing && editor.contains(existing)) { unwrap(existing); savedRange = null; markDirty(); return; }
  const span = document.createElement('span'); span.dataset.noAuto = 'true'; span.append(savedRange.extractContents()); insertNode(span);
}

$('#term-form').addEventListener('submit', event => event.preventDefault());
for (const id of ['#term-name','#term-reading','#term-display']) $(id).addEventListener('input', markDirty);
editor.addEventListener('input',markDirty);
editor.addEventListener('click', event => { if (event.target.closest('a')) event.preventDefault(); });
editor.addEventListener('paste', event => { event.preventDefault(); const text = event.clipboardData.getData('text/plain'); savedRange = selectionRange(); const fragment = document.createDocumentFragment(); text.split(/\r?\n/).forEach((line,i) => { if (i) fragment.append(document.createElement('br')); fragment.append(document.createTextNode(line)); }); const span = document.createElement('span'); span.append(fragment); insertNode(span); });
editor.addEventListener('drop', event => { event.preventDefault(); toast('画像は下の「画像を追加」から選択してください'); });
$('#term-autolink').addEventListener('change',markDirty);
for (const id of ['#search','#filter','#sort']) $(id).addEventListener(id === '#search' ? 'input' : 'change',renderList);
$('#term-list').addEventListener('click',event => { const button = event.target.closest('[data-id]'); if (button) selectTerm(button.dataset.id); });
$('#save-button').addEventListener('click',() => saveNow());
$('#new-button').addEventListener('click',() => action('new'));
document.querySelectorAll('.toolbar button').forEach(button => button.addEventListener('mousedown',event => { savedRange = selectionRange(); event.preventDefault(); }));
document.querySelectorAll('[data-format]').forEach(button => button.addEventListener('click',() => formatSelection(button.dataset.format)));
$('#term-link-button').addEventListener('click',() => openLink('term'));
$('#url-link-button').addEventListener('click',() => openLink('url'));
$('#unlink-button').addEventListener('click',unlinkSelection);
$('#noauto-button').addEventListener('click',excludeAuto);
$('#link-search').addEventListener('input',fillTargets);
$('#link-target').addEventListener('change',() => { if (!$('#link-label').value) $('#link-label').value = store.terms.find(t => t.id === $('#link-target').value)?.draft.name || ''; });
$('#link-cancel').addEventListener('click',() => $('#link-dialog').close());
$('#link-form').addEventListener('submit',event => {
  event.preventDefault();
  const a = document.createElement('a'); a.textContent = $('#link-label').value;
  if (linkKind === 'term') { a.dataset.termId = $('#link-target').value; a.href = '#' + a.dataset.termId; }
  else {
    try { const url = new URL($('#link-url').value); if (!['https:','http:'].includes(url.protocol) || !url.hostname) throw new Error(); a.dataset.url = url.href; a.href = url.href; }
    catch { $('#link-error').textContent = 'http:// または https:// のURLを入力してください。'; $('#link-error').hidden = false; return; }
  }
  $('#link-dialog').close(); insertNode(a);
});
$('#image-upload').addEventListener('change',async event => {
  const files = [...event.target.files]; if (!files.length || switching) return;
  switching = true;
  try {
    const names = await uploadImages(files);
    assets = [...new Set([...assets,...names])];
    imageOptions([...imagePicker.value,...names]); markDirty(); toast('説明画像を追加しました');
  } catch(error) { showError(error); } finally { event.target.value = ''; switching = false; }
});
document.querySelector('a[href="/api/backup"]').addEventListener('click', async event => {
  event.preventDefault();
  try {
    const snapshot = JSON.parse(JSON.stringify(store));
    snapshot.terms.find(t => t.id === selectedId).draft = readForm();
    const url = URL.createObjectURL(new Blob([JSON.stringify(snapshot,null,2)],{type:'application/json;charset=utf-8'}));
    const link = document.createElement('a'); link.href = url; link.download = 'glossary-backup.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    toast('現在の下書きを含めてバックアップしました');
  } catch (error) { showError(error); }
});
document.addEventListener('keydown',event => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); saveNow(); } });
window.addEventListener('beforeunload',event => { if (editSequence !== savedSequence) { event.preventDefault(); event.returnValue = ''; } });

installShell({save:saveNow,getStore:()=>store,getSelected:()=>selectedId,showError,toast,isBusy:()=>switching,onOutput:()=>{renderList();renderStatus();}});
(async () => {
  try {
    const data = await api('/api/store'); store = data.store; assets = data.assets;
    populate(initialSelection(store));
    document.documentElement.dataset.editorState = 'ready';
  } catch(error) { showError(error); $('#save-status').textContent = '読み込めませんでした'; }
})();

$('#entry-preview').addEventListener('click',event=>{const link=event.target.closest('a[href^="#term-"]');if(link){event.preventDefault();selectTerm(link.getAttribute('href').slice(1));}});
