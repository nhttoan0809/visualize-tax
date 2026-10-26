import Link from "next/link";
export default function NotFound() {
  return (
    <div className="empty-state">
      <h1>Trang này chưa có trong workspace.</h1>
      <p>Trở về tổng quan để tiếp tục khám phá các luồng minh họa.</p>
      <Link href="/" className="button primary">
        Về tổng quan
      </Link>
    </div>
  );
}
