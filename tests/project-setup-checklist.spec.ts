import { expect, test } from "@playwright/test";

test.describe("Project setup checklist", () => {
  test("user sees no active project state on project map", async ({ page }) => {
    await page.goto("/projects");

    await page.evaluate(() => {
      window.localStorage.clear();
    });

    await page.goto("/project-map");

    await expect(
      page.getByRole("heading", { name: "No active project selected" })
    ).toBeVisible();

    await expect(
      page.getByText(
        "Project Map needs an active project before it can show direction, setup progress, attention items and project health."
      )
    ).toBeVisible();

    await expect(
      page.getByText(
        "Go to My Projects to create a new project or open an existing one."
      )
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: "Go to My Projects" })
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: "Create new project" })
    ).toBeVisible();
  });

  test("user can see setup checklist on project map", async ({ page }) => {
    await page.goto("/projects");

    await page.evaluate(() => {
      window.localStorage.clear();
    });

    await page.reload();

    await page.getByLabel("Project name").fill("Setup Checklist Test");
    await page
      .getByLabel("Description")
      .fill("A project used for testing the setup checklist.");

    await page.getByRole("button", { name: "Create project" }).click();

    await expect(page.getByText("Setup Checklist Test")).toBeVisible();

    await page.getByRole("link", { name: "Project Map" }).click();

    await expect(
      page.getByRole("heading", { name: "Project Map" })
    ).toBeVisible();

    await expect(page.getByText("Project setup checklist")).toBeVisible();

    const checklistSection = page
      .locator("section")
      .filter({ hasText: "Project setup checklist" });

    await expect(
      checklistSection.getByRole("heading", { name: /Setup progress:/ })
    ).toBeVisible();

    await expect(
      checklistSection.getByRole("heading", { name: "Project name" })
    ).toBeVisible();

    await expect(
      checklistSection.getByRole("heading", {
        name: "Purpose or description",
      })
    ).toBeVisible();

    await expect(
      checklistSection.getByRole("heading", { name: "Goal" })
    ).toBeVisible();

    await expect(
      checklistSection.getByRole("heading", { name: "Deliverables" })
    ).toBeVisible();

    await expect(
      checklistSection.getByRole("heading", { name: "Project members" })
    ).toBeVisible();

    await expect(
      checklistSection.getByRole("heading", { name: "Tasks" })
    ).toBeVisible();

    await expect(
      checklistSection.getByRole("heading", { name: "Risks" })
    ).toBeVisible();

    await expect(
      checklistSection.getByRole("heading", { name: "Decisions" })
    ).toBeVisible();

    await expect(
      checklistSection.getByText(
        "Use this checklist to understand what should be clarified next."
      )
    ).toBeVisible();
  });
});