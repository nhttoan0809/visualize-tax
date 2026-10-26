"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleArrowUp,
  FileCheck2,
  Files,
  GitCompareArrows,
  Info,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useDemo } from "./demo-provider";
import { money, shortMoney, dateLabel } from "@/lib/demo-data";
import { exportInvoices } from "@/lib/export";
import { Status } from "./ui";

gsap.registerPlugin(useGSAP);
const chartData: Record<
  string,
  { labels: string[]; revenue: number[]; costs: number[] }
> = {
  "Tháng 10, 2026": {
    labels: ["01/10", "05/10", "10/10", "15/10", "20/10", "25/10", "31/10"],
    revenue: [12, 22, 18, 42, 36, 63, 72],
    costs: [7, 11, 10, 19, 16, 29, 32],
  },
  "Quý III, 2026": {
    labels: ["01/07", "15/07", "01/08", "15/08", "01/09", "15/09", "30/09"],
    revenue: [16, 23, 38, 32, 59, 54, 81],
    costs: [6, 13, 15, 19, 25, 24, 36],
  },
};

function RevenueChart() {
  const [period, setPeriod] = useState("Tháng 10, 2026");
  const [point, setPoint] = useState<number | null>(null);
  const [table, setTable] = useState(false);
  const data = chartData[period];
  const points = (values: number[]) =>
    values.map((n, i) => `${45 + i * 95},${205 - n * 2}`).join(" ");
  return (
    <section className="panel revenue-panel">
      <div className="panel-heading">
        <div>
          <h2>Dòng tiền kinh doanh</h2>
          <p>Một góc nhìn rõ ràng hơn về hoạt động của bạn.</p>
        </div>
        <label className="select-control">
          <span className="sr-only">Kỳ biểu đồ</span>
          <select
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value);
              setPoint(null);
            }}
          >
            <option>Tháng 10, 2026</option>
            <option>Quý III, 2026</option>
          </select>
          <ChevronDown size={13} />
        </label>
      </div>
      <div className="chart-summary">
        <strong>
          {period === "Tháng 10, 2026" ? "142.000.000" : "218.000.000"}
          <span>đ</span>
        </strong>
        <span className="positive">
          <TrendingUp size={14} />
          12,8%<span>so với kỳ trước</span>
        </span>
      </div>
      <div className="chart-wrap">
        <svg
          viewBox="0 0 660 245"
          className="revenue-chart"
          role="img"
          aria-label={`Biểu đồ dữ liệu mẫu ${period}. Doanh thu tăng từ ${data.revenue[0]} đến ${data.revenue.at(-1)} triệu đồng. Có bảng số liệu bên dưới.`}
        >
          <defs>
            <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#15998e" stopOpacity=".15" />
              <stop offset="100%" stopColor="#15998e" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((n) => (
            <g key={n}>
              <line
                x1="45"
                y1={25 + n * 60}
                x2="625"
                y2={25 + n * 60}
                stroke="#e8eef0"
                strokeDasharray="4 5"
              />
              <text x="0" y={29 + n * 60} className="chart-axis">
                {90 - n * 30}tr
              </text>
            </g>
          ))}
          <polygon
            points={`45,205 ${points(data.revenue)} 615,205`}
            fill="url(#revenue-fill)"
          />
          <polyline
            points={points(data.costs)}
            fill="none"
            stroke="#7c8fa0"
            strokeWidth="2"
            strokeDasharray="5 5"
            strokeLinejoin="round"
          />
          <polyline
            className="chart-line"
            points={points(data.revenue)}
            fill="none"
            stroke="#138b81"
            strokeWidth="2.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {data.labels.map((label, i) => (
            <g key={label}>
              <text
                x={45 + i * 95}
                y="234"
                textAnchor="middle"
                className="chart-axis"
              >
                {label}
              </text>
              <circle
                cx={45 + i * 95}
                cy={205 - data.revenue[i] * 2}
                r="4"
                fill="#138b81"
                stroke="white"
                strokeWidth="2"
              />
            </g>
          ))}
        </svg>
        <div className="chart-targets">
          {data.labels.map((label, i) => (
            <button
              key={label}
              aria-label={`${label}: doanh thu ${data.revenue[i]} triệu, chi phí ${data.costs[i]} triệu`}
              onFocus={() => setPoint(i)}
              onMouseEnter={() => setPoint(i)}
              onMouseLeave={() => setPoint(null)}
              onBlur={() => setPoint(null)}
              onClick={() => setPoint(point === i ? null : i)}
            />
          ))}
        </div>
        {point !== null && (
          <div
            className="chart-tooltip"
            style={{ left: `${Math.min(75, 8 + point * 12)}%` }}
          >
            <strong>{data.labels[point]}</strong>
            <span>Doanh thu: {data.revenue[point]} triệu</span>
            <span>Chi phí: {data.costs[point]} triệu</span>
          </div>
        )}
      </div>
      <div className="chart-footer">
        <div className="chart-legend">
          <span>
            <i />
            Doanh thu
          </span>
          <span>
            <i />
            Chi phí
          </span>
          <small>Dữ liệu xu hướng mẫu</small>
        </div>
        <button className="text-button" onClick={() => setTable((t) => !t)}>
          {table ? "Ẩn số liệu" : "Xem số liệu"}
        </button>
      </div>
      {table && (
        <div className="table-scroll">
          <table className="data-table compact-table">
            <caption className="sr-only">
              Dữ liệu minh họa dòng tiền, đơn vị triệu đồng
            </caption>
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Doanh thu (triệu)</th>
                <th>Chi phí (triệu)</th>
              </tr>
            </thead>
            <tbody>
              {data.labels.map((label, i) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td>{data.revenue[i]}</td>
                  <td>{data.costs[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function Dashboard() {
  const { state, notify } = useDemo();
  const root = useRef<HTMLDivElement>(null);
  const approved = state.invoices.filter((i) => i.status === "approved");
  const revenue = approved.reduce((s, i) => s + i.amount, 0);
  const pending = state.invoices.length - approved.length;
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".welcome-heading", {
        y: 12,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.from(".dashboard-reveal", {
        y: 16,
        opacity: 0,
        duration: 0.55,
        stagger: 0.07,
        delay: 0.1,
        ease: "power2.out",
      });
      gsap.from(".chart-line", {
        strokeDasharray: 1000,
        strokeDashoffset: 1000,
        duration: 1.4,
        delay: 0.35,
        ease: "power2.out",
      });
    },
    { scope: root },
  );
  return (
    <div ref={root} className="dashboard">
      <div className="page-heading welcome-heading">
        <div>
          <div className="greeting-date">
            <span className="sun-icon" />
            Chủ nhật, 25 tháng 10, 2026{" "}
            <span className="sample-date">Ngày mô phỏng</span>
          </div>
          <h1>
            Chào Minh, một ngày thật tốt lành
            <span className="heading-dot">.</span>
          </h1>
          <p>Mọi thứ bạn cần để tự tin quản lý thuế, ở ngay đây.</p>
        </div>
        <button
          className="button secondary"
          onClick={() => {
            exportInvoices(state.invoices);
            notify("Đã xuất dữ liệu hóa đơn minh họa (.csv).");
          }}
        >
          <ArrowDownToLine size={16} />
          Xuất báo cáo
        </button>
      </div>
      <section className="overview-banner dashboard-reveal">
        <div className="overview-banner-copy">
          <span className="overview-kicker">
            <Sparkles size={15} />
            Thêm rõ ràng. Bớt lo âu.
          </span>
          <h2>
            Việc kinh doanh của bạn.
            <br />
            Thuế để workspace lo.
          </h2>
          <p>
            Từ hóa đơn đến tờ khai, khám phá một quy trình
            <br className="desktop-break" /> gọn gàng và kết nối trong từng
            bước.
          </p>
          <Link href="/assistant" className="button banner-cta">
            Khám phá trợ lý thuế <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="workspace-illustration" aria-hidden="true">
          <div className="illustration-orbit orbit-one" />
          <div className="illustration-orbit orbit-two" />
          <div className="floating-spark spark-one">✦</div>
          <div className="floating-spark spark-two">✦</div>
          <div className="paper-back" />
          <div className="paper-front">
            <span className="paper-logo">
              <span className="brand-mark">
                <span />
                <span />
                <span />
              </span>
            </span>
            <span className="paper-title">Tờ khai thuế</span>
            <span className="paper-subtitle">Kỳ kê khai tháng 10/2026</span>
            <div className="paper-rule" />
            <div className="paper-lines">
              <i />
              <i />
              <i />
            </div>
            <div className="paper-total">
              <small>Tổng doanh thu</small>
              <strong>{shortMoney(revenue)} đ</strong>
            </div>
            <div className="paper-chart">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <span className="paper-approved">
              <Check size={11} />
              Đã kiểm tra
            </span>
          </div>
          <div className="illustration-chip">
            <span>
              <FileCheck2 size={18} />
            </span>
            <div>
              <strong>Gọn gàng từng chứng từ</strong>
              <small>Sẵn sàng cho bước tiếp theo</small>
            </div>
            <span className="chip-check">
              <Check size={13} />
            </span>
          </div>
        </div>
      </section>
      <div className="metrics-grid dashboard-reveal">
        <article className="metric">
          <div className="metric-label">
            Doanh thu đã duyệt{" "}
            <span className="metric-icon teal">
              <Wallet size={17} />
            </span>
          </div>
          <strong>{money(revenue)}</strong>
          <div className="metric-note">
            <span className="positive">
              <CircleArrowUp size={13} />
              {approved.length} hóa đơn
            </span>
            <span>trong dữ liệu mẫu</span>
          </div>
        </article>
        <article className="metric">
          <div className="metric-label">
            Hóa đơn trong kỳ{" "}
            <span className="metric-icon blue">
              <Files size={17} />
            </span>
          </div>
          <strong>
            {String(state.invoices.length).padStart(2, "0")}
            <small>hóa đơn</small>
          </strong>
          <div className="metric-note">
            <span className="amber-text">{pending} chờ kiểm tra</span>
            <span>· {approved.length} đã duyệt</span>
          </div>
        </article>
        <article className="metric">
          <div className="metric-label">
            Đã đối soát{" "}
            <span className="metric-icon purple">
              <GitCompareArrows size={17} />
            </span>
          </div>
          <strong>
            {String(state.matchedIds.length).padStart(2, "0")}
            <small>giao dịch</small>
          </strong>
          <div className="metric-note">
            <span className="mini-progress">
              <i
                style={{
                  width: `${(state.matchedIds.length / state.invoices.length) * 100}%`,
                }}
              />
            </span>
            <span>
              {Math.round(
                (state.matchedIds.length / state.invoices.length) * 100,
              )}
              % hóa đơn
            </span>
          </div>
        </article>
        <article className="metric">
          <div className="metric-label">
            Tờ khai đã tạo{" "}
            <span className="metric-icon orange">
              <FileCheck2 size={17} />
            </span>
          </div>
          <strong>
            {String(state.declarations.length).padStart(2, "0")}
            <small>bản nháp</small>
          </strong>
          <div className="metric-note">
            <span className="muted">Chưa gửi cơ quan thuế</span>
            <Info size={13} />
          </div>
        </article>
      </div>
      <div className="dashboard-middle dashboard-reveal">
        <RevenueChart />
        <section className="panel next-steps">
          <div className="panel-heading">
            <div>
              <h2>Hôm nay cần làm gì?</h2>
              <p>Từng bước nhỏ, mọi thứ ngăn nắp.</p>
            </div>
            <span className="task-count">3</span>
          </div>
          <Link href="/invoices" className="task-item">
            <span className="task-icon orange">
              <Files size={19} />
            </span>
            <span>
              <strong>Kiểm tra hóa đơn</strong>
              <small>
                {pending
                  ? `${pending} chứng từ đang chờ bạn duyệt`
                  : "Tất cả chứng từ đã được duyệt"}
              </small>
              <span className="task-tag">Bắt đầu từ đây</span>
            </span>
            <ArrowUpRight size={17} />
          </Link>
          <Link href="/reconciliation" className="task-item">
            <span className="task-icon blue">
              <GitCompareArrows size={19} />
            </span>
            <span>
              <strong>Đối soát giao dịch</strong>
              <small>Kết nối hóa đơn với dòng tiền</small>
            </span>
            <ArrowUpRight size={17} />
          </Link>
          <Link href="/declarations" className="task-item">
            <span className="task-icon teal">
              <FileCheck2 size={19} />
            </span>
            <span>
              <strong>Chuẩn bị tờ khai</strong>
              <small>Tạo bản nháp từ dữ liệu đã duyệt</small>
            </span>
            <ArrowUpRight size={17} />
          </Link>
          <div className="task-insight">
            <span className="insight-icon">
              <Sparkles size={18} />
            </span>
            <p>
              Một quy trình tốt bắt đầu từ
              <br />
              <strong>những dữ liệu được kiểm tra.</strong>
            </p>
          </div>
        </section>
      </div>
      <section className="panel recent-panel dashboard-reveal">
        <div className="panel-heading">
          <div>
            <h2>Hóa đơn gần đây</h2>
            <p>Những chứng từ mới nhất trong không gian của bạn.</p>
          </div>
          <Link className="text-button" href="/invoices">
            Xem tất cả <ArrowRight size={15} />
          </Link>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Khách hàng / Đối tác</th>
                <th>Số hóa đơn</th>
                <th>Ngày phát hành</th>
                <th className="text-right">Doanh thu</th>
                <th>Trạng thái</th>
                <th>
                  <span className="sr-only">Chi tiết</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {state.invoices.slice(0, 4).map((i, index) => (
                <tr key={i.id}>
                  <td>
                    <Link
                      className="customer-cell"
                      href={`/invoices?invoice=${i.id}`}
                    >
                      <span className={`customer-avatar avatar-${index % 4}`}>
                        {i.name
                          .split(" ")
                          .slice(-2)
                          .map((w) => w[0])
                          .join("")}
                      </span>
                      <span>
                        <strong>{i.name}</strong>
                        <small>{i.category}</small>
                      </span>
                    </Link>
                  </td>
                  <td className="muted">#{i.number}</td>
                  <td className="muted">{dateLabel(i.date)}</td>
                  <td className="text-right tabular">{money(i.amount)}</td>
                  <td>
                    <Status approved={i.status === "approved"} />
                  </td>
                  <td>
                    <Link
                      href={`/invoices?invoice=${i.id}`}
                      className="row-action"
                      aria-label={`Xem hóa đơn ${i.number}`}
                    >
                      <ArrowUpRight size={17} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="dashboard-bottom-note">
        <ShieldCheckIcon />
        <p>
          Không gian an toàn để thử nghiệm. Mọi thao tác chỉ tác động đến dữ
          liệu mẫu trên trình duyệt của bạn.
        </p>
      </div>
    </div>
  );
}
function ShieldCheckIcon() {
  return (
    <span className="bottom-shield">
      <Check size={12} />
    </span>
  );
}
