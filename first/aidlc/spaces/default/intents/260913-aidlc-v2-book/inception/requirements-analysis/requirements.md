# Requirements — AI-DLC v2 教材（first 版）

入力: `../../ideation/intent-capture/intent-statement.md`（`intent-statement`: Problem Statement、Target Customer、SM1〜SM3）、`../../ideation/scope-definition/scope-document.md`（`scope-document`: In / Out、裏取り方式）、`../../ideation/scope-definition/intent-backlog.md`（プロト Unit P1〜P9）、`../practices-discovery/team-practices.md`（`team-practices`: 章テンプレート、出典書式、検証 4 種）、`requirements-analysis-questions.md`（Q1〜Q8 の代理回答）。調査した一次情報はタグ `v2.8.2`（commit `355903d`）の `docs/guide/00-introduction.md`、`docs/guide/01-getting-started.md`、`docs/guide/glossary.md`、`CHANGELOG.md`、`core/aidlc-common/stages/`、`core/scopes/`、`core/agents/`。

## Intent analysis

- **達成したいこと**: AI Agent を実務で使っているが AI 駆動開発の方法論を知らないエンジニアが、AI-DLC v2（`awslabs/aidlc-workflows` 2.8.2）を「概念 → 仕組み → 手を動かす → 実物の記録を読む」の順で学べる日本語の HonKit 教材を、GitHub Pages の `/first/` に公開する（intent-statement の Problem Statement、依頼文 Q9）。
- **なぜ今か**: 2.8.0 で配布方法がネイティブインストーラに変わり、既存教材（claude 版、2.7.1 時点）のインストール手順が陳腐化した。加えて「AI-DLC そのもので教材を作った記録」を教材にすることで、方法論の効果を読者が自分で確かめられる実例を提供する（intent-statement の Initiative Trigger）。
- **成功の定義**: SM1（ハンズオン再現）、SM2（事実の裏取り）、SM3（公開とリンク解決）。本書では NFR1〜NFR3 として ID を付ける。
- **要件の作り方**: 要件は「読者が読み終えたら何ができるか」で書く。部（intent-backlog のプロト Unit）ごとに `FR{n}`、章ごとに `FR{n}.{m}` を置き、各章の学習目標が章テンプレートの `## この章で学ぶこと` に写像される（Q1）。章数は README を除いて 20（NFR4 の上限）。
- **ゴールではないこと**: AI-DLC の網羅的なリファレンスを作ること、claude 版を書き直すこと、読者向けのサンプルアプリを作ること（scope-document の Out）。

## Functional requirements

書式: `FR{n}` は部（プロト Unit）、`FR{n}.{m}` は章。各章の「学習目標」は「読み終えたら…できる」の形で、そのまま章の `## この章で学ぶこと` になる。「必須内容」は章に必ず含める事実・手順で、`## まとめ` と 1 対 1 で対応させる。優先度は intent-backlog の MoSCoW を引き継ぐ。

### FR1 HonKit の骨格と公開経路（P1、Must、SM3）

- **FR1.1 `README.md`（はじめに）** — 学習目標: 読者は本書が誰向けで何を扱い、何を扱わないかを判断できる。必須内容: 対象読者と前提知識（NFR6）、本書が 2.8.2 に固定されていること、claude 版との関係（独立執筆、重複話題はリンク）、章末「出典」節の読み方（名前空間 4 種と `[2.8.2]` の GitHub URL の組み立て方）、方法論の原典（AWS ブログ）の URL。
- **FR1.2 `SUMMARY.md` と `book.json`** — 学習目標: 読者は目次から部の順に読み進められる。必須内容: `# 目次`、`* [はじめに](README.md)`、部は `## 第N部 …`、章は `* [N.M タイトル](docs/NN-part/NN-chapter.md)`、ネスト無し。`book.json` は `language: "ja"`。`.bookignore` は既存を維持する。
- **FR1.3 公開経路** — 学習目標: 読者は `https://y-ohgi.github.io/learn-AI-DLCv2/first/` を開き、ランディングページから両版へ行き来できる。必須内容: `scripts/build-site.mjs` による `_site/first/` の生成、`deploy.yml` の既存ワークフローでの公開、ランディングページからのリンク。

### FR2 第 1 部 読者の現在地（P2、Must）

