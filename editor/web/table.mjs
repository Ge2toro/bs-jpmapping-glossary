import {inlinePreview, ImagePicker, uploadImages, installShell, initialSelection, readFontSize} from './shared.mjs';
import {DraftSession, clone, signature} from './state.mjs';
import {escapeHTML as esc, plainText, nodesToHTML, readNodes} from './richtext.mjs';

const $ = selector => document.querySelector(selector);
let session, assets = [], selectedId, visibleIds = [], busy = false;
let saveTimer, toastTimer, activeRich, savedRange, linkKind, automaticLabel;
let focusSnapshot;
const imagePicker = new ImagePicker($('#images-picker'), images => { edit(selectedId,{images}); imageOptions(images); });
const schedulePreview = inlinePreview({request,getId:()=>selectedId,getDoc:()=>selected()?.draft,root:$('#preview'),warning:$('#preview-warning')});
const selected = () => session?.get(selectedId);
const richRoot = node => node?.nodeType === Node.ELEMENT_NODE ? node.closest('[contenteditable="true"]') : node?.parentElement?.closest('[contenteditable="true"]');
const rowFor = id => [...$('#rows').rows].find(row => row.dataset.id === id);
const preference = (key, fallback) => { try { return JSON.parse(localStorage.getItem('glossary-table-' + key)) ?? fallback; } catch { return fallback; } };
const remember = (key, value) => { try { localStorage.setItem('glossary-table-' + key, JSON.stringify(value)); } catch {} };

