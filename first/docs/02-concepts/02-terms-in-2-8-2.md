# 2.2 2.8.2 が定義する用語

前章で、本書の事実は `awslabs/aidlc-workflows` の 2.8.2 に固定すると決めました。この章では、その 2.8.2 が自分の用語集（`docs/guide/glossary.md`）と導入章の Key Numbers で定義している言葉を、本書で使う日本語表記とともに一つずつ整理します。第 3 部以降はここで定義した言葉を前提にするので、辞書として読み、分からなくなったら戻ってきてください。

## この章で学ぶこと

- 5 つのフェーズの名前と目的、ステージとの関係を説明できる。
- エージェント、スコープ、深さ（Depth）、テスト戦略（Test Strategy）、監査イベント種別の数を、2.8.2 の Key Numbers の値で言える。
- 承認ゲート、Intent と Space、Unit、Bolt、walking skeleton、mob 実行、ラダープロンプト、監査ログ、学びを一文ずつ説明できる。

## 用語の出どころと表記のルール

2.8.2 の用語の出どころは 3 つです。ユーザーガイドの用語集 `docs/guide/glossary.md` はすべての用語の定義を 1 つの表にまとめ、導入章 `docs/guide/00-introduction.md` の Key Numbers は数値を一覧にし、知識ファイル `core/knowledge/aidlc-shared/ai-dlc-principles.md` は 5 つのフェーズの目的を表にしています。この章の定義はこの 3 つから取ります。

日本語表記は、本書全体で 1 語 1 訳に固定しています。大きく 3 つの区分があります。

| 区分 | 扱い | 例 |
| --- | --- | --- |
| 英語のまま（固有名詞） | 初出で一文の説明を添える | AI-DLC、Bolt、Unit、Intent、Space、walking skeleton、フェーズ名 |
| 訳す | 訳語を固定し、必要なら括弧で原語を添える | ステージ、スコープ、深さ（Depth）、承認ゲート、監査ログ、学び、mob 実行、ラダープロンプト |
| コードスパンで英語のまま | コマンド、パス、slug、イベント名、判定値など | `aidlc-state.md`、`autonomous`、`SWARM_COMPLETED` |

以下の節では、この区分に従って用語を定義します。各定義の末尾の括弧は、用語集での見出し語（Term 列の綴り）です。

## フェーズとステージ — ライフサイクルの骨格

**フェーズ**（Phase）は、ライフサイクルを構成する 5 つの大きな区分で、Initialization（0）、Ideation（1）、Inception（2）、Construction（3）、Operation（4）と番号が振られています。それぞれの目的は、方法論の知識ファイルの Five-Phase Structure の表に次のように書かれています。

| フェーズ | 目的 | 主な成果 |
| --- | --- | --- |
| Initialization | 起動 — 状態ファイル、ディレクトリの骨格、ワークスペースの走査、ルーティング | ワークフローを始められる設定済みのワークスペース |
| Ideation | 取り組みの妥当性を確かめる — 意図、市場、実現可能性、スコープ、チーム | 承認された initiative brief |
| Inception | 詳細化する — 要件、ストーリー、設計、アーキテクチャ、Unit、デリバリー計画 | 詳細な実行計画 |
| Construction | 作る — 機能設計、非機能要件、インフラ、コード、テスト、CI | 動くテスト済みのコード |
| Operation | 配備して運用する — パイプライン、環境、可観測性、インシデント、フィードバック | 監視付きの本番システム |

フェーズ名は固有名詞として英語のまま書きます。日本語にすると一般語と区別がつかず、状態ファイルや監査ログに現れる英語名と対応づけにくくなるからです。

**ステージ**（Stage）は、ライフサイクルを構成する 33 の個別の手順です。各ステージにはリードエージェント、定義された入力と出力があり、共通のステージプロトコルに従って進みます。番号はフェーズごとに振られ、1.1、2.4、3.5 のように「フェーズ番号.ステージ番号」の形で呼びます。各フェーズのステージ数は、Initialization が 3、Ideation が 7、Inception が 9、Construction が 7、Operation が 7 で、合計が 33 です。初回公開の 0.1.0 では 32 で、2.7.0 で 33 になりました。

```text
+----------------+-----------+-----------+--------------+-----------+
| Initialization | Ideation  | Inception | Construction | Operation |
| 0.x  3 stages  | 1.x  7    | 2.x  9    | 3.x  7       | 4.x  7    |
+----------------+-----------+-----------+--------------+-----------+
```

5 つのフェーズを左から右へ並べ、番号の接頭辞とステージ数を示した図です。

