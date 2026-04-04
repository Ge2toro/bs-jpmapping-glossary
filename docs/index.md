# Beat Saber マッピング用語集

日本人向けの、Beat Saberのマッピング（譜面制作）に特化した用語集です。<br>
配置用語なども含みますので、マッピングをしていないプレイヤーも参考になると思います。<br>
!!! info ""
    これは、私toroが個人的に作成した用語集です。内容について何かあればページ下部の連絡先からお気軽にご連絡ください。<br>
    プレイヤー目線での一般的なBeat Saber用語が知りたい方は、hibitさんが作成している「<a href="https://docs.google.com/document/d/1Zl8jh0djB80o3tbTmGR1MF9gV9pkYPfxqTC4IuRQmd0/edit?usp=sharing" target="_blank">ビーセイゆるふわ用語集</a>」もおすすめです。


## ア行

| 用語 | 意味 |
| --- | --- |
| <span id='アーク'></span>**アーク**<br><small>*Arc*</small> | ノーツ間を繋ぐ光る曲線。主に長い音を<a href="#表現">表現</a>する為に使用される。線自体に判定はなく、接続したノーツのスコアリングを変化させる。<br><a href="https://note.com/toro_desu/n/n095e2d66015c" target="_blank">解説記事</a> |
| <span id='ArrowVortex'></span>**ArrowVortex**<br><small>*アローボルテックス*</small> | 曲のBPMを検出し、必要な<a href="#オフセット">オフセット</a>値を決定するために使われる定番ソフト。元々は他音楽ゲーム用の作譜ツールである。 |
| <span id='eBPM'></span>**eBPM**<br><small>*イービーピーエム*</small> | 譜面のノーツ間隔から算出される、「実質的なスイング速度」。譜面で要求されるスイング速度を示す為のBeat Saber固有の指標。effective BPMの略。<br>ダウン・アップのノーツ間隔が1/2ビートである時、スイング速度eBPMはその曲のBPMと一致し、これが基準となる。1/4ビート間隔であればeBPMは倍に、1/1ビート間隔であればeBPMは半分になる。 |
| <span id='一貫性'></span>**一貫性**<br><small>*Consistency*</small> | 譜面全体を通して、同じような音やフレーズに対して同じパターンの配置やルールを適用すること。譜面品質を上げる為の考え方のひとつ。 |
| <span id='イベント'></span>**イベント**<br><small>*Event*</small> | 譜面データにおけるノーツ配置以外の要素、ライティングや<a href="#Environment">Environment</a>ギミック（リング等）、BPM変更などの命令単位。<br><img src="images/event.jpg" width="150"> |
| <span id='インバース'></span>**インバース**<br><small>*Invert*</small> | 上段に置かれた下向きノーツや、右端に置かれた左向きノーツなど、位置と矢印の関係が逆になっている配置。プレイヤーにより大きな動きをもたらす。英語ではInvert。<br><img src="images/invert.jpg" width="150"> |
| <span id='info.dat'></span>**info.dat**<br><small>*インフォダット*</small> | 譜面に含まれる設定ファイル。曲名、マッパー名、BPM、難易度情報など、譜面の基本情報（メタデータ）がすべて記述されている。<br>難易度ファイルと同様、info.datにもバージョンが存在し、<a href="#V4マップ">V4マップ</a>ではinfo.datの仕様も大きく変更されている。 |
| <span id='インライン'></span>**インライン**<br><small>*Inline*</small> | ノーツを同じレーンに一列に配置すること。<br>後続のノーツはほとんどが隠れる為、リズムを合わせるのがとても難しい。また、矢印は完全に見えなくなる為、後続のノーツの向きは揃えるか、確実に予測可能であるものが望ましい。<br><img src="images/inline.jpg" width="150"> |
| <span id='Vivify'></span>**Vivify**<br><small>*ヴィヴィファイ*</small> | AssetBundleを譜面で使用可能にするMod。マッパーは各種アセット（3Dモデル、画像、ポストプロセス・シェーダー等）を用意し、譜面の中で使用できる。<a href="#Chroma">Chroma</a>、<a href="#NoodleExtensions">NoodleExtensions</a>に並ぶ、譜面の拡張Mod。 |
| <span id='WIP'></span>**WIP**<br><small>*ウィップ*</small> | 譜面が「作成途中」であること。Work-In-Progressの略。<br><a href="#BeatSaver">BeatSaver</a>にテスト目的などでwip譜面を公開することは禁じられているので注意しよう。 |
| <span id='wipbot'></span>**wipbot**<br><small>*ウィップボット*</small> | 配信者に!wipコマンドでwip譜面をリクエストすることができるMod。譜面はwipbotサーバーにアップロードするか、discordかGoogleドライブのリンクを使うことでリクエストできる。<br>リクエストを受ける側がModを導入しておかないと使えない点に注意しよう。Beat Saber配信者はこのModを入れておくと助かるマッパーがいるかもしれない。<br><a href="https://github.com/Danielduel/wipbot" target="_blank">https://github.com/Danielduel/wipbot</a> |
| <span id='ウィンドウ'></span>**ウィンドウ**<br><small>*Window*</small> | タワーノーツから真ん中を抜いた配置。<a href="#タワー">タワー</a>の見た目の圧を和らげたり、<a href="#ビジョンブロック">ビジョンブロック</a>を回避する目的などで用いられる。<br>画像の青ノーツのように、斜めのウィンドウはノーツ角度が自動で調整され一直線の配置になる。<br><img src="images/window.jpg" width="150"> |
| <span id='ウィンドウスライダー'></span>**ウィンドウスライダー**<br><small>*Window Slider*</small> | 3個連なる<a href="#スライダー">スライダー</a>から真ん中のノーツを抜いたもの。<br>ずらし間隔は真ん中にノーツがある想定で決定する。<br>例: スライダーを1/32間隔にしている場合、ウィンドウスライダーでは1/16ぶんずらして配置する。<br><img src="images/windowslider.jpg" width="150"> |
| <span id='ウォールアート'></span>**ウォールアート**<br><small>*Wall Art*</small> | <a href="#NoodleExtensions">NoodleExtensions</a>や<a href="#MappingExtensions">MappingExtensions</a>を利用し、「壁」を自在に配置して文字や絵、建造物などの視覚演出を作ったもの。 |
| <span id='HJD'></span>**HJD**<br><small>*エイチジェーディー*</small> | ノーツが<a href="#スポーン">スポーン</a>してからプレイヤーの元に到達するまでのビート数(拍数)。ノーツの表示タイミングを決める譜面の設定値。Half-Jump-Durationの略。<br>関連: <a href="#JD">JD</a>、<a href="#リアクションタイム">リアクションタイム</a> |
| <span id='AIマップ'></span>**AIマップ**<br><small>*エーアイマップ*</small> | Beat Sageなどのツールを使い、音源から自動生成した譜面。お世辞にも品質が良いとは言えない譜面ができあがる。<br><a href="#BeatSaver">BeatSaver</a>に公開することは基本推奨されておらず、どうしても公開する場合はタグ付けが必須である（デフォルトで検索非表示）。 |
| <span id='Acc'></span>**Acc**<br><small>*エーシーシー、アック、アキュラシー*</small> | １．高い精度を出すことに特化した譜面ジャンルのこと。ノーツ密度は低めでフルコンボ前提であり、精度を狙いやすい配置パターンで構成される。精度譜面。<br>２．Accuracy（精度）の略称 |
| <span id='SPS'></span>**SPS**<br><small>*エスピーエス*</small> | 1秒間あたりの腕の振り（スイング）の平均回数。<a href="#NPS">NPS</a>（秒間ノーツ数）とは異なり、<a href="#スタック">スタック</a>や<a href="#スライダー">スライダー</a>などの複数ノーツを切る場合は1スイングとして計算されるため、「実際のスイングの忙しさ」をより正確に表す指標である。 |
| <span id='NJS'></span>**NJS**<br><small>*エヌジェーエス*</small> | ノーツがプレイヤーに向かって飛んでくる速度。メートル毎秒。<br>プレイヤーが変更できない数値である為、マッパーは難易度に合わせて適切に値を決める必要がある。Note Jump Speedの略。 |
| <span id='NPS'></span>**NPS**<br><small>*エヌピーエス*</small> | 1秒間あたりのノーツ平均数。譜面の大まかなノーツ密度・難易度の目安となる。Notes Per Secondの略。 |
| <span id='FPFC'></span>**FPFC**<br><small>*エフピーエフシー*</small> | VRヘッドセットを被らずに、PCのモニター上でマウスとキーボードを使ってゲーム内を自由に移動・確認できるモード。ゲームの起動オプションに「fpfc」と入れるか、<a href="#BSManager">BSManager</a>でモード選択することで使用できる。 |
| <span id='MMA2'></span>**MMA2**<br><small>*エムエムエーツー*</small> | 過去に主流だった非公式マッピングエディタ。もう何年も更新が止まっていて配布も終了した為、現在は<a href="#ChroMapper">ChroMapper</a>が推奨される。 |
| <span id='Environment'></span>**Environment**<br><small>*エンバイロメント*</small> | 譜面のプレイ背景となるステージ環境。Environmentごとにライトの形や挙動、その他造形物などのデザイン、ライティングシステムが異なる。<br>≒<a href="#プラットフォーム">プラットフォーム</a><br><img src="images/env.jpg" width="150"> |
| <span id='Environment Enhancement'></span>**Environment Enhancement**<br><small>*エンバイロメントエンハンスメント*</small> | <a href="#Chroma">Chroma</a>を利用し、<a href="#Environment">Environment</a>の造形を改造する機能。既存のオブジェクトを消したり、大きさを変えたり、別の場所に移動させたりして、既存Environmentのちょっとしたアレンジから、完全独自のEnvironmentを作り上げることもできる。 |
| <span id='オートライト'></span>**オートライト**<br><small>*Auto Light*</small> | ツールを使って自動生成されたライト。<a href="#ChroMapper">ChroMapper</a>プラグインのAutoMapper、AutoLighterV2がよく使われるオートライトである。ライティングを作るのがしんどい時の強い味方。<br>手作業で作成したライトは「マニュアルライト」と呼ばれる。 |
| <span id='オーバーマッピング'></span>**オーバーマッピング**<br><small>*Overmapping*</small> | 曲の音数以上にノーツを配置すること。リズムゲームである以上、音を伴わないノーツを置くことは基本的に非推奨である。 |
| <span id='ogg'></span>**ogg**<br><small>*オッグ*</small> | 一般的な音声ファイルの拡張子（.ogg形式）。Beat Saberの譜面でもoggが使用されている。<br><a href="#BeatSaver">BeatSaver</a>に譜面をアップロードすると、音声ファイルは自動的にeggという独自形式（中身はogg）に変換される。 |
| <span id='音取り'></span>**音取り**<br><small>*Rhythm Choice*</small> | 曲の中のどの音（メロディ、ドラムなど）をノーツの配置対象として拾うかを選択すること。 |
| <span id='Obstacle'></span>**Obstacle**<br><small>*オブスタクル*</small> | 障害物であるボムと壁のこと。ゲームの内部データではObstacleという名称でまとめて扱われる。 |
| <span id='オフセット'></span>**オフセット**<br><small>*Offset*</small> | 音源の頭の無音時間を調整し、エディタのビートラインと曲のビートを正確に合わせること。オーディオオフセット。<br>※ゲーム設定でセイバーの位置・角度を調整するのはセイバーオフセット |

