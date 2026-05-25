# Test Strategy – Project Compass

## Purpose

The purpose of testing in Project Compass is to make sure that the application is understandable, stable and useful for a first-time user.

Testing should focus on whether the user can move from an idea to a structured project without confusion.

## Scope for version 0.1

Testing will focus on:

- landing page
- project interview
- project map
- task board
- risks
- decisions
- status report
- local storage

## Test levels

### Manual testing

Manual testing will be used to check:

- user flow
- layout
- wording
- form behavior
- navigation
- overall usability

### Automated end-to-end testing

Playwright will be used later to test the most important user flows.

Examples:

- user can open the app
- user can create a project
- user can complete the project interview
- user can see a generated project map
- user can create a task
- user can create a risk
- user can create a decision

### Unit testing

Vitest may be used later for smaller logic functions, for example:

- generating a project map from interview answers
- calculating simple project status
- filtering tasks by status

## Test priorities

High priority:

- create project
- complete project interview
- view project map
- save data locally
- create task
- create risk
- create decision

Medium priority:

- generate status report
- edit existing items
- delete items

Low priority:

- visual polish
- animations
- advanced filters
- export functions

## Definition of tested

A feature is considered tested when:

- acceptance criteria are reviewed
- the main happy path is tested
- at least one negative or edge case is tested
- obvious usability issues are noted
- bugs are documented

## Bug reporting

Bugs should include:

- title
- environment
- steps to reproduce
- expected result
- actual result
- severity
- screenshot if useful

## Regression testing

Before each important commit or release, the following should be checked:

- the app starts without errors
- the landing page loads
- existing navigation still works
- project data is not lost unexpectedly
- core user flows still work

## First regression suite

The first regression suite should include:

1. Open landing page
2. Create new project
3. Complete project interview
4. View generated project map
5. Create task
6. Create risk
7. Create decision
8. Reload page and verify saved data
9. Generate status report

## Test environment

Initial testing will be done locally on:

- Windows 11
- Edge or Chrome
- localhost:3000
- VS Code
- Node.js
- Next.js
---

## Automated regression testing

Project Compass uses Playwright for end-to-end testing.

The purpose of the automated tests is to verify that the most important user flows continue to work after changes in the application.

Current automated tests:

- `tests/landing-page.spec.ts`
- `tests/main-flow.spec.ts`

### Landing page test

The landing page test verifies that the start page loads correctly and that the main navigation options are visible.

This test is currently run across:

- Chromium
- Firefox
- WebKit

### Main user flow test

The main user flow test verifies the core MVP journey:

1. Open the landing page
2. Create a new project
3. Fill in the project interview
4. Generate the project map
5. Create a task on the project board
6. Create a risk in the risk register
7. Create a decision in the decision log
8. Open the status report
9. Verify that project data is displayed

This test has been verified successfully in Chromium.

The test is currently treated as a Chromium smoke/end-to-end test because the full flow is longer and more sensitive to browser-specific timing differences, especially around form handling and localStorage updates.

Cross-browser stability for the full main flow will be improved in a later step.

### Current test approach

The current test approach is:

- Manual regression testing for the full MVP
- Automated landing page regression across Chromium, Firefox and WebKit
- Automated main user flow testing in Chromium
- Further cross-browser hardening planned for future iterations

### Commands

Run all Playwright tests:

`npx playwright test`

Run the landing page test:

`npx playwright test tests/landing-page.spec.ts`

Run the main flow test in Chromium:

`npx playwright test tests/main-flow.spec.ts --project=chromium`

Show the latest Playwright HTML report:

`npx playwright show-report`