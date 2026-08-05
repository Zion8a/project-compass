# Project Compass V1 – Data Unification Plan

## 1. Beslutsproblem

Project Compass använder i dag två parallella sätt att lagra och representera projektdata:

- `project-compass-state`
- `project-compass-current-project`

`project-compass-state` används av huvudflödet med aktiva projekt, medlemmar, tasks, risker, beslut och testfall.

`project-compass-current-project` används av Project Interview-/legacy-flödet och innehåller textbaserad information om projektnamn, syfte, mål, leveranser, risker och beslut.

Detta skapar ett beslutsproblem eftersom samma projekt kan beskrivas i två olika modeller utan en gemensam källa till sanning.

### Påverkade användarflöden

Verifierat påverkade flöden:

- skapa projekt via My Projects
- skapa projektinformation via Project Interview
- välja och visa aktivt projekt
- visa Project Map
- visa Status Report
- visa projektets syfte, mål och leveranser
- hantera medlemmar
- hantera tasks
- hantera risker
- hantera beslut
- hantera testfall
- visa Attention Needed
- beräkna Project Health
- visa Recommended Next Step
- exportera statusrapport i Markdown

### Risker med två parallella modeller

Verifierade eller sannolika risker:

- Project Interview kan visa ett projekt som inte finns som riktigt projekt i `project-compass-state`.
- AppHeader kan visa “No active project” samtidigt som Project Map visar Project Interview-data.
- Project Map och Status Report kan visa kombinerad information från två olika källor.
- Ändringar i den ena modellen behöver inte uppdatera den andra.
- Projektnamn, syfte, mål och leveranser kan bli inkonsekventa mellan sidor.
- Tasks, risker, beslut, medlemmar och testfall kan saknas i Project Interview-modellen.
- Ett legacy-projekt kan uppfattas som skapat trots att inget aktivt projekt finns i huvudmodellen.
- Framtida schemaändringar kan behöva hanteras på flera ställen.
- Fel i localStorage kan leda till tom state eller ofullständig visning utan tydlig användaråterkoppling.

### Möjlig dataförlust eller inkonsistens

Följande scenarier behöver förhindras:

- Project Interview-data skrivs över utan att huvudmodellen uppdateras.
- Ett nytt riktigt projekt skapas trots att motsvarande Interview-data redan finns.
- Dubbla projekt skapas med samma projektnamn.
- Legacy-data tas bort innan den har migrerats eller säkerhetskopierats.
- Saknade eller okända fält normaliseras bort utan att användaren informeras.
- Korrupt JSON behandlas som tom data och döljer att lagrad information har gått förlorad.
- Relationer som `ownerId` och `relatedTaskId` tappas vid transformering.
- `activeProjectId` pekar på ett projekt som inte längre finns.
- Testfall eller framtida QA-data lämnas utanför migreringen.
- Ingen rollback finns om migreringen misslyckas.

### Beslut som planen måste möjliggöra

Planen ska ge ett granskningsbart underlag för att besluta:

- vilken modell som ska vara framtida källa till sanning,
- om en adapter eller övergångsperiod behövs,
- hur Project Interview ska skapa eller uppdatera ett riktigt projekt,
- hur äldre data ska identifieras och migreras,
- hur backup och återställning ska fungera,
- hur schemaVersion ska införas,
- hur korrupt eller okänd data ska hanteras,
- när den äldre localStorage-nyckeln får avvecklas,
- vilka tester som måste finnas före och efter implementation.

## 2. Verifierat nuläge

### 2.1 project-compass-state

`project-compass-state` är den centrala localStorage-nyckeln för huvudmodellen.

Verifierad struktur:

- `activeProjectId`
- `projects`

Varje projekt kan innehålla:

- `members`
- `tasks`
- `risks`
- `decisions`
- `testCases`

Verifierade egenskaper:

- nya projekt skapas via `/projects`,
- ett nytt projekt blir aktivt när det skapas,
- aktivt projekt identifieras genom `activeProjectId`,
- medlemmar, tasks, risker, beslut och testfall lagras under respektive projekt,
- state sparas som JSON i localStorage,
- state laddas och normaliseras med tomma arrayer när vissa samlingar saknas,
- ogiltig eller trasig JSON i huvudnyckeln leder till tom state,
- det finns ingen verifierad `schemaVersion`,
- det finns ingen fullständig migreringsstrategi,
- save-fel hanteras inte uttryckligen.

### 2.2 project-compass-current-project

`project-compass-current-project` är en separat localStorage-nyckel som används av Project Interview-/legacy-flödet.

Verifierade fält:

- `projectName`
- `purpose`
- `goal`
- `deliverables`
- `risks`
- `decisions`

Verifierade egenskaper:

- `/new-project` skriver till denna nyckel,
- datan är textbaserad,
- den skapar inte automatiskt ett riktigt projekt i `project-compass-state`,
- Project Map och Status Report kan läsa från denna nyckel,
- flera sidor använder `JSON.parse` utan verifierad felhantering,
- det finns ingen verifierad schemaidentifiering,
- det finns ingen verifierad migrering till huvudmodellen.

### 2.3 Project Interview-/legacy-flödet

Verifierat flöde:

```text
/new-project
-> Project Interview-formulär
-> project-compass-current-project
-> /project-map
```

Verifierade egenskaper:

- användaren kan ange projektnamn, syfte, mål, leveranser, risker och beslut,
- formuläret kräver projektnamn, syfte och mål,
- submit skriver textdata till localStorage,
- användaren skickas vidare till Project Map,
- inget `Project`-objekt skapas i huvudmodellen,
- inget `activeProjectId` sätts,
- AppHeader kan därför visa “No active project” trots att Project Map visar Interview-data.

### 2.4 Aktiva projekt och activeProject

Verifierat:

- `activeProjectId` finns i `ProjectCompassState`,
- aktivt projekt hämtas genom att matcha `activeProjectId` mot `projects`,
- ett nytt projekt blir aktivt vid skapande,
- ett befintligt projekt kan öppnas och göras aktivt,
- flera sidor kräver aktivt projekt för att skapa eller uppdatera data,
- `activeProjectId` valideras inte fullt ut vid load mot att projektet faktiskt finns,
- ett saknat matchande projekt ger `null` vid hämtning,
- användaråterkopplingen varierar mellan sidor.

### 2.5 Medlemmar

Verifierat:

- medlemmar lagras under projektet,
- medlem har bland annat `id`, `name`, `role`, `responsibility`, `comment`, `createdAt` och `updatedAt`,
- medlemmar kan skapas via UI,
- medlemmar finns kvar efter reload,
- medlem kan användas som ansvarig för task, risk och decision genom `ownerId`,
- Status Report visar medlemsinformation,
- edit och delete är inte verifierat implementerade.

### 2.6 Tasks

Verifierat:

- tasks lagras under projektet,
- task kan ha `ownerId`,
- task kan ha status:
  - `backlog`
  - `planned`
  - `in-progress`
  - `blocked`
  - `review`
  - `done`
- task utan owner markeras som “Needs owner”,
- blocked tasks påverkar Attention Needed,
- tasks finns kvar efter reload,
- legacy-nyckeln `project-compass-tasks` kan migreras in i aktivt projekt,
- statusändring finns i UI men är inte tydligt E2E-testad,
- edit, delete och ändring av owner efter skapande är inte verifierat implementerade.

### 2.7 Risker

Verifierat:

- risker lagras under projektet,
- risk kan ha:
  - `owner`
  - `ownerId`
  - `relatedTaskId`
- risk kan ha probability och impact:
  - `low`
  - `medium`
  - `high`
- riskstatus kan vara:
  - `open`
  - `watching`
  - `handled`
- risk utan owner markeras som “Needs owner”,
- high risk påverkar Attention Needed och Project Health,
- risk kan kopplas till task,
- legacy-nyckeln `project-compass-risks` kan migreras in i aktivt projekt,
- risk till task via UI är inte tydligt E2E-testat,
- edit och delete är inte verifierat implementerade.

### 2.8 Beslut

Verifierat:

- beslut lagras under projektet,
- beslut kan ha:
  - `owner`
  - `ownerId`
  - `relatedTaskId`
  - `deadline`
  - `consequence`
- beslutstatus kan vara:
  - `open`
  - `decided`
  - `postponed`
