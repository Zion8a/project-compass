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

    const projectCard = page
      .locator("article")
      .filter({ hasText: "Project Compass Demo" });

    await expect(
      projectCard.getByRole("heading", { name: "Project Compass Demo" })
    ).toBeVisible();

    await expect(
      projectCard.getByText("Active", { exact: true })
    ).toBeVisible();

    await expect(projectCard.getByText("Status")).toBeVisible();
    await expect(projectCard.getByText("Not started")).toBeVisible();

    await expect(projectCard.getByText("Members")).toBeVisible();
    await expect(projectCard.getByText("Tasks")).toBeVisible();
    await expect(projectCard.getByText("Risks")).toBeVisible();
    await expect(projectCard.getByText("Decisions")).toBeVisible();
    await expect(projectCard.getByText("Last updated")).toBeVisible();

    await page.reload();

    const reloadedProjectCard = page
      .locator("article")
      .filter({ hasText: "Project Compass Demo" });

    await expect(
      reloadedProjectCard.getByRole("heading", {
        name: "Project Compass Demo",
      })
    ).toBeVisible();

    await expect(
      reloadedProjectCard.getByText("Active", { exact: true })
    ).toBeVisible();

    await expect(reloadedProjectCard.getByText("Status")).toBeVisible();
    await expect(reloadedProjectCard.getByText("Not started")).toBeVisible();

    await expect(reloadedProjectCard.getByText("Members")).toBeVisible();
    await expect(reloadedProjectCard.getByText("Tasks")).toBeVisible();
    await expect(reloadedProjectCard.getByText("Risks")).toBeVisible();
    await expect(reloadedProjectCard.getByText("Decisions")).toBeVisible();
    await expect(reloadedProjectCard.getByText("Last updated")).toBeVisible();

    const header = page.locator("header");

    await expect(
      header.getByText("Active project", { exact: true })
    ).toBeVisible();

    await expect(
      header.getByText("Project Compass Demo", { exact: true })
    ).toBeVisible();
  });
});