import { Project } from "@/lib/projectStorage";

export type AttentionItem = {
  id: string;
  title: string;
  text: string;
  severity: "medium" | "high";
};

export type ProjectHealth = {
  level: "stable" | "needs-attention" | "at-risk";
  title: "Stable" | "Needs attention" | "At risk";
  summary: string;
  reasons: string[];
  score: number;
};

function getProjectHealthScore(attentionItems: AttentionItem[]): number {
  const startingScore = 100;

  const totalPenalty = attentionItems.reduce((scorePenalty, item) => {
    if (item.severity === "high") {
      return scorePenalty + 15;
    }

    return scorePenalty + 5;
  }, 0);

  const score = startingScore - totalPenalty;

  return Math.max(0, Math.min(100, score));
}

function formatProjectSignalList(signals: string[]): string {
  if (signals.length === 0) {
    return "";
  }

  if (signals.length === 1) {
    return signals[0];
  }

  if (signals.length === 2) {
    return `${signals[0]} and ${signals[1]}`;
  }

  return `${signals.slice(0, -1).join(", ")} and ${
    signals[signals.length - 1]
  }`;
}

function getProjectHealthSummary(
  level: ProjectHealth["level"],
  signals: string[]
): string {
  const signalList = formatProjectSignalList(signals);

  if (level === "at-risk") {
    return `This project is at risk because it has ${signalList}. These signals may affect progress, direction or delivery.`;
  }

  if (level === "needs-attention") {
    return `This project needs attention because it has ${signalList}. These items should be reviewed by the project leader.`;
  }

  return "No blocked tasks, high risks, open decisions or missing owners were found.";
}

export type RecommendedNextStep = {
  title: string;
  text: string;
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

    const highRisks = project.risks.filter(
    (risk) => risk.probability === "high" || risk.impact === "high"
  );

  const highRisksCount = highRisks.length;

  const unlinkedHighRisksCount = highRisks.filter(
    (risk) => !risk.relatedTaskId
  ).length;

    const openDecisions = project.decisions.filter(
    (decision) => decision.status === "open"
  );

  const openDecisionsCount = openDecisions.length;

  const unlinkedOpenDecisionsCount = openDecisions.filter(
    (decision) => !decision.relatedTaskId
  ).length;

  const score = getProjectHealthScore(attentionItems);

  const reasons =
    attentionItems.length > 0
      ? attentionItems.map((item) => item.title)
      : ["No current attention signals."];

  const isAtRisk =
    blockedTasksCount >= 2 || highRisksCount >= 2 || openDecisionsCount >= 3;

  if (isAtRisk) {
    return {
      level: "at-risk",
      title: "At risk",
      summary: getProjectHealthSummary("at-risk", reasons),
      reasons,
      score,
    };
  }

  if (attentionItems.length > 0) {
    return {
      level: "needs-attention",
      title: "Needs attention",
      summary: getProjectHealthSummary("needs-attention", reasons),
      reasons,
      score,
    };
  }

  return {
    level: "stable",
    title: "Stable",
    summary: getProjectHealthSummary("stable", []),
    reasons,
    score,
  };
}

export function getRecommendedNextStep(
  project: Project,
  attentionItems: AttentionItem[]
): RecommendedNextStep {
  const blockedTasksCount = project.tasks.filter(
    (task) => task.status === "blocked"
  ).length;

  const highRisks = project.risks.filter(
    (risk) => risk.probability === "high" || risk.impact === "high"
  );

  const highRisksCount = highRisks.length;

  const unlinkedHighRisksCount = highRisks.filter(
    (risk) => !risk.relatedTaskId
  ).length;

    const openDecisions = project.decisions.filter(
    (decision) => decision.status === "open"
  );

  const openDecisionsCount = openDecisions.length;

  const unlinkedOpenDecisionsCount = openDecisions.filter(
    (decision) => !decision.relatedTaskId
  ).length;

  const itemsWithoutOwnerCount = attentionItems.filter(
    (item) =>
      item.id === "tasks-without-owner" ||
      item.id === "risks-without-owner" ||
      item.id === "decisions-without-owner"
  ).length;

  if (blockedTasksCount > 0) {
    return {
      title: "Resolve blocked work",
      text: "Start by reviewing blocked tasks. Blocked work can stop progress even if the rest of the project looks stable.",
    };
  }

  if (unlinkedHighRisksCount > 0) {
    return {
      title: "Link high risks to affected tasks",
      text: "High risks are easier to manage when they are connected to the work they may affect. Link each high risk to a related task before reviewing the wider risk plan.",
    };
  }

    if (highRisksCount > 0) {
    return {
      title: "Review high risks",
      text: "Review high risks and make sure each risk has a clear action, owner and follow-up plan.",
    };
  }

  if (unlinkedOpenDecisionsCount > 0) {
    return {
      title: "Link open decisions to affected tasks",
      text: "Open decisions are easier to follow up when they are connected to the work they affect. Link each open decision to a related task before closing or escalating the decision.",
    };
  }

  if (openDecisionsCount > 0) {
    return {
      title: "Close open decisions",
      text: "Review open decisions and clarify what needs to be decided, who owns the decision and what the consequence is.",
    };
  }

  if (itemsWithoutOwnerCount > 0) {
    return {
      title: "Assign ownership",
      text: "Assign owners to unassigned tasks, risks and decisions before adding more work to the project.",
    };
  }

  if (project.tasks.length === 0) {
    return {
      title: "Create the first task",
      text: "The project has direction, but no tasks yet. Add the first concrete task to make the work actionable.",
    };
  }

  if (project.members.length === 0) {
    return {
      title: "Add project members",
      text: "Add project members so responsibility, follow-up and status become easier to understand.",
    };
  }

  return {
    title: "Prepare the next checkpoint",
    text: "The project has no urgent attention signals. Review progress, confirm priorities and prepare the next delivery checkpoint.",
  };
}