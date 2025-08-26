'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  FileText, 
  FolderOpen, 
  Settings, 
  Activity,
  Power,
  User,
  Search,
  Clock,
  Wifi,
  Volume2,
  Battery
} from 'lucide-react';
import { useAppStore } from '@/stores/app/appStore';
import { useDesktopStore } from '@/stores/desktop/desktopStore';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose }) => {
  const { apps, launchApp } = useAppStore();
  const { theme } = useDesktopStore();

  const handleAppLaunch = (appId: string) => {
    launchApp(appId);
    onClose();
  };

  const quickActions = [
    { icon: User, label: 'Profile', action: () => {} },
    { icon: Settings, label: 'Settings', action: () => handleAppLaunch('settings') },
    { icon: Power, label: 'Power', action: () => {} },
  ];

  const systemApps = [
    { id: 'calculator', icon: Calculator, name: 'Calculator', color: 'from-blue-500 to-blue-600' },
    { id: 'notepad', icon: FileText, name: 'Notepad', color: 'from-green-500 to-green-600' },
    { id: 'file-manager', icon: FolderOpen, name: 'File Manager', color: 'from-yellow-500 to-yellow-600' },
    { id: 'system-monitor', icon: Activity, name: 'System Monitor', color: 'from-red-500 to-red-600' },
    { id: 'settings', icon: Settings, name: 'Settings', color: 'from-gray-500 to-gray-600' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            onClick={onClose}
          />
          
          {/* Start Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-14 left-2 w-96 h-[600px] bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">User</h3>
                  <p className="text-white/60 text-sm">Administrator</p>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search apps, files, settings..."
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                />
              </div>
            </div>

            {/* Apps Grid */}
            <div className="p-6 flex-1 overflow-y-auto">
              <h4 className="text-white/80 text-sm font-medium mb-4 uppercase tracking-wide">Applications</h4>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {systemApps.map((app) => (
                  <motion.button
                    key={app.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAppLaunch(app.id)}
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${app.color} flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-200`}>
                      <app.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-white text-sm font-medium">{app.name}</p>
                  </motion.button>
                ))}
              </div>

              {/* Recent Files */}
              <h4 className="text-white/80 text-sm font-medium mb-4 uppercase tracking-wide">Recent</h4>
              <div className="space-y-2">
                {['Document.txt', 'Project Notes.md', 'Budget.xlsx'].map((file, index) => (
                  <motion.div
                    key={file}
                    whileHover={{ x: 4 }}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <FileText className="w-4 h-4 text-white/60" />
                    <span className="text-white/80 text-sm">{file}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-white/60">
                  <div className="flex items-center space-x-1">
                    <Wifi className="w-4 h-4" />
                    <span className="text-xs">Connected</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Volume2 className="w-4 h-4" />
                    <span className="text-xs">100%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Battery className="w-4 h-4" />
                    <span className="text-xs">85%</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={action.action}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                      title={action.label}
                    >
                      <action.icon className="w-4 h-4 text-white/80" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StartMenu;
