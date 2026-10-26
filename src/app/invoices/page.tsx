import { Suspense } from "react";
import { Invoices } from "@/components/invoices";
export const metadata = { title: "Hóa đơn" };
export default function Page() {
  return (
    <Suspense fallback={<p>Đang mở hóa đơn…</p>}>
      <Invoices />
    </Suspense>
  );
}
