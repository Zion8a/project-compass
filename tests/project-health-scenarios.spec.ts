import { expect, test } from "@playwright/test";

const baseDate = "2026-06-12T10:00:00.000Z";

function createProject(overrides = {}) {
  return {
    id: "project-health-test-project",
    name: "Project Health Scenario Test",
    description: "A test project for Project Health scenarios.",
    purpose: "Verify Project Health behavior.",
    desiredOutcome: "Reliable health signals in the Status Report.",
    status: "in-progress",
    createdAt: baseDate,
    updatedAt: baseDate,
    members: [
      {
        id: "member-1",
        name: "Alex Tester",
        role: "QA Lead",
        responsibility: "Follow up project risks and status.",
        comment: "",
        createdAt: baseDate,
        updatedAt: baseDate,
      },
    ],
    goals: [],
    deliverables: [],
    tasks: [],
    risks: [],
    decisions: [],
    ...overrides,
  };
}

async function loadProject(page, project) {
  await page.addInitScript((storedProject) => {
    window.localStorage.setItem(
      "project-compass-state",
      JSON.stringify({
        activeProjectId: storedProject.id,
        projects: [storedProject],
      })
    );
  }, project);

  await page.goto("/project-report");
}

test.describe("Project Health scenarios", () => {
  test("shows Stable for a project without attention signals", async ({
    page,
  }) => {
    const project = createProject({
      tasks: [
        {
          id: "task-1",
          title: "Prepare project checkpoint",
          description: "Prepare the next project checkpoint.",
          status: "in-progress",
          priority: "medium",
          ownerId: "member-1",
          createdAt: baseDate,
          updatedAt: baseDate,
        },
      ],
      risks: [
        {
          id: "risk-1",
          title: "Minor schedule uncertainty",
          description: "A low-level risk that should not affect health.",
          probability: "low",
          impact: "low",
          action: "Monitor during weekly checkpoint.",
          ownerId: "member-1",
          status: "open",
          createdAt: baseDate,
          updatedAt: baseDate,
        },
      ],
      decisions: [
        {
          id: "decision-1",
          title: "Use weekly checkpoints",
          description: "The team has decided to use weekly checkpoints.",
          ownerId: "member-1",
          status: "decided",
          createdAt: baseDate,
          updatedAt: baseDate,
        },
      ],
    });

    await loadProject(page, project);

    await expect(
  page.getByRole("heading", { name: "Stable" })
).toBeVisible();
    await expect(page.getByText("Project Health Score: 100 / 100")).toBeVisible();
    await expect(
      page.getByText(
        "No blocked tasks, high risks, open decisions or missing owners were found."
      )
    ).toBeVisible();
    await expect(page.getByText("No current attention signals.")).toBeVisible();
  });

  test("shows Needs attention for a project with missing ownership", async ({
    page,
  }) => {
    const project = createProject({
      tasks: [
        {
          id: "task-1",
          title: "Clarify test scope",
          description: "This task intentionally has no owner.",
          status: "todo",
          priority: "medium",
          createdAt: baseDate,
          updatedAt: baseDate,
        },
      ],
    });

    await loadProject(page, project);

    await expect(
  page.getByRole("heading", { name: "Needs attention" })
).toBeVisible();
    await expect(page.getByText("Project Health Score: 95 / 100")).toBeVisible();
    await expect(
      page.getByText(
        "This project needs attention because it has 1 task without owner. These items should be reviewed by the project leader."
      )
    ).toBeVisible();
    await expect(
  page.getByRole("listitem").filter({ hasText: "1 task without owner" })
).toBeVisible();
  });

  test("shows At risk for a project with several high risks", async ({
    page,
  }) => {
    const project = createProject({
      risks: [
        {
          id: "risk-1",
          title: "Critical dependency risk",
          description: "A high risk that may affect delivery.",
          probability: "high",
          impact: "high",
          action: "Review dependency plan.",
          ownerId: "member-1",
          status: "open",
          createdAt: baseDate,
          updatedAt: baseDate,
        },
        {
          id: "risk-2",
          title: "High delivery risk",
          description: "Another high risk that may affect delivery.",
          probability: "high",
          impact: "medium",
          action: "Create mitigation plan.",
          ownerId: "member-1",
          status: "open",
          createdAt: baseDate,
          updatedAt: baseDate,
        },
      ],
    });

    await loadProject(page, project);

    await expect(
  page.getByRole("heading", { name: "At risk" })
).toBeVisible();
    await expect(page.getByText("Project Health Score: 85 / 100")).toBeVisible();
    await expect(
      page.getByText(
        "This project is at risk because it has 2 high risks. These signals may affect progress, direction or delivery."
      )
    ).toBeVisible();
    await expect(
  page.getByRole("listitem").filter({ hasText: "2 high risks" })
).toBeVisible();
  });
});