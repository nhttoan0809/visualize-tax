import type { Invoice } from "./demo-data";
export function exportInvoices(invoices: Invoice[]) {
  const cells = (values: (string | number)[]) =>
    values.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(",");
  const content =
    "\uFEFF" +
    [
      cells(["DỮ LIỆU MINH HỌA — KHÔNG DÙNG KÊ KHAI"]),
      cells([
        "Số hóa đơn",
        "Khách hàng",
        "Ngày",
        "Doanh thu",
        "VAT minh họa",
        "Trạng thái",
      ]),
      ...invoices.map((i) =>
        cells([
          i.number,
          i.name,
          i.date,
          i.amount,
          i.vat,
          i.status === "approved" ? "Đã duyệt" : "Chờ kiểm tra",
        ]),
      ),
    ].join("\r\n");
  const url = URL.createObjectURL(
    new Blob([content], { type: "text/csv;charset=utf-8;" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "visualize-tax-hoa-don-minh-hoa.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
