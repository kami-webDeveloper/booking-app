import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173/";
const testEmail = `test_register_${
  Math.floor(Math.random() * 9000) + 10000
}@test.com`;

test("should allow the user to sign in", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(
    page.getByRole("heading", { name: "Sign In to your account" })
  ).toBeVisible();

  await page.locator("[name=email]").fill("test@gmail.com");
  await page.locator("[name=password]").fill("password123");

  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page.getByText("Logged in successfully")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});

test("should allow the user to sign up", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign Up" }).click();

  await expect(
    page.getByRole("heading", { name: "Create an account" })
  ).toBeVisible();

  await page.locator("[name=firstName]").fill("test_firstName");
  await page.locator("[name=lastName]").fill("test_lastName");
  await page.locator("[name=email]").fill(testEmail);
  await page.locator("[name=password]").fill("password1234");
  await page.locator("[name=confirmPassword]").fill("password1234");

  await page.getByRole("button", { name: "Create Account" }).click();

  await expect(page.getByText("Registration successful")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});
