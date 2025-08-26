/**
 * MituOS Type Definitions
 * 
 * This file contains all the TypeScript interfaces that define the data structures
 * used throughout the MituOS operating system simulation. Understanding these types
 * is crucial for learning how modern operating systems manage windows, applications,
 * and system resources.
 * 
 * Educational Note: In real operating systems, similar data structures are used
 * to track processes, windows, and system state, though they're typically implemented
 * in lower-level languages like C or C++.
 */

/**
 * WindowState Interface
 * 
 * Represents a single window in the operating system. In real OS development,
 * this would be similar to a "window handle" or "window descriptor" that the
 * window manager uses to track and manipulate windows.
 * 
 * Key OS Concepts Demonstrated:
 * - Window Management: How the OS tracks multiple application windows
 * - Z-ordering: Layer management for overlapping windows
 * - Window Properties: Size, position, and behavioral flags
 * 
 * @interface WindowState
 */
export interface WindowState {
  /** Unique identifier for this window - similar to process IDs in real OS */
  id: string;
  
  /** Window title displayed in the title bar */
  title: string;
  
  /** React component that renders the window content */
  component: React.ComponentType<any>;
  
  /** Whether the window is minimized (hidden but still running) */
  isMinimized: boolean;
  
  /** Whether the window is maximized (full screen) */
  isMaximized: boolean;
  
  /** Current position of the window on screen (x, y coordinates) */
  position: { x: number; y: number };
  
  /** Current dimensions of the window */
  size: { width: number; height: number };
  
  /** Z-index for layering - higher numbers appear on top */
  zIndex: number;
  
  /** Whether user can resize this window */
  isResizable: boolean;
  
  /** Whether user can close this window */
  isClosable: boolean;
  
  /** Optional icon displayed in window title bar and taskbar */
  icon?: string;
  
  /** Reference to the application that owns this window */
  appId: string;
}

/**
 * AppDefinition Interface
 * 
 * Defines the properties and behavior of an application in MituOS.
 * This is similar to how real operating systems maintain application metadata
 * and launch parameters.
 * 
 * Key OS Concepts Demonstrated:
 * - Application Registry: How OS knows about available programs
 * - Resource Constraints: Min/max sizes prevent apps from breaking the UI
 * - Application Categories: Organization similar to real OS app stores
 * 
 * @interface AppDefinition
 */
export interface AppDefinition {
  /** Unique application identifier */
  id: string;
  
  /** Human-readable application name */
  name: string;
  
  /** Icon representation (emoji or image path) */
  icon: string;
  
  /** React component that implements the application */
  component: React.ComponentType<any>;
  
  /** Default window size when application launches */
  defaultSize: { width: number; height: number };
  
  /** Minimum allowed window size (prevents unusable tiny windows) */
  minSize?: { width: number; height: number };
  
  /** Maximum allowed window size (prevents resource hogging) */
  maxSize?: { width: number; height: number };
  
  /** Whether this application's windows can be resized */
  isResizable?: boolean;
  
  /** Whether this application's windows can be closed */
  isClosable?: boolean;
  
  /** Application category for organization in menus */
  category: 'system' | 'utility' | 'productivity' | 'entertainment';
}

/**
 * DesktopState Interface
 * 
 * Manages the desktop environment settings. Real operating systems
 * store similar preferences in registry files or configuration databases.
 * 
 * Key OS Concepts Demonstrated:
 * - User Preferences: How OS remembers user customizations
 * - Theme Management: System-wide appearance settings
 * - Desktop Management: Control over desktop behavior
 * 
 * @interface DesktopState
 */
export interface DesktopState {
  /** Background image URL or path */
  wallpaper: string;
  
  /** System-wide color theme */
  theme: 'light' | 'dark';
  
  /** Whether to display desktop shortcut icons */
  showDesktopIcons: boolean;
  
  /** Size of desktop icons */
  iconSize: 'small' | 'medium' | 'large';
}

/**
 * SystemStats Interface
 * 
 * Represents system performance metrics. Real operating systems
 * continuously monitor these values to manage resources effectively.
 * 
 * Key OS Concepts Demonstrated:
 * - Resource Monitoring: How OS tracks system performance
 * - Performance Metrics: Key indicators of system health
 * - System Uptime: Tracking how long the system has been running
 * 
 * @interface SystemStats
 */
export interface SystemStats {
  /** CPU usage percentage (0-100) */
  cpu: number;
  
  /** Memory usage percentage (0-100) */
  memory: number;
  
  /** Storage usage percentage (0-100) */
  storage: number;
  
  /** System uptime in milliseconds since boot */
  uptime: number;
}

/**
 * FileSystemItem Interface
 * 
 * Represents a file or folder in the virtual file system.
 * This mimics how real file systems organize and track files.
 * 
 * Key OS Concepts Demonstrated:
 * - File System Structure: Hierarchical organization of files
 * - File Metadata: Information stored about each file
 * - Tree Structure: Parent-child relationships in directories
 * 
 * @interface FileSystemItem
 */
export interface FileSystemItem {
  /** Unique identifier for this file/folder */
  id: string;
  
  /** Display name of the file/folder */
  name: string;
  
  /** Whether this is a file or directory */
  type: 'file' | 'folder';
  
  /** File size in bytes (undefined for folders) */
  size?: number;
  
  /** Last modification timestamp */
  modified: Date;
  
  /** Full path to this item in the file system */
  path: string;
  
  /** Parent directory ID (undefined for root) */
  parent?: string;
  
  /** Child items (only for folders) */
  children?: FileSystemItem[];
}

/**
 * NotificationItem Interface
 * 
 * Represents a system notification. Modern operating systems use
 * similar structures for their notification systems.
 * 
 * Key OS Concepts Demonstrated:
 * - Inter-Process Communication: How system components notify users
 * - Message Queuing: Managing multiple notifications
 * - User Interface Feedback: Informing users of system events
 * 
 * @interface NotificationItem
 */
export interface NotificationItem {
  /** Unique notification identifier */
  id: string;
  
  /** Notification title/header */
  title: string;
  
  /** Detailed notification message */
  message: string;
  
  /** Notification severity level */
  type: 'info' | 'success' | 'warning' | 'error';
  
  /** When this notification was created */
  timestamp: Date;
  
  /** How long to display notification (ms), undefined = persistent */
  duration?: number;
}
