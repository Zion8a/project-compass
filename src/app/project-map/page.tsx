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
      <AppHeader currentPage="project-map" />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            Project Compass
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Projektkarta
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            En samlad överblick över projektets syfte, mål, leveranser, risker
            och beslut innan arbetet bryts ner i uppgifter.
          </p>
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
            number="01"
            title="Varför gör vi projektet?"
            helpText="Projektets bakgrund, behov eller problem."
            content={project.purpose}
          />

          <ProjectMapCard
            number="02"
            title="Vad ska ha blivit bättre?"
            helpText="Den effekt eller förändring som ska märkas när projektet är klart."
            content={project.goal}
          />

          <ProjectMapCard
            number="03"
            title="Vad ska levereras?"
            helpText="Konkreta resultat, dokument, aktiviteter eller beslut."
            content={project.deliverables || "Inte angivet ännu."}
          />

          <ProjectMapCard
            number="04"
            title="Vad kan gå fel?"
            helpText="Risker, hinder eller osäkerheter som kan påverka projektet."
            content={project.risks || "Inga risker angivna ännu."}
          />

          <ProjectMapCard
            number="05"
            title="Vilka beslut behövs?"
            helpText="Beslut som projektet är beroende av för att kunna gå framåt."
            content={project.decisions || "Inga beslut angivna ännu."}
          />

          <ProjectMapCard
            number="06"
            title="Nästa steg"
            helpText="Vad användaren bör göra efter projektkartan."
            content="Skapa första uppgifterna, identifiera ansvariga och börja bygga projektets arbetsyta."
          />
        </div>

        <div className="mt-10 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
            Rekommenderat nästa steg
          </p>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-base leading-7 text-slate-200">
              När projektkartan känns tillräckligt tydlig är nästa steg att
              bryta ner arbetet i konkreta uppgifter på arbetsytan.
            </p>

            <Link
              href="/project-board"
              className="w-fit rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg hover:bg-slate-200"
            >
              Gå till arbetsyta
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

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {helpText}
          </p>

          <p className="mt-4 whitespace-pre-line text-base leading-7 text-slate-200">
            {content}
          </p>
        </div>
      </div>
    </article>
  );
}