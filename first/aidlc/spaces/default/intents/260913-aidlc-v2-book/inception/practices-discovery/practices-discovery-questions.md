# Practices Discovery Questions

このファイルは、first 版（AI-DLC v2 ベースの新規教材）を書くうえでの「チームの進め方」を決める質問です。依頼者は本ワークフローに介入しないため（依頼文 Q9）、コンダクターが依頼者の代理として回答し、各回答の末尾に根拠（依頼文、既存教材 claude 版、または本ワークフローの記録）を明記します。回答は `[Answer]:` の後に選択肢の英字を書いてください。当てはまらない場合は `X` を選び、続けて内容を書いてください。

参照した下書き: `team-practices.md`、`discovered-rules.md`、`evidence.md`（未解決の論点 W-1〜C-4）、支援 3 名の寄稿 `contributions/aidlc-quality-agent.md`、`contributions/aidlc-developer-agent.md`、`contributions/aidlc-devsecops-agent.md`。Depth は Standard（目安 5〜8 問）ですが、下書きと寄稿で未解決の論点が 20 件を超えたため、関連する論点を 1 問にまとめて 14 問としています。

## Way of Working（作業の進め方）

## Q1. 章を書く単位ごとの作業ブランチは、どこから切って、どこへ戻しますか？

（AI-DLC は章を書く単位を「Bolt」と呼び、Bolt ごとに作業用の別ブランチを切ります。`main` には今、first 版の公開経路も 2 冊構成も入っておらず、いまのセッションブランチだけがそれを持っています）

A. いまのセッションブランチ `claude/ai-dlcv2-honkit-pages-1ylg3o` から切り、squash で同じブランチへ戻す。`main` へは最後に 1 本の PR でまとめて取り込む
B. 先にいまのブランチを `main` へ取り込み、以降は `main` から切って Bolt ごとに PR → `main`（章単位で公開）
C. Bolt ごとの別ブランチは作らず、セッションブランチに直接コミットする
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: 依頼文（Q9）「私は一切介入しません。Pagesへのデプロイまで完了させてください」から、公開（`main` 取り込み）は完成物を 1 回で行うのが依頼者の期待に合う。B は未完成の章が段階的に公開される。C は Bolt ごとの履歴が残らず、ケーススタディ章（scope-document P6）の素材が失われる。A は org.md の既定（base/target = `main`）と食い違うため、`team-practices.md` に理由付きで明記する（evidence.md W-1）。

## Q2. `main` へ取り込むときのマージ方法と、コミットメッセージの書き方はどうしますか？

A. `main` への最終 PR はマージコミット（依頼者自身が行った PR #1 と同じ方法）。コミットメッセージはこれまでの実績どおり `aidlc:` / `docs:` / `chore:` の種別を先頭に付ける
B. `main` への最終 PR も squash にする。コミットメッセージは A と同じ
C. マージ方法は GitHub の既定に任せ、コミットメッセージは自由文にする
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: 依頼者が自身で行った PR #1 のマージはマージコミット方式だった（evidence.md W-2、`git log origin/main`）。依頼者の実際の操作を慣習として尊重する。Bolt ブランチをセッションブランチへ戻すときは org.md の既定どおり squash とする（Q1）。コミットメッセージは本セッションのこれまでの履歴が既に種別付きで統一されており、変える理由がない。

## Walking Skeleton（最初に薄く通す）

## Q3. 最初に薄い一本通しを作りますか？ ウォーキングスケルトンとは、部品同士がつながることを先に証明するために最初に作る、端から端まで動く最小版のことです。ここでは「HonKit の骨格（README / SUMMARY / book.json）+ 章 1 本 + 検査スクリプト」を `_site/first/` のビルドまで通すことを指します。

A. はい。骨格 + 章 1 本 + 検査スクリプト（Q7）を先に作り、ビルドと検査が通ることを確認してから残りの章に進む
B. はい。ただし検査スクリプトは含めず、骨格 + 章 1 本のビルドだけを通す
C. いいえ。最初から全章を順に書く
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: 選択したスコープ `docs-book` が `skeleton: on` を宣言している（`.claude/scopes/aidlc-docs-book.md`）。scope-document でも「walking skeleton = P1（骨格）+ P2（現在地）の最小公開」を定めた。検査スクリプトを含めるのは quality の寄稿（Testing Contract は最初のテストの前に実行手段がそろっていることを要求する）に従う。claude 版 2.5「最初の Bolt は骨格」の説明とも一致する。

