# Manual Test Run – Project Compass

## Test run information

Project: Project Compass  
Version: 0.1 MVP  
Tester: Johan Larsson  
Test type: Manual regression test  
Environment: Windows 11, Edge/Chrome, localhost  
Date: 2026-05-25  

## Purpose

The purpose of this manual test run is to verify that the main MVP flow works from start to finish.

The test focuses on:

- navigation
- project creation
- project map
- task board
- risk register
- decision log
- status report
- localStorage persistence
- basic usability

## Scope

Included in this test run:

- Landing page
- Project interview
- Project map
- Project board
- Risk view
- Decision view
- Status report
- Navigation between pages
- Data persistence after page reload

Not included in this test run:

- User accounts
- Database
- Team collaboration
- Mobile-specific testing
- Accessibility testing
- Security testing
- Automated tests

---

# Test cases

## TC-001 – Open landing page

### Preconditions

The development server is running.

Command: `npm run dev`

### Steps

1. Open `http://localhost:3000`
2. Verify that the landing page is displayed.

### Expected result

The page displays:

- Project Compass
- Från idé till strukturerat projekt
- Skapa nytt projekt
- Öppna projektkarta
- Öppna arbetsyta
- Statusrapport

### Actual result

The landing page displayed correctly. All expected text and navigation buttons were visible.

### Status

Pass

### Notes

---

## TC-002 – Navigate to project interview

### Preconditions

The landing page is open.

### Steps

1. Click `Skapa nytt projekt`.

### Expected result

The user is taken to `/new-project`.

The project interview form is displayed.

### Actual result

The user was taken to `/new-project`. The project interview form was displayed correctly.

### Status

Pass

### Notes

---

## TC-003 – Create project from interview

### Preconditions

The project interview page is open.

### Test data

Project name: `Regressionstest MVP`

Purpose: `Kontrollera att huvudflödet fungerar.`

Goal: `Säkerställa att projektdata visas korrekt.`

Deliverables: `Projektkarta, arbetsyta, risk, beslut och rapport.`

Risks: `Navigation eller localStorage kan fallera.`

Decisions: `Om flödet är redo för automatiserade tester.`

### Steps

1. Fill in all test data.
2. Click `Skapa projektkarta`.

### Expected result

The user is taken to `/project-map`.

The project map displays the entered project data.

### Actual result

The user was taken to `/project-map`. The project map displayed the entered project data correctly.

### Status

Pass

### Notes

---

## TC-004 – Verify project map navigation

### Preconditions

The project map is open.

### Steps

1. Click `Startsida`.
2. Return to `/project-map`.
3. Click `Gå till arbetsyta`.
4. Return to `/project-map`.
5. Click `Riskvy`.
6. Return to `/project-map`.
7. Click `Beslutsvy`.
8. Return to `/project-map`.
9. Click `Statusrapport`.
10. Return to `/project-map`.
11. Click `Redigera intervju`.

### Expected result

Each button navigates to the correct page:

| Button | Expected page |
|---|---|
| Startsida | `/` |
| Gå till arbetsyta | `/project-board` |
| Riskvy | `/project-risks` |
| Beslutsvy | `/project-decisions` |
| Statusrapport | `/project-report` |
| Redigera intervju | `/new-project` |

No page should show 404 or a blank screen.

### Actual result

All navigation buttons worked correctly. No 404 page or blank screen was shown.

### Status

Pass

### Notes

---

## TC-005 – Create task on project board

### Preconditions

The project board is open.

### Test data

Title: `Skriva testfall`

Description: `Skapa första manuella regressionstestsviten.`

Status: `Planerat`

### Steps

1. Open `/project-board`.
2. Enter the test data.
3. Click `Lägg till uppgift`.

### Expected result

The task appears in the `Planerat` column.

The column counter for `Planerat` increases.

### Actual result

The task was created and displayed in the `Planerat` column. The column counter updated correctly.

### Status

Pass

### Notes

---

## TC-006 – Move task between columns

### Preconditions

A task exists on the project board.

### Steps

1. Locate the created task.
2. Change status to `Pågår`.
3. Verify that the task moves to the `Pågår` column.
4. Change status to `Klart`.
5. Verify that the task moves to the `Klart` column.

### Expected result

The task moves to the selected column each time.

The column counters update correctly.

### Actual result

The task moved to the selected columns correctly. The column counters updated as expected.

### Status

Pass

### Notes

---

## TC-007 – Verify task persistence after reload

### Preconditions

A task exists on the project board.

### Steps

1. Reload the page.
2. Verify that the task is still displayed.

### Expected result

The task remains after page reload.

### Actual result

The task remained visible after page reload.

### Status

Pass

### Notes

---

## TC-008 – Create risk

### Preconditions

The risk view is open.

### Test data

Title: `Data försvinner vid omladdning`

Owner: `Johan`

Description: `Om localStorage inte fungerar tappar användaren sitt projekt.`

Probability: `Medel`

Impact: `Hög`

Action: `Testa omladdning efter varje större funktion.`

Status: `Öppen`

### Steps

1. Open `/project-risks`.
2. Fill in the risk form.
3. Click `Lägg till risk`.

