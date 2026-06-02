"use client";

import { useEffect, useState } from "react";
import AppHeader from "../../components/AppHeader";
import {
  getActiveProject,
  loadProjectCompassState,
  Project,
  ProjectMember,
  ProjectTask,
  ProjectTaskStatus,
  saveProjectCompassState,
  updateProject,
} from "@/lib/projectStorage";

type ProjectInterviewData = {
  projectName: string;
  purpose: string;
  goal: string;
  deliverables: string;
  risks: string;
  decisions: string;
};

const columns: {
  id: ProjectTaskStatus;
  title: string;
  description: string;
}[] = [
  {
    id: "backlog",
    title: "Backlog",
    description: "Ideas and tasks that have not been planned yet.",
  },
  {
    id: "planned",
    title: "Planned",
    description: "Tasks that are selected and ready to start.",
  },
  {
    id: "in-progress",
    title: "In progress",
    description: "Work that is currently being done.",
  },
  {
    id: "blocked",
    title: "Blocked",
    description: "Tasks that are currently blocked by something.",
  },
  {
    id: "review",
    title: "Review",
    description: "Work that needs to be checked or approved.",
  },
  {
    id: "done",
    title: "Done",
    description: "Completed tasks.",
  },
];

function isValidTaskStatus(status: unknown): status is ProjectTaskStatus {
  return columns.some((column) => column.id === status);
}

function loadLegacyTasks(): ProjectTask[] {
  const savedTasks = localStorage.getItem("project-compass-tasks");

  if (!savedTasks) {
    return [];
  }

  try {
    const parsedTasks = JSON.parse(savedTasks) as Partial<ProjectTask>[];

    if (!Array.isArray(parsedTasks)) {
      return [];
    }

    const now = new Date().toISOString();

    return parsedTasks
      .filter((task) => typeof task.title === "string" && task.title.trim())
      .map((task) => ({
        id: typeof task.id === "string" ? task.id : crypto.randomUUID(),
        title: task.title ?? "Untitled task",
        description:
          typeof task.description === "string" ? task.description : undefined,
        status: isValidTaskStatus(task.status) ? task.status : "backlog",
        ownerId: typeof task.ownerId === "string" ? task.ownerId : undefined,
        createdAt: typeof task.createdAt === "string" ? task.createdAt : now,
        updatedAt: typeof task.updatedAt === "string" ? task.updatedAt : now,
      }));
  } catch {
    return [];
  }
}

