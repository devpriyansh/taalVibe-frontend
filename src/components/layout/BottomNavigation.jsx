import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, ListMusic, Heart } from 'lucide-react';

const BottomNavigation = () => {
  const navItems = [
    { to: '/dashboard', label: 'Home', icon: Home, end: true },
    { to: '/search', label: 'Search', icon: Search },
    { to: '/library', label: 'Library', icon: Library },
    { to: '/playlists', label: 'Playlists', icon: ListMusic },
    { to: '/favorites', label: 'Favorites', icon: Heart },
  ];

  return (
    <div className="md:hidden w-full bg-sonora-surface/95 backdrop-blur-md border-t border-sonora-border pb-safe z-40 relative">
      <nav className="flex justify-between items-center px-2 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-1/5 h-full transition-colors ${
                  isActive
                    ? 'text-sonora-primary'
                    : 'text-sonora-text-muted hover:text-sonora-text'
                }`
              }
            >
              <Icon size={22} className="mb-1" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNavigation;