- **FR2.1 1.1 あなたの AI 利用はどこにいるか** — 学習目標: 読者は自分の AI Agent 利用を「補完 → チャット → エージェントに指示して差分をレビュー」の流れの中に位置づけ、なぜ「方法論」の話になるのかを説明できる。必須内容: (1) 読者の日常（Claude Code に指示し差分をレビューする）、(2) 個人では効くのにチームとプロジェクトでスケールしない理由、(3) 本書で「方法論」と呼ぶものの意味、(4) 本書の読み方（部の順、2.8.2 固定、出典の見方）、(5) AI 開発の歴史と種類の要点（数文。詳細は claude 版 第 1 部へリンク）、(6) 次に読むものへの導線（FR8.1）。first 版では歴史と種類は要点のみ（Q2、R-07）。

### FR3 第 2 部 AI-DLC の概念（P3、Must、SM2）

- **FR3.1 2.1 AI-DLC とは何か** — 学習目標: 読者は「AI-DLC」「v2」「v1」という言葉を聞いたとき、それぞれが何を指し得るかを 2.8.2 の一次情報に基づいて位置づけられる。必須内容: (1) AI-DLC は AI 支援開発を反復可能で追跡可能なフェーズに構造化する方法論で、AWS の AI-DLC 方法論（ブログ）に由来し、`awslabs/aidlc-workflows` はそれをハーネス中立のコアから実装したものであること（`docs/guide/00-introduction.md § What is AI-DLC?`）、(2) 本書で「v2」と呼ぶのは `awslabs/aidlc-workflows` の 2.x 系で本書は 2.8.2 であること、「v1」は依頼者と claude 版が用いた呼称で 2.8.2 の一次情報には現れないこと（断定しない。歴史的な説明は claude 版 2.2〜2.3 へリンク）、(3) リポジトリの歩み: 0.1.0（2026-04-24、初回公開、5 フェーズ 32 ステージ、11 エージェント）→ 2.0.0（2026-06-18、レビュアー 2 名の導入で 13 エージェント）→ 2.7.2（2026-09-07、`CHANGELOG.md` でネイティブ `install.sh --version` が初めて案内される。2.7.1 までは `dist/<harness>/` の複製で導入していた）→ 2.8.0（2026-09-08、2.7.x を束ねた最初の baseline。2.8.1 の項が「2.8.0 native install」と呼ぶ）→ 2.8.2（`CHANGELOG.md § [2.7.1]`、`§ [2.7.2]`、`§ [2.8.0]`、`§ [2.8.1]`）。「配布方式の転換点」を一語で言うなら 2.7.2 であり、intent-statement の Initiative Trigger の「2.8.0 で配布方法が変わった」は「2.7.2 で登場し 2.8.0 系が最初にその方式だけで配布された」と正確に書き直す（R-08、A7）、(4) 原典の用語（原典では Mob Elaboration などと呼ぶ）は「原典では…と呼ぶ」の形でのみ触れ、2.8.2 の用語と混同させない（Q3）。
- **FR3.2 2.2 2.8.2 が定義する用語** — 学習目標: 読者は 5 フェーズ、ステージ、承認ゲート、Unit、Bolt、walking skeleton、mob 実行、監査ログ、を一文ずつ説明できる。必須内容: `docs/guide/glossary.md` と `docs/guide/00-introduction.md § Key Numbers` に基づく定義（フェーズ 5、ステージ 33、エージェント 14 = 11 + 2 + 1、スコープ 11、Depth 3 段階、Test Strategy 3 段階）。「Small Mob, Broad Agents」の設計原則（`.claude/knowledge/aidlc-shared/ai-dlc-principles.md`）。対訳表（NFR7、domain-design で確定）に従った日本語表記。

### FR4 第 3 部 v2 の仕組み（P4、Must、SM2）

各章は「概念と手順の説明」+「本ワークフローの記録（`[record]`）からの短い抜粋」で構成し、TypeScript のコードは引用せず、関数名・サブコマンド名を出典に書くにとどめる（Q4）。

