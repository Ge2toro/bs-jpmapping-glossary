import {signature} from './state.mjs';
export const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const plainText = doc => doc.body.map(n => n.type === 'break' ? '\n' : n.text).join('');
export function nodesToHTML(nodes) {
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
export function readNodes(root) {
  const result = [];
  function append(node) {
    if (node.type !== 'break' && !node.text) return;
    const last = result.at(-1);
    if (last && node.type !== 'break' && last.type !== 'break' && signature({...last,text:''}) === signature({...node,text:''})) last.text += node.text;
    else result.push(node);
  }
  function walk(node, marks = {}) {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent.replace(/\u00a0/g, ' ').split('\n').forEach((text,i) => { if (i) append({type:'break'}); append({type:'text',text,...marks}); });
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.tagName === 'BR') { append({type:'break'}); return; }
    const next = {...marks}, tag = node.tagName;
    if (['B','STRONG'].includes(tag)) next.bold = true;
    if (['I','EM'].includes(tag)) next.italic = true;
    if (node.dataset.noAuto) next.noAutoLink = true;
    if (tag === 'A') {
      if (node.dataset.termId) Object.assign(next, {type:'termLink',target:node.dataset.termId});
      else Object.assign(next, {type:'externalLink',url:node.dataset.url || node.getAttribute('href') || ''});
    }
    const block = ['DIV','P','LI','H1','H2','H3','BLOCKQUOTE'].includes(tag);
    if (block && result.length && result.at(-1).type !== 'break') append({type:'break',_block:true});
    [...node.childNodes].forEach(n => walk(n,next));
    if (block && result.at(-1)?.type !== 'break') append({type:'break',_block:true});
  }
  [...root.childNodes].forEach(node => walk(node));
  if (result.at(-1)?._block) result.pop();
  result.forEach(n => delete n._block);
  return result.some(n => n.type !== 'break' && n.text) ? result : [];
}
