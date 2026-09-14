#!/usr/bin/env node
// check-first.mjs — the "test runner" for the first edition (first/).
// Node 22 standard library only. Rules come from the affirmed team practices
// (first/aidlc/spaces/default/memory/team.md, "Code Style" / "Testing Posture").
//
//   node scripts/check-first.mjs            # blocking + advisory checks on first/ and _site/
//   node scripts/check-first.mjs --no-external   # skip external URL reachability (advisory anyway)
//   node scripts/check-first.mjs --handson  # additionally replay the hands-on bash fences in a clean temp dir
//
// Exit code is 1 when any blocking finding exists, 0 otherwise. Advisory findings never fail the run.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
const args = new Set(process.argv.slice(2));
const BOOK = resolve(root, "first");
const SITE = resolve(root, "_site");
const SITE_BOOK = resolve(SITE, "first");
const TAG = "v2.8.2";

const blocking = [];
const advisory = [];
const info = [];
const fail = (rule, where, msg) => blocking.push({ rule, where, msg });
const warn = (rule, where, msg) => advisory.push({ rule, where, msg });

const FENCE_LANGS = new Set(["bash", "text", "json", "yaml", "markdown", "diff"]);
const QUOTE_LABELS = new Set(["注意", "補足", "推定", "参照"]);
const NAMESPACES = new Set(["2.8.2", "runtime", "record", "推定"]);

// ---------- helpers ----------
function walk(dir, pred) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p, pred));
    else if (pred(p)) out.push(p);
  }
  return out.sort();
}
const rel = (p) => relative(root, p).split(sep).join("/");

