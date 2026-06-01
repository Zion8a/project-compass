import { expect, test } from "@playwright/test";

test.describe("Project setup checklist", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    await page.evaluate(() => {
      window.localStorage.clear();
    });
  });

  test("user can see setup checklist on project map", async ({ page }) => {
    await page.goto("/projects");

    await page.getByLabel("Project name").fill("Checklist Demo Project");
    await page
      .getByLabel("Description")
      .fill("A project used to test the setup checklist.");

    await page.getByRole("button", { name: "Create project" }).click();

    await page.goto("/project-map");

    await expect(
      page.getByRole("heading", { name: "Project Map" })
    ).toBeVisible();

    const checklistHeading = page.getByRole("heading", {
      name: "What should be clarified next?",
    });

    await expect(checklistHeading).toBeVisible();

    const checklist = checklistHeading.locator("xpath=ancestor::section[1]");

    await expect(checklist).toBeVisible();

    await expect(
      checklist.getByText("Project setup checklist", { exact: true })
    ).toBeVisible();

    await expect(
      checklist.getByText(
        "This checklist helps a new user understand what structure the project already has and what should be added next."
      )
    ).toBeVisible();

    await expect(checklist.getByText("Setup progress")).toBeVisible();

    await expect(
      checklist.getByText("Create project", { exact: true })
    ).toBeVisible();

    await expect(
      checklist.getByText("Add purpose or description", { exact: true })
    ).toBeVisible();

    await expect(
      checklist.getByText("Clarify goal", { exact: true })
    ).toBeVisible();

    await expect(
      checklist.getByText("Clarify deliverables", { exact: true })
    ).toBeVisible();

    await expect(
      checklist.getByText("Add project members", { exact: true })
    ).toBeVisible();

    await expect(
      checklist.getByText("Add first task", { exact: true })
    ).toBeVisible();

    await expect(
      checklist.getByText("Add first risk", { exact: true })
    ).toBeVisible();

    await expect(
      checklist.getByText("Add first decision", { exact: true })
    ).toBeVisible();

    await expect(
      checklist.getByText("Review status report", { exact: true })
    ).toBeVisible();
  });
});