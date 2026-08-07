# Data Unification – Steg 2: Versioned State Boundary Design

**Datum:** 7 augusti 2026
**Status:** Implementerad och verifierad

## Syfte

Skapa en minimal, central, versionsmedveten och testbar state-gräns för `project-compass-state` utan att ta bort legacy-data eller införa bred migrering.

## Implementerad versionsmodell

- `schemaVersion` ingår nu i `ProjectCompassState`.
- Aktuell version definieras centralt som `PROJECT_COMPASS_STATE_VERSION`.
- Aktuell första version är `1`.
- Versionslös state behandlas som legacy state, inte som aktuell state.
- Okänd version behandlas som `unsupported-version`.
- Okänd eller trasig state får inte tyst skrivas över med tom eller ny state.

## Central read boundary

Den centrala läsgränsen består av:

- `parseProjectCompassState(savedState)`
- `readProjectCompassState()`
- `loadProjectCompassState()`

`parseProjectCompassState()` klassificerar lagrad data som:

- `missing` – ingen lagrad state finns,
- `valid` – aktuell version och accepterad grundstruktur,
- `legacy` – versionslös state som kan läsas kontrollerat,
- `invalid` – trasig JSON eller ogiltig struktur,
- `unsupported-version` – `schemaVersion` finns men stöds inte.

Läsresultatet innehåller:

- `status`,
- användbar `state` när sådan finns,
- `normalized`,
- `diagnostics`.

`readProjectCompassState()` är den centrala localStorage-läsningen och delegerar tolkningen till `parseProjectCompassState()`.

`loadProjectCompassState()` fungerar som kompatibilitetsadapter för befintliga routes. Den använder nu den centrala read boundaryn i stället för egen JSON-parsning och egen normaliseringslogik.

## Normalisering

Tillåten normalisering i minnet:

- saknade `tasks` → `[]`,
- saknade `risks` → `[]`,
- saknade `decisions` → `[]`,
- saknade `testCases` → `[]`,
- saknade `members` → `[]`.

Detta gäller både aktuell version och läsbar versionslös legacy-state.

Normalisering får inte:

- ändra betydelsen av enumvärden,
- reparera brutna relationer automatiskt,
- radera projekt,
- skriva tillbaka till localStorage automatiskt.

Normalisering markeras med `normalized: true` och diagnostisk information när sådan genereras.

## activeProjectId

För aktuell version gäller:

Om `activeProjectId` är en sträng men inte pekar på ett existerande projekt:

- returneras state med `activeProjectId: null`,
- detta markeras diagnostiskt som normalisering,
- rå lagrad data skrivs inte över.

Ingen bred relationsreparation har införts.

## Skrivgräns och skydd mot dataförlust

`saveProjectCompassState()` skriver ett `ProjectCompassState`, vilket innehåller aktuell `schemaVersion`.

Före skrivning kontrolleras befintlig `project-compass-state` med samma parser.

Skrivning blockeras om befintlig state klassificeras som:

- `invalid`,
- `unsupported-version`.

Det innebär att trasig JSON eller data från en okänd framtida schemaVersion inte skrivs över av ett tomt eller nybildat state efter en misslyckad läsning.

Blockeringen görs synlig via `console.warn`.

Skrivning tillåts när befintlig state är:

- `missing`,
- `valid`,
- `legacy`.

Ingen automatisk legacy-migrering till localStorage genomförs vid läsning.

## Legacy-princip

Versionslös state får läsas som `legacy` endast när grundstrukturen innehåller en `projects`-array.

Legacy-state:

- får normaliseras i minnet,
- får användas av befintliga appflöden,
- får inte automatiskt skrivas tillbaka enbart på grund av läsning,
- behålls kompatibel med befintliga versionslösa Playwright-fixtures.

## Teststöd

Vitest har införts för små, snabba enhetstester av state boundaryn.

Konfiguration:

- `npm run test:unit`
- `vitest.config.mjs`
- endast `src/**/*.test.ts` och `src/**/*.test.tsx` inkluderas

Detta förhindrar att Vitest försöker köra Playwright-specifikationerna.

## Verifierat beteende

Enhetstester verifierar bland annat:

- tom state innehåller aktuell `schemaVersion`,
- saknad lagrad state,
- trasig JSON,
- versionslös legacy-state,
- okänd schemaVersion,
- giltig aktuell version,
- normalisering av saknade projektsamlingar,
- ogiltig `activeProjectId`,
- läsfel skriver inte över rådata,
- legacy-state normaliseras bakåtkompatibelt,
- save skriver state med aktuell schemaVersion,
- save skriver inte över trasig befintlig state,
- save skriver inte över okänd schemaVersion.

Aktuellt resultat:

- Vitest: 13/13 passerade
- `npm run build`: passerade
- Next.js genererade 13/13 statiska sidor

Relevanta Playwright-regressioner som passerat:

- `projects-overview.spec.ts`: 3/3
- `project-map-attention.spec.ts`: 1/1
- `status-report-markdown.spec.ts`: 1/1
- `recommended-next-step-traceability.spec.ts`: 2/2
- `task-responsibility.spec.ts`: 4/4
- `risk-responsibility.spec.ts`: 5/5
- `project-health-scenarios.spec.ts`: 3/3

Därefter kördes även hela Playwright-sviten i Chromium med en worker:

`npx playwright test --project=chromium --workers=1`

Resultat:

- 32/32 tester passerade
- total körtid cirka 1,8 minuter

## Kända kvarvarande risker

- Runtime-valideringen är medvetet begränsad och validerar inte varje fält eller enumvärde på djupet.
- Brutna `ownerId`, `relatedTaskId` och andra relationer repareras inte automatiskt.
- `loadProjectCompassState()` behåller en kompatibilitetsfallback till tom state när läsresultatet saknar användbar state, men write boundaryn skyddar då befintlig `invalid` eller `unsupported-version` data från överskrivning.
- `npx tsc --noEmit` rapporterar tre redan existerande `implicit any`-fel i `tests/project-health-scenarios.spec.ts`. Inga nya TypeScript-fel från Data Unification steg 2 har identifierats.
- `npm install --save-dev vitest` rapporterade sex dependency-audit findings: en low och fem high. Ingen automatisk `npm audit fix` kördes eftersom sådan dependency churn ligger utanför detta uppdrag och kan innebära separat regressionsrisk.

## Utanför scope

- borttagning av legacy-nycklar,
- permanent migrering av Project Interview,
- task/risk/decision-migrering,
- full relationsreparation,
- bred route-refaktorering,
- QA-integration,
- Project Health-ändringar,
- backend eller fleranvändarstöd.
