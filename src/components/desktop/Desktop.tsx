'use client';

/**
 * Desktop Component - Main Desktop Environment
 * 
 * This is the core desktop component that orchestrates the entire MituOS desktop experience.
 * It manages the desktop background, handles global interactions, and coordinates between
 * various desktop elements like the taskbar, windows, and context menus.
 * 
 * Key Features:
 * - Dynamic wallpaper management with customizable backgrounds
 * - Global keyboard shortcuts and event handling
 * - Context menu integration for desktop interactions
 * - Coordination between window management and desktop state
 * - Responsive design that adapts to different screen sizes
 * 
 * Architecture:
 * - Uses Zustand stores for state management (desktop and window stores)
 * - Implements Framer Motion for smooth animations and transitions
 * - Follows component composition pattern for modularity
 * 
 * @component
 * @example
 * ```tsx
 * <Desktop />
 * ```
 */

import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDesktopStore } from '@/stores/desktop/desktopStore';
import { useWindowStore } from '@/stores/window/windowStore';
import { Taskbar } from '../taskbar/Taskbar';
import { WindowManager } from '../window/WindowManager';
import { ContextMenu } from '../ui/ContextMenu';
import { DesktopIcons } from './DesktopIcons';

export const Desktop: React.FC = () => {
  const { 
    wallpaper, 
    theme, 
    contextMenu, 
    openContextMenu, 
    closeContextMenu,
    setTheme 
  } = useDesktopStore();
  
  const { windows } = useWindowStore();

  // Initialize theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  /**
   * Handles right-click context menu on desktop
   * 
   * Creates a context menu with desktop-specific actions like refresh,
   * personalization settings, and system options. Prevents the default
   * browser context menu and shows a custom OS-style context menu.
   * 
   * @param e - React mouse event from right-click
   */
  // Handle desktop right-click
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    const contextItems = [
      {
        label: 'Refresh',
        action: () => window.location.reload(),
        icon: '🔄'
      },
      {
        label: 'Personalize',
        action: () => {
          // Will launch settings app
          console.log('Open personalization settings');
        },
        icon: '🎨'
      },
      {
        label: theme === 'dark' ? 'Light Mode' : 'Dark Mode',
        action: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
        icon: theme === 'dark' ? '☀️' : '🌙'
      },
      {
        label: 'Display Settings',
        action: () => {
          console.log('Open display settings');
        },
        icon: '🖥️'
      }
    ];

    openContextMenu({ x: e.clientX, y: e.clientY }, contextItems);
  }, [theme, setTheme, openContextMenu]);

  // Close context menu on click
  const handleClick = useCallback(() => {
    if (contextMenu.isOpen) {
      closeContextMenu();
    }
  }, [contextMenu.isOpen, closeContextMenu]);

  /**
   * Global keyboard shortcut handler
   * 
   * Manages system-wide keyboard shortcuts for desktop operations:
   * - Alt + Tab: Window switching (TODO: Implementation pending)
   * - Windows/Meta key: Toggle start menu
   * - Escape: Close context menus and overlays
   * 
   * This handler is attached to the document to capture global key events
   * regardless of which component currently has focus.
   * 
   * @param e - Keyboard event containing key information and modifiers
   */
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + Tab for window switching
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        // TODO: Implement window switching
      }
      
      // Windows key for start menu
      if (e.key === 'Meta') {
        e.preventDefault();
        // TODO: Open start menu
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      className="fixed inset-0 overflow-hidden select-none"
      data-testid="desktop"
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {/* Desktop Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${wallpaper})`,
        }}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Overlay for better contrast */}
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
      </motion.div>

      {/* Desktop Icons */}
      <DesktopIcons />

      {/* Window Manager */}
      <WindowManager windows={windows} />

      {/* Taskbar */}
      <Taskbar />

      {/* Context Menu */}
      {contextMenu.isOpen && (
        <ContextMenu
          position={contextMenu.position}
          items={contextMenu.items}
          onClose={closeContextMenu}
        />
      )}

      {/* Loading Overlay for initial boot */}
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center z-50"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        style={{ pointerEvents: 'none' }}
      >
        <motion.div
          className="text-center text-white"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            MituOS
          </motion.h1>
          <motion.div
            className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};
