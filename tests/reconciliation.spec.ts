import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const syncName = "Đồng bộ & đối soát";

test("reconciliation starts empty, syncs a consistent ledger and opens matched and mismatched evidence", async ({
  page,
}) => {
  await page.goto("/reconciliation");
  await expect(page.getByText("0 giao dịch · Chưa đồng bộ")).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator(".reconciliation-ledger tbody tr")).toHaveCount(0);
  await page.getByRole("button", { name: syncName, exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Đang mô phỏng tải sao kê" }),
  ).toBeVisible();
  await expect(page.locator(".reconciliation-ledger tbody tr")).toHaveCount(6);
  const studio = page.getByRole("button", {
    name: "Xem đối chiếu STUDIO SANG HD 126",
    exact: true,
  });
  await studio.click();
  const dialog = page.getByRole("dialog", {
    name: "Chi tiết đối soát",
    exact: true,
  });
  await expect(dialog).toContainText("Đã ghép:");
  await expect(dialog).toContainText("26.400.000");
  await expect(dialog.locator(".comparison-identities")).toContainText(
    "DEMO-0317000126",
  );
  await expect(
    dialog.locator(".comparison-checks").getByText("0 ₫", { exact: true }),
  ).toBeVisible();
  await expect(dialog).toContainText("hoa-don-studio.pdf");
  await dialog.getByText("Xem bản ghi giao dịch chuẩn hóa").click();
  await expect(dialog.locator("pre")).toContainText('"amount": 26400000');
  await expect(dialog.locator("pre")).toContainText(
    '"counterpartyTaxId": "DEMO-0317000126"',
  );
  await dialog.getByRole("button", { name: "Chứng từ", exact: true }).click();
  await expect(
    dialog.getByRole("region", {
      name: "Chứng từ hóa đơn mô phỏng, cuộn để xem",
    }),
  ).toBeVisible();
  await dialog
    .getByText("Xem đầy đủ hóa đơn #0000126", { exact: true })
    .click();
  await expect(dialog).toContainText("Dàn trang, hiệu chỉnh màu");
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
  await expect(studio).toBeFocused();
  await page
    .getByRole("button", { name: "Xem đối chiếu AN NHIEN HD 127", exact: true })
    .click();
  await expect(dialog).toContainText("Số tiền thanh toán khác số tiền ghi Có");
  await expect(dialog.locator(".comparison-checks")).toContainText("350.000");
  await expect(dialog).toContainText("20.350.000");
  await expect(dialog.locator(".comparison-identities")).toContainText(
    "DEMO-0317000127",
  );
  await page.getByRole("button", { name: "Đóng hộp thoại" }).click();
  await page.getByRole("button", { name: "Chưa khớp", exact: true }).click();
  await expect(page.locator(".reconciliation-ledger tbody tr")).toHaveCount(2);
  const differences = await page
    .locator(".reconciliation-ledger tbody .amount-difference")
    .allTextContents();
  expect(differences).toHaveLength(2);
  expect(differences.join(" ")).toContain("4.500.000");
  await page.reload();
  await expect(page.locator(".reconciliation-ledger tbody tr")).toHaveCount(6);
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("visualize-tax:demo:v1")!),
  );
  expect(stored.bankSync.transactions).toHaveLength(6);
  expect(stored.matchedIds).toHaveLength(4);
  await page.getByRole("button", { name: syncName, exact: true }).click();
  await expect(
    page.getByRole("button", { name: syncName, exact: true }),
  ).toBeEnabled();
  await expect(page.locator(".reconciliation-ledger tbody tr")).toHaveCount(6);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
});

test("reset cancels pending bank sync and clears completed reconciliation", async ({
  page,
}) => {
  await page.goto("/reconciliation");
  await page.getByRole("button", { name: syncName, exact: true }).click();
  await page
    .getByRole("button", { name: "Đặt lại toàn bộ trạng thái" })
    .click();
  await page.waitForTimeout(2000);
  await page.goto("/reconciliation");
  await expect(page.getByText("0 giao dịch · Chưa đồng bộ")).toBeVisible();
  await page.getByRole("button", { name: syncName, exact: true }).click();
  await expect(page.locator(".reconciliation-ledger tbody tr")).toHaveCount(6);
  await page
    .getByRole("button", { name: "Đặt lại toàn bộ trạng thái" })
    .click();
  await page.goto("/reconciliation");
  await expect(page.locator(".reconciliation-ledger tbody tr")).toHaveCount(0);
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    axe.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});

test("legacy saved workspace retains invoices but does not invent a bank synchronization", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Đặt lại toàn bộ trạng thái" }),
  ).toBeEnabled();
  await page.evaluate(() => {
    const key = "visualize-tax:demo:v1",
      s = JSON.parse(localStorage.getItem(key)!);
    delete s.bankSync;
    s.matchedIds = ["inv-03", "inv-04", "inv-06"];
    localStorage.setItem(key, JSON.stringify(s));
  });
  await page.goto("/reconciliation");
  await expect(page.getByText("0 giao dịch · Chưa đồng bộ")).toBeVisible();
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("visualize-tax:demo:v1")!),
  );
  expect(stored.invoices).toHaveLength(6);
  expect(stored.matchedIds).toHaveLength(0);
});
