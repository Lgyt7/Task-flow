import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-60 flex flex-col min-h-screen">
        <Header onMenuToggle={() => setSidebarOpen((p) => !p)} />
        <main className="flex-1 p-5 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
