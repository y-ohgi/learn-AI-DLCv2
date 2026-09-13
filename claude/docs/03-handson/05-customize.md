# 3.5 Hands-on 5: チームの流儀を覚えさせる

## 目的

AI-DLC を「自分のチームの方法論」にします。**ここをやらないと、AI-DLC は汎用的な提案しかしません。**

## Step 1：チーム知識を置く

まず、置く場所を確認します。

```bash
cd ~/work/aidlc-practice
ls aidlc/spaces/default/knowledge/ 2>/dev/null || echo "(空 / 未作成)"
```

初期状態は空です。エージェント名のディレクトリを作って、自由形式の Markdown を置きます。

```bash
K=aidlc/spaces/default/knowledge
mkdir -p $K/aidlc-developer-agent $K/aidlc-architect-agent $K/aidlc-quality-agent

cat > $K/aidlc-developer-agent/coding-standards.md <<'MD'
# コーディング規約

## 言語とバージョン
- Python 3.12 / 型ヒント必須（`from __future__ import annotations`）

## ディレクトリ構成
- `src/<package>/` にアプリケーションコード
- `tests/` にテスト。`tests/unit/`、`tests/integration/` に分ける

## エラーハンドリング
- 例外を握りつぶさない。ログに出して再送出するか、明示的に変換する
- HTTP 層では例外をドメイン例外からステータスコードへ1箇所で変換する

## 禁止事項
- 生の SQL 文字列連結（必ずパラメータバインド）
- `print()` によるログ出力（logging を使う）
MD

cat > $K/aidlc-architect-agent/architecture-principles.md <<'MD'
# アーキテクチャ原則

## 採用技術
- RDB: PostgreSQL（14 以上）
- キャッシュ: Redis
- 非同期処理: SQS + Lambda ではなく、まずはアプリ内キューで様子を見る

## 設計原則
- 外部 I/O はインターフェース越しに使う（テスト時に差し替えられること）
- 新しいミドルウェアの導入は ADR を書いてから

## 避けるもの
- マイクロサービス化の早すぎる適用。単一デプロイ単位から始める
MD

cat > $K/aidlc-quality-agent/test-policy.md <<'MD'
# テスト方針

- テストフレームワーク: pytest
- 命名: `test_<対象>_<条件>_<期待結果>`
- 新規コードは分岐カバレッジ 80% 以上
- 外部サービスはスタブ化。ネットワークに出るテストは integration に隔離
MD
```

**知識はスペース単位で共有されます。** 同じ Space の全 Intent で有効です。

> ⚠️ `.claude/agents/*.md` の14ファイルは絶対に編集しないでください。フレームワークのファイルなので、アップグレードで上書きされます。カスタマイズはこの `knowledge/` 側で行います。

## Step 2：ルールを書く

知識が「参照する背景情報」なら、ルールは「常に守るべき規則」です。

```bash
M=aidlc/spaces/default/memory
ls $M
```

`org.md` → `team.md` → `project.md` の3層で解決されます（後者が前者を上書きできる）。

```bash
cat >> $M/team.md <<'MD'

## Forbidden
- PII（メールアドレス、氏名、電話番号）をログに出力すること
- 認証情報をソースコードにハードコードすること
- テストなしで公開 API を変更すること

## Mandated
- 公開 API の変更には OpenAPI 定義の更新を伴うこと
- DB スキーマ変更にはマイグレーションファイルを伴うこと
- 新しい外部依存の追加時は ADR に記録すること
MD
```

**`## Forbidden` / `## Mandated`** がガードレールのセクションです。これらは各ステージに適用されます。

### 知識とルールの使い分け（再確認）

| 指摘の性質 | 置き場所 |
| --- | --- |
| 常に守るべき禁止・必須 | **ルール**（`memory/*.md` の Forbidden / Mandated） |
| 参照すべき背景情報 | **知識**（`knowledge/<agent>/*.md`） |
| 機械的に判定できる品質基準 | **センサー**（`.claude/sensors/`） |
| 一度きりの判断 | 恒久化しない |

