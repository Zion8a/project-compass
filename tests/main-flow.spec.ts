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
        projectName: "Införa nytt arbetssätt",
        purpose: "Skapa samsyn och bättre struktur i projektarbetet.",
        goal: "Minska dubbelarbete och förbättra uppföljning.",
        deliverables: "Projektkarta, arbetsyta, risklista och statusrapport.",
        risks: "Otydligt ansvar och sena beslut.",
        decisions: "Besluta hur arbetet ska följas upp.",
      })
    );
  });

  await page.goto("/project-map");

  await expect(
    page.getByRole("heading", { name: /Projektkarta/ })
  ).toBeVisible();

  await expect(page.getByText("Införa nytt arbetssätt")).toBeVisible();

  const reportPage = await context.newPage();

  await reportPage.goto("/project-report");

  await expect(
    reportPage.getByRole("heading", { name: /Statusrapport|Status Report/ })
  ).toBeVisible();

  await expect(reportPage.getByText("Införa nytt arbetssätt")).toBeVisible();
  await expect(
    reportPage.getByText("Skapa samsyn och bättre struktur i projektarbetet.")
  ).toBeVisible();

  await reportPage.close();
});