# AI Review Log

## AI Review #001 – Project Compass V1 Quality and Competency Map

**Startdatum:** 4 augusti 2026
**Avslutad:** 5 augusti 2026
**Projekt:** Project Compass
**AI-modell:** ChatGPT, GPT-5.6 Thinking
**Status:** Avslutad

### Uppgift

Använda AI som stöd för att formulera Project Compass Version 1:s centrala användarscenarier, kvalitetsrisker, kompetensmål, verifieringsmetoder och avgränsning inför en möjlig klassrumspilot.

AI:s uppgift var att bidra till ett strukturerat beslutsunderlag. AI skulle inte fastställa aktuell produktstatus, testresultat, datamodell eller arkitektur utan verifiering mot faktisk kod, dokument och testresultat.

### Verifierad kontext vid arbetets start

- Repositoryt var rent och uppdaterat.
- Node 24 användes genom `.nvmrc`.
- `npm ci` passerade.
- `npm run build` passerade.
- GitHub Actions körde grönt.
- Den initiala Playwright-baslinjen passerade med 2 tester.
- `CURRENT_STATE.md` var skapat och pushat.
- Klasskamrater hade uttryckt intresse för att prova Project Compass i skolans projektarbete.

### Kontext som delades med AI

- Roadmap mot AI-Native Quality Engineer 2028.
- Projektets arbetssätt och WIP-principer.
- Den verifierade tekniska baslinjen.
- Målet att göra Project Compass pilotbart utan att bygga full fleranvändararkitektur för tidigt.
- Behov av projektmedlemmar, roller, ansvar, lagring, backup och kvalitetsspårbarhet.
- Principen att skilja mellan verifierat, delvis implementerat, saknas och behöver undersökas.
- Kravet att AI-förslag ska granskas av en människa innan de behandlas som beslut eller projektdata.

### Vad AI bidrog med

- Förslag på tre centrala användarscenarier.
- Identifiering av användar-, produkt-, data- och kvalitetsrisker.
- Förslag på kompetenser som arbetet kan utveckla.
- Förslag på verifierbar kompetensevidens.
- Möjliga AI-bidrag i respektive scenario.
- Avgränsning mellan V1 Must, pilotexperiment och senare.
- Förslag på vad som uttryckligen inte ska ingå i V1.
- Underlag till Project Compass V1 Quality and Competency Map.

### Mänsklig granskning

AI:s förslag behandlades inte som verifierade fakta om aktuell kod eller produktstatus.

Följande kontrollerades särskilt:

- om användarscenarierna löser verkliga behov,
- om riskerna är relevanta och inte påhittade,
- om målbild och befintlig funktion hålls isär,
- om testorakel och acceptanskriterier är rimliga,
- om scope ryms inom roadmapen och beslutad veckokapacitet,
- om AI föreslår onödig backend, autentisering, RAG eller agentarkitektur,
- om AI antar datafält eller relationer som ännu inte har verifierats,
- om föreslagna AI-funktioner är human-in-the-loop och hålls separata från verifierad projektdata.

### Accepterat

- Tre centrala V1-scenarier:
  1. Klassrumspiloten.
  2. Projektledarens överblick.
  3. Quality traceability: risk → task → testfall → resultat → rapport.
- Project Compass ska skapa och tolka projektklarhet, inte bara lagra projektdata.
- Klassrumspiloten ska vara avgränsad och får inte kräva full fleranvändararkitektur.
- V1-kartan ska utgå från verkliga användarproblem, kvalitetsrisker och verifierbar evidens.
- AI-resultat ska behandlas som förslag och granskas av en människa.
- Befintlig kod, datamodell och lagring ska verifieras före större implementation.
- Project Health, Attention Needed och Recommended Next Step ska kunna förklaras genom tydliga regler och data.
- Quality traceability är ett centralt kompetens- och portfoliobevis för Project Compass.

### Ändrat

- Klassrumspiloten förtydligades som lokal användning i en bestämd webbläsare, gemensamt under ett möte eller av en projektansvarig.
- Delad redigering från flera enheter skiljdes från den första pilotens mål.
- Export delades upp i:
  - statusrapport i Markdown eller kopierbart format,
  - export/import för backup och återställning,
  - avancerad PDF-export och externa integrationer som senare funktioner.
- Påståenden om befintliga funktioner ändrades till målbild och verifieringsbehov.
- Datarisker, persondata, borttagning och kvarvarande referenser lades till.
- Krav på schemaVersion, migrering, backup, återställning och hantering av korrupt data lades till.
- Project Health och rekommendationer kompletterades med krav på tydliga testorakel.
- Antaganden om `actual result`, risk–task-relation och andra datafält markerades som sådant som behövde verifieras mot aktuell kod.
- De tre användarscenarierna utvecklades till en styrande Quality and Competency Map i stället för att behandlas som en beskrivning av en redan färdig produkt.

### Avvisat

- Antagandet att delad fleranvändarredigering redan behövs.
- Full backend, autentisering, rollbaserade behörigheter och realtidssamarbete i V1.
- Att varje klasskamrat måste kunna redigera samma projekt från flera enheter i den första piloten.
- Att AI automatiskt ska fastställa Project Health, testresultat, beslut eller verifierad projektstatus.
- Antaganden om att `actual result`, risk–task-relation och andra datafält redan fanns utan kodverifiering.
- Automatisk behandling av AI-förslag som fakta eller verifierad projektdata.
- Avancerad AI-genererad projektanalys, prediktiv riskmodell, RAG eller agentarkitektur i V1.
- Att börja implementera nya funktioner innan datamodell, lagring och befintliga flöden var verifierade.

### Hur resultatet verifierades

Arbetet verifierades genom:

- Git-status och synkronisering mot `origin/master`.
- Kontroll av Node-version och projektkonfiguration.
- `npm ci`.
- produktionsbuild med `npm run build`.
- GitHub Actions.
- initial Playwright-baslinje med 2 passerade tester.
- senare Sprint 0-verifiering med 32 passerade Playwright-tester.
- `CURRENT_STATE.md`.
- `docs/project-compass-v1-quality-and-competency-map.md`.
- `docs/sprint-0-architecture-and-test-findings.md`.
- granskning av aktuell arkitektur, lagring, datamodeller och relationer.
- kritisk mänsklig granskning av AI:s föreslagna scenarier, risker och avgränsningar.
- tydlig uppdelning mellan verifierat, sannolikt, antagande och behöver undersökas.