## エージェント・スコープ・深さ・テスト戦略 — 「誰が、どこまで」を決める言葉

**エージェント**（Agent）は、2.8.2 に同梱された 14 のペルソナのことです。内訳は 11 の専門家、2 つのレビュー専用エージェント、そして適応的ワークフローのコンポーザーで、コンダクター（読者と会話している `/aidlc` のセッション）が、ステージ、レビュー、あるいは構成の役割に応じてそれぞれを起動します。専門家 11 の名前は product、design、delivery、architect、aws-platform、compliance、devsecops、developer、quality、pipeline-deploy、operations です。

**レビュアー**（Reviewer）は、ステージの本体が成果物を作った後に別のサブエージェントとして呼ばれる品質確認の役で、`aidlc-product-lead-agent`（要件・ストーリー・モックアップ）と `aidlc-architecture-reviewer-agent`（技術設計）の 2 つです。READY か NOT-READY の判定と所見を書きますが、決してワークフローを止めません。判断はいつも人に残ります。

**スコープ**（Scope）は、どのステージをどの深さで実行するかを決める 11 の名前付き設定です。名前は enterprise、feature、mvp、poc、bugfix、refactor、infra、security-patch、classic、workshop、express で、自由文の意図から自動検出することもできます。スコープ名は本文でもコードスパンで書きます（例: `classic`）。

**深さ（Depth）** は、各ステージがどれだけ詳細な成果物を作るかを制御する 3 段階で、Minimal、Standard、Comprehensive です。スコープごとに既定の深さがあり、任意の承認ゲートで上書きできます。

**テスト戦略（Test Strategy）** は、生成するテストの量とテスト種別を制御する 3 段階で、こちらも Minimal、Standard、Comprehensive です。深さとは独立で、スコープが上書きを宣言しない限り、有効な深さと同じ段階が既定になります。

Key Numbers にはもう 1 つ数値があります。**監査イベント種別**の数は 95 で、用語集の Audit trail の項も同じ値を書いています。0.1.0 の節では 37 種別でした。

| 項目 | 2.8.2 の値 |
| --- | --- |
| フェーズ | 5 |
| ステージ | 33（3 / 7 / 9 / 7 / 7） |
| エージェント | 14 = 11 専門家 + 2 レビュアー + コンポーザー |
| スコープ | 11 + 自動検出 |
| 深さ（Depth） | 3 段階（Minimal / Standard / Comprehensive） |
| テスト戦略（Test Strategy） | 3 段階（Minimal / Standard / Comprehensive） |
| 監査イベント種別 | 95 |

## 承認ゲート・Intent・Space — 「止まる場所」と「記録の置き場」

**承認ゲート**（Approval gate）は、各ステージの終わりに置かれる対話式の確認地点で、読者はそこで成果物を承認するか、変更を求めるか、3 回の修正を経た後であればそのまま受け入れるかを選びます。Initialization のステージには承認ゲートがありません。前章の「User decides, AI executes」を実装しているのがこの地点です。

**Intent** は、追跡される仕事の単位です。Space の `intents.json` という登録簿の 1 行として管理され、自分専用の記録ディレクトリ `aidlc/spaces/<space>/intents/<YYMMDD>-<label>/` を持ちます。`<YYMMDD>` は UTC の日付を 6 桁に詰めた接頭辞（例: `260624` は 2026-06-24）で、記録が時間順に並ぶようにしてあり、`<label>` は依頼内容を短い kebab-case にしたものです。最初の `/aidlc` でエンジンが最初の Intent を自動的に作ります。本書の制作記録も Intent `260913-aidlc-v2-book` の中にあります。

**Space** は、チームごとのワークスペースで、`aidlc/spaces/<space>/` にそのチームの `memory/`、`knowledge/`、そして Intent の記録（`intents/`）を持ちます。既定は `default` で、1 チームだけで使う場合に目にするのは `spaces/default/` だけです。Intent は Space の中にある、と覚えておくと記録のパスが読めます。

## Unit・Bolt・walking skeleton・ラダープロンプト — Construction の言葉

**Unit**（Unit of work）は「何を作るか」で、解決策を独立して実装できる単位に分解したものです。ステージ 2.7 の Units Generation で分解され、`unit-of-work-dependency.md` に列挙されます。依存関係でつながった 1 つ以上の Unit が、1 つの Bolt の範囲を与えます。本書の制作では、各「部」が 1 つの Unit でした。

