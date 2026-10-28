# Visualize Tax · Từ hóa đơn đến tờ khai 🧾

> **Một workspace tiếng Việt kết nối chứng từ, doanh thu và đối soát trong cùng trải nghiệm — khám phá dữ liệu qua hội thoại, kiểm tra khoản chênh lệch bằng hai nguồn và theo dõi toàn bộ quy trình qua trình diễn tương tác.**

**Dự án của Toàn Nguyễn** · Thiết kế trải nghiệm sản phẩm · Phát triển giao diện tương tác

[![Live Demo](https://img.shields.io/badge/Demo-visualize--tax.vercel.app-0D9488?style=for-the-badge&logo=vercel)](https://visualize-tax.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.4.3-111827?style=for-the-badge&logo=nextdotjs)](TECHNICAL.md#stack)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react)](TECHNICAL.md#stack)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss)](TECHNICAL.md#stack)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=for-the-badge&logo=greensock)](TECHNICAL.md#stack)

[Khám phá demo](https://visualize-tax.vercel.app) · [Tính năng nổi bật](#features) · [Tài liệu kỹ thuật & cài đặt](TECHNICAL.md)

![Visualize Tax — không gian quản lý chứng từ và doanh thu bằng tiếng Việt](docs/preview-desktop.png)

_Ảnh giao diện có sẵn trong repo; số liệu minh họa phản ánh trạng thái tại thời điểm chụp. [Nguồn ảnh](docs/SOURCES.md)._

**Phiên bản tái hiện độc lập dành cho portfolio.** Dữ liệu, trích xuất hóa đơn, phản hồi trợ lý, giao dịch ngân hàng và tờ khai đều là mô phỏng; không có AI hoặc kết nối ngân hàng thực tế. Mẫu in không có giá trị pháp lý.

---

## 🌟 Trải Nghiệm Trực Tuyến (Live Website)

**[Mở Visualize Tax ↗](https://visualize-tax.vercel.app)** · Không cần đăng nhập.

Chọn **Chạy trình diễn** trên banner để xem một trong hai kịch bản độc lập:

1. **Trợ lý thuế:** ảnh hóa đơn → kiểm tra và lưu → doanh thu kèm biểu đồ → xem trước hai bản nháp tờ khai.
2. **Đồng bộ & đối soát:** tải giao dịch mẫu → xem cặp khớp → kiểm tra cặp lệch tiền và hai chứng từ nguồn.

Dùng **Dừng / Esc** để trở lại thao tác thủ công; **Đặt lại** để bắt đầu lại với dữ liệu mẫu.

![Hai kịch bản trình diễn độc lập với mục tiêu và từng bước rõ ràng](docs/presentation-picker.png)

---

<a id="overview"></a>

## 📌 Executive Summary (Tổng quan dự án)

| Thông số               | Chi tiết                                                                                                           |
| :--------------------- | :----------------------------------------------------------------------------------------------------------------- |
| **Project Name**       | **Visualize Tax**                                                                                                  |
| **Project Type**       | Sản phẩm mẫu tương tác dành cho portfolio, tái hiện độc lập luồng quản lý thuế                                     |
| **Đối tượng sử dụng**  | Người xem portfolio, nhà tuyển dụng và lập trình viên muốn khám phá trải nghiệm quản lý chứng từ cho hộ kinh doanh |
| **Phạm vi phát triển** | Năm màn hình liên thông: Tổng quan, Hóa đơn, Đối soát, Tờ khai và Trợ lý thuế                                      |
| **Trạng thái**         | Có demo trực tuyến và hai kịch bản trình diễn; toàn bộ nghiệp vụ dùng dữ liệu hư cấu                               |

---

<a id="problem-solution"></a>

## 🎯 Problem & Solution (Bài toán & Giải pháp)

- **Problem:** Chứng từ, doanh thu và giao dịch ngân hàng nằm ở nhiều ngữ cảnh. Người dùng cần biết số liệu đến từ đâu, hóa đơn nào cần kiểm tra và vì sao một khoản thanh toán chưa khớp.
- **Solution:** Kết nối các bước trong một workspace: duyệt hóa đơn, xem doanh thu, đối chiếu hai nguồn và chuẩn bị bản nháp tờ khai. Hội thoại có biểu đồ và chứng từ giúp khám phá dữ liệu; trình diễn tự động giúp người xem nắm được quy trình mà không cần hướng dẫn riêng.

---

<a id="features"></a>

## ✨ Key Features (Tính năng nổi bật)

| Tính năng                        | Giá trị mang lại                                                                                                         |
| :------------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| **🧾 Hóa đơn có thể kiểm tra**   | Tìm kiếm, lọc, xem từng dòng hàng và duyệt chứng từ trước khi đưa vào tổng hợp                                           |
| **💬 Hội thoại gắn với dữ liệu** | Trải nghiệm đính kèm hóa đơn mẫu, kiểm tra/lưu, xem doanh thu bằng biểu đồ và mở bản nháp ngay trong hội thoại           |
| **🔎 Đối soát hai nguồn**        | Đặt bản ghi ngân hàng cạnh hóa đơn, chỉ rõ mã số thuế, tổng tiền và khoản chênh lệch cần xem xét                         |
| **📄 Tờ khai có nguồn số liệu**  | Xem trước bản nháp minh họa, mở hóa đơn nguồn và in/lưu PDF từ trình duyệt                                               |
| **▶️ Trình diễn tương tác**      | Hai kịch bản tự thao tác qua từng bước, có tiến độ, con trỏ minh họa và khả năng dừng bất kỳ lúc nào                     |
| **📱 Trải nghiệm liền mạch**     | Giao diện tiếng Việt trên desktop/mobile, tìm nhanh, thao tác bàn phím và khôi phục phiên làm việc trên cùng trình duyệt |

### 💬 Từ chứng từ đến biểu đồ trong cùng hội thoại

Trợ lý mô phỏng đưa kết quả vào các thẻ có thể thao tác: kiểm tra hóa đơn, lưu vào workspace và xem doanh thu từ hóa đơn đã duyệt. Người xem có thể đi tiếp sang tờ khai mà vẫn giữ ngữ cảnh.

![Trợ lý thuế hiển thị doanh thu và biểu đồ từ hóa đơn đã duyệt](docs/assistant-results.png)

### 🔎 Khoản chênh lệch có thể giải thích

Sau khi đồng bộ dữ liệu mẫu, mở từng dòng để đối chiếu bản ghi ngân hàng và hóa đơn. Ví dụ bên dưới cho thấy khoản thiếu **350.000 đồng**; đây là tình huống hư cấu để thể hiện trải nghiệm kiểm tra sai lệch.

![Đối chiếu song song bản ghi ngân hàng và hóa đơn, hiển thị khoản lệch 350.000 đồng](docs/reconciliation-detail.png)

<details>
<summary>📷 Xem thêm bảng kết quả và trạng thái đồng bộ</summary>

![Bảng kết quả đối soát sau khi đồng bộ dữ liệu mẫu](docs/reconciliation-desktop.png)

![Trạng thái đang đồng bộ với chỉ báo xử lý rõ ràng](docs/sync-loading.png)

</details>

---

<a id="contributions"></a>

## 👨‍💻 Competencies & Contributions (Năng lực & Đóng góp)

Các năng lực thể hiện qua sản phẩm:

- **Tư duy sản phẩm:** kết nối hóa đơn, đối soát và tờ khai thành luồng có thể trải nghiệm xuyên suốt, thay vì các màn hình rời rạc.
- **Thiết kế thông tin:** đưa chứng từ nguồn, chỉ số và lý do sai lệch vào đúng ngữ cảnh để người dùng tự kiểm tra kết quả.
- **Thiết kế tương tác:** xây dựng hội thoại có thẻ kết quả, trạng thái chờ, trình diễn có thể dừng và thao tác bàn phím.
- **Chú trọng chất lượng:** xử lý phiên làm việc, đặt lại dữ liệu, kích thước màn hình và khả năng tiếp cận; bằng chứng kiểm tra nằm trong [tài liệu kỹ thuật](TECHNICAL.md#highlights).

---

<a id="roadmap"></a>

## 📈 Future Roadmap (Hướng phát triển)

Các hướng đề xuất cho phiên bản portfolio tiếp theo:

- [ ] Bổ sung kịch bản thanh toán từng phần và nhiều giao dịch cho một hóa đơn.
- [ ] Mở rộng hướng dẫn theo ngữ cảnh cho người dùng lần đầu.
- [ ] Thêm bộ dữ liệu hư cấu đa dạng để so sánh nhiều tình huống xử lý chứng từ.

---

<a id="author"></a>

## 👤 Author & Contact

- **Tác giả:** Toàn Nguyễn
- **GitHub:** [@nhttoan0809](https://github.com/nhttoan0809)
- **Ccùng tác giả:** [@toanb1805926](https://github.com/toanb1805926), [@toannguyen-ailogy](https://github.com/toannguyen-ailogy)

---

<a id="license"></a>

## 📄 License

Xem [thông tin giấy phép và tài nguyên bên thứ ba](TECHNICAL.md#license).
