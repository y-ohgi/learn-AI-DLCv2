**Collaborator:** aidlc-quality-agent

## Contribution

> 検査の角度: テスト姿勢（Methodology / Ordering）、品質ゲートの定義、検証ツールと手順、機械検査と判断の切り分け、インタビューで確定すべき欠落。リードドラフト（`team-practices.md` の `## Testing Posture`、`evidence.md` の論点 T-1〜T-3）、scope-document の「事実の裏取り方式」「毎フェーズの調査とレビュー」「成功指標の検証」、親リポジトリの `.github/workflows/deploy.yml` と `scripts/build-site.mjs` を読み、honkit 6.2.2（`node_modules` にインストール済み）の挙動を一時ディレクトリの最小ブックで実測した。以下「実測」と書いた項目はこのセッションで実際に確認した結果である。

### 1. 構造化フィールド（Methodology / Ordering）への提案

- **Methodology は `test-after` で賛成**。理由は 3 つ。(1) ビルド・リンク・出典・ハンズオン再現の 4 種はどれも章を書いた後にしか実行できない。(2) functional-design で行う主張→出典の事前列挙は仕様のゲート審査であり、実行可能なテストではない（T-1 のリード解釈に同意）。(3) `first/` で `aidlc engine testing-posture resolve` を実行すると、現状は org 既定の `test-after` に解決され、`plan_profile.testable_layers` は「Data model / Repository / Business logic / API / Frontend」の汎用 5 層になる。code-generation ステージは「層の名前を読み替え、該当しない層を省いてよいが Methodology は変えない」と定めているので、Ordering に本プロジェクトの「テスト可能な層」を明示しておくと Code Generation の計画ステップがそのまま写像できる。
- **Ordering の推奨文言（1 文）**: 「Bolt ごとに、(a) 骨格（`SUMMARY.md`・`book.json`・`README.md`）、(b) 章本文、(c) 章末「出典」節、(d) ハンズオン手順、の各層を書き終えた直後にその層の検査（`npm run build` と `_site/first/index.html` の存在 → 内部リンク解決 → 出典節の存在と参照先の実在 → ハンズオン手順のクリーン環境再現）を実行し、Bolt 完了前に全章分を再実行する。」
- **「テストランナー」の読み替え**: Testing Contract は常に `runner_ready_before_first_test: true` を要求し、greenfield では「最小のランナーを bootstrap し、実行コマンドを `unit-test-instructions.md` に記録する」ことを最初のテストの前に置く。本プロジェクトの「ランナー」は検査スクリプトそのものなので、**walking skeleton（Bolt 1）の完了条件に検査スクリプトの導入と実行コマンドの確定を含める**べきである。含めないと Bolt 2 以降の code-generation 計画が「実行コマンドの無い検査ステップ」になり、ステージ定義上は無効な計画になる。
- 注意点: Ordering を英語で書き直す場合、同じ文に「tests before implementation」系と「tests after implementation」系の語句が両方入ると resolver（`.claude/tools/aidlc-testing-posture.ts` の `mixedOrdering` 判定）が `custom` に読み替える。日本語文であれば誤検知しない。

### 2. 検証項目の分類 — 機械検査できるもの / 判断が要るもの