**Bolt** は、1 つ以上の依存関係でつながった Unit を対象にした、スプリントに似た Construction の反復です。Unit の定義そのもの、その作業用のワークツリー、それを予定に乗せるスウォームとは区別されます。ステージ 2.9 の Delivery Planning が、意図した Unit のまとめ方、完了の定義（Definition of Done）、確信の仮説、担当を記録します。ステージ 3.6 の Build and Test と 3.7 の CI Pipeline は Bolt ごとではなく、すべての Bolt が終わった後に 1 回だけ走ります。

**walking skeleton** は、計画された最初の Bolt で、すべての結合点を通す最も薄い一本通しのスライスです。常にゲート付きで対話的に進みます。既定の進み方（stage-major、あるステージを全 Unit に対して実行してから次のステージへ進む方式）では、スコープに含まれる最初の Construction ステージが walking skeleton のゲートになり、承認の直後にラダープロンプトが出ます。

**ラダープロンプト**（Ladder prompt）は、walking skeleton のゲートの後に 1 回だけ表示される問いで、「自律的に続ける」か「すべての Bolt でゲートを置く」かを選ばせます。選択は自律モード（Autonomy mode）として `aidlc-state.md` の `Construction Autonomy Mode` に `autonomous` か `gated` の値で記録され、残りの Construction を支配します。本書の制作の方針（`team.md`）は、ここで「gate every Bolt」を選ぶと定めています。

## mob 実行・監査ログ・学び — チームの動き方と記録

**mob 実行**（Mob execution）は、ステージの実行形態の 1 つで、`mode: mob` を宣言したステージが、上限つきのラウンドで進むメッシュ型の委譲です。リードが草案を書き、互いに相手の内容を見ない協力者たちが並行して寄稿ファイルを書き、リードが統合し、解決できない判断は人に回されます。2.8.2 で mob として出荷されているのは 2.4 の User Stories だけです。ほかの実行形態との対比は第 3 部で扱います。

**監査ログ**（Audit trail）は、Intent の記録ディレクトリの `audit/` にある追記専用のイベントログです。クローンごとのシャード（`<host>-<clone>.md`）として書かれ、読み手はそれらを集めてタイムスタンプ順に併合します。前述のとおり 95 のイベント種別を持ち、意図から本番までを追跡できるようにします。用語集の見出し語は Audit trail ですが、本書では「監査ログ」と訳し、シャードは「監査シャード」と呼びます。

**学び**（learnings）は、ステージの中で起きた人による訂正を、次のワークフローでも効く恒久的な実践に変える仕組み、学習ループ（Learning loop）が扱うものです。ステージの実行中、オーケストレーターは観察を `memory.md` に記録し、承認ゲートでそれを提示します。読者が残すものを確定すると、確定した各学びは `aidlc/spaces/<active-space>/memory/project.md` に実践として書かれるか（1 回の操作で `team.md` へ昇格もできる）、新しいセンサーの雛形になります。前章の「No emergent behavior」と合わせて読むと、AI-DLC が「AI の振る舞いはプロトコルで縛り、変えるときは人が学びとして明示的に書き込む」という態度をとっていることが分かります。

> **補足** — 用語集には、ここに挙げたほかにもエンジン、コンダクター、ディレクティブ、センサー、ルールなど、第 3 部で仕組みを説明するときに必要な用語があります。それらは該当する章の初出で一文の説明を添えます。

## まとめ

- フェーズは Initialization / Ideation / Inception / Construction / Operation の 5 つで、起動・妥当性確認・詳細化・構築・運用という目的を持つ。ステージは 33 の個別の手順で、各フェーズに 3 / 7 / 9 / 7 / 7 ある。
- 2.8.2 の Key Numbers では、エージェント 14（11 専門家 + 2 レビュアー + コンポーザー）、スコープ 11 + 自動検出、深さ（Depth）3 段階、テスト戦略（Test Strategy）3 段階、監査イベント種別 95。
- 承認ゲートは各ステージ末の対話式の確認地点、Intent は仕事の単位で Space（チームのワークスペース）の中に記録を持つ。Unit は「何を作るか」、Bolt は Unit を対象にした Construction の反復、walking skeleton は最初の薄い一本通しの Bolt、mob 実行はリードと並行する協力者による委譲、ラダープロンプトは walking skeleton 後の 1 回の問い、監査ログは追記専用のイベントログ、学びはゲートで確定して `project.md` に書かれる実践である。

## 出典

