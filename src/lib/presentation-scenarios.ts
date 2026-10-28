export type TourScenario = "assistant" | "reconciliation";

export const presentationScenarios = [
  {
    id: "assistant" as const,
    number: "01",
    title: "Trợ lý thuế · Từ hóa đơn đến tờ khai",
    description:
      "Khám phá cách biến ảnh hóa đơn thành dữ liệu có thể kiểm tra, khai thác doanh thu và chuẩn bị hồ sơ thuế trong một cuộc trò chuyện.",
    steps: [
      "Nhập, kiểm tra & lưu hóa đơn",
      "Doanh thu & biểu đồ",
      "Tạo tờ khai 01/GTGT",
      "Tạo tờ khai 02/CNKD",
    ],
    total: 4,
  },
  {
    id: "reconciliation" as const,
    number: "02",
    title: "Ngân hàng · Đồng bộ & đối soát",
    description:
      "Xem giao dịch ngân hàng được đối chiếu với hóa đơn sẵn có. Kiểm tra MST, tổng thanh toán và lý do một khoản tiền khớp hoặc còn chênh lệch.",
    steps: ["Đồng bộ giao dịch", "Kiểm tra cặp khớp", "Giải thích lệch tiền"],
    total: 3,
  },
];