## Q4. 薄い一本通しが「できた」と判定する条件と、その後の残りの章の進め方はどうしますか？

A. 判定条件は「ローカルで `npm run build` が成功し `_site/first/index.html` が生成され、検査スクリプトが通り、PR 上の GitHub Actions のビルドも成功する」（`main` への取り込みはしない）。その後の章は Bolt ごとに立ち止まり、コンダクターが依頼者の代理で精読・承認してから次へ進む
B. 判定条件は A と同じだが、その後の章は立ち止まらず連続で書き切り、最後にまとめて確認する
C. 判定条件は「`main` へ取り込み、公開 URL が 200 を返す」。その後は Bolt ごとに承認
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: Q1 で「`main` への取り込みは最後に 1 回」と決めたため C は矛盾する。`_site/first/index.html` の存在確認は quality の寄稿の実測（`scripts/build-site.mjs` は `first/SUMMARY.md` が無いと first 版を飛ばして終了コード 0 になる）による。Bolt ごとの承認は依頼文（Q9）「調査とレビューは毎フェーズ行い」と project.md Corrections「各ゲートでコンダクターが代理で成果物を精読し判断理由を残す」に従う（evidence.md S-1、S-2）。

## Testing Posture（検証の姿勢）

## Q5. 各章が「検証に通った」と言える条件は何ですか？

A. 次の 4 つ。(1) ビルド: `npm run build` が終了コード 0 で `_site/first/index.html` が存在する (2) リンク: `_site/first/` 配下の HTML に未解決の `.md` リンクが 0 件で、内部リンクの参照先が `_site/` 配下に実在する (3) 出典: 各章末に `## 出典` 節があり、列挙したパスがすべて実在する（照合先は Q7） (4) ハンズオン章のみ: クリーンな一時ディレクトリで手順を再現できる（合格線は Q8）
B. `honkit build` の成功のみ
C. A に加えて、markdownlint などの文体・体裁チェックも通ること
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: Intent Statement の成功指標 SM1（ハンズオン再現）、SM2（事実の裏取り）、SM3（リンク切れゼロ）に対応する。(1)(2) の具体条件は quality の寄稿の実測（honkit 6.2.2 は目次の欠落ファイルも未解決リンクも警告なしで終了コード 0 になり、未解決リンクは HTML に `.md` のまま残る）による。C の文体チェックは SM に無い（Q13 で別途判断）。

## Q6. 検証はいつ、どの順序で行いますか？

A. 章を書いてから検証する（test-after）。順序は「Bolt ごとに、骨格 → 章本文 → 章末の出典節 → ハンズオン手順の各層を書き終えた直後にその層の検査（ビルド → リンク → 出典 → 再現）を実行し、Bolt 完了前に全章分を再実行する」
B. 章仕様（functional-design）で主張と出典を先に固め、書いてから build・リンク検査を行う（先に仕様、後に検証の混合）
C. 章を書く前に検査スクリプトを先に書き、章を書くたびに走らせる（テスト先行）
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: 教材はコードではなく、章仕様に主張と出典を列挙するのは「仕様」であって検査ではない（evidence.md T-1、quality の寄稿も同意）。org.md の既定も test-after で、`docs-book` スコープの testStrategy は Minimal。順序の 1 文は quality の寄稿の提案文を採用し、`team.md` の Ordering 欄にそのまま書く。B は実務上 A と同じ手順になるため、Methodology は `test-after` の単一値にする。

## Q7. リンクと出典の検査はどの手段で、どこに置き、どこまで厳しくしますか？（`honkit build` はリンク切れを検出しません）

