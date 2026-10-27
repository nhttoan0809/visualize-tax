"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChartNoAxesCombined,
  Check,
  FileCheck2,
  FileImage,
  FileText,
  FolderOpen,
  ImagePlus,
  Info,
  Paperclip,
  Printer,
  Send,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { useDemo } from "./demo-provider";
import {
  invoiceChart,
  money,
  mockApi,
  type ChatAttachment,
  type Declaration,
  type MessageArtifact,
} from "@/lib/demo-data";
import { useTask } from "@/lib/use-task";
import { Modal, Spinner } from "./ui";
import {
  ChartArtifact,
  DeclarationArtifact,
  InvoiceArtifact,
} from "./chat-artifacts";
import { DeclarationDocument } from "./declaration-document";

const prompts = [
  {
    text: "Tổng hợp doanh thu hóa đơn của tôi",
    icon: ChartNoAxesCombined,
    description: "Phân tích và biểu đồ",
    tag: "Dữ liệu kinh doanh",
  },
  {
    text: "Tạo tờ khai thuế 01/GTGT",
    icon: FileText,
    description: "Tạo bản nháp từ hóa đơn",
    tag: "01/GTGT",
  },
  {
    text: "Tạo tờ khai thuế 02/CNKD",
    icon: FileCheck2,
    description: "Thử biểu mẫu kinh doanh",
    tag: "02/CNKD",
  },
];
interface AssistantResult {
  text: string;
  artifact?: MessageArtifact;
  declaration?: Declaration;
}

