# 3.6 つまずきポイントと対処

公式のトラブルシューティングと、ハンズオンで実際に詰まりやすい箇所をまとめます。

## 環境系

### bun が見つからない（最頻出）

**症状**：ターミナルで `which bun` は通るのに、AI-DLC が「bun が見つからない」と言う。

**原因**：ハーネスがフックやツールを実行するのは**非対話シェル**で、それが読むのは `~/.zshenv`（zsh）や `~/.bashrc`（bash / Git Bash）。ところが bun のインストーラは `~/.zshrc` に書く。

**対処**：

```bash
cat >> ~/.zshenv <<'SH'
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
SH
# bash / Git Bash なら ~/.bashrc へ
```

その後、**セッションを再起動**します。

### `--doctor` が "workspace shell ready" で落ちる

**原因**：`aidlc/` ディレクトリが正しい場所にない、または `aidlc/spaces/default/memory/` のメソッドツリーが欠けている。

**対処**：`aidlc/` は `.claude/` の**兄弟**として置きます。中に入れてはいけません。

```bash
ls -d ~/work/aidlc-practice/.claude ~/work/aidlc-practice/aidlc
ls ~/work/aidlc-practice/aidlc/spaces/default/memory/
```

欠けていたら配布物から再コピーします。

```bash
cp -r <aidlc-workflows>/dist/claude/aidlc/ ~/work/aidlc-practice/aidlc/
```

### Bedrock で AccessDenied / モデルが見つからない

**原因**：同梱の `.claude/settings.json` は AWS Bedrock 前提。モデルアクセスが有効化されていない、認証情報がない、リージョンが違う。

**対処**：

1. AWS アカウントで対象モデルのアクセスを有効化する
2. 認証情報を SDK の認証チェーンに載せる
3. `AWS_REGION` が有効化したリージョンと一致しているか確認する

Bedrock を使わない場合は `.claude/settings.json` を自分の環境に合わせて調整します（3.0 手順5）。

### フックが発火しない（監査行が出ない、ゲートが出ない）

**対処**：セッションを再起動します。**スキル・エージェント・ルールはセッション開始時に読み込まれます。** 配布物を新しくコピーした直後は必ず再起動が必要です。

Codex CLI の場合はフックの trust が必要です（`bun scripts/package.ts codex trust --project <dir>` または TUI で "Trust all"）。GitHub Copilot の場合はフォルダの trust が必要です。

### 配布物を更新したらプラグインのステージが消えた

**対処**：`/aidlc plugin sync` を実行します。新しいエンジン配布物をコピーすると標準のグラフに戻るためです。

## 運用系

### ステージ数が想定より多い／少ない

**原因**：スコープの自動検出が意図と違った。

**対処**：スコープ確認行で承認せず、明示的に指定します。

```
bugfix で進めて
# または
compose
```

走行中でも変更できます。

```
/aidlc --scope <name>
/aidlc compose        # 未実行ステージだけ組み替え
```

### ゲートが多すぎて疲れる

**対処**：

1. **スコープを軽くする**（`feature` 33 → `classic` 26 → `express` 10）
2. **深度を下げる**（任意のゲートで `--depth minimal` を要求できる）
3. **walking skeleton の ladder prompt で自律モードを選ぶ**

「疲れた」と感じたら、それは**タスクに対してスコープが重すぎた**というシグナルです。

### 承認しても進まない

**原因の候補**：

1. **`HUMAN_TURN` が記録されていない** — ハーネスのピッカーが人間ターンを記録しない場合があります。**短く「approve」と打ってください**
2. **`AIDLC_UNATTENDED=1` が設定されている** — 無人自動化の宣言があると、承認ゲートは待ち続けます。人が引き継ぐならフラグを外して改めて応答します
3. **blocking なセンサーの指摘が未解決** — 修正するか、明示的にオーバーライドします（監査に残ります）

拒否メッセージにフラグ名が出るので、それを手がかりにしてください。

### 差し戻しが収束しない

