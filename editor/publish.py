"""Generate the existing MkDocs page from adopted editor documents (no Excel)."""
from datetime import datetime
from html import escape
import json
import hashlib
import os
from pathlib import Path
import shutil
import uuid

from model import group_for, render_body, selected_docs, sort_key, validate_doc, warnings_for
from model import asset_path


def markdown(store, template):
    if template.count('@@') != 1:
        raise ValueError('_template.md の用語表の挿入位置を確認してください。')
    docs = selected_docs(store, 'draft')
    ids = {t['id'] for t in store['terms']}
    names = [d['name'] for d in docs.values()]
    if len(names) != len(set(names)) or any(name in ids for name in names):
        raise ValueError('用語名が重複しているか、用語IDと同じ名前です。')
    lines, group = [], None
    for tid, doc in sorted(docs.items(), key=lambda pair: sort_key(pair[1]['reading'])):
        try:
            validate_doc(doc, ids, complete=True)
        except ValueError as error:
            raise ValueError((doc['name'] or '名称未入力') + ': ' + str(error))
        warnings = warnings_for(doc, docs)
        if warnings:
            raise ValueError(' '.join(warnings))
        next_group = group_for(doc['reading'])
        if group != next_group:
            lines.extend(['\n## ' + next_group + '\n', '| 用語 | 意味 |', '| --- | --- |'])
            group = next_group
        heading = '<span id="{}"></span><span id="{}"></span><strong>{}</strong><br><small><em>{}</em></small>'.format(escape(tid, quote=True), escape(doc['name'], quote=True), escape(doc['name']), escape(doc['displayReading']))
        body = render_body(doc, docs)
        if doc['images']:
            body += '<br>' + ' '.join('<img src="images/{}" width="150" alt="{}の説明画像">'.format(escape(image, quote=True), escape(doc['name'], quote=True)) for image in doc['images'])
        lines.append('| {} | {} |'.format(heading.replace('|', '&#124;'), body.replace('|', '&#124;').replace('\n', '&#10;').replace('\r', '&#13;')))
    return template.replace('@@', '\n'.join(lines)).replace('{{UPDATE_DATE}}', datetime.now().strftime('%Y年%m月%d日'))


def write_site(root, store):
    """root is editor/, and only an explicit action writes its parent docs/."""
    root = Path(root).resolve()
    repo = root.parent
    docs = selected_docs(store, 'draft')
    if not docs:
        raise ValueError('出力する用語がありません。')
    for doc in docs.values():
        warnings = warnings_for(doc, docs, root / 'assets')
        if warnings:
            raise ValueError(doc['name'] + ': ' + ' '.join(warnings))
    content = markdown(store, (repo / '_template.md').read_text(encoding='utf-8'))
    target = repo / 'docs/index.md'
    backup = root / 'data/site-backups' / (datetime.now().strftime('%Y%m%d-%H%M%S-') + uuid.uuid4().hex[:8])
    backup.mkdir(parents=True)
    if target.exists():
        shutil.copy2(target, backup / 'index.md')
    (backup / 'store.json').write_text(json.dumps(store, ensure_ascii=False, indent=2), encoding='utf-8')
    images_dir = repo / 'docs/images'
    images_dir.mkdir(parents=True, exist_ok=True)
    for name in sorted({image for doc in docs.values() for image in doc['images']}):
        source, destination = asset_path(root / 'assets', name), images_dir / name
        if destination.exists() and source.read_bytes() == destination.read_bytes():
            continue
        if destination.exists():
            (backup / 'images').mkdir(exist_ok=True)
            shutil.copy2(destination, backup / 'images' / name)
        temporary = destination.with_name(destination.name + '.tmp')
        shutil.copyfile(source, temporary)
        os.replace(temporary, destination)
    temporary = target.with_name('index.md.tmp')
    try:
        with temporary.open('w', encoding='utf-8', newline='\n') as output:
            output.write(content)
            output.flush()
            os.fsync(output.fileno())
        os.replace(temporary, target)
    finally:
        if temporary.exists():
            temporary.unlink()
    output = {'docsHash': hashlib.sha256(target.read_bytes()).hexdigest(), 'terms': docs}
    snapshot = root / 'data/last-output.json'
    temporary = snapshot.with_suffix('.tmp')
    temporary.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding='utf-8')
    os.replace(temporary, snapshot)
    return {'terms': len(docs), 'output': output, 'message': '編集原稿をサイト用に出力しました。MkDocsプレビューで確認できます。pushは手動で行ってください。'}


def output_snapshot(root):
    try:
        root = Path(root)
        output = json.loads((root / 'data/last-output.json').read_text(encoding='utf-8'))
        if output['docsHash'] == hashlib.sha256((root.parent / 'docs/index.md').read_bytes()).hexdigest():
            return output
    except (OSError, ValueError, KeyError):
        pass
    return {'terms': {}}


if __name__ == '__main__':
    root = Path(__file__).resolve().parent
    from server import Store
    storage = Store(root)
    with storage.lock:
        print(write_site(root, storage.read())['message'])
