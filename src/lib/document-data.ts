import { type Invoice } from "./demo-data";

// Fictional identities. DEMO-prefixed tax/bank identifiers cannot be mistaken for real accounts.
export const business = {
  name: "Công ty TNHH Thiết kế & In ấn Trần Minh",
  household: "Hộ kinh doanh Văn phòng phẩm Trần Minh",
  taxId: "DEMO-0318264097",
  address:
    "24 đường Vườn Giấy, phường Bình An, TP. Hồ Chí Minh (địa chỉ hư cấu)",
  email: "ketoan@tranminh.example",
  phone: "028 DEMO 2468",
  bank: "Ngân hàng mô phỏng · DEMO-1028-2468",
};
export interface InvoiceLine {
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
}
const details: Record<
  string,
  { address: string; contact: string; lines: InvoiceLine[] }
> = {
  "inv-01": {
    address: "18 đường Mộc Lan, TP. Hồ Chí Minh",
    contact: "Nguyễn Hoài An",
    lines: [
      {
        description: "Thiết kế bộ nhận diện thương hiệu Mộc · HĐ TM/MOC/1026",
        unit: "Gói",
        quantity: 1,
        unitPrice: 24000000,
      },
      {
        description: "In catalogue A4, 24 trang, giấy couche 150 gsm",
        unit: "Cuốn",
        quantity: 200,
        unitPrice: 40000,
      },
    ],
  },
  "inv-02": {
    address: "62 đường Nắng Mai, TP. Hồ Chí Minh",
    contact: "Lê Ngọc Nhi",
    lines: [
      {
        description: "Túi giấy kraft 250 gsm, in logo An Nhiên, 26 × 32 cm",
        unit: "Chiếc",
        quantity: 1000,
        unitPrice: 12500,
      },
      {
        description: "Tem nhãn sản phẩm 5 × 8 cm, cán mờ",
        unit: "Tem",
        quantity: 3000,
        unitPrice: 2000,
      },
    ],
  },
  "inv-03": {
    address: "09 đường Ánh Dương, TP. Hồ Chí Minh",
    contact: "Phạm Quang Huy",
    lines: [
      {
        description: "Thiết kế catalogue bộ sưu tập Sáng / Thu 2026",
        unit: "Gói",
        quantity: 1,
        unitPrice: 18000000,
      },
      {
        description: "Dàn trang, hiệu chỉnh màu và xuất file in ấn",
        unit: "Trang",
        quantity: 30,
        unitPrice: 200000,
      },
    ],
  },
  "inv-04": {
    address: "45 đường Gốm Xanh, TP. Hồ Chí Minh",
    contact: "Trần Bảo Vy",
    lines: [
      {
        description: "Hộp quà carton cứng đựng bộ gốm, 28 × 28 × 12 cm",
        unit: "Hộp",
        quantity: 100,
        unitPrice: 97000,
      },
      {
        description: "Thiệp hướng dẫn bảo quản, giấy mỹ thuật 250 gsm",
        unit: "Tờ",
        quantity: 1000,
        unitPrice: 3000,
      },
    ],
  },
  "inv-05": {
    address: "77 đường Lá Non, TP. Hồ Chí Minh",
    contact: "Đặng Minh Thư",
    lines: [
      {
        description: "Thiết kế bộ ấn phẩm khai trương Không gian Lá",
        unit: "Gói",
        quantity: 1,
        unitPrice: 30000000,
      },
      {
        description: "Thi công bảng chỉ dẫn nội thất, mica in UV",
        unit: "Bộ",
        quantity: 5,
        unitPrice: 3000000,
      },
    ],
  },
  "inv-06": {
    address: "10 đường Mùa Thu, TP. Hồ Chí Minh",
    contact: "Vũ Nhật Nam",
    lines: [
      {
        description: "In menu A4 bìa cứng, 8 trang, cán chống thấm",
        unit: "Cuốn",
        quantity: 40,
        unitPrice: 120000,
      },
      {
        description: "Ly giấy 350 ml in logo Tháng Mười",
        unit: "Chiếc",
        quantity: 2500,
        unitPrice: 2000,
      },
    ],
  },
  "inv-demo": {
    address: "36 đường Giấy Trắng, TP. Hồ Chí Minh",
    contact: "Đỗ Thu Hà",
    lines: [
      {
        description: "Sổ tay A5 bìa kraft, 100 trang, in logo Xưởng Giấy Nhỏ",
        unit: "Cuốn",
        quantity: 500,
        unitPrice: 28000,
      },
      {
        description: "Túi giấy kraft có quai, 24 × 32 cm, in 1 màu",
        unit: "Chiếc",
        quantity: 1000,
        unitPrice: 6000,
      },
    ],
  },
};
export function invoiceDetails(invoice: Invoice) {
  const item = details[invoice.id] ?? {
    address: "12 đường Sáng Tạo, TP. Hồ Chí Minh",
    contact: "Bộ phận kế toán",
    lines: [
      {
        description: invoice.category,
        unit: "Gói",
        quantity: 1,
        unitPrice: invoice.amount,
      },
    ],
  };
  return {
    ...item,
    taxId: `DEMO-0317000${invoice.number.slice(-3)}`,
    symbol: "1C26TMM",
    reference: `TM-${invoice.date.replaceAll("-", "")}-${invoice.number}`,
    payment:
      invoice.status === "approved"
        ? "Đã nhận chuyển khoản · giao dịch mẫu"
        : "Chờ kiểm tra chứng từ thanh toán",
  };
}
export const purchaseLedger = [
  {
    number: "0000842",
    date: "2026-10-05",
    supplier: "Công ty Giấy Mỹ Thuật An Hòa",
    description: "Giấy kraft và giấy couche cho đơn hàng tháng 10",
    amount: 18000000,
    vat: 1800000,
  },
  {
    number: "0000316",
    date: "2026-10-11",
    supplier: "Xưởng Gia công Bao bì Bình Minh",
    description: "Gia công bế, cán màng và đóng gáy sổ",
    amount: 10000000,
    vat: 1000000,
  },
];
export const formReferences = {
  vat: "https://congbao.chinhphu.vn/van-ban/thong-tu-so-80-2021-tt-btc-34774/37499.htm",
  household: "https://chinhphu.vn/?classid=0&docid=213883&pageid=27160",
};

export function bankDetails(transaction: {
  id: string;
  invoiceId: string;
  date: string;
  text: string;
  amount: number;
}) {
  const position = Number(transaction.id.replace("bank-", "")) || 7;
  return {
    reference: `DEMO-FT26${transaction.date.slice(0, 2)}${String(position).padStart(6, "0")}`,
    bookedAt: `${transaction.date} · 09:${String(12 + position * 3).padStart(2, "0")}:24`,
    valueDate: transaction.date,
    account: "DEMO-1028-2468",
    accountName: business.name,
    sender:
      transaction.invoiceId === "inv-demo"
        ? "XUONG GIAY NHO"
        : ({
            "inv-01": "CONG TY THIET KE MOC",
            "inv-02": "CUA HANG AN NHIEN",
            "inv-03": "STUDIO SANG",
            "inv-04": "CONG TY GOM VIET",
            "inv-06": "CA PHE THANG MUOI",
          }[transaction.invoiceId] ?? "KHACH HANG CHUA XAC DINH"),
    senderAccount: `DEMO-7900-${String(position).padStart(4, "0")}`,
    direction: "credit" as const,
    currency: "VND",
    channel: "Chuyển khoản liên ngân hàng · mô phỏng",
  };
}
