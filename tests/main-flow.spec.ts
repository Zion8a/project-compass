import { expect, test } from "@playwright/test";

test("project data is visible in project map and status report", async ({
  page,
  context,
}) => {
  await page.goto("/");

  await page.evaluate(() => {
    window.localStorage.clear();

    window.localStorage.setItem(
      "project-compass-current-project",
      JSON.stringify({
        projectName: "New ways of working",
        purpose: "Create alignment and a better project structure.",
        goal: "Reduce duplicate work and improve follow-up.",
        deliverables: "Project map, workspace, risk list and status report.",
        risks: "Unclear responsibility and late decisions.",
        decisions: "Decide how the work should be followed up.",
      })
    );
  });

  await page.goto("/project-map");

  await expect(
    page.getByRole("heading", { name: "Project Map" })
  ).toBeVisible();

  await expect(page.getByText("New ways of working")).toBeVisible();

  await expect(
    page.getByText("Create alignment and a better project structure.")
  ).toBeVisible();

  const reportPage = await context.newPage();

  await reportPage.goto("/project-report");

  await expect(
    reportPage.getByRole("heading", { name: "Status Report" })
  ).toBeVisible();

  await expect(
    reportPage.getByText("Project: New ways of working")
  ).toBeVisible();

  await expect(
    reportPage.getByText("Create alignment and a better project structure.")
  ).toBeVisible();

  await reportPage.close();
});