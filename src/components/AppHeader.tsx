import Link from "next/link";

type AppHeaderProps = {
  currentPage:
    | "home"
    | "new-project"
    | "project-map"
    | "project-board"
    | "project-risks"
    | "project-decisions"
    | "project-report";
};

const navigationItems = [
  {
    label: "Startsida",
    href: "/",
    page: "home",
  },
  {
    label: "Projektkarta",
    href: "/project-map",
    page: "project-map",
  },
  {
    label: "Arbetsyta",
    href: "/project-board",
    page: "project-board",
  },
  {
    label: "Riskvy",
    href: "/project-risks",
    page: "project-risks",
  },
  {
    label: "Beslutsvy",
    href: "/project-decisions",
    page: "project-decisions",
  },
  {
    label: "Statusrapport",
    href: "/project-report",
    page: "project-report",
  },
];

export default function AppHeader({ currentPage }: AppHeaderProps) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/95 px-6 py-5 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="group">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">
            Project Compass
          </p>

          <p className="mt-1 text-sm text-slate-400 group-hover:text-slate-300">
            Från idé till styrbart projekt
          </p>
        </Link>

        <nav aria-label="Huvudnavigation">
          <ul className="flex flex-wrap gap-2">
            {navigationItems.map((item) => {
              const isActive = item.page === currentPage;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={
                      isActive
                        ? "inline-flex rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg"
                        : "inline-flex rounded-2xl border border-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Link
          href="/new-project"
          className={
            currentPage === "new-project"
              ? "inline-flex w-fit rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg hover:bg-emerald-300"
              : "inline-flex w-fit rounded-2xl border border-emerald-500/60 px-4 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/10"
          }
        >
          Nytt / redigera projekt
        </Link>
      </div>
    </header>
  );
}