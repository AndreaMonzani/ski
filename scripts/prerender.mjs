import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
const { render } = await import(path.join(distDir, 'server/entry-server.js'));

const routes = [
  '/',
  '/en',
  '/specimen',
  '/privacy',
  '/cookie',
  '/note-legali',
  '/en/privacy',
  '/en/cookie',
  '/en/legal-notice',
];

for (const route of routes) {
  const { html, head, locale } = render(route);
  const page = template
    .replace('<html lang="it">', `<html lang="${locale}">`)
    .replace('<!--app-head-->', head)
    .replace('<!--app-html-->', html);

  const outPath =
    route === '/'
      ? path.join(distDir, 'index.html')
      : path.join(distDir, route.replace(/^\//, ''), 'index.html');

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, page, 'utf-8');
}

// Clean up server bundle so Vercel only serves static client assets
fs.rmSync(path.join(distDir, 'server'), { recursive: true, force: true });
console.log(`Prerendered ${routes.length} routes successfully.`);