# 4.2 最初のワークフロー

4.1 で `aidlc` コマンドが入りました。この章では新しい空のディレクトリを 1 つ作り、そこに Claude Code 向けの設定を非対話で入れ、`aidlc doctor` で健全性を確かめ、Claude Code から `/aidlc <説明>` でワークフローを始めます。到達点は「Claude Code 上で intent-capture の最初の質問が提示される」ところまでです。サンプルアプリは作りません。何を作るかの 1 行は、あなた自身が選びます。

## この章で学ぶこと

- 空のプロジェクトで `aidlc config --harness claude` を非対話で実行し、何が作られるかを説明できる。
- `aidlc doctor` の出力を読み、必ず通すべき検査と資格情報に依存し得る検査を区別できる。
- フックを承認して Claude Code を再起動し、`/aidlc <説明>` で最初の質問ファイルが提示されるところまで到達し、その質問に答える方法を説明できる。

## プロジェクトを設定する

4.1 の続きの場所（`aidlc-install` の親ディレクトリ）で、新しいディレクトリを作って入ります。名前は何でも構いませんが、本章では `my-first-aidlc` とします。

```bash
mkdir -p my-first-aidlc && cd my-first-aidlc
aidlc config --harness claude --mcp none --yes
```

`aidlc config` は端末があれば対話的なセットアップを始めますが、ここでは全部フラグで指定します。`aidlc config --help` の末尾に「対話式の質問にはすべて非対話用の同等フラグがある」と書かれており、本章で使う 3 つは次の意味です。

| フラグ | 意味 |
| --- | --- |
| `--harness claude` | インストール済みのハーネスランタイムから Claude Code 用を選ぶ。非対話の実行では必須 |
| `--mcp none` | Claude 向けに同梱されている任意の MCP サーバー群を入れない（`--mcp defaults` で入る）。`--yes` や `--json` は MCP の同意を意味しないので明示する |
| `--yes` | 認識できない形のディレクトリ（`.git` や `package.json` などが無い）を対象にすることを確認する。値を選ぶことはしない |

成功すると 1 行の結果が返ります。

```text
configured ~/my-first-aidlc for Claude Code 2.8.2; next: open Claude Code in this project and run `/aidlc --doctor`
```

このコマンドはローカルにだけ書き、トランザクションとして動きます。作られるものは次の 4 つです。

```text
my-first-aidlc/
+-- .claude/            harness tree (CLAUDE.md, settings.json, agents/, skills/, hooks/, tools/, ...)
+-- aidlc/              workspace shell
|   +-- active-space    cursor (gitignored)
|   +-- spaces/default/memory/   org.md, team.md, project.md, phases/, templates/
+-- .gitignore          BEGIN AI-DLC:gitignore ... END AI-DLC:gitignore
```

- `.claude/` は Claude Code 用のハーネスツリーです。`settings.json`（フックとツールの事前許可、Bedrock の環境変数）、`CLAUDE.md`（プロジェクトへの指示。先頭の `@.claude/rules/aidlc.md` が方法論を読み込む）、`agents/`、`skills/`、`hooks/`、`tools/`、`knowledge/`、`scopes/` などが入ります。
- `aidlc/` はワークスペースの殻です。`aidlc/spaces/default/memory/` に組織・チーム・プロジェクトのルール（`org.md`、`team.md`、`project.md`）とフェーズ別の guardrail が置かれます。ワークフローの Intent（1 つの取り組みの記録）はまだ作られません。最初の `/aidlc` が `aidlc/spaces/default/intents/<YYMMDD>-<label>/` を作ります。
- `.gitignore` には `BEGIN AI-DLC:gitignore` から `END AI-DLC:gitignore` までの管理ブロックが追加されます。カーソル（`aidlc/active-space`、`intents/active-intent`）やマシンローカルの派生物は無視し、状態ファイル・監査シャード・成果物はコミットする、という分け方がコメント付きで書かれています。
- `.claude/CLAUDE.md` の冒頭には「`/aidlc` にスコープか説明を続けて始める」「`/aidlc --doctor` で設定を検証する」と書かれています。`# Project Name` の行はプロジェクト名に置き換えて構いません。

