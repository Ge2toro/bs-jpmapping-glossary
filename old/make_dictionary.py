import pandas as pd
import os

def get_group(yomi):
    if not yomi: return "その他"
    c = str(yomi)[0]
    
    # ひらがなをカタカナに変換して判定しやすくする
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

def generate_markdown():
    # 1. テンプレートの読み込み
    if not os.path.exists("_template.md"):
        print("エラー: _template.md が見つかりません。作成してください。")
        return

    with open("_template.md", "r", encoding="utf-8") as f:
        template_content = f.read()

    # 2. エクセル（yougo.xlsx）の読み込み
    try:
        df = pd.read_excel("yougo.xlsx").fillna("")
    except FileNotFoundError:
        print("エラー: yougo.xlsx が見つかりません。同じフォルダに配置してください。")
        return

    markdown_lines = []
    current_group = ""

    # 3. エクセルの各行を処理
    for index, row in df.iterrows():
        # カラム名が一致しているか確認しつつ取得
        term = str(row.get('用語', '')).strip()
        meaning = str(row.get('意味', '')).strip()
        reading_display = str(row.get('読み方（または英語）', '')).strip()
        yomi_sort = str(row.get('読み', '')).strip() # ソート・見出し用（表には出さない）
        image_name = str(row.get('画像', '')).strip()

        # もし用語が空ならスキップ（エクセルの余分な空行対策）
        if not term:
            continue

        # ★エクセル内の改行（Alt+Enter）を自動で <br> に変換
        meaning = meaning.replace('\n', '<br>')

        # 見出し（ア行、カ行など）の判定
        group = get_group(yomi_sort)

        # グループが変わったら見出しと表のヘッダーを挿入
        if group != current_group:
            markdown_lines.append(f"\n## {group}\n")
            markdown_lines.append("| 用語<br><small>読み方/英語</small> | 説明 |")
            markdown_lines.append("| --- | --- |")
            current_group = group

        # 画像がある場合のポン置き処理
        if image_name:
            meaning += f'<br><img src="images/{image_name}.jpg" width="150">'

        # 2カラムレイアウトで1行分を作成（No.と読みは含めない）
        line = f"| **{term}**<br><small>*{reading_display}*</small> | {meaning} |"
        markdown_lines.append(line)

    # 4. テンプレートの @@ を、生成したMarkdownの表に置換
    generated_table = "\n".join(markdown_lines)
    final_content = template_content.replace("@@", generated_table)

    # 5. docs/index.md に出力
    output_path = "docs/index.md"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(final_content)

    print(f"✅ 変換成功！ テンプレートに用語集を埋め込んで {output_path} を出力しました。")

if __name__ == "__main__":
    generate_markdown()