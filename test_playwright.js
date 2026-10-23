const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');

  // Wait for iframe
  const frameElement = await page.$('iframe.yt-frame');
  const frame = await frameElement.contentFrame();

  const box = await frameElement.boundingBox();
  console.log("iframe bounding box:", box);

  try {
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      console.log("Clicked iframe successfully");
  } catch (e) {
      console.log("Error clicking iframe", e.message);
  }

  // Try taking a screenshot
  await page.screenshot({ path: 'iframe_test.png' });

  await browser.close();
})();
