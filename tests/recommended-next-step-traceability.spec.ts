import { expect, test } from "@playwright/test";

const baseDate = "2026-06-12T10:00:00.000Z";

test.describe("Recommended Next Step traceability", () => {
  test("recommends linking high risks to affected tasks", async ({ page }) => {
    await page.addInitScript((storedDate) => {
      window.localStorage.setItem(
        "project-compass-state",
        JSON.stringify({
          activeProjectId: "recommended-next-step-traceability-test",
          projects: [
            {
              id: "recommended-next-step-traceability-test",
              name: "Recommended Next Step Traceability Test",
              description:
                "A project used to test traceability-based recommendations.",
              purpose: "Verify that high risks are connected to concrete work.",
              desiredOutcome:
                "The Status Report recommends linking high risks to affected tasks.",
              status: "in-progress",
              createdAt: storedDate,
              updatedAt: storedDate,
              members: [
                {
                  id: "member-1",
                  name: "Alex Tester",
                  role: "QA Lead",
                  responsibility: "Review project risks and traceability.",
                  comment: "",
                  createdAt: storedDate,
                  updatedAt: storedDate,
                },
              ],
              goals: [],
              deliverables: [],
              tasks: [
                {
                  id: "task-1",
                  title: "Prepare release plan",
                  description: "Prepare the release plan for the project.",
                  status: "in-progress",
                  priority: "medium",
                  ownerId: "member-1",
                  createdAt: storedDate,
                  updatedAt: storedDate,
                },
              ],
              risks: [
                {
                  id: "risk-1",
                  title: "Release dependency risk",
                  description:
                    "A high risk exists but is not yet connected to affected work.",
                  probability: "high",
                  impact: "medium",
                  action: "Clarify which task this risk affects.",
                  ownerId: "member-1",
                  status: "open",
                  createdAt: storedDate,
                  updatedAt: storedDate,
                },
              ],
              decisions: [],
            },
          ],
        })
      );
    }, baseDate);

    await page.goto("/project-report");

    await expect(
      page.getByRole("heading", { name: /Status Report/ })
    ).toBeVisible();

    await expect(
      page.getByText("Project: Recommended Next Step Traceability Test", {
        exact: true,
      })
    ).toBeVisible();

    await expect(
      page.getByText("Recommended Next Step", { exact: true })
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: "Link high risks to affected tasks",
      })
    ).toBeVisible();

    await expect(
      page.getByText(
        "High risks are easier to manage when they are connected to the work they may affect. Link each high risk to a related task before reviewing the wider risk plan."
      )
    ).toBeVisible();
  });

  test("recommends linking open decisions to affected tasks", async ({
    page,
  }) => {
    await page.addInitScript((storedDate) => {
      window.localStorage.setItem(
        "project-compass-state",
        JSON.stringify({
          activeProjectId: "recommended-next-step-decision-traceability-test",
          projects: [
            {
              id: "recommended-next-step-decision-traceability-test",
              name: "Recommended Next Step Decision Traceability Test",
              description:
                "A project used to test decision traceability recommendations.",
              purpose:
                "Verify that open decisions are connected to affected work.",
              desiredOutcome:
                "The Status Report recommends linking open decisions to affected tasks.",
              status: "in-progress",
              createdAt: storedDate,
              updatedAt: storedDate,
              members: [
                {
                  id: "member-1",
                  name: "Alex Tester",
                  role: "QA Lead",
                  responsibility: "Review project decisions and traceability.",
                  comment: "",
                  createdAt: storedDate,
                  updatedAt: storedDate,
                },
              ],
              goals: [],
              deliverables: [],
              tasks: [
                {
                  id: "task-1",
                  title: "Choose release scope",
                  description: "Define what should be included in the release.",
                  status: "in-progress",
                  priority: "medium",
                  ownerId: "member-1",
                  createdAt: storedDate,
                  updatedAt: storedDate,
                },
              ],
              risks: [],
              decisions: [
                {
                  id: "decision-1",
                  title: "Decide release scope",
                  context:
                    "The team needs to decide what should be included in the release.",
                  decision: "",
                  status: "open",
                  ownerId: "member-1",
                  createdAt: storedDate,
                  updatedAt: storedDate,
                },
              ],
            },
          ],
        })
      );
    }, baseDate);

    await page.goto("/project-report");

    await expect(
      page.getByRole("heading", { name: /Status Report/ })
    ).toBeVisible();

    await expect(
      page.getByText("Project: Recommended Next Step Decision Traceability Test", {
        exact: true,
      })
    ).toBeVisible();

    await expect(
      page.getByText("Recommended Next Step", { exact: true })
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: "Link open decisions to affected tasks",
      })
    ).toBeVisible();

    await expect(
      page.getByText(
        "Open decisions are easier to follow up when they are connected to the work they affect. Link each open decision to a related task before closing or escalating the decision."
      )
    ).toBeVisible();
  });
});