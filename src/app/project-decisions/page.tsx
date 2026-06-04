"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppHeader from "../../components/AppHeader";
import {
  getActiveProject,
  loadProjectCompassState,
  Project,
  ProjectDecision,
  ProjectDecisionStatus,
  ProjectMember,
  saveProjectCompassState,
  updateProject,
} from "@/lib/projectStorage";

type ProjectInterviewData = {
  projectName: string;
  purpose: string;
  goal: string;
  deliverables: string;
  risks: string;
  decisions: string;
};

const decisionStatuses: { id: ProjectDecisionStatus; title: string }[] = [
  { id: "open", title: "Open" },
  { id: "decided", title: "Decided" },
  { id: "postponed", title: "Postponed" },
];

function isValidDecisionStatus(
  status: unknown
): status is ProjectDecisionStatus {
  return decisionStatuses.some((decisionStatus) => decisionStatus.id === status);
}

function loadLegacyDecisions(): ProjectDecision[] {
  const savedDecisions = localStorage.getItem("project-compass-decisions");

  if (!savedDecisions) {
    return [];
  }

  try {
    const parsedDecisions = JSON.parse(
      savedDecisions
    ) as Partial<ProjectDecision>[];

    if (!Array.isArray(parsedDecisions)) {
      return [];
    }

    const now = new Date().toISOString();

    return parsedDecisions
      .filter(
        (decision) =>
          typeof decision.title === "string" && decision.title.trim()
      )
      .map((decision) => ({
        id:
          typeof decision.id === "string"
            ? decision.id
            : crypto.randomUUID(),
        title: decision.title ?? "Untitled decision",
        description:
          typeof decision.description === "string"
            ? decision.description
            : undefined,
        owner: typeof decision.owner === "string" ? decision.owner : undefined,
        ownerId:
          typeof decision.ownerId === "string" ? decision.ownerId : undefined,
        deadline:
          typeof decision.deadline === "string"
            ? decision.deadline
            : undefined,
        consequence:
          typeof decision.consequence === "string"
            ? decision.consequence
            : undefined,
        status: isValidDecisionStatus(decision.status)
          ? decision.status
          : "open",
        createdAt:
          typeof decision.createdAt === "string" ? decision.createdAt : now,
        updatedAt:
          typeof decision.updatedAt === "string" ? decision.updatedAt : now,
      }));
  } catch {
    return [];
  }
}

