import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const key = "visualize-tax:demo:v1";
async function ready(page: Page, path = "/") {
  await page.goto(path);
  await expect(
    page.getByRole("button", { name: "Đặt lại toàn bộ trạng thái" }),
  ).toBeEnabled();
}

test("connected invoice, reconciliation, declaration and assistant flow persists", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await ready(page, "/invoices");
  await page.getByRole("button", { name: "Thêm hóa đơn", exact: true }).click();
  await page.getByRole("button", { name: "Dùng hóa đơn mẫu" }).click();
  const detail = page.getByRole("dialog");
  await expect(
    detail.getByText("Xưởng Giấy Nhỏ", { exact: true }),
  ).toBeVisible();
  await detail
    .getByRole("button", { name: "Duyệt hóa đơn", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Xưởng Giấy Nhỏ Hàng hóa bán lẻ" }),
  ).toBeVisible();
  await ready(page, "/reconciliation");
  await page
    .getByRole("button", { name: "Chạy đối soát", exact: true })
    .click();
  await expect(
    page
      .getByRole("row")
      .filter({ hasText: "XUONG GIAY HD 129" })
      .getByText("Đã khớp", { exact: true }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("row")
      .filter({ hasText: "Giao dich chua co hoa don" })
      .getByText("Chưa khớp", { exact: true }),
  ).toBeVisible();
  await ready(page, "/declarations");
  await page.getByRole("button", { name: "Tạo bản nháp", exact: true }).click();
  await page.getByLabel("Thuế suất minh họa (%)").fill("5");
  await page.locator('[data-tour="generate"]').click();
  await expect(
    page.getByRole("dialog").getByText("98.500.000 ₫", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("dialog").getByText("4.925.000 ₫", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/Không có giá trị pháp lý/)).toBeVisible();
  await page.getByRole("button", { name: "Đóng hộp thoại" }).click();
  await ready(page, "/assistant");
  await page
    .getByRole("button", { name: /Tổng hợp doanh thu hóa đơn của tôi/ })
    .click();
  await expect(page.getByRole("log")).toContainText("98.500.000");
  await page.reload();
  await expect(page.getByRole("log")).toContainText("98.500.000");
  expect(errors).toEqual([]);
  await page
    .getByRole("button", { name: "Đặt lại toàn bộ trạng thái" })
    .click();
  await expect(page.getByRole("heading", { name: /Chào Minh/ })).toBeVisible();
  const resetState = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("visualize-tax:demo:v1")!),
  );
  expect(resetState.invoices).toHaveLength(6);
  expect(resetState.messages).toHaveLength(0);
  expect(resetState.declarations).toHaveLength(0);
  expect(resetState.matchedIds).toHaveLength(3);
});

test("quick search supports keyboard focus and mobile navigation has an Escape exit", async ({
  page,
}, testInfo) => {
  await ready(page);
  await page.getByRole("button", { name: "Tìm nhanh", exact: true }).click();
  const input = page.getByRole("textbox", { name: "Tìm trang" });
  await expect(input).toBeFocused();
  await input.pressSequentially("Hóa đơn");
  await expect(input).toBeFocused();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Hóa đơn", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: /Gọn gàng từng hóa đơn/ }),
  ).toBeVisible();
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("textbox", { name: "Tìm trang" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  if (testInfo.project.name === "mobile") {
    await expect(page.locator(".sidebar")).toHaveAttribute("inert", "");
    await page.getByRole("button", { name: "Mở điều hướng" }).click();
    await expect(page.locator(".sidebar")).not.toHaveAttribute("inert", "");
    await page.keyboard.press("Escape");
    await expect(page.locator(".sidebar")).toHaveAttribute("inert", "");
    await expect(
      page.getByRole("button", { name: "Mở điều hướng" }),
    ).toBeFocused();
  }
});

test("reset clears app state, filters and pending extraction while preserving unrelated storage", async ({
  page,
}) => {
  await ready(page, "/invoices");
  await page.evaluate(() =>
    localStorage.setItem("unrelated-user-preference", "keep"),
  );
  await page.getByRole("button", { name: "Thêm hóa đơn", exact: true }).click();
  await page.getByRole("button", { name: "Dùng hóa đơn mẫu" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: /Đang mô phỏng/ }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Đặt lại toàn bộ trạng thái" })
    .click();
  await expect(page.getByRole("heading", { name: /Chào Minh/ })).toBeVisible();
  await page.waitForTimeout(1800);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("visualize-tax:demo:v1")!).invoices
          .length,
    ),
  ).toBe(6);
  expect(
    await page.evaluate(() =>
      localStorage.getItem("unrelated-user-preference"),
    ),
  ).toBe("keep");
  await ready(page, "/invoices");
  await page
    .getByRole("textbox", { name: "Tìm hóa đơn" })
    .fill("không có kết quả");
  await expect(page.getByText("Chưa tìm thấy hóa đơn")).toBeVisible();
  await page
    .getByRole("button", { name: "Đặt lại toàn bộ trạng thái" })
    .click();
  await ready(page, "/invoices");
  await expect(page.getByRole("textbox", { name: "Tìm hóa đơn" })).toHaveValue(
    "",
  );
  await expect(page.getByText("Hiển thị 6 / 6 hóa đơn")).toBeVisible();
});

