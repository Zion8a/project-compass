"use client";

import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import {
  getActiveProject,
  loadProjectCompassState,
} from "@/lib/projectStorage";

export default function ProjectTestCasesPage() {
  const state = loadProjectCompassState();
  const activeProject = getActiveProject(state);

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

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {activeProject.testCases.length === 0 ? (
            <div>
              <p className="text-sm font-medium text-slate-500">
                No test cases yet
              </p>

              <h2 className="mt-2 text-xl font-semibold text-slate-900">
                Start by adding a small set of test cases
              </h2>

              <p className="mt-3 max-w-2xl text-slate-600">
                Test cases will help you describe what should be verified,
                what the expected result is and which project task the test
                case belongs to.
              </p>

              <p className="mt-4 text-sm text-slate-500">
                The next implementation step will add a form for creating test
                cases and linking them to tasks.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Test case list
              </h2>

              <ul className="mt-4 space-y-3">
                {activeProject.testCases.map((testCase) => (
                  <li
                    key={testCase.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <p className="font-medium text-slate-900">
                      {testCase.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Status: {testCase.status}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