De 32 passerade Playwright-testerna behandlades som evidens för befintliga automatiserade flöden, men inte som bevis på fullständig V1-täckning eller pilotberedskap.

### Slutlig verifiering och beslut

Den efterföljande arkitektur- och testgranskningen verifierade att flera av AI-granskningens viktigaste reservationer var relevanta:

- två parallella projektmodeller används:
  - `project-compass-state`,
  - `project-compass-current-project`,
- Project Interview-/legacy-spåret är inte fullt integrerat med huvudmodellen,
- QA-modulen finns i datamodellen och användargränssnittet men är endast delvis integrerad i Status Report, Project Map, Project Health och Playwright-tester,
- risk → task och decision → task finns delvis, men kopplingarna är inte fullständigt verifierade genom tydliga E2E-flöden,
- localStorage fungerar i verifierade happy-path-flöden men saknar verifierad robusthet för:
  - `schemaVersion`,
  - migrering,
  - backup och återställning,
  - korrupt JSON,
  - saknade eller okända värden,
  - skydd mot tyst dataförlust.

Project Compass V1 Quality and Competency Map godkänns som styrande målbild, men inte som bevis på att samtliga flöden redan är implementerade eller tillräckligt testade.

Nästa beslutade uppdrag är att skapa:

`docs/project-data-unification-plan.md`

Planen ska jämföra möjliga lösningar och motivera val av framtida källa till sanning, migreringsstrategi, återställningsväg och teststrategi innan datamodellen eller lagringskoden ändras.

### Risk för falskt eller missvisande resultat

- AI kan anta att funktioner redan finns.
- AI kan formulera en önskad målbild som om den beskrev verifierat nuläge.
- AI kan föreslå överbyggd arkitektur.
- AI kan skapa testfall med felaktiga förväntade resultat.
- AI kan anta datafält, relationer eller användarflöden som inte stöds av aktuell kod.
- AI kan blanda framtida mål med verifierad produktstatus.
- AI kan föreslå AI-funktioner utan verifierat användarvärde.
- Ett välformulerat AI-svar kan låta mer säkert än underlaget medger.
- Antalet passerade tester kan misstolkas som ett bevis på full testtäckning.

### Kvarvarande antaganden och risker

- Exakt hur klasskamraterna kommer att använda Project Compass i en verklig pilot behöver fortfarande undersökas genom faktisk användarfeedback.
- Behovet av delad redigering från flera enheter är ännu inte verifierat.
- Vilken av de nuvarande projektmodellerna som ska vara framtida källa till sanning ska beslutas i Data Unification Plan.
- Hur äldre localStorage-data ska migreras utan dataförlust är ännu inte beslutat.
- Hur Project Interview ska skapa eller uppdatera ett riktigt projekt behöver definieras.
- QA-modulens slutliga integration med Project Map, Project Health och Status Report behöver planeras och verifieras.
- AI Review-funktionens användarvärde är ännu inte verifierat.
- Project Compass är ännu inte verifierat redo för klassrumspilot.

### Informationssäkerhet

Ingen hemlighet, autentiseringsuppgift, känslig persondata eller intern skolinformation delades med AI-tjänsten.

Endast nödvändig produkt-, kod-, test- och dokumentationskontext användes.

AI-förslag behandlades som hypoteser tills de hade granskats mot aktuell kod, tester, dokument eller uttryckliga produktbeslut.

---

## AI Review #002 – Project Compass Data Unification Plan

**Startdatum:** 5 augusti 2026
**Avslutad:** 5 augusti 2026
**Projekt:** Project Compass
**AI-modell:** ChatGPT, GPT-5.6 Sol – Balanced
**Status:** Avslutad

### Uppgift

Använda AI som stöd för att ta fram `docs/project-data-unification-plan.md`.

Planen skulle jämföra möjliga vägar för Project Compass datamodell, lagring och migrering innan kod ändras. AI skulle bidra med struktur, alternativjämförelse, riskanalys, teststrategi och rekommenderad arbetsordning, men fick inte behandla en viss lösning som redan beslutad.

### Verifierad kontext vid arbetets start

- `docs/sprint-0-architecture-and-test-findings.md` var skapat, committat och godkänt som avslutat Sprint 0-uppdrag.
- 32 Playwright-tester passerade.
- `git status` var clean när uppdraget startade.
- `master` var synkroniserad med `origin/master`.
- Två localStorage-spår var verifierade:
  - `project-compass-state`
  - `project-compass-current-project`
- Project Interview-/legacy-flödet var inte fullt integrerat med huvudmodellen.
- QA-modulen fanns i datamodellen och användargränssnittet men var inte integrerad i Status Report, Project Map eller Project Health och saknade verifierat Playwright-skydd.

### Kontext som delades med AI

- Styrgruppsbeslutet för Data Unification Plan.
- Aktuell Sprint 0-dokumentation.
- Verifierad kodstruktur och localStorage-användning.
- Verifierade Playwright-flöden och identifierade testgap.
- Kravet att inga kodändringar skulle göras under planeringsuppdraget.
- Kravet att alternativen skulle jämföras innan en målmodell rekommenderades.
- Kraven på `schemaVersion`, migrering, backup, validering, rollback och skydd mot tyst dataförlust.

### Vad AI bidrog med

- Formulering av beslutsproblemet.
- Kartläggning av berörda data och användarflöden.
- Jämförelse av fyra arkitekturalternativ.
- Analys av fördelar, nackdelar, datarisker, komplexitet och testbarhet.
- Förslag på målmodell med tydlig motivering.
- Förslag på migrerings- och återställningsstrategi.
- Förslag på hur Project Interview ska integreras.
- Förslag på konkret teststrategi.
- Förslag på stegvis och säker implementationsordning.
- Tydliggörande av antaganden och sådant som inte ingår i scope.

### Mänsklig granskning

AI:s förslag granskades mot:

- aktuell kod,
- verifierade localStorage-flöden,
- Sprint 0-dokumentationen,
- befintliga Playwright-tester,
- Project Compass roadmap,
- risk för dataförlust,
- risk för överbyggd arkitektur,
- projektets portfolio- och QA-mål.

Förslagen behandlades inte som verifierade fakta förrän de hade jämförts med dokumenterade kod- och testfynd.

### Accepterat

