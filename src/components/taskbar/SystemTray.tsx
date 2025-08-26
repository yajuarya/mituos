'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SystemStats {
  battery: number;
  wifi: boolean;
  volume: number;
  notifications: number;
}

export const SystemTray: React.FC = () => {
  const [stats, setStats] = useState<SystemStats>({
    battery: 85,
    wifi: true,
    volume: 70,
    notifications: 3
  });

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Simulate system stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        battery: Math.max(0, prev.battery - Math.random() * 0.1),
        notifications: Math.floor(Math.random() * 5)
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getBatteryIcon = (level: number) => {
    if (level > 75) return '🔋';
    if (level > 50) return '🔋';
    if (level > 25) return '🪫';
    return '🪫';
  };

  const getWifiIcon = (connected: boolean) => {
    return connected ? '📶' : '📵';
  };

  const getVolumeIcon = (level: number) => {
    if (level === 0) return '🔇';
    if (level < 50) return '🔉';
    return '🔊';
  };

  const handleVolumeChange = (newVolume: number) => {
    setStats(prev => ({ ...prev, volume: newVolume }));
  };

  return (
    <div className="flex items-center space-x-2 relative">
      {/* Notifications */}
      <motion.button
        className="relative p-1 rounded hover:bg-white/10 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={`${stats.notifications} notifications`}
      >
        <span className="text-white text-sm">🔔</span>
        {stats.notifications > 0 && (
          <motion.span
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {stats.notifications}
          </motion.span>
        )}
      </motion.button>

      {/* Volume */}
      <div className="relative">
        <motion.button
          className="p-1 rounded hover:bg-white/10 transition-colors"
          onClick={() => setShowVolumeSlider(!showVolumeSlider)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={`Volume: ${stats.volume}%`}
        >
          <span className="text-white text-sm">{getVolumeIcon(stats.volume)}</span>
        </motion.button>

        {/* Volume Slider */}
        {showVolumeSlider && (
          <motion.div
            className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-md rounded-lg p-3 border border-white/20 shadow-xl"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-32">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-xs">Volume</span>
                <span className="text-white text-xs">{stats.volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={stats.volume}
                onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${stats.volume}%, rgba(255,255,255,0.2) ${stats.volume}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* WiFi */}
      <motion.button
        className="p-1 rounded hover:bg-white/10 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={stats.wifi ? 'WiFi Connected' : 'WiFi Disconnected'}
        onClick={() => setStats(prev => ({ ...prev, wifi: !prev.wifi }))}
      >
        <span className={`text-sm ${stats.wifi ? 'text-white' : 'text-red-400'}`}>
          {getWifiIcon(stats.wifi)}
        </span>
      </motion.button>

      {/* Battery */}
      <motion.button
        className="p-1 rounded hover:bg-white/10 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={`Battery: ${Math.round(stats.battery)}%`}
      >
        <div className="flex items-center space-x-1">
          <span className={`text-sm ${stats.battery < 20 ? 'text-red-400' : 'text-white'}`}>
            {getBatteryIcon(stats.battery)}
          </span>
          <span className={`text-xs ${stats.battery < 20 ? 'text-red-400' : 'text-white/80'}`}>
            {Math.round(stats.battery)}%
          </span>
        </div>
      </motion.button>

      {/* Action Center */}
      <motion.button
        className="p-1 rounded hover:bg-white/10 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Action Center"
      >
        <span className="text-white text-sm">💬</span>
      </motion.button>
    </div>
  );
};
