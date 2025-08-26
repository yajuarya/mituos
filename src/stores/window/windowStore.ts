/**
 * Window Management Store for MituOS
 * 
 * Educational Purpose:
 * This file demonstrates how modern operating systems manage multiple application windows.
 * It showcases concepts like z-index layering, window states, and event-driven architecture.
 * 
 * Key OS Concepts Demonstrated:
 * - Window Manager: Coordinates multiple application windows
 * - Z-Index Stacking: Determines which window appears on top
 * - Window States: Minimized, maximized, restored, focused
 * - Memory Management: Efficient tracking of window instances
 * 
 * Real-world Parallels:
 * - Similar to Windows Desktop Window Manager (DWM)
 * - Comparable to macOS WindowServer
 * - Linux X11 Window Manager functionality
 */

import { create } from 'zustand';
import { WindowState } from '@/types';

/**
 * WindowStore Interface
 * 
 * Educational Note: This interface defines the contract for window management operations.
 * In real operating systems, this would be handled by the window manager subsystem.
 */
interface WindowStore {
  // State Properties
  windows: Map<string, WindowState>;   // Map of all open windows by ID
  activeWindowId: string | null;       // Currently focused window
  nextZIndex: number;                 // Z-index counter for layering
  
  // Window Lifecycle Actions
  /** Creates and opens a new window, returns unique window ID */
  createWindow: (window: { id: string; title: string; component: string; x: number; y: number; width: number; height: number }) => string;
  /** Opens a new window and assigns unique ID and z-index */
  openWindow: (window: Omit<WindowState, 'id' | 'zIndex'>) => string;
  /** Closes a window and removes it from memory */
  closeWindow: (id: string) => void;
  /** Minimizes window to taskbar (hides from view) */
  minimizeWindow: (id: string) => void;
  /** Maximizes window to fill entire screen */
  maximizeWindow: (id: string) => void;
  /** Restores window from minimized/maximized state */
  restoreWindow: (id: string) => void;
  /** Brings window to front and sets as active */
  focusWindow: (id: string) => void;
  
  // Window Manipulation Actions
  /** Updates window position coordinates */
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  /** Updates window dimensions */
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
  /** Sets window size using direct width/height parameters */
  setWindowSize: (id: string, width: number, height: number) => void;
  /** Sets window position using direct x/y parameters */
  setWindowPosition: (id: string, x: number, y: number) => void;
  updateWindow: (id: string, updates: { x?: number; y?: number; width?: number; height?: number }) => void;
  
  // Query/Utility Functions
  /** Retrieves specific window by ID */
  getWindow: (id: string) => WindowState | undefined;
  /** Gets currently active/focused window */
  getActiveWindow: () => WindowState | undefined;
  /** Returns all windows regardless of state */
  getAllWindows: () => WindowState[];
  /** Returns only visible (non-minimized) windows */
  getVisibleWindows: () => WindowState[];
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: new Map<string, WindowState>(),
  activeWindowId: null,
  nextZIndex: 1000,

  createWindow: (window) => {
    const newWindow: WindowState = {
      ...window,
      zIndex: get().nextZIndex,
      isMinimized: false,
      isMaximized: false,
      position: { x: window.x, y: window.y },
      size: { width: window.width, height: window.height }
    };

    set((state) => {
      const newWindows = new Map(state.windows);
      newWindows.set(window.id, newWindow);
      return {
        windows: newWindows,
        activeWindowId: window.id,
        nextZIndex: state.nextZIndex + 1,
      };
    });

    return window.id;
  },

