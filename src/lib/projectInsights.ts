import { Project } from "@/lib/projectStorage";

export type AttentionItem = {
  id: string;
  title: string;
  text: string;
  severity: "medium" | "high";
};

export type ProjectHealth = {
  level: "stable" | "needs-attention" | "at-risk";
  title: string;
  summary: string;
  reasons: string[];
};

export function getAttentionItems(project: Project): AttentionItem[] {
  const blockedTasks = project.tasks.filter(
    (task) => task.status === "blocked"
  );

  const tasksWithoutOwner = project.tasks.filter((task) => !task.ownerId);

  const risksWithoutOwner = project.risks.filter(
    (risk) => !risk.ownerId && !risk.owner
  );

  const highRisks = project.risks.filter(
    (risk) => risk.probability === "high" || risk.impact === "high"
  );

  const decisionsWithoutOwner = project.decisions.filter(
    (decision) => !decision.ownerId && !decision.owner
  );

  const openDecisions = project.decisions.filter(
    (decision) => decision.status === "open"
  );

  const items: AttentionItem[] = [];

  if (blockedTasks.length > 0) {
    items.push({
      id: "blocked-tasks",
      title: `${blockedTasks.length} blocked task${
        blockedTasks.length === 1 ? "" : "s"
      }`,
      text: "Blocked tasks may prevent the project from moving forward.",
      severity: "high",
    });
  }

  if (tasksWithoutOwner.length > 0) {
    items.push({
      id: "tasks-without-owner",
      title: `${tasksWithoutOwner.length} task${
        tasksWithoutOwner.length === 1 ? "" : "s"
      } without owner`,
      text: "Tasks without an owner can easily be missed or delayed.",
      severity: "medium",
    });
  }

  if (risksWithoutOwner.length > 0) {
    items.push({
      id: "risks-without-owner",
      title: `${risksWithoutOwner.length} risk${
        risksWithoutOwner.length === 1 ? "" : "s"
      } without owner`,
      text: "Risks without a responsible person may not be followed up.",
      severity: "medium",
    });
  }

  if (highRisks.length > 0) {
    items.push({
      id: "high-risks",
      title: `${highRisks.length} high risk${
        highRisks.length === 1 ? "" : "s"
      }`,
      text: "High risks should be reviewed and handled before they affect the project.",
      severity: "high",
    });
  }

  if (decisionsWithoutOwner.length > 0) {
    items.push({
      id: "decisions-without-owner",
      title: `${decisionsWithoutOwner.length} decision${
        decisionsWithoutOwner.length === 1 ? "" : "s"
      } without owner`,
      text: "Decisions without an owner may remain unclear or unresolved.",
      severity: "medium",
    });
  }

  if (openDecisions.length > 0) {
    items.push({
      id: "open-decisions",
      title: `${openDecisions.length} open decision${
        openDecisions.length === 1 ? "" : "s"
      }`,
      text: "Open decisions can block direction, scope or next steps.",
      severity: "high",
    });
  }

  return items;
}

export function getProjectHealth(
  project: Project,
  attentionItems: AttentionItem[]
): ProjectHealth {
  const blockedTasksCount = project.tasks.filter(
    (task) => task.status === "blocked"
  ).length;

  const highRisksCount = project.risks.filter(
    (risk) => risk.probability === "high" || risk.impact === "high"
  ).length;

  const openDecisionsCount = project.decisions.filter(
    (decision) => decision.status === "open"
  ).length;

  const reasons: string[] = [];

  if (blockedTasksCount > 0) {
    reasons.push(
      `${blockedTasksCount} blocked task${
        blockedTasksCount === 1 ? "" : "s"
      }`
    );
  }

  if (highRisksCount > 0) {
    reasons.push(
      `${highRisksCount} high risk${highRisksCount === 1 ? "" : "s"}`
    );
  }

  if (openDecisionsCount > 0) {
    reasons.push(
      `${openDecisionsCount} open decision${
        openDecisionsCount === 1 ? "" : "s"
      }`
    );
  }

  const isAtRisk =
    blockedTasksCount >= 2 || highRisksCount >= 2 || openDecisionsCount >= 3;

  if (isAtRisk) {
    return {
      level: "at-risk",
      title: "At risk",
      summary:
        "This project has several signals that may affect progress, direction or delivery.",
      reasons,
    };
  }

  if (attentionItems.length > 0) {
    return {
      level: "needs-attention",
      title: "Needs attention",
      summary:
        "This project has items that should be reviewed by the project leader.",
      reasons:
        reasons.length > 0
          ? reasons
          : ["Some tasks, risks or decisions are missing clear ownership."],
    };
  }

  return {
    level: "stable",
    title: "Stable",
    summary:
      "No blocked tasks, high risks, open decisions or missing owners were found.",
    reasons: ["No current attention signals."],
  };
}