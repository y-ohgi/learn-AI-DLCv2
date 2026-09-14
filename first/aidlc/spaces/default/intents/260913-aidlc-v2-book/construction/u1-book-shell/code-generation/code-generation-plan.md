# Code Generation Plan — U1 骨格と規約（`u1-book-shell`）

入力: `../../../inception/units-generation/unit-of-work.md`（U1 の定義）、`../../../inception/units-generation/unit-of-work-story-map.md`（FR1、FR1.1、FR1.2 → U1）、`../../../inception/requirements-analysis/requirements.md`（FR1.1、FR1.2、NFR6〜NFR8）、`../../../inception/domain-design/components.md`（BookShell、Glossary Seed、SourceRegister、Chapter Ledger）、`../../../inception/practices-discovery/team-practices.md`（`## Code Style`）。U1 は kind `packaging` のため functional-design を持たず、設計は components.md の該当節を直接の仕様とする。

「コード」は `first/` 直下の HonKit 骨格（Markdown と JSON）で、アプリケーションコードは無い。テスト戦略は Minimal（要件ごとに 1 つの検証、章ファイルごとに happy path）。

## 実装ステップ

- [ ] **Step 1** — `first/README.md`（はじめに）を書く: 対象読者と前提知識の表（NFR6）、本書が 2.8.2（タグ `v2.8.2`、commit `355903d`）に固定されていること（NFR8）、claude 版との関係（独立執筆・重複話題はリンク）、章末「出典」節の読み方（名前空間 4 種と GitHub URL の組み立て方）、方法論の原典（AWS ブログ）の URL、部の順に読む案内。文章は claude 版から再利用しない。→ FR1.1
- [ ] **Step 2** — `first/SUMMARY.md` を書く: `# 目次`、`* [はじめに](README.md)`、`## 第1部 読者の現在地`、`* [1.1 あなたの AI 利用はどこにいるか](docs/01-context/01-where-you-are.md)`。第 2 部以降の見出しと章は、その Unit の完了時に追記する（HonKit は欠落ファイルを警告なしで通すため、未執筆の章は載せない）。→ FR1.2
- [ ] **Step 3** — `first/book.json` を書く: `title`、`description`、`author`、`language: "ja"`、`structure.readme: README.md`、`structure.summary: SUMMARY.md`。プラグインは追加しない。`first/.bookignore` は既存（`.claude`、`aidlc`、`node_modules`、`.gitignore`、`.mcp.json`、`CLAUDE.md`、`aidlc.settings*.json`）を維持する。→ FR1.2
- [ ] **Step 4** — テスト実行手段の確認（Testing Contract の runner step）: `npm run build:first` が親リポジトリで実行でき、`_site/first/index.html` を生成することを確認する。U2（検査スクリプト）が無い間の検査コマンドは `unit-test-instructions.md` に記載の `npm run build:first && test -f _site/first/index.html`。
- [ ] **Step 5** — 骨格のテスト（test-after）: `npm run build:first` を実行し、(a) 終了コード 0、(b) `_site/first/index.html` の存在、(c) `_site/first/index.html` の `<title>` が book.json の `title` を含む、(d) 目次に「はじめに」と「1.1」が現れる（1.1 は U3 完了後。U1 単独では README のみ）を確認する。
- [ ] **Step 6** — 規約の確定版を記録に写す: `components.md` の Chapter Ledger・Glossary Seed・出典行の書式を、他 Unit が従う「規約」として `code-summary.md` に参照パスで示す（本文の複製はしない）。→ FR1（部全体）
- [ ] **Step 7** — `source-manifest.json` と `traceability.json` と `code-summary.md` を書く。

## 要件との対応

| 要件 | ステップ | 成果物 |
| --- | --- | --- |
| FR1（骨格と公開経路、部全体） | Step 1〜6 | `first/README.md`、`first/SUMMARY.md`、`first/book.json` |
| FR1.1（README） | Step 1、5 | `first/README.md` |
| FR1.2（SUMMARY と book.json） | Step 2、3、5 | `first/SUMMARY.md`、`first/book.json` |
| NFR6（前提知識）、NFR8（版の固定） | Step 1 | `first/README.md` |
| NFR7（表記） | Step 1〜3 | すべて |

## Testing Contract

