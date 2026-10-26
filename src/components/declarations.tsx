"use client";
import { useCallback, useState } from "react";
import {
  ArrowUpRight,
  Check,
  CircleAlert,
  FileCheck2,
  FilePlus2,
  FileText,
  Plus,
  Printer,
  Sparkles,
} from "lucide-react";
import { useDemo } from "./demo-provider";
import { money, mockApi, type Declaration } from "@/lib/demo-data";
import { Modal, Spinner } from "./ui";
import { useTask } from "@/lib/use-task";
export function Declarations() {
  const { state, update, notify, tour } = useDemo();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<Declaration | null>(null);
  const [form, setForm] = useState<Declaration["form"]>("01/GTGT");
  const [period, setPeriod] = useState("Tháng 10/2026");
  const [rate, setRate] = useState("10");
  const { busy, run, cancel } = useTask();
  const revenue = state.invoices
    .filter((i) => i.status === "approved")
    .reduce((s, i) => s + i.amount, 0);
  const close = useCallback(() => {
    cancel();
    setOpen(false);
    setPreview(null);
  }, [cancel]);
  const validRate =
    rate.trim() !== "" &&
    Number.isFinite(Number(rate)) &&
    Number(rate) >= 0 &&
    Number(rate) <= 100;
  function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!validRate || revenue <= 0) return;
    void run(
      (signal) =>
        mockApi.createDeclaration(
          { form, period, revenue, rate: Number(rate) },
          signal,
        ),
      (result) => {
        update((s) => ({
          ...s,
          declarations: [result, ...s.declarations].slice(0, 100),
        }));
        setOpen(false);
        setPreview(result);
        notify("Đã tạo bản nháp tờ khai minh họa.");
      },
    );
  }
  return (
    <div>
      <div className="page-heading">
        <div>
          <span className="page-eyebrow">
            <FileCheck2 size={16} />
            Từ dữ liệu đến bản nháp
          </span>
          <h1>
            Sẵn sàng cho kỳ kê khai<span className="heading-dot">.</span>
          </h1>
          <p>Tổng hợp dữ liệu đã duyệt, tạo và xem trước tờ khai minh họa.</p>
        </div>
        <button
          className="button primary"
          data-tour="new-declaration"
          onClick={() => setOpen(true)}
        >
          <Plus size={18} />
          Tạo bản nháp
        </button>
      </div>
      <div className="declaration-intro">
        <div>
          <span className="intro-icon">
            <FileText size={27} />
          </span>
          <h2>
            Dữ liệu rõ ràng.
            <br />
            Bản nháp trong vài bước.
          </h2>
          <p>
            Doanh thu từ{" "}
            {state.invoices.filter((i) => i.status === "approved").length} hóa
            đơn đã duyệt sẵn sàng để tổng hợp.
          </p>
        </div>
        <div className="declaration-revenue">
          <span>Doanh thu mẫu được sử dụng</span>
          <strong>{money(revenue)}</strong>
          <small>
            <Check size={14} />
            Tự động tổng hợp từ hóa đơn đã duyệt
          </small>
        </div>
      </div>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Bản nháp của bạn</h2>
            <p>Lưu trên trình duyệt này · Chưa nộp cho cơ quan thuế</p>
          </div>
          <span className="task-count">{state.declarations.length}</span>
        </div>
        {state.declarations.length ? (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Biểu mẫu</th>
                  <th>Kỳ kê khai</th>
                  <th className="text-right">Doanh thu</th>
                  <th className="text-right">Thuế minh họa</th>
                  <th>Trạng thái</th>
                  <th>
                    <span className="sr-only">Xem</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.declarations.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <div className="bank-cell">
                        <span className="task-icon teal">
                          <FileText size={18} />
                        </span>
                        <strong>{d.form}</strong>
                      </div>
                    </td>
                    <td>{d.period}</td>
                    <td className="text-right tabular">{money(d.revenue)}</td>
                    <td className="text-right tabular">{money(d.tax)}</td>
                    <td>
                      <span className="status status-gray">Bản nháp mẫu</span>
                    </td>
                    <td>
                      <button
                        className="row-action"
                        aria-label={`Xem bản nháp ${d.form}`}
                        onClick={() => setPreview(d)}
                      >
                        <ArrowUpRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state declaration-empty">
            <span className="empty-file">
              <FilePlus2 size={36} />
            </span>
            <h3>Bản nháp đầu tiên đang chờ bạn</h3>
            <p>
              Chọn biểu mẫu và kỳ kê khai. Workspace sẽ
              <br />
              tổng hợp doanh thu từ hóa đơn đã duyệt.
            </p>
            <button className="button secondary" onClick={() => setOpen(true)}>
              <Plus size={16} />
              Tạo bản nháp đầu tiên
            </button>
          </div>
        )}
      </section>
      <div className="info-box bottom-info">
        <CircleAlert size={18} />
        <p>
          Đây là mô phỏng thao tác tạo tờ khai, không phải công cụ tính thuế
          chính thức. Mẫu in là bản tổng hợp demo, không thay thế biểu mẫu pháp
          lý.
        </p>
      </div>
      {open && (
        <Modal
          title="Tạo bản nháp tờ khai"
          subtitle="Doanh thu được tổng hợp từ hóa đơn đã duyệt"
          onClose={close}
          locked={!!tour}
        >
          <form onSubmit={generate} className="declaration-form">
            <fieldset>
              <legend>Chọn biểu mẫu</legend>
              <div className="form-type-options">
                {(["01/GTGT", "01/CNKD"] as const).map((f) => (
                  <label key={f} className={form === f ? "checked" : ""}>
                    <input
                      type="radio"
                      name="form"
                      value={f}
                      checked={form === f}
                      onChange={() => setForm(f)}
                    />
                    <span>
                      <strong>{f}</strong>
                      <small>
                        {f === "01/GTGT"
                          ? "Thuế giá trị gia tăng"
                          : "Thuế hộ kinh doanh"}
                      </small>
                    </span>
                    {form === f && <Check size={17} />}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="field-label">
              Kỳ kê khai
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option>Tháng 10/2026</option>
                <option>Quý IV/2026</option>
              </select>
              <small>Hai lựa chọn dùng cùng bộ hóa đơn mẫu tháng 10.</small>
            </label>
            <div className="form-row">
              <label className="field-label">
                Doanh thu đã duyệt
                <input readOnly value={money(revenue)} />
                <small>Được lấy tự động từ dữ liệu hiện tại</small>
              </label>
              <label className="field-label">
                Thuế suất minh họa (%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  required
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
                <small>Tham số demo, không phải mức thuế áp dụng</small>
              </label>
            </div>
            <div className="form-total">
              <span>Thuế minh họa dự kiến</span>
              <strong>
                {money(
                  validRate ? Math.round((revenue * Number(rate)) / 100) : 0,
                )}
              </strong>
            </div>
            <div className="info-box">
              <CircleAlert size={18} />
              <p>
                Công thức mẫu: doanh thu × thuế suất bạn chọn. Không thực hiện
                khấu trừ hay áp dụng quy định thuế thực tế.
              </p>
            </div>
            {!validRate && (
              <p className="field-error" role="alert">
                Nhập thuế suất minh họa từ 0 đến 100.
              </p>
            )}
            {revenue <= 0 && (
              <p className="field-error" role="alert">
                Duyệt ít nhất một hóa đơn có doanh thu trước khi tạo tờ khai.
              </p>
            )}
            <div className="modal-actions">
              <button
                type="button"
                className="button secondary"
                onClick={close}
              >
                Hủy
              </button>
              <button
                className="button primary"
                data-tour="generate"
                disabled={busy || !validRate || revenue <= 0}
              >
                {busy ? <Spinner /> : <Sparkles size={16} />}
                {busy ? "Đang tổng hợp…" : "Tạo bản nháp"}
              </button>
            </div>
          </form>
        </Modal>
      )}
      {preview && (
        <Modal
          title="Xem trước bản nháp"
          subtitle="Bản tổng hợp minh họa · Không dùng để nộp thuế"
          onClose={close}
          wide
          locked={!!tour}
        >
          <div className="declaration-document print-document">
            <div className="document-watermark">BẢN MINH HỌA</div>
            <div className="declaration-document-top">
              <span className="document-brand">visualize tax.</span>
              <span>Mẫu {preview.form}</span>
            </div>
            <h3>BẢN TỔNG HỢP TỜ KHAI THUẾ</h3>
            <p className="document-period">{preview.period}</p>
            <div className="document-rule" />
            <dl className="declaration-business">
              <div>
                <dt>Người nộp thuế mẫu</dt>
                <dd>Hộ kinh doanh Trần Minh</dd>
              </div>
              <div>
                <dt>Mã số thuế mẫu</dt>
                <dd>0000000000</dd>
              </div>
              <div>
                <dt>Địa chỉ mẫu</dt>
                <dd>Không gian trải nghiệm Visualize Tax</dd>
              </div>
            </dl>
            <table className="declaration-values">
              <thead>
                <tr>
                  <th>Chỉ tiêu minh họa</th>
                  <th className="text-right">Giá trị</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Doanh thu từ hóa đơn đã duyệt</td>
                  <td>{money(preview.revenue)}</td>
                </tr>
                <tr>
                  <td>Thuế suất minh họa do người dùng chọn</td>
                  <td>{preview.rate}%</td>
                </tr>
                <tr className="declaration-tax">
                  <td>Tổng thuế minh họa</td>
                  <td>{money(preview.tax)}</td>
                </tr>
              </tbody>
            </table>
            <div className="document-disclaimer">
              <CircleAlert size={18} />
              <p>
                Tài liệu được tạo từ dữ liệu hư cấu nhằm trình diễn UI/UX. Không
                có giá trị pháp lý, không phải biểu mẫu kê khai chính thức và
                chưa được nộp đến bất kỳ cơ quan nào.
              </p>
            </div>
            <div className="document-signature">
              <span>
                Ngày tạo:{" "}
                {new Date(preview.createdAt).toLocaleDateString("vi-VN", {
                  timeZone: "Asia/Ho_Chi_Minh",
                })}
              </span>
              <span>
                Hệ thống minh họa
                <br />
                <strong>Visualize Tax</strong>
              </span>
            </div>
          </div>
          <div className="modal-actions">
            <button className="button secondary" onClick={close}>
              Đóng
            </button>
            <button className="button primary" onClick={() => window.print()}>
              <Printer size={16} />
              In / Lưu PDF
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