## カ行

| 用語 | 意味 |
| --- | --- |
| <span id='回転配置'></span>**回転配置**<br><small>*Arm Circle*</small> | 腕や手を円を描くように回して連続で切らせる配置パターン。回転の勢いに乗せて角度変化を加えたものを回転テックとも言う。 ※画像は一例<br>関連: <a href="#モメンタム">モメンタム</a><br><img src="images/armcircle.jpg" width="150"> |
| <span id='カスタムカラー'></span>**カスタムカラー**<br><small>*Custom Song Colors*</small> | 譜面に設定される独自の色設定。ノーツ・壁・ライトの配色を、デフォルトの<a href="#Environment">Environment</a>依存の色ではなく、マッパーが自由に指定できる機能。<br>元々は<a href="#SongCore">SongCore</a>によって機能する非公式のものだったが、「Color Scheme」という名称で公式のカスタムカラーも実装された。できることは両者ほぼ一緒であり、<a href="#ChroMapper">ChroMapper</a>ではSongCoreのカスタムカラーが、<a href="#公式エディタ">公式エディタ</a>では公式のカスタムカラーがデフォルトで使用できる（公式カスタムカラーは「ホワイト」の変更ができない）。 |
| <span id='Custom Json Data'></span>**Custom Json Data**<br><small>*カスタムジェイソンデータ*</small> | 譜面のデータ（JSON）に、Modで使用する独自情報（Custom Data）を追加し、利用する為のライブラリMod。<a href="#Chroma">Chroma</a>や<a href="#NoodleExtensions">NoodleExtensions</a>などの情報は譜面のCustom Data領域に記録される。 |
| <span id='壁'></span>**壁**<br><small>*Wall*</small> | 壁の障害物。頭が当たるとダメージを受けコンボが途切れる。プレイヤーは身体を動かして避ける必要がある。頭以外に判定は無く、セイバーが触れても問題ない。 |
| <span id='壁よけ'></span>**壁よけ**<br><small>*Dodge Wall*</small> | ＝<a href="#ドッジウォール">ドッジウォール</a><br>または、壁を避ける行為そのもの。 |
| <span id='可変BPM'></span>**可変BPM**<br><small>*Variable BPM*</small> | 1曲の中でBPMが変化すること。マッピングするには都度BPM<a href="#イベント">イベント</a>を置いて調整することになる。 |
| <span id='ギミック'></span>**ギミック**<br><small>*Gimmick*</small> | 標準的なセオリー（定番パターンや、時には<a href="#パリティ">パリティ</a>など）からあえて外れて、プレイヤーに特定の「特殊な動き」や「攻略要素」を要求する変則的な配置。仕掛け。特定のギミックをコンセプトとしてデザインされた譜面はギミック譜面とも呼ばれる。<br>※かなりふんわりしたニュアンスの用語である為、「斬新なアイデアの配置・譜面」ぐらいのイメージでよい |
| <span id='Characteristic'></span>**Characteristic**<br><small>*キャラクタリスティック*</small> | Standard、OneSaber、360度など、譜面の<a href="#ゲームモード（難易度区分）">ゲームモード（難易度区分）</a>のこと。<br>Lightshow、<a href="#Lawless">Lawless</a>の二つは<a href="#SongCore">SongCore</a>による非公式のCharacteristicである。<br>Characteristic名称とラベルアイコンは自由に変更できる（SongCoreの機能）。 |
| <span id='ギャロップ'></span>**ギャロップ**<br><small>*Gallop*</small> | 赤→青、または青→赤の直後に同時切りを置く一連のパターン。特に、1/4間隔などの速い速度で配置されたものを指す（<a href="#ストリーム">ストリーム</a>の最後を同時切りにしたものも該当）。<br>見た目以上の難度、<a href="#強調">強調</a>を生む配置であるため扱いには注意が必要である。<br><img src="images/gallop.jpg" width="150"> |
| <span id='90度譜面'></span>**90度譜面**<br><small>*90 Degree Map*</small> | 前方だけでなく、プレイヤーを中心に左右の斜め方向（合計90度の範囲）からもノーツが飛んでくる公式のゲームモード。色んな方向からノーツが飛んでくる為、プレイヤーは視野を広げて身体の向きを変えながらプレイする。 |
| <span id='キュレーター'></span>**キュレーター**<br><small>*Curator*</small> | <a href="#キュレート">キュレート</a>を行う専門の人たち。<a href="#BeastSaber">BeastSaber</a>によって運営され、人員は一般公募で募集される（審査あり）。不定期で追加募集がかかるので気になる人はBeastSaberのdiscordサーバーをチェックしておこう。<br>キュレーションチーム: <a href="https://bsaber.com/curation-team" target="_blank">https://bsaber.com/curation-team</a> |
| <span id='キュレート'></span>**キュレート**<br><small>*Curation*</small> | <a href="#BeatSaver">BeatSaver</a>にある膨大なカスタム譜面の中から、品質の高い譜面や面白い譜面を「おすすめ」としてピックアップする仕組み。キュレートされた譜面はBeatSaver上で緑色の帯がつく。キュレーションとも。<br>キュレートは専門の<a href="#キュレーター">キュレーター</a>が行う。<br><img src="images/curation.jpg" width="150"> |
| <span id='強調'></span>**強調**<br><small>*Emphasis*</small> | 曲の強い音や特徴的なフレーズに合わせて、ノーツ配置の強さを上げたり動きを大きくするなどして「目立たせること」。楽曲との一体感を高める為の普遍的なマッピング技術のひとつ。<br>関連: <a href="#一貫性">一貫性</a> |
| <span id='クラッシュ'></span>**クラッシュ**<br><small>*Clash*</small> | 左右のコントローラーが物理的に衝突してしまうこと。またはそれを誘発する危険なノーツ配置（クラッシュ配置）。基本的にはマッパーはそれを避けるべきである。<br>≒<a href="#ハンドクラップ">ハンドクラップ</a> |
| <span id='クロス'></span>**クロス**<br><small>*Crossover*</small> | 赤青の並びが反対位置に置かれていて、手（セイバー）を交差させながら切らせる配置。クロスオーバーとも。<br>クロスの間隔が広くなるほど<a href="#クラッシュ">クラッシュ</a>の危険性が上がる為プレイヤーもマッパーも注意しよう。<br><img src="images/cross.jpg" width="150"> |
| <span id='クロスシザー'></span>**クロスシザー**<br><small>*Crossover Scissor, Pickle*</small> | <a href="#シザー">シザー</a>配置を、左右クロスで配置したもの。<a href="#クラッシュ">クラッシュ</a>しやすい配置なので<a href="#セットアップ">セットアップ</a>に気をつけよう。<br>海外ではピクルス(Pickle)と呼ばれる場合もある。<br><img src="images/crossscissor.jpg" width="150"> |
| <span id='Chroma'></span>**Chroma**<br><small>*クロマ*</small> | ライト・壁・ノーツの色を自由に変更したり、リングやレーザーを細かく制御、<a href="#Environment">Environment</a>を改造したりできるライティング拡張Mod。ライト<a href="#表現">表現</a>の幅を大きく広げる。 |
| <span id='ChroMapper'></span>**ChroMapper**<br><small>*クロマッパー*</small> | コミュニティで広く使われている高性能な非公式マッピングエディタ。現代のスタンダード。 |
| <span id='ゲームモード（難易度区分）'></span>**ゲームモード（難易度区分）**<br><small>*Game Mode*</small> | Standard、OneSaber、360度など、譜面がもつ難易度の大分類。<a href="#Characteristic">Characteristic</a>。 |
| <span id='公式エディタ'></span>**公式エディタ**<br><small>*Official Editor*</small> | ゲーム内に組み込まれている公式機能のマッピングエディタ。2026/4現在、<a href="#V3ライティング">V3ライティング</a>の作成は公式エディタでのみ対応している。<br>ゲームのホーム画面下のボタンから起動できる（fpfcモード推奨）。 |
| <span id='コールドエンド'></span>**コールドエンド**<br><small>*Cold End*</small> | 曲の終わり、最後のノーツ・ボム・壁よけから曲が終了するまでの時間が短すぎること。余韻なく急に終わる印象を与えてしまう。<br>ランク基準では最低2秒の猶予が必要。アンランクでも特別な拘りがある場合を除き2秒以上が推奨される。 |
| <span id='コンテキスト'></span>**コンテキスト**<br><small>*Context*</small> | 配置の前後関係といった「文脈」を指す。例えば、単独では不自然・奇抜なパターンでも、それまでの構成から予測・期待が可能であれば「コンテキストがある（理にかなっている）」と評価できる。<br><a href="#セットアップ">セットアップ</a>や<a href="#誘導">誘導</a>を譜面全体で広く捉えた考えと言い換えてもよい。プレイ時の納得感に直結する。 |
| <span id='混フレ'></span>**混フレ**<br><small>*※適する英語なし？*</small> | 「混合フレーズ」の略。右手と左手で全く異なるリズムやサウンドを同時に処理させる配置（音取り）。<br>例）左手ノーツをボーカル、右手ノーツをドラム<br>ノーツ量は増えるが、二つの音を手堅く<a href="#表現">表現</a>できる音取り手法である。音ゲー用語。<br><img src="images/konfure.jpg" width="150"> |