- **FR4.1 3.1 インストールと設定** — 学習目標: 読者は `install.sh` → `aidlc config` → `aidlc doctor` が何を作り何を検査するかを説明できる。必須内容: ネイティブ `aidlc` コマンドと各ハーネスのランタイム、`--version` による版固定、`aidlc config --harness claude` が作るもの（`.claude/`、`aidlc/`、`.gitignore` のブロック、`.claude/CLAUDE.md`。プロジェクトルートに `CLAUDE.md` は作らない。R-04）、`aidlc doctor`、Bedrock が配布の既定であり方法論の要件ではないこと、他プロバイダの手順（`docs/guide/01-getting-started.md`、`docs/guide/18-install-and-lifecycle.md`）。
- **FR4.2 3.2 エンジンとコンダクター** — 学習目標: 読者は「エンジンが次を決め、コンダクターが実行して報告する」往復を、実際のディレクティブを見ながら説明できる。必須内容: `aidlc engine orchestrate next` が返すディレクティブの種別（`core/tools/aidlc-orchestrate.ts` の kind の全集合: `load-steering` / `run-stage` / `print` / `ask` / `error` / `done` / `invoke-swarm`。本書で読者が目にするのは前 4 つと `done` で、`invoke-swarm` は Team Construction 用と一文で触れる。R-03）、`report --result` の結果値、`aidlc-state.md` と `Current Stage`、本ワークフローのディレクティブ抜粋（`docs/guide/00-introduction.md § How the Orchestrator Works`、`docs/reference/03-orchestrator.md`、`core/tools/aidlc-orchestrate.ts`）。
- **FR4.3 3.3 フェーズとステージ** — 学習目標: 読者はステージ定義を開いて、誰が主導し何を作り何を消費するかを読み取れる。必須内容: 5 フェーズ 33 ステージの一覧、ステージ定義のフロントマター（`lead_agent`、`mode`、`produces`、`consumes`、`reviewer`、`sensors`）、ステージプロトコルの共通手順（質問ファイルと `[Answer]:`、Consolidated Summary Confirmation、承認ゲート、完了報告）（`docs/guide/04-phases-and-stages.md`、`docs/reference/04-stage-protocol.md`、`core/aidlc-common/stages/`）。
- **FR4.4 3.4 スコープとコンポーザー** — 学習目標: 読者は自分の作業に合うスコープを選び、合わなければ `compose` でどう調整されるかを説明できる。必須内容: 11 スコープの EXECUTE / SKIP 表、Depth と Test Strategy、自動検出、`compose` の提案と承認ゲート、本ワークフローで `docs-book` カスタムスコープを作った理由（`docs/guide/05-scopes-and-depth.md`、`core/scopes/`、`.claude/tools/data/scope-grid.json`）。
- **FR4.5 3.5 エージェントと委譲** — 学習目標: 読者は 14 エージェントの役割分担と、inline / subagent / pipeline / mob の 4 つの実行形態を区別できる。必須内容: 11 の専門家 + 2 レビュアー + コンポーザー、4 つの委譲ステージ（2.1 pipeline、2.2 subagent、2.4 mob、3.5 subagent）、レビュアーの advisory / adversarial、寄稿ファイルの `**Collaborator:**` と `AGREE:` / `OBJECT:`（`docs/guide/06-agents.md`、`core/agents/`、本ワークフローの practices-discovery 記録）。
- **FR4.6 3.6 承認ゲート・人間の在席・監査ログ** — 学習目標: 読者は「なぜ AI が勝手に承認できないのか」を仕組みとして説明し、監査ログの行を読める。必須内容: 承認ゲートの選択肢、フックが刻印する人間の在席（`HUMAN_TURN`）と要約確認の受領、監査イベントの形式と代表的なイベント、状態ファイル（`docs/guide/10-state-and-audit.md`、`docs/reference/06-hooks-and-tools.md`、`.claude/knowledge/aidlc-shared/audit-format.md`、本ワークフローの監査シャード）。
- **FR4.7 3.7 ルール・学習ループ・センサー** — 学習目標: 読者は org / team / project / phase の層と、ゲートで「学び」がどう保存されるかを説明できる。必須内容: `aidlc/spaces/<space>/memory/` の層と strict-additive、practices-discovery による `team.md` の置き換え、§13 の学びの儀式と `project.md` への追記、センサー（advisory / blocking）（`docs/guide/09-rules-and-the-learning-loop.md`、`docs/reference/07-sensor-system.md`、`docs/reference/08-rule-system.md`、本ワークフローの `team.md` / `project.md`）。
- **FR4.8 3.8 Construction の進め方** — 学習目標: 読者は Unit、Bolt、walking skeleton、ラダープロンプト、ワークツリーの関係を説明できる。必須内容: Units Generation と Delivery Planning の成果物、Bolt 1 = walking skeleton、ラダープロンプトの選択肢、Bolt ワークツリーと統合、Build and Test（`docs/guide/glossary.md`、`docs/guide/04-phases-and-stages.md`、`core/aidlc-common/stages/construction/`）。