async function request(path, data) {
  let response;
  try { response = await fetch(path, data === undefined ? {} : {method:'POST',headers:{'Content-Type':'application/json','X-Glossary-Editor':'1'},body:JSON.stringify(data)}); }
  catch { throw new Error('保存先に接続できません。起動用のウィンドウが開いているか確認してください。'); }
  const result = await response.json();
  if (!response.ok) {
    if (response.status === 409 && session) session.blocked = true;
    throw new Error(result.error || '操作に失敗しました。');
  }
  return result;
}
function showError(error) { $('#error').textContent = error.message || String(error); $('#error').hidden = false; }
function toast(text) { clearTimeout(toastTimer); $('#toast').textContent = text; $('#toast').hidden = false; toastTimer = setTimeout(() => $('#toast').hidden = true,3500); }
function imageButton(doc) { return doc.images.length ? doc.images.map(n => `<img src="/assets/${encodeURIComponent(n)}" loading="lazy" alt="${esc(doc.name)}の説明画像">`).join('') : '画像なし'; }
function rowHTML(t) {
  const d = t.draft;
  const input = (field, label, value) => `<input class="cell-input" data-field="${field}" aria-label="${esc(d.name || '名称未入力')}の${label}" value="${esc(value)}" maxlength="2000" placeholder="${label}">`;
  return `<tr data-id="${esc(t.id)}" class="${t.id === selectedId ? 'selected' : ''}" aria-selected="${t.id === selectedId}">
    <td class="sticky-number">${String(t.order).padStart(3,'0')}</td><td class="sticky-status"><span class="row-dot ${session.changed(t.id) ? '' : 'clean'}" title="${session.changed(t.id) ? '前回出力から変更あり' : '出力済み'}"></span></td>
    <td class="sticky-name">${input('name','用語名',d.name)}</td>
    <td><div class="body-cell-editor" data-field="body" contenteditable="true" role="textbox" aria-label="${esc(d.name || '名称未入力')}の説明" aria-multiline="true" spellcheck="false" data-placeholder="説明を入力">${nodesToHTML(d.body)}</div></td>
    <td class="auxiliary">${input('displayReading','表示用の読み',d.displayReading)}</td><td class="auxiliary">${input('reading','並べ替え用の読み',d.reading)}</td>
    <td class="auxiliary"><button class="image-cell" data-field="image" title="下の編集欄で画像を選択" aria-label="${esc(d.name || '名称未入力')}の画像を選ぶ">${imageButton(d)}</button></td>
    <td class="auxiliary auto-cell"><input type="checkbox" data-field="autoLink" aria-label="${esc(d.name || '名称未入力')}を自動リンクの対象にする" ${d.autoLink ? 'checked' : ''}></td>
  </tr>`;
}
function renderTable() {
  if (!session) return;
  const scroll = $('#sheet-scroll'), top = scroll.scrollTop, left = scroll.scrollLeft;
  const query = $('#search').value.trim().toLocaleLowerCase(), filter = $('#filter').value;
  const terms = session.store.terms.filter(t => (!query || [t.draft.name,t.draft.reading,t.draft.displayReading,plainText(t.draft)].join(' ').toLocaleLowerCase().includes(query)) && (filter !== 'changed' || session.changed(t.id)) && (filter !== 'new' || !session.store._output?.terms?.[t.id]));
  terms.sort($('#sort').value === 'reading' ? (a,b) => a.draft.reading.localeCompare(b.draft.reading,'ja') : (a,b) => a.order-b.order);
  visibleIds = terms.map(t => t.id);
  $('#rows').innerHTML = terms.map(rowHTML).join('');
  $('#empty').hidden = terms.length !== 0;
  $('#count').textContent = `${terms.length} / ${session.store.terms.length}語`;
  scroll.scrollTop = top; scroll.scrollLeft = left;
  updateStatus();
}
function syncRow(id, origin) {
  const row = rowFor(id), d = session.get(id).draft;
  if (!row) return;
  for (const field of ['name','displayReading','reading']) {
    const input = row.querySelector(`[data-field="${field}"]`);
    if (origin !== input) input.value = d[field];
  }
  const body = row.querySelector('[data-field="body"]');
  if (origin !== body) body.innerHTML = nodesToHTML(d.body);
  const auto = row.querySelector('[data-field="autoLink"]');
  if (origin !== auto) auto.checked = d.autoLink;
  row.querySelector('.image-cell').innerHTML = imageButton(d);
}
function imageOptions(value) {
  imagePicker.setAssets(assets); imagePicker.setValue(value);
  $('#manage-images').textContent = `説明画像 ${value.length}枚・編集`;
}
function populateDetail(id) {
  const previousRow = rowFor(selectedId);
  previousRow?.classList.remove('selected'); previousRow?.setAttribute('aria-selected','false');
  selectedId = id;
  const row = rowFor(id); row?.classList.add('selected'); row?.setAttribute('aria-selected','true');
  const d = selected().draft;
  $('#detail-body').innerHTML = nodesToHTML(d.body);
  imageOptions(d.images); $('#detail-auto').checked = d.autoLink;
  savedRange = null; activeRich = $('#detail-body');
  updateStatus();
}
function updateStatus() {
  if (!session) return;
  const dirty = new Set(session.dirtyIds());
  const count = session.store.terms.filter(t => session.changed(t.id)).length;
  $('#change-count').textContent = session.store._output?.docsHash ? `${count}語が出力待ち` : '初回出力後から差分を表示';
  for (const row of $('#rows').rows) {
    const dot = row.querySelector('.row-dot'), changed = session.changed(row.dataset.id);
    dot.className = 'row-dot' + (dirty.has(row.dataset.id) ? ' unsaved' : changed ? '' : ' clean');
    dot.title = dirty.has(row.dataset.id) ? '保存待ちの変更あり' : changed ? '前回出力から変更あり' : '出力済み';
  }
  const t = selected();
  if (t) {
    $('#selected-row').textContent = `行 ${String(t.order).padStart(3,'0')}`;
    $('#selected-name').textContent = t.draft.name || '名称未入力';
    $('#selection-label').textContent = `行 ${t.order} · ${t.draft.name || '名称未入力'}`;
    const changed = session.changed(t.id);
    const baseline = session.store._output?.terms?.[t.id];
    $('#draft-badge').textContent = !session.store._output?.docsHash ? '出力履歴なし' : !baseline ? '未出力' : changed ? '前回出力から変更あり' : '出力済み';
    $('#draft-badge').classList.toggle('clean',!changed);
    $('#characters').textContent = `${plainText(t.draft).length}文字`;
  }
  schedulePreview();
  $('#save-status').className = dirty.size ? 'pending' : '';
  $('#save-status').textContent = dirty.size ? `${dirty.size}行の保存待ち` : '✓ このPCに保存済み';
}
function edit(id, patch, origin) {
  session.edit(id,patch);
  syncRow(id,origin);
  if (id === selectedId) {
    if (origin !== $('#detail-body') && 'body' in patch) $('#detail-body').innerHTML = nodesToHTML(selected().draft.body);
    if ('images' in patch) imageOptions(selected().draft.images);
    if ('autoLink' in patch) $('#detail-auto').checked = selected().draft.autoLink;
   
  }
  updateStatus();
  clearTimeout(saveTimer); saveTimer = setTimeout(flush,900);
}
async function flush() {
  clearTimeout(saveTimer);
  if (!session) return false;
  if (session.dirtyIds().length) $('#save-status').textContent = '下書きを保存中…';
  try {
    await session.flush();
    updateStatus();
    if (!session.blocked) $('#error').hidden = true;
   
    return true;
  } catch(error) {
    showError(error); updateStatus(); $('#save-status').textContent = '保存できませんでした'; $('#save-status').className = 'failed';
    return false;
  }
}
function setBusy(value) {
  busy = value;
  $('#sheet-scroll').inert = value; $('#detail').inert = value;
  $('#new').disabled = value; $('#save').disabled = value;
  updateStatus();
}
async function mutate(action) {
  if (busy) return;
  setBusy(true);
  try {
    if (!await flush()) return;
    const result = await request(`/api/${action}`,{id:selectedId,revision:session.store.revision});
    session.replace(result.store);
    if (action === 'new') {
      $('#search').value = ''; $('#filter').value = 'all'; $('#sort').value = 'input';
      $('#show-columns').checked = true; $('#sheet-scroll').classList.remove('hide-aux');
    }
    selectedId = result.selectedId; renderTable(); populateDetail(selectedId);
    if (action === 'new') { openDetail(true); rowFor(selectedId)?.querySelector('[data-field="name"]').focus(); }
    toast('新しい行を追加しました');
  } catch(error) { showError(error); }
  finally { setBusy(false); }
}
function openDetail(open) {
  $('#workspace').classList.toggle('collapsed',!open);
  $('#toggle-detail').textContent = open ? '編集欄を閉じる' : '編集欄を開く';
  $('#toggle-detail').setAttribute('aria-expanded',String(open));
  remember('detail-open',open);
}
function setFontSize(value) {
  const size = [12,14,16,18,20,22,24].includes(Number(value)) ? Number(value) : 16;
  document.documentElement.style.setProperty('--editor-font-size',size + 'px');
  $('#font-size').value = String(size);
  remember('font-size',size);
  if (session) {
    setHeight(Number($('#splitter').getAttribute('aria-valuenow')));
    rowFor(selectedId)?.scrollIntoView({block:'nearest'});
  }
}
function setHeight(height) {
  const maximum = Math.max(200, Math.min(650,$('#workspace').clientHeight - 170));
  const body = $('#detail-body');
  const controls = $('.detail-header').offsetHeight + $('.rich-toolbar').offsetHeight + $('.detail-options').offsetHeight;
  const minimum = Math.min(maximum,Math.max(200,Math.ceil(controls + parseFloat(getComputedStyle(body).lineHeight) * 2 + 30)));
  height = Math.round(Math.max(minimum,Math.min(maximum,height)));
  document.documentElement.style.setProperty('--dock-height',height + 'px');
  $('#splitter').setAttribute('aria-valuemin',String(minimum));
  $('#splitter').setAttribute('aria-valuemax',String(maximum));
  $('#splitter').setAttribute('aria-valuenow',String(height));
  remember('detail-height',height);
}

