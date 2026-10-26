"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  delay,
  initialState,
  isDemoState,
  STORAGE_KEY,
  type DemoState,
} from "@/lib/demo-data";

interface Tour {
  step: number;
  title: string;
  text: string;
}
interface DemoContextValue {
  state: DemoState;
  update: (fn: (state: DemoState) => DemoState) => void;
  reset: () => void;
  ready: boolean;
  notify: (message: string) => void;
  toast: string;
  tour: Tour | null;
  startTour: () => void;
  stopTour: () => void;
  epoch: number;
}
const DemoContext = createContext<DemoContextValue | null>(null);
export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("DemoProvider is missing");
  return context;
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(initialState);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");
  const [tour, setTour] = useState<Tour | null>(null);
  const [epoch, setEpoch] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Restore browser-only persistence after hydration; keep the initial SSR snapshot stable.
    const timer = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: unknown = JSON.parse(stored);
          if (isDemoState(parsed)) setState(parsed);
        }
      } catch {
        /* Disabled or malformed storage falls back to the demo seed. */
      }
      setReady(true);
    }, 0);
    return () => {
      window.clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* In-memory mode remains usable. */
    }
  }, [state, ready]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 5000);
    return () => clearTimeout(timer);
  }, [toast]);
  const update = useCallback(
    (fn: (s: DemoState) => DemoState) => setState(fn),
    [],
  );
  const notify = useCallback((message: string) => setToast(message), []);
  const stopTour = useCallback(() => {
    abortRef.current?.abort();
    setTour(null);
    setEpoch((e) => e + 1);
  }, []);
  const reset = useCallback(() => {
    stopTour();
    setState(initialState());
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* Nothing else is cleared. */
    }
    router.push("/");
    setToast("Đã đặt lại toàn bộ dữ liệu và trạng thái trình diễn.");
  }, [router, stopTour]);
  useEffect(() => {
    if (!tour) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") stopTour();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [tour, stopTour]);

  async function startTour() {
    if (abortRef.current && !abortRef.current.signal.aborted)
      abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const { signal } = controller;
    setEpoch((e) => e + 1);
    setState(initialState());
    setToast("");
    const show = (step: number, title: string, text: string) =>
      setTour({ step, title, text });
    // Executes real DOM controls. Inert prevents human keyboard/pointer input,
    // while programmatic click is available to this cancellable presentation.
    const click = async (name: string) => {
      for (let attempt = 0; attempt < 80; attempt++) {
        if (signal.aborted) throw new DOMException("Stopped", "AbortError");
        const el = document.querySelector<HTMLButtonElement>(
          `[data-tour="${name}"]`,
        );
        if (el && !el.disabled) {
          el.scrollIntoView({ block: "center", behavior: "instant" });
          el.click();
          return;
        }
        await delay(100, signal);
      }
      throw new Error(`Không tìm được bước trình diễn: ${name}`);
    };
    try {
      show(
        1,
        "Một workspace, toàn bộ luồng thuế",
        "Bắt đầu từ dữ liệu minh họa ban đầu. Trình diễn sẽ tự thao tác trong khoảng 30 giây.",
      );
      router.push("/");
      await delay(3200, signal);
      show(
        2,
        "Tiếp nhận hóa đơn",
        "Mở hóa đơn và mô phỏng trích xuất một chứng từ mẫu. Không có file được gửi lên máy chủ.",
      );
      router.push("/invoices");
      await click("upload");
      await delay(1500, signal);
      await click("sample");
      await delay(2500, signal);
      show(
        3,
        "Kiểm tra trước khi ghi nhận",
        "Xem thông tin trích xuất, tổng tiền và duyệt hóa đơn để sử dụng ở các bước sau.",
      );
      await delay(1600, signal);
      await click("approve");
      await delay(1800, signal);
      show(
        4,
        "Đối soát giao dịch",
        "Ghép các hóa đơn đã duyệt với giao dịch mẫu theo tổng thanh toán. Giữ lại giao dịch chưa khớp để kiểm tra.",
      );
      router.push("/reconciliation");
      await click("reconcile");
      await delay(3400, signal);
      show(
        5,
        "Tạo bản nháp tờ khai",
        "Dùng doanh thu đã duyệt để tạo bản nháp. Thuế suất và biểu mẫu chỉ phục vụ minh họa.",
      );
      router.push("/declarations");
      await click("new-declaration");
      await delay(1600, signal);
      await click("generate");
      await delay(3000, signal);
      await click("close-dialog");
      show(
        6,
        "Trao đổi với trợ lý thuế",
        "Kịch bản có sẵn tổng hợp dữ liệu hiện tại. Bạn có thể dừng và tự khám phá bất kỳ lúc nào.",
      );
      router.push("/assistant");
      await click("chat-preset");
      await delay(4200, signal);
      if (!signal.aborted) {
        setTour(null);
        abortRef.current = null;
        notify("Trình diễn hoàn tất. Workspace sẵn sàng để bạn khám phá.");
      }
    } catch (error) {
      if (!signal.aborted) {
        setTour(null);
        abortRef.current = null;
        setEpoch((e) => e + 1);
        notify(
          error instanceof Error
            ? error.message
            : "Trình diễn bị gián đoạn. Bạn có thể chạy lại.",
        );
      }
    }
  }
  return (
    <DemoContext.Provider
      value={{
        state,
        update,
        reset,
        ready,
        notify,
        toast,
        tour,
        startTour,
        stopTour,
        epoch,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}