| # | 検証 | 種別 | 手段（コマンド） | 実測で分かった落とし穴 |
| --- | --- | --- | --- | --- |
| 1 | ビルド成功 | 機械 | `npm run build` の終了コード 0 **かつ** `test -f _site/first/index.html` | `scripts/build-site.mjs` は `first/SUMMARY.md` が無いと「skip」と警告して first 版を飛ばし、終了コード 0 で終わる（実測）。PR の `build` ジョブが緑でも first 版が 1 ページもビルドされていない可能性があるため、終了コードだけでは合否にならない |
| 2 | `SUMMARY.md` の全エントリの実在 | 機械 | `SUMMARY.md` の `](path)` を抽出して `test -f first/<path>`。または `_site/first/**/*.html` に `data-path="*.md"` が残っていないこと | honkit 6.2.2 は目次が存在しないファイルを指しても **警告を出さず終了コード 0**（実測）。ページは黙って欠落し、サイドバーに `href="missing.md"` が残る |
| 3 | 章内の相対リンク解決 | 機械 | `grep -rE 'href="[^"#]*\.md[#"]' _site/first` が 0 件（honkit は解決できたリンクだけ `.html` に書き換えるので、`.md` が残っている = 未解決。実測）。加えて各 `href` の実体が `_site/` 配下に存在すること（`../claude/...` は `_site/claude/` に対して解決） | 別ブックへの `../claude/<章>.md` リンクは honkit が書き換えず `.md` のまま出力され、公開サイトでは 404 になる（実測）。`.html` または末尾 `/` のディレクトリ参照で書く規約が必要 |
| 4 | アンカー（`#見出し`）解決 | 機械（任意） | 生成 HTML の `id=` と照合 | honkit は検査しない。優先度は低い |
| 5 | 外部 URL 到達性 | 機械（advisory） | `curl -sS -L -o /dev/null -w '%{http_code}'` | この環境はプロキシ経由で `github.com` の HTML ページ（`/tree/v2.8.2`、`/releases/tag/v2.8.2`）が 403、`raw.githubusercontent.com` は 200（実測）。外部リンクを blocking にすると偽陰性が出るため advisory とし、失敗一覧を人が見る |
| 6 | 章末「出典」節の存在 | 機械 | 各章ファイルに `^## 出典$` があり、配下に 1 件以上のパス | なし |
| 7 | 出典パスの実在 | 機械 | 3 系統に分ける。(a) `awslabs/aidlc-workflows` 2.8.2 のパス: `curl -sI https://raw.githubusercontent.com/awslabs/aidlc-workflows/v2.8.2/<path>` が 200（実測: `docs/guide/05-scopes-and-depth.md`、`core/tools/aidlc-orchestrate.ts` は 200、架空パスは 404）、または `git clone --depth 1 --branch v2.8.2` した作業ツリーに `test -e`。(b) `first/.claude/...`: `test -e`。(c) `first/aidlc/...`: `test -e` | リードが参照した clone はセッションの scratchpad にあり、grafted HEAD `a0ee441`・タグ無しで「2.8.2 である」ことを機械的に証明できず、セッション終了で消える。`first/.claude/` には `docs/` が無いので `docs/guide/...` の裏取りは (a) でしか検査できない |
| 8 | 出典が主張を支えているか（SM2） | 判断 | functional-design ゲートの主張→出典マップ審査、code-generation の advisory レビュアー、各ゲートでのコンダクター精読（project.md `## Corrections`） | 機械検査は「形式と実在」まで。内容の裏取りは人（代理）の判断 |
| 9 | ハンズオン再現（SM1） | 機械 + 判断 | 第 4 節に分割して記す | なし |
| 10 | 公開後 smoke（SM3） | 機械 | `curl -sS -L -o /dev/null -w '%{http_code} %{url_effective}' https://y-ohgi.github.io/learn-AI-DLCv2/first/` の **最終** ステータスが 200 | 現在 `https://y-ohgi.github.io/learn-AI-DLCv2/` は 301 で `https://y-ohgi.com/learn-AI-DLCv2/` に転送される（実測。`/first/` `/claude/` は転送後 404 = 未公開のため正常）。リダイレクトを追わずに「HTTP 200」を判定すると永久に失敗する |

### 3. `.bookignore` と出典の書き方（リンク検査との衝突）

- `first/.bookignore` は `aidlc` と `.claude` を除外しており、除外ディレクトリは `_site/first/` にコピーされない（実測）。したがって `first/aidlc/...` や `first/.claude/...` への **Markdown リンクは公開サイトで必ず 404** になる。出典節のパスはリンクではなくコードスパン（`` `first/aidlc/.../audit/<file>.md` ``）で書く規約にすると、#3 のリンク検査と #7 の実在検査が衝突しない。ケーススタディ章で記録をリンクとして読ませたい場合は `.bookignore` の変更が必要で、これは判断事項。
- 監査シャードは `audit/<host>-<clone-id>.md` と機械依存の名前を持つ。出典に書く場合はコミット済みの実ファイル名を書き、#7(c) で実在を検査する。

