export type InvoiceStatus = "review" | "approved";
export interface Invoice {
  id: string;
  number: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  vat: number;
  status: InvoiceStatus;
  source: string;
}
export interface Declaration {
  id: string;
  form: "01/GTGT" | "01/CNKD" | "02/CNKD";
  period: string;
  revenue: number;
  rate: number;
  tax: number;
  createdAt: string;
}
export interface ChartPoint {
  label: string;
  revenue: number;
}
export type MessageArtifact =
  | { type: "invoice"; invoice: Invoice }
  | { type: "chart"; points: ChartPoint[]; total: number; count: number }
  | { type: "declaration"; declarationId: string };
export interface ChatAttachment {
  name: string;
  kind: "image" | "document";
}
export interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  attachment?: ChatAttachment;
  artifact?: MessageArtifact;
}
export interface DemoState {
  version: 1;
  invoices: Invoice[];
  matchedIds: string[];
  declarations: Declaration[];
  messages: Message[];
}
export const STORAGE_KEY = "visualize-tax:demo:v1";
export const seedInvoices: Invoice[] = [
  {
    id: "inv-01",
    number: "0000128",
    name: "Công ty Thiết kế Mộc",
    category: "Dịch vụ thiết kế",
    date: "2026-10-24",
    amount: 32000000,
    vat: 3200000,
    status: "approved",
    source: "hoa-don-moc.pdf",
  },
  {
    id: "inv-02",
    number: "0000127",
    name: "Cửa hàng An Nhiên",
    category: "Hàng hóa bán lẻ",
    date: "2026-10-22",
    amount: 18500000,
    vat: 1850000,
    status: "review",
    source: "hoa-don-an-nhien.pdf",
  },
  {
    id: "inv-03",
    number: "0000126",
    name: "Studio Sáng",
    category: "Dịch vụ sáng tạo",
    date: "2026-10-20",
    amount: 24000000,
    vat: 2400000,
    status: "approved",
    source: "hoa-don-studio.pdf",
  },
  {
    id: "inv-04",
    number: "0000125",
    name: "Công ty Gốm Việt",
    category: "Hàng hóa bán lẻ",
    date: "2026-10-18",
    amount: 12700000,
    vat: 1270000,
    status: "approved",
    source: "hoa-don-gom.pdf",
  },
  {
    id: "inv-05",
    number: "0000124",
    name: "Không gian Lá",
    category: "Dịch vụ nội thất",
    date: "2026-10-15",
    amount: 45000000,
    vat: 4500000,
    status: "review",
    source: "hoa-don-la.pdf",
  },
  {
    id: "inv-06",
    number: "0000123",
    name: "Cà phê Tháng Mười",
    category: "Dịch vụ ăn uống",
    date: "2026-10-12",
    amount: 9800000,
    vat: 980000,
    status: "approved",
    source: "hoa-don-cafe.pdf",
  },
];
export const bankTransactions = [
  {
    id: "bank-01",
    invoiceId: "inv-01",
    text: "MOC thanh toan HD 128",
    amount: 35200000,
    date: "24/10/2026",
  },
  {
    id: "bank-02",
    invoiceId: "inv-02",
    text: "AN NHIEN HD 127",
    amount: 20350000,
    date: "22/10/2026",
  },
  {
    id: "bank-03",
    invoiceId: "inv-03",
    text: "STUDIO SANG HD 126",
    amount: 26400000,
    date: "20/10/2026",
  },
  {
    id: "bank-04",
    invoiceId: "inv-04",
    text: "GOM VIET thanh toan",
    amount: 13970000,
    date: "18/10/2026",
  },
  {
    id: "bank-05",
    invoiceId: "inv-06",
    text: "CA PHE THANG MUOI",
    amount: 10780000,
    date: "12/10/2026",
  },
  {
    id: "bank-06",
    invoiceId: "",
    text: "Giao dich chua co hoa don",
    amount: 8500000,
    date: "10/10/2026",
  },
  {
    id: "bank-demo",
    invoiceId: "inv-demo",
    text: "XUONG GIAY HD 129",
    amount: 22000000,
    date: "25/10/2026",
  },
];
export function initialState(): DemoState {
  return {
    version: 1,
    invoices: structuredClone(seedInvoices),
    matchedIds: ["inv-03", "inv-04", "inv-06"],
    declarations: [],
    messages: [],
  };
}
export const money = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
export const shortMoney = (amount: number) =>
  `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(amount / 1000000)} triệu`;
