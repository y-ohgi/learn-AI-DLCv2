# 3.7 ルール・学習ループ・センサー

1.1 で、個人の AI 利用がチームでは崩れる理由の 1 つに「前提がずれる」ことを挙げました。A さんの Agent と B さんの Agent が違う流儀を教えられている、という問題です。AI-DLC はこれに、エージェントが毎回読み込む文章のルールと、そのルールがワークフローの中で育っていく学習ループ、そして文章ではなく機械で検査するセンサーの 3 つで答えます。この章ではその 3 つを、本書の制作記録に実際に残った行を見ながら説明します。

## この章で学ぶこと

- メモリ層 org / team / project / phase の役割と、strict-additive（厳密に加算的）という解決の仕方を説明できる。
- practices-discovery が `team.md` を置き換え `project.md` に追記すること、§13 の学びの儀式がゲートで「学び」を `project.md` に保存することを説明できる。
- センサーが何を、いつ、どの重さ（advisory / blocking）で検査するかを説明できる。

## メモリ層

**ルール**（rule）とは、エージェントの振る舞いを形づくる、文章で書かれた永続的な指示です。ルールは Space（1 つのチームの作業領域）ごとに `aidlc/spaces/<space>/memory/` に Markdown ファイルとして置かれ、ファイル名がそのまま **メモリ層**（memory layer）を表します。ファイルの中に「これは team のルール」と書く項目は無く、名前が層です。

```text
aidlc/spaces/<space>/memory/
+-- org.md          framework + organization defaults
+-- team.md         team's affirmed practices
+-- project.md      this project's specialization
+-- phases/
    +-- ideation.md
    +-- inception.md
    +-- construction.md
    +-- operation.md
```

`org.md` はフレームワークが同梱する既定（トランクベース開発、テストの姿勢、walking skeleton の方針など）、`team.md` はチームが確認した慣行、`project.md` はこのプロジェクトだけの特殊化、`phases/<phase>.md` はそのフェーズのすべてのステージに掛かる注意事項です。各ファイルは `## Way of Working`、`## Testing Posture`、`## Deployment`、`## Code Style` といった見出しごとの素の文章で、人が手で読めますし手で編集もできます。Claude Code では `.claude/CLAUDE.md` から `@` インポートで参照され、本書のランタイムでは `first/.claude/rules/aidlc.md` がこの 7 ファイルを取り込んでいます。

ルールはワークフロー開始時に `org → team → project → phase → stage` の 5 層の連鎖で解決されます（5 層目のステージ別ルールは将来のために予約されており、2.8.2 では使いません）。この解決は **strict-additive** です。適用されるルールはすべてエージェントの文脈に現れ、実行時に黙って捨てられたり上書きされたりするものはありません。以前の版にあった上書きの仕組みは廃止され、代わりに「狭い層が広い層に矛盾する」場合は、後で見る学びの儀式の受け入れ時に人が判断します。もう 1 つ重要なのは、この解決が **ワークフローの開始時に 1 回だけ** 行われることです。途中で `project.md` に 1 行増えても、いま走っているワークフローの見え方は変わらず、次のワークフローから効きます。

## practices-discovery が team.md を書く

`team.md` に慣行を書き込むのは、Inception の practices-discovery というステージです。リード `aidlc-pipeline-deploy-agent` が既存のリポジトリや会話から慣行の草案 `team-practices.md` と `discovered-rules.md` を作り、3.5 で見たように支援エージェントが寄稿し、質問と回答を経て承認ゲートに出ます。人が Approve すると、コンダクターは `team.md` を直接編集する代わりに `aidlc engine state practices-promote` という決定論的なコマンドを走らせます。このコマンドは寄稿ファイルの識別行を再検証したうえで、`team.md` の対応する 5 つの節を草案で **置き換え**、`project.md` の `## Mandated` と `## Forbidden` に日付つきの `ALWAYS …` / `NEVER …` の行を **追記** し、`PRACTICES_AFFIRMED` イベントを刻みます。コマンドが失敗すればステージはゲートで止まったままで、承認は成立しません。

