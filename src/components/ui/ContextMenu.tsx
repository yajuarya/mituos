'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ContextMenuItem {
  label: string;
  action: () => void;
  icon?: string;
  disabled?: boolean;
  separator?: boolean;
}

interface ContextMenuProps {
  position: { x: number; y: number };
  items: ContextMenuItem[];
  onClose: () => void;
}

/**
 * ContextMenu component that displays a contextual menu at a specified position
 * Handles click-outside behavior and keyboard navigation for menu items
 * @param position - The x,y coordinates where the menu should appear
 * @param items - Array of menu items with labels, actions, and optional separators
 * @param onClose - Callback function to close the context menu
 * @returns JSX element representing the context menu
 */
export const ContextMenu: React.FC<ContextMenuProps> = ({
  position,
  items,
  onClose
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Adjust position to keep menu within viewport
  const adjustedPosition = React.useMemo(() => {
    if (!menuRef.current) return position;

    const rect = menuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let { x, y } = position;

    // Adjust horizontal position
    if (x + rect.width > viewportWidth) {
      x = viewportWidth - rect.width - 10;
    }

    // Adjust vertical position
    if (y + rect.height > viewportHeight) {
      y = viewportHeight - rect.height - 10;
    }

    return { x: Math.max(10, x), y: Math.max(10, y) };
  }, [position]);

  const handleItemClick = (item: ContextMenuItem) => {
    if (!item.disabled) {
      item.action();
      onClose();
    }
  };

  return (
    <motion.div
      ref={menuRef}
      className="fixed z-50 bg-black/90 backdrop-blur-md rounded-lg border border-white/20 shadow-2xl py-2 min-w-48"
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
      }}
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.15 }}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.separator ? (
            <div className="h-px bg-white/10 my-1 mx-2" />
          ) : (
            <motion.button
              className={`
                w-full flex items-center px-3 py-2 text-left transition-colors
                ${item.disabled 
                  ? 'text-white/40 cursor-not-allowed' 
                  : 'text-white hover:bg-white/10 cursor-pointer'
                }
              `}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              whileHover={!item.disabled ? { backgroundColor: 'rgba(255, 255, 255, 0.1)' } : {}}
              whileTap={!item.disabled ? { scale: 0.98 } : {}}
            >
              {item.icon && (
                <span className="mr-3 text-sm">{item.icon}</span>
              )}
              <span className="text-sm font-medium">{item.label}</span>
            </motion.button>
          )}
        </React.Fragment>
      ))}
    </motion.div>
  );
};
