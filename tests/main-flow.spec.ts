import { expect, test } from "@playwright/test";

test("user can create a project and see the status report", async ({
  page,
  context,
}) => {
  await page.goto("/new-project");

  const textboxes = page.getByRole("textbox");

  await expect(textboxes.first()).toBeVisible();

  await textboxes.nth(0).fill("Införa nytt arbetssätt");
  await textboxes
    .nth(1)
    .fill("Skapa samsyn, minska dubbelarbete och förbättra uppföljning.");
  await textboxes
    .nth(2)
    .fill("Testledare, produktägare, utvecklare och verksamhet.");

  await page.getByRole("button", { name: "Skapa projektkarta" }).click();

  await page.waitForURL("**/project-map");

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

  await reportPage.close();
});