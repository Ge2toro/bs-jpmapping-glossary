import pandas as pd
import os
import re
import datetime

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

def make_ultimate_sort_key(yomi):
    yomi = str(yomi).strip()
    
    normalize_dict = {
        'ガ':'カ', 'ギ':'キ', 'グ':'ク', 'ゲ':'ケ', 'ゴ':'コ',
        'ザ':'サ', 'ジ':'シ', 'ズ':'ス', 'ゼ':'セ', 'ゾ':'ソ',
        'ダ':'タ', 'ヂ':'チ', 'ヅ':'ツ', 'デ':'テ', 'ド':'ト',
        'バ':'ハ', 'ビ':'ヒ', 'ブ':'フ', 'ベ':'ヘ', 'ボ':'ホ',
        'パ':'ハ', 'ピ':'ヒ', 'プ':'フ', 'ペ':'ヘ', 'ポ':'ホ',
        'ァ':'ア', 'ィ':'イ', 'ゥ':'ウ', 'ェ':'エ', 'ォ':'オ',
        'ッ':'ツ', 'ャ':'ヤ', 'ュ':'ユ', 'ョ':'ヨ', 'ヮ':'ワ',
        'ヴ':'ウ', 'ヵ':'カ', 'ヶ':'ケ',
        'が':'か', 'ぎ':'き', 'ぐ':'く', 'げ':'け', 'ご':'こ',
        'ざ':'さ', 'じ':'し', 'ず':'す', 'ぜ':'せ', 'ぞ':'そ',
        'だ':'た', 'ぢ':'ち', 'づ':'つ', 'で':'て', 'ど':'と',
        'ば':'は', 'び':'ひ', 'ぶ':'ふ', 'べ':'へ', 'ぼ':'ほ',
        'ぱ':'は', 'ぴ':'ひ', 'ぷ':'ふ', 'ぺ':'へ', 'ぽ':'ほ',
        'ぁ':'あ', 'ぃ':'い', 'ぅ':'う', 'ぇ':'え', 'ぉ':'お',
        'っ':'つ', 'ゃ':'や', 'ゅ':'ゆ', 'ょ':'よ', 'ゎ':'わ',
        'ゔ':'う'
    }

    temp_yomi = ""
    for char in yomi:
        temp_yomi += normalize_dict.get(char, char)

    a_row = "あかさたなはまやらわがざだばぱぁゃアカサタナハマヤラワガザダバパァャ"
    i_row = "いきしちにひみりぎじぢびぴぃイキシチニヒミリギジヂビピィ"
    u_row = "うくすつぬふむゆるぐずづぶぷぅゅウクスツヌフムユルグズヅブプゥュ"
    e_row = "えけせてねへめれげぜでべぺぇエケセテネヘメレゲゼデベペェ"
    o_row = "おこそとのほもよろごぞどぼぽぉょオコソトノホモヨロゴゾドボポォョ"
    
    res = []
    for i, c in enumerate(temp_yomi):
        if c == 'ー' and i > 0:
            prev = yomi[i-1]
            if prev in a_row: res.append('ア')
            elif prev in i_row: res.append('イ')
            elif prev in u_row: res.append('ウ')
            elif prev in e_row: res.append('エ')
            elif prev in o_row: res.append('オ')
            elif prev in "んン": res.append('ン')
            else: res.append('ー')
        else:
            res.append(c)
            
    return "".join(res)

def generate_markdown():
    if not os.path.exists("_template.md"):
        print("エラー: _template.md が見つかりません。")
        return

    with open("_template.md", "r", encoding="utf-8") as f:
        template_content = f.read()
    
    # 読み込むシート名を指定
    target_sheet = "公開用データ"

    try:
        df = pd.read_excel("yougo.xlsx", sheet_name=target_sheet).fillna("")
    except FileNotFoundError:
        print("エラー: yougo.xlsx が見つかりません。")
        return
    except ValueError:
        print(f"エラー: yougo.xlsx の中に '{target_sheet}' という名前のシートが見つかりません！シート名を確認してください。")
        return

    df['グループ'] = df['読み'].apply(lambda x: get_group(str(x).strip()))
    
    group_order = {
        "ア行": 1, "カ行": 2, "サ行": 3, "タ行": 4, "ナ行": 5,
        "ハ行": 6, "マ行": 7, "ヤ行": 8, "ラ行": 9, "ワ行": 10,
        "アルファベット": 11, "数字": 12, "その他": 13
    }
    df['グループ順'] = df['グループ'].map(group_order)
    
    df['ソートキー_主'] = df['読み'].apply(make_ultimate_sort_key)
    df['ソートキー_副'] = df['読み']
    
    df = df.sort_values(by=['グループ順', 'ソートキー_主', 'ソートキー_副'], ascending=[True, True, True])

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
        # 1. ベタ書きURLの自動リンク化（手動タグの中身はスルー）
        # ---------------------------------------------------------
        url_pattern = r'(?<![\("])(https?://[^\s<"\'\)]+)'
        meaning = re.sub(url_pattern, r'<a href="\1" target="_blank">\1</a>', meaning)

        # ---------------------------------------------------------
        # 2. 「URL追加」カラムを使って【 】をリンク化する
        # ---------------------------------------------------------
        # セル内の改行ごとに分割し、httpから始まるURLだけのリストを作る
        urls = [u.strip() for u in add_url.splitlines() if u.strip().startswith('http')]
        
        if urls:
            url_index = 0
            
            # 【 】を見つけるたびに実行される関数
            def replace_bracket(m):
                nonlocal url_index
                # まだ割り当てるURLが残っていればリンク化
                if url_index < len(urls):
                    current_url = urls[url_index]
                    url_index += 1
                    return f'<a href="{current_url}" target="_blank">{m.group(1)}</a>'
                # URLが足りなくなった場合は、そのままの文字（【】付き）で残す
                return m.group(0) 

            # 説明文の中にあるすべての【文字】を順番に処理
            meaning = re.sub(r'【(.*?)】', replace_bracket, meaning)

        # ---------------------------------------------------------
        # 3. 用語の自動相互リンク
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

    # 今日の日付を取得して、_template.mdの更新日に使用する
    today_str = datetime.datetime.now().strftime("%Y年%m月%d日")
    final_content = final_content.replace("{{UPDATE_DATE}}", today_str)

    output_path = "docs/index.md"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(final_content)

    print(f"✅ 変換成功！ 新仕様「【 】による順番リンク化」で出力しました。")

if __name__ == "__main__":
    generate_markdown()