- [2.8.2] `docs/guide/glossary.md` § Phase — フェーズが 5 つの区分で、各フェーズのステージ数が Initialization 3、Ideation 7、Inception 9、Construction 7、Operation 7 であること
- [2.8.2] `core/knowledge/aidlc-shared/ai-dlc-principles.md` § Five-Phase Structure — 5 フェーズそれぞれの目的と主な成果
- [2.8.2] `docs/guide/glossary.md` § Stage — ステージが 33 の個別の手順で、リードエージェントと入出力を持ち、フェーズごとに番号が振られること
- [2.8.2] `docs/guide/00-introduction.md` § Key Numbers — フェーズ 5、ステージ 33、エージェント 14（11 + 2 + コンポーザー）、スコープ 11 + 自動検出、Depth 3 段階、Test strategy 3 段階、監査イベント種別 95
- [2.8.2] `docs/guide/glossary.md` § Agent — 14 のペルソナの内訳（11 専門家、2 レビュー専用、コンポーザー）
- [2.8.2] `docs/guide/glossary.md` § Reviewer — 2 つのレビュアーの名前と担当領域、READY / NOT-READY の判定、決してワークフローを止めないこと
- [2.8.2] `docs/guide/glossary.md` § Scope — 11 のスコープ名と自由文からの自動検出
- [2.8.2] `docs/guide/glossary.md` § Depth — 3 段階（Minimal、Standard、Comprehensive）と承認ゲートでの上書き
- [2.8.2] `docs/guide/glossary.md` § Test strategy — 3 段階、深さから独立で既定は有効な深さに従うこと
- [2.8.2] `docs/guide/glossary.md` § Approval gate — 各ステージ末の対話式の確認地点、承認・変更要求・3 回の修正後の受け入れ、Initialization にはゲートが無いこと
- [2.8.2] `docs/guide/glossary.md` § Intent — 仕事の単位、`intents.json` の行、記録ディレクトリのパスと `<YYMMDD>` / `<label>` の意味、最初の `/aidlc` での自動作成
- [2.8.2] `docs/guide/glossary.md` § Space — チームごとのワークスペース、`memory/` と `knowledge/` と `intents/` を持つこと、既定が `default` であること
- [2.8.2] `docs/guide/glossary.md` § Unit of work — Unit が「何を作るか」であり、2.7 で分解され `unit-of-work-dependency.md` に列挙され、Bolt の範囲を与えること
- [2.8.2] `docs/guide/glossary.md` § Bolt — スプリントに似た Construction の反復、Delivery Planning（2.9）が記録する項目、3.6 と 3.7 が全 Bolt 完了後に 1 回走ること
- [2.8.2] `docs/guide/glossary.md` § Walking skeleton — 最初の Bolt としての最も薄い一本通し、常にゲート付き、stage-major では最初の Construction EXECUTE ステージがゲートになること、承認直後にラダープロンプトが出ること
- [2.8.2] `docs/guide/glossary.md` § Walk order — stage-major が既定の進み方であること
- [2.8.2] `docs/guide/glossary.md` § Ladder prompt — walking skeleton のゲート後に 1 回表示され、自律モードとして記録されること
- [2.8.2] `docs/guide/glossary.md` § Autonomy mode — `aidlc-state.md` の `Construction Autonomy Mode` と `autonomous` / `gated` の値
- [2.8.2] `docs/guide/glossary.md` § Mob execution — `mode: mob` のメッシュ型委譲、リードの草案と互いに見えない協力者の寄稿、User Stories（2.4）が出荷された mob であること
- [2.8.2] `docs/guide/glossary.md` § Audit trail — `audit/` の追記専用イベントログ、クローンごとのシャード `<host>-<clone>.md`、95 イベント種別
- [2.8.2] `docs/guide/glossary.md` § Learning loop — `memory.md` の観察、承認ゲートでの提示と確定、`project.md` への書き込みと `team.md` への昇格、センサーの雛形
- [2.8.2] `docs/guide/glossary.md` § Conductor — コンダクターが `/aidlc` のセッションそのものであること
- [2.8.2] `CHANGELOG.md` § [0.1.0] — 11 専門家エージェントの名前、初回公開時の 37 の監査イベント種別と 32 ステージ
- [2.8.2] `CHANGELOG.md` § [2.7.0] — 2.7.0 でステージが 33 になったこと
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/inception/domain-design/components.md` § Glossary Seed（Glossary の Term の初期値、Q3） — 英語トークンの区分（固有名詞 / 訳す / コードスパン）と採用する日本語表記
- [record] `first/aidlc/spaces/default/memory/team.md` § Walking Skeleton — 本書の制作方針としてラダープロンプトで gate every Bolt を選ぶと定めていること
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/inception/units-generation/unit-of-work.md` § U4 第 2 部 AI-DLC の概念 — 本書の制作で部を Unit としたこと（第 2 部が `u4-concepts`）