- beslut utan owner markeras som “Needs owner”,
- open decisions påverkar Attention Needed och Project Health,
- beslut kan kopplas till task,
- legacy-nyckeln `project-compass-decisions` kan migreras in i aktivt projekt,
- decision till task via UI är inte tydligt E2E-testat,
- edit och delete är inte verifierat implementerade.

### 2.9 Testfall

Verifierat:

- testfall lagras under projektet i `testCases`,
- testfall kan ha:
  - `title`
  - `description`
  - `expectedResult`
  - `status`
  - `relatedTaskId`
- teststatus kan vara:
  - `not-run`
  - `passed`
  - `failed`
  - `blocked`
- testfall kan kopplas till task,
- testfall kan skapas via Test Cases-sidan,
- testfall används inte i Project Health,
- testfall visas inte i Project Map,
- testfall ingår inte i Status Report,
- inget verifierat Playwright-test finns för Test Cases-flödet,
- actual result, result note och tester/owner är inte verifierat implementerade.

### 2.10 localStorage-nycklar och beroenden

Verifierade nycklar:

- `project-compass-state`
- `project-compass-current-project`
- `project-compass-tasks`
- `project-compass-risks`
- `project-compass-decisions`

Verifierade beroenden:

- `/projects` använder huvudmodellen och skriver även legacy-kompatibel Project Interview-data,
- `/new-project` använder endast Project Interview-/legacy-nyckeln,
- Project Map och Status Report läser från båda projektmodellerna,
- Workspace, Risks och Decisions kan läsa äldre separata nycklar och migrera dem till aktivt projekt,
- AppHeader läser endast aktivt projekt från huvudmodellen,
- Test Cases använder endast huvudmodellen,
- Project Health och Attention Needed beräknas från huvudmodellens aktiva projekt.

### 2.11 Verifierade testresultat

Verifierat:

- 32 Playwright-tester passerar,
- testsviten skyddar flera centrala happy-path- och ansvarsscenarier,
- persistens efter reload är verifierad för projekt, medlemmar, tasks, risker och beslut,
- Project Interview-data är verifierad genom direkt localStorage-injektion i test,
- Project Interview-formuläret är inte fullt E2E-testat,
- korrupt JSON, okänd schemaVersion, backup och återställning är inte testade,
- Test Cases-flödet saknar verifierat Playwright-skydd.

## 3. Alternativ

Följande alternativ jämförs utifrån:

- dataintegritet,
- risk för dataförlust,
- implementationskomplexitet,
- testbarhet,
- påverkan på användarflöden,
- påverkan på befintliga Playwright-tester,
- möjlighet till stegvis och reversibel implementation.

### 3.1 Alternativ A – Slå samman modellerna direkt

Beskrivning:

Project Interview-modellen och huvudmodellen ersätts av en gemensam projektmodell. All projektdata lagras direkt i `project-compass-state`, och `project-compass-current-project` tas bort i samband med förändringen.

Fördelar:

- en tydlig källa till sanning,
- mindre dubbel lagring,
- enklare framtida utveckling,
- mindre risk för inkonsekvent projektdata,
- Project Map, Status Report och AppHeader kan läsa från samma modell,
- färre beroenden till legacy-nycklar.

Nackdelar:

- stor förändring i ett enda steg,
- hög risk att befintliga flöden bryts,
- äldre data kan gå förlorad om migreringen är ofullständig,
- svårt att isolera fel när flera sidor och lagringsflöden ändras samtidigt,
- rollback blir mer komplicerad.

Datarisker:

- textbaserade risker och beslut från Project Interview kan inte alltid översättas direkt till fullständiga objekt,
- dubbla projekt kan skapas,
- `activeProjectId` kan bli felaktigt,
- okända eller framtida fält kan tappas,
- äldre separata nycklar kan lämnas kvar eller raderas för tidigt.

Komplexitet:

Hög.

Testbarhet:

Medel. Slutläget blir enklare att testa, men implementationen kräver bred regressionstestning eftersom många flöden förändras samtidigt.

Påverkan på användare:

- användaren får en mer konsekvent app efter lyckad migrering,
- befintlig lagrad data riskerar att påverkas direkt,
- fel kan bli synliga i flera delar av appen samtidigt.

Påverkan på tester:

- flera befintliga Playwright-tester kan behöva uppdateras,
- tester som injicerar `project-compass-current-project` måste skrivas om,
- full regression krävs före release.

Bedömning:

Alternativet ger ett tydligt slutläge men innebär för stor förändringsrisk som första steg.

### 3.2 Alternativ B – Införa adapter eller översättningslager

Beskrivning:

De två modellerna behålls tillfälligt, men ett gemensamt adapterlager införs. Sidor och komponenter läser projektdata genom en gemensam funktion som kan översätta mellan huvudmodellen och Project Interview-/legacy-modellen.

Fördelar:

- möjliggör stegvis övergång,
- minskar behovet av en stor direkt refaktorering,
- befintliga användarflöden kan fortsätta fungera,
- adapterlogik kan enhetstestas isolerat,
- ger tid att kartlägga hur äldre data används,
- rollback är enklare eftersom legacy-data finns kvar.

Nackdelar:

- två modeller finns fortfarande kvar under övergångsperioden,
- adapterlagret kan bli komplext,
- risk för att tillfällig lösning blir permanent,
- skrivningar måste hanteras särskilt för att undvika dubbla källor till sanning,
- fler kodvägar kan göra felsökning svårare.

Datarisker:

- översättning kan dölja skillnader mellan modellerna,
- saknade fält kan fyllas med standardvärden utan att användaren märker det,
- synkronisering mellan skrivningar kan misslyckas,
- data kan se korrekt ut i UI trots att lagringen är inkonsekvent.

Komplexitet:

Medel.

Testbarhet:

Hög, om adapterfunktionerna hålls små och rena och får tydliga testorakel.

Påverkan på användare:

- liten direkt förändring,
- lägre risk att befintliga projekt slutar fungera,
- viss inkonsekvens kan finnas kvar under övergångsperioden.

Påverkan på tester:

- befintliga Playwright-tester kan till stor del behållas,
- nya tester behövs för adapterlogik,
- tester behövs för prioritering när båda modellerna innehåller data.

Bedömning:

Alternativet är lämpligt som övergångsmekanism, men inte som permanent målarkitektur.

### 3.3 Alternativ C – Migrera till huvudmodellen och pensionera legacy-spåret stegvis

Beskrivning:

`project-compass-state` blir beslutad framtida källa till sanning. Project Interview integreras stegvis så att det skapar eller uppdaterar ett riktigt projekt i huvudmodellen. Legacy-data migreras under kontrollerade former, medan äldre nycklar behålls tillfälligt som backup och tas bort först efter verifiering.

Fördelar:

- tydlig framtida källa till sanning,
- möjliggör stegvis implementation,
- minskar risken för en stor engångsrefaktorering,
- backup och rollback kan byggas in,
- Project Interview kan behållas som användarflöde,
- huvudmodellens relationer och QA-data kan bevaras,
- testning kan genomföras per migrationssteg.

Nackdelar:

- kräver flera avgränsade implementationer,
- övergångslogik måste underhållas tillfälligt,
- legacy-nycklar kan inte tas bort direkt,
- migreringen kräver tydliga regler för ofullständig data,
- vissa användare kan behöva bekräfta hur Interview-data ska kopplas till projekt.

Datarisker:

- felaktig matchning mellan Interview-data och befintligt projekt,
- dubbla projekt vid migrering,
- textbaserade risker och beslut kan förlora betydelse vid automatisk konvertering,
- ofullständig migrering kan lämna data i två tillstånd,
- legacy-data kan raderas innan verifiering.

Komplexitet:

Medel till hög, men kan delas upp i små steg.

Testbarhet:

Hög. Varje steg kan få egna enhets-, integrations- och E2E-tester.

Påverkan på användare:

- Project Interview kan fortsätta användas,
- användaren får gradvis mer konsekvent projektdata,
- äldre data kan skyddas under migreringen,
- viss bekräftelse kan krävas för att undvika felaktig sammanslagning.

Påverkan på tester:

- befintliga tester kan behållas under övergången,
- nya migrationstester krävs,
- nya Project Interview E2E-tester krävs,
- regression kan genomföras stegvis.

Bedömning:

Alternativet ger bäst balans mellan tydlig målarkitektur, dataskydd, testbarhet och stegvis implementation.

### 3.4 Alternativ D – Behålla modellerna separata

Beskrivning:

Project Interview fortsätter vara ett separat förberedande flöde, medan `project-compass-state` fortsätter hantera aktiva projekt och strukturerad projektdata. Modellerna definieras som separata domäner med tydliga gränser.

Fördelar:

- liten implementationsinsats,
- befintliga flöden påverkas minimalt,
- ingen omedelbar migreringsrisk,
- Project Interview kan fortsätta vara ett enkelt utkast eller förberedande arbetssteg.

Nackdelar:

- två källor till projektinformation kvarstår,
- användaren kan fortsatt möta motstridig information,
- AppHeader, Project Map och Status Report kan visa olika projektstatus,
- framtida funktioner måste välja vilken modell de ska använda,
- mer långsiktig underhållskostnad,
- sämre spårbarhet mellan intervju, tasks, risker, beslut och testfall.

Datarisker:

- inkonsekvent projektnamn, syfte, mål och leveranser,
- användaren kan tro att ett projekt är skapat när det bara finns som Interview-data,
- uppdateringar kan ske i fel modell,
- rapporter kan kombinera data från olika källor.

Komplexitet:

Låg på kort sikt, högre på lång sikt.

Testbarhet:

Låg till medel. Varje sida måste testas mot flera möjliga datakällor och konfliktscenarier.

Påverkan på användare:

- få synliga förändringar,
- befintlig förvirring och inkonsekvens kvarstår,
- appens projektklarhet försvagas.

Påverkan på tester:

- befintliga tester kan behållas,
- fler tester krävs för konflikter mellan modellerna,
- testmatrisen blir större över tid.

Bedömning:

Alternativet minskar kortsiktig utvecklingsrisk men löser inte det verifierade grundproblemet.

## 4. Rekommenderad målmodell

### 4.1 Rekommendation

Project Compass bör använda `project-compass-state` som framtida källa till sanning för all aktiv projektdata.

Den rekommenderade vägen är:

- Alternativ C som målstrategi:
  - migrera till huvudmodellen,
  - integrera Project Interview med riktiga projekt,
  - pensionera legacy-spåret stegvis,
- med ett begränsat adapter- eller översättningslager från Alternativ B under övergångsperioden.

Detta innebär att adapterlogiken används som ett tillfälligt migrationsverktyg, inte som permanent arkitektur.

### 4.2 Framtida källa till sanning

Den framtida källan till sanning ska vara:

`project-compass-state`

Den ska innehålla:

- global `schemaVersion`,
- `activeProjectId`,
- `projects`.

Varje projekt ska fortsatt kunna innehålla:

- grundläggande projektinformation,
- medlemmar,
- tasks,
- risker,
- beslut,
- testfall.

Project Map, Status Report, AppHeader, Attention Needed, Project Health, Recommended Next Step och övriga projektvyer ska efter migreringen läsa från samma aktiva projekt i huvudmodellen.

### 4.3 Project-modellens ansvar

Ett riktigt `Project`-objekt ska representera hela projektet.

Projektmodellen ska vara ansvarig för:

- identitet,
- projektnamn,
- syfte,
- mål,
- leveranser,
- skapad och uppdaterad tid,
- medlemmar,
- tasks,
- risker,
- beslut,
- testfall.

Projektinformation som i dag endast finns i Project Interview-modellen ska mappas till tydliga projektfält i huvudmodellen.

Exakt fältdesign ska verifieras mot aktuell TypeScript-modell före implementation.

### 4.4 Global state och projektspecifik data

Global state ska endast hantera sådant som gäller hela installationen eller arbetsytan:

- `schemaVersion`,
- lista över projekt,
- vilket projekt som är aktivt.

Projektspecifik information ska ligga under respektive projekt.

Följande ska inte lagras som parallell global projektdata efter genomförd migrering:

- separat aktuellt projektnamn,
- separat syfte,
- separat mål,
- separata leveranser,
- separata risktexter,
- separata beslutstexter.

### 4.5 Project Interview som användarflöde

Project Interview ska behållas som ett guidat sätt att skapa struktur i ett projekt.

Det ska inte fortsätta vara en separat projektmodell.

Efter målarkitekturens införande ska Project Interview kunna användas för att:

- skapa ett nytt riktigt projekt,
- komplettera ett befintligt projekt,
- uppdatera projektets syfte, mål och leveranser,
- föreslå strukturerade risker och beslut,
- låta användaren granska förslag innan de sparas.

Project Interview ska alltid arbeta mot ett identifierat `Project`-objekt.

### 4.6 Risker och beslut från Project Interview

Textbaserade risker och beslut får inte automatiskt omvandlas till fullständiga strukturerade objekt utan tydliga regler.

Vid konvertering ska systemet kunna:

- skapa ett utkast,
- visa vad som kommer att skapas,
- låta användaren bekräfta,
- undvika dubbletter,
- bevara den ursprungliga texten tills konverteringen är verifierad.

Obligatoriska fält som saknas ska inte fyllas med missvisande värden.

Saknade värden ska i stället:

- lämnas tomma där modellen tillåter det,
- markeras som “Needs attention”,
- eller kräva användarens bekräftelse.

### 4.7 Aktiva projekt

`activeProjectId` ska fortsatt användas för att identifiera aktivt projekt.

Vid load ska följande valideras:

- att `activeProjectId` finns,
- att det refererar till ett befintligt projekt,
- att projektet har en giltig miniminivå av data.

Om `activeProjectId` är ogiltigt ska appen inte krascha eller tyst välja ett godtyckligt projekt.

Appen ska i stället:

- sätta aktivt projekt till `null`,
- visa tydlig information,
- låta användaren välja ett befintligt projekt,
- eller skapa ett nytt projekt.

### 4.8 schemaVersion

Huvudmodellen ska kompletteras med en explicit `schemaVersion`.

Exempel på målstruktur:

- `ProjectCompassState`
  - `schemaVersion`
  - `activeProjectId`
  - `projects`

`schemaVersion` ska användas för att:

- identifiera vilken datastruktur som är lagrad,
- välja rätt migreringsväg,
- stoppa okända framtida versioner från att normaliseras felaktigt,
- möjliggöra testbara stegvisa migreringar.

Exakt versionsnummer ska beslutas när implementationen startar.

### 4.9 Legacy-nycklarnas framtid

Följande nycklar ska betraktas som legacy efter att migreringen har påbörjats:

- `project-compass-current-project`
- `project-compass-tasks`
- `project-compass-risks`
- `project-compass-decisions`

De får inte tas bort direkt.

De ska först:

- identifieras,
- läsas säkert,
- säkerhetskopieras,
- migreras,
- valideras,
- jämföras med resultatet i huvudmodellen.

Legacy-nycklar får pensioneras först när:

- migreringen har lyckats,
- användarens data finns i huvudmodellen,
- relevant testsvit passerar,
- rollback har verifierats,
- ingen tyst dataförlust har upptäckts.

### 4.10 Arkitekturprinciper

Den rekommenderade målmodellen ska följa dessa principer:

- en källa till sanning,
- inga parallella skrivningar i permanent slutläge,
- explicit `schemaVersion`,
- små och testbara migrationer,
- ingen tyst dataförlust,
- backup före transformering,
- tydlig felhantering,
- reversibla steg,
- human-in-the-loop vid osäker datamappning,
- bevarande av befintliga användarflöden där det är rimligt,
- MVP före större arkitektonisk polish.

### 4.11 Motivering

Rekommendationen bedöms ge bäst balans mellan:

- projektklarhet,
- dataintegritet,
- användarsäkerhet,
- testbarhet,
- stegvis utveckling,
- portfolio-värde,
- rimlig teknisk komplexitet.

Alternativ A bedöms innebära för hög förändringsrisk i ett enda steg.

Alternativ B är användbart som övergångsmekanism men bör inte bli permanent.

Alternativ D löser inte det verifierade problemet med parallella projektmodeller.

Alternativ C, kompletterat med ett tillfälligt adapterlager, ger den tydligaste vägen från nuvarande arkitektur till en sammanhållen och testbar projektmodell.

## 5. Migreringsstrategi

### 5.1 Mål

Migreringen ska föra Project Compass från flera parallella localStorage-modeller till en huvudmodell utan tyst dataförlust.

Strategin ska vara:

- stegvis,
- testbar,
- reversibel,
- spårbar,
- tydlig för användaren,
- möjlig att genomföra utan backend eller autentisering.

### 5.2 Grundprincip

Ingen legacy-data får tas bort innan följande har skett:

- datan har identifierats,
- rådata har säkerhetskopierats,
- rätt migreringsväg har valts,
- transformeringen har genomförts,
- resultatet har validerats,
- användarflödet har verifierats,
- rollback har testats.

Migrering ska inte behandla felaktig eller okänd data som tom data.

### 5.3 Införa schemaVersion

`project-compass-state` ska få en explicit `schemaVersion`.

Versionen ska sparas tillsammans med övrig state och användas för att välja migreringsväg.

Migreringslogiken ska kunna skilja mellan:

- ingen `schemaVersion`,
- känd äldre version,
- aktuell version,
- okänd framtida version,
- korrupt eller oläsbar data.

Vid okänd framtida version ska appen inte skriva över datan automatiskt.

I stället ska appen:

- stoppa automatisk migrering,
- bevara rådata,
- visa ett tydligt felmeddelande,
- erbjuda export eller återställning,
- undvika nya skrivningar tills användaren har valt hur situationen ska hanteras.

### 5.4 Identifiera befintlig data

Före migrering ska appen kontrollera om följande nycklar finns:

- `project-compass-state`
- `project-compass-current-project`
- `project-compass-tasks`
- `project-compass-risks`
- `project-compass-decisions`

För varje nyckel ska appen skilja mellan:

- nyckeln saknas,
- nyckeln finns med giltig JSON,
- nyckeln finns med korrupt JSON,
- nyckeln innehåller oväntad struktur,
- nyckeln innehåller tom men giltig data.

Detta ska loggas i ett internt migrationsresultat som kan användas för validering och testning.

### 5.5 Backup före transformering

Innan någon förändring skrivs ska en rå backup skapas.

Backupen ska innehålla:

- originalvärdet från varje identifierad localStorage-nyckel,
- tidpunkt för backup,
- känd eller uppskattad schemaVersion,
- vilken migreringsfunktion som ska användas,
- ett unikt migrations-id.

Backupen ska sparas separat från aktiv state.

Exempel på separat backupnyckel:

`project-compass-migration-backup`

Exakt nyckelnamn ska beslutas vid implementation.

Rådata ska sparas utan normalisering så att den kan återställas exakt.

### 5.6 Transformering

Transformeringen ska ske i minnet innan något skrivs tillbaka till localStorage.

Rekommenderad ordning:

1. Läs och bevara rådata.
2. Tolka aktuell huvudstate.
3. Normalisera kända tomma eller saknade samlingar.
4. Identifiera Project Interview-data.
5. Identifiera separata legacy-tasks, risker och beslut.
6. Bygg ett migreringsförslag.
7. Kontrollera dubbletter och konflikter.
8. Validera det föreslagna resultatet.
9. Skriv ny state först när valideringen passerar.
10. Behåll backup och legacy-nycklar tills efter verifiering.

Ingen transformering ska direkt mutera den inlästa råstrukturen.

### 5.7 Mappning av Project Interview-data

Project Interview-data ska inte automatiskt skapa dubbletter.

Före skapande eller uppdatering ska migreringen kontrollera:

- om ett projekt med samma id redan finns,
- om ett projekt med samma normaliserade namn finns,
- om aktivt projekt saknar syfte, mål eller leveranser,
- om Interview-data skiljer sig från befintlig projektdata.

Möjliga resultat:

- skapa nytt projekt,
- komplettera aktivt projekt,
- föreslå sammanslagning med befintligt projekt,
- kräva användarens val,
- lämna datan omigrerad men bevarad.

Automatisk sammanslagning ska endast ske när matchningen är tydlig och risken för fel är låg.

### 5.8 Mappning av textbaserade risker och beslut

Textbaserade risker och beslut kan sakna de fält som krävs i huvudmodellen.

Migreringen ska därför inte hitta på:

- owner,
- ownerId,
- relatedTaskId,
- probability,
- impact,
- status,
- deadline,
- consequence.

Den ursprungliga texten ska bevaras.

Migreringen ska i första hand skapa ett tydligt utkast eller ett objekt markerat för komplettering, förutsatt att den verifierade TypeScript-modellen tillåter detta.

Om modellen inte tillåter ofullständiga objekt ska användaren behöva granska och komplettera datan före slutlig import.

### 5.9 Mappning av separata tasks, risker och beslut

Legacy-nycklarna för tasks, risker och beslut ska endast migreras till ett identifierat projekt.

Migreringen ska inte godtyckligt välja projekt.

Godkända mål kan vara:

- ett verifierat aktivt projekt,
- ett projekt som användaren uttryckligen väljer,
- ett nytt projekt som skapas från motsvarande Project Interview-data.

Om inget säkert mål finns ska datan bevaras i backup och migreringen pausas.

### 5.10 Dubbletter och konflikter

Dubblettkontroll ska göras före skrivning.

Kontrollen ska minst jämföra:

- projekt-id,
- normaliserat projektnamn,
- objekt-id,
- titel eller namn,
- skapad tid när den finns,
- relationer som `ownerId` och `relatedTaskId`.

Vid konflikt ska migreringen:

- inte skriva över befintlig data tyst,
- registrera konflikten,
- bevara båda ursprungsvärdena,
- välja en säker standardåtgärd,
- eller kräva användarens beslut.

Matchning enbart på titel eller projektnamn ska inte betraktas som säker i alla situationer.

### 5.11 Validering före skrivning

Föreslagen state ska valideras innan den sparas.

Valideringen ska minst kontrollera:

- att `schemaVersion` är känd,
- att `projects` är en array,
- att projekt-id är unika,
- att obligatoriska projektfält finns,
- att projektsamlingar har rätt typ,
- att objekt-id är unika inom relevant scope,
- att `activeProjectId` är `null` eller refererar till ett befintligt projekt,
- att `ownerId` refererar till befintlig medlem eller hanteras som saknad,
- att `relatedTaskId` refererar till befintlig task eller hanteras som saknad,
- att statusvärden tillhör tillåtna värden,
- att inga identifierade objekt har tappats utan registrerad anledning.

Valideringen ska returnera ett tydligt resultat:

- godkänd,
- godkänd med varningar,
- blockerad.

Endast godkänd state får ersätta aktiv state automatiskt.

### 5.12 Skrivning och verifiering efter skrivning

När valideringen passerar ska appen:

1. skriva den nya huvudstate-versionen,
2. läsa tillbaka värdet från localStorage,
3. tolka det på nytt,
4. validera det återlästa resultatet,
5. jämföra antal projekt och migrerade objekt,
6. kontrollera `activeProjectId`,
7. registrera migrationsresultatet.

Migreringen ska betraktas som genomförd först när återläsningen och efterkontrollen passerar.

### 5.13 Hantering av korrupt data

Korrupt JSON ska inte behandlas som tom state.

Vid korrupt data ska appen:

- bevara det råa strängvärdet,
- skapa eller behålla backup,
- stoppa automatisk överskrivning av berörd nyckel,
- visa ett tydligt felmeddelande,
- erbjuda återställning eller export av rådata,
- låta övrig verifierat giltig data hanteras separat där det är säkert.

Felmeddelandet ska skilja mellan korrupt data och ett tomt projekt.

### 5.14 Hantering av saknade och okända värden

Saknade fält ska hanteras enligt dokumenterade regler.

Tillåtna åtgärder kan vara:

- använda ett säkert neutralt standardvärde,
- lämna värdet tomt,
- markera objektet som “Needs attention”,
- pausa migreringen,
- kräva användarens bekräftelse.

Okända enumvärden ska inte tyst ersättas med ett annat giltigt värde.

Det ursprungliga värdet ska bevaras i backup eller migrationsrapport.

### 5.15 Rollback

Rollback ska kunna återställa localStorage till läget före migreringen.

Rollback ska använda den råa backupen och:

- återställa samtliga nycklar som ingick i migreringen,
- återställa originalvärden exakt,
- ta bort state som skapades av den misslyckade migreringen,
- verifiera att återställd data kan läsas,
- registrera att rollback genomfördes.

Rollback ska testas innan legacy-nycklar får pensioneras.

### 5.16 När legacy-nycklar får tas bort

Legacy-nycklar ska behållas under en verifieringsperiod.

De får tas bort först när:

- migreringen har passerat alla automatiserade tester,
- manuell verifiering har genomförts,
- Project Interview arbetar mot huvudmodellen,
- Project Map och Status Report inte längre behöver legacy-data,
- backup och rollback har verifierats,
- ingen dataförlust eller konflikt återstår,
- borttagningen görs i en separat och reversibel ändring.