$('#rows').addEventListener('focusin',event => {
  const row = event.target.closest('tr[data-id]'); if (!row) return;
  if (row.dataset.id !== selectedId) populateDetail(row.dataset.id);
  const field = event.target.dataset.field;
  if (field) focusSnapshot = {id:row.dataset.id,field,value:clone(session.get(row.dataset.id).draft[field])};
  if (event.target.isContentEditable) activeRich = event.target;
});
$('#rows').addEventListener('click',event => {
  const row = event.target.closest('tr[data-id]'); if (!row) return;
  if (row.dataset.id !== selectedId) populateDetail(row.dataset.id);
  if (event.target.closest('a')) event.preventDefault();
  if (event.target.closest('.image-cell')) { openDetail(true); imagePicker.refresh(); $('#image-dialog').showModal(); }
});
$('#rows').addEventListener('input',event => {
  const field = event.target.dataset.field, row = event.target.closest('tr[data-id]');
  if (!field || !row || field === 'image') return;
  const value = field === 'body' ? readNodes(event.target) : field === 'autoLink' ? event.target.checked : event.target.value;
  edit(row.dataset.id,{[field]:value},event.target);
});
$('#rows').addEventListener('keydown',event => {
  const row = event.target.closest('tr[data-id]'), field = event.target.dataset.field;
  if (!row || !field || event.isComposing) return;
  if (event.key === 'Escape' && focusSnapshot?.id === row.dataset.id && focusSnapshot.field === field) {
    event.preventDefault(); edit(row.dataset.id,{[field]:clone(focusSnapshot.value)}); event.target.blur(); return;
  }
  if (event.key === 'Enter' && !event.shiftKey && field !== 'image' && field !== 'autoLink') {
    event.preventDefault();
    const next = visibleIds[visibleIds.indexOf(row.dataset.id)+1];
    if (next) rowFor(next)?.querySelector(`[data-field="${field}"]`).focus();
    else event.target.blur();
  }
});
$('#detail-body').addEventListener('focus',() => { activeRich = $('#detail-body'); });
$('#detail-body').addEventListener('input',() => edit(selectedId,{body:readNodes($('#detail-body'))},$('#detail-body')));
$('#detail-body').addEventListener('click',event => { if (event.target.closest('a')) event.preventDefault(); });
$('#manage-images').addEventListener('click',() => { imagePicker.refresh(); $('#image-dialog').showModal(); });
$('#close-images').addEventListener('click',() => $('#image-dialog').close());
$('#detail-auto').addEventListener('change',() => edit(selectedId,{autoLink:$('#detail-auto').checked}));

