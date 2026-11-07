import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, FileText, UploadCloud, ShieldAlert, Bot,
  Search, Bell, Activity, Settings, LogOut, User, ChevronLeft, ChevronRight, Server
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../layouts/ProtectedLayout';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  {
    name: 'Documents', icon: FileText, children: [
      { name: 'All Documents', path: '/documents', icon: FileText },
      { name: 'Upload', path: '/documents/upload', icon: UploadCloud },
    ]
  },
  { name: 'Warranty Tracker', path: '/warranties', icon: ShieldAlert },
  { name: 'Mainframe & Zowe', path: '/mainframe', icon: Server },
  { name: 'AI Assistant', path: '/assistant', icon: Bot },
  { name: 'Search', path: '/search', icon: Search },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Activity', path: '/activity', icon: Activity },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = () => {
  const { logout, user } = useAuth();
  const { collapsed, setCollapsed } = useSidebar();
  const [docsOpen, setDocsOpen] = useState(true);


  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} bg-primary text-white flex flex-col h-screen fixed top-0 left-0 z-30 transition-all duration-300 ease-in-out`}>
      {/* Logo */}
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-4 h-16 border-b border-primary-800`}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-accent-light flex-shrink-0" />
            <span className="text-lg font-bold tracking-tight">LifeVault</span>
          </div>
        )}
        {collapsed && <ShieldAlert className="w-7 h-7 text-accent-light" />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-primary-800 transition-colors text-primary-400 hover:text-white"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          if (item.children) {
            return (
              <div key={item.name}>
                <button
                  onClick={() => setDocsOpen(!docsOpen)}
                  className={`flex items-center w-full px-3 py-2.5 rounded-lg text-primary-300 hover:bg-primary-800 hover:text-white transition-colors ${collapsed ? 'justify-center' : 'gap-3'}`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-sm font-medium text-left">{item.name}</span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${docsOpen ? 'rotate-90' : ''}`} />
                    </>
                  )}
                </button>
                {docsOpen && !collapsed && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-primary-700 pl-3">
                    {item.children.map(child => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                            isActive
                              ? 'bg-accent text-white font-semibold'
                              : 'text-primary-400 hover:bg-primary-800 hover:text-white'
                          }`
                        }
                      >
                        <child.icon className="w-4 h-4" />
                        {child.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg transition-colors ${collapsed ? 'justify-center' : 'gap-3'} ${
                  isActive
                    ? 'bg-accent text-white font-semibold'
                    : 'text-primary-300 hover:bg-primary-800 hover:text-white'
                }`
              }
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`px-2 py-4 border-t border-primary-800 ${collapsed ? 'flex justify-center' : ''}`}>
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary-800 mb-2">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
              {user?.username?.charAt(0)?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.username}</p>
              <p className="text-xs text-primary-400 capitalize">{user?.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className={`flex items-center px-3 py-2.5 w-full text-primary-300 hover:text-white hover:bg-red-600/20 rounded-lg transition-colors ${collapsed ? 'justify-center' : 'gap-3'}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
