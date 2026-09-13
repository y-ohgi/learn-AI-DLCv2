# 3.1 Hands-on 1: express で最短一周

## 目的

**10ステージ・最小深度**で AI-DLC を端から端まで1回通します。ここで身につけるのは次の3つです。

1. `/aidlc` の起動とスコープ確認の読み方
2. 質問ファイルと3つの対話モード
3. 承認ゲートの操作

**成果物の量が少ないので、全体の形が見えます。** 最初にやるべきハンズオンです。

## 題材

「メモを1件ずつ登録・一覧できる小さな HTTP API」を作ります。言語は自由ですが、環境構築の手間が少ないもの（Python + FastAPI、Node.js + Hono など）を推奨します。

## Step 1：起動

```bash
cd ~/work/aidlc-practice
claude
```

セッション内で：

```
/aidlc --scope express メモを登録・一覧できる最小のHTTP APIを作る
```

`--scope express` と明示しています。自動検出に任せると、この文章は「長い説明」と判定されてコンポーザー提案に入る可能性があるためです。

## Step 2：スコープ確認を読む

次のような確認が1行で出ます。

```
Starting an "express" workflow for: "メモを登録・一覧できる最小のHTTP APIを作る"
- 10 of 33 stages, N approval gates. Confirm to proceed, name a different scope,
or say "compose" for a tailored plan.
```

**ここで必ず確認すること**

- ステージ数（10）
- **承認ゲート数** ← これから何回判断を求められるかの予告
- スコープ名が意図と合っているか

数値は推定ではなく、コンパイル済みのスコープグリッドとワークスペーススキャンから計算された実数です。合っていれば承認します。

## Step 3：Initialization（自動、ゲートなし）

0.1〜0.3 が1秒未満で走ります。

- Intent の記録ディレクトリ（`aidlc/spaces/default/intents/<YYMMDD>-<ラベル>/`）が作られる
- ワークスペースが検出される（この場合、空なので **greenfield**）
- `aidlc-state.md` と `audit/` が作られる

**別のターミナルで覗いてみてください。**

```bash
ls -R ~/work/aidlc-practice/aidlc/spaces/default/intents/
cat ~/work/aidlc-practice/aidlc/spaces/default/intents/*/aidlc-state.md
```

`aidlc-state.md` に 10 ステージ分のチェックボックスが並んでいるのが見えます。greenfield なので **2.1 Reverse Engineering は条件を満たさずスキップ**されます（`[S]` になるか、そもそも計画から外れます）。

## Step 4：2.3 Requirements Analysis — 質問ファイルを体験する

express で最初に人間と対話するステージです。対話モードを聞かれます。

```
▸ Choose interaction mode:
  (1) Guide Me   (2) Edit File   (3) Chat
```

**1回目は必ず `Guide Me` を選んでください。** AI-DLC の「AI が先に質問する」性質が最も分かりやすく体験できます。

出てくる質問はたとえばこんな種類です。

- 永続化は何を使うか（インメモリ / SQLite / PostgreSQL / その他）
- 認証は必要か
- メモのフィールドは何か（本文だけ / タイトル＋本文 / タグ）
- 一覧のページングは必要か
- エラーレスポンスの形式

**注目してほしい点**：これらは**あなたが最初の指示で書かなかったこと**です。素の Agent なら勝手に決めていた項目が、質問として明示されています。**これが AI-DLC の第一の価値**です。

回答は質問ファイルに記録されます。別のターミナルで確認できます。

```bash
find ~/work/aidlc-practice/aidlc -name 'questions.md' | head
cat $(find ~/work/aidlc-practice/aidlc -name 'questions.md' | head -1)
```

### 練習：モードを切り替える

質問の途中で「Edit File に切り替えたい」と言ってみてください。質問ファイルが提示され、直接埋められるようになります。**進捗は失われません**（すでに答えた内容はファイルに残っています）。

## Step 5：承認ゲートを操作する

要件がまとまるとゲートが出ます。

```
▸ How would you like to proceed?
  (1) Approve — Continue to Code Generation
  (2) Request Changes
```

**ここで一度、意図的に `Request Changes` を選んでください。** 学びのためです。

例：「永続化はインメモリでいいが、後で差し替えられるようにリポジトリ層を分離してほしい」

エージェントが `requirements.md` を修正し、ゲートを再提示します。今度は Approve します。

**確認**：`Continue to Code Generation` と表示されていることに注目してください。express は設計ステージを飛ばすので、要件の次はコード生成です。エンジンが計算した実際の次ステージが出ています。

## Step 6：3.5 Code Generation

コードが生成されます。express は Units Generation を実行しないので、**Unit 分解なしの単一パス**です。

生成後にゲートが出ます。ここは**必ず差分を読んでください**。

```bash
cd ~/work/aidlc-practice && git status && git diff
```

読むポイント：

- Step 4 で答えた内容が反映されているか（インメモリ？ フィールド？ エラー形式？）
- Step 5 の差し戻しが反映されているか（リポジトリ層が分離されているか）

**要件の回答が実装に届いているかを確認する**のが、このゲートの意味です。

## Step 7：3.6 Build and Test

quality エージェントがテストを生成し、実行します。express の既定テスト戦略は Minimal なので、基本的なケースだけです。

失敗した場合、エージェントが修正します。**ここでセンサー（lint / 型チェック）が発火することがあります。** 発火したら監査ログを見てみてください（3.4 で詳しく扱います）。

## Step 8：Operation の条件付きステージ

express には 4.1 Deployment Pipeline / 4.3 Deployment Execution / 4.4 Observability Setup が条件付きで含まれます。

**実際にデプロイする気がないなら、ここは正直にそう伝えてください。**

```
デプロイ先はまだ決まっていないので、パイプラインの設計だけドキュメントに残して、
実際のデプロイ実行はスキップしたい
```

条件付きステージなので、条件を満たさなければスキップされます。あるいは 2.6 で学んだ再構成を使う手もあります。

```
/aidlc compose
```

未実行のステージだけを組み替える提案が出ます。**走行中に方針を変えられる**ことを体験しておくと、実務で効きます。

## Step 9：振り返り

ワークフロー完了後、次を確認してください。

```bash
cd ~/work/aidlc-practice

# 状態ファイル：全ステージのチェックボックスが [x] か [S] になっている
cat aidlc/spaces/default/intents/*/aidlc-state.md

# 生成された成果物の一覧
find aidlc/spaces/default/intents -name '*.md' | sort

# ステータス確認
```

セッション内で：

```
/aidlc --status
```

### 自問してほしいこと

1. **素の Agent に同じ指示を出したら、何が違っただろうか？**
   → おそらく質問されずに実装が始まり、永続化やエラー形式は AI が勝手に決めていた
2. **10ステージは重かったか、軽かったか？**
   → この規模では「ちょうど」か「やや重い」が正直な感想だと思います。それが正しい感覚です
3. **どの成果物を後で読み返す価値があるか？**
   → `questions.md`（決定の記録）と `requirements.md` でしょう

## この章のまとめ

- `/aidlc --scope express <説明>` で最短経路のワークフローが始まる
- スコープ確認行でステージ数とゲート数を必ず確認する
- 対話モードは3つ。すべて質問ファイルに収束し、途中で切り替えられる
- ゲートで `Request Changes` を1回試すと、差し戻しの挙動が体感できる
- 走行中に `/aidlc compose` で未実行ステージを組み替えられる

次は、既存コードに対して AI-DLC を使う体験をします。
