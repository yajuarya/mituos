'use client';

/**
 * Window Component - Individual Application Window
 * 
 * This component represents a single application window within the MituOS desktop environment.
 * It provides a complete windowing system with standard window controls, drag functionality,
 * resize capabilities, and state management for minimize/maximize/restore operations.
 * 
 * Key Features:
 * - Draggable window with smooth animations
 * - Resizable borders and corners
 * - Standard window controls (minimize, maximize, restore, close)
 * - Focus management and z-index layering
 * - Snap-to-edge functionality
 * - Window state persistence
 * 
 * Window Controls:
 * - Close (X): Terminates the application window
 * - Minimize (-): Hides window to taskbar
 * - Maximize/Restore (□/⧉): Toggles fullscreen state
 * - Drag: Move window by clicking and dragging title bar
 * 
 * Technical Implementation:
 * - Uses Framer Motion for smooth animations and drag interactions
 * - Integrates with Zustand window store for state management
 * - Implements custom resize logic with boundary constraints
 * - Handles focus events for proper window layering
 * 
 * @component
 * @example
 * ```tsx
 * <Window window={windowState} />
 * ```
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Square, RotateCcw, Maximize2 } from 'lucide-react';
import { useWindowStore } from '@/stores/window/windowStore';
import { WindowState } from '@/types';

/**
 * Props interface for the Window component
 * 
 * @interface WindowProps
 * @property {WindowState} window - Complete window state object containing position, size, and status
 * @property {React.ReactNode} children - Application content to render inside the window body
 */
interface WindowProps {
  window: WindowState;
  children: React.ReactNode;
}

/**
 * Main Window Component Function
 * 
 * Renders an individual application window with full windowing capabilities.
 * Manages drag operations, resize functionality, and window state transitions.
 * 
 * Component State:
 * - isDragging: Tracks if window is currently being dragged
 * - isResizing: Tracks if window is currently being resized
 * - resizeDirection: Stores which edge/corner is being used for resizing
 * 
 * Refs:
 * - windowRef: Reference to the main window container for drag calculations
 * - headerRef: Reference to the title bar for drag handle functionality
 * 
 * Store Integration:
 * - Uses window store methods for close, minimize, maximize, restore, focus operations
 * - Updates window position and size through store actions
 */
export const Window: React.FC<WindowProps> = ({ window, children }) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');

  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    updateWindow
  } = useWindowStore();

  const handleClose = () => {
    closeWindow(window.id);
  };

  const handleMinimize = () => {
    minimizeWindow(window.id);
  };

  const handleMaximize = () => {
    if (window.isMaximized) {
      restoreWindow(window.id);
    } else {
      maximizeWindow(window.id);
    }
  };

  const handleFocus = () => {
    focusWindow(window.id);
  };

  // Dragging functionality
  useEffect(() => {
    if (!isDragging || window.isMaximized) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (windowRef.current) {
        const newX = e.clientX - (window.size.width / 2);
        const newY = Math.max(0, e.clientY - 20);
        
        updateWindow(window.id, {
          x: Math.max(0, Math.min(newX, window.innerWidth - window.size.width)),
          y: Math.max(0, Math.min(newY, window.innerHeight - window.size.height))
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, window, updateWindow]);

  // Resizing functionality
  useEffect(() => {
    if (!isResizing || window.isMaximized) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (windowRef.current) {
        const rect = windowRef.current.getBoundingClientRect();
        let newWidth = window.size.width;
        let newHeight = window.size.height;
        let newX = window.position.x;
        let newY = window.position.y;

        if (resizeDirection.includes('right')) {
          newWidth = Math.max(300, e.clientX - rect.left);
        }
        if (resizeDirection.includes('left')) {
          const deltaX = e.clientX - rect.left;
          newWidth = Math.max(300, window.size.width - deltaX);
          newX = window.position.x + deltaX;
        }
        if (resizeDirection.includes('bottom')) {
          newHeight = Math.max(200, e.clientY - rect.top);
        }
        if (resizeDirection.includes('top')) {
          const deltaY = e.clientY - rect.top;
          newHeight = Math.max(200, window.size.height - deltaY);
          newY = window.position.y + deltaY;
        }

        updateWindow(window.id, {
          width: newWidth,
          height: newHeight,
          x: newX,
          y: newY
        });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeDirection('');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeDirection, window, updateWindow]);

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if (e.target === headerRef.current || headerRef.current?.contains(e.target as Node)) {
      setIsDragging(true);
      handleFocus();
    }
  };

  const handleResizeStart = (direction: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    handleFocus();
  };

  if (window.isMinimized) {
    return null;
  }

  const windowStyle = window.isMaximized
    ? {
        x: 0,
        y: 0,
        width: '100vw',
        height: 'calc(100vh - 48px)', // Account for taskbar
      }
    : {
        x: window.position.x,
        y: window.position.y,
        width: window.size.width,
        height: window.size.height,
      };

  return (
    <motion.div
      ref={windowRef}
      data-testid={`window-${window.appId}`}
      className={`
        fixed bg-black/95 backdrop-blur-md rounded-lg border border-white/20 
        shadow-2xl overflow-hidden flex flex-col
        ${window.isFocused ? 'z-30' : 'z-20'}
      `}
      style={windowStyle}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      onClick={handleFocus}
    >
      {/* Window Header */}
      <div
        ref={headerRef}
        className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-white/10 cursor-move select-none"
        data-testid="window-title-bar"
        onMouseDown={handleHeaderMouseDown}
        onDoubleClick={handleMaximize}
      >
        <div className="flex items-center space-x-3">
          {window.icon && (
            <span className="text-lg">{window.icon}</span>
          )}
          <h3 className="text-white font-medium text-sm" data-testid="window-title">{window.title}</h3>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handleMinimize}
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
            data-testid="minimize-button"
            title="Minimize"
          >
            <Minus size={14} className="text-white" />
          </button>
          <button
            onClick={handleMaximize}
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
            data-testid="maximize-button"
            title={window.isMaximized ? "Restore" : "Maximize"}
          >
            {window.isMaximized ? (
              <RotateCcw size={14} className="text-white" />
            ) : (
              <Maximize2 size={14} className="text-white" />
            )}
          </button>
          <button
            onClick={handleClose}
            className="p-1.5 rounded hover:bg-red-500/20 transition-colors"
            title="Close"
            data-testid="close-button"
          >
            <X size={14} className="text-white" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>

      {/* Resize Handles */}
      {!window.isMaximized && (
        <>
          {/* Corner handles */}
          <div
            className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize"
            onMouseDown={handleResizeStart('top-left')}
          />
          <div
            className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize"
            onMouseDown={handleResizeStart('top-right')}
          />
          <div
            className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize"
            onMouseDown={handleResizeStart('bottom-left')}
          />
          <div
            className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize"
            onMouseDown={handleResizeStart('bottom-right')}
          />

          {/* Edge handles */}
          <div
            className="absolute top-0 left-2 right-2 h-1 cursor-n-resize"
            onMouseDown={handleResizeStart('top')}
          />
          <div
            className="absolute bottom-0 left-2 right-2 h-1 cursor-s-resize"
            onMouseDown={handleResizeStart('bottom')}
          />
          <div
            className="absolute left-0 top-2 bottom-2 w-1 cursor-w-resize"
            onMouseDown={handleResizeStart('left')}
          />
          <div
            className="absolute right-0 top-2 bottom-2 w-1 cursor-e-resize"
            onMouseDown={handleResizeStart('right')}
          />
        </>
      )}
    </motion.div>
  );
};
