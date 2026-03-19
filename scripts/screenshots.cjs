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
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 })

  // ── SCREENSHOT 1: Trust Patterns ──
  console.log('Taking patterns screenshot...')
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' })
  await page.waitForSelector('.bg-surface', { timeout: 10000 })

  const cards = await page.$$('[role="button"]')
  if (cards[0]) await cards[0].click()
  await sleep(300)
  if (cards[1]) await cards[1].click()
  await sleep(300)
  if (cards[2]) await cards[2].click()
  await sleep(500)

  await page.screenshot({ path: `${OUTPUT_DIR}/screenshot-patterns.png`, fullPage: false })
  console.log('✓ patterns screenshot saved')

  // ── SCREENSHOT 2: Trust Analyzer ──
  console.log('Taking analyzer screenshot...')
  const tabs = await page.$$('[role="tab"]')
  if (tabs[1]) await tabs[1].click()
  await sleep(500)

  await page.screenshot({ path: `${OUTPUT_DIR}/screenshot-analyzer.png`, fullPage: false })
  console.log('✓ analyzer screenshot saved')

  // ── SCREENSHOT 3: Frameworks ──
  console.log('Taking frameworks screenshot...')
  if (tabs[2]) await tabs[2].click()
  await sleep(500)

  await page.screenshot({ path: `${OUTPUT_DIR}/screenshot-frameworks.png`, fullPage: false })
  console.log('✓ frameworks screenshot saved')

  await browser.close()
  console.log('All screenshots saved to public/screenshots/')
}

takeScreenshots().catch(console.error)
