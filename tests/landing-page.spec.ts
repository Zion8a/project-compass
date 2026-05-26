import { expect, test } from "@playwright/test";

test("landing page displays Project Compass and main navigation", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("link", { name: "Project Compass" })
  ).toBeVisible();

  await expect(
    page.getByRole("heading", {
      name: /Från idé till styrbart projekt/,
    })
  ).toBeVisible();

  await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Projects" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Interview" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Project Map" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Workspace" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Risks" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Decisions" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Status Report" })).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Skapa nytt projekt" })
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Öppna projektkarta" })
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Öppna arbetsyta" })
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Statusrapport" })
  ).toBeVisible();
});