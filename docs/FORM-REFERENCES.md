# Cấu trúc biểu mẫu và dữ liệu minh họa

Ngày tham khảo: 27/10/2026. Mục tiêu là tái hiện trải nghiệm kiểm tra hồ sơ; không xây công cụ xác định nghĩa vụ thuế hoặc mẫu dùng để nộp.

## 01/GTGT

Nguồn: [Thông tư 80/2021/TT-BTC và các phụ lục trên Công báo Chính phủ](https://congbao.chinhphu.vn/van-ban/thong-tu-so-80-2021-tt-btc-34774/37499.htm).

Bản minh họa dùng cấu trúc nhóm mua vào, bán ra, thuế được khấu trừ và thuế phải nộp. Các mã 22–28, 34–38, 40a, 40 và 43 giúp người xem đọc số liệu theo nhóm. Đây là bản rút gọn, không sao chép đầy đủ mẫu và không khẳng định là phiên bản hiện hành tháng 10/2026.

Kịch bản doanh nghiệp Công ty TNHH Thiết kế & In ấn Trần Minh có 6 hóa đơn bán ra ban đầu, 4 hóa đơn đã duyệt (78.500.000 đồng). Sau khi lưu hóa đơn Xưởng Giấy Nhỏ, doanh thu là 98.500.000 đồng. Hai chứng từ mua vào giả lập riêng có giá trị 28.000.000 đồng, thuế đầu vào 2.800.000 đồng. Giả định tất cả đủ điều kiện khấu trừ, không có chuyển kỳ trước/điều chỉnh/hoàn thuế. Với tham số 10%, kết quả minh họa là 9.850.000 − 2.800.000 = 7.050.000 đồng. Thuế suất là tham số UI, không phải kết luận pháp lý về từng loại hàng.

## 02/CNKD

Tên `02/CNKD` trong yêu cầu chưa có hậu tố. Demo giữ tên ngắn trong điều hướng nhưng chọn **02/CNKD-TMĐT** làm cấu trúc tham khảo, không đồng nhất với **02/CNKD-TNCN-QTT** (quyết toán TNCN).

Nguồn: [Nghị định 117/2025/NĐ-CP trên Cổng thông tin Chính phủ](https://chinhphu.vn/?classid=0&docid=213883&pageid=27160), [PDF ký số và phụ lục](https://datafiles.chinhphu.vn/cpp/files/vbpq/2025/6/117-ndcp.signed.pdf). Tham khảo các nhóm hàng hóa/dịch vụ/vận tải/khác, tổng doanh thu, cột GTGT và TNCN. Các dòng 15.b/15.d trong demo biểu diễn hai cột thuế thành dòng để đọc trên thiết bị nhỏ, không khẳng định đó là mã dòng riêng trên mẫu gốc.

Đây là kịch bản hộ kinh doanh bán văn phòng phẩm trên nền tảng Chợ Giấy Online hư cấu, không có chức năng thanh toán; độc lập với kịch bản doanh nghiệp khấu trừ. Cùng tổng doanh thu được tái sử dụng để so sánh trải nghiệm, không phải tự chuyển đổi loại hình pháp lý. Tổng tỷ lệ 1,5% là tham số mô phỏng, phân bổ 2/3 GTGT và 1/3 TNCN. Với doanh thu 98.500.000 đồng: GTGT 985.000 đồng, TNCN 492.500 đồng, tổng 1.477.500 đồng. Không mô phỏng ngưỡng miễn thuế hoặc nghĩa vụ năm. Không khẳng định biểu mẫu 2025 còn áp dụng cho kỳ 10/2026.

## Chứng từ và tính nhất quán

- Bên mua/bán, địa chỉ, người liên hệ và mặt hàng đều hư cấu. Định danh thuế/tài khoản có tiền tố `DEMO`; email dùng `.example`.
- Chi tiết từng dòng hàng được lưu trong `src/lib/document-data.ts`, tổng số lượng × đơn giá khớp tiền hàng trong `demo-data.ts`.
- Ảnh trích xuất mẫu là hóa đơn bán ra của Trần Minh cho Xưởng Giấy Nhỏ: 500 sổ A5 × 28.000 đồng + 1.000 túi kraft × 6.000 đồng = 20.000.000 đồng; VAT mô phỏng 2.000.000 đồng.
- Tờ khai mới chụp danh sách hóa đơn đã duyệt tại thời điểm tạo. Dữ liệu hóa đơn về sau không làm thay đổi bản nháp đã lưu. Bản nháp cũ không có snapshot được gắn thông báo cần tạo lại.
- Hai hóa đơn mua vào là fixture riêng, không cộng vào doanh thu bán ra hoặc đối soát. Hệ thống không tải thêm dữ liệu từ các nguồn tham khảo khi người dùng thao tác.
