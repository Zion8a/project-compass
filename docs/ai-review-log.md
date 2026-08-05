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

**Startdatum:** 4 augusti 2026
**Avslutad:** 5 augusti 2026
**Projekt:** Project Compass
**AI-modell:** ChatGPT, GPT-5.6 Sol – Balanced
**Status:** Pågående

### Uppgift

Använda AI som stöd för att ta fram `docs/project-data-unification-plan.md`.

Planen ska jämföra möjliga vägar för Project Compass datamodell, lagring och migrering innan kod ändras. AI ska bidra med struktur, alternativjämförelse, riskanalys, teststrategi och rekommenderad arbetsordning, men får inte behandla en viss lösning som redan beslutad.

### Verifierad kontext vid arbetets start

- `docs/sprint-0-architecture-and-test-findings.md` är skapat, committat och godkänt som avslutat Sprint 0-uppdrag.
- 32 Playwright-tester passerar.
- `git status` var clean när uppdraget startade.
- `master` var synkroniserad med `origin/master`.
- Två localStorage-spår är verifierade:
  - `project-compass-state`
  - `project-compass-current-project`
- Project Interview-/legacy-flödet är inte fullt integrerat med huvudmodellen.
- QA-modulen finns i datamodellen och användargränssnittet men är inte integrerad i Status Report, Project Map eller Project Health och saknar verifierat Playwright-skydd.

### Kontext som delas med AI

- Styrgruppsbeslutet för Data Unification Plan.
- Aktuell Sprint 0-dokumentation.
- Verifierad kodstruktur och localStorage-användning.
- Verifierade Playwright-flöden och identifierade testgap.
- Kravet att inga kodändringar ska göras under planeringsuppdraget.
- Kravet att alternativen ska jämföras innan en målmodell rekommenderas.
- Kraven på schemaVersion, migrering, backup, validering, rollback och skydd mot tyst dataförlust.

### Förväntat AI-bidrag

- Formulera beslutsproblemet.
- Kartlägga berörda data och användarflöden.
- Jämföra möjliga arkitekturalternativ.
- Identifiera fördelar, nackdelar, datarisker, komplexitet och testbarhet.
- Föreslå en målmodell med tydlig motivering.
- Föreslå migrerings- och återställningsstrategi.
- Föreslå hur Project Interview ska integreras.
- Föreslå konkret teststrategi och säker implementationsordning.
- Tydliggöra antaganden och vad som inte ingår i scope.

### Mänsklig granskning

AI:s förslag ska granskas mot:

- aktuell kod,
- verifierade localStorage-flöden,
- Sprint 0-dokumentationen,
- befintliga Playwright-tester,
- Project Compass roadmap,
- risk för dataförlust,
- risk för överbyggd arkitektur,
- projektets portfolio- och QA-mål.

### Risk för falskt eller missvisande resultat

- AI kan anta att `project-compass-state` redan är beslutad källa till sanning.
- AI kan föreslå migration utan tillräcklig backup eller rollback.
- AI kan underskatta risken för tyst dataförlust.
- AI kan föreslå en för stor refaktorering.
- AI kan blanda planering med implementation.
- AI kan anta datafält eller relationer som inte stöds av aktuell kod.
- AI kan missa okända, saknade eller korrupta värden i äldre lagrad data.
- AI kan föreslå tester utan tydliga testorakel.

### Status

Pågående.

Resultatet ska återrapporteras när:

- `docs/project-data-unification-plan.md` är färdig,
- alternativen har jämförts,
- rekommendationen är motiverad,
- Definition of Done är uppfylld,
- AI Review #002 är avslutad,
- dokumentändringarna är committade och pushade,
- `git status` är clean.
