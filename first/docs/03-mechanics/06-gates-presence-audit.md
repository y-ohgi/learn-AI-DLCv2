# 3.6 承認ゲート・人間の在席・監査ログ

AI-DLC の設計原則は「人が決め、AI が実行する」です。この章では、その原則がスローガンではなく仕組みとして実装されている場所を見ます。ステージの終わりに現れる承認ゲート、その承認を「人がそこにいた」証拠なしには受け付けない人間の在席、そしてすべての決定を追記していく監査ログの 3 つです。読み終えると、「なぜ AI が勝手に承認できないのか」を仕組みとして説明でき、監査ログの 1 ブロックを読めるようになります。

## この章で学ぶこと

- 承認ゲートの選択肢（Approve / Request Changes と、条件つきで現れる選択肢）を説明できる。
- フックが刻む `HUMAN_TURN` と要約確認の受領が、なぜ AI の自己承認を防ぐのかを説明できる。
- 監査イベントの形式と代表的なイベント、監査シャードと状態ファイルの置き場所を知り、監査ログの 1 ブロックを読める。

## 承認ゲート

**承認ゲート**とは、ステージの作業が終わるたびにワークフローを止め、人が成果物を確認して先へ進めるかを決める地点です。Initialization の 3 ステージを除くすべてのステージがゲートで終わります。標準のゲートは 2 択です。

```text
How would you like to proceed?
  (1) Approve — Continue to [next stage]
  (2) Request Changes — Provide revision feedback
```

`[next stage]` には、エンジンが計算した実際の次ステージ名（最後のステージなら「Complete workflow」）が入ります。**Approve** を選ぶとエンジンがステージを完了にして状態ファイルを更新し、進捗の 1 行を表示して次へ進みます。**Request Changes** を選ぶと具体的な指摘を書き、エージェントが成果物を直して同じゲートを再提示します。表示された選択肢に一致しない返答は、認識されて選択肢が再表示されるだけで、何も記録されずゲートは開いたままです。

条件つきで選択肢が増えることがあります。同じステージで 3 回以上 Request Changes を重ねると、3 つ目の **Accept as-is**（現在の版を保管して先へ進む）が現れます。「完璧は良の敵」になる無限の修正ループを防ぐ逃げ道で、修正回数は次のステージに移るとリセットされます。また Ideation と Inception の間は、スコープで飛ばした先のステージを戻す **Add Skipped Stage** が、その条件が満たされたときだけ現れます。

## 人間の在席

ここが本章の核心です。ゲートで「Approve」と入力するのがコンダクター（AI）自身であってはならない、というのは方針としては分かりますが、AI は文字列を書けるのですから、方針だけでは止められません。2.8.2 はこれを **人間の在席**（human presence）の検査で実装しています。

仕組みはこうです。Claude Code のフック（特定の出来事のときに自動で走るスクリプト）として `aidlc-record-human-turn.ts` が登録されており、あなたがプロンプトを送信したとき、または質問ピッカーに回答したときに、監査ログへ `HUMAN_TURN` というイベントを 1 つ刻みます。そしてゲートの approve（と、質問への回答の記録）は、**前回のゲート解決以降に `HUMAN_TURN` が 1 つ以上刻まれていなければ拒否**されます。コンダクターが自分で「Approve」と報告しようとしても、その間に人の入力が観測されていなければエンジンが受け付けない、ということです。インストール済みランタイムでは `first/.claude/settings.json` の `UserPromptSubmit` と `PostToolUse` に `aidlc engine hook record-human-turn` が配線されています。

ガイドはこの検査の限界も正直に書いています。`HUMAN_TURN` が証明するのは「人がそこにいて、その順序で入力した」ことだけで、その後に渡される決定文（`--user-input` などの文言）を人が書いたことまでは認証しません。ハーネスによっては入力の内容を信頼できる形で受け取れないためです。明示的に AI の自己申告と分かる文言をはじく最小限のトリップワイヤーはありますが、監査シャードは運用上の証拠であり、改ざん不能な境界ではない、と一次情報は述べています。

自動化との関係も押さえておきます。人が居ないのにプロンプトを送るスクリプトは、環境変数 `AIDLC_UNATTENDED=1` を設定しなければなりません。これは「無人である」という宣言で、設定すると `HUMAN_TURN` の刻印が抑止され、その結果として承認ゲートと質問のゲートは **待ち続けます**。つまり `AIDLC_UNATTENDED=1` はゲートを通すためのフラグではなく、ゲートに「待て」と告げるためのフラグです。人が引き継ぐときは環境変数を外して、あらためて返答を送ります。

