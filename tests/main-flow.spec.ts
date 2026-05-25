import { test, expect } from "@playwright/test";

test("user can create a project and see the status report", async ({ page }) => {
  await page.goto("/");

  await page.evaluate(() => {
    localStorage.clear();
  });

  await page.reload();

  await page.getByRole("link", { name: "Skapa nytt projekt" }).click();

  await expect(
    page.getByRole("heading", { name: "Projektintervju" }),
  ).toBeVisible();

  await page
    .getByPlaceholder("Exempel: Införa nytt arbetssätt")
    .fill("Automatiserat testprojekt");

  await page
    .getByPlaceholder("Beskriv syftet med projektet.")
    .fill("Kontrollera att huvudflödet fungerar med Playwright.");

  await page
    .getByPlaceholder("Beskriv projektets mål eller effekt.")
    .fill("Säkerställa att data kan skapas och visas i rapporten.");

  await page
    .getByPlaceholder(
      "Exempel: rapport, prototyp, beslut, utbildning, system, evenemang.",
    )
    .fill("Projektkarta, arbetsyta, riskregister, beslutslogg och rapport.");

  await page
    .getByPlaceholder("Beskriv risker, hinder eller osäkerheter.")
    .fill("Navigation eller sparad data kan sluta fungera.");

  await page
    .getByPlaceholder("Beskriv viktiga beslut som projektet är beroende av.")
    .fill("Beslut om att automatisera huvudflödet.");

  await Promise.all([
    page.waitForURL("**/project-map"),
    page.getByRole("button", { name: "Skapa projektkarta" }).click(),
  ]);

  await expect(
    page.getByRole("heading", { name: "Projektkarta" }),
  ).toBeVisible();

  await expect(page.getByText("Automatiserat testprojekt")).toBeVisible();

  await Promise.all([
    page.waitForURL("**/project-board"),
    page.getByRole("link", { name: "Gå till arbetsyta" }).click(),
  ]);

  await expect(
    page.getByRole("heading", { name: "Arbetsyta" }),
  ).toBeVisible();

  await page
    .getByPlaceholder("Exempel: Skriv första rapportutkastet")
    .fill("Skapa automatiserat huvudflödestest");

  await page
    .getByPlaceholder("Kort beskrivning av uppgiften")
    .fill("Testar projektets viktigaste användarresa.");

  const taskForm = page.locator("form").filter({ hasText: "Skapa uppgift" });
  await taskForm.locator("select").selectOption("planned");

  await page.getByRole("button", { name: "Lägg till uppgift" }).click();

  await expect(
    page.getByText("Skapa automatiserat huvudflödestest"),
  ).toBeVisible();

  await page.goto("/project-risks");

  await expect(
    page.getByRole("heading", { name: "Riskvy" }),
  ).toBeVisible();

  await page
    .getByPlaceholder("Exempel: Gruppen hinner inte klart i tid")
    .fill("Automatiserat flöde kan brytas");

  await page.getByPlaceholder("Exempel: Johan").fill("Johan");

  await page
    .getByPlaceholder("Beskriv vad som kan gå fel och varför det spelar roll.")
    .fill("Om navigation eller localStorage ändras kan testet misslyckas.");

  const riskForm = page.locator("form").filter({ hasText: "Skapa risk" });
  const riskSelects = riskForm.locator("select");

  await riskSelects.nth(0).selectOption("medium");
  await riskSelects.nth(1).selectOption("high");
  await riskSelects.nth(2).selectOption("open");

  await page
    .getByPlaceholder(
      "Vad gör vi för att minska risken eller hantera den om den inträffar?",
    )
    .fill("Kör regressionstest efter större ändringar.");

await riskForm.getByRole("button", { name: "Lägg till risk" }).click();

await expect
  .poll(async () => {
    return page.evaluate(() => {
      const savedRisks = localStorage.getItem("project-compass-risks");
      const risks = savedRisks ? JSON.parse(savedRisks) : [];

      return risks.some(
        (risk: { title: string }) =>
          risk.title === "Automatiserat flöde kan brytas",
      );
    });
  })
  .toBe(true);

await page.reload();

await expect(
  page.getByText("Automatiserat flöde kan brytas"),
).toBeVisible();

await page.goto("/project-decisions");

  await expect(
    page.getByRole("heading", { name: "Beslutsvy" }),
  ).toBeVisible();

  await page
    .getByPlaceholder("Exempel: Välja presentationsupplägg")
    .fill("Automatisera huvudflödet");

  await page.getByPlaceholder("Exempel: Johan").fill("Johan");

  await page
    .getByPlaceholder("Beskriv vilket beslut som behöver fattas.")
    .fill("Beslut om att huvudflödet ska täckas av Playwright.");

  await page
    .getByPlaceholder(
      "Vad påverkas av beslutet? Tid, kvalitet, ansvar, omfattning eller nästa steg?",
    )
    .fill("Ger bättre regressionstestning och starkare QA-portfolio.");

  await page.getByRole("button", { name: "Lägg till beslut" }).click();

  await expect(
    page.getByRole("heading", { name: "Automatisera huvudflödet" }),
  ).toBeVisible();

  await page.goto("/project-report");

  await expect(
    page.getByRole("heading", { name: "Statusrapport" }),
  ).toBeVisible();

  await expect(
    page.getByText("Projekt: Automatiserat testprojekt"),
  ).toBeVisible();

  await expect(page.getByText("Samlad projektstatus")).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Öppna risker" }),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Öppna beslut" }),
  ).toBeVisible();
});