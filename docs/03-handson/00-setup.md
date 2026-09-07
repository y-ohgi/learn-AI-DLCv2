# 3.0 ハンズオンの進め方と環境準備

## ハンズオンの構成

| # | 内容 | スコープ | 所要 | ゲート数の目安 |
| --- | --- | --- | --- | --- |
| 3.1 | 最短で一周する | `express` | 30〜45分 | 5前後 |
| 3.2 | 既存コードのバグを直す | `bugfix` | 30〜45分 | 5前後 |
| 3.3 | Units 分解と Construction を体験する | `feature`（または `classic`） | 60〜120分 | 多数（自律モードを使う） |
| 3.4 | 成果物と監査ログを読む | — | 20分 | — |
| 3.5 | チームの流儀を覚えさせる | — | 30分 | — |

**必ず 3.1 → 3.2 → 3.3 の順で進めてください。** 3.3 から入ると用語とゲートの量に押し流されます。

## 使うハーネス

本教材は **Claude Code** を前提に書きます。他のハーネス（Kiro IDE / Kiro CLI / Codex CLI / Cursor / opencode / GitHub Copilot）でも**エンジンは同一**なので、インストール手順と起動コマンドだけ読み替えれば同じことができます。読み替え表は付録Bに置きました。

## 前提条件

| 必要なもの | 確認コマンド | 備考 |
| --- | --- | --- |
| Claude Code | `claude --version` | 未インストールなら下記 |
| bun | `bun --version` | **全ハーネス共通の必須要件** |
| git | `git --version` | Codex CLI ではリポジトリであることが必須 |
| モデルアクセス | — | 公式推奨は Claude Opus 4.8 系。弱いモデルではステージの任意ステップが省略されることがある |

## 手順1：bun のインストール

```bash
# macOS / Linux
curl -fsSL https://bun.sh/install | bash
```

```powershell
# Windows PowerShell
irm bun.sh/install.ps1 | iex
```

### ⚠️ 最初につまずくポイント

bun は **非対話シェルが見る PATH** に載っている必要があります。ハーネスがフックやツールを実行するときに使うのは非対話シェルで、それが読むのは `~/.zshenv`（zsh）や `~/.bashrc`（bash）です。**bun のインストーラは `~/.zshrc` に書きます。**

つまり、

- ターミナルで `which bun` → 通る
- でも AI-DLC が「bun が見つからない」と言う

という状態が起こります。対処は、`BUN_INSTALL` と `PATH` の export を `~/.zshenv`（bash / Git Bash なら `~/.bashrc`）にコピーすることです。

```bash
# ~/.zshrc から該当行を確認して ~/.zshenv にコピーする例
grep -n 'BUN_INSTALL' ~/.zshrc
cat >> ~/.zshenv <<'SH'
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
SH
```

## 手順2：Claude Code のインストール

```bash
# macOS / Linux
curl -fsSL https://claude.ai/install.sh | bash
# または
brew install --cask claude-code
```

```powershell
# Windows PowerShell
irm https://claude.ai/install.ps1 | iex
```

## 手順3：AI-DLC Workflows を取得

```bash
git clone --branch main https://github.com/awslabs/aidlc-workflows.git
cd aidlc-workflows
```

`main` が GA ブランチです。**本番で依存するなら、ここでタグを確認してピン留めしてください**（公式が推奨しています）。

```bash
git tag --list | tail -5
# 例: git checkout v2.7.1
```

## 手順4：練習用プロジェクトへインストール

ハンズオン用のディレクトリを作り、Claude Code 用の配布物をコピーします。

```bash
# aidlc-workflows のリポジトリルートで実行する
mkdir -p ~/work/aidlc-practice

cp -r dist/claude/.claude/ ~/work/aidlc-practice/.claude/
cp -r dist/claude/aidlc/   ~/work/aidlc-practice/aidlc/     # .claude/ の兄弟。中に入れない
cp    dist/claude/.gitignore ~/work/aidlc-practice/.gitignore

cd ~/work/aidlc-practice
git init && git add -A && git commit -m "chore: install AI-DLC workflows"
```

**注意点**

- `aidlc/` は `.claude/` の**中ではなく隣**に置きます。ここを間違えると `--doctor` の「workspace shell ready」チェックが落ちます
- `aidlc/` には `aidlc/spaces/default/memory/` のメソッドツリーが同梱されています。これがないとエンジンが読めません
- 既存プロジェクトに入れる場合、`.gitignore` は**上書きせずマージ**します。`# AI-DLC` から最後までのセクションだけを追記してください

## 手順5：モデルプロバイダーの設定

同梱の `.claude/settings.json` は **AWS Bedrock 前提**（`AWS_REGION=us-east-1`、Fable / Opus / Sonnet / Haiku がピン留め）です。

### A. Bedrock を使う場合

1. AWS アカウントで Anthropic モデルのアクセスを有効化する
2. AWS 認証情報を SDK の認証チェーンに載せる（`aws configure`、環境変数、IAM ロールなど）
3. `AWS_REGION` がモデルを有効化したリージョンと一致していることを確認する

### B. 通常の Claude Code 認証（サブスクリプション / API キー）を使う場合

ハンズオン目的なら、こちらの方が手間が少ないことがあります。`.claude/settings.json` の `env` にある Bedrock 関連の設定（`CLAUDE_CODE_USE_BEDROCK` や `AWS_REGION`、モデルのピン留め）を確認し、**自分の環境に合わせて調整**してください。

```bash
# 現在の設定を確認
cat .claude/settings.json | head -40
```

`.claude/settings.json` は配布物なので、**編集した場合はアップグレード時に差分が出ます**。何を変えたか記録しておくことをおすすめします。

> **確認できないままハンズオンに進まないでください。** モデルアクセスの失敗は `AccessDenied` やモデル未検出エラーとして出ます。この状態でステージを回すと、途中で止まって原因が分かりにくくなります。

## 手順6：起動して健康診断

```bash
cd ~/work/aidlc-practice
claude
```

セッションの中で：

```
/aidlc --doctor
```

チェックされる主な項目：

- bun が非対話シェルから見えるか
- `aidlc/` の workspace shell が揃っているか（`aidlc/spaces/default/memory/`）
- フックが登録されているか
- 状態ファイルと監査ディレクトリの整合性

**全項目が通ってから 3.1 に進んでください。**

### `--doctor` が落ちたときの対処

| 症状 | 対処 |
| --- | --- |
| bun が見つからない | 手順1の PATH 対処（`~/.zshenv`） |
| workspace shell not ready | `aidlc/` を `.claude/` の隣にコピーできているか確認 |
| フックが発火しない | セッションを再起動する（スキル・エージェント・ルールはセッション開始時に読まれる） |
| Bedrock の AccessDenied | 手順5を再確認 |

より詳しい対処は 3.6 にまとめています。

## この章のまとめ

- 3.1 → 3.2 → 3.3 の順で進める
- bun は必須。**非対話シェルの PATH** に載せることが最大の落とし穴
- `aidlc/` は `.claude/` の隣。中に入れない
- 同梱設定は Bedrock 前提。使わないなら `.claude/settings.json` を自分の環境に合わせる
- `/aidlc --doctor` が全部通ってから次へ
