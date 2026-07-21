import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Settings, LogOut } from 'lucide-react';
import { api } from '../../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { path: '/dashboard', label: 'Settings', icon: Settings },
  ];

  if (!user) return null;

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b py-3 px-6 z-50 flex-none sticky top-0 w-full shadow-sm relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 relative z-10">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <span className="text-2xl font-bold tracking-wide text-gray-800">
            Boilerplate
          </span>
        </Link>
        <div className="flex items-center gap-2 md:gap-4 overflow-x-auto hide-scrollbar pb-1 px-2 -mx-2 flex-1 md:flex-none justify-start md:justify-end">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} className={isActive ? "text-white" : ""} />
                <span className="hidden sm:block">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap text-red-600 hover:bg-red-50"
          >
            <LogOut size={20} />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;