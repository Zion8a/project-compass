"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
  status: RiskStatus;
};

const riskLevels: { id: RiskLevel; title: string }[] = [
  { id: "low", title: "Låg" },
  { id: "medium", title: "Medel" },
  { id: "high", title: "Hög" },
];

const riskStatuses: { id: RiskStatus; title: string }[] = [
  { id: "open", title: "Öppen" },
  { id: "watching", title: "Bevakas" },
  { id: "handled", title: "Hanterad" },
];

export default function ProjectRisksPage() {
  const [project, setProject] = useState<ProjectInterviewData | null>(null);
  const [risks, setRisks] = useState<ProjectRisk[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [probability, setProbability] = useState<RiskLevel>("medium");
  const [impact, setImpact] = useState<RiskLevel>("medium");
  const [action, setAction] = useState("");
  const [owner, setOwner] = useState("");
  const [status, setStatus] = useState<RiskStatus>("open");

  useEffect(() => {
    const savedProject = localStorage.getItem("project-compass-current-project");
    const savedRisks = localStorage.getItem("project-compass-risks");

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
      status,
    };

    setRisks((currentRisks) => [...currentRisks, newRisk]);

    setTitle("");
    setDescription("");
    setProbability("medium");
    setImpact("medium");
    setAction("");
    setOwner("");
    setStatus("open");
  }

  function updateRiskStatus(riskId: string, newStatus: RiskStatus) {
    setRisks((currentRisks) =>
      currentRisks.map((risk) =>
        risk.id === riskId ? { ...risk, status: newStatus } : risk,
      ),
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

            <h1 className="text-4xl font-bold tracking-tight">Riskvy</h1>

            <p className="mt-3 text-slate-300">
              {project?.projectName
                ? `Projekt: ${project.projectName}`
                : "Inget projekt hittades ännu."}
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
              href="/project-board"
              className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900"
            >
              Till arbetsyta
            </Link>

            <Link
              href="/project-decisions"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg hover:bg-slate-200"
            >
              Beslutsvy
            </Link>

            <Link
              href="/project-report"
              className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900"
            >
              Statusrapport
            </Link>

            <Link
              href="/project-map"
              className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900"
            >
              Till projektkarta
            </Link>

            <Link
              href="/new-project"
              className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900"
            >
              Redigera intervju
            </Link>
          </div>
        </div>

        <form
          onSubmit={handleCreateRisk}
          className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
        >
          <h2 className="text-2xl font-bold">Skapa risk</h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-200">
                Titel
              </label>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Exempel: Gruppen hinner inte klart i tid"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200">
                Ansvarig
              </label>
              <input
                type="text"
                value={owner}
                onChange={(event) => setOwner(event.target.value)}
                placeholder="Exempel: Johan"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-200">
                Beskrivning
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Beskriv vad som kan gå fel och varför det spelar roll."
                rows={3}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200">
                Sannolikhet
              </label>
              <select
                value={probability}
                onChange={(event) =>
                  setProbability(event.target.value as RiskLevel)
                }
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
              >
                {riskLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200">
                Konsekvens
              </label>
              <select
                value={impact}
                onChange={(event) => setImpact(event.target.value as RiskLevel)}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
              >
                {riskLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-200">
                Åtgärd
              </label>
              <textarea
                value={action}
                onChange={(event) => setAction(event.target.value)}
                placeholder="Vad gör vi för att minska risken eller hantera den om den inträffar?"
                rows={3}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200">
                Status
              </label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as RiskStatus)}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
              >
                {riskStatuses.map((riskStatus) => (
                  <option key={riskStatus.id} value={riskStatus.id}>
                    {riskStatus.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 rounded-2xl bg-white px-6 py-3 font-semibold text-slate-950 shadow-lg hover:bg-slate-200"
          >
            Lägg till risk
          </button>
        </form>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Riskregister</h2>

            <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
              {risks.length} risker
            </span>
          </div>

          {risks.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-300">
              Inga risker är skapade ännu.
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
                          event.target.value as RiskStatus,
                        )
                      }
                      className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-white"
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
                      label="Sannolikhet"
                      value={translateRiskLevel(risk.probability)}
                    />

                    <RiskMeta
                      label="Konsekvens"
                      value={translateRiskLevel(risk.impact)}
                    />

                    <RiskMeta
                      label="Ansvarig"
                      value={risk.owner || "Ej angivet"}
                    />

                    <RiskMeta
                      label="Status"
                      value={translateRiskStatus(risk.status)}
                    />
                  </div>

                  {risk.action && (
                    <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Åtgärd
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