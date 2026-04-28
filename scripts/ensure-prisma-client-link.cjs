/*
Ensures `node_modules/@prisma/client/.prisma` exists and points to `node_modules/.prisma`.

On some Windows setups, Prisma generates into `node_modules/.prisma` but the scoped
package `@prisma/client` doesn’t get the expected `.prisma` directory/symlink.
That breaks both runtime `require('.prisma/client/default')` and TS typings.
*/

const fs = require('node:fs');
const path = require('node:path');

function exists(p) {
  try {
    fs.lstatSync(p);
    return true;
  } catch {
    return false;
  }
}

function safeRemove(p) {
  try {
    fs.rmSync(p, { recursive: true, force: true });
  } catch {
    // ignore
  }
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function main() {
  const root = process.cwd();
  const source = path.join(root, 'node_modules', '.prisma');
  const dest = path.join(root, 'node_modules', '@prisma', 'client', '.prisma');

  if (!exists(source)) {
    console.warn('[ensure-prisma-client-link] Missing source:', source);
    process.exit(0);
  }

  // If it already exists, assume OK.
  if (exists(dest)) {
    process.exit(0);
  }

  // Ensure parent exists.
  ensureDir(path.dirname(dest));

  try {
    const type = process.platform === 'win32' ? 'junction' : 'dir';
    fs.symlinkSync(source, dest, type);
    process.exit(0);
  } catch (err) {
    // Fallback: copy folder (works without symlink permissions).
    try {
      safeRemove(dest);
      fs.cpSync(source, dest, { recursive: true });
      process.exit(0);
    } catch (copyErr) {
      console.warn('[ensure-prisma-client-link] Failed to link/copy .prisma into @prisma/client');
      console.warn(String(err));
      console.warn(String(copyErr));
      process.exit(0);
    }
  }
}

main();
