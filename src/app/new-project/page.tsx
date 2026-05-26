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
      JSON.stringify(formData)
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
              Project Interview
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              Start with the project direction before the work is broken down
              into tasks. Answer a few core questions to create a clear project
              map.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
              Purpose of the interview
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              The project interview helps you capture purpose, goals,
              deliverables, risks and decisions before the project becomes just
              a list of tasks.
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
              title="Project name"
              helpText="Give the project a clear name that will be easy to recognize later."
            >
              <input
                type="text"
                value={formData.projectName}
                onChange={(event) =>
                  updateField("projectName", event.target.value)
                }
                placeholder="Example: Introduce a new way of working"
                className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
                required
              />
            </InterviewField>

            <InterviewField
              number="02"
              title="Why are we doing this project?"
              helpText="Describe the problem, need or opportunity that makes the project important."
            >
              <textarea
                value={formData.purpose}
                onChange={(event) => updateField("purpose", event.target.value)}
                placeholder="Describe the purpose of the project."
                rows={4}
                className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
                required
              />
            </InterviewField>

            <InterviewField
              number="03"
              title="What should be better when the project is complete?"
              helpText="Describe the effect, change or value that should be visible when the project has been completed."
            >
              <textarea
                value={formData.goal}
                onChange={(event) => updateField("goal", event.target.value)}
                placeholder="Describe the project goal or expected effect."
                rows={4}
                className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
                required
              />
            </InterviewField>

            <InterviewField
              number="04"
              title="What should be delivered?"
              helpText="List concrete results, documents, decisions, activities, system parts or other deliverables."
            >
              <textarea
                value={formData.deliverables}
                onChange={(event) =>
                  updateField("deliverables", event.target.value)
                }
                placeholder="Example: report, prototype, decision, training, system, event."
                rows={4}
                className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
              />
            </InterviewField>

            <InterviewField
              number="05"
              title="What can go wrong?"
              helpText="Identify risks, obstacles and uncertainties that could affect time, quality, responsibility or delivery."
            >
              <textarea
                value={formData.risks}
                onChange={(event) => updateField("risks", event.target.value)}
                placeholder="Describe risks, obstacles or uncertainties."
                rows={4}
                className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
              />
            </InterviewField>

            <InterviewField
              number="06"
              title="Which decisions need to be made?"
              helpText="Describe important decisions, choices or approvals that the project depends on."
            >
              <textarea
                value={formData.decisions}
                onChange={(event) =>
                  updateField("decisions", event.target.value)
                }
                placeholder="Describe important decisions that the project depends on."
                rows={4}
                className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
              />
            </InterviewField>
          </div>

          <div className="mt-8 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
                  Next step
                </p>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">
                  When the interview is saved, a project map is created. It
                  gives you a shared overview before you continue to the
                  workspace, risks, decisions and status report.
                </p>
              </div>

              <button
                type="submit"
                className="w-fit rounded-2xl bg-white px-6 py-3 font-semibold text-slate-950 shadow-lg hover:bg-slate-200"
              >
                Create project map
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