document.addEventListener('selectionchange',() => {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0), root = richRoot(range.commonAncestorContainer);
  if (root && (root.id === 'detail-body' || root.classList.contains('body-cell-editor'))) { activeRich = root; savedRange = range.cloneRange(); }
});
function restoreRange() {
  const root = activeRich?.isConnected ? activeRich : $('#detail-body');
  root.focus();
  const range = savedRange && root.contains(savedRange.commonAncestorContainer) ? savedRange : document.createRange();
  if (range !== savedRange) { range.selectNodeContents(root); range.collapse(false); }
  const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
  return {root,range};
}
function commitRich(root) { const id = root.closest('tr')?.dataset.id || selectedId; edit(id,{body:readNodes(root)},root); }
function insertNode(node) {
  const {root,range} = restoreRange();
  range.deleteContents(); range.insertNode(node); range.setStartAfter(node); range.collapse(true);
  const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
  savedRange = range.cloneRange(); commitRich(root);
}
function unwrap(node) { node.replaceWith(...node.childNodes); }
function applyFormat(kind) {
  const {root,range} = restoreRange();
  if (range.collapsed) return toast('書式を付けたい文字を選択してください');
  const tag = kind === 'bold' ? 'strong' : 'em';
  const parent = range.startContainer.nodeType === 1 ? range.startContainer : range.startContainer.parentElement;
  const existing = parent.closest(tag);
  if (existing && root.contains(existing)) { unwrap(existing); savedRange = null; commitRich(root); return; }
  const node = document.createElement(tag); node.append(range.extractContents()); insertNode(node);
}
function fillTargets() {
  const query = $('#link-search').value.trim().toLocaleLowerCase(), old = $('#link-target').value;
  const matches = session.store.terms.filter(t => t.draft.name && [t.draft.name,t.draft.reading].join(' ').toLocaleLowerCase().includes(query));
  $('#link-target').innerHTML = matches.map(t => `<option value="${esc(t.id)}">${esc(t.draft.name)}</option>`).join('');
  if (matches.some(t => t.id === old)) $('#link-target').value = old;
  if (automaticLabel) $('#link-label').value = session.get($('#link-target').value)?.draft.name || '';
}
function openLink(kind) {
  linkKind = kind;
  const {root,range} = restoreRange();
  const parent = range.startContainer.nodeType === 1 ? range.startContainer : range.startContainer.parentElement;
  const anchor = parent.closest('a');
  if (range.collapsed && anchor && root.contains(anchor)) range.selectNode(anchor);
  savedRange = range.cloneRange();
  const label = range.toString(); automaticLabel = !label;
  $('#link-label').value = label; $('#link-search').value = ''; $('#link-url').value = anchor?.dataset.url || '';
  $('#term-target-fields').hidden = kind !== 'term'; $('#url-target-field').hidden = kind !== 'url';
  $('#link-target').required = kind === 'term'; $('#link-url').required = kind === 'url';
  $('#link-title').textContent = kind === 'term' ? '用語へのリンク' : '外部サイトへのリンク';
  $('#link-error').hidden = true; fillTargets();
  if (anchor?.dataset.termId) $('#link-target').value = anchor.dataset.termId;
  $('#link-dialog').showModal(); (kind === 'term' ? $('#link-search') : $('#link-url')).focus();
}
$('.rich-toolbar').addEventListener('mousedown',event => { if (event.target.closest('button')) event.preventDefault(); });
document.querySelectorAll('[data-format]').forEach(button => button.addEventListener('click',() => applyFormat(button.dataset.format)));
$('#term-link').addEventListener('click',() => openLink('term'));
$('#url-link').addEventListener('click',() => openLink('url'));
$('#unlink').addEventListener('click',() => {
  const {root,range} = restoreRange();
  const parent = range.startContainer.nodeType === 1 ? range.startContainer : range.startContainer.parentElement;
  const nearest = parent.closest('a');
  const links = nearest && root.contains(nearest) ? [nearest] : [...root.querySelectorAll('a')].filter(node => range.intersectsNode(node));
  if (!links.length) return toast('手動リンクの中にカーソルを置くか、文字を選択してください');
  links.forEach(unwrap); savedRange = null; commitRich(root);
});
$('#noauto').addEventListener('click',() => {
  const {root,range} = restoreRange();
  if (range.collapsed) return toast('自動リンクから除外する文字を選択してください');
  const parent = range.startContainer.nodeType === 1 ? range.startContainer : range.startContainer.parentElement;
  const existing = parent.closest('[data-no-auto]');
  if (existing && root.contains(existing)) { unwrap(existing); savedRange = null; commitRich(root); return; }
  const node = document.createElement('span'); node.dataset.noAuto = 'true'; node.append(range.extractContents()); insertNode(node);
});
$('#link-search').addEventListener('input',fillTargets);
$('#link-target').addEventListener('change',() => { if (automaticLabel) $('#link-label').value = session.get($('#link-target').value)?.draft.name || ''; });
$('#link-label').addEventListener('input',() => automaticLabel = false);
$('#link-cancel').addEventListener('click',() => $('#link-dialog').close());
$('#link-form').addEventListener('submit',event => {
  event.preventDefault();
  const node = document.createElement('a'); node.textContent = $('#link-label').value;
  if (linkKind === 'term') { node.dataset.termId = $('#link-target').value; node.href = '#' + node.dataset.termId; }
  else {
    try { const url = new URL($('#link-url').value); if (!['https:','http:'].includes(url.protocol) || !url.hostname) throw new Error(); node.href = url.href; node.dataset.url = url.href; }
    catch { $('#link-error').textContent = 'http:// または https:// のURLを入力してください。'; $('#link-error').hidden = false; return; }
  }
  $('#link-dialog').close(); insertNode(node);
});
document.addEventListener('paste',event => {
  const root = richRoot(event.target);
  if (!root) return;
  event.preventDefault(); activeRich = root;
  const selection = window.getSelection(); savedRange = selection.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
  const span = document.createElement('span');
  event.clipboardData.getData('text/plain').split(/\r?\n/).forEach((line,i) => { if (i) span.append(document.createElement('br')); span.append(document.createTextNode(line)); });
  insertNode(span);
});
document.addEventListener('drop',event => { if (richRoot(event.target)) { event.preventDefault(); toast('画像は「画像を追加」から選択してください'); } });