test("complete automated presentation unlocks and carries data across every step", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await ready(page, "/declarations");
  await page.evaluate(() => {
    const record = { typed: 0, shortcuts: 0, moves: 0, clicks: [] as string[] };
    Object.assign(window, { presentationRecord: record });
    document.addEventListener("input", (e) => {
      if ((e.target as HTMLElement)?.id === "chat-input") record.typed++;
    });
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "Enter") record.shortcuts++;
    });
    document.addEventListener("pointermove", () => record.moves++);
    document.addEventListener("click", (e) => {
      const name = (e.target as HTMLElement)?.closest<HTMLElement>(
        "[data-tour]",
      )?.dataset.tour;
      if (name) record.clicks.push(name);
    });
  });
  await page
    .getByRole("button", { name: "Chạy trình diễn", exact: true })
    .click();
  await expect(page.locator(".application")).toHaveAttribute("inert", "");
  await expect(
    page.getByRole("region", { name: "Trình diễn tự động" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Chạy trình diễn", exact: true }),
  ).toBeVisible({ timeout: 70000 });
  await expect(page.locator(".application")).not.toHaveAttribute("inert", "");
  await expect(page.getByRole("log")).toContainText("98.500.000");
  const state = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("visualize-tax:demo:v1")!),
  );
  expect(state.invoices).toHaveLength(7);
  expect(state.declarations).toHaveLength(2);
  expect(state.matchedIds).toHaveLength(3);
  expect(
    state.declarations.map((d: { form: string }) => d.form).sort(),
  ).toEqual(["01/GTGT", "02/CNKD"]);
  const record = await page.evaluate(
    () =>
      (
        window as unknown as {
          presentationRecord: {
            typed: number;
            shortcuts: number;
            moves: number;
            clicks: string[];
          };
        }
      ).presentationRecord,
  );
  expect(record.typed).toBeGreaterThan(100);
  expect(record.shortcuts).toBe(4);
  expect(record.moves).toBeGreaterThan(8);
  expect(record.clicks).toContain("chat-use-sample");
  expect(record.clicks).toContain("chat-save-invoice");
  await expect(page.locator(".demo-pointer")).toHaveCount(0);
});

test("presentation can stop during extraction and Escape immediately returns interaction", async ({
  page,
}) => {
  await ready(page);
  await page
    .getByRole("button", { name: "Chạy trình diễn", exact: true })
    .click();
  await expect(page.locator(".chat-processing [role=status]")).toBeVisible({
    timeout: 15000,
  });
  await page
    .getByRole("button", { name: "Dừng trình diễn", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("region", { name: "Trình diễn tự động" }),
  ).toHaveCount(0);
  await page.waitForTimeout(1800);
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("visualize-tax:demo:v1")!).invoices
          .length,
    ),
  ).toBe(6);
  await page
    .getByRole("button", { name: "Chạy trình diễn", exact: true })
    .click();
  await page.keyboard.press("Escape");
  await expect(page.locator(".application")).not.toHaveAttribute("inert", "");
  await expect(
    page.getByRole("button", { name: "Chạy trình diễn", exact: true }),
  ).toBeVisible();
});

test("invalid persistence and blocked storage both fall back to usable seed", async ({
  page,
}) => {
  await page.addInitScript(
    ({ storageKey }) => {
      localStorage.setItem(
        storageKey,
        '{"version":1,"invoices":[{"id":"bad"}]}',
      );
    },
    { storageKey: key },
  );
  await ready(page, "/invoices");
  await expect(page.getByText("Hiển thị 6 / 6 hóa đơn")).toBeVisible();
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Storage blocked");
      },
    });
  });
  await ready(page);
  await expect(page.getByRole("heading", { name: /Chào Minh/ })).toBeVisible();
  await page
    .getByRole("button", { name: "Đặt lại toàn bộ trạng thái" })
    .click();
  await expect(page.getByRole("heading", { name: /Chào Minh/ })).toBeVisible();
});

test("file validation and upload labeling do not send user files", async ({
  page,
}) => {
  await ready(page, "/invoices");
  const uploads: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") uploads.push(request.url());
  });
  await page.getByRole("button", { name: "Thêm hóa đơn", exact: true }).click();
  await page.getByLabel("Chọn file hóa đơn").setInputFiles({
    name: "data.exe",
    mimeType: "application/octet-stream",
    buffer: Buffer.from("invalid"),
  });
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText(
    "Chọn file PDF, PNG hoặc JPG",
  );
  await page.getByLabel("Chọn file hóa đơn").setInputFiles({
    name: "my-invoice.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("fictional test file"),
  });
  await page
    .getByRole("button", { name: "Trích xuất minh họa", exact: true })
    .click();
  await expect(
    page.getByRole("dialog").getByText("my-invoice.pdf", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("dialog").getByText("Xưởng Giấy Nhỏ", { exact: true }),
  ).toBeVisible();
  expect(uploads.filter((url) => !url.includes("__nextjs"))).toEqual([]);
});

test("pages fit the viewport and banner stays sticky while scrolling", async ({
  page,
}) => {
  for (const route of [
    "/",
    "/invoices",
    "/reconciliation",
    "/declarations",
    "/assistant",
  ]) {
    await ready(page, route);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    expect((await page.locator(".demo-banner").boundingBox())?.y).toBe(0);
    await expect(
      page.getByRole("button", { name: "Chạy trình diễn", exact: true }),
    ).toBeVisible();
  }
});

test("workspace and core dialogs pass automated WCAG accessibility checks", async ({
  page,
}) => {
  for (const route of [
    "/",
    "/invoices",
    "/reconciliation",
    "/declarations",
    "/assistant",
  ]) {
    await ready(page, route);
    const results = await new AxeBuilder({ page })
      .exclude("nextjs-portal")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      `${route}: ${JSON.stringify(results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })))}`,
    ).toEqual([]);
  }
  await ready(page, "/declarations");
  await page.getByRole("button", { name: "Tạo bản nháp", exact: true }).click();
  const results = await new AxeBuilder({ page })
    .include('[role="dialog"]')
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    results.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});
