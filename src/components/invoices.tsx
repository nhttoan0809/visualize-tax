"use client";
import { useCallback, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleAlert,
  FileCheck2,
  Files,
  FileText,
  Search,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { useDemo } from "./demo-provider";
import { dateLabel, money, mockApi } from "@/lib/demo-data";
import { Modal, Spinner, Status } from "./ui";
import { exportInvoices } from "@/lib/export";
import { InvoiceDocument } from "./invoice-document";
import { useTask } from "@/lib/use-task";

export function Invoices() {
  const { state, update, notify, tour } = useDemo();
  const [upload, setUpload] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState<"date" | "amount">("date");
  const [source, setSource] = useState("");
  const [fileError, setFileError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { busy, run, cancel } = useTask();
  const router = useRouter();
  const params = useSearchParams();
  const selected = state.invoices.find((i) => i.id === params.get("invoice"));
  const closeDetail = useCallback(
    () => router.replace("/invoices", { scroll: false }),
    [router],
  );
  const closeUpload = useCallback(() => {
    cancel();
    setUpload(false);
    setSource("");
    setFileError("");
  }, [cancel]);
  const pending = state.invoices.filter((i) => i.status === "review").length;
  const filtered = state.invoices
    .filter(
      (i) =>
        (filter === "all" || i.status === filter) &&
        `${i.name} ${i.number}`
          .toLocaleLowerCase("vi-VN")
          .includes(query.toLocaleLowerCase("vi-VN")),
    )
    .toSorted((a, b) =>
      sort === "amount" ? b.amount - a.amount : b.date.localeCompare(a.date),
    );
  function selectFile(file?: File) {
    if (!file) return;
    if (
      !["application/pdf", "image/png", "image/jpeg"].includes(file.type) ||
      file.size > 10 * 1024 * 1024
    ) {
      setFileError("Chọn file PDF, PNG hoặc JPG có dung lượng tối đa 10 MB.");
      return;
    }
    setSource(file.name);
    setFileError("");
  }
  function extract(filename: string) {
    void run(
      (signal) => mockApi.extractInvoice(filename, signal),
      (invoice) => {
        update((s) => ({
          ...s,
          invoices: [invoice, ...s.invoices.filter((i) => i.id !== invoice.id)],
          matchedIds: s.matchedIds.filter((id) => id !== invoice.id),
        }));
        setUpload(false);
        setSource("");
        router.replace(`/invoices?invoice=${invoice.id}`, { scroll: false });
        notify("Đã tạo kết quả trích xuất mẫu. Kiểm tra và duyệt để tiếp tục.");
      },
    );
  }
  return (
    <div>
      <div className="page-heading">
        <div>
          <span className="page-eyebrow">
            <Files size={16} />
            Chứng từ của bạn
          </span>
          <h1>
            Gọn gàng từng hóa đơn<span className="heading-dot">.</span>
          </h1>
          <p>Tiếp nhận, kiểm tra và sẵn sàng cho những bước tiếp theo.</p>
        </div>
        <button
          className="button primary"
          data-tour="upload"
          onClick={() => setUpload(true)}
        >
          <Upload size={17} />
          Thêm hóa đơn
        </button>
      </div>
      <div className="mini-summary-row">
        <div>
          <span className="metric-icon blue">
            <Files size={18} />
          </span>
          <span>
            <small>Tổng hóa đơn</small>
            <strong>{state.invoices.length} chứng từ</strong>
          </span>
        </div>
        <div>
          <span className="metric-icon orange">
            <CircleAlert size={18} />
          </span>
          <span>
            <small>Cần kiểm tra</small>
            <strong>{pending} hóa đơn</strong>
          </span>
        </div>
        <div>
          <span className="metric-icon teal">
            <FileCheck2 size={18} />
          </span>
          <span>
            <small>Đã duyệt</small>
            <strong>{state.invoices.length - pending} hóa đơn</strong>
          </span>
        </div>
        <div className="summary-note">
          <Sparkles size={16} />
          Dữ liệu mẫu, tự do khám phá
        </div>
      </div>
      <section className="panel">
        <div className="list-toolbar">
          <div className="tabs" role="group" aria-label="Lọc trạng thái">
            <button
              onClick={() => setFilter("all")}
              className={filter === "all" ? "selected" : ""}
              aria-pressed={filter === "all"}
            >
              Tất cả <span>{state.invoices.length}</span>
            </button>
            <button
              onClick={() => setFilter("review")}
              className={filter === "review" ? "selected" : ""}
              aria-pressed={filter === "review"}
            >
              Chờ kiểm tra <span>{pending}</span>
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={filter === "approved" ? "selected" : ""}
              aria-pressed={filter === "approved"}
            >
              Đã duyệt
            </button>
          </div>
          <button
            className="icon-button"
            aria-label="Xuất danh sách hóa đơn CSV"
            onClick={() => {
              exportInvoices(filtered);
              notify("Đã xuất danh sách đang lọc (.csv).");
            }}
          >
            <ArrowDownToLine size={18} />
          </button>
        </div>
        <div className="table-filters">
          <label className="search-field">
            <Search size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Tìm hóa đơn"
              placeholder="Tìm khách hàng, số hóa đơn…"
            />
            {query && (
              <button
                className="icon-button"
                aria-label="Xóa tìm kiếm"
                onClick={() => setQuery("")}
              >
                <X size={14} />
              </button>
            )}
          </label>
          <label className="select-control">
            <span className="sr-only">Sắp xếp hóa đơn</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "date" | "amount")}
            >
              <option value="date">Mới nhất trước</option>
              <option value="amount">Doanh thu cao nhất</option>
            </select>
            <ChevronDown size={14} />
          </label>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Khách hàng / Đối tác</th>
                <th>Số hóa đơn</th>
                <th>Ngày phát hành</th>
                <th className="text-right">Doanh thu</th>
                <th>Trạng thái</th>
                <th>
                  <span className="sr-only">Chi tiết</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i, index) => (
                <tr key={i.id}>
                  <td>
                    <button
                      className="customer-cell"
                      onClick={() =>
                        router.push(`/invoices?invoice=${i.id}`, {
                          scroll: false,
                        })
                      }
                    >
                      <span className={`customer-avatar avatar-${index % 4}`}>
                        {i.name
                          .split(" ")
                          .slice(-2)
                          .map((w) => w[0])
                          .join("")}
                      </span>
                      <span>
                        <strong>{i.name}</strong>
                        <small>{i.category}</small>
                      </span>
                    </button>
                  </td>
                  <td className="muted">#{i.number}</td>
                  <td className="muted">{dateLabel(i.date)}</td>
                  <td className="text-right tabular">{money(i.amount)}</td>
                  <td>
                    <Status approved={i.status === "approved"} />
                  </td>
                  <td>
                    <button
                      className="row-action"
                      aria-label={`Xem hóa đơn ${i.number}`}
                      onClick={() =>
                        router.push(`/invoices?invoice=${i.id}`, {
                          scroll: false,
                        })
                      }
                    >
                      <ArrowUpRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && (
          <div className="empty-state">
            <Search size={30} />
            <h3>Chưa tìm thấy hóa đơn</h3>
            <p>Thử từ khóa khác hoặc chọn “Tất cả” trạng thái.</p>
            <button
              className="button secondary"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
        <div className="table-pagination">
          <span>
            Hiển thị {filtered.length} / {state.invoices.length} hóa đơn
          </span>
          <span>Tháng 10, 2026 · Dữ liệu mẫu</span>
        </div>
      </section>
      <div className="info-box bottom-info">
        <ShieldNote />
        <p>
          File được chọn chỉ dùng để đặt tên chứng từ. Kết quả trích xuất luôn
          là hóa đơn mẫu “Xưởng Giấy Nhỏ”; nội dung file không được đọc hoặc gửi
          đi.
        </p>
      </div>
      {upload && (
        <Modal
          title="Thêm một hóa đơn mới"
          subtitle="Mô phỏng tiếp nhận và trích xuất chứng từ"
          onClose={closeUpload}
          locked={!!tour}
        >
          <div
            className={`upload-zone ${dragging ? "dragging" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              selectFile(e.dataTransfer.files[0]);
            }}
          >
            <span className="upload-icon">
              <Upload size={27} />
            </span>
            <h3>{source || "Kéo thả hóa đơn vào đây"}</h3>
            <p>PDF, PNG hoặc JPG · Tối đa 10 MB</p>
            <button
              className="button secondary"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
            >
              Chọn từ thiết bị
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf,image/png,image/jpeg"
              aria-label="Chọn file hóa đơn"
              className="sr-only"
              onChange={(e) => selectFile(e.target.files?.[0])}
            />
          </div>
          {fileError && (
            <p className="field-error" role="alert">
              {fileError}
            </p>
          )}
          <div className="info-box">
            <Sparkles size={18} />
            <p>
              Đây là mô phỏng OCR. Dù chọn file nào, bạn sẽ nhận cùng một kết
              quả mẫu để trải nghiệm luồng duyệt hóa đơn.
            </p>
          </div>
          {busy && (
            <div className="extraction-progress" role="status">
              <Spinner />
              <span>Đang mô phỏng đọc và phân tích hóa đơn…</span>
              <div>
                <i />
              </div>
            </div>
          )}
          <div className="modal-actions">
            <button
              className="button secondary"
              data-tour="sample"
              disabled={busy}
              onClick={() => extract("hoa-don-mau-xuong-giay.pdf")}
            >
              <FileText size={16} />
              Dùng hóa đơn mẫu
            </button>
            <button
              className="button primary"
              disabled={!source || busy}
              onClick={() => extract(source)}
            >
              {busy ? <Spinner /> : <Sparkles size={16} />}Trích xuất minh họa
            </button>
          </div>
        </Modal>
      )}
      {selected && (
        <Modal
          title={`Hóa đơn #${selected.number}`}
          subtitle="Kiểm tra dữ liệu trước khi ghi nhận"
          onClose={closeDetail}
          wide
          locked={!!tour}
        >
          <div className="invoice-detail-grid">
            <InvoiceDocument invoice={selected} />
            <div className="invoice-review">
              <span className="review-badge">
                <Sparkles size={14} />
                Kết quả trích xuất mẫu
              </span>
              <h3>Kiểm tra thông tin</h3>
              <p>
                Chứng từ sẽ được dùng cho đối soát và tổng hợp doanh thu sau khi
                bạn duyệt.
              </p>
              <dl className="detail-list">
                <div>
                  <dt>Nguồn chứng từ</dt>
                  <dd>{selected.source}</dd>
                </div>
                <div>
                  <dt>Ngày phát hành</dt>
                  <dd>{dateLabel(selected.date)}</dd>
                </div>
                <div>
                  <dt>Doanh thu</dt>
                  <dd>{money(selected.amount)}</dd>
                </div>
                <div>
                  <dt>Trạng thái</dt>
                  <dd>
                    <Status approved={selected.status === "approved"} />
                  </dd>
                </div>
              </dl>
              <div className="info-box">
                <CircleAlert size={18} />
                <p>
                  Thông tin và thuế suất chỉ phục vụ trình diễn, không dùng để
                  kê khai thực tế.
                </p>
              </div>
              {selected.status === "review" ? (
                <button
                  className="button primary full-width"
                  data-tour="approve"
                  onClick={() => {
                    update((s) => ({
                      ...s,
                      invoices: s.invoices.map((i) =>
                        i.id === selected.id ? { ...i, status: "approved" } : i,
                      ),
                    }));
                    closeDetail();
                    notify(`Đã duyệt hóa đơn #${selected.number}.`);
                  }}
                >
                  <Check size={17} />
                  Duyệt hóa đơn
                </button>
              ) : (
                <button
                  className="button secondary full-width"
                  onClick={closeDetail}
                >
                  <FileCheck2 size={17} />
                  Đã duyệt · Đóng chi tiết
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
function ShieldNote() {
  return <CircleAlert size={18} />;
}
