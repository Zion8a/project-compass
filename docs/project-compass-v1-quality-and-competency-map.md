# Project Compass V1 – Quality and Competency Map

Date: 2026-08-04  
Status: Draft v0.1  
Purpose: Define the central Version 1 scenarios, quality risks, verification needs and competency evidence for Project Compass.

This document is a steering map for Project Compass Version 1. It describes what Version 1 should prove from a product, QA and portfolio perspective.

Important: this document does not claim that all functions already exist. Each scenario separates verified functionality, partial functionality, missing functionality and areas that need investigation.

---

## Status terms

| Status | Meaning |
|---|---|
| Verified existing | Confirmed through current code, terminal output, build, test result or deployment. |
| Partly exists | Some support exists, but the full scenario is not yet complete or verified. |
| Missing | Needed for V1, but not yet implemented or documented. |
| Needs investigation | Must be checked in the current repository before a safe decision can be made. |

---

## V1 scenario overview

Project Compass V1 is defined through three central scenarios:

1. Classroom pilot – create project clarity in a student project.
2. Project lead overview – understand project state and next action.
3. Quality traceability – follow quality from risk to report.

Together, these scenarios should show that Project Compass helps a team move from unclear work to a manageable, responsible and testable project.

---

# Scenario 1 – Classroom pilot

## User problem

A student group or small project group often starts with unclear direction. The group may have an assignment, but not a shared understanding of:

- why the project exists
- what should be delivered
- who is involved
- who is responsible for what
- which risks may block the work
- which decisions need to be made
- what needs to be tested
- how status should be communicated

In V1, the classroom pilot is used by one project responsible person, or by a group working together in one shared browser session.

Shared editing from multiple devices is not included in V1.

## Desired result

The user should be able to create or open a project and build enough structure to explain:

- project purpose
- goal or intended change
- deliverables
- members
- responsibilities
- tasks
- risks
- decisions
- test cases
- current project status
- recommended next step
- status report in Markdown or copyable format

## Main product and quality risks

| Risk | Consequence |
|---|---|
| The user does not understand where to start. | The app feels like another empty project tool. |
| Classroom pilot creates expectations of multi-user collaboration. | Users may expect real-time editing that V1 does not support. |
| Project Interview and the current Project model may store overlapping information. | Different views may show inconsistent project direction. |
| LocalStorage data may be deleted, corrupted or use older formats. | User data may be lost or interpreted incorrectly. |
| No verified schemaVersion or migration strategy. | Future data changes may damage existing projects. |
| Too much personal data is stored for members. | The app creates unnecessary privacy risk. |
| Empty projects or missing active project states are unclear. | The user may get stuck. |

## Functions that must be verified

| Area | Status | Verification need |
|---|---|---|
| Create project | Needs investigation | Verify current UI, storage and active project behavior. |
| Active project | Needs investigation | Verify persistence after reload and project switch. |
| Project model | Needs investigation | Verify current fields and whether direction fields exist. |
| Project Interview | Needs investigation | Verify what it stores and whether it uses a parallel model. |
| Guided Project Setup | Missing or partly exists | Decide whether Interview should evolve into setup flow. |
| Members | Needs investigation | Verify creation, responsibility and member references. |
| Tasks | Needs investigation | Verify creation, status and owner behavior. |
| Risks | Needs investigation | Verify risk fields and possible task link. |
| Decisions | Needs investigation | Verify status, owner and possible task link. |
| Test cases | Partly exists | Verify current test case model, form and task relation. |
| Status Report | Needs investigation | Verify what data is included. |
| Markdown export | Needs investigation | Verify current export format and copyability. |
| LocalStorage | Needs investigation | Verify storage keys, failure handling and migration needs. |

## Identified gaps

- Verified data map between Project Interview and Project model.
- Clear source of truth for project direction.
- schemaVersion on ProjectCompassState, if needed after investigation.
- Backup/export strategy for local state.
- Restore strategy for backup.
- Minimum personal data principle.
- Classroom pilot demo script.
- External product validation with student, teacher or classmate.

## Acceptance criteria

- A project responsible person or group in one browser can create or open a project.
- The user can understand project purpose, responsibilities, risks, decisions, tasks and quality status.
- The scenario does not require login, real-time collaboration or multiple simultaneous users.
- The same project information is used in Project Map, Status Report and relevant export.
- Missing active project and empty project states are understandable.
- Status report can be copied or exported as Markdown.
- Advanced PDF export and external integrations are not required.
- Known limitations are documented.

## Verification method

- Manual walkthrough of classroom pilot.
- Playwright test for the most important classroom pilot flow.
- Code review of project storage and involved pages.
- Documentation in CURRENT_STATE.md, roadmap and known limitations.
- External feedback from at least one person with limited prior knowledge.

## QA and technical competencies

- requirement understanding
- acceptance criteria
- exploratory testing
- risk-based testing
- frontend flow testing
- localStorage risk analysis
- data modeling
- Playwright
- documentation
- product validation

## Competency evidence