A. 親リポジトリの `scripts/check-first.mjs` を新設し（`build-site.mjs` と同じ ESM・Node 22 標準 API のみ、依存追加なし）、`npm run check:first` で呼ぶ。検査対象: `_site/index.html` と `_site/first/` の内部リンク、first 版の章の体裁（Q12）と出典（Q11）は blocking、`_site/claude/` の内部リンクと外部 URL は advisory（報告のみ）。出典パスの照合先は、`[2.8.2]` は aidlc-workflows のタグ `v2.8.2` の木（`git cat-file -e v2.8.2:<path>`。クローンの場所は環境変数で指定し、無ければ一時ディレクトリへ浅いクローンを行う）、`[runtime]` / `[record]` は本リポジトリの作業木。既存の `deploy.yml` の build ジョブに `npm run check:first` を 1 ステップ追加する
B. A と同じだが、`deploy.yml` には追加せず build-and-test でローカル実行するだけにする（CI への組み込みは deployment-execution での任意提案に留める）
C. 既存の npm パッケージ（リンクチェッカー）を devDependency に追加して使う
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: 依頼文（Q9）「1 次情報とコードをもとに間違った情報は取り込まない」には機械的な検査が必要（SM3）。既存の `scripts/build-site.mjs` と同じ場所・同じ標準ライブラリで書けば依存を増やさない（evidence.md T-2、devsecops の寄稿も同意）。スクリプト名は既存の `build:first` に合わせ developer の寄稿の `check-first.mjs` を採る。体裁と出典の検査を同じスクリプトに載せるのは developer の寄稿 §10（外部リンタを入れない代わりにリポジトリ内スクリプトを規約の強制手段にする）に従う。外部 URL を advisory にするのは、この環境ではプロキシ経由で `github.com` の HTML が 403 になるという quality の実測による。`_site/claude/` を advisory にするのは claude 版がスコープ外（scope-document）だから。照合先を `v2.8.2` タグのクローンにするのは、リードが参照したクローンの HEAD（`a0ee441`）がタグ `v2.8.2`（`355903d`）と分岐していることをコンダクターが確認したため。CI への 1 ステップ追加は「新しいパイプラインは作らない」と矛盾しない（Q9 で明記）。developer の寄稿は CI 組み込みを見送る案だが、Q13 で org.md の「リンタを CI で実行し失敗で PR を止める」を 3 検査に読み替える以上、CI で実行しなければ読み替えが空文になるため A を採る。

## Q8. ハンズオン章の再現確認（SM1）の合格線と、確認の仕方はどうしますか？

A. 一時ディレクトリで、章本文の `bash` フェンスに書いたとおり (1) `install.sh` を `--version 2.8.2` 固定で実行 (2) `aidlc version` が `aidlc 2.8.2 (runtime 2.8.2)` を返す (3) `aidlc config --harness claude` をフラグ指定（非対話）で実行 (4) `aidlc doctor` の runtime / hooks 系の検査が通る（Bedrock 資格情報に依存する検査は失敗を許容し、その旨を章に書く） (5) `aidlc engine orchestrate next` が最初の run-stage ディレクティブを返す、までを機械的に確認して記録する。ここまでを「最初の承認ゲートに到達できる」の合格線とする
B. (4) `aidlc doctor` までを機械的に確認し、それ以降は本セッションの実行記録で代替する
C. 再現確認は行わず、本セッションの実行記録のみを根拠にする
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: Intent Statement SM1「読者がハンズオン章の手順だけで最初の承認ゲートに到達できる」。本セッションのインストールは root 制約の回避（別ユーザー作成）を含み、そのままでは読者の手順と一致しない（evidence.md T-3）。(5) までを合格線にするのは quality の寄稿（モデル呼び出しなしで決定論的に判定でき、build-and-test で Unverified にならない線）に従う。`--version 2.8.2` は `scripts/install.sh` の usage 行と CHANGELOG 2.8.2 項にある実在のフラグであることをコンダクターが確認した（devsecops の「未裏取り」指摘への回答）。

## Deployment（公開）

## Q9. 公開は既存の GitHub Actions（`main` への push → GitHub Pages）だけを使い、新しい配線は作らない、で良いですか？ 既存ワークフローへの小さな変更はどこまで許しますか？

A. 既存の `.github/workflows/deploy.yml` と `scripts/build-site.mjs` を使い、新しいワークフロー・公開先は作らない。既存ワークフローへの変更は「`npm run check:first` の 1 ステップ追加」と「`permissions` をワークフロー全体からジョブ単位に縮める」の 2 点まで許容する。Dependabot などの新しい設定ファイルは追加せず、`npm audit` の high 2 件（`honkit` 経由の `immutable`、修正版なし、ビルド時限定）は受容リスクとして evidence.md に記録する
B. 既存ワークフローは一切変更しない（検査はローカルのみ、権限もそのまま）
C. first 版専用のワークフローや別の公開先を追加する
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: 依頼文（Q9）が公開先パスを `.../learn-AI-DLCv2/first/` と指定しており、既存の多冊ビルドがそのパスを生成する（`scripts/build-site.mjs`）。discovered-rules.md の Mandated 第 1 項。権限の縮小は devsecops の寄稿（build ジョブに `pages: write` / `id-token: write` が不要）に従うが、Dependabot は新しい成果物であり discovered-rules.md の Forbidden 第 3 項（スコープ外成果物を作らない）に当たるため見送る。

