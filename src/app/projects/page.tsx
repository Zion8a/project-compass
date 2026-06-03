"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import {
  addProject,
  createProject,
  loadProjectCompassState,
  Project,
  ProjectCompassState,
  saveProjectCompassState,
  setActiveProject,
} from "@/lib/projectStorage";
import {
  getAttentionItems,
  getProjectHealth,
  ProjectHealth,
} from "@/lib/projectInsights";

function formatProjectStatus(status: Project["status"]) {
  switch (status) {
    case "not-started":
      return "Not started";
    case "in-progress":
      return "In progress";
    case "at-risk":
      return "At risk";
    case "completed":
      return "Completed";
    default:
      return status;
  }
}

function getProjectHealthClasses(projectHealth: ProjectHealth) {
  if (projectHealth.level === "stable") {
    return "border-emerald-500/40 bg-emerald-500/10 text-emerald-200";
  }

  if (projectHealth.level === "needs-attention") {
    return "border-amber-500/40 bg-amber-500/10 text-amber-200";
  }

  return "border-red-500/40 bg-red-500/10 text-red-200";
}

export default function ProjectsPage() {
  const router = useRouter();

  const [state, setState] = useState<ProjectCompassState>({
    activeProjectId: null,
    projects: [],
  });

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectNameError, setProjectNameError] = useState("");

  useEffect(() => {
    const loadedState = loadProjectCompassState();
    setState(loadedState);
  }, []);

  function saveLegacyProjectMap(project: Project) {
    const legacyProjectMap = {
      projectName: project.name,
      purpose:
        project.description ||
        "Purpose has not been defined yet. Continue with the project interview or project map.",
      goal: "Goal has not been defined yet.",
      deliverables: "Deliverables have not been defined yet.",
      risks: "Risks have not been defined yet.",
      decisions: "Decisions have not been defined yet.",
    };

    window.localStorage.setItem(
      "project-compass-current-project",
      JSON.stringify(legacyProjectMap)
    );
  }

  function handleCreateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = projectName.trim();
    const trimmedDescription = projectDescription.trim();

    if (!trimmedName) {
      setProjectNameError("Project name is required.");
      return;
    }

    const newProject = createProject(
      trimmedName,
      trimmedDescription || undefined
    );

    const updatedState = addProject(state, newProject);

    setState(updatedState);
    saveProjectCompassState(updatedState);
    saveLegacyProjectMap(newProject);

    setProjectName("");
    setProjectDescription("");
    setProjectNameError("");
  }

  function handleProjectNameChange(value: string) {
    setProjectName(value);

    if (projectNameError && value.trim()) {
      setProjectNameError("");
    }
  }

  function handleOpenProject(projectId: string) {
    const selectedProject = state.projects.find(
      (project) => project.id === projectId
    );

    if (!selectedProject) {
      return;
    }

    const updatedState = setActiveProject(state, projectId);

    setState(updatedState);
    saveProjectCompassState(updatedState);
    saveLegacyProjectMap(selectedProject);

    router.push("/project-map");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <AppHeader />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
            Project Platform
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            My Projects
          </h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            Create, save and open projects. This overview helps you see which
            projects exist, which project is active, and how much structure each
            project currently has.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
            <h2 id="create-project-heading" className="text-xl font-semibold">
              Create new project
            </h2>
            <p
              id="create-project-description"
              className="mt-2 text-sm text-slate-400"
            >
              Start with a simple project name. More structure can be added
              later through the project interview, project map, members, risks,
              decisions and status report.
            </p>

            <form
              onSubmit={handleCreateProject}
              className="mt-6 space-y-4"
              aria-labelledby="create-project-heading"
              aria-describedby="create-project-description"
            >
              <div>
                <label
                  htmlFor="project-name"
                  className="block text-sm font-medium text-slate-200"
                >
                  Project name
                </label>
                <input
                  id="project-name"
                  value={projectName}
                  onChange={(event) =>
                    handleProjectNameChange(event.target.value)
                  }
                  placeholder="Example: Website redesign"
                  aria-required="true"
                  aria-invalid={projectNameError ? "true" : "false"}
                  aria-describedby={
                    projectNameError ? "project-name-error" : undefined
                  }
                  className={`mt-2 w-full rounded-xl border bg-slate-950 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:ring-2 ${
                    projectNameError
                      ? "border-rose-500 ring-rose-400"
                      : "border-slate-700 ring-cyan-400"
                  }`}
                />

                {projectNameError && (
                  <p
                    id="project-name-error"
                    role="alert"
                    aria-live="polite"
                    className="mt-2 text-sm font-medium text-rose-300"
                  >
                    {projectNameError}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="project-description"
                  className="block text-sm font-medium text-slate-200"
                >
                  Description
                </label>
                <textarea
                  id="project-description"
                  value={projectDescription}
                  onChange={(event) =>
                    setProjectDescription(event.target.value)
                  }
                  placeholder="Short description of the project"
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-cyan-400 placeholder:text-slate-500 focus:ring-2"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Create project
              </button>
            </form>
          </section>

          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Saved projects</h2>
                <p className="mt-1 text-sm text-slate-400">
                  {state.projects.length} saved project
                  {state.projects.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            {state.projects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-center">
                <h3 className="text-lg font-semibold">No projects yet</h3>
                <p className="mt-2 text-slate-400">
                  Create your first project to start using Project Compass as a
                  project platform.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {state.projects.map((project) => {
                  const isActive = project.id === state.activeProjectId;
                  const attentionItems = getAttentionItems(project);
                  const projectHealth = getProjectHealth(
                    project,
                    attentionItems
                  );

                  return (
                    <article
                      key={project.id}
                      className={`rounded-2xl border p-5 shadow-lg ${
                        isActive
                          ? "border-cyan-400 bg-cyan-400/10"
                          : "border-slate-800 bg-slate-900/70"
                      }`}
                    >
                      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-xl font-semibold">
                              {project.name}
                            </h3>

                            {isActive && (
                              <span className="rounded-full bg-cyan-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-950">
                                Active
                              </span>
                            )}

                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${getProjectHealthClasses(
                                projectHealth
                              )}`}
                            >
                              {projectHealth.title}
                            </span>
                          </div>

                          {project.description ? (
                            <p className="mt-2 text-slate-300">
                              {project.description}
                            </p>
                          ) : (
                            <p className="mt-2 text-slate-500">
                              No description added yet.
                            </p>
                          )}

                          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                            {projectHealth.summary}
                          </p>

                          <dl className="mt-5 grid gap-3 text-sm text-slate-400 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                              <dt className="font-medium text-slate-300">
                                Health
                              </dt>
                              <dd className="mt-1">{projectHealth.title}</dd>
                            </div>

                            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                              <dt className="font-medium text-slate-300">
                                Status
                              </dt>
                              <dd className="mt-1">
                                {formatProjectStatus(project.status)}
                              </dd>
                            </div>

                            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                              <dt className="font-medium text-slate-300">
                                Attention items
                              </dt>
                              <dd className="mt-1">{attentionItems.length}</dd>
                            </div>

                            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                              <dt className="font-medium text-slate-300">
                                Members
                              </dt>
                              <dd className="mt-1">{project.members.length}</dd>
                            </div>

                            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                              <dt className="font-medium text-slate-300">
                                Tasks
                              </dt>
                              <dd className="mt-1">{project.tasks.length}</dd>
                            </div>

                            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                              <dt className="font-medium text-slate-300">
                                Risks
                              </dt>
                              <dd className="mt-1">{project.risks.length}</dd>
                            </div>

                            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                              <dt className="font-medium text-slate-300">
                                Decisions
                              </dt>
                              <dd className="mt-1">
                                {project.decisions.length}
                              </dd>
                            </div>

                            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                              <dt className="font-medium text-slate-300">
                                Last updated
                              </dt>
                              <dd className="mt-1">
                                {new Date(
                                  project.updatedAt
                                ).toLocaleDateString("sv-SE")}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenProject(project.id)}
                          className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-300"
                        >
                          Open project
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}