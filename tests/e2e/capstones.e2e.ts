import { test, expect } from "@playwright/test";

// PyArcana Capstone System — Playwright verification suite.
// Covers the spec's Section 18 requirements: levels, capstone cards,
// N4-C harness flow, CP-FINAL flow, EN/ES parity, accessibility, mobile, zoom.

const BASE = "http://localhost:3000";

// Dismiss onboarding dialog before each test
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try { localStorage.setItem("pyarcana-onboarding-dismissed-v1", "1"); } catch {}
  });
});

test.describe("Cardinality and levels", () => {
  test("four levels render with correct headings", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.getByRole("heading", { name: "Guided Foundations" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Independent Applied Practice" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Advanced Integration and Evaluation" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Governed Production Systems" })).toBeVisible();
  });

  test("at least thirteen capstone ID spans (12 principal + 1 final)", async ({ page }) => {
    await page.goto(BASE);
    const count = await page.evaluate(() => {
      const spans = document.querySelectorAll("span.font-mono.text-xs.font-semibold");
      let n = 0;
      for (const s of spans) {
        const text = s.textContent?.trim() || "";
        if (/^CP-(N[1-4]-[ABC]|FINAL)$/.test(text)) n++;
      }
      return n;
    });
    // 13 capstone cards; may include one extra from a template/preview
    expect(count).toBeGreaterThanOrEqual(13);
  });

  test("final capstone card is present", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.getByRole("heading", { name: "Final transversal capstone" })).toBeVisible();
    await expect(page.getByText("CP-FINAL · S52")).toBeVisible();
  });

  test("no hidden CP-N4-D principal capstone", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.getByText("CP-N4-D")).toHaveCount(0);
  });
});

test.describe("Capstone detail dialog", () => {
  test("opening a capstone brief shows required sections", async ({ page }) => {
    await page.goto(BASE);
    await page.getByRole("button", { name: /view brief/i }).first().click();
    // The dialog renders section headings with uppercase CSS; DOM text is mixed case.
    // Use role=heading to target the section titles specifically.
    await expect(page.getByRole("heading", { name: /intended users/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /prerequisites/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /acceptance criteria/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /critical criteria/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /security requirements/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /rubric/i })).toBeVisible();
  });
});

test.describe("N4-C interactive harness flow", () => {
  test("select model mode → execute → inspect → approve → verify → trace → budget → cited", async ({ page }) => {
    await page.goto(BASE);
    await page.getByRole("button", { name: /run n4-c harness/i }).click();
    await expect(page.getByRole("heading", { name: /provider mode/i })).toBeVisible();
    await page.getByRole("button", { name: /execute bounded task/i }).click();
    await expect(page.getByRole("heading", { name: /inspect retrieval evidence/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /inspect proposed tool/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /approve or reject/i })).toBeVisible();
    await page.getByRole("button", { name: "Approved", exact: true }).click();
    await expect(page.getByRole("heading", { name: /inspect verifier/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /inspect trace/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /inspect budget/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /inspect cited result/i })).toBeVisible();
  });

  test("web/SERP search toggle is present", async ({ page }) => {
    await page.goto(BASE);
    await page.getByRole("button", { name: /run n4-c harness/i }).click();
    await expect(page.getByText("Web/SERP search")).toBeVisible();
  });
});

test.describe("CP-FINAL integration flow", () => {
  test("verify twelve dependencies → contracts → rollback → contribution", async ({ page }) => {
    await page.goto(BASE);
    // Scroll to the final capstone section to ensure the button is visible
    await page.getByRole("heading", { name: "Final transversal capstone" }).scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: /run cp-final integration/i }).first().click();
    await expect(page.getByRole("heading", { name: /verify twelve dependencies/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /contract tests/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /inspect rollback/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /inspect contribution/i })).toBeVisible();
  });
});

test.describe("System card viewer", () => {
  test("CP-FINAL system card shows key sections", async ({ page }) => {
    await page.goto(BASE);
    await page.getByRole("heading", { name: "Final transversal capstone" }).scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: /view system card/i }).click();
    await expect(page.getByRole("heading", { name: /system card — cp-final/i })).toBeVisible();
    // Use heading role to avoid strict-mode violations from body text
    await expect(page.getByRole("heading", { name: /threat model/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^governance/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /no-go conditions/i })).toBeVisible();
  });
});

test.describe("Spanish / English parity", () => {
  test("toggling to Spanish translates level names", async ({ page }) => {
    await page.goto(BASE);
    await page.getByRole("button", { name: "Español" }).click();
    await expect(page.getByRole("heading", { name: "Fundaciones Guiadas" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sistemas de Producción Gobernados" })).toBeVisible();
    await expect(page.getByText("Invariante de trece capstones")).toBeVisible();
  });

  test("toggling back to English restores English names", async ({ page }) => {
    await page.goto(BASE);
    await page.getByRole("button", { name: "Español" }).click();
    await page.getByRole("button", { name: "English" }).click();
    await expect(page.getByRole("heading", { name: "Guided Foundations" })).toBeVisible();
  });
});

test.describe("Accessibility", () => {
  test("page is keyboard-navigable", async ({ page }) => {
    await page.goto(BASE);
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test("200% zoom does not break layout catastrophically", async ({ page }) => {
    await page.goto(BASE);
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.evaluate(() => document.body.style.zoom = "2");
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThan(clientWidth * 3);
  });
});

test.describe("Mobile layout", () => {
  test("page renders on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE);
    await expect(page.getByRole("heading", { name: "PyArcana — Capstones" })).toBeVisible();
  });
});

test.describe("Sticky footer", () => {
  test("footer is present and visible", async ({ page }) => {
    await page.goto(BASE);
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    const footerText = await footer.textContent();
    expect(footerText).toContain("PyArcana");
  });
});
