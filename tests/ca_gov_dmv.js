const { test, expect } = require("@playwright/test");

test("Navigate ca.gov Departments to DMV and verify homepage", async ({
  page,
}) => {
  // 1. Open the California state portal
  await page.goto("https://www.ca.gov/", { waitUntil: "domcontentloaded" });

  // 2. Navigate to the Departments section
  // ca.gov keeps main nav in an off-canvas drawer; open it, then use a DOM click.
  const menuToggle = page.locator("button.toggle-menu");
  await menuToggle.click({ force: true }).catch(() => {});
  await page.waitForTimeout(500);

  const departmentsLink = page.locator("#navigation a[href='/departments/']");
  await expect(departmentsLink).toBeAttached({ timeout: 15000 });
  await departmentsLink.evaluate((el) => el.click());
  await expect(page).toHaveURL(/\/departments\/?$/);

  // 3. Open the Department of Motor Vehicles (DMV) page
  const dmvDeptLink = page
    .locator("a.link-grid", { hasText: "Department of Motor Vehicles" })
    .first();
  await expect(dmvDeptLink).toBeVisible({ timeout: 15000 });
  await dmvDeptLink.click();
  await expect(page).toHaveURL(/\/departments\/299\/?/);

  // 4. Click the button that opens the official DMV website
  const departmentWebsiteBtn = page.getByRole("link", {
    name: "Department website",
  });
  await expect(departmentWebsiteBtn).toBeVisible({ timeout: 15000 });
  await departmentWebsiteBtn.click();

  // 5. Verify the DMV site loaded via the help heading.
  // Live site heading text is "How can we help?"
  await expect(page).toHaveURL(/dmv\.ca\.gov/i, { timeout: 30000 });
  const helpLabel = page.getByRole("heading", {
    name: /How can (we|I) help/i,
  });
  await expect(helpLabel).toBeVisible({ timeout: 30000 });
});