export default function ProjectDecisionsPage() {
  const [project, setProject] = useState<ProjectInterviewData | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
  const [decisions, setDecisions] = useState<ProjectDecision[]>([]);

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [description, setDescription] = useState("");
  const [owner, setOwner] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [consequence, setConsequence] = useState("");
  const [status, setStatus] = useState<ProjectDecisionStatus>("open");

  useEffect(() => {
    const savedProject = localStorage.getItem("project-compass-current-project");

    const platformState = loadProjectCompassState();
    const currentActiveProject = getActiveProject(platformState);

    if (savedProject) {
      setProject(JSON.parse(savedProject));
    }

    if (!currentActiveProject) {
      setActiveProject(null);
      setProjectMembers([]);
      setDecisions([]);
      return;
    }

    const legacyDecisions = loadLegacyDecisions();

    if (
      currentActiveProject.decisions.length === 0 &&
      legacyDecisions.length > 0
    ) {
      const migratedProject: Project = {
        ...currentActiveProject,
        decisions: legacyDecisions,
      };

      const updatedState = updateProject(platformState, migratedProject);
      const updatedActiveProject = getActiveProject(updatedState);

      saveProjectCompassState(updatedState);
      localStorage.removeItem("project-compass-decisions");

      setActiveProject(updatedActiveProject);
      setProjectMembers(updatedActiveProject?.members ?? []);
      setDecisions(updatedActiveProject?.decisions ?? []);

      return;
    }

    setActiveProject(currentActiveProject);
    setProjectMembers(currentActiveProject.members);
    setDecisions(currentActiveProject.decisions);
  }, []);

  function persistDecisions(nextDecisions: ProjectDecision[]) {
    const platformState = loadProjectCompassState();
    const currentActiveProject = getActiveProject(platformState);

    if (!currentActiveProject) {
      setDecisions(nextDecisions);
      return;
    }

    const updatedProject: Project = {
      ...currentActiveProject,
      decisions: nextDecisions,
    };

    const updatedState = updateProject(platformState, updatedProject);
    const updatedActiveProject = getActiveProject(updatedState);

    saveProjectCompassState(updatedState);

    setActiveProject(updatedActiveProject);
    setProjectMembers(updatedActiveProject?.members ?? []);
    setDecisions(updatedActiveProject?.decisions ?? nextDecisions);
  }

  function getMemberName(decision: ProjectDecision) {
    if (decision.ownerId) {
      return (
        projectMembers.find((member) => member.id === decision.ownerId)?.name ||
        "Unknown member"
      );
    }

    if (decision.owner) {
      return decision.owner;
    }

    return "Unassigned";
  }

  function handleTitleChange(value: string) {
    setTitle(value);

    if (titleError && value.trim()) {
      setTitleError("");
    }
  }

  function handleCreateDecision(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedOwner = owner.trim();
    const trimmedDeadline = deadline.trim();
    const trimmedConsequence = consequence.trim();

    if (!trimmedTitle) {
      setTitleError("Decision title is required.");
      return;
    }

    const now = new Date().toISOString();

    const newDecision: ProjectDecision = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      description: trimmedDescription || undefined,
      owner: trimmedOwner || undefined,
      ownerId: ownerId || undefined,
      deadline: trimmedDeadline || undefined,
      consequence: trimmedConsequence || undefined,
      status,
      createdAt: now,
      updatedAt: now,
    };

    persistDecisions([...decisions, newDecision]);

    setTitle("");
    setTitleError("");
    setDescription("");
    setOwner("");
    setOwnerId("");
    setDeadline("");
    setConsequence("");
    setStatus("open");
  }

  function updateDecisionStatus(
    decisionId: string,
    newStatus: ProjectDecisionStatus
  ) {
    const now = new Date().toISOString();

    const updatedDecisions = decisions.map((decision) =>
      decision.id === decisionId
        ? { ...decision, status: newStatus, updatedAt: now }
        : decision
    );

    persistDecisions(updatedDecisions);
  }

  const openDecisions = decisions.filter(
    (decision) => decision.status === "open"
  ).length;

  const decidedDecisions = decisions.filter(
    (decision) => decision.status === "decided"
  ).length;

  const postponedDecisions = decisions.filter(
    (decision) => decision.status === "postponed"
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AppHeader currentPage="project-decisions" />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            Project Compass
          </p>

          <h1 className="text-4xl font-bold tracking-tight">Decision View</h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Collect important decisions, responsible people and consequences so
            the project does not get stuck in uncertainty.
          </p>

          <p className="mt-3 text-slate-400">
            {activeProject?.name
              ? `Project: ${activeProject.name}`
              : project?.projectName
                ? `Project: ${project.projectName}`
                : "No active project found yet."}
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <SummaryCard
            title="Total decisions"
            value={decisions.length.toString()}
            text="All decisions in the decision log."
          />

          <SummaryCard
            title="Open decisions"
            value={openDecisions.toString()}
            text="Decisions that still need to be handled."
          />

          <SummaryCard
            title="Decided"
            value={decidedDecisions.toString()}
            text="Decisions that have been made."
          />

          <SummaryCard
            title="Postponed"
            value={postponedDecisions.toString()}
            text="Decisions that are waiting or have been moved forward."
          />
        </div>

        {!activeProject ? (
          <NoActiveProjectState />
        ) : (
          <>
            <form
              onSubmit={handleCreateDecision}
              className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
              aria-labelledby="create-decision-heading"
              aria-describedby="create-decision-description"
            >
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                  New decision
                </p>

                <h2
                  id="create-decision-heading"
                  className="text-2xl font-bold"
                >
                  Create decision
                </h2>

                <p
                  id="create-decision-description"
                  className="max-w-3xl text-sm leading-6 text-slate-400"
                >
                  Describe the decision clearly so it is easy to understand what
                  needs to be decided, who is responsible and what the decision
                  affects.
                </p>

                {projectMembers.length === 0 && (
                  <p className="mt-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                    Add project members before assigning responsibility. You can
                    still create decisions without an owner.
                  </p>
                )}
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="decision-title"
                    className="block text-sm font-semibold text-slate-200"
                  >
                    Title
                  </label>

                  <input
                    id="decision-title"
                    type="text"
                    value={title}
                    onChange={(event) => handleTitleChange(event.target.value)}
                    placeholder="Example: Choose presentation structure"
                    aria-required="true"
                    aria-invalid={titleError ? "true" : "false"}
                    aria-describedby={
                      titleError ? "decision-title-error" : undefined
                    }
                    className={`mt-2 w-full rounded-xl border bg-slate-950 px-4 py-3 text-white outline-none ${
                      titleError
                        ? "border-rose-500 focus:border-rose-400"
                        : "border-slate-700 focus:border-sky-300"
                    }`}
                  />

                  {titleError && (
                    <p
                      id="decision-title-error"
                      role="alert"
                      aria-live="polite"
                      className="mt-2 text-sm font-medium text-rose-300"
                    >
                      {titleError}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="decision-owner-id"
                    className="block text-sm font-semibold text-slate-200"
                  >
                    Responsible member
                  </label>

                  <select
                    id="decision-owner-id"
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
                    htmlFor="decision-owner"
                    className="block text-sm font-semibold text-slate-200"
                  >
                    Legacy owner note
                  </label>

                  <input
                    id="decision-owner"
                    type="text"
                    value={owner}
                    onChange={(event) => setOwner(event.target.value)}
                    placeholder="Optional fallback, for example: Johan"
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
                  />
                </div>

                <div>
                  <label
                    htmlFor="decision-deadline"
                    className="block text-sm font-semibold text-slate-200"
                  >
                    Deadline
                  </label>

                  <input
                    id="decision-deadline"
                    type="text"
                    value={deadline}
                    onChange={(event) => setDeadline(event.target.value)}
                    placeholder="Example: 2026-06-07"
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
                  />
                </div>

                <div>
                  <label
                    htmlFor="decision-status"
                    className="block text-sm font-semibold text-slate-200"
                  >
                    Status
                  </label>

                  <select
                    id="decision-status"
                    value={status}
                    onChange={(event) =>
                      setStatus(event.target.value as ProjectDecisionStatus)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
                  >
                    {decisionStatuses.map((decisionStatus) => (
                      <option
                        key={decisionStatus.id}
                        value={decisionStatus.id}
                      >
                        {decisionStatus.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="decision-description"
                    className="block text-sm font-semibold text-slate-200"
                  >
                    Description
                  </label>

                  <textarea
                    id="decision-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Describe which decision needs to be made."
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="decision-consequence"
                    className="block text-sm font-semibold text-slate-200"
                  >
                    Consequence
                  </label>

                  <textarea
                    id="decision-consequence"
                    value={consequence}
                    onChange={(event) => setConsequence(event.target.value)}
                    placeholder="What is affected by this decision? Time, quality, responsibility, scope or next steps?"
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 rounded-2xl bg-white px-6 py-3 font-semibold text-slate-950 shadow-lg hover:bg-slate-200"
              >
                Add decision
              </button>
            </form>

            <section className="mt-10">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Decision log
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Current decisions
                  </h2>
                </div>

                <span className="w-fit rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
                  {decisions.length} decision
                  {decisions.length === 1 ? "" : "s"}
                </span>
              </div>

              {decisions.length === 0 ? (
                <DecisionViewEmptyState />
              ) : (
                <div className="grid gap-5">
                  {decisions.map((decision) => (
                    <article
                      key={decision.id}
                      className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="text-xl font-bold">
                            {decision.title}
                          </h3>

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
                              event.target.value as ProjectDecisionStatus
                            )
                          }
                          className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-sky-300"
                        >
                          {decisionStatuses.map((decisionStatus) => (
                            <option
                              key={decisionStatus.id}
                              value={decisionStatus.id}
                            >
                              {decisionStatus.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-5 grid gap-4 md:grid-cols-4">
                        <DecisionMeta
                          label="Responsible"
                          value={getMemberName(decision)}
                        />

                        <DecisionMeta
                          label="Deadline"
                          value={decision.deadline || "Not specified"}
                        />

                        <DecisionMeta
                          label="Status"
                          value={translateDecisionStatus(decision.status)}
                        />

                        <DecisionMeta label="Type" value="Decision" />
                      </div>

                      {decision.consequence && (
                        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Consequence
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
          </>
        )}
      </section>
    </main>
  );
}

function NoActiveProjectState() {
  return (
    <section className="rounded-3xl border border-dashed border-rose-500/40 bg-rose-500/10 p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-300">
        No active project
      </p>

      <h2 className="mt-2 text-2xl font-bold">No active project selected</h2>

      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
        Decision View needs an active project before decisions can be created.
        Go to My Projects to create a new project or open an existing one.
      </p>

      <div className="mt-5">
        <Link
          href="/projects"
          className="inline-flex rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 shadow-lg hover:bg-slate-200"
        >
          Go to My Projects
        </Link>
      </div>
    </section>
  );
}

function DecisionViewEmptyState() {
  return (
    <section className="rounded-3xl border border-dashed border-violet-500/40 bg-violet-500/10 p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">
        Decision view empty state
      </p>

      <h2 className="mt-2 text-2xl font-bold">No decisions yet</h2>

      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
        Start by capturing the first important decision or open question. A good
        decision log makes it clear what is undecided, who owns the next step
        and what the consequence will be.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <EmptyStateTip
          title="Clarify what is undecided"
          text="Write the decision so the team can understand what needs to be resolved."
        />

        <EmptyStateTip
          title="Name the consequence"
          text="Describe what time, scope, quality, responsibility or next step depends on the decision."
        />

        <EmptyStateTip
          title="Assign responsibility"
          text="Every important decision should have someone responsible for follow-up."
        />
      </div>
    </section>
  );
}

function EmptyStateTip({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
      <h3 className="font-semibold text-white">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
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

function translateDecisionStatus(status: ProjectDecisionStatus) {
  if (status === "open") {
    return "Open";
  }

  if (status === "decided") {
    return "Decided";
  }

  return "Postponed";
}