- `project-compass-state` ska vara framtida källa till sanning.
- Alternativ C valdes som målstrategi:
  - migrera stegvis till huvudmodellen,
  - integrera Project Interview med riktiga projekt,
  - pensionera legacy-spåret först efter verifiering.
- Ett begränsat adapter- eller översättningslager kan användas tillfälligt under övergången.
- `schemaVersion` ska införas.
- Rå backup ska skapas före transformering.
- Migrerad state ska valideras före och efter skrivning.
- Korrupt och okänd data får inte behandlas som tom data.
- Rollback ska finnas och verifieras innan legacy-data tas bort.
- Project Interview ska bli ett guidat användarflöde mot ett identifierat `Project`-objekt.
- Risker och beslut från Project Interview ska granskas av användaren innan de skapas som strukturerade objekt.
- Teststrategin ska omfatta enhets-, integrations-, Playwright- och manuella tester.
- Befintliga testfall och QA-relationer ska bevaras genom migreringen.
- Implementation ska ske i små, testbara, reversibla och separata commits.

### Ändrat

- En direkt sammanslagning av modellerna ersattes med en stegvis migrationsstrategi.
- Adapterlagret avgränsades till en tillfällig övergångsmekanism och inte permanent arkitektur.
- Automatisk mappning av textbaserade risker och beslut ersattes med utkast och mänsklig bekräftelse.
- Migreringsstrategin kompletterades med:
  - rå backup,
  - migrationsrapport,
  - dubblettkontroll,
  - validering,
  - återläsning efter skrivning,
  - rollback,
  - stoppregler.
- Project Interview delades upp i:
  - skapa nytt projekt,
  - uppdatera befintligt projekt.
- Teststrategin kompletterades med datadrivna migrationsdataset, negativa fall och exit-kriterier.
- Implementationsordningen delades upp i 17 avgränsade steg.

### Avvisat

- Att behålla två permanenta projektmodeller.
- Att ta bort legacy-nycklar i samma ändring som den första migreringen.
- Att automatiskt slå samman projekt enbart på liknande projektnamn.
- Att tyst ersätta korrupt data med tom state.
- Att hitta på saknade värden som owner, probability, impact, status eller relationer.
- Att genomföra en stor refaktorering i ett enda steg.
- Backend, autentisering, realtidssamarbete och fleranvändararkitektur inom detta uppdrag.
- Ny AI-funktionalitet, RAG eller agentarkitektur.
- Full QA-modul, full CRUD och större visuell redesign.

### Hur resultatet verifierades

Resultatet verifierades genom:

- granskning mot `docs/sprint-0-architecture-and-test-findings.md`,
- jämförelse med verifierade localStorage-nycklar och användarflöden,
- jämförelse med de 32 passerade Playwright-testerna,
- kontroll av att verifierat nuläge hölls isär från rekommendation och framtida implementation,
- kontroll av att samtliga fyra alternativ jämfördes,
- kontroll av att rekommendationen var motiverad,
- kontroll av migreringsstrategi, backup, validering och rollback,
- kontroll av Project Interview-mappning och dubbletthantering,
- kontroll av teststrategi och implementationsordning,
- kontroll av Definition of Done,
- kontroll av uttryckligt out-of-scope,
- fullständig dokumentgranskning av `docs/project-data-unification-plan.md`,
- `git diff --check`.

### Slutligt beslut

`docs/project-data-unification-plan.md` godkänns som styrande plan för nästa implementationsfas.

Beslutad riktning:

- `project-compass-state` blir framtida källa till sanning,
- `schemaVersion` införs,
- migrering sker stegvis,
- backup och rollback byggs före borttagning av legacy-data,
- Project Interview integreras med riktiga projekt,
- legacy-läsning och legacy-nycklar pensioneras först efter full verifiering.

Inga kodändringar genomfördes under planeringsuppdraget.

### Risk för falskt eller missvisande resultat

- AI kan anta att `project-compass-state` redan är beslutad källa till sanning.
- AI kan föreslå migration utan tillräcklig backup eller rollback.
- AI kan underskatta risken för tyst dataförlust.
- AI kan föreslå en för stor refaktorering.
- AI kan blanda planering med implementation.
- AI kan anta datafält eller relationer som inte stöds av aktuell kod.
- AI kan missa okända, saknade eller korrupta värden i äldre lagrad data.
- AI kan föreslå tester utan tydliga testorakel.

### Kvarvarande risker och antaganden

- Exakta TypeScript-fält ska verifieras igen före implementation.
- Exakt versionsnummer för `schemaVersion` är ännu inte beslutat.
- Exakt backupnyckel och migrationsrapportformat är ännu inte beslutat.
- Hur textbaserade risker och beslut representeras som utkast behöver verifieras mot datamodellen.
- Hur länge legacy-data ska behållas efter lyckad migrering behöver beslutas.
- Den verkliga implementationen kan upptäcka ytterligare beroenden som kräver att planen uppdateras.
- Project Compass är ännu inte verifierat redo för klassrumspilot.

### Informationssäkerhet

Ingen hemlighet, autentiseringsuppgift, känslig persondata eller intern skolinformation delades med AI-tjänsten.

Endast nödvändig produkt-, kod-, test- och dokumentationskontext användes.

AI-förslag behandlades som hypoteser tills de hade granskats mot aktuell kod, tester, dokument eller uttryckliga produktbeslut.

### Status

Avslutad.

Resultatet är dokumenterat i:

- `docs/project-data-unification-plan.md`
- `docs/ai-review-log.md`

---

## AI Review #003 – TypeScript Model and Data-Flow Verification

**Startdatum:** 6 augusti 2026
**Avslutad:** Ej avslutad
**Projekt:** Project Compass
**AI-modell:** ChatGPT, GPT-5.6 Thinking
**Status:** Pågående

### Uppgift

Använda AI som stöd för att verifiera om `docs/project-data-unification-plan.md` stämmer mot aktuell produktionskod innan någon implementation påbörjas.

Uppdraget omfattar verifiering av:

- TypeScript-modeller,
- localStorage-nycklar,
- läs- och skrivflöden,
- Project Interview-/legacy-flödet,
- befintlig migreringslogik,
- centrala produktionskonsumenter,
- relevanta Playwright-tester,
- avvikelser och preciseringar mot Data Unification Plan.

AI fick inte behandla tidigare dokumentation som tillräcklig evidens utan kontroll mot faktisk kod.

### Verifierad kontext vid arbetets start

