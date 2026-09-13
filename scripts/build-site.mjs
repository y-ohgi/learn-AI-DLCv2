// Builds the whole GitHub Pages site into _site/:
//   _site/index.html   <- site/index.html (landing page)
//   _site/claude/      <- HonKit build of claude/ (the first edition, written directly by Claude Code)
//   _site/first/       <- HonKit build of first/  (the edition produced by running AI-DLC v2)
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const out = resolve(root, "_site");

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const books = [
  { dir: "claude", label: "claude edition" },
  { dir: "first", label: "first (AI-DLC v2) edition" },
];

for (const { dir, label } of books) {
  const src = resolve(root, dir);
  if (!existsSync(resolve(src, "SUMMARY.md"))) {
    console.warn(`[build-site] skip ${label}: ${dir}/SUMMARY.md not found`);
    continue;
  }
  console.log(`[build-site] building ${label} -> _site/${dir}`);
  execSync(`npx honkit build "${src}" "${resolve(out, dir)}"`, { stdio: "inherit", cwd: root });
}

cpSync(resolve(root, "site"), out, { recursive: true });
// GitHub Pages: keep directories that start with an underscore (HonKit emits none, but be safe).
writeFileSync(resolve(out, ".nojekyll"), "");
console.log("[build-site] done");