$('#font-size').addEventListener('change',() => setFontSize($('#font-size').value));
for (const id of ['search','filter','sort']) $('#' + id).addEventListener(id === 'search' ? 'input' : 'change',renderTable);
$('#density').addEventListener('change',() => { $('#sheet').className = 'density-' + $('#density').value; remember('density',$('#density').value); });
$('#show-columns').addEventListener('change',() => { $('#sheet-scroll').classList.toggle('hide-aux',!$('#show-columns').checked); remember('show-columns',$('#show-columns').checked); });
$('#toggle-detail').addEventListener('click',() => openDetail($('#workspace').classList.contains('collapsed')));
$('#save').addEventListener('click',flush);
$('#new').addEventListener('click',() => mutate('new'));
$('#image-upload').addEventListener('change',async event => {
  const files = [...event.target.files], id = selectedId; if (!files.length) return;
  setBusy(true);
  try {
    const names = await uploadImages(files); assets = [...new Set([...assets,...names])];
    const images = [...session.get(id).draft.images,...names]; edit(id,{images}); imageOptions(images); toast('説明画像を追加しました');
  } catch(error) { showError(error); } finally { event.target.value = ''; setBusy(false); }
});
function download(blob,filename) { const url = URL.createObjectURL(blob), link = document.createElement('a'); link.href = url; link.download = filename; link.click(); setTimeout(() => URL.revokeObjectURL(url),30000); }
$('#backup').addEventListener('click',() => {
  download(new Blob([JSON.stringify(session.store,null,2)],{type:'application/json;charset=utf-8'}),'glossary-table-backup.json');
  toast('現在の入力を含めてバックアップしました');
});
$('#splitter').addEventListener('pointerdown',event => {
  const start = event.clientY, height = Number($('#splitter').getAttribute('aria-valuenow'));
  $('#splitter').setPointerCapture(event.pointerId); document.body.classList.add('resizing');
  function move(e) { setHeight(height + start - e.clientY); }
  function stop() { document.body.classList.remove('resizing'); $('#splitter').removeEventListener('pointermove',move); $('#splitter').removeEventListener('pointerup',stop); $('#splitter').removeEventListener('pointercancel',stop); }
  $('#splitter').addEventListener('pointermove',move); $('#splitter').addEventListener('pointerup',stop); $('#splitter').addEventListener('pointercancel',stop);
});
$('#splitter').addEventListener('keydown',event => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') { event.preventDefault(); setHeight(Number($('#splitter').getAttribute('aria-valuenow')) + (event.key === 'ArrowUp' ? 20 : -20)); }
});
window.addEventListener('resize',() => setHeight(Number($('#splitter').getAttribute('aria-valuenow'))));
document.addEventListener('keydown',event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); flush(); }
  if (event.key === 'F4' && !$('#link-dialog').open) { event.preventDefault(); openDetail($('#workspace').classList.contains('collapsed')); }
});
window.addEventListener('beforeunload',event => { if (session?.dirtyIds().length) { event.preventDefault(); event.returnValue = ''; } });