> **補足** — `aidlc config --dry-run` は何も書かずに計画だけを表示します。既存のプロジェクトを再設定するときや、何が変わるか先に見たいときに使えます。

## `aidlc doctor` を読む

設定ができたら、ハーネスを開く前に `aidlc doctor` を実行します。

```bash
aidlc doctor
```

出力は Machine（マシン）、Project（プロジェクト）、Framework integrity（フレームワークの整合性）の 3 つの節に分かれ、健全な行は既定で折りたたまれ、警告と失敗だけが表示されます。本書の再現環境では次のようになりました。

```text
AI-DLC doctor

Machine
  warn  Update: update cache is absent
        fix: run `aidlc update --check`
  ok    9 checks passed

Project (.claude, Claude Code)
  warn  Plugins: 1 need attention
        fix: host inventory unavailable; run sync through the host SessionStart adapter
  ok    44 checks passed

Framework integrity
  ok    all 12 checks passed

0 problems, 2 warnings.
Warnings are advisory - if everything works, ignore them.
Run 'aidlc doctor --verbose' to see every check.
```

読み方は 3 点です。

1. **`warn` は助言で、終了コードは 0。** `fail` が 1 つでもあれば終了コードは 1 になります。上の 2 つの警告は、更新確認をまだしていないこと、Claude Code のセッションをまだ一度も開いていないのでプラグインの在庫が取れないことを言っているだけで、どちらも最初の起動で解消されます。
2. **runtime / hooks 系は必ず通すべき検査です。** `aidlc doctor --verbose` で全行を展開すると、Machine の節に `Runtime hook PATH`（フックが非対話の `PATH` で `aidlc` を見つけられるか）、`Harness CLI`（`claude` コマンドが見つかるか）、`Installed runtime: 2.8.2` が、Project の節に 17 個のフックのソースが `present` であること、`Hooks enabled (resolved disableAllHooks is not true)`、`Native command trust`（フックと許可エントリがインストール済みの `aidlc` を指す）が並びます。ここに `fail` があれば、ワークフローは最初のステージで止まります。
3. **provider 系は資格情報に依存し得ます。** 再現環境では AWS の資格情報を一切持たずに実行して `Providers: using shipped fallback; no recorded answers` が `ok` でした。資格情報の検出はオフラインで（環境変数、`~/.aws/config`、SSO キャッシュを見るだけで）行われ、Bedrock のモデルアクセスや IAM の検証は自動化できないため「保留中の作業」として記録されます。それを確認するのは `aidlc config providers --check` で、保留がある間は終了コードが 0 になりません。Bedrock を使うなら、Claude Code を開く前に 4.1 の 4 手順を済ませてください。

```text
aidlc config providers --show
aidlc config providers --check
```

上の 2 行は必要なときに手で実行するもので、本章の再現手順には含めていません。

## フックを承認して Claude Code を再起動する

ここから先は Claude Code の中の操作です。プロジェクトのディレクトリで `claude` を起動すると、Claude Code は `.claude/settings.json` に書かれたプロジェクトのフックについて承認を求めます。承認は `/hooks` からもできます。そして**承認したあとは Claude Code を完全に再起動**します。`/clear` では足りません。

```text
$ claude
（プロバイダの選択を求められたら、使うプロバイダを選ぶ）
/hooks          ← プロジェクトのフックを確認し承認する
（Claude Code を終了して、もう一度 claude を起動する）
/aidlc --doctor
```

なぜ再起動が必要かは第 3 部で見たとおりです。AI-DLC v2 のエンジンは Claude Code のフック（`PostToolUse` で監査ログを書く、`Stop` で「次の一手」を注入する、`SessionStart` で状態を読み込む、など 17 個）を土台に動いており、フックが有効になっていないセッションでは監査も状態同期も起きず、ワークフローは最初のステージで止まります。組織の管理ポリシーがプロジェクトのフックを禁じている場合（`allowManagedHooksOnly` や `disableAllHooks`）は `/aidlc --doctor` がそれを検出して行を `fail` にします。これは管理者しか解除できません。

