import { describe, expect, it, vi } from "vitest";
import {
  createEmptyState,
  parseProjectCompassState,
  readProjectCompassState,
  saveProjectCompassState,
  PROJECT_COMPASS_STORAGE_KEY,
  PROJECT_COMPASS_STATE_VERSION,
} from "./projectStorage";

describe("Project Compass state boundary", () => {
  it("creates an empty project state with the current schema version", () => {
    expect(createEmptyState()).toEqual({
      schemaVersion: PROJECT_COMPASS_STATE_VERSION,
      activeProjectId: null,
      projects: [],
    });
  });

  it("returns missing when no stored state exists", () => {
    expect(parseProjectCompassState(null)).toEqual({
      status: "missing",
      state: createEmptyState(),
      normalized: false,
      diagnostics: [],
    });
  });

  it("returns invalid for malformed JSON", () => {
    expect(parseProjectCompassState("{broken-json")).toEqual({
      status: "invalid",
      state: null,
      normalized: false,
      diagnostics: ["Stored state contains invalid JSON."],
    });
  });

  it("returns legacy for versionless state with valid base structure", () => {
    const storedState = JSON.stringify({
      activeProjectId: null,
      projects: [],
    });

    expect(parseProjectCompassState(storedState)).toEqual({
      status: "legacy",
      state: {
        schemaVersion: PROJECT_COMPASS_STATE_VERSION,
        activeProjectId: null,
        projects: [],
      },
      normalized: true,
      diagnostics: ["Stored state has no schemaVersion and is treated as legacy state."],
    });
  });

  it("returns unsupported-version for an unknown schema version", () => {
    const storedState = JSON.stringify({
      schemaVersion: 999,
      activeProjectId: null,
      projects: [],
    });

    expect(parseProjectCompassState(storedState)).toEqual({
      status: "unsupported-version",
      state: null,
      normalized: false,
      diagnostics: ["Stored state uses unsupported schemaVersion 999."],
    });
  });

  it("returns valid for current-version state with valid base structure", () => {
    const storedState = JSON.stringify({
      schemaVersion: PROJECT_COMPASS_STATE_VERSION,
      activeProjectId: null,
      projects: [],
    });

    expect(parseProjectCompassState(storedState)).toEqual({
      status: "valid",
      state: {
        schemaVersion: PROJECT_COMPASS_STATE_VERSION,
        activeProjectId: null,
        projects: [],
      },
      normalized: false,
      diagnostics: [],
    });
  });

  it("normalizes missing project collections to empty arrays", () => {
    const storedState = JSON.stringify({
      schemaVersion: PROJECT_COMPASS_STATE_VERSION,
      activeProjectId: "project-1",
      projects: [
        {
          id: "project-1",
          name: "Project One",
          status: "not-started",
          createdAt: "2026-08-07T12:00:00.000Z",
          updatedAt: "2026-08-07T12:00:00.000Z",
        },
      ],
    });

    expect(parseProjectCompassState(storedState)).toEqual({
      status: "valid",
      state: {
        schemaVersion: PROJECT_COMPASS_STATE_VERSION,
        activeProjectId: "project-1",
        projects: [
          {
            id: "project-1",
            name: "Project One",
            status: "not-started",
            createdAt: "2026-08-07T12:00:00.000Z",
            updatedAt: "2026-08-07T12:00:00.000Z",
            tasks: [],
            risks: [],
            decisions: [],
            testCases: [],
            members: [],
          },
        ],
      },
      normalized: true,
      diagnostics: [
        "Project project-1 normalized missing collections: tasks, risks, decisions, testCases, members.",
      ],
    });
  });
  it("normalizes an invalid activeProjectId to null", () => {
    const storedState = JSON.stringify({
      schemaVersion: PROJECT_COMPASS_STATE_VERSION,
      activeProjectId: "missing-project",
      projects: [
        {
          id: "project-1",
          name: "Project One",
          status: "not-started",
          createdAt: "2026-08-07T12:00:00.000Z",
          updatedAt: "2026-08-07T12:00:00.000Z",
          tasks: [],
          risks: [],
          decisions: [],
          testCases: [],
          members: [],
        },
      ],
    });

    expect(parseProjectCompassState(storedState)).toEqual({
      status: "valid",
      state: {
        schemaVersion: PROJECT_COMPASS_STATE_VERSION,
        activeProjectId: null,
        projects: [
          {
            id: "project-1",
            name: "Project One",
            status: "not-started",
            createdAt: "2026-08-07T12:00:00.000Z",
            updatedAt: "2026-08-07T12:00:00.000Z",
            tasks: [],
            risks: [],
            decisions: [],
            testCases: [],
            members: [],
          },
        ],
      },
      normalized: true,
      diagnostics: [
        "activeProjectId missing-project does not reference an existing project and was normalized to null.",
      ],
    });
  });
  it("does not overwrite raw stored data when reading malformed JSON", () => {
    const rawState = "{broken-json";
    const getItem = vi.fn(() => rawState);
    const setItem = vi.fn();

    vi.stubGlobal("window", {
      localStorage: {
        getItem,
        setItem,
      },
    });

    const result = readProjectCompassState();

    expect(getItem).toHaveBeenCalledWith(PROJECT_COMPASS_STORAGE_KEY);
    expect(result.status).toBe("invalid");
    expect(setItem).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });
  it("normalizes missing project collections in versionless legacy state", () => {
    const storedState = JSON.stringify({
      activeProjectId: "project-1",
      projects: [
        {
          id: "project-1",
          name: "Legacy Project",
          status: "not-started",
          createdAt: "2026-08-07T12:00:00.000Z",
          updatedAt: "2026-08-07T12:00:00.000Z",
        },
      ],
    });

    const result = parseProjectCompassState(storedState);

    expect(result.status).toBe("legacy");
    expect(result.state?.projects[0]).toEqual({
      id: "project-1",
      name: "Legacy Project",
      status: "not-started",
      createdAt: "2026-08-07T12:00:00.000Z",
      updatedAt: "2026-08-07T12:00:00.000Z",
      tasks: [],
      risks: [],
      decisions: [],
      testCases: [],
      members: [],
    });
    expect(result.state?.activeProjectId).toBe("project-1");
    expect(result.normalized).toBe(true);
  });
  it("writes the current schemaVersion when saving state", () => {
    const setItem = vi.fn();

    vi.stubGlobal("window", {
      localStorage: {
        getItem: vi.fn(),
        setItem,
      },
    });

    saveProjectCompassState(createEmptyState());

    expect(setItem).toHaveBeenCalledWith(
      PROJECT_COMPASS_STORAGE_KEY,
      JSON.stringify({
        schemaVersion: PROJECT_COMPASS_STATE_VERSION,
        activeProjectId: null,
        projects: [],
      })
    );

    vi.unstubAllGlobals();
  });
  it("does not overwrite malformed stored data when saving after a failed read", () => {
    const rawState = "{broken-json";
    const getItem = vi.fn(() => rawState);
    const setItem = vi.fn();

    vi.stubGlobal("window", {
      localStorage: {
        getItem,
        setItem,
      },
    });

    saveProjectCompassState(createEmptyState());

    expect(getItem).toHaveBeenCalledWith(PROJECT_COMPASS_STORAGE_KEY);
    expect(setItem).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });
  it("does not overwrite stored data with an unsupported schema version", () => {
    const rawState = JSON.stringify({
      schemaVersion: 999,
      activeProjectId: null,
      projects: [],
    });
    const getItem = vi.fn(() => rawState);
    const setItem = vi.fn();

    vi.stubGlobal("window", {
      localStorage: {
        getItem,
        setItem,
      },
    });

    saveProjectCompassState(createEmptyState());

    expect(getItem).toHaveBeenCalledWith(PROJECT_COMPASS_STORAGE_KEY);
    expect(setItem).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });});
