'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  HardDrive, 
  Activity, 
  Zap,
  Thermometer,
  Wifi,
  Download,
  Upload,
  MemoryStick,
  Monitor,
  RefreshCw,
  X,
  Minimize,
  Square
} from 'lucide-react';
import { SystemStats } from '@/types';

interface SystemMonitorProps {
  windowId: string;
}

interface ProcessInfo {
  id: number;
  name: string;
  cpu: number;
  memory: number;
  status: 'running' | 'sleeping' | 'stopped';
}

export const SystemMonitor: React.FC<SystemMonitorProps> = ({ windowId }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'processes' | 'performance' | 'network'>('overview');
  const [systemStats, setSystemStats] = useState<SystemStats>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: { download: 0, upload: 0 },
    temperature: 0,
    uptime: 0
  });
  
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);
  const [cpuHistory, setCpuHistory] = useState<number[]>([]);
  const [memoryHistory, setMemoryHistory] = useState<number[]>([]);
  const [networkHistory, setNetworkHistory] = useState<{ download: number; upload: number }[]>([]);

  // Mock system data generation
  useEffect(() => {
    const generateMockData = () => {
      const newStats: SystemStats = {
        cpu: Math.random() * 100,
        memory: 45 + Math.random() * 30,
        disk: 67 + Math.random() * 10,
        network: {
          download: Math.random() * 1000,
          upload: Math.random() * 500
        },
        temperature: 35 + Math.random() * 25,
        uptime: Date.now() / 1000 - Math.random() * 86400 * 7
      };

      setSystemStats(newStats);

      // Update history arrays
      setCpuHistory(prev => [...prev.slice(-29), newStats.cpu]);
      setMemoryHistory(prev => [...prev.slice(-29), newStats.memory]);
      setNetworkHistory(prev => [...prev.slice(-29), newStats.network]);

      // Generate mock processes
      const mockProcesses: ProcessInfo[] = [
        { id: 1, name: 'MituOS Desktop', cpu: 15.2, memory: 234.5, status: 'running' },
        { id: 2, name: 'File Manager', cpu: 2.1, memory: 89.3, status: 'running' },
        { id: 3, name: 'Notepad', cpu: 0.8, memory: 45.2, status: 'running' },
        { id: 4, name: 'Calculator', cpu: 0.1, memory: 23.1, status: 'sleeping' },
        { id: 5, name: 'System Monitor', cpu: 5.4, memory: 67.8, status: 'running' },
        { id: 6, name: 'Settings', cpu: 1.2, memory: 34.6, status: 'sleeping' },
        { id: 7, name: 'Audio Service', cpu: 0.5, memory: 12.3, status: 'running' },
        { id: 8, name: 'Network Manager', cpu: 1.8, memory: 28.9, status: 'running' },
        { id: 9, name: 'Window Manager', cpu: 3.2, memory: 156.7, status: 'running' },
        { id: 10, name: 'Background Tasks', cpu: 0.3, memory: 19.4, status: 'running' }
      ].map(process => ({
        ...process,
        cpu: process.cpu + (Math.random() - 0.5) * 2,
        memory: process.memory + (Math.random() - 0.5) * 10
      }));

      setProcesses(mockProcesses);
    };

    generateMockData();
    const interval = setInterval(generateMockData, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const StatCard: React.FC<{
    title: string;
    value: string;
    percentage: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, percentage, icon, color }) => (
    <motion.div
      className="bg-white/5 rounded-lg border border-white/10 p-4"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`text-${color}-400`}>{icon}</div>
          <h3 className="text-white font-medium">{title}</h3>
        </div>
        <span className="text-white/60 text-sm">{value}</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2">
        <motion.div
          className={`bg-${color}-500 h-2 rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="text-right text-xs text-white/50 mt-1">
        {percentage.toFixed(1)}%
      </div>
    </motion.div>
  );

  const MiniChart: React.FC<{
    data: number[];
    color: string;
    height?: number;
  }> = ({ data, color, height = 60 }) => (
    <div className="relative" style={{ height }}>
      <svg width="100%" height="100%" className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={data.map((value, index) => 
            `${(index / (data.length - 1)) * 100},${100 - value}`
          ).join(' ')}
          vectorEffect="non-scaling-stroke"
        />
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <polygon
          fill={`url(#gradient-${color})`}
          points={`0,100 ${data.map((value, index) => 
            `${(index / (data.length - 1)) * 100},${100 - value}`
          ).join(' ')} 100,100`}
        />
      </svg>
    </div>
  );

  const TabButton: React.FC<{
    id: string;
    title: string;
    icon: React.ReactNode;
    active: boolean;
    onClick: () => void;
  }> = ({ id, title, icon, active, onClick }) => (
    <motion.button
      className={`
        flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
        ${active 
          ? 'bg-blue-600 text-white' 
          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
        }
      `}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      <span className="font-medium">{title}</span>
    </motion.button>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                title="CPU Usage"
                value={`${systemStats.cpu.toFixed(1)}%`}
                percentage={systemStats.cpu}
                icon={<Cpu size={20} />}
                color="blue"
              />
              <StatCard
                title="Memory Usage"
                value={`${systemStats.memory.toFixed(1)}%`}
                percentage={systemStats.memory}
                icon={<MemoryStick size={20} />}
                color="green"
              />
              <StatCard
                title="Disk Usage"
                value={`${systemStats.disk.toFixed(1)}%`}
                percentage={systemStats.disk}
                icon={<HardDrive size={20} />}
                color="orange"
              />
              <StatCard
                title="Temperature"
                value={`${systemStats.temperature.toFixed(1)}°C`}
                percentage={(systemStats.temperature / 80) * 100}
                icon={<Thermometer size={20} />}
                color="red"
              />
            </div>

            <div className="bg-white/5 rounded-lg border border-white/10 p-4">
              <h3 className="text-white font-medium mb-4">System Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/60">OS:</span>
                    <span className="text-white">MituOS 1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Uptime:</span>
                    <span className="text-white">{formatUptime(systemStats.uptime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">CPU:</span>
                    <span className="text-white">Intel Core i7</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/60">RAM:</span>
                    <span className="text-white">16 GB DDR4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Storage:</span>
                    <span className="text-white">512 GB SSD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">GPU:</span>
                    <span className="text-white">NVIDIA RTX 4070</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'processes':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">Running Processes</h3>
              <motion.button
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw size={14} />
                <span>Refresh</span>
              </motion.button>
            </div>
            
            <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
              <div className="grid grid-cols-5 gap-4 p-3 bg-white/5 border-b border-white/10 text-sm font-medium text-white/70">
                <div>Process Name</div>
                <div className="text-center">PID</div>
                <div className="text-center">CPU %</div>
                <div className="text-center">Memory (MB)</div>
                <div className="text-center">Status</div>
              </div>
              <div className="max-h-64 overflow-auto">
                {processes.map((process) => (
                  <motion.div
                    key={process.id}
                    className="grid grid-cols-5 gap-4 p-3 border-b border-white/5 hover:bg-white/5 transition-colors text-sm"
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  >
                    <div className="text-white font-medium">{process.name}</div>
                    <div className="text-white/60 text-center">{process.id}</div>
                    <div className="text-white/60 text-center">{process.cpu.toFixed(1)}%</div>
                    <div className="text-white/60 text-center">{process.memory.toFixed(1)}</div>
                    <div className="text-center">
                      <span className={`
                        px-2 py-1 rounded-full text-xs
                        ${process.status === 'running' 
                          ? 'bg-green-600/20 text-green-400' 
                          : process.status === 'sleeping'
                          ? 'bg-yellow-600/20 text-yellow-400'
                          : 'bg-red-600/20 text-red-400'
                        }
                      `}>
                        {process.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                <h3 className="text-white font-medium mb-4 flex items-center">
                  <Cpu size={20} className="mr-2 text-blue-400" />
                  CPU Usage History
                </h3>
                <MiniChart data={cpuHistory} color="#3b82f6" />
                <div className="text-center text-white/60 text-sm mt-2">
                  Current: {systemStats.cpu.toFixed(1)}%
                </div>
              </div>

              <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                <h3 className="text-white font-medium mb-4 flex items-center">
                  <MemoryStick size={20} className="mr-2 text-green-400" />
                  Memory Usage History
                </h3>
                <MiniChart data={memoryHistory} color="#10b981" />
                <div className="text-center text-white/60 text-sm mt-2">
                  Current: {systemStats.memory.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg border border-white/10 p-4">
              <h3 className="text-white font-medium mb-4 flex items-center">
                <Activity size={20} className="mr-2 text-purple-400" />
                Network Activity
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Download size={16} className="mr-1 text-blue-400" />
                    <span className="text-white/60 text-sm">Download</span>
                  </div>
                  <div className="text-white text-lg font-bold">
                    {formatBytes(systemStats.network.download)}/s
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Upload size={16} className="mr-1 text-green-400" />
                    <span className="text-white/60 text-sm">Upload</span>
                  </div>
                  <div className="text-white text-lg font-bold">
                    {formatBytes(systemStats.network.upload)}/s
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'network':
        return (
          <div className="space-y-6">
            <div className="bg-white/5 rounded-lg border border-white/10 p-4">
              <h3 className="text-white font-medium mb-4 flex items-center">
                <Wifi size={20} className="mr-2 text-blue-400" />
                Network Status
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/60">Connection:</span>
                    <span className="text-green-400">Connected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Network:</span>
                    <span className="text-white">Wi-Fi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">IP Address:</span>
                    <span className="text-white">192.168.1.100</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/60">Signal:</span>
                    <span className="text-white">Excellent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Speed:</span>
                    <span className="text-white">1 Gbps</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">DNS:</span>
                    <span className="text-white">8.8.8.8</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg border border-white/10 p-4">
              <h3 className="text-white font-medium mb-4">Data Usage</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">2.4 GB</div>
                  <div className="text-white/60 text-sm">Downloaded Today</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">1.1 GB</div>
                  <div className="text-white/60 text-sm">Uploaded Today</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 to-black">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/30 border-b border-white/10">
        <h1 className="text-xl font-bold text-white flex items-center">
          <Activity size={24} className="mr-2" />
          System Monitor
        </h1>
        <div className="text-white/60 text-sm">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 p-4 bg-black/20 border-b border-white/10">
        <TabButton
          id="overview"
          title="Overview"
          icon={<Monitor size={16} />}
          active={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
        />
        <TabButton
          id="processes"
          title="Processes"
          icon={<Activity size={16} />}
          active={activeTab === 'processes'}
          onClick={() => setActiveTab('processes')}
        />
        <TabButton
          id="performance"
          title="Performance"
          icon={<Zap size={16} />}
          active={activeTab === 'performance'}
          onClick={() => setActiveTab('performance')}
        />
        <TabButton
          id="network"
          title="Network"
          icon={<Wifi size={16} />}
          active={activeTab === 'network'}
          onClick={() => setActiveTab('network')}
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};