### 4. SM1（ハンズオン再現）の合否条件の分割

- **機械検査できる部分**（一時ディレクトリで実行）: (1) `curl -fsSL https://github.com/awslabs/aidlc-workflows/releases/latest/download/install.sh | sh -s -- --version 2.8.2`（`install.sh` は `--version`・`--from <dir>`/`--offline`・`--json`・`--ca-bundle` を持つ。upstream の Quick Start は `latest` を指すので、教材側で 2.8.2 に固定しないと再現結果が時間とともにずれる）、(2) `aidlc version` が `aidlc 2.8.2 (runtime 2.8.2)` を出力、(3) `aidlc config --harness claude ... --yes`（`aidlc config --help` は「全ての対話質問にフラグ等価がある」と明示）、(4) `aidlc doctor` の終了コード、(5) `aidlc engine orchestrate next` が最初の run-stage ディレクティブを返す（モデル呼び出し不要の決定論的ステップ）。
- **判断・環境依存の部分**: 「最初の承認ゲートに到達」を文字どおり取ると Claude Code + Bedrock でコンダクターが intent-capture を走らせる必要があり、build-and-test で機械実行できない。build-and-test の規則では、検証を後段に委譲できるのは「本番相当環境が必要」かつ「後段ステージが明示的に所有する」場合だけで、それ以外は `Unverified` = ステージ失敗になる。よって SM1 の合格線を今決める必要がある。(a) 上記 (1)〜(5) を合格線とする、(b) コンダクター実行まで含め deployment-execution が所有する、のいずれか。**(a) を推奨**（リードの T-3 提案と同じ線）。
- `aidlc doctor` は Bedrock 資格情報の無いクリーン環境で provider 系の検査を落とす可能性がある。合否に含める doctor の検査項目（runtime / hooks は必須、provider は許容、など）を決める。
- 検査の入力は章本文にする。ハンズオン章の `bash` フェンスを抽出して順に実行する方式にすれば「教材に書いた手順そのもの」が検査される（要件をテストし、実装をテストしない）。

### 5. Test Strategy Minimal の読み替えと Build-and-Test の測定目標

- `render` が返す契約の obligations は「要件ごとに 1 つの検証可能なテスト」「コンポーネントごとに 1 つの happy-path」「既存スイートを緑に保つ」。読み替え: 要件 = requirements-analysis の各 FR（章の学習目標）、コンポーネント = 章ファイル、happy-path = その章の #1〜#3, #6〜#7 が通ること。build-and-test Step 10 は全 FR/NFR が `traceability.json` で `OK` かつ target ファイルが実在することを要求するので、**FR ID → 章ファイルパスを target とする規約**を requirements-analysis / units-generation で決めておくこと。
- build-and-test の `## Target Verification Matrix` は、nfr 系ステージが SKIP のため測定目標の源が code-generation-plan の `## Testing Contract` だけになる。目標を書かないと `N/A` 1 行になり、SM1〜SM3 が「合否無し」で通過してしまう。code-generation-plan に測定可能な目標を明示することを推奨する: 未解決内部リンク 0 件、出典節欠落章 0 件、実在しない出典パス 0 件、`_site/first/index.html` の存在、SM1 手順 (1)〜(5) の全通過、公開 URL の最終ステータス 200。
- 「既存スイートを緑に保つ」= 新章を加えるごとに全章の検査を再実行する（回帰）。リードの「新しい章を加えても既存の全章のビルドとリンクが引き続き通る」に出典検査を加える。

### 6. 検査の置き場所と CI 反映（判断）

- CI（`deploy.yml`）は `npm ci` → `npm run build` のみで、リンクも出典も検査しない。検査を PR で blocking にするには `package.json` の `build` に連結するか `deploy.yml` に 1 step 足す必要がある。discovered-rules の「新しいパイプラインは作らない」との境界（既存ワークフローへの 1 行追加は許容か）を確定する。
- 推奨: `scripts/check-book.mjs`（親リポジトリ `scripts/`、依存追加無し、Node 22 標準 API + `curl`）を `npm run check:first` で呼び、build-and-test で必ず実行する。CI への連結は人の判断とする。