export const dateLabel = (value: string) =>
  new Date(`${value}T12:00:00+07:00`).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  });

function abortError() {
  return new DOMException("Đã hủy thao tác", "AbortError");
}
export function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }
    const onAbort = () => {
      clearTimeout(timer);
      reject(abortError());
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

// Browser-only API facade. No uploads, OCR, AI requests, database or tax service.
export const mockApi = {
  async extractInvoice(source: string, signal?: AbortSignal): Promise<Invoice> {
    await delay(1600, signal);
    return {
      id: "inv-demo",
      number: "0000129",
      name: "Xưởng Giấy Nhỏ",
      category: "Hàng hóa bán lẻ",
      date: "2026-10-25",
      amount: 20000000,
      vat: 2000000,
      status: "review",
      source,
    };
  },
  async reconcile(
    invoices: Invoice[],
    signal?: AbortSignal,
  ): Promise<string[]> {
    await delay(1400, signal);
    return invoices
      .filter(
        (i) =>
          i.status === "approved" &&
          bankTransactions.some(
            (b) => b.invoiceId === i.id && b.amount === i.amount + i.vat,
          ),
      )
      .map((i) => i.id);
  },
  async createDeclaration(
    input: Pick<Declaration, "form" | "period" | "revenue" | "rate">,
    signal?: AbortSignal,
  ): Promise<Declaration> {
    await delay(1100, signal);
    return {
      ...input,
      id: crypto.randomUUID(),
      tax: Math.round((input.revenue * input.rate) / 100),
      createdAt: new Date().toISOString(),
    };
  },
  async chat(
    question: string,
    invoices: Invoice[],
    signal?: AbortSignal,
  ): Promise<string> {
    await delay(1100, signal);
    const q = question.toLocaleLowerCase("vi-VN");
    if (/hóa đơn|hoá đơn|doanh thu/.test(q)) {
      const approved = invoices.filter((i) => i.status === "approved");
      return `Trong bộ dữ liệu minh họa có ${invoices.length} hóa đơn, ${approved.length} hóa đơn đã duyệt. Tổng doanh thu đã duyệt là ${money(approved.reduce((sum, i) => sum + i.amount, 0))}.\n\nBạn có thể mở Hóa đơn để kiểm tra chứng từ, sau đó sang Đối soát để ghép với giao dịch mẫu.`;
    }
    if (/đối soát|ngân hàng/.test(q))
      return "Luồng đối soát mẫu gồm 3 bước:\n\n1. Duyệt thông tin hóa đơn.\n2. So khớp tổng thanh toán với giao dịch ngân hàng mẫu.\n3. Kiểm tra các giao dịch chưa khớp.\n\nMở mục Đối soát và chọn ‘Chạy đối soát’ để trải nghiệm. Không có kết nối ngân hàng thực tế.";
    if (/tờ khai|thuế|gtgt|tncn/.test(q))
      return "Bạn có thể thử tạo bản nháp 01/GTGT, 01/CNKD hoặc 02/CNKD tại mục Tờ khai. Doanh thu được lấy từ các hóa đơn đã duyệt; thuế suất là tham số minh họa có thể chỉnh sửa.\n\nBản nháp có thể xem trước và in / lưu PDF bằng trình duyệt. Đây là kịch bản có sẵn, không phải tư vấn thuế hay biểu mẫu dùng để nộp hồ sơ.";
    return "Tôi đang chạy kịch bản trả lời minh họa. Bạn có thể hỏi về ‘doanh thu hóa đơn’, ‘đối soát ngân hàng’ hoặc ‘tạo tờ khai’ để khám phá các luồng trong workspace. Không có mô hình AI thực tế được kết nối.";
  },
};

export function isDemoState(value: unknown): value is DemoState {
  if (!value || typeof value !== "object") return false;
  const s = value as DemoState;
  return (
    s.version === 1 &&
    Array.isArray(s.invoices) &&
    s.invoices.length <= 100 &&
    s.invoices.every(
      (i) =>
        i &&
        typeof i.id === "string" &&
        typeof i.name === "string" &&
        typeof i.number === "string" &&
        typeof i.category === "string" &&
        typeof i.date === "string" &&
        typeof i.source === "string" &&
        Number.isFinite(i.amount) &&
        i.amount >= 0 &&
        Number.isFinite(i.vat) &&
        i.vat >= 0 &&
        ["review", "approved"].includes(i.status),
    ) &&
    Array.isArray(s.matchedIds) &&
    s.matchedIds.length <= s.invoices.length &&
    s.matchedIds.every(
      (id) =>
        typeof id === "string" &&
        s.invoices.some((i) => i.id === id && i.status === "approved"),
    ) &&
    Array.isArray(s.declarations) &&
    s.declarations.length <= 100 &&
    s.declarations.every(
      (d) =>
        d &&
        typeof d.id === "string" &&
        ["01/GTGT", "01/CNKD", "02/CNKD"].includes(d.form) &&
        typeof d.period === "string" &&
        Number.isFinite(d.revenue) &&
        d.revenue >= 0 &&
        Number.isFinite(d.tax) &&
        d.tax >= 0 &&
        Number.isFinite(d.rate) &&
        d.rate >= 0 &&
        d.rate <= 100 &&
        typeof d.createdAt === "string" &&
        Number.isFinite(Date.parse(d.createdAt)),
    ) &&
    Array.isArray(s.messages) &&
    s.messages.length <= 100 &&
    s.messages.every(
      (m) =>
        m &&
        typeof m.id === "string" &&
        typeof m.text === "string" &&
        ["user", "assistant"].includes(m.role) &&
        (!m.attachment ||
          (typeof m.attachment.name === "string" &&
            ["image", "document"].includes(m.attachment.kind))) &&
        (!m.artifact || validArtifact(m.artifact)),
    )
  );
}

function validArtifact(artifact: MessageArtifact): boolean {
  if (artifact.type === "declaration")
    return typeof artifact.declarationId === "string";
  if (artifact.type === "chart")
    return (
      Number.isFinite(artifact.total) &&
      artifact.total >= 0 &&
      Number.isFinite(artifact.count) &&
      Array.isArray(artifact.points) &&
      artifact.points.length <= 100 &&
      artifact.points.every(
        (p) =>
          typeof p.label === "string" &&
          Number.isFinite(p.revenue) &&
          p.revenue >= 0,
      )
    );
  if (artifact.type === "invoice") {
    const invoice = artifact.invoice;
    return (
      !!invoice &&
      typeof invoice.id === "string" &&
      typeof invoice.name === "string" &&
      typeof invoice.number === "string" &&
      typeof invoice.source === "string" &&
      typeof invoice.date === "string" &&
      typeof invoice.category === "string" &&
      Number.isFinite(invoice.amount) &&
      invoice.amount >= 0 &&
      Number.isFinite(invoice.vat) &&
      invoice.vat >= 0 &&
      ["review", "approved"].includes(invoice.status)
    );
  }
  return false;
}
export function invoiceChart(
  invoices: Invoice[],
): Extract<MessageArtifact, { type: "chart" }> {
  const approved = invoices.filter((i) => i.status === "approved");
  const days = new Map<string, number>();
  for (const invoice of approved)
    days.set(invoice.date, (days.get(invoice.date) ?? 0) + invoice.amount);
  return {
    type: "chart",
    count: approved.length,
    total: approved.reduce((sum, i) => sum + i.amount, 0),
    points: [...days.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, revenue]) => ({
        label: dateLabel(date).slice(0, 5),
        revenue,
      })),
  };
}
