import { test, expect } from "@playwright/test";

test("landing page displays Project Compass and main navigation", async ({ page }) => {
  await page.goto("/");

  const navigation = page.getByLabel("Huvudnavigation");
  const heroSection = page.locator("section").first();

  await expect(
    page.getByRole("link", {
      name: /Project Compass Från idé till styrbart projekt/,
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", {
      name: "Från idé till styrbart projekt.",
    }),
  ).toBeVisible();

  await expect(
    heroSection.getByRole("link", { name: "Skapa nytt projekt" }),
  ).toBeVisible();

  await expect(
    heroSection.getByRole("link", { name: "Öppna projektkarta" }),
  ).toBeVisible();

  await expect(
    heroSection.getByRole("link", { name: "Öppna arbetsyta" }),
  ).toBeVisible();

  await expect(
    heroSection.getByRole("link", { name: "Statusrapport" }),
  ).toBeVisible();

  await expect(
    navigation.getByRole("link", { name: "Projektkarta" }),
  ).toBeVisible();

  await expect(
    navigation.getByRole("link", { name: "Arbetsyta" }),
  ).toBeVisible();

  await expect(
    navigation.getByRole("link", { name: "Riskvy" }),
  ).toBeVisible();

  await expect(
    navigation.getByRole("link", { name: "Beslutsvy" }),
  ).toBeVisible();

  await expect(
    navigation.getByRole("link", { name: "Statusrapport" }),
  ).toBeVisible();

  await expect(page.getByText("Arbetsflöde")).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Intervju" }),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Risker och beslut" }),
  ).toBeVisible();
});