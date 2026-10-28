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

import {
  presentationScenarios,
  type TourScenario,
} from "@/lib/presentation-scenarios";
import { PresentationDriver } from "@/lib/presentation";

interface Tour {
  step: number;
  total: number;
  scenario: TourScenario;
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
  startTour: (scenario: TourScenario) => void;
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
          if (isDemoState(parsed))
            setState({
              ...parsed,
              matchedIds: parsed.bankSync ? parsed.matchedIds : [],
            });
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

  async function startTour(scenario: TourScenario) {
    if (abortRef.current && !abortRef.current.signal.aborted)
      abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const { signal } = controller;
    setEpoch((e) => e + 1);
    setState(initialState());
    setToast("");
    const total = presentationScenarios.find((s) => s.id === scenario)!.total;
    const show = (step: number, title: string, text: string) =>
      setTour({ step, total, scenario, title, text });
    const driver = new PresentationDriver(signal);
    try {
      if (scenario === "assistant") {
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
        await driver.click(
          '[data-tour="chat-view-invoice"]',
          "Mở hóa đơn để kiểm tra từng mặt hàng",
        );
        await driver.wait('[data-tour="invoice-detail"]');
        await driver.move(
          ".document-lines",
          "Đối chiếu số lượng, đơn giá và thành tiền",
        );
        await delay(2000, signal);
        await driver.click(
          '[data-tour="close-dialog"]',
          "Trở lại kết quả trích xuất",
        );
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
        await driver.move(
          '[data-tour="declaration-calculation"]',
          "Kiểm tra thuế đầu ra trừ thuế đầu vào",
        );
        await delay(1800, signal);
        await driver.click(
          '[data-tour="declaration-source"]',
          "Xem hóa đơn nguồn của tờ khai",
        );
        await delay(1500, signal);
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
        await driver.move(
          '[data-tour="declaration-indicators"]',
          "Kiểm tra doanh thu, GTGT và TNCN của mẫu TMĐT",
        );
        await delay(2200, signal);
        await driver.click('[data-tour="close-dialog"]', "Quay lại hội thoại");
      } else {
        show(
          1,
          "Đồng bộ ngân hàng & đối soát",
          "Đồng bộ giao dịch mẫu, mở cặp đã khớp để so MST và tổng tiền, sau đó kiểm tra khoản thanh toán bị lệch.",
        );
        router.push("/reconciliation");
        await driver.wait('[data-tour="reconciliation-empty"]');
        await driver.click(
          '[data-tour="reconcile"]',
          "Đồng bộ sao kê và đối chiếu hóa đơn",
        );
        await driver.wait('[data-tour="reconcile-bank-03"]');
        show(
          2,
          "Kiểm tra cặp đã khớp",
          "Đối chiếu MST hai bên và 26.400.000 đồng ghi Có với tổng thanh toán hóa đơn Studio Sáng.",
        );
        await driver.click(
          '[data-tour="reconcile-bank-03"]',
          "Xem giao dịch khớp hóa đơn Studio Sáng",
        );
        await driver.wait('[data-tour="reconcile-verdict"]');
        await driver.move(
          '[data-tour="reconcile-verdict"]',
          "MST trùng nhau, tổng tiền bằng nhau, chênh lệch 0",
        );
        await delay(1800, signal);
        await driver.click(
          '[data-tour="reconcile-full-invoice"]',
          "Mở hóa đơn nguồn để kiểm chứng",
        );
        await delay(1000, signal);
        await driver.click(
          '[data-tour="close-dialog"]',
          "Trở về danh sách đối sánh",
        );
        show(
          3,
          "Giải thích khoản chưa khớp",
          "Cùng MST và số hóa đơn, nhưng ngân hàng ghi Có 20 triệu trong khi tổng hóa đơn là 20,35 triệu: còn thiếu 350.000 đồng.",
        );
        await driver.click(
          '[data-tour="reconcile-bank-02"]',
          "Kiểm tra giao dịch chưa khớp",
        );
        await driver.move(
          '[data-tour="reconcile-verdict"]',
          "Ngân hàng 20 triệu, hóa đơn 20,35 triệu: thiếu 350 nghìn",
        );
        await delay(2000, signal);
        await driver.click(
          '[data-tour="close-dialog"]',
          "Hoàn tất trình diễn đối soát",
        );
      }
      if (!signal.aborted && abortRef.current === controller) {
        setTour(null);
        abortRef.current = null;
        notify(
          scenario === "assistant"
            ? "Đã hoàn tất kịch bản Trợ lý thuế: hóa đơn, doanh thu, biểu đồ và tờ khai."
            : "Đã hoàn tất kịch bản Đồng bộ & đối soát: giao dịch khớp và chênh lệch tiền.",
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
