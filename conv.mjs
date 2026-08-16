import { transformWithOxc } from 'vite';
import fs from 'node:fs/promises';
for (const f of process.argv.slice(2)) {
  const src = await fs.readFile(f, 'utf8');
  const out = await transformWithOxc(src, f, { lang: f.endsWith('.tsx') ? 'tsx' : 'ts', jsx: 'preserve' });
  const dest = f.replace(/\.tsx$/, '.jsx').replace(/\.ts$/, '.js');
  await fs.writeFile(dest, out.code);
  if (dest !== f) await fs.rm(f);
  console.log(dest);
}
