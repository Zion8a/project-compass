import { expect, test } from "@playwright/test";

test.describe("Risk responsibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects");

    await page.evaluate(() => {
      window.localStorage.clear();
    });

    await page.reload();
  });

  test("user can assign a risk to a project member and see it after reload", async ({
    page,
  }) => {
    await page.getByLabel("Project name").fill("Risk Responsibility Test");
    await page
      .getByLabel("Description")
      .fill("A project used for testing risk ownership.");

    await page.getByRole("button", { name: "Create project" }).click();

    await expect(
      page.getByRole("heading", { name: "Risk Responsibility Test" })
    ).toBeVisible();

    await page.getByRole("link", { name: "Members" }).click();

    await expect(
      page.getByRole("heading", { name: "Project Members" })
    ).toBeVisible();

    await page.getByLabel("Name").fill("Johan Larsson");
    await page.getByLabel("Role").fill("Risk Owner");
    await page
      .getByLabel("Responsibility")
      .fill("Risk follow-up and mitigation");

    await page.getByRole("button", { name: "Add member" }).click();

    await expect(
      page.getByRole("heading", { name: "Johan Larsson" })
    ).toBeVisible();

    await page.getByRole("link", { name: "Risks" }).click();

    await expect(page.getByRole("heading", { name: "Riskvy" })).toBeVisible();

    await page.getByLabel("Titel").fill("Supplier delay risk");

    await page
      .getByLabel("Responsible member")
      .selectOption({ label: "Johan Larsson" });

    await page
      .getByLabel("Beskrivning")
      .fill("The supplier may not deliver the needed material in time.");

    await page.getByLabel("Sannolikhet").selectOption("high");
    await page.getByLabel("Konsekvens").selectOption("high");

    await page
      .getByLabel("Åtgärd")
      .fill("Follow up with supplier weekly and prepare an alternative plan.");

    await page.getByRole("button", { name: "Lägg till risk" }).click();

    const riskCard = page
      .locator("article")
      .filter({ hasText: "Supplier delay risk" });

    await expect(
      riskCard.getByRole("heading", { name: "Supplier delay risk" })
    ).toBeVisible();

    await expect(riskCard.getByText("Responsible")).toBeVisible();

    await expect(
      riskCard.getByText("Johan Larsson", { exact: true })
    ).toBeVisible();

    await expect(riskCard.getByText("Hög")).toHaveCount(2);

    await page.reload();

    const reloadedRiskCard = page
      .locator("article")
      .filter({ hasText: "Supplier delay risk" });

    await expect(
      reloadedRiskCard.getByRole("heading", { name: "Supplier delay risk" })
    ).toBeVisible();

    await expect(reloadedRiskCard.getByText("Responsible")).toBeVisible();

    await expect(
      reloadedRiskCard.getByText("Johan Larsson", { exact: true })
    ).toBeVisible();

    await expect(reloadedRiskCard.getByText("Hög")).toHaveCount(2);

    await expect(
      reloadedRiskCard.getByText(
        "Follow up with supplier weekly and prepare an alternative plan."
      )
    ).toBeVisible();
  });
});