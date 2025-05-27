#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const folderName = process.argv[2] || 'my-app';

console.log(`Creating project in folder: ${folderName}`);

fs.mkdirSync(folderName);

fs.writeFileSync(path.join(folderName, 'README.md'), '# Welcome to your new project!\n');

fs.mkdirSync(path.join(folderName, 'src'));
fs.writeFileSync(path.join(folderName, 'src', 'index.js'), 'console.log("Hello from your new app!");');

console.log('Project created successfully!');
