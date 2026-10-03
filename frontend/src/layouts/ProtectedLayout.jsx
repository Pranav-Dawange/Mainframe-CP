import React, { useState, createContext, useContext } from 'react';
import { Navigate, Outlet, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Bell, Search } from 'lucide-react';

export const SidebarContext = createContext({ collapsed: false, setCollapsed: () => {} });
export const useSidebar = () => useContext(SidebarContext);

const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchQ, setSearchQ] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading LifeVault...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQ.trim())}`);
      setSearchQ('');
    }
  };

  const sidebarWidth = collapsed ? 'ml-16' : 'ml-64';

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="flex min-h-screen bg-surface">
        <Sidebar />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarWidth}`}>
          {/* Top Header */}
          <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
            {/* Global Search */}
            <form onSubmit={handleSearch} className="relative hidden md:flex items-center">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Search documents, warranties..."
                className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
              />
            </form>
            <div className="flex-1 md:flex-none" />

            {/* Right side */}
            <div className="flex items-center gap-3">
              <Link
                to="/notifications"
                className="relative p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2.5 hover:bg-gray-50 pl-2 pr-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200"
              >
                <div className="w-7 h-7 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user?.username?.charAt(0)?.toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.username}</span>
              </Link>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default ProtectedLayout;