## Step 3：学習ループを体験する

**ここが今回の主眼です。**

1. 新しいワークフローを開始します。

```
/aidlc --scope express タグの一覧を返すエンドポイントを追加する
```

2. Code Generation の段階で、**意図的に規約違反を指摘してください。**

```
エラーハンドリングがうちの流儀じゃない。例外を握りつぶさずに、
ドメイン例外に変換して HTTP 層で1箇所でステータスに落とす形にしてほしい
```

3. エージェントが修正します。同時に、コンダクターがこの観察を `memory.md` に記録します。

```bash
INTENT=$(ls -d aidlc/spaces/default/intents/*/ | tail -1)
find "$INTENT" -name 'memory.md' -exec cat {} \;
```

4. **承認ゲートで観察が提示されます。**

```
▸ このステージで得られた学びがあります。恒久化しますか？
  - 「例外を握りつぶさず、ドメイン例外に変換して HTTP 層で1箇所で処理する」
```

5. 恒久化を選ぶと、`project.md` に practice として書かれます。**ワンクリックで `team.md` に昇格**もできます。あるいは**センサーとして scaffold** される場合もあります。

```bash
cat aidlc/spaces/default/memory/project.md
```

### 何が起きたか

**同じ指摘を2回しなくてよくなりました。** これが素の Agent 利用でいちばん疲れる部分（毎セッション同じことを言う）への直接的な回答です。

### 恒久化しすぎない

**すべての指摘を恒久化しないでください。** ルールが増えると：

- コンテキストを食う（毎ステージで読まれる）
- 矛盾する（古いルールと新しいルールがぶつかる）
- 例外だらけになって守られなくなる

**目安：「3回以上言うことになりそうな指摘」だけ恒久化する。**

## Step 4：Practices Discovery で一気に固める

学習ループは「都度」の仕組みですが、**2.2 Practices Discovery は「一括で発見する」ステージ**です。

`classic` / `feature` / `mvp` / `infra` / `enterprise` / `workshop` スコープに含まれます。**既存プロジェクトに AI-DLC を導入するときは、まずこのステージを回すのが最短ルートです。**

```
/aidlc --scope classic <実際の次のタスク>
```

2.2 のインタビューに丁寧に答えると、`team.md` / `project.md` が一気に埋まります。

## Step 5：センサーを確認する

```bash
ls .claude/sensors/
cat .claude/sensors/*.md | head -40
```

同梱のセンサー（linter、type-check など）のマニフェストが見られます。

- Write/Edit の呼び出しに反応、または承認ゲートで成果物ごとに1回実行
- 結果は `SENSOR_*` として監査ログに記録
- **blocking なセンサーの指摘は、修正か明示的な（監査に残る）オーバーライドがないと通れない**

「lint を通せ」「型チェックを通せ」のような**機械的に判定できる指摘は、ルールではなくセンサーにするのが正解**です。ルールは LLM が守るもの（守られないことがある）、センサーは決定論的に検査されるもの（確実）。

## Step 6：git にコミットする

**忘れないでください。** 知識とルールはチームで共有される資産です。

```bash
git add aidlc/spaces/default/knowledge aidlc/spaces/default/memory
git commit -m "docs: add team knowledge and rules for AI-DLC"
```

`.gitignore` の AI-DLC セクションにより、`active-space` や `active-intent`（個人のカーソル）は除外され、知識・ルール・状態・監査・成果物はコミットされます。

## この章のまとめ

- チーム知識は `aidlc/spaces/<space>/knowledge/<agent-name>/` に自由形式で置く。`.claude/agents/` は触らない
- ルールは `memory/` の org → team → project。`## Forbidden` / `## Mandated` を書く
- 学習ループで指摘を恒久化できる。ただし「3回以上言いそうなこと」だけに絞る
- 既存プロジェクト導入時は 2.2 Practices Discovery を丁寧に回すのが最短
- 機械的な品質基準はルールではなくセンサーにする
- 知識・ルールは必ずコミットする
