# Kết quả kiểm tra

Kiểm tra ngày 28/10/2026 (Asia/Ho_Chi_Minh).

| Kiểm tra                    | Kết quả                                                                                                                                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm lint`                 | Qua, không có lỗi/cảnh báo mã nguồn                                                                                                                                                                                      |
| `pnpm typecheck`            | Qua                                                                                                                                                                                                                      |
| `pnpm format:check`         | Qua                                                                                                                                                                                                                      |
| `pnpm test:e2e`             | **36/36 qua**, desktop 1440 px và mobile 375 px; kiểm thử chiều cao bổ sung ở 768 và 1024 px                                                                                                                             |
| `pnpm build`                | Qua; toàn bộ 5 màn hình ứng dụng prerender static                                                                                                                                                                        |
| Production qua `pnpm start` | Cả 5 route trả HTTP 200; không có lỗi JavaScript trên trình duyệt                                                                                                                                                        |
| Responsive                  | Không tràn ngang toàn trang ở 375, 768 và 1440 px; bảng cuộn trong container                                                                                                                                             |
| Accessibility tự động       | axe: không có violation trong các rule đã chạy (`wcag2a`, `wcag2aa`, `wcag21aa`) trên 5 trang, form tạo tờ khai, nội dung hội thoại có kết quả và mô tả tính năng; không thay thế đánh giá accessibility thủ công đầy đủ |
| CSV                         | Tải được danh sách mẫu, có nhãn dữ liệu minh họa                                                                                                                                                                         |
| In tờ khai                  | Đã xem layout ở print media; có watermark, thông báo minh họa và không có navigation/banner trong bản in                                                                                                                 |
| `original-tax`              | `git status --short` không có thay đổi                                                                                                                                                                                   |

Các kiểm thử mới xác nhận đủ bốn tình huống ngay trong Trợ lý thuế: đính kèm ảnh mẫu, trích xuất và lưu hóa đơn; hỏi dữ liệu kèm biểu đồ/bảng; tạo và xem trước 01/GTGT; tạo và xem trước 02/CNKD. Trình diễn chạy với chuyển động bình thường trên cả desktop/mobile và ghi nhận hơn 100 sự kiện nhập ký tự, 4 lần Ctrl + Enter, pointer move và click các điều khiển thật. Có kiểm tra mô tả tính năng, composer bám đáy và persist các kết quả có cấu trúc.

Các kiểm thử bao gồm luồng liên thông, localStorage qua reload, reset sau thay đổi, hủy trích xuất, trình diễn hoàn tất/dừng/Escape, storage không hợp lệ/bị chặn, validate file, không upload file, tìm nhanh và focus bàn phím, menu mobile, sticky banner và kiểm tra tràn ngang.

Ảnh màn hình: [Chọn kịch bản](presentation-picker.png), [Loading đồng bộ](sync-loading.png), [Đối soát ban đầu](reconciliation-empty.png), [Bảng kết quả đối soát](reconciliation-desktop.png), [Popup chi tiết](reconciliation-detail.png), [Tổng quan](preview-desktop.png), [Trợ lý thuế](assistant-desktop.png), [Phản hồi kèm biểu đồ](assistant-results.png).

Production Vercel đã triển khai qua CLI ngày 28/10/2026: https://visualize-tax.vercel.app. Đã kiểm tra cả 5 route HTTP 200, hai kịch bản độc lập và reset trên URL thật (desktop/mobile, reduced motion), không có lỗi JavaScript. GitHub chưa push; chi tiết tại [DEPLOYMENT.md](DEPLOYMENT.md).

## Chi tiết chứng từ và đối soát trực quan — 27/10/2026

- Hóa đơn có danh tính hai bên, số/ký hiệu, từng dòng hàng, thuế, thanh toán và lịch sử. Mở được từ thẻ trích xuất trong hội thoại, kho hóa đơn và tờ khai nguồn.
- 01/GTGT có nhóm chỉ tiêu đầu vào/đầu ra/khấu trừ và nguồn số liệu; 02/CNKD dùng cấu trúc tham khảo 02/CNKD-TMĐT, tách GTGT/TNCN. Xem [nguồn và giả định](FORM-REFERENCES.md).
- Trình diễn mở chi tiết hóa đơn trước khi lưu, mở cả hai bản nháp và mở một hóa đơn nguồn trong 01/GTGT. Kiểm thử ghi nhận chính các click này.
- Đối soát có chọn giao dịch, giấy báo Có mô phỏng, bản ghi chuẩn hóa, chứng từ dựng lại, tab dữ liệu trích xuất, tổng tiền/chênh lệch và lý do ghép. Kiểm tra trường hợp đã khớp và lệch tiền; bản thiết kế mới chuyển phần này vào popup sau khi đồng bộ.
- Bảng trong tài liệu cuộn ngang trong vùng có nhãn và truy cập bàn phím; axe kiểm tra cả dialog chứng từ, tờ khai và màn đối soát trên desktop/mobile.

## Thiết kế lại luồng đồng bộ và đối soát

- Khởi tạo và reset: không có giao dịch hay kết quả đối soát. Hủy đồng bộ đang chờ không ghi kết quả trễ.
- Đồng bộ thay thế snapshot, lưu thời gian đồng bộ và giữ kết quả qua reload; lần hai không nhân đôi dòng. Workspace cũ giữ hóa đơn nhưng không tự tạo kết quả ngân hàng.
- Bảng kết quả ở đầu trang; click dòng mở dialog rộng có MST hai bên, tiền ghi Có, tổng hóa đơn, chênh lệch, bản ghi ngân hàng và chứng từ hóa đơn. Chênh lệch tính theo ngân hàng trừ tổng hóa đơn.
- Sáu giao dịch seed sau đồng bộ: bốn khớp, hai lệch (-350.000 và -4.500.000 đồng). Kịch bản đối soát độc lập cũng dùng sáu giao dịch này, không chạy nhập hóa đơn ở chatbot.
- Trình diễn được chọn qua dialog: Trợ lý thuế có bốn bước; Đồng bộ & đối soát có ba bước, mở cặp Studio Sáng khớp và cặp An Nhiên lệch tiền. Kiểm thử ghi nhận click sync, popup và mở nguồn, đồng thời xác nhận kịch bản đối soát không tạo hội thoại hoặc tờ khai.

## Chọn kịch bản & loading — 28/10/2026

- Dialog có hai lựa chọn, mục đích và đường đi; Escape đóng và trả focus về nút banner. Mở/đóng dialog giữ nguyên storage.
- Hai kịch bản chạy đến cuối với chuyển động/gõ phím bình thường trên desktop/mobile; xác nhận tách biệt trạng thái, số bước và các handler được gọi.
- Loading đồng bộ có spinner, thanh indeterminate, nhãn busy; chống click lặp, khóa tương tác bảng/bộ lọc. Dừng trình diễn trong lúc loading hủy request và không ghi snapshot trễ.
