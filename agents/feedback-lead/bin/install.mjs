#!/usr/bin/env node
// Installs this package's Claude Code agent definition(s) into an agents
// directory. Default target is the current project (./.claude/agents);
// pass --global / -g for ~/.claude/agents. Existing files are left alone
// unless --force / -f is passed.
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const filesDir = path.join(here, "..", "files");
const args = process.argv.slice(2);
const isGlobal = args.includes("--global") || args.includes("-g");
const force = args.includes("--force") || args.includes("-f");

const target = isGlobal
  ? path.join(os.homedir(), ".claude", "agents")
  : path.join(process.cwd(), ".claude", "agents");

const names = (await fs.readdir(filesDir)).filter((f) => f.endsWith(".md"));
if (names.length === 0) {
  console.error("No agent files found in this package — nothing to install.");
  process.exit(1);
}

await fs.mkdir(target, { recursive: true });

const written = [];
const skipped = [];
for (const name of names) {
  const dest = path.join(target, name);
  const exists = await fs.access(dest).then(
    () => true,
    () => false,
  );
  if (exists && !force) {
    skipped.push(name);
    continue;
  }
  await fs.copyFile(path.join(filesDir, name), dest);
  written.push(name);
}

for (const name of written) {
  console.log(`  installed  ${path.join(target, name)}`);
}
for (const name of skipped) {
  console.log(`  skipped    ${name} (already exists — pass --force to overwrite)`);
}
if (written.length > 0) {
  console.log(
    `\nDone. Claude Code picks the agent${names.length > 1 ? "s" : ""} up ${
      isGlobal ? "in every project" : "in this project"
    } automatically.`,
  );
}
