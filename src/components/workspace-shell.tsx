"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  ArrowUpRight,
  Bell,
  BookOpen,
  ChevronDown,
  CircleHelp,
  Command,
  FileCheck2,
  Files,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Play,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Square,
  X,
  GitCompareArrows,
  Info,
  MousePointer2,
} from "lucide-react";
import { useDemo } from "./demo-provider";
import { Modal } from "./ui";
import { PresentationPicker } from "./presentation-picker";
import { FeatureDescription } from "./feature-description";

const navigation = [
  { href: "/", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/assistant", label: "Trợ lý thuế", icon: MessageSquareText },
  { href: "/invoices", label: "Hóa đơn", icon: Files },
  { href: "/reconciliation", label: "Đối soát", icon: GitCompareArrows },
  { href: "/declarations", label: "Tờ khai", icon: FileCheck2 },
];

function subscribeMobile(callback: () => void) {
  const media = window.matchMedia("(max-width: 1023px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const mobileSnapshot = () => window.matchMedia("(max-width: 1023px)").matches;
const serverMobileSnapshot = () => false;

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { tour, startTour, stopTour, reset, toast, ready, state, epoch } =
    useDemo();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useSyncExternalStore(
    subscribeMobile,
    mobileSnapshot,
    serverMobileSnapshot,
  );
  const [help, setHelp] = useState(false);
  const [features, setFeatures] = useState(false);
  const [tourPicker, setTourPicker] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [notifications, setNotifications] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const previousPath = useRef(pathname);
  const stopRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!mobileOpen || !isMobile) return;
    const previous = document.activeElement as HTMLElement | null;
    sidebarRef.current?.querySelector<HTMLElement>(".sidebar-close")?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      if (previous?.isConnected) previous.focus();
    };
  }, [mobileOpen, isMobile]);
  useEffect(() => {
    if (previousPath.current !== pathname) {
      previousPath.current = pathname;
      if (!tour) mainRef.current?.focus();
    }
  }, [pathname, tour]);
  const running = !!tour;
  useEffect(() => {
    if (running) stopRef.current?.focus();
  }, [running]);
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k" && !running) {
        e.preventDefault();
        setSearch((s) => !s);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [running]);
  const current = navigation.find((n) => n.href === pathname);
  const pending = state.invoices.filter((i) => i.status === "review").length;
  const closeHelp = useCallback(() => setHelp(false), []);
  const closeFeatures = useCallback(() => setFeatures(false), []);
  const closeTourPicker = useCallback(() => setTourPicker(false), []);
  const closeSearch = useCallback(() => {
    setSearch(false);
    setQuery("");
  }, []);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Đến nội dung chính
      </a>
      <div className="demo-banner">
        <div className="demo-notice">
          <span className="demo-dot" />
          <strong>Phiên bản tái hiện</strong>
          <span className="banner-detail">
            Dữ liệu mô phỏng. Không phải hệ thống thực tế.
          </span>
        </div>
        <div className="banner-actions">
          <button
            disabled={!!tour}
            onClick={() => {
              setTourPicker(false);
              setFeatures(true);
            }}
          >
            <Info size={13} />
            Mô tả tính năng
          </button>
          <button
            onClick={() => {
              setHelp(false);
              setTourPicker(false);
              setFeatures(false);
              setSearch(false);
              setQuery("");
              setNotifications(false);
              setMobileOpen(false);
              reset();
            }}
            disabled={!ready}
            aria-label="Đặt lại toàn bộ trạng thái"
          >
            <RotateCcw size={13} />
            <span>Đặt lại</span>
          </button>
          <span className="banner-separator" />
          {tour ? (
            <button ref={stopRef} className="tour-stop" onClick={stopTour}>
              <Square size={12} fill="currentColor" />
              Dừng trình diễn
            </button>
          ) : (
            <button
              className="tour-start"
              onClick={() => {
                setHelp(false);
                setFeatures(false);
                setSearch(false);
                setQuery("");
                setNotifications(false);
                setMobileOpen(false);
                setTourPicker(true);
              }}
              disabled={!ready}
            >
              <Play size={12} fill="currentColor" />
              Chạy trình diễn
            </button>
          )}
        </div>
      </div>
      <div className="application" inert={running}>
        {mobileOpen && (
          <button
            className="sidebar-shade"
            onClick={() => setMobileOpen(false)}
            aria-label="Đóng điều hướng"
          />
        )}
        <aside
          ref={sidebarRef}
          inert={isMobile && !mobileOpen}
          aria-label="Điều hướng workspace"
          className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}
        >
          <button
            className="icon-button sidebar-close"
            aria-label="Đóng điều hướng"
            onClick={() => setMobileOpen(false)}
          >
            <X size={19} />
          </button>
          <Link
            className="brand"
            href="/"
            onClick={() => setMobileOpen(false)}
            aria-label="Visualize Tax, trang tổng quan"
          >
            <span className="brand-mark">
              <span />
              <span />
              <span />
            </span>
            <span>
              visualize<span className="brand-tax">tax</span>
              <span className="brand-dot">.</span>
            </span>
          </Link>
          <button className="workspace-switch" onClick={() => setHelp(true)}>
            <span className="workspace-avatar">M</span>
            <span>
              <strong>Không gian của Minh</strong>
              <small>Hộ kinh doanh mẫu</small>
            </span>
            <ChevronDown size={15} />
          </button>
          <div className="nav-section-label">Không gian làm việc</div>
          <nav aria-label="Điều hướng chính">
            {navigation.map(({ href, label, icon: Icon }) => (
              <Link
                href={href}
                key={href}
                onClick={() => setMobileOpen(false)}
                aria-current={pathname === href ? "page" : undefined}
                className={`nav-link ${pathname === href ? "active" : ""}`}
              >
                <Icon size={19} strokeWidth={1.7} />
                <span>{label}</span>
                {href === "/assistant" && <span className="new-tag">Demo</span>}
                {href === "/invoices" && (
                  <span className="nav-count">{pending}</span>
                )}
              </Link>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="sidebar-guide">
              <span className="guide-icon">
                <Sparkles size={19} />
              </span>
              <strong>
                Ít thủ tục hơn.
                <br />
                Thêm thời gian cho bạn.
              </strong>
              <p>Khám phá luồng xử lý thuế trong một trải nghiệm liền mạch.</p>
              <button onClick={() => setHelp(true)}>
                Về dự án này <ArrowUpRight size={15} />
              </button>
            </div>
            <button className="help-link" onClick={() => setHelp(true)}>
              <CircleHelp size={18} />
              Hướng dẫn trải nghiệm
              <ArrowUpRight size={14} />
            </button>
            <div className="profile">
              <span className="profile-avatar">TM</span>
              <span>
                <strong>Trần Minh</strong>
                <small>Tài khoản trải nghiệm</small>
              </span>
              <ShieldCheck size={17} />
            </div>
          </div>
        </aside>
        <div
          className={`workspace-main ${pathname === "/assistant" ? "assistant-workspace" : ""}`}
          inert={isMobile && mobileOpen}
        >
          <header className="topbar">
            <div className="breadcrumb">
              <button
                className="icon-button mobile-menu"
                onClick={() => setMobileOpen((s) => !s)}
                aria-label="Mở điều hướng"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <span>Workspace</span>
              <span className="breadcrumb-slash">/</span>
              <strong>{current?.label ?? "Không tìm thấy"}</strong>
            </div>
            <div className="topbar-actions">
              <button
                className="search-trigger"
                aria-label="Tìm nhanh"
                onClick={() => setSearch(true)}
              >
                <Search size={16} />
                <span>Tìm nhanh</span>
                <kbd>⌘ K</kbd>
              </button>
              <span className="topbar-divider" />
              <div className="notification-wrap">
                <button
                  className="icon-button notification-button"
                  aria-label="Thông báo"
                  aria-expanded={notifications}
                  onClick={() => setNotifications((s) => !s)}
                >
                  <Bell size={19} />
                  <span />
                </button>
                {notifications && (
                  <div className="notification-popover">
                    <strong>Bạn có {pending} hóa đơn cần kiểm tra</strong>
                    <p>Kiểm tra chứng từ trước khi lập tờ khai minh họa.</p>
                    <Link
                      href="/invoices"
                      onClick={() => setNotifications(false)}
                    >
                      Mở danh sách hóa đơn <ArrowUpRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
              <span className="top-avatar">TM</span>
            </div>
          </header>
          <main
            id="main-content"
            tabIndex={-1}
            ref={mainRef}
            key={epoch}
            className={`page-content ${pathname === "/assistant" ? "assistant-content" : ""}`}
            aria-busy={!ready}
          >
            {ready ? (
              children
            ) : (
              <div className="loading-workspace">
                <span className="brand-mark">
                  <span />
                  <span />
                  <span />
                </span>
                <p>Đang chuẩn bị không gian của bạn…</p>
              </div>
            )}
          </main>
          <footer className="workspace-footer">
            <span>
              <span className="system-dot" />
              Workspace minh họa · Hoạt động trên trình duyệt
            </span>
            <span>Được xây dựng để khám phá.</span>
          </footer>
        </div>
        {tourPicker && (
          <PresentationPicker
            onClose={closeTourPicker}
            onStart={(scenario) => {
              setTourPicker(false);
              void startTour(scenario);
            }}
          />
        )}
        {features && <FeatureDescription onClose={closeFeatures} />}
        {help && (
          <Modal
            title="Một dự án. Một cách thể hiện riêng."
            subtitle="Visualize Tax · Portfolio reconstruction"
            onClose={closeHelp}
          >
            <div className="help-body">
              <span className="help-art">
                <BookOpen size={35} />
              </span>
              <p>
                Giao diện được xây dựng độc lập từ các luồng của original-tax:
                tư vấn, hóa đơn, đối soát và tạo tờ khai.
              </p>
              <div className="info-box">
                <Info size={18} />
                <p>
                  Tất cả dữ liệu đều hư cấu. Không có AI, ngân hàng, cơ sở dữ
                  liệu hay dịch vụ thuế thực tế được kết nối.
                </p>
              </div>
              <p>
                Thay đổi được lưu trên trình duyệt này. Chọn{" "}
                <strong>Đặt lại</strong> để quay về trạng thái ban đầu, hoặc{" "}
                <strong>Chạy trình diễn</strong> để xem toàn bộ luồng.
              </p>
              <button className="button primary full-width" onClick={closeHelp}>
                Bắt đầu khám phá <ArrowUpRight size={16} />
              </button>
            </div>
          </Modal>
        )}
        {search && (
          <Modal title="Bạn muốn đến đâu?" onClose={closeSearch}>
            <label className="search-field command-search">
              <Search size={18} />
              <input
                autoFocus
                data-autofocus
                aria-label="Tìm trang"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm hóa đơn, tờ khai, trợ lý…"
              />
              <Command size={16} />
            </label>
            <div className="command-results">
              {navigation
                .filter((n) =>
                  n.label
                    .toLocaleLowerCase("vi-VN")
                    .includes(query.toLocaleLowerCase("vi-VN")),
                )
                .map((n) => (
                  <Link
                    href={n.href}
                    onClick={() => {
                      setSearch(false);
                      setQuery("");
                    }}
                    key={n.href}
                  >
                    <n.icon size={18} />
                    {n.label}
                    <ArrowUpRight size={15} />
                  </Link>
                ))}
              {!navigation.some((n) =>
                n.label
                  .toLocaleLowerCase("vi-VN")
                  .includes(query.toLocaleLowerCase("vi-VN")),
              ) && <p>Không tìm thấy trang. Thử “hóa đơn” hoặc “tờ khai”.</p>}
            </div>
          </Modal>
        )}
      </div>
      {tour && (
        <>
          <div className="demo-pointer" aria-hidden="true">
            <MousePointer2 size={27} fill="currentColor" />
            <i />
            <span>Đang chuẩn bị</span>
          </div>
          <div className="demo-keycap" aria-hidden="true" />
          <div className="tour-input-shield" />
          <section
            className="tour-controller"
            role="region"
            aria-label="Trình diễn tự động"
          >
            <div className="tour-progress-track">
              <span style={{ width: `${(tour.step / tour.total) * 100}%` }} />
            </div>
            <div className="tour-controller-content">
              <span className="tour-step">
                {tour.step}
                <small>/ {tour.total}</small>
              </span>
              <div aria-live="polite" aria-atomic="true">
                <span className="tour-label">
                  {tour.scenario === "assistant"
                    ? "Kịch bản 1 · Trợ lý thuế"
                    : "Kịch bản 2 · Đồng bộ & đối soát"}
                </span>
                <h2>{tour.title}</h2>
                <p>{tour.text}</p>
              </div>
              <button
                className="icon-button"
                aria-label="Dừng trình diễn"
                onClick={stopTour}
              >
                <X size={20} />
              </button>
            </div>
            <div className="tour-footnote">
              <span className="pulse-dot" />
              Tương tác đang tạm khóa<span>Nhấn Esc để dừng</span>
            </div>
          </section>
        </>
      )}
      <div
        className={`toast ${toast && !tour ? "toast-visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast && (
          <>
            <FileCheck2 size={18} />
            <span>{toast}</span>
          </>
        )}
      </div>
    </>
  );
}