installShell({save:flush,getStore:()=>session.store,getSelected:()=>selectedId,showError,toast,isBusy:()=>busy,onOutput:()=>{renderTable();updateStatus();}});
try {
  const data = await request('/api/store');
  session = new DraftSession(data.store,request); assets = data.assets;
  $('#density').value = preference('density','compact'); $('#sheet').className = 'density-' + $('#density').value;
  $('#show-columns').checked = preference('show-columns',true); $('#sheet-scroll').classList.toggle('hide-aux',!$('#show-columns').checked);
  renderTable(); populateDetail(initialSelection(session.store)); activeRich = $('#detail-body');
  setHeight(preference('detail-height',330)); openDetail(preference('detail-open',true));
  setFontSize(readFontSize());
  document.documentElement.dataset.editorState = 'ready';
} catch(error) {
  document.documentElement.dataset.editorState = 'failed';
  $('#count').textContent = '読み込めませんでした';
  showError(error); $('#save-status').textContent = '読み込めませんでした';
}

$('#preview').addEventListener('click',event=>{const link=event.target.closest('a[href^="#term-"]');if(link){event.preventDefault();const id=link.getAttribute('href').slice(1);if(session.get(id)){populateDetail(id);rowFor(id)?.scrollIntoView({block:'nearest'});}}});
