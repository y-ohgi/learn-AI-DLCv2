# 2.9 成果物・状態・監査ログ

AI-DLC が生み出すものはコードだけではありません。**むしろ量としてはドキュメントの方が多い**。それを「資産」にするか「読まれない書類の山」にするかが導入の成否を決めます。

## 記録ディレクトリの構造

1つの Intent（取り組み）に対して1つのディレクトリができます。

```
aidlc/spaces/default/intents/260907-inventory-api/
├── aidlc-state.md          # ワークフロー状態（6状態チェックボックス）
├── runtime-graph.json      # 実行された実績のグラフ
├── audit/
│   └── <host>-<clone>.md   # 監査ログ（シャード）
├── ideation/
│   └── <stage>/
│       ├── questions.md    # 質問と回答（決定の正式な記録）
│       └── memory.md       # ステージ中の観察ダイアリー
├── inception/
│   ├── requirements.md
│   ├── stories.md
│   ├── personas.md
│   ├── components.md
│   ├── decisions.md                    # ADR
│   ├── unit-of-work.md
│   ├── unit-of-work-dependency.md      # ★ 実行順序を決める DAG
│   ├── unit-of-work-story-map.md
│   ├── contract-summary.md
│   ├── bolt-plan.md                    # 計画（実行には使われない）
│   ├── team-allocation.md
│   └── risk-and-sequencing-rationale.md
└── construction/
    └── <unit>/
        ├── entities.md
        ├── rules.md
        └── functional-spec.md
```

### git 管理の分割

`.gitignore` には AI-DLC のセクションが用意されていて、コミットするものとしないものが分かれています。

| コミットする（共有される記録） | コミットしない（ユーザー個別・マシンローカル） |
| --- | --- |
| メソッドメモリ（`memory/`） | `aidlc/active-space`（今どのスペースにいるか） |
| 状態（`aidlc-state.md`） | `aidlc/spaces/*/intents/active-intent` |
| 監査シャード（`audit/`） | マシンローカルなランタイム |
| 成果物 | |

**設計意図が明確です**：決定と履歴はチームで共有し、「自分がいまどこを見ているか」というカーソルは共有しない。

## memory.md — ステージ中の観察ダイアリー

各ステージには `memory.md` が作られます。エンジンが run-stage directive を出すときに作成し、コンダクターが維持します（**手編集しない**）。

記録される内容：

- **Interpretations**（解釈：曖昧な指示をどう解釈したか）
- **Deviations**（逸脱：標準からどう外れたか）
- **Tradeoffs**（トレードオフ：何を捨てたか）
- **Open questions**（未解決の問い）

これが **2.10 で説明する学習ループの入力**になります。承認ゲートで内容が提示され、どれを恒久化するか選べます。

**この「AI が自分の解釈と逸脱を記録する」設計は、AI-DLC の中でも特に有用な部分**だと考えています。レビュー時に「なぜこうなったか」を推測せずに読めるからです。

## 監査ログ — 91種類のイベント型

`audit/` に**追記専用**で書かれる ISO タイムスタンプ付きのイベントログです。ホスト・クローンごとのシャード（`<host>-<clone>.md`）に書かれ、読む側が glob してタイムスタンプでマージします。

主なイベント（一部）：

| イベント | 意味 |
| --- | --- |
| `HUMAN_TURN` | 人間が対話した（承認の前提条件） |
| `STAGE_AWAITING_APPROVAL` | ゲートが開いた |
| `GATE_APPROVED` / `GATE_REJECTED` | 承認／差し戻し |
| `SENSOR_*` | センサーの実行結果 |
| `BOLT_STARTED` / `BOLT_COMPLETED` | Unit/worktree ごとの Bolt（swarm パスのみ） |
| `SWARM_COMPLETED` | 並行バッチの終了 |
| `RECOMPOSED` | ステージプランの再構成 |

用途は「Intent から本番までの完全なトレーサビリティ」です。規制産業で AI 生成コードを使う場合、**「誰がいつ何を承認したか」を示せることが要件になる**ことがあり、それに応える設計です。

### runtime-graph.json

承認ゲートごとに監査ログから生成される、実行実績のミラーです。どのステージが走ったか、どの Bolt が分岐したか、どのセンサーが発火したか、`memory.md` のエントリ数まで記録されます。
`--doctor` と学習ループが読むのはこれです。

## セッション再開

長い作業が1セッションで終わらないのは当然です。v2 は次をサポートします。

| 操作 | 内容 |
| --- | --- |
| resume | チェックポイントから継続 |
| redo | 直前のステージをやり直す |
| jump | 任意のステージ／フェーズへ移動（`/aidlc --stage <slug>`、`--phase <name>`） |
| fresh | 最初から |

コンパクション（コンテキスト圧縮）が起きても、`aidlc-state.md` と `.aidlc-recovery.md` から状態が復元されます。

## 成果物を負債にしないために

ここは教材としての注意点です。33 ステージを Comprehensive 深度で回すと、**数十のドキュメントが生成されます**。放置すればコードと乖離して害になります。

実務上の指針：

1. **深度を上げるのは、そのドキュメントを読む人が実在するときだけ**。監査要件があるなら Comprehensive、無いなら Standard か Minimal
2. **`decisions.md`（ADR）と `unit-of-work-dependency.md` は特に価値が高い**。設計判断と分解の根拠は後から再構成できないため
3. **`bolt-plan.md` は計画ドキュメントであり実行には使われない**。ここを実行の真実だと誤解しない
4. **成果物は git にコミットする**。そうしないと、そもそも記録として機能しない
5. **PR に成果物の差分を含める**。レビュアーが「何を意図した変更か」を読める

## この章のまとめ

- Intent ごとの記録ディレクトリに、状態・成果物・監査ログ・観察ダイアリーが集まる
- 決定と履歴はコミットし、カーソル（どこを見ているか）はコミットしない
- `memory.md` は AI が自分の解釈・逸脱・トレードオフを記録するファイル。学習ループの入力になる
- 監査ログは 91 イベント型・追記専用。規制産業のトレーサビリティ要件に応える設計
- 深度を上げるのは読む人が実在するときだけ。成果物は必ずコミットする