在席の検査は承認ゲートだけでなく、**要約確認**（summary confirmation）にも掛かります。多くのステージは成果物を書く前に、質問への回答を要約して「Does this all look correct before I generate the artifact?」と人に確認します。ここで「Looks correct」が選ばれると `SUMMARY_CONFIRMATION_RECORDED` というイベントが刻まれ、確認された質問ファイルの内容のハッシュと一緒に記録されます。この受領も、直前に新しい人間の入力があることを要求します。

> **注意** — 本書の制作ワークフローは、AI-DLC のプロジェクトフックが登録されていない Claude Code セッションから、エンジンを直接駆動して走りました。フックが無いので `HUMAN_TURN` は一度も刻まれず（実際、本ワークフローの監査シャードには `HUMAN_TURN` の行が 1 つもありません）、要約確認の受領はそのままでは拒否されます。そこで、公式のトラブルシューティングが「管理ポリシーでフックが塞がれているとき、人が監督する復旧セッションに限って使える一時的なバイパス」として文書化している 2 つの環境変数 `AIDLC_SKIP_HUMAN_PRESENCE_GUARD=1` と `AIDLC_SKIP_SUMMARY_CONFIRMATION_GUARD=1` を該当コマンドに付けて受領を記録しました。`aidlc doctor` も同じ文言でこの回避策を案内します。これは本来の使い方からの逸脱であり、記録の `memory.md` に逸脱として書き残しています。何が代理で決められ、何が限界だったかは 5.3 でまとめて扱います。

## 監査ログの形式

**監査ログ**（audit log）は、ワークフローの決定と出来事を追記だけしていく記録です。置き場所は Intent の記録ディレクトリ `aidlc/spaces/<space>/intents/<YYMMDD>-<label>/audit/` で、その中に **監査シャード**（audit shard）と呼ぶファイルが `<host>-<clone>.md` の名前で置かれます。クローン（作業コピー）ごとに自分のシャードにだけ追記するので、並行するワークツリーからの追記が git の競合になりません。読む側は `audit/*.md` をまとめて時刻順に並べ直します。本書の記録では `vm-a9d1eb8f1a6a.md` の 1 枚だけです。

1 つの出来事は `---` で区切られた 1 ブロックで、`**Timestamp**` と `**Event**` の 2 行は書き込みツールが必ず 1 つずつ付け、残りの項目はイベントごとに決まっています。イベント名は 95 種類、23 分類の登録表で固定されており、`SUBJECT_PAST_VERB`（主語と過去形の動詞）の形で「何が起きたか」に答えます。コンダクターが勝手に新しいイベント名を発明することは禁じられています。代表的なものを挙げます。

| 分類 | イベント名 | いつ |
| --- | --- | --- |
| ステージ | `STAGE_STARTED` / `STAGE_AWAITING_APPROVAL` / `STAGE_COMPLETED` | ステージ開始、ゲートが開いた、ステージ完了 |
| 対話 | `DECISION_RECORDED` → `QUESTION_ANSWERED` | 構造化質問を提示する前に選択肢を記録、人が答えた |
| 対話 | `SUMMARY_CONFIRMATION_RECORDED` | 要約確認の受領 |
| 対話 | `GATE_APPROVED` / `GATE_REJECTED` | ゲートで Approve / Request Changes |
| セッション | `HUMAN_TURN` | フックが観測した人の入力 |
| 学び | `RULE_LEARNED` / `PRACTICES_AFFIRMED` | 学びの保存、慣行の確認（3.7 で扱う） |

ログに何が残るかも決まっています。ステージの開始と完了、記録ディレクトリへのすべてのファイル書き込み（フックが自動で `ARTIFACT_CREATED` / `ARTIFACT_UPDATED` を刻む）、すべてのゲート判断、すべての質問への回答、サブエージェントの完了、エラーと復旧です。特定のステージの履歴を追うには、その `STAGE_STARTED` と `STAGE_COMPLETED` の間を読みます。

## 記録から読む

本書の制作記録から、最初のステージ intent-capture で「質問への回答方法を選ぶ → 要約確認 → 承認」が記録された流れを、4 ブロック抜粋します（ハッシュは一部省略）。

