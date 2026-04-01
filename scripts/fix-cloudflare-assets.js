#!/usr/bin/env node

// Cloudflare Pages filters out paths containing "node_modules" during upload.
// Expo's static web export places vendor font assets under paths like
// dist/assets/node_modules/@expo/vector-icons/...
//
// This script moves those assets to dist/assets/vendor/... and rewrites
// all references in HTML and JS files.

const fs = require('fs');
const path = require('path');

const DIST = path.resolve(__dirname, '..', 'dist');
const ASSETS = path.join(DIST, 'assets');
const NM_DIR = path.join(ASSETS, 'node_modules');
const VENDOR_DIR = path.join(ASSETS, 'vendor');

if (!fs.existsSync(NM_DIR)) {
  console.log('No node_modules assets to relocate.');
  process.exit(0);
}

// Collect all files under assets/node_modules/
function walkDir(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walkDir(NM_DIR);
const moves = [];

for (const srcFile of files) {
  const relFromAssets = path.relative(ASSETS, srcFile);
  // node_modules/@expo/vector-icons/.../FontAwesome.hash.ttf -> vendor/FontAwesome.hash.ttf
  const basename = path.basename(srcFile);
  const destFile = path.join(VENDOR_DIR, basename);
  moves.push({
    oldRef: '/assets/' + relFromAssets,
    newRef: '/assets/vendor/' + basename,
    src: srcFile,
    dest: destFile,
  });
}

// Create vendor directory
fs.mkdirSync(VENDOR_DIR, { recursive: true });

// Move files
for (const { src, dest } of moves) {
  fs.copyFileSync(src, dest);
}

// Remove original node_modules directory
fs.rmSync(NM_DIR, { recursive: true, force: true });

// Rewrite references in HTML and JS files
function rewriteFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      rewriteFiles(fullPath);
    } else if (/\.(html|js|css)$/.test(entry.name)) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;
      for (const { oldRef, newRef } of moves) {
        if (content.includes(oldRef)) {
          content = content.replaceAll(oldRef, newRef);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

rewriteFiles(DIST);

console.log(`Relocated ${moves.length} asset(s) from node_modules to vendor:`);
for (const { oldRef, newRef } of moves) {
  console.log(`  ${oldRef} -> ${newRef}`);
}
