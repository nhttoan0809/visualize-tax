"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X, LoaderCircle, FileCheck2, Clock3 } from "lucide-react";
export function Spinner() {
  return <LoaderCircle size={17} className="spin" aria-hidden="true" />;
}
export function Status({
  approved,
  matched,
}: {
  approved?: boolean;
  matched?: boolean;
}) {
  return (
    <span
      className={`status ${approved || matched ? "status-green" : "status-amber"}`}
    >
      {approved || matched ? <FileCheck2 size={12} /> : <Clock3 size={12} />}
      {matched ? "Đã khớp" : approved ? "Đã duyệt" : "Chờ kiểm tra"}
    </span>
  );
}
export function Modal({
  title,
  subtitle,
  children,
  onClose,
  wide = false,
  locked = false,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
  locked?: boolean;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const id = useId();
  useEffect(() => {
    if (locked) return;
    const previous = document.activeElement as HTMLElement | null;
    const root = dialogRef.current;
    const focusable = () =>
      Array.from(
        root?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input, select, textarea, [tabindex="0"]',
        ) ?? [],
      );
    (
      root?.querySelector<HTMLElement>("[data-autofocus]") ?? focusable()[0]
    )?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
      if (e.key !== "Tab") return;
      const elements = focusable(),
        first = elements[0],
        last = elements.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    root?.addEventListener("keydown", handler);
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      root?.removeEventListener("keydown", handler);
      document.body.style.overflow = oldOverflow;
      if (previous?.isConnected) previous.focus();
    };
  }, [locked, onClose]);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (!locked && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        className={`modal ${wide ? "modal-wide" : ""}`}
      >
        <div className="modal-heading">
          <div>
            <h2 id={id}>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button
            data-tour="close-dialog"
            className="icon-button"
            onClick={onClose}
            aria-label="Đóng hộp thoại"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
