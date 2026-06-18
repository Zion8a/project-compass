import { Project, ProjectMember } from "@/lib/projectStorage";

function createExampleMember(
  name: string,
  role: string,
  responsibility: string
): ProjectMember {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    name,
    role,
    responsibility,
    createdAt: now,
    updatedAt: now,
  };
}

export function createExampleProject(): Project {
  const now = new Date().toISOString();

  const johan = createExampleMember(
    "Johan Larsson",
    "Project Lead / QA",
    "Structure, testing and status follow-up"
  );

  const rebecca = createExampleMember(
    "Rebecca Andersson",
    "UX / Requirements",
    "User flows and requirement clarity"
  );

  const rasmus = createExampleMember(
    "Rasmus Nilsson",
    "Developer",
    "Frontend implementation"
  );

  return {
    id: crypto.randomUUID(),
    name: "Project Compass Demo Project",
    description:
      "A ready-made example project that shows how Project Compass can structure members, tasks, risks, decisions, responsibility and project status.",
    status: "in-progress",
    createdAt: now,
    updatedAt: now,
    members: [johan, rebecca, rasmus],
    tasks: [
      {
        id: crypto.randomUUID(),
        title: "Create project setup checklist",
        description:
          "Create a simple checklist that helps new users understand what to add first.",
        status: "done",
        priority: "high",
        ownerId: johan.id,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        title: "Improve status report layout",
        description:
          "Make the status report easier to scan for teachers, recruiters and LIA contacts.",
        status: "in-progress",
        priority: "medium",
        ownerId: rasmus.id,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        title: "Add example project data",
        description:
          "Add demo data so visitors can explore Project Compass without creating all content manually.",
        status: "planned",
        priority: "high",
        ownerId: johan.id,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        title: "Confirm presentation scope",
        description:
          "Clarify which parts of the project should be shown in a short portfolio walkthrough.",
        status: "blocked",
        priority: "high",
        createdAt: now,
        updatedAt: now,
      },
    ],
    risks: [
      {
        id: crypto.randomUUID(),
        title: "Unclear responsibility between team members",
        description:
          "If ownership is unclear, important work may be delayed or missed.",
        probability: "high",
        impact: "high",
        mitigation:
          "Use clear owners on tasks, risks and decisions before each project check-in.",
        action: "Review ownership during the next project check-in.",
        owner: johan.name,
        ownerId: johan.id,
        status: "open",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        title: "Status report may be too unclear for external viewers",
        description:
          "The report needs to explain project progress clearly to someone outside the team.",
        probability: "medium",
        impact: "high",
        mitigation:
          "Review the report with a person who has not worked in the project.",
        action: "Test the report with someone outside the project.",
        owner: rebecca.name,
        ownerId: rebecca.id,
        status: "watching",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        title: "Demo users may not understand where to start",
        description:
          "A new visitor may not understand the app if they only see an empty project.",
        probability: "high",
        impact: "medium",
        mitigation:
          "Provide a small example project that demonstrates the main workflow.",
        action: "Add example project and clearer onboarding support.",
        status: "open",
        createdAt: now,
        updatedAt: now,
      },
    ],
        decisions: [
      {
        id: crypto.randomUUID(),
        title: "Use Project Compass as portfolio case",
        description:
          "Project Compass should be developed as a focused portfolio project for QA, project clarity and frontend development.",
        owner: johan.name,
        ownerId: johan.id,
        consequence:
          "The app should show QA, product thinking and project clarity.",
        status: "decided",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        title: "Decide what belongs in Version 1.2",
        description:
          "The next version needs a clear focus before more functionality is added.",
        consequence:
          "The roadmap needs a clear next focus after stabilization.",
        status: "open",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        title: "Keep demo-data small and focused",
        description:
          "The example project should explain the product without turning into a template system.",
        owner: johan.name,
        ownerId: johan.id,
        consequence:
          "The demo should explain the product without becoming a large template system.",
        status: "decided",
        createdAt: now,
        updatedAt: now,
      },
    ],
    testCases: [],
  };
}