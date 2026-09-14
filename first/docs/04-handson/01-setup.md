# 4.1 環境準備

この章から手を動かします。第 3 部で仕組みを見てきた AI-DLC 2.8.2 を、あなたの端末に「版を固定して」導入し、`aidlc version` で確かめるところまでを扱います。インストーラの逐語コマンドをそのまま流すのではなく、一度ダウンロードして中身を読み、それから実行する、という型で進めます。次の 4.2 で、空のプロジェクトに設定を入れて最初のワークフローを始めます。

## この章で学ぶこと

- 自分の環境に AI-DLC 2.8.2 を版固定で導入し、`aidlc version` で確認できる。
- `install.sh` が何をどこに書くかを読み、`sudo` 不要・HTTPS のみといった安全上の前提を説明できる。
- Claude Code の既定プロバイダが Amazon Bedrock である理由と、別プロバイダを使う場合の手順を説明できる。

## 前提を確かめる

この本のハンズオンは Claude Code をハーネスとして進めます。始める前に、次の 4 点が揃っていることを確かめてください。

- **Claude Code がインストール済みで、認証が済んでいる。** AI-DLC のランタイム自体は Git・Bun・Node.js を要求しませんが、ホストであるハーネス側の要件はそのまま残ります。
- **ターミナルと `curl`。** インストーラはオンラインでは `curl` または `wget` を、常に `sha256sum` または `shasum` を必要とします。
- **`git`。** 4.2 で作るプロジェクトを後で管理するために使います（AI-DLC 自体の必須要件ではありません）。
- **Linux / macOS / WSL のいずれか。** リリースは macOS の x64 と arm64、Linux の x64 と arm64（glibc と musl）、Windows x64 を対象にしています。本章では Unix 系のシェルインストーラだけを扱います。

AI-DLC が対応するハーネスは Claude Code だけではなく、Kiro CLI、Kiro IDE、Codex CLI、Cursor、opencode、GitHub Copilot の 7 種類があり、ハーネスごとに「最初に済ませておくこと」（サインインやフック信頼の承認）が異なります。本書は Claude Code に絞ります。

## インストーラを読んでから実行する

一次情報のクイックスタートに載っている逐語コマンドは次の 1 行です。これは常に最新版を入れます。

```text
curl -fsSL https://github.com/awslabs/aidlc-workflows/releases/latest/download/install.sh | sh
```

本書ではこの型をそのままは使いません。理由は 2 つあります。第一に、本書の事実はすべて 2.8.2 で裏取りしているので、読者の手元も 2.8.2 に揃えたい。第二に、リモートのスクリプトをパイプで直接シェルに渡す前に、中身を一度読む習慣をつけたい。そこで「ダウンロード → 内容確認 → `--version 2.8.2` で実行 → `aidlc version` で検証」の 4 段で進めます。

まず作業用のディレクトリを作り、2.8.2 のリリースからインストーラをファイルとして取得します。

```bash
mkdir -p aidlc-install && cd aidlc-install
curl -fsSL -o install.sh https://github.com/awslabs/aidlc-workflows/releases/download/v2.8.2/install.sh
head -n 40 install.sh
```

`head` で先頭 40 行を眺めるだけでも、`RELEASE_REPOSITORY` の既定が `awslabs/aidlc-workflows`、ダウンロード元 `BASE_URL` がその GitHub Releases であること、そしてこのスクリプトが `set -eu` で動くことが読み取れます。時間があれば全体を読んでください。スクリプトは約 500 行で、次のような順序で動きます。

1. 引数を解釈する。`--version`、`--from`、`--offline`、`--profile`、`--json`、`--quiet`、`--yes` などを受け付け、未知の引数は usage を出して終了する。
2. **root で実行されていれば拒否する**（`refusing a root install; run as the target user`）。
3. リリース URL が HTTPS であること、資格情報やクエリを含まないことを確かめる。
4. `version.json`、`checksums.txt`、`aidlc-release.intoto.jsonl` をダウンロードし、`version.json` の SHA-256 を `checksums.txt` と照合する。GitHub CLI（`gh`）が対応版であれば署名付き attestation も検証し、無ければ `WARN` を出してチェックサム検証だけで続ける。
5. `--version` で指定した版と `version.json` の版が食い違えば `release endpoint returned … , not requested …` で失敗する。
6. OS とアーキテクチャに合ったバイナリ `aidlc-<os>-<arch>` とランタイム `aidlc-runtime-<version>.tar.gz` をダウンロードし、それぞれチェックサムを照合してから配置する。
7. `aidlc` コマンドを `$HOME/.local/bin/aidlc` に置き、`PATH` に無ければ追加するためのコマンドを表示する。

