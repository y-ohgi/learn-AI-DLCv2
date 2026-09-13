# C. 参考リンク

本教材の記述の一次情報です。**数値や仕様を業務で使う際は、必ず自分が使うバージョンの公式ドキュメントを確認してください。**

## 一次情報（公式）

| リンク | 内容 |
| --- | --- |
| [awslabs/aidlc-workflows](https://github.com/awslabs/aidlc-workflows) | v2 実装の公式リポジトリ。`main` が GA ブランチ |
| [User Guide](https://github.com/awslabs/aidlc-workflows/blob/main/docs/guide/00-introduction.md) | AI-DLC を**使う**人向け。本教材の第2部・第3部の主な出典 |
| [Phases and Stages](https://github.com/awslabs/aidlc-workflows/blob/main/docs/guide/04-phases-and-stages.md) | 5フェーズ33ステージの詳細（2.5 の出典） |
| [Scopes, Depth, and Test Strategy](https://github.com/awslabs/aidlc-workflows/blob/main/docs/guide/05-scopes-and-depth.md) | 11スコープとステージ別マトリクス（2.6 の出典） |
| [Agents](https://github.com/awslabs/aidlc-workflows/blob/main/docs/guide/06-agents.md) | 14エージェントの詳細（2.7 の出典） |
| [Interaction Modes](https://github.com/awslabs/aidlc-workflows/blob/main/docs/guide/07-interaction-modes.md) | 対話モードと承認ゲート（2.8 の出典） |
| [Knowledge](https://github.com/awslabs/aidlc-workflows/blob/main/docs/guide/08-knowledge.md) | 2階層の知識システム |
| [Rules and the Learning Loop](https://github.com/awslabs/aidlc-workflows/blob/main/docs/guide/09-rules-and-the-learning-loop.md) | ルールと学習ループ（2.10 の出典） |
| [State and Audit](https://github.com/awslabs/aidlc-workflows/blob/main/docs/guide/10-state-and-audit.md) | 状態管理と監査ログ（2.9 の出典） |
| [CLI Commands](https://github.com/awslabs/aidlc-workflows/blob/main/docs/guide/12-cli-commands.md) | 完全なフラグリファレンス（付録B の出典） |
| [Glossary](https://github.com/awslabs/aidlc-workflows/blob/main/docs/guide/glossary.md) | 公式用語集（付録A の出典） |
| [Worked Examples](https://github.com/awslabs/aidlc-workflows/blob/main/docs/guide/16-worked-examples.md) | バグ修正・機能開発の完全な実行例 |
| [Harness Engineer Guide](https://github.com/awslabs/aidlc-workflows/blob/main/docs/harness-engineering/00-overview.md) | AI-DLC の**振る舞いを変える**人向け（ステージ・エージェント・スコープ・ルール・センサーの設定） |
| [Developer Reference](https://github.com/awslabs/aidlc-workflows/blob/main/docs/reference/00-overview.md) | AI-DLC **自体を変える**人向け（アーキテクチャ、オーケストレーター、状態機械） |
| [Roadmap](https://awslabs.github.io/aidlc-workflows/roadmap.html) | 実装済み・進行中・計画中の機能 |
| [AI-DLC Workflows 2.0 Specification](https://github.com/awslabs/aidlc-workflows/blob/main/assets/AI-DLC-Workflows-2.0-Specification.pdf) | AWS Labs のホワイトペーパー（PDF） |
| [AWS AI-DLC Blog Post](https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/) | 方法論の原典（2025年7月） |
| [AI-DLC Method Definition Paper](https://prod.d13rzhkk8cj2z0.amplifyapp.com/) | 方法論の定義文書 |
| [Open-sourcing adaptive workflows for AI-DLC](https://aws.amazon.com/blogs/devops/open-sourcing-adaptive-workflows-for-ai-driven-development-life-cycle-ai-dlc/) | v1 実装の OSS 公開（2025年11月） |
| [Building with AI-DLC using Amazon Q Developer](https://aws.amazon.com/blogs/devops/building-with-ai-dlc-using-amazon-q-developer) | AWS 公式の実践記事 |
| [AI-Driven Development Lifecycle for Financial Services](https://aws.amazon.com/blogs/industries/ai-driven-development-lifecycle-for-financial-services/) | 金融業界向けの適用例 |
| [AWS Responsible AI Policy](https://aws.amazon.com/ai/responsible-ai/policy/) | 生成 AI 利用時の責任に関する方針 |

## 解説記事・二次情報

方法論の理解を助ける記事です。**一次情報と食い違う場合は一次情報を優先してください。**

| リンク | 内容 |
| --- | --- |
| [How AWS's AI-DLC defines an AI-Native methodology](https://ttpsc.com/en/blog/how-aws-ai-dlc-defines-an-ai-native-methodology/) | 方法論の全体像の解説 |
| [AI-DLC Explained: AWS's AI-Driven Development Lifecycle](https://www.exploreagentic.ai/insights/ai-dlc/) | Bolt / Mob Elaboration / Unit の解説 |
| [The Essence of AI-DLC is Extreme Decision Making through Mob Work](https://zenn.dev/kiakiraki/articles/437ba4d9441b2b?locale=en) | Mob work を「極端な意思決定の集中」として捉える視点 |
| [AI-DLC（3フェーズ / Bolt / Mob Elaboration）入門](https://note.com/cc_works_cl/n/n673726233c57) | 日本語の入門記事 |
| [AI-DLC Workflows v2 のインストール（Kiro CLI / Claude Code / Codex CLI）](https://dev.classmethod.jp/en/articles/aidlc-workflows-v2-install-kiro-claude-codex/) | v1 と v2 の違いとインストール実践 |
| [GA した AI-DLC Workflows v2 を Kiro CLI で動かす](https://dev.classmethod.jp/en/articles/aidlc-workflows-v2-ga-kiro-cli/) | GA 版の実行レポート |
| [The AI-Driven Development Lifecycle (AI-DLC): A critical, yet hopeful view](https://medium.com/data-science-collective/the-ai-driven-development-lifecycle-ai-dlc-a-critical-yet-hopeful-view-edc966173f2f) | **批判的な視点**。導入前に読む価値がある |
| [Notes on exploring the AI-Driven Development Life Cycle](https://www.micahwalter.com/posts/notes-on-exploring-ai-dlc) | 個人による探索記録 |
| [Why AI Coding Assistants Make Developers Slower—and How AI-DLC Delivers 10x Velocity](https://repost.aws/articles/ARWSOgROfUTFq4vv5y2hTglw/why-ai-coding-assistants-make-developers-slower-and-how-ai-dlc-delivers-10-x-velocity) | AWS re:Post の主張（数値は前提条件に注意） |
| [AWS AI-DLC: What Comes After Vibe Coding](https://medium.com/@rodion-pro/ai-dlc-what-comes-after-vibe-coding-8204c1c9318a) | Vibe Coding からの位置づけ |
| [How AI-DLC Implements Spec-Driven Development](https://buildwithdc.substack.com/p/aidlc-implements-spec-driven-development) | SDD との包含関係の解説（2.12 の視点） |

## 比較対象となる手法・ツール

| リンク | 内容 |
| --- | --- |
| [Spec-Driven Development: A Spec-First Approach to AI-Native Engineering](https://developer.microsoft.com/blog/spec-driven-development-ai-native-engineering/) | Microsoft による SDD の解説 |
| [From Vibe Coding to Spec-Driven Development](https://towardsdatascience.com/from-vibe-coding-to-spec-driven-development/) | Vibe Coding → SDD の変遷 |
| [What Is Spec-Driven Development? A Complete Guide](https://www.augmentcode.com/guides/what-is-spec-driven-development) | SDD の入門 |
| [Spec-Driven Development with Coding Agents (DeepLearning.AI)](https://www.deeplearning.ai/courses/spec-driven-development-with-coding-agents) | SDD のオンラインコース |
| [I Tested Three Spec-Driven AI Tools](https://ranthebuilder.cloud/blog/i-tested-three-spec-driven-ai-tools-here-s-my-honest-take/) | SDD ツールの比較レビュー |

## 関連する OSS 実装

| リンク | 内容 |
| --- | --- |
| [aws-samples/sample-collaborative-ai-dlc](https://github.com/aws-samples/sample-collaborative-ai-dlc) | AWS サンプル実装 |
| [ijin/aidlc-cc-plugin-v2](https://github.com/ijin/aidlc-cc-plugin-v2) | AI-DLC の Claude Code プラグイン（コミュニティ） |
| [TheBushidoCollective/ai-dlc](https://github.com/TheBushidoCollective/ai-dlc) | hat ベースのワークフローによる別実装（コミュニティ） |

## 本教材について

- **執筆時点**：2026年9月
- **参照した実装バージョン**：AI-DLC Workflows 2.x 系（README 記載バージョン 2.7.1 時点のドキュメント）
- **前提ハーネス**：Claude Code

ステージ数・エージェント数・コマンド名は将来変わりえます。**チーム内で使う手順書は、使用するバージョンをピン留めしたうえで自分たちで更新してください。**
