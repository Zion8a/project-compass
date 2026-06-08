import { expect, test } from "@playwright/test";

test.describe("Project map Attention Needed", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects");

    await page.evaluate(() => {
      window.localStorage.clear();
    });

    await page.reload();
  });

  test("project map shows severity-aware Attention Needed items from active project data", async ({
    page,
  }) => {
    await page.getByLabel("Project name").fill("Attention Needed Test");
    await page
      .getByLabel("Description")
      .fill("A project used for testing Attention Needed.");

    await page
      .getByRole("button", { name: "Create project", exact: true })
      .click();

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

    await expect(
      page.getByText("Attention Needed", { exact: true })
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "6 items need attention" })
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "1 blocked task" })
    ).toBeVisible();

    await expect(
      page.getByText(
        "Blocked tasks may prevent the project from moving forward."
      )
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "1 task without owner" })
    ).toBeVisible();

    await expect(
      page.getByText("Tasks without an owner can easily be missed or delayed.")
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "1 risk without owner" })
    ).toBeVisible();

    await expect(
      page.getByText("Risks without a responsible person may not be followed up.")
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "1 high risk" })
    ).toBeVisible();

    await expect(
      page.getByText(
        "High risks should be reviewed and handled before they affect the project."
      )
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "1 decision without owner" })
    ).toBeVisible();

    await expect(
      page.getByText("Decisions without an owner may remain unclear or unresolved.")
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "1 open decision" })
    ).toBeVisible();

    await expect(
      page.getByText("Open decisions can block direction, scope or next steps.")
    ).toBeVisible();

    await expect(page.getByText("High").first()).toBeVisible();
    await expect(page.getByText("Medium").first()).toBeVisible();
  });
});