export function Assistant() {
  const { state, update, tour } = useDemo();
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<ChatAttachment | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [fileError, setFileError] = useState("");
  const [preview, setPreview] = useState<Declaration | null>(null);
  const { busy, run } = useTask();
  const scroll = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const closeUpload = useCallback(() => {
    setUploadOpen(false);
    setFileError("");
  }, []);
  const closePreview = useCallback(() => setPreview(null), []);
  useEffect(() => {
    const el = scroll.current;
    if (el)
      el.scrollTo({
        top: el.scrollHeight,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  }, [state.messages.length, busy]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "i" && !busy) {
        e.preventDefault();
        setUploadOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [busy]);
  function selectAttachment(file?: File) {
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp", "application/pdf"].includes(
        file.type,
      ) ||
      file.size > 10 * 1024 * 1024
    ) {
      setFileError("Chọn ảnh PNG, JPG, WEBP hoặc PDF tối đa 10 MB.");
      return;
    }
    setAttachment({
      name: file.name.slice(0, 120),
      kind: file.type === "application/pdf" ? "document" : "image",
    });
    closeUpload();
  }
  function send(text: string) {
    const pending = attachment;
    const question = (
      text.trim() ||
      (pending ? "Trích xuất thông tin hóa đơn trong ảnh này giúp tôi." : "")
    ).slice(0, 1000);
    if (!question || busy) return;
    setInput("");
    setAttachment(null);
    update((s) => ({
      ...s,
      messages: [
        ...s.messages,
        {
          id: crypto.randomUUID(),
          role: "user" as const,
          text: question,
          ...(pending ? { attachment: pending } : {}),
        },
      ].slice(-98),
    }));
    void run<AssistantResult>(
      async (signal) => {
        if (pending) {
          const invoice = await mockApi.extractInvoice(pending.name, signal);
          return {
            text: "Đã đọc hóa đơn 0000129, ký hiệu 1C26TMM, ngày 25/10/2026. Bên mua: Xưởng Giấy Nhỏ. Hai mặt hàng gồm 500 sổ tay A5 (14.000.000 ₫) và 1.000 túi giấy kraft (6.000.000 ₫). Tiền hàng 20.000.000 ₫, VAT minh họa 2.000.000 ₫, tổng thanh toán 22.000.000 ₫.\n\nChọn Xem chi tiết để kiểm tra bên mua, từng dòng hàng và thông tin chuyển khoản trước khi lưu. Kết quả được dựng từ ảnh mẫu, không phải OCR thực tế.",
            artifact: { type: "invoice", invoice },
          };
        }
        const form: Declaration["form"] | null = /02\s*[/-]\s*cnkd/i.test(
          question,
        )
          ? "02/CNKD"
          : /01\s*[/-]\s*cnkd/i.test(question)
            ? "01/CNKD"
            : /01\s*[/-]\s*gtgt|tạo.*tờ khai/i.test(question)
              ? "01/GTGT"
              : null;
        if (form) {
          const revenue = state.invoices
            .filter((i) => i.status === "approved")
            .reduce((sum, i) => sum + i.amount, 0);
          if (!revenue)
            return {
              text: "Chưa có doanh thu đã duyệt để tổng hợp. Hãy thêm và lưu một hóa đơn trước khi tạo bản nháp.",
            };
          const declaration = await mockApi.createDeclaration(
            {
              form,
              period: "Tháng 10/2026",
              revenue,
              rate: form === "01/GTGT" ? 10 : 1.5,
            },
            signal,
            state.invoices,
          );
          return {
            text:
              form === "01/GTGT"
                ? `Đã lập bản nháp 01/GTGT cho kịch bản doanh nghiệp kê khai khấu trừ. Doanh thu bán ra ${money(revenue)}; thuế đầu ra mô phỏng ${money(Math.round((revenue * declaration.rate) / 100))}. Hai chứng từ mua vào mẫu có thuế được giả định đủ điều kiện khấu trừ ${money(declaration.inputVat ?? 0)}. Số thuế còn phải nộp minh họa: ${money(declaration.tax)}.\n\nMở bản nháp để xem các nhóm chỉ tiêu, công thức và danh sách hóa đơn nguồn. Đây là cấu trúc tham khảo TT80/2021, không tự xác định nghĩa vụ thuế thực tế.`
                : `Đã tạo bản nháp ${form} từ ${state.invoices.filter((i) => i.status === "approved").length} hóa đơn đã duyệt, doanh thu ${money(revenue)}. ${form === "02/CNKD" ? "Tình huống này dùng cấu trúc tham khảo 02/CNKD-TMĐT (NĐ117/2025), với giả định toàn bộ doanh thu là bán hàng văn phòng phẩm trên nền tảng mẫu không có chức năng thanh toán." : "Tình huống hộ kinh doanh bán hàng mẫu."}\n\nTổng tỷ lệ mô phỏng ${declaration.rate}% được tách thành GTGT và TNCN trong bản chi tiết. Đây là kịch bản độc lập với hồ sơ doanh nghiệp của case 01/GTGT; không phải lựa chọn mẫu hay mức thuế áp dụng cho người dùng.`,
            artifact: { type: "declaration", declarationId: declaration.id },
            declaration,
          };
        }
        const answer = await mockApi.chat(question, state.invoices, signal);
        if (/doanh thu|biểu đồ|thống kê|tổng hợp/i.test(question))
          return { text: answer, artifact: invoiceChart(state.invoices) };
        return { text: answer };
      },
      (result) =>
        update((s) => ({
          ...s,
          declarations: result.declaration
            ? [result.declaration, ...s.declarations].slice(0, 100)
            : s.declarations,
          messages: [
            ...s.messages,
            {
              id: crypto.randomUUID(),
              role: "assistant" as const,
              text: result.text,
              ...(result.artifact ? { artifact: result.artifact } : {}),
            },
          ].slice(-100),
        })),
    );
  }
  const approved = state.invoices.filter((i) => i.status === "approved");
  const revenue = approved.reduce((sum, i) => sum + i.amount, 0);
  return (
    <div className="assistant-page" data-presenting={!!tour}>
      <header className="assistant-header">
        <div className="assistant-header-title">
          <span className="assistant-header-icon">
            <Sparkles size={20} />
          </span>
          <div>
            <h1>
              Trợ lý thuế<span className="heading-dot">.</span>
            </h1>
            <p>Chứng từ, dữ liệu và tờ khai trong một cuộc trò chuyện.</p>
          </div>
        </div>
        <span className="assistant-mode">
          <span />
          Không gian trải nghiệm
        </span>
      </header>
      <div className="assistant-layout">
        <section className="chat-workspace" aria-label="Hội thoại trợ lý thuế">
          <div className="chat-scroll" ref={scroll}>
            {!state.messages.length ? (
              <div className="assistant-welcome">
                <span className="assistant-welcome-label">
                  <span />
                  Từ chứng từ đến bức tranh kinh doanh
                </span>
                <div className="assistant-orb">
                  <span className="brand-mark">
                    <span />
                    <span />
                    <span />
                  </span>
                  <Sparkles size={19} />
                </div>
                <h2>
                  Hóa đơn vào.
                  <br />
                  Mọi thứ rõ ràng hơn.
                </h2>
                <p>
                  Gửi một ảnh hóa đơn, hỏi về doanh thu,
                  <br />
                  hoặc để tôi chuẩn bị bản nháp tờ khai cho bạn.
                </p>
                <button
                  className="welcome-upload"
                  onClick={() => setUploadOpen(true)}
                >
                  <span>
                    <ImagePlus size={24} />
                  </span>
                  <div>
                    <strong>Bắt đầu từ một ảnh hóa đơn</strong>
                    <small>
                      Trích xuất thông tin · Kiểm tra · Lưu chứng từ
                    </small>
                  </div>
                  <ArrowUpRight size={19} />
                </button>
                <div className="prompt-grid">
                  {prompts.map((p, i) => (
                    <button
                      key={p.text}
                      data-tour={i === 0 ? "chat-preset" : undefined}
                      onClick={() => send(p.text)}
                      disabled={busy}
                    >
                      <span>
                        <p.icon size={18} />
                        <ArrowUpRight size={14} />
                      </span>
                      <small className="prompt-tag">{p.tag}</small>
                      <strong>{p.text}</strong>
                      <small>{p.description}</small>
                    </button>
                  ))}
                </div>
                <div className="assistant-trust">
                  <ShieldCheck size={13} />
                  Bạn kiểm tra và quyết định trước mỗi bước ghi nhận.
                </div>
              </div>
            ) : (
              <div
                className="chat-messages"
                role="log"
                aria-label="Lịch sử hội thoại"
                aria-live={tour ? "off" : "polite"}
              >
                {state.messages.map((m) => {
                  const draftId =
                    m.artifact?.type === "declaration"
                      ? m.artifact.declarationId
                      : undefined;
                  const draft = draftId
                    ? state.declarations.find((d) => d.id === draftId)
                    : undefined;
                  return (
                    <article key={m.id} className={`chat-message ${m.role}`}>
                      <span className="message-avatar">
                        {m.role === "user" ? "TM" : <Sparkles size={17} />}
                      </span>
                      <div className="message-content">
                        <span className="message-author">
                          {m.role === "user" ? "Bạn" : "Trợ lý thuế"}
                          {m.role === "assistant" && (
                            <span className="message-demo-tag">Mô phỏng</span>
                          )}
                        </span>
                        {m.attachment && (
                          <div className="chat-message-attachment">
                            <Image
                              unoptimized
                              src="/demo/invoice-sample.svg"
                              alt="Hóa đơn mẫu minh họa được đính kèm"
                              width={88}
                              height={113}
                            />
                            <span>
                              <strong>{m.attachment.name}</strong>
                              <small>
                                Ảnh minh họa · Không tải lên máy chủ
                              </small>
                            </span>
                          </div>
                        )}
                        <p>{m.text}</p>
                        {m.artifact?.type === "invoice" && (
                          <InvoiceArtifact artifact={m.artifact} />
                        )}
                        {m.artifact?.type === "chart" && (
                          <ChartArtifact artifact={m.artifact} />
                        )}
                        {draft && (
                          <DeclarationArtifact
                            declaration={draft}
                            onPreview={() => setPreview(draft)}
                          />
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
            {busy && (
              <div className="chat-message assistant chat-processing">
                <span className="message-avatar">
                  <Sparkles size={17} />
                </span>
                <div className="typing-indicator" role="status">
                  <span />
                  <span />
                  <span />
                  <small>
                    {state.messages.at(-1)?.attachment
                      ? "Đang mô phỏng trích xuất hóa đơn…"
                      : "Đang tổng hợp dữ liệu mẫu…"}
                  </small>
                </div>
              </div>
            )}
          </div>
          <div className="chat-composer-dock">
            {state.messages.length > 0 && (
              <div className="chat-followups">
                <button
                  disabled={busy}
                  onClick={() =>
                    send(
                      "Tổng hợp doanh thu hóa đơn của tôi và hiển thị biểu đồ.",
                    )
                  }
                >
                  <ChartNoAxesCombined size={13} />
                  Phân tích doanh thu
                </button>
                <button
                  disabled={busy}
                  onClick={() => send("Tạo tờ khai thuế 01/GTGT")}
                >
                  <FileText size={13} />
                  01/GTGT
                </button>
                <button
                  disabled={busy}
                  onClick={() => send("Tạo tờ khai thuế 02/CNKD")}
                >
                  <FileCheck2 size={13} />
                  02/CNKD
                </button>
              </div>
            )}
            <form
              className="chat-composer"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              {attachment && (
                <div
                  className="composer-attachment"
                  data-tour="chat-attachment"
                >
                  <span>
                    <FileImage size={18} />
                  </span>
                  <div>
                    <strong>{attachment.name}</strong>
                    <small>Sẵn sàng trích xuất minh họa</small>
                  </div>
                  <button
                    type="button"
                    className="icon-button"
                    aria-label="Bỏ tệp đính kèm"
                    onClick={() => setAttachment(null)}
                  >
                    <X size={15} />
                  </button>
                </div>
              )}
              <label className="sr-only" htmlFor="chat-input">
                Câu hỏi của bạn
              </label>
              <textarea
                id="chat-input"
                data-tour="chat-input"
                value={input}
                maxLength={1000}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  attachment
                    ? "Bạn muốn tôi xử lý hóa đơn này như thế nào?"
                    : "Gửi hóa đơn hoặc hỏi điều bạn đang cần…"
                }
                rows={2}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    !e.nativeEvent.isComposing
                  ) {
                    e.preventDefault();
                    send(input);
                  }
                }}
              />
              <div className="composer-bottom">
                <div className="composer-tools">
                  <button
                    type="button"
                    className="attach-button"
                    data-tour="chat-attach"
                    aria-label="Đính kèm hóa đơn"
                    title="Đính kèm hóa đơn · Alt + I"
                    onClick={() => setUploadOpen(true)}
                    disabled={busy}
                  >
                    <Paperclip size={17} />
                  </button>
                  <span>Ảnh hóa đơn, dữ liệu, tờ khai</span>
                </div>
                <div className="composer-send">
                  <kbd>Ctrl ↵</kbd>
                  <button
                    data-tour="chat-send"
                    className="send-button"
                    type="submit"
                    aria-label="Gửi câu hỏi"
                    disabled={busy || (!input.trim() && !attachment)}
                  >
                    {busy ? <Spinner /> : <Send size={17} />}
                  </button>
                </div>
              </div>
            </form>
            <p className="chat-disclaimer">
              <ShieldCheck size={11} />
              Dữ liệu và phản hồi minh họa. Không sử dụng AI thực tế, không phải
              tư vấn thuế.
            </p>
          </div>
        </section>
        <aside className="assistant-context">
          <div className="context-top">
            <span className="context-icon">
              <FolderOpen size={21} />
            </span>
            <h2>Ngữ cảnh của bạn</h2>
            <p>
              Mỗi chứng từ thêm vào,
              <br />
              một bức tranh đầy đủ hơn.
            </p>
          </div>
          <div className="context-revenue">
            <span>Doanh thu đã duyệt</span>
            <strong>{money(revenue)}</strong>
            <small>Tháng 10/2026 · Dữ liệu mẫu</small>
          </div>
          <div className="context-stat">
            <span>Hóa đơn</span>
            <strong>{state.invoices.length}</strong>
          </div>
          <div className="context-stat">
            <span>Đã duyệt</span>
            <strong>{approved.length}</strong>
          </div>
          <div className="context-stat">
            <span>Bản nháp tờ khai</span>
            <strong>{state.declarations.length}</strong>
          </div>
          <Link href="/invoices" className="context-link">
            Mở kho hóa đơn <ArrowUpRight size={14} />
          </Link>
          <div className="context-capabilities">
            <h3>Cùng bạn xử lý</h3>
            <span>
              <Check size={13} />
              Đọc và lưu hóa đơn mẫu
            </span>
            <span>
              <Check size={13} />
              Phân tích kèm biểu đồ
            </span>
            <span>
              <Check size={13} />
              Tạo 01/GTGT, 02/CNKD
            </span>
          </div>
          <div className="context-note">
            <Info size={17} />
            <p>
              Bạn đang khám phá bản tái hiện. Tất cả dữ liệu và kết quả chỉ phục
              vụ trình diễn.
            </p>
          </div>
        </aside>
      </div>
      {uploadOpen && (
        <Modal
          title="Đính kèm hóa đơn"
          subtitle="Chọn ảnh mẫu để thử luồng xử lý trong hội thoại"
          onClose={closeUpload}
          locked={!!tour}
        >
          <div className="chat-upload-picker">
            <div className="sample-invoice-preview">
              <Image
                unoptimized
                src="/demo/invoice-sample.svg"
                alt="Ảnh hóa đơn mẫu Xưởng Giấy Nhỏ"
                width={112}
                height={144}
              />
              <div>
                <span className="artifact-badge">Có sẵn để trải nghiệm</span>
                <h3>Hóa đơn Xưởng Giấy Nhỏ</h3>
                <p>
                  Một ảnh hóa đơn hư cấu với thông tin khách hàng, doanh thu và
                  VAT minh họa.
                </p>
                <button
                  className="button primary"
                  data-tour="chat-use-sample"
                  onClick={() => {
                    setAttachment({
                      name: "hoa-don-xuong-giay.svg",
                      kind: "image",
                    });
                    closeUpload();
                  }}
                >
                  <ImagePlus size={16} />
                  Dùng ảnh hóa đơn mẫu
                </button>
              </div>
            </div>
            <div className="upload-or">
              <span />
              hoặc chọn từ thiết bị
              <span />
            </div>
            <button
              className="button secondary full-width"
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={16} />
              Chọn ảnh / PDF
            </button>
            <input
              ref={fileRef}
              className="sr-only"
              type="file"
              accept="image/png,image/jpeg,image/webp,application/pdf"
              aria-label="Chọn hóa đơn cho trợ lý"
              onChange={(e) => selectAttachment(e.target.files?.[0])}
            />
            {fileError && (
              <p className="field-error" role="alert">
                {fileError}
              </p>
            )}
            <div className="info-box">
              <Info size={16} />
              <p>
                Ảnh và kết quả luôn là mẫu có sẵn. File thiết bị chỉ dùng tên,
                không đọc nội dung hay tải lên máy chủ.
              </p>
            </div>
          </div>
        </Modal>
      )}
      {preview && (
        <Modal
          title="Xem trước bản nháp"
          subtitle={`Mẫu ${preview.form} · Không dùng để nộp thuế`}
          onClose={closePreview}
          wide
          locked={!!tour}
        >
          <DeclarationDocument declaration={preview} />
          <div className="modal-actions">
            <button className="button secondary" onClick={closePreview}>
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
