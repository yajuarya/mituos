'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Folder, 
  File, 
  Home, 
  ArrowLeft, 
  ArrowRight, 
  RefreshCw,
  Grid,
  List,
  Search,
  Plus,
  Upload
} from 'lucide-react';
import { FileSystemItem } from '@/types';

/**
 * Props interface for the FileManager component
 * @interface FileManagerProps
 * @property windowId - The unique identifier of the window containing the file manager
 */
interface FileManagerProps {
  windowId: string;
}

/**
 * FileManager component that provides a file system browser interface
 * Features navigation, search, view modes, and file operations simulation
 * @param windowId - The unique identifier of the window containing this file manager
 * @returns JSX element representing the file manager application
 */
export const FileManager: React.FC<FileManagerProps> = ({ windowId }) => {
  const [currentPath, setCurrentPath] = useState('/');
  const [items, setItems] = useState<FileSystemItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState<string[]>(['/']);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Mock file system data
  const mockFileSystem: Record<string, FileSystemItem[]> = {
    '/': [
      { name: 'Documents', type: 'folder', size: 0, modified: new Date('2024-01-15') },
      { name: 'Pictures', type: 'folder', size: 0, modified: new Date('2024-01-10') },
      { name: 'Music', type: 'folder', size: 0, modified: new Date('2024-01-08') },
      { name: 'Videos', type: 'folder', size: 0, modified: new Date('2024-01-05') },
      { name: 'Downloads', type: 'folder', size: 0, modified: new Date('2024-01-20') },
      { name: 'readme.txt', type: 'file', size: 1024, modified: new Date('2024-01-12') },
    ],
    '/Documents': [
      { name: 'Projects', type: 'folder', size: 0, modified: new Date('2024-01-14') },
      { name: 'Notes', type: 'folder', size: 0, modified: new Date('2024-01-13') },
      { name: 'report.pdf', type: 'file', size: 2048576, modified: new Date('2024-01-15') },
      { name: 'presentation.pptx', type: 'file', size: 5242880, modified: new Date('2024-01-14') },
    ],
    '/Pictures': [
      { name: 'Vacation', type: 'folder', size: 0, modified: new Date('2024-01-09') },
      { name: 'Screenshots', type: 'folder', size: 0, modified: new Date('2024-01-10') },
      { name: 'photo1.jpg', type: 'file', size: 3145728, modified: new Date('2024-01-08') },
      { name: 'photo2.png', type: 'file', size: 1572864, modified: new Date('2024-01-07') },
    ],
    '/Music': [
      { name: 'Playlists', type: 'folder', size: 0, modified: new Date('2024-01-06') },
      { name: 'song1.mp3', type: 'file', size: 4194304, modified: new Date('2024-01-08') },
      { name: 'song2.mp3', type: 'file', size: 3670016, modified: new Date('2024-01-07') },
    ],
  };

  useEffect(() => {
    loadDirectory(currentPath);
  }, [currentPath]);

  const loadDirectory = (path: string) => {
    const directoryItems = mockFileSystem[path] || [];
    setItems(directoryItems);
    setSelectedItems(new Set());
  };

  const navigateTo = (path: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(path);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  };

  const goHome = () => {
    navigateTo('/');
  };

  const handleItemClick = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      const newPath = currentPath === '/' ? `/${item.name}` : `${currentPath}/${item.name}`;
      navigateTo(newPath);
    }
  };

  const handleItemSelect = (itemName: string, isCtrlClick: boolean = false) => {
    if (isCtrlClick) {
      const newSelected = new Set(selectedItems);
      if (newSelected.has(itemName)) {
        newSelected.delete(itemName);
      } else {
        newSelected.add(itemName);
      }
      setSelectedItems(newSelected);
    } else {
      setSelectedItems(new Set([itemName]));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '-';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ToolbarButton: React.FC<{
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }> = ({ onClick, disabled = false, children, title }) => (
    <motion.button
      className={`
        p-2 rounded-lg transition-all duration-200
        ${disabled 
          ? 'text-white/30 cursor-not-allowed' 
          : 'text-white hover:bg-white/10'
        }
      `}
      onClick={onClick}
      disabled={disabled}
      title={title}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {children}
    </motion.button>
  );

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 to-black">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-black/30 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <ToolbarButton
            onClick={goBack}
            disabled={historyIndex <= 0}
            title="Back"
          >
            <ArrowLeft size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
            title="Forward"
          >
            <ArrowRight size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={goHome}
            title="Home"
          >
            <Home size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => loadDirectory(currentPath)}
            title="Refresh"
          >
            <RefreshCw size={18} />
          </ToolbarButton>
        </div>

        <div className="flex items-center space-x-2">
          <ToolbarButton
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
          >
            {viewMode === 'grid' ? <List size={18} /> : <Grid size={18} />}
          </ToolbarButton>
        </div>
      </div>

      {/* Address Bar & Search */}
      <div className="flex items-center space-x-3 p-3 bg-black/20 border-b border-white/10">
        <div className="flex-1 flex items-center bg-black/50 rounded-lg px-3 py-2 border border-white/20">
          <Folder size={16} className="text-blue-400 mr-2" />
          <span className="text-white text-sm font-mono">{currentPath}</span>
        </div>
        <div className="flex items-center bg-black/50 rounded-lg px-3 py-2 border border-white/20">
          <Search size={16} className="text-white/50 mr-2" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-white text-sm outline-none placeholder-white/50"
          />
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-auto p-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <motion.div
                key={item.name}
                className={`
                  p-3 rounded-lg cursor-pointer transition-all duration-200
                  ${selectedItems.has(item.name) 
                    ? 'bg-blue-600/30 border border-blue-400' 
                    : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  }
                `}
                onClick={() => handleItemClick(item)}
                onMouseDown={(e) => handleItemSelect(item.name, e.ctrlKey || e.metaKey)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="text-4xl mb-2">
                    {item.type === 'folder' ? (
                      <Folder className="text-blue-400" />
                    ) : (
                      <File className="text-white/70" />
                    )}
                  </div>
                  <div className="text-white text-sm font-medium truncate w-full">
                    {item.name}
                  </div>
                  <div className="text-white/50 text-xs mt-1">
                    {formatFileSize(item.size)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredItems.map((item) => (
              <motion.div
                key={item.name}
                className={`
                  flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200
                  ${selectedItems.has(item.name) 
                    ? 'bg-blue-600/30 border border-blue-400' 
                    : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  }
                `}
                onClick={() => handleItemClick(item)}
                onMouseDown={(e) => handleItemSelect(item.name, e.ctrlKey || e.metaKey)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="mr-3">
                  {item.type === 'folder' ? (
                    <Folder size={20} className="text-blue-400" />
                  ) : (
                    <File size={20} className="text-white/70" />
                  )}
                </div>
                <div className="flex-1 text-white font-medium">
                  {item.name}
                </div>
                <div className="text-white/50 text-sm w-20 text-right">
                  {formatFileSize(item.size)}
                </div>
                <div className="text-white/50 text-sm w-40 text-right ml-4">
                  {formatDate(item.modified)}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-white/50">
            <Folder size={64} className="mb-4" />
            <p className="text-lg">No files found</p>
            <p className="text-sm">This folder is empty or no files match your search</p>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/30 border-t border-white/10 text-xs text-white/70">
        <div>
          {filteredItems.length} items | {selectedItems.size} selected
        </div>
        <div>
          {currentPath}
        </div>
      </div>
    </div>
  );
};
