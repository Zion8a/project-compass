"use client";

import { useEffect, useState } from "react";
import AppHeader from "../../components/AppHeader";
import {
  getActiveProject,
  loadProjectCompassState,
  Project,
  ProjectMember,
} from "@/lib/projectStorage";

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
  ownerId?: string;
};

const columns: { id: TaskStatus; title: string; description: string }[] = [
  {
    id: "backlog",
    title: "Backlog",
    description: "Idéer och uppgifter som ännu inte är planerade.",
  },
  {
    id: "planned",
    title: "Planerat",
    description: "Uppgifter som är valda och redo att påbörjas.",
  },
  {
    id: "in-progress",
    title: "Pågår",
    description: "Arbete som just nu är igång.",
  },
  {
    id: "blocked",
    title: "Blockerat",
    description: "Uppgifter som hindras av något.",
  },
  {
    id: "review",
    title: "Granskning",
    description: "Arbete som behöver kontrolleras eller godkännas.",
  },
  {
    id: "done",
    title: "Klart",
    description: "Färdiga uppgifter.",
  },
];

export default function ProjectBoardPage() {
  const [project, setProject] = useState<ProjectInterviewData | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState<TaskStatus>("backlog");
  const [taskOwnerId, setTaskOwnerId] = useState("");

  useEffect(() => {
    const savedProject = localStorage.getItem("project-compass-current-project");
    const savedTasks = localStorage.getItem("project-compass-tasks");

    const platformState = loadProjectCompassState();
    const currentActiveProject = getActiveProject(platformState);

    setActiveProject(currentActiveProject);
    setProjectMembers(currentActiveProject?.members ?? []);

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

  function getMemberName(ownerId?: string) {
    if (!ownerId) {
      return "Unassigned";
    }

    return (
      projectMembers.find((member) => member.id === ownerId)?.name ||
      "Unknown member"
    );
  }

  function handleCreateTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskTitle,
      description: taskDescription,
      status: taskStatus,
      ownerId: taskOwnerId || undefined,
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);

    setTaskTitle("");
    setTaskDescription("");
    setTaskStatus("backlog");
    setTaskOwnerId("");
  }

  function updateTaskStatus(taskId: string, newStatus: TaskStatus) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((task) => task.status === "done").length;
  const blockedTasks = tasks.filter((task) => task.status === "blocked").length;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AppHeader currentPage="project-board" />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            Project Compass
          </p>

          <h1 className="text-4xl font-bold tracking-tight">Arbetsyta</h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Bryt ner projektet i konkreta uppgifter, följ status och synliggör
            vad som är planerat, pågående, blockerat och klart.
          </p>

          <p className="mt-3 text-slate-400">
            {project?.projectName
              ? `Projekt: ${project.projectName}`
              : activeProject?.name
                ? `Projekt: ${activeProject.name}`
                : "Inget projekt hittades ännu."}
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <SummaryCard
            title="Totalt antal uppgifter"
            value={totalTasks.toString()}
            text="Alla uppgifter som finns på arbetsytan."
          />

          <SummaryCard
            title="Klart"
            value={doneTasks.toString()}
            text="Uppgifter som är färdiga."
          />

          <SummaryCard
            title="Blockerat"
            value={blockedTasks.toString()}
            text="Uppgifter som behöver uppmärksamhet."
          />
        </div>

        <form
          onSubmit={handleCreateTask}
          className="mb-10 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
        >
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
              Ny uppgift
            </p>

            <h2 className="text-2xl font-bold">Skapa uppgift</h2>

            <p className="max-w-3xl text-sm leading-6 text-slate-400">
              Skriv en tydlig uppgift som någon i projektet kan förstå, ta tag i
              och flytta vidare genom arbetsflödet.
            </p>

            {projectMembers.length === 0 && (
              <p className="mt-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                Add project members before assigning responsibility. You can
                still create tasks without an owner.
              </p>
            )}
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-4">
            <div>
              <label
                htmlFor="task-title"
                className="block text-sm font-semibold text-slate-200"
              >
                Titel
              </label>
              <input
                id="task-title"
                type="text"
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
                placeholder="Exempel: Skriv första rapportutkastet"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
                required
              />
            </div>

            <div>
              <label
                htmlFor="task-description"
                className="block text-sm font-semibold text-slate-200"
              >
                Beskrivning
              </label>
              <input
                id="task-description"
                type="text"
                value={taskDescription}
                onChange={(event) => setTaskDescription(event.target.value)}
                placeholder="Kort beskrivning av uppgiften"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
              />
            </div>

            <div>
              <label
                htmlFor="task-status"
                className="block text-sm font-semibold text-slate-200"
              >
                Status
              </label>
              <select
                id="task-status"
                value={taskStatus}
                onChange={(event) =>
                  setTaskStatus(event.target.value as TaskStatus)
                }
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
              >
                {columns.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="task-owner"
                className="block text-sm font-semibold text-slate-200"
              >
                Responsible member
              </label>
              <select
                id="task-owner"
                value={taskOwnerId}
                onChange={(event) => setTaskOwnerId(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
              >
                <option value="">Unassigned</option>
                {projectMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
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
              (task) => task.status === column.id
            );

            return (
              <section
                key={column.id}
                className="min-h-72 rounded-3xl border border-slate-800 bg-slate-900/70 p-4"
              >
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                      {column.title}
                    </h2>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {column.description}
                    </p>
                  </div>

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

                      <p className="mt-3 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-300">
                        Responsible:{" "}
                        <span className="font-semibold text-cyan-300">
                          {getMemberName(task.ownerId)}
                        </span>
                      </p>

                      <label
                        htmlFor={`task-status-${task.id}`}
                        className="mt-4 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                      >
                        Flytta till
                      </label>

                      <select
                        id={`task-status-${task.id}`}
                        value={task.status}
                        onChange={(event) =>
                          updateTaskStatus(
                            task.id,
                            event.target.value as TaskStatus
                          )
                        }
                        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-300"
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

function SummaryCard({
  title,
  value,
  text,
}: {
  title: string;
  value: string;
  text: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
        {title}
      </p>

      <p className="mt-3 text-4xl font-bold text-white">{value}</p>

      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </article>
  );
}