### 7. インタビューで確定すべき問い（Testing Posture 関連）

- T-2 拡張: 検査スクリプトの置き場所、CI 連結の有無、外部リンクを advisory 扱いにするか。
- T-3 拡張: SM1 の合格線 (a)/(b)、`--version 2.8.2` 固定、`aidlc doctor` の必須項目。
- T-4（新規）: 出典パスの実在検査を `raw.githubusercontent.com`（`v2.8.2`）で行うか、`--branch v2.8.2` の浅い clone で行うか。オフライン性と再現性の選択。
- T-5（新規）: 出典と `first/aidlc/` 参照はコードスパン（非リンク）で書くか、`.bookignore` を変えて公開するか。
- T-6（新規）: claude 版への相互リンクを `.html` / ディレクトリで書く規約と、リンク検査で `_site/claude/` を解決対象に含めるか。
- T-7（新規）: Bolt 1（walking skeleton）の完了条件に検査スクリプトの導入と `_site/first/index.html` の存在確認を含めるか。

## Positions
- AGREE: Methodology `test-after` — 4 種の検証はすべて執筆後にしか走らず、functional-design の事前列挙は仕様審査でテストではない。`aidlc engine testing-posture resolve` の現在の解決結果とも一致し、Code Generation は層名の読み替えだけで済む。
- AGREE: 検証 4 種（ビルド / リンク / 出典 / ハンズオン再現）の構成と「検査項目を弱めない」方針 — build-and-test の失敗述語（目標の緩和・無効化は修正として認めない）と一致する。
- AGREE: T-3 の提案（`aidlc engine orchestrate next` の run-stage ディレクティブ発行を到達点とする） — モデル呼び出し無しで決定論的に判定でき、build-and-test で `Unverified` にならない唯一の線。
- AGREE: リンク検査は `honkit build` とは別手段が要る（T-2） — 実測で確認した（未解決リンクでも終了コード 0、警告無し）。
- OBJECT: 「ビルド成功」の定義が終了コードだけ — `scripts/build-site.mjs` は `first/SUMMARY.md` 不在で first 版をスキップして 0 で終わるため、`_site/first/index.html` の存在確認を合否に含めない限り PR ビルドの緑は first 版の証明にならない。
- OBJECT: smoke test と Mandated ルールの「`https://y-ohgi.github.io/learn-AI-DLCv2/first/` が HTTP 200」 — 現在このホストは 301 で `https://y-ohgi.com/learn-AI-DLCv2/` に転送されるため、リダイレクト追従後の最終ステータス 200（`curl -L`）と書き換えないと検査が成立しない。
- OBJECT: 出典パス実在検査の照合先が未定義 — 参照された clone はタグ無し・grafted HEAD で 2.8.2 と証明できず、scratchpad にあるためセッション終了で消える。`raw.githubusercontent.com/awslabs/aidlc-workflows/v2.8.2/<path>` または `--branch v2.8.2` の clone を照合先として Testing Posture に明記すべき。
- OBJECT: 出典・記録パスとリンク検査の衝突が未考慮 — `.bookignore` が `aidlc` と `.claude` を除外するため、それらへの Markdown リンクは公開サイトで必ず 404 になる。出典はコードスパン（非リンク）で書く規約か `.bookignore` の変更かをインタビューで決める必要がある。
- OBJECT: claude 版への相互リンクの書式 — Code Style は `../claude/<パス>` の相対リンクを提案するが、別ブックへの `.md` リンクは honkit が書き換えないため公開後 404 になる。`.html` または末尾 `/` を規約にし、リンク検査に `_site/claude/` の解決を含める。
- OBJECT: walking skeleton に「テストランナー」相当（検査スクリプト）が含まれていない — Testing Contract は最初のテストの前にランナーが用意されていることを要求し、無いと Bolt 2 以降の code-generation 計画が「実行コマンドの無い検査ステップ」になる。