```json
{
  "version": 1,
  "methodology": "test-after",
  "source": "team",
  "ordering": "Bolt ごとに、骨格・章本文・章末の出典節・ハンズオン手順の各層を書き終えた直後にその層の検査（ビルドと `_site/first/index.html` の存在 → 内部リンク解決 → 出典節の存在と参照先の実在 → ハンズオン手順のクリーン環境再現）を実行し、Bolt 完了前に全章分を再実行する。",
  "scope": "docs-book",
  "test_strategy": "minimal",
  "project_type": "greenfield",
  "applicable_notes": [
    {
      "layer": "org",
      "text": "We treat tests as a first-class deliverable in every Bolt. The specific\nmethodology (TDD, BDD, ATDD, or classic test-after) is affirmed at\npractices-discovery and recorded in `team.md` under this heading with explicit\n`Methodology` and `Ordering` fields; Code Generation resolves those fields\nindependently from coverage, tooling, and scope notes.\n\nWhen no posture has been affirmed, our default per scope is:\n- **Methodology**: test-after\n- **Ordering**: implement each applicable testable layer, then write and run\n  that layer's tests.\n- `mvp`, `enterprise`, `feature`, `infra`, `classic` add an 80% line-coverage\n  floor and CI execution before merge.\n- `bugfix`, `security-patch` add a targeted regression for the specific\n  bug/vulnerability and require the existing suite to remain green.\n- `express` uses the Minimal strategy: requirement-driven unit tests (one per\n  requirement, with a happy-path floor per component); existing tests remain\n  green.\n- `poc`, `refactor`, `workshop` add no extra new-test floor and require the\n  existing suite to remain green.\n\nThe active `Test Strategy` still applies in every scope and determines test\nvolume/types. Scope floors are additive; they never reduce or replace the\nselected strategy.\n\nBuild and Test verifies defined coverage floors and affirmed quality targets;\nthey may not be weakened to make a step pass.\n\nAffirm a stricter posture in `team.md` if the team commits to one."
    },
    {
      "layer": "team",
      "text": "- **Methodology**: test-after\n- **Ordering**: Bolt ごとに、骨格・章本文・章末の出典節・ハンズオン手順の各層を書き終えた直後にその層の検査（ビルドと `_site/first/index.html` の存在 → 内部リンク解決 → 出典節の存在と参照先の実在 → ハンズオン手順のクリーン環境再現）を実行し、Bolt 完了前に全章分を再実行する。\n- 本プロジェクトにアプリケーションコードとユニットテストフレームワークは無い。「テスト」とは次の 4 種の検証を指す。\n  1. ビルド: `npm run build` が終了コード 0 で終わり、`_site/first/index.html` が存在する。honkit 6.2.2 は目次に無いファイルも未解決リンクも警告なしで終了コード 0 になるため、終了コードだけでは合否にしない。\n  2. リンク: `_site/first/` 配下の HTML の `href` に `.md` が残っていない（honkit は解決できたリンクだけ `.html` に書き換えるので、`.md` が残る = 未解決）。内部リンクの参照先が `_site/` 配下に実在する（`../claude/` は `_site/claude/` に対して解決する）。\n  3. 出典: 各章末に `## 出典` 節があり、列挙したパスがすべて実在する。照合先は、`[2.8.2]` が `awslabs/aidlc-workflows` のタグ `v2.8.2`（commit `355903d`）の木（`git cat-file -e v2.8.2:<path>`。クローンの場所は環境変数で指定し、無ければ一時ディレクトリへ `--depth 1 --branch v2.8.2` の浅いクローンを行う）、`[runtime]` / `[record]` が本リポジトリの作業木である。\n  4. ハンズオン再現（SM1）: クリーンな一時ディレクトリで、章本文の `bash` フェンスに書いたとおり (1) `install.sh` を `--version 2.8.2` 固定で実行し (2) `aidlc version` が `aidlc 2.8.2 (runtime 2.8.2)` を返し (3) `aidlc config --harness claude` をフラグ指定（非対話）で実行し (4) `aidlc doctor` の runtime / hooks 系の検査が通り（Bedrock 資格情報に依存する検査は失敗を許容し、その旨を章に書く） (5) `aidlc engine orchestrate next` が最初の run-stage ディレクティブを返す、までを機械的に確認して記録する。ここまでを「最初の承認ゲートに到達できる」の合格線とする。\n- 検査手段は親リポジトリの `scripts/check-first.mjs`（`build-site.mjs` と同じ ESM・Node 22 標準 API のみ、依存追加なし）で、`npm run check:first` で呼ぶ。first 版（`_site/index.html` と `_site/first/`）の内部リンク・章の体裁（Code Style の閉じた集合）・出典は **blocking**、`_site/claude/` の内部リンクと外部 URL は **advisory**（報告のみ。この環境ではプロキシ経由で `github.com` の HTML が 403 になるため外部 URL は偽陰性を生む）。既存の `deploy.yml` の `build` ジョブに `npm run check:first` を 1 ステップ追加し、失敗で PR を止める。\n- 執筆前の検証として、functional-design（章仕様）で章内の事実主張とその出典を列挙し、ゲートで審査する。これは仕様であってテストではないため Methodology は test-after の単一値とする。読者向けの別表（主張→出典の対応表）は作らず、章末の出典節が読者向けの成果物である。\n- Test Strategy は **Minimal** で、スコープ `docs-book` は追加のカバレッジ床を持たない。読み替えは「要件 = requirements-analysis の各 FR（章の学習目標）、コンポーネント = 章ファイル、happy path = その章が上記 1〜3 を通ること（ハンズオン章は 4 を含む）」とし、FR ID → 章ファイルパスを traceability の target とする規約は requirements-analysis / units-generation で決める。「既存スイートを緑に保つ」= 新しい章を加えるごとに全章分の検査を再実行する。\n- code-generation-plan の Testing Contract には測定可能な目標を明示する: 未解決内部リンク 0 件、出典節の欠落章 0 件、実在しない出典パス 0 件、`_site/first/index.html` の存在、SM1 の手順 (1)〜(5) の全通過、公開 URL のリダイレクト追従後の最終ステータス 200。\n- 一次情報で確認できない主張は書かない。推定を書く場合は本文に「（推定）」を付し、出典節に `[推定]` 行で根拠と確定できない理由を残す。検証を通過させるために検査項目を弱めたり省いたりしない。"
    }
  ],
  "obligations": {
    "strategy": "minimal",
    "strategy_volume": [
      "One verifiable test per requirement at the narrowest effective level.",
      "At least one happy-path unit test per component.",
      "Unit tests are the default; a bugfix/security scope floor may require an integration or E2E regression when that is the narrowest level that reproduces the defect."
    ],
    "scope_floor": [
      "Keep the existing test suite green.",
      "This scope adds no extra new-test floor beyond the selected test strategy."
    ],
    "combination_rule": "Apply every selected-strategy obligation and every scope-floor obligation; neither replaces the other, and a targeted scope regression may add the narrowest necessary test type beyond the strategy default."
  },
  "plan_profile": {
    "methodology": "test-after",
    "runner_step": "Bootstrap the minimal test runner/configuration and record the exact unit-scoped command.",
    "runner_ready_before_first_test": true,
    "testable_layers": [
      "Data model / database behavior",
      "Repository / data access",
      "Business logic",
      "API / endpoint",
      "Frontend behavior"
    ],
    "steps": [
      "Project structure and production configuration skeleton.",
      "Bootstrap the minimal test runner/configuration and record the exact unit-scoped command.",
      "Data model / database behavior - implement.",
      "Data model / database behavior - write and run its tests after implementation.",
      "Repository / data access - implement.",
      "Repository / data access - write and run its tests after implementation.",
      "Business logic - implement.",
      "Business logic - write and run its tests after implementation.",
      "API / endpoint - implement.",
      "API / endpoint - write and run its tests after implementation.",
      "Frontend behavior - implement.",
      "Frontend behavior - write and run its tests after implementation.",
      "Environment/build configuration.",
      "Documentation and traceability."
    ]
  },
  "input_sha256": "sha256:db96e652665205e8e408e474db69b4a46b481e678a49cc2749c1bf90de2616ee",
  "contract_sha256": "sha256:966008adea99ace734804ed4cd849bac45b8dde211c4ec7bb1fc365e234976ea"
}
```

契約の `plan_profile.testable_layers` は汎用の 5 層だが、本 Unit に該当する層は「Project structure and production configuration skeleton」（Step 1〜3）と「Environment/build configuration」（Step 4）、「Documentation and traceability」（Step 6〜7）だけで、Data model / Repository / Business logic / API / Frontend の各層は該当しない（Methodology は test-after のまま、Step 5 が「実装後にその層の検査を書いて実行する」に相当する）。測定目標: `npm run build:first` 終了コード 0、`_site/first/index.html` 存在、README に前提の表と版の固定の明記。
