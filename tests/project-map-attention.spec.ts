import { expect, test } from "@playwright/test";

test.describe("Project map attention needed", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects");

    await page.evaluate(() => {
      window.localStorage.clear();
    });

    await page.reload();
  });

  test("project map shows attention needed items from active project data", async ({
    page,
  }) => {
    await page.getByLabel("Project name").fill("Attention Needed Test");
    await page
      .getByLabel("Description")
      .fill("A project used for testing attention needed.");

    await page.getByRole("button", { name: "Create project" }).click();

    await expect(
      page.getByRole("heading", { name: "Attention Needed Test" })
    ).toBeVisible();

    await page.getByRole("link", { name: "Workspace" }).click();

    await expect(
      page.getByRole("heading", { name: "Workspace" })
    ).toBeVisible();

    await page.getByLabel("Title").fill("Blocked task without owner");
    await page
      .getByLabel("Description")
      .fill("This task is blocked and has no responsible member.");
    await page.getByLabel("Status").selectOption("blocked");
    await page.getByRole("button", { name: "Add task" }).click();

    await page.getByRole("link", { name: "Risks" }).click();

    await expect(
      page.getByRole("heading", { name: "Risk View" })
    ).toBeVisible();

    await page.getByLabel("Title").fill("High risk without owner");
    await page
      .getByLabel("Description")
      .fill("This risk has high probability and high impact.");
    await page.getByLabel("Probability").selectOption("high");
    await page.getByLabel("Impact").selectOption("high");
    await page.getByRole("button", { name: "Add risk" }).click();

    await page.getByRole("link", { name: "Decisions" }).click();

    await expect(
      page.getByRole("heading", { name: "Decision View" })
    ).toBeVisible();

    await page.getByLabel("Title").fill("Open decision without owner");
    await page
      .getByLabel("Description")
      .fill("This decision is still open and has no responsible member.");
    await page.getByRole("button", { name: "Add decision" }).click();

    await page.getByRole("link", { name: "Project Map" }).click();

    await expect(
      page.getByRole("heading", { name: "Project Map" })
    ).toBeVisible();

    await expect(page.getByText("Attention needed", { exact: true })).toBeVisible();

    await expect(page.getByText("1 blocked task")).toBeVisible();
    await expect(page.getByText("1 task without owner")).toBeVisible();
    await expect(page.getByText("1 risk without owner")).toBeVisible();
    await expect(page.getByText("1 high risk")).toBeVisible();
    await expect(page.getByText("1 decision without owner")).toBeVisible();
    await expect(page.getByText("1 open decision")).toBeVisible();
  });
});