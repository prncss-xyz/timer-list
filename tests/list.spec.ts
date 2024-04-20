import { test, expect } from "@playwright/test";

test("can edit timer and accept change, which persists reloading", async ({
  page,
}) => {
  await page.goto("localhost:8081");
  await page.getByLabel("clear all").click();
  // wait for animation to complete
  await new Promise((resolve) => setTimeout(resolve, 300));
  await page.getByLabel("duplicate").click();
  await page.getByLabel("duplicate").nth(1).click();
  await page.getByLabel("edit").nth(1).click();
  await page.getByLabel("digit 1").click();
  await page.getByLabel("done").click();
  await expect(page.getByLabel("active").getByLabel("duration")).toHaveText(
    "00:00:01",
  );
});

test("save timerList state", async ({ page }) => {
  await page.goto("localhost:8081");
  await page.getByLabel("clear all").click();
  // wait for animation to complete
  await new Promise((resolve) => setTimeout(resolve, 300));
  await page.getByLabel("edit").click();
  await page.getByLabel("digit 2").click();
  await page.getByLabel("done").click();
  await expect(page.getByLabel("active").getByLabel("duration")).toHaveText(
    "00:00:02",
  );
  // saving of the state is debounced, so we have to wait for it
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await page.reload();
  await expect(page.getByLabel("active").getByLabel("duration")).toHaveText(
    "00:00:02",
  );
});

test("select next timer after alarm", async ({ page }) => {
  await page.goto("localhost:8081");
  await page.getByLabel("clear all").click();
  // wait for animation to complete
  await new Promise((resolve) => setTimeout(resolve, 300));
  await page.getByLabel("edit").click();
  await page.getByLabel("digit 1").click();
  await page.getByLabel("done").click();
  await page.getByLabel("duplicate").click();
  await page.getByLabel("edit").nth(1).click();
  await page.getByLabel("digit 1").click();
  await page.getByLabel("done").click();
  await page.getByLabel("duration").nth(0).click();
  await page.getByLabel("play").click();
  await expect(page.getByLabel("active").getByText("00:00:11")).toBeVisible();
});
