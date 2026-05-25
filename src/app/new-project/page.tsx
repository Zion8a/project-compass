"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AppHeader from "../../components/AppHeader";

type ProjectInterviewData = {
  projectName: string;
  purpose: string;
  goal: string;
  deliverables: string;
  risks: string;
  decisions: string;
};

export default function NewProjectPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<ProjectInterviewData>({
    projectName: "",
    purpose: "",
    goal: "",
    deliverables: "",
    risks: "",
    decisions: "",
  });

  function updateField(field: keyof ProjectInterviewData, value: string) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    localStorage.setItem(
      "project-compass-current-project",
      JSON.stringify(formData),
    );

    router.push("/project-map");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AppHeader currentPage="new-project" />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
              Project Compass
            </p>

            <h1 className="text-4xl font-bold tracking-tight">
              Projektintervju
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              Börja med projektets riktning innan arbetet bryts ner i uppgifter.
              Svara på några grundfrågor så skapas en tydlig projektkarta.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
              Intervjuns syfte
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              Projektintervjun hjälper dig att fånga syfte, mål, leveranser,
              risker och beslut innan projektet bara blir en lista med
              uppgifter.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
        >
          <div className="grid gap-6">
            <InterviewField
              number="01"
              title="Projektnamn"
              helpText="Ge projektet ett tydligt namn som går att känna igen senare."
            >
              <input
                type="text"
                value={formData.projectName}
                onChange={(event) =>
                  updateField("projectName", event.target.value)
                }
                placeholder="Exempel: Införa nytt arbetssätt"
                className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
                required
              />
            </InterviewField>

            <InterviewField
              number="02"
              title="Varför gör vi projektet?"
              helpText="Beskriv problemet, behovet eller möjligheten som gör projektet viktigt."
            >
              <textarea
                value={formData.purpose}
                onChange={(event) => updateField("purpose", event.target.value)}
                placeholder="Beskriv syftet med projektet."
                rows={4}
                className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
                required
              />
            </InterviewField>

            <InterviewField
              number="03"
              title="Vad ska ha blivit bättre när projektet är klart?"
              helpText="Beskriv den effekt, förändring eller nytta som ska märkas när projektet är genomfört."
            >
              <textarea
                value={formData.goal}
                onChange={(event) => updateField("goal", event.target.value)}
                placeholder="Beskriv projektets mål eller effekt."
                rows={4}
                className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
                required
              />
            </InterviewField>

            <InterviewField
              number="04"
              title="Vad ska levereras?"
              helpText="Lista konkreta resultat, dokument, beslut, aktiviteter, systemdelar eller andra leverabler."
            >
              <textarea
                value={formData.deliverables}
                onChange={(event) =>
                  updateField("deliverables", event.target.value)
                }
                placeholder="Exempel: rapport, prototyp, beslut, utbildning, system, evenemang."
                rows={4}
                className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
              />
            </InterviewField>

            <InterviewField
              number="05"
              title="Vad kan gå fel?"
              helpText="Identifiera risker, hinder och osäkerheter som kan påverka tid, kvalitet, ansvar eller leverans."
            >
              <textarea
                value={formData.risks}
                onChange={(event) => updateField("risks", event.target.value)}
                placeholder="Beskriv risker, hinder eller osäkerheter."
                rows={4}
                className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
              />
            </InterviewField>

            <InterviewField
              number="06"
              title="Vilka beslut behöver fattas?"
              helpText="Beskriv viktiga beslut, vägval eller godkännanden som projektet är beroende av."
            >
              <textarea
                value={formData.decisions}
                onChange={(event) =>
                  updateField("decisions", event.target.value)
                }
                placeholder="Beskriv viktiga beslut som projektet är beroende av."
                rows={4}
                className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
              />
            </InterviewField>
          </div>

          <div className="mt-8 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
                  Nästa steg
                </p>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">
                  När intervjun sparas skapas projektkartan. Där får du en
                  samlad överblick innan du går vidare till arbetsyta, risker,
                  beslut och statusrapport.
                </p>
              </div>

              <button
                type="submit"
                className="w-fit rounded-2xl bg-white px-6 py-3 font-semibold text-slate-950 shadow-lg hover:bg-slate-200"
              >
                Skapa projektkarta
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}

function InterviewField({
  number,
  title,
  helpText,
  children,
}: {
  number: string;
  title: string;
  helpText: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-400 text-sm font-bold text-slate-950">
          {number}
        </div>

        <div className="w-full">
          <label className="block text-base font-semibold text-white">
            {title}
          </label>

          <p className="mt-2 text-sm leading-6 text-slate-400">{helpText}</p>

          {children}
        </div>
      </div>
    </section>
  );
}