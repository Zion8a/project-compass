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

type TaskStatus =
  | "backlog"
  | "planned"
  | "in-progress"
  | "blocked"
  | "review"
  | "done";

type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
};

const columns: { id: TaskStatus; title: string }[] = [
  { id: "backlog", title: "Backlog" },
  { id: "planned", title: "Planerat" },
  { id: "in-progress", title: "Pågår" },
  { id: "blocked", title: "Blockerat" },
  { id: "review", title: "Granskning" },
  { id: "done", title: "Klart" },
];

export default function ProjectBoardPage() {
  const [project, setProject] = useState<ProjectInterviewData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState<TaskStatus>("backlog");

  useEffect(() => {
    const savedProject = localStorage.getItem("project-compass-current-project");
    const savedTasks = localStorage.getItem("project-compass-tasks");

    if (savedProject) {
      setProject(JSON.parse(savedProject));
    }

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("project-compass-tasks", JSON.stringify(tasks));
  }, [tasks]);

  function handleCreateTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskTitle,
      description: taskDescription,
      status: taskStatus,
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);

    setTaskTitle("");
    setTaskDescription("");
    setTaskStatus("backlog");
  }

  function updateTaskStatus(taskId: string, newStatus: TaskStatus) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      ),
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              Project Compass
            </p>

            <h1 className="text-4xl font-bold tracking-tight">
              Arbetsyta
            </h1>

            <p className="mt-3 text-slate-300">
              {project?.projectName
                ? `Projekt: ${project.projectName}`
                : "Inget projekt hittades ännu."}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/project-map"
              className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900"
            >
              Till projektkarta
            </Link>

            <Link
              href="/new-project"
              className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900"
            >
              Redigera intervju
            </Link>
          </div>
        </div>

        <form
          onSubmit={handleCreateTask}
          className="mb-10 rounded-3xl border border-slate-800 bg-slate-900 p-6"
        >
          <h2 className="text-2xl font-bold">Skapa uppgift</h2>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div>
              <label className="block text-sm font-semibold text-slate-200">
                Titel
              </label>
              <input
                type="text"
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
                placeholder="Exempel: Skriv första rapportutkastet"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200">
                Beskrivning
              </label>
              <input
                type="text"
                value={taskDescription}
                onChange={(event) => setTaskDescription(event.target.value)}
                placeholder="Kort beskrivning av uppgiften"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200">
                Status
              </label>
              <select
                value={taskStatus}
                onChange={(event) =>
                  setTaskStatus(event.target.value as TaskStatus)
                }
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
              >
                {columns.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 rounded-2xl bg-white px-6 py-3 font-semibold text-slate-950 shadow-lg hover:bg-slate-200"
          >
            Lägg till uppgift
          </button>
        </form>

        <div className="grid gap-4 lg:grid-cols-6">
          {columns.map((column) => {
            const columnTasks = tasks.filter(
              (task) => task.status === column.id,
            );

            return (
              <section
                key={column.id}
                className="min-h-64 rounded-3xl border border-slate-800 bg-slate-900/70 p-4"
              >
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {column.title}
                  </h2>

                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {columnTasks.map((task) => (
                    <article
                      key={task.id}
                      className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
                    >
                      <h3 className="font-semibold text-white">{task.title}</h3>

                      {task.description && (
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {task.description}
                        </p>
                      )}

                      <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Flytta till
                      </label>

                      <select
                        value={task.status}
                        onChange={(event) =>
                          updateTaskStatus(
                            task.id,
                            event.target.value as TaskStatus,
                          )
                        }
                        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-white"
                      >
                        {columns.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.title}
                          </option>
                        ))}
                      </select>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}