- documented classroom pilot scenario
- manual test checklist
- Playwright coverage for the main flow
- documented product validation
- README section describing the scenario
- known limitations
- interview story: from unclear student project to manageable project

## Possible AI contribution

AI may help propose setup questions, test cases, edge cases, empty state copy, acceptance criteria and product validation questions.

## Human verification of AI result

Human review must check that AI suggestions fit the product core, do not add unnecessary multi-user scope, do not assume unverified data models and cover real user risks.

## Status

V1 Must.

## Explicitly not in scope

- shared editing from multiple devices
- real-time collaboration
- login
- role-based permissions
- full school platform
- advanced PDF export
- external integrations
- AI-controlled project setup in V1

---

# Scenario 2 – Project lead overview

## User problem

A project lead, test lead or responsible student needs to quickly understand how the project is doing and what requires attention.

Project information may exist in tasks, risks, decisions, members and test cases, but without interpretation the user still has to manually figure out:

- what is blocked
- what lacks an owner
- which risks are serious
- which decisions are open
- which test cases are failed, blocked or not run
- why the app shows a certain health status
- what should be done next

## Desired result

The user should be able to see:

- Project Health
- Attention Needed
- Recommended Next Step
- visible reasons behind the assessment
- which data triggered each rule
- status report with project interpretation
- QA summary when test cases exist

## Main product and quality risks

| Risk | Consequence |
|---|---|
| Project Health feels like a black box. | The user does not trust the assessment. |
| Recommended Next Step lacks visible reason. | The recommendation feels random. |
| Attention Needed becomes too long or unprioritized. | The user still does not know what matters most. |
| Rules are hardcoded without testable structure. | The logic becomes hard to maintain. |
| Failed test cases make the whole project At risk too easily. | Risk-based testing is reduced to a simple counter. |
| Missing relations weaken the analysis. | Project state can become misleading. |
| Deleting a member with references may break ownership data. | Reports and Attention Needed may become incorrect. |

## Functions that must be verified

| Area | Status | Verification need |
|---|---|---|
| Project Health | Needs investigation | Verify actual rules in projectInsights.ts. |
| Project Health Score | Needs investigation | Verify if it exists and how it is calculated. |
| Attention Needed | Needs investigation | Verify which data triggers attention. |
| Recommended Next Step | Needs investigation | Verify trigger priority and wording. |
| Health reasons | Needs investigation | Verify whether the user can understand why status is shown. |
| Tasks without owner | Needs investigation | Verify current handling. |
| Blocked tasks | Needs investigation | Verify task status values and insight logic. |
| High risks | Needs investigation | Verify whether high risk uses probability, impact or both. |
| Open decisions | Needs investigation | Verify attention and recommendation behavior. |
| Test case status | Partly exists | Verify current model and UI. |
| QA summary | Missing or needs investigation | Planned next step, but not yet verified as existing. |
| Status Report | Needs investigation | Verify how insights are displayed. |
| Markdown export | Needs investigation | Verify whether insight logic appears in export. |

## Rule documentation required

For Project Health, Attention Needed and Recommended Next Step, the final V1 documentation must state:

- which rule applies
- which data triggers it
- what explanation the user sees
- how the rule is verified

## Identified gaps

- Full rule map for projectInsights.ts.
- Documented triggers for Project Health.
- Documented priority order for Recommended Next Step.
- QA summary in Status Report.
- QA summary in Markdown export.
- Risk-based QA influence on Attention Needed and later Project Health.
- Unit tests for rule logic.
- Competency evidence for rule-based QA logic.

## Acceptance criteria

- The user can see Project Health for the active project.
- The user can understand why the status is shown.
- Attention Needed shows concrete objects or conditions requiring action.
- Recommended Next Step gives a clear recommendation with understandable reason.
- QA status is summarized without automatically making the project At risk unless a documented risk rule says so.
- Critical rules are described in documentation.
- Critical rules are verified with a suitable test level.
- Empty projects and missing active project states are handled clearly.

## Verification method

- Code review of projectInsights.ts and related views.
- Manual scenarios with blocked tasks, open decisions, high risks and test cases.
- Playwright verification of visible user behavior.
- Future unit tests for pure rule logic.
- Rule map documentation with trigger, explanation and verification method.

## QA and technical competencies

- risk-based testing
- test strategy
- rule-based domain logic
- prioritization
- edge cases
- negative testing
- Playwright
- future Vitest
- quality communication
- technical decision explanation

## Competency evidence

- documented rule map
- tests for Project Health and Recommended Next Step
- QA summary in Status Report
- case study about project state interpretation
- documented reasoning for why a failed test case does not automatically mean At risk
- test strategy discussion: Playwright versus unit tests

## Possible AI contribution

AI may suggest edge cases, test scenarios, alternative rule priorities, clearer explanations and risks in the current rule order.

## Human verification of AI result

Human review must check that AI rules match the product philosophy, do not overstate risk, do not assume unverified data, and can be tested and explained.

## Status

V1 Must.

