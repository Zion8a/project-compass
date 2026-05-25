"use client";

import { useEffect, useState } from "react";
import AppHeader from "../../components/AppHeader";

type ProjectInterviewData = {
  projectName: string;
  purpose: string;
  goal: string;
  deliverables: string;
  risks: string;
  decisions: string;
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

const decisionStatuses: { id: DecisionStatus; title: string }[] = [
  { id: "open", title: "Öppet" },
  { id: "decided", title: "Beslutat" },
  { id: "postponed", title: "Bordlagt" },
];

export default function ProjectDecisionsPage() {
  const [project, setProject] = useState<ProjectInterviewData | null>(null);
  const [decisions, setDecisions] = useState<ProjectDecision[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [owner, setOwner] = useState("");
  const [deadline, setDeadline] = useState("");
  const [consequence, setConsequence] = useState("");
  const [status, setStatus] = useState<DecisionStatus>("open");

  useEffect(() => {
    const savedProject = localStorage.getItem("project-compass-current-project");
    const savedDecisions = localStorage.getItem("project-compass-decisions");

    if (savedProject) {
      setProject(JSON.parse(savedProject));
    }

    if (savedDecisions) {
      setDecisions(JSON.parse(savedDecisions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "project-compass-decisions",
      JSON.stringify(decisions),
    );
  }, [decisions]);

  function handleCreateDecision(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newDecision: ProjectDecision = {
      id: crypto.randomUUID(),
      title,
      description,
      owner,
      deadline,
      consequence,
      status,
    };

    setDecisions((currentDecisions) => [...currentDecisions, newDecision]);

    setTitle("");
    setDescription("");
    setOwner("");
    setDeadline("");
    setConsequence("");
    setStatus("open");
  }

  function updateDecisionStatus(
    decisionId: string,
    newStatus: DecisionStatus,
  ) {
    setDecisions((currentDecisions) =>
      currentDecisions.map((decision) =>
        decision.id === decisionId
          ? { ...decision, status: newStatus }
          : decision,
      ),
    );
  }

  const openDecisions = decisions.filter(
    (decision) => decision.status === "open",
  ).length;

  const decidedDecisions = decisions.filter(
    (decision) => decision.status === "decided",
  ).length;

  const postponedDecisions = decisions.filter(
    (decision) => decision.status === "postponed",
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AppHeader currentPage="project-decisions" />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            Project Compass
          </p>

          <h1 className="text-4xl font-bold tracking-tight">Beslutsvy</h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Samla viktiga beslut, ansvariga personer och konsekvenser så att
            projektet inte fastnar i otydlighet.
          </p>

          <p className="mt-3 text-slate-400">
            {project?.projectName
              ? `Projekt: ${project.projectName}`
              : "Inget projekt hittades ännu."}
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <SummaryCard
            title="Totalt antal beslut"
            value={decisions.length.toString()}
            text="Alla beslut i beslutsloggen."
          />

          <SummaryCard
            title="Öppna beslut"
            value={openDecisions.toString()}
            text="Beslut som fortfarande behöver hanteras."
          />

          <SummaryCard
            title="Beslutade"
            value={decidedDecisions.toString()}
            text="Beslut som är fattade."
          />

          <SummaryCard
            title="Bordlagda"
            value={postponedDecisions.toString()}
            text="Beslut som väntar eller har skjutits fram."
          />
        </div>

        <form
          onSubmit={handleCreateDecision}
          className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
        >
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
              Nytt beslut
            </p>

            <h2 className="text-2xl font-bold">Skapa beslut</h2>

            <p className="max-w-3xl text-sm leading-6 text-slate-400">
              Beskriv beslutet så att det blir tydligt vad som behöver avgöras,
              vem som ansvarar och vad beslutet påverkar.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-200">
                Titel
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Exempel: Välja presentationsupplägg"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
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
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-200">
                Beskrivning
              </label>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Beskriv vilket beslut som behöver fattas."
                rows={3}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200">
                Deadline
              </label>

              <input
                type="text"
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
                placeholder="Exempel: 2026-06-07"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200">
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as DecisionStatus)
                }
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
              >
                {decisionStatuses.map((decisionStatus) => (
                  <option key={decisionStatus.id} value={decisionStatus.id}>
                    {decisionStatus.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-200">
                Konsekvens
              </label>

              <textarea
                value={consequence}
                onChange={(event) => setConsequence(event.target.value)}
                placeholder="Vad påverkas av beslutet? Tid, kvalitet, ansvar, omfattning eller nästa steg?"
                rows={3}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 rounded-2xl bg-white px-6 py-3 font-semibold text-slate-950 shadow-lg hover:bg-slate-200"
          >
            Lägg till beslut
          </button>
        </form>

        <section className="mt-10">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                Beslutslogg
              </p>

              <h2 className="mt-2 text-2xl font-bold">Aktuella beslut</h2>
            </div>

            <span className="w-fit rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
              {decisions.length} beslut
            </span>
          </div>

          {decisions.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-300">
              Inga beslut är skapade ännu. Lägg till första beslutet ovan för
              att börja bygga projektets beslutslogg.
            </div>
          ) : (
            <div className="grid gap-5">
              {decisions.map((decision) => (
                <article
                  key={decision.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{decision.title}</h3>

                      {decision.description && (
                        <p className="mt-3 max-w-3xl whitespace-pre-line leading-7 text-slate-300">
                          {decision.description}
                        </p>
                      )}
                    </div>

                    <select
                      value={decision.status}
                      onChange={(event) =>
                        updateDecisionStatus(
                          decision.id,
                          event.target.value as DecisionStatus,
                        )
                      }
                      className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-sky-300"
                    >
                      {decisionStatuses.map((decisionStatus) => (
                        <option key={decisionStatus.id} value={decisionStatus.id}>
                          {decisionStatus.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-4">
                    <DecisionMeta
                      label="Ansvarig"
                      value={decision.owner || "Ej angivet"}
                    />

                    <DecisionMeta
                      label="Deadline"
                      value={decision.deadline || "Ej angivet"}
                    />

                    <DecisionMeta
                      label="Status"
                      value={translateDecisionStatus(decision.status)}
                    />

                    <DecisionMeta label="Typ" value="Beslut" />
                  </div>

                  {decision.consequence && (
                    <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Konsekvens
                      </p>

                      <p className="mt-2 whitespace-pre-line leading-7 text-slate-200">
                        {decision.consequence}
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

function DecisionMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-semibold text-slate-100">{value}</p>
    </div>
  );
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