import { expect, test } from "@playwright/test";

test("landing page displays Project Compass and main navigation", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("link", { name: "Project Compass", exact: true })
  ).toBeVisible();

  await expect(
    page.getByText(
      "A project thinking tool for goals, risks, decisions, status and next steps."
    )
  ).toBeVisible();

  await expect(
    page.getByRole("heading", {
      name: /From idea to a manageable project/,
    })
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Home", exact: true })
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "My Projects", exact: true })
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Members", exact: true })
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Interview", exact: true })
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Project Map", exact: true })
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Workspace", exact: true })
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Risks", exact: true })
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Decisions", exact: true })
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Status Report", exact: true })
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Create new project", exact: true })
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Open project map", exact: true })
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Open workspace", exact: true })
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Open status report", exact: true })
  ).toBeVisible();

  await expect(page.getByText("Workflow", { exact: true })).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Interview", exact: true })
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Project Map", exact: true })
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Workspace", exact: true })
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Risks and decisions", exact: true })
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Status Report", exact: true })
  ).toBeVisible();
});