- Data Unification Plan var godkänd som avslutat planeringsuppdrag.
- Styrgruppen hade beslutat att `project-compass-state` är rekommenderad framtida källa till sanning.
- Migrering skulle ske stegvis.
- Ett tillfälligt adapterlager fick användas under övergången.
- Legacy-data skulle behållas tills migreringen var verifierad.
- Ingen tyst dataförlust accepterades.
- Ingen större kodändring fick göras innan planen hade kontrollerats mot faktisk kod.
- Repositoryt var rent när dokumentationsarbetet startade.
- Ingen produktionskod ändrades under verifieringen.

### Vad AI bidrog med

- Strukturerad inventering av TypeScript-modeller.
- Kartläggning av samtliga verifierade localStorage-nycklar.
- Kartläggning av vilka routes och komponenter som läser och skriver respektive datakälla.
- Identifiering av aktiv parallell legacy-skrivning från `/projects`.
- Identifiering av sidbaserad migrering i Workspace, Risks och Decisions.
- Identifiering av konkret risk för tyst dataförlust i taskmigreringen.
- Analys av `owner`, `ownerId` och `relatedTaskId`.
- Analys av Project Health, Attention Needed och Recommended Next Step.
- Analys av QA-modulens faktiska integration.
- Riktad granskning av relevanta Playwright-tester och testluckor.
- Jämförelse mellan faktisk kod och Data Unification Plan.
- Förslag på avgränsat nästa uppdrag.
- Underlag till `docs/data-unification-code-flow-verification.md`.

### Mänsklig granskning

AI:s slutsatser granskades stegvis mot:

- `src/lib/projectStorage.ts`,
- `src/lib/projectInsights.ts`,
- `src/lib/exampleProject.ts`,
- samtliga produktionsroutes i `src/app`,
- `src/components/AppHeader.tsx`,
- verifierade localStorage-anrop,
- relevanta Playwright-tester,
- `docs/project-data-unification-plan.md`,
- `docs/ai-review-log.md`.

Varje större slutsats klassificerades som:

- verifierat i faktisk kod,
- verifierad testlucka,
- arkitekturrisk,
- rekommendation för nästa uppdrag.

Tidigare dokumenterade uppgifter behandlades inte som ny evidens utan uttrycklig återverifiering.

### Accepterat

- `project-compass-state` är fortsatt rätt framtida källa till sanning.
- Data Unification Planens rekommenderade målarkitektur står fast.
- Project Interview ska integreras med ett riktigt `Project` och inte vara en permanent separat projektmodell.
- Legacy-data får inte tas bort före backup, validering, återläsning och verifierad rollback.
- Ett tillfälligt adapterlager kan användas, men får inte bli permanent dubbelskrivning.
- `schemaVersion` och en säker state-gräns behövs före bred migration.
- `activeProjectId`, enumvärden, projekt-id, `ownerId` och `relatedTaskId` behöver runtime-valideras.
- Befintliga sidmigreringar innebär en verifierad kvalitetsrisk.
- QA-data i `testCases` måste bevaras genom migreringen.
- Befintliga tester som skyddar dubbelmodellen måste ersättas stegvis med tester för det enhetliga flödet.
- Nästa arbete ska vara litet, testbart och utan borttagning av legacy-nycklar.

### Ändrat

- Beskrivningen av nuläget preciserades från två parallella projektmodeller till:
  - två projektrepresentationer,
  - totalt fem localStorage-nycklar,
  - tre redan aktiva sidbaserade legacy-migreringar.
- Legacy-spåret preciserades som aktivt underhållet även från `/projects`, inte enbart som gammal Interview-data.
- Migreringsrisken preciserades med ett konkret verifierat exempel där taskfältet `priority` inte förs över.
- Relationsproblemet preciserades från saknade länkar till både saknade och brutna `ownerId`- och `relatedTaskId`-referenser.
- QA-modulens integration preciserades till att `testCases` finns i huvudmodellen men inte används i Project Map, Project Health, Attention Needed, Recommended Next Step, Status Report eller Markdown-export.
- Tidigare uppgiften om 32 passerade Playwright-tester markerades som tidigare dokumenterad evidens, inte återverifierat resultat i detta uppdrag.
- Nästa uppdrag avgränsades till versionerad och validerad state-läsning före bred migration.

### Avvisat

- Att beskriva befintlig sidmigrering som säker eller verifierad.
- Att behandla `project-compass-current-project` som passiv legacy-data.
- Att anta att ett icke-tomt `ownerId` eller `relatedTaskId` automatiskt är en giltig relation.
- Att beskriva ett tomt projekt med `Stable` och 100 poäng som bevis på god projektstatus.
- Att starta en bred migrering direkt efter kodverifieringen.
- Att ta bort eller skriva över legacy-nycklar i nästa steg.
- Att integrera full QA-funktionalitet inom Data Unification-scope.
- Att införa backend, autentisering, fleranvändarstöd eller större redesign i detta arbete.

### Hur resultatet verifierades

Resultatet verifierades genom:

- statisk granskning av aktuell produktionskod,
- inventering av exporterade TypeScript-modeller och funktioner,
- inventering av lokala typer i routes och komponenter,
- inventering av samtliga produktionsroutes,
- sökning efter localStorage-nycklar och läs-/skrivanrop,
- granskning av huvudmodellens storage-funktioner,
- granskning av Project Interview-/legacy-flödet,
- granskning av Project Map och Status Report,
- granskning av Project Health, Attention Needed och Recommended Next Step,
- granskning av QA-modulen,
- riktad läsning av relevanta Playwright-tester,
- jämförelse med `docs/project-data-unification-plan.md`,
- dokumentation i `docs/data-unification-code-flow-verification.md`,
- kontroll av Markdown-struktur,
- `git diff --check`.

Ingen full Playwright-körning eller produktionsbuild genomfördes under den statiska kodverifieringen.

### Risk för falskt eller missvisande resultat

- AI kan missa kodvägar som inte fångas av söktermerna.
- AI kan tolka runtime-beteende fel utan faktisk exekvering.
- AI kan överskatta testtäckningen utifrån testfilernas innehåll.
- AI kan formulera en arkitekturrisk mer definitivt än koden stödjer.
- Tidigare dokumenterade testresultat kan misstolkas som aktuellt verifierade.
- En omfattande rapport kan ge intryck av att implementationen redan är testad.
- Statisk kodgranskning kan inte verifiera faktisk befintlig användardata i localStorage.

