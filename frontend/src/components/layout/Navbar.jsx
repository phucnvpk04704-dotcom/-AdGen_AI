import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export const Navbar = () => {
  const navItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Tạo nội dung', path: '/generator' },
    { name: 'Lịch sử', path: '/history' },
    { name: 'Hướng dẫn', path: '/guide' },
  ];

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Wordmark */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-burgundy flex items-center justify-center text-ivory font-bold text-lg shadow-sm group-hover:bg-burgundy-hover transition-colors">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-charcoal tracking-tight group-hover:text-burgundy transition-colors">
                  AdGen AI
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-burgundy/10 text-burgundy px-1.5 py-0.5 rounded">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-charcoal-muted hidden sm:block">
                AI Advertising Content Generator
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-burgundy text-white shadow-sm'
                      : 'text-charcoal-muted hover:text-charcoal hover:bg-ivory-dark'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

