import { expect, test } from "@playwright/test";

const UI_URL = "http://localhost:5173/";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(
    page.getByRole("heading", { name: "Sign In to your account" })
  ).toBeVisible();

  await page.locator("[name=email]").fill("test@gmail.com");
  await page.locator("[name=password]").fill("password123");

  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page.getByText("Logged in successfully")).toBeVisible();
});

test("Should show hotel search results", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going").fill("Dublin");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("Hotels found in Dublin")).toBeVisible();
  await expect(page.getByText("Dublin Getaways")).toBeVisible();
});
