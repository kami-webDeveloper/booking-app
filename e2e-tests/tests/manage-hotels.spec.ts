import { test, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

test("should allow user to add a hotel", async ({ page }) => {
  await page.goto(`${UI_URL}add-hotel`);

  await page.locator('[name="name"]').fill("Test Hotel");
  await page.locator('[name="city"]').fill("Test City");
  await page.locator('[name="country"]').fill("Test Country");
  await page.locator('[name="description"]').fill("Test Description");
  await page.locator('[name="pricePerNight"]').fill("89");
  await page.selectOption("select[name='starRating']", "3");

  await page.getByText("Boutique").click();

  await page.getByLabel("Airport Shuttle").check();
  await page.getByLabel("Outdoor Pool").check();

  await page.locator("[name='adultCount']").fill("3");
  await page.locator("[name='childCount']").fill("2");

  await page.setInputFiles("[name='imageFiles']", [
    path.join(__dirname, "files", "test-img.jpg"),
  ]);

  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText("Hotel added successfully")).toBeVisible();
});

test("should display user hotels", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  await expect(page.getByText("Dublin Getaways")).toBeVisible();
  await expect(
    page.getByText("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
  ).toBeVisible();

  await expect(page.getByText("Dublin, Ireland")).toBeVisible();
  await expect(page.getByText("All Inclusive")).toBeVisible();
  await expect(page.getByText("$119 per night")).toBeVisible();
  await expect(page.getByText("2 Adults, 3Children")).toBeVisible();
  await expect(page.getByText("2 Stars")).toBeVisible();

  await expect(
    page.getByRole("link", { name: "View Details" }).first()
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();
});

test("should edit hotel", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  await page.getByRole("link", { name: "View Details" }).first().click();

  await page.waitForSelector('[name="name"]', { state: "attached" });
  await expect(page.locator('[name="name"]')).toHaveValue("Dublin Getaways");
  await page.locator('[name="name"]').fill("Dublin Getaways UPDATED");
  await page.setInputFiles("[name='imageFiles']", [
    path.join(__dirname, "files", "test-img.jpg"),
  ]);
  await page.getByRole("button", { name: "Edit" }).click();

  await expect(page.getByText("Hotel edited successfully")).toBeVisible();

  await page.getByRole("link", { name: "View Details" }).click();

  await page.locator('[name="name"]').fill("Dublin Getaways");
  await page.getByRole("button", { name: "Edit" }).click();
});
