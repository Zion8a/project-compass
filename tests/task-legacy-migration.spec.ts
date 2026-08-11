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

  test("aborts migration and preserves the complete legacy source when one record is invalid", async ({
    page,
  }) => {
    await page.goto("/");

    const originalLegacyRecords = [
      {
        id: "legacy-task-valid",
        title: "Keep this legacy task",
        description:
          "This canonical legacy task must not be partially migrated.",
        status: "review",
        ownerId: "member-legacy-owner",
      },
      {
        id: "legacy-task-invalid",
        title: "   ",
        description:
          "This record is invalid because its title contains only whitespace.",
        status: "planned",
        ownerId: "member-legacy-owner",
      },
    ];

    const originalLegacySource = JSON.stringify(originalLegacyRecords);

    await page.evaluate(
      ({ legacySource }) => {
        window.localStorage.clear();

        const storedDate = "2026-08-10T10:00:00.000Z";
        const memberId = "member-legacy-owner";

        window.localStorage.setItem(
          "project-compass-state",
          JSON.stringify({
            schemaVersion: 1,
            activeProjectId: "mixed-legacy-task-project",
            projects: [
              {
                id: "mixed-legacy-task-project",
                name: "Mixed Legacy Task Safety Test",
                description:
                  "A project used to verify atomic legacy task migration.",
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
                    responsibility: "Own the seeded legacy tasks.",
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
          legacySource
        );
      },
      { legacySource: originalLegacySource }
    );

    await page.goto("/project-board");

    await expect(
      page.getByRole("heading", { name: "Workspace", exact: true })
    ).toBeVisible();

    await expect(
      page.getByText("Project: Mixed Legacy Task Safety Test", {
        exact: true,
      })
    ).toBeVisible();

    const observedMigrationState = await page.evaluate(() => {
      const savedState = window.localStorage.getItem(
        "project-compass-state"
      );

      const state = savedState ? JSON.parse(savedState) : null;
      const activeProject = state?.projects?.find(
        (project: { id: string }) =>
          project.id === "mixed-legacy-task-project"
      );

      const legacySource = window.localStorage.getItem(
        "project-compass-tasks"
      );

      return {
        targetTasks: activeProject?.tasks ?? [],
        legacySource,
        legacyRecords: legacySource ? JSON.parse(legacySource) : null,
      };
    });

    console.log(
      "Observed mixed legacy migration state:",
      JSON.stringify(observedMigrationState, null, 2)
    );

    expect(
      observedMigrationState.targetTasks,
      "Atomic migration must leave target tasks empty when any source record is invalid"
    ).toHaveLength(0);

    expect(
      observedMigrationState.legacySource,
      "Original legacy source must remain byte-for-byte unchanged when migration aborts"
    ).toBe(originalLegacySource);

    expect(
      observedMigrationState.legacyRecords,
      "Both original legacy records must remain available after an aborted migration"
    ).toEqual(originalLegacyRecords);
  });
      test("preserves legacy source when target save returns false", async ({
    page,
  }) => {
    await page.goto("/");

    const originalLegacyRecords = [
      {
        id: "legacy-task-save-failure",
        title: "Preserve source on save failure",
        description:
          "This task must remain recoverable when target persistence is rejected.",
        status: "review",
        ownerId: "member-legacy-owner",
      },
    ];

    const originalLegacySource = JSON.stringify(originalLegacyRecords);

    await page.evaluate(
      ({ legacySource }) => {
        window.localStorage.clear();

        const storedDate = "2026-08-11T13:00:00.000Z";
        const memberId = "member-legacy-owner";

        window.localStorage.setItem(
          "project-compass-state",
          JSON.stringify({
            schemaVersion: 1,
            activeProjectId: "save-failure-project",
            projects: [
              {
                id: "save-failure-project",
                name: "Save Failure Migration Test",
                description:
                  "A project used to verify caller safety when target save returns false.",
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
                    responsibility: "Own the seeded legacy task.",
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
          legacySource
        );
      },
      { legacySource: originalLegacySource }
    );

    await page.addInitScript(() => {
      const originalGetItem = Storage.prototype.getItem;

      let legacyTaskSourceRead = false;
      let saveFailureInjected = false;

      (
        window as typeof window & {
          __storageReadTrace?: string[];
        }
      ).__storageReadTrace = [];

      Storage.prototype.getItem = function (key: string) {
        const trace = (
          window as typeof window & {
            __storageReadTrace?: string[];
          }
        ).__storageReadTrace!;

        trace.push(`read:${key}`);

        if (key === "project-compass-tasks") {
          const value = originalGetItem.call(this, key);

          if (value !== null) {
            legacyTaskSourceRead = true;
            trace.push("legacy-source-read");
          }

          return value;
        }

        if (
          key === "project-compass-state" &&
          legacyTaskSourceRead &&
          !saveFailureInjected
        ) {
          saveFailureInjected = true;
          trace.push("FAULT-INJECTED");
          return "{broken-json";
        }

        return originalGetItem.call(this, key);
      };
    });

    await page.goto("/project-board");

    await expect(
      page.getByRole("heading", { name: "Workspace", exact: true })
    ).toBeVisible();

    await expect
      .poll(() =>
        page.evaluate(
          () =>
            (
              window as typeof window & {
                __storageReadTrace?: string[];
              }
            ).__storageReadTrace?.includes("FAULT-INJECTED") ?? false
        )
      )
      .toBe(true);

    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => resolve());
          });
        })
    );

    const observedFailureState = await page.evaluate(() => {
      const savedState = window.localStorage.getItem(
        "project-compass-state"
      );

      const state = savedState ? JSON.parse(savedState) : null;
      const activeProject = state?.projects?.find(
        (project: { id: string }) =>
          project.id === "save-failure-project"
      );

      const legacySource = window.localStorage.getItem(
        "project-compass-tasks"
      );

      return {
        persistedTargetTasks: activeProject?.tasks ?? [],
        legacySource,
        legacyRecords: legacySource ? JSON.parse(legacySource) : null,
      };
    });

    const migratedTaskVisible = await page
      .getByText("Preserve source on save failure", { exact: true })
      .isVisible();

    const storageReadTrace = await page.evaluate(
      () =>
        (
          window as typeof window & {
            __storageReadTrace?: string[];
          }
        ).__storageReadTrace ?? []
    );

    console.log(
      "Storage read trace:",
      JSON.stringify(storageReadTrace, null, 2)
    );

    console.log(
      "Observed save-failure migration state:",
      JSON.stringify(
        {
          ...observedFailureState,
          migratedTaskVisible,
        },
        null,
        2
      )
    );

    expect(
      observedFailureState.persistedTargetTasks,
      "Failed target save must not appear as a persisted migration"
    ).toHaveLength(0);

    expect(
      observedFailureState.legacySource,
      "Original legacy source must remain byte-for-byte unchanged when target save returns false"
    ).toBe(originalLegacySource);

    expect(
      observedFailureState.legacyRecords,
      "Original legacy records must remain recoverable when target save returns false"
    ).toEqual(originalLegacyRecords);

    expect(
      migratedTaskVisible,
      "Failed target save must not be presented as a successful runtime migration"
    ).toBe(false);
  });
});