export default function ProjectBoardPage() {
  const [project, setProject] = useState<ProjectInterviewData | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState<ProjectTaskStatus>("backlog");
  const [taskOwnerId, setTaskOwnerId] = useState("");
  const [taskTitleError, setTaskTitleError] = useState("");

  useEffect(() => {
    const savedProject = localStorage.getItem("project-compass-current-project");

    const platformState = loadProjectCompassState();
    const currentActiveProject = getActiveProject(platformState);

    if (savedProject) {
      setProject(JSON.parse(savedProject));
    }

    if (!currentActiveProject) {
      setActiveProject(null);
      setProjectMembers([]);
      setTasks([]);
      return;
    }

    const legacyTasks = loadLegacyTasks();

    if (currentActiveProject.tasks.length === 0 && legacyTasks.length > 0) {
      const migratedProject: Project = {
        ...currentActiveProject,
        tasks: legacyTasks,
      };

      const updatedState = updateProject(platformState, migratedProject);
      const updatedActiveProject = getActiveProject(updatedState);

      saveProjectCompassState(updatedState);
      localStorage.removeItem("project-compass-tasks");

      setActiveProject(updatedActiveProject);
      setProjectMembers(updatedActiveProject?.members ?? []);
      setTasks(updatedActiveProject?.tasks ?? []);

      return;
    }

    setActiveProject(currentActiveProject);
    setProjectMembers(currentActiveProject.members);
    setTasks(currentActiveProject.tasks);
  }, []);

  function persistTasks(nextTasks: ProjectTask[]) {
    const platformState = loadProjectCompassState();
    const currentActiveProject = getActiveProject(platformState);

    if (!currentActiveProject) {
      setTasks(nextTasks);
      return;
    }

    const updatedProject: Project = {
      ...currentActiveProject,
      tasks: nextTasks,
    };

    const updatedState = updateProject(platformState, updatedProject);
    const updatedActiveProject = getActiveProject(updatedState);

    saveProjectCompassState(updatedState);

    setActiveProject(updatedActiveProject);
    setProjectMembers(updatedActiveProject?.members ?? []);
    setTasks(updatedActiveProject?.tasks ?? nextTasks);
  }

  function getMemberName(ownerId?: string) {
    if (!ownerId) {
      return "Unassigned";
    }

    return (
      projectMembers.find((member) => member.id === ownerId)?.name ||
      "Unknown member"
    );
  }

  function handleTaskTitleChange(value: string) {
    setTaskTitle(value);

    if (taskTitleError && value.trim()) {
      setTaskTitleError("");
    }
  }

  function handleCreateTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = taskTitle.trim();
    const trimmedDescription = taskDescription.trim();

    if (!trimmedTitle) {
      setTaskTitleError("Task title is required.");
      return;
    }

    const now = new Date().toISOString();

    const newTask: ProjectTask = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      description: trimmedDescription || undefined,
      status: taskStatus,
      ownerId: taskOwnerId || undefined,
      createdAt: now,
      updatedAt: now,
    };

    persistTasks([...tasks, newTask]);

    setTaskTitle("");
    setTaskDescription("");
    setTaskStatus("backlog");
    setTaskOwnerId("");
    setTaskTitleError("");
  }

  function updateTaskStatus(taskId: string, newStatus: ProjectTaskStatus) {
    const now = new Date().toISOString();

    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, status: newStatus, updatedAt: now }
        : task
    );

    persistTasks(updatedTasks);
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

          <h1 className="text-4xl font-bold tracking-tight">Workspace</h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Break the project down into concrete tasks, follow status and make
            planned, ongoing, blocked and completed work visible.
          </p>

          <p className="mt-3 text-slate-400">
            {activeProject?.name
              ? `Project: ${activeProject.name}`
              : project?.projectName
                ? `Project: ${project.projectName}`
                : "No active project found yet."}
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <SummaryCard
            title="Total tasks"
            value={totalTasks.toString()}
            text="All tasks currently in the workspace."
          />

          <SummaryCard
            title="Done"
            value={doneTasks.toString()}
            text="Tasks that have been completed."
          />

          <SummaryCard
            title="Blocked"
            value={blockedTasks.toString()}
            text="Tasks that need attention."
          />
        </div>

        <form
          onSubmit={handleCreateTask}
          className="mb-10 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
        >
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
              New task
            </p>

            <h2 className="text-2xl font-bold">Create task</h2>

            <p className="max-w-3xl text-sm leading-6 text-slate-400">
              Write a clear task that someone in the project can understand,
              take ownership of and move forward through the workflow.
            </p>

            {!activeProject && (
              <p className="mt-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                No active project found. Open or create a project before adding
                tasks.
              </p>
            )}

            {activeProject && projectMembers.length === 0 && (
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
                Title
              </label>
              <input
                id="task-title"
                type="text"
                value={taskTitle}
                onChange={(event) => handleTaskTitleChange(event.target.value)}
                placeholder="Example: Write the first status update"
                aria-invalid={taskTitleError ? "true" : "false"}
                aria-describedby={
                  taskTitleError ? "task-title-error" : undefined
                }
                className={`mt-2 w-full rounded-xl border bg-slate-950 px-4 py-3 text-white outline-none ${
                  taskTitleError
                    ? "border-rose-500 focus:border-rose-400"
                    : "border-slate-700 focus:border-sky-300"
                }`}
                disabled={!activeProject}
              />

              {taskTitleError && (
                <p
                  id="task-title-error"
                  className="mt-2 text-sm font-medium text-rose-300"
                >
                  {taskTitleError}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="task-description"
                className="block text-sm font-semibold text-slate-200"
              >
                Description
              </label>
              <input
                id="task-description"
                type="text"
                value={taskDescription}
                onChange={(event) => setTaskDescription(event.target.value)}
                placeholder="Short description of the task"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
                disabled={!activeProject}
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
                  setTaskStatus(event.target.value as ProjectTaskStatus)
                }
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300"
                disabled={!activeProject}
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
                disabled={!activeProject}
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
            disabled={!activeProject}
            className="mt-6 rounded-2xl bg-white px-6 py-3 font-semibold text-slate-950 shadow-lg hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            Add task
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
                        Move to
                      </label>

                      <select
                        id={`task-status-${task.id}`}
                        value={task.status}
                        onChange={(event) =>
                          updateTaskStatus(
                            task.id,
                            event.target.value as ProjectTaskStatus
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