## サ行

| 用語 | 意味 |
| --- | --- |
| <span id='360度譜面'></span>**360度譜面**<br><small>*360 Degree Map*</small> | プレイヤーの周囲360度すべての方向からノーツが飛んでくる公式のゲームモード。VRらしさを最大限活用したモードだが、プレイ環境によってはコードの絡まりや部屋のスペースに注意する必要がある。 |
| <span id='JD'></span>**JD**<br><small>*ジェーディー*</small> | ノーツが出現してからプレイヤーに到達するまでの物理的な距離。Unity空間におけるメートル（unit）換算で、1JD=0.5m。ジャンプディスタンスの略。ジャンプ距離とも言う。<br>※正確にはJDはプレイヤーの後方にも同じだけ伸びており、1JD=1mが正しいのだが、実際の感覚では上記の考え方でよい。<br>関連: <a href="#リアクションタイム">リアクションタイム</a>、<a href="#HJD">HJD</a> |
| <span id='JBSL'></span>**JBSL**<br><small>*ジェービーエスエル*</small> | 日本のBeat Saberプレイヤー向けに開催されている非公式大会。Japan Beat Saber League。<br>JBSL-Webでは大会以外でも自由にリーグを開催し競うことが可能だ。<br><a href="https://jbsl-web.herokuapp.com/" target="_blank">https://jbsl-web.herokuapp.com/</a> |
| <span id='ジオメトリ'></span>**ジオメトリ**<br><small>*Geometry*</small> | <a href="#Chroma">Chroma</a>の機能で、<a href="#Environment">Environment</a>内に3Dオブジェクトを作成・配置できる。Cube,Sphere等のプリミティブが使用でき、ゲーム内シェーダーを使ってライトや造形物を作ることができる。<br>Blenderで作ったモデルをジオメトリに変換するBlenderプラグインが存在する（<a href="#ReMapper">ReMapper</a>が必要）。 |
| <span id='シザー'></span>**シザー**<br><small>*Scissor*</small> | 片方が切り下げ、もう片方が切り上げの同時切り。ハサミのような動きで切らせる配置。<br><img src="images/scissor.jpg" width="150"> |
| <span id='Cinema'></span>**Cinema**<br><small>*シネマ*</small> | プレイ中の背景にYouTube等の動画を映すことができるMod。<br>マッパーが譜面にCinemaの設定を含めるもでき、映す動画・音の同期などを設定しておくことで、プレイヤーは即座に動画を再生できる。設定に自由度があり、スクリーン配置や<a href="#Environment">Environment</a>を改造することも可能。 |
| <span id='しゃがみ壁'></span>**しゃがみ壁**<br><small>*Duck wall, Crouch wall, Squat*</small> | プレイヤーの頭の高さ（上半分）に配置され、実際にしゃがんで避けることを要求される壁。<br>＝ダックウォール、クラウチウォール、スクワット |
| <span id='ジャンプ'></span>**ジャンプ**<br><small>*Jump*</small> | 同じ色を高速でスイングし続ける配置パターン。スピードを代表する配置であり、高難度配置。<br>多くは1/3や1/4ビート間隔のような速度を求められるものを指すが、1/2など遅いスイングでもそう呼ばれる場合がある。<br><img src="images/jump.jpg" width="150"> |
| <span id='ジャンプスケア'></span>**ジャンプスケア**<br><small>*Jump Scare*</small> | 予期しない（できない）難しい配置を表す言葉。いわゆる「初見殺し」や「びっくり配置」。<br>配置の難度が局所的に急上昇していたり、危険・理不尽配置だったり、<a href="#セットアップ">セットアップ</a>が不足していることが原因。<br>関連: <a href="#diffスパイク">diffスパイク</a> |
| <span id='出張'></span>**出張**<br><small>*※適する英語なし？*</small> | 右手用のノーツを左側に配置するなど、反対側の手で切らせる配置。音ゲー用語。 |
| <span id='シュラドアングル'></span>**シュラドアングル**<br><small>*Shrado Angle*</small> | 斜め内向きの切り下げの後、レーンを跨いで真上切り上げが続くパターン。<br>この形ではきちんとした<a href="#誘導">誘導</a>や<a href="#セットアップ">セットアップ</a>がない限り、プレイヤーは真上ノーツを斜めに切り上げてしまいやすく、<a href="#バッドカット">バッドカット</a>の危険性があるパターンである。<br>このパターンを<a href="#ランク譜面">ランク譜面</a>で使用したマッパー名（shrado）に由来する。<br><img src="images/shrado.jpg" width="150"> |
| <span id='シングル'></span>**シングル**<br><small>*Single*</small> | ノーツが1個のみの配置。方向は問わない。単ノーツ、単発ノーツ。<br>関連: <a href="#ダブル">ダブル</a> |
| <span id='ScoreSaber'></span>**ScoreSaber**<br><small>*スコアセイバー*</small> | 世界中のプレイヤーとスコアを競い合うことができる、最も歴史のある非公式リーダーボードMod。およびランクシステムを指す。対象となる<a href="#ランク譜面">ランク譜面</a>をクリアすることで<a href="#PP">PP</a>というランクポイントを得られる。 |
| <span id='スタック（動詞）'></span>**スタック（動詞）**<br><small>*Stacked*</small> | ノーツを同じ場所に完全に重なって配置してしまうこと。大抵はコピペミスによって起こる<a href="#ミスマップ">ミスマップ</a>であり、エディター上では判別しにくい為テストプレイやエラーチェッカーでの確認が大事である。 |
| <span id='スタック'></span>**スタック**<br><small>*Stack Note*</small> | 同じタイミングで、一直線に2個積み重なったノーツ。シングルノーツよりも強く大きいスイングが求められる。<br><img src="images/stack.jpg" width="150"> |
| <span id='ステアケース（階段）'></span>**ステアケース（階段）**<br><small>*Staircase*</small> | ノーツのスイング軌道上に被る形で、手前または後続に他の色のノーツが配置されているパターン。<br>ノーツ同士の間隔やBPMによっては、スイング前の軌道またはスイング後の軌道が別の色のノーツと被ってしまい、<a href="#巻き込み">巻き込み</a>（<a href="#バッドカット">バッドカット</a>）の危険性が上がってしまう。<br><img src="images/stair.jpg" width="150"> |
| <span id='ストリーム'></span>**ストリーム**<br><small>*Stream*</small> | 左右の色のノーツが交互に、短い間隔で連続して流れてくる一連の配置。長く続く場合、リズムキープとスタミナが求められる。<br>関連: <a href="#バースト">バースト</a><br><img src="images/stream.jpg" width="150"> |
| <span id='ストロボ'></span>**ストロボ**<br><small>*Strobe*</small> | ライトを高速で点滅させる激しい演出。 |
| <span id='スピード'></span>**スピード**<br><small>*Speed*</small> | セイバーを素早く正確に振り続けることに特化した譜面。<a href="#eBPM">eBPM</a>が高速であり、ジャンプや<a href="#バースト">バースト</a>などスピードらしい配置がたくさん飛んでくる。 |
| <span id='スポーン'></span>**スポーン**<br><small>*Spawn*</small> | 奥のスポーン地点からノーツや壁が出現すること。 |
| <span id='スポーン距離'></span>**スポーン距離**<br><small>*Spawn Distance*</small> | ノーツが出現する位置からプレイヤーまでの距離。<br>＝<a href="#JD">JD</a> |
| <span id='スライダー'></span>**スライダー**<br><small>*Slider*</small> | 時間をずらしながら複数ノーツを並べて配置し、一振りでなぞるように切らせる配置。先頭を矢印ノーツ、後続をドットにするのが一般的。<br>ずらす為のビート間隔はBPMや好みにもよるが、1/16、1/24、1/32、1/48あたりがよく使用される。BPMに対して極端に間隔が遅すぎる場合、プレイしづらくなるので注意しよう。<br><img src="images/slider.jpg" width="150"> |
| <span id='精度'></span>**精度**<br><small>*Accuracy*</small> | ノーツをどれだけ中心に近い位置で、かつ十分な角度で切れたかを表す言葉。または、合計スコアのパーセンテージの値を指して「精度」と呼ばれる。英語ではAccuracy（アキュラシー）。<br>関連: <a href="#Acc">Acc</a>(精度譜面) |
| <span id='正当性'></span>**正当性**<br><small>*Justification*</small> | マッパーの行った音取りやパターン配置など特定の選択に対し、音楽性や<a href="#一貫性">一貫性</a>、<a href="#セットアップ">セットアップ</a>や<a href="#コンテキスト">コンテキスト</a>などの観点から、それが妥当であるかを示す言葉。奇抜なアイデアでも、それが妥当である理由がきちんと譜面にある（伝わる）ならば正当性があると言える（正当化）。 |
| <span id='精密回転'></span>**精密回転**<br><small>*Precision Rotation*</small> | ノーツの角度を1度単位で細かく設定すること。角度<a href="#オフセット">オフセット</a>ともいう。<br>元々は<a href="#MappingExtensions">MappingExtensions</a>や<a href="#NoodleExtensions">NoodleExtensions</a>でのみ使用できたが、<a href="#V3マップ">V3マップ</a>以降では公式で対応した。<br>※壁の精密回転はMod必須 |
| <span id='精密配置'></span>**精密配置**<br><small>*Precision Placement*</small> | ノーツや壁を、4x3マスグリッドの規格を超えて、ミリ単位レベルで自由に配置すること。<br><a href="#NoodleExtensions">NoodleExtensions</a>（または<a href="#MappingExtensions">MappingExtensions</a>）が必須。 |
| <span id='Settings Setter'></span>**Settings Setter**<br><small>*セッティングセッター*</small> | 譜面を遊ぶ際、マッパーが推奨するゲーム内設定（ライティングをオンにする、HUDを消す等）をプレイヤーへ自動的に提案してくれる機能。プレイボタンを押した後に専用の確認画面が表示される。<br><a href="#Heck">Heck</a> Modにより機能し、譜面に設定する場合は<a href="#ChroMapper">ChroMapper</a>プラグインのPropEditが簡単でオススメ。 |
| <span id='セットアップ'></span>**セットアップ**<br><small>*Setup*</small> | 次のパターンを無理なく切れるように、直前までの配置を工夫してプレイヤーの腕や身体を適切に準備させること。<br>※「<a href="#誘導">誘導</a>」とほぼ同義であり使用ケースもほぼ被っているが、こちらは次の動作を成立させるための物理的・構造的な「準備」のニュアンスが強い。例えば「巻き込みが怖い配置だから、直前のノーツを適切な場所に置いてスイング軌道が被らないようにする」など。 |
| <span id='SongCore'></span>**SongCore**<br><small>*ソングコア*</small> | ゲーム内にカスタム譜面を読み込んで遊べるようにするための必須Mod。<br>※カスタム譜面自体は<a href="#バニラ">バニラ</a>でも遊べるが、それをより使いやすく遊びやすくする為のもの |

