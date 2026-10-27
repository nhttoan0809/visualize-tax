import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("reconciliation exposes bank source, scanned invoice, extracted fields and reasons", async ({
  page,
}) => {
  await page.goto("/reconciliation");
  const inspector = page.getByRole("region", {
    name: "Đối chiếu chứng từ và giao dịch",
    exact: true,
  });
  await expect(inspector).toContainText("STUDIO SANG");
  await expect(inspector).toContainText("26.400.000");
  await expect(inspector).toContainText("Đã ghép:");
  await inspector
    .getByRole("button", { name: "Dữ liệu trích xuất", exact: true })
    .click();
  await expect(inspector).toContainText("hoa-don-studio.pdf");
  await expect(inspector).toContainText("24.000.000");
  await expect(inspector).toContainText("2.400.000");
  await inspector.getByText("Xem bản ghi giao dịch chuẩn hóa").click();
  await expect(inspector.locator("pre")).toContainText('"amount": 26400000');
  await inspector.getByRole("button", { name: "Mở đầy đủ" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "Dàn trang, hiệu chỉnh màu",
  );
  await page.getByRole("button", { name: "Đóng hộp thoại" }).click();
  await page
    .getByRole("button", { name: "Xem đối chiếu AN NHIEN HD 127", exact: true })
    .click();
  await expect(inspector).toContainText("hóa đơn chưa duyệt");
  await page
    .getByRole("button", {
      name: "Xem đối chiếu Giao dich chua co hoa don",
      exact: true,
    })
    .click();
  await expect(inspector).toContainText("Chưa tìm thấy hóa đơn nguồn");
  await expect(inspector).toContainText("8.500.000");
  await page
    .getByRole("button", {
      name: "Xem đối chiếu STUDIO SANG HD 126",
      exact: true,
    })
    .click();
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    axe.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
});