再起動後に `/aidlc --doctor` を実行すると、Claude Code のセッションの中から同じ健全性検査が走ります。先ほどの `Plugins` の警告はここで消えるはずです。

## `/aidlc` で始める

準備ができました。Claude Code の入力欄に `/aidlc` と、続けて**何を作りたいかの 1 行**を書きます。本書はサンプルアプリを用意しません。読者が自分の仕事から 1 行を選ぶことが、この後の質問への答えを本物にするからです。書き方の例を挙げます（そのまま使わず、自分の 1 行に置き換えてください）。

```text
/aidlc 社内の勤怠打刻を Slack から行えるようにする最小のサービスを作る
```

説明文を渡すと、エンジンはキーワードからスコープ（どのステージを実行するかの型）を推定し、一致すれば「`<scope>` のワークフローを N of 33 ステージ、承認ゲート M 個で始めます。続けるか、別のスコープを名指すか、`compose` と言ってください」という 1 行の確認を返します。説明が長い、または一致しない場合は、compose（あなたの課題に合わせた実行 / スキップの計画を提案するコンポーザー）の提案に切り替わります。確認すると Initialization フェーズの 3 ステージ（Workspace Scaffold、Workspace Detection、State Initialization）が決定論的な 1 回のツール呼び出しとして走り、`aidlc/spaces/default/intents/<YYMMDD>-<label>/` に記録ディレクトリと `aidlc-state.md` が作られます。ここに人の操作はありません。

続いて Ideation フェーズの最初のステージ intent-capture（Intent の把握）が始まります。リードは `aidlc-product-agent` で、Claude Code のステータスラインが `[AIDLC] IDEATION > Intent Capture …` に変わります。

## 最初の質問ファイルを読み、答える

intent-capture の最初の仕事は、あなたに質問することです。エージェントはまず質問ファイルを `aidlc/spaces/default/intents/<YYMMDD>-<label>/ideation/intent-capture/intent-capture-questions.md` に書き、次にその答え方を 3 択で尋ねます。

```text
I've created N questions at `<record>/ideation/intent-capture/intent-capture-questions.md`. How would you like to answer them?
  (1) Guide me           — ここで 1 問ずつ対話で答える
  (2) I'll edit the file — ファイルに直接答えを書く
  (3) Chat               — 自由に話し、エージェントが決定を抽出する
```

**この 3 択が Claude Code 上に現れた時点が、本章の到達点です。** 質問ファイルの中身は、次の形をしています。

```markdown
## Sources

- [desc] Initial description: "<あなたが /aidlc に渡した 1 行>"
- [scope] Workflow-selected scope: `<scope>`.

## Q1. この取り組みが解こうとしているビジネス上の問題は何ですか？

A. ...
B. ...
C. ...
D. ...
E. Not yet defined
X. Other (please specify)

[Answer]:
```

- 冒頭の `## Sources` は、この段階でエージェントが根拠にしてよい情報源の一覧です。あなたの説明文 `[desc]` と選ばれたスコープ `[scope]`（チームのルールがあれば `[memory:M<n>]`）だけが並び、背景知識や推測はここに載せてはいけない、と定められています。
- 質問は `## Q<n>.` で連番になり、ビジネス上の問題、顧客と痛み、成功の指標、きっかけ、ステークホルダー、スコープと優先度の決め手、コミュニケーションの要件、そして「選ばれたスコープはあなたの製品の境界と合っているか」を尋ねます。
- 選択肢は `A`〜`E` の英字で、最後は必ず `X. Other (please specify)` です。どの質問にも `Not yet defined` や `None` のような「まだ決めていない」を選べる選択肢が含まれるので、狭い意図に無理に詳細を選ばされることはありません。
- 答えは `[Answer]:` の後に**英字**で書きます（`[Answer]: D`）。複数選択の質問には `(select all that apply)` と書かれていて、`[Answer]: A, B, E` のようにカンマ区切りで答えます。`X` を選んだときは自由記述を添えます。