### Kvarvarande risker och antaganden

- Full Playwright-svit har inte körts i detta uppdrag.
- `npm run build` har inte körts i detta uppdrag.
- Verklig äldre localStorage-data har inte migrerats eller simulerats.
- Exakt modell för `purpose`, `goal` och `deliverables` är inte beslutad.
- Exakt `schemaVersion` är inte beslutad.
- Exakt backupformat och rollbackformat är inte beslutat.
- Befintliga sidmigreringar är fortfarande aktiva i produktionskoden.
- Project Compass är inte genom detta dokument verifierat redo för klassrumspilot.

### Informationssäkerhet

Ingen hemlighet, autentiseringsuppgift, känslig persondata eller intern skolinformation delades med AI-tjänsten.

Endast nödvändig produkt-, kod-, test- och dokumentationskontext användes.

### Status

Pågående.

AI Review #003 kan avslutas när:

- verifieringsrapporten är slutgranskad,
- dokumentens Markdown-format är verifierat,
- beslutad kontrollnivå har genomförts,
- dokumentändringarna är committade och pushade,
- slutligt `git status` är clean.

## AI Review #004 – Versioned State Boundary and Safe Read Model

**Startdatum:** 7 augusti 2026
**Avslutad:** 7 augusti 2026
**Projekt:** Project Compass
**AI-modell:** ChatGPT, GPT-5.6 Sol
**Status:** Avslutad

### Uppgift

Använda AI som stöd för att implementera och verifiera Data Unification steg 2:

**Versioned State Boundary and Safe Read Model**

Målet var att skapa en minimal, central, versionsmedveten och testbar state-gräns för `project-compass-state` innan bred migrering eller borttagning av legacy-data.

Uppdraget omfattade:

- verifiering av aktuell `ProjectCompassState`,
- införande av central `schemaVersion`,
- central klassificering av lagrad state,
- säker hantering av missing, valid, legacy, invalid och unsupported version,
- kontrollerad normalisering,
- hantering av ogiltig `activeProjectId`,
- skydd mot tyst överskrivning av trasig eller okänd data,
- unit-teststöd,
- relevanta Playwright-regressioner,
- produktionsbuild,
- dokumentation av kvarvarande risker.

### AI:s bidrag

AI användes för att:

- bryta ned uppdraget i små testbara steg,
- föreslå en minimal versionsmodell,
- föreslå `PROJECT_COMPASS_STATE_VERSION = 1`,
- föreslå ett explicit read-resultat med status, state, normaliseringsflagga och diagnostik,
- identifiera behovet av en ren parserfunktion,
- föreslå `parseProjectCompassState()`,
- föreslå `readProjectCompassState()` som central localStorage-read boundary,
- behålla `loadProjectCompassState()` som kompatibilitetsadapter för befintliga routes,
- identifiera att versionslös state måste behandlas som legacy,
- identifiera behovet av bakåtkompatibel normalisering av projektsamlingar,
- identifiera risk med ogiltig `activeProjectId`,
- identifiera en sekundär dataförlustrisk där en misslyckad läsning senare kunde följas av en save som skrev över rådata,
- föreslå defensivt skydd även i `saveProjectCompassState()`,
- föreslå Vitest som liten unit-testnivå,
- avgränsa Vitest-konfigurationen så att Playwright-specifikationer inte körs som unit tests,
- föreslå relevanta unit tests och regressionskontroller,
- hjälpa till att dokumentera faktisk implementation, verifiering och kvarvarande risker.

### Hur AI-resultatet granskades

AI:s förslag accepterades inte som färdig lösning utan verifierades stegvis.

Arbetssättet var:

1. Inspektera faktisk kod.
2. Formulera ett begränsat beteende.
3. Skriva ett test före implementation när det var lämpligt.
4. Bekräfta att testet föll av förväntad anledning.
5. Implementera minsta nödvändiga förändring.
6. Köra testet igen.
7. Kontrollera TypeScript och produktionsbuild.
8. Köra relevanta Playwright-regressioner.
9. Jämföra resultatet med styrgruppens scope och säkerhetskrav.

När ett PowerShell-block inte matchade faktisk filstruktur avbröts ändringen i stället för att tvingas igenom.

En oavsiktligt skapad fil, `tatus --short`, identifierades genom `git status`, inspekterades innan borttagning och raderades först efter att innehållet verifierats som tidigare terminaloutput.

### Accepterat

- `schemaVersion` ska vara en del av `ProjectCompassState`.
- Aktuell version ska definieras centralt.
- Första aktuella versionen är `1`.
- Versionslös state ska behandlas som `legacy`.
- Okänd schemaVersion ska behandlas som `unsupported-version`.
- Trasig JSON ska behandlas som `invalid`.
- `parseProjectCompassState()` ska separera parsning och klassificering från localStorage-access.
- `readProjectCompassState()` ska vara central localStorage-read boundary.
- `loadProjectCompassState()` får fortsätta som kompatibilitetsadapter för att undvika bred route-refaktorering.
- Saknade `tasks`, `risks`, `decisions`, `testCases` och `members` får normaliseras till tomma arrayer i minnet.
- Samma bakåtkompatibla samlingsnormalisering ska gälla läsbar versionslös legacy-state.
- Ogiltig `activeProjectId` i aktuell state får normaliseras till `null`.
- Läsning får inte automatiskt skriva tillbaka normaliserad eller trasig data.
- Befintlig `invalid` eller `unsupported-version` data ska skyddas även mot senare normal save.
- `saveProjectCompassState()` ska blockera överskrivning av sådan rådata.
- Vitest ska användas för små unit tests av state boundaryn.
- Vitest ska endast inkludera `src/**/*.test.ts` och `src/**/*.test.tsx`.
- Legacy-nycklar ska behållas.
- Ingen bred migrering ska genomföras i detta steg.

### Ändrat under arbetets gång

- Den ursprungliga designen fokuserade främst på säker läsning. Under testningen identifierades att en kompatibilitetsfallback till tom state kunde följas av en senare save och därmed skapa indirekt dataförlust.
- Lösningen utökades därför med en defensiv write boundary som kontrollerar befintlig raw state före skrivning.
- Legacy-hanteringen utökades efter ett regressionstest som visade att den första implementationen inte normaliserade saknade projektsamlingar på samma sätt som den tidigare loadern.
- `loadProjectCompassState()` ändrades från egen JSON-parsning och egen normalisering till att använda den centrala read boundaryn.
- Unit-testkonfigurationen ändrades från Vitests standardupptäckt till explicit include-konfiguration efter att Vitest initialt försökte köra Playwright-filer.
- `vitest.config.ts` ersattes med `vitest.config.mjs` efter en ESM/CommonJS-varning.
- Ingen automatisk `npm audit fix` genomfördes trots dependency-audit findings, eftersom sådan dependency churn bedömdes ligga utanför uppdragets scope.

