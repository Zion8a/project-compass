import { expect, test } from "@playwright/test";

test.describe("Example project demo flow", () => {
  test("creates an example project and makes it available across the app", async ({
    page,
  }) => {
    await page.goto("/projects");

    await page.evaluate(() => {
      window.localStorage.clear();
    });

    await page.reload();

    await expect(
      page.getByRole("heading", { name: "My Projects" })
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Create example project" })
    ).toBeVisible();

    await page.getByRole("button", { name: "Create example project" }).click();

    await expect(
      page.getByRole("heading", { name: "Project Compass Demo Project" })
    ).toBeVisible();

    await expect(page.getByText("Active", { exact: true })).toBeVisible();

    await expect(page.getByText("Members").first()).toBeVisible();
    await expect(page.getByText("Tasks").first()).toBeVisible();
    await expect(page.getByText("Risks").first()).toBeVisible();
    await expect(page.getByText("Decisions").first()).toBeVisible();

    await page.getByRole("button", { name: "Open project" }).click();

    await expect(page).toHaveURL(/\/project-map/);

    await expect(
      page.getByRole("heading", { name: "Project Compass Demo Project" })
    ).toBeVisible();

    await expect(page.getByText("Attention Needed").first()).toBeVisible();
    await expect(page.getByText("Project Health").first()).toBeVisible();

    await page.goto("/project-report");

    await expect(page).toHaveURL(/\/project-report/);

    await expect(page.getByText("Johan Larsson").first()).toBeVisible();

    await expect(
      page.getByText("Create project setup checklist").first()
    ).toBeVisible();

    await expect(
      page.getByText("Unclear responsibility between team members").first()
    ).toBeVisible();

    await expect(
      page.getByText("Use Project Compass as portfolio case").first()
    ).toBeVisible();
  });
});