Borttagning av legacy-nycklar ska inte ske i samma kodändring som den första migreringen.

### 5.17 Migrationsrapport

Varje migreringsförsök bör skapa ett strukturerat resultat med:

- migrations-id,
- start- och sluttid,
- identifierade nycklar,
- använda schemaVersioner,
- antal projekt före och efter,
- antal tasks, risker, beslut och testfall före och efter,
- skapade objekt,
- uppdaterade objekt,
- överhoppade objekt,
- varningar,
- konflikter,
- fel,
- om rollback genomfördes.

Rapporten ska främst stödja testning, felsökning och spårbarhet.

Den ska inte innehålla onödig persondata.

### 5.18 Ingen tyst dataförlust

Migreringen ska uttryckligen betraktas som misslyckad om:

- identifierad data försvinner utan dokumenterad regel,
- ett objekt skrivs över utan säker matchning,
- relationer tappas utan varning,
- korrupt data ersätts med tom state,
- legacy-data tas bort före verifiering,
- återläsning efter skrivning misslyckas,
- rollback inte kan genomföras.

Säkerhet och databevarande ska prioriteras framför automatisk bekvämlighet.


## 6. Project Interview

### 6.1 Mål

Project Interview ska behållas som ett guidat användarflöde för att skapa projektklarhet.

Det ska inte fortsätta vara en separat datamodell eller en fristående källa till projektstatus.

Efter genomförd migrering ska Project Interview alltid arbeta mot ett identifierat projekt i `project-compass-state`.

### 6.2 Två tillåtna användningslägen

Project Interview ska stödja två tydliga lägen:

1. Skapa nytt projekt.
2. Komplettera eller uppdatera ett befintligt projekt.

Användaren ska alltid förstå vilket läge som är aktivt innan data sparas.

### 6.3 Skapa nytt projekt

När användaren väljer att skapa ett nytt projekt via Project Interview ska flödet:

1. samla in projektnamn, syfte, mål och leveranser,
2. validera obligatoriska fält,
3. kontrollera om ett sannolikt motsvarande projekt redan finns,
4. visa en sammanfattning före skapande,
5. skapa ett riktigt `Project`-objekt i huvudmodellen,
6. sätta det nya projektet som aktivt,
7. spara projektet i `project-compass-state`,
8. läsa tillbaka och verifiera resultatet,
9. navigera användaren till Project Map eller annan beslutad projektsida.

Project Interview ska inte först skriva till `project-compass-current-project` och därefter förlita sig på att andra sidor tolkar datan.

### 6.4 Uppdatera befintligt projekt

När Project Interview används för ett befintligt projekt ska användaren först välja eller bekräfta vilket projekt som ska uppdateras.

Flödet ska:

- visa aktuellt projektnamn,
- visa befintligt syfte, mål och leveranser,
- tydligt markera vilka fält som kommer att ändras,
- inte skriva över befintlig information utan bekräftelse,
- uppdatera projektets `updatedAt`,
- bevara data som användaren inte har ändrat,
- verifiera resultatet efter skrivning.

### 6.5 Mappning av fält

Följande grundmappning rekommenderas:

- `projectName` → projektets namn,
- `purpose` → projektets syfte,
- `goal` → projektets mål,
- `deliverables` → projektets leveranser.

Exakta fältnamn och typer ska verifieras mot aktuell TypeScript-modell före implementation.

Om leveranser lagras som text i Project Interview men som en annan struktur i huvudmodellen ska konverteringen dokumenteras och testas.

### 6.6 Risker och beslut

Project Interview kan fortsatt hjälpa användaren att identifiera risker och beslut, men dessa ska behandlas som förslag tills användaren har granskat dem.

För varje föreslagen risk ska användaren kunna:

- se ursprunglig text,
- redigera titel eller beskrivning,
- ange probability,
- ange impact,
- ange status,
- välja ansvarig,
- koppla till task där det är relevant,
- bekräfta skapandet.

För varje föreslaget beslut ska användaren kunna:

- se ursprunglig text,
- redigera titel eller beskrivning,
- ange status,
- ange deadline där det är relevant,
- ange konsekvens,
- välja ansvarig,
- koppla till task där det är relevant,
- bekräfta skapandet.

Automatisk skapning utan mänsklig bekräftelse rekommenderas inte.

### 6.7 Dubblettkontroll

Före skapande av nytt projekt ska appen kontrollera möjliga dubbletter.

Kontrollen kan använda:

- normaliserat projektnamn,
- befintligt aktivt projekt,
- skapad tid,
- annan verifierad identifierare.

Ett liknande namn ska inte automatiskt blockera skapandet, eftersom olika projekt kan ha liknande namn.

Vid möjlig dubblett ska användaren få välja mellan:

- öppna befintligt projekt,
- komplettera befintligt projekt,
- skapa ett nytt projekt ändå,
- avbryta.

### 6.8 Bekräftelse före skrivning

Project Interview ska ha ett granskningssteg före slutlig skrivning.

Granskningssteget ska minst visa:

- vilket projekt som skapas eller uppdateras,
- projektnamn,
- syfte,
- mål,
- leveranser,
- antal riskförslag,
- antal beslutsförslag,
- eventuella konflikter eller saknade uppgifter.

Användaren ska kunna gå tillbaka och ändra uppgifterna utan att data redan har sparats permanent.

### 6.9 Felhantering

Vid fel ska Project Interview:

- inte visa att projektet är skapat om skrivningen misslyckades,
- bevara användarens inmatning i minnet under sessionen där det är möjligt,
- visa ett begripligt felmeddelande,
- skilja mellan valideringsfel och lagringsfel,
- inte lämna ett halvt skapat projekt utan tydlig status,
- erbjuda ett säkert nytt försök.

### 6.10 Relation till aktivt projekt

Efter lyckat skapande ska det nya projektets id sättas som `activeProjectId`.

Vid uppdatering av befintligt projekt ska det valda projektet fortsatt vara eller bli aktivt enligt ett uttryckligt produktbeslut.

Project Interview ska aldrig visa data från ett projekt samtidigt som AppHeader och övriga vyer arbetar mot ett annat projekt utan tydlig information.

### 6.11 Relation till Project Map och Status Report

Efter integrationen ska Project Map och Status Report läsa projektinformation från samma `Project`-objekt som Project Interview har skapat eller uppdaterat.

De ska inte längre behöva kombinera huvudmodellen med `project-compass-current-project`.

Detta ska säkerställa att:

- projektnamn är konsekvent,
- syfte är konsekvent,
- mål är konsekvent,
- leveranser är konsekventa,
- aktiva risker och beslut kommer från strukturerade projektobjekt,
- QA-data kan inkluderas utan separat datakälla.

### 6.12 Hantering av befintlig Project Interview-data

När äldre `project-compass-current-project` identifieras ska användaren inte förlora datan.

Appen ska kunna:

- visa att äldre Project Interview-data har hittats,
- visa en sammanfattning,
- låta användaren välja målprojekt,
- föreslå att skapa ett nytt projekt,
- låta användaren avstå,
- behålla backup tills migreringen är verifierad.

Äldre data ska inte automatiskt kopplas till ett projekt enbart på grund av liknande namn om matchningen är osäker.

### 6.13 Acceptanskriterier

Project Interview-integrationen är godkänd när:

- ett nytt projekt kan skapas genom hela UI-flödet,
- projektet finns i `project-compass-state`,
- projektet blir aktivt,
- AppHeader visar rätt projekt,
- Project Map visar samma projektdata,
- Status Report visar samma projektdata,
- reload bevarar resultatet,
- uppdatering av befintligt projekt inte skapar dubblett,
- användaren får granska risker och beslut innan de skapas,
- lagringsfel ger tydlig återkoppling,
- äldre Interview-data kan migreras eller avstås utan tyst dataförlust.


## 7. Teststrategi

### 7.1 Mål

Teststrategin ska verifiera att Data Unification kan genomföras utan tyst dataförlust och utan att centrala användarflöden bryts.

Strategin ska täcka:

- datamodell,
- migrationslogik,
- validering,
- backup,
- rollback,
- Project Interview,
- aktivt projekt,
- Project Map,
- Status Report,
- Attention Needed,
- Project Health,
- Recommended Next Step,
- QA-data och testfall.

### 7.2 Testnivåer

Följande testnivåer rekommenderas:

- enhetstester för rena funktioner,
- integrationstester för localStorage och state,
- Playwright-tester för användarkritiska flöden,
- manuell testning för felmeddelanden, återställning och användarförståelse.

Migreringslogik ska i första hand byggas som små rena funktioner som kan testas utan webbläsar-UI.

### 7.3 Enhetstester

Enhetstester ska minst täcka:

- identifiering av state utan `schemaVersion`,
- identifiering av känd äldre version,
- identifiering av aktuell version,
- avvisning av okänd framtida version,
- hantering av saknade samlingar,
- hantering av korrupt JSON,
- normalisering av tillåtna saknade värden,
- validering av `activeProjectId`,
- validering av unika projekt-id,
- validering av `ownerId`,
- validering av `relatedTaskId`,
- dubblettidentifiering,
- mappning av Project Interview-fält,
- mappning av separata legacy-nycklar,
- skapande av migrationsrapport,
- rollback-transformering.

Varje test ska ha ett tydligt testorakel och kontrollera både resultat och bevarad data.

### 7.4 Datadrivna migrationstester

Migrationstester ska använda flera definierade dataset.

Minsta uppsättning:

1. Tom installation utan localStorage-data.
2. Giltig aktuell huvudstate.
3. Huvudstate utan `schemaVersion`.
4. Huvudstate med saknade arrayer.
5. Huvudstate med ogiltigt `activeProjectId`.
6. Endast `project-compass-current-project`.
7. Endast separata legacy-tasks.
8. Endast separata legacy-risker.
9. Endast separata legacy-beslut.
10. Huvudstate och Project Interview-data samtidigt.
11. Dubblett med samma projekt-id.
12. Möjlig dubblett med samma projektnamn.
13. Korrupt huvudstate.
14. Korrupt legacy-nyckel.
15. Okänd framtida `schemaVersion`.
16. Saknad owner-referens.
17. Saknad task-referens.
18. Testfall kopplat till befintlig task.
19. Testfall kopplat till saknad task.
20. Fullt projekt med medlemmar, tasks, risker, beslut och testfall.

För varje dataset ska testet kontrollera:

- vad som identifierades,
- vad som migrerades,
- vad som lämnades orört,
- vilka varningar som skapades,
- om migreringen blockerades,
- om backup skapades,
- om rollback är möjlig.

### 7.5 Backup- och rollback-tester

Backup ska verifieras genom tester som kontrollerar att:

- originalsträngarna bevaras exakt,
- samtliga identifierade nycklar ingår,
- backup skapas före skrivning,
- backup inte skrivs över av ett misslyckat nytt försök utan tydlig regel,
- backup kan läsas tillbaka.

Rollback ska verifieras genom tester som kontrollerar att:

- originalnycklar återställs,
- originalvärden återställs exakt,
- ny state från misslyckad migrering tas bort,
- återställd data kan läsas,
- rollback registreras i migrationsresultatet.

### 7.6 Integrationstester för localStorage

Integrationstester ska verifiera hela kedjan:

1. förbered localStorage,
2. ladda state,
3. identifiera version och legacy-data,
4. skapa backup,
5. transformera,
6. validera,
7. skriva ny state,
8. läsa tillbaka,
9. validera igen,
10. kontrollera resultatet efter reload.

Testerna ska även verifiera att korrupt eller okänd data inte skrivs över automatiskt.

### 7.7 Playwright – Project Interview

Nya Playwright-tester ska minst täcka:

- skapa nytt projekt genom Project Interview-UI,
- validering av obligatoriska fält,
- granska sammanfattning före skapande,
- projektet sparas i `project-compass-state`,
- projektet blir aktivt,
- AppHeader visar rätt projekt,
- Project Map visar samma syfte, mål och leveranser,
- Status Report visar samma projektdata,
- reload bevarar resultatet,
- uppdatera befintligt projekt utan att skapa dubblett,
- möjlig dubblett kräver användarens val,
- lagringsfel ger tydlig återkoppling.

Testet ska använda det verkliga formulärflödet och inte enbart injicera `project-compass-current-project` direkt.

### 7.8 Playwright – migrering

E2E-tester för migrering ska minst täcka:

- äldre Interview-data hittas,
- användaren ser en begriplig sammanfattning,
- användaren kan välja att skapa nytt projekt,
- användaren kan välja befintligt målprojekt,
- migrerad data visas i rätt projekt,
- legacy-data finns kvar tills verifiering är klar,
- avbruten migrering ändrar inte aktiv state,
- misslyckad migrering kan återställas,
- korrupt data ger felmeddelande och bevaras,
- okänd framtida version blockeras utan överskrivning.

### 7.9 Playwright – centrala regressionsflöden

Befintliga användarkritiska flöden ska fortsätta passera:

- skapa projekt,
- byta aktivt projekt,
- lägga till medlem,
- skapa task,
- tilldela ansvar,
- skapa risk,
- koppla risk till task,
- skapa beslut,
- koppla beslut till task,
- visa Attention Needed,
- visa Project Health,
- visa Recommended Next Step,
- visa Status Report,
- exportera Markdown,
- hantera tomt projekt,
- hantera saknad ansvarig,
- hantera blockerad task.

Tester som bygger på legacy-data ska uppdateras stegvis, inte tas bort utan ersättande skydd.

### 7.10 QA-modulen

Eftersom `testCases` ingår i huvudmodellen ska Data Unification även skydda QA-data.

Nya tester ska minst täcka:

- skapa testfall,
- koppla testfall till task,
- spara efter reload,
- migrering bevarar testfall,
- migrering bevarar `relatedTaskId`,
- saknad relaterad task ger tydlig hantering,
- teststatus bevaras,
- testfall räknas korrekt före och efter migrering.

Integration med Project Map, Project Health och Status Report ska testas när de funktionerna införs, men får inte beskrivas som redan implementerade.

### 7.11 Negativa tester och edge cases

Följande negativa fall ska prioriteras:

- localStorage är otillgängligt,
- `setItem` kastar fel,
- `getItem` returnerar oväntat värde,
- JSON är trunkerad,
- array innehåller `null`,
- objekt saknar id,
- flera objekt har samma id,
- enumvärde är okänt,
- `activeProjectId` pekar på saknat projekt,
- owner refererar till saknad medlem,
- relation refererar till saknad task,
- två projekt har samma namn,
- migreringen avbryts mitt i processen,
- återläsning efter skrivning skiljer sig från föreslagen state.

### 7.12 Manuell testning

Manuell testning ska fokusera på sådant som är svårt att bedöma enbart automatiskt:

- om felmeddelanden är begripliga,
- om användaren förstår skillnaden mellan nytt och befintligt projekt,
- om dubblettvarningen är tydlig,
- om granskningssteget ger tillräcklig kontroll,
- om migrationen känns trygg,
- om återställningsvägen går att förstå,
- om “No active project” hanteras konsekvent,
- om Project Map och Status Report visar samma projekt.

Resultat ska dokumenteras i `docs/manual-test-run.md` eller motsvarande testdokumentation.

### 7.13 Regression och körordning

Rekommenderad körordning efter varje migrationsrelaterad ändring:

1. relevanta enhetstester,
2. relevanta integrationstester,
3. riktade Playwright-tester,
4. `npm run build`,
5. full Playwright-svit,
6. manuell smoke test,
7. `git diff --check`.

Ingen legacy-nyckel får tas bort om full regression inte passerar.

### 7.14 Testevidens

Följande ska sparas som verifierbar evidens:

- testnamn och testscope,
- passerade och misslyckade tester,
- använda migrationsdataset,
- före- och efterräkningar,
- migrationsrapport,
- skärmbilder eller video vid relevanta E2E-fel,
- resultat från rollback-test,
- manuell testlogg,
- byggresultat,
- GitHub Actions-resultat.

### 7.15 Exit-kriterier för testning

Testningen är tillräcklig för implementationens avslut när:

- samtliga beslutade enhets- och integrationstester passerar,
- Project Interview-flödet har verifierat Playwright-skydd,
- migrering och rollback har verifierats,
- korrupt data och okänd version hanteras utan överskrivning,
- QA-data bevaras,
- full Playwright-svit passerar,
- `npm run build` passerar,
- manuell testning inte visar blockerande problem,
- inga kända fall av tyst dataförlust återstår.


## 8. Implementationsordning

### 8.1 Princip

Implementation ska genomföras i små, testbara och reversibla steg.

Varje steg ska:

- ha ett tydligt mål,
- påverka så få filer och flöden som möjligt,
- kunna verifieras isolerat,
- kunna committas separat,
- ha dokumenterade risker,
- inte ta bort legacy-data innan ersättningen är verifierad.

Ingen ny funktion ska byggas ovanpå den gamla dubbla datamodellen om samma behov kan lösas efter eller inom Data Unification-arbetet.

### 8.2 Steg 1 – Verifiera nuläge och modellfält

Före kodändring ska aktuell kod verifieras igen.

Kontrollera särskilt:

- aktuell `ProjectCompassState`,
- aktuell `Project`-typ,
- fält för syfte, mål och leveranser,
- strukturen för medlemmar,
- strukturen för tasks,
- strukturen för risker,
- strukturen för beslut,
- strukturen för testfall,
- alla localStorage-nycklar,
- alla funktioner som läser eller skriver projektdata.

Resultatet ska dokumenteras om det skiljer sig från denna plan.

### 8.3 Steg 2 – Införa schemaVersion i typer och state

Inför `schemaVersion` i huvudmodellen utan att ännu migrera eller radera legacy-data.

Steget ska omfatta:

- uppdaterad TypeScript-typ,
- definierad aktuell version,
- säker default för ny installation,
- load-logik som kan identifiera state utan version,
- tester för känd, saknad och okänd version.

Befintliga användarflöden ska fortsätta fungera.

### 8.4 Steg 3 – Separera läsning, validering och skrivning

Skapa tydliga funktioner för:

- läsa rå localStorage-data,
- tolka JSON,
- identifiera schema,
- validera state,
- normalisera tillåtna saknade värden,
- skriva state,
- läsa tillbaka och verifiera.

Dessa funktioner ska hållas så rena och isolerade som möjligt.

Ingen migration ska ännu skriva över legacy-data.

### 8.5 Steg 4 – Införa backup och migrationsrapport

Inför funktioner för:

- rå backup av berörda nycklar,
- migrations-id,
- före- och efterräkningar,
- varningar,
- konflikter,
- fel,
- rollback-resultat.

Backup ska verifieras innan transformering införs.

### 8.6 Steg 5 – Bygga migrationsfunktioner utan UI

Implementera rena migrationsfunktioner för:

- huvudstate utan `schemaVersion`,
- saknade projektsamlingar,
- ogiltigt `activeProjectId`,
- Project Interview-data,
- separata tasks,
- separata risker,
- separata beslut.

Funktionerna ska först testas mot definierade dataset utan att kopplas till automatisk körning i appen.

### 8.7 Steg 6 – Införa validering och blockerande regler

Inför validering av föreslagen migrerad state.

Valideringen ska kunna skilja mellan:

- godkänd,
- godkänd med varningar,
- blockerad.

Skrivning ska vara förbjuden när resultatet är blockerande.

### 8.8 Steg 7 – Införa rollback

Implementera och testa rollback innan första verkliga migreringen aktiveras.

Rollback ska:

- återställa originalnycklar,
- återställa originalvärden,
- ta bort felaktigt skapad state,
- verifiera återläsning,
- rapportera resultatet.

### 8.9 Steg 8 – Migrera säkra huvudstate-varianter

Aktivera först migration för låg-risk-fall:

- state utan `schemaVersion`,
- state med saknade tomma arrayer,
- giltig state med ogiltigt `activeProjectId`,
- kända äldre huvudstate-format.

Legacy-nycklar ska fortfarande lämnas orörda.

### 8.10 Steg 9 – Integrera Project Interview med nytt projekt

Ändra Project Interview så att det kan skapa ett riktigt projekt i huvudmodellen.

Fokus i första delsteget:

- projektnamn,
- syfte,
- mål,
- leveranser,
- aktivt projekt,
- korrekt navigation,
- persistens efter reload.

Risker och beslut kan fortsatt visas som utkast tills granskningsflödet är klart.

### 8.11 Steg 10 – Uppdatera befintligt projekt via Project Interview

Lägg därefter till möjlighet att:

- välja befintligt projekt,
- visa aktuell data,
- förhandsgranska ändringar,
- uppdatera utan dubblett,
- avbryta utan skrivning.

### 8.12 Steg 11 – Migrera äldre Project Interview-data

Aktivera kontrollerad migrering av `project-compass-current-project`.

Användaren ska kunna:

- se hittad data,
- välja nytt eller befintligt projekt,
- granska mappningen,
- avstå,
- återställa vid fel.

Automatisk sammanslagning ska endast ske vid verifierat säker matchning.

### 8.13 Steg 12 – Migrera separata tasks, risker och beslut

Migrera de separata legacy-nycklarna först när ett säkert målprojekt har identifierats.

Arbetet bör delas upp:

1. tasks,
2. risker,
3. beslut.

Varje objekttyp ska få egna tester och egen commit.

### 8.14 Steg 13 – Enhetliggör läsning i vyerna

När huvudmodellen innehåller nödvändig projektdata ska följande vyer uppdateras till att läsa från samma aktiva projekt:

- AppHeader,
- Project Map,
- Status Report,
- Attention Needed,
- Project Health,
- Recommended Next Step.

Direkt läsning från `project-compass-current-project` ska tas bort stegvis.

### 8.15 Steg 14 – Verifiera QA-data

Kontrollera att testfall och relationer bevaras genom hela migreringen.

Verifiera särskilt:

- `testCases`,
- teststatus,
- `relatedTaskId`,
- saknade task-referenser,
- persistens efter reload.

Detta steg ska inte automatiskt innebära full integration av QA-modulen i Project Health eller Status Report. Sådana funktioner ska hanteras i separat scope.

### 8.16 Steg 15 – Full regression och manuell verifiering

När alla läsflöden använder huvudmodellen ska följande köras:

1. enhetstester,
2. integrationstester,
3. riktade Playwright-tester,
4. `npm run build`,
5. full Playwright-svit,
6. manuell smoke test,
7. backup- och rollback-test,
8. `git diff --check`.

Kända avvikelser ska dokumenteras innan nästa steg.

### 8.17 Steg 16 – Pensionera legacy-läsning

Först efter godkänd regression får legacy-läsning tas bort från produktionsflöden.

Detta ska ske i separata ändringar för:

- Project Interview-nyckeln,
- tasks-nyckeln,
- risks-nyckeln,
- decisions-nyckeln.

Backup och migrationsrapport ska fortfarande finnas kvar under verifieringsperioden.

### 8.18 Steg 17 – Ta bort legacy-nycklar

Själva borttagningen av gamla localStorage-nycklar ska vara ett separat och sista steg.

Det får endast ske när:

- ingen aktiv kod läser nycklarna,
- all data har migrerats eller användaren uttryckligen avstått,
- rollback har verifierats,
- full regression passerar,
- manuell kontroll är godkänd,
- borttagningen är dokumenterad.

### 8.19 Rekommenderad commit-struktur

Arbetet bör delas upp i tydliga commits, exempelvis:

- `Add schema version to project state`
- `Add project state validation`
- `Add migration backup and rollback`
- `Add legacy project migration tests`
- `Integrate Project Interview with project state`
- `Migrate legacy tasks into active project`
- `Migrate legacy risks into active project`
- `Migrate legacy decisions into active project`
- `Use unified project data in Project Map`
- `Use unified project data in Status Report`
- `Retire legacy project storage reads`
- `Remove verified legacy storage keys`

Exakta commit-meddelanden ska beskriva den faktiska ändringen och får justeras.

### 8.20 Stoppregler

Implementation ska pausas om:

- backup inte kan verifieras,
- rollback misslyckas,
- valideringen inte kan skilja fel från tom data,
- migreringen skapar dubbletter,
- relationer tappas,
- Playwright-regression uppstår utan förklarad orsak,
- korrupt data skrivs över,
- scope växer till backend, autentisering eller större redesign,
- den faktiska koden avviker väsentligt från planens verifierade nuläge.

Vid stopp ska ny kod inte fortsätta byggas ovanpå ett osäkert tillstånd.


## 9. Definition of Done

Data Unification Plan är färdig när följande är uppfyllt.

### 9.1 Beslutsunderlag

- beslutsproblemet är tydligt formulerat,
- verifierat nuläge är dokumenterat,
- alla fyra huvudalternativ är jämförda,
- fördelar och nackdelar är beskrivna,
- datarisker är beskrivna,
- komplexitet och testbarhet är bedömda,
- påverkan på användare och befintliga tester är beskriven,
- rekommenderad målmodell är motiverad.