### FR5 第 4 部 ハンズオン（P5、Must、SM1・SM2）

- **FR5.1 4.1 環境準備** — 学習目標: 読者は自分の環境に 2.8.2 を版固定で導入し、`aidlc version` で確認できる。必須内容: 前提（Claude Code をインストールし認証済み、ターミナル、`curl`、`git`、Linux / macOS / WSL）、他の 6 ハーネスの存在（一文）、`install.sh` の逐語コマンドと版固定の手順（ダウンロードして内容を確認 → `--version 2.8.2` → `aidlc version`）、Bedrock 既定の説明と Bedrock を使わない場合の手順、`## つまずきポイント`（root では `install.sh` が拒否する、PATH）。
- **FR5.2 4.2 最初のワークフロー** — 学習目標: 読者は空のプロジェクトで `aidlc config` → `aidlc doctor` → `/aidlc <説明>` を実行し、最初の質問（intent-capture の質問ファイル）が Claude Code 上で提示されるところまで到達できる（これを本書では SM1 の「最初の承認ゲート」の到達点と読み替える。A8）。必須内容: `aidlc config --harness claude` の非対話フラグ、`aidlc doctor` の見方（runtime / hooks 系は必須、provider 系は資格情報が無ければ失敗し得る）、フックの承認と Claude Code の再起動、`/aidlc` の説明文（読者が自分で選ぶ 1 行）、最初の質問ファイルの読み方と回答方法、`## つまずきポイント`（`aidlc doctor` のベースライン不一致、フック未承認）。サンプルアプリは作らない（Q5）。

### FR6 第 5 部 ケーススタディ — 本書はどう作られたか（P6、Must、SM2）

各章は記録ファイルからの短い抜粋 + `[record]` の出典行で構成し、マスキング規約に従う。各節の末尾に「読者が自分のワークフローで同じものを見る場所」を書く（Q6）。

- **FR6.1 5.1 計画 — compose とスコープ、質問と代理回答** — 学習目標: 読者は compose の提案を読み、EXECUTE / SKIP の判定とカスタムスコープの作り方を追体験できる。必須内容: compose の提案（ARS スコア、EXECUTE / SKIP）、`docs-book` カスタムスコープを作った経緯、intent-capture と scope-definition の質問と代理回答（根拠の書き方）。
- **FR6.2 5.2 レビューと差し戻し、ハブ&スポーク** — 学習目標: 読者はレビュアーの所見（R-01〜R-10）がどう成果物を変え、Request Changes からどう回復したか（redo-jump）を説明できる。必須内容: intent-capture の所見と Request Changes、redo-jump による回復、practices-discovery のハブ&スポーク（支援 3 名の寄稿がリード案を訂正した 3 点: ビルド判定、リダイレクト追従、出典の正をタグ `v2.8.2` に）。
- **FR6.3 5.3 記録の読み方と限界** — 学習目標: 読者は監査ログと代理判断ログを読み、人が介入しないワークフローで何が代理で決められたかと、その限界を理解できる。必須内容: 監査ログの実際の行（`DECISION_RECORDED`、`SUMMARY_CONFIRMATION_RECORDED`、`PRACTICES_AFFIRMED` など）の読み方、代理判断ログ、逸脱と限界（フックが無いセッションで文書化された回避フラグを使った事実、依頼者が後日修正し得る代理判断、claude 版の「v1」枠組みが 2.8.2 の一次情報で裏取りできなかったこと）。

### FR7 付録（P7、Should、SM2）

- **FR7.1 付録 A 用語集** — 学習目標: 読者は英語トークンと日本語表記を相互に引ける。必須内容: domain-design で確定する対訳表（英語トークン → 日本語 → 初出章）。
- **FR7.2 付録 B コマンド早見** — 学習目標: 読者は本書で使った `aidlc` コマンドを目的から引ける。必須内容: `aidlc --help` / `aidlc engine --help` と `docs/guide/12-cli-commands.md` で確認したサブコマンドのみ。
- **FR7.3 付録 C 出典一覧** — 学習目標: 読者は `[2.8.2]` の出典を GitHub 上で開ける。必須内容: `https://github.com/awslabs/aidlc-workflows/blob/v2.8.2/<path>` の組み立て方と、全章の出典で参照したパスの一覧、方法論の原典（AWS ブログ）の URL。
- **FR7.4 付録 D つまずきポイント** — 学習目標: 読者は症状から対処を引ける。必須内容: 4.1・4.2 の `## つまずきポイント` と本ワークフローで実際に起きた事象（root 拒否、ベースライン不一致、フック未承認、`gh` が無い環境での GitHub 操作）の横断的な再掲。

