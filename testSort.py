import pandas as pd
import os

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

def make_ultimate_sort_key(yomi):
    yomi = str(yomi).strip()
    
    # 1. 濁点・半濁点・小文字をすべて「清音の大文字」に変換する最強の辞書
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

    # 一文字ずつ「すっぴん」に変換していく
    temp_yomi = ""
    for char in yomi:
        temp_yomi += normalize_dict.get(char, char)

    # 2. 伸ばし棒（ー）の処理
    a_row = "あかさたなはまやらわがざだばぱぁゃアカサタナハマヤラワガザダバパァャ"
    i_row = "いきしちにひみりぎじぢびぴぃイキシチニヒミリギジヂビピィ"
    u_row = "うくすつぬふむゆるぐずづぶぷぅゅウクスツヌフムユルグズヅブプゥュ"
    e_row = "えけせてねへめれげぜでべぺぇエケセテネヘメレゲゼデベペェ"
    o_row = "おこそとのほもよろごぞどぼぽぉょオコソトノホモヨロゴゾドボポォョ"
    
    res = []
    for i, c in enumerate(temp_yomi):
        if c == 'ー' and i > 0:
            prev = yomi[i-1] # 判定は元の文字を使う
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

def export_sorted_terms():
    input_file = "yougo.xlsx"
    output_file = "sorted_terms.txt"

    try:
        df = pd.read_excel(input_file).fillna("")
    except FileNotFoundError:
        print(f"エラー: {input_file} が見つかりません。")
        return

    # ---------------------------------------------------------
    # グループ判定と、エクセル完全互換のソート処理
    # ---------------------------------------------------------
    df['グループ'] = df['読み'].apply(lambda x: get_group(str(x).strip()))
    
    group_order = {
        "ア行": 1, "カ行": 2, "サ行": 3, "タ行": 4, "ナ行": 5,
        "ハ行": 6, "マ行": 7, "ヤ行": 8, "ラ行": 9, "ワ行": 10,
        "アルファベット": 11, "数字": 12, "その他": 13
    }
    df['グループ順'] = df['グループ'].map(group_order)
    
    df['ソートキー_主'] = df['読み'].apply(make_ultimate_sort_key)
    df['ソートキー_副'] = df['読み']
    
    # ①グループ順 → ②すっぴん文字順 → ③元の文字順
    df = df.sort_values(by=['グループ順', 'ソートキー_主', 'ソートキー_副'], ascending=[True, True, True])
    # ---------------------------------------------------------

    # 用語を1個ずつ改行してリスト化（空欄の行はスキップ）
    terms = []
    for index, row in df.iterrows():
        term = str(row.get('用語', '')).strip()
        if term:
            terms.append(term)

    # 実行パスにテキストファイルとして出力
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("\n".join(terms) + "\n")

    print(f"✅ 抽出成功！ 指定のソート順で用語を {output_file} に書き出しました。")

if __name__ == "__main__":
    export_sorted_terms()