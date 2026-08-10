import { expect, test } from "@playwright/test";

test.describe("Legacy task migration characterization", () => {
  test("migrates one canonical legacy task into the active project", async ({
    page,
  }) => {
    await page.goto("/");

    await page.evaluate(() => {
      window.localStorage.clear();

      const storedDate = "2026-08-10T10:00:00.000Z";
      const memberId = "member-legacy-owner";

      window.localStorage.setItem(
        "project-compass-state",
        JSON.stringify({
          schemaVersion: 1,
          activeProjectId: "legacy-task-migration-project",
          projects: [
            {
              id: "legacy-task-migration-project",
              name: "Legacy Task Migration Test",
              description:
                "A project used to characterize canonical legacy task migration.",
              status: "in-progress",
              createdAt: storedDate,
              updatedAt: storedDate,
              tasks: [],
              risks: [],
              decisions: [],
              testCases: [],
              members: [
                {
                  id: memberId,
                  name: "Legacy Task Owner",
                  role: "QA Lead",
                  responsibility: "Own the canonical legacy task.",
                  createdAt: storedDate,
                  updatedAt: storedDate,
                },
              ],
            },
          ],
        })
      );

      window.localStorage.setItem(
        "project-compass-tasks",
        JSON.stringify([
          {
            id: "legacy-task-1",
            title: "Verify legacy migration",
            description:
              "Preserve the canonical legacy task fields during migration.",
            status: "review",
            ownerId: memberId,
          },
        ])
      );
    });

    await page.goto("/project-board");

    await expect(
      page.getByRole("heading", { name: "Workspace", exact: true })
    ).toBeVisible();

    await expect
      .poll(() =>
        page.evaluate(() => {
          const savedState = window.localStorage.getItem(
            "project-compass-state"
          );

          if (!savedState) {
            return 0;
          }

          const state = JSON.parse(savedState);
          const activeProject = state.projects.find(
            (project: { id: string }) =>
              project.id === "legacy-task-migration-project"
          );

          return activeProject?.tasks?.length ?? 0;
        })
      )
      .toBe(1);

    const migratedTask = await page.evaluate(() => {
      const savedState = window.localStorage.getItem(
        "project-compass-state"
      );

      if (!savedState) {
        return null;
      }

      const state = JSON.parse(savedState);
      const activeProject = state.projects.find(
        (project: { id: string }) =>
          project.id === "legacy-task-migration-project"
      );

      return activeProject?.tasks?.[0] ?? null;
    });

    expect(migratedTask).not.toBeNull();
    expect(migratedTask).toMatchObject({
      id: "legacy-task-1",
      title: "Verify legacy migration",
      description:
        "Preserve the canonical legacy task fields during migration.",
      status: "review",
      ownerId: "member-legacy-owner",
    });

    expect(typeof migratedTask.createdAt).toBe("string");
    expect(migratedTask.createdAt.length).toBeGreaterThan(0);
    expect(typeof migratedTask.updatedAt).toBe("string");
    expect(migratedTask.updatedAt.length).toBeGreaterThan(0);

    await expect
      .poll(() =>
        page.evaluate(() =>
          window.localStorage.getItem("project-compass-tasks")
        )
      )
      .toBeNull();

    await page.reload();

    await expect(
      page.getByRole("heading", { name: "Workspace", exact: true })
    ).toBeVisible();

    const stateAfterReload = await page.evaluate(() => {
      const savedState = window.localStorage.getItem(
        "project-compass-state"
      );

      return savedState ? JSON.parse(savedState) : null;
    });

    const projectAfterReload = stateAfterReload.projects.find(
      (project: { id: string }) =>
        project.id === "legacy-task-migration-project"
    );

    expect(projectAfterReload.tasks).toHaveLength(1);
    expect(projectAfterReload.tasks[0].id).toBe("legacy-task-1");

    expect(
      await page.evaluate(() =>
        window.localStorage.getItem("project-compass-tasks")
      )
    ).toBeNull();
  });
});
