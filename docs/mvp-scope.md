# MVP Scope – Project Compass

## Purpose of the MVP

The purpose of the first version of Project Compass was to prove the core idea:

A project management tool should help users understand and structure a project before they start managing tasks.

Project Compass should not try to compete with Trello, Jira, Asana or ClickUp in all areas.

Its strength should be project clarity.

The app should help the user understand:

* why the project exists
* what should improve
* what should be delivered
* who is involved
* who is responsible for what
* what is blocked
* which risks need attention
* which decisions are still open
* how healthy the project is
* what should happen next

The MVP should be small, clear, usable and easy to demonstrate.

---

## Product Positioning

Project Compass helps teams turn unclear work into a manageable project.

The app is built as a portfolio project within software testing, QA, frontend development, project management and test automation.

It is not intended to be a clone of Trello, Taiga, Jira or Reqtest.

Project Compass should focus on:

* project clarity
* direction
* responsibility
* risk overview
* decision tracking
* status reporting
* next steps
* testability

---

## Original MVP Goal

The first version should allow a user to:

1. Create a new project
2. Answer a short project interview
3. Generate a project map
4. Add tasks
5. Add risks
6. Add decisions
7. View a simple project board
8. Generate a simple status report

---

## Included in the Original MVP

### Project Interview

The user should answer questions about:

* project name
* purpose
* goal
* deliverables
* deadline
* stakeholders
* risks
* important decisions
* success criteria

### Project Map

The system should display:

* project name
* purpose
* goals
* deliverables
* top risks
* important decisions
* next steps

### Task Board

The first board should have these columns:

* Backlog
* Planned
* In progress
* Blocked
* Review
* Done

### Risks

The user should be able to create simple risks with:

* title
* description
* probability
* impact
* action
* owner
* status

### Decisions

The user should be able to create simple decisions with:

* title
* description
* status
* owner
* deadline
* consequence

### Status Report

The system should generate a simple report with:

* current status
* completed work
* blocked work
* top risks
* decisions needed
* next steps

---

## Current MVP+ Status

Project Compass has now evolved beyond the first MVP.

The current version includes:

* landing page
* project interview
* project map
* My Projects overview
* support for multiple saved projects
* active project handling
* localStorage-based project persistence
* project members
* task board
* risks
* decisions
* responsibility for tasks, risks and decisions
* Attention Needed
* Project Health
* status report
* Markdown status report export
* shared project insight logic
* Playwright E2E tests
* GitHub Actions CI
* Vercel deployment
* README and documentation

This means the app is now closer to an MVP+ project platform than a simple single-project prototype.

---

## Current Core Features

### Multiple Projects

The user can create and save several projects.

Each project has its own:

* name
* description
* status
* members
* tasks
* risks
* decisions

The app stores an active project ID so that project-specific pages know which project the user is currently working with.

### My Projects Overview

The My Projects page shows saved projects and helps the user open the correct project.

Each project card can show:

* project name
* description
* active project status
* Project Health
* Attention items
* members
* tasks
* risks
* decisions
* last updated date

This makes the overview more useful as a project leadership view, not only a list of saved projects.

### Project Members

Each project can have members.

A member can include:

* name
* role
* responsibility
* comment

Members are used to support responsibility and ownership across the project.

### Responsibility

Tasks, risks and decisions can be connected to responsible people.

This helps the user answer:

* Who owns this task?
* Who follows up this risk?
* Who is responsible for this decision?

Unassigned items are allowed, but they are shown as potential attention items.

### Attention Needed

Project Compass can automatically identify project items that need attention.

Current attention rules include:

* blocked tasks
* tasks without owner
* risks without owner
* high risks
* decisions without owner
* open decisions

The purpose is to help the project leader quickly see what needs action.

### Project Health

Project Compass calculates a simple project health state from project data.

Current health states are:

* Stable
* Needs attention
* At risk

The health status is based on signals such as:

* blocked tasks
* high risks
* open decisions
* missing ownership
* number of attention items

Project Health is currently shown in:

* Project Map
* Status Report
* My Projects overview

### Shared Project Insight Logic

Attention Needed and Project Health are calculated through shared logic in:

```ts
src/lib/projectInsights.ts
```

This helper currently contains:

```ts
getAttentionItems(project)
getProjectHealth(project, attentionItems)
```

The purpose is to make sure that different views use the same interpretation of project data.

This improves maintainability and reduces the risk that Project Map, Status Report and My Projects show different project status logic.

---

## Not Included in the Current MVP+

The current version still does not include:

* user accounts
* database
* backend API
* real-time collaboration
* comments
* notifications
* file uploads
* budget management
* Gantt charts
* integrations with other systems
* advanced AI features
* mobile app
* role-based permissions
* cloud synchronization
* multi-user editing

These are intentionally outside the current scope.

Project Compass is still a browser-based MVP/portfolio project using localStorage.

---

## Storage in the Current Version

Project Compass stores data locally in the browser using localStorage.

This means:

* no login is required
* no server is required
* no database is required
* data is only available in the same browser and device
* the app is easy to demo
* the data model can later be moved to a backend if needed

localStorage is a good MVP choice, but it is not suitable for production collaboration or long-term multi-user project work.

---

## Definition of Done for the Original MVP

The original MVP was done when a user could:

* open the app
* create a project
* answer the project interview
* see a generated project map
* create at least one task
* create at least one risk
* create at least one decision
* view the project board
* generate a basic status report

---

## Definition of Done for the Current MVP+

The current MVP+ is considered successful when a user can:

* create several projects
* open a saved project
* see which project is active
* add project members
* add tasks
* add risks
* add decisions
* assign responsibility
* see unassigned or blocked items
* see Attention Needed
* see Project Health
* generate a useful status report
* copy the status report as Markdown
* reload the browser without losing project data
* run important Playwright tests successfully
* understand the project value through README and documentation

---

## Success Criteria

The MVP is successful if a first-time user understands:

* what Project Compass is
* where to start
* what the project is about
* why the project exists
* who is involved
* what needs to be done
* what the main risks are
* what decisions are needed
* what needs attention
* how healthy the project is
* what the next step is

The portfolio is successful if a teacher, LIA contact or recruiter can understand:

* the product idea
* the user problem
* the project model
* the QA mindset
* the testing strategy
* the use of Playwright
* the use of GitHub Actions
* the incremental development process
* the connection between product thinking and quality

---

## Current Testing Scope

Important flows are covered or should be covered by Playwright tests.

Current and recommended test areas include:

* landing page loads
* main flow works
* projects overview
* project members
* task responsibility
* risk responsibility
* decision responsibility
* Attention Needed
* Project Health
* status report
* Markdown export
* no active project handling

The goal is not to test every visual detail.

The goal is to protect important user flows and show a professional QA workflow.

---

## Future Scope

Future versions may include:

* project setup checklist
* better empty states
* richer Project Health Score
* traceability between tasks, risks, decisions and goals
* JSON export/import
* QA module
* test case management
* bug/issue log
* regression suite
* test summary report
* better filtering and sorting
* edit/delete for all objects
* improved mobile view
* screenshots in README
* stronger CI documentation
* “What I learned” section

These should be added gradually, in small testable and committable steps.
