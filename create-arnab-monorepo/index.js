#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const projectName = process.argv[2];

if (!projectName) {
  console.error("Please specify the project name:");
  console.error("  npx create-arnab-monorepo my-app");
  process.exit(1);
}

if (!/^[a-zA-Z0-9_-]+$/.test(projectName)) {
  console.error(
    `Invalid project name "${projectName}". Use only letters, numbers, hyphens, and underscores.`
  );
  process.exit(1);
}

const projectDir = path.resolve(process.cwd(), projectName);

if (fs.existsSync(projectDir)) {
  console.error(`Directory "${projectName}" already exists.`);
  process.exit(1);
}

const templateDir = path.join(__dirname, "template");

console.log(`\nCreating a new monorepo in ${projectDir}...\n`);

fs.cpSync(templateDir, projectDir, { recursive: true });

const DOTFILE_RENAMES = {
  _gitignore: ".gitignore",
  _env: ".env",
  _npmrc: ".npmrc",
};

function renameDotfiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      renameDotfiles(fullPath);
    } else if (DOTFILE_RENAMES[entry.name]) {
      const newPath = path.join(dir, DOTFILE_RENAMES[entry.name]);
      fs.renameSync(fullPath, newPath);
    }
  }
}

renameDotfiles(projectDir);

const pkgPath = path.join(projectDir, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
pkg.name = projectName;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

try {
  execSync("git init", { cwd: projectDir, stdio: "ignore" });
  console.log("  Initialized a git repository.\n");
} catch {
  console.log("  Skipped git init (git not available).\n");
}

console.log("  Installing dependencies with pnpm...\n");

try {
  execSync("pnpm install", { cwd: projectDir, stdio: "inherit" });
} catch {
  console.error(
    "\n  pnpm install failed. Make sure pnpm is installed (npm i -g pnpm) and try again.\n"
  );
  process.exit(1);
}

console.log(`
Done! Your monorepo is ready.

  cd ${projectName}
  docker compose up -d
  pnpm db:migrate
  pnpm dev

The .env files are already configured with working defaults.
Edit them to change database credentials, ports, or secrets.
`);