```markdown
## Decision Recorded
**Timestamp**: 2026-09-13T13:04:06Z
**Event**: DECISION_RECORDED
**Stage**: intent-capture
**Decision**: 質問ファイルへの回答方法（対話モード）の選択
**Options**: Guide me,I'll edit the file,Chat

---

## Question Answered
**Timestamp**: 2026-09-13T13:05:29Z
**Event**: QUESTION_ANSWERED
**Stage**: intent-capture
**Details**: I'll edit the file

---

## Summary Confirmation Recorded
**Timestamp**: 2026-09-13T13:05:44Z
**Event**: SUMMARY_CONFIRMATION_RECORDED
**Stage**: intent-capture
**Details**: Looks correct
**Checkpoint**: Consolidated Summary Confirmation
**Questions File**: aidlc/spaces/default/intents/260913-aidlc-v2-book/ideation/intent-capture/intent-capture-questions.md
**Questions SHA-256**: 16e6cc49…
**Hash Scope**: confirmed-content-v1

---

## Gate Approved
**Timestamp**: 2026-09-13T13:27:23Z
**Event**: GATE_APPROVED
**Stage**: intent-capture
**User Input**: Approve
**Review Finding Dispositions**: {"version":1,"dispositions":[{"…","id":"R-08","status":"Accepted risk"}, …]}
```

読み方は次のとおりです。`DECISION_RECORDED` は質問を出す **前** に、提示した選択肢を記録します。`QUESTION_ANSWERED` の `Details` には選ばれた選択肢が逐語で入ります（ここでは質問ファイルを直接編集する方式）。`SUMMARY_CONFIRMATION_RECORDED` は質問ファイルのどの内容を確認したかをハッシュで固定するので、確認の後にファイルが書き換われば検出できます。`GATE_APPROVED` の `User Input` にはゲートで入力された文言が入り、レビュアー（3.5）の所見をどう扱ったか（ここでは R-08〜R-10 を「Accepted risk」）も残ります。この 4 ブロックの間には、成果物の書き込みを示す `ARTIFACT_CREATED` や、レビュアーの `REVIEW_REQUESTED` / `REVIEW_COMPLETED` が挟まっており、実物を開けば 1 ステージの全行程を追えます。

## 状態ファイル

監査ログと対になるのが **状態ファイル** `aidlc-state.md` で、同じ記録ディレクトリの直下にあります。監査ログが「何が起きたか」の追記なら、状態ファイルは「今どこにいるか」の現在値です。プロジェクト情報、スコープ設定、実行計画の要約、実行時状態（修正回数、Construction の反復方式など）、そしてステージごとの進捗をチェックボックスの記号で持ちます。監査イベントの定義で使われる記号は、`[-]` が実行中、`[?]` がゲートが開いている、`[R]` が修正中、`[x]` が完了、`[S]` がスキップです。エンジンはセッション開始ごとにこのファイルを読んで、何が済み、何が進行中で、次に何が来るかを決めます。人が入力した最初の説明文は隣の `project-description.json` に 1 つの JSON 文字列として保管され、状態ファイルには 1 行の安全な要約だけが置かれます。

両者はどちらも git にコミットする前提です。状態ファイルは 1 つ、監査シャードはクローンごとに 1 つで競合しない、という分担になっています。読者が自分のワークフローで同じものを見る場所は、`aidlc/spaces/<space>/intents/<YYMMDD>-<label>/aidlc-state.md` と、同じ場所の `audit/` です。

## まとめ

- 承認ゲートは Initialization 以外のすべてのステージの終わりに現れ、標準では Approve / Request Changes の 2 択。3 回以上の修正で Accept as-is が、Ideation / Inception では条件つきで Add Skipped Stage が現れる。
- フックはプロンプト送信とピッカー回答のたびに `HUMAN_TURN` を刻み、approve と要約確認の受領は前回のゲート解決以降の `HUMAN_TURN` が無ければ拒否される。`AIDLC_UNATTENDED=1` は刻印を止めてゲートを待たせる宣言であり、通すものではない。本書の制作ではフックが無いため文書化された一時バイパスで受領を記録した。
- 監査ログは `audit/<host>-<clone>.md` の監査シャードに `---` 区切りのブロックとして追記され、各ブロックは `**Timestamp**` と `**Event**` を持ち、イベント名は 95 種類の登録表に固定される。状態ファイル `aidlc-state.md` は現在地を、監査ログは経緯を担う。

## 出典

