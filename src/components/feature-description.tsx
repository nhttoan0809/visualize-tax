"use client";
import {
  ArrowRight,
  Camera,
  ChartNoAxesCombined,
  FileCheck2,
  GitCompareArrows,
  MessageSquareText,
  ShieldCheck,
  Info,
} from "lucide-react";
import { Modal } from "./ui";
const features = [
  {
    icon: Camera,
    title: "Từ ảnh chụp đến dữ liệu có cấu trúc",
    problem:
      "Hóa đơn rải rác mỗi ngày khiến việc nhập lại và tìm chứng từ tốn thời gian.",
    solution:
      "Đính kèm ảnh vào trợ lý, nhận thông tin trích xuất, kiểm tra rồi lưu vào danh sách hóa đơn.",
    scope: "Demo có ảnh mẫu và kết quả trích xuất định sẵn.",
  },
  {
    icon: GitCompareArrows,
    title: "Kết nối hóa đơn với dòng tiền",
    problem:
      "Chứng từ và giao dịch nằm ở nhiều nơi, khó biết khoản nào đã thanh toán hoặc đang thiếu đối chiếu.",
    solution:
      "Mục tiêu nghiệp vụ là tập hợp dữ liệu từ bán hàng, POS và các kênh giao dịch để truy vết và đối chiếu.",
    scope:
      "Demo ghép hóa đơn đã duyệt với sao kê mẫu; không kết nối POS, ngân hàng hay cổng giao dịch.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Hỏi bằng lời, hiểu bằng số liệu",
    problem:
      "Có dữ liệu nhưng vẫn mất công lọc bảng và cộng số để biết tình hình kinh doanh.",
    solution:
      "Đặt câu hỏi trong hội thoại để xem doanh thu, số hóa đơn và biểu đồ theo ngày, kèm bảng số liệu có thể kiểm tra.",
    scope: "Biểu đồ được tính từ hóa đơn đã duyệt trong workspace hiện tại.",
  },
  {
    icon: MessageSquareText,
    title: "Một nơi để giải đáp chuyện thuế",
    problem:
      "Thuật ngữ và quy định có thể khiến cá nhân, hộ kinh doanh hoặc doanh nghiệp khó xác định bước tiếp theo.",
    solution:
      "Định hướng của hệ thống là hỗ trợ tra cứu, giải thích quy định và hướng dẫn theo ngữ cảnh kinh doanh.",
    scope:
      "Bản tái hiện dùng câu trả lời theo kịch bản, không tra cứu luật hay tư vấn pháp lý thực tế.",
  },
  {
    icon: FileCheck2,
    title: "Từ dữ liệu đã kiểm tra đến bản nháp",
    problem:
      "Tổng hợp chứng từ và điền lại thông tin vào biểu mẫu tạo thêm công việc vào cuối kỳ.",
    solution:
      "Yêu cầu tạo tờ khai ngay trong hội thoại, xem trước bản tổng hợp và lưu vào mục Tờ khai để kiểm tra hoặc in.",
    scope:
      "Có tình huống 01/GTGT và 02/CNKD theo yêu cầu demo. Không tự xác định mẫu pháp lý phù hợp hoặc nộp hồ sơ.",
  },
];
export function FeatureDescription({ onClose }: { onClose: () => void }) {
  return (
    <Modal
      title="Mô tả tính năng"
      subtitle="Bài toán nghiệp vụ và những gì bạn có thể trải nghiệm"
      onClose={onClose}
      wide
    >
      <div className="feature-story">
        <div className="feature-introduction">
          <span>
            <ShieldCheck size={26} />
          </span>
          <div>
            <h3>
              Ít công việc thủ công hơn.
              <br />
              Dễ kiểm soát mỗi kỳ kê khai hơn.
            </h3>
            <p>
              Khi hóa đơn đầu vào, đầu ra và giao dịch phát sinh mỗi ngày, khó
              khăn không chỉ là điền một tờ khai. Đó còn là giữ chứng từ đầy đủ,
              hiểu dòng tiền và biết dữ liệu nào cần kiểm tra.
            </p>
          </div>
        </div>
        <div className="feature-flow">
          <span>Tiếp nhận</span>
          <ArrowRight size={13} />
          <span>Kiểm tra</span>
          <ArrowRight size={13} />
          <span>Đối chiếu</span>
          <ArrowRight size={13} />
          <span>Tổng hợp</span>
          <ArrowRight size={13} />
          <span>Kê khai</span>
        </div>
        <div className="feature-list">
          {features.map(({ icon: Icon, title, problem, solution, scope }) => (
            <article key={title}>
              <span className="feature-icon">
                <Icon size={21} />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{problem}</p>
                <p className="feature-solution">{solution}</p>
                <div className="feature-scope">
                  <Info size={14} />
                  <span>{scope}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="info-box">
          <Info size={18} />
          <p>
            Đây là bản tái hiện độc lập để thể hiện UI/UX và luồng tính năng.
            Mọi hóa đơn, giao dịch, phản hồi và biểu mẫu đều là minh họa, không
            có giá trị pháp lý.
          </p>
        </div>
        <button className="button primary full-width" onClick={onClose}>
          Tiếp tục trải nghiệm <ArrowRight size={16} />
        </button>
      </div>
    </Modal>
  );
}