### FR8 スコープ外だが読者を導くもの（P8、Could）

- **FR8.1 チーム導入・他手法比較への導線** — 学習目標: 読者は次に読むべきものを知る。必須内容: claude 版 第 4 部と 2.12 への `.html` リンクと一文の要点のみ。独立した章は作らず、1.1（FR2.1 の必須内容 (6)）の末尾に置く（R-06。読み順 NFR5 の観点で、読者が現在地を掴んだ直後に次を示す）。

## Non-functional requirements

| ID | 区分 | 要件 | 合否条件（測り方） | 由来 |
| --- | --- | --- | --- | --- |
| NFR1 | 再現性（SM1） | 読者がハンズオン章（FR5）の手順だけで、クリーンな環境に 2.8.2 を導入し最初の質問に到達できる | クリーンな一時ディレクトリで、章本文の `bash` フェンスどおりに (1) `install.sh --version 2.8.2` (2) `aidlc version` = `aidlc 2.8.2 (runtime 2.8.2)` (3) 非対話の `aidlc config --harness claude` (4) `aidlc doctor` の runtime / hooks 系が通る（provider 系は失敗を許容） (5) `aidlc engine orchestrate next` が最初の run-stage ディレクティブを返す、の全通過。build-and-test で実施。(5) は「Claude Code 上で最初の質問が提示される」（FR5.2 の到達点）の機械検証できる近似であり、Claude Code 上の提示そのものは code-generation のゲートでコンダクターが同じ手順を Claude Code で辿って代理精読で確認する（R-02） | intent-statement SM1、team-practices `## Testing Posture` 4 |
| NFR2 | 正確性（SM2） | 教材中の AI-DLC に関する事実記述がすべてタグ `v2.8.2` の一次情報、コミット済みランタイム、または本ワークフローの記録で裏取りされている | 全章に `## 出典` 節があり、各出典行が `[2.8.2]` / `[runtime]` / `[record]` / `[推定]` の書式で、`[2.8.2]` はタグの木、`[runtime]` / `[record]` は作業木に実在する（`check:first` で 0 件の欠落）。未裏取りの断定 0 件（functional-design の章仕様審査、レビュアー、ゲートでの代理精読）。推定は本文「（推定）」と `[推定]` 行が対応する | intent-statement SM2、scope-document「事実の裏取り方式」 |
| NFR3 | 公開とリンク（SM3） | `/first/` で公開され、ビルドが成功し、教材内のリンクがすべて解決する | `npm run build` が終了コード 0 かつ `_site/first/index.html` が存在、`_site/first/` の HTML に未解決の `.md` リンク 0 件、内部リンクの参照先が `_site/` に実在、公開 URL（`/`、`/claude/`、`/first/`）がリダイレクト追従後に最終ステータス 200、公開サイトで `check:first` の blocking 0 件 | intent-statement SM3、team-practices `## Deployment` |
| NFR4 | 分量 | 方法論を知らない読者が部の順に読み切れる分量 | 章種別ごとに合否条件を分ける。(a) 本文の章（FR2.1、FR3.1〜3.2、FR4.1〜4.8、FR5.1〜5.2、FR6.1〜6.3 の 16 章）は本文（`## 出典` 節とコードフェンスと表を除いた文字数、OQ6）が 2,000〜6,000 文字。(b) 付録（FR7.1〜7.4 の 4 章）は表・箇条書きが本体のため下限を置かず、上限のみ 6,000 文字（表とコードフェンスを含めない）。(c) 章数は README を除いて 15〜20 で、本書の計画は 20（上限）。build-and-test で文字数を計測（R-01） | Q8 |
| NFR5 | 読み順 | 部の順に読めば前の章の知識だけで読める | 前方参照（後の章を読まないと分からない用語・手順）が 0 件。ゲートでの代理精読と reviewer で確認。用語の初出章は付録 A の対訳表に記録 | Q8 |
| NFR6 | 前提知識 | 前提は Git と GitHub の基本操作、ターミナル操作、Claude Code の日常利用。AWS の知識と AI 駆動開発の方法論の知識は不要 | `README.md` に前提の表があり、本文中で AWS 固有の知識を前提にする箇所が無い（Bedrock は「既定」として説明し、使わない手順も書く） | intent-statement Target Customer、claude 版 README「想定読者」、Q5 |
| NFR7 | 言語と表記 | 日本語で書き、固定トークンは英語のまま。表記規則とマスキング規約に従う | team-practices `## Code Style` の閉じた集合（必須節、フェンス言語、引用ラベル、出典行書式、ルート絶対パス禁止、`mermaid` 禁止）を `check:first` で 0 件違反。和欧間スペース等の人手規約はゲートで精読。対訳表に無い訳語の揺れ 0 件 | project.md `## Corrections`、team-practices `## Code Style` |
| NFR8 | 版の固定と保守 | 本書の事実は 2.8.2 に固定され、読者が版を確認できる | `README.md` と 2.1 に版の固定（2.8.2、タグ `v2.8.2`、commit `355903d`）が明記され、`[2.8.2]` の出典がすべて同じタグを指す | Q3、team-practices `## Code Style` |

