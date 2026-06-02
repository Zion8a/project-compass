import { expect, test } from "@playwright/test";

test.describe("Task responsibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects");

    await page.evaluate(() => {
      window.localStorage.clear();
    });

    await page.reload();
  });

  test("user sees workspace empty state when no tasks exist", async ({
    page,
  }) => {
    await page.getByLabel("Project name").fill("Workspace Empty State Test");
    await page
      .getByLabel("Description")
      .fill("A project used for testing the workspace empty state.");

    await page.getByRole("button", { name: "Create project" }).click();

    await expect(
      page.getByRole("heading", { name: "Workspace Empty State Test" })
    ).toBeVisible();

    await page.getByRole("link", { name: "Workspace" }).click();

    await expect(
      page.getByRole("heading", { name: "Workspace" })
    ).toBeVisible();

    await expect(
  page.getByText("Workspace empty state", { exact: true })
).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "No tasks yet" })
    ).toBeVisible();

    await expect(page.getByText("Use a clear verb")).toBeVisible();
    await expect(page.getByText("Make it assignable")).toBeVisible();
    await expect(page.getByText("Keep it movable")).toBeVisible();
  });

  test("user sees validation message when task title is missing", async ({
    page,
  }) => {
    await page.getByLabel("Project name").fill("Task Validation Test");
    await page
      .getByLabel("Description")
      .fill("A project used for testing task validation.");

    await page.getByRole("button", { name: "Create project" }).click();

    await expect(
      page.getByRole("heading", { name: "Task Validation Test" })
    ).toBeVisible();

    await page.getByRole("link", { name: "Workspace" }).click();

    await expect(
      page.getByRole("heading", { name: "Workspace" })
    ).toBeVisible();

    await page.getByRole("button", { name: "Add task" }).click();

    await expect(page.getByText("Task title is required.")).toBeVisible();

    await expect(page.getByLabel("Title")).toHaveAttribute(
      "aria-invalid",
      "true"
    );

    await page.getByLabel("Title").fill("Validation task");

    await expect(page.getByText("Task title is required.")).not.toBeVisible();
  });

  test("user can assign a task to a project member and see it after reload", async ({
    page,
  }) => {
    await page.getByLabel("Project name").fill("Task Responsibility Test");
    await page
      .getByLabel("Description")
      .fill("A project used for testing task ownership.");

    await page.getByRole("button", { name: "Create project" }).click();

    await expect(
      page.getByRole("heading", { name: "Task Responsibility Test" })
    ).toBeVisible();

    await page.getByRole("link", { name: "Members" }).click();

    await expect(
      page.getByRole("heading", { name: "Project Members" })
    ).toBeVisible();

    await page.getByLabel("Name").fill("Johan Larsson");
    await page.getByLabel("Role").fill("Project Lead");
    await page
      .getByLabel("Responsibility")
      .fill("Planning and follow-up");

    await page.getByRole("button", { name: "Add member" }).click();

    await expect(
      page.getByRole("heading", { name: "Johan Larsson" })
    ).toBeVisible();

    await page.getByRole("link", { name: "Workspace" }).click();

    await expect(
      page.getByRole("heading", { name: "Workspace" })
    ).toBeVisible();

    await page.getByLabel("Title").fill("Write first project follow-up");

    await page
      .getByLabel("Description")
      .fill("Create a short written follow-up for the project.");

    await page.getByLabel("Responsible member").selectOption({
      label: "Johan Larsson",
    });

    await page.getByRole("button", { name: "Add task" }).click();

    const taskCard = page
      .locator("article")
      .filter({ hasText: "Write first project follow-up" });

    await expect(
      taskCard.getByRole("heading", { name: "Write first project follow-up" })
    ).toBeVisible();

    await expect(taskCard.getByText("Responsible:")).toBeVisible();

    await expect(
      taskCard.locator("span").filter({ hasText: /^Johan Larsson$/ })
    ).toBeVisible();

    await page.reload();

    const reloadedTaskCard = page
      .locator("article")
      .filter({ hasText: "Write first project follow-up" });

    await expect(
      reloadedTaskCard.getByRole("heading", {
        name: "Write first project follow-up",
      })
    ).toBeVisible();

    await expect(reloadedTaskCard.getByText("Responsible:")).toBeVisible();

    await expect(
      reloadedTaskCard.locator("span").filter({ hasText: /^Johan Larsson$/ })
    ).toBeVisible();
  });
});