import { test, expect } from "@playwright/test";

test("can edit timer and accept change", async ({ page }) => {
  await page.goto("localhost:8081");
  await page.getByLabel("edit").nth(1).click();
  await page.getByLabel("digit 1").click();
  await page.getByLabel("done").click();
  await expect(page.getByLabel("selected").getByLabel("duration")).toHaveText(
    "00:00:21",
  );
});

test("can edit timer and cancel change", async ({ page }) => {
  await page.goto("localhost:8081");
  await page.getByLabel("edit").nth(0).click();
  await page.getByLabel("digit 1").click();
  await page.getByLabel("cancel").click();
  // the timer that has been edited is selected
  await expect(page.getByLabel("duration").nth(0)).toHaveText("00:00:01");
});

test("select next timer after alarm", async ({ page }) => {
  await page.goto("localhost:8081");
  await page.getByLabel("play").click();
  const start = Date.now();
  await expect(page.getByLabel("selected").getByText("00:00:02")).toBeVisible();
  await expect(
    page.getByLabel("countdown").getByText("00:00:02"),
  ).toBeVisible();
  const end = Date.now();
  const delai = end - start;
  // expect the time taken to be equal to the nominal timer value by 10% error margin
  expect(Math.abs(delai - 2000) / 2000).toBeLessThan(0.1);
});
