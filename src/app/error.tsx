"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="empty-state">
      <h1>Workspace vừa bị gián đoạn.</h1>
      <p>
        Thử tải lại nội dung. Dữ liệu demo đã lưu vẫn được giữ trên trình duyệt
        này.
      </p>
      <button className="button primary" onClick={reset}>
        Thử lại
      </button>
    </div>
  );
}
