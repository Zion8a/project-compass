"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import AppHeader from "@/components/AppHeader";
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
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [risks, setRisks] = useState<ProjectRisk[]>([]);
  const [decisions, setDecisions] = useState<ProjectDecision[]>([]);

  useEffect(() => {
    const savedProject = localStorage.getItem("project-compass-current-project");
    const savedTasks = localStorage.getItem("project-compass-tasks");
    const savedRisks = localStorage.getItem("project-compass-risks");
    const savedDecisions = localStorage.getItem("project-compass-decisions");

    const platformState = loadProjectCompassState();
    const currentActiveProject = getActiveProject(platformState);

    setActiveProject(currentActiveProject);

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
      (risk) => risk.probability === "high" || risk.impact === "high"
    );

    const openDecisions = decisions.filter(
      (decision) => decision.status === "open"
    );

    const decidedDecisions = decisions.filter(
      (decision) => decision.status === "decided"
    );

    let statusLabel = "Stabil";
    let statusText =
      "Projektet har inga tydliga varningssignaler utifrån registrerade uppgifter, risker och beslut.";
    let statusTone = "emerald";

    if (
      blockedTasks.length > 0 ||
      highRisks.length > 0 ||
      openDecisions.length > 0
    ) {
      statusLabel = "Kräver uppmärksamhet";
      statusText =
        "Projektet har blockerade uppgifter, höga risker eller öppna beslut som bör följas upp.";
      statusTone = "amber";
    }

    if (blockedTasks.length > 1 || highRisks.length > 1) {
      statusLabel = "Riskfyllt";
      statusText =
        "Projektet har flera signaler som kan påverka framdrift, kvalitet eller leverans.";
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
  }, [tasks, risks, decisions]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AppHeader currentPage="project-report" />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            Project Compass
          </p>

          <h1 className="text-4xl font-bold tracking-tight">Statusrapport</h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Samla projektets nuläge på ett ställe. Följ upp uppgifter, risker,
            beslut och rekommenderade nästa steg.
          </p>

          <p className="mt-3 text-slate-400">
            {project?.projectName
              ? `Projekt: ${project.projectName}`
              : activeProject?.name
                ? `Projekt: ${activeProject.name}`
                : "Inget projekt hittades ännu."}
          </p>
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
            Samlad projektstatus
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
                Rapportläge
              </p>

              <p className="mt-2 font-semibold text-white">
                {new Date().toLocaleDateString("sv-SE")}
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-7">
          <SummaryCard
            title="Uppgifter"
            value={report.totalTasks.toString()}
            text="Totalt antal uppgifter."
          />

          <SummaryCard
            title="Klart"
            value={report.doneTasks.toString()}
            text="Färdiga uppgifter."
          />

          <SummaryCard
            title="Blockerat"
            value={report.blockedTasks.toString()}
            text="Uppgifter som hindras."
          />

          <SummaryCard
            title="Öppna risker"
            value={report.openRisks.length.toString()}
            text="Risker som inte är hanterade."
          />

          <SummaryCard
            title="Höga risker"
            value={report.highRisks.length.toString()}
            text="Risker med hög nivå."
          />

          <SummaryCard
            title="Öppna beslut"
            value={report.openDecisions.length.toString()}
            text="Beslut som återstår."
          />

          <SummaryCard
            title="Medlemmar"
            value={(activeProject?.members.length ?? 0).toString()}
            text="Medlemmar i aktivt projekt."
          />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <ReportSection title="Projektets syfte">
            <p className="whitespace-pre-line leading-7 text-slate-300">
              {project?.purpose || "Inget syfte är angivet ännu."}
            </p>
          </ReportSection>

          <ReportSection title="Projektets mål">
            <p className="whitespace-pre-line leading-7 text-slate-300">
              {project?.goal || "Inget mål är angivet ännu."}
            </p>
          </ReportSection>

          <ReportSection title="Leveranser">
            <p className="whitespace-pre-line leading-7 text-slate-300">
              {project?.deliverables || "Inga leveranser är angivna ännu."}
            </p>
          </ReportSection>

          <ReportSection title="Rekommenderade nästa steg">
            <ul className="space-y-3 text-slate-300">
              <li>• Följ upp blockerade uppgifter.</li>
              <li>• Prioritera risker med hög sannolikhet eller konsekvens.</li>
              <li>• Fatta eller förtydliga öppna beslut.</li>
              <li>• Uppdatera arbetsytan efter nästa avstämning.</li>
            </ul>
          </ReportSection>
        </div>

        <div className="mt-10">
          <ReportSection title="Project Members">
            {!activeProject || activeProject.members.length === 0 ? (
              <p className="text-slate-300">
                No project members have been added yet.
              </p>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {activeProject.members.map((member) => (
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

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <ReportSection title="Öppna risker">
            {report.openRisks.length === 0 ? (
              <p className="text-slate-300">
                Inga öppna risker finns registrerade.
              </p>
            ) : (
              <div className="space-y-4">
                {report.openRisks.map((risk) => (
                  <article
                    key={risk.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <h3 className="font-semibold text-white">{risk.title}</h3>

                    {risk.description && (
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {risk.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
                        Sannolikhet: {translateRiskLevel(risk.probability)}
                      </span>

                      <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
                        Konsekvens: {translateRiskLevel(risk.impact)}
                      </span>

                      <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
                        Status: {translateRiskStatus(risk.status)}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </ReportSection>

          <ReportSection title="Öppna beslut">
            {report.openDecisions.length === 0 ? (
              <p className="text-slate-300">
                Inga öppna beslut finns registrerade.
              </p>
            ) : (
              <div className="space-y-4">
                {report.openDecisions.map((decision) => (
                  <article
                    key={decision.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <h3 className="font-semibold text-white">
                      {decision.title}
                    </h3>

                    {decision.description && (
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {decision.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
                        Ansvarig: {decision.owner || "Ej angivet"}
                      </span>

                      <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
                        Deadline: {decision.deadline || "Ej angivet"}
                      </span>

                      <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
                        Status: {translateDecisionStatus(decision.status)}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </ReportSection>
        </div>
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
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-xl font-bold">{title}</h2>

      <div className="mt-4">{children}</div>
    </section>
  );
}

function translateRiskLevel(level: RiskLevel) {
  if (level === "low") {
    return "Låg";
  }

  if (level === "medium") {
    return "Medel";
  }

  return "Hög";
}

function translateRiskStatus(status: RiskStatus) {
  if (status === "open") {
    return "Öppen";
  }

  if (status === "watching") {
    return "Bevakas";
  }

  return "Hanterad";
}

function translateDecisionStatus(status: DecisionStatus) {
  if (status === "open") {
    return "Öppet";
  }

  if (status === "decided") {
    return "Beslutat";
  }

  return "Bordlagt";
}