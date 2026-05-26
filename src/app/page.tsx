import Link from "next/link";
import AppHeader from "@/components/AppHeader";

const workflowSteps = [
  {
    number: "01",
    title: "Interview",
    description: "Capture why the project exists and what should improve.",
  },
  {
    number: "02",
    title: "Project Map",
    description: "Collect purpose, goals, deliverables, risks and decisions.",
  },
  {
    number: "03",
    title: "Workspace",
    description: "Break the work into tasks and follow status.",
  },
  {
    number: "04",
    title: "Risks and decisions",
    description: "Make obstacles, uncertainties and decision points visible.",
  },
  {
    number: "05",
    title: "Status Report",
    description: "Get a shared view of the project status and next steps.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <AppHeader />

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1fr_540px] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-cyan-300">
            Project Compass
          </p>

          <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl">
            From idea to a manageable project.
          </h1>

          <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-300">
            Capture purpose, goals, risks and decisions before the project
            becomes just a list of tasks.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/projects"
              className="rounded-2xl bg-white px-7 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Create new project
            </Link>

            <Link
              href="/project-map"
              className="rounded-2xl border border-slate-700 px-7 py-4 font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Open project map
            </Link>

            <Link
              href="/project-board"
              className="rounded-2xl border border-slate-700 px-7 py-4 font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Open workspace
            </Link>

            <Link
              href="/project-report"
              className="rounded-2xl border border-slate-700 px-7 py-4 font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Open status report
            </Link>
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-800 bg-slate-900/70 p-7 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-300">
            Workflow
          </p>

          <div className="mt-8 space-y-5">
            {workflowSteps.map((step) => (
              <div
                key={step.number}
                className="flex gap-5 rounded-2xl border border-slate-800 bg-slate-950 p-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-sm font-bold text-slate-950">
                  {step.number}
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white">
                    {step.title}
                  </h2>
                  <p className="mt-2 leading-7 text-slate-300">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}