### Avvisat

- Att genomföra bred state-migrering i samma steg.
- Att ta bort legacy-nycklar.
- Att automatiskt skriva tillbaka versionslös legacy-state vid läsning.
- Att tyst ersätta trasig JSON med tom state i localStorage.
- Att skriva över data med okänd framtida schemaVersion.
- Att automatiskt reparera brutna `ownerId`- eller `relatedTaskId`-relationer.
- Att bygga full runtime-validering av varje nested fält och enum inom detta steg.
- Att refaktorera samtliga routes till ett nytt read-resultat.
- Att integrera QA-modulen, ändra Project Health, införa backend eller fleranvändarstöd.
- Att köra `npm audit fix` som en sidoändring utan separat riskbedömning.

### Hur resultatet verifierades

Unit tests kördes med:

`npm run test:unit`

Slutligt verifierat unit-testresultat:

- 13/13 tester passerade.

Tester täcker:

- current `schemaVersion` i tom state,
- missing stored state,
- malformed JSON,
- versionslös legacy-state,
- unknown schemaVersion,
- valid current-version state,
- normalisering av saknade projektsamlingar,
- ogiltig `activeProjectId`,
- att read failure inte skriver över raw data,
- legacy-normalisering,
- att save skriver state med aktuell schemaVersion,
- att malformed raw data inte skrivs över,
- att unsupported schemaVersion inte skrivs över.

TypeScript kontrollerades med:

`npx tsc --noEmit`

Resultat:

- inga nya TypeScript-fel från Data Unification steg 2,
- tre redan existerande `implicit any`-fel kvarstår i `tests/project-health-scenarios.spec.ts`.

Produktionsbuild kördes med:

`npm run build`

Resultat:

- compiled successfully,
- TypeScript i Next-build passerade,
- 13/13 statiska sidor genererades.

Relevanta Playwright-regressioner kördes:

- `projects-overview.spec.ts`: 3/3 passerade,
- `project-map-attention.spec.ts`: 1/1 passerade,
- `status-report-markdown.spec.ts`: 1/1 passerade,
- `recommended-next-step-traceability.spec.ts`: 2/2 passerade,
- `task-responsibility.spec.ts`: 4/4 passerade,
- `risk-responsibility.spec.ts`: 5/5 passerade,
- `project-health-scenarios.spec.ts`: 3/3 passerade.

Totalt i dessa riktade Playwright-körningar:

- 19/19 tester passerade.
Därefter kördes även hela Playwright-sviten i Chromium med en worker:

`npx playwright test --project=chromium --workers=1`

Resultat:

- 32/32 tester passerade,
- total körtid cirka 1,8 minuter.

### Risk för falskt eller missvisande resultat

- En grön unit-testsvit bevisar inte att varje möjlig historisk localStorage-struktur stöds.
- Parsern använder medvetet begränsad runtime-validering och kan acceptera nested data som senare visar sig semantiskt felaktig.
- TypeScript-casts kan skapa en falsk känsla av runtime-säkerhet om underliggande JSON inte motsvarar typen.
- En kompatibilitetsfallback till tom state kan göra att UI:t ser tomt ut trots att skyddad invalid eller unsupported raw data fortfarande finns kvar.
- `console.warn` gör fel synliga för utvecklare men är inte ett användargränssnitt för recovery.
- Test-fixtures representerar inte nödvändigtvis all verklig legacy-data som kan finnas i användares localStorage.

### Kvarvarande risker och antaganden

- Runtime-valideringen validerar inte varje nested required field eller enumvärde.
- Brutna `ownerId`, `relatedTaskId` och andra relationer repareras inte.
- Versionless legacy-state identifieras genom avsaknad av `schemaVersion` och förekomst av en `projects`-array.
- Full recovery-UX för invalid eller unsupported state finns inte.
- Tre redan existerande TypeScript `implicit any`-fel finns kvar i `tests/project-health-scenarios.spec.ts`.
- Dependency-audit rapporterade en low och fem high findings efter installation av Vitest.
- Ingen legacy-nyckel har tagits bort.
- Ingen permanent migration av Project Interview, tasks, risks eller decisions har genomförts.
- Verklig användardata från tidigare versioner har inte migrerats inom detta uppdrag.

### Informationssäkerhet

Ingen hemlighet, autentiseringsuppgift eller känslig produktionsdata behövde delas med AI.

Arbetet byggde på:

- lokal produktionskod,
- lokala testresultat,
- lokal dokumentation,
- terminaloutput,
- syntetiska test-fixtures.

Ingen verklig användares localStorage-data behövde exponeras.

### Kompetensevidens

Arbetet visar praktisk kompetens inom:

- TypeScript-modellering,
- versionshantering av klientstate,
- defensiv datahantering,
- riskbaserad testdesign,
- test-driven utveckling i små steg,
- unit testing med Vitest,
- Playwright-regressionstestning,
- bakåtkompatibilitet,
- dataförlustanalys,
- CI-/build-nära verifiering,
- teknisk dokumentation,
- AI-assisterad utveckling med mänsklig verifiering.

Detta stärker Project Compass som portfolio-case genom att visa kvalitetstänkande kring data, migration och regression – inte enbart funktionsutveckling.

### Status

Avslutad.

AI Review #004 avslutades efter att:

- design-/implementationsdokumentet är slutgranskat,
- AI Review #004 är slutgranskad,
- eventuell beslutad ytterligare verifiering är genomförd,
- `git diff --check` är godkänd,
- ändringarna är committade,
- ändringarna är pushade till GitHub,
- slutligt `git status` är clean.

## AI Review #005 – Safe Task Legacy Migration Current Flow Verification

**Startdatum:** 10 augusti 2026
**Projekt:** Project Compass
**AI-modell:** ChatGPT, GPT-5.6 Sol
**Status:** Pågående – verifiering slutförd, väntar på styrgruppens granskning

### Uppgift

Använda AI som stöd för att verifiera Data Unification steg 3, del 1:

**Safe Task Legacy Migration – Current Flow Verification**

Målet var att verifiera den befintliga migreringen från:

```text
project-compass-tasks
```

till det aktiva projektets:

```text
project-compass-state
```

innan någon produktionskod för backup, rollback eller ny migrationslogik ändras.

Uppdraget omfattade:

- exakt source-read,
- trigger och migrationsvillkor,
- historisk legacy Task-modell,
- aktuell `ProjectTask`-modell,
- faktisk transformation fält för fält,
- source-delete,
- samspel med `saveProjectCompassState()`,
- fel- och retry-beteende,
- befintligt Vitest- och Playwright-skydd,
- migrationsorakel,
- riskrangordning,
- ett minsta rekommenderat nästa tekniskt steg.

### AI:s bidrag

AI användes för att:

- avgränsa kod- och testsökningar till relevanta filer,
- rekonstruera legacy Task-modellen med Git-historik,
- jämföra historisk source-modell med aktuell target-modell,
- spåra kedjan från Workspace mount till source-delete,
- analysera transformationsregler fält för fält,
- identifiera destruktiva och irreversibla punkter,
- analysera fel- och retry-beteende,
- granska direkt och indirekt automatiserat testskydd,
- definiera ett migrationsorakel,
- rangordna verifierade risker,
- dokumentera skillnaden mellan verifierade fakta och antaganden,
- föreslå ett enda minsta nästa tekniskt steg utan att implementera det.

### Hur AI-resultatet granskades

AI:s slutsatser accepterades inte som facit.

Verifieringen byggde stegvis på:

1. aktuell produktionskod,
2. aktuell TypeScript-modell,
3. Git-historik,
4. historisk task-writer,
5. befintliga testfiler,
6. dokumenterade produktregler,
7. terminaloutput från direkta repository-sökningar.

Genererade `.next`-artefakter användes inte som auktoritativ källa.

Ingen produktionskod ändrades under verifieringen.

### Accepterat

Följande slutsatser accepterades efter kontroll mot faktisk kod:

- legacy tasks läses från `project-compass-tasks`,
- taskmigreringen körs i Workspace-sidans mount effect,
- ett aktivt projekt måste kunna lösas innan legacy tasks ens läses,
- migrering kräver att target-projektets `tasks` är tom och att minst en legacy task överlever transformationen,
- verifierad historisk legacy Task innehöll `id`, `title`, `description`, `status` och valfri `ownerId`,
- legacy-statusvärdena motsvarade dagens sex Workspace-statusvärden,
- `createdAt` och `updatedAt` skapas vid migrering eftersom de inte fanns i verifierad legacy-modell,
- `priority` finns i aktuell target-modell men har inte verifierats som del av den historiska produktgenererade legacy-källan,
- mappern rekonstruerar taskobjekt och ignorerar fält den inte uttryckligen emitterar,
- ogiltiga taskposter kan filtreras bort före target-write,
- hela `project-compass-tasks` tas bort efter save-anropet när migrationsblocket körs,
- `saveProjectCompassState()` returnerar `void`,
- ingen target read-back sker före source-delete,
- det finns ingen backup eller rollback i befintlig taskmigrering,
- det finns inget direkt Vitest- eller Playwright-test för legacy-taskmigreringen.

### Ändrat eller korrigerat efter verifiering

Två tidigare slutsatser behövde preciseras.

#### `priority`

Tidigare dokumentation beskrev utebliven `priority`-mappning som ett konkret dataförlustscenario.

Git-historiken visade att den verifierade legacy Task-typen precis före migreringen inte innehöll `priority`.

Korrigerad slutsats:

- mappern emitterar inte `priority`,
- icke-kanonisk legacy-data med `priority` skulle tappa värdet,
- men faktisk förlust av ett produktgenererat legacy-`priority` är inte verifierad.

#### Blockerad save följd av source-delete

En tidig analys utgick från att en redan `invalid` eller `unsupported-version` target normalt kunde nå save/delete-blocket.

Fördjupad kontroll visade att:

- `loadProjectCompassState()` då ger en tom fallback-state,
- inget aktivt projekt kan lösas,
- Workspace returnerar före taskmigreringen.

Korrigerad slutsats:

- normal initial invalid/unsupported target leder inte till task source-delete,
- den strukturella risken kvarstår eftersom source-delete inte är kopplad till ett positivt save-resultat eller read-back,
- risken blir relevant om target ändras mellan initial read och save eller om annan tyst save-blockering uppstår.

### Starkaste verifierade risk

Den starkaste direkt verifierade dataförlustrisken är en partiell migration:

```text
legacy-array innehåller både giltiga och avvisade poster
→ avvisade poster filtreras bort
→ minst en giltig task återstår
→ giltiga tasks skrivs till target
→ hela project-compass-tasks tas bort
→ avvisade poster kan inte längre återställas från source
```

Detta är ett starkare verifierat fynd än den tidigare `priority`-hypotesen.

### Testskydd

Direkt Vitest-skydd för legacy-taskmigreringen saknas.

Befintliga Playwright-tester navigerar till Workspace och exekverar sidan indirekt, men de seedar inte `project-compass-tasks`.

De verifierar därför inte kedjan:

```text
legacy source
→ parse
→ transform
→ target write
→ source delete
```

### Migrationsorakel

AI behandlades inte som migrationsorakel.

Verifieringsunderlaget rangordnades i första hand som:

```text
historisk source-producer och writer
→ aktuell target TypeScript-modell
→ verifierade produktregler
→ aktuell transformationskod
→ Git-historik
→ relevanta fixtures
→ framtida direkta migrationstester
```

TypeScript-casts, aktuell mapper och gröna generella Workspace-tester behandlades inte som bevis för korrekt legacy-migrering i sig.

### Rekommenderat nästa tekniskt steg

Inget nytt migrationsbeteende implementerades.

Minsta rekommenderade nästa steg är att, efter styrgruppens godkännande, lägga till ett direkt Playwright-characterization test för den kanoniska legacy-task happy path.

Testet bör verifiera bevarande av verifierade legacyfält, skapade timestamps, target-persistens efter reload och source-delete på den lyckade kanoniska vägen.

### Kvarvarande risker och antaganden

