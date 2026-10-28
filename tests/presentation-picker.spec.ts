import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("presentation chooser explains both scenarios and closes without changing data", async ({
  page,
}) => {
  await page.goto("/assistant");
  const start = page.getByRole("button", {
    name: "Chạy trình diễn",
    exact: true,
  });
  await expect(start).toBeEnabled();
  const before = await page.evaluate(() =>
    localStorage.getItem("visualize-tax:demo:v1"),
  );
  await start.click();
  const dialog = page.getByRole("dialog", {
    name: "Chọn kịch bản trình diễn",
    exact: true,
  });
  await expect(
    dialog.getByRole("button", {
      name: "Chạy kịch bản 1: Trợ lý thuế",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    dialog.getByRole("button", {
      name: "Chạy kịch bản 2: Đồng bộ & đối soát",
      exact: true,
    }),
  ).toBeVisible();
  await expect(dialog).toContainText("01/GTGT");
  await expect(dialog).toContainText("MST, tổng thanh toán");
  await expect(dialog).toContainText("đặt lại thay đổi trước đó");
  await expect(
    page.getByRole("region", { name: "Trình diễn tự động" }),
  ).toHaveCount(0);
  const axe = await new AxeBuilder({ page })
    .include('[role="dialog"]')
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    axe.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(start).toBeFocused();
  expect(
    await page.evaluate(() => localStorage.getItem("visualize-tax:demo:v1")),
  ).toBe(before);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
});

test("reconciliation presentation can stop during loading without running assistant", async ({
  page,
}) => {
  await page.goto("/assistant");
  await page
    .getByRole("button", { name: "Chạy trình diễn", exact: true })
    .click();
  await page.locator('[data-tour="choose-reconciliation"]').click();
  await expect(page.locator('[data-tour="sync-loading"]')).toBeVisible();
  await expect(page.locator(".tour-step")).toContainText("/ 3");
  await page
    .getByRole("button", { name: "Dừng trình diễn", exact: true })
    .first()
    .click();
  await expect(page.locator(".application")).not.toHaveAttribute("inert", "");
  await page.waitForTimeout(2000);
  await expect(page.locator(".reconciliation-ledger tbody tr")).toHaveCount(0);
  const state = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("visualize-tax:demo:v1")!),
  );
  expect(state.messages).toHaveLength(0);
  expect(state.declarations).toHaveLength(0);
  expect(state.bankSync).toBeUndefined();
});
