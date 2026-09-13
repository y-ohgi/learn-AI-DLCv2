# 3.3 Hands-on 3: feature で Units → Construction を体験

## 目的

AI-DLC の**本命の使い方**を体験します。身につけるのは：

1. **2.7 Units Generation** による作業分解と依存 DAG
2. **2.9 Delivery Planning** と Bolt 計画
3. **walking skeleton ゲートと ladder prompt**（自律度の選択）
4. stage-major な歩き方の実感

**ここが AI-DLC を採用するかどうかの判断材料になる章です。**

## 題材

3.1 / 3.2 で作った API を、**複数の Unit に分解される規模**に拡張します。

```
「メモ API を、ユーザーごとにメモを管理でき、タグで検索でき、
 共有リンクを発行できるサービスに拡張する」
```

この規模なら、少なくとも次のような Unit に分解されるはずです。

- ユーザー認証・セッション
- メモの所有権とアクセス制御
- タグ管理
- 検索
- 共有リンク発行

## Step 1：スコープを選ぶ

2つの選択肢があります。

```
# A. classic — Ideation（企画フェーズ）を飛ばす。26/33 ステージ。v1 スタイル
/aidlc --scope classic メモAPIをマルチユーザー化し、タグ検索と共有リンク機能を追加する

# B. feature — 企画から全部。33/33 ステージ、29 ゲート
/aidlc --scope feature メモAPIをマルチユーザー化し、タグ検索と共有リンク機能を追加する
```

**ハンズオンでは `classic` を推奨します。** 理由は、Ideation の7ステージ（市場調査、実現可能性、チーム編成など）は練習題材では実感が湧きにくく、時間だけかかるためです。

ただし **`feature` を選んで Ideation を1度だけ体験しておく価値はあります**。特に 1.1 Intent Capture の「出典タグ」と「前提の明示的確認」は、AI 生成物を扱う上で有用な体験です。時間があるなら `feature`、なければ `classic`。

以下は `classic` で進める前提で書きます。

## Step 2：2.2 Practices Discovery を丁寧にやる

`classic` には Practices Discovery が含まれます。**このステージには時間をかけてください。**

subagent ハブ&スポークで動きます。

```
  リード(pipeline-deploy) が「このチームの実践」の草案を書く
              │
     ┌────────┼────────┐   ← 互いに見えない状態で独立に検査
     ▼        ▼        ▼
  quality  developer  devsecops
     └────────┼────────┘
              ▼
       人間へのインタビュー（← あなたが答える）
              ▼
        リードが統合
              ▼
   team.md / project.md へ昇格
```

インタビューでは、こうしたことを聞かれます。

- テストはどう書いているか（フレームワーク、命名、配置）
- エラーハンドリングの流儀
- 依存の追加ルール
- ブランチ戦略、コミットメッセージ規約
- デプロイの実態

**ここで答えた内容が `aidlc/spaces/default/memory/team.md` や `project.md` に昇格します。** つまり**以降のすべてのステージと、将来のすべての Intent に効く**。ここが AI-DLC の投資回収ポイントです。

承認後に確認してください。

```bash
cat ~/work/aidlc-practice/aidlc/spaces/default/memory/project.md
cat ~/work/aidlc-practice/aidlc/spaces/default/memory/team.md
```

## Step 3：2.4 User Stories で mob トポロジーを見る

**唯一の mob ステージ**です。

- リード（product）が草案を書く
- design / developer / quality が**並行して寄稿ファイルを書く**
- リードが統合する
- 判断が必要な論点は人間に上がってくる

観察してほしいのは、**寄稿ファイルが実際にディスクに書かれる**ことです。

```bash
find ~/work/aidlc-practice/aidlc -name '*contribution*' -o -name 'contributions' -type d
```

v1 の「Mob Elaboration」という儀式が、v2 では**並行サブエージェント＋寄稿ファイル＋リードによる統合**として実装されています。人間の Mob セッションを模したものです。

## Step 4：2.7 Units Generation — ここが山場

**AI-DLC でいちばん重要な成果物が出ます。**

```bash
INTENT=$(ls -d ~/work/aidlc-practice/aidlc/spaces/default/intents/*/ | tail -1)
cat "$INTENT"inception/unit-of-work.md
cat "$INTENT"inception/unit-of-work-dependency.md
cat "$INTENT"inception/unit-of-work-story-map.md
```

### 精読すべき理由

`unit-of-work-dependency.md` の DAG が、**Construction の実行順序と並行可能性を決めます**。ここが間違っていると：

- 依存が抜けていれば → 前提のないコードが生成されて失敗する
- 依存が過剰なら → 並行できるはずの Unit が直列になって遅くなる
- 粒度が大きすぎれば → レビュー不能な差分に戻る
- 粒度が小さすぎれば → ゲートの回数が爆発する

### チェックリスト

- [ ] Unit の数は妥当か（この題材なら 4〜6 程度）
- [ ] 各 Unit は**独立してレビュー可能**なサイズか
- [ ] 依存関係が実際の技術的制約と合っているか（認証は所有権制御より先、など）
- [ ] 並行できる Unit が並行として表現されているか
- [ ] どの Unit も「1つの Unit で数千行」にならないか

**遠慮なく `Request Changes` してください。** 「タグ管理と検索は分けずに1つにしてほしい」「共有リンクは認証に依存させて」といった指示で組み替えられます。

