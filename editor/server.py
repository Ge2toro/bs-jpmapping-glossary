"""Loopback editor; explicit publication writes ../docs/."""
from __future__ import annotations

import argparse
from copy import deepcopy
import hashlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import mimetypes
import os
from pathlib import Path
import re
import threading
import urllib.parse
import uuid
import webbrowser

from model import create_blank, now, validate_doc
from model import render_entry, selected_docs, warnings_for
from publish import write_site, output_snapshot
from mkdocs_preview import MkDocsPreview
from model import asset_path, image_library

ROOT = Path(__file__).resolve().parent


def static_content_type(path):
    # Windows registry MIME associations must not override executable module types.
    explicit = {".mjs": "text/javascript", ".js": "text/javascript", ".css": "text/css", ".html": "text/html"}
    mime = explicit.get(path.suffix.lower()) or mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return mime + "; charset=utf-8" if mime.startswith("text/") or mime == "application/javascript" else mime


class Store:
    def __init__(self, root=ROOT):
        self.root = Path(root).resolve()
        self.path = self.root / "data/store.json"
        self.lock = threading.RLock()

    def read(self):
        store = json.loads(self.path.read_text(encoding="utf-8"))
        store["_output"] = output_snapshot(self.root)
        return store

    def write(self, store):
        previous = self.path.read_bytes()
        history = self.root / "data/history"
        history.mkdir(exist_ok=True)
        backup = history / f'revision-{store["revision"] - 1:06d}-{uuid.uuid4().hex[:8]}.json'
        backup.write_bytes(previous)
        temp = self.path.with_suffix(".tmp")
        try:
            with temp.open("w", encoding="utf-8", newline="\n") as f:
                json.dump({key: value for key, value in store.items() if key != "_output"}, f, ensure_ascii=False, indent=2)
                f.flush()
                os.fsync(f.fileno())
            os.replace(temp, self.path)
        finally:
            if temp.exists():
                temp.unlink()
        for old in sorted(history.glob("revision-*.json"), key=lambda p: p.stat().st_mtime, reverse=True)[20:]:
            old.unlink()

    def mutate(self, data, action):
        with self.lock:
            store = self.read()
            if data.get("revision") != store["revision"]:
                return None
            ids = {t["id"] for t in store["terms"]}
            term = next((t for t in store["terms"] if t["id"] == data.get("id")), None)
            if action == "new":
                term = {"id": "term-" + uuid.uuid4().hex[:12], "order": max((t["order"] for t in store["terms"]), default=0) + 1, "draft": create_blank(), "published": None, "updatedAt": now()}
                store["terms"].append(term)
            elif not term:
                raise ValueError("用語が見つかりません。")
            elif action == "save":
                doc = data.get("doc")
                validate_doc(doc, ids)
                term["draft"] = deepcopy(doc)
            else:
                raise ValueError("未対応の操作です。")
            term["updatedAt"] = now()
            store["revision"] += 1
            store["updatedAt"] = now()
            self.write(store)
            return {"store": store, "selectedId": term["id"]}


