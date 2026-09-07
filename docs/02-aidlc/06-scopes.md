# 2.6 スコープ・深度・テスト戦略

**この章が実務では最重要です。** 33ステージという数字に怯む必要はなく、実際に何ステージ走るかはここで決まります。

## 3つのダイヤル

| ダイヤル | 制御するもの | 値 |
| --- | --- | --- |
| **スコープ（Scope）** | **どのステージを実行するか** | 11種（+ 自動検出、+ コンポーザーによるカスタム） |
| **深度（Depth）** | 各ステージが**どれだけ詳しく**書くか | Minimal / Standard / Comprehensive |
| **テスト戦略** | **どれだけテストを生成するか** | Minimal / Standard / Comprehensive |

テスト戦略は深度から独立しています（設計は浅くてもテストは厚く、といった組み合わせが可能）。

## 11のスコープ

| スコープ | ステージ数 | 既定深度 | 使う場面 |
| --- | --- | --- | --- |
| `enterprise` | 33 / 33 | Comprehensive | 規制産業。完全な監査証跡・コンプライアンス・本番運用が必要 |
| `feature` | 33 / 33 | Standard | 新機能をフルライフサイクルで |
| `mvp` | 23 / 33 | Standard | 新規プロダクトの MVP。Operation フェーズは飛ばす |
| `poc` | 8 / 33 | Minimal | 実現可能性の検証。とにかくコードまで速く |
| `bugfix` | 9 / 33 | Minimal | バグ1件の修正とデプロイ |
| `refactor` | 10 / 33 | Minimal | 機能を変えないコード整理 |
| `infra` | 13 / 33 | Standard | インフラ変更（環境追加、IaC 更新、コスト最適化） |
| `security-patch` | 10 / 33 | Minimal | CVE 対応 |
| `classic` | 26 / 33 | Standard | **v1 スタイル**。Ideation を飛ばす。実質的な既定値 |
| `workshop` | 26 / 33 | Standard（テストは Minimal） | 研修・ワークショップ |
| `express` | 10 / 33 | Minimal | 要件 → コード → テスト → 条件付きデプロイの最短経路。設計パスもレビュアーもなし |

**「AI-DLC は 33 ステージで重い」は誤解です。** 実務でよく使うのは `bugfix`（9）、`express`（10）、`classic`（26）あたりで、33 全部を回すのは `enterprise` / `feature` のみです。

### 主要スコープでのステージ有無（抜粋）

| # | ステージ | `express` | `bugfix` | `classic` | `feature` |
| --- | --- | :-: | :-: | :-: | :-: |
| 0.1–0.3 | Initialization | ✓ | ✓ | ✓ | ✓ |
| 1.1 | Intent Capture | | | | ✓ |
| 1.2 | Market Research | | | | ✓ |
| 1.4 | Scope Definition | | | | ✓ |
| 2.1 | Reverse Engineering | ✓ | ✓ | ✓ | ✓ |
| 2.2 | Practices Discovery | | | ✓ | ✓ |
| 2.3 | Requirements Analysis | ✓ | ✓ | ✓ | ✓ |
| 2.4 | User Stories | | | ✓ | ✓ |
| 2.6 | Domain Design | | | ✓ | ✓ |
| 2.7 | Units Generation | | | ✓ | ✓ |
| 2.9 | Delivery Planning | | | ✓ | ✓ |
| 3.1 | Functional Design | | | ✓ | ✓ |
| 3.5 | Code Generation | ✓ | ✓ | ✓ | ✓ |
| 3.6 | Build and Test | ✓ | ✓ | ✓ | ✓ |
| 3.7 | CI Pipeline | | | ✓ | ✓ |
| 4.1 | Deployment Pipeline | ✓ | ✓ | ✓ | ✓ |
| 4.3 | Deployment Execution | ✓ | ✓ | ✓ | ✓ |
| 4.4 | Observability Setup | ✓ | | ✓ | ✓ |
| | **合計** | **10** | **9** | **26** | **33** |

✓ は「そのスコープの計画に含まれる」という意味です。条件付きステージは実行時に条件を満たさなければスキップされます（例：Reverse Engineering は brownfield のみ）。

## 自動検出

