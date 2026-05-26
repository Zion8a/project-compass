"use client";

import { FormEvent, useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import {
  addMemberToProject,
  createProjectMember,
  getActiveProject,
  loadProjectCompassState,
  Project,
  ProjectCompassState,
  saveProjectCompassState,
} from "@/lib/projectStorage";

export default function ProjectMembersPage() {
  const [state, setState] = useState<ProjectCompassState>({
    activeProjectId: null,
    projects: [],
  });

  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [responsibility, setResponsibility] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    const loadedState = loadProjectCompassState();
    const project = getActiveProject(loadedState);

    setState(loadedState);
    setActiveProject(project);
  }, []);

  function handleAddMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeProject) {
      return;
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const newMember = createProjectMember(
      trimmedName,
      role.trim() || undefined,
      responsibility.trim() || undefined,
      comment.trim() || undefined
    );

    const updatedState = addMemberToProject(
      state,
      activeProject.id,
      newMember
    );

    const updatedActiveProject = getActiveProject(updatedState);

    setState(updatedState);
    setActiveProject(updatedActiveProject);
    saveProjectCompassState(updatedState);

    setName("");
    setRole("");
    setResponsibility("");
    setComment("");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <AppHeader />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
            Project team
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Project Members
          </h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            Add people, roles and responsibilities to the active project. This
            helps Project Compass connect project structure with ownership.
          </p>
        </div>

        {!activeProject ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8">
            <h2 className="text-xl font-semibold">No active project</h2>
            <p className="mt-2 text-slate-400">
              Open or create a project from My Projects before adding members.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
              <h2 className="text-xl font-semibold">Add member</h2>
              <p className="mt-2 text-sm text-slate-400">
                Start simple. A name is required. Role, responsibility and
                comment can be added when useful.
              </p>

              <form onSubmit={handleAddMember} className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="member-name"
                    className="block text-sm font-medium text-slate-200"
                  >
                    Name
                  </label>
                  <input
                    id="member-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Example: Johan Larsson"
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-cyan-400 placeholder:text-slate-500 focus:ring-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="member-role"
                    className="block text-sm font-medium text-slate-200"
                  >
                    Role
                  </label>
                  <input
                    id="member-role"
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    placeholder="Example: Project lead"
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-cyan-400 placeholder:text-slate-500 focus:ring-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="member-responsibility"
                    className="block text-sm font-medium text-slate-200"
                  >
                    Responsibility
                  </label>
                  <textarea
                    id="member-responsibility"
                    value={responsibility}
                    onChange={(event) =>
                      setResponsibility(event.target.value)
                    }
                    placeholder="Example: Owns planning, follow-up and stakeholder communication"
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-cyan-400 placeholder:text-slate-500 focus:ring-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="member-comment"
                    className="block text-sm font-medium text-slate-200"
                  >
                    Comment
                  </label>
                  <textarea
                    id="member-comment"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="Optional note"
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-cyan-400 placeholder:text-slate-500 focus:ring-2"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Add member
                </button>
              </form>
            </section>

            <section>
              <div className="mb-4">
                <h2 className="text-2xl font-semibold">
                  Members in {activeProject.name}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  {activeProject.members.length} member
                  {activeProject.members.length === 1 ? "" : "s"}
                </p>
              </div>

              {activeProject.members.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-center">
                  <h3 className="text-lg font-semibold">No members yet</h3>
                  <p className="mt-2 text-slate-400">
                    Add the first member to clarify roles and responsibilities.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {activeProject.members.map((member) => (
                    <article
                      key={member.id}
                      className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg"
                    >
                      <h3 className="text-xl font-semibold">{member.name}</h3>

                      <dl className="mt-4 grid gap-4 text-sm md:grid-cols-3">
                        <div>
                          <dt className="font-medium text-slate-300">Role</dt>
                          <dd className="mt-1 text-slate-400">
                            {member.role || "Not specified"}
                          </dd>
                        </div>

                        <div>
                          <dt className="font-medium text-slate-300">
                            Responsibility
                          </dt>
                          <dd className="mt-1 text-slate-400">
                            {member.responsibility || "Not specified"}
                          </dd>
                        </div>

                        <div>
                          <dt className="font-medium text-slate-300">
                            Comment
                          </dt>
                          <dd className="mt-1 text-slate-400">
                            {member.comment || "No comment"}
                          </dd>
                        </div>
                      </dl>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </section>
    </main>
  );
}