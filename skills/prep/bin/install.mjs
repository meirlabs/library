#!/usr/bin/env node
// Installs this package's Claude Code skill into a skills directory. The
// skill's folder name comes from the package name (everything after
// "skill-"). Default target is the current project (./.claude/skills);
// pass --global / -g for ~/.claude/skills. An existing skill folder is left
// alone unless --force / -f is passed.
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  await fs.readFile(path.join(here, "..", "package.json"), "utf8"),
);
const skillName = pkg.name.slice(pkg.name.lastIndexOf("skill-") + "skill-".length);
const filesDir = path.join(here, "..", "files");
const args = process.argv.slice(2);
const isGlobal = args.includes("--global") || args.includes("-g");
const force = args.includes("--force") || args.includes("-f");

const base = isGlobal
  ? path.join(os.homedir(), ".claude", "skills")
  : path.join(process.cwd(), ".claude", "skills");
const target = path.join(base, skillName);

const exists = await fs.access(target).then(
  () => true,
  () => false,
);
if (exists && !force) {
  console.log(`  skipped    ${target} (already exists — pass --force to overwrite)`);
  process.exit(0);
}

const names = (await fs.readdir(filesDir)).filter((f) => f.endsWith(".md"));
if (names.length === 0) {
  console.error("No skill files found in this package — nothing to install.");
  process.exit(1);
}

await fs.mkdir(target, { recursive: true });
for (const name of names) {
  await fs.copyFile(path.join(filesDir, name), path.join(target, name));
  console.log(`  installed  ${path.join(target, name)}`);
}
// Optional references/ subdir (deep skills): copy its .md files too.
try {
  const refDir = path.join(filesDir, "references");
  const refNames = (await fs.readdir(refDir)).filter((f) => f.endsWith(".md"));
  if (refNames.length) {
    await fs.mkdir(path.join(target, "references"), { recursive: true });
    for (const name of refNames) {
      await fs.copyFile(
        path.join(refDir, name),
        path.join(target, "references", name),
      );
      console.log(`  installed  ${path.join(target, "references", name)}`);
    }
  }
} catch {}
console.log(
  `\nDone. Claude Code picks the "${skillName}" skill up ${
    isGlobal ? "in every project" : "in this project"
  } automatically.`,
);