### Expected result

The risk appears in the risk register.

The risk displays:

- title
- description
- probability
- impact
- owner
- status
- action

### Actual result

The risk was created and displayed in the risk register. All expected risk information was visible.

### Status

Pass

### Notes

---

## TC-009 – Verify risk persistence after reload

### Preconditions

A risk exists in the risk register.

### Steps

1. Reload the risk view.
2. Verify that the risk is still displayed.

### Expected result

The risk remains after page reload.

### Actual result

The risk remained visible after page reload.

### Status

Pass

### Notes

---

## TC-010 – Create decision

### Preconditions

The decision view is open.

### Test data

Title: `Automatisera huvudflödet`

Owner: `Johan`

Description: `Beslut om att skapa Playwright-test för huvudflödet.`

Deadline: Choose any future date.

Status: `Öppet`

Consequence: `Påverkar nästa utvecklingssteg och QA-portfolion.`

### Steps

1. Open `/project-decisions`.
2. Fill in the decision form.
3. Click `Lägg till beslut`.

### Expected result

The decision appears in the decision log.

The decision displays:

- title
- description
- owner
- deadline
- status
- consequence

### Actual result

The decision was created and displayed in the decision log. All expected decision information was visible.

### Status

Pass

### Notes

---

## TC-011 – Verify decision persistence after reload

### Preconditions

A decision exists in the decision log.

### Steps

1. Reload the decision view.
2. Verify that the decision is still displayed.

### Expected result

The decision remains after page reload.

### Actual result

The decision remained visible after page reload.

### Status

Pass

### Notes

---

## TC-012 – Verify status report

### Preconditions

At least one task, one risk and one decision have been created.

### Steps

1. Open `/project-report`.
2. Verify that the report displays project information.
3. Verify that task metrics are displayed.
4. Verify that risk metrics are displayed.
5. Verify that decision metrics are displayed.
6. Verify that open risks, open decisions and blocked tasks are listed if they exist.

### Expected result

The report displays:

- project name
- overall status
- number of tasks
- number of done tasks
- number of blocked tasks
- number of open risks
- number of high risks
- number of open decisions
- project purpose
- project goal
- next recommended steps

### Actual result

The status report displayed project information, task metrics, risk metrics, decision metrics and recommended next steps correctly.

### Status

Pass

### Notes

---

## TC-013 – Verify home navigation from main pages

### Preconditions

A project exists.

### Steps

1. Open `/project-map`.
2. Click `Startsida`.
3. Verify that `/` opens.
4. Repeat from:
   - `/project-board`
   - `/project-risks`
   - `/project-decisions`
   - `/project-report`

### Expected result

The user can return to the landing page from every main project page.

### Actual result

The user could return to the landing page from every tested main project page.

### Status

Pass

### Notes

---

## TC-014 – Verify edit interview navigation

### Preconditions

A project exists.

### Steps

1. Open `/project-map`.
2. Click `Redigera intervju`.
3. Verify that `/new-project` opens.
4. Repeat from:
   - `/project-board`
   - `/project-risks`
   - `/project-decisions`
   - `/project-report`

### Expected result

The user can navigate to the project interview from every relevant project page.

### Actual result

The user could navigate to the project interview from every relevant project page.

### Status

Pass

### Notes

---

# Bugs found during exploratory testing

## BUG-001 – Missing navigation to project board from landing page

### Type

Navigation / usability

### Description

The landing page did not have a clear button to navigate to the project board.

### Expected result

The user should be able to open the project board from the UI.

### Actual result

The user had to manually enter `/project-board` in the browser address bar.

### Status

Fixed

### Fix

Added `Öppna arbetsyta` button to the landing page.

### Verification

Verified during manual regression testing.

---

## BUG-002 – Missing home navigation from project pages

### Type

Navigation / usability

### Description

Project pages did not have a clear way back to the landing page.

### Expected result

The user should be able to return to `/` from all main project pages.

### Actual result

Some project pages lacked a `Startsida` button.

### Status

Fixed

### Fix

Added `Startsida` navigation to project pages.

### Verification

Verified during manual regression testing.

---

## BUG-003 – Missing edit interview navigation from risk view

### Type

Navigation / consistency

### Description

The risk view did not have a `Redigera intervju` button.

### Expected result

The risk view should have the same relevant navigation options as the other project pages.

### Actual result

The user could not navigate directly from the risk view to `/new-project`.

### Status

Fixed

### Fix

Added `Redigera intervju` button to the risk view.

### Verification

Verified during manual regression testing.

---

# Test summary

## Result

Passed

## Summary

The full manual regression suite was executed successfully.

All main MVP flows passed:

- landing page
- project interview
- project map
- task board
- task movement between columns
- localStorage persistence for tasks
- risk register
- localStorage persistence for risks
- decision log
- localStorage persistence for decisions
- status report
- navigation back to landing page
- navigation to edit interview

No blocking defects were found during this regression run.

## Recommendation

The MVP is stable enough to move on to automated regression testing with Playwright.

The first automated test should cover the main user journey:

Landing page → project interview → project map → project board → risk view → decision view → status report.