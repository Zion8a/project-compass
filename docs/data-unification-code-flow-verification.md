# Data Unification – TypeScript Model and Data-Flow Verification

**Datum:** 6 augusti 2026
**Projekt:** Project Compass
**Uppdrag:** Data Unification – Steg 1
**Status:** Färdig för granskning

## 1. Syfte

Syftet med detta dokument är att verifiera om `docs/project-data-unification-plan.md` stämmer mot aktuell produktionskod innan någon implementation av Data Unification påbörjas.

Verifieringen bygger på faktisk kod, befintliga TypeScript-modeller, localStorage-användning, produktionsroutes och relevanta Playwright-tester.

Dokumentet skiljer mellan:

- verifierat nuläge,
- avvikelser eller preciseringar mot planen,
- identifierade datarisker,
- rekommendationer för nästa begränsade implementationsuppdrag.

## 2. Avgränsning

Detta uppdrag omfattar endast analys och dokumentation.

Följande har inte ändrats:

- produktionskod,
- TypeScript-modeller,
- localStorage-logik,
- migreringslogik,
- användargränssnitt,
- automatiserade tester.

Ingen ny migration har aktiverats och ingen legacy-data har tagits bort.

## 3. Granskade områden

Kodverifieringen omfattar:

- `ProjectCompassState`,
- `Project`,
- `ProjectMember`,
- `ProjectTask`,
- `ProjectRisk`,
- `ProjectDecision`,
- `ProjectTestCase`,
- Project Interview-/legacy-modellen,
- samtliga verifierade localStorage-nycklar,
- funktioner som läser och skriver huvudstate,
- alla produktionsroutes,
- AppHeader,
- Project Health,
- Attention Needed,
- Recommended Next Step,
- Status Report och Markdown-export,
- relevanta Playwright-tester.

## 4. Verifierad TypeScript-modell

De centrala lagrade modellerna är definierade i:

`src/lib/projectStorage.ts`

### 4.1 ProjectCompassState

Verifierad struktur:

~~~ts
type ProjectCompassState = {
  activeProjectId: string | null;
  projects: Project[];
};
~~~

Verifierade egenskaper:

- `activeProjectId` identifierar vilket projekt som är aktivt.
- `projects` innehåller samtliga projekt i installationen.
- Modellen saknar `schemaVersion`.
- Modellen innehåller ingen migrationsstatus.
- Modellen innehåller ingen backupinformation.
- Modellen innehåller ingen migrationsrapport.

### 4.2 Project

Verifierad struktur:

~~~ts
type Project = {
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
~~~

Verifierade projektstatusar:

- `not-started`
- `in-progress`
- `at-risk`
- `completed`

Aktuell `Project`-modell saknar separata verifierade fält för:

- `purpose`
- `goal`
- `deliverables`

Project Interview kan därför inte integreras genom enbart byte av localStorage-nyckel. Ett uttryckligt modellbeslut krävs innan dessa värden kan bli del av huvudmodellens källa till sanning.

### 4.3 ProjectMember

Verifierade fält:

- `id`
- `name`
- valfritt `role`
- valfritt `responsibility`
- valfri `comment`
- `createdAt`
- `updatedAt`

Medlemmar används som relationsmål för `ownerId` i tasks, risker och beslut.

### 4.4 ProjectTask

Verifierade fält:

- `id`
- `title`
- valfri `description`
- `status`
- valfri `priority`
- valfri `ownerId`
- `createdAt`
- `updatedAt`

Verifierade taskstatusar:

- `backlog`
- `planned`
- `in-progress`
- `blocked`
- `review`
- `done`

Verifierade priority-värden:

- `low`
- `medium`
- `high`

### 4.5 ProjectRisk

Verifierade fält:

- `id`
- `title`
- valfri `description`
- `probability`
- `impact`
- valfri `mitigation`
- valfri `action`
- valfri legacy-text `owner`
- valfri relation `ownerId`
- valfri relation `relatedTaskId`
- `status`
- `createdAt`
- `updatedAt`

Verifierade probability- och impact-värden:

- `low`
- `medium`
- `high`

Verifierade riskstatusar:

- `open`
- `watching`
- `handled`

Modellen innehåller både `owner` och `ownerId`, vilket innebär två parallella representationer av ansvar.

### 4.6 ProjectDecision

Verifierade fält:

- `id`
- `title`
- valfri `description`
- valfri legacy-text `owner`
- valfri relation `ownerId`
- valfri relation `relatedTaskId`
- valfri `deadline`
- valfri `consequence`
- `status`
- `createdAt`
- `updatedAt`

Verifierade beslutsstatusar:

- `open`
- `decided`
- `postponed`

Även beslut innehåller både `owner` och `ownerId`.

### 4.7 ProjectTestCase

Verifierade fält:

- `id`
- `title`
- valfri `description`
- valfritt `expectedResult`
- valfri relation `relatedTaskId`
- `status`
- `createdAt`
- `updatedAt`

Verifierade teststatusar:

- `not-run`
- `passed`
- `failed`
- `blocked`

Testfall finns i huvudmodellen men används inte i:

- Project Map,
- Attention Needed,
- Project Health,
- Recommended Next Step,
- Status Report,
- Markdown-export.

### 4.8 Project Interview-/legacy-modellen

`ProjectInterviewData` är lokalt definierad i sex separata sidor:

- `src/app/new-project/page.tsx`
- `src/app/project-board/page.tsx`
- `src/app/project-risks/page.tsx`
- `src/app/project-decisions/page.tsx`
- `src/app/project-map/page.tsx`
- `src/app/project-report/page.tsx`

Verifierad struktur:

~~~ts
type ProjectInterviewData = {
  projectName: string;
  purpose: string;
  goal: string;
  deliverables: string;
  risks: string;
  decisions: string;
};
~~~

Det finns ingen gemensam exporterad TypeScript-definition och ingen verifierad runtime-validering av den lagrade strukturen.

Det innebär risk för:

- typdrift mellan sidor,
- olika felhantering mellan konsumenter,
- att lagrad JSON inte motsvarar den förväntade typen,
- att en sida ändras utan att övriga konsumenter uppdateras.

## 5. Verifierade localStorage-nycklar

Följande nycklar finns i aktuell produktionskod:

- `project-compass-state`
- `project-compass-current-project`
- `project-compass-tasks`
- `project-compass-risks`
- `project-compass-decisions`

Det finns två parallella projektrepresentationer:

1. huvudmodellen i `project-compass-state`,
2. Project Interview-/legacy-modellen i `project-compass-current-project`.

Därutöver finns tre objektspecifika legacy-nycklar för tasks, risker och beslut.

## 6. Huvudmodellens lagringsfunktioner

### 6.1 createEmptyState

Skapar:

~~~ts
{
  activeProjectId: null,
  projects: []
}
~~~

Ingen `schemaVersion` skapas.

### 6.2 createProject

Skapar ett nytt projekt med:

- genererat id,
- namn,
- valfri description,
- status `not-started`,
- timestamps,
- tomma arrayer för tasks, risks, decisions, testCases och members.

### 6.3 loadProjectCompassState

Verifierat beteende:

- returnerar tom state på servern,
- returnerar tom state när nyckeln saknas,
- returnerar tom state när `projects` inte är en array,
- normaliserar saknade projektsamlingar till tomma arrayer,
- fångar JSON-fel och returnerar tom state.

Funktionen verifierar inte fullständigt:

- `schemaVersion`,
- obligatoriska projektfält,
- enumvärden,
- unika id,
- `ownerId`,
- `relatedTaskId`,
- att `activeProjectId` refererar till ett befintligt projekt.

Korrupt huvudstate kan därför behandlas som om användaren saknar data.

### 6.4 saveProjectCompassState

Skriver hela state som JSON till `project-compass-state`.

Verifierad begränsning:

- ingen återläsning,
- ingen eftervalidering,
- ingen backup,
- ingen transaktion,
- ingen särskild användaråterkoppling vid lagringsfel.

### 6.5 getActiveProject

Returnerar projektet som matchar `activeProjectId`.

Om id:t inte matchar något projekt returneras `null`, men den lagrade state-strukturen repareras inte.

### 6.6 setActiveProject, addProject och updateProject

- `setActiveProject` ignorerar ett okänt projekt-id.
- `addProject` lägger till projektet och gör det aktivt.
- Dubblettkontroll för projekt-id eller projektnamn är inte verifierad.
- `updateProject` uppdaterar matchande projekt.

## 7. Verifierad läs- och skrivmatris

| Konsument | Huvudstate | Interview/legacy | Separata legacy-nycklar | Huvudbeteende |
|---|---:|---:|---:|---|
| `/` | indirekt via AppHeader | nej | nej | statisk startsida och navigation |
| `/projects` | läser/skriver | skriver | nej | skapar, öppnar och aktiverar projekt |
| `/new-project` | nej | skriver | nej | sparar endast Interview-data |
| `/project-map` | läser | läser | nej | kombinerar båda projektmodellerna |
| `/project-members` | läser/skriver | nej | nej | hanterar medlemmar |
| `/project-board` | läser/skriver | läser som fallback | läser/migrerar tasks | hanterar tasks |
| `/project-risks` | läser/skriver | läser som fallback | läser/migrerar risker | hanterar risker |
| `/project-decisions` | läser/skriver | läser som fallback | läser/migrerar beslut | hanterar beslut |
| `/project-test-cases` | läser/skriver | nej | nej | hanterar testfall |
| `/project-report` | läser | läser | nej | kombinerar data och exporterar Markdown |
| `AppHeader` | läser | nej | nej | visar aktivt projekt |
| `projectInsights.ts` | tar emot Project | nej | nej | beräknar attention, health och nästa steg |

## 8. Verifierade användar- och dataflöden

### 8.1 Skapa projekt via My Projects

Flöde:

~~~text
/projects
→ createProject()
→ addProject()
→ project-compass-state
→ activeProjectId sätts
→ project-compass-current-project skrivs också
~~~

`/projects` skriver alltså inte bara huvudmodellen. Den skapar även legacy-kompatibel Interview-data.

Det sker när användaren:

- skapar ett vanligt projekt,
- skapar exempelprojektet,
- öppnar ett befintligt projekt.

Den parallella legacy-skrivningen är därför aktiv produktionslogik.

### 8.2 Skapa projektinformation via Project Interview

Flöde:

~~~text
/new-project
→ ProjectInterviewData
→ project-compass-current-project
→ /project-map
~~~

Verifierat:

- inget riktigt `Project` skapas,
- inget `activeProjectId` sätts,
- AppHeader kan visa `No active project`,
- Project Map och Status Report kan ändå visa Interview-data.

### 8.3 Project Map

Project Map kan kombinera:

- aktivt `Project` från huvudmodellen,
- `ProjectInterviewData` från legacy-nyckeln.

Källprioriteringen är inte helt enhetlig mellan alla fält.

Verifierade risker:

- information från två olika projekt kan blandas,
- Interview-data kan visas utan aktivt projekt,
- placeholders kan räknas som verklig projektinformation,
- Interview-fältet `risks` används inte som strukturerad riskdata,
- textbaserade och strukturerade beslut kan ge olika bilder,
- brutna `relatedTaskId` kan räknas som länkade trots att tasken saknas.

### 8.4 Status Report och Markdown-export

Rapporten kombinerar huvudmodell och Interview-data.

Verifierade risker:

- aktivt Project kan vara Projekt A medan Interview-data beskriver Projekt B,
- Interview-only-data kan ge en rapport utan aktivt projekt,
- saknad huvudmodell kan leda till fallbackvärden som ger `Stable` och 100 poäng,
- QA-data och testfall saknas i rapporten och exporten,
- brutna taskrelationer kan visas som okända,
- vissa statusöversättningar innehåller äldre eller alternativa värden.

### 8.5 AppHeader

AppHeader läser endast huvudmodellen.

Verifierat:

- ogiltigt eller saknat `activeProjectId` ger `No active project`,
- headern använder inte Interview-data,
- samma-route-ändringar i localStorage behöver inte omedelbart synas,
- headern kan motsäga Project Map och Status Report.

## 9. Befintlig sidbaserad legacy-migrering

### 9.1 Tasks

Workspace kan läsa `project-compass-tasks` och migrera data när:

- aktivt projekt finns,
- aktivt projekts task-array är tom,
- legacy-arrayen innehåller data.

Verifierade risker:

- ogiltiga objekt kan filtreras bort,
- `priority` förs inte över av mappern,
- hela legacy-nyckeln tas bort efter mappning,
- ingen backup skapas,
- ingen återläsning verifierar resultatet,
- ingen migrationsrapport skapas,
- ingen rollback finns.

Detta är ett konkret verifierat scenario för tyst dataförlust.

### 9.2 Risker

Riskvyn kan migrera `project-compass-risks`.

Verifierade risker:

- ogiltiga objekt kan filtreras bort,
- saknade värden kan ersättas med standardvärden,
- probability, impact eller status kan därmed ändra betydelse,
- `ownerId` och `relatedTaskId` valideras inte mot faktiska objekt,
- hela legacy-nyckeln tas bort efter mappning,
- backup och rollback saknas.

### 9.3 Beslut

Beslutsvyn kan migrera `project-compass-decisions`.

Verifierade risker:

- ogiltiga objekt kan filtreras bort,
- status kan standardiseras,
- deadline är fri text utan full verifiering,
- relationer valideras inte mot members eller tasks,
- hela legacy-nyckeln tas bort efter mappning,
- backup, efterkontroll och rollback saknas.

### 9.4 Samlad bedömning

Befintlig migreringslogik är:

- sidstyrd,
- villkorad av att målarrayen är tom,
- automatiskt dataförändrande,
- utan användarens förhandsgranskning,
- utan verifierad säkerhetsmekanism.

Detta avviker från Data Unification Planens beslutade säkerhetsprinciper.

## 10. Ansvar och relationsintegritet

Tasks använder `ownerId`.

Risker och beslut kan använda både:

- legacy-texten `owner`,
- relationen `ownerId`.

Verifierat:

- giltigt `ownerId` prioriteras i UI,
- ett icke-tomt `ownerId` kan i vissa beräkningar behandlas som tilldelat även om medlemmen saknas,
- ett icke-tomt `relatedTaskId` kan behandlas som länkat även om tasken saknas.

Det innebär att kodbasen skiljer otillräckligt mellan:

- saknad relation,
- giltig relation,
- bruten relation.

Detta påverkar:

- Attention Needed,
- Recommended Next Step,
- spårbarhetsräkning,
- Status Report,
- användarens uppfattning om ansvar och kopplingar.

## 11. Project Health, Attention Needed och Recommended Next Step

### 11.1 Attention Needed

Verifierade kategorier:

1. blockerade tasks,
2. tasks utan owner,
3. risker utan owner,
4. höga risker,
5. beslut utan owner,
6. öppna beslut.

Signalnivåer är `high` eller `medium`.

QA-resultat, setup-status, datakvalitet och brutna relationer ingår inte.

### 11.2 Project Health

Poängmodellen är kategoribaserad:

- high-signal: minus 15,
- medium-signal: minus 5.

Flera objekt i samma kategori ger ett gemensamt avdrag.

Verifierade statusutfall:

- `Stable`
- `Needs attention`
- `At risk`

Ett helt tomt projekt kan få `Stable` och 100 poäng eftersom frånvaro av registrerade problem behandlas som frånvaro av attention-signaler.

Det finns ingen separat status för otillräckligt underlag.

### 11.3 Recommended Next Step

Verifierad prioritering omfattar bland annat:

- blockerade tasks,
- olänkade höga risker,
- höga risker,
- olänkade öppna beslut,
- öppna beslut,
- saknade owners,
- första task,
- medlemmar,
- checkpoint.

Länkning avgörs i huvudsak genom om `relatedTaskId` är tomt eller inte. Existensen av den relaterade tasken valideras inte alltid.

## 12. QA-modulen

Verifierat:

- Test Cases-sidan använder endast huvudmodellen.
- Testfall kan skapas.
- Teststatusarna motsvarar TypeScript-modellen.
- Testfall kan kopplas till en task vid skapande.
- Ett brutet `relatedTaskId` kan visas som om testfallet saknar länk.
- Edit, delete, statusuppdatering efter skapande, testhistorik och tester/owner är inte verifierat implementerade.

QA-data används inte i:

- Project Map,
- Attention Needed,
- Project Health,
- Recommended Next Step,
- Status Report,
- Markdown-export,
- My Projects sammanfattning.

Data Unification måste bevara `testCases` och deras relationer, men full QA-integration ligger utanför detta uppdrag.

## 13. Verifierad Playwright-täckning

Testinventeringen omfattar 13 testfiler.

Riktad kodgranskning verifierade skydd för:

- projektskapande och persistence,
- projektnamnsvalidering,
- Project Map med Interview-data,
- Status Report med Interview-data,
- kombinerad huvudmodell och Interview-data i Markdown-export,
- Attention Needed,
- Project Health-scenarier,
- Recommended Next Step för olänkade risker och beslut,
- medlemsskapande,
- taskansvar,
- riskansvar,
- beslutsansvar,
- tomlägen och vissa valideringsfall.

### 13.1 Viktiga verifierade testluckor

Följande saknar tydligt verifierat automatiserat skydd:

- säker migration av legacy-tasks,
- bevarande av task priority,
- säker migration av legacy-risker,
- säker migration av legacy-beslut,
- backup,
- rollback,
- korrupt huvudstate,
- korrupt legacy-data,
- okänd framtida `schemaVersion`,
- ogiltigt `activeProjectId`,
- brutet `ownerId`,
- brutet `relatedTaskId`,
- Project Interview genom verkligt formulär till riktigt Project,
- konflikter mellan aktivt projekt och Interview-data,
- QA-modulens fulla E2E-flöde,
- lagringsfel från localStorage.

### 13.2 Test-fixtures följer inte alltid aktuell modell

Verifierade exempel:

- saknat `testCases`,
- extra historiska fält som `purpose`, `desiredOutcome`, `goals` och `deliverables`,
- ogiltig taskstatus `todo`,
- beslut med äldre fält som `context` och `decision`.

Tester passerar eftersom laddningslagret och beräkningsfunktionerna endast använder delar av objekten.

Detta visar att runtime-lagret tolererar modellavvikande JSON och att test-fixtures bör typas striktare i framtida uppdrag.

### 13.3 Tidigare testresultat

Data Unification Plan och AI Review-loggen anger att 32 Playwright-tester tidigare passerade.

Den siffran har inte återverifierats genom full testkörning i detta kodverifieringsuppdrag och ska därför behandlas som tidigare dokumenterad evidens, inte som ett nytt testresultat.

## 14. Jämförelse mot Data Unification Plan

### 14.1 Bekräftat

Följande delar av planen bekräftas av aktuell kod:

- två parallella projektrepresentationer finns,
- totalt fem localStorage-nycklar används,
- `project-compass-state` är den mest sammanhållna huvudmodellen,
- Project Interview skapar inte ett riktigt Project,
- Project Map och Status Report kombinerar datakällor,
- AppHeader använder endast huvudmodellen,
- `schemaVersion` saknas,
- korrupt huvudstate kan behandlas som tom state,
- `activeProjectId` valideras inte fullständigt,
- QA-data måste bevaras,
- stegvis migrering är lämpligare än direkt sammanslagning,
- adapterlager kan vara rimligt tillfälligt,
- legacy-data ska inte tas bort före verifiering,
- backup, validering, återläsning och rollback behövs.

### 14.2 Behöver preciseras

Planen behöver kompletteras med följande verifierade nulägesdetaljer:

1. `/projects` skriver aktivt till `project-compass-current-project` vid skapande, exempelprojekt och öppning av projekt.
2. Sidbaserad migrering är redan aktiv i Workspace, Risks och Decisions.
3. Befintlig migrering kan radera legacy-nycklar utan backup eller återläsningskontroll.
4. Taskmigreringen tappar fältet `priority`.
5. Risk- och beslutsmigrering kan ersätta saknade värden med standardvärden.
6. `ProjectInterviewData` är duplicerad i sex sidor.
7. `Project` saknar separata fält för `purpose`, `goal` och `deliverables`.
8. Placeholdervärden från `/projects` kan uppfattas som verklig information.
9. Brutna relationer skiljs inte konsekvent från giltiga relationer.
10. Befintliga Playwright-tester skyddar delar av dubbelmodellens beteende.

### 14.3 Avvikelser mot planens säkerhetsprinciper

| Planens princip | Aktuell kod |
|---|---|
| Explicit `schemaVersion` | saknas |
| Korrupt data skiljs från tom data | uppfylls inte för huvudstate |
| Backup före transformering | saknas |
| Säker målprojektsidentifiering | begränsad till aktivt projekt |
| Dubblettkontroll | saknas |
| Full runtime-validering | saknas |
| Referensvalidering | ofullständig |
| Före-/efterräkning | saknas |
| Återläsning efter skrivning | saknas |
| Migrationsrapport | saknas |
| Rollback | saknas |
| Legacy-data behålls till verifiering | uppfylls inte i sidmigreringarna |
| Ingen tyst dataförlust | kan inte garanteras |

## 15. Riskbedömning

### Hög risk

#### Tyst dataförlust i sidmigrering

Legacy-objekt kan filtreras, förändras eller tappa fält innan hela legacy-nyckeln tas bort.

#### Korrupt huvudstate behandlas som tom installation

Användaren kan få intrycket att ingen data finns, trots att rådata finns kvar men inte kan tolkas.

#### Blandning av två projekt

Project Map och Status Report kan kombinera aktivt projekt med Interview-data utan gemensamt id.

#### Ingen backup eller rollback

Nuvarande migrering kan inte återställas genom en verifierad produktionsmekanism.

### Medelhög risk

#### Brutna relationer räknas som giltiga

Icke-tomma id-strängar kan undgå attention- eller traceability-signaler.

#### Placeholderdata behandlas som verklig data

Setup-checklist och projektbeskrivning kan visa högre grad av klarhet än användaren faktiskt har skapat.

#### Dubbla ansvarsfält

`owner` och `ownerId` kan innehålla motstridiga värden.

#### Duplicerad Interview-typ

Sex lokala TypeScript-kopior kan glida isär.

### Lägre men relevant risk

#### Test-fixtures är inte strikt typade

Automatiserade tester kan passera med data som inte följer aktuell modell.

#### QA-data är isolerad

Data bevaras i huvudmodellen men används inte i appens centrala status- och rapportflöden.

## 16. Slutsats

Data Unification Plan stämmer i huvudsak mot aktuell kod.

Den rekommenderade målbilden bör behållas:

- `project-compass-state` som framtida källa till sanning,
- stegvis migrering,
- ett begränsat tillfälligt adapterlager,
- legacy-data kvar tills verifiering,
- ingen tyst dataförlust,
- backup, validering, återläsning och rollback före pensionering av nycklar.

Kodverifieringen visar samtidigt att nuläget är mer riskfyllt än en enkel beskrivning av två modeller:

- parallell legacy-skrivning är aktiv,
- sidbaserad migrering är redan aktiv,
- legacy-nycklar kan tas bort utan säker verifiering,
- ett konkret modellfält kan tappas,
- relationer valideras inte fullständigt,
- huvudmodellen saknar Interview-fälten,
- tester skyddar delar av dubbelmodellens nuvarande beteende.

Ingen bred implementation bör därför starta direkt.

## 17. Rekommenderat nästa begränsade uppdrag

Nästa uppdrag bör vara:

**Data Unification – Steg 2: Versioned State Boundary and Safe Read Model**

Målet bör vara att skapa en säker gräns runt huvudstate utan att ännu migrera eller ta bort legacy-data.

Rekommenderat scope:

1. fatta modellbeslut om `purpose`, `goal` och `deliverables`,
2. införa central aktuell `schemaVersion`,
3. separera rå läsning, JSON-tolkning och validering,
4. skilja tom, giltig, äldre, korrupt och okänd framtida state,
5. definiera valideringsresultat:
   - godkänd,
   - godkänd med varningar,
   - blockerad,
6. validera `activeProjectId`,
7. validera unika projekt-id,
8. validera tillåtna enumvärden,
9. validera `ownerId` och `relatedTaskId`,
10. skapa enhetstester för säkra read-only-dataset,
11. inte aktivera legacy-migrering i det nya lagret,
12. inte ta bort några nycklar.

Befintliga sidmigreringar bör därefter hanteras som ett separat, uttryckligt deluppdrag. De får inte utökas innan backup- och rollbackstrategin är implementerad och testad.

## 18. Beslutsrekommendation till styrgruppen

Styrgruppen rekommenderas besluta att:

- kodverifieringen godkänns,
- Data Unification Planens målarkitektur står fast,
- verifierade preciseringar förs in i det fortsatta arbetet,
- ingen legacy-nyckel får tas bort i nästa steg,
- ingen automatisk bred migrering får aktiveras,
- nästa uppdrag avgränsas till versionerad och validerad state-läsning,
- modellbeslut för syfte, mål och leveranser fattas före Project Interview-integrationen,
- befintliga sidmigreringar behandlas som en blockerande kvalitetsrisk som ska ersättas stegvis,
- QA-data ska bevaras men full QA-integration hålls utanför Data Unification-scope.

## 19. Verifieringsbegränsningar

Denna rapport bygger på:

- statisk läsning av aktuell kod,
- inventering av produktionsroutes,
- inventering och riktad läsning av Playwright-tester,
- jämförelse med `docs/project-data-unification-plan.md`,
- jämförelse med `docs/ai-review-log.md`.

Följande har inte genomförts i detta uppdrag:

- full Playwright-körning,
- `npm run build`,
- manuell migrering mot verklig användardata,
- simulering av localStorage-fel,
- implementation av validerare,
- implementation av backup eller rollback.

Dessa begränsningar påverkar inte de statiskt verifierade kodfynden men innebär att rapporten inte är ett testresultat för en ny implementation.