## タ行

| 用語 | 意味 |
| --- | --- |
| <span id='Diamonds in the Rough(DITR)'></span>**Diamonds in the Rough(DITR)**<br><small>*ダイアモンドインザラフ*</small> | 新人マッパーが経験豊富なコーチとペアになり、キュレーションに値するマップを作成する<a href="#イベント">イベント</a>。<a href="#BSMG">BSMG</a>で毎年主催されている。「ダイヤの原石」の意味。<br>毎年、新人マッパーたちが長い時間を費やしてクオリティの高い作品を作り上げている。<br>プレイリスト：<a href="https://beatsaver.com/playlists?q=%22Diamonds%20in%20the%20Rough%22" target="_blank">https://beatsaver.com/playlists?q=%22Diamonds%20in%20the%20Rough%22</a> |
| <span id='ダブル'></span>**ダブル**<br><small>*Double*</small> | 赤青同時に切るノーツ配置。方向は問わない。同時切り、同時ノーツ。<br>関連: <a href="#シングル">シングル</a> |
| <span id='タワー'></span>**タワー**<br><small>*Tower*</small> | 同じタイミングで、一直線に3個以上積み重なったノーツ。スイングの勢いが特に要求される為、<a href="#スタック">スタック</a>や<a href="#スライダー">スライダー</a>よりも強い配置である。<br>横に4個使うタワーは4wideタワーとも呼ぶ。<br><img src="images/tower.jpg" width="150"> |
| <span id='ダンス'></span>**ダンス**<br><small>*Dance*</small> | 大きな腕の振りや体の動きを使い、ほどほどの低密度で、曲に合わせて踊っているかのような譜面。誰もが楽しめるジャンル。 |
| <span id='チェイン'></span>**チェイン**<br><small>*Chain*</small> | 細いブロックが複数連なるノーツ。軌道に合わせてなぞるように切る。<br>先頭の矢印ブロックをチェインヘッド、後ろに連なる細いブロックはチェインリンクと呼ぶ。主に長い音や、細かい連続音を<a href="#表現">表現</a>するために使用される。通常のノーツとスコアリングが異なる<br><a href="https://note.com/toro_desu/n/na6238f3f26c7" target="_blank">解説記事</a> |
| <span id='チャレンジ'></span>**チャレンジ**<br><small>*Challenge*</small> | スコアよりも、クリアすること自体が目的の超高難易度譜面。セオリーやルールを逸脱した配置、極端な速度、人間離れした配置などなど、攻略を探求しながら限界に挑むために遊ぶ。<br>チャレンジ譜面を専門に扱うコミュニティが存在し、専用のプレイリストとランキングシステムもある。→「Beat Saber Challenge Community（BSCC）」、「Challange Saber」<br><a href="https://youtu.be/XXqvBboLLuk" target="_blank">参考動画 (Cube Community)</a> |
| <span id='DMCA'></span>**DMCA**<br><small>*ディーエムシーエー*</small> | デジタルミレニアム著作権法。著作物の無断使用を権利者が差し止める為の制度。 |
| <span id='DD'></span>**DD**<br><small>*ディーディー, Double Directional*</small> | 同じ色を同じ方向に連続で切らせる配置。自然な腕の交互の振り（<a href="#パリティ">パリティ</a>）を阻害するため、低難易度を除いては基本的に避けるべき配置である。ダブルディレクションの略。<br>※<a href="#ボムリセット">ボムリセット</a>は直感的な<a href="#リセット">リセット</a>が行える為、DDには含まれない。<br><img src="images/dd.jpg" width="150"> |
| <span id='diffスパイク'></span>**diffスパイク**<br><small>*diff spike*</small> | 譜面を通しで見た時、特定の配置またはパートで、難易度が急上昇していること。<br>関連: <a href="#ジャンプスケア">ジャンプスケア</a> |
| <span id='テック'></span>**テック**<br><small>*Teck*</small> | 角度変化が多かったり、複雑な切り方を要求する譜面ジャンル。<br>手首、腕、肩などの可動域を積極的に使い、「どう切るか」という技術的な読み・アプローチの難しさに特化している。 |
| <span id='ドッジウォール'></span>**ドッジウォール**<br><small>*Dodge Wall*</small> | 中央2レーンどちらかを覆う、プレイヤーに左右への回避動作を促すために配置される壁。<br>※中央2レーン完全に覆う壁は安全にプレイできない為、非推奨。<br>＝壁よけ |
| <span id='ドットノーツ'></span>**ドットノーツ**<br><small>*Dot Note*</small> | 切る方向が指定されていない、中央に丸い点が描かれたノーツ。どの方向から切ってもよい。 |
| <span id='トライアングル'></span>**トライアングル**<br><small>*Triangle*</small> | 三角形の頂点を結ぶような配置パターン。<br>「<a href="#パリティ">パリティ</a>が崩れ、<a href="#リセット">リセット</a>が発生してしまうこと」がこの配置の本質であり、パリティが適切に保たれる場合はトライアングルとはならない。<a href="#DD">DD</a>と同様、基本的には推奨されない。<br><img src="images/triangle.jpg" width="150"> |
| <span id='トランジション'></span>**トランジション**<br><small>*Transition*</small> | １．ライティングにおける「ライトから別のライトに遷移」する為のライトイベント。明るさを100→0に滑らかに遷移させたり、赤→青といった色の遷移も可能。<br>２．ノーツからノーツへ動きが遷移する際の「繋がり」を指す（ほぼ海外でのみ使われる言葉）。「ここの配置のトランジションがスムーズじゃない」等々。 |

## ナ行

