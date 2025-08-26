/**
 * Settings App Component
 * 
 * Provides a comprehensive settings interface for MituOS with multiple configuration sections
 * including display, personalization, sound, network, privacy, accounts, notifications, and system settings.
 * Features a sidebar navigation with detailed settings panels for each category.
 * 
 * @component Settings
 * @author MituOS Development Team
 * @version 1.0.0
 * @since 2024-01-20
 */
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Palette, 
  Volume2, 
  Wifi, 
  Shield, 
  User, 
  Bell,
  HardDrive,
  Cpu,
  Battery,
  Bluetooth,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Settings as SettingsIcon,
  ChevronRight,
  Check,
  X
} from 'lucide-react';
import { useDesktopStore } from '@/stores/desktop/desktopStore';

/**
 * Props interface for the Settings component
 * @interface SettingsProps
 * @property windowId - The unique identifier of the window containing the settings app
 */
interface SettingsProps {
  windowId: string;
}

/**
 * Interface defining the structure of a settings section
 * @interface SettingSection
 * @property id - Unique identifier for the settings section
 * @property title - Display title of the settings section
 * @property icon - React icon component to display alongside the title
 * @property description - Brief description of what the section contains
 */
interface SettingSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

/**
 * Main Settings component that renders a comprehensive settings interface
 * Provides multiple configuration sections with sidebar navigation and detailed settings panels
 * @param windowId - The unique identifier of the window containing this settings app
 * @returns JSX element containing the complete settings interface
 */
