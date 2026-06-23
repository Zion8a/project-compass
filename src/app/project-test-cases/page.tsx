"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import {
  getActiveProject,
  loadProjectCompassState,
  ProjectCompassState,
  ProjectTestCaseStatus,
  saveProjectCompassState,
  updateProject,
} from "@/lib/projectStorage";

const testCaseStatusOptions: {
  value: ProjectTestCaseStatus;
  label: string;
}[] = [
  {
    value: "not-run",
    label: "Not run",
  },
  {
    value: "passed",
    label: "Passed",
  },
  {
    value: "failed",
    label: "Failed",
  },
  {
    value: "blocked",
    label: "Blocked",
  },
];

function getStatusLabel(status: ProjectTestCaseStatus): string {
  return (
    testCaseStatusOptions.find((option) => option.value === status)?.label ??
    status
  );
}

export default function ProjectTestCasesPage() {
  const [state, setState] = useState<ProjectCompassState | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expectedResult, setExpectedResult] = useState("");
  const [status, setStatus] = useState<ProjectTestCaseStatus>("not-run");
  const [relatedTaskId, setRelatedTaskId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setState(loadProjectCompassState());
  }, []);

  if (!state) {
    return (
      <main className="min-h-screen bg-slate-50">
        <AppHeader />

        <section className="mx-auto max-w-5xl px-6 py-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-slate-600">Loading project...</p>
          </div>
        </section>
      </main>
    );
  }

  const activeProject = getActiveProject(state);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeProject) {
      return;
    }

    if (!title.trim()) {
      setError("Test case title is required.");
      return;
    }

    const now = new Date().toISOString();

    const newTestCase = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim() || undefined,
      expectedResult: expectedResult.trim() || undefined,
      status,
      relatedTaskId: relatedTaskId || undefined,
      createdAt: now,
      updatedAt: now,
    };

    const updatedProject = {
      ...activeProject,
      testCases: [...activeProject.testCases, newTestCase],
    };

    const updatedState = updateProject(state, updatedProject);

    saveProjectCompassState(updatedState);
    setState(updatedState);

    setTitle("");
    setDescription("");
    setExpectedResult("");
    setStatus("not-run");
    setRelatedTaskId("");
    setError("");
  }

  if (!activeProject) {
    return (
      <main className="min-h-screen bg-slate-50">
        <AppHeader />

        <section className="mx-auto max-w-5xl px-6 py-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              No active project
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Test Cases
            </h1>

            <p className="mt-4 max-w-2xl text-slate-600">
              Test cases belong to an active project. Open or create a project
              first to start planning QA work.
            </p>

            <div className="mt-6">
              <Link
                href="/projects"
                className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                Go to My Projects
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <AppHeader />

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">
            Active project: {activeProject.name}
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Test Cases
          </h1>

          <p className="mt-4 max-w-3xl text-slate-600">
            Plan and follow up simple QA work by connecting test cases to the
            project tasks they verify.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              Add test case
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Create a small, clear test case and connect it to the task it
              verifies.
            </p>

            {error ? (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <div className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="test-case-title"
                  className="text-sm font-medium text-slate-700"
                >
                  Title
                </label>
                <input
                  id="test-case-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900"
                  placeholder="Example: User can create a new project"
                />
              </div>

              <div>
                <label
                  htmlFor="test-case-description"
                  className="text-sm font-medium text-slate-700"
                >
                  Description
                </label>
                <textarea
                  id="test-case-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="mt-1 min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900"
                  placeholder="What should be tested?"
                />
              </div>

              <div>
                <label
                  htmlFor="test-case-expected-result"
                  className="text-sm font-medium text-slate-700"
                >
                  Expected result
                </label>
                <textarea
                  id="test-case-expected-result"
                  value={expectedResult}
                  onChange={(event) => setExpectedResult(event.target.value)}
                  className="mt-1 min-h-20 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900"
                  placeholder="What should happen if the feature works?"
                />
              </div>

              <div>
                <label
                  htmlFor="test-case-status"
                  className="text-sm font-medium text-slate-700"
                >
                  Status
                </label>
                <select
                  id="test-case-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as ProjectTestCaseStatus)
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900"
                >
                  {testCaseStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="test-case-related-task"
                  className="text-sm font-medium text-slate-700"
                >
                  Related task
                </label>
                <select
                  id="test-case-related-task"
                  value={relatedTaskId}
                  onChange={(event) => setRelatedTaskId(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900"
                >
                  <option value="">No related task</option>
                  {activeProject.tasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.title}
                    </option>
                  ))}
                </select>

                {activeProject.tasks.length === 0 ? (
                  <p className="mt-2 text-xs text-slate-500">
                    This project has no tasks yet. You can still create test
                    cases and link them later.
                  </p>
                ) : null}
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Save test case
            </button>
          </form>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {activeProject.testCases.length === 0 ? (
              <div>
                <p className="text-sm font-medium text-slate-500">
                  No test cases yet
                </p>

                <h2 className="mt-2 text-xl font-semibold text-slate-900">
                  Start by adding a small set of test cases
                </h2>

                <p className="mt-3 max-w-2xl text-slate-600">
                  Test cases help you describe what should be verified, what the
                  expected result is and which project task the test case
                  belongs to.
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Test case list
                </h2>

                <ul className="mt-4 space-y-3">
                  {activeProject.testCases.map((testCase) => {
                    const relatedTask = activeProject.tasks.find(
                      (task) => task.id === testCase.relatedTaskId
                    );

                    return (
                      <li
                        key={testCase.id}
                        className="rounded-xl border border-slate-200 p-4"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="font-medium text-slate-900">
                              {testCase.title}
                            </p>

                            {testCase.description ? (
                              <p className="mt-2 text-sm text-slate-600">
                                {testCase.description}
                              </p>
                            ) : null}
                          </div>

                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            {getStatusLabel(testCase.status)}
                          </span>
                        </div>

                        {testCase.expectedResult ? (
                          <div className="mt-3 rounded-lg bg-slate-50 p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Expected result
                            </p>
                            <p className="mt-1 text-sm text-slate-700">
                              {testCase.expectedResult}
                            </p>
                          </div>
                        ) : null}

                        <p className="mt-3 text-sm text-slate-500">
                          Related task:{" "}
                          <span className="font-medium">
                            {relatedTask ? relatedTask.title : "Not linked"}
                          </span>
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
