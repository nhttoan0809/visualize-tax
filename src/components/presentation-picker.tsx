"use client";
import {
  ArrowRight,
  GitCompareArrows,
  MousePointer2,
  Play,
  Sparkles,
} from "lucide-react";
import {
  presentationScenarios,
  type TourScenario,
} from "@/lib/presentation-scenarios";
import { Modal } from "./ui";

export function PresentationPicker({
  onClose,
  onStart,
}: {
  onClose: () => void;
  onStart: (scenario: TourScenario) => void;
}) {
  return (
    <Modal
      title="Chọn kịch bản trình diễn"
      subtitle="Hai luồng độc lập để khám phá khả năng của Visualize Tax"
      onClose={onClose}
      wide
      className="presentation-picker"
    >
      <div className="presentation-options">
        {presentationScenarios.map((scenario) => (
          <button
            key={scenario.id}
            className={`presentation-option presentation-option-${scenario.id}`}
            data-tour={`choose-${scenario.id}`}
            aria-label={`Chạy kịch bản ${scenario.number === "01" ? "1: Trợ lý thuế" : "2: Đồng bộ & đối soát"}`}
            onClick={() => onStart(scenario.id)}
          >
            <span className="presentation-option-top">
              <span className="presentation-option-icon">
                {scenario.id === "assistant" ? (
                  <Sparkles size={25} />
                ) : (
                  <GitCompareArrows size={25} />
                )}
              </span>
              <span className="presentation-option-number">
                KỊCH BẢN {scenario.number}
              </span>
            </span>
            <strong>{scenario.title}</strong>
            <span className="presentation-option-description">
              {scenario.description}
            </span>
            <span className="presentation-option-steps">
              {scenario.steps.map((step, index) => (
                <span key={step}>
                  <i>{index + 1}</i>
                  {step}
                </span>
              ))}
            </span>
            <span className="presentation-option-start">
              <span>
                <Play size={13} fill="currentColor" />
                Chạy kịch bản này
              </span>
              <ArrowRight size={17} />
            </span>
          </button>
        ))}
      </div>
      <div className="presentation-picker-note">
        <MousePointer2 size={17} />
        <p>
          Con trỏ sẽ tự di chuyển, click và nhập nội dung để minh họa thao tác.
          Mỗi kịch bản bắt đầu từ bộ dữ liệu mẫu, đặt lại thay đổi trước đó. Bạn
          có thể dừng bất cứ lúc nào bằng nút Dừng hoặc phím Esc.
        </p>
      </div>
    </Modal>
  );
}
