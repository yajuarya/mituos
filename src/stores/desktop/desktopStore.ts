/**
 * @fileoverview Desktop Store - Manages desktop environment settings and context menu
 * 
 * This store handles all desktop-related state including wallpapers, themes, icon settings,
 * and the right-click context menu functionality. It uses Zustand with persistence to
 * maintain user preferences across sessions.
 * 
 * @educational_purpose
 * - Demonstrates state persistence with Zustand middleware
 * - Shows theme management with DOM manipulation
 * - Illustrates context menu state management
 * - Examples of selective state persistence (partialize)
 * 
 * @key_concepts
 * - Zustand store with persistence middleware
 * - Theme switching with document class manipulation
 * - Context menu positioning and item management
 * - Selective state serialization for localStorage
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DesktopState } from '@/types';

interface DesktopStore extends DesktopState {
  // Desktop Environment Actions
  /** Changes the desktop wallpaper background image */
  setWallpaper: (wallpaper: string) => void;
  /** Switches between light and dark theme modes */
  setTheme: (theme: 'light' | 'dark') => void;
  /** Toggles visibility of desktop icons on/off */
  toggleDesktopIcons: () => void;
  /** Adjusts the size of desktop icons (small/medium/large) */
  setIconSize: (size: 'small' | 'medium' | 'large') => void;
  
  // Context Menu State Management
  /** Current state of the right-click context menu */
  contextMenu: {
    /** Whether the context menu is currently visible */
    isOpen: boolean;
    /** Screen coordinates where the menu should appear */
    position: { x: number; y: number };
    /** Array of menu items with labels, actions, and optional icons */
    items: Array<{ label: string; action: () => void; icon?: string }>;
  };
  /** Opens context menu at specified position with given menu items */
  openContextMenu: (position: { x: number; y: number }, items: Array<{ label: string; action: () => void; icon?: string }>) => void;
  /** Closes the context menu and resets its state */
  closeContextMenu: () => void;
}

const defaultWallpapers = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&h=1080&fit=crop'
];

export const useDesktopStore = create<DesktopStore>()(
  persist(
    (set, get) => ({
      wallpaper: defaultWallpapers[0],
      theme: 'dark',
      showDesktopIcons: true,
      iconSize: 'medium',
      
      contextMenu: {
        isOpen: false,
        position: { x: 0, y: 0 },
        items: [],
      },

      setWallpaper: (wallpaper) => set({ wallpaper }),
      
      setTheme: (theme) => {
        set({ theme });
        // Update document class for global theme
        if (typeof window !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      },
      
      toggleDesktopIcons: () => set((state) => ({ 
        showDesktopIcons: !state.showDesktopIcons 
      })),
      
      setIconSize: (iconSize) => set({ iconSize }),
      
      openContextMenu: (position, items) => set({
        contextMenu: {
          isOpen: true,
          position,
          items,
        }
      }),
      
      closeContextMenu: () => set({
        contextMenu: {
          isOpen: false,
          position: { x: 0, y: 0 },
          items: [],
        }
      }),
    }),
    {
      name: 'mitutos-desktop-settings',
      partialize: (state) => ({
        wallpaper: state.wallpaper,
        theme: state.theme,
        showDesktopIcons: state.showDesktopIcons,
        iconSize: state.iconSize,
      }),
    }
  )
);