**このゲートは AI-DLC の中で最も精読の価値が高いゲートです。**

## Step 5：2.9 Delivery Planning と bolt-plan.md の位置づけ

```bash
cat "$INTENT"inception/bolt-plan.md
cat "$INTENT"inception/risk-and-sequencing-rationale.md
```

`bolt-plan.md` には Bolt のグルーピング、Definition of Done、confidence hypothesis、オーナーシップが書かれます。

> **⚠️ 重要な注意** — `bolt-plan.md` は**計画のドキュメントです**。既定の stage-major な実行では、**エンジンは Unit のグルーピングや順序にこれを使いません**。実行時のバッチは `unit-of-work-dependency.md`（2.7 の DAG）から決まります。
>
> v1 由来の「Bolt 単位で回る」という説明を読んでいると混乱するポイントなので、ここを押さえておいてください。

`risk-and-sequencing-rationale.md` は**後から読む価値が高い成果物**です。「なぜこの順序なのか」が書かれています。

## Step 6：Construction — walking skeleton ゲート

Construction に入ると、**既定は stage-major** です。

```
3.1 Functional Design を Unit A,B,C,D すべてに実行
        │
        ▼
   ★ walking skeleton ゲート（最初の Construction 実行ステージのゲート）
        │
        ▼
   ★ ladder prompt（1回だけ）
```

### walking skeleton ゲート

**このゲートは絶対に精読してください。** 端から端まで通る最小スライスの設計が、以降のすべての土台になります。

### ladder prompt

```
▸ 以降の Construction をどう進めますか？
  (1) 自律的に続ける（残りのステージゲートをスキップ）
  (2) 残りのステージすべてでゲートする
```

**ハンズオンでは (1) 自律モードを試してください。** 理由は2つ：

1. (2) を選ぶとゲートが多すぎて練習にならない
2. 自律モードでも**失敗は必ず止まる**ことを体験できる

選択は `aidlc-state.md` の `Construction Autonomy Mode` に記録され、**セッションを再開しても維持されます**。

```bash
grep -i 'autonomy' "$INTENT"aidlc-state.md
```

### 実務での判断

| 状況 | 選ぶべき |
| --- | --- |
| walking skeleton の品質が高く、Unit 分解に自信がある | 自律 |
| RE の結果に不安がある、既存システムが複雑 | ゲート |
| 規制対象・監査要件がある | ゲート |
| 1人で試している、失敗しても捨てられる | 自律 |

## Step 7：3.5 Code Generation と並行実行

依存の前提が同じで互いに依存しない Unit は**バッチ**になり、並行して Code Generation されます（自律モード時は git worktree で隔離）。

```
      Unit A（認証）
          │
    ┌─────┴─────┐   ← B と C は並行可能
    ▼           ▼
  Unit B      Unit C
（所有権）    （タグ）
    └─────┬─────┘
          ▼
   1回の Code Generation ステージゲート
   （最終 DAG バッチの収束後）
```

**自律 swarm では、中間バッチごとにゲートは出ません。** 最終バッチが収束した後に**1回**のステージゲートです。

### 失敗を体験する

もし途中で失敗したら（あるいは意図的に失敗させたら）、次が聞かれます。

```
  retry — その Unit だけ再実行
  skip  — [S] にして続行（依存する Unit もおそらく失敗する）
  abort — 中断
```

**バッチの一部が失敗した場合**、バッチ全体の完了を待ち、成功した Unit の成果物をディスクに保持したうえで、失敗した Unit についてだけこの選択を聞かれます。**成功分が無駄にならない**設計です。

## Step 8：3.6 Build and Test → 3.7 CI Pipeline

この2つは **全 Unit の完了後に1回だけ**走ります（Unit ごとではありません）。

- 3.6 でテストが横断的に実行される
- 3.7 で CI 設定と品質ゲートが生成される

```bash
cat ~/work/aidlc-practice/.github/workflows/*.yml 2>/dev/null || ls ~/work/aidlc-practice
```

## Step 9：振り返り — 元は取れたか

```
/aidlc --status
```

そして自問してください。

1. **何回判断したか？** 監査ログの `HUMAN_TURN` と `GATE_APPROVED` の数を数えると分かります（3.4 で方法を扱います）
2. **Units Generation の分解は妥当だったか？** 実装してみて「分け方が違った」と感じたか
3. **同じことを素の Agent でやったら、何時間かかり、何行の差分になったか？**
4. **生成された成果物のうち、3ヶ月後に読み返すものはどれか？**

4つ目が本質的な問いです。**「読み返すものが1つもない」なら、そのタスクに AI-DLC は重すぎました。**

## この章のまとめ

- `classic`（26ステージ）が実務の主力。`feature`（33/29ゲート）は企画から必要なときだけ
- 2.2 Practices Discovery でチームの流儀が `memory/` に昇格する。投資回収ポイント
- 2.4 User Stories は唯一の mob ステージ。寄稿ファイルが実際に書かれる
- **2.7 Units Generation の DAG が実行を決める。最も精読すべきゲート**
- `bolt-plan.md` は計画。実行時のバッチは `unit-of-work-dependency.md` から決まる
- walking skeleton ゲートは精読、直後の ladder prompt で自律度を選ぶ
- 自律モードでも失敗は必ず止まり、retry / skip / abort を聞かれる