本書の `team.md` の `## Testing Posture` は、このコマンドが書いたものです。冒頭の 2 行は org.md が要求する構造化フィールドで、続く箇条書きがこのプロジェクトでの「テスト」の読み替えです。

```markdown
## Testing Posture

- **Methodology**: test-after
- **Ordering**: Bolt ごとに、骨格・章本文・章末の出典節・ハンズオン手順の各層を書き終えた直後にその層の検査（…）を実行し、Bolt 完了前に全章分を再実行する。
- 本プロジェクトにアプリケーションコードとユニットテストフレームワークは無い。「テスト」とは次の 4 種の検証を指す。
```

同じゲートで `project.md` の `## Mandated` に追記された行の 1 つがこれです。末尾の `(affirmed 2026-09-13)` が、practices-discovery の確認で入った印です。

```markdown
- ALWAYS 読者を「AI-DLC v1/v2 を知らないエンジニア」として書く [依頼文 Q9] (affirmed 2026-09-13)
```

## 学びの儀式（§13）

ルールが育つもう 1 つの経路が **学び**（learnings）です。ステージプロトコルの §13 は、承認ゲートに到達するすべてのステージで、完了メッセージの後・承認ゲートの前に「学びの取り込み」を必ず行う、と定めています。ガイドはこれを「一度の訂正を、二度と必要にならない永続的なルールに変える仕組み」と説明します。手順は 4 つの場面から成ります。

1. **日記をつける。** ステージの実行中、コンダクターは記録の `<phase>/<stage>/memory.md` に、時刻つきの観察を 4 つの見出し **Interpretations**（曖昧な指示をどう解釈したか）、**Deviations**（意図的に手順から外れた点とその理由）、**Tradeoffs**（検討した代替案と選んだ理由）、**Open questions**（次回までに確かめたいこと）の下に追記します。
2. **候補を挙げる。** ゲートの前に、決定論的なツール（`aidlc engine learnings surface`）が `memory.md` を読み、Interpretations / Deviations / Tradeoffs の各行をそのまま候補として出します。言い換えも「面白いものだけ」の選別もしません。Open questions は研究項目であって保存対象ではないので、候補になりません。
3. **人が選ぶ。** 候補を複数選択の質問として提示し、加えて **必ず** 「Anything to add for next time?」と尋ねます。候補が 0 件でもこの質問は省けません。追加があれば 4 見出しのどれかを選んでもらい、それが人に問う唯一の分類です。保存先の見出し（テスト関連なら `## Testing Posture`、禁止事項なら `## Forbidden`、それ以外は `## Corrections`）はコンダクターが振り分けます。書き込む前に、`org.md` の同じ見出しの内容と矛盾しないかをコンダクターが照合し、矛盾があれば人が修正・除外・上申のいずれかを選びます。上書きの選択肢はありません。
4. **ツールが書く。** 選択を JSON にまとめ `aidlc engine learnings persist` に渡します。ツールはロックの中で `project.md`（既定）か `team.md`（「チームに広げる」を選んだとき）の該当見出しに `- <本文> (learned YYYY-MM-DD) <!-- cid:… -->` の 1 行を追記し、`RULE_LEARNED` イベントを刻みます。org 層に書く経路はありません。

本書の `project.md` の `## Corrections` に、この経路で入った行の 1 つを抜粋します。

```markdown
- first 版の各章末に「出典」節を置き、事実主張ごとに一次情報のファイルパスを列挙する。別途の主張→出典対応表は作らない (learned 2026-09-13) <!-- cid:260913-aidlc-v2-book:scope-definition:00190d2e… -->
```

末尾の `<!-- cid:… -->` は「Intent の slug : 学びが生まれたステージ : 学びの本文の SHA-256」から成る同一性マーカーで、途中で落ちた保存を再実行しても同じ行が二重に追記されないようにするためのものです。本書の監査シャードには `RULE_LEARNED` が 7 件あり、`## Decided`（以前のステージで決めたことを再び訊かないための節）にも `## Corrections` にも、この形の行が並んでいます。