Guide me を選ぶと、Claude Code の構造化された質問 UI で最大 4 問ずつ提示され、答えるたびにファイルへ書き戻されます。I'll edit the file を選ぶと、ファイルを編集して `done` と送るまでエージェントは待ちます。Chat では会話から決定を抽出してファイルに書きます。どのモードでも、全問の `[Answer]:` が埋まったあとに答えの要約が提示され、**Looks correct / Request changes** の要約確認で止まります。これがこの本で「最初に止まって判断する地点」と呼ぶ場所であり、5.1 で見る本書自身の記録では、この質問に代理で答えた根拠が 1 問ずつ書かれています。

> **注意** — 本書は「最初の承認ゲートに到達する」を到達点に掲げていますが、この章の到達点はその手前の「最初の質問が提示される」ところに置いています。ゲート（intent-capture の完了後に現れる Approve / Request Changes）に進むには質問に答える必要があり、人が答えを選ばない環境では機械的に再現できないためです。本書のビルド検査はこの読み替えを、次の節の「ディレクティブが発行される」ことで近似しています。

## エンジンの動きを CLI だけで覗く（任意）

`/aidlc` を入力したときにコンダクター（Claude Code 側の会話相手）が裏で何をしているかは、`aidlc` コマンドだけで覗けます。まず、まだワークフローの無い `my-first-aidlc` でエンジンに「次は何か」を尋ねてみます。

```bash
aidlc engine orchestrate next
```

Intent がまだ無いので、エンジンは `error` 種別のディレクティブで始め方を案内します。コンダクターはこのメッセージをそのまま表示して止まる、と定められています。

```text
{"kind":"error","message":"No workflow state found (no active intent). Start one by describing what to build (/aidlc \"build the auth service\") or by naming a scope (/aidlc --scope <scope>)."}
```

次に、`my-first-aidlc` は Claude Code 用に取っておき、**使い捨ての別ディレクトリ**で Initialization フェーズを CLI から起こし、最初のステージのディレクティブが出るところまで見てみます。`aidlc engine intent create` は、コンダクターが `/aidlc <説明>` を受けて実行する決定論的なステップ（一次情報では `aidlc-utility intent-create`）そのものです。

```bash
cd ..
mkdir -p engine-peek && cd engine-peek
aidlc config --harness claude --mcp none --yes --quiet
aidlc engine intent create --scope feature --arguments "Peek at the engine without Claude Code" --label first-peek
aidlc engine orchestrate next > next.json
grep -o '"kind":"[a-z-]*"' next.json
token=$(sed -n 's/.*"continue_token":"\([^"]*\)".*/\1/p' next.json)
aidlc engine orchestrate continue "$token" > run-stage.json
grep -o '"kind":"run-stage","stage":"intent-capture"' run-stage.json
```

`intent create` は Intent の記録ディレクトリ `aidlc/spaces/default/intents/<YYMMDD>-first-peek/` を作り、ワークスペースを走査し、`aidlc-state.md` を書いて、次の表示を返します。

```text
Intent created: <YYMMDD>-first-peek (space: default)
State initialized: feature scope, 32 stages, Standard depth
Project type: Greenfield
Languages: Unknown
Frameworks: Unknown
Build System: Unknown
First post-init stage: intent-capture (IDEATION)
```

続く `orchestrate next` は、まず `load-steering`（有効なスペースのルールを内容ごと届けるディレクティブ）を返し、その `continue_token` を `orchestrate continue` に渡すと `run-stage` が返ります。`run-stage` の JSON には `"stage":"intent-capture"`、`"lead_agent":"aidlc-product-agent"`、`"mode":"inline"`、`"gate":true`、`"next_stage":"Market Research"`、読み込むべき `inline_context_paths` と `stage_file` が入っています。コンダクターはこの指示に従って、前の節で見た質問ファイルを書き始めるのです。