## Q10. `main` への取り込み（＝本番公開）は誰がどの手段で行い、公開の「完了」は何で判定しますか？

A. コンダクターが依頼者の代理で GitHub 上に PR を作成し、PR 上のビルドと検査の成功を確認してからマージする。完了判定は「`https://y-ohgi.github.io/learn-AI-DLCv2/`、同 `/claude/`、同 `/first/` がリダイレクト追従後に最終ステータス 200 を返し、公開サイト上で検査スクリプトを再実行して blocking 項目が 0 件、ランディングページから両版へ遷移できる」。git タグは付けない。ブランチ保護など GitHub 側の設定は PR 作成時に GitHub MCP で確認し、結果を evidence.md に記録する
B. 依頼者が PR をマージする（ワークフローは PR 作成で停止する）。完了判定は A と同じ
C. PR を作らずコンダクターが `main` へ直接 push する。完了判定は `main` への push 完了
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: 依頼文（Q9）「私は一切介入しません。Pagesへのデプロイまで完了させてください」。B は依頼者の介入を要し、C は PR 上のビルド確認（Q4）と記録が残らない。「リダイレクト追従後」とするのは、現在 `https://y-ohgi.github.io/learn-AI-DLCv2/` が 301 で `https://y-ohgi.com/learn-AI-DLCv2/` に転送されることを quality の寄稿とコンダクターの双方が実測したため（依頼者の GitHub Pages 設定であり、本ワークフローでは変更しない）。タグは依頼文に無く、claude 版でも付けていない（evidence.md D-1、D-2）。

## Code Style（章の書き方の決まり）

## Q11. 章末の `## 出典` 節の書き方と、claude 版へのリンクの書き方はどうしますか？

A. 出典はリンクにせず、1 行を `- [<名前空間>] <パス> <位置> — <裏付ける主張>` の形で書く。名前空間は 4 つに固定する: `[2.8.2]`（aidlc-workflows のタグ `v2.8.2`、commit `355903d` のリポジトリ相対パス。`docs/…`、`core/…`）、`[runtime]`（コミット済みのインストール済みランタイム `first/.claude/…`）、`[record]`（本ワークフローの記録 `first/aidlc/…`）、`[推定]`（一次情報で確定できない推論。本文側にも「（推定）」を付す）。位置は見出し名（`§ …`）またはシンボル名で示し、行番号は使わない。食い違いの優先順位は「事実確認の前にクローンを `v2.8.2` にチェックアウトする → docs とコードが食い違えばコード（`core/`）を正とする → コードとインストール済みが食い違えば投影差分としてコードを書き投影固有の事柄だけ `[runtime]` で示す → 記録とドキュメントが食い違えば記録を事実として書き、食い違いを注意書きで明示する」。`first/.claude/` と `first/aidlc/` はコミットし続ける。claude 版へのリンクは公開後の HTML パスで書く（`first/README.md` からは `../claude/docs/<部>/<章>.html`、章ファイルからは `../../../claude/docs/<部>/<章>.html`）
B. 出典を Markdown リンクにする（`first/.bookignore` から `aidlc` と `.claude` を外して公開する）。claude 版へのリンクは `.md` のまま書く
C. 出典は GitHub の固定 URL（タグ付き）で書く。claude 版へのリンクは A と同じ
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: project.md Corrections「事実主張ごとに一次情報のファイルパスを列挙する」。名前空間・位置の示し方・優先順位は developer の寄稿 §8 を採用する。タグを正とするのは、クローン HEAD（`a0ee441`）がタグ `v2.8.2`（`355903d`）から `docs/`・`core/` で 40 ファイル進んでおり、インストール済み `first/.claude/` はタグと一致することを developer が `git diff` で確認し、コンダクターも分岐を確認したため（リードドラフト C-1 の「インストール済みを正」を置き換える。`scratchpad/guide/` の別コピーは入力にしない）。`first/.bookignore` が `aidlc` と `.claude` を除外するため、それらへの Markdown リンクは公開サイトで必ず 404 になり、別ブックへの `.md` リンクも honkit が書き換えない（quality と developer の寄稿の実測）。B は AI-DLC のランタイムと記録を公開物に混入させる（devsecops の寄稿 A-7 に反する）。C はタグの実在確認が別途必要で URL が長い。GitHub URL は `README.md` と付録の出典一覧に 1 回だけ書く。