// Split a markdown file into fenced blocks and prose lines.
function parseMarkdown(text) {
  const lines = text.split(/\r?\n/);
  const prose = []; // {n, line}
  const fences = []; // {n, lang}
  let inFence = false;
  let fenceMarker = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/^(`{3,}|~{3,})(\S*)\s*$/);
    if (!inFence && m) {
      inFence = true;
      fenceMarker = m[1];
      fences.push({ n: i + 1, lang: m[2] });
      continue;
    }
    if (inFence) {
      if (line.startsWith(fenceMarker) && line.trim() === fenceMarker) inFence = false;
      continue;
    }
    prose.push({ n: i + 1, line });
  }
  return { prose, fences };
}
const stripCodeSpans = (s) => s.replace(/`[^`]*`/g, "");

// ---------- 1. build output ----------
if (!existsSync(join(SITE_BOOK, "index.html"))) {
  fail("build", "_site/first/index.html", "ビルド出力が無い。`npm run build:first` を先に実行する（SUMMARY.md 不在時は build-site が first 版を黙って飛ばす）");
}

// ---------- 2. SUMMARY.md vs docs/**/*.md ----------
const summaryPath = join(BOOK, "SUMMARY.md");
const summary = existsSync(summaryPath) ? readFileSync(summaryPath, "utf-8") : "";
const summaryEntries = []; // {title, path, appendix}
for (const m of summary.matchAll(/^\* \[([^\]]+)\]\(([^)]+)\)\s*$/gm)) {
  summaryEntries.push({ title: m[1], path: m[2] });
}
const summaryPaths = new Set(summaryEntries.map((e) => e.path));
const docFiles = walk(join(BOOK, "docs"), (p) => p.endsWith(".md")).map((p) => relative(BOOK, p).split(sep).join("/"));
for (const d of docFiles) if (!summaryPaths.has(d)) fail("summary", d, "SUMMARY.md に載っていない章ファイル（HonKit はビルドしない）");
for (const s of summaryPaths) if (s !== "README.md" && !existsSync(join(BOOK, s))) fail("summary", s, "SUMMARY.md が指すファイルが無い");
for (const line of summary.split(/\r?\n/)) {
  if (/^## /.test(line) && !/^## (第\d+部 .+|付録)$/.test(line)) fail("summary", "SUMMARY.md", `部の見出しの形が規約外: ${line}`);
}

// ---------- 3. chapter files ----------
const titleByPath = new Map(summaryEntries.map((e) => [e.path, e.title]));
const chapters = docFiles.map((d) => ({ relPath: d, abs: join(BOOK, d), appendix: d.startsWith("docs/99-appendix/") }));
const sourceLines = []; // {chapter, ns, path, position, claim}
let estimateBodyMentions = 0;

for (const ch of chapters) {
  const text = readFileSync(ch.abs, "utf-8");
  const { prose, fences } = parseMarkdown(text);
  const where = `first/${ch.relPath}`;

  // fences
  for (const f of fences) {
    if (!f.lang) fail("fence", `${where}:${f.n}`, "コードフェンスに言語名が無い");
    else if (f.lang === "mermaid") fail("fence", `${where}:${f.n}`, "mermaid は禁止（HonKit 標準テーマは描画しない）");
    else if (!FENCE_LANGS.has(f.lang)) fail("fence", `${where}:${f.n}`, `許容外のフェンス言語: ${f.lang}（許容: ${[...FENCE_LANGS].join(", ")}）`);
  }

  // headings
  const h1s = prose.filter((p) => /^# /.test(p.line));
  if (h1s.length !== 1) fail("heading", where, `H1 はちょうど 1 つ（${h1s.length} 個）`);
  const h1 = h1s[0]?.line.slice(2).trim() ?? "";
  const expectTitle = titleByPath.get(ch.relPath);
  if (expectTitle && h1 !== expectTitle) fail("heading", where, `H1「${h1}」が SUMMARY.md のタイトル「${expectTitle}」と一致しない`);
  if (ch.appendix) {
    if (!/^[A-D]\. /.test(h1)) fail("heading", where, `付録の H1 は「A. タイトル」の形: ${h1}`);
  } else if (!/^\d+\.\d+ /.test(h1)) fail("heading", where, `章の H1 は「N.M タイトル」の形: ${h1}`);
  if (prose.some((p) => /^#{4,} /.test(p.line))) fail("heading", where, "#### 以下の見出しは使わない");
  const h2s = prose.filter((p) => /^## /.test(p.line)).map((p) => p.line.slice(3).trim());
  const idx = (name) => h2s.indexOf(name);
  if (idx("出典") < 0) fail("sections", where, "`## 出典` 節が無い");
  else if (idx("出典") !== h2s.length - 1) fail("sections", where, "`## 出典` は最後の節にする");
  if (!ch.appendix) {
    if (idx("この章で学ぶこと") < 0) fail("sections", where, "`## この章で学ぶこと` 節が無い");
    if (idx("まとめ") < 0) fail("sections", where, "`## まとめ` 節が無い");
    if (idx("この章で学ぶこと") >= 0 && idx("まとめ") >= 0 && idx("この章で学ぶこと") > idx("まとめ")) fail("sections", where, "節の順序: 学ぶこと → 本文 → まとめ → 出典");
    if (idx("まとめ") >= 0 && idx("出典") >= 0 && idx("まとめ") > idx("出典")) fail("sections", where, "`## まとめ` は `## 出典` の前");
    if (idx("つまずきポイント") >= 0 && idx("まとめ") >= 0 && idx("つまずきポイント") > idx("まとめ")) fail("sections", where, "`## つまずきポイント` は `## まとめ` の前");
  }

  // blockquote labels, root-absolute links, html tags
  for (const p of prose) {
    const q = p.line.match(/^> \*\*([^*]+)\*\*/);
    if (q && !QUOTE_LABELS.has(q[1])) fail("quote", `${where}:${p.n}`, `引用ラベルは 注意/補足/推定/参照 のみ: ${q[1]}`);
    if (/\]\(\/[^)]/.test(p.line)) fail("link", `${where}:${p.n}`, "ルート絶対パスのリンク（/first/… /claude/…）は使わない");
    const noCode = stripCodeSpans(p.line);
    if (/<[a-zA-Z][\w-]*(\s[^>]*)?>/.test(noCode)) fail("html", `${where}:${p.n}`, "HTML タグ（またはコードスパン外の <placeholder>）は使わない");
    if (/\]\((\.\.\/)+claude\/[^)]*\.md(#[^)]*)?\)/.test(p.line)) fail("link", `${where}:${p.n}`, "claude 版へのリンクは .html で書く（.md は書き換えられず 404）");
  }

  // 出典 section lines
  const startIdx = prose.findIndex((p) => p.line.trim() === "## 出典");
  const sourceSection = startIdx >= 0 ? prose.slice(startIdx + 1) : [];
  let sourceCount = 0;
  let estimateLines = 0;
  for (const p of sourceSection) {
    if (!p.line.startsWith("- ")) continue;
    sourceCount++;
    const m = p.line.match(/^- \[([^\]]+)\] (`[^`]+`)?\s*([^—]*?)\s*—\s*(.+)$/);
    if (!m) { fail("source", `${where}:${p.n}`, "出典行の形は「- [名前空間] `パス` 位置 — 主張」"); continue; }
    const [, ns, code, position, claim] = m;
    if (!NAMESPACES.has(ns)) { fail("source", `${where}:${p.n}`, `名前空間は [2.8.2] / [runtime] / [record] / [推定] のみ: [${ns}]`); continue; }
    if (ns === "推定") { estimateLines++; continue; }
    if (!code) { fail("source", `${where}:${p.n}`, "パスはコードスパンで書く"); continue; }
    const path = code.slice(1, -1);
    if (/:\d+/.test(position) || /行/.test(position)) warn("source", `${where}:${p.n}`, "位置は見出し名かシンボル名で示す（行番号は版でずれる）");
    sourceLines.push({ where: `${where}:${p.n}`, ns, path, position, claim });
  }
  if (sourceCount === 0 && idx("出典") >= 0) fail("source", where, "`## 出典` 節に出典行が無い");
  // 「（推定）」 in body ↔ [推定] lines
  const bodyText = prose.filter((p) => startIdx < 0 || p.n < prose[startIdx].n).map((p) => p.line).join("\n");
  const bodyEstimates = (bodyText.match(/（推定）/g) ?? []).length;
  estimateBodyMentions += bodyEstimates;
  if (bodyEstimates > 0 && estimateLines === 0) fail("estimate", where, "本文に「（推定）」があるのに出典節に [推定] 行が無い");
  if (estimateLines > 0 && bodyEstimates === 0) fail("estimate", where, "出典節に [推定] 行があるのに本文に「（推定）」が無い");

  // char count (body = after H1 up to ## 出典, minus fences (already excluded) and table lines)
  const bodyLines = prose.filter((p) => !/^# /.test(p.line) && (startIdx < 0 || p.n < prose[startIdx].n) && !/^\s*\|/.test(p.line));
  const chars = [...bodyLines.map((p) => p.line.trim()).join("")].length;
  if (ch.appendix) {
    if (chars > 6000) fail("length", where, `付録の本文が上限 6,000 文字を超える（${chars}）`);
  } else if (chars < 2000 || chars > 6000) {
    fail("length", where, `本文の文字数が 2,000〜6,000 の範囲外（${chars}）`);
  }
  info.push(`${where}: ${chars} 文字、出典 ${sourceCount} 行、フェンス ${fences.length}`);
}

// ---------- 4. source path existence ----------
function ensureClone() {
  const envDir = process.env.AIDLC_WORKFLOWS_DIR;
  const candidates = [envDir, join(tmpdir(), `aidlc-workflows-${TAG}`)].filter(Boolean);
  for (const c of candidates) {
    if (existsSync(join(c, ".git"))) {
      try {
        execFileSync("git", ["-C", c, "cat-file", "-e", `${TAG}:README.md`], { stdio: "ignore" });
        return c;
      } catch { /* try next */ }
    }
  }
  const dest = candidates[candidates.length - 1];
  try {
    execFileSync("git", ["clone", "--quiet", "--depth", "1", "--branch", TAG, "https://github.com/awslabs/aidlc-workflows.git", dest], { stdio: "ignore" });
    return dest;
  } catch (e) {
    return null;
  }
}
let clone = null;
if (sourceLines.some((s) => s.ns === "2.8.2")) {
  clone = ensureClone();
  if (!clone) fail("source", "clone", `awslabs/aidlc-workflows のタグ ${TAG} を取得できない（AIDLC_WORKFLOWS_DIR を設定するか、ネットワークを確認）`);
}
const cache = new Map();
for (const s of sourceLines) {
  if (s.ns === "2.8.2") {
    if (!clone) continue;
    const key = `t:${s.path}`;
    if (!cache.has(key)) {
      const r = spawnSync("git", ["-C", clone, "cat-file", "-e", `${TAG}:${s.path}`]);
      cache.set(key, r.status === 0);
    }
    if (!cache.get(key)) fail("source", s.where, `[2.8.2] のパスがタグ ${TAG} に無い: ${s.path}`);
  } else {
    if (!existsSync(join(root, s.path))) fail("source", s.where, `[${s.ns}] のパスがリポジトリに無い: ${s.path}`);
    if (s.ns === "runtime" && !s.path.startsWith("first/.claude/")) fail("source", s.where, "[runtime] は first/.claude/ 配下のパス");
    if (s.ns === "record" && !s.path.startsWith("first/aidlc/")) fail("source", s.where, "[record] は first/aidlc/ 配下のパス");
  }
}

// ---------- 5. HTML link resolution ----------
function checkHtmlTree(dir, sink, label) {
  const files = walk(dir, (p) => p.endsWith(".html"));
  const external = new Set();
  for (const f of files) {
    const html = readFileSync(f, "utf-8");
    for (const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const raw = m[1];
      if (/^(https?:)?\/\//.test(raw)) { if (/^https?:/.test(raw)) external.add(raw); continue; }
      if (/^(mailto:|javascript:|#|data:)/.test(raw)) continue;
      const [pathPart] = raw.split("#");
      if (!pathPart) continue;
      if (/\.md$/i.test(pathPart)) { sink("link", `${rel(f)}`, `未解決の .md リンク: ${raw}`); continue; }
      let target = resolve(dirname(f), decodeURIComponent(pathPart));
      if (!target.startsWith(SITE)) { sink("link", rel(f), `_site の外を指すリンク: ${raw}`); continue; }
      if (existsSync(target) && statSync(target).isDirectory()) target = join(target, "index.html");
      if (!existsSync(target)) sink("link", rel(f), `リンク先が無い: ${raw}`);
    }
  }
  info.push(`${label}: ${files.length} HTML を検査`);
  return external;
}
let externalUrls = new Set();
if (existsSync(SITE_BOOK)) externalUrls = checkHtmlTree(SITE_BOOK, fail, "_site/first");
if (existsSync(join(SITE, "index.html"))) {
  // Landing page: check only this one file (its links to claude/ and first/ must resolve).
  const html = readFileSync(join(SITE, "index.html"), "utf-8");
  for (const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const raw = m[1];
    if (/^(https?:)?\/\//.test(raw) || /^(mailto:|javascript:|#|data:)/.test(raw)) continue;
    let target = resolve(SITE, decodeURIComponent(raw.split("#")[0]));
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, "index.html");
    if (!existsSync(target)) fail("link", "_site/index.html", `ランディングページのリンク先が無い: ${raw}`);
  }
  info.push("_site/index.html: ランディングページを検査");
}
if (existsSync(join(SITE, "claude"))) checkHtmlTree(join(SITE, "claude"), warn, "_site/claude (advisory)");

// ---------- 6. external URLs (advisory) ----------
if (!args.has("--no-external")) {
  for (const url of [...externalUrls].sort()) {
    if (/fonts\.googleapis|gstatic|cdnjs|jsdelivr/.test(url)) continue;
    const r = spawnSync("curl", ["-sS", "-L", "-o", "/dev/null", "-w", "%{http_code}", "--max-time", "15", url], { encoding: "utf-8" });
    const code = (r.stdout || "").trim();
    if (!/^2\d\d$/.test(code)) warn("external", url, `到達性 ${code || "error"}（advisory）`);
  }
}

// ---------- 7. hands-on replay (opt-in) ----------
if (args.has("--handson")) {
  const files = walk(join(BOOK, "docs", "04-handson"), (p) => p.endsWith(".md"));
  const cmds = [];
  for (const f of files) {
    const text = readFileSync(f, "utf-8");
    for (const m of text.matchAll(/```bash\n([\s\S]*?)```/g)) cmds.push({ file: rel(f), body: m[1] });
  }
  if (cmds.length === 0) {
    info.push("handson: 対象の bash フェンスが無い（ハンズオン章が未執筆）→ skip");
  } else {
    const work = mkdtempSync(join(tmpdir(), "first-handson-"));
    const script = cmds.map((c) => `# --- ${c.file}\n${c.body}`).join("\n");
    writeFileSync(join(work, "replay.sh"), `set -euxo pipefail\ncd "${work}"\n${script}\n`);
    info.push(`handson: ${cmds.length} 個の bash フェンスを ${work}/replay.sh に抽出`);
    const asUser = process.getuid && process.getuid() === 0 && spawnSync("id", ["-u", "aidlc"]).status === 0;
    const r = asUser
      ? spawnSync("runuser", ["-u", "aidlc", "--", "bash", join(work, "replay.sh")], { encoding: "utf-8", env: { ...process.env, HOME: work } })
      : spawnSync("bash", [join(work, "replay.sh")], { encoding: "utf-8", env: { ...process.env, HOME: work } });
    writeFileSync(join(work, "replay.log"), (r.stdout || "") + (r.stderr || ""));
    if (r.status !== 0) fail("handson", `${work}/replay.log`, `ハンズオンの再現が終了コード ${r.status} で失敗`);
    else info.push(`handson: 再現成功（ログ ${work}/replay.log）`);
  }
}

// ---------- report ----------
for (const i of info) console.log(`info     ${i}`);
for (const a of advisory) console.log(`advisory [${a.rule}] ${a.where}: ${a.msg}`);
for (const b of blocking) console.log(`BLOCKING [${b.rule}] ${b.where}: ${b.msg}`);
console.log(`\ncheck-first: blocking ${blocking.length} / advisory ${advisory.length}`);
process.exit(blocking.length > 0 ? 1 : 0);
