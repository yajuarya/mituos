'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useWindowStore } from '@/stores/window/windowStore';
import { motion } from 'framer-motion';
import { 
  Save, 
  FileText, 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Search,
  Replace,
  Download,
  Upload
} from 'lucide-react';

/**
 * Props interface for the Notepad component
 * @interface NotepadProps
 * @property windowId - The unique identifier of the window containing the notepad
 */
interface NotepadProps {
  windowId: string;
}

/**
 * Notepad component that provides a rich text editing interface
 * Features text editing, search/replace, formatting options, and file operations
 * @param windowId - The unique identifier of the window containing this notepad
 * @returns JSX element representing the notepad application
 */
export const Notepad: React.FC<NotepadProps> = ({ windowId }) => {
  const windowStore = useWindowStore();
  const [content, setContent] = useState('Welcome to MituOS Notepad!\n\nStart typing your notes here...');
  const [fileName, setFileName] = useState('Untitled.txt');
  const [isModified, setIsModified] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [showSearchReplace, setShowSearchReplace] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('monospace');
  const [wordWrap, setWordWrap] = useState(true);
  const [lineNumbers, setLineNumbers] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'f':
            e.preventDefault();
            setShowSearchReplace(!showSearchReplace);
            break;
          case 'o':
            e.preventDefault();
            handleOpen();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearchReplace]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsModified(true);
    
    // Update window title when content changes
    const newTitle = e.target.value.trim() 
      ? `Notepad - ${e.target.value.substring(0, 20)}${e.target.value.length > 20 ? '...' : ''}${isModified ? '*' : ''}`
      : `Notepad${isModified ? '*' : ''}`;
    windowStore.updateWindow(windowId, { title: newTitle });
  };

  const handleSave = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsModified(false);
  };

  const handleOpen = () => {
    fileInputRef.current?.click();
  };

  const handleFileLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setContent(text);
        setFileName(file.name);
        setIsModified(false);
      };
      reader.readAsText(file);
    }
  };

  const handleSearch = () => {
    if (!searchTerm || !textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const text = textarea.value;
    const index = text.toLowerCase().indexOf(searchTerm.toLowerCase());
    
    if (index !== -1) {
      textarea.focus();
      textarea.setSelectionRange(index, index + searchTerm.length);
    }
  };

  const handleReplace = () => {
    if (!searchTerm || !textareaRef.current) return;
    
    const newContent = content.replace(new RegExp(searchTerm, 'gi'), replaceTerm);
    setContent(newContent);
    setIsModified(true);
  };

  const handleReplaceAll = () => {
    if (!searchTerm) return;
    
    const newContent = content.replace(new RegExp(searchTerm, 'gi'), replaceTerm);
    setContent(newContent);
    setIsModified(true);
  };

  const insertText = (text: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + text + content.substring(end);
    
    setContent(newContent);
    setIsModified(true);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const getLineNumbers = () => {
    const lines = content.split('\n');
    return lines.map((_, index) => index + 1).join('\n');
  };

  const getStats = () => {
    const lines = content.split('\n').length;
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const characters = content.length;
    const charactersNoSpaces = content.replace(/\s/g, '').length;
    
    return { lines, words, characters, charactersNoSpaces };
  };

  const stats = getStats();

  const ToolbarButton: React.FC<{
    onClick: () => void;
    children: React.ReactNode;
    title: string;
    active?: boolean;
  }> = ({ onClick, children, title, active = false }) => (
    <motion.button
      className={`
        p-2 rounded-lg transition-all duration-200
        ${active 
          ? 'bg-blue-600 text-white' 
          : 'text-white hover:bg-white/10'
        }
      `}
      onClick={onClick}
      title={title}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 to-black">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.js,.ts,.json,.css,.html"
        onChange={handleFileLoad}
        className="hidden"
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-black/30 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <ToolbarButton onClick={handleSave} title="Save (Ctrl+S)">
            <Save size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={handleOpen} title="Open (Ctrl+O)">
            <Upload size={18} />
          </ToolbarButton>
          <div className="w-px h-6 bg-white/20 mx-2" />
          <ToolbarButton 
            onClick={() => insertText('**bold text**')} 
            title="Bold"
          >
            <Bold size={18} />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => insertText('*italic text*')} 
            title="Italic"
          >
            <Italic size={18} />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => insertText('__underline text__')} 
            title="Underline"
          >
            <Underline size={18} />
          </ToolbarButton>
          <div className="w-px h-6 bg-white/20 mx-2" />
          <ToolbarButton 
            onClick={() => setShowSearchReplace(!showSearchReplace)} 
            title="Search & Replace (Ctrl+F)"
            active={showSearchReplace}
          >
            <Search size={18} />
          </ToolbarButton>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="bg-black/50 text-white text-sm rounded px-2 py-1 border border-white/20"
          >
            <option value="monospace">Monospace</option>
            <option value="serif">Serif</option>
            <option value="sans-serif">Sans Serif</option>
          </select>
          
          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="bg-black/50 text-white text-sm rounded px-2 py-1 border border-white/20"
          >
            <option value={12}>12px</option>
            <option value={14}>14px</option>
            <option value={16}>16px</option>
            <option value={18}>18px</option>
            <option value={20}>20px</option>
          </select>

          <ToolbarButton 
            onClick={() => setWordWrap(!wordWrap)} 
            title="Toggle Word Wrap"
            active={wordWrap}
          >
            <AlignLeft size={18} />
          </ToolbarButton>

          <ToolbarButton 
            onClick={() => setLineNumbers(!lineNumbers)} 
            title="Toggle Line Numbers"
            active={lineNumbers}
          >
            <FileText size={18} />
          </ToolbarButton>
        </div>
      </div>

      {/* Search & Replace Panel */}
      {showSearchReplace && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-black/20 border-b border-white/10 p-3"
        >
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black/50 text-white text-sm rounded px-3 py-1 border border-white/20 outline-none focus:border-blue-400"
              />
              <input
                type="text"
                placeholder="Replace..."
                value={replaceTerm}
                onChange={(e) => setReplaceTerm(e.target.value)}
                className="bg-black/50 text-white text-sm rounded px-3 py-1 border border-white/20 outline-none focus:border-blue-400"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition-colors"
              >
                Find
              </button>
              <button
                onClick={handleReplace}
                className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded transition-colors"
              >
                Replace
              </button>
              <button
                onClick={handleReplaceAll}
                className="bg-orange-600 hover:bg-orange-700 text-white text-sm px-3 py-1 rounded transition-colors"
              >
                Replace All
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {lineNumbers && (
          <div className="bg-black/30 border-r border-white/10 p-3 min-w-[60px]">
            <pre
              className="text-white/50 text-sm leading-6 text-right"
              style={{ fontFamily, fontSize: `${fontSize}px` }}
            >
              {getLineNumbers()}
            </pre>
          </div>
        )}
        
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            className="w-full h-full p-4 bg-transparent text-white resize-none outline-none"
            style={{
              fontFamily,
              fontSize: `${fontSize}px`,
              lineHeight: 1.5,
              whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
              wordWrap: wordWrap ? 'break-word' : 'normal',
              overflowWrap: wordWrap ? 'break-word' : 'normal'
            }}
            placeholder="Start typing..."
            spellCheck={false}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/30 border-t border-white/10 text-xs text-white/70">
        <div className="flex items-center space-x-4">
          <span>{fileName}{isModified ? ' *' : ''}</span>
          <span>Lines: {stats.lines}</span>
          <span>Words: {stats.words}</span>
          <span>Characters: {stats.characters}</span>
          <span>No Spaces: {stats.charactersNoSpaces}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>{fontFamily}</span>
          <span>{fontSize}px</span>
          <span>{wordWrap ? 'Wrap' : 'No Wrap'}</span>
        </div>
      </div>
    </div>
  );
};
