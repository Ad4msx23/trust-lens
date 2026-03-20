const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')

const BASE_URL = 'https://trust-lens-sooty.vercel.app'
const OUTPUT_DIR = path.join(__dirname, '../public/screenshots')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function takeScreenshots() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  console.log('Launching browser...')
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })

  await page.goto(BASE_URL, { waitUntil: 'networkidle0' })
  await page.waitForSelector('[data-card]', { timeout: 10000 })

  // Wait for GSAP stagger to complete
  await sleep(800)

  // ── SCREENSHOT 1: Split panel — patterns collapsed (clean hero) ──
  console.log('Taking hero screenshot...')
  await page.screenshot({ path: `${OUTPUT_DIR}/screenshot-patterns.png`, fullPage: false })
  console.log('✓ screenshot-patterns.png saved')

  // ── SCREENSHOT 2: Cards expanded ──
  console.log('Taking expanded cards screenshot...')
  const cards = await page.$$('[data-card]')
  if (cards[0]) await cards[0].click()
  await sleep(500)
  if (cards[1]) await cards[1].click()
  await sleep(500)
  if (cards[2]) await cards[2].click()
  await sleep(600)

  await page.screenshot({ path: `${OUTPUT_DIR}/screenshot-analyzer.png`, fullPage: false })
  console.log('✓ screenshot-analyzer.png saved')

  // ── SCREENSHOT 3: Knowledge base (scroll to bottom) ──
  console.log('Taking knowledge base screenshot...')
  await page.evaluate(() => {
    const section = document.querySelector('section')
    if (section) section.scrollIntoView({ behavior: 'instant' })
  })
  await sleep(400)

  await page.screenshot({ path: `${OUTPUT_DIR}/screenshot-frameworks.png`, fullPage: false })
  console.log('✓ screenshot-frameworks.png saved')

  await browser.close()
  console.log('All screenshots saved to public/screenshots/')
}

takeScreenshots().catch(console.error)