| 用語 | 意味 |
| --- | --- |
| <span id='難易度'></span>**難易度**<br><small>*Difficulty*</small> | 標準的な難易度ラベルを指した言葉。EasyからExpertPlusまでの5段階がある。英語ではDifficulty。略してdiff。<br>Standard区分で5難易度揃っていることを<a href="#フルスプレッド">フルスプレッド</a>と呼ぶ。 |
| <span id='NoodleExtensions'></span>**NoodleExtensions**<br><small>*ヌードルエクステンション*</small> | <a href="#MappingExtensions">MappingExtensions</a>をさらに発展させ、ノーツの軌道アニメーションを曲げたりノーツの大きさを変えたりプレイヤーを動かしたりなどなど、ゲームプレイそのものを変えてしまうような高度なマッピング拡張Mod。そのような譜面は<a href="#Modchart">Modchart</a>と呼ばれる。 |
| <span id='No Arrows（難易度）'></span>**No Arrows（難易度）**<br><small>*ノーアローズ*</small> | 全てのノーツを「ドットノーツ」で配置した難易度の為のゲームモード。自由な切り方で楽しめるほか、いわゆる「ダースモール」等の特殊なプレイスタイルでも遊びやすい。<br>似たものとして、全てのノーツをドットノーツに「変更して」プレイできる同名のモディファイアも存在するが、こちらはあらゆる譜面でNo Arrowsがプレイできるものの、スコアにマイナス補正がつくほか、アークが消える。 |
| <span id='ノーツ'></span>**ノーツ**<br><small>*Note*</small> | プレイヤーがセイバーで切る対象となるブロック。切る方向が矢印で指定されているものと、指定がないもの（ドット）がある。 |

## ハ行

