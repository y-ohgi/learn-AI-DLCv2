# 3.1 インストールと設定

第 3 部は AI-DLC 2.8.2 の仕組みを 8 章に分けて見ていきます。最初はいちばん地味な部分、つまり何をインストールし、`aidlc config` がプロジェクトに何を置き、`aidlc doctor` が何を検査するかです。ここを押さえておくと、第 4 部のハンズオンで「なぜこのファイルができたのか」「なぜこの検査が失敗するのか」を自分で説明できるようになります。実際に手を動かすのは第 4 部なので、この章は読むだけで構いません。

## この章で学ぶこと

- ネイティブ `aidlc` コマンドとハーネスごとのランタイムの関係を説明できる。
- `install.sh --version` で版を固定する理由と方法を説明できる。
- `aidlc config --harness claude` がプロジェクトに作るものと、`aidlc doctor` が検査するものを列挙できる。
- Amazon Bedrock が「配布の既定」であって方法論の要件ではないことを、他プロバイダの手順とともに説明できる。

## ネイティブ `aidlc` コマンドとハーネスのランタイム

AI-DLC 2.8.2 の配布物は 2 層に分かれています。1 つは自分のマシンに入れる**ネイティブ `aidlc` コマンド**で、これは自己完結したバイナリなので Bun や Node.js を別途入れる必要がありません。もう 1 つは**ハーネスのランタイム**です。ハーネスとは AI-DLC を動かす会話相手のことで、Claude Code のほかに Kiro CLI、Kiro IDE、Codex CLI、Cursor、opencode、GitHub Copilot がサポートされています。インストーラは全ハーネスのランタイムをまとめてマシンに入れ、あとで `aidlc config` がその中から選んだ 1 つをプロジェクトに投影します。

```text
   [your machine]                          [your project]
   ~/.local/bin/aidlc  ----------------->  .claude/   (claude runtime)
   ~/.local/share/aidlc/versions/2.8.2/    aidlc/     (workspace)
     runtime for claude/kiro/codex/...     .gitignore (AI-DLC block)
             ^                                  ^
             |  install.sh --version 2.8.2      |  aidlc config --harness claude
```

図の左がマシン側（バージョンごとに置かれるランタイムと `aidlc` へのリンク）、右が `aidlc config` でプロジェクトに作られるものです。macOS と Linux では既定でバージョンが `${XDG_DATA_HOME:-$HOME/.local/share}/aidlc/versions/` に入り、`$HOME/.local/bin/aidlc` がアクティブな版を指します。インストーラはシェルの起動ファイルを勝手に編集しないので、新しいシェルで `aidlc` が見つからなければ、表示された PATH の指示に従います。

もう 1 つ覚えておくべき挙動は、Unix のインストーラは root での実行を拒否することです。ネイティブインストールはユーザー単位で、`sudo` は要りません。

## `--version` で版を固定する

`scripts/install.sh` の usage は次のとおりで、`--version` に `x.y.z` を渡すと最新版ではなくその版だけを入れます。

```text
Usage: install.sh [--version <x.y.z|x.y.z-preview.YYYYMMDD.N>] [--from <dir>] [--offline] [--profile <startup-file>] [--json|--quiet] [--no-color] [--yes]
```

版を固定する理由は 2 つあります。第一に、本書の事実はすべて 2.8.2 に固定されているので、読者の環境も同じ版でなければ本書の記述と食い違います。第二に、この配布方式は歴史が浅いからです。`CHANGELOG.md` を追うと、2.7.1 までは `dist/<harness>/` の木を複製する配り方で、2.7.2 で初めて `install.sh --version 2.7.2` という形の案内が現れ、2.8.0 がこの方式だけで配布された最初の baseline、2.8.1 が「2.8.0 のネイティブインストールを試して見つかった不具合」の修正、2.8.2 が本書の版です。つまり配布方法が変わった直後の版なので、どの版を入れたのかを明示しておくことに意味があります。

インストール後は `aidlc version` で確認します。本書の執筆環境では次のように返りました。

```text
aidlc 2.8.2 (runtime 2.8.2)
```

マシンの版を上げるのは `aidlc update` で、これはプロジェクトの中身を書き換えません。プロジェクト単位で版を留めたい場合は `aidlc config --pin <version>` が `.aidlc-version` を書きます。

