import { expect, test } from "@playwright/test";

test.describe("Projects overview", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects");
    await page.evaluate(() => {
      window.localStorage.clear();
    });
    await page.reload();
  });

  test("user can create a project and see it after reload", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "My Projects" })
    ).toBeVisible();

    await expect(page.getByText("No projects yet")).toBeVisible();

    await page.getByLabel("Project name").fill("Project Compass Demo");
    await page
      .getByLabel("Description")
      .fill("A test project created from the projects overview.");

    await page.getByRole("button", { name: "Create project" }).click();

    await expect(
      page.getByRole("heading", { name: "Project Compass Demo" })
    ).toBeVisible();

    await expect(page.getByText("Active")).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("heading", { name: "Project Compass Demo" })
    ).toBeVisible();

    await expect(page.getByText("Active")).toBeVisible();
  });
});