> **補足** — コンダクターがルールファイルを `Edit` で直接書くことは禁じられています。すべての学びの書き込みはツールを通り、`RULE_LEARNED` / `SENSOR_PROPOSED` の監査行が「何が学ばれたか」の再生可能な唯一の根拠になります。ステージ定義ファイル自体は不変で、儀式が書き換えるのは `memory/` のルールと、後述するセンサーの取り込みリストだけです。

## センサー

ルールはエージェントが **読む** 文章で、前向きに振る舞いを導きます。**センサー**（sensor）はエージェントが書いた成果物を **機械が検査** する、後ろ向きの確認です。ガイドは「ルールが『ユーザーストーリーは Given/When/Then 形式で』と言うなら、センサーは必要な見出しが実際にファイルにあることをバイト単位で検証できる」と例えています。

センサーの定義（マニフェスト）は `.claude/sensors/aidlc-<id>.md` にあり、YAML の前付けに `id`、`kind`（2.8.2 では `deterministic` のみ）、`command`（実行するコマンド）、`default_severity`（`advisory` か `blocking`）、`fire_on`（`write` か `gate`、既定は `write`）、`matches`（検査対象のファイル形のグロブ）を持ちます。どのステージで動くかはマニフェスト側ではなく、ステージ定義の前付け `sensors:` の一覧が決め、ワークフロー開始時のコンパイルでステージのグラフに焼き込まれます。

- `fire_on: write` のセンサーは、エージェントがステージの成果物を書いた直後に PostToolUse フックが走らせます。`matches` に合うファイルだけが対象です。
- `fire_on: gate` のセンサーは、ゲートを開くときに、宣言された成果物それぞれに対して 1 回走ります。

重さは 2 段階です。**advisory**（助言）は失敗しても監査行と詳細ファイル（何が欠けているか）を残すだけで、ゲートを塞ぎません。**blocking**（阻止）は `fire_on: gate` のときだけ強制され、明示的に監査される上書きが無ければゲートが開きません。`write` 時の blocking 宣言は、この版では advisory として扱われます。同梱の 6 センサー `claim-sources`、`required-sections`、`upstream-coverage`、`traceability`、`linter`、`type-check` は、本書のランタイム `first/.claude/sensors/` を開くとすべて `default_severity: advisory` で、`claim-sources`、`required-sections`、`upstream-coverage` の 3 つが `fire_on: gate` です。たとえば 3.8 で見る units-generation の依存関係ファイルの `yaml` ブロックは、`required-sections` センサーがゲートで検査します。

学びの儀式とセンサーはつながっています。ゲートで保存したい学びが「ルール」ではなく「検査」なら、儀式はマニフェストの雛形を `aidlc-<id>.md` として作り、元のステージの `sensors:` に id を追記する 2 つの書き込みを 1 つのロックの中で行い、`SENSOR_PROPOSED` を刻みます。新しいセンサーは次のワークフローのコンパイルから効きます。

## まとめ

- ルールは `aidlc/spaces/<space>/memory/` の `org.md` / `team.md` / `project.md` / `phases/<phase>.md` にファイル名で層が決まる文章として置かれ、ワークフロー開始時に 1 回だけ strict-additive に連結される。途中で増えたルールは次のワークフローから効く。
- practices-discovery の承認では `practices-promote` が `team.md` の 5 節を置き換え `project.md` の `## Mandated` / `## Forbidden` に `ALWAYS` / `NEVER` を追記する。§13 の学びの儀式では、`memory.md` の日記から候補を機械的に挙げ、人が選び、ツールが `project.md` に `(learned 日付) <!-- cid:… -->` つきの 1 行を追記して `RULE_LEARNED` を刻む。
- センサーは `.claude/sensors/aidlc-<id>.md` の決定論的な検査で、書き込み時かゲート時に走り、advisory は報告だけ、blocking はゲート時のみ強制される。同梱の 6 つはすべて advisory。

## 出典

