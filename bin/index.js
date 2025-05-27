#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const folderName = process.argv[2] || 'my-app';

console.log(`Creating project in folder: ${folderName}`);

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    fs.readdirSync(src).forEach((childItemName) => {
      if (childItemName === 'node_modules') return;
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

const sourceDir = path.resolve(__dirname, '..');
const targetDir = path.resolve(process.cwd(), folderName);

if (fs.existsSync(targetDir)) {
  console.error('Target directory already exists.');
  process.exit(1);
}

fs.mkdirSync(targetDir);
copyRecursiveSync(sourceDir, targetDir);
console.log('Project copied successfully!');
