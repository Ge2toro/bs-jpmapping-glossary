"""Portable glossary data and a renderer shared by previews and HTML export."""
from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timezone
from html import escape
import json
from pathlib import Path
import re
from string import Template
import unicodedata
from urllib.parse import urlparse

VERSION = 2
TEMPLATES = Path(__file__).resolve().parent / "templates"
GROUPS = ["ア行", "カ行", "サ行", "タ行", "ナ行", "ハ行", "マ行", "ヤ行", "ラ行", "ワ行", "アルファベット", "数字", "その他"]


def now():
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds")


def fingerprint(doc):
    return json.dumps(doc, sort_keys=True, ensure_ascii=False)


def changed(term):
    return fingerprint(term["draft"]) != fingerprint(term.get("published"))


def plain_text(doc):
    return "".join("\n" if n["type"] == "break" else n.get("text", "") for n in doc["body"])


def group_for(reading):
    text = unicodedata.normalize("NFKC", reading.strip())
    if not text:
        return "その他"
    c = text[0]
    if "ぁ" <= c <= "ゖ":
        c = chr(ord(c) + 96)
    for group, chars in zip(GROUPS, ["アァイィウゥエェオォヴ", "カガキギクグケゲコゴヵヶ", "サザシジスズセゼソゾ", "タダチヂッツヅテデトド", "ナニヌネノ", "ハバパヒビピフブプヘベペホボポ", "マミムメモ", "ヤャユュヨョ", "ラリルレロ", "ワヮヰヱヲン"]):
        if c in chars:
            return group
    return "アルファベット" if c.isascii() and c.isalpha() else "数字" if c.isascii() and c.isdigit() else "その他"


def sort_key(reading):
    # Katakana-only source data retains the previous generator's order.
    text = unicodedata.normalize("NFKC", reading.strip())
    text = "".join(chr(ord(c) + 96) if "ぁ" <= c <= "ゖ" else c for c in text)
    small = str.maketrans("ァィゥェォッャュョヮヵヶ", "アイウエオツヤユヨワカケ")
    normalized = "".join(c for c in unicodedata.normalize("NFD", text) if c not in "\u3099\u309a").translate(small)
    vowels = ["アカサタナハマヤラワ", "イキシチニヒミリヰ", "ウクスツヌフムユル", "エケセテネヘメレヱ", "オコソトノホモヨロヲ"]
    output = []
    for i, c in enumerate(normalized):
        if c == "ー" and i:
            previous = normalized[i - 1]
            c = next((v for v, chars in zip("アイウエオ", vowels) if previous in chars), "ン" if previous == "ン" else "ー")
        output.append(c)
    return (GROUPS.index(group_for(reading)), "".join(output), reading)


def boundary_pattern(term):
    def kind(c):
        for pattern in [r"[a-zA-Z0-9_]", r"[ァ-ヶー]", r"[ぁ-ん]", r"[一-龥]"]:
            if re.fullmatch(pattern, c):
                return pattern
        return None
    first, last = kind(term[0]), kind(term[-1])
    return (f"(?<!{first})" if first else "") + re.escape(term) + (f"(?!{last})" if last else "")


def validate_doc(doc, ids, *, complete=False):
    if not isinstance(doc, dict):
        raise ValueError("用語データの形式が正しくありません。")
    for key in ["name", "reading", "displayReading"]:
        if not isinstance(doc.get(key), str) or len(doc[key]) > 2000:
            raise ValueError(f"{key} の入力を確認してください。")
    if complete and (not doc["name"].strip() or not doc["reading"].strip()):
        raise ValueError("公開用に採用するには、用語名と並べ替え用の読みを入力してください。")
    if not isinstance(doc.get("images"), list) or len(doc["images"]) > 200:
        raise ValueError("画像の一覧を確認してください。")
    for image in doc["images"]:
        if not isinstance(image, str) or not re.fullmatch(r"[\w. -]+\.(?:jpg|jpeg|png|webp|gif)", image, re.I) or Path(image).name != image or "/" in image or "\\" in image:
            raise ValueError("画像名が正しくありません。")
    if not isinstance(doc.get("autoLink"), bool) or not isinstance(doc.get("body"), list) or len(doc["body"]) > 20000:
        raise ValueError("本文データの形式が正しくありません。")
    for n in doc["body"]:
        if not isinstance(n, dict) or n.get("type") not in ["text", "break", "termLink", "externalLink"]:
            raise ValueError("本文に未対応の要素があります。")
        if n["type"] == "break":
            continue
        if not isinstance(n.get("text"), str) or len(n["text"]) > 100000:
            raise ValueError("本文を確認してください。")
        if n["type"] == "termLink" and n.get("target") not in ids:
            raise ValueError("用語リンクの参照先が見つかりません。")
        if n["type"] == "externalLink":
            parsed = urlparse(n.get("url", ""))
            if parsed.scheme not in ["https", "http"] or not parsed.netloc:
                raise ValueError("リンク先には http:// または https:// のURLを入力してください。")
        for mark in ["bold", "italic", "noAutoLink"]:
            if mark in n and not isinstance(n[mark], bool):
                raise ValueError("文字装飾の形式が正しくありません。")
    if complete and not plain_text(doc).strip():
        raise ValueError("公開用に採用するには説明を入力してください。")


