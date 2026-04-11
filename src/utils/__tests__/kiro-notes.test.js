import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import fc from "fast-check";

// ─── Helper functions ────────────────────────────────────────────────────────

/**
 * Parse YAML frontmatter between --- delimiters.
 * Returns a plain object or null if no valid frontmatter found.
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const yaml = match[1];
  const result = {};
  for (const line of yaml.split(/\r?\n/)) {
    // Handle array items (- value)
    const arrayItem = line.match(/^  - (.+)$/);
    if (arrayItem) {
      const lastKey = Object.keys(result).pop();
      if (lastKey && Array.isArray(result[lastKey])) {
        result[lastKey].push(arrayItem[1].trim());
      }
      continue;
    }
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    const val = kv[2].trim();
    if (val === "") {
      // Next lines may be array items
      result[key] = [];
    } else {
      // Strip surrounding quotes if present
      result[key] = val.replace(/^['"]|['"]$/g, "");
    }
  }
  return result;
}

/**
 * Remove frontmatter block from content, return body only.
 */
function stripFrontmatter(content) {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
}

/**
 * Remove frontmatter AND fenced code blocks (``` wrapped), return remaining text.
 */
function stripFrontmatterAndCodeBlocks(content) {
  const noFm = stripFrontmatter(content);
  return noFm.replace(/```[\s\S]*?```/g, "");
}

/**
 * Count Chinese characters in a string.
 * Covers CJK Unified Ideographs and CJK Extension A.
 */
function countChineseChars(str) {
  if (!str) return 0;
  const matches = str.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g);
  return matches ? matches.length : 0;
}

/**
 * Extract all #/note/... links from markdown content.
 */