export const Settings: React.FC<SettingsProps> = ({ windowId }) => {
  const { theme, setTheme, wallpaper, setWallpaper, desktopIconsVisible, toggleDesktopIcons } = useDesktopStore();
  const [activeSection, setActiveSection] = useState('display');
  const [volume, setVolume] = useState(75);
  const [brightness, setBrightness] = useState(80);
  const [notifications, setNotifications] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [darkMode, setDarkMode] = useState(theme === 'dark');

  const sections: SettingSection[] = [
    {
      id: 'display',
      title: 'Display',
      icon: <Monitor size={20} />,
      description: 'Screen resolution, brightness, and appearance'
    },
    {
      id: 'personalization',
      title: 'Personalization',
      icon: <Palette size={20} />,
      description: 'Themes, wallpapers, and desktop customization'
    },
    {
      id: 'sound',
      title: 'Sound',
      icon: <Volume2 size={20} />,
      description: 'Audio settings and sound preferences'
    },
    {
      id: 'network',
      title: 'Network',
      icon: <Wifi size={20} />,
      description: 'Wi-Fi, Ethernet, and internet settings'
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: <Shield size={20} />,
      description: 'Privacy settings and security options'
    },
    {
      id: 'accounts',
      title: 'Accounts',
      icon: <User size={20} />,
      description: 'User accounts and sign-in options'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell size={20} />,
      description: 'Notification preferences and settings'
    },
    {
      id: 'system',
      title: 'System',
      icon: <SettingsIcon size={20} />,
      description: 'System information and advanced settings'
    }
  ];

  const wallpapers = [
    { id: 'gradient1', name: 'Ocean Gradient', preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 'gradient2', name: 'Sunset Gradient', preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { id: 'gradient3', name: 'Forest Gradient', preview: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { id: 'gradient4', name: 'Purple Gradient', preview: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
    { id: 'gradient5', name: 'Dark Gradient', preview: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)' },
    { id: 'gradient6', name: 'Fire Gradient', preview: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' }
  ];

  /**
   * Handles theme change between light and dark modes
   * Updates both the global theme state and local dark mode state
   * @param newTheme - The theme to switch to ('light' or 'dark')
   */
  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    setDarkMode(newTheme === 'dark');
  };

  /**
   * Handles wallpaper selection and updates the desktop background
   * Finds the selected wallpaper by ID and applies its preview style
   * @param wallpaperId - The unique identifier of the wallpaper to apply
   */
  const handleWallpaperChange = (wallpaperId: string) => {
    const selectedWallpaper = wallpapers.find(w => w.id === wallpaperId);
    if (selectedWallpaper) {
      setWallpaper(selectedWallpaper.preview);
    }
  };

  /**
   * Reusable component for displaying individual setting items
   * Provides consistent layout with title, optional description, and controls
   */
  const SettingItem: React.FC<{
    /** The main title/label for the setting */
    title: string;
    /** Optional description text explaining the setting */
    description?: string;
    /** The control element (toggle, slider, etc.) for this setting */
    children: React.ReactNode;
  }> = ({ title, description, children }) => (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
      <div className="flex-1">
        <h3 className="text-white font-medium">{title}</h3>
        {description && (
          <p className="text-white/60 text-sm mt-1">{description}</p>
        )}
      </div>
      <div className="ml-4">
        {children}
      </div>
    </div>
  );

  /**
   * Custom toggle switch component with smooth animations
   * Provides a modern toggle interface for boolean settings
   */
  const Toggle: React.FC<{
    /** Current state of the toggle (true = on, false = off) */
    checked: boolean;
    /** Callback function triggered when toggle state changes */
    onChange: (checked: boolean) => void;
  }> = ({ checked, onChange }) => (
    <motion.button
      className={`
        relative w-12 h-6 rounded-full transition-colors duration-200
        ${checked ? 'bg-blue-600' : 'bg-white/20'}
      `}
      onClick={() => onChange(!checked)}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
        animate={{ x: checked ? 26 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );

  /**
   * Custom slider component for numeric value selection
   * Provides smooth interaction for adjusting settings like volume and brightness
   */
  const Slider: React.FC<{
    /** Current numeric value of the slider */
    value: number;
    /** Callback function triggered when slider value changes */
    onChange: (value: number) => void;
    /** Minimum allowed value (default: 0) */
    min?: number;
    /** Maximum allowed value (default: 100) */
    max?: number;
  }> = ({ value, onChange, min = 0, max = 100 }) => (
    <div className="w-32">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
      />
      <div className="text-white/60 text-xs text-center mt-1">{value}%</div>
    </div>
  );

  /**
   * Renders the content for the currently active settings section
   * Dynamically displays different setting panels based on user selection
   * @returns JSX element containing the appropriate settings interface
   */
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'display':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-6">Display Settings</h2>
            
            <SettingItem
              title="Brightness"
              description="Adjust screen brightness"
            >
              <Slider value={brightness} onChange={setBrightness} />
            </SettingItem>

            <SettingItem
              title="Dark Mode"
              description="Use dark theme across the system"
            >
              <Toggle checked={darkMode} onChange={handleThemeChange} />
            </SettingItem>

            <SettingItem
              title="Desktop Icons"
              description="Show or hide desktop icons"
            >
              <Toggle checked={desktopIconsVisible} onChange={toggleDesktopIcons} />
            </SettingItem>
          </div>
        );

      case 'personalization':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-6">Personalization</h2>
            
            <div className="bg-white/5 rounded-lg border border-white/10 p-4">
              <h3 className="text-white font-medium mb-4">Wallpaper</h3>
              <div className="grid grid-cols-3 gap-3">
                {wallpapers.map((wp) => (
                  <motion.div
                    key={wp.id}
                    className={`
                      relative h-20 rounded-lg cursor-pointer border-2 transition-all
                      ${wallpaper === wp.preview ? 'border-blue-400' : 'border-white/20'}
                    `}
                    style={{ background: wp.preview }}
                    onClick={() => handleWallpaperChange(wp.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {wallpaper === wp.preview && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check size={24} className="text-white drop-shadow-lg" />
                      </div>
                    )}
                    <div className="absolute bottom-1 left-1 right-1">
                      <div className="text-white text-xs font-medium drop-shadow-lg truncate">
                        {wp.name}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <SettingItem
              title="Theme"
              description="Choose between light and dark themes"
            >
              <div className="flex space-x-2">
                <motion.button
                  className={`
                    p-2 rounded-lg border transition-all
                    ${theme === 'light' 
                      ? 'bg-white text-black border-white' 
                      : 'bg-white/10 text-white border-white/20'
                    }
                  `}
                  onClick={() => handleThemeChange('light')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sun size={16} />
                </motion.button>
                <motion.button
                  className={`
                    p-2 rounded-lg border transition-all
                    ${theme === 'dark' 
                      ? 'bg-gray-800 text-white border-gray-600' 
                      : 'bg-white/10 text-white border-white/20'
                    }
                  `}
                  onClick={() => handleThemeChange('dark')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Moon size={16} />
                </motion.button>
              </div>
            </SettingItem>
          </div>
        );

      case 'sound':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-6">Sound Settings</h2>
            
            <SettingItem
              title="Master Volume"
              description="Adjust overall system volume"
            >
              <Slider value={volume} onChange={setVolume} />
            </SettingItem>

            <SettingItem
              title="System Sounds"
              description="Play sounds for system events"
            >
              <Toggle checked={true} onChange={() => {}} />
            </SettingItem>

            <SettingItem
              title="Notification Sounds"
              description="Play sounds for notifications"
            >
              <Toggle checked={true} onChange={() => {}} />
            </SettingItem>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-6">Notification Settings</h2>
            
            <SettingItem
              title="Show Notifications"
              description="Allow apps to show notifications"
            >
              <Toggle checked={notifications} onChange={setNotifications} />
            </SettingItem>

            <SettingItem
              title="Show on Lock Screen"
              description="Display notifications on lock screen"
            >
              <Toggle checked={true} onChange={() => {}} />
            </SettingItem>

            <SettingItem
              title="Play Sound"
              description="Play sound when notifications arrive"
            >
              <Toggle checked={true} onChange={() => {}} />
            </SettingItem>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-6">System Settings</h2>
            
            <SettingItem
              title="Automatic Updates"
              description="Install updates automatically"
            >
              <Toggle checked={autoUpdate} onChange={setAutoUpdate} />
            </SettingItem>

            <div className="bg-white/5 rounded-lg border border-white/10 p-4">
              <h3 className="text-white font-medium mb-4">System Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">OS Version:</span>
                  <span className="text-white">MituOS 1.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Build:</span>
                  <span className="text-white">2024.01.20</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Memory:</span>
                  <span className="text-white">8 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Storage:</span>
                  <span className="text-white">256 GB SSD</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-6">Coming Soon</h2>
            <p className="text-white/60">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex bg-gradient-to-br from-gray-900 to-black">
      {/* Sidebar */}
      <div className="w-80 bg-black/30 border-r border-white/10 p-4">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white flex items-center">
            <SettingsIcon size={24} className="mr-2" />
            Settings
          </h1>
        </div>

        <div className="space-y-2">
          {sections.map((section) => (
            <motion.button
              key={section.id}
              className={`
                w-full flex items-center p-3 rounded-lg text-left transition-all duration-200
                ${activeSection === section.id 
                  ? 'bg-blue-600/30 border border-blue-400 text-white' 
                  : 'bg-white/5 hover:bg-white/10 text-white/80 border border-transparent'
                }
              `}
              onClick={() => setActiveSection(section.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="mr-3">
                {section.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium">{section.title}</div>
                <div className="text-xs text-white/50 mt-1">{section.description}</div>
              </div>
              <ChevronRight size={16} className="text-white/40" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {renderSectionContent()}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};