  openWindow: (windowData) => {
    const id = `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newWindow: WindowState = {
      ...windowData,
      id,
      zIndex: get().nextZIndex,
    };

    set((state) => {
      const newWindows = new Map(state.windows);
      newWindows.set(id, newWindow);
      return {
        windows: newWindows,
        activeWindowId: id,
        nextZIndex: state.nextZIndex + 1,
      };
    });

    return id;
  },

  closeWindow: (id) => {
    set((state) => {
      const newWindows = new Map(state.windows);
      newWindows.delete(id);
      
      const remainingWindows = Array.from(newWindows.values());
      const newActiveId = state.activeWindowId === id 
        ? (remainingWindows.length > 0 ? remainingWindows[remainingWindows.length - 1].id : null)
        : state.activeWindowId;
      
      return {
        windows: newWindows,
        activeWindowId: newActiveId,
      };
    });
  },

  minimizeWindow: (id) => {
    set((state) => {
      const newWindows = new Map(state.windows);
      const window = newWindows.get(id);
      if (window) {
        newWindows.set(id, { ...window, isMinimized: true });
      }
      return {
        windows: newWindows,
        activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
      };
    });
  },

  maximizeWindow: (id) => {
    set((state) => {
      const newWindows = new Map(state.windows);
      const window = newWindows.get(id);
      if (window) {
        if (window.isMaximized) {
          // Restore window to original size and position
          newWindows.set(id, { 
            ...window, 
            isMaximized: false,
            position: { x: window.originalX || 100, y: window.originalY || 100 },
            size: { width: window.originalWidth || 800, height: window.originalHeight || 600 }
          });
        } else {
          // Maximize window
          newWindows.set(id, { 
            ...window, 
            isMaximized: true,
            originalWidth: window.size.width,
            originalHeight: window.size.height,
            originalX: window.position.x,
            originalY: window.position.y,
            position: { x: 0, y: 0 },
            size: { width: typeof globalThis !== 'undefined' && globalThis.innerWidth ? globalThis.innerWidth : 1920, 
                   height: (typeof globalThis !== 'undefined' && globalThis.innerHeight ? globalThis.innerHeight : 1080) - 48 }
          });
        }
      }
      return {
        windows: newWindows,
      };
    });
  },

  restoreWindow: (id) => {
    set((state) => {
      const newWindows = new Map(state.windows);
      const window = newWindows.get(id);
      if (window) {
        newWindows.set(id, { ...window, isMinimized: false, isMaximized: false });
      }
      return {
        windows: newWindows,
        activeWindowId: id,
      };
    });
  },

  focusWindow: (id) => {
    set((state) => {
      const newWindows = new Map(state.windows);
      const window = newWindows.get(id);
      if (window) {
        newWindows.set(id, { ...window, zIndex: state.nextZIndex });
      }
      return {
        windows: newWindows,
        activeWindowId: id,
        nextZIndex: state.nextZIndex + 1,
      };
    });
  },

  updateWindowPosition: (id, position) => {
    set((state) => {
      const newWindows = new Map(state.windows);
      const window = newWindows.get(id);
      if (window) {
        // Apply screen boundary constraints - allow some overflow but prevent complete off-screen
        const screenWidth = typeof globalThis !== 'undefined' && globalThis.innerWidth ? globalThis.innerWidth : 1920;
        const screenHeight = typeof globalThis !== 'undefined' && globalThis.innerHeight ? globalThis.innerHeight : 1080;
        
        // Allow window to go slightly off-screen but keep at least 50px visible
        const minVisibleArea = 50;
        const constrainedPosition = {
          x: Math.max(minVisibleArea - window.size.width, Math.min(position.x, screenWidth - minVisibleArea)),
          y: Math.max(0, Math.min(position.y, screenHeight - minVisibleArea))
        };
        
        newWindows.set(id, { ...window, position: constrainedPosition });
      }
      return {
        windows: newWindows,
      };
    });
  },

  updateWindowSize: (id, size) => {
    set((state) => {
      const newWindows = new Map(state.windows);
      const window = newWindows.get(id);
      if (window) {
        // Enforce minimum size constraints
        const constrainedSize = {
          width: Math.max(size.width, 300),
          height: Math.max(size.height, 200)
        };
        newWindows.set(id, { ...window, size: constrainedSize });
      }
      return {
        windows: newWindows,
      };
    });
  },

  getWindow: (id) => get().windows.get(id),
  getActiveWindow: () => {
    const { windows, activeWindowId } = get();
    return activeWindowId ? windows.get(activeWindowId) : undefined;
  },
  getAllWindows: () => Array.from(get().windows.values()),
  getVisibleWindows: () => Array.from(get().windows.values()).filter(w => !w.isMinimized),

  setWindowSize: (id, width, height) => set((state) => {
    const window = state.windows.get(id);
    if (window) {
      // Enforce minimum size constraints
      const constrainedWidth = Math.max(width, 200);
      const constrainedHeight = Math.max(height, 200);
      
      const updatedWindow = {
        ...window,
        size: { width: constrainedWidth, height: constrainedHeight }
      };
      const newWindows = new Map(state.windows);
      newWindows.set(id, updatedWindow);
      return { windows: newWindows };
    }
    return state;
  }),

  setWindowPosition: (id, x, y) => set((state) => {
    const window = state.windows.get(id);
    if (window) {
      const updatedWindow = {
        ...window,
        position: { x, y }
      };
      const newWindows = new Map(state.windows);
      newWindows.set(id, updatedWindow);
      return { windows: newWindows };
    }
    return state;
  }),

  updateWindow: (id, updates) => set((state) => {
    const window = state.windows.get(id);
    if (window) {
      const updatedWindow = { ...window };
      
      // Update position if provided
      if (updates.x !== undefined || updates.y !== undefined) {
        updatedWindow.position = {
          x: updates.x !== undefined ? updates.x : window.position.x,
          y: updates.y !== undefined ? updates.y : window.position.y
        };
      }
      
      // Update size if provided with minimum constraints
      if (updates.width !== undefined || updates.height !== undefined) {
        updatedWindow.size = {
          width: updates.width !== undefined ? Math.max(updates.width, 300) : window.size.width,
          height: updates.height !== undefined ? Math.max(updates.height, 200) : window.size.height
        };
      }
      
      const newWindows = new Map(state.windows);
      newWindows.set(id, updatedWindow);
      return { windows: newWindows };
    }
    return state;
  }),
}));
