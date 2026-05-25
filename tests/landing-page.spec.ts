import { test, expect } from "@playwright/test";

test("landing page displays Project Compass and main navigation", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Project Compass")).toBeVisible();

  await expect(
    page.getByRole("heading", {
      name: "Från idé till strukturerat projekt.",
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Skapa nytt projekt" }),
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Öppna projektkarta" }),
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Öppna arbetsyta" }),
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Statusrapport" }),
  ).toBeVisible();
});