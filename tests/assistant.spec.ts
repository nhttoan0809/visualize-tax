import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("assistant handles invoice image, chart and both declaration forms in one conversation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/assistant");
  await page
    .getByRole("button", { name: "Đính kèm hóa đơn", exact: true })
    .click();
  await page.getByRole("button", { name: "Dùng ảnh hóa đơn mẫu" }).click();
  await expect(page.locator('[data-tour="chat-attachment"]')).toContainText(
    "hoa-don-xuong-giay.svg",
  );
  const input = page.getByRole("textbox", { name: "Câu hỏi của bạn" });
  await input.fill("Trích xuất hóa đơn này giúp tôi.");
  await input.press("Control+Enter");
  await expect(
    page.getByRole("region", { name: "Thông tin hóa đơn trích xuất" }),
  ).toContainText("Xưởng Giấy Nhỏ");
  await page.getByRole("button", { name: "Lưu hóa đơn", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Đã lưu hóa đơn", exact: true }),
  ).toBeDisabled();
  await input.fill("Tổng hợp doanh thu và hiển thị biểu đồ theo ngày.");
  await input.press("Control+Enter");
  const chart = page.getByRole("region", {
    name: "Biểu đồ doanh thu hóa đơn đã duyệt",
  });
  await expect(chart).toContainText("98.500.000");
  await chart.getByRole("button", { name: "Xem số liệu" }).click();
  await expect(chart.getByRole("table")).toContainText("20.000.000");
  for (const form of ["01/GTGT", "02/CNKD"]) {
    await input.fill(`Tạo tờ khai thuế ${form} cho tháng 10/2026`);
    await input.press("Control+Enter");
    const card = page.getByRole("region", { name: `Bản nháp ${form}` });
    await expect(card).toContainText("98.500.000");
    await card
      .getByRole("button", { name: "Xem bản nháp", exact: true })
      .click();
    await expect(page.getByRole("dialog")).toContainText(`Mẫu ${form}`);
    await expect(page.getByRole("dialog")).toContainText(
      "Không có giá trị pháp lý",
    );
    await page.getByRole("button", { name: "Đóng hộp thoại" }).click();
  }
  await page.reload();
  await expect(
    page.getByRole("region", { name: "Bản nháp 02/CNKD" }),
  ).toBeVisible();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("visualize-tax:demo:v1")!),
  );
  expect(saved.invoices).toHaveLength(7);
  expect(saved.declarations).toHaveLength(2);
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    axe.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  expect(errors).toEqual([]);
});

test("feature description explains business problems and distinguishes simulated integrations", async ({
  page,
}) => {
  await page.goto("/assistant");
  await page
    .getByRole("button", { name: "Mô tả tính năng", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "Mô tả tính năng" });
  await expect(dialog).toContainText("hóa đơn đầu vào, đầu ra");
  await expect(dialog).toContainText("POS");
  await expect(dialog).toContainText(
    "không kết nối POS, ngân hàng hay cổng giao dịch",
  );
  await expect(dialog).toContainText("02/CNKD");
  await expect(dialog).toContainText(
    "không tra cứu luật hay tư vấn pháp lý thực tế",
  );
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
  await expect(
    page.getByRole("button", { name: "Mô tả tính năng", exact: true }),
  ).toBeFocused();
});

test("assistant occupies the viewport and keeps composer at the bottom as messages grow", async ({
  page,
}) => {
  await page.goto("/assistant");
  await expect(
    page.getByRole("textbox", { name: "Câu hỏi của bạn" }),
  ).toBeVisible();
  const dimensions = () =>
    page.evaluate(() => {
      const composer = document
        .querySelector(".chat-composer")!
        .getBoundingClientRect();
      return {
        bottom: composer.bottom,
        viewport: innerHeight,
        pageHeight: document.documentElement.scrollHeight,
        width: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      };
    });
  const before = await dimensions();
  expect(before.viewport - before.bottom).toBeLessThan(45);
  expect(before.pageHeight).toBeLessThanOrEqual(before.viewport + 1);
  const input = page.getByRole("textbox", { name: "Câu hỏi của bạn" });
  await input.fill("Tổng hợp doanh thu và hiển thị biểu đồ.");
  await input.press("Enter");
  await expect(page.locator('[data-tour="chat-chart"]')).toBeVisible();
  const after = await dimensions();
  expect(after.bottom).toBeCloseTo(before.bottom, 0);
  expect(after.pageHeight).toBeLessThanOrEqual(after.viewport + 1);
  expect(after.width).toBe(after.clientWidth);
  await expect(input).toBeVisible();
  for (const width of [768, 1024]) {
    await page.setViewportSize({ width, height: 812 });
    await expect
      .poll(async () => {
        const measured = await dimensions();
        return measured.pageHeight - measured.viewport;
      })
      .toBeLessThanOrEqual(1);
    const tablet = await dimensions();
    expect(tablet.viewport - tablet.bottom).toBeLessThan(45);
    expect(tablet.pageHeight).toBeLessThanOrEqual(tablet.viewport + 1);
    expect(tablet.width).toBe(tablet.clientWidth);
  }
});
