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

import { PresentationDriver } from "@/lib/presentation";

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
    const driver = new PresentationDriver(signal);
    try {
      show(
        1,
        "Từ ảnh chụp thành hóa đơn",
        "Đính kèm ảnh mẫu, gõ yêu cầu trích xuất và lưu hóa đơn ngay trong hội thoại.",
      );
      router.push("/assistant");
      await driver.wait('[data-tour="chat-attach"]');
      await delay(1100, signal);
      await driver.click('[data-tour="chat-attach"]', "Đính kèm hóa đơn");
      await driver.click(
        '[data-tour="chat-use-sample"]',
        "Chọn ảnh hóa đơn mẫu",
      );
      await driver.type(
        '[data-tour="chat-input"]',
        "Trích xuất thông tin và lưu hóa đơn từ ảnh này giúp tôi.",
      );
      await driver.shortcut(
        '[data-tour="chat-input"]',
        "Enter",
        { ctrlKey: true },
        "Ctrl + Enter",
      );
      await driver.wait('[data-tour="chat-save-invoice"]');
      await delay(1600, signal);
      await driver.click(
        '[data-tour="chat-save-invoice"]',
        "Kiểm tra và lưu hóa đơn",
      );
      await driver.wait('[data-tour="chat-saved-invoice"]');
      await delay(1000, signal);
      show(
        2,
        "Hỏi dữ liệu, nhìn thấy bức tranh",
        "Gõ câu hỏi về doanh thu. Trợ lý tổng hợp hóa đơn đã duyệt và trả lời kèm biểu đồ có thể kiểm tra.",
      );
      await driver.type(
        '[data-tour="chat-input"]',
        "Tổng hợp doanh thu hóa đơn của tôi và hiển thị biểu đồ theo ngày.",
      );
      await driver.shortcut(
        '[data-tour="chat-input"]',
        "Enter",
        { ctrlKey: true },
        "Ctrl + Enter",
      );
      await driver.wait('[data-tour="chat-chart"]');
      await driver.move('[data-tour="chat-chart"]', "Xem biểu đồ doanh thu");
      await delay(2300, signal);
      show(
        3,
        "Tạo tờ khai 01/GTGT",
        "Từ yêu cầu trong hội thoại, tạo bản nháp minh họa rồi mở biểu mẫu để kiểm tra thông tin.",
      );
      await driver.type(
        '[data-tour="chat-input"]',
        "Tạo tờ khai thuế 01/GTGT cho tháng 10/2026.",
      );
      await driver.shortcut(
        '[data-tour="chat-input"]',
        "Enter",
        { ctrlKey: true },
        "Ctrl + Enter",
      );
      await driver.wait('[data-tour="chat-preview-01-GTGT"]');
      await driver.click(
        '[data-tour="chat-preview-01-GTGT"]',
        "Mở bản nháp 01/GTGT",
      );
      await driver.wait('[data-tour="close-dialog"]');
      await delay(2000, signal);
      await driver.click('[data-tour="close-dialog"]', "Quay lại hội thoại");
      show(
        4,
        "Tạo tờ khai 02/CNKD",
        "Tiếp tục với mẫu 02/CNKD trong cùng hội thoại. Hai bản nháp được lưu trong workspace, chưa gửi đi đâu.",
      );
      await driver.type(
        '[data-tour="chat-input"]',
        "Tạo tờ khai thuế 02/CNKD cho hộ kinh doanh của tôi.",
      );
      await driver.shortcut(
        '[data-tour="chat-input"]',
        "Enter",
        { ctrlKey: true },
        "Ctrl + Enter",
      );
      await driver.wait('[data-tour="chat-preview-02-CNKD"]');
      await driver.click(
        '[data-tour="chat-preview-02-CNKD"]',
        "Mở bản nháp 02/CNKD",
      );
      await driver.wait('[data-tour="close-dialog"]');
      await delay(2200, signal);
      await driver.click(
        '[data-tour="close-dialog"]',
        "Hoàn tất bốn tình huống",
      );
      if (!signal.aborted && abortRef.current === controller) {
        setTour(null);
        abortRef.current = null;
        notify(
          "Đã trình diễn đủ 4 tình huống. Bạn có thể tiếp tục khám phá hội thoại.",
        );
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
    } finally {
      driver.cleanup();
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
