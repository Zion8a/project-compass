"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ProjectInterviewData = {
  projectName: string;
  purpose: string;
  goal: string;
  deliverables: string;
  risks: string;
  decisions: string;
};

type TaskStatus =
  | "backlog"
  | "planned"
  | "in-progress"
  | "blocked"
  | "review"
  | "done";

type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
};

type RiskLevel = "low" | "medium" | "high";

type RiskStatus = "open" | "watching" | "handled";

type ProjectRisk = {
  id: string;
  title: string;
  description: string;
  probability: RiskLevel;
  impact: RiskLevel;
  action: string;
  owner: string;
  status: RiskStatus;
};

type DecisionStatus = "open" | "decided" | "postponed";

type ProjectDecision = {
  id: string;
  title: string;
  description: string;
  owner: string;
  deadline: string;
  consequence: string;
  status: DecisionStatus;
};

export default function ProjectReportPage() {
  const [project, setProject] = useState<ProjectInterviewData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [risks, setRisks] = useState<ProjectRisk[]>([]);
  const [decisions, setDecisions] = useState<ProjectDecision[]>([]);

  useEffect(() => {
    const savedProject = localStorage.getItem("project-compass-current-project");
    const savedTasks = localStorage.getItem("project-compass-tasks");
    const savedRisks = localStorage.getItem("project-compass-risks");
    const savedDecisions = localStorage.getItem("project-compass-decisions");

    if (savedProject) {
      setProject(JSON.parse(savedProject));
    }

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    if (savedRisks) {
      setRisks(JSON.parse(savedRisks));
    }

    if (savedDecisions) {
      setDecisions(JSON.parse(savedDecisions));
    }
  }, []);

  const report = useMemo(() => {
    const doneTasks = tasks.filter((task) => task.status === "done");
    const blockedTasks = tasks.filter((task) => task.status === "blocked");
    const openRisks = risks.filter((risk) => risk.status !== "handled");
    const highRisks = risks.filter(
      (risk) => risk.probability === "high" || risk.impact === "high",
    );
    const openDecisions = decisions.filter(
      (decision) => decision.status === "open",
    );

    let status: "Grön" | "Gul" | "Röd" = "Grön";

    if (
      blockedTasks.length > 0 ||
      openDecisions.length > 0 ||
      highRisks.length > 0
    ) {
      status = "Gul";
    }

    if (blockedTasks.length >= 2 || highRisks.length >= 2) {
      status = "Röd";
    }

    return {
      totalTasks: tasks.length,
      doneTasks: doneTasks.length,
      blockedTasks: blockedTasks.length,
      openRisks: openRisks.length,
      highRisks: highRisks.length,
      openDecisions: openDecisions.length,
      status,
      openRiskItems: openRisks,
      openDecisionItems: openDecisions,
      blockedTaskItems: blockedTasks,
    };
  }, [tasks, risks, decisions]);

  if (!project) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
            Project Compass
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Ingen rapport kan skapas ännu.
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Börja med att skapa ett projekt genom projektintervjun.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-2xl border border-slate-700 px-6 py-3 font-semibold text-white hover:bg-slate-900"
            >
              Startsida
            </Link>

            <Link
              href="/new-project"
              className="rounded-2xl bg-white px-6 py-3 font-semibold text-slate-950 shadow-lg hover:bg-slate-200"
            >
              Skapa nytt projekt
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              Project Compass
            </p>

            <h1 className="text-4xl font-bold tracking-tight">
              Statusrapport
            </h1>

            <p className="mt-3 text-slate-300">
              Projekt: {project.projectName}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
            <Link
              href="/"
              className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900"
            >
              Startsida
            </Link>

            <Link
              href="/project-map"
              className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900"
            >
              Projektkarta
            </Link>

            <Link
              href="/project-board"
              className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900"
            >
              Arbetsyta
            </Link>

            <Link
              href="/project-risks"
              className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900"
            >
              Riskvy
            </Link>

            <Link
              href="/project-decisions"
              className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900"
            >
              Beslutsvy
            </Link>

            <Link
              href="/new-project"
              className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900"
            >
              Redigera intervju
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
            Samlad projektstatus
          </p>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-5xl font-bold">{report.status}</h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-300">
                Statusen baseras på blockerade uppgifter, öppna beslut och
                risker med hög sannolikhet eller hög konsekvens.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4 text-sm text-slate-300">
              Lokal rapport från webbläsarens sparade projektdata.
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3 lg:grid-cols-6">
          <ReportMetric label="Uppgifter" value={report.totalTasks.toString()} />
          <ReportMetric label="Klara" value={report.doneTasks.toString()} />
          <ReportMetric
            label="Blockerade"
            value={report.blockedTasks.toString()}
          />
          <ReportMetric
            label="Öppna risker"
            value={report.openRisks.toString()}
          />
          <ReportMetric
            label="Höga risker"
            value={report.highRisks.toString()}
          />
          <ReportMetric
            label="Öppna beslut"
            value={report.openDecisions.toString()}
          />
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <ReportSection title="Projektets syfte" content={project.purpose} />

          <ReportSection title="Mål / önskad effekt" content={project.goal} />

          <ReportSection
            title="Leveranser"
            content={project.deliverables || "Inga leveranser angivna ännu."}
          />

          <ReportSection
            title="Nästa rekommenderade steg"
            content={createNextStepText(
              report.blockedTasks,
              report.openRisks,
              report.openDecisions,
            )}
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <ReportList
            title="Blockerade uppgifter"
            emptyText="Inga blockerade uppgifter."
            items={report.blockedTaskItems.map((task) => task.title)}
          />

          <ReportList
            title="Öppna risker"
            emptyText="Inga öppna risker."
            items={report.openRiskItems.map((risk) => risk.title)}
          />

          <ReportList
            title="Öppna beslut"
            emptyText="Inga öppna beslut."
            items={report.openDecisionItems.map((decision) => decision.title)}
          />
        </div>
      </section>
    </main>
  );
}

function ReportMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

function ReportSection({ title, content }: { title: string; content: string }) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
        {title}
      </h2>

      <p className="mt-4 whitespace-pre-line leading-7 text-slate-200">
        {content}
      </p>
    </article>
  );
}

function ReportList({
  title,
  emptyText,
  items,
}: {
  title: string;
  emptyText: string;
  items: string[];
}) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
        {title}
      </h2>

      {items.length === 0 ? (
        <p className="mt-4 text-slate-300">{emptyText}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li
              key={item}
              className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-slate-200"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function createNextStepText(
  blockedTasks: number,
  openRisks: number,
  openDecisions: number,
) {
  const nextSteps: string[] = [];

  if (blockedTasks > 0) {
    nextSteps.push(
      "Följ upp blockerade uppgifter och bestäm vem som tar bort hindren.",
    );
  }

  if (openRisks > 0) {
    nextSteps.push(
      "Gå igenom öppna risker och säkerställ att varje risk har en åtgärd.",
    );
  }

  if (openDecisions > 0) {
    nextSteps.push(
      "Fatta eller tidsätt öppna beslut så att arbetet inte bromsas.",
    );
  }

  if (nextSteps.length === 0) {
    nextSteps.push(
      "Fortsätt följa upp arbetsytan, riskerna och besluten regelbundet.",
    );
  }

  return nextSteps.join("\n");
}