#!/usr/bin/env node
// Static hosts (Vercel) serve /404.html for unknown URLs. Angular prerenders /404/index.html.
import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const out = resolve(import.meta.dirname, '../dist/portfolio-ng/browser');
const src = resolve(out, '404/index.html');
if (!existsSync(src)) {
  console.error('[postbuild] 404/index.html was not prerendered');
  process.exit(1);
}
copyFileSync(src, resolve(out, '404.html'));
console.log('[postbuild] wrote 404.html');