## Constraints

- **一次情報の範囲**: AI-DLC の事実は `awslabs/aidlc-workflows` タグ `v2.8.2`（commit `355903d`）のドキュメントとコード、コミット済みの `first/.claude/`（同タグの投影）、本ワークフローの記録 `first/aidlc/` に限る。クローンの HEAD や別コピーは入力にしない（project.md `## Decided`、`## Forbidden`）。方法論の原典（AWS ブログ）は `docs/guide/00-introduction.md` が原典として参照しているものに限り、その内容は「原典では…」の形で示す。
- **文章の非再利用**: claude 版の文章を再利用・改稿しない。体裁（`SUMMARY.md` の形、番号付け）は揃える（project.md `## Forbidden`、team-practices `## Code Style`）。
- **公開経路**: 既存の `.github/workflows/deploy.yml` と `scripts/build-site.mjs`。新しいワークフロー・公開先は作らない。既存ワークフローの変更は `check:first` の追加と `permissions` のジョブ単位化まで（project.md `## Mandated`、team-practices `## Deployment`）。
- **HonKit**: 標準テーマ、プラグイン無し。図は ASCII か表（team-practices `## Code Style`）。
- **言語**: 日本語。固定トークンは英語のまま（project.md `## Corrections`）。
- **依頼者の不介入**: すべての判断はコンダクターが依頼者の代理として行い、根拠を記録する（project.md `## Forbidden`、`## Corrections`）。
- **スコープ**: `docs-book`（Depth Standard、Test Strategy Minimal、`skeleton: on`）。User Stories は SKIP。

## Assumptions

| # | 前提 | 根拠と状態 | 検証の責任 |
| --- | --- | --- | --- |
| A1 | 読者は Claude Code を使う（他ハーネスは扱わない） | 依頼者のペルソナ（依頼文 Q9）と claude 版 README「想定読者」。未検証 | functional-design（FR5 の章仕様） |
| A2 | 方法論の原典（AWS ブログ）は公開されており到達可能 | 本環境から HTTP 200 を確認（2026-09-13）。URL は `docs/guide/00-introduction.md` のもの | code-generation（FR3.1 執筆時に再確認） |
| A3 | `https://y-ohgi.github.io/learn-AI-DLCv2/` の `y-ohgi.com` への転送は依頼者の設定であり、本ワークフロー中に変わらない | 実測（practices-discovery）。完了判定はリダイレクト追従後の最終ステータスで行う | deployment-execution |
| A4 | honkit 6.2.2 の挙動（未解決リンクでも終了コード 0、`.md` が残る）は執筆中に変わらない | `package-lock.json` で固定。practices-discovery の実測 | build-and-test |
| A5 | 2.8.2 のドキュメントに無い「v1」の説明は claude 版へのリンクで足りる | Q3 の代理回答。依頼者が後日「v1 の説明を first 版にも書くべき」と判断する可能性がある | 依頼者（後日）。修正は新しいワークフローで扱う |
| A6 | 章数 20・本文の章は 2,000〜6,000 文字で必須内容を書き切れる | 本要件の必須内容の分量から見積もった。未検証。章数は既に NFR4 の上限にあるため、超過が見えても章の分割はしない | functional-design（章仕様で超過が見えたら、必須内容の削減か NFR4 の上限改定をゲートで人（代理）に提案する。R-01） |
| A7 | 配布方式の転換点は 2.7.2（`install.sh` 初出）で、2.8.0 系がその方式だけで配布された最初の baseline である | `CHANGELOG.md § [2.7.1]`（`dist/` の複製）、`§ [2.7.2]`（`install.sh --version 2.7.2`）、`§ [2.8.0]`、`§ [2.8.1]`（「2.8.0 native install」）で確認。intent-statement の Initiative Trigger の「2.8.0 で配布方法が変わった」はこの精度に直す（R-08） | code-generation（FR3.1 執筆時に CHANGELOG を再確認） |
| A8 | SM1 の「最初の承認ゲートに到達」は、本書では「intent-capture の最初の質問が Claude Code 上で提示される」と読み替える | 無人環境では質問に答えられずゲートまで進めないため、読者が最初に「止まって判断する」地点である質問の提示を到達点とする。機械検証はディレクティブ発行（NFR1 (5)）で近似する（R-02） | build-and-test（NFR1）と code-generation のゲート（Claude Code 上の提示の代理精読） |

