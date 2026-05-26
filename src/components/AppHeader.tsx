"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getActiveProject,
  loadProjectCompassState,
  Project,
} from "@/lib/projectStorage";

type AppHeaderProps = {
  currentPage?: string;
};

const navItems = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/projects",
    label: "My Projects",
  },
  {
  href: "/new-project",
  label: "Interview",
},
  {
    href: "/project-map",
    label: "Project Map",
  },
  {
    href: "/project-board",
    label: "Workspace",
  },
  {
    href: "/project-risks",
    label: "Risks",
  },
  {
    href: "/project-decisions",
    label: "Decisions",
  },
  {
    href: "/project-report",
    label: "Status Report",
  },
];

export default function AppHeader({ currentPage: _currentPage }: AppHeaderProps) {
  const pathname = usePathname();
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    const loadedState = loadProjectCompassState();
    const currentProject = getActiveProject(loadedState);

    setActiveProject(currentProject);
  }, [pathname]);

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/95">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-1">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-slate-100"
            >
              Project Compass
            </Link>
            <p className="text-sm text-slate-400">
              A project thinking tool for goals, risks, decisions, status and
              next steps.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Active project
            </p>
            {activeProject ? (
              <p className="mt-1 font-semibold text-cyan-300">
                {activeProject.name}
              </p>
            ) : (
              <p className="mt-1 text-slate-400">No active project</p>
            )}
          </div>
        </div>

        <nav aria-label="Main navigation">
          <ul className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-cyan-400 text-slate-950"
                        : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}