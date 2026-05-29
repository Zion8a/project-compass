"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppHeader from "../../components/AppHeader";
import {
  getActiveProject,
  loadProjectCompassState,
  Project,
} from "@/lib/projectStorage";

type ProjectInterviewData = {
  projectName: string;
  purpose: string;
  goal: string;
  deliverables: string;
  risks: string;
  decisions: string;
};

type AttentionItem = {
  id: string;
  title: string;
  text: string;
  severity: "medium" | "high";
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

        <section className="mx-auto flex min-h-[calc(100vh-96px)] max-w-4xl flex-col items-center justify-center px-6 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            Project Compass
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            No project map found.
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Start by creating or opening a project. Project Compass needs an
            active project before it can show a useful project map.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/projects"
              className="rounded-2xl bg-white px-6 py-3 font-semibold text-slate-950 shadow-lg hover:bg-slate-200"
            >
              Go to My Projects
            </Link>

            <Link
              href="/new-project"
              className="rounded-2xl border border-slate-700 px-6 py-3 font-semibold text-slate-100 hover:border-sky-300 hover:text-sky-300"
            >
              Create new project
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const projectName =
    activeProject?.name ?? project?.projectName ?? "Untitled project";

  const projectDescription = activeProject?.description;

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

  const attentionItems = activeProject
    ? getAttentionItems(activeProject)
    : [];

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
            A shared overview of the project purpose, goals, deliverables,
            risks and decisions before the work is broken down into tasks.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
            Project name
          </p>

          <h2 className="mt-3 text-3xl font-bold">{projectName}</h2>

          {projectDescription && (
            <p className="mt-3 max-w-3xl text-slate-300">
              {projectDescription}
            </p>
          )}
        </div>

        {activeProject && (
          <section className="mt-8 rounded-3xl border border-cyan-500/30 bg-cyan-500/10 p-6">
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                Active project summary
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Current project structure
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                This summary is based on the active project data. It shows how
                much structure the project currently has and prepares the app
                for Attention needed and Project Health.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ProjectSummaryCard
                title="Members"
                value={membersCount.toString()}
                text="People added to this project."
              />

              <ProjectSummaryCard
                title="Tasks"
                value={tasksCount.toString()}
                text="Tasks connected to this project."
              />

              <ProjectSummaryCard
                title="Blocked tasks"
                value={blockedTasksCount.toString()}
                text="Tasks that may need action."
              />

              <ProjectSummaryCard
                title="Risks"
                value={risksCount.toString()}
                text="Risks connected to this project."
              />

              <ProjectSummaryCard
                title="High risks"
                value={highRisksCount.toString()}
                text="Risks with high probability or impact."
              />

              <ProjectSummaryCard
                title="Decisions"
                value={decisionsCount.toString()}
                text="Decisions connected to this project."
              />

              <ProjectSummaryCard
                title="Open decisions"
                value={openDecisionsCount.toString()}
                text="Decisions that still need to be handled."
              />

              <ProjectSummaryCard
                title="Status"
                value={formatProjectStatus(activeProject.status)}
                text="Current high-level project status."
              />
            </div>
          </section>
        )}

        {activeProject && (
          <section className="mt-8 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6">
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
                Attention needed
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                What needs project leader attention?
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                Project Compass checks the active project for blocked work,
                missing responsibility, high risks and open decisions.
              </p>
            </div>

            {attentionItems.length === 0 ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
                <h3 className="font-semibold text-emerald-200">
                  No attention items right now.
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  No blocked tasks, high risks, open decisions or missing
                  owners were found in the active project.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {attentionItems.map((item) => (
                  <AttentionCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <ProjectMapCard
            number="01"
            title="Why are we doing this project?"
            helpText="The project background, need or problem."
            content={
              project?.purpose ??
              activeProject?.description ??
              "Purpose has not been defined yet."
            }
          />

          <ProjectMapCard
            number="02"
            title="What should be better?"
            helpText="The effect or change that should be visible when the project is complete."
            content={project?.goal ?? "Goal has not been defined yet."}
          />

          <ProjectMapCard
            number="03"
            title="What should be delivered?"
            helpText="Concrete results, documents, activities or decisions."
            content={project?.deliverables || "Not specified yet."}
          />

          <ProjectMapCard
            number="04"
            title="What can go wrong?"
            helpText="Risks, obstacles or uncertainties that could affect the project."
            content={project?.risks || "No risks specified yet."}
          />

          <ProjectMapCard
            number="05"
            title="Which decisions are needed?"
            helpText="Decisions the project depends on in order to move forward."
            content={project?.decisions || "No decisions specified yet."}
          />

          <ProjectMapCard
            number="06"
            title="Next step"
            helpText="What the user should do after the project map."
            content="Create the first tasks, identify responsible members and start building the project workspace."
          />
        </div>

        <div className="mt-10 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
            Recommended next step
          </p>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-base leading-7 text-slate-200">
              When the project map is clear enough, the next step is to break
              the work down into concrete tasks in the workspace.
            </p>

            <Link
              href="/project-board"
              className="w-fit rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg hover:bg-slate-200"
            >
              Go to workspace
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function getAttentionItems(project: Project): AttentionItem[] {
  const blockedTasks = project.tasks.filter(
    (task) => task.status === "blocked"
  );

  const tasksWithoutOwner = project.tasks.filter((task) => !task.ownerId);

  const risksWithoutOwner = project.risks.filter(
    (risk) => !risk.ownerId && !risk.owner
  );

  const highRisks = project.risks.filter(
    (risk) => risk.probability === "high" || risk.impact === "high"
  );

  const decisionsWithoutOwner = project.decisions.filter(
    (decision) => !decision.ownerId && !decision.owner
  );

  const openDecisions = project.decisions.filter(
    (decision) => decision.status === "open"
  );

  const items: AttentionItem[] = [];

  if (blockedTasks.length > 0) {
    items.push({
      id: "blocked-tasks",
      title: `${blockedTasks.length} blocked task${
        blockedTasks.length === 1 ? "" : "s"
      }`,
      text: "Blocked tasks may prevent the project from moving forward.",
      severity: "high",
    });
  }

  if (tasksWithoutOwner.length > 0) {
    items.push({
      id: "tasks-without-owner",
      title: `${tasksWithoutOwner.length} task${
        tasksWithoutOwner.length === 1 ? "" : "s"
      } without owner`,
      text: "Tasks without an owner can easily be missed or delayed.",
      severity: "medium",
    });
  }

  if (risksWithoutOwner.length > 0) {
    items.push({
      id: "risks-without-owner",
      title: `${risksWithoutOwner.length} risk${
        risksWithoutOwner.length === 1 ? "" : "s"
      } without owner`,
      text: "Risks without a responsible person may not be followed up.",
      severity: "medium",
    });
  }

  if (highRisks.length > 0) {
    items.push({
      id: "high-risks",
      title: `${highRisks.length} high risk${
        highRisks.length === 1 ? "" : "s"
      }`,
      text: "High risks should be reviewed and handled before they affect the project.",
      severity: "high",
    });
  }

  if (decisionsWithoutOwner.length > 0) {
    items.push({
      id: "decisions-without-owner",
      title: `${decisionsWithoutOwner.length} decision${
        decisionsWithoutOwner.length === 1 ? "" : "s"
      } without owner`,
      text: "Decisions without an owner may remain unclear or unresolved.",
      severity: "medium",
    });
  }

  if (openDecisions.length > 0) {
    items.push({
      id: "open-decisions",
      title: `${openDecisions.length} open decision${
        openDecisions.length === 1 ? "" : "s"
      }`,
      text: "Open decisions can block direction, scope or next steps.",
      severity: "high",
    });
  }

  return items;
}

function ProjectMapCard({
  number,
  title,
  helpText,
  content,
}: {
  number: string;
  title: string;
  helpText: string;
  content: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-400 text-sm font-bold text-slate-950">
          {number}
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">{helpText}</p>

          <p className="mt-4 whitespace-pre-line text-base leading-7 text-slate-200">
            {content}
          </p>
        </div>
      </div>
    </article>
  );
}

function ProjectSummaryCard({
  title,
  value,
  text,
}: {
  title: string;
  value: string;
  text: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-white">{value}</p>

      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </article>
  );
}

function AttentionCard({ item }: { item: AttentionItem }) {
  const severityClasses =
    item.severity === "high"
      ? "border-red-500/40 bg-red-500/10 text-red-100"
      : "border-amber-500/40 bg-amber-500/10 text-amber-100";

  return (
    <article className={`rounded-2xl border p-5 ${severityClasses}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">
        {item.severity === "high" ? "High attention" : "Needs attention"}
      </p>

      <h3 className="mt-2 text-lg font-bold">{item.title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-200">{item.text}</p>
    </article>
  );
}

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