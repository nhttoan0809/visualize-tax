# Triển khai GitHub và Vercel

## Production đã hoạt động

Triển khai ngày **28/10/2026** (Asia/Ho_Chi_Minh).

- URL production: **https://visualize-tax.vercel.app**
- Project: `nguyentoan080920s-projects/visualize-tax`
- Dashboard: https://vercel.com/nguyentoan080920s-projects/visualize-tax
- Deployment: `dpl_AQ6qgd1WzkWE8PpQ6eQtSf4N9xTV` · **Ready** · target `production`
- URL deployment cố định: https://visualize-lu4558o5c-nguyentoan080920s-projects.vercel.app
- Commit mã ứng dụng đã triển khai: `4b4268a` (`feat: split presentation scenarios and clarify bank sync loading`).

## Phương thức

MCP Vercel chưa được kết nối trong phiên triển khai. Đã xác minh Vercel CLI đăng nhập vào tài khoản `nguyentoan080920`, tạo project mới `visualize-tax` trong scope hiện hành và triển khai production qua CLI. **Không phải triển khai qua MCP.**

```sh
vercel link --yes --project visualize-tax --scope nguyentoan080920s-projects
vercel deploy --prod --yes --scope nguyentoan080920s-projects
vercel inspect https://visualize-tax.vercel.app --scope nguyentoan080920s-projects
```

Preset **Next.js**, root directory `.`, install `pnpm install --frozen-lockfile`, build `pnpm build`. Package manager được pin `pnpm@10.26.2`; Node theo `engines >=22.0.0` của project. Không cần biến môi trường, database, API key hay cấu hình từ repo gốc. Liên kết local `.vercel/` được Git ignore.

## Kiểm tra trên URL thật

- `/`, `/assistant`, `/invoices`, `/reconciliation`, `/declarations`: HTTP 200.
- Kịch bản Trợ lý thuế hoàn tất trên desktop: 7 hóa đơn, 2 bản nháp, không tự đồng bộ ngân hàng.
- Kịch bản Đồng bộ & đối soát hoàn tất trên mobile: 6 giao dịch, 4 cặp khớp, không tạo hội thoại hoặc tờ khai.
- Đặt lại chạy được sau cả hai kịch bản; không có lỗi JavaScript hoặc tràn ngang trong các lần kiểm tra này.

Các lần chạy trình diễn kiểm tra production dùng reduced motion. Bộ kiểm thử local trước triển khai đã đạt 36/36, gồm trình diễn với chuyển động bình thường.

## GitHub

Repository: **https://github.com/nhttoan0809/visualize-tax** · private · nhánh `main`.

Remote `origin`: `https://github.com/nhttoan0809/visualize-tax.git`. Repository được tạo qua GitHub API và đồng bộ bằng Git trên tài khoản đã xác thực; MCP GitHub chưa kết nối. Không thay đổi remote hoặc nội dung của `original-tax`.

Chưa bật tự động deploy qua Git. Production hiện dùng commit ứng dụng `4b4268a`; các commit tài liệu sau đó không thay đổi ứng dụng đang chạy. Deploy bản ứng dụng tiếp theo bằng `vercel deploy --prod` từ project đã liên kết, hoặc cấu hình Git integration riêng khi cần.

## Giới hạn có chủ đích

- Mỗi trình duyệt có trạng thái localStorage riêng, không có đồng bộ dữ liệu máy chủ.
- File người dùng chọn không được tải lên, OCR hoặc xử lý thật.
- “In / Lưu PDF” mở hộp thoại in của trình duyệt; người xem chọn lưu PDF.
