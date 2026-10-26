"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CircleAlert,
  FileCheck2,
  Files,
  GitCompareArrows,
  MessageSquareText,
  Send,
  Sparkles,
} from "lucide-react";
import { useDemo } from "./demo-provider";
import { mockApi } from "@/lib/demo-data";
import { useTask } from "@/lib/use-task";
import { Spinner } from "./ui";
const prompts = [
  {
    text: "Tổng hợp doanh thu hóa đơn của tôi",
    icon: Files,
    description: "Nhìn lại dữ liệu kinh doanh",
  },
  {
    text: "Hướng dẫn đối soát ngân hàng",
    icon: GitCompareArrows,
    description: "Hiểu từng bước so khớp",
  },
  {
    text: "Tôi muốn tạo tờ khai thuế",
    icon: FileCheck2,
    description: "Chuẩn bị một bản nháp mẫu",
  },
];
export function Assistant() {
  const { state, update, tour } = useDemo();
  const [input, setInput] = useState("");
  const { busy, run } = useTask();
  const bottom = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!state.messages.length) return;
    bottom.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "nearest",
    });
  }, [state.messages.length, busy]);
  function send(text: string) {
    const question = text.trim().slice(0, 1000);
    if (!question || busy) return;
    setInput("");
    update((s) => ({
      ...s,
      messages: [
        ...s.messages,
        { id: crypto.randomUUID(), role: "user" as const, text: question },
      ].slice(-98),
    }));
    void run(
      (signal) => mockApi.chat(question, state.invoices, signal),
      (answer) =>
        update((s) => ({
          ...s,
          messages: [
            ...s.messages,
            {
              id: crypto.randomUUID(),
              role: "assistant" as const,
              text: answer,
            },
          ].slice(-100),
        })),
    );
  }
  return (
    <div className="assistant-page">
      <div className="assistant-top">
        <div>
          <span className="page-eyebrow">
            <MessageSquareText size={16} />
            Một nơi để bắt đầu
          </span>
          <h1>
            Trợ lý thuế<span className="heading-dot">.</span>
          </h1>
        </div>
        <span className="assistant-mode">
          <span />
          Kịch bản minh họa
        </span>
      </div>
      <div className="assistant-layout">
        <section className="chat-workspace" aria-label="Hội thoại trợ lý thuế">
          {!state.messages.length ? (
            <div className="assistant-welcome">
              <div className="assistant-orb">
                <span className="brand-mark">
                  <span />
                  <span />
                  <span />
                </span>
                <Sparkles size={19} />
              </div>
              <span className="assistant-greeting">
                Chào Minh, tôi ở đây để hỗ trợ.
              </span>
              <h2>
                Gỡ rối chuyện thuế.
                <br />
                Bắt đầu bằng một câu hỏi.
              </h2>
              <p>
                Khám phá dữ liệu hóa đơn, đối soát giao dịch
                <br />
                và tạo tờ khai trong cùng một cuộc trò chuyện.
              </p>
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
                      <ArrowUpRight size={15} />
                    </span>
                    <strong>{p.text}</strong>
                    <small>{p.description}</small>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="chat-messages"
              role="log"
              aria-label="Lịch sử hội thoại"
              aria-live={tour ? "off" : "polite"}
            >
              {state.messages.map((m) => (
                <div key={m.id} className={`chat-message ${m.role}`}>
                  <span className="message-avatar">
                    {m.role === "user" ? "TM" : <Sparkles size={17} />}
                  </span>
                  <div>
                    <span className="message-author">
                      {m.role === "user" ? "Bạn" : "Trợ lý thuế · Kịch bản mẫu"}
                    </span>
                    <p>{m.text}</p>
                  </div>
                </div>
              ))}
              {busy && (
                <div className="chat-message assistant">
                  <span className="message-avatar">
                    <Sparkles size={17} />
                  </span>
                  <div className="typing-indicator" role="status">
                    <span />
                    <span />
                    <span />
                    <small>Đang tổng hợp dữ liệu mẫu…</small>
                  </div>
                </div>
              )}
              <div ref={bottom} />
            </div>
          )}
          <form
            className="chat-composer"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <label className="sr-only" htmlFor="chat-input">
              Câu hỏi của bạn
            </label>
            <textarea
              id="chat-input"
              value={input}
              maxLength={1000}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi về hóa đơn, đối soát hoặc tờ khai…"
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
              <span>
                <Sparkles size={13} />
                Không sử dụng AI thực tế
              </span>
              <button
                className="send-button"
                type="submit"
                aria-label="Gửi câu hỏi"
                disabled={busy || !input.trim()}
              >
                {busy ? <Spinner /> : <Send size={17} />}
              </button>
            </div>
          </form>
          <p className="chat-disclaimer">
            Câu trả lời được lập trình sẵn để minh họa trải nghiệm. Không phải
            tư vấn thuế.
          </p>
        </section>
        <aside className="assistant-context">
          <span className="context-icon">
            <Files size={22} />
          </span>
          <h3>Workspace của bạn</h3>
          <p>Mọi dữ liệu đều kết nối trong một không gian.</p>
          <div className="context-stat">
            <span>Hóa đơn</span>
            <strong>{state.invoices.length}</strong>
          </div>
          <div className="context-stat">
            <span>Đã duyệt</span>
            <strong>
              {state.invoices.filter((i) => i.status === "approved").length}
            </strong>
          </div>
          <div className="context-stat">
            <span>Đã đối soát</span>
            <strong>{state.matchedIds.length}</strong>
          </div>
          <div className="context-stat">
            <span>Bản nháp tờ khai</span>
            <strong>{state.declarations.length}</strong>
          </div>
          <Link href="/invoices" className="text-button">
            Xem hóa đơn <ArrowRight size={14} />
          </Link>
          <div className="context-note">
            <CircleAlert size={18} />
            <p>
              Trợ lý nhận diện từ khóa để chọn kịch bản phù hợp. Dữ liệu và câu
              trả lời chỉ phục vụ trình diễn.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