| 用語 | 意味 |
| --- | --- |
| <span id='バースト'></span>**バースト**<br><small>*Burst*</small> | ドラム音などが急激に高速になる箇所。およびその音を拾った高速<a href="#ストリーム">ストリーム</a>。<br>通常、1/6間隔または1/8間隔で置かれるストリームを指す。エレクトロニック楽曲のサビ前（ビルドアップ）でよく出てきがち。<br><img src="images/burst.jpg" width="150"> |
| <span id='パームアウト'></span>**パームアウト**<br><small>*Palm out*</small> | 手のひらが外側を向いている状態。または、その状態で切らせる配置。<br>テック譜面でよく使用される。 |
| <span id='パームアップ'></span>**パームアップ**<br><small>*Palm up*</small> | 手のひらが上側を向いている状態。または、その状態で切らせる配置。<br>テック譜面でよく使用される。 |
| <span id='ハイテック'></span>**ハイテック**<br><small>*High Tech*</small> | 強烈な角度や手首の急激な切り返しが連続する、極めて高難度なテック譜面。また、譜面自体の難易度が高く、密度多めで物量やスピード要素が混じってくることも多い。高い認識力と巧みなセイバー捌きが強く要求される。 |
| <span id='ハイパーウォール'></span>**ハイパーウォール**<br><small>*Hyper Wall*</small> | 壁の持続時間（奥行き）を負の値にした壁。通常の壁よりも高速で流れる。<br>ゲームの想定されてない挙動である為、基本的には推奨されない。 |
| <span id='バイブロ'></span>**バイブロ**<br><small>*Vibro*</small> | 手を小刻みに震わせることでしか処理できないような、超高速の上下配置。およびその譜面。<br>れっきとした<a href="#チャレンジ">チャレンジ</a>配置であり、<a href="#インライン">インライン</a>や<a href="#パラレルノーツ">パラレルノーツ</a>で置かれることも多く、ほとんどが<a href="#オーバーマッピング">オーバーマッピング</a>で行われる。チャレンジ譜面の中での代表的ジャンルといえる。<br><a href="https://youtu.be/3SfQ92q-0bU&t=162" target="_blank">参考動画 (Cube Community)</a> |
| <span id='拍'></span>**拍**<br><small>*Beat*</small> | 音楽における、ベースとなる規則的な間隔で刻まれるリズムの単位。拍子は拍のまとまり。<br>＝ビート |
| <span id='パターン'></span>**パターン**<br><small>*Pattern*</small> | 単一の、または一連のノーツ配置の型や組み合わせ。 |
| <span id='バックハンド'></span>**バックハンド**<br><small>*Backhand*</small> | 手の甲側に振り抜くスイング。 |
| <span id='バッドカット'></span>**バッドカット**<br><small>*Bad cut*</small> | 矢印と違う方向から斬ったり、違う色のセイバーで斬ったりすること。ミス判定となりコンボが途切れる。<br>関連: <a href="#巻き込み">巻き込み</a> |
| <span id='バニラ'></span>**バニラ**<br><small>*Vanilla*</small> | Modを一切導入していない素の状態のゲームを指す。<br><a href="#Chroma">Chroma</a>等のModを使用していないライティングはバニラライティングとも呼ばれる。<br>バニラフレーバー＝定番・プレーンという連想から |
| <span id='パブリッシュ'></span>**パブリッシュ**<br><small>*Publish*</small> | 完成した譜面を<a href="#BeatSaver">BeatSaver</a>に公開し、他のプレイヤーが遊べる状態にすること。 |
| <span id='パラレルノーツ'></span>**パラレルノーツ**<br><small>*Parallel Note*</small> | 同じ色・同じ方向のノーツが、横に2つ以上並んでいる配置。通常のスイングでは取りこぼしてしまう為、<a href="#ヒットボックス">ヒットボックス</a>や方向判定の仕組みを利用（悪用）した切り方が求められる。特殊な配置。ロロッペノーツとも。<br><img src="images/parallel.jpg" width="150"> |
| <span id='Balanced'></span>**Balanced**<br><small>*バランス、バランスド*</small> | 特定のマップスタイルに偏りすぎていない、または、様々なスタイルをバランスよく用いた譜面。そのジャンル。 |
| <span id='パリティ'></span>**パリティ**<br><small>*Parity*</small> | セイバーの自然な振りの為、フォアハンドスイングとバックハンドスイングが交互に続くようノーツを配置するという概念。パリティが保たれている譜面は直感的でプレイしやすく、現代マッピングのセオリーとなっている。<br><a href="https://note.com/toro_desu/n/n6cad8770caaf" target="_blank">解説記事</a> |
| <span id='ハンドクラップ'></span>**ハンドクラップ**<br><small>*Handclap*</small> | 赤青が向かい合ったノーツ配置。コントローラーが衝突する危険性が高い為、基本的に推奨されない。<br>※<a href="#クラッシュ">クラッシュ</a>すること自体を指してハンドクラップと呼ぶ場合もある<br><img src="images/handclap.jpg" width="150"> |
| <span id='ハンマーヒット'></span>**ハンマーヒット**<br><small>*Hammer Hit*</small> | ボムに向いているノーツ。これを切るためにはノーツカットの瞬間にセイバーを止める必要があり、角度点をとるのが困難になる為、推奨されない。<br><img src="images/hammer.jpg" width="150"> |
| <span id='BSMG'></span>**BSMG**<br><small>*ビーエスエムジー*</small> | Beat Saber Modding Groupの略。世界最大の非公式Beat Saberコミュニティ、およびそのdiscordサーバー。<br>Mod導入・開発や譜面制作、ゲームのQ&A、<a href="#イベント">イベント</a>開催などなど、Beat Saberにまつわるあらゆるトピックが扱われる。WebサイトのWikiはマッパー・プレイヤー問わず必見。<br><a href="https://bsmg.wiki/" target="_blank">https://bsmg.wiki/</a> |
| <span id='BSManager'></span>**BSManager**<br><small>*ビーエスマネージャー*</small> | Beat Saberの複数バージョンの共存や、Mod、マップ、プレイリストのインストールなどを一括管理できる強力なオールインワンツール。<a href="#BSMG">BSMG</a>コミュニティではBSManagerの導入が推奨されている。 |
| <span id='BeastSaber'></span>**BeastSaber**<br><small>*ビーストセイバー*</small> | <a href="#BeatSaver">BeatSaver</a>と連携し、おすすめ譜面（<a href="#キュレート">キュレート</a>）や<a href="#Map of the Week">Map of the Week</a>、おすすめプレイリストの紹介、情報記事の公開、<a href="#マッピングアワード">マッピングアワード</a>の企画などなどを行うポータルサイト。<br>※キュレート譜面、キュレートプレイリストはBeatSaverでも確認できる |
| <span id='ビート'></span>**ビート**<br><small>*Beat*</small> | 拍のこと。<br>Beat Saberでは譜面の特定の配置を指す時、「34.5ビートの配置が～」というようにビート数で示すのが一般的である。 |
| <span id='BeatSaver'></span>**BeatSaver**<br><small>*ビートセイヴァー、ビートサーバー*</small> | ユーザーが作成したカスタム譜面をアップロード・ダウンロードできる非公式サイト。<br>※発音はビートセイヴァーが正しいのだが、日本語発音だとビートセイバーと区別がつきにくいので、「ビートサーバー」と言い換える人も多い |
| <span id='BeatLeader'></span>**BeatLeader**<br><small>*ビートリーダー*</small> | <a href="#ScoreSaber">ScoreSaber</a>の後に登場した非公式リーダーボードMod。およびランクシステム。Webからも確認できるリプレイ機能や詳細な統計データの分析など、<a href="#ランク譜面">ランク譜面</a>をプレイしない人にも便利な多機能さが特徴。独自のセイバーMod「ReeSabers」も提供している。 |
| <span id='PP'></span>**PP**<br><small>*ピーピー*</small> | <a href="#ScoreSaber">ScoreSaber</a>や<a href="#BeatLeader">BeatLeader</a>で、<a href="#ランク譜面">ランク譜面</a>をクリアした際に実力に応じて得られるパフォーマンスポイント。各ランクではこれを稼ぐことで競い合っている。 |
| <span id='BPM'></span>**BPM**<br><small>*ビーピーエム*</small> | 1分間あたりの拍数（テンポ）。曲の速さを示す音楽的な指標。 |
| <span id='ビジョンブロック'></span>**ビジョンブロック**<br><small>*Vision Block*</small> | 中央2マスいずれかに位置するノーツ・ボム・壁が視界の邪魔になり、次に切るべきノーツが隠れて見えなくなること。プレイが困難になる為、基本的にはそれが起きないようマッピングすべきである。略してVB。 |
| <span id='ヒットボックス'></span>**ヒットボックス**<br><small>*Hitbox*</small> | ノーツに設定されている「当たり判定」の領域。見た目のサイズより大きめに設定されている。<br>画像の赤枠がヒットボックス。紫枠は<a href="#バッドカット">バッドカット</a>判定が発生する領域。<br>※画像は<a href="#BeatLeader">BeatLeader</a>から<br><img src="images/hitbox.jpg" width="150"> |
| <span id='表現'></span>**表現**<br><small>*Representation*</small> | 曲の音、リズム、ボーカルなどを、ノーツの配置やライティング等で解釈し譜面として落とし込み、具体化・抽象化して表すこと。譜面の評価基準のひとつ。 |
| <span id='VNJS'></span>**VNJS**<br><small>*ブイエヌジェーエス*</small> | ノーツの流れてくる速度（<a href="#NJS">NJS</a>）が曲の途中で変化する機能。1.40.0で追加された公式要素で、<a href="#V4マップ">V4マップ</a>で利用できる。<br>パートの変化に合わせてNJSを変えられるだけでなく、使い方の工夫により、ノーツを消したり止めたり巻き戻したりといったギミック効果を作り出すことも可能。Variable NJSの略。可変NJS、ソフラン（音ゲー用語）とも。<br><a href="https://x.com/ge2toro/status/1877682614338769133?s=20" target="_blank">参考動画</a> |
| <span id='V3ウォール'></span>**V3ウォール**<br><small>*ブイスリーウォール*</small> | <a href="#V3マップ">V3マップ</a>以降で使用できる、位置・高さを細かく調整できるようになった壁。横方向はレーン外に設置することも可能。<br><img src="images/v3wall.jpg" width="150"> |
| <span id='V3マップ'></span>**V3マップ**<br><small>*ブイスリーマップ*</small> | 譜面形式のバージョン、V3フォーマットで作られたマップを指す。<br>チェイン、アーク、<a href="#V3ライティング">V3ライティング</a>、<a href="#V3ウォール">V3ウォール</a>などが新要素として追加された。<br>関連: <a href="#マップフォーマット">マップフォーマット</a> |
| <span id='V3ライティング'></span>**V3ライティング**<br><small>*ブイスリーライティング*</small> | <a href="#V3マップ">V3マップ</a>で導入された新しいライティングシステム。詳細なライト制御、オブジェクトを自由にアニメーションさせたりなど、ライティング<a href="#表現">表現</a>の自由度が格段に増した。<br>Weave <a href="#Environment">Environment</a>以降がV3ライティングシステムである。V3以降のマップ形式でのみ利用可能。 |
| <span id='V2マップ'></span>**V2マップ**<br><small>*ブイツーマップ*</small> | V3が導入される前の譜面フォーマット。アークやチェインなどは使えない。<br>関連: <a href="#マップフォーマット">マップフォーマット</a> |
| <span id='V2ライティング'></span>**V2ライティング**<br><small>*ブイツーライティング*</small> | <a href="#V2マップ">V2マップ</a>時代から存在するシンプルなライティングシステム。5～9種のライトを点灯でき、リングやレーザーなどの簡単な制御が行える。<a href="#Chroma">Chroma</a>を導入することで詳細な制御・改造が可能。<br>Gaga <a href="#Environment">Environment</a>までがV2ライティングシステムである。V3以降のマップ形式でも利用可能。 |
| <span id='Fitbeat'></span>**Fitbeat**<br><small>*フィットビート*</small> | しゃがみ壁や左右への壁よけ、動きのあるノーツ配置を使い、曲にノリながら全身を使った運動に特化したジャンル。全身運動の相性の良さからテック配置が使われることも多い。公式譜面の"Fitbeat"が由来。<br>純粋にスクワットだけを繰り返す譜面はスクワット譜面として区別される。 |
| <span id='V4ウォール'></span>**V4ウォール**<br><small>*ブイフォーウォール*</small> | <a href="#V4マップ">V4マップ</a>では、壁の縦方向の設置可能範囲がさらに広がっており、それを利用した壁のこと。<br>※1.41以降のゲームでのみ機能する<br>関連: <a href="#V3ウォール">V3ウォール</a><br><img src="images/v4wall.jpg" width="150"> |
| <span id='V4マップ'></span>**V4マップ**<br><small>*ブイフォーマップ*</small> | 譜面形式のバージョン、V4フォーマットで作られたマップを指す。<br>譜面データ構造を刷新して効率化された。ゲームver1.34.5以降でのみプレー可能。<br><a href="#VNJS">VNJS</a>、<a href="#V4ウォール">V4ウォール</a>という新要素もあるが、それぞれ特定バージョン以降でしか機能しない点に注意。<br>関連: <a href="#マップフォーマット">マップフォーマット</a> |
| <span id='V1'></span>**V1**<br><small>*ブイワン*</small> | １．アーリーアクセス時代の<a href="#マップフォーマット">マップフォーマット</a>。現在では廃止されV2以降がサポートされている。<br>２．Beat Saber初期の頃の配置スタイルを指す。<a href="#パリティ">パリティ</a>の概念が無かったり、ノーツが下段中段に集中していたり、配置が自由奔放だったりが特徴。いにしえの譜面。 |
| <span id='ブーストライト'></span>**ブーストライト**<br><small>*Boost Light*</small> | バニラライティングにおける、メイン２色＋ホワイト1色の３色のカラーセットとは別の、追加のカラーセット（ブーストカラー）。ブーストイベントを配置することで、その瞬間にライトの色はブーストカラーのセットへと切り替わり、曲展開に合わせて異なるカラーセットを使い分けることができる。異なるカラーセットの同時使用はできない。<br>一部の古いV2 <a href="#Environment">Environment</a>では、デフォルトではブーストカラーが存在しないものがあり、その場合使用する為には<a href="#カスタムカラー">カスタムカラー</a>の設定が必要である。 |
| <span id='プードル'></span>**プードル**<br><small>*Poodle*</small> | ポールノーツに<a href="#NoodleExtensions">NoodleExtensions</a>を用いることで、軌道を滑らかに曲げ、より切りやすくした配置。およびその譜面。今では<a href="#BeatSaver">BeatSaver</a>タグも存在する人気ジャンルに。<br>Paul + Noodle = Poodle<br>関連: <a href="#ポール">ポール</a><br><img src="images/poodle.jpg" width="150"> |
| <span id='フェイクウォール'></span>**フェイクウォール**<br><small>*Fake Wall*</small> | <a href="#NoodleExtensions">NoodleExtensions</a>を利用し、触れてもダメージを受けない演出用の壁。<br><a href="#バニラ">バニラ</a>でも壁の幅を負の値にすることで同様の壁を置くことができるが、本来想定されていない動作である為あまり推奨されない。 |
| <span id='フェイクノーツ'></span>**フェイクノーツ**<br><small>*Fake Note*</small> | <a href="#NoodleExtensions">NoodleExtensions</a>を利用し、実際には切れない（判定がない）視覚的な演出として配置されるノーツ。 |
| <span id='フェイスノーツ'></span>**フェイスノーツ**<br><small>*Face Note*</small> | プレイヤーの顔面に向かって飛んでくる中央2マスいずれかのノーツのこと。プレイヤーの視界を覆ってしまう為、<a href="#ビジョンブロック">ビジョンブロック</a>の問題を招きやすい。慣れないうちは置かないほうがいいマス。 |
| <span id='フォアハンド'></span>**フォアハンド**<br><small>*Forehand*</small> | 手のひら側に振り抜くスイング。 |
| <span id='4-wide'></span>**4-wide**<br><small>*フォーワイド*</small> | 4レーンの幅を示す言葉。<br>4レーンに伸びる横<a href="#タワー">タワー</a>を4-wideタワー、4レーンの間隔を持つクロス配置を4-wideクロス、などなど。 |
| <span id='物量譜面'></span>**物量譜面**<br><small>*Stamina(?)*</small> | ノーツの総数・密度が非常に多く、長時間にわたって腕を振り続ける必要がある譜面。プレイヤーのスタミナが試される。スタミナ譜面とも。 |
| <span id='譜面（マップ）'></span>**譜面（マップ）**<br><small>*Map, Chart*</small> | 曲のリズムや音に合わせてノーツや壁などを配置したもの。ライティングなどを含めたパッケージそのものを指すことも多い。マップとも。 |
| <span id='プラットフォーム'></span>**プラットフォーム**<br><small>*Platform*</small> | プレイヤーが立つ足場や周囲のステージ環境。<a href="#Environment">Environment</a>と同義で使われるか、カスタムプラットフォームModによるものを指す。 |
| <span id='フラワーノーツ'></span>**フラワーノーツ**<br><small>*Flower Note*</small> | ノーツを45度違いで重ねて配置したもの。花のような見た目をした特殊な配置。<br><img src="images/flower.jpg" width="150"> |
| <span id='フリック'></span>**フリック**<br><small>*Flick*</small> | ノーツが2個連続した、手首のスナップを使って素早く弾くように切る配置。高難度配置。<br>基本的には1/4ビート間隔（またはそれに近い速さ）で置かれた2連続ノーツが該当する。<br><img src="images/flick.jpg" width="150"> |
| <span id='フルスプレッド'></span>**フルスプレッド**<br><small>*Full Spread*</small> | EasyからExpertPlusまで、標準的なすべての難易度（Difficulty）が網羅されていること。およびその譜面。<br>Standard区分での難易度が揃っていることが本質であり、例えばコラボ等でEx+が2つありEasyが欠けている5難易度展開はフルスプレッドとはならない。 |
| <span id='フロー'></span>**フロー**<br><small>*Flow*</small> | 文字通り、ノーツからノーツに繋がるセイバーの「流れ」。スムーズにスイングが繋がる譜面やパターンは「フローが良い・気持ち良い」と評価される。<br>多くの場合は動きのある譜面でそのスムーズさを表す時に使われる為、極端な話「上下が連続するだけの譜面」はスムーズであるもののフローは単調であるとも言える。 |
| <span id='Heck'></span>**Heck**<br><small>*ヘック*</small> | <a href="#Chroma">Chroma</a>, <a href="#NoodleExtensions">NoodleExtensions</a>, <a href="#Vivify">Vivify</a>の前提Mod。 |
| <span id='Verified Mapper'></span>**Verified Mapper**<br><small>*ベリファイドマッパー*</small> | <a href="#BSMG">BSMG</a>によって認定されたマッパー。高品質なマップを継続的に制作する能力があると審査によって認められた者たちであり、コミュニティの代表（お手本）として見なされる。<br>認定にはマッパー本人からの申請が必要で、いくつかの公開済みマップを提出し、審査が行われる。認定されるとdiscordロールがつき、<a href="#BeatSaver">BeatSaver</a>ではVerified Mapperを示す紫の帯が表示されるようになる。<br><img src="images/verified.jpg" width="150"> |
| <span id='ポール'></span>**ポール**<br><small>*Paul*</small> | 同じ向きのノーツが真っ直ぐ1列に大量に連なっている配置。およびその譜面。<br>セイバーをゆっくりとスイングすることで一振りで切ることができるが、難易度は非常に高い。<br>※英語表記はPoleではなく、Paulが正しい。<br>関連: <a href="#プードル">プードル</a><br><img src="images/paul.jpg" width="150"> |
| <span id='ホットスタート'></span>**ホットスタート**<br><small>*Hot Start*</small> | 曲が始まってから最初のノーツ・ボム・壁よけが飛んでくるまでの時間が極端に短いこと。プレイヤーの準備が間に合わないため非推奨。<br>※ランク基準では最低1.5秒、一般的には最低2秒の猶予を作ることが推奨されている |
| <span id='ボム'></span>**ボム**<br><small>*Bomb*</small> | トゲトゲした黒い障害物。セイバーが当たるとダメージを受けコンボが途切れる。 |
| <span id='ボムホールド'></span>**ボムホールド**<br><small>*Bomb Hold*</small> | 特定のノーツを切った後、プレイヤーのセイバーを一時的にそこから動かせないように（ホールド）制限するボムの配置。<br><img src="images/bombhold.jpg" width="150"> |
| <span id='ボムリセット'></span>**ボムリセット**<br><small>*Bomb reset*</small> | プレイヤーのセイバーの軌道を強制的に元の位置に戻させる（<a href="#リセット">リセット</a>させる）目的で配置されたボムのこと。略称は「ボムリセ」。<br><img src="images/bombreset.jpg" width="150"> |