ここから安全上の含意を 3 点にまとめると、**`sudo` は付けない（インストールはユーザー単位で、root は拒否される）、通信は HTTPS のみ（それ以外の URL は拒否される）、URL のホストが `github.com/awslabs/aidlc-workflows` であることを目で確認する**、です。インストーラはシェルの起動ファイルを勝手に編集しません。`--profile <絶対パス>` を明示したときだけ、その 1 ファイルに `BEGIN AI-DLC:PATH` ブロックを書きます。

内容を確かめたら、版を固定して実行します。

```bash
sh install.sh --version 2.8.2
```

成功すると人間向けモードでは次のように表示されます（`~` はあなたのホームディレクトリです）。

```text
Downloaded version.json
Downloaded checksums.txt
Downloaded aidlc-release.intoto.jsonl
WARN GitHub CLI attestation verification is unavailable; continuing with SHA-256 release checksums.
Downloaded aidlc-linux-x64
Downloaded aidlc-runtime-2.8.2.tar.gz
PASS installed AI-DLC 2.8.2 with all harness runtimes
Add AI-DLC to PATH for this shell:
  export PATH="~/.local/bin:$PATH"
Then run: aidlc config
```

`WARN` の行は `gh` が無い、または attestation の検証に必要なフラグを持たない版のときに出ます。チェックサム検証は常に必須なので、この警告だけならインストールは正常です。`PASS installed AI-DLC 2.8.2 with all harness runtimes` の行が版固定の成功を示します。7 つのハーネス分のランタイムが一度に入るため、インストール時にハーネスを尋ねられることはありません。

> **補足** — 版・チェックサム・配置先の実体は `${XDG_DATA_HOME:-$HOME/.local/share}/aidlc/versions/` 配下にあり、`$HOME/.local/bin/aidlc` はそこにある有効な版を指すランチャーです。後で `aidlc update` や `aidlc use <version>` で切り替えても、このランチャーの位置は変わりません。

## インストール結果を確認する

インストーラが表示したとおり、`~/.local/bin` を `PATH` に加えてから `aidlc version` を実行します。

```bash
export PATH="$HOME/.local/bin:$PATH"
aidlc version
aidlc version | grep -F 'aidlc 2.8.2 (runtime 2.8.2)'
```

期待する出力は次の 1 行です。左がネイティブバイナリの版、括弧内がハーネス用ランタイムの版で、両方が 2.8.2 であればこの章の到達点です。

```text
aidlc 2.8.2 (runtime 2.8.2)
```

最後の `grep` は、この本のビルド検査が同じ手順を機械的に再現するための確認行です。あなたが手で進めるときは `aidlc version` の表示を目で確かめれば十分です。

`export PATH=…` は今開いているシェルにだけ効きます。新しいシェルでも `aidlc` を使えるようにするには、`~/.bashrc` や `~/.zshrc` に同じ 1 行を追記してください（インストーラの `--profile` オプションでも同じことができます）。

```bash
cd ..
```

作業ディレクトリを抜けておきます。ダウンロードした `install.sh` は残しておいても害はありません。

## Amazon Bedrock が既定であること

Claude Code 向けの配布物は、Amazon Bedrock（AWS 上で Anthropic のモデルを呼び出すサービス）をプロバイダとして使う設定で出荷されています。4.2 で `aidlc config` が生成する `.claude/settings.json` には、`CLAUDE_CODE_USE_BEDROCK` を `1` に、`AWS_REGION` を `us-east-1` に、そして Fable / Opus / Sonnet / Haiku の各エイリアスを Bedrock のグローバル推論プロファイル ID に対応づける環境変数が入っています。