スコープを明示しなくても、記述からキーワードで判定されます。

| キーワード | 検出されるスコープ |
| --- | --- |
| fix, bug, broken | `bugfix` |
| refactor, clean up, simplify | `refactor` |
| infrastructure, deploy, infra | `infra` |
| security, CVE, vulnerability, patch | `security-patch` |
| proof of concept, prototype, poc, spike | `poc` |
| mvp, minimum viable | `mvp` |
| workshop, lab, training | `workshop` |
| express, lightweight | `express` |

**曖昧さ回避のルール**があります。スコープのキーワードと**5語を超える長い説明**が同時に含まれる場合、キーワードの一致は偶然とみなされ、代わりに**コンポーザーの提案**が出ます。
「Fix the infrastructure monitoring dashboard」が `infra` に飛ばされる事故を防ぐためです。

検出後は必ず1行の確認が出ます。

```
Starting a "bugfix" workflow for: "fix login bug" - 8 of 33 stages, 5 approval gates.
Confirm to proceed, name a different scope, or say "compose" for a tailored plan.
```

**ステージ数とゲート数が、コンパイル済みのグリッドから計算されて表示される**のがポイントです。推定ではなく実数。何に同意するかが始める前に分かります。

## アダプティブコンポーザー

「既製の11個のどれとも違う」ときのための機能です。

```
/aidlc compose "デプロイパイプラインを強化して可観測性を追加する"
/aidlc compose --report sonar.json     # スキャンレポートから組む
/aidlc --new-scope "..."               # 既製スコープに一致してもカスタムを強制
```

コンポーザーエージェントはタスクを読み、**実装のエントロピー**を5要素で推定します。

1. 意図の曖昧さ
2. コードベースの構造的不確実性
3. 検証のエントロピー
4. リスク
5. 未解決の前提

そこから「**成果に必要な成果物をすべて生み出す、最小十分な EXECUTE/SKIP グリッド**」を組みます。
提案には各要素の LOW/MED/HIGH バンドと根拠、そして**ステージごとの EXECUTE/SKIP とその理由**の表が付きます。承認・編集・却下ができ、**明示的な承認前には何も書き込まれません**。

### 走行中の再構成

ワークフローの途中でも `/aidlc compose` で**未実行のステージだけを組み替えられます**。

- 完了済み・実行中のステージは凍結
- 残るステージが必要な入力を失わないよう strict 検証
- `RECOMPOSED` 監査イベントとして記録

さらに、リテラルなコマンドでなくても「market research はもう分かってるから飛ばせない？」という普通の会話が再構成要求として認識され、同じゲートと同じ検証を通ります。

## 深度の効き方

| 深度 | 成果物 |
| --- | --- |
| Minimal | 1〜2ページ。主要な決定のみ。任意セクションは省略 |
| Standard | 完全な成果物。必須セクション全部＋簡潔な根拠 |
| Comprehensive | 拡張版。任意セクションも含む。詳細な正当化、コンプライアンス相互参照 |

変更できるタイミングは3つ：起動時のフラグ（`--depth comprehensive`）、スコープ確認時、**任意の承認ゲート**。

## 実務での選び方

```
まず /aidlc --doctor で環境確認
  ↓
バグ1件か？                    → bugfix
CVE 対応か？                   → security-patch
とにかく動くものを速く？          → poc または express
既存プロジェクトの通常機能開発？    → classic（Ideation の儀式なし）
新機能をフルで、企画から？         → feature
規制・監査要件あり？             → enterprise
どれとも違う／複合的？            → /aidlc compose
```

**初めて触るときは `express` か `bugfix`** を選んでください。10 ステージ以下なので全体像が1時間以内で見えます。第3部のハンズオンはこの順序で組んであります。

## この章のまとめ

- スコープ（どのステージ）・深度（どれだけ詳しく）・テスト戦略（どれだけテスト）の3ダイヤル
- 実際に走るステージ数は 8〜33。「常に重い」わけではない
- キーワードで自動検出されるが、長文＋キーワードの組み合わせではコンポーザー提案に切り替わる
- コンポーザーがエントロピー推定から最小十分なプランを組む。走行中の再構成も可能
- 学習の入口は `express` / `bugfix`
