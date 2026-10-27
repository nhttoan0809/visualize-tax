"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  CircleAlert,
  FileScan,
  Landmark,
  ScanText,
} from "lucide-react";
import {
  bankTransactions,
  dateLabel,
  money,
  type Invoice,
} from "@/lib/demo-data";
import { business, bankDetails, invoiceDetails } from "@/lib/document-data";
import { InvoiceDocument } from "./invoice-document";

export function ReconciliationInspector({
  transaction: b,
  invoice,
  matched,
}: {
  transaction: (typeof bankTransactions)[number];
  invoice?: Invoice;
  matched: boolean;
}) {
  const bank = bankDetails(b);
  const [view, setView] = useState<"scan" | "data">("data");
  const equal = !!invoice && invoice.amount + invoice.vat === b.amount;
  const approved = invoice?.status === "approved";
  const reason = !invoice
    ? "Chưa có hóa đơn nguồn cho giao dịch này. Cần bổ sung chứng từ để kiểm tra."
    : !equal
      ? "Số tiền thanh toán khác số tiền ghi Có. Cần kiểm tra thanh toán từng phần hoặc phí."
      : !approved
        ? "Số tiền trùng khớp nhưng hóa đơn chưa duyệt. Kiểm tra chứng từ trước khi chạy đối soát."
        : matched
          ? "Đã ghép: hóa đơn đã duyệt và tổng thanh toán trùng số tiền ghi Có."
          : "Đủ điều kiện ghép trong bộ dữ liệu mẫu. Đồng bộ lại để cập nhật kết quả.";
  return (
    <section
      className="reconciliation-inspector"
      aria-label="Đối chiếu chứng từ và giao dịch"
      id="reconciliation-inspector"
    >
      <div className="comparison-verdict" data-tour="reconcile-verdict">
        <div className={matched ? "comparison-success" : "comparison-pending"}>
          {matched ? <Check size={18} /> : <CircleAlert size={18} />}
          <strong>{reason}</strong>
        </div>
        <div className="comparison-identities">
          <div>
            <span>MST bên chuyển · hồ sơ đối tác</span>
            <strong>{bank.payerTaxId}</strong>
          </div>
          <div>
            <span>MST bên mua · hóa đơn</span>
            <strong>
              {invoice ? invoiceDetails(invoice).taxId : "Chưa có"}
            </strong>
          </div>
          <div>
            <span>MST bên nhận / bên bán</span>
            <strong>{bank.payeeTaxId}</strong>
            <small>
              {bank.payeeTaxId === business.taxId
                ? "Trùng MST bên bán trên hóa đơn"
                : "Khác MST bên bán"}
            </small>
          </div>
        </div>
        <div className="comparison-checks">
          <div>
            <span>Ngân hàng · Ghi Có</span>
            <strong>{money(b.amount)}</strong>
          </div>
          <span className="comparison-equals">{equal ? "=" : "?"}</span>
          <div>
            <span>Hóa đơn · Tiền hàng + VAT</span>
            <strong>
              {invoice
                ? `${money(invoice.amount)} + ${money(invoice.vat)}`
                : "Chưa có chứng từ"}
            </strong>
          </div>
          <div>
            <span>Chênh lệch</span>
            <strong>
              {invoice
                ? money(b.amount - invoice.amount - invoice.vat)
                : "Chưa xác định"}
            </strong>
          </div>
        </div>
        <p>
          Quy tắc demo: so sánh số hóa đơn và MST trong hồ sơ mẫu → kiểm tra
          tổng tiền → kiểm tra đã duyệt. Nội dung chuyển khoản và ngày được hiển
          thị để người dùng xem xét; demo chưa tự phân tích nội dung, ghép nhiều
          hóa đơn hay thanh toán từng phần.
        </p>
      </div>
      <div className="comparison-sources">
        <section className="comparison-source">
          <header>
            <span>
              <Landmark size={17} /> Dữ liệu từ ngân hàng
            </span>
            <span className="artifact-badge">Bản ghi mẫu</span>
          </header>
          <div className="bank-receipt">
            <div className="receipt-brand">
              <Landmark size={25} />
              <div>
                <strong>Ngân hàng Mẫu</strong>
                <small>Giấy báo Có · Dựng từ dữ liệu sao kê</small>
              </div>
            </div>
            <div className="receipt-amount">
              <span>
                <ArrowDownLeft size={16} /> Tiền vào tài khoản
              </span>
              <strong>+{money(b.amount)}</strong>
              <small>{bank.bookedAt} · Đã ghi sổ (mô phỏng)</small>
            </div>
            <dl className="receipt-fields">
              <div>
                <dt>Tài khoản nhận</dt>
                <dd>
                  {bank.account}
                  <small>{bank.accountName}</small>
                  <small>MST {bank.payeeTaxId}</small>
                </dd>
              </div>
              <div>
                <dt>Người chuyển</dt>
                <dd>
                  {bank.sender}
                  <small>{bank.senderAccount}</small>
                  <small>MST {bank.payerTaxId} · từ hồ sơ đối tác mẫu</small>
                </dd>
              </div>
              <div>
                <dt>Mã giao dịch</dt>
                <dd>{bank.reference}</dd>
              </div>
              <div>
                <dt>Ngày giá trị</dt>
                <dd>{bank.valueDate}</dd>
              </div>
              <div>
                <dt>Kênh giao dịch</dt>
                <dd>{bank.channel}</dd>
              </div>
            </dl>
            <div className="receipt-description">
              <small>Nội dung chuyển khoản từ sao kê</small>
              <strong>{b.text}</strong>
            </div>
          </div>
          <details className="bank-raw">
            <summary>Xem bản ghi giao dịch chuẩn hóa</summary>
            <pre>
              {JSON.stringify(
                {
                  transactionId: bank.reference,
                  bookingDate: b.date,
                  valueDate: bank.valueDate,
                  direction: bank.direction,
                  amount: b.amount,
                  currency: bank.currency,
                  counterparty: bank.sender,
                  counterpartyTaxId: bank.payerTaxId,
                  beneficiaryTaxId: bank.payeeTaxId,
                  invoiceNumber: b.invoiceNumber,
                  description: b.text,
                },
                null,
                2,
              )}
            </pre>
          </details>
        </section>
        <section className="comparison-source">
          <header>
            <span>
              <FileScan size={17} /> Hóa đơn nhập / scan
            </span>
          </header>
          {invoice ? (
            <>
              <div
                className="comparison-view-switch"
                role="group"
                aria-label="Chế độ xem hóa đơn"
              >
                <button
                  aria-pressed={view === "scan"}
                  className={view === "scan" ? "selected" : ""}
                  onClick={() => setView("scan")}
                >
                  <FileScan size={14} />
                  Chứng từ
                </button>
                <button
                  aria-pressed={view === "data"}
                  className={view === "data" ? "selected" : ""}
                  data-tour="reconcile-extracted"
                  onClick={() => setView("data")}
                >
                  <ScanText size={14} />
                  Dữ liệu trích xuất
                </button>
              </div>
              {view === "scan" ? (
                <div
                  className="scan-document-scroll"
                  tabIndex={0}
                  role="region"
                  aria-label="Chứng từ hóa đơn mô phỏng, cuộn để xem"
                >
                  <div className="scan-preview-label">
                    Bản dựng lại chứng từ · Không phải ảnh OCR thật
                  </div>
                  <InvoiceDocument invoice={invoice} />
                </div>
              ) : (
                <div className="extracted-comparison">
                  <span className="artifact-badge">
                    Kết quả OCR mô phỏng · Dữ liệu từ chứng từ
                  </span>
                  <dl className="receipt-fields">
                    <div>
                      <dt>MST bên mua</dt>
                      <dd>{invoiceDetails(invoice).taxId}</dd>
                    </div>
                    <div>
                      <dt>MST bên bán</dt>
                      <dd>{business.taxId}</dd>
                    </div>
                    <div>
                      <dt>Tệp nguồn</dt>
                      <dd>{invoice.source}</dd>
                    </div>
                    <div>
                      <dt>Số hóa đơn</dt>
                      <dd>#{invoice.number}</dd>
                    </div>
                    <div>
                      <dt>Ngày lập</dt>
                      <dd>{dateLabel(invoice.date)}</dd>
                    </div>
                    <div>
                      <dt>Bên mua</dt>
                      <dd>{invoice.name}</dd>
                    </div>
                    <div>
                      <dt>Tiền hàng</dt>
                      <dd>{money(invoice.amount)}</dd>
                    </div>
                    <div>
                      <dt>Thuế GTGT</dt>
                      <dd>{money(invoice.vat)}</dd>
                    </div>
                    <div>
                      <dt>Tổng thanh toán</dt>
                      <dd>{money(invoice.amount + invoice.vat)}</dd>
                    </div>
                    <div>
                      <dt>Kiểm tra chứng từ</dt>
                      <dd>{approved ? "Đã duyệt" : "Chờ duyệt"}</dd>
                    </div>
                  </dl>
                </div>
              )}
              <div className="comparison-file">
                <FileScan size={14} />
                <span>{invoice.source}</span>
                <span>Nhập tệp → Trích xuất → Kiểm tra</span>
              </div>
            </>
          ) : (
            <div className="missing-source">
              <FileScan size={35} />
              <h3>Chưa tìm thấy hóa đơn nguồn</h3>
              <p>
                Giao dịch {bank.reference} có {money(b.amount)} tiền vào nhưng
                chưa có chứng từ tương ứng trong bộ mẫu.
              </p>
              <Link className="button secondary" href="/invoices">
                Bổ sung hóa đơn <ArrowUpRight size={14} />
              </Link>
            </div>
          )}
        </section>
      </div>
      <div className="comparison-provenance">
        <CircleAlert size={15} />
        <p>
          Đây là cách trình bày một bản ghi ngân hàng sau khi chuẩn hóa. Trường
          dữ liệu thực tế tùy ngân hàng hoặc file sao kê. Demo không kết nối tài
          khoản ngân hàng; chứng từ được dựng bằng giao diện, dữ liệu trích xuất
          là kịch bản có sẵn.
        </p>
      </div>
      {invoice && (
        <details className="reconcile-full-invoice">
          <summary data-tour="reconcile-full-invoice">
            Xem đầy đủ hóa đơn #{invoice.number}
          </summary>
          <InvoiceDocument invoice={invoice} />
        </details>
      )}
    </section>
  );
}