なぜ Bedrock が既定なのか。一次情報は「コンダクターと、階層を固定した各サブエージェントの間で、予測できるランタイムの基準線が必要だから」と説明します。Bedrock なら正確な推論プロファイルとコンテキストの変種を固定でき、マシンごとにモデルの別名が黙って違うものを指す事態を避けられる。さらに AWS SDK の標準的な資格情報チェーンと IAM を使うので、プロバイダの鍵をプロジェクトにコミットする必要がない。これは**配布物の既定であって方法論の要件ではなく**、AI-DLC 自体は Bedrock の API を直接呼ばず、プロバイダに依存しません。

Bedrock を使う場合は、最初に Claude Code を起動する前に次を済ませます。

1. Amazon Bedrock のモデルカタログで、設定済みの Anthropic モデルへのアクセスを有効にする。
2. `aws configure` や `aws sso login --profile <profile>` など、通常の SDK 資格情報チェーンで AWS の資格情報を用意する。
3. それらのモデルが使えるリージョンを使う（出荷時の既定は `us-east-1`）。
4. `claude` を起動し、プロバイダの選択で Amazon Bedrock を選ぶ。後から `/setup-bedrock` で変更できる。

Bedrock を使わず、Claude Code が対応する別のプロバイダ（Anthropic の API など）を使う場合の手順は次のとおりです。

1. `.claude/settings.json` の Bedrock 向け環境変数の対応を外すか置き換える。共有ファイルを直接編集したくなければ、より優先度の高い `.claude/settings.local.json` で上書きする（このファイルは `.gitignore` 済みで、`aidlc config` が `.claude/settings.local.json.example` という雛形を置きます）。
2. そのプロバイダの Claude Code 側の認証フローを完了する。

どちらの場合も、資格情報や個人の上書きは共有の `.claude/settings.json` には書かず、`.claude/settings.local.json` か AWS の標準の資格情報ファイルに置いてください。

> **注意** — 本書の再現検査（NFR1）は Bedrock の資格情報を持たない環境で走らせています。この章と 4.2 の `bash` の手順は資格情報なしで通りますが、実際に Claude Code でワークフローを進めるにはいずれかのプロバイダの認証が必要です。

## つまずきポイント

- **root で `install.sh` が拒否される。** `refusing a root install; run as the target user` と出て終了コード 4 で止まります。`sudo sh install.sh` は誤りで、`aidlc` を使うユーザー本人として実行してください。コンテナなどで root しか無い場合は、一般ユーザーを作ってそのユーザーで実行します。
- **`command not found: aidlc`。** `~/.local/bin` が `PATH` に無いのが原因です。インストーラが表示した `export PATH="$HOME/.local/bin:$PATH"` を実行し、新しいシェルでも使うなら起動ファイルに追記します。
- **`invalid --version`。** `--version` の値は `x.y.z`（またはプレビュー版の `x.y.z-preview.YYYYMMDD.N`）の形でなければならず、`v2.8.2` のように `v` を付けると拒否されます。
- **`WARN GitHub CLI attestation verification is unavailable`。** エラーではありません。`gh` が対応版であれば署名検証が追加されますが、無くてもチェックサム検証は必ず行われます。
- **`download failed`。** プロキシ配下や独自 CA の環境では `--ca-bundle <絶対パス>` を付けるか、環境変数 `AIDLC_CA_BUNDLE` で CA バンドルを指定します。

## まとめ

- `install.sh` を 2.8.2 のリリースからダウンロードして読み、`--version 2.8.2` で実行し、`aidlc version` が `aidlc 2.8.2 (runtime 2.8.2)` を返せば導入は完了である。
- インストーラはユーザー単位で動き（root を拒否）、HTTPS のみで配布物を取得し、チェックサムと版の一致を検証してから `~/.local/bin/aidlc` を置く。`sudo` は不要で、URL のホストは自分の目で確かめる。
- Claude Code 向け配布物の既定プロバイダは Amazon Bedrock だが、これは配布物の既定であって方法論の要件ではない。別プロバイダを使うなら Bedrock の環境変数の対応を外す（または `.claude/settings.local.json` で上書きする）か、そのプロバイダの認証フローを完了する。

## 出典

