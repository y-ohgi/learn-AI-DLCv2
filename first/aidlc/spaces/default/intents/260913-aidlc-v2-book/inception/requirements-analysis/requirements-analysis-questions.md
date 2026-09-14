# Requirements Analysis Questions

このファイルは、first 版（AI-DLC v2 ベースの新規教材）の要件を確定するための質問です。依頼者は本ワークフローに介入しないため（依頼文 Q9）、コンダクターが依頼者の代理として回答し、各回答の末尾に根拠（依頼文、既存教材 claude 版、上流成果物、または 2.8.2 の一次情報）を明記します。回答は `[Answer]:` の後に選択肢の英字を書いてください。当てはまらない場合は `X` を選び、続けて内容を書いてください。

参照した上流成果物: `../../ideation/intent-capture/intent-statement.md`（SM1〜SM3）、`../../ideation/scope-definition/scope-document.md`（In / Out）、`../../ideation/scope-definition/intent-backlog.md`（P1〜P9）、`../practices-discovery/team-practices.md`（章テンプレート・出典書式・検証 4 種）。調査した一次情報（タグ `v2.8.2`）: `docs/guide/00-introduction.md`（Key Numbers、方法論の原典）、`docs/guide/01-getting-started.md`（Quick Start、Harness Prerequisites、AWS Bedrock Setup）、`docs/guide/glossary.md`（Bolt、Unit、mob 実行）、`CHANGELOG.md`（0.1.0 初回公開、2.0.0、2.8.0〜2.8.2）、`core/aidlc-common/stages/`（33 ステージ）、`core/scopes/`（11 スコープ）、`core/agents/`（14 エージェント）。Depth は Standard（目安 5〜8 問）で 8 問です。

## Q1. 要件（FR）はどの粒度で書きますか？

（AI-DLC は要件に `FR1`、`FR1.2` のような固定 ID を付け、以降の設計・執筆・検証はこの ID で追跡します）

A. 部（intent-backlog のプロト Unit P1〜P7）ごとに `FR{n}` を置き、章ごとに `FR{n}.{m}` を置いて、各章の学習目標を「読み終えたら…できる」の形で 1〜3 個書く。学習目標が章テンプレートの `## この章で学ぶこと` に写像される
B. 章ごとに `FR{n}` を置き、学習目標は本文に書かない
C. 学習目標 1 つごとに `FR{n}` を置く（章あたり複数の FR）
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: team-practices.md `## Code Style` の章テンプレート（`## この章で学ぶこと` は requirements-analysis の学習目標を置く）と `## Testing Posture`（要件 = 各 FR、コンポーネント = 章ファイル、FR ID → 章ファイルパスを traceability の target とする規約は requirements-analysis / units-generation で決める）。A なら部 = プロト Unit = 後の Unit と 1 対 1 になり、章 = FR サブ項目 = 検査対象ファイルになる。

## Q2. 第 1 部「読者の現在地」（P2）に必ず含める内容は何ですか？

A. 1 章構成で、(1) 読者が今いる場所（補完 → チャット → エージェントに指示して差分をレビュー、の日常）、(2) 個人では効くのにチームとプロジェクトでスケールしない理由、(3) 「方法論」という言葉で何を指すか、(4) 本書の読み方（2.8.2 に固定、claude 版との関係、出典の読み方）。歴史や他手法の詳細は claude 版 第 1 部へリンクする
B. 2〜3 章構成で、AI 開発の歴史と種類を first 版でも独立に詳述する
C. 現在地の章は置かず、README の「はじめに」だけで済ませる
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: scope-document「読者の現在地を示す短い導入」と「重複しやすい話題（AI 開発の歴史の詳細…）は要点のみ述べ claude 版の該当章へリンク」。intent-statement の Target Customer（素の Agent 利用が個人では効くがチームではスケールしない痛み）。claude 版 README「読み方」が第 1 部を「急ぐ人は 1.3 の比較表だけでも構いません」としており、first 版で再詳述する価値は低い。

## Q3. 第 2 部「AI-DLC の概念」（P3）で、「v1 → v2」と方法論の原典をどう扱いますか？