## Out of scope

- チーム導入ガイド、他手法との詳細比較（claude 版 第 4 部・2.12 への導線 FR8.1 のみ）
- サンプルアプリ、読者用の演習リポジトリ、英語版、動画
- Claude Code 以外のハーネスのハンズオン
- ランディングページの新規作成と現行版の `/claude/` 再配置（完了済み）。first 版の概要文の更新のみ deployment-execution で行う
- アプリケーションコード、クラウドインフラ、運用面
- AI-DLC 2.8.2 以外の版の事実（クローン HEAD の追加分、2.7.1 時点の手順）
- User Stories ステージ（`docs-book` で SKIP。本書の「読者」は 1 ペルソナで、章の学習目標が受け入れ条件の役割を果たす）

## Open questions

| # | 問い | 決める場所 | 提案 |
| --- | --- | --- | --- |
| OQ1 | 方法論の原典（AWS ブログ）の出典表記 | domain-design | 出典節では `[2.8.2] docs/guide/00-introduction.md § What is AI-DLC?`（原典へのリンク元）で引き、原典 URL は 2.1 の本文と付録 C に書く。名前空間 4 種は増やさない |
| OQ2 | 固定トークンの対訳表（英語トークン → 日本語 → 初出章） | domain-design | FR3.2 の用語を核に作り、付録 A の元にする |
| OQ3 | 章ファイル名（`docs/<NN-部>/<NN-章>.md` のスラッグ）と `FR{n}.{m}` → 章ファイルパスの対応（traceability の target）、および付録の見出しと `SUMMARY.md` の形 | domain-design / units-generation | 部 = `01-context`、`02-concepts`、`03-mechanics`、`04-handson`、`05-case-study`、`99-appendix` を候補とする。付録は `SUMMARY.md` で `## 付録` + `* [A. 用語集](docs/99-appendix/01-glossary.md)` のように文字を振り、章の `# ` 見出しも `# A. 用語集` とする（claude 版と同形）。`check-first.mjs` の許容集合に「付録は `# <A〜D>. タイトル`」を含める（R-05） |
| OQ4 | Bolt の区切り（walking skeleton に入れる章、以降の順序） | delivery-planning | Bolt 1 = FR1 + FR2.1 + 検査スクリプト。以降は intent-backlog の risk-first（FR4 → FR5 → FR6 → FR3 → FR7） |
| OQ5 | `[record]` の抜粋に含める監査シャードのファイル名（ホスト名を含む）の扱い | functional-design（FR4.6、FR6.3） | マスキング規約に従い、ファイル名はそのまま（機械依存だが秘密ではない）、絶対パスは短縮 |
| OQ6 | NFR4 の文字数計測の方法（全角・半角の数え方、コードブロックの扱い） | build-and-test（`check:first` の実装） | 本文から `## 出典` 節・コードフェンス・表（`|` で始まる行）を除いた文字数（Unicode コードポイント数）で計測。付録は上限のみ（NFR4 (b)）（R-01） |
