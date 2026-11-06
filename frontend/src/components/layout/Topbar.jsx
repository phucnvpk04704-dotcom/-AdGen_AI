import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Sparkles, ChevronRight } from 'lucide-react';

const ROUTE_TITLES = {
  '/': { title: 'Tổng quan', breadcrumb: 'Trang chủ' },
  '/generator': { title: 'Tạo nội dung quảng cáo', breadcrumb: 'Tạo nội dung' },
  '/history': { title: 'Lịch sử nội dung', breadcrumb: 'Lịch sử' },
  '/guide': { title: 'Hướng dẫn sử dụng', breadcrumb: 'Hướng dẫn' },
};

export const Topbar = ({ onOpenSidebar }) => {
  const location = useLocation();

  const currentRoute = ROUTE_TITLES[location.pathname] || {
    title: 'AdGen AI',
    breadcrumb: 'Trang',
  };

  return (
    <header className="h-16 bg-white border-b border-border sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Menu Button */}
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-charcoal hover:bg-ivory border border-border"
          aria-label="Mở menu điều hướng"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb & Title */}
        <div className="flex items-center gap-2 text-xs text-charcoal-muted">
          <Link to="/" className="hover:text-charcoal transition-colors font-medium">
            AdGen AI
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-border" />
          <span className="text-charcoal font-semibold">
            {currentRoute.breadcrumb}
          </span>
        </div>
      </div>

      {/* Right side: Quick Action */}
      <div className="flex items-center gap-3">
        {location.pathname !== '/generator' && (
          <Link
            to="/generator"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-burgundy text-white text-xs font-semibold hover:bg-burgundy-hover transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tạo nội dung</span>
          </Link>
        )}
      </div>
    </header>
  );
};
