export type ProjectStatus =
  | "not-started"
  | "in-progress"
  | "at-risk"
  | "completed";

export type ProjectMember = {
  id: string;
  name: string;
  role?: string;
  responsibility?: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectTaskStatus =
  | "backlog"
  | "planned"
  | "in-progress"
  | "blocked"
  | "review"
  | "done";

export type ProjectTask = {
  id: string;
  title: string;
  description?: string;
  status: ProjectTaskStatus;
  priority?: "low" | "medium" | "high";
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectRiskLevel = "low" | "medium" | "high";

export type ProjectRiskStatus = "open" | "watching" | "handled";

export type ProjectRisk = {
  id: string;
  title: string;
  description?: string;
  probability: ProjectRiskLevel;
  impact: ProjectRiskLevel;
  mitigation?: string;
  action?: string;
  owner?: string;
  ownerId?: string;
  status: ProjectRiskStatus;
  createdAt: string;
  updatedAt: string;
};

export type ProjectDecisionStatus = "open" | "decided" | "postponed";

export type ProjectDecision = {
  id: string;
  title: string;
  description?: string;
  owner?: string;
  ownerId?: string;
  deadline?: string;
  consequence?: string;
  status: ProjectDecisionStatus;
  createdAt: string;
  updatedAt: string;
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  tasks: ProjectTask[];
  risks: ProjectRisk[];
  decisions: ProjectDecision[];
  members: ProjectMember[];
};

export type ProjectCompassState = {
  activeProjectId: string | null;
  projects: Project[];
};

export const PROJECT_COMPASS_STORAGE_KEY = "project-compass-state";

export function createEmptyState(): ProjectCompassState {
  return {
    activeProjectId: null,
    projects: [],
  };
}

export function createProject(name: string, description?: string): Project {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    name,
    description,
    status: "not-started",
    createdAt: now,
    updatedAt: now,
    tasks: [],
    risks: [],
    decisions: [],
    members: [],
  };
}

export function loadProjectCompassState(): ProjectCompassState {
  if (typeof window === "undefined") {
    return createEmptyState();
  }

  const savedState = window.localStorage.getItem(PROJECT_COMPASS_STORAGE_KEY);

  if (!savedState) {
    return createEmptyState();
  }

  try {
    const parsedState = JSON.parse(savedState) as ProjectCompassState;

    if (!Array.isArray(parsedState.projects)) {
      return createEmptyState();
    }

    return {
      activeProjectId: parsedState.activeProjectId ?? null,
      projects: parsedState.projects,
    };
  } catch {
    return createEmptyState();
  }
}

export function saveProjectCompassState(state: ProjectCompassState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PROJECT_COMPASS_STORAGE_KEY, JSON.stringify(state));
}

export function getActiveProject(state: ProjectCompassState): Project | null {
  if (!state.activeProjectId) {
    return null;
  }

  return (
    state.projects.find((project) => project.id === state.activeProjectId) ??
    null
  );
}

export function setActiveProject(
  state: ProjectCompassState,
  projectId: string
): ProjectCompassState {
  const projectExists = state.projects.some(
    (project) => project.id === projectId
  );

  if (!projectExists) {
    return state;
  }

  return {
    ...state,
    activeProjectId: projectId,
  };
}

export function addProject(
  state: ProjectCompassState,
  project: Project
): ProjectCompassState {
  return {
    activeProjectId: project.id,
    projects: [...state.projects, project],
  };
}

export function updateProject(
  state: ProjectCompassState,
  updatedProject: Project
): ProjectCompassState {
  return {
    ...state,
    projects: state.projects.map((project) =>
      project.id === updatedProject.id
        ? {
            ...updatedProject,
            updatedAt: new Date().toISOString(),
          }
        : project
    ),
  };
}

export function createProjectMember(
  name: string,
  role?: string,
  responsibility?: string,
  comment?: string
): ProjectMember {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    name,
    role,
    responsibility,
    comment,
    createdAt: now,
    updatedAt: now,
  };
}

export function addMemberToProject(
  state: ProjectCompassState,
  projectId: string,
  member: ProjectMember
): ProjectCompassState {
  return {
    ...state,
    projects: state.projects.map((project) =>
      project.id === projectId
        ? {
            ...project,
            members: [...project.members, member],
            updatedAt: new Date().toISOString(),
          }
        : project
    ),
  };
}