## マ行

| 用語 | 意味 |
| --- | --- |
| <span id='巻き込み'></span>**巻き込み**<br><small>*※適する英語なし？*</small> | 狙ったノーツを切る際に、意図せず別の色のノーツまで一緒に切ってしまうミスのこと。ノーツ同士の配置が近すぎたり、スイング軌道上に別の色のノーツが被っている場合に発生しやすい。 |
| <span id='マッパー'></span>**マッパー**<br><small>*Mapper*</small> | 譜面（マップ）を作成する人のこと。 |
| <span id='マッピング'></span>**マッピング**<br><small>*Mapping*</small> | 楽曲に合わせてノーツ、壁、ボムなどを配置し、譜面（マップ）を作成する作業のこと。 |
| <span id='マッピングアワード'></span>**マッピングアワード**<br><small>*The BeastSaber Mapping Awards*</small> | <a href="#BeastSaber">BeastSaber</a>が主催する、その年の優れた譜面やマッパーを表彰する非公式の年間アワードイベント。ノミネートは全プレイヤーからの推薦によって決まり、表彰は一般投票、ベテランマッパーチームによる投票などで決定される。別名Beasties。 |
| <span id='MappingExtensions'></span>**MappingExtensions**<br><small>*マッピングエクステンション*</small> | ノーツや壁を、通常の規格外の場所・角度で置けるようにできる、元祖マッピング拡張Mod。<br>※現在でも使用可能だが、<a href="#NoodleExtensions">NoodleExtensions</a>が後継のような存在なので通常はそちらが推奨される |
| <span id='マッピングエディタ'></span>**マッピングエディタ**<br><small>*Mapping editor*</small> | 譜面を作成するためのソフトウェア。現在は<a href="#ChroMapper">ChroMapper</a>が主流。公式によるエディタもある。 |
| <span id='Map of the Week'></span>**Map of the Week**<br><small>*マップオブザウィーク*</small> | <a href="#BeastSaber">BeastSaber</a>で毎週選出される「今週のベストマップ」。<a href="#キュレーター">キュレーター</a>の推薦によって選出される。<br>譜面の品質はもとより、楽しさ、下位難易度の有無、手製のライティング、などなど総合的なクオリティで評価される。間違いなく多くの人にオススメできる譜面といえる。 |
| <span id='マップフォーマット'></span>**マップフォーマット**<br><small>*Map Format*</small> | 譜面（難易度ファイル）のデータ構造の規格。譜面形式。<br>難易度ファイルにはversion4.1.0、といったようにバージョンがつけられており、大きなアップデートがあった場合は頭の数字が上がり、それをもって<a href="#V4マップ">V4マップ</a>などと呼ばれる。<br>バージョンが上がると仕様が変わるほか、アーク・チェインや<a href="#VNJS">VNJS</a>などのように譜面に新要素が追加されることが多い。新要素は基本的に古いゲームバージョンと互換性が無く、例えばV4マップのVNJS機能は1.40未満では機能せず、また、V4マップそのものは1.34.5未満ではプレイすること自体できない。<br>現在はV2,V3,V4の3バージョンがプレイ可能であり、バージョンの数字は難易度ファイルを直接開くことで確認できる。<br><a href="https://note.com/toro_desu/n/nc44cf87adc04" target="_blank">解説記事</a> |
| <span id='◯◯テック'></span>**◯◯テック**<br><small>*-*</small> | 以下は、わりと雰囲気で語られることが多く、定義がふんわりした側面もあることから、参考程度に記載させていただく。<br>アングルテック: 角度変化が主体であるテック譜面<br>ギミックテック: 今までにないような、ユニークなテックパターンをコンセプトとしたテック譜面<br>回転テック: 手や腕を回す勢いで<a href="#フロー">フロー</a>を構成するテック譜面。モメンタムテックとも |
| <span id='ミスマップ'></span>**ミスマップ**<br><small>*Mismap*</small> | 配置ミスを指す。コピペミス、誤クリック、誤削除などなど |
| <span id='ミッドスピード'></span>**ミッドスピード**<br><small>*Mid Speed*</small> | BPMが遅すぎず速すぎず、ほどほどの密度を切らせる中速帯の譜面。<br><a href="#リニア">リニア</a>なものもあれば、テック寄りのものもある。 |
| <span id='ミラー（配置）'></span>**ミラー（配置）**<br><small>*Mirror*</small> | 作成済みの配置をミラー反転すること。どのエディターでもデフォルトで利用可能な機能であり、<a href="#一貫性">一貫性</a>を保ったままお手軽に変化をつけてコピペすることができる為、同じパートの繰り返しなどでよく利用されるマッピング技法である。 |
| <span id='Modding'></span>**Modding**<br><small>*モッディング、モディング*</small> | １．ゲームにModを導入すること。<br>２．ランク譜面化の為のMod作業を行うこと。ランク化の為の必須プロセス。 |
| <span id='Mod'></span>**Mod**<br><small>*モッド*</small> | １．有志によって開発された、ゲームに新機能を追加したりシステムを変更したりする非公式の拡張プログラム。<br>２．ランク譜面化を目指す際、Modder（添削する専門の人）が譜面を詳細にチェックし、ランク基準に基づき配置や音取りなどの修正要求を行う作業のこと。語源はリズムゲーム「osu!」の同様の文化から。 |
| <span id='ModAssistant'></span>**ModAssistant**<br><small>*モッドアシスタント*</small> | 過去に主流だったMod導入ツール。現在も利用可能であるものの、<a href="#BSManager">BSManager</a>の利用が推奨されている。 |
| <span id='Modchart'></span>**Modchart**<br><small>*モッドチャート*</small> | Modの<a href="#NoodleExtensions">NoodleExtensions</a>を使い、ノーツの軌道アニメーションを曲げたりノーツを消したりプレイヤーを動かすなど、視覚演出や特殊なプレイ体験に特化した譜面。<a href="#Chroma">Chroma</a>や<a href="#Vivify">Vivify</a>が併用されることも多い。<br>Modを使ったChart（譜面）＝Modchart |
| <span id='モメンタム'></span>**モメンタム**<br><small>*Momentum*</small> | セイバーを振った時に生まれる物理的な「勢い」。主に、腕や手による遠心力や重心移動での勢いを指し、その勢いを推進力に使って大きく角度変化させるテック配置は回転テック・モメンタムテックとも呼ばれる。<a href="https://beatsaver.com/profile/4234943" target="_blank">GojiCrafter</a>のテック譜面がその例としてとてもわかりやすい。 |

