# Visualize Tax — mục tiêu và nguyên tắc dự án

## Mục đích cuối cùng

Xây dựng một phiên bản tái hiện **độc lập** của các luồng trong `original-tax` tại repo `visualize-tax` để thể hiện năng lực UI/UX và xây dựng tính năng trong portfolio. Sản phẩm phải có thể trải nghiệm từ đầu đến cuối bằng dữ liệu hư cấu, có giao diện tiếng Việt chỉn chu, responsive và chuyển động có chủ đích.

## Ranh giới bắt buộc

- Chỉ sửa file trong `visualize-tax`. `../original-tax` là nguồn tham khảo **chỉ đọc**; không chạy backend, migrations hoặc thao tác Git có ghi trong repo đó.
- Không sao chép secrets, cấu hình nội bộ, thông tin khách hàng, tài liệu thuế hoặc dữ liệu thật từ dự án gốc.
- Không xây backend nghiệp vụ, database, đăng ký/đăng nhập, OTP, thanh toán, tích hợp bên thứ ba hoặc model AI thật.
- Dữ liệu trong `src/lib/demo-data.ts` phải hư cấu. Các API là facade bất đồng bộ chạy trên trình duyệt, không gọi dịch vụ thực.
- Không trình bày kịch bản tư vấn, công thức thuế hoặc mẫu in như nội dung pháp lý chính thức. Mẫu in phải có nhãn minh họa.

## Stack và cấu trúc

- Next.js App Router, TypeScript strict, Tailwind CSS; dùng **pnpm** và chỉ duy trì `pnpm-lock.yaml`.
- `src/app/`: routes, metadata, layout, style toàn cục.
- `src/components/`: các màn hình tương tác, shell, provider và UI dùng chung.
- `src/lib/demo-data.ts`: seed, kiểu dữ liệu, mock API, validate dữ liệu lưu.
- `src/components/demo-provider.tsx`: trạng thái chung, localStorage, reset, trình diễn tự động.
- `.agents/skills/ui-ux-pro-max/`: skill cài ở phạm vi project từ `nextlevelbuilder/ui-ux-pro-max-skill`; đọc `SKILL.md` trước khi thiết kế mới hoặc sửa UI.
- `design-system/visualize-tax/MASTER.md`: quyết định thiết kế đã chọn; không thay toàn bộ phong cách theo kết quả tìm kiếm tự động.

## Luồng sản phẩm cần giữ hoạt động

1. Tổng quan phản ánh hóa đơn đã duyệt, giao dịch đã khớp và số bản nháp.
2. Hóa đơn: tìm kiếm, lọc, sắp xếp, thêm chứng từ mẫu, kiểm tra chi tiết và duyệt. Chọn file chỉ dùng tên file; không đọc, gửi đi hoặc OCR thật.
3. Đối soát: chỉ ghép hóa đơn đã duyệt với giao dịch mẫu có tổng thanh toán trùng khớp; giữ rõ trạng thái chưa khớp.
4. Tờ khai: chọn biểu mẫu, kỳ mẫu và thuế suất minh họa; tổng hợp từ doanh thu đã duyệt; xem trước, in/lưu PDF bằng trình duyệt.
5. Trợ lý: kịch bản trả lời định trước dựa trên từ khóa và trạng thái hiện tại; thông báo rõ không có AI thật.

## Trạng thái, cảnh báo và trình diễn

- Banner cảnh báo phiên bản tái hiện phải luôn sticky trên cùng ở mọi route; không được cho ẩn vĩnh viễn.
- Banner chứa **Đặt lại** và **Chạy trình diễn / Dừng trình diễn**.
- Đặt lại khôi phục toàn bộ seed, hội thoại, đối soát, bản nháp, hộp thoại, bộ lọc và thao tác đang chờ. Chỉ xóa key của ứng dụng, không gọi `localStorage.clear()`.
- LocalStorage phải có version, validation và fallback khi dữ liệu hỏng hoặc bị chặn. Không lưu nội dung file người dùng.
- Trình diễn phải thực hiện các thao tác trong trình duyệt, tạm khóa tương tác ứng dụng bằng `inert` và lớp chặn pointer; luôn giữ nút dừng và phím Escape hoạt động.
- Mọi timer/request mô phỏng phải được hủy khi reset, dừng trình diễn hoặc unmount. Dừng phải trả quyền tương tác ngay.
- Tôn trọng `prefers-reduced-motion`; giữ focus nhìn thấy, tên truy cập cho nút icon, keyboard navigation, nhãn form và trạng thái đang xử lý.

## Quy trình kiểm tra và bàn giao

- Chạy `pnpm lint`, `pnpm typecheck`, `pnpm test:e2e`, `pnpm build` sau thay đổi có ảnh hưởng tương ứng.
- Kiểm tra luồng hóa đơn → duyệt → đối soát → tờ khai → trợ lý, persist qua reload, reset, trình diễn hoàn tất và dừng giữa chừng.
- Kiểm tra responsive ở 375, 768 và 1440 px; không để tràn ngang toàn trang. Bảng dữ liệu có thể cuộn ngang trong container riêng.
- Ưu tiên push GitHub và deploy Vercel **qua MCP** đúng yêu cầu người dùng. Chỉ dùng repo mới và dữ liệu giả; không thay remote dự án gốc.
- Nếu công cụ MCP hoặc kết nối chưa có, hoàn tất phần local, ghi chính xác trạng thái trong `docs/DEPLOYMENT.md` và báo phần còn chờ; không khẳng định đã push/deploy khi chưa có kết quả xác nhận.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
