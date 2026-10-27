"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleAlert,
  GitCompareArrows,
  Landmark,
  Play,
  Search,
} from "lucide-react";
import { useDemo } from "./demo-provider";
import { bankTransactions, money, mockApi } from "@/lib/demo-data";
import { useTask } from "@/lib/use-task";
import { ReconciliationInspector } from "./reconciliation-inspector";
import { Spinner, Status } from "./ui";
export function Reconciliation() {
  const { state, update, notify } = useDemo();
  const { busy, run } = useTask();
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState("bank-03");
  const transactions = bankTransactions.filter(
    (b) =>
      b.id !== "bank-demo" || state.invoices.some((i) => i.id === "inv-demo"),
  );
  const matched = transactions.filter((b) =>
    state.matchedIds.includes(b.invoiceId),
  );
  const visible = transactions.filter(
    (b) =>
      filter === "all" ||
      (filter === "matched"
        ? state.matchedIds.includes(b.invoiceId)
        : !state.matchedIds.includes(b.invoiceId)),
  );
  const selected =
    transactions.find((b) => b.id === selectedId) ?? transactions[0];
  return (
    <div>
      <div className="page-heading">
        <div>
          <span className="page-eyebrow">
            <GitCompareArrows size={16} />
            Kết nối chứng từ và dòng tiền
          </span>
          <h1>
            Khớp từng giao dịch<span className="heading-dot">.</span>
          </h1>
          <p>Đối chiếu hóa đơn đã duyệt với sao kê ngân hàng mẫu.</p>
        </div>
        <button
          className="button primary"
          data-tour="reconcile"
          disabled={busy}
          onClick={() =>
            void run(
              (signal) => mockApi.reconcile(state.invoices, signal),
              (ids) => {
                update((s) => ({ ...s, matchedIds: ids }));
                notify(
                  `Đối soát hoàn tất: ${ids.length} hóa đơn khớp giao dịch mẫu.`,
                );
              },
            )
          }
        >
          {busy ? <Spinner /> : <Play size={16} />}
          {busy ? "Đang đối soát…" : "Chạy đối soát"}
        </button>
      </div>
      <section className="reconcile-overview">
        <div className="reconcile-bank">
          <span className="bank-icon">
            <Landmark size={27} />
          </span>
          <div>
            <span>Sao kê minh họa</span>
            <h2>Ngân hàng Mẫu</h2>
            <p>•••• 2026 · Tháng 10/2026</p>
          </div>
          <span className="demo-pill">Không kết nối thực</span>
        </div>
        <div className="reconcile-totals">
          <div>
            <small>Giao dịch sao kê</small>
            <strong>{transactions.length}</strong>
          </div>
          <div>
            <small>Đã khớp</small>
            <strong className="teal-text">{matched.length}</strong>
          </div>
          <div>
            <small>Chưa khớp</small>
            <strong className="amber-text">
              {transactions.length - matched.length}
            </strong>
          </div>
          <div>
            <small>Giá trị đã đối soát</small>
            <strong className="total-money">
              {money(matched.reduce((s, b) => s + b.amount, 0))}
            </strong>
          </div>
        </div>
      </section>
      <div className="process-strip">
        <div>
          <span>
            <Check size={15} />
          </span>
          Duyệt hóa đơn
        </div>
        <ArrowRight size={17} />
        <div className="current">
          <span>
            <GitCompareArrows size={15} />
          </span>
          So khớp giao dịch
        </div>
        <ArrowRight size={17} />
        <div>
          <span>
            <Search size={15} />
          </span>
          Kiểm tra chênh lệch
        </div>
      </div>
      <ReconciliationInspector
        key={selectedId}
        transaction={selected}
        invoice={state.invoices.find((i) => i.id === selected.invoiceId)}
        matched={state.matchedIds.includes(selected.invoiceId)}
        transactions={transactions}
        onSelect={setSelectedId}
      />
      <section className="panel">
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
                className={filter === key ? "selected" : ""}
                aria-pressed={filter === key}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="subtle-text">Ghép theo tổng thanh toán</span>
        </div>
        <div className="table-scroll">
          <table className="data-table reconcile-table">
            <thead>
              <tr>
                <th>Giao dịch ngân hàng</th>
                <th className="text-right">Số tiền</th>
                <th>
                  <span className="sr-only">Liên kết</span>
                </th>
                <th>Hóa đơn tương ứng</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((b) => {
                const invoice = state.invoices.find(
                    (i) => i.id === b.invoiceId,
                  ),
                  isMatched = state.matchedIds.includes(b.invoiceId);
                return (
                  <tr
                    key={b.id}
                    className={
                      selectedId === b.id ? "selected-transaction" : ""
                    }
                  >
                    <td>
                      <button
                        className="bank-cell bank-inspect-button"
                        aria-label={`Xem đối chiếu ${b.text}`}
                        aria-pressed={selectedId === b.id}
                        onClick={() => {
                          setSelectedId(b.id);
                          document
                            .getElementById("reconciliation-inspector")
                            ?.scrollIntoView({
                              block: "start",
                              behavior: window.matchMedia(
                                "(prefers-reduced-motion: reduce)",
                              ).matches
                                ? "instant"
                                : "smooth",
                            });
                        }}
                      >
                        <span className="transaction-icon">
                          <ArrowUpRight size={17} />
                        </span>
                        <span>
                          <strong>{b.text}</strong>
                          <small>{b.date} · Chuyển khoản mẫu</small>
                        </span>
                      </button>
                    </td>
                    <td className="text-right tabular">{money(b.amount)}</td>
                    <td className="connection-cell">
                      <span className={isMatched ? "connected" : ""}>
                        {isMatched ? <Check size={14} /> : <span>?</span>}
                      </span>
                    </td>
                    <td>
                      {invoice ? (
                        <Link
                          className="matched-invoice"
                          href={`/invoices?invoice=${invoice.id}`}
                        >
                          <strong>
                            #{invoice.number} · {invoice.name}
                          </strong>
                          <small>
                            {invoice.status === "review"
                              ? "Cần duyệt trước khi đối soát"
                              : isMatched
                                ? "Tổng thanh toán khớp hoàn toàn"
                                : "Sẵn sàng chạy đối soát"}
                          </small>
                        </Link>
                      ) : (
                        <span className="unmatched-label">
                          Chưa tìm thấy hóa đơn
                        </span>
                      )}
                    </td>
                    <td>
                      {isMatched ? (
                        <Status matched />
                      ) : (
                        <span className="status status-amber">
                          <CircleAlert size={12} />
                          Chưa khớp
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!visible.length && (
          <div className="empty-state">
            <Check size={28} />
            <h3>Không có giao dịch trong nhóm này</h3>
            <p>Chọn bộ lọc khác để tiếp tục kiểm tra.</p>
          </div>
        )}
        <div className="table-pagination">
          <span>{visible.length} giao dịch · Dữ liệu hoàn toàn hư cấu</span>
          <Link href="/invoices" className="text-button">
            Kiểm tra hóa đơn <ArrowRight size={14} />
          </Link>
        </div>
      </section>
      <div className="info-box bottom-info">
        <CircleAlert size={18} />
        <p>
          Đối soát chỉ ghép hóa đơn đã duyệt có tổng tiền trùng khớp trong dữ
          liệu mẫu. Giao dịch không có chứng từ được giữ ở trạng thái “Chưa
          khớp”.
        </p>
      </div>
    </div>
  );
}
