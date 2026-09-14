# Code Generation Plan — U2 ビルドと検査（`u2-build-and-check`）

入力: `../../../inception/units-generation/unit-of-work.md`（U2）、`../../../inception/domain-design/components.md`（CheckScript、SiteBuild、LandingPage）、`../../../inception/practices-discovery/team-practices.md`（`## Testing Posture`、`## Deployment`）。kind `library` のため functional-design は持たない。Plan Approval のエンジン受領は U1 と同じ理由で取れず、依頼者の代理判断で承認した（`../../u1-book-shell/code-generation/code-generation-questions.md` の代理判断メモ）。

## 実装ステップ

- [x] **Step 1** — `scripts/check-first.mjs`（Node 22 標準 API のみ）: blocking 検査（ビルド出力の存在、SUMMARY と章の一致、H1 と節の形、`####` 禁止、フェンス言語の許容集合と `mermaid` 禁止、引用ラベル、ルート絶対パス、HTML タグ、claude 版への `.md` リンク、出典行の書式と名前空間、`[2.8.2]` のタグの木での実在、`[runtime]` / `[record]` の実在、「（推定）」と `[推定]` の対応、文字数）、advisory 検査（`_site/claude/` の内部リンク、外部 URL）、`--handson` の再現モード（bash フェンスの抽出と一時ディレクトリでの実行）。
- [x] **Step 2** — `package.json` に `check:first` と `check:first:handson` を追加。`build:first` / `build:claude` を `scripts/build-site.mjs <book>` に変更（honkit が相対出力パスをブックディレクトリ基準で解決する問題の回避）。
- [x] **Step 3** — `.github/workflows/deploy.yml` の 2 点変更: `build` ジョブに `npm run check:first -- --no-external` を追加、`permissions` をワークフロー全体（`contents: read`）と `deploy` ジョブ（`pages: write`、`id-token: write`）に分離。
- [ ] **Step 4** — `site/index.html` の first 版概要文の更新（deployment-execution で行う）。
- [x] **Step 5** — テスト（test-after）: 骨格 + 1.1 に対して `npm run build:first && node scripts/check-first.mjs --no-external` を実行し blocking 0 件（第 2 部以降の未執筆章は除く）。

## Testing Contract

U1 の計画に埋め込んだものと同一（`../../u1-book-shell/code-generation/code-generation-plan.md § Testing Contract`）。本 Unit の「テスト」は検査スクリプト自身の動作確認で、対象は骨格と 1.1。