## `aidlc config --harness claude` が作るもの

`aidlc config` はプロジェクトのルートで実行するローカル専用のトランザクション処理で、選んだハーネスのランタイム、`aidlc/` ワークスペース、ルート統合（`.gitignore` などへの差し込み）、投影スタンプ、そして後の更新のための所有権ベースラインを作ります。ワークフローそのもの（Intent と呼ぶ作業記録）はここでは作りません。端末があれば引数なしの `aidlc config` は対話ウィザードになりますが、`--harness claude` のようにフラグで指定すれば非対話で進みます。

Claude Code を選んだ場合、本書のリポジトリにコミットされている実物 `first/.claude/` と `first/.gitignore` を見ると、次のものができています。

| できるもの | 中身 |
| --- | --- |
| `.claude/` | `CLAUDE.md`、`settings.json`、`agents/`、`aidlc-common/`（ステージ定義など）、`hooks/`、`knowledge/`、`rules/`、`scopes/`、`sensors/`、`skills/`、`tools/`、`settings.local.json.example` |
| `aidlc/` | ワークスペース。`spaces/default/` の下に `memory/`（ルール）、`knowledge/`、`codekb/`、`intents/`（作業記録） |
| `.gitignore` | `# BEGIN AI-DLC:gitignore` と `# END AI-DLC:gitignore` で囲まれた 1 ブロック。ブロックの外は 1 バイトも変えない |

ここで注意したいのが `CLAUDE.md` の置き場所です。AI-DLC が作る指示ファイルは **`.claude/CLAUDE.md`** で、プロジェクトルートの `CLAUDE.md` ではありません。2.8.2 のリファレンスもこのファイルを「すべての会話に読み込まれるプロジェクトレベルの指示」であり AI-DLC の起動文書だと説明していますし、`aidlc doctor` の出力例でも `Instruction file: block or file missing (.claude/CLAUDE.md)` という行で参照されます。本書のリポジトリの `first/` にもルートの `CLAUDE.md` はありません。自分でルートに `CLAUDE.md` を持っているプロジェクトでも、それは AI-DLC の管理外です。

`.claude/settings.json` には 3 つの大きな役割があります。第一に `hooks` で、Claude Code の PreToolUse / PostToolUse / UserPromptSubmit / SessionStart / Stop などのタイミングで `aidlc engine hook <name>` を呼び、監査ログの記録や状態の同期を人が忘れても行われるようにします。第二に `permissions.allow` で、Read / Edit / Write / Glob / Grep / Task / WebSearch と `Bash(aidlc engine *)` を事前承認し、ツール呼び出しごとの確認を省きます。第三に `env` で、後述の Amazon Bedrock 向けの環境変数を設定します。config が終わると Claude Code 向けの次の一手として「`/hooks` でプロジェクトのフックを承認し、Claude Code を再起動する」ことが案内されます。`/clear` では足りず、完全な再起動が必要です。

## `aidlc doctor` が検査するもの

`aidlc doctor` は config のあとに実行する健康診断で、ランタイム、プロジェクト、プロバイダ、フック、信頼設定、ワークフロー状態の問題を、修復コマンドつきで報告します。クリーンまたは警告のみなら終了コード 0、失敗した検査があれば 1 です。コアの検査は読み取り専用で、まだ Intent が無い状態で実行してもファイルを作りません。

Claude Code 上で `/aidlc --doctor` としても同じ診断が走ります。検査項目は多いので、第 4 部で実際に見ることになる代表的なものだけ挙げます。

| 検査の系統 | 見ているもの |
| --- | --- |
| Installed runtime / Project stamp | マシンのアクティブな版と、プロジェクトに投影された版が一致しているか |
| Hook presence / Hooks enabled | `settings.json` が配線する 17 個のフックが `.claude/hooks/` に実在し、`disableAllHooks: true` になっていないか |
| Instruction file | `.claude/CLAUDE.md` の管理ブロックが無事か |
| Provider | Bedrock の資格情報や地域の記録。オフライン検査のみで、ネットワークには出ない |
| Graph / Schema / Scope | ステージ定義のフロントマターと、コンパイル済みのステージグラフ・スコープ表に矛盾が無いか |

覚えておいてほしいのは、provider 系の検査は AWS の資格情報が無いと失敗し得る一方で、runtime / hooks 系の検査はそれと独立に通る、ということです。第 4 部のハンズオンではこの区別を使います。