class Handler(BaseHTTPRequestHandler):
    def send(self, status, body, content_type="application/json; charset=utf-8", headers=None):
        if isinstance(body, (dict, list)):
            body = json.dumps(body, ensure_ascii=False).encode("utf-8")
        elif isinstance(body, str):
            body = body.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        for key, value in (headers or {}).items():
            self.send_header(key, value)
        self.end_headers()
        self.wfile.write(body)

    def valid_host(self):
        return self.headers.get("Host") in [f"127.0.0.1:{self.server.server_port}", f"localhost:{self.server.server_port}"]

    def do_GET(self):
        if not self.valid_host():
            return self.send(403, {"error": "ローカル接続のみ利用できます。"})
        parsed = urllib.parse.urlparse(self.path)
        path = urllib.parse.unquote(parsed.path)
        root = self.server.store.root
        try:
            if path == "/api/health":
                return self.send(200, {"ok": True, "app": "glossary-editor", "schemaVersion": 2})
            if path == "/api/store":
                return self.send(200, {"store": self.server.store.read(), "assets": image_library(root / 'assets')})
            if path == '/api/images':
                return self.send(200, {'assets': image_library(root / 'assets')})
            if path == "/api/backup":
                return self.send(200, self.server.store.path.read_bytes(), headers={"Content-Disposition": 'attachment; filename="glossary-backup.json"'})
            if path == "/mkdocs-preview":
                return self.send(200, (root / "web/mkdocs-preview.html").read_bytes(), "text/html; charset=utf-8")
            if path in ["/", "/table", "/write"]:
                target = root / ("web/write.html" if path == "/write" else "web/index.html")
            elif path.startswith("/web/") or path.startswith("/assets/"):
                subfolder = "web" if path.startswith("/web/") else "assets"
                target = (root / path.lstrip("/")).resolve()
                # relative_to is available in Python 3.8 as well. is_relative_to
                # previously crashed here, after the HTML shell had already loaded.
                try:
                    target.relative_to(root / subfolder)
                except ValueError:
                    return self.send(404, {"error": "ファイルが見つかりません。"})
                if subfolder == 'assets':
                    target = asset_path(root / 'assets', target.name)
            else:
                return self.send(404, {"error": "ページが見つかりません。"})
            if not target.is_file():
                return self.send(404, {"error": "ファイルが見つかりません。"})
            return self.send(200, target.read_bytes(), static_content_type(target))
        except (ValueError, OSError) as error:
            return self.send(400, {"error": str(error)})

    def do_POST(self):
        origin = self.headers.get("Origin")
        allowed = [f"http://127.0.0.1:{self.server.server_port}", f"http://localhost:{self.server.server_port}"]
        if not self.valid_host() or self.headers.get("X-Glossary-Editor") != "1" or (origin and origin not in allowed):
            return self.send(403, {"error": "編集画面から操作してください。"})
        path = urllib.parse.urlparse(self.path).path
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length < 0 or length > 12 * 1024 * 1024:
                raise ValueError("データが大きすぎます。")
            raw = self.rfile.read(length)
            if path == "/api/image":
                ext = next((ext for magic, ext in [(b"\xff\xd8\xff", ".jpg"), (b"\x89PNG\r\n\x1a\n", ".png"), (b"GIF8", ".gif")] if raw.startswith(magic)), None)
                if raw.startswith(b"RIFF") and raw[8:12] == b"WEBP":
                    ext = ".webp"
                if not ext:
                    raise ValueError("JPG・PNG・GIF・WebPの画像を選択してください。")
                original = urllib.parse.unquote(self.headers.get('X-Image-Name', ''))
                if ext == '.jpg' and Path(original).suffix.lower() == '.jpeg':
                    ext = '.jpeg'
                stem = re.sub(r'[^\w. -]', '_', original.rsplit('.', 1)[0]).strip(' .')[:160] or 'image'
                name = stem + ext
                with self.server.store.lock:
                    existing = asset_path(self.server.store.root / 'assets', name)
                    if existing.exists() and existing.read_bytes() != raw:
                        stem += '-' + hashlib.sha256(raw).hexdigest()[:20]
                        name = stem + ext
                    counter = 1
                    while asset_path(self.server.store.root / 'assets', name).exists() and asset_path(self.server.store.root / 'assets', name).read_bytes() != raw:
                        name = stem + '-' + str(counter) + ext
                        counter += 1
                    if not asset_path(self.server.store.root / 'assets', name).exists():
                        (self.server.store.root / 'assets' / name).write_bytes(raw)
                return self.send(200, {"name": name})
            data = json.loads(raw)
            if path == '/api/render':
                store = self.server.store.read()
                ids = {t['id'] for t in store['terms']}
                if data.get('id') not in ids:
                    raise ValueError('用語が見つかりません。')
                doc = data['doc']
                validate_doc(doc, ids)
                docs = selected_docs(store, 'draft')
                docs[data['id']] = doc
                return self.send(200, {'html': render_entry(data['id'], doc, docs), 'warnings': warnings_for(doc, docs, self.server.store.root / 'assets')})
            if path == "/api/start-preview":
                with self.server.store.lock:
                    if not hasattr(self.server, "mkdocs_preview"):
                        self.server.mkdocs_preview = MkDocsPreview(self.server.store.root)
                return self.send(200, {"url": self.server.mkdocs_preview.start()})
            if path == "/api/publish":
                with self.server.store.lock:
                    store = self.server.store.read()
                    if data.get('revision') != store['revision']:
                        return self.send(409, {'error': '別の画面で原稿が更新されました。再読み込みしてから出力してください。'})
                    return self.send(200, write_site(self.server.store.root, store))
            if path in ["/api/save", "/api/new"]:
                result = self.server.store.mutate(data, path.rsplit("/", 1)[1])
                return self.send(409, {"error": "別の画面でデータが更新されています。入力をコピーしてからページを再読み込みしてください。"}) if result is None else self.send(200, result)
            return self.send(404, {"error": "操作が見つかりません。"})
        except (ValueError, KeyError, TypeError, OSError) as error:
            return self.send(400, {"error": str(error)})

    def log_message(self, fmt, *args):
        print(f"{self.log_date_time_string()} {fmt % args}", flush=True)


def main():
    parser = argparse.ArgumentParser(description="Beat Saber 用語集エディター")
    parser.add_argument("--port", type=int, default=8780)
    parser.add_argument("--open", action="store_true")
    args = parser.parse_args()
    if not (ROOT / "data/store.json").exists():
        raise SystemExit("data/store.json がありません。READMEを確認してください。")
    try:
        server = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
    except OSError:
        raise SystemExit(f"ポート {args.port} を使用できません。別の起動中画面を閉じるか、--port 8766 で起動してください。")
    server.daemon_threads = True
    server.store = Store()
    url = f"http://127.0.0.1:{server.server_port}"
    print(f"Glossary editor: {url}\nStop: Ctrl+C", flush=True)
    if args.open:
        threading.Timer(0.6, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        if hasattr(server, "mkdocs_preview"):
            server.mkdocs_preview.stop()
        server.server_close()


if __name__ == "__main__":
    main()
