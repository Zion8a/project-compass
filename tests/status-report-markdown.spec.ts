import { expect, test } from "@playwright/test";

test.describe("Status report Markdown export", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    await page.evaluate(() => {
      window.localStorage.clear();

      const memberId = "member-johan-larsson";
      const now = new Date().toISOString();

      window.localStorage.setItem(
        "project-compass-state",
        JSON.stringify({
          activeProjectId: "project-markdown-test",
          projects: [
            {
              id: "project-markdown-test",
              name: "Markdown Export Test",
              description: "A project used for testing Markdown export.",
              status: "in-progress",
              createdAt: now,
              updatedAt: now,
              tasks: [
                {
                  id: "task-1",
                  title: "Write project update",
                  description: "Prepare the next project update.",
                  status: "in-progress",
                  ownerId: memberId,
                  createdAt: now,
                  updatedAt: now,
                },
              ],
              risks: [
                {
                  id: "risk-1",
                  title: "Unclear ownership",
                  description: "Some work may not have a clear owner.",
                  probability: "medium",
                  impact: "high",
                  action: "Review responsibility before the next meeting.",
                  mitigation: "Review responsibility before the next meeting.",
                  owner: "",
                  ownerId: memberId,
                  status: "open",
                  createdAt: now,
                  updatedAt: now,
                },
              ],
              decisions: [
                {
                  id: "decision-1",
                  title: "Choose report format",
                  description: "The team needs to agree on report format.",
                  owner: "",
                  ownerId: memberId,
                  deadline: "2026-06-07",
                  consequence: "The format affects how the report is shared.",
                  status: "open",
                  createdAt: now,
                  updatedAt: now,
                },
              ],
              members: [
                {
                  id: memberId,
                  name: "Johan Larsson",
                  role: "Project Lead",
                  responsibility: "Planning and follow-up",
                  comment: "Responsible for project structure.",
                  createdAt: now,
                  updatedAt: now,
                },
              ],
            },
          ],
        })
      );

      window.localStorage.setItem(
        "project-compass-current-project",
        JSON.stringify({
          projectName: "Markdown Export Test",
          purpose: "Create a useful project status report.",
          goal: "Make the report easy to share outside the app.",
          deliverables:
            "Markdown export, status summary and responsibility overview.",
          risks: "The report may miss important project information.",
          decisions: "Decide what should be included in the exported report.",
        })
      );
    });
  });

  test("user can copy the status report as Markdown", async ({ page }) => {
    await page.goto("/project-report");

    await page.evaluate(() => {
      Object.defineProperty(navigator, "clipboard", {
        value: {
          writeText: async (text: string) => {
            window.localStorage.setItem("copied-markdown-report", text);
          },
        },
        configurable: true,
      });
    });

    await expect(
      page.getByRole("heading", { name: /Status Report/ })
    ).toBeVisible();

    await expect(
      page.getByText("Project: Markdown Export Test", { exact: true })
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Copy status report as Markdown" })
    ).toBeVisible();

    await page
      .getByRole("button", { name: "Copy status report as Markdown" })
      .click();

    await expect(page.getByText("Report copied to clipboard.")).toBeVisible();

    const copiedMarkdown = await page.evaluate(() =>
      window.localStorage.getItem("copied-markdown-report")
    );

    expect(copiedMarkdown).toContain("# Status Report – Markdown Export Test");
    expect(copiedMarkdown).toContain("## Project Members");
    expect(copiedMarkdown).toContain("Johan Larsson");
    expect(copiedMarkdown).toContain("Write project update");
    expect(copiedMarkdown).toContain("Unclear ownership");
    expect(copiedMarkdown).toContain("Choose report format");
    expect(copiedMarkdown).toContain("Responsible: Johan Larsson");
  });
});