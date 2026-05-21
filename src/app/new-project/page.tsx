export default function NewProjectPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
          Project Compass
        </p>

        <h1 className="text-4xl font-bold tracking-tight">
          Projektintervju
        </h1>

        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
          Svara på några grundfrågor så att projektet inte börjar som en tom
          tavla, utan som en tydlig projektkarta.
        </p>

        <form className="mt-10 space-y-8">
          <div>
            <label className="block text-sm font-semibold text-slate-200">
              Projektnamn
            </label>
            <input
              type="text"
              placeholder="Exempel: Införa nytt arbetssätt"
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200">
              Varför gör vi projektet?
            </label>
            <textarea
              placeholder="Beskriv syftet med projektet."
              rows={4}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200">
              Vad ska ha blivit bättre när projektet är klart?
            </label>
            <textarea
              placeholder="Beskriv projektets mål eller effekt."
              rows={4}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200">
              Vad ska levereras?
            </label>
            <textarea
              placeholder="Exempel: rapport, prototyp, beslut, utbildning, system, evenemang."
              rows={4}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200">
              Vad kan gå fel?
            </label>
            <textarea
              placeholder="Beskriv risker, hinder eller osäkerheter."
              rows={4}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200">
              Vilka beslut behöver fattas?
            </label>
            <textarea
              placeholder="Beskriv viktiga beslut som projektet är beroende av."
              rows={4}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-white"
            />
          </div>

          <button
            type="submit"
            className="rounded-2xl bg-white px-6 py-3 font-semibold text-slate-950 shadow-lg hover:bg-slate-200"
          >
            Skapa projektkarta
          </button>
        </form>
      </section>
    </main>
  );
}