```text
"kind":"load-steering"
"kind":"run-stage","stage":"intent-capture"
```

> **注意** — `aidlc engine` 以下はハーネスのために生成された機械向けの入口で、`aidlc engine --help` にも「人のスクリプト向けではない」とあります。ここでは動きを観察するために使い捨てのディレクトリで実行しているだけで、あなたの本番のプロジェクトでは Claude Code の `/aidlc` から始めてください。`engine-peek` は削除して構いません。

## つまずきポイント

- **非対話の `aidlc config` が止まる、または拒否される。** 非対話では `--harness` が必須です。`.git` や `package.json` などが無いディレクトリでは `--yes`（または `--project-dir`）で対象を確認する必要があります。MCP の同意は `--yes` に含まれないので `--mcp none` か `--mcp defaults` を明示します。
- **`aidlc doctor` のベースライン不一致。** doctor は `aidlc config` が記録した所有権のベースラインと現在のファイルを比べます。`.claude/` 配下のフレームワーク所有ファイルや `CLAUDE.md` の管理ブロックを手で書き換えると「conflict」の行が出ます。`aidlc config` を再実行し、意図した変更なら `--force` で差し替えます。ワークフローが 1 つでも進行中だと config の再実行は拒否されるので、先に完了させます。
- **フック未承認。** フックを承認せずに `/aidlc` を始めると、監査シャードに何も書かれず、ワークフローが最初のステージで止まります。`/hooks` で承認し、Claude Code を**完全に再起動**してください（`/clear` では不足）。`/aidlc --doctor` の `Hooks enabled` の行が `fail` なら、いずれかの設定層で `disableAllHooks` が真になっています。
- **`Harness CLI` の行が `fail`。** doctor は Claude Code 向けには `claude` コマンドを要求します。Claude Code が入っていないか、フックが使う非対話の `PATH` から見えない場合に失敗します。
- **`Providers` に関する保留。** `aidlc config providers --check` は Bedrock のモデルアクセスや IAM の確認が済んだと記録されるまで終了コードが 0 になりません。手順を済ませたら `aidlc config providers --mark-done bedrock-model-access --yes` で記録します。Bedrock を使わないなら `--provider other --acknowledge` でその選択を記録できます。
- **`/aidlc` を打ったのに説明文が無視される。** CLI から `aidlc engine intent create` を直接使うとき、説明は `--arguments "<text>"` で渡します。位置引数として渡すと静かに捨てられ、状態ファイルの `Project` は `[Project description]` のままになります。

## まとめ

- `aidlc config --harness claude --mcp none --yes` は非対話で `.claude/`、`aidlc/`（`spaces/default/memory/`）、`.gitignore` の管理ブロック、`.claude/CLAUDE.md` を作る。Intent はまだ作られず、最初の `/aidlc` が作る。
- `aidlc doctor` は Machine / Project / Framework integrity の 3 節で、`warn` は助言（終了コード 0）、`fail` は要対処（終了コード 1）。runtime / hooks 系（`Runtime hook PATH`、フックの `present`、`Hooks enabled`）は必ず通し、provider 系は資格情報が無ければ `aidlc config providers --check` が保留を返し得る。
- `/hooks` でフックを承認して Claude Code を完全に再起動し、`/aidlc <自分の 1 行>` で始めると、Initialization の 3 ステージが自動で走り、intent-capture が質問ファイルを書いて Guide me / I'll edit the file / Chat の 3 択を提示する。答えは `[Answer]:` に英字で書き、最後の選択肢は常に `X. Other`。この提示が本章の到達点であり、CLI では `aidlc engine orchestrate next` が `run-stage` ディレクティブを返すことで近似できる。

## 出典

