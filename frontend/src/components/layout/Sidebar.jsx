import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Sparkles,
  History,
  BookOpen,
  Home,
  X,
  Zap,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    name: 'Trang chủ',
    path: '/',
    icon: Home,
  },
  {
    name: 'Tạo nội dung',
    path: '/generator',
    icon: Sparkles,
    badge: 'AI',
  },
  {
    name: 'Lịch sử',
    path: '/history',
    icon: History,
  },
  {
    name: 'Hướng dẫn',
    path: '/guide',
    icon: BookOpen,
  },
];

export const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-charcoal/50 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-border flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-border">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-burgundy flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-burgundy-hover transition-colors">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-base text-charcoal tracking-tight group-hover:text-burgundy transition-colors block">
                  AdGen AI
                </span>
                <span className="text-[10px] font-semibold text-burgundy uppercase tracking-wider block">
                  Creative Studio
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-charcoal-muted hover:text-charcoal rounded-lg hover:bg-ivory"
              aria-label="Đóng menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="p-3.5 space-y-1">
            <div className="px-3 py-2 text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
              Menu chính
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-burgundy text-white font-semibold shadow-xs'
                        : 'text-charcoal-muted hover:text-charcoal hover:bg-ivory'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? 'text-white' : 'text-charcoal-muted'
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-burgundy/10 text-burgundy'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Branding */}
        <div className="p-4 border-t border-border bg-ivory/50">
          <div className="p-3 rounded-xl bg-white border border-border text-center space-y-1">
            <p className="text-xs font-bold text-burgundy">AdGen AI</p>
            <p className="text-[10px] text-charcoal-muted leading-tight">
              Create Better Ads. Grow Your Business.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

