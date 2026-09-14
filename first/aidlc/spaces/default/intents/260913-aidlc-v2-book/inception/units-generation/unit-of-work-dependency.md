# Unit Dependency DAG — AI-DLC v2 教材（first 版）

入力: `unit-of-work.md`、`../domain-design/components.md`（`components` の depends_on）、`../domain-design/decisions.md`（`decisions`: ADR-001、ADR-002）、`../requirements-analysis/requirements.md`（`requirements`: NFR5 前方参照なし）。ここに書くのはトポロジー（何が何に依存するか）だけで、作る順序や critical path は Delivery Planning が決める。

## 依存関係（A depends on B = A は B の成果に従う・前提にする）

```yaml
units:
  - name: u1-book-shell
    kind: packaging
    depends_on: []
  - name: u2-build-and-check
    kind: library
    depends_on: [u1-book-shell]
  - name: u3-context
    kind: spec
    depends_on: [u1-book-shell]
  - name: u4-concepts
    kind: spec
    depends_on: [u1-book-shell]
  - name: u5-mechanics
    kind: spec
    depends_on: [u1-book-shell, u4-concepts]
  - name: u6-handson
    kind: spec
    depends_on: [u1-book-shell, u5-mechanics]
  - name: u7-case-study
    kind: spec
    depends_on: [u1-book-shell, u5-mechanics]
  - name: u8-appendix
    kind: spec
    depends_on: [u1-book-shell, u3-context, u4-concepts, u5-mechanics, u6-handson, u7-case-study]
```

| Unit | depends on | 理由 |
| --- | --- | --- |
| u2-build-and-check | u1-book-shell | 検査は台帳・対訳表・出典書式（U1 が確定）を規則にする。`SUMMARY.md` と章の一致検査の対象は U1 |
| u3-context | u1-book-shell | 章は台帳・対訳表・出典書式に従う（components.md: ContextPart → BookShell / Glossary / SourceRegister） |
| u4-concepts | u1-book-shell | 同上 |
| u5-mechanics | u1-book-shell, u4-concepts | 第 3 部は第 2 部が定義した用語（フェーズ、ステージ、Bolt、Unit…）を前提に書く（NFR5） |
| u6-handson | u1-book-shell, u5-mechanics | 手順の説明は 3.1（インストールと設定）と 3.2（エンジンとコンダクター）の説明を前提にする（intent-backlog P4 → P5） |
| u7-case-study | u1-book-shell, u5-mechanics | 記録の読み方は 3.3〜3.7（ステージプロトコル、ゲート、監査、ルール）の説明を前提にする（intent-backlog P4 → P6） |
| u8-appendix | u1, u3, u4, u5, u6, u7 | 用語集・出典一覧・つまずきポイントは全章を横断して集約する（components.md: AppendixPart → Glossary / SourceRegister / HandsOnPart） |

図（テキスト）:

```text
u1-book-shell
  |-- u2-build-and-check
  |-- u3-context ----------------------------+
  |-- u4-concepts --> u5-mechanics --+-- u6-handson ----+-- u8-appendix
  |                                  +-- u7-case-study -+
  +----------------------------------------------------+
```

## 統合点（Unit 間のインターフェース）

| 統合点 | 所有 Unit | 従う Unit | 形 |
| --- | --- | --- | --- |
| Chapter 台帳（章のパス・番号・タイトル・FR） | u1-book-shell | u3〜u8、u2（検査） | `components.md` の Chapter Ledger → `SUMMARY.md` |
| 対訳表（Term） | u1-book-shell | u3〜u7（従う）、u8（付録 A に描く） | `components.md` の Glossary Seed → 付録 A |
| 出典行・抜粋の書式（SourceEntry / RecordExcerpt） | u1-book-shell | u3〜u7（書く）、u2（検査）、u8（付録 C に一覧） | 章末 `## 出典` の行書式、名前空間 4 種 |
| `_site/` のビルド出力 | u2-build-and-check | — | `npm run build` → `_site/first/`、`npm run check:first` |

API・イベント・共有データベースは無い。統合点はすべて Markdown の規約とファイルパスである。

## 並行作業の機会

依存の無い Unit の組は並行に進められる（複数の妥当なトポロジカル順序がある）:

- u2-build-and-check、u3-context、u4-concepts は互いに独立（すべて u1 のみに依存）
- u6-handson と u7-case-study は互いに独立（ともに u5 に依存）
- u8-appendix は最後（u3〜u7 のすべてに依存）

どの組を実際に並行させるか、どの Unit を最初の Bolt に入れるかは Delivery Planning が決める。
