# Kết quả kiểm tra

Kiểm tra ngày 26/10/2026 (Asia/Ho_Chi_Minh).

| Kiểm tra                    | Kết quả                                                                                                                                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm lint`                 | Qua, không có lỗi/cảnh báo mã nguồn                                                                                                                                                                                      |
| `pnpm typecheck`            | Qua                                                                                                                                                                                                                      |
| `pnpm format:check`         | Qua                                                                                                                                                                                                                      |
| `pnpm test:e2e`             | **24/24 qua**, desktop 1440 px và mobile 375 px; kiểm thử chiều cao bổ sung ở 768 và 1024 px                                                                                                                             |
| `pnpm build`                | Qua; toàn bộ 5 màn hình ứng dụng prerender static                                                                                                                                                                        |
| Production qua `pnpm start` | Cả 5 route trả HTTP 200; không có lỗi JavaScript trên trình duyệt                                                                                                                                                        |
| Responsive                  | Không tràn ngang toàn trang ở 375, 768 và 1440 px; bảng cuộn trong container                                                                                                                                             |
| Accessibility tự động       | axe: không có violation trong các rule đã chạy (`wcag2a`, `wcag2aa`, `wcag21aa`) trên 5 trang, form tạo tờ khai, nội dung hội thoại có kết quả và mô tả tính năng; không thay thế đánh giá accessibility thủ công đầy đủ |
| CSV                         | Tải được danh sách mẫu, có nhãn dữ liệu minh họa                                                                                                                                                                         |
| In tờ khai                  | Đã xem layout ở print media; có watermark, thông báo minh họa và không có navigation/banner trong bản in                                                                                                                 |
| `original-tax`              | `git status --short` không có thay đổi                                                                                                                                                                                   |

Các kiểm thử mới xác nhận đủ bốn tình huống ngay trong Trợ lý thuế: đính kèm ảnh mẫu, trích xuất và lưu hóa đơn; hỏi dữ liệu kèm biểu đồ/bảng; tạo và xem trước 01/GTGT; tạo và xem trước 02/CNKD. Trình diễn chạy với chuyển động bình thường trên cả desktop/mobile và ghi nhận hơn 100 sự kiện nhập ký tự, 4 lần Ctrl + Enter, pointer move và click các điều khiển thật. Có kiểm tra mô tả tính năng, composer bám đáy và persist các kết quả có cấu trúc.

Các kiểm thử bao gồm luồng liên thông, localStorage qua reload, reset sau thay đổi, hủy trích xuất, trình diễn hoàn tất/dừng/Escape, storage không hợp lệ/bị chặn, validate file, không upload file, tìm nhanh và focus bàn phím, menu mobile, sticky banner và kiểm tra tràn ngang.

Ảnh màn hình: [Tổng quan](preview-desktop.png), [Trợ lý thuế](assistant-desktop.png), [Phản hồi kèm biểu đồ](assistant-results.png).

GitHub/Vercel chưa được kiểm tra deployment thật vì công cụ MCP tương ứng chưa được cung cấp cho phiên làm việc; xem [DEPLOYMENT.md](DEPLOYMENT.md).