（調査の結果: タグ `v2.8.2` のドキュメントとコードに「v1」という語は現れません。`docs/guide/00-introduction.md` は AI-DLC を「AWS の AI-DLC 方法論（ブログ）に由来する方法論」とし、本リポジトリはそれを実装したものだと述べています。`CHANGELOG.md` の最初の公開版は 0.1.0（2026-04-24、5 フェーズ 32 ステージ、11 エージェント）で、2.0.0（2026-06-18）はレビュアー導入で 2.x になりました。方法論の原典の用語である「Mob Elaboration」「Mob Construction」は 2.8.2 のドキュメントに無く、「Bolt」「Unit」「walking skeleton」「mob 実行」は `docs/guide/glossary.md` に定義があります）

A. first 版で「v2」と呼ぶものを「`awslabs/aidlc-workflows` の 2.x 系、本書は 2.8.2」と定義し、「v1」は依頼者と claude 版が用いた呼称であって 2.8.2 の一次情報には現れないことを明記する。概念の章は (1) 方法論の原典（AWS ブログ）を `00-introduction.md` が原典として参照している事実と、原典の要点（原典 URL を示し、原典の用語は「原典では…と呼ぶ」と書く）、(2) 2.8.2 が自ら定義する用語（5 フェーズ、ステージ、Bolt、Unit、walking skeleton、mob 実行、ゲート、監査）、(3) リポジトリの歩み（0.1.0 → 2.0.0 → 2.8.0 のネイティブ配布 → 2.8.2。`CHANGELOG.md` に基づく）で構成する。歴史的な「v1 = ルールファイル」という説明は claude 版 2.2〜2.3 へのリンクで参照し、first 版では断定しない
B. claude 版と同じ「v1 = Markdown ルールファイルの方法論、v2 = TypeScript エンジンの実装」という枠組みで書く
C. 「v1 / v2」という語を使わず、2.8.2 の説明だけを書く
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: 依頼文（Q9）「1 次情報とコードをもとに間違った情報は取り込まないでください」と project.md `## Forbidden`（2.8.2 の一次情報で確認できない AI-DLC の事実を断定しない）。B の枠組みは 2.8.2 の一次情報で裏取りできない。C は依頼文が「AI-DLCv2/v1 を知らない人」をペルソナにしており、読者が「v1 / v2」という言葉を目にしたときに位置づけられる説明が必要。原典の AWS ブログは本環境から到達可能（HTTP 200）で、方法論の原典としての一次情報である。出典節での表記は team-practices.md の名前空間 4 種に従い、原典は `[2.8.2] docs/guide/00-introduction.md § What is AI-DLC?`（原典へのリンク元）経由で引き、原典 URL は本文と付録の出典一覧に書く（domain-design で確定）。

## Q4. 第 3 部「v2 の仕組み」（P4）で必ず扱う項目と、コードに踏み込む深さはどうしますか？

A. 次の 8 項目を各 1 章とする: (1) インストールと設定（`install.sh`、`aidlc config`、`aidlc doctor`、config が作るもの、Bedrock 既定と他プロバイダ）、(2) エンジンとコンダクター（`aidlc engine orchestrate next` → ディレクティブ → `report` の往復、状態ファイル）、(3) フェーズとステージ（5 フェーズ 33 ステージ、ステージ定義のフロントマター、ステージプロトコル: 質問ファイル・要約確認・承認ゲート）、(4) スコープとコンポーザー（11 スコープ + カスタム、Depth 3 段階、Test Strategy 3 段階、`compose`）、(5) エージェントと委譲（14 エージェント、inline / subagent / pipeline / mob、レビュアー）、(6) 承認ゲートと人間の在席、監査ログ（フック、`HUMAN_TURN`、監査イベント、要約確認の受領）、(7) ルールと学習ループとセンサー（org / team / project / phase の層、§13 の学び、センサー）、(8) Construction の進め方（Unit、Bolt、walking skeleton、ラダープロンプト、ワークツリー）。深さは「読者が 2.8.2 の実物を開いて確認できる」こと: 本文では概念と手順を説明し、実際のディレクティブ JSON・監査ログ行・状態ファイルは本ワークフローの記録（`[record]`）から短い抜粋を示す。TypeScript の実装は関数名・サブコマンド名を出典に書くにとどめ、コードは引用しない
B. 項目は A と同じだが 3〜4 章に圧縮する。抜粋は示さない
C. A に加えて、TypeScript 実装のコード断片を本文に引用して解説する
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: intent-backlog P4 の列挙（ネイティブインストール、エンジンとコンダクター、5 フェーズ 33 ステージ、11 スコープとコンポーザー、14 エージェント、承認ゲートと人間の在席確認、監査ログ、学習ループ）に、team-practices.md が Construction で必ず使う Unit / Bolt / walking skeleton を加えた。項目数と各数値は `docs/guide/00-introduction.md § Key Numbers` と `core/` の実ファイル数（stages 33、scopes 11、agents 14）で確認済み。C は読者（方法論を知らないエンジニア）に対して 2.8.2 の実装詳細を読ませることになり、また実装は版で変わる。抜粋を `[record]` から取るのは scope-document「ケーススタディ: 本書自身を AI-DLC で制作した記録」と SM2 の裏取り方式に沿う。

