# 3.4 Hands-on 4: 成果物と監査ログを読む

## 目的

生成物を「読める」ようになります。**AI-DLC の価値の大半は、生成された記録を読む人がいるかどうかで決まります。**

## Step 1：全体を俯瞰する

```bash
cd ~/work/aidlc-practice
INTENT=$(ls -d aidlc/spaces/default/intents/*/ | tail -1)
echo "Intent: $INTENT"

# 生成されたファイルを一覧
find "$INTENT" -type f | sort

# サイズ順に見る（大きいものが情報量が多い）
find "$INTENT" -type f -name '*.md' -exec wc -l {} + | sort -rn | head -20
```

## Step 2：状態ファイルを読む

```bash
cat "$INTENT"aidlc-state.md
```

読み方：

| 記号 | 意味 | 注目点 |
| --- | --- | --- |
| `[x]` | 完了 | — |
| `[S]` | スキップ | **なぜ飛んだか**を確認する価値がある（スコープ外／条件不成立／失敗時の skip） |
| `[R]` | 差し戻し中 | 未解決の作業 |
| `[?]` | 承認待ち | ゲートが開いている |
| `[-]` | 実行中 | セッションが途中で切れた形跡 |
| `[ ]` | 未実行 | — |

あわせて `Scope`、`Project depth`、`Test strategy`、`Construction Autonomy Mode` の各フィールドを確認してください。**このファイルだけで、その Intent がどう回されたかが分かります。**

```bash
grep -iE 'scope|depth|test strategy|autonomy' "$INTENT"aidlc-state.md
```

## Step 3：質問ファイル（決定の一次記録）を読む

```bash
find "$INTENT" -name 'questions.md' | while read f; do
  echo "=== $f"
  head -40 "$f"
done
```

**これが決定の正式な記録です。** Guide Me / Edit File / Chat のどのモードで進めても、決定はここに収束します。

PR レビューのときに「なぜこの実装なのか」を知りたければ、コードより先にここを読むのが速い。

## Step 4：memory.md（AI の自己申告）を読む

**AI-DLC で最も過小評価されているファイル**だと思います。

```bash
find "$INTENT" -name 'memory.md' | while read f; do
  echo "=== $f"
  cat "$f"
done
```

記録されている4種類：

| セクション | 意味 | レビューでの使い方 |
| --- | --- | --- |
| **Interpretations** | 曖昧な指示をどう解釈したか | **解釈が誤っていないか確認する**。最も価値が高い |
| **Deviations** | 標準からどう逸脱したか | 逸脱に正当な理由があるか |
| **Tradeoffs** | 何を捨てたか | 捨てたものが本当に不要か |
| **Open questions** | 未解決の問い | **放置されていないか** |

素の Agent 利用では、この情報は会話ログの中に散らばっていて再構成できません。**「AI が自分の解釈と迷いを構造化して書き残す」ことが、レビューの質を大きく変えます。**

なお、このファイルは**手編集しないでください**（エンジンとコンダクターが管理しています）。

## Step 5：ADR と設計判断を読む

```bash
cat "$INTENT"inception/decisions.md 2>/dev/null
cat "$INTENT"inception/components.md 2>/dev/null
cat "$INTENT"inception/risk-and-sequencing-rationale.md 2>/dev/null
```

**この3つは長期的な価値が最も高い成果物**です。「なぜ Redis ではなく DynamoDB か」「なぜこの順序で作るか」は、後から絶対に再構成できません。

**実務での運用**：これらは PR に含めてレビューさせるべきです。コードだけの PR では判断の妥当性が検証できません。

## Step 6：監査ログを読む

```bash
ls "$INTENT"audit/
cat "$INTENT"audit/*.md | head -50
```

シャード（`<host>-<clone>.md`）に分かれているので、複数ある場合はタイムスタンプでマージして読みます。

```bash
# 全シャードをタイムスタンプでソートして通し読み
cat "$INTENT"audit/*.md | sort | less
```

### 実用的なクエリ例

```bash
# 何回ゲートを通したか
grep -c 'GATE_APPROVED' "$INTENT"audit/*.md

# 何回差し戻したか
grep -c 'GATE_REJECTED' "$INTENT"audit/*.md

# 人間が対話した回数（承認の前提条件）
grep -c 'HUMAN_TURN' "$INTENT"audit/*.md

# センサーの発火とその結果
grep 'SENSOR_' "$INTENT"audit/*.md

# Bolt / swarm の実行履歴（自律 swarm パスのみ記録される）
grep -E 'BOLT_STARTED|BOLT_COMPLETED|SWARM_COMPLETED' "$INTENT"audit/*.md

# ステージプランの再構成
grep 'RECOMPOSED' "$INTENT"audit/*.md
```

### 見るべき比率

**`GATE_APPROVED` に対する `GATE_REJECTED` の比率**が、実質的なレビューの厚さの指標になります。

- 差し戻し 0 回で 20 回承認 → **承認の空洞化を疑うべき**（1.4 の失敗6）
- 差し戻しが 20〜40% → 健全にレビューしている

これはチームの状態を測るのに使えるメトリクスです。第4部で活用します。

## Step 7：runtime-graph.json を読む

```bash
cat "$INTENT"runtime-graph.json | head -60
# jq があれば
command -v jq >/dev/null && jq 'keys' "$INTENT"runtime-graph.json
```

承認ゲートごとに監査ログから生成される実行実績のミラーです。どのステージが走り、どのセンサーが発火し、`memory.md` に何件記録されたかが入っています。
`--doctor` と学習ループが読むのはこのファイルです。

## Step 8：セッション管理を試す

```
/aidlc --status
```

その他のユーティリティ：

```
/aidlc --version
/aidlc --doctor
/aidlc --stage <slug>       # 任意のステージへジャンプ
/aidlc --phase <name>       # 任意のフェーズへジャンプ
/aidlc --scope <name>       # 走行中にスコープを変更
/aidlc --depth <level>      # 深度を変更
```

**練習**：完了した Intent に対して `--stage` で前のステージにジャンプし、`--status` で状態を確認してから元に戻してみてください。**ジャンプが決定論的エンジンによって管理されている**ことが体感できます。

## 成果物の「読む優先順位」

実務でレビュー時間が限られているときの優先順位です。

| 優先 | ファイル | 理由 |
| --- | --- | --- |
| 1 | `questions.md` | 決定の一次記録。前提が正しいか |
| 2 | `memory.md` の Interpretations / Open questions | AI の解釈の誤りと未解決事項 |
| 3 | `unit-of-work-dependency.md` | 分解の妥当性。以降すべてに影響 |
| 4 | `decisions.md`（ADR） | 設計判断の妥当性 |
| 5 | コードの差分 | 上記が正しければ、あとは実装の確認 |
| 6 | `requirements.md`、`stories.md` | 上記の裏取り |
| 7 | その他の生成ドキュメント | 監査要件がなければ流し読み |

**コードの差分が5番目**という点が重要です。前提と分解が正しければ、コードの誤りは局所的で修正が容易です。逆に前提が誤っていれば、コードが綺麗でも無駄です。

## この章のまとめ

- `aidlc-state.md` だけで Intent の回され方が分かる。`[S]` の理由を確認する習慣を持つ
- `questions.md` が決定の一次記録。コードより先に読む
- `memory.md` の Interpretations / Open questions がレビューで最も効く
- 監査ログを grep すれば承認・差し戻し・センサー・Bolt の履歴が取れる
- **`GATE_REJECTED` / `GATE_APPROVED` 比率が、レビューが実質的かの指標になる**
- 読む優先順位はコードより前提と分解
