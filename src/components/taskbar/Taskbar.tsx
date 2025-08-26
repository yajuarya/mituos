'use client';

/**
 * Taskbar Component - System Navigation Bar
 * 
 * The taskbar is a critical UI element that provides quick access to system functions
 * and running applications. It serves as the primary navigation interface for MituOS,
 * similar to the Windows taskbar or macOS dock.
 * 
 * Key Features:
 * - Start menu integration with app launcher
 * - Running application management and task switching
 * - System tray with notifications and system status
 * - Clock and date display
 * - Quick access to frequently used applications
 * 
 * Layout Structure:
 * - Left: Start button and running application buttons
 * - Center: Optional quick launch area (expandable)
 * - Right: System tray, notifications, and clock
 * 
 * State Management:
 * - Integrates with window store for active window tracking
 * - Uses app store for application management
 * - Connects to desktop store for system-wide settings
 * 
 * @component
 * @example
 * ```tsx
 * <Taskbar />
 * ```
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowStore } from '@/stores/window/windowStore';
import { useAppStore } from '@/stores/app/appStore';
import { useDesktopStore } from '@/stores/desktop/desktopStore';
import StartMenu from '../desktop/StartMenu';
import { SystemTray } from './SystemTray';
import { TaskbarButton } from './TaskbarButton';

/**
 * Main Taskbar Component Function
 * 
 * Renders the system taskbar with all its interactive elements and manages
 * the state for start menu visibility, current time display, and hydration safety.
 * 
 * State Variables:
 * - isStartMenuOpen: Controls start menu visibility
 * - currentTime: Live clock state updated every second
 * - isMounted: Prevents hydration issues by ensuring client-side rendering
 * 
 * Store Integration:
 * - windowStore: Manages window focus, minimize, and restore operations
 * - appStore: Provides access to installed applications
 * - desktopStore: Supplies theme and desktop configuration
 */
export const Taskbar: React.FC = () => {
  const { windows, focusWindow, minimizeWindow, restoreWindow } = useWindowStore();
  const { apps } = useAppStore();
  const { theme } = useDesktopStore();
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get visible windows (not minimized or with special handling)
  const visibleWindows = Object.values(windows).filter(window => !window.isMinimized);
  const minimizedWindows = Object.values(windows).filter(window => window.isMinimized);

  const handleWindowClick = (windowId: string) => {
    const window = windows[windowId];
    if (window) {
      if (window.isMinimized) {
        restoreWindow(windowId);
      }
      focusWindow(windowId);
    }
  };

  const toggleStartMenu = () => {
    setIsStartMenuOpen(!isStartMenuOpen);
  };

  // Close start menu when clicking outside
  const handleTaskbarClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.start-button') === null) {
      setIsStartMenuOpen(false);
    }
  };

  return (
    <>
      {/* Start Menu */}
      <AnimatePresence>
        {isStartMenuOpen && (
          <StartMenu isOpen={isStartMenuOpen} onClose={() => setIsStartMenuOpen(false)} />
        )}
      </AnimatePresence>

      {/* Taskbar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-12 bg-black/80 backdrop-blur-md border-t border-white/10 flex items-center px-2 z-40"
        data-testid="taskbar"
        initial={{ y: 48 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        onClick={handleTaskbarClick}
      >
        {/* Start Button */}
        <motion.button
          className="start-button flex items-center justify-center w-10 h-8 rounded bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-200 mr-2 shadow-lg"
          data-testid="start-button"
          onClick={toggleStartMenu}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-white font-bold text-sm">⊞</span>
        </motion.button>

        {/* Search Bar */}
        <motion.div
          className="flex-shrink-0 w-64 h-8 bg-white/10 rounded-full border border-white/20 flex items-center px-3 mr-4 hover:bg-white/15 transition-colors cursor-text"
          whileHover={{ scale: 1.02 }}
        >
          <span className="text-white/60 text-sm mr-2">🔍</span>
          <span className="text-white/60 text-sm">Search MituOS</span>
        </motion.div>

        {/* Task Buttons */}
        <div className="flex-1 flex items-center space-x-1 overflow-hidden">
          {Object.values(windows).map((window) => {
            const app = apps[window.appId];
            return (
              <TaskbarButton
                key={window.id}
                window={window}
                app={app}
                onClick={() => handleWindowClick(window.id)}
                isActive={window.zIndex === Math.max(...Object.values(windows).map(w => w.zIndex))}
              />
            );
          })}
        </div>

        {/* System Tray */}
        <div className="flex items-center space-x-2 ml-4">
          <SystemTray />
          <motion.div className="text-center">
            <div>{isMounted ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</div>
            <div className="text-xs opacity-80">
              {isMounted ? currentTime.toLocaleDateString([], { month: 'short', day: 'numeric' }) : '---'}
            </div>
          </motion.div>

          {/* Show Desktop Button */}
          <motion.button
            className="w-2 h-8 bg-white/20 hover:bg-white/30 transition-colors border-l border-white/30"
            onClick={() => {
              // Minimize all windows
              Object.keys(windows).forEach(windowId => {
                minimizeWindow(windowId);
              });
            }}
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
            title="Show Desktop"
          />
        </div>
      </motion.div>
    </>
  );
};