## Explicitly not in scope

- predictive risk model
- advanced AI-generated project analysis
- automatic decisions
- real-time notifications
- large dashboard redesign
- automatic At risk for every failed test case
- AI changing Project Health without evaluated rule model

---

# Scenario 3 – Quality traceability

## User problem

Risks, tasks and tests often exist separately. Without traceability, it is hard to understand:

- which risk a test helps control
- which task is affected
- why a test is important
- what was expected
- what actually happened
- how the test result should be communicated
- whether quality is visible enough for decisions

## Desired result

The user should be able to demonstrate the chain:

risk -> task -> test case -> test result -> status report

The report should communicate:

- risk
- linked task
- linked test case
- expected result
- actual result or result note, if included in V1
- test status
- QA summary
- Markdown or copyable report format

## Main product and quality risks

| Risk | Consequence |
|---|---|
| Traceability becomes too complex for V1. | The user does not understand the flow. |
| Test cases become a separate register. | QA no longer strengthens project clarity. |
| Risk-to-task relation is missing or not used. | The full traceability chain cannot be demonstrated. |
| Task-to-test-case relation is missing or not used. | QA summary becomes disconnected. |
| Actual result or result note is missing. | Test results may be hard to communicate. |
| Deleting a task may leave broken relations. | Reports can show incorrect links. |
| LocalStorage has no backup before schema changes. | User data may be lost. |
| QA summary becomes only a counter. | It does not demonstrate risk-based testing. |

## Functions that must be verified

| Area | Status | Verification need |
|---|---|---|
| Risk model | Needs investigation | Verify probability, impact, status, owner and task relation. |
| Task model | Needs investigation | Verify status, owner, priority and relations. |
| Test case model | Needs investigation | Verify expected result, actual result/result note, status, task relation and owner. |
| Risk to task | Needs investigation | Verify relation in code, UI and report. |
| Task to test case | Partly exists or needs investigation | Verify relatedTaskId and usage. |
| Test status | Partly exists or needs investigation | Verify current type and UI. |
| Expected result | Partly exists or needs investigation | Verify current type and UI. |
| Actual result/result note | Missing or needs investigation | Verify before deciding gap. |
| QA summary | Missing | Planned but not yet verified as existing. |
| Status Report | Needs investigation | Verify whether QA and traceability can be shown. |
| Markdown export | Needs investigation | Verify whether QA can be included clearly. |
| Delete and references | Needs investigation | Verify behavior for task and member deletion. |

## Identified gaps

- Complete risk -> task -> test case -> result -> report chain.
- Actual result or result note.
- Responsible tester or member on test case.
- QA summary in Status Report.
- QA summary in Markdown export.
- Documented traceability rule.
- Playwright test for QA traceability.
- Unit test for QA summary.
- Delete rules for object relations.
- Backup/export before migration.

## Acceptance criteria

- The user can create or identify a risk.
- The user can link the risk to a task if the model supports it after verification.
- The user can create a test case linked to a task.
- The user can enter expected result.
- The user can enter actual result or result note if this is included in V1 after verification.
- The user can set test status.
- Status Report shows QA summary.
- Markdown or copyable report format includes QA summary.
- The chain can be demonstrated without manual workaround.
- Limitations are documented if the full chain is not complete in V1.

## Verification method

- Code review of Project, Risk, Task and TestCase models.
- Code review of risk-to-task and task-to-test-case relations.
- Manual test: create risk, task, test case and status report.
- Playwright test for task-linked test case and report.
- Future unit test for QA summary calculation.
- Regression against existing risk, decision, Project Map and Status Report flows.
- Documentation of supported and unsupported traceability.

## QA and technical competencies

- traceability
- risk-based testing
- test design
- test results
- reporting
- data modeling
- object relations
- referential integrity
- localStorage risks
- migration strategy
- Playwright
- future Vitest
- documented test strategy

## Competency evidence

- demonstrable risk -> task -> test case -> report chain
- QA summary in Status Report
- QA summary in Markdown export
- Playwright test for test case flow
- documented rule for how QA affects Attention Needed
- case study about traceability and risk-based testing
- documented V1 limitations

## Possible AI contribution

AI may suggest test cases from risks, missing edge cases, QA summary format, test data combinations and traceability tests.

## Human verification of AI result

Human review must check that AI-suggested test cases cover real risks, are not too generic, do not invent relations that do not exist, and do not exaggerate project risk.

## Status

V1 Must.

## Explicitly not in scope

- full requirements management
- advanced test management
- regression suites
- bug tracker
- test run history
- automatic AI assessment of test results
- external test database
- advanced report formats
- PDF export
- external integrations
- full referential integrity for all objects unless required for the V1 demo

---

## Overall V1 boundary

Project Compass V1 should be strong enough to demonstrate product clarity, project state interpretation and quality traceability.

V1 does not need to become a complete project management, test management or collaboration platform.

The goal is not maximum feature count.

The goal is a coherent, testable and demonstrable product that shows quality thinking.
