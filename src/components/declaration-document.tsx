import { CircleAlert, ArrowUpRight, FileText } from "lucide-react";
import { money, type Declaration } from "@/lib/demo-data";
import { business, formReferences, purchaseLedger } from "@/lib/document-data";
import { InvoiceDocument } from "./invoice-document";

export function DeclarationDocument({
  declaration: d,
}: {
  declaration: Declaration;
}) {
  const vat = d.form === "01/GTGT";
  const ecommerce = d.form === "02/CNKD";
  const output = Math.round((d.revenue * d.rate) / 100);
  const input = d.inputVat ?? 0;
  const carried = d.carriedCredit ?? 0;
  // Split the explicitly configurable aggregate demo rate at a 2:1 ratio, not a tax rule engine.
  const vatPart = Math.round((output * 2) / 3);
  const personalPart = output - vatPart;
  const rows: [string, string, number | string][] = vat
    ? [
        ["22", "Thuế còn được khấu trừ kỳ trước", carried],
        ["23", "Giá trị hàng hóa, dịch vụ mua vào", d.inputAmount ?? 0],
        ["24", "Thuế GTGT hàng hóa, dịch vụ mua vào", input],
        ["25", "Thuế mua vào giả định đủ điều kiện khấu trừ", input],
        ["26", "Doanh thu không chịu thuế", 0],
        ["27", "Doanh thu bán ra chịu thuế", d.revenue],
        ["28", `Thuế GTGT bán ra · tỷ lệ mô phỏng ${d.rate}%`, output],
        ["34", "Tổng doanh thu hàng hóa, dịch vụ bán ra", d.revenue],
        ["35", "Tổng thuế GTGT hàng hóa, dịch vụ bán ra", output],
        [
          "36",
          "Chênh lệch thuế bán ra và khấu trừ [35] − [25]",
          output - input,
        ],
        ["37 / 38", "Điều chỉnh giảm / tăng kỳ trước", "Không phát sinh"],
        ["40a", "Thuế phải nộp từ hoạt động sản xuất kinh doanh", d.tax],
        ["40", "Thuế GTGT còn phải nộp minh họa", d.tax],
        [
          "43",
          "Thuế còn được khấu trừ chuyển kỳ sau",
          Math.max(0, input + carried - output),
        ],
      ]
    : [
        ["11", "Cung cấp hàng hóa · doanh thu GTGT / TNCN", d.revenue],
        ["12", "Cung cấp dịch vụ", 0],
        ["13", "Vận tải, dịch vụ gắn với hàng hóa", 0],
        ["14", "Hoạt động kinh doanh khác", 0],
        ["15", "Tổng doanh thu làm cơ sở mô phỏng", d.revenue],
        [
          "15.b",
          `GTGT minh họa · ${((d.rate * 2) / 3).toLocaleString("vi-VN", { maximumFractionDigits: 2 })}%`,
          vatPart,
        ],
        [
          "15.d",
          `TNCN minh họa · ${(d.rate / 3).toLocaleString("vi-VN", { maximumFractionDigits: 2 })}%`,
          personalPart,
        ],
        ["16", "Thuế tiêu thụ đặc biệt", 0],
      ];
  return (
    <div className="declaration-document print-document detailed-declaration">
      <div className="document-watermark">BẢN MINH HỌA</div>
      <div className="declaration-document-top">
        <span className="document-brand">visualize tax.</span>
        <span>
          Mẫu {d.form}
          {ecommerce ? " · Tham khảo 02/CNKD-TMĐT" : ""}
        </span>
      </div>
      <div className="document-national">
        <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong>
        <span>Độc lập · Tự do · Hạnh phúc</span>
      </div>
      <h3>
        {vat
          ? "TỜ KHAI THUẾ GIÁ TRỊ GIA TĂNG"
          : "TỜ KHAI THUẾ HỘ, CÁ NHÂN KINH DOANH"}
      </h3>
      <p className="document-period">
        {vat
          ? "Kịch bản phương pháp khấu trừ"
          : ecommerce
            ? "Kịch bản bán hàng trên nền tảng thương mại điện tử"
            : "Kịch bản hộ kinh doanh"}{" "}
        · Bản nháp
      </p>
      <div className="document-rule" />
      <dl className="declaration-business">
        <div>
          <dt>Kỳ tính thuế</dt>
          <dd>{d.period} · Lần đầu · Chưa nộp</dd>
        </div>
        <div>
          <dt>Người nộp thuế mẫu</dt>
          <dd>{vat ? business.name : business.household}</dd>
        </div>
        <div>
          <dt>Mã số thuế mẫu</dt>
          <dd>{business.taxId}</dd>
        </div>
        <div>
          <dt>Địa chỉ trụ sở</dt>
          <dd>{business.address}</dd>
        </div>
        <div>
          <dt>Thông tin liên hệ</dt>
          <dd>
            {business.phone} · {business.email}
          </dd>
        </div>
        <div>
          <dt>Đại lý / tổ chức khai thay</dt>
          <dd>Không có · Tự lập bản nháp</dd>
        </div>
        <div>
          <dt>Hoạt động</dt>
          <dd>
            {vat
              ? "Thiết kế, in ấn và cung cấp ấn phẩm"
              : "Bán lẻ văn phòng phẩm · phân phối hàng hóa"}
          </dd>
        </div>
        {ecommerce && (
          <div>
            <dt>Nền tảng kinh doanh</dt>
            <dd>Chợ Giấy Online (hư cấu) · Không có chức năng thanh toán</dd>
          </div>
        )}
      </dl>
      <section className="document-assumptions">
        <h4>Phạm vi số liệu & giả định</h4>
        <p>
          {vat
            ? "Tổng hợp hóa đơn bán ra đã duyệt cùng 2 chứng từ mua vào mẫu. Giả định toàn bộ thuế mua vào được khấu trừ, không có chuyển kỳ trước, điều chỉnh hay hoàn thuế. Tỷ lệ đầu ra là tham số của demo; không suy ra từ loại hàng hay quy định hiện hành."
            : "Kịch bản độc lập: dùng cùng tổng doanh thu để minh họa hộ kinh doanh bán văn phòng phẩm. Giả định doanh thu đã được phân loại toàn bộ vào cung cấp hàng hóa; không áp dụng ngưỡng miễn thuế, giảm trừ hay khấu trừ/nộp thay. Tổng tỷ lệ được phân bổ 2/3 GTGT và 1/3 TNCN chỉ để trình diễn."}
        </p>
      </section>
      <div className="document-section-heading">
        <h4>
          {vat ? "A. Tổng hợp thuế GTGT" : "A. Doanh thu và các khoản thuế"}
        </h4>
        <span>Đơn vị: đồng Việt Nam</span>
      </div>
      <div
        className="table-scroll"
        role="region"
        aria-label="Bảng số liệu tờ khai"
        tabIndex={0}
      >
        <table
          className="declaration-values document-indicators"
          data-tour="declaration-indicators"
        >
          <thead>
            <tr>
              <th>Mã</th>
              <th>Chỉ tiêu tham khảo</th>
              <th>Giá trị</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([code, label, value]) => (
              <tr key={code}>
                <td>[{code}]</td>
                <td>{label}</td>
                <td>{typeof value === "number" ? money(value) : value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="document-calculation" data-tour="declaration-calculation">
        <span>
          {vat
            ? "Thuế GTGT còn phải nộp minh họa"
            : "Tổng GTGT + TNCN minh họa"}
        </span>
        <strong>{money(d.tax)}</strong>
        <p>
          {vat
            ? `${money(output)} − ${money(input)} − ${money(carried)} = ${money(d.tax)} (tối thiểu 0)`
            : `${money(vatPart)} + ${money(personalPart)} = ${money(d.tax)}`}
        </p>
      </div>
      <section className="document-sources">
        <h4>
          <FileText size={16} /> Chứng từ làm cơ sở tổng hợp
        </h4>
        <p>
          Số liệu được chụp lại lúc tạo bản nháp. Mở từng hóa đơn để xem chi
          tiết.
        </p>
        {d.sources?.length ? (
          d.sources.map((i) => (
            <details className="source-invoice" key={i.id}>
              <summary data-tour="declaration-source">
                <span>
                  #{i.number} · {i.name}
                </span>
                <strong>{money(i.amount)}</strong>
              </summary>
              <InvoiceDocument invoice={i} />
            </details>
          ))
        ) : (
          <p>
            Bản nháp cũ chưa có danh sách nguồn. Tạo bản nháp mới để lưu chi
            tiết chứng từ.
          </p>
        )}
        {vat && (
          <>
            <h4>Chứng từ mua vào giả lập riêng</h4>
            <div
              className="table-scroll"
              role="region"
              aria-label="Bảng số liệu tờ khai"
              tabIndex={0}
            >
              <table className="document-lines">
                <thead>
                  <tr>
                    <th>Chứng từ / Nhà cung cấp</th>
                    <th>Tiền hàng</th>
                    <th>Thuế GTGT</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseLedger.map((i) => (
                    <tr key={i.number}>
                      <td>
                        #{i.number} · {i.supplier}
                        <small>{i.description}</small>
                      </td>
                      <td>{money(i.amount)}</td>
                      <td>{money(i.vat)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Hai chứng từ đầu vào này là bộ dữ liệu phụ của kịch bản khấu trừ,
              không cộng vào doanh thu bán ra.
            </p>
          </>
        )}
      </section>
      <div className="document-disclaimer">
        <CircleAlert size={18} />
        <p>
          Tài liệu dựng từ dữ liệu hư cấu. Không có giá trị pháp lý, không phải
          biểu mẫu chính thức, chưa nộp đến bất kỳ cơ quan nào. Cấu trúc tham
          khảo{" "}
          {vat
            ? "01/GTGT theo TT80/2021/TT-BTC"
            : ecommerce
              ? "02/CNKD-TMĐT theo NĐ117/2025/NĐ-CP"
              : "nhóm biểu mẫu hộ kinh doanh"}
          ; không khẳng định hiệu lực hoặc khả năng áp dụng cho kỳ 10/2026.
        </p>
      </div>
      <a
        className="document-reference"
        href={vat ? formReferences.vat : formReferences.household}
        target="_blank"
        rel="noreferrer"
      >
        Nguồn cấu trúc biểu mẫu · Cổng thông tin Chính phủ{" "}
        <ArrowUpRight size={12} />
      </a>
      <div className="document-signature">
        <span>
          Ngày tạo:{" "}
          {new Date(d.createdAt).toLocaleDateString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
          })}
        </span>
        <span>
          Người lập bản nháp<strong>Trần Minh</strong>
          <small>Chưa ký · Không phát hành</small>
        </span>
      </div>
    </div>
  );
}
