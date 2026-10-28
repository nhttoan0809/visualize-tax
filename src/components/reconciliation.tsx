"use client";
import { useCallback, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  CircleAlert,
  GitCompareArrows,
  Landmark,
  RefreshCw,
} from "lucide-react";
import { useDemo } from "./demo-provider";
import { money, mockApi, matchesBankInvoice } from "@/lib/demo-data";
import { bankDetails } from "@/lib/document-data";
import { useTask } from "@/lib/use-task";
import { ReconciliationInspector } from "./reconciliation-inspector";
import { Modal, Spinner, Status } from "./ui";

export function Reconciliation() {
  const { state, update, notify, tour } = useDemo();
  const { busy, run } = useTask();
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const closeDetail = useCallback(() => setSelectedId(null), []);
  const transactions = state.bankSync?.transactions ?? [];
  const isMatched = (b: (typeof transactions)[number]) =>
    state.matchedIds.includes(b.invoiceId) &&
    state.invoices.some((i) => matchesBankInvoice(b, i));
  const matched = transactions.filter(isMatched);
  const visible = transactions.filter(
    (b) =>
      filter === "all" || (filter === "matched" ? isMatched(b) : !isMatched(b)),
  );
  const selected = transactions.find((b) => b.id === selectedId);
  const sync = () =>
    void run(
      (signal) => mockApi.syncAndReconcile(state.invoices, signal),
      (result) => {
        update((s) => ({
          ...s,
          bankSync: {
            transactions: result.transactions,
            syncedAt: result.syncedAt,
          },
          matchedIds: result.matchedIds,
        }));
        notify(
          `Đã đồng bộ ${result.transactions.length} giao dịch mẫu: ${result.matchedIds.length} đã khớp, ${result.transactions.length - result.matchedIds.length} cần kiểm tra.`,
        );
      },
    );
  return (
    <div className="reconciliation-page">
      <div className="page-heading">
        <div>
          <span className="page-eyebrow">
            <GitCompareArrows size={16} />
            Chứng từ và dòng tiền
          </span>
          <h1>
            Đối soát ngân hàng<span className="heading-dot">.</span>
          </h1>
          <p>
            Đồng bộ giao dịch, tìm hóa đơn tương ứng và kiểm tra từng chênh
            lệch.
          </p>
        </div>
        <button
          className="button primary"
          data-tour="reconcile"
          disabled={busy}
          aria-busy={busy}
          onClick={sync}
        >
          {busy ? <Spinner /> : <RefreshCw size={16} />}{" "}
          {busy ? "Đang đồng bộ & đối soát…" : "Đồng bộ & đối soát"}
        </button>
      </div>
      <section
        className="panel reconciliation-results"
        aria-label="Kết quả đối soát"
        aria-busy={busy}
      >
        <div className="panel-heading">
          <div>
            <h2>Danh sách đối sánh</h2>
            <p>
              {state.bankSync
                ? "Chọn một dòng để so sánh giao dịch ngân hàng với hóa đơn."
                : "Chưa có giao dịch. Đồng bộ dữ liệu ngân hàng mẫu để bắt đầu."}
            </p>
          </div>
          <span className="demo-pill">Tháng 10/2026 · Dữ liệu mẫu</span>
        </div>
        {busy && (
          <div className="sync-loading" role="status" data-tour="sync-loading">
            <span className="sync-loading-icon">
              <RefreshCw size={24} className="spin" />
            </span>
            <div>
              <strong>Đang đồng bộ & đối soát dữ liệu</strong>
              <p>
                Đang mô phỏng tải sao kê → kiểm tra MST → so sánh tổng thanh
                toán…
              </p>
              <div className="sync-loading-track" aria-hidden="true">
                <i />
              </div>
              <span className="sync-loading-stages">
                Giao dịch ngân hàng · Hóa đơn đã duyệt · Kết quả đối sánh
              </span>
            </div>
          </div>
        )}
        <div className="reconciliation-metrics">
          <div>
            <small>Đã đồng bộ</small>
            <strong>
              {transactions.length}
              <span>giao dịch</span>
            </strong>
          </div>
          <div>
            <small>Đã khớp</small>
            <strong className="teal-text">
              {matched.length}
              <span>giao dịch</span>
            </strong>
          </div>
          <div>
            <small>Chưa khớp</small>
            <strong className="amber-text">
              {transactions.length - matched.length}
              <span>giao dịch</span>
            </strong>
          </div>
          <div>
            <small>Giá trị đã khớp</small>
            <strong>
              {money(matched.reduce((sum, b) => sum + b.amount, 0))}
            </strong>
          </div>
        </div>
        <div className="list-toolbar">
          <div className="tabs" role="group" aria-label="Lọc đối soát">
            {[
              ["all", "Tất cả"],
              ["matched", "Đã khớp"],
              ["unmatched", "Chưa khớp"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                disabled={busy}
                className={filter === key ? "selected" : ""}
                aria-pressed={filter === key}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="subtle-text">Ngân hàng ↔ Hóa đơn</span>
        </div>
        <div
          className="table-scroll"
          inert={busy}
          role="region"
          aria-label="Bảng đối sánh, cuộn ngang để xem đầy đủ"
          tabIndex={0}
        >
          <table className="data-table reconciliation-ledger">
            <thead>
              <tr>
                <th>Giao dịch ngân hàng</th>
                <th>Hóa đơn / Khách hàng</th>
                <th className="text-right">Ngân hàng ghi Có</th>
                <th className="text-right">Tổng hóa đơn</th>
                <th className="text-right">Chênh lệch</th>
                <th>Kết quả</th>
                <th>
                  <span className="sr-only">Chi tiết</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((b) => {
                const invoice = state.invoices.find(
                    (i) => i.id === b.invoiceId,
                  ),
                  total = invoice ? invoice.amount + invoice.vat : undefined,
                  delta = total === undefined ? undefined : b.amount - total,
                  matchedRow = isMatched(b),
                  bank = bankDetails(b);
                return (
                  <tr
                    key={b.id}
                    className={matchedRow ? "matched-row" : "unmatched-row"}
                    onClick={() => setSelectedId(b.id)}
                  >
                    <td>
                      <button
                        className="bank-inspect-button reconciliation-row-title"
                        data-tour={`reconcile-${b.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(b.id);
                        }}
                        aria-label={`Xem đối chiếu ${b.text}`}
                      >
                        <strong>{b.text}</strong>
                        <small>
                          {b.date} · {bank.reference}
                        </small>
                      </button>
                    </td>
                    <td>
                      <strong>
                        #{b.invoiceNumber} · {b.payerName}
                      </strong>
                      <small>MST {b.payerTaxId}</small>
                    </td>
                    <td className="text-right tabular">{money(b.amount)}</td>
                    <td className="text-right tabular">
                      {total === undefined ? "—" : money(total)}
                    </td>
                    <td
                      className={`text-right tabular ${delta ? "amount-difference" : ""}`}
                    >
                      {delta === undefined
                        ? "—"
                        : `${delta > 0 ? "+" : ""}${money(delta)}`}
                    </td>
                    <td>
                      {matchedRow ? (
                        <Status matched />
                      ) : (
                        <span className="status status-amber">
                          <CircleAlert size={12} />
                          Chưa khớp
                        </span>
                      )}
                      <small>
                        {matchedRow
                          ? "MST & số tiền trùng khớp"
                          : delta
                            ? "Số tiền không trùng khớp"
                            : "Cần kiểm tra chứng từ"}
                      </small>
                    </td>
                    <td>
                      <button
                        className="row-action"
                        aria-label={`Chi tiết giao dịch ${b.text}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(b.id);
                        }}
                      >
                        <ArrowUpRight size={17} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!transactions.length && !busy ? (
          <div
            className="reconciliation-empty"
            data-tour="reconciliation-empty"
          >
            <div className="empty-sync-illustration">
              <Landmark size={31} />
              <span />
              <ArrowDownToLine size={23} />
              <span />
              <GitCompareArrows size={31} />
            </div>
            <h3>
              {busy
                ? "Đang lấy giao dịch và đối chiếu…"
                : "Sẵn sàng kết nối dòng tiền với hóa đơn"}
            </h3>
            <p>
              Đồng bộ bộ sao kê tháng 10, sau đó so sánh số hóa đơn, mã số thuế
              và tổng thanh toán. Bạn sẽ thấy cả các khoản đã khớp và số tiền
              cần kiểm tra.
            </p>
            <div className="empty-sync-steps">
              <span>
                <Check size={13} />
                Lấy giao dịch mẫu
              </span>
              <span>
                <Check size={13} />
                So sánh hóa đơn
              </span>
              <span>
                <Check size={13} />
                Giải thích chênh lệch
              </span>
            </div>
          </div>
        ) : !visible.length && !busy ? (
          <div className="empty-state">
            <GitCompareArrows size={28} />
            <h3>Không có kết quả trong nhóm này</h3>
            <p>Chọn bộ lọc khác để xem giao dịch.</p>
          </div>
        ) : null}
        <div className="table-pagination">
          <span>
            {transactions.length
              ? `${visible.length} / ${transactions.length} giao dịch`
              : "0 giao dịch · Chưa đồng bộ"}
          </span>
          <span>
            {state.bankSync
              ? `Đồng bộ lúc ${new Date(state.bankSync.syncedAt).toLocaleTimeString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit" })}`
              : "Kết quả sẽ được lưu trên trình duyệt"}
          </span>
        </div>
      </section>
      <div className="reconciliation-source-note">
        <span className="bank-icon">
          <Landmark size={24} />
        </span>
        <div>
          <strong>Ngân hàng Mẫu · Tài khoản DEMO-1028-2468</strong>
          <p>
            Đồng bộ mô phỏng, không kết nối ngân hàng thực. MST bên chuyển được
            bổ sung từ hồ sơ đối tác mẫu; không giả định mọi sao kê ngân hàng có
            sẵn MST.
          </p>
        </div>
        <span className="demo-pill">Không kết nối thực</span>
      </div>
      {selected && (
        <Modal
          title="Chi tiết đối soát"
          subtitle={`${selected.text} · ${selected.date}`}
          onClose={closeDetail}
          wide
          className="reconciliation-modal"
          locked={!!tour}
        >
          <ReconciliationInspector
            key={selected.id}
            transaction={selected}
            invoice={state.invoices.find((i) => i.id === selected.invoiceId)}
            matched={isMatched(selected)}
          />
          <div className="modal-actions">
            <button className="button secondary" onClick={closeDetail}>
              Đóng đối chiếu
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
