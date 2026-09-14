# External Dependency Map — AI-DLC v2 教材（first 版）

入力: `bolt-plan.md`、`../domain-design/components.md`（`components`: External Dependencies）、`../requirements-analysis/requirements.md`（`requirements`: Assumptions A2〜A4）、`delivery-planning-questions.md`（Q5）。

## 一覧

Bolt（いくつかの Unit を 1 回で設計・執筆・検査して動く状態で終える区切り）の進行を止め得る、チームの外にあるものの一覧。本プロジェクトは AI のコンダクター 1 人で完結するため、他チームからの受け渡しや承認待ちは無い。

| 外部依存 | 所有者 | 使う Bolt | 何に使うか | 所要時間 | 遅れた・使えないときの手 |
| --- | --- | --- | --- | --- | --- |
| aidlc 2.8.2 のリリース配布（GitHub Releases の `install.sh`、`aidlc-runtime-2.8.2.tar.gz`） | awslabs（外部） | Bolt 4（NFR1 の再現） | クリーンな一時ディレクトリへの `install.sh --version 2.8.2` | 数分（ダウンロード） | 到達不能・削除なら、本セッションのインストール記録（`[record]`）で代替し、章に「執筆時点で到達可」の注記を置く。Bolt は閉じられるが NFR1 は `Unverified` になるため、復旧後に再実行する |
| GitHub Actions（PR の `build` ジョブ） | GitHub | Bolt 1（完了条件）、以後の各 Bolt | `npm ci` → `npm run build` → `npm run check:first` の CI 実行 | 数分 | 障害時はローカルのビルドと検査で Bolt を閉じ、PR 上のビルド成功は復旧後に確認する |
| GitHub Pages と公開ホストの転送（`y-ohgi.github.io` → `y-ohgi.com`） | GitHub / 依頼者 | deployment-execution | 公開と smoke test（リダイレクト追従後の最終ステータス 200） | 数分（デプロイ） | 転送先が変わっても最終ステータスで判定する。Pages 障害時は `main` への取り込みを済ませ、公開確認を復旧後に行う |
| 方法論の原典（AWS AI-DLC ブログ） | AWS | Bolt 2（2.1） | 原典 URL の到達確認と「原典では…」の記述 | 即時 | 到達不能なら `[2.8.2] docs/guide/00-introduction.md § What is AI-DLC?` の記述だけを引き、URL に「執筆時点で到達可（2026-09-13 に HTTP 200 を確認）」と注記 |
| awslabs/aidlc-workflows タグ `v2.8.2`（クローン） | awslabs | 全 Bolt（`[2.8.2]` の実在確認） | `git cat-file -e v2.8.2:<path>` | 即時（ローカル） | クローンはスクラッチパッドにあり、セッションが変われば `git clone --depth 1 --branch v2.8.2` で取り直す。CI では U2 のスクリプトが一時ディレクトリへ浅いクローンを行う |
| honkit 6.2.2（npm） | HonKit / npm レジストリ | 全 Bolt | `npm ci` によるビルド | 数分 | `package-lock.json` で固定。レジストリ障害時は CI を待ち、ローカルの `node_modules` で検査を続ける |

## 承認と受け渡し

承認の待ち時間は無い（依頼者は介入せず、コンダクターが代理で承認する）。他チームからの受け渡しも無い。