**対処**：3回目以降、「**Accept as-is**」の選択肢が出ます。2回目の後に予告の注記が出ます。
ただし、収束しない原因は多くの場合**前段のステージの前提が間違っている**ことです。`--stage` で前のステージに戻る方が根本的です。

```
/aidlc --stage requirements-analysis
```

### コンテキストが圧縮されて話が通じなくなった

**対処**：AI-DLC は状態をファイルに持っているので、基本的には復帰します（`aidlc-state.md` と `.aidlc-recovery.md`）。
それでも怪しいときは `/aidlc --status` で状態を確認し、必要なら新しいセッションを開いて resume します。

### 生成された Unit 分解が納得できない

**対処**：**Units Generation（2.7）のゲートで必ず差し戻してください。** ここを妥協すると Construction 全体が破綻します。具体的な指示を出します。

```
タグ管理と検索は分けずに1つの Unit にしてほしい。
共有リンクは認証 Unit に依存させて。
各 Unit は 500 行以内で実装できる粒度にしてほしい。
```

### Reverse Engineering の出力が実際のコードと違う

**対処**：**絶対に承認しないでください。** ここが誤ると以降のすべてが誤った前提で動きます。
差し戻して、具体的に「この部分は実際にはこうなっている」と指摘します。大きなコードベースでは、対象ディレクトリを絞って再実行させる方が精度が上がります。

### コードは生成されたがビルドできない

**確認順**：

1. **3.6 Build and Test を実行したか** — Code Generation の直後にはビルド検証が入りません（3.6 は最後に1回）
2. **センサーが blocking で止まっていないか** — 監査ログの `SENSOR_*` を確認
3. **失敗時の retry を試したか** — Construction は失敗で停止し retry / skip / abort を聞いてきます

### 弱いモデルで挙動が怪しい

**症状**：レビュアーパスが飛ばされる、learnings ritual（学習ループの提示）が出ない、ゲートが急がれる。

**原因**：公式が明記している既知の挙動です。AI-DLC は Claude Opus 4.8 系で最もよく動くとされています。

**対処**：モデルを上げます。難しい場合は、軽いスコープ（`express` / `bugfix`）に限定して使うのが現実的です。

## 判断系（よくある質問）

### Q. 33ステージ全部やらないと意味がない？

いいえ。**実務で 33 全部を回すのは `enterprise` / `feature` だけ**です。`bugfix` 9、`express` 10、`classic` 26。適切なスコープを選ぶことが正しい使い方です。

### Q. 生成されたドキュメントはコミットすべき？

**すべきです。** コミットしなければ記録として機能しません。`.gitignore` の AI-DLC セクションが、共有すべきもの（知識・ルール・状態・監査・成果物）と個人のカーソルを分けてくれています。

### Q. AWS を使っていないけど大丈夫？

動きます。ただし `aidlc-aws-platform-agent` が標準エージェントに含まれ、同梱 MCP サーバーも AWS 系が中心なので、**そのままだと AWS 前提の提案が出やすい**です。チーム知識（`knowledge/aidlc-aws-platform-agent/` など）で自社のクラウド前提を書いて上書きしてください。

### Q. 途中で辞めたい

Intent の記録ディレクトリはそのまま残るので、放置して構いません。別の Intent を始めれば新しいディレクトリが作られます。
`/aidlc --status` で今どの Intent にいるかが確認できます。

### Q. バージョンを固定したい

公式が推奨しています。

```bash
cd aidlc-workflows
git tag --list | tail -10
git checkout <tag>
# その上で dist/ を再コピーする
```

## この章のまとめ

- 最頻出のつまずきは bun の非対話シェル PATH
- 配布物を更新したらセッション再起動。プラグインは `/aidlc plugin sync`
- 「承認しても進まない」は `HUMAN_TURN` 未記録 / `AIDLC_UNATTENDED` / blocking センサーのいずれか
- Reverse Engineering と Units Generation の出力は妥協せず差し戻す
- 「ゲートが多すぎて疲れる」はスコープが重すぎるシグナル
