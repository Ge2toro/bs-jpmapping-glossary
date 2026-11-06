export const clone = value => JSON.parse(JSON.stringify(value));
export const signature = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b))) : v);

// Edits stay in the local document while saves are queued in server-revision order.
export class DraftSession {
  constructor(store, request) {
    this.request = request;
    this.queue = Promise.resolve(true);
    this.blocked = false;
    this.replace(store);
  }
  replace(store) {
    this.store = clone(store);
    this.baselines = new Map(this.store.terms.map(t => [t.id, signature(t.draft)]));
  }
  get(id) { return this.store.terms.find(t => t.id === id); }
  edit(id, patch) {
    const record = this.get(id);
    if (!record) throw new Error('用語が見つかりません。');
    Object.assign(record.draft, clone(patch));
  }
  dirtyIds() { return this.store.terms.filter(t => signature(t.draft) !== this.baselines.get(t.id)).map(t => t.id); }
  changed(id) { const t = this.get(id); return signature(t.draft) !== signature(this.store._output?.terms?.[id] || null); }
  flush() {
    this.queue = this.queue.catch(() => false).then(async () => {
      if (this.blocked) throw new Error('別の画面との更新が競合しています。バックアップで入力を保存してから再読み込みしてください。');
      for (const id of this.dirtyIds()) {
        const doc = clone(this.get(id).draft);
        const saved = await this.request('/api/save', {id, doc, revision:this.store.revision});
        this.store.revision = saved.store.revision;
        this.store.updatedAt = saved.store.updatedAt;
        this.baselines.set(id, signature(doc));
      }
      return true;
    });
    return this.queue;
  }
}