### 9.2 Målmodell

- framtida källa till sanning är definierad,
- rollen för `project-compass-state` är tydlig,
- rollen för `activeProjectId` är tydlig,
- `schemaVersion` ingår i målbilden,
- Project Interview är definierat som användarflöde och inte separat permanent projektmodell,
- legacy-nycklarnas framtid är beslutad,
- permanenta parallella skrivningar är uttryckligen avvisade.

### 9.3 Migreringsstrategi

- befintliga localStorage-nycklar ska identifieras före migrering,
- rå backup ska skapas före transformering,
- transformering ska ske innan skrivning,
- validering ska ske både före och efter skrivning,
- dubbletter och konflikter ska hanteras,
- korrupt JSON ska bevaras och inte behandlas som tom data,
- saknade och okända värden ska hanteras genom dokumenterade regler,
- rollback ska vara definierad,
- legacy-data får inte tas bort före verifiering,
- tyst dataförlust ska vara ett blockerande fel.

### 9.4 Project Interview

- flödet för att skapa nytt projekt är definierat,
- flödet för att uppdatera befintligt projekt är definierat,
- mappning av projektnamn, syfte, mål och leveranser är beskriven,
- möjliga dubbletter ska granskas,
- risker och beslut ska behandlas som förslag tills användaren bekräftar,
- befintlig Interview-data ska kunna migreras eller lämnas orörd utan dataförlust,
- AppHeader, Project Map och Status Report ska använda samma projekt efter integrationen.

### 9.5 Teststrategi

- enhetstester är definierade,
- datadrivna migrationsfall är definierade,
- integrationstester för localStorage är definierade,
- backup- och rollback-tester är definierade,
- Playwright-tester för Project Interview är definierade,
- Playwright-tester för migrering är definierade,
- centrala regressionsflöden är identifierade,
- QA-data och testfall ingår i teststrategin,
- negativa fall och edge cases är dokumenterade,
- manuell testning och testevidens är definierade,
- exit-kriterier för testningen är dokumenterade.

### 9.6 Implementationsordning

- implementationen är uppdelad i små steg,
- varje steg kan testas och committas separat,
- backup och rollback kommer före borttagning av legacy-data,
- Project Interview integreras innan legacy-spåret pensioneras,
- vyerna flyttas stegvis till huvudmodellen,
- full regression sker före borttagning av gamla nycklar,
- stoppregler är dokumenterade,
- inga kodändringar ingår i själva planeringsuppdraget.

### 9.7 Dokumentkvalitet

- dokumentet skiljer mellan verifierat nuläge, rekommendation och framtida implementation,
- inga funktioner beskrivs som implementerade utan verifiering,
- antaganden är tydligt markerade,
- terminologin är konsekvent,
- Markdown-formatet är giltigt,
- `git diff --check` passerar,
- dokumentet kan förstås av en lärare, handledare, LIA-kontakt eller rekryterare utan tillgång till hela chattkontexten.

### 9.8 AI Review och återrapportering

- AI Review #002 innehåller uppgift, kontext, risker och mänsklig granskning,
- AI Review #002 uppdateras med accepterat, ändrat och avvisat,
- AI Review #002 beskriver hur resultatet verifierades,
- AI Review #002 avslutas först när planen är färdiggranskad,
- dokumentändringarna committas med tydligt commit-meddelande,
- ändringarna pushas till `origin/master`,
- slutligt `git status` är clean.

### 9.9 Godkännande

Planen är godkänd när den kan användas som styrande underlag för nästa implementation utan att utvecklaren behöver gissa:

- vilken modell som ska vara källa till sanning,
- hur äldre data ska skyddas,
- hur migrering och rollback ska fungera,
- hur Project Interview ska integreras,
- vilka tester som krävs,
- i vilken ordning arbetet ska genomföras,
- vad som uttryckligen inte ingår i scope.


## 10. Inte i scope

Följande ingår inte i Data Unification Plan eller den första implementationen som följer av planen.

### 10.1 Backend och serverlagring

Arbetet omfattar inte:

- databas,
- API för beständig lagring,
- server-side persistence,
- synkronisering mellan enheter,
- molnbackup,
- fleranvändardata.

Data Unification ska först lösa den lokala datamodellen och localStorage-hanteringen.

### 10.2 Autentisering och behörighet

Arbetet omfattar inte:

- inloggning,
- användarkonton,
- sessionshantering,
- roller och behörigheter,
- åtkomstkontroll,
- organisationer eller teamkonton.

Befintliga projektroller och ansvar i projektdata ska inte blandas ihop med teknisk behörighetsstyrning.

### 10.3 Realtid och samarbete

Arbetet omfattar inte:

- realtidsuppdateringar,
- samtidig redigering,
- konflikthantering mellan flera användare,
- kommentarer i realtid,
- notifieringar mellan användare,
- delning via länk.

Klassrumspilot och fortsatt produktutveckling ska inte göras beroende av fleranvändararkitektur i detta steg.

### 10.4 Ny AI-funktionalitet

Arbetet omfattar inte:

- AI-genererad Project Health,
- automatisk AI-bedömning av projektstatus,
- AI-genererade testresultat,
- automatisk AI-prioritering av risker,
- prediktiv riskmodell,
- autonom projektagent,
- AI-baserade beslut utan mänsklig granskning.

Eventuell framtida AI-funktionalitet ska bygga på en stabil och verifierad datamodell.

### 10.5 RAG och agentarkitektur

Arbetet omfattar inte:

- retrieval-augmented generation,
- vektordatabas,
- embeddings,
- dokumentindexering,
- agentorkestrering,
- autonoma verktygsanrop,
- långvarigt AI-minne.

Dessa lösningar saknar verifierat behov inom Data Unification-scope.

### 10.6 Större visuell redesign

Arbetet omfattar inte:

- fullständig redesign av navigation,
- nytt designsystem,
- större layoutförändringar,
- nytt visuellt varumärke,
- omfattande mobilanpassning,
- generell UI-polish utanför de flöden som behöver tydlig migrations- eller felåterkoppling.

Mindre UI-förändringar får göras när de krävs för säker migrering, bekräftelse, felhantering eller val av målprojekt.

### 10.7 Full QA-modul

Arbetet omfattar inte full utveckling av QA-modulen.

Det innebär att följande ligger utanför detta scope:

- full Test Case CRUD,
- bug- eller issue-logg,
- regression suite,
- test summary report,
- integration med Playwright-resultat,
- full integration i Project Health,
- full integration i Status Report,
- full integration i Project Map.

Data Unification ska däremot säkerställa att befintliga `testCases` och deras relationer inte förloras.

### 10.8 Full CRUD för alla objekt

Arbetet omfattar inte generell implementation av:

- edit för alla objekt,
- delete för alla objekt,
- bulk actions,
- avancerad sortering,
- avancerad filtrering.

Sådana funktioner ska hanteras i separata roadmap-steg.

### 10.9 Import och export som produktfunktion

Arbetet omfattar inte en full användarvänlig import/export-funktion för hela appen.

Planen omfattar endast den backup och återställning som krävs för säker migrering och rollback.

En framtida generell JSON-export/import ska planeras separat.

### 10.10 PDF och externa integrationer

Arbetet omfattar inte:

- PDF-export,
- integration med Jira,
- integration med Trello,
- integration med Taiga,
- integration med ReQtest,
- integration med GitHub Issues,
- integration med Slack eller Teams.

Befintlig Markdown-export ska endast regressionstestas där den påverkas av Data Unification.

### 10.11 Nya projektledningsmoduler

Arbetet omfattar inte nya större moduler såsom:

- budget,
- tidrapportering,
- Gantt-schema,
- resursplanering,
- beroendehantering på portföljnivå,
- avancerad roadmap,
- organisationsdashboard.

Data Unification ska stärka befintlig projektklarhet, inte bredda produkten.

### 10.12 Scope-princip

En föreslagen ändring ska avvisas eller flyttas till separat uppdrag om den inte är nödvändig för att:

- skapa en källa till sanning,
- skydda befintlig data,
- migrera legacy-data,
- integrera Project Interview,
- validera state,
- möjliggöra backup och rollback,
- bevara befintliga användarkritiska flöden,
- verifiera resultatet genom tester.

Data Unification ska avslutas som ett avgränsat arkitektur- och kvalitetsarbete innan större nya funktioner påbörjas.
