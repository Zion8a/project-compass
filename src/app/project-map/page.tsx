"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppHeader from "../../components/AppHeader";
import {
  getActiveProject,
  loadProjectCompassState,
  Project,
} from "@/lib/projectStorage";
import {
  AttentionItem,
  getAttentionItems,
  getProjectHealth,
  ProjectHealth,
} from "@/lib/projectInsights";

type ProjectInterviewData = {
  projectName: string;
  purpose: string;
  goal: string;
  deliverables: string;
  risks: string;
  decisions: string;
};

type SetupChecklistItem = {
  id: string;
  title: string;
  text: string;
  isComplete: boolean;
  href?: string;
};

export default function ProjectMapPage() {
  const [project, setProject] = useState<ProjectInterviewData | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    const savedProject = localStorage.getItem("project-compass-current-project");

    const platformState = loadProjectCompassState();
    const currentActiveProject = getActiveProject(platformState);

    setActiveProject(currentActiveProject);

    if (savedProject) {
      setProject(JSON.parse(savedProject));
    }
  }, []);

  if (!project && !activeProject) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <AppHeader currentPage="project-map" />

        <section className="mx-auto max-w-5xl px-6 py-12">
          <div className="rounded-3xl border border-dashed border-rose-500/40 bg-rose-500/10 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-300">
              No active project
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              No active project selected
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              Project Map needs an active project before it can show direction,
              setup progress, attention items and project health.
            </p>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              Go to My Projects to create a new project or open an existing one.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/projects"
                className="inline-flex rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 shadow-lg hover:bg-slate-200"
              >
                Go to My Projects
              </Link>

              <Link
                href="/new-project"
                className="inline-flex rounded-2xl border border-slate-700 px-5 py-3 font-semibold text-slate-100 hover:border-sky-300 hover:text-sky-300"
              >
                Create new project
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const projectName =
    activeProject?.name ?? project?.projectName ?? "Untitled project";

  const projectDescription =
    activeProject?.description ??
    project?.purpose ??
    "No project description has been added yet.";

  const membersCount = activeProject?.members.length ?? 0;
  const tasksCount = activeProject?.tasks.length ?? 0;
  const blockedTasksCount =
    activeProject?.tasks.filter((task) => task.status === "blocked").length ??
    0;

  const risksCount = activeProject?.risks.length ?? 0;
  const highRisksCount =
    activeProject?.risks.filter(
      (risk) => risk.probability === "high" || risk.impact === "high"
    ).length ?? 0;

  const decisionsCount = activeProject?.decisions.length ?? 0;
  const openDecisionsCount =
    activeProject?.decisions.filter((decision) => decision.status === "open")
      .length ?? 0;

  const attentionItems = activeProject ? getAttentionItems(activeProject) : [];
  const projectHealth = activeProject
    ? getProjectHealth(activeProject, attentionItems)
    : null;

  const setupChecklistItems = getSetupChecklistItems({
    project,
    activeProject,
  });

  const completedSetupItems = setupChecklistItems.filter(
    (item) => item.isComplete
  ).length;

  const risksWithRelatedTasks =
    activeProject?.risks.filter((risk) => risk.relatedTaskId) ?? [];

  const risksWithoutRelatedTasks =
    activeProject?.risks.filter((risk) => !risk.relatedTaskId) ?? [];

    const decisionsWithRelatedTasks =
  activeProject?.decisions.filter((decision) => decision.relatedTaskId) ?? [];