- [2.8.2] `docs/guide/09-rules-and-the-learning-loop.md` § Rules at a glance — メモリ層の置き場所とファイル構成、ファイル名が層を表すこと、各ファイルの役割、`@` インポートで読まれること
- [2.8.2] `docs/guide/09-rules-and-the-learning-loop.md` § The five-layer chain — `org → team → project → phase → stage` の 5 層、strict-additive、上書きの廃止、開始時に 1 回だけの解決
- [2.8.2] `docs/guide/09-rules-and-the-learning-loop.md` § The learning loop — 日記の 4 見出し、ゲートでの候補提示と「Anything to add for next time?」、保存先が project 既定で team に広げられ org には書かないこと、受け入れ時の矛盾照合
- [2.8.2] `docs/guide/09-rules-and-the-learning-loop.md` § Applies next workflow, not mid-run — 学びが次のワークフローから効くこと
- [2.8.2] `docs/guide/09-rules-and-the-learning-loop.md` § Sensors: the deterministic second opinion — ルールとセンサーの対比、write 時の PostToolUse フック、advisory の意味、同梱 6 センサーの一覧
- [2.8.2] `docs/reference/08-rule-system.md` § Filename-derived scope — ファイル名から層が導かれる表
- [2.8.2] `docs/reference/08-rule-system.md` § Strict-additive runtime model — すべての適用ルールが文脈に現れること、ステージ層が予約であること、§13 の矛盾照合とpractices-discovery の決定論的な置き換え
- [2.8.2] `core/aidlc-common/stages/inception/practices-discovery.md` § Step 7: Promote (On Approve Only) — `practices-promote` が識別行を再検証し、`team.md` の 5 節を置き換え、`project.md` の `## Mandated` / `## Forbidden` に追記し、`PRACTICES_AFFIRMED` を刻むこと、失敗時に承認が成立しないこと
- [2.8.2] `core/aidlc-common/protocols/stage-protocol.md` § 13. Learnings Ritual — 儀式の位置（完了メッセージの後・ゲートの前）、`memory.md` の 4 見出し、`learnings surface` / `learnings persist`、必須の追加質問、見出しの振り分け、矛盾照合、`- <text> (learned YYYY-MM-DD) <!-- cid:… -->` の形と cid の構成、`RULE_LEARNED` / `SENSOR_PROPOSED`、ルールファイルを直接編集しないこと、センサーの 2 書き込み
- [2.8.2] `docs/reference/07-sensor-system.md` § Sensor Manifest Schema — マニフェストの項目（`id`、`kind`、`command`、`default_severity`、`fire_on`、`matches`）、blocking が `fire_on: gate` のみで強制されること
- [2.8.2] `docs/reference/07-sensor-system.md` § How stages import sensors — ステージ側の `sensors:` で結び付け、コンパイル時にグラフへ焼き込まれること
- [2.8.2] `docs/reference/07-sensor-system.md` § `matches` filter — write 時の対象判定と gate 時の宣言成果物ごとの実行
- [2.8.2] `core/aidlc-common/stages/inception/units-generation.md` § Step 5: Execute Plan — Generate Unit Artifacts — `yaml` の依存ブロックを `required-sections` センサーがゲートで検査すること
- [runtime] `first/.claude/rules/aidlc.md` — `org.md` / `team.md` / `project.md` / `phases/*.md` の 7 ファイルを `@` インポートしていること
- [runtime] `first/.claude/sensors/` — 同梱 6 センサーのマニフェストがすべて `default_severity: advisory` で、`claim-sources` / `required-sections` / `upstream-coverage` が `fire_on: gate` であること
- [record] `first/aidlc/spaces/default/memory/org.md` § Walking Skeleton — org 層の既定の実物
- [record] `first/aidlc/spaces/default/memory/team.md` § Testing Posture — practices-discovery が置き換えた節の抜粋
- [record] `first/aidlc/spaces/default/memory/project.md` § Mandated — `(affirmed 2026-09-13)` つきの `ALWAYS` 行の抜粋
- [record] `first/aidlc/spaces/default/memory/project.md` § Corrections — `(learned 2026-09-13) <!-- cid:… -->` つきの行の抜粋と `## Decided` の同形の行
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/audit/vm-a9d1eb8f1a6a.md` `RULE_LEARNED` / `PRACTICES_AFFIRMED` — `RULE_LEARNED` が 7 件、`PRACTICES_AFFIRMED` が 1 件刻まれていること
