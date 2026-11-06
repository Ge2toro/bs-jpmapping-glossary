const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const readFontSize = () => { try { return [12,14,16,18,20,22,24].includes(Number(localStorage.getItem('glossary-editor-font-size'))) ? Number(localStorage.getItem('glossary-editor-font-size')) : 16; } catch { return 16; } };
export function installShell({save, getStore, getSelected, showError, toast, isBusy = () => false, onOutput = () => {}}) {
  const font = document.querySelector('#font-size');
  const applyFont = () => { document.documentElement.style.setProperty('--editor-font-size',font.value + 'px'); try { localStorage.setItem('glossary-editor-font-size',font.value); } catch {} };
  font.value = String(readFontSize()); applyFont(); font.addEventListener('change',applyFont);
  const views = document.querySelector('#view-mode');
  views.value = location.pathname === '/write' ? 'write' : 'table';
  views.addEventListener('change',async () => {
    if (isBusy()) { views.value = location.pathname === '/write' ? 'write' : 'table'; return toast('保存・画像追加が完了してから切り替えてください'); }
    views.disabled = true;
    const workspace = document.querySelector('.workspace'); workspace.inert = true;
    try {
      if (!await save()) return;
      try { sessionStorage.setItem('glossary-selected',getSelected()); } catch {}
      location.assign('/' + views.value);
    } catch(error) { showError(error); }
    finally { views.disabled = false; workspace.inert = false; views.value = location.pathname === '/write' ? 'write' : 'table'; }
  });
  document.querySelector('#publish').addEventListener('click',async event => {
    if (isBusy()) return toast('処理が完了してから出力してください');
    const button = event.currentTarget; button.disabled = true;
    const workspace = document.querySelector('.workspace'); workspace.inert = true;
    try {
      if (!await save()) return;
      const response = await fetch('/api/publish',{method:'POST',headers:{'Content-Type':'application/json','X-Glossary-Editor':'1'},body:JSON.stringify({revision:getStore().revision})});
      const result = await response.json(); if (!response.ok) throw new Error(result.error);
      getStore()._output = result.output; onOutput(); toast(result.message);
    } catch(error) { showError(error); }
    finally { button.disabled = false; workspace.inert = false; }
  });
}
export const initialSelection = store => {
  let id; try { id = sessionStorage.getItem('glossary-selected'); } catch {}
  return store.terms.find(t => t.id === id)?.id || store.terms[0]?.id;
};
export function inlinePreview({request, getId, getDoc, root, warning}) {
  let timer, sequence = 0;
  return () => {
    clearTimeout(timer);
    const current = ++sequence;
    timer = setTimeout(async () => {
      const id = getId(), doc = getDoc(); if (!id || !doc) return;
      try {
        const data = await request('/api/render', {id, doc});
        if (sequence !== current || getId() !== id) return;
        root.innerHTML = data.html;
        warning.textContent = data.warnings.join(' '); warning.hidden = !data.warnings.length;
      } catch(error) {
        if (sequence !== current || getId() !== id) return;
        warning.textContent = 'プレビューを更新できませんでした。' + error.message; warning.hidden = false;
      }
    }, 200);
  };
}

export class ImagePicker {
  constructor(root, onChange) { this.root=root; this.onChange=onChange; this.value=[]; this.assets=[]; }
  setAssets(assets) { this.assets=assets; this.render(); }
  setValue(images) { this.value=[...images]; this.render(); }
  commit() { this.render(); this.onChange([...this.value]); }
  async refresh() {
    try {
      const response = await fetch('/api/images');
      const result = await response.json(); if (!response.ok) throw new Error(result.error);
      this.setAssets(result.assets);
    } catch(error) { const status=this.root.querySelector('.image-library-status'); if(status) status.textContent='画像一覧を更新できませんでした。'+error.message; }
  }
  render() {
    const options=this.assets.filter(n => !this.value.includes(n));
    this.root.innerHTML=`<ol class="image-list">${this.value.map((n,i) => `<li><img src="/assets/${encodeURIComponent(n)}" alt="説明画像 ${i+1}"><span>${i+1}. ${escape(n)}</span><button type="button" data-up="${i}" aria-label="画像${i+1}を前へ" ${i===0?'disabled':''}>↑</button><button type="button" data-down="${i}" aria-label="画像${i+1}を後へ" ${i===this.value.length-1?'disabled':''}>↓</button><button type="button" data-remove="${i}" aria-label="画像${i+1}を外す">外す</button></li>`).join('')}</ol><p ${this.value.length?'hidden':''}>画像はまだ選択されていません。</p><div class="image-add"><select aria-label="追加する既存画像"><option value="">既存画像を選択</option>${options.map(n=>`<option>${escape(n)}</option>`).join('')}</select><button type="button" class="button" data-add>選択画像を追加</button></div><small>上から順に説明の下へ横並びで表示します。</small>`;
    this.root.querySelector('[data-add]').onclick=()=>{ const name=this.root.querySelector('select').value; if(name) { this.value.push(name); this.commit(); } };
    const refresh=document.createElement('button'); refresh.type='button'; refresh.textContent='一覧を更新'; refresh.onclick=()=>this.refresh(); this.root.querySelector('.image-add').append(refresh);
    const status=document.createElement('p'); status.className='image-library-status'; status.textContent='docs/images の画像と、取り込み済みの画像から選べます。'; this.root.append(status);
    this.root.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{this.value.splice(Number(b.dataset.remove),1);this.commit();});
    for(const direction of ['up','down']) this.root.querySelectorAll('[data-'+direction+']').forEach(b=>b.onclick=()=>{ const i=Number(b.dataset[direction]),j=i+(direction==='up'?-1:1); [this.value[i],this.value[j]]=[this.value[j],this.value[i]];this.commit(); });
  }
}
export async function uploadImages(files) {
  const names=[];
  for(const file of files) {
    if(file.size>12*1024*1024) throw new Error('12MB以下の画像を選択してください。');
    const response=await fetch('/api/image',{method:'POST',headers:{'X-Glossary-Editor':'1','X-Image-Name':encodeURIComponent(file.name)},body:file});
    const result=await response.json(); if(!response.ok) throw new Error(result.error); names.push(result.name);
  }
  return names;
}
