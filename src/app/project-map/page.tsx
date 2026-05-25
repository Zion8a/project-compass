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
        <section className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
            Project Compass
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Ingen projektkarta hittades.
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Börja med att skapa ett nytt projekt genom projektintervjun.
          </p>

          <Link
            href="/new-project"
            className="mt-8 rounded-2xl bg-white px-6 py-3 font-semibold text-slate-950 shadow-lg hover:bg-slate-200"
          >
            Skapa nytt projekt
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              Project Compass
            </p>

            <h1 className="text-4xl font-bold tracking-tight">
              Projektkarta
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/project-board"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg hover:bg-slate-200"
            >
              Gå till arbetsyta
            </Link>

            <Link
              href="/project-risks"
              className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900"
            >
              Riskvy
            </Link>

            <Link
              href="/new-project"
              className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900"
            >
              Redigera intervju
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
            Projektnamn
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            {project.projectName}
          </h2>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <ProjectMapCard
            title="Varför gör vi projektet?"
            content={project.purpose}
          />

          <ProjectMapCard
            title="Vad ska ha blivit bättre?"
            content={project.goal}
          />

          <ProjectMapCard
            title="Vad ska levereras?"
            content={project.deliverables || "Inte angivet ännu."}
          />

          <ProjectMapCard
            title="Vad kan gå fel?"
            content={project.risks || "Inga risker angivna ännu."}
          />

          <ProjectMapCard
            title="Vilka beslut behövs?"
            content={project.decisions || "Inga beslut angivna ännu."}
          />

          <ProjectMapCard
            title="Nästa steg"
            content="Skapa första uppgifterna, identifiera ansvariga och börja bygga projektets arbetsyta."
          />
        </div>
      </section>
    </main>
  );
}

function ProjectMapCard({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
        {title}
      </h3>

      <p className="mt-4 whitespace-pre-line text-base leading-7 text-slate-200">
        {content}
      </p>
    </article>
  );
}