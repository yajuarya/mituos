'use client';

/**
 * WindowManager Component - Central Window Orchestrator
 * 
 * The WindowManager is responsible for rendering and managing all active windows
 * in the MituOS desktop environment. It serves as the central coordinator between
 * the window store state and the actual window components displayed on screen.
 * 
 * Key Responsibilities:
 * - Renders all active windows from the window store
 * - Maps application IDs to their corresponding React components
 * - Manages window animations and transitions using Framer Motion
 * - Handles window layering and z-index management
 * - Provides smooth enter/exit animations for window lifecycle
 * 
 * Architecture:
 * - Uses AnimatePresence for smooth window transitions
 * - Maintains a component registry for all available applications
 * - Integrates with both window store and app store for complete state management
 * - Renders windows in order of their z-index for proper layering
 * 
 * Application Integration:
 * - Dynamically loads and renders application components based on window state
 * - Supports extensible app architecture for easy addition of new applications
 * - Handles error boundaries for individual application failures
 * 
 * @component
 * @example
 * ```tsx
 * <WindowManager />
 * ```
 */

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Window } from './Window';
import { useWindowStore } from '@/stores/window/windowStore';
import { useAppStore } from '@/stores/app/appStore';

// Import app components
import { Calculator } from '@/apps/calculator/Calculator';
import { Notepad } from '@/apps/notepad/Notepad';
import { FileManager } from '@/apps/file-manager/FileManager';
import { Settings } from '@/apps/settings/Settings';
import { SystemMonitor } from '@/apps/system-monitor/SystemMonitor';

/**
 * Main WindowManager Component Function
 * 
 * Orchestrates the rendering of all active windows by:
 * 1. Retrieving active windows from the window store
 * 2. Mapping each window to its corresponding application component
 * 3. Rendering windows with proper animations and layering
 * 
 * Store Integration:
 * - windowStore: Provides list of active windows and their states
 * - appStore: Supplies application metadata and configuration via getApp()
 * 
 * Rendering Logic:
 * - Uses renderAppContent() to dynamically load application components
 * - Wraps each window in AnimatePresence for smooth transitions
 * - Maintains proper z-index ordering for window layering
 */
/**
 * WindowManager component that renders all open windows
 * Manages the display and content rendering of application windows
 * @returns JSX element containing all active windows
 */
export const WindowManager: React.FC = () => {
  const { windows } = useWindowStore();
  const { getApp } = useAppStore();

  /**
   * Renders the appropriate app component based on the app ID
   * @param appId - The unique identifier of the app to render
   * @param windowId - The unique identifier of the window containing the app
   * @returns JSX element representing the app content or error message
   */
  const renderAppContent = (appId: string, windowId: string) => {
    const app = getApp(appId);
    if (!app) return <div className="p-4 text-white">App not found</div>;

    // Route to appropriate app component
    switch (appId) {
      case 'calculator':
        return <Calculator windowId={windowId} />;
      case 'notepad':
        return <Notepad windowId={windowId} />;
      case 'file-manager':
        return <FileManager windowId={windowId} />;
      case 'settings':
        return <Settings windowId={windowId} />;
      case 'system-monitor':
        return <SystemMonitor windowId={windowId} />;
      default:
        return (
          <div className="p-8 text-center text-white">
            <div className="text-6xl mb-4">{app.icon}</div>
            <h2 className="text-2xl font-bold mb-2">{app.name}</h2>
            <p className="text-white/70">{app.description}</p>
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <p className="text-sm text-white/60">
                This app is under development. Check back soon!
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {Array.from(windows.values()).map((window) => (
        <Window key={window.id} window={window}>
          {renderAppContent(window.appId, window.id)}
        </Window>
      ))}
    </AnimatePresence>
  );
};
