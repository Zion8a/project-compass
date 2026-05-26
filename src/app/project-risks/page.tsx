"use client";

import { useEffect, useState } from "react";
import AppHeader from "../../components/AppHeader";
import {
  getActiveProject,
  loadProjectCompassState,
  Project,
  ProjectMember,
} from "@/lib/projectStorage";

type ProjectInterviewData = {
  projectName: string;
  purpose: string;
  goal: string;
  deliverables: string;
  risks: string;
  decisions: string;
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
  ownerId?: string;
  status: RiskStatus;
};

const riskLevels: { id: RiskLevel; title: string }[] = [
  { id: "low", title: "Low" },
  { id: "medium", title: "Medium" },
  { id: "high", title: "High" },
];

const riskStatuses: { id: RiskStatus; title: string }[] = [
  { id: "open", title: "Open" },
  { id: "watching", title: "Watching" },
  { id: "handled", title: "Handled" },
];

export default function ProjectRisksPage() {
  const [project, setProject] = useState<ProjectInterviewData | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
  const [risks, setRisks] = useState<ProjectRisk[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [probability, setProbability] = useState<RiskLevel>("medium");
  const [impact, setImpact] = useState<RiskLevel>("medium");
  const [action, setAction] = useState("");
  const [owner, setOwner] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [status, setStatus] = useState<RiskStatus>("open");

  useEffect(() => {
    const savedProject = localStorage.getItem("project-compass-current-project");
    const savedRisks = localStorage.getItem("project-compass-risks");

    const platformState = loadProjectCompassState();
    const currentActiveProject = getActiveProject(platformState);

    setActiveProject(currentActiveProject);
    setProjectMembers(currentActiveProject?.members ?? []);

    if (savedProject) {
      setProject(JSON.parse(savedProject));
    }

    if (savedRisks) {
      setRisks(JSON.parse(savedRisks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("project-compass-risks", JSON.stringify(risks));
  }, [risks]);

  function getMemberName(risk: ProjectRisk) {
    if (risk.ownerId) {
      return (
        projectMembers.find((member) => member.id === risk.ownerId)?.name ||
        "Unknown member"
      );
    }

    if (risk.owner) {
      return risk.owner;
    }

    return "Unassigned";
  }

  function handleCreateRisk(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newRisk: ProjectRisk = {
      id: crypto.randomUUID(),
      title,
      description,
      probability,
      impact,
      action,
      owner,
      ownerId: ownerId || undefined,
      status,
    };

    setRisks((currentRisks) => [...currentRisks, newRisk]);

    setTitle("");
    setDescription("");
    setProbability("medium");
    setImpact("medium");
    setAction("");
    setOwner("");
    setOwnerId("");
    setStatus("open");
  }

  function updateRiskStatus(riskId: string, newStatus: RiskStatus) {
    setRisks((currentRisks) =>
      currentRisks.map((risk) =>
        risk.id === riskId ? { ...risk, status: newStatus } : risk
      )
    );
  }

  const openRisks = risks.filter((risk) => risk.status !== "handled").length;
  const highRisks = risks.filter(
    (risk) => risk.probability === "high" || risk.impact === "high"
  ).length;
  const handledRisks = risks.filter((risk) => risk.status === "handled").length;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AppHeader currentPage="project-risks" />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            Project Compass
          </p>

          <h1 className="text-4xl font-bold tracking-tight">Risk View</h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Make visible what could affect the project before it becomes urgent.
            Assess probability, impact and what can be done to reduce or handle
            the risk.
          </p>

          <p className="mt-3 text-slate-400">
            {project?.projectName
              ? `Project: ${project.projectName}`
              : activeProject?.name
                ? `Project: ${activeProject.name}`
                : "No project found yet."}
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <SummaryCard
            title="Total risks"
            value={risks.length.toString()}
            text="All risks in the risk register."
          />

          <SummaryCard
            title="Open risks"
            value={openRisks.toString()}
            text="Risks that have not been handled yet."
          />

          <SummaryCard
            title="High risk level"
            value={highRisks.toString()}
            text="Risks with high probability or impact."
          />

          <SummaryCard
            title="Handled"
            value={handledRisks.toString()}
            text="Risks that have been closed or handled."
          />
        </div>

        <form
          onSubmit={handleCreateRisk}
          className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
        >
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
              New risk
            </p>

            <h2 className="text-2xl font-bold">Create risk</h2>

            <p className="max-w-3xl text-sm leading-6 text-slate-400">
              Describe the risk clearly enough for someone else to understand
              what could happen, why it matters and what action is needed.
            </p>

            {projectMembers.length === 0 && (
              <p className="mt-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                Add project members before assigning responsibility. You can
                still create risks without an owner.
              </p>
            )}
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="risk-title"
                className="block text-sm font-semibold text-slate-200"
              >
                Title
              </label>
              <input
                id="risk-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Example: The team may not finish on time"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
                required
              />
            </div>

            <div>
              <label
                htmlFor="risk-owner-id"
                className="block text-sm font-semibold text-slate-200"
              >
                Responsible member
              </label>
              <select
                id="risk-owner-id"
                value={ownerId}
                onChange={(event) => setOwnerId(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
              >
                <option value="">Unassigned</option>
                {projectMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="risk-owner"
                className="block text-sm font-semibold text-slate-200"
              >
                Legacy owner note
              </label>
              <input
                id="risk-owner"
                type="text"
                value={owner}
                onChange={(event) => setOwner(event.target.value)}
                placeholder="Optional fallback, for example: Johan"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
              />
            </div>

            <div>
              <label
                htmlFor="risk-status"
                className="block text-sm font-semibold text-slate-200"
              >
                Status
              </label>
              <select
                id="risk-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as RiskStatus)}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
              >
                {riskStatuses.map((riskStatus) => (
                  <option key={riskStatus.id} value={riskStatus.id}>
                    {riskStatus.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="risk-description"
                className="block text-sm font-semibold text-slate-200"
              >
                Description
              </label>
              <textarea
                id="risk-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe what could go wrong and why it matters."
                rows={3}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
              />
            </div>

            <div>
              <label
                htmlFor="risk-probability"
                className="block text-sm font-semibold text-slate-200"
              >
                Probability
              </label>
              <select
                id="risk-probability"
                value={probability}
                onChange={(event) =>
                  setProbability(event.target.value as RiskLevel)
                }
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
              >
                {riskLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="risk-impact"
                className="block text-sm font-semibold text-slate-200"
              >
                Impact
              </label>
              <select
                id="risk-impact"
                value={impact}
                onChange={(event) => setImpact(event.target.value as RiskLevel)}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
              >
                {riskLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="risk-action"
                className="block text-sm font-semibold text-slate-200"
              >
                Action
              </label>
              <textarea
                id="risk-action"
                value={action}
                onChange={(event) => setAction(event.target.value)}
                placeholder="What should be done to reduce the risk or handle it if it happens?"
                rows={3}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 rounded-2xl bg-white px-6 py-3 font-semibold text-slate-950 shadow-lg hover:bg-slate-200"
          >
            Add risk
          </button>
        </form>

        <section className="mt-10">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                Risk register
              </p>

              <h2 className="mt-2 text-2xl font-bold">Current risks</h2>
            </div>

            <span className="w-fit rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
              {risks.length} risk{risks.length === 1 ? "" : "s"}
            </span>
          </div>

          {risks.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-300">
              No risks have been created yet. Add the first risk above to start
              building the project risk picture.
            </div>
          ) : (
            <div className="grid gap-5">
              {risks.map((risk) => (
                <article
                  key={risk.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{risk.title}</h3>

                      {risk.description && (
                        <p className="mt-3 max-w-3xl whitespace-pre-line leading-7 text-slate-300">
                          {risk.description}
                        </p>
                      )}
                    </div>

                    <select
                      value={risk.status}
                      onChange={(event) =>
                        updateRiskStatus(
                          risk.id,
                          event.target.value as RiskStatus
                        )
                      }
                      className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-sky-300"
                    >
                      {riskStatuses.map((riskStatus) => (
                        <option key={riskStatus.id} value={riskStatus.id}>
                          {riskStatus.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-4">
                    <RiskMeta
                      label="Probability"
                      value={translateRiskLevel(risk.probability)}
                    />

                    <RiskMeta
                      label="Impact"
                      value={translateRiskLevel(risk.impact)}
                    />

                    <RiskMeta label="Responsible" value={getMemberName(risk)} />

                    <RiskMeta
                      label="Status"
                      value={translateRiskStatus(risk.status)}
                    />
                  </div>

                  {risk.action && (
                    <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Action
                      </p>

                      <p className="mt-2 whitespace-pre-line leading-7 text-slate-200">
                        {risk.action}
                      </p>
                    </div>
                  )}
                </article>
              ))}
            </div>
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

function RiskMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-semibold text-slate-100">{value}</p>
    </div>
  );
}

function translateRiskLevel(level: RiskLevel) {
  if (level === "low") {
    return "Low";
  }

  if (level === "medium") {
    return "Medium";
  }

  return "High";
}

function translateRiskStatus(status: RiskStatus) {
  if (status === "open") {
    return "Open";
  }

  if (status === "watching") {
    return "Watching";
  }

  return "Handled";
}