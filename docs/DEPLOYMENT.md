# GitHub và Vercel

## Trạng thái hiện tại

Project được chuẩn bị để chạy độc lập trên Vercel bằng preset Next.js, không cần biến môi trường, database hay backend bên ngoài.

Trong phiên thiết lập, cấu hình máy có khai báo MCP GitHub và Vercel nhưng danh sách công cụ được cung cấp cho phiên không có hai server này. Vì vậy **chưa tạo remote repository, chưa push GitHub và chưa deploy Vercel**. Không dùng CLI thay thế để tự nhận đã đáp ứng yêu cầu “thông qua MCP”.

## Khi MCP đã được kết nối

1. Xác nhận tài khoản/organization và workspace Vercel hiện hành qua công cụ MCP tương ứng.
2. Tạo repo `visualize-tax` độc lập (ưu tiên private nếu người dùng chưa chọn công khai); không đổi remote hoặc ghi vào `original-tax`.
3. Push nội dung repo mới và xác minh commit/branch trên GitHub qua MCP.
4. Tạo hoặc chọn project Vercel `visualize-tax`, liên kết repo/branch vừa xác minh, preset **Next.js** và root directory `.`.
5. Install command: `pnpm install --frozen-lockfile`. Build command: `pnpm build`. Node.js: `22.x`.
6. Deploy bằng MCP Vercel, kiểm tra kết quả build và mở URL deployment. Xác minh banner, reset và trình diễn tự động trên URL thật.
7. Cập nhật tài liệu này với URL GitHub, URL Vercel và commit đã triển khai sau khi các bước được xác nhận.

## Giới hạn có chủ đích

- Mỗi trình duyệt có trạng thái localStorage riêng; không có đồng bộ hoặc lưu trữ máy chủ.
- File người dùng chọn không được tải lên, OCR hoặc xử lý thật.
- Không cần API key. Không thêm biến môi trường từ repo gốc vào Vercel.
- “In / Lưu PDF” mở hộp thoại in của trình duyệt; người xem chọn lưu PDF.
