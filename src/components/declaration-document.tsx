import { CircleAlert } from "lucide-react";
import { money, type Declaration } from "@/lib/demo-data";
export function DeclarationDocument({
  declaration,
}: {
  declaration: Declaration;
}) {
  return (
    <div className="declaration-document print-document">
      <div className="document-watermark">BẢN MINH HỌA</div>
      <div className="declaration-document-top">
        <span className="document-brand">visualize tax.</span>
        <span>Mẫu {declaration.form}</span>
      </div>
      <h3>BẢN TỔNG HỢP TỜ KHAI THUẾ</h3>
      <p className="document-period">{declaration.period}</p>
      <div className="document-rule" />
      <dl className="declaration-business">
        <div>
          <dt>Người nộp thuế mẫu</dt>
          <dd>Hộ kinh doanh Trần Minh</dd>
        </div>
        <div>
          <dt>Mã số thuế mẫu</dt>
          <dd>0000000000</dd>
        </div>
        <div>
          <dt>Địa chỉ mẫu</dt>
          <dd>Không gian trải nghiệm Visualize Tax</dd>
        </div>
      </dl>
      <table className="declaration-values">
        <thead>
          <tr>
            <th>Chỉ tiêu minh họa</th>
            <th className="text-right">Giá trị</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Doanh thu từ hóa đơn đã duyệt</td>
            <td>{money(declaration.revenue)}</td>
          </tr>
          <tr>
            <td>Thuế suất minh họa</td>
            <td>{declaration.rate}%</td>
          </tr>
          <tr className="declaration-tax">
            <td>Tổng thuế minh họa</td>
            <td>{money(declaration.tax)}</td>
          </tr>
        </tbody>
      </table>
      <div className="document-disclaimer">
        <CircleAlert size={18} />
        <p>
          Tài liệu được tạo từ dữ liệu hư cấu nhằm trình diễn UI/UX. Không có
          giá trị pháp lý, không phải biểu mẫu kê khai chính thức và chưa được
          nộp đến bất kỳ cơ quan nào.
        </p>
      </div>
      <div className="document-signature">
        <span>
          Ngày tạo:{" "}
          {new Date(declaration.createdAt).toLocaleDateString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
          })}
        </span>
        <span>
          Hệ thống minh họa
          <br />
          <strong>Visualize Tax</strong>
        </span>
      </div>
    </div>
  );
}
