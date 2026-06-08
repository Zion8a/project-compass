import { expect, test } from "@playwright/test";

test.describe("Decision responsibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects");

    await page.evaluate(() => {
      window.localStorage.clear();
    });

    await page.reload();
  });

  test("user sees no active project state in decision view", async ({
    page,
  }) => {
    await page.goto("/project-decisions");

    await expect(
      page.getByRole("heading", { name: "Decision View" })
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "No active project selected" })
    ).toBeVisible();

    await expect(
      page.getByText(
        "Decision View needs an active project before decisions can be created."
      )
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: "Go to My Projects" })
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Add decision" })
    ).not.toBeVisible();
  });

  test("user sees decision view empty state when no decisions exist", async ({
    page,
  }) => {
    await page.getByLabel("Project name").fill("Decision Empty State Test");
    await page
      .getByLabel("Description")
      .fill("A project used for testing the decision view empty state.");

    await page
      .getByRole("button", { name: "Create project", exact: true })
      .click();

    await expect(
      page.getByRole("heading", { name: "Decision Empty State Test" })
    ).toBeVisible();

    await page.getByRole("link", { name: "Decisions" }).click();

    await expect(
      page.getByRole("heading", { name: "Decision View" })
    ).toBeVisible();

    await expect(
      page.getByText("Decision view empty state", { exact: true })
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "No decisions yet" })
    ).toBeVisible();

    await expect(page.getByText("Clarify what is undecided")).toBeVisible();
    await expect(page.getByText("Name the consequence")).toBeVisible();
    await expect(page.getByText("Assign responsibility")).toBeVisible();
  });

  test("user sees validation message when decision title is missing", async ({
    page,
  }) => {
    await page.getByLabel("Project name").fill("Decision Validation Test");
    await page
      .getByLabel("Description")
      .fill("A project used for testing decision validation.");

    await page
      .getByRole("button", { name: "Create project", exact: true })
      .click();

    await expect(
      page.getByRole("heading", { name: "Decision Validation Test" })
    ).toBeVisible();

    await page.getByRole("link", { name: "Decisions" }).click();

    await expect(
      page.getByRole("heading", { name: "Decision View" })
    ).toBeVisible();

    await page.getByRole("button", { name: "Add decision" }).click();

    await expect(page.getByText("Decision title is required.")).toBeVisible();

    await expect(page.getByLabel("Title")).toHaveAttribute(
      "aria-invalid",
      "true"
    );

    await expect(page.getByLabel("Title")).toHaveAttribute(
      "aria-required",
      "true"
    );

    await page.getByLabel("Title").fill("Validation decision");

    await expect(
      page.getByText("Decision title is required.")
    ).not.toBeVisible();
  });

  test("user can see when a decision needs an owner", async ({ page }) => {
    await page.getByLabel("Project name").fill("Decision Owner Visibility Test");
    await page
      .getByLabel("Description")
      .fill("A project used for testing missing decision ownership.");

    await page
      .getByRole("button", { name: "Create project", exact: true })
      .click();

    await expect(
      page.getByRole("heading", { name: "Decision Owner Visibility Test" })
    ).toBeVisible();

    await page.getByRole("link", { name: "Decisions" }).click();

    await expect(
      page.getByRole("heading", { name: "Decision View" })
    ).toBeVisible();

    await page.getByLabel("Title").fill("Unassigned scope decision");

    await page
      .getByLabel("Description")
      .fill("This decision should clearly show that it has no owner.");

    await page.getByLabel("Deadline").fill("2026-06-14");

    await page
      .getByLabel("Consequence")
      .fill("The decision affects scope, planning and next steps.");

    await page.getByRole("button", { name: "Add decision" }).click();

    const decisionCard = page
      .locator("article")
      .filter({ hasText: "Unassigned scope decision" });

    await expect(
      decisionCard.getByRole("heading", { name: "Unassigned scope decision" })
    ).toBeVisible();

    await expect(decisionCard.getByText("Responsible")).toBeVisible();

    await expect(
      decisionCard.getByText("Unassigned", { exact: true })
    ).toBeVisible();

    await expect(decisionCard.getByText("Needs owner")).toBeVisible();

    await expect(decisionCard.getByText("2026-06-14")).toBeVisible();

    await expect(
      decisionCard.getByText(
        "The decision affects scope, planning and next steps."
      )
    ).toBeVisible();

    await page.reload();

    const reloadedDecisionCard = page
      .locator("article")
      .filter({ hasText: "Unassigned scope decision" });

    await expect(
      reloadedDecisionCard.getByRole("heading", {
        name: "Unassigned scope decision",
      })
    ).toBeVisible();

    await expect(reloadedDecisionCard.getByText("Responsible")).toBeVisible();

    await expect(
      reloadedDecisionCard.getByText("Unassigned", { exact: true })
    ).toBeVisible();

    await expect(reloadedDecisionCard.getByText("Needs owner")).toBeVisible();

    await expect(reloadedDecisionCard.getByText("2026-06-14")).toBeVisible();

    await expect(
      reloadedDecisionCard.getByText(
        "The decision affects scope, planning and next steps."
      )
    ).toBeVisible();
  });

  test("user can assign a decision to a project member and see it after reload", async ({
    page,
  }) => {
    await page.getByLabel("Project name").fill("Decision Responsibility Test");
    await page
      .getByLabel("Description")
      .fill("A project used for testing decision ownership.");

    await page
      .getByRole("button", { name: "Create project", exact: true })
      .click();

    await expect(
      page.getByRole("heading", { name: "Decision Responsibility Test" })
    ).toBeVisible();

    await page.goto("/project-members");

await expect(
  page.getByRole("heading", { name: "Project Members" })
).toBeVisible();

    await page.getByLabel("Name").fill("Johan Larsson");
    await page.getByLabel("Role").fill("Decision Owner");
    await page
      .getByLabel("Responsibility")
      .fill("Decision follow-up and communication");

    await page.getByRole("button", { name: "Add member" }).click();

    await expect(
      page.getByRole("heading", { name: "Johan Larsson" })
    ).toBeVisible();

    await page.goto("/project-decisions");

await expect(
  page.getByRole("heading", { name: "Decision View" })
).toBeVisible();

    await page.getByLabel("Title").fill("Choose presentation structure");

    await page
      .getByLabel("Responsible member")
      .selectOption({ label: "Johan Larsson" });

    await page
      .getByLabel("Legacy owner note")
      .fill("Legacy fallback should not be used when member is selected.");

    await page.getByLabel("Deadline").fill("2026-06-07");

    await page
      .getByLabel("Description")
      .fill(
        "The group needs to decide how the final presentation should be structured."
      );

    await page
      .getByLabel("Consequence")
      .fill("The decision affects planning, responsibility and preparation.");

    await page.getByRole("button", { name: "Add decision" }).click();

    const decisionCard = page
      .locator("article")
      .filter({ hasText: "Choose presentation structure" });

    await expect(
      decisionCard.getByRole("heading", {
        name: "Choose presentation structure",
      })
    ).toBeVisible();

    await expect(decisionCard.getByText("Responsible")).toBeVisible();

    await expect(
      decisionCard.getByText("Johan Larsson", { exact: true })
    ).toBeVisible();

    await expect(decisionCard.getByText("Needs owner")).not.toBeVisible();

    await expect(decisionCard.getByText("2026-06-07")).toBeVisible();

    await expect(
      decisionCard.getByText(
        "The decision affects planning, responsibility and preparation."
      )
    ).toBeVisible();

    await page.reload();

    const reloadedDecisionCard = page
      .locator("article")
      .filter({ hasText: "Choose presentation structure" });

    await expect(
      reloadedDecisionCard.getByRole("heading", {
        name: "Choose presentation structure",
      })
    ).toBeVisible();

    await expect(reloadedDecisionCard.getByText("Responsible")).toBeVisible();

    await expect(
      reloadedDecisionCard.getByText("Johan Larsson", { exact: true })
    ).toBeVisible();

    await expect(
      reloadedDecisionCard.getByText("Needs owner")
    ).not.toBeVisible();

    await expect(reloadedDecisionCard.getByText("2026-06-07")).toBeVisible();

    await expect(
      reloadedDecisionCard.getByText(
        "The decision affects planning, responsibility and preparation."
      )
    ).toBeVisible();
  });
});