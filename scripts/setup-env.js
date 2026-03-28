import { copyFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const envFiles = [
  ".",
  "apps/expressWeb",
  "packages/backend-common",
  "packages/sqlDb",
  "packages/nosqlDb",
];

let copied = 0;
let skipped = 0;

for (const dir of envFiles) {
  const demo = resolve(root, dir, ".env.demo");
  const target = resolve(root, dir, ".env");

  if (!existsSync(demo)) {
    console.log(`  skip  ${dir}/.env.demo (not found)`);
    continue;
  }

  if (existsSync(target)) {
    console.log(`  skip  ${dir}/.env (already exists)`);
    skipped++;
    continue;
  }

  copyFileSync(demo, target);
  console.log(`  copy  ${dir}/.env.demo -> ${dir}/.env`);
  copied++;
}

console.log(`\nDone: ${copied} copied, ${skipped} skipped (already existed).`);
if (copied > 0) {
  console.log("Edit the .env files if you need to change any values.");
}
