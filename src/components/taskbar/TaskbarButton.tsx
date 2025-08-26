'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { WindowState, AppDefinition } from '@/types';

interface TaskbarButtonProps {
  window: WindowState;
  app?: AppDefinition;
  onClick: () => void;
  isActive: boolean;
}

export const TaskbarButton: React.FC<TaskbarButtonProps> = ({
  window,
  app,
  onClick,
  isActive
}) => {
  return (
    <motion.button
      className={`
        flex items-center space-x-2 px-3 py-1 rounded min-w-0 max-w-48 h-8
        transition-all duration-200 border
        ${isActive 
          ? 'bg-white/20 border-white/30 shadow-md' 
          : 'bg-white/5 border-white/10 hover:bg-white/10'
        }
        ${window.isMinimized ? 'opacity-60' : 'opacity-100'}
      `}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      title={window.title}
    >
      {/* App Icon */}
      {app && (
        <span className="text-sm flex-shrink-0">
          {app.icon}
        </span>
      )}
      
      {/* Window Title */}
      <span className="text-white text-sm font-medium truncate min-w-0">
        {window.title}
      </span>

      {/* Active Indicator */}
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-blue-400 rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Minimized Indicator */}
      {window.isMinimized && (
        <motion.div
          className="absolute top-1 right-1 w-1.5 h-1.5 bg-yellow-400 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.button>
  );
};
