import { expect, test } from "@playwright/test";

test.describe("Task responsibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects");

    await page.evaluate(() => {
      window.localStorage.clear();
    });

    await page.reload();
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
      page.getByRole("heading", { name: "Arbetsyta" })
    ).toBeVisible();

    await page.getByLabel("Titel").fill("Write first project follow-up");

    await page
      .getByLabel("Beskrivning")
      .fill("Create a short written follow-up for the project.");

    await page.getByLabel("Responsible member").selectOption({
      label: "Johan Larsson",
    });

    await page.getByRole("button", { name: "Lägg till uppgift" }).click();

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