function extractLinks(content) {
  const matches = content.match(/#\/note\/[^\s)>\]"']+/g);
  return matches || [];
}

// ─── Path setup ──────────────────────────────────────────────────────────────

const workspaceRoot = path.resolve(process.cwd());
const kiroDir = path.resolve(workspaceRoot, "public/notes/AI工具/Kiro");
const dirFile = path.resolve(kiroDir, "目录.md");
const indexFile = path.resolve(workspaceRoot, "public/notes-index.json");

// Collect note files at test runtime (exclude 目录.md)
function getNoteFiles() {
  if (!fs.existsSync(kiroDir)) return [];
  return fs
    .readdirSync(kiroDir)
    .filter((f) => f.endsWith(".md") && f !== "目录.md")
    .map((f) => path.join(kiroDir, f));
}

// ─── Unit tests ──────────────────────────────────────────────────────────────

describe("kiro-notes 单元测试", () => {
  it("文件集合完整性：Kiro 目录下恰好有 6 篇笔记（不含目录.md）", () => {
    const files = getNoteFiles();
    expect(files).toHaveLength(6);
  });

  it("目录文件结构：包含 4 个区块且推荐阅读顺序有 6 条链接", () => {
    const content = fs.readFileSync(dirFile, "utf-8");
    expect(content).toContain("更新时间");
    expect(content).toContain("推荐阅读顺序");
    expect(content).toContain("覆盖主题");
    expect(content).toContain("快速查找");
    const links = extractLinks(content);
    const orderLinks = links.filter((l) => l.startsWith("#/note/AI工具/Kiro/"));
    expect(orderLinks).toHaveLength(6);
  });

  it("索引生成结果：notes-index.json 合法且含 6 条 Kiro 条目", () => {
    const raw = fs.readFileSync(indexFile, "utf-8");
    const index = JSON.parse(raw);
    // notes-index.json may be a flat array or { categories: [...] } object
    const allNotes = Array.isArray(index)
      ? index
      : (index.categories || []).flatMap((cat) => cat.notes || []);
    const kiroEntries = allNotes.filter(
      (entry) =>
        entry.category === "AI工具" &&
        Array.isArray(entry.tags) &&
        entry.tags.includes("Kiro"),
    );
    expect(kiroEntries).toHaveLength(6);
  });
});

// ─── Property tests ──────────────────────────────────────────────────────────

describe("kiro-notes 属性测试", () => {
  it("Property 1: frontmatter 完整性", () => {
    const noteFiles = getNoteFiles();
    if (noteFiles.length === 0) return;

    // Feature: kiro-notes-enhancement, Property 1: frontmatter 完整性
    fc.assert(
      fc.property(fc.constantFrom(...noteFiles), (file) => {
        const fm = parseFrontmatter(fs.readFileSync(file, "utf-8"));
        return (
          fm !== null &&
          "title" in fm &&
          "date" in fm &&
          "category" in fm &&
          "tags" in fm &&
          "description" in fm &&
          !("attachments" in fm)
        );
      }),
      { numRuns: 100 },
    );
  });

  it("Property 2: frontmatter 字段值合法性", () => {
    const noteFiles = getNoteFiles();
    if (noteFiles.length === 0) return;

    // Feature: kiro-notes-enhancement, Property 2: frontmatter 字段值合法性
    fc.assert(
      fc.property(fc.constantFrom(...noteFiles), (file) => {
        const fm = parseFrontmatter(fs.readFileSync(file, "utf-8"));
        const dateValid = /^\d{4}-\d{2}-\d{2}$/.test(fm.date);
        const categoryValid = fm.category === "AI工具";
        const tagsValid =
          Array.isArray(fm.tags) &&
          fm.tags.length >= 3 &&
          fm.tags.length <= 6 &&
          fm.tags.includes("Kiro");
        const descLen = countChineseChars(fm.description);
        const descValid = descLen >= 60 && descLen <= 120;
        return dateValid && categoryValid && tagsValid && descValid;
      }),
      { numRuns: 100 },
    );
  });

  it("Property 3: 文件命名规范", () => {
    const noteFiles = getNoteFiles();
    if (noteFiles.length === 0) return;

    // Feature: kiro-notes-enhancement, Property 3: 文件命名规范
    fc.assert(
      fc.property(fc.constantFrom(...noteFiles), (file) => {
        const name = path.basename(file);
        return /^第[一二三四五六七八九十]+篇_Kiro.+_\d{4}-\d{2}\.md$/.test(
          name,
        );
      }),
      { numRuns: 100 },
    );
  });

  it("Property 4: 正文结构完整性", () => {
    const noteFiles = getNoteFiles();
    if (noteFiles.length === 0) return;

    // Feature: kiro-notes-enhancement, Property 4: 正文结构完整性
    fc.assert(
      fc.property(fc.constantFrom(...noteFiles), (file) => {
        const body = stripFrontmatter(fs.readFileSync(file, "utf-8"));
        const h1Count = (body.match(/^# .+/gm) || []).length;
        const hasToc = body.includes("[[toc]]");
        const hasCaveats = /#{2,3} (注意事项|常见问题)/.test(body);
        return h1Count === 1 && hasToc && hasCaveats;
      }),
      { numRuns: 100 },
    );
  });

  it("Property 5: 正文长度 >= 1500 中文字符", () => {
    const noteFiles = getNoteFiles();
    if (noteFiles.length === 0) return;

    // Feature: kiro-notes-enhancement, Property 5: 正文长度 >= 1500 中文字符
    fc.assert(
      fc.property(fc.constantFrom(...noteFiles), (file) => {
        const body = stripFrontmatterAndCodeBlocks(
          fs.readFileSync(file, "utf-8"),
        );
        return countChineseChars(body) >= 1500;
      }),
      { numRuns: 100 },
    );
  });

  it("Property 6: 包含 kiro.dev 来源引用", () => {
    const noteFiles = getNoteFiles();
    if (noteFiles.length === 0) return;

    // Feature: kiro-notes-enhancement, Property 6: 包含 kiro.dev 来源引用
    fc.assert(
      fc.property(fc.constantFrom(...noteFiles), (file) => {
        return fs.readFileSync(file, "utf-8").includes("kiro.dev");
      }),
      { numRuns: 100 },
    );
  });

  it("Property 7: 目录导航链接格式与文件存在性", () => {
    const dirLinks = extractLinks(fs.readFileSync(dirFile, "utf-8")).filter(
      (l) => l.startsWith("#/note/AI工具/Kiro/"),
    );

    // Guard: skip if no links yet (目录.md not yet updated)
    if (dirLinks.length === 0) return;

    // Feature: kiro-notes-enhancement, Property 7: 目录导航链接格式与文件存在性
    fc.assert(
      fc.property(fc.constantFrom(...dirLinks), (link) => {
        const slug = link.replace("#/note/AI工具/Kiro/", "");
        return fs.existsSync(path.join(kiroDir, slug + ".md"));
      }),
      { numRuns: 100 },
    );
  });
});
