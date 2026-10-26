# Visualize Tax

Workspace quản lý thuế bằng tiếng Việt, được xây dựng độc lập từ các luồng nghiệp vụ của `original-tax` để thể hiện năng lực UI/UX và phát triển tính năng. Repo gốc chỉ được đọc tham khảo và không bị thay đổi.

**Đây là phiên bản tái hiện cho portfolio. Tất cả dữ liệu, phản hồi trợ lý, kết quả trích xuất và tờ khai đều là mô phỏng.**

![Tổng quan Visualize Tax với dữ liệu minh họa](docs/preview-desktop.png)

## Chạy dự án

Yêu cầu Node.js 22 trở lên và pnpm 10.26.2. Project không cần biến môi trường hay backend.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Mở [localhost:3000](http://localhost:3000). Build production:

```sh
pnpm build
pnpm start
```

## Trải nghiệm chính

| Màn hình                     | Tính năng                                                                                           |
| ---------------------------- | --------------------------------------------------------------------------------------------------- |
| `/` — Tổng quan              | Chỉ số từ trạng thái hiện tại, biểu đồ mẫu có đổi kỳ/xem bảng số liệu, hóa đơn gần đây, xuất CSV    |
| `/invoices` — Hóa đơn        | Tìm kiếm, lọc, sắp xếp, kéo thả/chọn file, trích xuất mẫu, xem chi tiết và duyệt                    |
| `/reconciliation` — Đối soát | Ghép hóa đơn đã duyệt với giao dịch mẫu theo tổng thanh toán; lọc đã khớp/chưa khớp                 |
| `/declarations` — Tờ khai    | Chọn 01/GTGT hoặc 01/CNKD, chọn kỳ mẫu và thuế suất minh họa, tạo bản nháp, xem trước và in/lưu PDF |
| `/assistant` — Trợ lý thuế   | Câu hỏi gợi ý, hội thoại theo kịch bản, tổng hợp dữ liệu hiện tại; không kết nối AI                 |

Banner cố định ở mọi trang gồm:

- **Đặt lại:** khôi phục seed, xóa hội thoại/bản nháp, hủy thao tác đang xử lý và đưa về tổng quan. Không xóa dữ liệu của ứng dụng khác.
- **Chạy trình diễn:** tự thao tác qua toàn bộ luồng trong khoảng 25–30 giây, bắt đầu từ seed. Vùng ứng dụng tạm khóa tương tác; nút dừng và phím Escape luôn hoạt động. Dữ liệu đã hoàn tất được giữ lại khi dừng.

Tìm nhanh bằng nút trên thanh đầu trang hoặc `⌘ K` / `Ctrl K`. Menu mobile hỗ trợ bàn phím và Escape. Các animation tôn trọng `prefers-reduced-motion`.

## Dữ liệu và giới hạn

- Seed hoàn toàn hư cấu ở `src/lib/demo-data.ts`; kỳ tháng 10/2026 là bối cảnh mô phỏng cố định.
- Mock API là facade bất đồng bộ chạy trong trình duyệt, có độ trễ và hỗ trợ hủy; không có API nghiệp vụ máy chủ.
- Trạng thái được lưu với schema version tại key `visualize-tax:demo:v1`. Dữ liệu hỏng hoặc storage bị chặn sẽ dùng seed/in-memory.
- File người dùng chọn **chỉ cung cấp tên chứng từ**. Nội dung không được đọc hoặc gửi đi. Mọi lần trích xuất đều trả hóa đơn mẫu “Xưởng Giấy Nhỏ”; nhập lại sẽ thay bản mẫu này.
- Tổng quan lấy chỉ số từ trạng thái thực của demo. Biểu đồ dòng tiền là bộ dữ liệu xu hướng riêng, được ghi nhãn mẫu.
- Thuế minh họa = doanh thu hóa đơn đã duyệt × tỷ lệ do người xem chọn. Không thực hiện khấu trừ, tra cứu pháp luật hoặc tính nghĩa vụ thuế thực tế. Các kỳ tờ khai dùng cùng bộ hóa đơn mẫu.
- Nút **In / Lưu PDF** mở hộp thoại in của trình duyệt; mẫu in luôn có thông báo không có giá trị pháp lý.
- Không có đăng ký/đăng nhập, OTP, database, thanh toán, tích hợp ngân hàng hay model AI thật.

## Công nghệ và cấu trúc

Next.js App Router · React · TypeScript strict · Tailwind CSS v4/PostCSS · GSAP với `useGSAP` · Lucide · font Be Vietnam Pro tự host · Playwright và axe-core.

```text
src/app/                    Routes, layout, metadata, global styles
src/components/             Các màn hình, shell, provider và UI dùng chung
src/lib/                    Seed, mock API, persistence validation, export, hủy tác vụ
.agents/skills/ui-ux-pro-max Skill Codex ở phạm vi project
AGENTS.md                   Mục tiêu cuối cùng và giới hạn triển khai
design-system/             Quyết định thiết kế
docs/DEPLOYMENT.md          Trạng thái và quy trình triển khai qua MCP
tests/                     Kiểm thử hành vi bằng trình duyệt
```

Skill [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) đã được cài tại `.agents/skills/ui-ux-pro-max`, pin theo revision ghi trong `PROVENANCE.md`, kèm license upstream. Codex nhận skill project từ lượt làm việc tiếp theo; không ghi đè bản global.

## Kiểm tra

Cài Chromium cho Playwright một lần:

```sh
pnpm exec playwright install --only-shell chromium
```

```sh
pnpm lint
pnpm typecheck
pnpm test:e2e
pnpm build
pnpm format:check
```

Bộ kiểm thử chạy trên desktop 1440 px và mobile 375 px, bao gồm luồng liên thông, persist sau reload, reset và hủy tác vụ, trình diễn hoàn tất/dừng/Escape, storage bị lỗi/bị chặn, kiểm tra file, responsive, sticky banner và kiểm tra accessibility tự động. Playwright dùng port 3002 và tự chạy dev server nếu chưa có. Báo cáo tạo ở `playwright-report/` (được gitignore).

## GitHub và Vercel

Cấu hình Vercel đã sẵn sàng trong `vercel.json`, không cần secret. **Chưa push hoặc deploy** vì phiên làm việc chưa cung cấp công cụ MCP GitHub/Vercel. Xem [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) để tiếp tục đúng yêu cầu triển khai qua MCP khi hai server đã kết nối.
