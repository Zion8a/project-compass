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
  relatedTaskId?: string;
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
  relatedTaskId?: string;
  deadline?: string;
  consequence?: string;
  status: ProjectDecisionStatus;
  createdAt: string;
  updatedAt: string;
};

export type ProjectTestCaseStatus = "not-run" | "passed" | "failed" | "blocked";

export type ProjectTestCase = {
  id: string;
  title: string;
  description?: string;
  expectedResult?: string;
  status: ProjectTestCaseStatus;
  relatedTaskId?: string;
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
  testCases: ProjectTestCase[];
  members: ProjectMember[];
};

export const PROJECT_COMPASS_STATE_VERSION = 1 as const;

export type ProjectCompassState = {
  schemaVersion: typeof PROJECT_COMPASS_STATE_VERSION;
  activeProjectId: string | null;
  projects: Project[];
};

export const PROJECT_COMPASS_STORAGE_KEY = "project-compass-state";

export type ProjectCompassStateReadStatus =
  | "missing"
  | "valid"
  | "legacy"
  | "invalid"
  | "unsupported-version";

export type ProjectCompassStateReadResult = {
  status: ProjectCompassStateReadStatus;
  state: ProjectCompassState | null;
  normalized: boolean;
  diagnostics: string[];
};

export function createEmptyState(): ProjectCompassState {
  return {
    schemaVersion: PROJECT_COMPASS_STATE_VERSION,
    activeProjectId: null,
    projects: [],
  };
}

export function parseProjectCompassState(
  savedState: string | null
): ProjectCompassStateReadResult {
  if (!savedState) {
    return {
      status: "missing",
      state: createEmptyState(),
      normalized: false,
      diagnostics: [],
    };
  }

  let parsedState: unknown;

  try {
    parsedState = JSON.parse(savedState);
  } catch {
    return {
      status: "invalid",
      state: null,
      normalized: false,
      diagnostics: ["Stored state contains invalid JSON."],
    };
  }

  if (
    typeof parsedState === "object" &&
    parsedState !== null &&
    "schemaVersion" in parsedState &&
    parsedState.schemaVersion !== PROJECT_COMPASS_STATE_VERSION
  ) {
    return {
      status: "unsupported-version",
      state: null,
      normalized: false,
      diagnostics: [
        `Stored state uses unsupported schemaVersion ${String(
          parsedState.schemaVersion
        )}.`,
      ],
    };
  }

  if (
    typeof parsedState === "object" &&
    parsedState !== null &&
    "schemaVersion" in parsedState &&
    parsedState.schemaVersion === PROJECT_COMPASS_STATE_VERSION &&
    "projects" in parsedState &&
    Array.isArray(parsedState.projects)
  ) {
    const currentState = parsedState as {
      schemaVersion: typeof PROJECT_COMPASS_STATE_VERSION;
      activeProjectId?: unknown;
      projects: Project[];
    };

    const diagnostics: string[] = [];

    const normalizedProjects = currentState.projects.map((project) => {
      const missingCollections = [
        ["tasks", project.tasks],
        ["risks", project.risks],
        ["decisions", project.decisions],
        ["testCases", project.testCases],
        ["members", project.members],
      ]
        .filter(([, value]) => value === undefined)
        .map(([name]) => name);

      if (missingCollections.length > 0) {
        diagnostics.push(
          `Project ${project.id} normalized missing collections: ${missingCollections.join(", ")}.`
        );
      }

      return {
        ...project,
        tasks: project.tasks ?? [],
        risks: project.risks ?? [],
        decisions: project.decisions ?? [],
        testCases: project.testCases ?? [],
        members: project.members ?? [],
      };
    });

    let activeProjectId =
      typeof currentState.activeProjectId === "string"
        ? currentState.activeProjectId
        : null;

    if (
      activeProjectId !== null &&
      !normalizedProjects.some((project) => project.id === activeProjectId)
    ) {
      diagnostics.push(
        `activeProjectId ${activeProjectId} does not reference an existing project and was normalized to null.`
      );
      activeProjectId = null;
    }

    return {
      status: "valid",
      state: {
        schemaVersion: PROJECT_COMPASS_STATE_VERSION,
        activeProjectId,
        projects: normalizedProjects,
      },
      normalized: diagnostics.length > 0,
      diagnostics,
    };
  }

  if (
    typeof parsedState === "object" &&
    parsedState !== null &&
    "projects" in parsedState &&
    Array.isArray(parsedState.projects) &&
    !("schemaVersion" in parsedState)
  ) {
    const legacyState = parsedState as {
      activeProjectId?: unknown;
      projects: Project[];
    };

    const normalizedLegacyProjects = legacyState.projects.map((project) => ({
      ...project,
      tasks: project.tasks ?? [],
      risks: project.risks ?? [],
      decisions: project.decisions ?? [],
      testCases: project.testCases ?? [],
      members: project.members ?? [],
    }));

    return {
      status: "legacy",
      state: {
        schemaVersion: PROJECT_COMPASS_STATE_VERSION,
        activeProjectId:
          typeof legacyState.activeProjectId === "string"
            ? legacyState.activeProjectId
            : null,
        projects: normalizedLegacyProjects,
      },
      normalized: true,
      diagnostics: [
        "Stored state has no schemaVersion and is treated as legacy state.",
      ],
    };
  }

  return {
    status: "invalid",
    state: null,
    normalized: false,
    diagnostics: ["Stored state has not been parsed yet."],
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
    testCases: [],
    members: [],
  };
}

export function readProjectCompassState(): ProjectCompassStateReadResult {
  if (typeof window === "undefined") {
    return {
      status: "missing",
      state: createEmptyState(),
      normalized: false,
      diagnostics: [],
    };
  }

  const savedState = window.localStorage.getItem(PROJECT_COMPASS_STORAGE_KEY);

  return parseProjectCompassState(savedState);
}
export function loadProjectCompassState(): ProjectCompassState {
  const result = readProjectCompassState();

  if (result.state) {
    return result.state;
  }

  console.warn(
    `Project Compass state could not be loaded (${result.status}): ${result.diagnostics.join(" ")}`
  );

  return createEmptyState();
}
export function saveProjectCompassState(state: ProjectCompassState): void {
  if (typeof window === "undefined") {
    return;
  }

  const savedState = window.localStorage.getItem(PROJECT_COMPASS_STORAGE_KEY);
  const existingState = parseProjectCompassState(savedState);

  if (
    existingState.status === "invalid" ||
    existingState.status === "unsupported-version"
  ) {
    console.warn(
      `Project Compass state was not saved because existing stored data is ${existingState.status}.`
    );
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
    ...state,
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
            tasks: updatedProject.tasks ?? [],
            risks: updatedProject.risks ?? [],
            decisions: updatedProject.decisions ?? [],
            testCases: updatedProject.testCases ?? [],
            members: updatedProject.members ?? [],
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