- [2.8.2] `docs/guide/07-interaction-modes.md` § Approval Gates — Initialization を除く全ステージがゲートで終わること
- [2.8.2] `docs/guide/07-interaction-modes.md` § Standard Gate — Approve / Request Changes の 2 択、`[next stage]` の計算、不一致の返答は記録されないこと、`HUMAN_TURN` を要求する在席の検査とその限界、`AIDLC_UNATTENDED=1` の意味
- [2.8.2] `docs/guide/07-interaction-modes.md` § The 3-Strike Revision Escape Hatch — Accept as-is の出現条件と修正回数のリセット
- [2.8.2] `docs/guide/07-interaction-modes.md` § Add Skipped Stage Option — Ideation / Inception でのみ現れる条件つき選択肢
- [2.8.2] `docs/reference/06-hooks-and-tools.md` `record-human-turn.ts` — フックが `UserPromptSubmit` と `PostToolUse`（`AskUserQuestion`）で `HUMAN_TURN` を記録し、`AIDLC_UNATTENDED=1` が刻印を抑止すること
- [2.8.2] `core/hooks/aidlc-record-human-turn.ts` — 人間の在席を刻むフックの実体（名前のみ参照）
- [2.8.2] `core/knowledge/aidlc-shared/audit-format.md` § Naming Convention — `SUBJECT_PAST_VERB` の命名と、イベント名を発明してはならないこと
- [2.8.2] `core/knowledge/aidlc-shared/audit-format.md` § Emitter-Owned Fields — `Timestamp` と `Event` は書き込みツールが 1 つずつ付けること
- [2.8.2] `core/knowledge/aidlc-shared/audit-format.md` § Event Registry (95 events, 23 categories) — 登録表の規模
- [2.8.2] `core/knowledge/aidlc-shared/audit-format.md` § Session Events — `HUMAN_TURN` の意味（在席と順序の証拠であって決定文の認証ではない）、監査シャードが改ざん不能な境界ではないこと
- [2.8.2] `core/knowledge/aidlc-shared/audit-format.md` § Interaction Events — `DECISION_RECORDED`、`QUESTION_ANSWERED`、`SUMMARY_CONFIRMATION_RECORDED`（要約確認の受領と質問ファイルのハッシュ）、`GATE_APPROVED` / `GATE_REJECTED` の項目
- [2.8.2] `core/knowledge/aidlc-shared/audit-format.md` § Stage Lifecycle — `STAGE_STARTED` / `STAGE_AWAITING_APPROVAL` / `STAGE_COMPLETED` と状態ファイルの記号 `[-]` `[?]` `[R]` `[x]` `[S]`
- [2.8.2] `docs/guide/10-state-and-audit.md` § State File (`aidlc-state.md`) — 状態ファイルの置き場所、含まれる節、`project-description.json`、セッション開始時にエンジンが読むこと
- [2.8.2] `docs/guide/10-state-and-audit.md` § Audit Trail (`audit/`) — クローンごとの監査シャード `<host>-<clone>.md`、追記のみ、時刻順の再構成
- [2.8.2] `docs/guide/10-state-and-audit.md` § What gets logged and when — 記録される出来事の一覧（ファイル書き込み、ゲート判断、質問回答、サブエージェント完了、エラー）
- [2.8.2] `docs/guide/10-state-and-audit.md` § How State and Audit Work Together — 状態ファイルと監査シャードを git にコミットする分担
- [2.8.2] `docs/guide/15-troubleshooting.md` § Claude managed policy blocks project hooks — `AIDLC_SKIP_HUMAN_PRESENCE_GUARD=1` と `AIDLC_SKIP_SUMMARY_CONFIRMATION_GUARD=1` が、フックが刻めない受領のための一時的なバイパスとして文書化されていること
- [2.8.2] `core/tools/aidlc-utility.ts` doctor — `allowManagedHooksOnly` でフックが塞がれたときに同じ 2 つの環境変数を案内する文言
- [runtime] `first/.claude/settings.json` hooks — `UserPromptSubmit` と `PostToolUse` に `aidlc engine hook record-human-turn` が配線されていること
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/audit/vm-a9d1eb8f1a6a.md` intent-capture の `DECISION_RECORDED` / `QUESTION_ANSWERED` / `SUMMARY_CONFIRMATION_RECORDED` / `GATE_APPROVED` — 抜粋した 4 ブロックと、シャードに `HUMAN_TURN` の行が無いこと
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/ideation/intent-capture/memory.md` § Deviations — フックの無いセッションで 2 つのバイパス環境変数を用いて受領を記録した逸脱の記載
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/aidlc-state.md` § Runtime State — 状態ファイルの実物（修正回数、Construction の反復方式）
