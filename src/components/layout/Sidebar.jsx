import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePWAInstall } from '../../contexts/PWAInstallContext';
import { Home, Library, Heart, ListMusic, Settings, LogOut, ArrowDownToLine } from 'lucide-react';

const Sidebar = () => {
  const { logout } = useAuth();
  const { isStandalone, promptInstall } = usePWAInstall();

  const navItems = [
    { to: '/dashboard', label: 'Home', icon: Home, end: true },
    { to: '/library', label: 'Library', icon: Library },
    { to: '/favorites', label: 'Favorites', icon: Heart },
    { to: '/playlists', label: 'Playlists', icon: ListMusic },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 h-full bg-sonora-surface border-r border-sonora-border p-6">
      <div className="mb-10 flex items-center justify-center overflow-hidden">
        <img src="/taalvibe-logo.jpg" alt="TaalVibe" className="w-48 h-16 object-cover object-center mix-blend-screen scale-[1.3]" />
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive
                    ? 'bg-sonora-primary/10 text-sonora-primary'
                    : 'text-sonora-text-muted hover:text-sonora-text hover:bg-sonora-surface-hover'
                }`
              }
            >
              <Icon size={20} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-sonora-border space-y-2">
        {!isStandalone && (
          <button
            onClick={promptInstall}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-pink-400 hover:text-white hover:border-pink-500/40 hover:bg-pink-500/20 transition-all duration-200 font-medium group text-left"
          >
            <ArrowDownToLine size={20} className="group-hover:translate-y-0.5 transition-transform flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Download App</span>
              <span className="text-[11px] text-sonora-text-muted group-hover:text-white/80">Install TaalVibe App</span>
            </div>
          </button>
        )}
        <button
          onClick={() => logout()}
          className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-sonora-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 font-medium"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
