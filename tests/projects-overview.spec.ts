import { expect, test } from "@playwright/test";

test.describe("Projects overview", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    await page.evaluate(() => {
      window.localStorage.clear();
    });
  });

  test("user sees validation message when project name is missing", async ({
    page,
  }) => {
    await page.goto("/projects");

    await page
      .getByRole("button", { name: "Create project", exact: true })
      .click();

    await expect(page.getByText("Project name is required.")).toBeVisible();

    await expect(page.getByLabel("Project name")).toHaveAttribute(
      "aria-invalid",
      "true"
    );

    await expect(page.getByLabel("Project name")).toHaveAttribute(
      "aria-required",
      "true"
    );

    await page.getByLabel("Project name").fill("Validation Demo Project");

    await expect(page.getByText("Project name is required.")).not.toBeVisible();
  });

  test("user can create a project and see it after reload", async ({ page }) => {
    await page.goto("/projects");

    await expect(
      page.getByRole("heading", { name: "My Projects" })
    ).toBeVisible();

    await expect(page.getByText("No projects yet")).toBeVisible();

    await page.getByLabel("Project name").fill("Project Compass Demo");
    await page
      .getByLabel("Description")
      .fill("A demo project for testing the projects overview.");

    await page
      .getByRole("button", { name: "Create project", exact: true })
      .click();

    const projectCard = page
      .locator("article")
      .filter({ hasText: "Project Compass Demo" });

    await expect(projectCard).toBeVisible();
    await expect(projectCard.getByText("Project Compass Demo")).toBeVisible();

    await expect(
      projectCard.getByText("A demo project for testing the projects overview.")
    ).toBeVisible();

    await expect(projectCard.getByText("Active", { exact: true })).toBeVisible();

    await expect(projectCard.getByText("Health", { exact: true })).toBeVisible();
    await expect(projectCard.getByText("Status", { exact: true })).toBeVisible();

    await expect(
      projectCard.getByText("Attention items", { exact: true })
    ).toBeVisible();

    await expect(
      projectCard.getByText("Members", { exact: true })
    ).toBeVisible();

    await expect(projectCard.getByText("Tasks", { exact: true })).toBeVisible();
    await expect(projectCard.getByText("Risks", { exact: true })).toBeVisible();

    await expect(
      projectCard.getByText("Decisions", { exact: true })
    ).toBeVisible();

    await expect(
      projectCard.getByText("Last updated", { exact: true })
    ).toBeVisible();

    await expect(
      projectCard.getByText(
        "No blocked tasks, high risks, open decisions or missing owners were found."
      )
    ).toBeVisible();

    await page.reload();

    const reloadedProjectCard = page
      .locator("article")
      .filter({ hasText: "Project Compass Demo" });

    await expect(reloadedProjectCard).toBeVisible();

    await expect(
      reloadedProjectCard.getByText("Project Compass Demo")
    ).toBeVisible();

    await expect(
      reloadedProjectCard.getByText(
        "A demo project for testing the projects overview."
      )
    ).toBeVisible();

    await expect(
      reloadedProjectCard.getByText("Health", { exact: true })
    ).toBeVisible();

    await expect(
      reloadedProjectCard.getByText("Tasks", { exact: true })
    ).toBeVisible();
  });
});