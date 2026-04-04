import pandas as pd
import os
import re

def get_group(yomi):
    if not yomi: return "その他"
    c = str(yomi)[0]
    
    if '\u3041' <= c <= '\u3096':
        c = chr(ord(c) + 0x0060)

    if c in "アァイィウゥエェオォヴ": return "ア行"
    if c in "カガキギクグケゲコゴヵヶ": return "カ行"
    if c in "サザシジスズセゼソゾ": return "サ行"
    if c in "タダチヂッツヅテデトド": return "タ行"
    if c in "ナニヌネノ": return "ナ行"
    if c in "ハバパヒビピフブプヘベペホボポ": return "ハ行"
    if c in "マミムメモ": return "マ行"
    if c in "ヤャユュヨョ": return "ヤ行"
    if c in "ラリルレロ": return "ラ行"
    if c in "ワヮヰヱヲン": return "ワ行"
    if c.upper() >= 'A' and c.upper() <= 'Z': return "アルファベット"
    if c >= '0' and c <= '9': return "数字"
    
    return "その他"

def build_regex_pattern(term):
    escaped_term = re.escape(term)
    
    if re.match(r'^[a-zA-Z0-9]', term):
        prefix = r'(?<![a-zA-Z0-9_])'
    elif re.match(r'^[ァ-ヶー]', term):
        prefix = r'(?<![ァ-ヶー])'
    elif re.match(r'^[ぁ-ん]', term):
        prefix = r'(?<![ぁ-ん])'
    elif re.match(r'^[一-龥]', term):
        prefix = r'(?<![一-龥])'
    else:
        prefix = r''

    if re.search(r'[a-zA-Z0-9]$', term):
        suffix = r'(?![a-zA-Z0-9_])'
    elif re.search(r'[ァ-ヶー]$', term):
        suffix = r'(?![ァ-ヶー])'
    elif re.search(r'[ぁ-ん]$', term):
        suffix = r'(?![ぁ-ん])'
    elif re.search(r'[一-龥]$', term):
        suffix = r'(?![一-龥])'
    else:
        suffix = r''
        
    return prefix + escaped_term + suffix

def generate_markdown():
    if not os.path.exists("_template.md"):
        print("エラー: _template.md が見つかりません。")
        return

    with open("_template.md", "r", encoding="utf-8") as f:
        template_content = f.read()

    try:
        df = pd.read_excel("yougo.xlsx").fillna("")
    except FileNotFoundError:
        print("エラー: yougo.xlsx が見つかりません。")
        return

    link_targets = []
    for index, row in df.iterrows():
        term = str(row.get('用語', '')).strip()
        do_link = str(row.get('リンク化', '')).strip()
        if term and do_link == 'あり':
            link_targets.append(term)
    link_targets.sort(key=len, reverse=True)

    markdown_lines = []
    current_group = ""

    for index, row in df.iterrows():
        term = str(row.get('用語', '')).strip()
        meaning = str(row.get('意味', '')).strip()
        reading_display = str(row.get('読み方（または英語）', '')).strip()
        yomi_sort = str(row.get('読み', '')).strip()
        image_name = str(row.get('画像', '')).strip()
        
        add_url = str(row.get('URL追加', '')).strip()

        if not term:
            continue

        meaning = meaning.replace('\n', '<br>')

        # ---------------------------------------------------------
        # 1. まず先に、ベタ書きされているURLの自動リンク化を行う
        # （手動のMarkdownリンクやHTMLリンクの中身は安全にスルーする）
        # ---------------------------------------------------------
        url_pattern = r'(?<![\("])(https?://[^\s<"\'\)]+)'
        meaning = re.sub(url_pattern, r'<a href="\1" target="_blank">\1</a>', meaning)

        # ---------------------------------------------------------
        # 2. その後で、「URL追加」カラムによる特定ワードのリンク化を行う
        # ---------------------------------------------------------
        if add_url.startswith('http://') or add_url.startswith('https://'):
            meaning = meaning.replace('解説記事', f'<a href="{add_url}" target="_blank">解説記事</a>')
            meaning = meaning.replace('参考動画', f'<a href="{add_url}" target="_blank">参考動画</a>')

        # ---------------------------------------------------------
        # 3. 最後に用語のリンク化（1回のみ）
        # ---------------------------------------------------------
        replacements = {}
        for i, target in enumerate(link_targets):
            if target != term and target in meaning:
                pattern = build_regex_pattern(target)
                placeholder = f"__MAGIC_LINK_{i}__"
                
                new_meaning = re.sub(pattern, placeholder, meaning, count=1)
                
                if new_meaning != meaning:
                    meaning = new_meaning
                    replacements[placeholder] = f'<a href="#{target}">{target}</a>'

        for placeholder, link_html in replacements.items():
            meaning = meaning.replace(placeholder, link_html)

        group = get_group(yomi_sort)
        if group != current_group:
            markdown_lines.append(f"\n## {group}\n")
            markdown_lines.append("| 用語 | 意味 |")
            markdown_lines.append("| --- | --- |")
            current_group = group

        if image_name:
            meaning += f'<br><img src="images/{image_name}.jpg" width="150">'

        line = f"| <span id='{term}'></span>**{term}**<br><small>*{reading_display}*</small> | {meaning} |"
        markdown_lines.append(line)

    generated_table = "\n".join(markdown_lines)
    final_content = template_content.replace("@@", generated_table)

    output_path = "docs/index.md"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(final_content)

    print(f"✅ 変換成功！ バグ修正版を出力しました。")

if __name__ == "__main__":
    generate_markdown()