const decisionsWithoutRelatedTasks =
  activeProject?.decisions.filter((decision) => !decision.relatedTaskId) ?? [];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AppHeader currentPage="project-map" />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            Project Compass
          </p>

          <h1 className="text-4xl font-bold tracking-tight">Project Map</h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Get a clear overview of the active project before moving into task
            work, risk handling, decisions or reporting.
          </p>

          <p className="mt-3 text-slate-400">Project: {projectName}</p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <SummaryCard
            title="Members"
            value={membersCount.toString()}
            text="People connected to the active project."
          />

          <SummaryCard
            title="Tasks"
            value={tasksCount.toString()}
            text={`${blockedTasksCount} blocked task${
              blockedTasksCount === 1 ? "" : "s"
            }.`}
          />

          <SummaryCard
            title="Risks"
            value={risksCount.toString()}
            text={`${highRisksCount} high risk${
              highRisksCount === 1 ? "" : "s"
            }.`}
          />

          <SummaryCard
            title="Decisions"
            value={decisionsCount.toString()}
            text={`${openDecisionsCount} open decision${
              openDecisionsCount === 1 ? "" : "s"
            }.`}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
              Active project summary
            </p>

            <h2 className="mt-2 text-2xl font-bold">{projectName}</h2>

            <p className="mt-4 whitespace-pre-line leading-7 text-slate-300">
              {projectDescription}
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <DirectionCard
                title="Purpose"
                text={
                  project?.purpose ||
                  activeProject?.description ||
                  "Purpose has not been clarified yet."
                }
              />

              <DirectionCard
                title="Goal"
                text={project?.goal || "Goal has not been clarified yet."}
              />

              <DirectionCard
                title="Deliverables"
                text={
                  project?.deliverables ||
                  "Deliverables have not been clarified yet."
                }
              />

              <DirectionCard
                title="Decisions"
                text={
                  project?.decisions ||
                  "Important decisions have not been clarified yet."
                }
              />
            </div>
          </section>

                  <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                Traceability
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Decision to task links
              </h2>
            </div>

            <p className="text-sm text-slate-400">
              {decisionsWithRelatedTasks.length} of {decisionsCount} decision
              {decisionsCount === 1 ? "" : "s"} linked to tasks.
            </p>
          </div>

          {decisionsCount === 0 ? (
            <p className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm leading-6 text-slate-400">
              No decisions have been added yet. Add decisions before connecting
              them to tasks.
            </p>
          ) : (
            <div className="mt-6 grid gap-4">
              {activeProject?.decisions.map((decision) => {
                const relatedTask = activeProject.tasks.find(
                  (task) => task.id === decision.relatedTaskId
                );

                return (
                  <article
                    key={decision.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="font-semibold text-white">
                          {decision.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {relatedTask
                            ? `Affects task: ${relatedTask.title}`
                            : "No related task connected yet."}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                          relatedTask
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                            : "border-amber-500/40 bg-amber-500/10 text-amber-200"
                        }`}
                      >
                        {relatedTask ? "Linked" : "Unlinked"}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {decisionsWithoutRelatedTasks.length > 0 && (
            <p className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm leading-6 text-amber-100">
              {decisionsWithoutRelatedTasks.length} decision
              {decisionsWithoutRelatedTasks.length === 1 ? "" : "s"} still need
              a related task to improve traceability.
            </p>
          )}
        </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
              Project Health
            </p>

            {projectHealth ? (
              <ProjectHealthCard projectHealth={projectHealth} />
            ) : (
              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <h2 className="text-xl font-bold">Health not available yet</h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Project Health is calculated when an active project exists.
                </p>
              </div>
            )}
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                Project setup checklist
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Setup progress: {completedSetupItems} of{" "}
                {setupChecklistItems.length}
              </h2>
            </div>

            <p className="text-sm text-slate-400">
              Use this checklist to understand what should be clarified next.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {setupChecklistItems.map((item) => (
              <SetupChecklistCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                Attention Needed
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {attentionItems.length === 0
                  ? "No attention items right now"
                  : `${attentionItems.length} item${
                      attentionItems.length === 1 ? "" : "s"
                    } need attention`}
              </h2>
            </div>
          </div>

          {attentionItems.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm leading-6 text-emerald-100">
              Nothing urgent was found in tasks, risks or decisions. Continue
              building the project structure.
            </p>
          ) : (
            <div className="mt-6 grid gap-4">
              {attentionItems.map((item, index) => (
                <AttentionItemCard key={index} item={item} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                Traceability
              </p>

              <h2 className="mt-2 text-2xl font-bold">Risk to task links</h2>
            </div>

            <p className="text-sm text-slate-400">
              {risksWithRelatedTasks.length} of {risksCount} risk
              {risksCount === 1 ? "" : "s"} linked to tasks.
            </p>
          </div>

          {risksCount === 0 ? (
            <p className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm leading-6 text-slate-400">
              No risks have been added yet. Add risks before connecting them to
              tasks.
            </p>
          ) : (
            <div className="mt-6 grid gap-4">
              {activeProject?.risks.map((risk) => {
                const relatedTask = activeProject.tasks.find(
                  (task) => task.id === risk.relatedTaskId
                );

                return (
                  <article
                    key={risk.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="font-semibold text-white">
                          {risk.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {relatedTask
                            ? `Affects task: ${relatedTask.title}`
                            : "No related task connected yet."}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                          relatedTask
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                            : "border-amber-500/40 bg-amber-500/10 text-amber-200"
                        }`}
                      >
                        {relatedTask ? "Linked" : "Unlinked"}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {risksWithoutRelatedTasks.length > 0 && (
            <p className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm leading-6 text-amber-100">
              {risksWithoutRelatedTasks.length} risk
              {risksWithoutRelatedTasks.length === 1 ? "" : "s"} still need a
              related task to improve traceability.
            </p>
          )}
        </section>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
            Recommended next step
          </p>

          <h2 className="mt-2 text-2xl font-bold">Move the project forward</h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
            Use the setup checklist and Attention Needed section to decide what
            should be clarified next. A good next step is usually to add missing
            members, assign responsibility, handle blocked work, review high
            risks or close open decisions.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/project-members"
              className="inline-flex rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 shadow-lg hover:bg-slate-200"
            >
              Add members
            </Link>

            <Link
              href="/project-board"
              className="inline-flex rounded-2xl border border-slate-700 px-5 py-3 font-semibold text-slate-100 hover:border-sky-300 hover:text-sky-300"
            >
              Open Workspace
            </Link>

            <Link
              href="/project-report"
              className="inline-flex rounded-2xl border border-slate-700 px-5 py-3 font-semibold text-slate-100 hover:border-sky-300 hover:text-sky-300"
            >
              Open Status Report
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}

function getSetupChecklistItems({
  project,
  activeProject,
}: {
  project: ProjectInterviewData | null;
  activeProject: Project | null;
}): SetupChecklistItem[] {
  return [
    {
      id: "project-name",
      title: "Project name",
      text: "The project has a clear name.",
      isComplete: Boolean(activeProject?.name || project?.projectName),
      href: "/projects",
    },
    {
      id: "purpose",
      title: "Purpose or description",
      text: "The project explains why it exists.",
      isComplete: Boolean(activeProject?.description || project?.purpose),
      href: "/new-project",
    },
    {
      id: "goal",
      title: "Goal",
      text: "The intended outcome is described.",
      isComplete: Boolean(project?.goal),
      href: "/new-project",
    },
    {
      id: "deliverables",
      title: "Deliverables",
      text: "The expected deliverables are described.",
      isComplete: Boolean(project?.deliverables),
      href: "/new-project",
    },
    {
      id: "members",
      title: "Project members",
      text: "The project has at least one member.",
      isComplete: Boolean(activeProject && activeProject.members.length > 0),
      href: "/project-members",
    },
    {
      id: "tasks",
      title: "Tasks",
      text: "The project has at least one task.",
      isComplete: Boolean(activeProject && activeProject.tasks.length > 0),
      href: "/project-board",
    },
    {
      id: "risks",
      title: "Risks",
      text: "The project has at least one documented risk.",
      isComplete: Boolean(activeProject && activeProject.risks.length > 0),
      href: "/project-risks",
    },
    {
      id: "decisions",
      title: "Decisions",
      text: "The project has at least one documented decision.",
      isComplete: Boolean(activeProject && activeProject.decisions.length > 0),
      href: "/project-decisions",
    },
    {
      id: "status-report",
      title: "Status report ready to review",
      text: "The project has enough structure to review the status report.",
      isComplete: Boolean(
        activeProject &&
          (activeProject.members.length > 0 ||
            activeProject.tasks.length > 0 ||
            activeProject.risks.length > 0 ||
            activeProject.decisions.length > 0)
      ),
      href: "/project-report",
    },
  ];
}

function SetupChecklistCard({ item }: { item: SetupChecklistItem }) {
  const content = (
    <article
      className={`rounded-2xl border p-4 ${
        item.isComplete
          ? "border-emerald-500/30 bg-emerald-500/10"
          : "border-slate-800 bg-slate-950"
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-[0.2em] ${
          item.isComplete ? "text-emerald-300" : "text-slate-500"
        }`}
      >
        {item.isComplete ? "Complete" : "Needs input"}
      </p>

      <h3 className="mt-2 font-semibold text-white">{item.title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
    </article>
  );

  if (!item.href) {
    return content;
  }

  return (
    <Link href={item.href} className="block">
      {content}
    </Link>
  );
}

function ProjectHealthCard({
  projectHealth,
}: {
  projectHealth: ProjectHealth;
}) {
  return (
    <div
      className={`mt-4 rounded-2xl border p-5 ${getProjectHealthClasses(
        projectHealth
      )}`}
    >
      <h2 className="text-xl font-bold">{projectHealth.title}</h2>

      <p className="mt-2 text-sm leading-6">{projectHealth.summary}</p>
    </div>
  );
}

function AttentionItemCard({ item }: { item: AttentionItem }) {
  return (
    <article
      className={`rounded-2xl border p-4 ${getAttentionSeverityClasses(
        item.severity
      )}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-semibold">{item.title}</h3>

          <p className="mt-2 text-sm leading-6 opacity-85">{item.text}</p>
        </div>

        <span
          className={`w-fit rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${getAttentionSeverityBadgeClasses(
            item.severity
          )}`}
        >
          {formatAttentionSeverity(item.severity)}
        </span>
      </div>
    </article>
  );
}

function DirectionCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {title}
      </p>

      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-300">
        {text}
      </p>
    </article>
  );
}

function SummaryCard({
  title,
  value,
  text,
}: {
  title: string;
  value: string;
  text: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
        {title}
      </p>

      <p className="mt-3 text-4xl font-bold text-white">{value}</p>

      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </article>
  );
}

function getAttentionSeverityClasses(severity: AttentionItem["severity"]) {
  if (severity === "high") {
    return "border-red-500/40 bg-red-500/10 text-red-100";
  }

  return "border-amber-500/40 bg-amber-500/10 text-amber-100";
}

function getAttentionSeverityBadgeClasses(severity: AttentionItem["severity"]) {
  if (severity === "high") {
    return "border-red-400/50 bg-red-400/10 text-red-100";
  }

  return "border-amber-400/50 bg-amber-400/10 text-amber-100";
}

function formatAttentionSeverity(severity: AttentionItem["severity"]) {
  if (severity === "high") {
    return "High";
  }

  return "Medium";
}

function getProjectHealthClasses(projectHealth: ProjectHealth) {
  if (projectHealth.level === "stable") {
    return "border-emerald-500/40 bg-emerald-500/10 text-emerald-100";
  }

  if (projectHealth.level === "needs-attention") {
    return "border-amber-500/40 bg-amber-500/10 text-amber-100";
  }

  return "border-red-500/40 bg-red-500/10 text-red-100";
}