def selected_docs(store, mode):
    key = "published" if mode == "published" else "draft"
    return {t["id"]: t[key] for t in store["terms"] if t.get(key)}


def asset_path(assets, name):
    assets = Path(assets).resolve()
    if Path(name).name != name or '/' in name or '\\' in name:
        raise ValueError('画像名が正しくありません。')
    public = assets.parent.parent / 'docs/images' / name
    return public if public.is_file() else assets / name


def image_library(assets):
    assets = Path(assets)
    return sorted({p.name for folder in [assets, assets.parent.parent / 'docs/images'] if folder.is_dir() for p in folder.iterdir() if p.is_file() and re.fullmatch(r'[\w. -]+\.(?:jpg|jpeg|png|webp|gif)', p.name, re.I)}, key=str.casefold)


def warnings_for(doc, docs, assets=None):
    warnings = []
    for n in doc["body"]:
        if n["type"] == "termLink" and n["target"] not in docs:
            warnings.append("リンク先の用語が公開用データに未採用です。")
    if assets:
        for image in doc["images"]:
            if not asset_path(assets, image).is_file():
                warnings.append(f"指定された画像が見つかりません: {image}")
    return list(dict.fromkeys(warnings))


def render_body(doc, docs):
    targets = sorted([(d["name"], tid) for tid, d in docs.items() if d.get("autoLink") and d["name"] and d["name"] != doc["name"]], key=lambda t: len(t[0]), reverse=True)
    pattern = re.compile("|".join(f"(?P<t{i}>{boundary_pattern(name)})" for i, (name, _) in enumerate(targets))) if targets else None
    used = set()

    def autolink(text):
        if pattern is None:
            return escape(text)
        parts, start = [], 0
        for m in pattern.finditer(text):
            name, tid = targets[int(m.lastgroup[1:])]
            parts.append(escape(text[start:m.start()]))
            parts.append(escape(m.group()) if tid in used else f'<a class="term-link" href="#{escape(tid, quote=True)}">{escape(m.group())}</a>')
            used.add(tid)
            start = m.end()
        parts.append(escape(text[start:]))
        return "".join(parts)

    parts = []
    for n in doc["body"]:
        kind = n["type"]
        if kind == "break":
            parts.append("<br>")
            continue
        text = escape(n["text"])
        if kind == "termLink":
            text = f'<a class="term-link" href="#{escape(n["target"], quote=True)}">{text}</a>' if n["target"] in docs else f'<span class="missing-link">{text}</span>'
        elif kind == "externalLink":
            text = f'<a href="{escape(n["url"], quote=True)}" target="_blank" rel="noopener noreferrer">{text}</a>'
        elif not n.get("noAutoLink"):
            text = autolink(n["text"])
        if n.get("bold"):
            text = f"<strong>{text}</strong>"
        if n.get("italic"):
            text = f"<em>{text}</em>"
        parts.append(text)
    return "".join(parts)


def render_entry(tid, doc, docs, asset_prefix="/assets/"):
    images = []
    for name in doc["images"]:
        src = escape(asset_prefix + name, quote=True)
        images.append(f'<a class="image-link" href="{src}" target="_blank" rel="noopener"><img loading="lazy" src="{src}" alt="{escape(doc["name"], quote=True)}の説明画像"></a>')
    image = '<div class="entry-images">' + ''.join(images) + '</div>' if images else ''
    legacy_anchor = f'<span class="legacy-anchor" id="{escape(doc["name"], quote=True)}"></span>' if doc["name"] != tid else ""
    return Template((TEMPLATES / "entry.html").read_text(encoding="utf-8")).substitute(id=escape(tid, quote=True), search_text=escape(" ".join([doc["name"], doc["reading"], doc["displayReading"], plain_text(doc)]), quote=True), legacy_anchor=legacy_anchor, name=escape(doc["name"]) or "名称未入力", display_reading=escape(doc["displayReading"]), body=render_body(doc, docs), image=image)


def render_site(store, mode="published", *, exported=False):
    docs = selected_docs(store, mode)
    prefix = "assets/" if exported else "/assets/"
    sections = []
    group = None
    for tid, doc in sorted(docs.items(), key=lambda pair: sort_key(pair[1]["reading"])):
        next_group = group_for(doc["reading"])
        if next_group != group:
            if group is not None:
                sections.append("</section>")
            sections.append(f'<section><h2 id="group-{GROUPS.index(next_group)}">{next_group}</h2>')
            group = next_group
        sections.append(render_entry(tid, doc, docs, prefix))
    if group is not None:
        sections.append("</section>")
    nav = "".join(f'<a href="#group-{i}">{g}</a>' for i, g in enumerate(GROUPS) if any(group_for(d["reading"]) == g for d in docs.values()))
    label = "下書きプレビュー" if mode == "draft" else "公開用プレビュー"
    stylesheet = "site.css" if exported else "/web/site.css"
    script = "site.js" if exported else "/web/site.js"
    return Template((TEMPLATES / "site.html").read_text(encoding="utf-8")).substitute(stylesheet=stylesheet, label=label, count=len(docs), nav=nav, entries="".join(sections), script=script)


def create_blank():
    return {"name": "", "reading": "", "displayReading": "", "autoLink": True, "images": [], "body": []}
