"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDemo } from "@/components/demo-provider";
export function useTask() {
  const [busy, setBusy] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const { notify } = useDemo();
  useEffect(() => () => controller.current?.abort(), []);
  const cancel = useCallback(() => {
    controller.current?.abort();
    setBusy(false);
  }, []);
  async function run<T>(
    request: (signal: AbortSignal) => Promise<T>,
    onSuccess: (result: T) => void,
  ) {
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    setBusy(true);
    try {
      const result = await request(current.signal);
      if (!current.signal.aborted) onSuccess(result);
    } catch (error) {
      if (!current.signal.aborted)
        notify(
          error instanceof Error
            ? error.message
            : "Không thể hoàn tất. Vui lòng thử lại.",
        );
    } finally {
      if (!current.signal.aborted) setBusy(false);
    }
  }
  return { busy, run, cancel };
}
