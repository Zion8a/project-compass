"use client";

import Link from "next/link";
import { ReactNode, useEffect, useMemo, useState } from "react";
import AppHeader from "@/components/AppHeader";
import {
  getActiveProject,
  loadProjectCompassState,
  Project,
  ProjectDecisionStatus,
  ProjectRiskStatus,
  ProjectTaskStatus,
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

type ReportTone = "emerald" | "amber" | "rose";

export default function ProjectReportPage() {
  const [project, setProject] = useState<ProjectInterviewData | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle"
  );

  useEffect(() => {
    const savedProject = localStorage.getItem("project-compass-current-project");

    const platformState = loadProjectCompassState();
    const currentActiveProject = getActiveProject(platformState);

    setActiveProject(currentActiveProject);

    if (savedProject) {
      setProject(JSON.parse(savedProject));
    }
  }, []);

  const tasks = activeProject?.tasks ?? [];
  const risks = activeProject?.risks ?? [];
  const decisions = activeProject?.decisions ?? [];
  const members = activeProject?.members ?? [];

  const attentionItems = activeProject ? getAttentionItems(activeProject) : [];
  const projectHealth = activeProject
    ? getProjectHealth(activeProject, attentionItems)
    : null;

  function getMemberName(ownerId?: string, fallbackOwner?: string) {
    if (ownerId) {
      return (
        activeProject?.members.find((member) => member.id === ownerId)?.name ||
        "Unknown member"
      );
    }

    if (fallbackOwner) {
      return fallbackOwner;
    }

    return "Unassigned";
  }

  const report = useMemo(() => {
    const doneTasks = tasks.filter((task) => task.status === "done");
    const blockedTasks = tasks.filter((task) => task.status === "blocked");

    const openRisks = risks.filter((risk) => risk.status !== "handled");
    const highRisks = risks.filter(
      (risk) => risk.probability === "high" || risk.impact === "high"
    );

    const openDecisions = decisions.filter(
      (decision) => decision.status === "open"
    );

    const decidedDecisions = decisions.filter(
      (decision) => decision.status === "decided"
    );

    const statusTone: ReportTone = projectHealth
      ? getProjectHealthTone(projectHealth)
      : "emerald";

    return {
      totalTasks: tasks.length,
      doneTasks: doneTasks.length,
      blockedTasks: blockedTasks.length,
      openRisks,
      highRisks,
      openDecisions,
      decidedDecisions,
      statusLabel: projectHealth?.title ?? "Stable",
      statusText:
        projectHealth?.summary ??
        "The project has no clear warning signs based on registered tasks, risks and decisions.",
      statusTone,
    };
  }, [tasks, risks, decisions, projectHealth]);

  function buildStatusReportMarkdown() {
    const projectName =
      activeProject?.name || project?.projectName || "Untitled project";

    const memberSection =
      members.length === 0
        ? "No project members have been added yet."
        : members
            .map((member) => {
              return [
                `- **${member.name}**`,
                `  - Role: ${member.role || "Not specified"}`,
                `  - Responsibility: ${
                  member.responsibility || "Not specified"
                }`,
                `  - Comment: ${member.comment || "No comment"}`,
              ].join("\n");
            })
            .join("\n");

    const attentionSection =
  attentionItems.length === 0
    ? "No attention items were found in the active project."
    : attentionItems
        .map((item) => {
          return `- **${formatAttentionSeverity(item.severity)}** — **${
            item.title
          }** — ${item.text}`;
        })
        .join("\n");

    const taskSection =
      tasks.length === 0
        ? "No tasks have been created yet."
        : tasks
            .map((task) => {
              return `- **${task.title}** — ${translateTaskStatus(
                task.status
              )} — Responsible: ${getMemberName(task.ownerId)}`;
            })
            .join("\n");

    const riskSection =
      risks.length === 0
        ? "No risks have been created yet."
        : risks
            .map((risk) => {
              return `- **${risk.title}** — ${translateRiskStatus(
                risk.status
              )} — Responsible: ${getMemberName(risk.ownerId, risk.owner)}`;
            })
            .join("\n");

    const decisionSection =
      decisions.length === 0
        ? "No decisions have been created yet."
        : decisions
            .map((decision) => {
              return `- **${decision.title}** — ${translateDecisionStatus(
                decision.status
              )} — Responsible: ${getMemberName(
                decision.ownerId,
                decision.owner
              )}`;
            })
            .join("\n");

    return [
      `# Status Report – ${projectName}`,
      "",
      `Date: ${new Date().toLocaleDateString("sv-SE")}`,
      "",
      "## Overall Project Status",
      "",
      `**${report.statusLabel}**`,
      "",
      report.statusText,
      "",
      "## Summary",
      "",
      `- Total tasks: ${report.totalTasks}`,
      `- Done tasks: ${report.doneTasks}`,
      `- Blocked tasks: ${report.blockedTasks}`,
      `- Open risks: ${report.openRisks.length}`,
      `- High risks: ${report.highRisks.length}`,
      `- Open decisions: ${report.openDecisions.length}`,
      `- Project members: ${members.length}`,
      "",
      "## Attention Needed",
      "",
      attentionSection,
      "",
      "## Purpose",
      "",
      project?.purpose ||
        activeProject?.description ||
        "No purpose has been defined yet.",
      "",
      "## Goal",
      "",
      project?.goal || "No goal has been defined yet.",
      "",
      "## Deliverables",
      "",
      project?.deliverables || "No deliverables have been defined yet.",
      "",
      "## Project Members",
      "",
      memberSection,
      "",
      "## Task Responsibility",
      "",
      taskSection,
      "",
      "## Risk Responsibility",
      "",
      riskSection,
      "",
      "## Decision Responsibility",
      "",
      decisionSection,
      "",
      "## Recommended Next Steps",
      "",
      "- Follow up blocked tasks.",
      "- Prioritize high-probability or high-impact risks.",
      "- Clarify open decisions.",
      "- Check that important tasks, risks and decisions have responsible owners.",
      "- Update the workspace after the next project check-in.",
    ].join("\n");
  }

  async function handleCopyMarkdownReport() {
    try {
      const markdown = buildStatusReportMarkdown();

      await navigator.clipboard.writeText(markdown);

      setCopyStatus("copied");

      window.setTimeout(() => {
        setCopyStatus("idle");
      }, 2500);
    } catch {
      setCopyStatus("error");
    }
  }

  if (!activeProject && !project) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <AppHeader currentPage="project-report" />

        <section className="mx-auto max-w-5xl px-6 py-12">
          <div className="rounded-3xl border border-dashed border-rose-500/40 bg-rose-500/10 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-300">
              No active project
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              No active project selected
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              Status Report needs an active project before it can summarize
              status, responsibilities, risks, decisions and next steps.
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
    activeProject?.name || project?.projectName || "Untitled project";

  const projectPurpose =
    project?.purpose ||
    activeProject?.description ||
    "No purpose has been defined yet.";

  const projectGoal = project?.goal || "No goal has been defined yet.";

  const projectDeliverables =
    project?.deliverables || "No deliverables have been defined yet.";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AppHeader currentPage="project-report" />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            Project Compass
          </p>

          <h1 className="text-4xl font-bold tracking-tight">Status Report</h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            A shareable overview of project status, responsibilities, risks,
            decisions, attention items and recommended next steps.
          </p>

          <p className="mt-3 text-slate-400">Project: {projectName}</p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <SummaryCard
            title="Total tasks"
            value={report.totalTasks.toString()}
            text="All tasks in the active project."
          />

          <SummaryCard
            title="Done tasks"
            value={report.doneTasks.toString()}
            text="Tasks that have been completed."
          />

          <SummaryCard
            title="Blocked tasks"
            value={report.blockedTasks.toString()}
            text="Tasks that need attention."
          />

          <SummaryCard
            title="Project members"
            value={members.length.toString()}
            text="People connected to the active project."
          />
        </div>

        <section
          className={`rounded-3xl border p-6 shadow-2xl ${getToneClasses(
            report.statusTone
          )}`}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.25em]">
            Overall Project Status
          </p>

          <h2 className="mt-2 text-3xl font-bold">{report.statusLabel}</h2>

          <p className="mt-3 max-w-3xl text-sm leading-6">
            {report.statusText}
          </p>
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
              Nothing urgent was found in tasks, risks or decisions.
            </p>
          ) : (
            <div className="mt-6 grid gap-4">
              {attentionItems.map((item) => (
                <AttentionItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <ReportSection title="Purpose">{projectPurpose}</ReportSection>
          <ReportSection title="Goal">{projectGoal}</ReportSection>
          <ReportSection title="Deliverables">
            {projectDeliverables}
          </ReportSection>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
            Project Members
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {members.length === 0
              ? "No members added yet"
              : `${members.length} member${members.length === 1 ? "" : "s"}`}
          </h2>

          {members.length === 0 ? (
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Add project members to make responsibility clearer.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {members.map((member) => (
                <article
                  key={member.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
                >
                  <h3 className="font-semibold text-white">{member.name}</h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Role: {member.role || "Not specified"}
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Responsibility: {member.responsibility || "Not specified"}
                  </p>

                  {member.comment && (
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {member.comment}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <ResponsibilitySection title="Task Responsibility">
            {tasks.length === 0 ? (
              <p className="text-sm leading-6 text-slate-400">
                No tasks have been created yet.
              </p>
            ) : (
              tasks.map((task) => (
                <ResponsibilityItem
                  key={task.id}
                  title={task.title}
                  meta={`${translateTaskStatus(
                    task.status
                  )} • Responsible: ${getMemberName(task.ownerId)}`}
                />
              ))
            )}
          </ResponsibilitySection>

          <ResponsibilitySection title="Risk Responsibility">
            {risks.length === 0 ? (
              <p className="text-sm leading-6 text-slate-400">
                No risks have been created yet.
              </p>
            ) : (
              risks.map((risk) => (
                <ResponsibilityItem
                  key={risk.id}
                  title={risk.title}
                  meta={`${translateRiskStatus(
                    risk.status
                  )} • Responsible: ${getMemberName(
                    risk.ownerId,
                    risk.owner
                  )}`}
                />
              ))
            )}
          </ResponsibilitySection>

          <ResponsibilitySection title="Decision Responsibility">
            {decisions.length === 0 ? (
              <p className="text-sm leading-6 text-slate-400">
                No decisions have been created yet.
              </p>
            ) : (
              decisions.map((decision) => (
                <ResponsibilityItem
                  key={decision.id}
                  title={decision.title}
                  meta={`${translateDecisionStatus(
                    decision.status
                  )} • Responsible: ${getMemberName(
                    decision.ownerId,
                    decision.owner
                  )}`}
                />
              ))
            )}
          </ResponsibilitySection>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
            Recommended Next Steps
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Keep the project moving
          </h2>

          <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
            <li>Follow up blocked tasks.</li>
            <li>Prioritize high-probability or high-impact risks.</li>
            <li>Clarify open decisions.</li>
            <li>
              Check that important tasks, risks and decisions have responsible
              owners.
            </li>
            <li>Update the workspace after the next project check-in.</li>
          </ul>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
            Markdown Export
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Copy status report as Markdown
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
            Copy the current status report and paste it into GitHub, Teams,
            documentation, a school assignment or a project meeting note.
          </p>

          <button
            type="button"
            onClick={handleCopyMarkdownReport}
            className="mt-5 rounded-2xl bg-white px-6 py-3 font-semibold text-slate-950 shadow-lg hover:bg-slate-200"
          >
            Copy status report as Markdown
          </button>

          {copyStatus === "copied" && (
            <p className="mt-3 text-sm font-medium text-emerald-300">
              Status report copied as Markdown.
            </p>
          )}

          {copyStatus === "error" && (
            <p className="mt-3 text-sm font-medium text-rose-300">
              Could not copy the report. Please try again.
            </p>
          )}
        </section>
      </section>
    </main>
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

function ReportSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
        {title}
      </p>

      <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-300">
        {children}
      </p>
    </section>
  );
}

function ResponsibilitySection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
        {title}
      </p>

      <div className="mt-5 space-y-3">{children}</div>
    </section>
  );
}

function ResponsibilityItem({ title, meta }: { title: string; meta: string }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <h3 className="font-semibold text-white">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">{meta}</p>
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

function getProjectHealthTone(projectHealth: ProjectHealth): ReportTone {
  if (projectHealth.level === "stable") {
    return "emerald";
  }

  if (projectHealth.level === "needs-attention") {
    return "amber";
  }

  return "rose";
}

function getToneClasses(tone: ReportTone) {
  if (tone === "emerald") {
    return "border-emerald-500/40 bg-emerald-500/10 text-emerald-100";
  }

  if (tone === "amber") {
    return "border-amber-500/40 bg-amber-500/10 text-amber-100";
  }

  return "border-rose-500/40 bg-rose-500/10 text-rose-100";
}

function translateTaskStatus(status: ProjectTaskStatus) {
  if (status === "backlog") {
    return "Backlog";
  }

  if (status === "planned") {
    return "Planned";
  }

  if (status === "in-progress") {
    return "In progress";
  }

  if (status === "blocked") {
    return "Blocked";
  }

  if (status === "review") {
    return "Review";
  }

  return "Done";
}

function translateRiskStatus(status: ProjectRiskStatus) {
  if (status === "open") {
    return "Open";
  }

  if (status === "watching") {
    return "Watching";
  }

  return "Handled";
}

function translateDecisionStatus(status: ProjectDecisionStatus) {
  if (status === "open") {
    return "Open";
  }

  if (status === "decided") {
    return "Decided";
  }

  return "Postponed";
}