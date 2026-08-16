import { transformWithEsbuild } from 'vite';
import fs from 'node:fs/promises';
const files = process.argv.slice(2);
for (const f of files) {
  const src = await fs.readFile(f, 'utf8');
  const loader = f.endsWith('.tsx') ? 'tsx' : 'ts';
  const out = await transformWithEsbuild(src, f, { loader, jsx: 'preserve', target: 'esnext', format: 'esm' });
  const dest = f.replace(/\.tsx$/, '.jsx').replace(/\.ts$/, '.js');
  await fs.writeFile(dest, out.code);
  if (dest !== f) await fs.rm(f);
  console.log(dest);
}
