import type { Metadata } from "next";
import { DemoProvider } from "@/components/demo-provider";
import { WorkspaceShell } from "@/components/workspace-shell";
import "@fontsource/be-vietnam-pro/vietnamese-400.css";
import "@fontsource/be-vietnam-pro/vietnamese-500.css";
import "@fontsource/be-vietnam-pro/vietnamese-600.css";
import "@fontsource/be-vietnam-pro/vietnamese-700.css";
import "@fontsource/be-vietnam-pro/latin-400.css";
import "@fontsource/be-vietnam-pro/latin-500.css";
import "@fontsource/be-vietnam-pro/latin-600.css";
import "@fontsource/be-vietnam-pro/latin-700.css";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Visualize Tax · Không gian quản lý thuế",
    template: "%s · Visualize Tax",
  },
  description:
    "Bản tái hiện độc lập cho portfolio: khám phá luồng hóa đơn, đối soát và tờ khai trong một workspace tiếng Việt. Toàn bộ dữ liệu là mô phỏng.",
  robots: { index: false, follow: false },
  applicationName: "Visualize Tax",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <DemoProvider>
          <WorkspaceShell>{children}</WorkspaceShell>
        </DemoProvider>
      </body>
    </html>
  );
}