## ヤ行

| 用語 | 意味 |
| --- | --- |
| <span id='誘導'></span>**誘導**<br><small>*※適する英語なし？*</small> | 次のパターンを無理なく切れるように、直前までの配置を工夫して次の配置へ自然に導く流れを作ること。<br>※「<a href="#セットアップ">セットアップ</a>」とほぼ同義であり使用ケースもほぼ被っているが、こちらはプレイヤーに動きの「道筋」を示すニュアンスが強い。例えば「大胆な腕の移動をさせる配置をわかりやすくする為に、ボムやアークを置いて誘導を強める」など。 |

## ラ行

| 用語 | 意味 |
| --- | --- |
| <span id='ライター'></span>**ライター**<br><small>*Lighter*</small> | ライトを作成する人のこと。<br><a href="#V4マップ">V4マップ</a>からはマッパーとライターそれぞれ分けてクレジットできるようになった。 |
| <span id='ライティング'></span>**ライティング**<br><small>*Lighting*</small> | 背景のライトなどの照明演出。または、それらライトを配置して作成する作業のこと。 |
| <span id='ライトショー'></span>**ライトショー**<br><small>*Lightshow*</small> | １．ライティング観賞用のゲームモード。非公式の<a href="#Characteristic">Characteristic</a>であり、<a href="#SongCore">SongCore</a>によってサポートされる。<br>ノーツが無く、ライトや<a href="#ウォールアート">ウォールアート</a>を鑑賞するために用意される難易度。ノーツが配置できないわけではない。<br>※モディファイアのZenモードを使うことで通常難易度でもライトだけを鑑賞できる。<br>２．ライティング(照明)の言い換え。「素晴らしいライトショーだ」 |
| <span id='ランク譜面'></span>**ランク譜面**<br><small>*Ranked map*</small> | <a href="#ScoreSaber">ScoreSaber</a>や<a href="#BeatLeader">BeatLeader</a>のランク化プロセス(Modding)を完了し、ランク対象として認められた譜面。星評価（Star Rate）という独自の難易度指標が与えられ、星の数値が高いほど難しいとされる。クリアすることで<a href="#PP">PP</a>が得られる。 |
| <span id='ランダム（ランダム性）'></span>**ランダム（ランダム性）**<br><small>*random*</small> | 配置パターンや<a href="#強調">強調</a>の<a href="#一貫性">一貫性</a>に欠け、まとまりがなく配置された様。 |
| <span id='リアクションタイム'></span>**リアクションタイム**<br><small>*Reaction Time*</small> | ノーツが出現してからプレイヤーに到達するまでの時間。<a href="#NJS">NJS</a>と<a href="#JD">JD</a>の設定によって決まる。略してRT。<br>プレイヤーがノーツを認識してアクションを行う為の猶予時間と言い換えることもでき、譜面のJD（<a href="#HJD">HJD</a>）を設定する際は「想定するプレイヤー層がそのリアクションタイムで反応できるか」が一つの判断材料になる（特に低難度譜面においては）。<br>JDFixerなどのModを使うことで、プレイヤー側でリアクションタイムを直接指定してプレイすることも可能。 |
| <span id='リーン'></span>**リーン**<br><small>*Lean*</small> | プレイヤーの身体を斜め・横方向に傾けさせることを意図した配置<a href="#フロー">フロー</a>。または、傾く行為そのもの。 |
| <span id='リストロール'></span>**リストロール**<br><small>*Wrist Roll*</small> | 手首（リスト）を回すように滑らかに捻ること。またはその動きで処理する配置パターン。テック譜面などで頻出。<br>例えば、同じ向きのノーツは通常では<a href="#DD">DD</a>だが、<a href="#パリティ">パリティ</a>の保たれたテック譜面であれば、1個目を<a href="#フォアハンド">フォアハンド</a>→2個目を<a href="#バックハンド">バックハンド</a>、といったように手首を捻って（リストロールで）処理することが正しい切り方となる。 |
| <span id='リセット'></span>**リセット**<br><small>*Reset*</small> | プレイヤーが何もないところでセイバーのスイングを戻して、ニュートラルのポジションに戻す行為。<br><a href="#パリティ">パリティ</a>を遵守した譜面を作る為には、マッパーはリセットを要する配置は含んではならない。<br>※初心者向けである低難易度や、ボムを伴う<a href="#ボムリセット">ボムリセット</a>、特殊な譜面などは例外<br>プレイヤー目線では、意図的にリセットすることでテック譜面を強引に攻略するテクニックも存在する。 |
| <span id='リニア'></span>**リニア**<br><small>*Linear*</small> | 曲線的・並行的な動きが無く、直線的なノーツ配置であること。<br>関連: <a href="#リニアスピード">リニアスピード</a> |
| <span id='リニアスピード'></span>**リニアスピード**<br><small>*Linear Speed*</small> | 直線的な配置で（直線的なジャンプで）作られたスピード譜面。純粋なスピード対応力が求められる。<br>関連: <a href="#リニア">リニア</a> |
| <span id='リパブリッシュ'></span>**リパブリッシュ**<br><small>*Republish*</small> | 一度公開した譜面のエラーや配置を修正し、再度アップロードし直すこと。<br>リパブリッシュするとリーダーボードはまっさらな状態に戻る。※<a href="#BeatLeader">BeatLeader</a>では一部例外あり |
| <span id='ReMapper'></span>**ReMapper**<br><small>*リマッパー*</small> | プログラミング（TypeScript）を用いて、譜面をコードベースで効率的に作成・編集するためのフレームワーク。<a href="#Chroma">Chroma</a>や<a href="#NoodleExtensions">NoodleExtensions</a>、<a href="#Vivify">Vivify</a>等を用いた<a href="#Environment">Environment</a>の改造、複雑なライト演出や空間演出などを、コードを書くことで効率化・高度化できる。 |
| <span id='レーン'></span>**レーン**<br><small>*Lane*</small> | ノーツが配置される4x3グリッドの縦の列。通常では4列存在する。<br>特定レーンを指して中央（インナー）レーン、外（アウター）レーンなどと呼ばれることも。 |
| <span id='Legacy（難易度）'></span>**Legacy（難易度）**<br><small>*レガシー*</small> | 過去の譜面をリメイクする際などで、古い難易度を残しておく為に使用する公式の<a href="#Characteristic">Characteristic</a>。何か独自仕様があるわけではないので、モディング前の難易度を残しておきたい時など、使い方は自由。 |
| <span id='Lawless'></span>**Lawless**<br><small>*ロウレス*</small> | <a href="#ゲームモード（難易度区分）">ゲームモード（難易度区分）</a>の1種。非公式<a href="#Characteristic">Characteristic</a>であり、<a href="#SongCore">SongCore</a>によってサポートされる。<br>”無秩序”の意味が示す通り、なんでもありな譜面を置くため（それを明示的にする為）の難易度。 |
| <span id='ローテック'></span>**ローテック**<br><small>*Low Tech*</small> | テック譜面の中でも、ノーツ密度が抑えめで、複雑さや難解さが比較的控えめなスタイル。テック特有の要素はありつつ、多くの人がプレイできる。 |

## ワ行

| 用語 | 意味 |
| --- | --- |
| <span id='ワンセイバー'></span>**ワンセイバー**<br><small>*OneSaber*</small> | 片手のセイバーのみを使ってプレイする公式のゲームモード。<br>このモードで譜面を作った場合、プレイヤーのセイバーは右手側しか表示されない（プレイヤーがレフティーをオンにすることで左手に対応）。 |

---

## クレジット

* **作成者:** toro<br>
<a href="https://x.com/ge2toro" target="_blank">X (Twitter)</a>
<br><a href="https://note.com/toro_desu" target="_blank">note</a>
<br><a href="https://discord.gg/gfKQkgcpmE" target="_blank">Discordサーバー(mapping group)</a>
<br><small>私が管理しているマッピング全般を扱うサーバーです。当用語集について話し合うチャンネルもあります。</small><br>

* **参考サイト:**<br>
この用語集の作成にあたり、以下のサイトも参考にしています。
<br><a href="https://bsmg.wiki/" target="_blank">BSMG Wiki</a>
<br><a href="https://wiki.scoresaber.com/" target="_blank">ScoreSaber Wiki</a>
<br><a href="https://beatleader.wiki/en/home" target="_blank">BeatLeader wiki</a>

* **最終更新日:** 2026年04月04日