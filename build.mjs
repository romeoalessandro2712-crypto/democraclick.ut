// build.mjs — production build → dist/site/ (upload that folder to your web server).
//   npm install && npm run build
// What it does:
//   • bundles + minifies JS
//   • self-hosts the two typefaces: the live site makes NO third-party requests
//   • writes each section's content into the HTML (tools/prerender.mjs) for search engines / no-JS
//   • content-hashed file names, source maps, robots.txt, sitemap.xml, web manifest
//   • _headers (Netlify / Cloudflare Pages) and .htaccess (Apache): CSP, security and cache headers
import { build, transform } from 'esbuild';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { injectPrerender } from './tools/prerender.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, 'dist', 'site');
const SITE = 'https://www.democraclick.com/';
const require = createRequire(import.meta.url); // packages resolve from this project's node_modules
const pkgFile = (spec) => require.resolve(spec);
const hash = (buf) => crypto.createHash('sha256').update(buf).digest('hex').slice(0, 10);
const today = new Date().toISOString().slice(0, 10);

async function main() {
  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(path.join(OUT, 'assets'), { recursive: true });
  await fs.mkdir(path.join(OUT, 'fonts'), { recursive: true });

  // 1 · JavaScript: main entry
  const js = await build({
    entryPoints: [path.join(ROOT, 'main.js')],
    bundle: true, splitting: true, format: 'esm', minify: true, sourcemap: true,
    target: ['es2020'], outdir: path.join(OUT, 'assets'),
    entryNames: '[name]-[hash]', chunkNames: 'chunk-[hash]',
    metafile: true, legalComments: 'eof', logLevel: 'warning',
  });
  const mainOut = Object.keys(js.metafile.outputs).find((f) => f.endsWith('.js') && /(^|\/)main\.js$/.test(js.metafile.outputs[f].entryPoint || ''));
  if (!mainOut) throw new Error('main.js output not found');
  const mainFile = path.basename(mainOut);


  // 3 · Fonts (SIL Open Font License), Latin subsets only
  const fonts = [
    ['@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2', 'Fraunces', 'normal'],
    ['@fontsource-variable/fraunces/files/fraunces-latin-opsz-italic.woff2', 'Fraunces', 'italic'],
    ['@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2', 'Inter Tight', 'normal'],
  ];
  const range = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
  let fontCss = '';
  const fontFiles = [];
  for (const [spec, family, style] of fonts) {
    const buf = await fs.readFile(pkgFile(spec));
    const name = `${path.basename(spec, '.woff2')}-${hash(buf)}.woff2`;
    await fs.writeFile(path.join(OUT, 'fonts', name), buf);
    fontFiles.push({ name, style, family });
    fontCss += `@font-face{font-family:'${family}';font-style:${style};font-display:swap;font-weight:100 900;src:url(../fonts/${name}) format('woff2');unicode-range:${range}}`;
  }
  for (const lic of ['@fontsource-variable/fraunces/LICENSE', '@fontsource-variable/inter-tight/LICENSE']) {
    await fs.copyFile(pkgFile(lic), path.join(OUT, 'fonts', `${lic.split('/')[1]}-OFL.txt`));
  }

  // 4 · CSS
  const cssSrc = await fs.readFile(path.join(ROOT, 'styles.css'), 'utf8');
  const css = (await transform(fontCss + cssSrc, { loader: 'css', minify: true })).code;
  const cssFile = `styles-${hash(css)}.css`;
  await fs.writeFile(path.join(OUT, 'assets', cssFile), css);

  // 5 · index.html
  let html = await fs.readFile(path.join(ROOT, 'index.html'), 'utf8');
  html = html
    .replace(/\s*<link rel="preconnect"[^>]*>/g, '')
    .replace(/\s*<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/, '')
    .replace(/\s*<script type="importmap">[\s\S]*?<\/script>/, '')
    .replace('<link rel="stylesheet" href="styles.css">',
      fontFiles.filter((f) => f.style === 'normal').map((f) => `<link rel="preload" href="fonts/${f.name}" as="font" type="font/woff2" crossorigin>`).join('\n')
      + `\n<link rel="stylesheet" href="assets/${cssFile}">`)
    .replace('<script type="module" src="main.js"></script>', `<link rel="modulepreload" href="assets/${mainFile}">\n<script type="module" src="assets/${mainFile}"></script>`);
  html = injectPrerender(html);
  if (/googleapis|gstatic|jsdelivr|cdnjs/.test(html)) throw new Error('index.html still references a CDN');
  await fs.writeFile(path.join(OUT, 'index.html'), html);

  // inline scripts that must be allowed by the CSP (the pre-paint theme bootstrap)
  const inlineHashes = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => `'sha256-${crypto.createHash('sha256').update(m[1]).digest('base64')}'`);

  // 6 · privacy.html: nothing third-party in this build, so say so
  let privacy = await fs.readFile(path.join(ROOT, 'privacy.html'), 'utf8');
  privacy = privacy
    .replace(/<!--THIRDPARTY-IT:start-->[\s\S]*?<!--THIRDPARTY-IT:end-->/, `<h2>Nessun servizio esterno</h2>
    <p>Caratteri tipografici e librerie grafiche sono ospitati sul nostro server. Il sito non chiede file ad altri servizi: il tuo browser comunica solo con www.democraclick.com (con l’unica eccezione dell’accesso con Google, descritta sotto, che parte solo se lo scegli), che registra i dati tecnici di ogni visita come qualsiasi server web. <span class="ph">[DA COMPLETARE: quali log tiene il server e per quanto tempo]</span></p>`)
    .replace(/<!--THIRDPARTY-EN:start-->[\s\S]*?<!--THIRDPARTY-EN:end-->/, `<h2>No outside services</h2>
    <p>Typefaces and graphics libraries are hosted on our own server. The site requests no files from other services: your browser talks only to www.democraclick.com (the one exception is Google sign-in, described below, which starts only if you choose it), which logs the technical details of each visit like any web server. <span class="ph">[TO COMPLETE: which logs the server keeps and for how long]</span></p>`);
  const privacyHashes = [...privacy.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => `'sha256-${crypto.createHash('sha256').update(m[1]).digest('base64')}'`);
  await fs.writeFile(path.join(OUT, 'privacy.html'), privacy);

  // 7 · static extras
  const assetsDir = path.join(ROOT, 'assets');
  for (const f of ['og-image.jpg']) await fs.copyFile(path.join(assetsDir, f), path.join(OUT, f)).catch(() => console.warn(`! missing assets/${f}`));
  await fs.mkdir(path.join(OUT, 'icons'), { recursive: true });
  for (const f of ['icon-180.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'favicon.svg']) {
    await fs.copyFile(path.join(assetsDir, 'icons', f), path.join(OUT, 'icons', f)).catch(() => console.warn(`! missing assets/icons/${f}`));
  }
  // the logo files (light and dark), e.g. for press or partners
  await fs.mkdir(path.join(OUT, 'logo'), { recursive: true });
  for (const f of ['logo-light.svg', 'logo-dark.svg', 'logo-light.png', 'logo-dark.png']) await fs.copyFile(path.join(assetsDir, 'logo', f), path.join(OUT, 'logo', f));
  await fs.writeFile(path.join(OUT, 'manifest.webmanifest'), JSON.stringify({
    name: 'DemocraClick', short_name: 'DemocraClick', lang: 'it',
    description: 'Promises. Tracked. Un progetto indipendente per orientarsi tra programmi, dati e idee.',
    start_url: './', scope: './', display: 'standalone', background_color: '#183644', theme_color: '#0E4A5A',
    icons: [
      { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: 'icons/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  }, null, 2));
  await fs.writeFile(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`);
  await fs.writeFile(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>${SITE}privacy.html</loc><lastmod>${today}</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
</urlset>\n`);

  // 8 · security + cache headers
  const csp = (hashes) => [
    // Google Identity Services (COMMUNITY sign-in) is allowed but loads only after a click; profile
    // photos come from lh3.googleusercontent.com. If the posts API lives on another origin, add it to connect-src.
    "default-src 'self'", `script-src 'self' https://accounts.google.com/gsi/client ${hashes.join(' ')}`.trim(),
    "style-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/style",
    "img-src 'self' data: blob: https://lh3.googleusercontent.com", "font-src 'self'",
    "connect-src 'self' https://accounts.google.com/gsi/", "frame-src https://accounts.google.com/gsi/", "object-src 'none'",
    "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'", 'upgrade-insecure-requests',
  ].join('; ');
  const common = {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups', // Google sign-in uses a popup
    'Strict-Transport-Security': 'max-age=31536000',
  };
  const block = (o) => Object.entries(o).map(([k, v]) => `  ${k}: ${v}`).join('\n');
  await fs.writeFile(path.join(OUT, '_headers'), `/*\n${block(common)}\n
/\n  Content-Security-Policy: ${csp(inlineHashes)}\n  Cache-Control: no-cache\n
/index.html\n  Content-Security-Policy: ${csp(inlineHashes)}\n  Cache-Control: no-cache\n
/privacy.html\n  Content-Security-Policy: ${csp(privacyHashes)}\n  Cache-Control: no-cache\n
/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n
/fonts/*\n  Cache-Control: public, max-age=31536000, immutable\n  Access-Control-Allow-Origin: *\n
/icons/*\n  Cache-Control: public, max-age=604800\n`);
  await fs.writeFile(path.join(OUT, '.htaccess'), `# Apache: security, compression and caching for DemocraClick
<IfModule mod_headers.c>
${Object.entries(common).map(([k, v]) => `  Header always set ${k} "${v}"`).join('\n')}
  <FilesMatch "^(index\\.html)?$">
    Header always set Content-Security-Policy "${csp(inlineHashes)}"
    Header set Cache-Control "no-cache"
  </FilesMatch>
  <FilesMatch "^privacy\\.html$">
    Header always set Content-Security-Policy "${csp(privacyHashes)}"
    Header set Cache-Control "no-cache"
  </FilesMatch>
  <FilesMatch "\\.(js|css|woff2|map)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
</IfModule>
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml application/manifest+json text/plain application/xml
</IfModule>
AddType application/manifest+json .webmanifest
AddType font/woff2 .woff2
`);

  // 9 · single-file version (CDN-based, for hosts that take one HTML file) + the Claude preview copy
  const single = await build({
    entryPoints: [path.join(ROOT, 'main.js')], bundle: true, format: 'esm', minify: true, write: false,
    external: ['three', 'three/addons/*'], legalComments: 'none', logLevel: 'warning',
  });
  const bundleJs = single.outputFiles[0].text;
  if (/^import /m.test(bundleJs) || bundleJs.includes('</script')) throw new Error('single-file bundle is not inline-safe');
  let one = await fs.readFile(path.join(ROOT, 'index.html'), 'utf8');
  one = injectPrerender(one)
    .replace('<link rel="stylesheet" href="styles.css">', () => `<style>\n${cssSrc}\n</style>`)
    .replace('<script type="module" src="main.js"></script>', () => `<script type="module">\n${bundleJs}\n</script>`);
  await fs.writeFile(path.join(ROOT, 'dist', 'democraclick-agora.html'), one);
  const head = one.match(/<head>([\s\S]*)<\/head>/)[1], body = one.match(/<body>([\s\S]*)<\/body>/)[1];
  const preview = head.replace('<meta charset="utf-8">', '').replace(/<meta name="viewport"[^>]*>/, '')
    .replace('<title>DemocraClick</title>', '<title>DemocraClick Agorà</title>\n<meta name="claude:viewport-fit-sides" content="cover">').trim() + '\n' + body;
  await fs.writeFile(path.join(ROOT, 'dist', 'preview.html'), preview);

  // 10 · report
  const files = [];
  async function walk(d) { for (const e of await fs.readdir(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) await walk(p); else files.push(p); } }
  await walk(OUT);
  const zlib = await import('node:zlib');
  let total = 0, gz = 0;
  for (const f of files.filter((x) => !x.endsWith('.map'))) { const b = await fs.readFile(f); total += b.length; gz += zlib.gzipSync(b).length; }
  console.log(`dist/site: ${files.length} files · ${(total / 1024).toFixed(0)} KB (${(gz / 1024).toFixed(0)} KB gzip, maps excluded) · entry assets/${mainFile}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
