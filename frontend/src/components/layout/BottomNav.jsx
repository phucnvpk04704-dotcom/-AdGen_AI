import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Sparkles, History, BookOpen } from 'lucide-react';

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
    highlight: true,
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

export const BottomNav = () => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border lg:hidden pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.03)]"
      aria-label="Điều hướng chính"
    >
      <div className="grid grid-cols-4 h-15 max-w-lg mx-auto px-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 transition-all duration-150 relative min-h-[48px] ${
                  isActive
                    ? 'text-burgundy font-semibold'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon
                      className={`w-5 h-5 transition-transform ${
                        isActive ? 'scale-110 text-burgundy stroke-[2.2]' : 'stroke-[1.8]'
                      }`}
                    />
                    {item.highlight && !isActive && (
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-burgundy" />
                    )}
                  </div>
                  <span className="text-[10px] sm:text-[11px] mt-1 leading-tight tracking-tight">
                    {item.name}
                  </span>
                  {isActive && (
                    <span className="absolute top-0 w-8 h-0.5 bg-burgundy rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

