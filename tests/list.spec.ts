import { test, expect } from "@playwright/test";

test("can edit timer and accept change, which persists reloading", async ({
  page,
}) => {
  await page.goto("localhost:8081");
  await page.getByLabel("edit").nth(1).click();
  await page.getByLabel("digit 1").click();
  await page.getByLabel("done").click();
  await expect(page.getByLabel("selected").getByLabel("duration")).toHaveText(
    "00:00:21",
  );
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await page.reload();
  await expect(page.getByLabel("selected").getByLabel("duration")).toHaveText(
    "00:00:21",
  );
});

test("select next timer after alarm", async ({ page }) => {
  await page.goto("localhost:8081");
  const start = Date.now();
  await page.getByLabel("play").click();
  await expect(page.getByLabel("selected").getByText("00:00:02")).toBeVisible();
  await expect(
    page.getByLabel("countdown").getByText("00:00:02"),
  ).toBeVisible();
  const end = Date.now();
  const delai = end - start;
  // expect the time taken to at least nominal timer value
  expect(delai).toBeGreaterThanOrEqual(2000);
});
