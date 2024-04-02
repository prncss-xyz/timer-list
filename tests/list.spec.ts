import { test, expect } from "@playwright/test";

test("can edit timer and accept change", async ({ page }) => {
  await page.goto("localhost:8081");
  await page.getByLabel("edit").nth(0).click();
  await page.getByLabel("digit 1").click();
  await page.getByLabel("done").click();
  await expect(page.getByLabel("duration").nth(0)).toHaveText("00:00:11");
});

test("can edit timer and cancel change", async ({ page }) => {
  await page.goto("localhost:8081");
  await page.getByLabel("edit").nth(0).click();
  await page.getByLabel("digit 1").click();
  await page.getByLabel("cancel").click();
  await expect(page.getByLabel("duration").nth(0)).toHaveText("00:00:01");
});
