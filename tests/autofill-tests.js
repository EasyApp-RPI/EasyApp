// This file is the autofill test suite for Easyapp autofill

import { launch } from 'puppeteer';

(async () => {
  const browser = await launch();
  const page = await browser.newPage();
  await page.goto('https://easyapp-rpi.github.io/JobAppForm/', {
    waitUntil: 'networkidle2',
  });
  await page.pdf({ path: 'test.pdf', format: 'a4' });

  await browser.close();
})();