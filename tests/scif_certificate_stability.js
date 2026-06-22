const { test, expect } = require("@playwright/test");

test("Browserstack playwright demo", async ({ page }) => {
  const baseUrl = "https://t2.statefunddirect.com/GetaQuote";

  // Get the current viewport size
  const viewportSize = page.viewportSize();

  if (viewportSize) {
    console.log(`Width: ${viewportSize.width}, Height: ${viewportSize.height}`);
  } else {
    console.log(
      "Viewport is controlled by the browser window (e.g., if maximized without a fixed viewport)",
    );
  }

  await page.goto(baseUrl, {
    waitUntil: "commit",
  });
  await page.waitForTimeout(3000);


  await expect(page).toHaveTitle("STATE FUND's EASY QUOTE");

  // 2. Open the login overlay/dropdown button
  const loginAnchor = page.locator("//button[@aria-label='Toggle navigation']").first();
  await expect(loginAnchor).toBeVisible({ timeout: 10000 });
  //await loginAnchor.click();
  await loginAnchor.tap();
  //await loginAnchor.click({ force: true });
  //await loginAnchor.dispatchEvent('click');
  //await page.evaluate(el => el.click());

  const navToggler = page
    .locator("//a[text()='LOG IN ']")
    .first();

  await expect(navToggler).toBeVisible({ timeout: 10000 });
  //await navToggler.click({ force: true });
  await navToggler.tap();
  await page.waitForLoadState('domcontentloaded');

  // 3. Fill in the Username field
  const usernameInput = page.locator('#accountNameExistingUserComponent');
  await usernameInput.fill(process.getenv("USERNAME"));

  // 4. Fill in the Password field
  const passwordInput = page.locator('#passwordExistingUserComponent');
  await passwordInput.fill(process.getenv("PASSWORD"));

  // 5. Click the "Continue application" button to submit the login
  const continueButton = page.locator('#btnCountinueWithApplication');

  await expect(continueButton).toBeVisible({ timeout: 10000 });
  //await navToggler.click({ force: true });
  //await continueButton.tap();
  //await continueButton.dispatchEvent('click');
  await continueButton.evaluate(btn => btn.click());


  const getCertBtn = page.locator('//button[@id="btnPrintOrEmail" and text()="Get Certificate"]');
  await expect(getCertBtn.first()).toBeVisible({ timeout: 30000 });
  //await getCertBtn.first().tap(); 
  await getCertBtn.evaluate(btn => btn.click());


  try {
    const addCertBtn = page.locator("#btnAddCert");
    await expect(addCertBtn).toBeVisible({ timeout: 60000 });
    addCertBtn.tap();
  } catch (error) {
    const domContent = await page.evaluate(() => document.documentElement.outerHTML)
      .catch(e => `Could not evaluate DOM: ${e.message}`);

    const fs = require('fs');
    fs.writeFileSync('failed-state-dom.html', domContent);

    throw error;
  }

  const certofIssuance = page.locator('//h3[text()="Certificate of Insurance"]');
  await expect(certofIssuance).toBeVisible({ timeout: 60000 });


});
