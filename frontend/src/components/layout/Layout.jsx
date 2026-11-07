import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { BottomNav } from './BottomNav';

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ivory text-charcoal flex overflow-x-hidden">
      {/* Sidebar Navigation (Desktop permanent, Mobile drawer) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Topbar onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 max-w-6xl w-full mx-auto p-3.5 sm:p-6 lg:p-8 pb-28 lg:pb-16">
          {children}
        </main>

        <footer className="bg-white border-t border-border py-4 px-4 sm:px-6 text-xs text-charcoal-muted mt-auto mb-16 lg:mb-0">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <span>
              &copy; {new Date().getFullYear()} AdGen AI. All rights reserved.
            </span>
            <span className="text-burgundy font-medium text-xs">
              Create Better Ads. Grow Your Business.
            </span>
          </div>
        </footer>

        {/* Mobile Bottom Navigation Bar */}
        <BottomNav />
      </div>
    </div>
  );
};
