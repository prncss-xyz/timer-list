import { test, expect } from "@playwright/test";

import { local } from "./utils";

import { delai } from "@/utils/tests";

test.skip("can edit timer value, which persists reloading", async ({
  page,
}) => {
  await page.goto(local);
  await page.getByLabel("clear all").click();
  // wait for animation to complete
  await delai(300);
  await page.getByLabel("edit").nth(0).click();
  await page.getByLabel("digit 9").click();
  await page.getByLabel("done").click();
  await expect(page.getByLabel("active").getByLabel("duration")).toHaveText(
    "00:00:09",
  );
  await delai(1000);
  await page.reload();
  await expect(page.getByLabel("active").getByLabel("duration")).toHaveText(
    "00:00:09",
  );
});

test("select next timer after alarm", async ({ page }) => {
  await page.goto(local);
  await page.getByLabel("clear all").click();
  // wait for animation to complete
  await delai(300);
  await page.getByLabel("edit").click();
  await page.getByLabel("digit 1").click();
  await page.getByLabel("done").click();
  await page.getByLabel("duplicate").click();
  await page.getByLabel("edit").nth(1).click();
  await page.getByLabel("digit 2").click();
  await page.getByLabel("done").click();
  await page.getByLabel("duration").nth(0).click();
  await page.getByLabel("play").click();
  await expect(page.getByLabel("active").getByText("00:00:12")).toBeVisible();
});

// FIXME: this test doesnt give the same result on desktop and in CI for Chromium (fine on Firefox)
test.skip("/list screenshot", async ({ page }) => {
  await page.goto(local);
  await expect(page).toHaveScreenshot();
  await page.getByLabel("play").click();
  await expect(page).toHaveScreenshot();
});

test("/set-timer screenshot", async ({ page }) => {
  await page.goto(local);
  await page.getByLabel("edit").nth(0).click();
  await expect(page).toHaveScreenshot();
});