## Q5. 第 4 部「ハンズオン」（P5）の前提条件と範囲はどうしますか？

A. 前提: Claude Code をインストールし認証済みであること、ターミナルと `curl` と `git` が使えること、Linux / macOS / WSL。ハーネスは Claude Code のみを扱い、他の 6 ハーネス（Kiro CLI / Kiro IDE / Codex CLI / Cursor / opencode / GitHub Copilot）は存在を一文で示すにとどめる。プロバイダは、2.8.2 の配布が Amazon Bedrock を既定にしている事実と、Bedrock を使わない場合の手順（`docs/guide/01-getting-started.md` が述べる「Bedrock の環境変数の対応を外し、そのプロバイダの認証フローを完了する」）の両方を書く。範囲: `install.sh`（`--version 2.8.2` 固定）→ `aidlc version` → `aidlc config --harness claude` → `aidlc doctor` → Claude Code で `/aidlc <説明>` → 最初の質問（intent-capture の質問ファイル）が提示されるところまで。題材は「小さな文書やメモを管理する何か」のような読者が自分で選べる 1 行の説明とし、サンプルアプリは作らない。つまずきポイントとして本ワークフローで実際に起きたこと（root では `install.sh` が拒否する、`aidlc doctor` のベースライン不一致、フック未承認）を扱う
B. A と同じだが、プロバイダは Bedrock だけを扱う
C. Claude Code に加えて Kiro CLI と Codex CLI のハンズオンも用意する
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: intent-statement SM1（クリーンな環境に 2.8.2 を導入し最初の承認ゲートに到達）と team-practices.md `## Testing Posture` 4（合格線 (1)〜(5)）。claude 版 README「想定読者」は「ハンズオンは AWS アカウントなしでも進められる構成」を約束しており、依頼者のペルソナも AWS 必須ではない（△）。2.8.2 の `01-getting-started.md § AWS Bedrock Setup` は「これは配布の既定であり方法論の要件ではない」「他プロバイダを使うには Bedrock の環境変数の対応を外す」と明記しているため、両方を書けば一次情報の範囲内。C は scope-document の Out（範囲拡大）に当たる。

## Q6. 第 5 部「ケーススタディ」（P6）に必ず含める内容と提示のしかたはどうしますか？

A. 内容: (1) compose の提案（ARS スコア、EXECUTE / SKIP の判定、カスタムスコープ `docs-book` を作った経緯）、(2) 各ステージの質問と代理回答（intent-capture、scope-definition、practices-discovery のインタビュー）、(3) レビュアーの所見と差し戻し（intent-capture の R-01〜R-10、Request Changes、redo-jump による回復）、(4) practices-discovery のハブ&スポーク（支援 3 名の寄稿がリード案を 3 点訂正した実例: ビルド判定、リダイレクト、出典の正）、(5) 監査ログの読み方（実際のイベント行）、(6) 代理判断ログ（人が介入しないワークフローで何を誰の代理として決めたか）、(7) 逸脱と限界（フックが無いセッションで文書化された回避フラグを使った事実、依頼者が後日修正し得る代理判断）。提示: 記録ファイルからの短い抜粋 + `[record]` の出典行。マスキング規約に従う。各節の末尾に「読者が自分のワークフローで同じものを見る場所」を書く
B. A の (1)〜(6) のみ（逸脱と限界は書かない）
C. 記録ファイルへのパス一覧だけを載せ、抜粋や解説は書かない
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: scope-document「ケーススタディ: 本書自身を AI-DLC で制作した記録（compose 提案、質問と代理回答、レビュー所見と差し戻し、監査ログ、代理判断ログ）」と intent-statement の Problem Statement 第 3 項（方法論の効果を読者が自分で確かめられる実例）。(7) を含めるのは依頼文（Q9）「間違った情報は取り込まない」の精神と、intent-statement の前提「代理回答は依頼者本人が後日修正する可能性がある」を読者に隠さないため。B は実例の信頼性を下げる。