- Partiellt giltig legacy-data kan förlora avvisade poster.
- Ingen backup eller rollback finns.
- Source-delete saknar explicit koppling till verifierat target-resultat.
- Icke-kanoniska fält kan tappas.
- Legacy-data kan bli kvar om target redan innehåller tasks.
- Misslyckad source-delete kan lämna stale eller duplicerad legacy-data.
- Fel i legacy-source hanteras huvudsakligen tyst.
- Ingen direkt migrationsregression finns ännu.

### Informationssäkerhet

Ingen hemlighet, autentiseringsuppgift eller verklig användares localStorage-data behövde delas med AI.

Arbetet byggde på:

- lokal produktionskod,
- lokal Git-historik,
- lokala testfiler,
- lokal dokumentation,
- terminaloutput.

### Kompetensevidens

Arbetet visar praktisk kompetens inom:

- riskbaserad migrationsanalys,
- historisk kodanalys med Git,
- TypeScript-modelljämförelse,
- dataförlustanalys,
- runtime- kontra compile-time-validering,
- testgap-analys,
- retry- och failure-mode-analys,
- migrationsorakel,
- QA-dokumentation,
- AI-assisterad analys med mänsklig verifiering.

### Status

Pågående.

Verifieringsdelen av AI Review #005 är genomförd.

Ingen produktionskod för taskmigrering, backup eller rollback har ändrats.

AI Review #005 väntar på styrgruppens granskning och beslut om nästa tekniska steg.

### Uppdatering – Data Unification steg 3, del 2

**Delsteg:** Canonical Legacy Task Characterization Test
**Datum:** 10 augusti 2026
**Status:** Characterization-test implementerat och grönt mot oförändrad produktionskod

Styrgruppen godkände efter del 1 ett enda begränsat nästa steg: att skapa ett direkt Playwright-characterization test för den kanoniska legacy-task happy path.

Ingen produktionskod fick ändras.

#### Testfil och testnamn

Ny testfil:

`tests/task-legacy-migration.spec.ts`

Test:

`Legacy task migration characterization > migrates one canonical legacy task into the active project`

#### Hur fixturen härleddes

Fixturen byggdes från det migrationsorakel som verifierades i del 1.

Source-kontraktet hämtades från den historiskt verifierade legacy Task-modellen precis före att migreringen infördes:

- `id`
- `title`
- `description`
- `status`
- valfri `ownerId`

Inga moderna source-fält som `priority`, `createdAt` eller `updatedAt` lades till i legacy-tasken.

Target-state byggdes enligt den aktuella `ProjectCompassState`-modellen:

- `schemaVersion: 1`
- giltigt `activeProjectId`
- ett existerande aktivt projekt
- tom `tasks`-array
- övriga obligatoriska collections
- en faktisk medlem vars id motsvarar legacy-taskens `ownerId`

Statusvärdet `review` valdes medvetet i legacy-tasken.

Det gör status-preservation synlig eftersom mapperns fallback är `backlog`. Ett grönt test kan därför inte råka dölja en felaktig statusmappning genom samma värde som default.

#### Exakt seedad legacy-task

Legacy-källan `project-compass-tasks` innehöll exakt en task med:

- `id`: `legacy-task-1`
- `title`: `Verify legacy migration`
- `description`: `Preserve the canonical legacy task fields during migration.`
- `status`: `review`
- `ownerId`: `member-legacy-owner`

Motsvarande medlem fanns i målprojektets `members` med id:

`member-legacy-owner`

#### Assertions

Testet verifierar att:

- Workspace öppnas,
- target-projektets task-array blir exakt 1,
- `id` är oförändrat,
- `title` är oförändrat,
- `description` är oförändrat,
- `status` är oförändrat,
- `ownerId` är oförändrat,
- `createdAt` har skapats som en icke-tom string,
- `updatedAt` har skapats som en icke-tom string,
- `project-compass-tasks` har tagits bort,
- sidan kan reloadas,
- exakt en migrerad task finns kvar efter reload,
- taskens id fortfarande är `legacy-task-1`,
- legacy-keyn fortfarande saknas efter reload.

Tidsfälten verifieras inte mot ett exakt timestamp-värde. Testet verifierar endast det kontrakt som characterization-testet behöver bevisa: att båda fälten har skapats som icke-tomma strängar.

#### Faktisk Playwright-körning

Kommando:

`npx playwright test tests/task-legacy-migration.spec.ts --project=chromium --workers=1`

Faktiskt resultat:

- 1 test kördes
- 1 test passerade
- körtid: 23.8 sekunder

Testet passerade mot oförändrad produktionskod.

#### Vad testet nu bevisar

Testet ger ett exekverbart baseline-oracle för den befintliga kanoniska happy path-migreringen.

Det bevisar att en historiskt representativ canonical legacy-task kan migreras från `project-compass-tasks` till det aktiva projektets `tasks`, att de verifierade legacy-fälten bevaras, att target-timestamps skapas, att resultatet persisterar efter reload och att legacy-source tas bort på denna lyckade väg.

#### Vad testet inte bevisar

Testet bevisar inte:

- mixed valid/invalid records,
- partiell record-filtrering,
- source-retention vid misslyckad migration,
- backup,
- rollback,
- read-back före source-delete,
- beteende när target redan innehåller tasks,
- malformed legacy JSON,
- non-canonical extra fält,
- concurrent localStorage-förändring,
- risk- eller decisionsmigrering.

Det ska därför behandlas som ett characterization-test för nuvarande canonical happy path, inte som bevis för att migrationslösningen som helhet är säker.

#### AI-antaganden och korrigeringar

Ingen ny produktionslogik antogs eller konstruerades av AI.

En viktig testdesignfråga var seedningen vid reload. `page.addInitScript()` användes medvetet inte för legacy-fixturen, eftersom ett init-script skulle kunna seeda om `project-compass-tasks` vid reload och därmed förstöra verifieringen av one-time migration och source-delete.

I stället etablerades browser-origin först, localStorage seedades en gång med `page.evaluate()`, Workspace öppnades och den senare reloaden skedde utan ny seedning.

Detta beslut härleddes från testets faktiska syfte, inte från ett antaget implementationskrav.

#### Ändrade filer efter testkörningen

Efter den gröna Playwright-körningen visade `git status --short` endast:

`?? tests/task-legacy-migration.spec.ts`

Ingen produktionsfil var ändrad.

#### Status för AI Review #005

AI Review #005 förblir Pågående tills styrgruppen har granskat återrapporteringen från Data Unification steg 3, del 2.

Ingen produktionskod för migration, backup, rollback eller source-delete har ändrats.
