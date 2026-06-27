import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const OUT = '/home/user/muul/public'
mkdirSync(OUT, { recursive: true })

// Icon design: full-bleed black, white MÚUL wordmark, teal accent underline.
// Uses viewport units so one HTML scales cleanly to every output size.
const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@800;900&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:100%;height:100%}
  .tile{width:100vw;height:100vh;background:#000;display:flex;
    align-items:center;justify-content:center}
  .word{font-family:'Geist','Helvetica Neue',Arial,sans-serif;font-weight:800;
    color:#fff;font-size:23vw;letter-spacing:-.05em;line-height:1.18;
    text-transform:uppercase;background:#0E7C7B;padding:0 4vw 1.5vw;
    -webkit-box-decoration-break:clone;box-decoration-break:clone}
</style></head>
<body><div class="tile"><span class="word">MÚUL</span></div></body></html>`

const sizes = [
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-1024.png', size: 1024 },
  { name: 'favicon-64.png', size: 64 },
]

const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN })
try {
  for (const { name, size } of sizes) {
    const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 })
    await page.setContent(html, { waitUntil: 'load' })
    // give web fonts a moment; fall back gracefully if blocked
    await page.evaluate(() => Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]))
    await page.screenshot({ path: `${OUT}/${name}`, clip: { x: 0, y: 0, width: size, height: size } })
    await page.close()
    console.log('wrote', name, size)
  }
} finally {
  await browser.close()
}