## Q12. 図と章の体裁（ファイル名・章テンプレート・Markdown の書式）はどうしますか？

A. 図は Mermaid を使わず ASCII 記法（箱の中のラベルは英数字のみ、日本語の説明は図の直下の段落に書く）か表にし、```` ```mermaid ```` は禁止する。ディレクトリ・ファイル名は英語 kebab-case で `docs/<NN-部>/<NN-章>.md` の 1 段構成、日本語は `SUMMARY.md` のタイトルと章の `# ` 見出しにだけ置く。`SUMMARY.md` は claude 版と同じ体裁（`## 第N部 …` と `* [N.M タイトル](docs/…)`、ネスト無し）。章テンプレートは「`# N.M タイトル` → 導入段落 → `## この章で学ぶこと` → 本文の節（`##`〜`###`）→ `## まとめ`（学ぶことと 1 対 1 対応）→ `## 出典`」に固定し、ハンズオン章は `## つまずきポイント` を任意で置く。コードフェンスは言語名必須で `bash` / `text` / `json` / `yaml` / `markdown` / `diff` に限定。補足は `> **注意** —` の形で、ラベルは `注意` / `補足` / `推定` / `参照` の 4 種。HTML タグは使わない
B. 図は Mermaid プラグインを HonKit に追加して描き、章の体裁は claude 版に完全に揃える（`## この章のまとめ` → `## 出典`）
C. 図も体裁も章ごとに執筆時に決める
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: ASCII 図は claude 版と同じ理由（HonKit の標準テーマは Mermaid を描画せず、```` ```mermaid ```` はエラーを出しつつ終了コード 0 で成功扱いになる。developer の実測）で、ビルド環境に依存を増やさない（evidence.md C-2）。章テンプレートは developer の寄稿 §7 を採る: `## この章で学ぶこと` は scope-document が requirements-analysis で章ごとの学習目標を定めると宣言したことの章への写像で、`## まとめ` との 1 対 1 対応を検査可能にする。節名を claude 版の `## この章のまとめ` と揃えないのは、project.md Forbidden（文章の非再利用）を体裁でも示すため。`SUMMARY.md` の体裁と番号付けは 2 冊を並べて読む読者（依頼文 Q9）のために揃える（evidence.md C-4）。書式の細目（フェンス言語の許可集合、引用ラベル）は検査スクリプト（Q7）で機械検査するために閉じた集合にする。

## Q13. markdownlint などの文体・体裁チェックツールを導入しますか？ org.md の Code Style は「リンタを CI で実行し、失敗で PR を止める」を既定にしています。

A. 導入しない。本プロジェクトのソースは Markdown なので、org.md の「リンタを CI で実行」は「ビルド・リンク・出典の 3 検査（Q7）を CI で実行し、失敗で PR を止める」と読み替え、その読み替えを `team-practices.md` に明記する
B. 導入する（markdownlint を devDependency に追加し、`npm run check` に含める）
C. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: Q5 と同じく SM に体裁基準は無く、claude 版でも導入していない（evidence.md C-3）。devsecops の寄稿が求めた「両論提示と読み替えの明記」に応じ、A の読み替えを文章として残す。B は依存を増やし、既存の claude 版の Markdown にも一律に適用されて範囲が広がる。

## Q14. 章に貼るログ・コマンド出力の扱い、ハンズオンで外部スクリプト（`curl … | sh`）を教える型、日本語の表記規則はどうしますか？

