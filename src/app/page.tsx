import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
          Project Compass
        </p>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Från idé till strukturerat projekt.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Ett verktyg som hjälper team att förstå syfte, mål, risker,
          beslut och nästa steg innan projektet bara blir en lista med
          uppgifter.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
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
      </section>
    </main>
  );
}