- [2.8.2] `docs/guide/01-getting-started.md` § 2. Configure a project — `aidlc config --harness claude` と `aidlc doctor` の順、素の `aidlc config` が端末では対話式になること、書く前に検出を行うこと
- [2.8.2] `docs/guide/01-getting-started.md` § Configuration and Trust — config がローカルのみでトランザクションであること、ハーネスランタイム・`aidlc/` ワークスペース・管理された統合・所有権ベースラインを書くこと、`--dry-run`、Claude Code では `/hooks` で承認してから再起動すること、doctor が runtime / project / provider / hook / trust / workflow-state の問題を報告すること
- [2.8.2] `docs/guide/01-getting-started.md` § MCP Servers (optional) — `--mcp defaults` / `--mcp none` の意味
- [2.8.2] `docs/guide/01-getting-started.md` § What Config Creates — 設定済みプロジェクトがハーネス統合と `aidlc/` ワークスペースを持ち、最初のワークフローが `aidlc/spaces/<space>/intents/<YYMMDD>-<label>/` を作ること
- [2.8.2] `docs/guide/18-install-and-lifecycle.md` § Configure or Refresh a Project — config が Intent を作らないこと、設定後のスイープが `aidlc config providers --check` などの追作業を名指すこと
- [2.8.2] `docs/guide/18-install-and-lifecycle.md` § Config Options — `--harness`、`--mcp`、`--yes`（認識できないディレクトリの確認、MCP 同意は含まない）、`--dry-run`、`--force`、`--quiet` の意味
- [2.8.2] `docs/guide/18-install-and-lifecycle.md` § Project Choices — 非対話では `--harness` が必須、`.git`・`package.json` などを認識し、それ以外では非対話で `--project-dir` を要求すること、MCP は非 TTY で `none` が既定で `--yes` は同意にならないこと
- [2.8.2] `docs/guide/18-install-and-lifecycle.md` § Refresh Safety — ワークフローが進行中は config の再実行が拒否され、`--force` や `--yes` でも回避できないこと
- [2.8.2] `docs/guide/18-install-and-lifecycle.md` § Runtime Diagnostics — フックが使う非対話の `PATH` の基準線、`aidlc` と選択ハーネスの CLI（Claude Code では `claude`）の検査
- [2.8.2] `docs/guide/18-install-and-lifecycle.md` § Provider Diagnostics — 資格情報の検出がオフラインであること、Bedrock のモデルアクセスと IAM の検証が保留作業として記録され `--check` が保留中は非 0 であること、`--mark-done`、`--provider other --acknowledge`
- [2.8.2] `docs/guide/18-install-and-lifecycle.md` § Trust Diagnostics — doctor が指示ファイル（`CLAUDE.md`）を所有権ベースラインと比べ、手で変更された管理ブロックを conflict と報告すること
- [2.8.2] `docs/guide/18-install-and-lifecycle.md` § Output, Automation, and Exit Codes — doctor の出力が Machine / Project / Framework integrity に分かれ、健全な行を折りたたみ `--verbose` で展開すること、警告は終了コード 0、失敗は 1
- [2.8.2] `docs/guide/03-spaces-and-intents.md` § Gitignored (per-user, machine-local) — カーソルと派生物は無視し、`memory/`・`aidlc-state.md`・監査シャード・成果物はコミットするという分け方
- [2.8.2] `docs/guide/12-cli-commands.md` § `/aidlc [description]` — Start with auto-detection — 説明文からのスコープ推定、一致時の 1 行確認（ステージ数と承認ゲート数）、不一致時の compose の提案
- [2.8.2] `docs/guide/12-cli-commands.md` § Workflow Initialization — automatic — 最初の `/aidlc` が Intent を自動で作ること、3 つの Initialization ステージが `aidlc-utility intent-create` の 1 回の決定論的な呼び出しで走ること、記録ディレクトリと `aidlc-state.md` の作成、`aidlc config` を先に 1 回実行すること
- [2.8.2] `docs/guide/02-your-first-workflow.md` § Initialization Phase (Automatic) — Initialization に人の操作が無いこと、記録ディレクトリの作成とワークスペース検出、状態初期化
- [2.8.2] `docs/guide/02-your-first-workflow.md` § Stage 1.1: Intent Capture (aidlc-product-agent) — ステータスラインの `[AIDLC] IDEATION > Intent Capture`、リードが `aidlc-product-agent`、Guide Me / Edit File / Chat の 3 択
- [2.8.2] `docs/guide/02-your-first-workflow.md` § Approval Gate — intent-capture 完了後の Approve / Request Changes の承認ゲートと、成果物に `intent-capture-questions.md` が含まれること
- [2.8.2] `docs/guide/15-troubleshooting.md` § Hooks Not Firing — フックが動かないと監査シャードに何も書かれないこと、管理ポリシー `allowManagedHooksOnly` の検出と管理者だけが解除できること、承認後に完全再起動すること
- [2.8.2] `docs/guide/15-troubleshooting.md` § Hooks disabled globally (`disableAllHooks`) — いずれかの設定層の `disableAllHooks` で全フックが黙ってスキップされ最初のステージで止まること、doctor の `Hooks enabled` 行が `fail` になること
- [2.8.2] `docs/reference/04-stage-protocol.md` § Tri-Mode System — 質問ファイルを `[Answer]:` タグと `A`〜`E` の選択肢で作り、最後を `X. Other (please specify)` にすること、複数選択の `(select all that apply)` と `[Answer]: A, B, E` の形、3 モードの提示文、Guide Me の最大 4 問ずつの提示と即時の書き戻し、要約確認 Looks correct / Request changes、Edit File の `done` 待ち
- [2.8.2] `docs/reference/04-stage-protocol.md` § Plan and Question File Location — 質問ファイルがステージの成果物と同じディレクトリに置かれること
- [2.8.2] `core/aidlc-common/stages/ideation/intent-capture.md` § Step 2: Generate Clarifying Questions — 質問ファイルのパス、`## Sources` の `[desc]` / `[scope]` / `[memory:M<n>]` の形と背景知識を載せない規則、`## Q<n>.` の質問項目、`Not yet defined` などの選択肢を必ず含めること
- [2.8.2] `docs/reference/17-skill-system.md` § 11 directive kinds — `error`（メッセージをそのまま表示して止まる）、`load-steering`（`rules_content` を適用し `continue_token` で `orchestrate continue` を呼ぶ）、`run-stage`（`inline_context_paths` を読み `stage_file` と `consumes` を読む）の各ディレクティブの意味
- [2.8.2] `docs/reference/06-hooks-and-tools.md` § Hook table — 17 個のフックのソースと、`aidlc-continue-workflow.ts` が `Stop` で `orchestrate next` を観測して次の一手を注入すること
- [2.8.2] `docs/reference/03-orchestrator.md` § Inline Execution — `load-steering` の列を `run-stage` まで追い、`inline_context_paths` と `stage_file` を読んでからステージを実行すること、`next_stage` がエンジンの計算した表示名であること
- [runtime] `first/.claude/CLAUDE.md` § Prerequisites — フックを Claude Code の促しか `/hooks` で承認したら完全に再起動し `/clear` では足りないこと、管理ポリシーの検出、`settings.json` がツールを事前許可すること、`settings.local.json.example`
- [runtime] `first/.claude/CLAUDE.md` § Project Name — `/aidlc` にスコープか説明を続けて始めること、`/aidlc --doctor` で検証すること
- [runtime] `first/.claude/skills/aidlc-init/SKILL.md` — `aidlc engine intent create --scope <scope> --arguments "<description>" --label "<label>"` の形、説明は `--arguments` で渡し位置引数では捨てられること、`--label` が `<YYMMDD>-<label>` の記録ディレクトリ名になること
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/ideation/intent-capture/intent-capture-questions.md` § Sources — 実際の質問ファイルの `## Sources` と `## Q1.`〜の形、`[Answer]: D` のような英字での回答と根拠の書き方
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/inception/requirements-analysis/requirements.md` § Assumptions — A8: 「最初の承認ゲートに到達」を「intent-capture の最初の質問が Claude Code 上で提示される」と読み替え、機械検証はディレクティブ発行で近似すること
