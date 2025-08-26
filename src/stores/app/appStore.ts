/**
 * @fileoverview Application Store for MituOS
 * 
 * This file implements the central application management system for MituOS.
 * It handles app registration, favorites, launching, and provides a registry
 * of all available applications in the operating system.
 * 
 * Educational Purpose:
 * - Demonstrates state management patterns in modern web applications
 * - Shows how to organize application metadata and lifecycle management
 * - Illustrates the use of Zustand for lightweight state management
 * - Provides examples of TypeScript interfaces for type safety
 * 
 * Key Concepts Covered:
 * - Application registry pattern
 * - State management with Zustand
 * - TypeScript interface design
 * - Application lifecycle management
 * 
 * @author MituOS Development Team
 * @version 1.0.0
 * @educational This code is designed for learning operating system concepts
 */

import { create } from 'zustand';
import { AppDefinition } from '@/types';

/**
 * Interface defining the structure of the Application Store
 * 
 * This interface serves as a contract for all application-related operations
 * in MituOS. It provides methods for managing apps, favorites, and launching.
 * 
 * Educational Note:
 * This demonstrates how to design clean, type-safe interfaces in TypeScript
 * that serve as blueprints for complex state management systems.
 */
interface AppStore {
  // === STATE PROPERTIES ===
  
  /**
   * Registry of all available applications
   * Key: app ID, Value: complete app definition
   * 
   * Educational Note: Using Record<string, AppDefinition> provides
   * O(1) lookup time for apps by ID, which is more efficient than arrays
   */
  apps: Record<string, AppDefinition>;
  
  
  /**
   * Computed property that returns apps as an array
   * 
   * Educational Note: This provides array access to apps for components
   * that need to use array methods like .map(), .filter(), .length, etc.
   * while maintaining the efficient Record structure for lookups.
   */
  appsArray: AppDefinition[];
  /**
   * Array of installed application IDs
   * 
   * Educational Note: This separation allows for future features like
   * app installation/uninstallation without affecting the app registry
   */
  installedApps: string[];
  
  /**
   * Array of user's favorite application IDs
   * 
   * Educational Note: Storing only IDs reduces memory usage and maintains
   * a single source of truth for app data
   */
  favoriteApps: string[];
  
  // === APP MANAGEMENT METHODS ===

  
  /**
   * Registers a new application in the system
   * 
   * @param app - Complete application definition including metadata
   * 
   * Educational Note: This method demonstrates the app registration pattern
   * commonly used in plugin architectures and operating systems. It adds
   * the app to both the registry and installed apps list atomically.
   */
  registerApp: (app: AppDefinition) => void;
  
  /**
   * Removes an application from the system
   * 
   * @param appId - Unique identifier of the app to remove
   * 
   * Educational Note: This method shows proper cleanup by removing the app
   * from all related arrays (installed, favorites) to prevent memory leaks
   * and maintain data consistency.
   */
  unregisterApp: (appId: string) => void;
  
  /**
   * Retrieves an application by its ID
   * 
   * @param appId - Unique identifier of the app
   * @returns App definition or undefined if not found
   * 
   * Educational Note: This demonstrates safe object property access with
   * TypeScript's union types (AppDefinition | undefined) for null safety.
   */
  getApp: (appId: string) => AppDefinition | undefined;
  
  /**
   * Filters applications by category
   * 
   * @param category - Category to filter by (e.g., 'System', 'Utilities')
   * @returns Array of applications in the specified category
   * 
   * Educational Note: Shows functional programming concepts using filter()
   * and demonstrates how to query collections efficiently.
   */
  getAppsByCategory: (category: string) => AppDefinition[];
  
  // === USER PREFERENCE METHODS ===
  
  /**
   * Adds an application to user's favorites
   * 
   * @param appId - ID of the app to add to favorites
   * 
   * Educational Note: Uses Set logic to prevent duplicates and maintains
   * immutable state updates following React/Zustand best practices.
   */
  addToFavorites: (appId: string) => void;
  
  /**
   * Removes an application from user's favorites
   * 
   * @param appId - ID of the app to remove from favorites
   * 
   * Educational Note: Demonstrates array filtering for state updates
   * while maintaining immutability principles.
   */
  removeFromFavorites: (appId: string) => void;
  
  /**
   * Checks if an application is in user's favorites
   * 
   * @param appId - ID of the app to check
   * @returns True if app is favorited, false otherwise
   * 
   * Educational Note: Simple predicate function that encapsulates the
   * logic for checking membership in an array.
   */
  isFavorite: (appId: string) => boolean;
  
  // === APPLICATION LIFECYCLE METHODS ===
  
  /**
   * Launches an application by creating a new window
   * 
   * @param appId - ID of the app to launch
   * 
   * Educational Note: This method demonstrates inter-store communication
   * in Zustand and shows how different parts of the system coordinate
   * to provide seamless user experience.
   */
  launchApp: (appId: string) => void;
}

