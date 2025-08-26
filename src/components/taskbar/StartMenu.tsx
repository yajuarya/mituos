'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Folder, Calculator, FileText, Settings, Activity, Star } from 'lucide-react';
import { useAppStore } from '@/stores/app/appStore';
import { useWindowStore } from '@/stores/window/windowStore';
import { useDesktopStore } from '@/stores/desktop/desktopStore';

/**
 * Props interface for the StartMenu component
 * @interface StartMenuProps
 * @property onClose - Callback function to close the start menu when triggered
 */
interface StartMenuProps {
  onClose: () => void;
}

/**
 * StartMenu component that displays available applications and system controls
 * Features app search, categorization, favorites management, and theme switching
 * @param onClose - Callback function to close the start menu
 * @returns JSX element representing the start menu interface
 */
export const StartMenu: React.FC<StartMenuProps> = ({ onClose }) => {
  const { apps, favoriteApps, launchApp, addToFavorites, removeFromFavorites } = useAppStore();
  const { openWindow } = useWindowStore();
  const { setTheme, theme } = useDesktopStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');


  // Icon mapping function
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Folder': <Folder size={24} />,
      'Calculator': <Calculator size={24} />,
      'FileText': <FileText size={24} />,
      'Settings': <Settings size={24} />,
      'Activity': <Activity size={24} />
    };
    return iconMap[iconName] || <FileText size={24} />;
  };
  // Get app categories
  const categories = ['all', ...new Set(Object.values(apps || {}).map(app => app.category))];
  
  // Filter apps based on search and category
  /**
   * Filters the available apps based on search term and active category
   * Combines search functionality with category filtering for better app discovery
   */
  const filteredApps = Object.values(apps || {}).filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || app.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Get favorite apps
  const favoriteAppsList = (favoriteApps || []).map(id => apps?.[id]).filter(Boolean);

  /**
   * Handles launching an application from the start menu
   * Creates a new window instance for the selected app and closes the start menu
   * @param appId - The unique identifier of the app to launch
   */
  const handleAppLaunch = (appId: string) => {
    const app = apps[appId];
    if (app) {
      launchApp(appId);
      openWindow({
        id: `${appId}-${Date.now()}`,
        appId,
        title: app.name,
        isMinimized: false,
        isMaximized: false,
        position: { x: 100 + Math.random() * 100, y: 100 + Math.random() * 100 },
        size: { width: app.defaultSize?.width || 800, height: app.defaultSize?.height || 600 },
        zIndex: 1000 + Date.now()
      });
      onClose();
    }
  };

  const handleFavoriteToggle = (appId: string) => {
    if ((favoriteApps || []).includes(appId)) {
      removeFromFavorites(appId);
    } else {
      addToFavorites(appId);
    }
  };

  return (
    <motion.div
      className="fixed bottom-12 left-2 w-96 h-[600px] bg-black/90 backdrop-blur-xl rounded-lg border border-white/20 shadow-2xl z-50 overflow-hidden"
      data-testid="start-menu"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white text-lg font-semibold">MituOS</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
              title="Toggle Theme"
            >
              <span className="text-white text-sm">
                {theme === 'dark' ? '☀️' : '🌙'}
              </span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <span className="text-white text-sm">✕</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search apps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition-colors"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60">
            🔍
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Favorites Section */}
        {favoriteAppsList.length > 0 && !searchTerm && (
          <div className="p-4 border-b border-white/10">
            <h3 className="text-white/80 text-sm font-medium mb-2">Favorites</h3>
            <div className="grid grid-cols-4 gap-2">
              {favoriteAppsList.slice(0, 8).map((app) => (
                <motion.button
                  key={app.id}
                  className="flex flex-col items-center p-2 rounded-lg hover:bg-white/10 transition-colors group text-center"
                  onClick={() => handleAppLaunch(app.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-lg mb-1">{getIcon(app.icon)}</span>
                  <span className="text-white text-xs truncate w-full">
                    {app.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex overflow-x-auto px-4 py-2 border-b border-white/10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap mr-2 transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Apps List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {filteredApps.map((app) => (
              <motion.div
                key={app.id}
                className="flex items-center p-2 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer"
                onClick={() => handleAppLaunch(app.id)}
                whileHover={{ x: 4 }}
              >
                <span className="text-2xl mr-3">{getIcon(app.icon)}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">{app.name}</div>
                  {app.description && (
                    <div className="text-white/60 text-sm truncate">
                      {app.description}
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavoriteToggle(app.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/20 transition-all"
                >
                  <span className="text-yellow-400">
                    {(favoriteApps || []).includes(app.id) ? '★' : '☆'}
                  </span>
                </button>
              </motion.div>
            ))}
          </div>

          {filteredApps.length === 0 && (
            <div className="text-center text-white/60 py-8">
              <span className="text-4xl mb-2 block">🔍</span>
              No apps found
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-between items-center">
          <button
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
            onClick={() => {
              // TODO: Open settings
              console.log('Open settings');
            }}
          >
            <span>⚙️</span>
            <span className="text-sm">Settings</span>
          </button>
          <button
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
            onClick={() => {
              // TODO: Power options
              console.log('Power options');
            }}
          >
            <span>⏻</span>
            <span className="text-sm">Power</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
