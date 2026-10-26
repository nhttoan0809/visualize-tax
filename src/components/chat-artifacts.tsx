"use client";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  FileText,
  Save,
  ShieldCheck,
  Table2,
  TrendingUp,
} from "lucide-react";
import {
  dateLabel,
  money,
  type Declaration,
  type MessageArtifact,
} from "@/lib/demo-data";
import { useDemo } from "./demo-provider";

export function InvoiceArtifact({
  artifact,
}: {
  artifact: Extract<MessageArtifact, { type: "invoice" }>;
}) {
  const { state, update, notify } = useDemo();
  const invoice = artifact.invoice;
  const saved = state.invoices.some(
    (i) => i.id === invoice.id && i.status === "approved",
  );
  return (
    <section
      className="chat-invoice-card"
      aria-label="Thông tin hóa đơn trích xuất"
    >
      <div className="artifact-heading">
        <span>
          <FileText size={16} />
          Kết quả trích xuất
        </span>
        <span className="artifact-badge">Dữ liệu mẫu</span>
      </div>
      <div className="chat-invoice-body">
        <Image
          unoptimized
          src="/demo/invoice-sample.svg"
          alt="Ảnh hóa đơn mẫu Xưởng Giấy Nhỏ, không có giá trị pháp lý"
          width={82}
          height={106}
        />
        <div>
          <strong>{invoice.name}</strong>
          <span>
            Hóa đơn #{invoice.number} · {dateLabel(invoice.date)}
          </span>
          <dl>
            <div>
              <dt>Doanh thu</dt>
              <dd>{money(invoice.amount)}</dd>
            </div>
            <div>
              <dt>VAT minh họa</dt>
              <dd>{money(invoice.vat)}</dd>
            </div>
            <div>
              <dt>Tổng thanh toán</dt>
              <dd>{money(invoice.amount + invoice.vat)}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="artifact-footer">
        <span>
          <ShieldCheck size={13} />
          Kiểm tra trước khi lưu
        </span>
        <button
          className={`button ${saved ? "secondary" : "primary"}`}
          disabled={saved}
          data-tour={saved ? "chat-saved-invoice" : "chat-save-invoice"}
          onClick={() => {
            update((s) => ({
              ...s,
              invoices: [
                { ...invoice, status: "approved" },
                ...s.invoices.filter((i) => i.id !== invoice.id),
              ],
              matchedIds: s.matchedIds.filter((id) => id !== invoice.id),
            }));
            notify("Đã lưu và duyệt hóa đơn vào workspace.");
          }}
        >
          {saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? "Đã lưu hóa đơn" : "Lưu hóa đơn"}
        </button>
      </div>
    </section>
  );
}

export function ChartArtifact({
  artifact,
}: {
  artifact: Extract<MessageArtifact, { type: "chart" }>;
}) {
  const [table, setTable] = useState(false);
  const maximum = Math.max(1, ...artifact.points.map((p) => p.revenue));
  return (
    <section
      className="chat-analytics"
      data-tour="chat-chart"
      aria-label="Biểu đồ doanh thu hóa đơn đã duyệt"
    >
      <div className="artifact-heading">
        <span>
          <TrendingUp size={17} />
          Doanh thu theo ngày
        </span>
        <span className="artifact-badge">Tháng 10/2026 · Mẫu</span>
      </div>
      <div className="analytics-total">
        <strong>{money(artifact.total)}</strong>
        <span>{artifact.count} hóa đơn đã duyệt · Chưa gồm VAT</span>
      </div>
      <div
        className="chat-bar-chart"
        role="img"
        aria-label={`Doanh thu mẫu ${money(artifact.total)} từ ${artifact.count} hóa đơn đã duyệt; bảng số liệu có bên dưới.`}
      >
        <div className="chat-chart-grid">
          <span>{money(maximum)}</span>
          <span>{money(maximum / 2)}</span>
          <span>0 ₫</span>
        </div>
        <div className="chat-chart-bars">
          {artifact.points.map((point) => (
            <div key={point.label}>
              <div className="chat-bar-track">
                <span
                  style={{
                    height: `${Math.max(3, (point.revenue / maximum) * 100)}%`,
                  }}
                >
                  <i>{money(point.revenue)}</i>
                </span>
              </div>
              <small>{point.label}</small>
            </div>
          ))}
        </div>
      </div>
      {!artifact.points.length && (
        <p className="chart-empty-note">
          Duyệt một hóa đơn để bắt đầu tổng hợp doanh thu.
        </p>
      )}
      <div className="artifact-footer">
        <span>
          <i className="chart-legend-dot" />
          Doanh thu hóa đơn đã duyệt
        </span>
        <button
          className="text-button"
          aria-expanded={table}
          onClick={() => setTable((v) => !v)}
        >
          <Table2 size={13} />
          {table ? "Ẩn số liệu" : "Xem số liệu"}
          <ChevronDown size={12} />
        </button>
      </div>
      {table && (
        <div className="table-scroll">
          <table className="data-table compact-table">
            <caption className="sr-only">
              Doanh thu theo ngày từ hóa đơn đã duyệt, đơn vị đồng
            </caption>
            <thead>
              <tr>
                <th>Ngày</th>
                <th className="text-right">Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {artifact.points.map((p) => (
                <tr key={p.label}>
                  <td>{p.label}</td>
                  <td className="text-right">{money(p.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function DeclarationArtifact({
  declaration,
  onPreview,
}: {
  declaration: Declaration;
  onPreview: () => void;
}) {
  return (
    <section
      className="chat-declaration-card"
      aria-label={`Bản nháp ${declaration.form}`}
    >
      <div className="chat-draft-icon">
        <FileText size={25} />
        <span>{declaration.form}</span>
      </div>
      <div className="chat-draft-summary">
        <span className="artifact-badge">Bản nháp minh họa</span>
        <h3>Tờ khai {declaration.form}</h3>
        <p>{declaration.period} · Hộ kinh doanh mẫu</p>
        <div>
          <span>
            Doanh thu: <strong>{money(declaration.revenue)}</strong>
          </span>
          <span>
            Thuế minh họa ({declaration.rate}%):{" "}
            <strong>{money(declaration.tax)}</strong>
          </span>
        </div>
        <button
          className="button secondary"
          data-tour={`chat-preview-${declaration.form.replace("/", "-")}`}
          onClick={onPreview}
        >
          Xem bản nháp <ArrowUpRight size={14} />
        </button>
      </div>
    </section>
  );
}