/**
 * MituOS Application Store Implementation
 * 
 * This is the main application store created using Zustand. It provides
 * centralized state management for all application-related operations.
 * 
 * Educational Notes:
 * - Uses Zustand's create() function for lightweight state management
 * - Implements the AppStore interface defined above
 * - Provides both state and actions in a single store
 * - Uses functional updates with set() and get() for state mutations
 * 
 * Architecture Pattern:
 * This follows the "Store Pattern" where all related state and operations
 * are grouped together, making it easier to reason about data flow.
 */
export const useAppStore = create<AppStore>((set, get) => ({
  
  // === INITIAL STATE ===
  
  /**
   * Pre-installed applications registry
   * 
   * Educational Note: This demonstrates how operating systems maintain
   * a registry of available applications with their metadata. Each app
   * includes essential information like size, behavior, and categorization.
   */
  apps: {
    /**
     * File Manager Application
     * Educational Note: This represents a file system browser, similar to Windows Explorer or macOS Finder.
     * Key features: Directory navigation, file operations, and system file access.
     */
    'file-manager': {
      id: 'file-manager',
      name: 'File Manager',
      icon: 'Folder',
      category: 'System',
      component: 'FileManager',
      defaultSize: { width: 800, height: 600 },
      isResizable: true,
      isClosable: true
    },
    
    /**
     * Calculator Application
     * Educational Note: A basic arithmetic calculator demonstrating state management
     * and user input handling in a desktop environment.
     */
    'calculator': {
      id: 'calculator',
      name: 'Calculator',
      icon: 'Calculator',
      category: 'Utilities',
      component: 'Calculator',
      defaultSize: { width: 300, height: 400 },
      isResizable: false,
      isClosable: true
    },
    
    /**
     * Notepad Application
     * Educational Note: A simple text editor demonstrating file I/O operations
     * and text manipulation in a desktop application context.
     */
    'notepad': {
      id: 'notepad',
      name: 'Notepad',
      icon: 'FileText',
      category: 'Productivity',
      component: 'Notepad',
      defaultSize: { width: 600, height: 500 },
      isResizable: true,
      isClosable: true
    },
    /**
     * Settings Application
     * Educational Note: System configuration interface allowing users to customize
     * desktop appearance, behavior, and system preferences.
     */
    'settings': {
      id: 'settings',
      name: 'Settings',
      icon: 'Settings',
      category: 'System',
      component: 'Settings',
      defaultSize: { width: 700, height: 550 },
      isResizable: true,
      isClosable: true
    },
    
    /**
     * System Monitor Application
     * Educational Note: Performance monitoring tool displaying CPU, memory, and
     * process information, similar to Task Manager or Activity Monitor.
     */
    'system-monitor': {
      id: 'system-monitor',
      name: 'System Monitor',
      icon: 'Activity',
      category: 'System',
      component: 'SystemMonitor',
      defaultSize: { width: 750, height: 500 },
      isResizable: true,
      isClosable: true
    }
  },
  installedApps: ['file-manager', 'calculator', 'notepad', 'settings', 'system-monitor'],
  favoriteApps: ['file-manager', 'calculator', 'notepad'],


  // === COMPUTED PROPERTIES ===
  
  /**
   * Computed property that returns apps as an array for compatibility with components
   * that expect array operations like .map(), .filter(), etc.
   * 
   * Educational Note: This demonstrates how to provide multiple views of the same data
   * - apps (Record) for O(1) lookups by ID
   * - appsArray (Array) for iteration and array operations
   */
  get appsArray() {
    return Object.values(this.apps);
  },
  registerApp: (app) => {
    set((state) => ({
      apps: { ...state.apps, [app.id]: app },
      installedApps: [...new Set([...state.installedApps, app.id])],
    }));
  },

  unregisterApp: (appId) => {
    set((state) => {
      const { [appId]: removed, ...remainingApps } = state.apps;
      return {
        apps: remainingApps,
        installedApps: state.installedApps.filter(id => id !== appId),
        favoriteApps: state.favoriteApps.filter(id => id !== appId),
      };
    });
  },

  getApp: (appId) => get().apps[appId],

  getAppsByCategory: (category) => 
    Object.values(get().apps).filter(app => app.category === category),

  addToFavorites: (appId) => {
    set((state) => ({
      favoriteApps: [...new Set([...state.favoriteApps, appId])],
    }));
  },

  removeFromFavorites: (appId) => {
    set((state) => ({
      favoriteApps: state.favoriteApps.filter(id => id !== appId),
    }));
  },

  isFavorite: (appId) => get().favoriteApps.includes(appId),

  launchApp: (appId) => {
    const app = get().getApp(appId);
    if (app) {
      // This will be handled by the window manager
      const { useWindowStore } = require('../window/windowStore');
      const windowStore = useWindowStore.getState();
      
      windowStore.openWindow({
        title: app.name,
        component: app.component,
        isMinimized: false,
        isMaximized: false,
        position: { 
          x: typeof window !== 'undefined' ? Math.random() * (window.innerWidth - (app.defaultSize?.width || 800)) : 100, 
          y: typeof window !== 'undefined' ? Math.random() * (window.innerHeight - (app.defaultSize?.height || 600) - 100) : 100 
        },
        size: app.defaultSize,
        isResizable: app.isResizable ?? true,
        isClosable: app.isClosable ?? true,
        icon: app.icon,
        appId: app.id,
      });
    }
  },
}));