## Q7. 付録（P7、Should）には何を入れますか？

A. (1) 用語集（domain-design で確定する対訳表を元にした英語トークン → 日本語 → 初出章）、(2) コマンド早見（`aidlc` の主なサブコマンドを `aidlc --help` / `aidlc engine --help` と `docs/guide/12-cli-commands.md` で確認したものだけ）、(3) 出典一覧（`[2.8.2]` の GitHub URL の書き方と、全章の出典で参照したパスの一覧）、(4) つまずきポイント（ハンズオン章の内容を横断的に再掲）
B. (1) と (3) のみ
C. 付録は作らない
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: intent-backlog P7（用語集、コマンド早見、出典一覧、つまずきポイント）と team-practices.md `## Code Style`（GitHub URL は README と付録の出典一覧に 1 回だけ書く。対訳表は付録の用語集の元）。claude 版 付録も同じ 3 種（commands / glossary / references）を持っており、読者が 2 冊を同じ感覚で引ける。

## Q8. 非機能要件（分量・前提知識・読み順）はどう決めますか？

A. 各章の本文は 2,000〜6,000 文字（出典節を除く）、全体は 15〜20 章、部の順に読めば前の章の知識だけで読める（前方参照しない）。前提知識は「Git と GitHub の基本操作、ターミナル操作、Claude Code の日常利用」とし、AWS の知識と AI 駆動開発の方法論の知識は不要とする。SM1〜SM3 はそのまま非機能要件（NFR）として ID を付ける
B. 分量の上限は置かず、章数も執筆時に決める
C. 各章 1,000 文字以内の短い章を 30 章以上
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: claude 版は 30 章・合計約 21.9 万文字（平均約 7,300 文字/章）で、依頼者はそれを読んだうえで「知らない人をペルソナにした」新版を求めている。1 章を短くし章数を絞ることで、方法論を知らない読者が部の順に読み切れる分量にする。前提知識は claude 版 README「想定読者」（AI Agent の実務利用は必要、方法論の知識は不要、AWS はあると早いが必須ではない）に合わせ、intent-statement の Target Customer と一致させる。数値は測定可能な合否条件として build-and-test で確認できる。

## Consolidated Summary Confirmation

回答の要約（すべて代理回答・根拠は各設問の末尾）:

- FR は部（P1〜P7）ごと、FR{n}.{m} は章ごとに置き、章の学習目標を「…できる」で 1〜3 個書く（Q1: A）
- 第 1 部「現在地」は 1 章。読者の日常、スケールしない理由、方法論の意味、本書の読み方。歴史の詳細は claude 版へリンク（Q2: A）
- 第 2 部「概念」は「v2 = aidlc-workflows 2.x（本書は 2.8.2）」と定義し、「v1」は 2.8.2 の一次情報に現れない呼称と明記。原典（AWS ブログ）は 00-introduction.md 経由で引き、2.8.2 が定義する用語とリポジトリの歩み（CHANGELOG）で構成（Q3: A）
- 第 3 部「仕組み」は 8 章（インストール / エンジンとコンダクター / フェーズとステージ / スコープとコンポーザー / エージェントと委譲 / ゲート・在席・監査 / ルール・学習ループ・センサー / Construction の進め方）。抜粋は本ワークフローの記録から、コードは引用しない（Q4: A）
- 第 4 部「ハンズオン」は Claude Code のみ、Bedrock 既定と他プロバイダの両方、`install.sh --version 2.8.2` → `aidlc version` → `aidlc config` → `aidlc doctor` → `/aidlc` → 最初の質問まで。実際のつまずきを収録（Q5: A）
- 第 5 部「ケーススタディ」は compose 提案・質問と代理回答・レビュー所見と redo-jump・ハブ&スポーク・監査ログ・代理判断ログ・逸脱と限界の 7 節。記録からの抜粋 + `[record]` 出典、マスキング（Q6: A）
- 付録は用語集・コマンド早見・出典一覧・つまずきポイント（Q7: A）
- NFR: 各章 2,000〜6,000 文字、全体 15〜20 章、前方参照なし、前提知識は Git / GitHub / ターミナル / Claude Code の日常利用、SM1〜SM3 を NFR 化（Q8: A）

Does this all look correct before I generate the requirements artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