- [2.8.2] `docs/guide/01-getting-started.md` § 1. Install AI-DLC — 逐語のクイックスタートコマンド `curl -fsSL … | sh` と、インストーラが `aidlc` コマンドと全ハーネスのランタイムを追加すること
- [2.8.2] `docs/guide/01-getting-started.md` § Harness Prerequisites — ハーネスを先にインストールし認証しておくこと、ランタイム自体は Git・Bun・Node.js を要求しないこと、7 種類のハーネスとそれぞれの初回要件
- [2.8.2] `docs/guide/01-getting-started.md` § AWS Bedrock Setup — Bedrock が既定である理由、配布物の既定であって方法論の要件ではないこと、Bedrock を使う 4 手順、別プロバイダに切り替える手順、`settings.json` に書かれる環境変数の一覧、資格情報を `settings.local.json` に置くこと
- [2.8.2] `docs/guide/18-install-and-lifecycle.md` § Install — 対応 OS とアーキテクチャ、Unix インストーラが root を拒否すること、`sudo` 不要でユーザー単位のインストールであること
- [2.8.2] `docs/guide/18-install-and-lifecycle.md` § macOS and Linux — `curl` または `wget` と `sha256sum` または `shasum` の要件、`gh` が任意であること、`versions/` 配下への配置と `$HOME/.local/bin/aidlc` のリンク、シェル起動ファイルを `--profile` なしでは編集しないこと
- [2.8.2] `docs/guide/18-install-and-lifecycle.md` § Installer Options — `--version`、`--ca-bundle`、`--profile`、`--yes`、`--quiet`、`--json` の意味と、`AIDLC_CA_BUNDLE` が既定値を与えること
- [2.8.2] `docs/guide/18-install-and-lifecycle.md` § Release Authentication — `version.json`・`checksums.txt`・`aidlc-release.intoto.jsonl` の取得、チェックサム検証、明示した版との不一致の拒否、attestation 検証が任意であること
- [2.8.2] `docs/guide/18-install-and-lifecycle.md` § Automation — インストール時にハーネスを尋ねず、全ハーネスのランタイムを入れること
- [2.8.2] `scripts/install.sh` `usage_text` — 受け付けるフラグの一覧
- [2.8.2] `scripts/install.sh` `VERSION_PATTERN` — `--version` の値が `x.y.z` またはプレビュー id の形であること（`v` 付きは拒否）
- [2.8.2] `scripts/install.sh` `fail 4 failed "refusing a root install; run as the target user"` — root 実行の拒否と終了コード 4
- [2.8.2] `scripts/install.sh` `release URL must use HTTPS` — リリース URL が HTTPS 以外なら拒否すること、資格情報やクエリを含む URL の拒否
- [2.8.2] `scripts/install.sh` `PROVENANCE_VERIFIER_AVAILABLE` — `gh` が無いときの `WARN GitHub CLI attestation verification is unavailable` とチェックサム検証への継続
- [2.8.2] `scripts/install.sh` `release endpoint returned` — 指定した版と `version.json` の版が食い違うときの失敗
- [2.8.2] `scripts/install.sh` `BIN_DIR` — 既定の配置先 `$HOME/.local/bin` と `INSTALL_ROOT` の `${XDG_DATA_HOME:-$HOME/.local/share}/aidlc`
- [2.8.2] `scripts/install.sh` `path_command` — `PASS installed AI-DLC … with all harness runtimes` の表示と、`PATH` に無いときの `export PATH=…` の案内、`Then run: aidlc config`
- [2.8.2] `scripts/install.sh` `download` — `--ca-bundle` 指定時の `curl --cacert`、失敗時の `download failed` メッセージ
- [2.8.2] `docs/guide/15-troubleshooting.md` § Native Install Channel — `command not found: aidlc` の対処（`PATH` に `$HOME/.local/bin` を加える）
- [runtime] `first/.claude/settings.local.json.example` — `aidlc config` が個人上書き用の雛形を置くこと
- [runtime] `first/.claude/CLAUDE.md` § Prerequisites — 出荷時の `.claude/settings.json` が Bedrock の `AWS_REGION` と各モデル ID を固定していること、`settings.local.json` で上書きすること
