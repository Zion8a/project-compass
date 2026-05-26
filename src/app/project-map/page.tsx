"use client";

import Link from "next/link";
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

export default function ProjectMapPage() {
  const [project, setProject] = useState<ProjectInterviewData | null>(null);

  useEffect(() => {
    const savedProject = localStorage.getItem("project-compass-current-project");

    if (savedProject) {
      setProject(JSON.parse(savedProject));
    }
  }, []);

  if (!project) {
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
            Start by creating a new project through the project interview.
          </p>

          <Link
            href="/new-project"
            className="mt-8 rounded-2xl bg-white px-6 py-3 font-semibold text-slate-950 shadow-lg hover:bg-slate-200"
          >
            Create new project
          </Link>
        </section>
      </main>
    );
  }

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

          <h2 className="mt-3 text-3xl font-bold">{project.projectName}</h2>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <ProjectMapCard
            number="01"
            title="Why are we doing this project?"
            helpText="The project background, need or problem."
            content={project.purpose}
          />

          <ProjectMapCard
            number="02"
            title="What should be better?"
            helpText="The effect or change that should be visible when the project is complete."
            content={project.goal}
          />

          <ProjectMapCard
            number="03"
            title="What should be delivered?"
            helpText="Concrete results, documents, activities or decisions."
            content={project.deliverables || "Not specified yet."}
          />

          <ProjectMapCard
            number="04"
            title="What can go wrong?"
            helpText="Risks, obstacles or uncertainties that could affect the project."
            content={project.risks || "No risks specified yet."}
          />

          <ProjectMapCard
            number="05"
            title="Which decisions are needed?"
            helpText="Decisions the project depends on in order to move forward."
            content={project.decisions || "No decisions specified yet."}
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