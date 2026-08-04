# AI Review Log

## AI Review #001 – Project Compass V1 Quality and Competency Map

**Datum:** 4 augusti 2026  
**Projekt:** Project Compass  
**AI-modell:** ChatGPT, GPT-5.6 Thinking  
**Status:** Pågående

### Uppgift

Använda AI som stöd för att formulera Project Compass Version 1:s centrala användarscenarier, kvalitetsrisker, kompetensmål, verifieringsmetoder och avgränsning inför en möjlig klassrumspilot.

### Verifierad kontext

- Repositoryt är rent och uppdaterat.
- Node 24 används genom `.nvmrc`.
- `npm ci` passerar.
- `npm run build` passerar.
- GitHub Actions är grön.
- Playwright-baslinjen passerar med 2 tester.
- `CURRENT_STATE.md` är skapat och pushat.
- Klasskamrater har uttryckt intresse för att prova Project Compass i skolans projektarbete.

### Kontext som delades med AI

- Roadmap mot AI-Native Quality Engineer 2028.
- Projektets arbetssätt och WIP-principer.
- Den verifierade tekniska baslinjen.
- Målet att göra Project Compass pilotbar utan att bygga full fleranvändararkitektur för tidigt.
- Behov av projektmedlemmar, roller, ansvar, lagring, backup och kvalitetsspårbarhet.

### Vad AI ska bidra med

- Förslag på tre centrala användarscenarier.
- Identifiering av användar-, produkt-, data- och kvalitetsrisker.
- Förslag på kompetenser som arbetet kan utveckla.
- Förslag på verifierbar evidens.
- Möjliga AI-bidrag i varje scenario.
- Avgränsning mellan V1 Must, pilotexperiment och senare.

### Mänsklig granskning

AI:s förslag får inte behandlas som verifierade fakta om aktuell kod eller produktstatus.

Jag ska kontrollera:

- att föreslagna användarscenarier löser verkliga behov,
- att riskerna är relevanta och inte påhittade,
- att befintliga funktioner verifieras i aktuell kod,
- att testorakel och acceptanskriterier är rimliga,
- att scope ryms inom roadmap och veckokapacitet,
- att AI inte driver fram onödig backend, auth, RAG eller agentarkitektur.

### Accepterat

Fylls i efter arbetspasset.

### Ändrat

Fylls i efter arbetspasset.

### Avvisat

Fylls i efter arbetspasset.

### Hur resultatet verifierades

Fylls i efter arbetspasset med hänvisning till:

- aktuell kod,
- terminalresultat,
- tester,
- dokument,
- användarfeedback,
- produktbeslut.

### Risk för falskt eller missvisande resultat

- AI kan anta att funktioner redan finns.
- AI kan föreslå överbyggd arkitektur.
- AI kan skapa testfall med felaktiga förväntade resultat.
- AI kan blanda framtida mål med verifierat nuläge.
- Ett välformulerat svar kan låta mer säkert än underlaget medger.

### Kvarvarande antaganden

- Exakt vilka pilotfunktioner som redan fungerar behöver verifieras.
- Hur klasskamraterna vill använda appen behöver undersökas.
- Behovet av delad redigering från flera enheter är ännu inte verifierat.
- AI Review-funktionens användarvärde är ännu inte verifierat.

### Informationssäkerhet

Ingen hemlighet, autentiseringsuppgift, känslig persondata eller intern skolinformation ska delas med AI-tjänsten.

Endast nödvändig produkt-, kod- och testkontext används.
