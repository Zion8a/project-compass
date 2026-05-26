import { expect, test } from "@playwright/test";

test.describe("Project members", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects");

    await page.evaluate(() => {
      window.localStorage.clear();
    });

    await page.reload();
  });

  test("user can add a member to the active project and see it after reload", async ({
    page,
  }) => {
    await page.getByLabel("Project name").fill("Project Compass Team Test");
    await page
      .getByLabel("Description")
      .fill("A project used for testing the team flow.");

    await page.getByRole("button", { name: "Create project" }).click();

    await expect(
      page.getByRole("heading", { name: "Project Compass Team Test" })
    ).toBeVisible();

    await page.getByRole("link", { name: "Members" }).click();

    await expect(
      page.getByRole("heading", { name: "Project Members" })
    ).toBeVisible();

    await page.getByLabel("Name").fill("Johan Larsson");
    await page.getByLabel("Role").fill("Project Lead");
    await page
      .getByLabel("Responsibility")
      .fill("Planning, follow-up and project structure");
    await page
      .getByLabel("Comment")
      .fill("First member added to the project");

    await page.getByRole("button", { name: "Add member" }).click();

    await expect(
      page.getByRole("heading", { name: "Johan Larsson" })
    ).toBeVisible();

    await expect(page.getByText("Project Lead")).toBeVisible();
    await expect(
      page.getByText("Planning, follow-up and project structure")
    ).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("heading", { name: "Johan Larsson" })
    ).toBeVisible();

    await page.getByRole("link", { name: "My Projects" }).click();

    const projectCard = page
      .locator("article")
      .filter({ hasText: "Project Compass Team Test" });

    await expect(
      projectCard.getByRole("heading", { name: "Project Compass Team Test" })
    ).toBeVisible();

    await expect(
      projectCard.locator("dt").filter({ hasText: /^Members$/ })
    ).toBeVisible();

    await expect(
      projectCard.locator("dd").filter({ hasText: /^1$/ })
    ).toBeVisible();
  });
});