## Amazon Bedrock は「配布の既定」であって要件ではない

`first/.claude/settings.json` の `env` を見ると、`CLAUDE_CODE_USE_BEDROCK` が `1`、`AWS_REGION` が `us-east-1`、そして Fable / Opus / Sonnet / Haiku の各モデル別名が Amazon Bedrock のグローバル推論プロファイル ID に固定されています。つまり Claude Code 向けの配布物は、そのままだと Amazon Bedrock 経由でモデルを呼ぶ設定になっています。

2.8.2 のドキュメントはその理由を、コンダクターとその配下のサブエージェントに予測可能なモデルのベースラインが必要で、Bedrock なら正確なモデル ID とコンテキスト変種を固定でき、AWS SDK の標準的な資格情報チェーンと IAM を使えるのでプロバイダの鍵をリポジトリに入れなくてよいから、と説明しています。そして同じ節に「これは配布の既定であって、方法論の要件ではない。AI-DLC は Bedrock の API を直接呼ばず、プロバイダに依存しない」と明記されています。

Bedrock を使う場合は、モデルアクセスの有効化、`aws configure` などによる資格情報の用意、モデルが使える地域の選択、そして `claude` 起動時のプロバイダ選択で Amazon Bedrock を選ぶ、の 4 手順です。別のプロバイダを使う場合の手順もドキュメントにあり、`.claude/settings.json` と、それより優先される `.claude/settings.local.json` から Bedrock 向けの環境変数マッピングを取り除くか置き換え、そのプロバイダの Claude Code 側の認証フローを完了させます。個人設定は共有される `.claude/settings.json` に書かず、gitignore 対象の `.claude/settings.local.json` に置くのが作法です。

> **補足** — Bedrock を使わない読者は、AWS の知識を一切持たなくても本書を読み進められます。本書のハンズオン（4.1）でも「Bedrock を使わない場合」の手順を分けて書きます。

## 記録から: 設定が作った最初の状態

`aidlc config` が作ったワークスペースの上で最初のワークフローを始めると、`aidlc/spaces/<space>/intents/<YYMMDD>-<label>/` に作業記録ができます。本書を作ったワークフローの状態ファイルの冒頭は次のとおりです。

```markdown
# AI-DLC State Tracking

## Project Information
- **Project**: AI-DLC v1/v2 を知らないエンジニア向けに、AI-DLC v2 を学ぶ HonKit 教材を作り GitHub Pages で公開する
- **Project Description Source**: project-description.json
- **Project Type**: Greenfield
- **Scope**: docs-book
- **Start Date**: 2026-09-13T13:01:37Z
- **State Version**: 8
```

`Project Type: Greenfield` は 0.2 の Workspace Detection が既存コードの無いプロジェクトだと判定した結果で、`Scope` は 3.4 で扱うスコープ名です。このファイルの残りの部分は 3.2 で読みます。

## まとめ

- 配布物はマシンに入れるネイティブ `aidlc` コマンドと、全ハーネス分のランタイムの 2 層で、`aidlc config` が選んだハーネスのランタイムだけをプロジェクトに投影する。
- `install.sh --version 2.8.2` で版を固定し `aidlc version` で確認する。この配布方式は 2.7.2 で現れ 2.8.0 で baseline になった新しいもの。
- `aidlc config --harness claude` は `.claude/`（`.claude/CLAUDE.md` を含む）、`aidlc/`、`.gitignore` の AI-DLC ブロックを作り、`aidlc doctor` はランタイム・プロジェクト・プロバイダ・フック・信頼・ワークフロー状態を検査する。
- Amazon Bedrock は Claude Code 向け配布物の既定であって方法論の要件ではなく、`settings.json` / `settings.local.json` の環境変数を差し替えれば他プロバイダでも動く。

## 出典

