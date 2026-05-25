import Link from "next/link";
import AppHeader from "../components/AppHeader";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AppHeader currentPage="home" />

      <section className="mx-auto flex max-w-6xl flex-col px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
              Project Compass
            </p>

            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
              Från idé till styrbart projekt.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Fånga syfte, mål, risker och beslut innan projektet bara blir en
              lista med uppgifter.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link
                href="/new-project"
                className="rounded-2xl bg-white px-6 py-3 font-semibold text-slate-950 shadow-lg hover:bg-slate-200"
              >
                Skapa nytt projekt
              </Link>

              <Link
                href="/project-map"
                className="rounded-2xl border border-slate-700 px-6 py-3 font-semibold text-white hover:bg-slate-900"
              >
                Öppna projektkarta
              </Link>

              <Link
                href="/project-board"
                className="rounded-2xl border border-slate-700 px-6 py-3 font-semibold text-white hover:bg-slate-900"
              >
                Öppna arbetsyta
              </Link>

              <Link
                href="/project-report"
                className="rounded-2xl border border-slate-700 px-6 py-3 font-semibold text-white hover:bg-slate-900"
              >
                Statusrapport
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
              Arbetsflöde
            </p>

            <div className="mt-6 space-y-4">
              <FlowStep
                number="01"
                title="Intervju"
                text="Fånga varför projektet finns och vad som ska bli bättre."
              />

              <FlowStep
                number="02"
                title="Projektkarta"
                text="Samla syfte, mål, leveranser, risker och beslut."
              />

              <FlowStep
                number="03"
                title="Arbetsyta"
                text="Bryt ner arbetet i uppgifter och följ status."
              />

              <FlowStep
                number="04"
                title="Risker och beslut"
                text="Synliggör hinder, osäkerheter och beslutspunkter."
              />

              <FlowStep
                number="05"
                title="Statusrapport"
                text="Få en samlad bild av projektets läge och nästa steg."
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FlowStep({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-400 text-sm font-bold text-slate-950">
          {number}
        </div>

        <div>
          <h2 className="font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-400">{text}</p>
        </div>
      </div>
    </div>
  );
}