"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import AppHeader from "@/components/AppHeader";
import {
  getActiveProject,
  loadProjectCompassState,
  Project,
  ProjectDecision,
  ProjectDecisionStatus,
  ProjectRisk,
  ProjectRiskLevel,
  ProjectRiskStatus,
  ProjectTaskStatus,
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

    let statusLabel = "Stable";
    let statusText =
      "The project has no clear warning signs based on registered tasks, risks and decisions.";
    let statusTone = "emerald";

    if (
      blockedTasks.length > 0 ||
      highRisks.length > 0 ||
      openDecisions.length > 0 ||
      attentionItems.length > 0
    ) {
      statusLabel = "Needs attention";
      statusText =
        "The project has blocked tasks, high risks, open decisions or missing ownership that should be followed up.";
      statusTone = "amber";
    }

    if (
      blockedTasks.length >= 2 ||
      highRisks.length >= 2 ||
      openDecisions.length >= 3
    ) {
      statusLabel = "At risk";
      statusText =
        "The project has several signals that may affect progress, quality or delivery.";
      statusTone = "rose";
    }

    return {
      totalTasks: tasks.length,
      doneTasks: doneTasks.length,
      blockedTasks: blockedTasks.length,
      openRisks,
      highRisks,
      openDecisions,
      decidedDecisions,
      statusLabel,
      statusText,
      statusTone,
    };
  }, [tasks, risks, decisions, attentionItems.length]);

  function buildStatusReportMarkdown() {
    const projectName =
      project?.projectName || activeProject?.name || "Untitled project";

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
              return `- **${item.title}** — ${item.text}`;
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
            Collect the current project status in one place. Follow up tasks,
            risks, decisions, responsibility and recommended next steps.
          </p>

          <p className="mt-3 text-slate-400">
            {project?.projectName
              ? `Project: ${project.projectName}`
              : activeProject?.name
                ? `Project: ${activeProject.name}`
                : "No project found yet."}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleCopyMarkdownReport}
              className="w-fit rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 shadow-lg transition hover:bg-cyan-300"
            >
              Copy status report as Markdown
            </button>

            {copyStatus === "copied" && (
              <p className="text-sm font-medium text-emerald-300">
                Report copied to clipboard.
              </p>
            )}

            {copyStatus === "error" && (
              <p className="text-sm font-medium text-rose-300">
                Could not copy report. Try again.
              </p>
            )}
          </div>
        </div>

        <section
          className={`mb-8 rounded-3xl border p-6 shadow-2xl ${
            report.statusTone === "emerald"
              ? "border-emerald-500/30 bg-emerald-500/10"
              : report.statusTone === "amber"
                ? "border-amber-500/30 bg-amber-500/10"
                : "border-rose-500/30 bg-rose-500/10"
          }`}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
            Overall project status
          </p>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-bold">{report.statusLabel}</h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-200">
                {report.statusText}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/70 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Report date
              </p>

              <p className="mt-2 font-semibold text-white">
                {new Date().toLocaleDateString("sv-SE")}
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-7">
          <SummaryCard
            title="Tasks"
            value={report.totalTasks.toString()}
            text="Total number of tasks."
          />

          <SummaryCard
            title="Done"
            value={report.doneTasks.toString()}
            text="Completed tasks."
          />

          <SummaryCard
            title="Blocked"
            value={report.blockedTasks.toString()}
            text="Tasks that are blocked."
          />

          <SummaryCard
            title="Open risks"
            value={report.openRisks.length.toString()}
            text="Risks that are not handled."
          />

          <SummaryCard
            title="High risks"
            value={report.highRisks.length.toString()}
            text="Risks with high level."
          />

          <SummaryCard
            title="Open decisions"
            value={report.openDecisions.length.toString()}
            text="Decisions that remain open."
          />

          <SummaryCard
            title="Members"
            value={members.length.toString()}
            text="Members in the active project."
          />
        </div>

        <div className="mt-10">
          <ReportSection title="Attention Needed">
            {attentionItems.length === 0 ? (
              <p className="text-slate-300">
                No attention items were found in the active project.
              </p>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {attentionItems.map((item) => (
                  <AttentionReportItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </ReportSection>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <ReportSection title="Project purpose">
            <p className="whitespace-pre-line leading-7 text-slate-300">
              {project?.purpose ||
                activeProject?.description ||
                "No purpose has been defined yet."}
            </p>
          </ReportSection>

          <ReportSection title="Project goal">
            <p className="whitespace-pre-line leading-7 text-slate-300">
              {project?.goal || "No goal has been defined yet."}
            </p>
          </ReportSection>

          <ReportSection title="Deliverables">
            <p className="whitespace-pre-line leading-7 text-slate-300">
              {project?.deliverables || "No deliverables have been defined yet."}
            </p>
          </ReportSection>

          <ReportSection title="Recommended next steps">
            <ul className="space-y-3 text-slate-300">
              <li>• Follow up blocked tasks.</li>
              <li>• Prioritize risks with high probability or impact.</li>
              <li>• Make or clarify open decisions.</li>
              <li>
                • Check that important tasks, risks and decisions have
                responsible owners.
              </li>
              <li>• Update the workspace after the next project check-in.</li>
            </ul>
          </ReportSection>
        </div>

        <div className="mt-10">
          <ReportSection title="Project Members">
            {!activeProject || members.length === 0 ? (
              <p className="text-slate-300">
                No project members have been added yet.
              </p>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {members.map((member) => (
                  <article
                    key={member.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <h3 className="font-semibold text-white">{member.name}</h3>

                    <dl className="mt-4 grid gap-3 text-sm">
                      <div>
                        <dt className="font-medium text-slate-300">Role</dt>
                        <dd className="mt-1 text-slate-400">
                          {member.role || "Not specified"}
                        </dd>
                      </div>

                      <div>
                        <dt className="font-medium text-slate-300">
                          Responsibility
                        </dt>
                        <dd className="mt-1 text-slate-400">
                          {member.responsibility || "Not specified"}
                        </dd>
                      </div>

                      <div>
                        <dt className="font-medium text-slate-300">Comment</dt>
                        <dd className="mt-1 text-slate-400">
                          {member.comment || "No comment"}
                        </dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            )}
          </ReportSection>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <ReportSection title="Task Responsibility">
            {tasks.length === 0 ? (
              <p className="text-slate-300">
                No tasks have been created yet.
              </p>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <ResponsibilityItem
                    key={task.id}
                    title={task.title}
                    status={translateTaskStatus(task.status)}
                    responsible={getMemberName(task.ownerId)}
                  />
                ))}
              </div>
            )}
          </ReportSection>

          <ReportSection title="Risk Responsibility">
            {risks.length === 0 ? (
              <p className="text-slate-300">
                No risks have been created yet.
              </p>
            ) : (
              <div className="space-y-4">
                {risks.map((risk) => (
                  <ResponsibilityItem
                    key={risk.id}
                    title={risk.title}
                    status={translateRiskStatus(risk.status)}
                    responsible={getMemberName(risk.ownerId, risk.owner)}
                  />
                ))}
              </div>
            )}
          </ReportSection>

          <ReportSection title="Decision Responsibility">
            {decisions.length === 0 ? (
              <p className="text-slate-300">
                No decisions have been created yet.
              </p>
            ) : (
              <div className="space-y-4">
                {decisions.map((decision) => (
                  <ResponsibilityItem
                    key={decision.id}
                    title={decision.title}
                    status={translateDecisionStatus(decision.status)}
                    responsible={getMemberName(
                      decision.ownerId,
                      decision.owner
                    )}
                  />
                ))}
              </div>
            )}
          </ReportSection>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <ReportSection title="Open risks">
            {report.openRisks.length === 0 ? (
              <p className="text-slate-300">
                No open risks have been registered.
              </p>
            ) : (
              <div className="space-y-4">
                {report.openRisks.map((risk) => (
                  <RiskReportItem
                    key={risk.id}
                    risk={risk}
                    responsible={getMemberName(risk.ownerId, risk.owner)}
                  />
                ))}
              </div>
            )}
          </ReportSection>

          <ReportSection title="Open decisions">
            {report.openDecisions.length === 0 ? (
              <p className="text-slate-300">
                No open decisions have been registered.
              </p>
            ) : (
              <div className="space-y-4">
                {report.openDecisions.map((decision) => (
                  <DecisionReportItem
                    key={decision.id}
                    decision={decision}
                    responsible={getMemberName(
                      decision.ownerId,
                      decision.owner
                    )}
                  />
                ))}
              </div>
            )}
          </ReportSection>
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
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-xl font-bold">{title}</h2>

      <div className="mt-4">{children}</div>
    </section>
  );
}

function AttentionReportItem({ item }: { item: AttentionItem }) {
  const severityClasses =
    item.severity === "high"
      ? "border-red-500/40 bg-red-500/10 text-red-100"
      : "border-amber-500/40 bg-amber-500/10 text-amber-100";

  return (
    <article className={`rounded-2xl border p-4 ${severityClasses}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">
        {item.severity === "high" ? "High attention" : "Needs attention"}
      </p>

      <h3 className="mt-2 font-semibold">{item.title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-200">{item.text}</p>
    </article>
  );
}

function ResponsibilityItem({
  title,
  status,
  responsible,
}: {
  title: string;
  status: string;
  responsible: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <h3 className="font-semibold text-white">{title}</h3>

      <dl className="mt-4 grid gap-3 text-sm">
        <div>
          <dt className="font-medium text-slate-300">Status</dt>
          <dd className="mt-1 text-slate-400">{status}</dd>
        </div>

        <div>
          <dt className="font-medium text-slate-300">Responsible</dt>
          <dd className="mt-1 text-cyan-300">{responsible}</dd>
        </div>
      </dl>
    </article>
  );
}

function RiskReportItem({
  risk,
  responsible,
}: {
  risk: ProjectRisk;
  responsible: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <h3 className="font-semibold text-white">{risk.title}</h3>

      {risk.description && (
        <p className="mt-2 text-sm leading-6 text-slate-300">
          {risk.description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
          Probability: {translateRiskLevel(risk.probability)}
        </span>

        <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
          Impact: {translateRiskLevel(risk.impact)}
        </span>

        <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
          Responsible: {responsible}
        </span>

        <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
          Status: {translateRiskStatus(risk.status)}
        </span>
      </div>
    </article>
  );
}

function DecisionReportItem({
  decision,
  responsible,
}: {
  decision: ProjectDecision;
  responsible: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <h3 className="font-semibold text-white">{decision.title}</h3>

      {decision.description && (
        <p className="mt-2 text-sm leading-6 text-slate-300">
          {decision.description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
          Responsible: {responsible}
        </span>

        <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
          Deadline: {decision.deadline || "Not specified"}
        </span>

        <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
          Status: {translateDecisionStatus(decision.status)}
        </span>
      </div>
    </article>
  );
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

function translateRiskLevel(level: ProjectRiskLevel) {
  if (level === "low") {
    return "Low";
  }

  if (level === "medium") {
    return "Medium";
  }

  return "High";
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