- [2.8.2] `docs/guide/01-getting-started.md` § Quick Start — インストーラがネイティブ `aidlc` コマンドと全ハーネスのランタイムを入れること、Bun / Node.js が不要なこと、サポートされる 7 ハーネスと `aidlc config --harness <name>` の対応表
- [2.8.2] `docs/guide/18-install-and-lifecycle.md` § Install — Unix インストーラが root を拒否すること、インストール先 `${XDG_DATA_HOME:-$HOME/.local/share}/aidlc/versions/` と `$HOME/.local/bin/aidlc`、シェル起動ファイルを編集しないこと
- [2.8.2] `docs/guide/18-install-and-lifecycle.md` § Installer Options — `--version <version>` が最新版ではなく指定した 1 つの版を入れること
- [2.8.2] `scripts/install.sh` usage_text — usage 文字列の逐語
- [2.8.2] `CHANGELOG.md` § [2.7.1] — `dist/<harness>/` の木を置き換える旧来の配布方式
- [2.8.2] `CHANGELOG.md` § [2.7.2] — `install.sh --version 2.7.2` の初出とタグに紐づくネイティブリリース
- [2.8.2] `CHANGELOG.md` § [2.8.0] — 2.7.x を統合した新しい baseline であること
- [2.8.2] `CHANGELOG.md` § [2.8.1] — 2.8.0 のネイティブインストールを試して見つかった不具合の修正
- [2.8.2] `CHANGELOG.md` § [2.8.2] — `aidlc version` が `2.8.2` を報告すること、`install.sh --version 2.8.2` による導入
- [2.8.2] `docs/guide/18-install-and-lifecycle.md` § Update and Version Selection — `aidlc update` がマシンのランタイムを更新すること、`aidlc config --pin <version>` が `.aidlc-version` を書くこと
- [2.8.2] `docs/guide/01-getting-started.md` § Configuration and Trust — `aidlc config` がローカル専用・トランザクションで、ハーネスランタイム・`aidlc/` ワークスペース・ルート統合・所有権ベースラインを作ること、Claude Code では `/hooks` で承認して再起動すること、`aidlc doctor` の報告範囲（runtime, project, provider, hook, trust, workflow-state）
- [2.8.2] `docs/guide/18-install-and-lifecycle.md` § Configure or Refresh a Project — config がワークフローの Intent を作らないこと、対話ウィザードと非対話フラグ
- [2.8.2] `docs/guide/18-install-and-lifecycle.md` § Root Integrations and Ownership — `.gitignore` の AI-DLC ブロックを 1 つだけ所有し外側を保存すること
- [2.8.2] `docs/reference/14-claude-features.md` § CLAUDE.md — `.claude/CLAUDE.md` がすべての会話に読み込まれるプロジェクトレベルの指示であり AI-DLC の起動文書であること
- [2.8.2] `docs/guide/12-cli-commands.md` § `/aidlc --doctor` — 検査項目（Installed runtime、Project stamp、Hook presence の 17 フック、Hooks enabled、Schema validation、Scope validation など）、終了コード、読み取り専用であること、出力例の `Instruction file: block or file missing (.claude/CLAUDE.md)`
- [2.8.2] `docs/guide/18-install-and-lifecycle.md` § Provider Diagnostics — 資格情報の検出がオフラインのみでネットワークに出ないこと
- [2.8.2] `docs/guide/01-getting-started.md` § AWS Bedrock Setup — Bedrock が既定である理由、「配布の既定であり方法論の要件ではない」こと、Bedrock の 4 手順、環境変数の表、他プロバイダに切り替える手順、`settings.local.json` に個人設定を置くこと
- [runtime] `first/.claude/settings.json` env — `CLAUDE_CODE_USE_BEDROCK`、`AWS_REGION`、モデル別名の Bedrock ID
- [runtime] `first/.claude/settings.json` hooks — PreToolUse / PostToolUse / UserPromptSubmit / SessionStart / Stop 等で `aidlc engine hook <name>` を呼ぶ配線
- [runtime] `first/.claude/settings.json` permissions — Read / Edit / Write / Glob / Grep / Task / WebSearch と `Bash(aidlc engine *)` の事前承認
- [runtime] `first/.claude/CLAUDE.md` § Prerequisites — 指示ファイルが `.claude/` 直下にあること、フック承認後に Claude Code を完全に再起動し `/clear` では足りないこと
- [runtime] `first/.gitignore` `# BEGIN AI-DLC:gitignore` — AI-DLC ブロックの実物
- [record] `first/aidlc/spaces/default/memory/team.md` § Testing Posture — `aidlc version` の期待出力 `aidlc 2.8.2 (runtime 2.8.2)`
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/aidlc-state.md` § Project Information — 抜粋した状態ファイルの冒頭