A. 貼り付けるログ・出力からはアカウント ID・ARN・トークン・メールアドレスを除き、絶対パスは `~/…` などに短縮する（マスキング規約）。外部スクリプトの実行は、一次情報の逐語コマンドを示したうえで「ダウンロードして内容を確認 → `--version 2.8.2` で固定して実行 → `aidlc version` で検証」の手順を併記する。日本語の表記は「和文と英数字・コードスパンの間に半角スペース、句読点と括弧は全角、数字は半角、1 段落 1 行」とし、英語のまま残す固定トークン（コマンド・パス・ステージ名・イベント名などはコードスパン、AI-DLC・HonKit・Bolt・Unit・フェーズ名などの固有名詞は初出で一文の説明）と 1 語 1 訳の対訳表は domain-design で確定して付録の用語集の元にする
B. ログはそのまま貼り、外部スクリプトは一次情報の逐語コマンドだけを示す。日本語の表記は claude 版に合わせる
C. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: devsecops の寄稿 G-6 / G-8。本書のケーススタディ章は監査ログや実行ログを引用する計画（scope-document P6）で、記録には実行環境のパスが含まれる。ハンズオンの版固定は SM1 の再現性（Q8）にも必要で、`install.sh` の `--version` フラグは一次情報で確認済み。日本語の表記規則は developer の寄稿 §5〜§6 を採る。「claude 版に合わせる」は claude 版自体が和欧間スペースで不統一（約 600 対 約 420）と developer が確認しており、検証可能な規約にならない。

## 回答にあたっての前提

- GitHub 側の設定（`main` のブランチ保護、secret scanning、Pages の公開元）は本環境から確認できないため、Q10 のとおり PR 作成時に確認して記録する。
- `npm audit` の high 2 件は修正版が無いため受容リスクとして記録する（Q9）。修正版が出た場合の更新は本ワークフローの範囲外。

## Consolidated Summary Confirmation

回答の要約（すべて代理回答・根拠は各設問の末尾）:

- Bolt ブランチはセッションブランチから切って squash で戻し、`main` へは最後に 1 本の PR（Q1: A）。`main` への最終 PR はマージコミット、コミットメッセージは種別付き（Q2: A）
- 最初に骨格 + 章 1 本 + 検査スクリプトで薄く通す（Q3: A）。完了条件はローカルビルド + `_site/first/index.html` + 検査通過 + PR ビルド成功、その後は Bolt ごとに代理で精読・承認（Q4: A）
- 検証 = ビルド（`index.html` の存在込み）/ 未解決 `.md` リンク 0 件 / 出典節と参照先の実在 / ハンズオン再現（Q5: A）。Methodology は test-after、Ordering は層ごとに書き終えた直後に検査し Bolt 完了前に全章再実行（Q6: A）
- 検査は `scripts/check-first.mjs`（依存追加なし）を `npm run check:first` で実行。first 版は blocking、claude 版と外部 URL は advisory。出典の照合先は `v2.8.2` タグの木。`deploy.yml` に 1 ステップ追加（Q7: A）
- SM1 の合格線は install `--version 2.8.2` → `aidlc version` → 非対話 `aidlc config` → `aidlc doctor`（provider 系は許容）→ `aidlc engine orchestrate next` のディレクティブ発行まで（Q8: A）
- 公開は既存 Actions のみ。既存ワークフローの変更は検査ステップ追加と `permissions` のジョブ単位化まで。Dependabot は追加せず、`npm audit` high 2 件は受容リスク（Q9: A）
- `main` への取り込みはコンダクターが代理で PR 作成・マージ。完了判定はリダイレクト追従後の最終ステータス 200 + 公開サイトでの検査 + ランディングからの遷移。タグ無し（Q10: A）
- 出典は 4 名前空間（`[2.8.2]` / `[runtime]` / `[record]` / `[推定]`）のコードスパン行、位置は見出し名かシンボル名、タグ `v2.8.2` を正、食い違いは 4 段の優先順位。claude 版へのリンクは `.html`（Q11: A）
- 図は ASCII、`mermaid` 禁止、kebab-case の `docs/NN-部/NN-章.md`、章テンプレートは学ぶこと → 本文 → まとめ → 出典、フェンス言語と引用ラベルは閉じた集合（Q12: A）
- markdownlint は入れず、org.md の「リンタを CI で」は 3 検査の CI 実行に読み替えて明記（Q13: A）
- ログのマスキング、外部スクリプトは逐語 + 版固定 + 検証の型、日本語表記規則、対訳表は domain-design で確定（Q14: A）

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
