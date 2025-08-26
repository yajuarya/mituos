'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useDesktopStore } from '@/stores/desktop/desktopStore';
import { useAppStore } from '@/stores/app/appStore';
import { useWindowStore } from '@/stores/window/windowStore';

export const DesktopIcons: React.FC = () => {
  const { showDesktopIcons } = useDesktopStore();
  const { apps, launchApp } = useAppStore();
  const { openWindow } = useWindowStore();

  if (!showDesktopIcons) return null;

  // Get apps that should be shown on desktop
  const desktopApps = Object.values(apps).filter(app => app.showOnDesktop);

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
        position: { x: 100, y: 100 },
        size: { width: app.defaultSize?.width || 800, height: app.defaultSize?.height || 600 },
        zIndex: 1000
      });
    }
  };

  return (
    <div className="absolute inset-0 p-4 pointer-events-none">
      <div className="grid grid-cols-1 gap-4 w-fit pointer-events-auto">
        {desktopApps.map((app, index) => (
          <motion.div
            key={app.id}
            className="flex flex-col items-center cursor-pointer group w-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onDoubleClick={() => handleAppLaunch(app.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* App Icon */}
            <motion.div
              className="w-12 h-12 mb-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-2xl shadow-lg group-hover:bg-white/20 transition-colors"
              whileHover={{ 
                boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.15)'
              }}
            >
              {app.icon}
            </motion.div>
            
            {/* App Name */}
            <motion.span
              className="text-xs text-white text-center font-medium drop-shadow-lg group-hover:text-blue-200 transition-colors max-w-full truncate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              {app.name}
            </motion.span>
          </motion.div>
        ))}
      </div>

      {/* Recycle Bin - Always present */}
      <motion.div
        className="absolute bottom-20 right-4 flex flex-col items-center cursor-pointer group w-20 pointer-events-auto"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="w-12 h-12 mb-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-2xl shadow-lg group-hover:bg-white/20 transition-colors"
          whileHover={{ 
            boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(255, 255, 255, 0.15)'
          }}
        >
          🗑️
        </motion.div>
        <span className="text-xs text-white text-center font-medium drop-shadow-lg group-hover:text-blue-200 transition-colors">
          Recycle Bin
        </span>
      </motion.div>
    </div>
  );
};
