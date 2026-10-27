import { Check, FileCheck2 } from "lucide-react";
import { dateLabel, money, type Invoice } from "@/lib/demo-data";
import { business, invoiceDetails } from "@/lib/document-data";
import { Status } from "./ui";

export function InvoiceDocument({ invoice }: { invoice: Invoice }) {
  const detail = invoiceDetails(invoice);
  const lineTotal = detail.lines.reduce(
    (sum, line) => sum + line.quantity * line.unitPrice,
    0,
  );
  const lines =
    lineTotal === invoice.amount
      ? detail.lines
      : [
          {
            description: invoice.category,
            unit: "Gói",
            quantity: 1,
            unitPrice: invoice.amount,
          },
        ];
  return (
    <div className="invoice-record" data-tour="invoice-detail">
      <div className="record-status">
        <span>
          <FileCheck2 size={16} />
          Hóa đơn bán ra · {detail.reference}
        </span>
        <Status approved={invoice.status === "approved"} />
      </div>
      <div className="invoice-paper detailed-invoice">
        <div className="document-watermark">BẢN MINH HỌA</div>
        <div className="document-kicker">
          <span>visualize tax.</span>
          <span>
            Ký hiệu {detail.symbol}
            <br />
            Số {invoice.number}
          </span>
        </div>
        <h3>HÓA ĐƠN GIÁ TRỊ GIA TĂNG</h3>
        <p>Ngày lập {dateLabel(invoice.date)} · Đơn vị tiền: VND</p>
        <div className="document-parties">
          <section>
            <h4>Bên bán</h4>
            <strong>{business.name}</strong>
            <p>MST: {business.taxId}</p>
            <p>{business.address}</p>
            <p>
              {business.email} · {business.phone}
            </p>
          </section>
          <section>
            <h4>Bên mua</h4>
            <strong>{invoice.name}</strong>
            <p>MST: {detail.taxId}</p>
            <p>{detail.address} (địa chỉ hư cấu)</p>
            <p>Người nhận: {detail.contact}</p>
          </section>
        </div>
        <div
          className="table-scroll"
          role="region"
          aria-label="Chi tiết mặt hàng, cuộn ngang để xem đầy đủ"
          tabIndex={0}
        >
          <table className="document-lines">
            <caption>Chi tiết hàng hóa, dịch vụ</caption>
            <thead>
              <tr>
                <th>Hàng hóa / Dịch vụ</th>
                <th>ĐVT</th>
                <th>SL</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, index) => (
                <tr key={index}>
                  <td>{line.description}</td>
                  <td>{line.unit}</td>
                  <td>{line.quantity.toLocaleString("vi-VN")}</td>
                  <td>{money(line.unitPrice)}</td>
                  <td>{money(line.quantity * line.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <dl className="document-totals">
          <div>
            <dt>Cộng tiền hàng</dt>
            <dd>{money(invoice.amount)}</dd>
          </div>
          <div>
            <dt>
              Thuế GTGT ·{" "}
              {invoice.amount
                ? Math.round((invoice.vat / invoice.amount) * 100)
                : 0}
              % minh họa
            </dt>
            <dd>{money(invoice.vat)}</dd>
          </div>
          <div className="total">
            <dt>Tổng thanh toán</dt>
            <dd>{money(invoice.amount + invoice.vat)}</dd>
          </div>
        </dl>
        <div className="document-payment">
          <strong>Thông tin thanh toán</strong>
          <p>Chuyển khoản · {business.bank}</p>
          <p>
            Nội dung: TM HD {invoice.number} · {detail.payment}
          </p>
        </div>
        <div className="document-signature">
          <span>
            Người mua hàng
            <br />
            <strong>{detail.contact}</strong>
            <small>Chưa ký · bản mô phỏng</small>
          </span>
          <span>
            Người bán hàng
            <br />
            <strong>Trần Minh</strong>
            <small>Chưa ký · bản mô phỏng</small>
          </span>
        </div>
        <p className="document-footnote">
          Chứng từ hư cấu · Không có giá trị pháp lý. Mã số thuế và tài khoản có
          tiền tố DEMO.
        </p>
      </div>
      <section className="document-history">
        <h3>Lịch sử xử lý</h3>
        <p>
          <Check size={14} /> {dateLabel(invoice.date)} · Tiếp nhận từ{" "}
          {invoice.source}
        </p>
        <p>
          <Check size={14} /> Đã nhận diện bên mua, 2 nhóm thông tin tiền hàng
          và thuế
        </p>
        <p>
          <Check size={14} />{" "}
          {invoice.status === "approved"
            ? "Đã kiểm tra và duyệt · Sẵn sàng tổng hợp doanh thu"
            : "Chờ người dùng kiểm tra và duyệt hóa đơn"}
        </p>
      </section>
    </div>
  );
}
