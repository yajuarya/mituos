# MituOS Learning Resources 📚

## Overview
This document provides educational resources to understand operating system concepts through the MituOS codebase. Each section links code implementations to real OS theory with progressive complexity levels.

---

## 🎯 Concept Mapping: Code to OS Theory

### 1. Window Management System
**OS Theory**: Window managers coordinate multiple application windows, handle layering, and manage user interactions.

**Code Location**: `src/stores/window/windowStore.ts`
**Complexity**: 🟢 Beginner → 🟡 Intermediate → 🔴 Advanced

```typescript
// 🟢 BEGINNER: Basic window creation
const createWindow = (windowConfig) => {
  // Maps to OS concept: Process creation and window allocation
  const window = { ...windowConfig, id: generateId() };
  return window;
};

// 🟡 INTERMEDIATE: Z-index management (window layering)
const focusWindow = (id: string) => {
  // Maps to OS concept: Window stacking order and focus management
  window.zIndex = ++nextZIndex;
  activeWindowId = id;
};

// 🔴 ADVANCED: Memory-efficient window state management
const windows = new Map<string, WindowState>();
// Maps to OS concept: Efficient data structures for system resources
```

### 2. Application Registry & Process Management
**OS Theory**: Operating systems maintain a registry of available applications and manage their lifecycle.

**Code Location**: `src/stores/app/appStore.ts`
**Complexity**: 🟢 Beginner → 🟡 Intermediate

```typescript
// 🟢 BEGINNER: Application registration
const registerApp = (app: AppDefinition) => {
  // Maps to OS concept: Application installation and system registry
  apps.set(app.id, app);
};

// 🟡 INTERMEDIATE: Application lifecycle management
const launchApp = (appId: string) => {
  // Maps to OS concept: Process creation and resource allocation
  const app = apps.get(appId);
  if (app) return windowStore.openWindow(app.windowConfig);
};
```

### 3. Desktop Environment & User Interface
**OS Theory**: Desktop environments provide the graphical interface layer between users and the operating system.

**Code Location**: `src/components/desktop/Desktop.tsx`
**Complexity**: 🟢 Beginner → 🟡 Intermediate

```typescript
// 🟢 BEGINNER: Desktop rendering and event handling
const Desktop = () => {
  // Maps to OS concept: Desktop environment and window compositor
  return (
    <div className="desktop-environment">
      <Taskbar />
      <WindowManager />
    </div>
  );
};
```


### 4. File System Management
**OS Theory**: File systems organize data storage, manage directories, and handle file operations with proper permissions and metadata.

**Code Location**: `src/apps/file-manager/FileManager.tsx`
**Complexity**: 🟢 Beginner → 🟡 Intermediate → 🔴 Advanced

```typescript
// 🟢 BEGINNER: Basic file operations
const FileManager = () => {
  // Maps to OS concept: Directory traversal and file listing
  const [currentPath, setCurrentPath] = useState('/');
  const [files, setFiles] = useState<FileItem[]>([]);
  
  // Maps to OS concept: File system navigation
  const navigateToFolder = (path: string) => {
    setCurrentPath(path);
    // Simulates OS file system calls
  };
};

// 🟡 INTERMEDIATE: File permissions and metadata
const FileOperations = {
  // Maps to OS concept: File permission checking
  checkPermissions: (file: FileItem) => {
    return file.permissions & 0o755; // Unix-style permissions
  },
  
  // Maps to OS concept: File system metadata
  getFileStats: (file: FileItem) => ({
    size: file.size,
    modified: file.lastModified,
    type: file.mimeType
  })
};

// 🔴 ADVANCED: Virtual file system implementation
class VirtualFileSystem {
  private inodeTable = new Map<number, INode>();
  
  // Maps to OS concept: Inode-based file system
  createFile(name: string, content: string): number {
    const inode = this.allocateInode();
    this.inodeTable.set(inode, {
      name,
      content,
      permissions: 0o644,
      links: 1
    });
    return inode;
  }
}
```

### 5. Inter-Process Communication (IPC)
**OS Theory**: IPC mechanisms allow processes to communicate and synchronize, including message passing, shared memory, and event systems.

**Code Location**: `src/stores/window/windowStore.ts`, `src/hooks/useWindowCommunication.ts`
**Complexity**: 🟡 Intermediate → 🔴 Advanced

```typescript
// 🟡 INTERMEDIATE: Message passing between windows
const useWindowCommunication = () => {
  // Maps to OS concept: Inter-process message queues
  const sendMessage = (targetWindowId: string, message: any) => {
    const messageQueue = getWindowMessageQueue(targetWindowId);
    messageQueue.push({
      from: getCurrentWindowId(),
      data: message,
      timestamp: Date.now()
    });
  };
  
  // Maps to OS concept: Process synchronization
  const waitForResponse = async (messageId: string) => {
    return new Promise((resolve) => {
      const listener = (response: any) => {
        if (response.messageId === messageId) {
          resolve(response.data);
          removeListener(listener);
        }
      };
      addMessageListener(listener);
    });
  };
};

// 🔴 ADVANCED: Shared memory simulation
class SharedMemoryManager {
  private sharedRegions = new Map<string, SharedBuffer>();
  
  // Maps to OS concept: Shared memory allocation
  allocateSharedMemory(key: string, size: number): SharedBuffer {
    const buffer = new ArrayBuffer(size);
    const region = {
      buffer,
      processes: new Set<string>(),
      semaphore: new Semaphore(1)
    };
    this.sharedRegions.set(key, region);
    return region;
  }
  
  // Maps to OS concept: Memory synchronization
  async accessSharedMemory(key: string, processId: string) {
    const region = this.sharedRegions.get(key);
    await region.semaphore.acquire();
    // Critical section access
    return () => region.semaphore.release();
  }
}
```

### 6. Memory Management
**OS Theory**: Memory management handles allocation, deallocation, garbage collection, and virtual memory to optimize system performance.

**Code Location**: `src/stores/`, `src/hooks/useMemoryOptimization.ts`
**Complexity**: 🟡 Intermediate → 🔴 Advanced

```typescript
// 🟡 INTERMEDIATE: Memory-efficient state management
const useMemoryOptimization = () => {
  // Maps to OS concept: Memory pooling and reuse
  const objectPool = useMemo(() => new Map<string, any[]>(), []);
  
  const allocateObject = <T>(type: string, factory: () => T): T => {
    const pool = objectPool.get(type) || [];
    if (pool.length > 0) {
      return pool.pop() as T; // Reuse existing object
    }
    return factory(); // Create new object
  };
  
  const releaseObject = <T>(type: string, obj: T) => {
    const pool = objectPool.get(type) || [];
    pool.push(obj);
    objectPool.set(type, pool);
  };
};

// 🔴 ADVANCED: Virtual memory simulation
class VirtualMemoryManager {
  private pageTable = new Map<number, PageEntry>();
  private physicalMemory = new ArrayBuffer(1024 * 1024); // 1MB
  private swapSpace = new Map<number, ArrayBuffer>();
  
  // Maps to OS concept: Page fault handling
  handlePageFault(virtualAddress: number): ArrayBuffer {
    const pageNumber = Math.floor(virtualAddress / 4096);
    const pageEntry = this.pageTable.get(pageNumber);
    
    if (!pageEntry?.present) {
      // Maps to OS concept: Page swapping
      this.loadPageFromSwap(pageNumber);
    }
    
    return this.getPhysicalPage(pageEntry.frameNumber);
  }
  
  // Maps to OS concept: LRU page replacement
  private evictLRUPage(): number {
    let oldestPage = -1;
    let oldestTime = Date.now();
    
    for (const [pageNum, entry] of this.pageTable) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestPage = pageNum;
      }
    }
    
    return oldestPage;
  }
}
```

### 7. Process Scheduling & Management
**OS Theory**: Process schedulers manage CPU time allocation, process priorities, and system resource distribution.

**Code Location**: `src/stores/app/appStore.ts`, `src/hooks/useProcessScheduler.ts`
**Complexity**: 🔴 Advanced

```typescript
// 🔴 ADVANCED: Process scheduler implementation
class ProcessScheduler {
  private processQueue: ProcessControlBlock[] = [];
  private runningProcess: ProcessControlBlock | null = null;
  private timeSlice = 100; // 100ms time slice
  
  // Maps to OS concept: Round-robin scheduling
  schedule(): void {
    if (this.processQueue.length === 0) return;
    
    // Context switch
    if (this.runningProcess) {
      this.runningProcess.state = ProcessState.READY;
      this.processQueue.push(this.runningProcess);
    }
    
    // Select next process
    this.runningProcess = this.processQueue.shift()!;
    this.runningProcess.state = ProcessState.RUNNING;
    
    // Set timer for preemption
    setTimeout(() => this.schedule(), this.timeSlice);
  }
  
  // Maps to OS concept: Process creation
  createProcess(appId: string, priority: number): ProcessControlBlock {
    const pcb: ProcessControlBlock = {
      pid: this.generatePID(),
      appId,
      state: ProcessState.NEW,
      priority,
      cpuTime: 0,
      memoryUsage: 0,
      createdAt: Date.now()
    };
    
    this.processQueue.push(pcb);
    return pcb;
  }
  
  // Maps to OS concept: Priority-based scheduling
  prioritySchedule(): void {
    this.processQueue.sort((a, b) => b.priority - a.priority);
    this.schedule();
  }
}
```

---

## 📈 Progressive Complexity Guide

### 🟢 Beginner Level
**Prerequisites**: Basic TypeScript/React knowledge
**Focus**: Understanding basic OS concepts through simple implementations

**Recommended Learning Path**:
1. Start with `src/types/index.ts` - Understand data structures
2. Explore `src/stores/app/appStore.ts` - Basic app management
3. Review `src/components/apps/notepad/` - Simple application structure

### 🟡 Intermediate Level
**Prerequisites**: Understanding of state management and React patterns
**Focus**: Complex interactions and system coordination

**Recommended Learning Path**:
1. Study `src/stores/window/windowStore.ts` - Window lifecycle management
2. Analyze `src/components/desktop/Desktop.tsx` - System coordination
3. Examine `src/hooks/` - Custom React hooks for OS functionality

### 🔴 Advanced Level
**Prerequisites**: Deep understanding of OS concepts and performance optimization
**Focus**: Performance, memory management, and advanced patterns

**Recommended Learning Path**:
1. Review test files in `src/__tests__/` - Testing OS-like systems
2. Study `src/stores/desktop/desktopStore.ts` - Global state management
3. Analyze performance patterns and optimization techniques

---

## 🧪 Interactive Examples

### Example 1: Creating a Simple Window (🟢 Beginner)
```typescript
// File: src/examples/basic-window.ts
import { useWindowStore } from '@/stores/window/windowStore';

// Educational Purpose: Demonstrates basic window creation
// OS Concept: Process instantiation and window allocation
const createNotepadWindow = () => {
  const { openWindow } = useWindowStore();
  
  return openWindow({
    title: 'My Notepad',
    component: 'notepad',
    x: 100,
    y: 100,
    width: 600,
    height: 400,
    isMinimized: false,
    isMaximized: false
  });
};
```

### Example 2: Window Focus Management (🟡 Intermediate)
```typescript
// File: src/examples/window-focus.ts
// Educational Purpose: Shows how OS manages window focus and z-ordering
// OS Concept: Window manager focus policies and stacking

const handleWindowClick = (windowId: string) => {
  const { focusWindow, windows } = useWindowStore();
  
  // Bring clicked window to front (increase z-index)
  focusWindow(windowId);
  
  // Update visual indicators for active window
  updateActiveWindowStyles(windowId);
};
```

### Example 3: Application Lifecycle (🔴 Advanced)
```typescript
// File: src/examples/app-lifecycle.ts
// Educational Purpose: Complete application lifecycle management
// OS Concept: Process creation, execution, and termination

class ApplicationManager {
  // Maps to OS concept: Process Control Block (PCB)
  private processes = new Map<string, ProcessState>();
  
  async launchApplication(appId: string) {
    // 1. Allocate resources (memory, window space)
    const resources = await this.allocateResources(appId);
    
    // 2. Create process entry
    const process = this.createProcess(appId, resources);
    
    // 3. Initialize application window
    const windowId = this.createApplicationWindow(process);
    
    // 4. Start application execution
    return this.executeApplication(process, windowId);
  }
}
```

### Example 4: Desktop Event Handling (🟡 Intermediate)
```typescript
// File: src/examples/desktop-events.ts
// Educational Purpose: Demonstrates OS-level event handling and coordination
// OS Concept: Event-driven architecture and system-wide event management

const DesktopEventHandler = () => {
  // Step 1: Set up global event listeners (like OS interrupt handlers)
  useEffect(() => {
    const handleGlobalKeyboard = (e: KeyboardEvent) => {
      // Alt+Tab: Window switching (like Windows/Linux)
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        switchToNextWindow();
      }
      
      // Ctrl+Alt+T: Open terminal (like Linux)
      if (e.ctrlKey && e.altKey && e.key === 't') {
        launchApp('terminal');
      }
    };
    
    // Step 2: Register global event handlers
    document.addEventListener('keydown', handleGlobalKeyboard);
    
    // Step 3: Cleanup on unmount (like OS shutdown procedures)
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyboard);
    };
  }, []);
  
  // Step 4: Handle desktop-specific events
  const handleDesktopClick = (e: React.MouseEvent) => {
    // Clear window selection (like clicking on empty desktop space)
    if (e.target === e.currentTarget) {
      clearWindowFocus();
    }
  };
  
  return (
    <div 
      className="desktop-surface" 
      onClick={handleDesktopClick}
      onContextMenu={handleDesktopContextMenu}
    >
      {/* Desktop content */}
    </div>
  );
};
```

### Example 5: Memory-Efficient State Updates (🔴 Advanced)
```typescript
// File: src/examples/efficient-state.ts
// Educational Purpose: Demonstrates memory-efficient state management patterns
// OS Concept: Memory management and garbage collection optimization

const useOptimizedWindowStore = () => {
  // Step 1: Use shallow comparison for performance
  const windows = useWindowStore(
    (state) => state.windows,
    (oldWindows, newWindows) => {
      // Custom equality check - only update if actual changes
      if (oldWindows.size !== newWindows.size) return false;
      
      for (const [id, window] of oldWindows) {
        const newWindow = newWindows.get(id);
        if (!newWindow || !shallowEqual(window, newWindow)) {
          return false;
        }
      }
      return true;
    }
  );
  
  // Step 2: Memoized selectors for specific window data
  const getWindowById = useCallback((id: string) => {
    return windows.get(id);
  }, [windows]);
  
  // Step 3: Batch updates for multiple window operations
  const batchUpdateWindows = useCallback((updates: WindowUpdate[]) => {
    useWindowStore.getState().batchUpdate(updates);
  }, []);
  
  return { windows, getWindowById, batchUpdateWindows };
};

// Usage example with performance monitoring
const WindowComponent = React.memo(({ windowId }: { windowId: string }) => {
  const window = useOptimizedWindowStore().getWindowById(windowId);
  
  // Performance tracking (like OS performance counters)
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.log(`Window ${windowId} render time: ${endTime - startTime}ms`);
    };
  });
  
  return window ? <WindowFrame {...window} /> : null;
});
```

### Example 6: Component Isolation Pattern (🟡 Intermediate)
```typescript
// File: src/examples/component-isolation.ts
// Educational Purpose: Shows how to isolate components like OS processes
// OS Concept: Process isolation and sandboxing

interface IsolatedAppProps {
  appId: string;
  permissions: AppPermissions;
  resources: ResourceLimits;
}

const IsolatedApp: React.FC<IsolatedAppProps> = ({ 
  appId, 
  permissions, 
  resources 
}) => {
  // Step 1: Create isolated context (like process sandbox)
  const [appContext] = useState(() => createAppContext({
    appId,
    permissions,
    resources
  }));
  
  // Step 2: Resource monitoring and limits
  useEffect(() => {
    const monitor = new ResourceMonitor(appId);
    
    // Monitor memory usage
    monitor.watchMemory(resources.maxMemory, () => {
      console.warn(`App ${appId} exceeding memory limit`);
      // Could trigger garbage collection or app suspension
    });
    
    // Monitor CPU usage
    monitor.watchCPU(resources.maxCPU, () => {
      console.warn(`App ${appId} exceeding CPU limit`);
      // Could throttle app execution
    });
    
    return () => monitor.cleanup();
  }, [appId, resources]);
  
  // Step 3: Permission-based API access
  const secureAPI = useMemo(() => {
    return createSecureAPI(permissions, {
      fileSystem: permissions.fileAccess ? fileSystemAPI : null,
      network: permissions.networkAccess ? networkAPI : null,
      system: permissions.systemAccess ? systemAPI : null
    });
  }, [permissions]);
  
  // Step 4: Error boundary for crash isolation
  return (
    <AppErrorBoundary appId={appId}>
      <AppContextProvider value={appContext}>
        <AppSecurityProvider api={secureAPI}>
          <DynamicAppLoader appId={appId} />
        </AppSecurityProvider>
      </AppContextProvider>
    </AppErrorBoundary>
  );
};
```

### Example 7: Progressive Enhancement Pattern (🟢 Beginner)
```typescript
// File: src/examples/progressive-enhancement.ts
// Educational Purpose: Shows how to build features progressively
// OS Concept: Modular system design and feature detection

const ProgressiveNotepad = () => {
  // Step 1: Basic functionality (always available)
  const [content, setContent] = useState('');
  
  // Step 2: Enhanced features (conditionally loaded)
  const [enhancedFeatures, setEnhancedFeatures] = useState({
    spellCheck: false,
    autoSave: false,
    syntaxHighlighting: false
  });
  
  // Step 3: Feature detection and progressive loading
  useEffect(() => {
    // Check system capabilities
    const capabilities = detectSystemCapabilities();
    
    // Enable features based on system resources
    setEnhancedFeatures({
      spellCheck: capabilities.hasSpellCheck,
      autoSave: capabilities.hasLocalStorage,
      syntaxHighlighting: capabilities.hasWebWorkers
    });
  }, []);
  
  // Step 4: Conditional feature rendering
  return (
    <div className="notepad">
      {/* Core functionality - always present */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="notepad-editor"
      />
      
      {/* Enhanced features - conditionally rendered */}
      {enhancedFeatures.spellCheck && (
        <SpellCheckProvider>
          <SpellCheckIndicator />
        </SpellCheckProvider>
      )}
      
      {enhancedFeatures.autoSave && (
        <AutoSaveManager content={content} />
      )}
      
      {enhancedFeatures.syntaxHighlighting && (
        <SyntaxHighlighter content={content} />
      )}
    </div>
  );
};

// System capability detection
const detectSystemCapabilities = () => {
  return {
    hasSpellCheck: 'spellcheck' in document.createElement('input'),
    hasLocalStorage: typeof Storage !== 'undefined',
    hasWebWorkers: typeof Worker !== 'undefined',
    hasOfflineSupport: 'serviceWorker' in navigator,
    hasNotifications: 'Notification' in window
  };
};
```

### Example 8: Real-time System Monitoring (🔴 Advanced)
```typescript
// File: src/examples/system-monitoring.ts
// Educational Purpose: Demonstrates real-time system monitoring like OS task manager
// OS Concept: System monitoring, performance metrics, and resource tracking

interface SystemMetrics {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
    processes: ProcessInfo[];
  };
  windows: {
    active: number;
    total: number;
    focused: string | null;
  };
}

const SystemMonitor = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  
  // Step 1: Real-time metrics collection
  useEffect(() => {
    if (!isMonitoring) return;
    
    const collectMetrics = async () => {
      // Memory usage (approximation using performance API)
      const memoryInfo = (performance as any).memory;
      const memory = memoryInfo ? {
        used: memoryInfo.usedJSHeapSize,
        total: memoryInfo.totalJSHeapSize,
        percentage: (memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100
      } : null;
      
      // CPU usage estimation
      const startTime = performance.now();
      await new Promise(resolve => setTimeout(resolve, 100));
      const endTime = performance.now();
      const cpuUsage = Math.min(100, (endTime - startTime - 100) * 10);
      
      // Window statistics
      const windowStore = useWindowStore.getState();
      const windows = {
        active: Array.from(windowStore.windows.values()).filter(w => !w.isMinimized).length,
        total: windowStore.windows.size,
        focused: windowStore.activeWindowId
      };
      
      setMetrics({
        memory,
        cpu: {
          usage: cpuUsage,
          processes: getProcessInfo()
        },
        windows
      });
    };
    
    // Update metrics every second
    const interval = setInterval(collectMetrics, 1000);
    collectMetrics(); // Initial collection
    
    return () => clearInterval(interval);
  }, [isMonitoring]);
  
  // Step 2: Process information gathering
  const getProcessInfo = (): ProcessInfo[] => {
    const windowStore = useWindowStore.getState();
    
    return Array.from(windowStore.windows.entries()).map(([id, window]) => ({
      id,
      name: window.title,
      type: window.component,
      status: window.isMinimized ? 'suspended' : 'running',
      memoryUsage: estimateWindowMemoryUsage(window),
      cpuUsage: estimateWindowCPUUsage(window)
    }));
  };
  
  // Step 3: Performance optimization alerts
  useEffect(() => {
    if (!metrics) return;
    
    // Memory usage warning
    if (metrics.memory && metrics.memory.percentage > 80) {
      console.warn('High memory usage detected:', metrics.memory.percentage + '%');
      // Could trigger garbage collection or suggest closing apps
    }
    
    // CPU usage warning
    if (metrics.cpu.usage > 90) {
      console.warn('High CPU usage detected:', metrics.cpu.usage + '%');
      // Could suggest optimizing or suspending processes
    }
    
    // Too many windows warning
    if (metrics.windows.total > 10) {
      console.warn('Many windows open:', metrics.windows.total);
      // Could suggest organizing or closing unused windows
    }
  }, [metrics]);
  
  return (
    <div className="system-monitor">
      <div className="monitor-controls">
        <button 
          onClick={() => setIsMonitoring(!isMonitoring)}
          className={`monitor-toggle ${isMonitoring ? 'active' : ''}`}
        >
          {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        </button>
      </div>
      
      {metrics && (
        <div className="metrics-display">
          {/* Memory Usage */}
          {metrics.memory && (
            <div className="metric-section">
              <h3>Memory Usage</h3>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${metrics.memory.percentage}%` }}
                />
              </div>
              <span>{metrics.memory.percentage.toFixed(1)}% used</span>
            </div>
          )}
          
          {/* CPU Usage */}
          <div className="metric-section">
            <h3>CPU Usage</h3>
            <div className="cpu-gauge">
              <span className="cpu-value">{metrics.cpu.usage.toFixed(1)}%</span>
            </div>
          </div>
          
          {/* Window Statistics */}
          <div className="metric-section">
            <h3>Windows</h3>
            <div className="window-stats">
              <span>Active: {metrics.windows.active}</span>
              <span>Total: {metrics.windows.total}</span>
              <span>Focused: {metrics.windows.focused || 'None'}</span>
            </div>
          </div>
          
          {/* Process List */}
          <div className="metric-section">
            <h3>Running Processes</h3>
            <div className="process-list">
              {metrics.cpu.processes.map(process => (
                <div key={process.id} className="process-item">
                  <span className="process-name">{process.name}</span>
                  <span className="process-status">{process.status}</span>
                  <span className="process-memory">{process.memoryUsage}MB</span>
                  <span className="process-cpu">{process.cpuUsage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions for resource estimation
const estimateWindowMemoryUsage = (window: any): number => {
  // Rough estimation based on window type and content
  const baseMemory = 5; // Base memory per window
  const componentMemory = {
    'notepad': 2,
    'calculator': 1,
    'file-manager': 8,
    'settings': 3,
    'system-monitor': 10
  };
  
  return baseMemory + (componentMemory[window.component as keyof typeof componentMemory] || 2);
};

const estimateWindowCPUUsage = (window: any): number => {
  // Estimate CPU usage based on window activity
  if (window.isMinimized) return 0;
  
  const baseCPU = Math.random() * 5; // Base CPU usage
  const activityMultiplier = window.component === 'system-monitor' ? 3 : 1;
  
  return Math.min(100, baseCPU * activityMultiplier);
};
```
    
    // Step 3: Cleanup (like OS resource deallocation)
    return () => document.removeEventListener('keydown', handleGlobalKeyboard);
  }, []);
};
```

### Example 5: Memory-Efficient State Updates (🔴 Advanced)
```typescript
// File: src/examples/efficient-updates.ts
// Educational Purpose: Shows memory-efficient patterns for OS-like systems
// OS Concept: Memory management and garbage collection optimization

// ✅ GOOD: Batch updates for better performance
const useBatchedWindowUpdates = () => {
  const updateQueue = useRef<Map<string, Partial<WindowState>>>(new Map());
  
  const batchUpdate = useCallback((windowId: string, updates: Partial<WindowState>) => {
    // Step 1: Queue the update instead of immediate execution
    updateQueue.current.set(windowId, {
      ...updateQueue.current.get(windowId),
      ...updates
    });
    
    // Step 2: Flush updates in next frame (like OS scheduler)
    requestAnimationFrame(() => {
      updateQueue.current.forEach((updates, id) => {
        windowStore.updateWindow(id, updates);
      });
      updateQueue.current.clear();
    });
  }, []);
  
  return { batchUpdate };
};
```

### Example 6: Component Isolation Pattern (🟢 Beginner)
```typescript
// File: src/examples/isolated-component.ts
// Educational Purpose: Small, isolated code snippet for learning
// OS Concept: Process isolation and sandboxing

// Simple isolated window component that doesn't affect global state
const IsolatedWindow: React.FC<{ title: string; children: React.ReactNode }> = ({ 
  title, 
  children 
}) => {
  // Local state only - no global dependencies
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  
  return (
    <div 
      className="window-frame"
      style={{ 
        transform: `translate(${position.x}px, ${position.y}px)`,
        display: isMinimized ? 'none' : 'block'
      }}
    >
      <div className="window-header">
        <span>{title}</span>
        <button onClick={() => setIsMinimized(!isMinimized)}>
          {isMinimized ? '□' : '_'}
        </button>
      </div>
      <div className="window-content">
        {children}
      </div>
    </div>
  );
};

// Usage: Perfect for learning without complex dependencies
<IsolatedWindow title="Learning Example">
  <p>This window operates independently!</p>
</IsolatedWindow>
```

### Example 7: Progressive Enhancement Pattern (🟢→🟡→🔴)
```typescript
// File: src/examples/progressive-enhancement.ts
// Educational Purpose: Shows how to build complexity progressively
// OS Concept: Layered system architecture

// 🟢 BEGINNER: Basic window
interface BasicWindow {
  id: string;
  title: string;
}

// 🟡 INTERMEDIATE: Add positioning and sizing
interface PositionedWindow extends BasicWindow {
  x: number;
  y: number;
  width: number;
  height: number;
}

// 🔴 ADVANCED: Add full window management
interface ManagedWindow extends PositionedWindow {
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isResizable: boolean;
  onFocus: () => void;
  onClose: () => void;
}

// Progressive implementation
const createWindow = (level: 'basic' | 'positioned' | 'managed') => {
  switch (level) {
    case 'basic':
      return { id: generateId(), title: 'Basic Window' };
    case 'positioned':
      return { ...createWindow('basic'), x: 0, y: 0, width: 400, height: 300 };
    case 'managed':
      return { 
        ...createWindow('positioned'), 
        zIndex: 1, 
        isMinimized: false,
        isMaximized: false,
        isResizable: true,
        onFocus: () => console.log('Window focused'),
        onClose: () => console.log('Window closed')
      };
  }
};
```
  async launchApplication(appId: string) {
    // 1. Allocate resources (memory, window space)
    const resources = await this.allocateResources(appId);
    
    // 2. Create process entry
    const process = this.createProcess(appId, resources);
    
    // 3. Initialize application window
    const windowId = this.createApplicationWindow(process);
    
    // 4. Start application execution
    return this.executeApplication(process, windowId);
  }
}
```

---

## 📋 Best Practices Documentation

### 1. State Management Best Practices
**Pattern**: Zustand for Global State
**Why**: Lightweight, TypeScript-friendly, and performant for OS-like applications

```typescript
// ✅ GOOD: Immutable state updates
const updateWindow = (id: string, updates: Partial<WindowState>) => {
  set((state) => ({
    windows: new Map(state.windows).set(id, {
      ...state.windows.get(id)!,
      ...updates
    })
  }));
};

// ❌ BAD: Direct state mutation
const updateWindowBad = (id: string, updates: Partial<WindowState>) => {
  const window = windows.get(id);
  Object.assign(window, updates); // Mutates state directly
};
```

**Educational Note**: Immutable updates ensure predictable state changes, similar to how operating systems maintain consistency in system state.

### 2. Component Architecture Best Practices
**Pattern**: Composition over Inheritance
**Why**: More flexible and maintainable for complex UI systems

```typescript
// ✅ GOOD: Composable window structure
const Window = ({ children, ...windowProps }) => (
  <WindowFrame {...windowProps}>
    <WindowHeader />
    <WindowContent>{children}</WindowContent>
    <WindowControls />
  </WindowFrame>
);

// Usage
<Window title="Notepad">
  <NotepadApp />
</Window>
```

### 3. Performance Optimization Patterns
**Pattern**: Selective Re-rendering
**Why**: Critical for smooth desktop experience with multiple windows

```typescript
// ✅ GOOD: Memoized window components
const WindowComponent = React.memo(({ window }) => {
  // Only re-renders when window properties change
  return <WindowFrame {...window} />;
});

// ✅ GOOD: Efficient state selectors
const useActiveWindow = () => {
  return useWindowStore(
    (state) => state.windows.get(state.activeWindowId),
    shallow // Shallow comparison for performance
  );
};
```

**Educational Note**: This mirrors how real operating systems use selective updates and caching to maintain performance with multiple running processes.

### 4. Error Handling and Resilience Patterns
**Pattern**: Graceful Degradation
**Why**: OS-like systems must handle failures without crashing the entire system

```typescript
// ✅ GOOD: Error boundaries for application isolation
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to show fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error (like OS crash dumps)
    console.error('Application crashed:', error, errorInfo);
    
    // Optionally restart the application
    this.restartApplication();
  }

  restartApplication = () => {
    // Clean up resources and restart
    setTimeout(() => {
      this.setState({ hasError: false, errorInfo: null });
    }, 2000);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-screen">
          <h2>Application Error</h2>
          <p>The application has encountered an error and will restart shortly.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage: Wrap each app for isolation
<AppErrorBoundary>
  <NotepadApp />
</AppErrorBoundary>
```

### 5. Resource Management Best Practices
**Pattern**: Automatic Cleanup and Resource Pooling
**Why**: Prevents memory leaks and ensures efficient resource utilization

```typescript
// ✅ GOOD: Automatic resource cleanup
const useWindowResources = (windowId: string) => {
  const resourcesRef = useRef<Set<string>>(new Set());
  
  const allocateResource = (resourceId: string) => {
    // Track allocated resources
    resourcesRef.current.add(resourceId);
    
    // Simulate resource allocation
    return createResource(resourceId);
  };
  
  // Automatic cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up all allocated resources
      resourcesRef.current.forEach(resourceId => {
        releaseResource(resourceId);
      });
      resourcesRef.current.clear();
    };
  }, []);
  
  return { allocateResource };
};

// ✅ GOOD: Resource pooling for performance
class WindowPool {
  private pool: WindowInstance[] = [];
  private maxPoolSize = 10;
  
  acquire(): WindowInstance {
    // Reuse existing window if available
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    
    // Create new window if pool is empty
    return new WindowInstance();
  }
  
  release(window: WindowInstance) {
    // Clean up window state
    window.reset();
    
    // Return to pool if not full
    if (this.pool.length < this.maxPoolSize) {
      this.pool.push(window);
    }
  }
}
```

### 6. Event System Architecture
**Pattern**: Event Bus with Priority Queuing
**Why**: Efficient event handling similar to OS interrupt systems

```typescript
// ✅ GOOD: Priority-based event system
interface SystemEvent {
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  payload: any;
  timestamp: number;
}

class EventBus {
  private queues = {
    critical: [] as SystemEvent[],
    high: [] as SystemEvent[],
    medium: [] as SystemEvent[],
    low: [] as SystemEvent[]
  };
  
  private listeners = new Map<string, Function[]>();
  private isProcessing = false;
  
  emit(event: SystemEvent) {
    // Add to appropriate priority queue
    this.queues[event.priority].push(event);
    
    // Start processing if not already running
    if (!this.isProcessing) {
      this.processEvents();
    }
  }
  
  private async processEvents() {
    this.isProcessing = true;
    
    // Process events by priority (critical first)
    const priorities: (keyof typeof this.queues)[] = ['critical', 'high', 'medium', 'low'];
    
    for (const priority of priorities) {
      while (this.queues[priority].length > 0) {
        const event = this.queues[priority].shift()!;
        await this.handleEvent(event);
      }
    }
    
    this.isProcessing = false;
  }
  
  private async handleEvent(event: SystemEvent) {
    const handlers = this.listeners.get(event.type) || [];
    
    // Execute handlers concurrently for better performance
    await Promise.all(
      handlers.map(handler => 
        Promise.resolve(handler(event.payload)).catch(console.error)
      )
    );
  }
}

// Usage example
const systemBus = new EventBus();

// Critical system events (like window close)
systemBus.emit({
  type: 'window.close',
  priority: 'critical',
  payload: { windowId: 'notepad-1' },
  timestamp: Date.now()
});
```

### 7. Testing Patterns for OS-like Systems
**Pattern**: Integration Testing with Mock System Resources
**Why**: Ensures system components work together correctly

```typescript
// ✅ GOOD: Comprehensive system testing
describe('Window Management System', () => {
  let mockWindowStore: MockWindowStore;
  let mockEventBus: MockEventBus;
  
  beforeEach(() => {
    // Set up mock system resources
    mockWindowStore = new MockWindowStore();
    mockEventBus = new MockEventBus();
  });
  
  test('should handle window lifecycle correctly', async () => {
    // Test complete window lifecycle
    const windowId = await mockWindowStore.createWindow({
      title: 'Test Window',
      component: 'notepad'
    });
    
    // Verify window creation
    expect(mockWindowStore.getWindow(windowId)).toBeDefined();
    
    // Test focus management
    mockWindowStore.focusWindow(windowId);
    expect(mockWindowStore.getActiveWindow()).toBe(windowId);
    
    // Test cleanup
    mockWindowStore.closeWindow(windowId);
    expect(mockWindowStore.getWindow(windowId)).toBeUndefined();
  });
  
  test('should handle system events correctly', async () => {
    // Test event propagation
    const eventSpy = jest.fn();
    mockEventBus.on('window.focus', eventSpy);
    
    mockEventBus.emit('window.focus', { windowId: 'test' });
    
    expect(eventSpy).toHaveBeenCalledWith({ windowId: 'test' });
  });
});
```
  // Only re-renders when window properties change
  return <WindowFrame {...window} />;
});

// ✅ GOOD: Efficient state selectors
const useActiveWindow = () => {
  return useWindowStore(
    (state) => state.windows.get(state.activeWindowId),
    shallow // Shallow comparison for performance
  );
};
```

---

## 🔗 Real-World OS Parallels

| MituOS Component | Real OS Equivalent | Learning Value |
|------------------|-------------------|----------------|
| `windowStore.ts` | Windows DWM / macOS WindowServer | Window management algorithms |
| `appStore.ts` | Linux Application Registry | Process and application lifecycle |
| `Desktop.tsx` | GNOME Shell / Windows Explorer | Desktop environment architecture |
| `Taskbar.tsx` | Windows Taskbar / macOS Dock | System UI and process monitoring |

---

## 📚 Additional Learning Resources

### Recommended Reading
1. **"Operating System Concepts"** by Silberschatz - For theoretical foundation
2. **"The Design and Implementation of the FreeBSD Operating System"** - For practical insights
3. **React Documentation** - For understanding the UI framework patterns used

### Online Resources
1. **OS Dev Wiki** - Low-level OS development concepts
2. **React Patterns** - Advanced React patterns used in MituOS
3. **Zustand Documentation** - State management patterns


---

## 🧪 Advanced Interactive Examples

### 1. Process Scheduling Simulation (🔴 Advanced)
**OS Concept**: CPU Scheduling Algorithms
**Implementation**: Task Priority Queue with Time Slicing

```typescript
// Advanced: Simulating OS process scheduling in MituOS
interface ProcessTask {
  id: string;
  priority: number;
  burstTime: number;
  arrivalTime: number;
  remainingTime: number;
  status: 'ready' | 'running' | 'blocked' | 'terminated';
}

class ProcessScheduler {
  private readyQueue: ProcessTask[] = [];
  private runningProcess: ProcessTask | null = null;
  private timeQuantum = 100; // 100ms time slice
  private currentTime = 0;

  // Round Robin with Priority (similar to Linux CFS)
  scheduleNext(): ProcessTask | null {
    if (this.readyQueue.length === 0) return null;
    
    // Sort by priority (higher number = higher priority)
    this.readyQueue.sort((a, b) => b.priority - a.priority);
    
    const nextProcess = this.readyQueue.shift()!;
    nextProcess.status = 'running';
    this.runningProcess = nextProcess;
    
    // Simulate time slice execution
    setTimeout(() => this.preempt(), this.timeQuantum);
    
    return nextProcess;
  }
  
  private preempt() {
    if (this.runningProcess) {
      this.runningProcess.remainingTime -= this.timeQuantum;
      
      if (this.runningProcess.remainingTime <= 0) {
        // Process completed
        this.runningProcess.status = 'terminated';
        console.log(`Process ${this.runningProcess.id} completed`);
      } else {
        // Return to ready queue (preemption)
        this.runningProcess.status = 'ready';
        this.readyQueue.push(this.runningProcess);
      }
      
      this.runningProcess = null;
      this.scheduleNext(); // Schedule next process
    }
  }
}

// Usage in MituOS window management
const windowScheduler = new ProcessScheduler();

// Each window becomes a "process"
const createWindowProcess = (windowId: string, appType: string) => {
  const priority = appType === 'system' ? 10 : 5; // System apps get higher priority
  
  windowScheduler.addProcess({
    id: windowId,
    priority,
    burstTime: 1000, // Estimated execution time
    arrivalTime: Date.now(),
    remainingTime: 1000,
    status: 'ready'
  });
};
```

### 2. Memory Management with Garbage Collection (🔴 Advanced)
**OS Concept**: Memory Allocation and Deallocation
**Implementation**: Reference Counting with Cycle Detection

```typescript
// Advanced: Memory management simulation
interface MemoryBlock {
  id: string;
  size: number;
  refs: Set<string>;
  data: any;
  allocated: boolean;
  timestamp: number;
}

class MemoryManager {
  private heap: Map<string, MemoryBlock> = new Map();
  private freeList: string[] = [];
  private totalMemory = 1024 * 1024; // 1MB virtual memory
  private usedMemory = 0;

  allocate(size: number, ownerId: string): string | null {
    if (this.usedMemory + size > this.totalMemory) {
      // Trigger garbage collection
      this.garbageCollect();
      
      if (this.usedMemory + size > this.totalMemory) {
        console.warn('Out of memory!');
        return null;
      }
    }

    const blockId = `mem_${Date.now()}_${Math.random()}`;
    const block: MemoryBlock = {
      id: blockId,
      size,
      refs: new Set([ownerId]),
      data: new ArrayBuffer(size),
      allocated: true,
      timestamp: Date.now()
    };

    this.heap.set(blockId, block);
    this.usedMemory += size;
    
    console.log(`Allocated ${size} bytes for ${ownerId}`);
    return blockId;
  }

  addReference(blockId: string, ownerId: string) {
    const block = this.heap.get(blockId);
    if (block) {
      block.refs.add(ownerId);
    }
  }

  removeReference(blockId: string, ownerId: string) {
    const block = this.heap.get(blockId);
    if (block) {
      block.refs.delete(ownerId);
      
      // Immediate deallocation if no references (like C++ smart pointers)
      if (block.refs.size === 0) {
        this.deallocate(blockId);
      }
    }
  }

  private deallocate(blockId: string) {
    const block = this.heap.get(blockId);
    if (block && block.allocated) {
      this.usedMemory -= block.size;
      this.heap.delete(blockId);
      console.log(`Deallocated ${block.size} bytes`);
    }
  }

  private garbageCollect() {
    console.log('Starting garbage collection...');
    const beforeSize = this.usedMemory;
    
    // Mark and sweep algorithm
    const reachable = new Set<string>();
    
    // Mark phase: find all reachable blocks
    for (const [blockId, block] of this.heap) {
      if (block.refs.size > 0) {
        reachable.add(blockId);
      }
    }
    
    // Sweep phase: deallocate unreachable blocks
    for (const [blockId, block] of this.heap) {
      if (!reachable.has(blockId)) {
        this.deallocate(blockId);
      }
    }
    
    const freed = beforeSize - this.usedMemory;
    console.log(`Garbage collection freed ${freed} bytes`);
  }

  getMemoryStats() {
    return {
      total: this.totalMemory,
      used: this.usedMemory,
      free: this.totalMemory - this.usedMemory,
      blocks: this.heap.size,
      fragmentation: this.calculateFragmentation()
    };
  }

  private calculateFragmentation(): number {
    // Simplified fragmentation calculation
    const blockSizes = Array.from(this.heap.values()).map(b => b.size);
    const avgBlockSize = blockSizes.reduce((a, b) => a + b, 0) / blockSizes.length;
    const variance = blockSizes.reduce((acc, size) => acc + Math.pow(size - avgBlockSize, 2), 0) / blockSizes.length;
    return Math.sqrt(variance) / avgBlockSize;
  }
}

// Integration with MituOS window system
const memoryManager = new MemoryManager();

const useWindowMemory = (windowId: string) => {
  const [memoryBlock, setMemoryBlock] = useState<string | null>(null);

  useEffect(() => {
    // Allocate memory for window data
    const blockId = memoryManager.allocate(1024, windowId); // 1KB per window
    setMemoryBlock(blockId);

    return () => {
      // Clean up memory when window closes
      if (blockId) {
        memoryManager.removeReference(blockId, windowId);
      }
    };
  }, [windowId]);

  return memoryBlock;
};
```

### 3. File System Simulation with Journaling (🔴 Advanced)
**OS Concept**: File System Operations and Data Integrity
**Implementation**: Virtual File System with Transaction Logging

```typescript
// Advanced: File system with journaling (like ext4)
interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'directory';
  size: number;
  created: number;
  modified: number;
  permissions: number;
  parent: string | null;
  children: Set<string>;
  data?: ArrayBuffer;
}

interface JournalEntry {
  id: string;
  operation: 'create' | 'update' | 'delete' | 'move';
  timestamp: number;
  target: string;
  oldState?: Partial<FileNode>;
  newState?: Partial<FileNode>;
  committed: boolean;
}

class VirtualFileSystem {
  private nodes: Map<string, FileNode> = new Map();
  private journal: JournalEntry[] = [];
  private rootId: string;

  constructor() {
    // Create root directory
    this.rootId = this.createNode('/', 'directory', null).id;
  }

  // Atomic file operations with journaling
  async createFile(name: string, parentId: string, data?: ArrayBuffer): Promise<string> {
    const transaction = this.beginTransaction();
    
    try {
      // Journal the operation before executing
      const journalEntry: JournalEntry = {
        id: `journal_${Date.now()}`,
        operation: 'create',
        timestamp: Date.now(),
        target: name,
        newState: { name, type: 'file', parent: parentId },
        committed: false
      };
      
      this.journal.push(journalEntry);
      
      // Execute the operation
      const node = this.createNode(name, 'file', parentId);
      if (data) {
        node.data = data;
        node.size = data.byteLength;
      }
      
      // Commit the transaction
      journalEntry.committed = true;
      await this.flushJournal();
      
      return node.id;
    } catch (error) {
      // Rollback on error
      await this.rollbackTransaction(transaction);
      throw error;
    }
  }

  private createNode(name: string, type: 'file' | 'directory', parentId: string | null): FileNode {
    const nodeId = `node_${Date.now()}_${Math.random()}`;
    const now = Date.now();
    
    const node: FileNode = {
      id: nodeId,
      name,
      type,
      size: 0,
      created: now,
      modified: now,
      permissions: 0o755, // Unix-style permissions
      parent: parentId,
      children: new Set()
    };

    this.nodes.set(nodeId, node);
    
    // Add to parent's children
    if (parentId) {
      const parent = this.nodes.get(parentId);
      if (parent && parent.type === 'directory') {
        parent.children.add(nodeId);
      }
    }

    return node;
  }

  // Path resolution (like Unix path traversal)
  resolvePath(path: string): FileNode | null {
    if (path === '/') return this.nodes.get(this.rootId) || null;
    
    const parts = path.split('/').filter(p => p.length > 0);
    let current = this.nodes.get(this.rootId);
    
    for (const part of parts) {
      if (!current || current.type !== 'directory') return null;
      
      let found = false;
      for (const childId of current.children) {
        const child = this.nodes.get(childId);
        if (child && child.name === part) {
          current = child;
          found = true;
          break;
        }
      }
      
      if (!found) return null;
    }
    
    return current;
  }

  // File system recovery from journal
  async recover(): Promise<void> {
    console.log('Starting file system recovery...');
    
    const uncommittedEntries = this.journal.filter(entry => !entry.committed);
    
    for (const entry of uncommittedEntries) {
      console.log(`Rolling back uncommitted operation: ${entry.operation} on ${entry.target}`);
      
      // Rollback logic based on operation type
      switch (entry.operation) {
        case 'create':
          // Remove the created node
          if (entry.newState) {
            this.removeNodeByName(entry.target, entry.newState.parent || this.rootId);
          }
          break;
        case 'delete':
          // Restore the deleted node
          if (entry.oldState) {
            // Restore from old state
            this.restoreNode(entry.oldState);
          }
          break;
        // Add more rollback cases as needed
      }
    }
    
    // Clean up journal
    this.journal = this.journal.filter(entry => entry.committed);
    console.log('File system recovery completed');
  }

  private beginTransaction(): string {
    return `tx_${Date.now()}`;
  }

  private async rollbackTransaction(transactionId: string): Promise<void> {
    // Implementation for transaction rollback
    console.log(`Rolling back transaction: ${transactionId}`);
  }

  private async flushJournal(): Promise<void> {
    // In a real system, this would write to persistent storage
    console.log('Journal flushed to storage');
  }

  private removeNodeByName(name: string, parentId: string): void {
    const parent = this.nodes.get(parentId);
    if (parent) {
      for (const childId of parent.children) {
        const child = this.nodes.get(childId);
        if (child && child.name === name) {
          parent.children.delete(childId);
          this.nodes.delete(childId);
          break;
        }
      }
    }
  }

  private restoreNode(nodeState: Partial<FileNode>): void {
    // Implementation for restoring a node from journal state
    console.log('Restoring node from journal');
  }

  // File system statistics
  getStats() {
    const totalNodes = this.nodes.size;
    const files = Array.from(this.nodes.values()).filter(n => n.type === 'file').length;
    const directories = totalNodes - files;
    const totalSize = Array.from(this.nodes.values()).reduce((acc, node) => acc + node.size, 0);
    
    return {
      totalNodes,
      files,
      directories,
      totalSize,
      journalEntries: this.journal.length,
      uncommittedTransactions: this.journal.filter(e => !e.committed).length
    };
  }
}

// Integration with MituOS File Manager
const vfs = new VirtualFileSystem();

const useVirtualFileSystem = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [currentNode, setCurrentNode] = useState<FileNode | null>(null);

  useEffect(() => {
    const node = vfs.resolvePath(currentPath);
    setCurrentNode(node);
  }, [currentPath]);

  const createFile = async (name: string, data?: ArrayBuffer) => {
    if (currentNode && currentNode.type === 'directory') {
      await vfs.createFile(name, currentNode.id, data);
      // Refresh current view
      setCurrentNode(vfs.resolvePath(currentPath));
    }
  };

  const navigateTo = (path: string) => {
    setCurrentPath(path);
  };

  return {
    currentPath,
    currentNode,
    createFile,
    navigateTo,
    stats: vfs.getStats()
  };
};
```

## 🗺️ Enhanced Concept Mapping

### Core OS Concepts → MituOS Implementation

#### 1. Process Management
```
Real OS Process ←→ MituOS Window
├── Process ID (PID) ←→ Window ID
├── Process State ←→ Window State (minimized, maximized, focused)
├── Process Priority ←→ Window Z-Index & Focus Priority
├── Parent-Child Relationship ←→ Modal Windows & Parent Windows
└── Process Scheduling ←→ Window Focus Management & Event Handling
```

**Code Locations:**
- `src/stores/window/windowStore.ts` - Window lifecycle management
- `src/components/window/Window.tsx` - Window state representation
- `src/hooks/useWindowManager.ts` - Window scheduling and focus

#### 2. Memory Management
```
Real OS Memory ←→ MituOS State Management
├── Heap Allocation ←→ Zustand Store State
├── Stack Memory ←→ Component Local State
├── Memory Leaks ←→ Unsubscribed Event Listeners
├── Garbage Collection ←→ React Cleanup (useEffect returns)
└── Memory Fragmentation ←→ Store State Fragmentation
```

**Code Locations:**
- `src/stores/` - All store files (memory allocation simulation)
- `src/hooks/useMemoryManager.ts` - Memory tracking hooks
- Component cleanup in `useEffect` returns

#### 3. File System
```
Real OS File System ←→ MituOS Virtual File System
├── Inodes ←→ File Objects with Metadata
├── Directory Structure ←→ Nested Object Hierarchy
├── File Permissions ←→ Access Control Props
├── File Descriptors ←→ File Handle References
└── Journaling ←→ Action History & Undo System
```

**Code Locations:**
- `src/apps/file-manager/` - Virtual file system implementation
- `src/stores/filesystem/` - File system state management
- `src/utils/fileOperations.ts` - File operation utilities


#### 4. Inter-Process Communication (IPC)
```
Real OS IPC ←→ MituOS Component Communication
├── Pipes ←→ React Context Providers
├── Message Queues ←→ Event Bus System
├── Shared Memory ←→ Global Zustand Stores
├── Semaphores ←→ Loading States & Mutexes
├── Sockets ←→ WebSocket Connections
└── Signals ←→ Custom Events & Notifications
```

**Code Locations:**
- `src/lib/eventBus.ts` - Global event communication system
- `src/contexts/` - React context for component communication
- `src/stores/` - Shared state between components
- `src/hooks/useNotifications.ts` - Signal-like notification system

**Example Implementation:**
```typescript
// IPC Pattern: Message passing between apps
const useIPCMessage = () => {
  const sendMessage = (targetApp: string, message: any) => {
    // Simulates inter-process message passing
    window.dispatchEvent(new CustomEvent(`app-${targetApp}`, {
      detail: message
    }));
  };
  
  const listenForMessages = (callback: (message: any) => void) => {
    const handler = (event: CustomEvent) => callback(event.detail);
    window.addEventListener(`app-${currentAppId}`, handler);
    return () => window.removeEventListener(`app-${currentAppId}`, handler);
  };
  
  return { sendMessage, listenForMessages };
};
```

#### 5. Device Management & I/O
```
Real OS Device Management ←→ MituOS Peripheral Simulation
├── Device Drivers ←→ Browser API Wrappers
├── Device Files (/dev/) ←→ Virtual Device Objects
├── Interrupt Handling ←→ Event Listeners
├── DMA Operations ←→ Async Operations
├── Device Queues ←→ Request Queues
└── Hot Plugging ←→ Dynamic Component Loading
```

**Code Locations:**
- `src/lib/deviceManager.ts` - Virtual device management
- `src/hooks/useCamera.ts` - Camera device simulation
- `src/hooks/useAudio.ts` - Audio device management
- `src/components/system/DeviceMonitor.tsx` - Device status display

**Example Implementation:**
```typescript
// Device Driver Pattern: Camera access
class VirtualCameraDevice {
  private stream: MediaStream | null = null;
  
  async initialize(): Promise<boolean> {
    try {
      // Simulates device driver initialization
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      return true;
    } catch (error) {
      console.error('Camera device initialization failed:', error);
      return false;
    }
  }
  
  async read(): Promise<ImageData | null> {
    // Simulates reading from device buffer
    if (!this.stream) return null;
    // Implementation for capturing frame
    return null; // Placeholder
  }
  
  cleanup(): void {
    // Simulates device driver cleanup
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
}
```

#### 6. Security & Access Control
```
Real OS Security ←→ MituOS Security Model
├── User Authentication ←→ Session Management
├── Access Control Lists ←→ Permission Props
├── Privilege Escalation ←→ Admin Mode Toggle
├── Sandboxing ←→ Component Isolation
├── Encryption ←→ Data Obfuscation
└── Audit Logs ←→ Action History Tracking
```

**Code Locations:**
- `src/lib/security/` - Security utilities and access control
- `src/hooks/useAuth.ts` - Authentication management
- `src/stores/security/` - Security state management
- `src/utils/permissions.ts` - Permission checking utilities

**Example Implementation:**
```typescript
// Access Control Pattern: Permission-based rendering
interface SecurityContext {
  user: User;
  permissions: Permission[];
  isAdmin: boolean;
}

const useSecurityContext = (): SecurityContext => {
  const { user } = useAuthStore();
  const permissions = useMemo(() => 
    calculateUserPermissions(user), [user]);
  
  return {
    user,
    permissions,
    isAdmin: permissions.includes('ADMIN')
  };
};

// Usage in components
const SecureComponent: React.FC<{ requiredPermission: string }> = ({ 
  requiredPermission, 
  children 
}) => {
  const { permissions } = useSecurityContext();
  
  if (!permissions.includes(requiredPermission)) {
    return <AccessDenied />;
  }
  
  return <>{children}</>;
};
```

#### 7. System Calls & API Layer
```
Real OS System Calls ←→ MituOS API Layer
├── File Operations (open, read, write) ←→ File Manager APIs
├── Process Control (fork, exec, wait) ←→ App Lifecycle APIs
├── Memory Management (malloc, free) ←→ State Allocation APIs
├── Network Operations ←→ HTTP/WebSocket APIs
├── Time & Date ←→ Browser Time APIs
└── System Information ←→ System Monitor APIs
```

**Code Locations:**
- `src/api/` - System call simulation layer
- `src/lib/syscalls.ts` - System call implementations
- `src/hooks/useSystemCalls.ts` - System call hooks
- `src/types/syscalls.ts` - System call type definitions

**Example Implementation:**
```typescript
// System Call Pattern: File operations
interface FileSystemCall {
  open(path: string, mode: 'r' | 'w' | 'a'): Promise<FileHandle>;
  read(handle: FileHandle, bytes: number): Promise<ArrayBuffer>;
  write(handle: FileHandle, data: ArrayBuffer): Promise<number>;
  close(handle: FileHandle): Promise<void>;
}

class MituOSFileSystem implements FileSystemCall {
  private openFiles = new Map<string, FileHandle>();
  
  async open(path: string, mode: 'r' | 'w' | 'a'): Promise<FileHandle> {
    // Simulates OS file open system call
    const handle = new FileHandle(path, mode);
    this.openFiles.set(handle.id, handle);
    return handle;
  }
  
  async read(handle: FileHandle, bytes: number): Promise<ArrayBuffer> {
    // Simulates OS file read system call
    if (!this.openFiles.has(handle.id)) {
      throw new Error('Invalid file handle');
    }
    // Implementation details...
    return new ArrayBuffer(bytes);
  }
  
  // ... other system call implementations
}
```

### 🎓 Progressive Learning Path

#### Beginner Level (🟢)
**Focus:** Basic concepts and simple implementations
- Start with: Process Management → Window lifecycle
- Practice: Timer app exercise
- Understand: Component state as process state

#### Intermediate Level (🟡)
**Focus:** System interactions and optimizations
- Explore: Memory Management → State optimization
- Practice: Window animations exercise
- Understand: Event-driven architecture

#### Advanced Level (🔴)
**Focus:** Complex system design and performance
- Master: IPC → Component communication patterns
- Practice: Memory management exercise
- Understand: Security models and access control

### 🔗 Cross-Reference Guide

| OS Concept | MituOS File | Learning Exercise | Difficulty |
|------------|-------------|-------------------|------------|
| Process Scheduling | `windowStore.ts` | Timer App | 🟢 |
| Memory Management | `useMemoryTracker.ts` | Memory Monitor | 🔴 |
| File System | `file-manager/` | Virtual FS | 🟡 |
| IPC | `eventBus.ts` | App Communication | 🟡 |
| Device I/O | `deviceManager.ts` | Camera Integration | 🔴 |
| Security | `security/` | Access Control | 🔴 |
| System Calls | `api/syscalls.ts` | API Design | 🔴 |

#### 4. Inter-Process Communication (IPC)
```
Real OS IPC ←→ MituOS Component Communication
├── Pipes ←→ React Context Providers
├── Message Queues ←→ Event Bus System
├── Shared Memory ←→ Global Zustand Stores
├── Signals ←→ Custom Events
└── Sockets ←→ Window-to-Window Communication
```

**Code Locations:**
- `src/lib/eventBus.ts` - Event-based communication
- `src/contexts/` - React Context for shared state
- `src/stores/communication/` - IPC simulation

#### 5. Device Management
```
Real OS Devices ←→ MituOS Browser APIs
├── Keyboard Driver ←→ Keyboard Event Handlers
├── Mouse Driver ←→ Mouse Event Handlers
├── Display Driver ←→ Canvas/DOM Rendering
├── Storage Driver ←→ LocalStorage/IndexedDB
└── Network Driver ←→ Fetch API/WebSockets
```

**Code Locations:**
- `src/hooks/useKeyboard.ts` - Keyboard input handling
- `src/hooks/useMouse.ts` - Mouse input handling
- `src/lib/storage.ts` - Storage abstraction layer

### Progressive Complexity Levels

#### 🟢 Beginner Level
**Focus**: Basic concepts and simple implementations
- Window creation and basic state management
- Simple event handling
- Basic component lifecycle

**Recommended Starting Points:**
1. `src/components/window/Window.tsx` - Basic window structure
2. `src/apps/calculator/Calculator.tsx` - Simple app implementation
3. `src/stores/window/windowStore.ts` - Basic state management

#### 🟡 Intermediate Level
**Focus**: System interactions and advanced patterns
- Inter-component communication
- Performance optimization
- Error handling and recovery

**Recommended Study Areas:**
1. `src/lib/eventBus.ts` - Event system architecture
2. `src/hooks/useWindowManager.ts` - Advanced window management
3. `src/stores/desktop/desktopStore.ts` - Complex state interactions

#### 🔴 Advanced Level
**Focus**: System architecture and optimization
- Memory management simulation
- Process scheduling algorithms
- File system implementation
- Performance profiling and optimization

**Advanced Topics:**
1. Custom memory management hooks
2. Virtual file system implementation
3. Process scheduling simulation
4. System performance monitoring

---

## 🎓 Learning Exercises

### Exercise 1: Implement a Simple App (🟢 Beginner)

**Objective:** Create a basic timer app following the existing patterns in `src/apps/`.

**Step-by-Step Implementation:**

```typescript
// src/apps/timer/Timer.tsx
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

/**
 * 🎯 LEARNING FOCUS: Component State Management
 * - useState for local component state
 * - useEffect for side effects (intervals)
 * - Event handling patterns
 */
export const Timer: React.FC = () => {
  // 📚 State Management Pattern
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // 📚 Side Effect Management
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      // 💡 OS Concept: Process scheduling simulation
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isRunning && seconds !== 0) {
      clearInterval(interval!);
    }
    
    // 🧹 Cleanup function - prevents memory leaks
    return () => clearInterval(interval!);
  }, [isRunning, seconds]);

  // 📚 Event Handler Pattern
  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  // 📚 Time Formatting Utility
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {/* 📚 UI Component Structure */}
      <div className="text-center">
        <div className="text-4xl font-mono mb-6 text-gray-800">
          {formatTime(seconds)}
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleStart}
            disabled={isRunning}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            <Play size={16} className="mr-2" />
            Start
          </button>
          
          <button
            onClick={handlePause}
            disabled={!isRunning}
            className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
          >
            <Pause size={16} className="mr-2" />
            Pause
          </button>
          
          <button
            onClick={handleReset}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <RotateCcw size={16} className="mr-2" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
```

**Registration Pattern:**
```typescript
// Add to src/stores/app/appStore.ts
registerApp({
  id: 'timer',
  name: 'Timer',
  icon: '⏱️',
  component: Timer,
  defaultSize: { width: 300, height: 200 }
});
```

### Exercise 2: Add Window Animations (🟡 Intermediate)

**Objective:** Implement smooth window transitions using Framer Motion.

**Key Concepts:**
- Animation lifecycle management
- Performance optimization
- User experience enhancement

**Implementation Example:**

```typescript
// src/components/window/AnimatedWindow.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowStore } from '@/stores/window/windowStore';

/**
 * 🎯 LEARNING FOCUS: Animation Patterns in UI Systems
 * - Entrance/exit animations
 * - Performance considerations
 * - Accessibility concerns
 */

const windowVariants = {
  // 📚 Initial state - window appears from center, scaled down
  initial: {
    scale: 0.8,
    opacity: 0,
    y: 20,
  },
  // 📚 Animate state - window scales to full size
  animate: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    }
  },
  // 📚 Exit state - window shrinks and fades
  exit: {
    scale: 0.8,
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
    }
  }
};

export const AnimatedWindow: React.FC<WindowProps> = ({ window, children }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={window.id}
        variants={windowVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="absolute bg-white rounded-lg shadow-2xl"
        style={{
          left: window.position.x,
          top: window.position.y,
          width: window.size.width,
          height: window.size.height,
          zIndex: window.zIndex,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
```

### Exercise 3: Memory Management (🔴 Advanced)

**Objective:** Add memory usage tracking and cleanup for closed windows.

**Advanced Concepts:**
- Memory leak prevention
- Resource cleanup patterns
- Performance monitoring

**Implementation Example:**

```typescript
// src/hooks/useMemoryTracker.ts
import { useEffect, useRef } from 'react';

/**
 * 🎯 LEARNING FOCUS: Memory Management in Web Applications
 * - Simulating OS memory management concepts
 * - Resource tracking and cleanup
 * - Performance monitoring patterns
 */

interface MemoryStats {
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
}

export const useMemoryTracker = (componentName: string) => {
  const cleanupFunctions = useRef<(() => void)[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();

  // 📚 Memory Tracking Pattern
  useEffect(() => {
    const trackMemory = () => {
      // 💡 In a real OS, this would track actual memory usage
      const memoryInfo = (performance as any).memory;
      if (memoryInfo) {
        console.log(`[${componentName}] Memory Usage:`, {
          used: Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024),
          total: Math.round(memoryInfo.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(memoryInfo.jsHeapSizeLimit / 1024 / 1024),
        });
      }
    };

    // 📚 Periodic Memory Monitoring
    intervalRef.current = setInterval(trackMemory, 5000);

    return () => {
      // 🧹 Cleanup: Clear interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // 🧹 Cleanup: Execute all registered cleanup functions
      cleanupFunctions.current.forEach(cleanup => cleanup());
      cleanupFunctions.current = [];
      
      console.log(`[${componentName}] Component unmounted and cleaned up`);
    };
  }, [componentName]);

  // 📚 Cleanup Registration Pattern
  const registerCleanup = (cleanupFn: () => void) => {
    cleanupFunctions.current.push(cleanupFn);
  };

  return { registerCleanup };
};

// Usage in components:
export const MemoryAwareComponent: React.FC = () => {
  const { registerCleanup } = useMemoryTracker('MemoryAwareComponent');

  useEffect(() => {
    // 📚 Resource that needs cleanup
    const subscription = someDataSource.subscribe(data => {
      // Handle data
    });

    // 📚 Register cleanup function
    registerCleanup(() => {
      subscription.unsubscribe();
    });
  }, [registerCleanup]);

  return <div>Memory-aware component content</div>;
};
```

**🎯 Challenge Extensions:**
1. Add memory usage visualization in the system monitor
2. Implement automatic garbage collection triggers
3. Create memory usage alerts for resource-heavy apps
## 📚 Best Practices Documentation

### Component Architecture Best Practices

#### 1. Single Responsibility Principle
```typescript
// ❌ Bad: Component doing too many things
const BadApp = () => {
  const [data, setData] = useState();
  const [ui, setUi] = useState();
  // ... lots of logic
  return <div>Complex UI with business logic mixed</div>;
};

// ✅ Good: Separated concerns
const GoodApp = () => {
  const data = useAppData(); // Custom hook for data logic
  const ui = useAppUI();     // Custom hook for UI logic
  return <AppView data={data} ui={ui} />; // Pure presentation
};
```

**Why this works:** Separation of concerns makes components easier to test, debug, and maintain. Each piece has a clear responsibility.

#### 2. State Management Patterns
```typescript
// ❌ Bad: Prop drilling
const Parent = () => {
  const [user, setUser] = useState();
  return <Child1 user={user} setUser={setUser} />;
};

// ✅ Good: Centralized state with Zustand
const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

const Parent = () => <Child1 />; // No props needed
const Child1 = () => {
  const { user, setUser } = useUserStore();
  // Direct access to state
};
```

**Why this works:** Centralized state eliminates prop drilling and makes state changes predictable and traceable.

#### 3. Performance Optimization Patterns
```typescript
// ❌ Bad: Unnecessary re-renders
const ExpensiveComponent = ({ data, onClick }) => {
  const processedData = expensiveCalculation(data); // Runs on every render
  return <div onClick={onClick}>{processedData}</div>;
};

// ✅ Good: Memoized calculations
const OptimizedComponent = memo(({ data, onClick }) => {
  const processedData = useMemo(() => 
    expensiveCalculation(data), [data]
  );
  
  const handleClick = useCallback(onClick, [onClick]);
  
  return <div onClick={handleClick}>{processedData}</div>;
});
```

**Why this works:** Memoization prevents unnecessary recalculations and re-renders, improving performance especially for complex UIs.

#### 4. Error Boundary Implementation
```typescript
// ✅ Robust error handling
class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
    // Log to monitoring service in production
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

**Why this works:** Error boundaries prevent the entire app from crashing when individual components fail, providing graceful degradation.

### Testing Best Practices

#### 1. Test-Driven Development (TDD) Approach
```typescript
// Step 1: Write failing test first
describe('Calculator', () => {
  it('should add two numbers correctly', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('='));
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
  });
});

// Step 2: Write minimal code to pass
// Step 3: Refactor while keeping tests green
```

**Why this works:** TDD ensures your code is testable from the start and provides confidence when refactoring.

#### 2. Integration Testing Strategy
```typescript
// ✅ Test user workflows, not implementation details
test('user can create and save a note', async () => {
  render(<MituOS />);
  
  // Open notepad
  fireEvent.click(screen.getByText('Notepad'));
  
  // Type content
  const textarea = screen.getByRole('textbox');
  fireEvent.change(textarea, { target: { value: 'My note' } });
  
  // Save
  fireEvent.keyDown(textarea, { key: 'S', ctrlKey: true });
  
  // Verify persistence
  expect(localStorage.getItem('notepad-content')).toBe('My note');
});
```

**Why this works:** Integration tests verify that components work together correctly, catching issues that unit tests might miss.

### Security Best Practices

#### 1. Input Sanitization
```typescript
// ✅ Always sanitize user input
const SafeNotepad = () => {
  const [content, setContent] = useState('');
  
  const handleChange = (e) => {
    // Sanitize input to prevent XSS
    const sanitized = DOMPurify.sanitize(e.target.value);
    setContent(sanitized);
  };
  
  return <textarea value={content} onChange={handleChange} />;
};
```

**Why this works:** Input sanitization prevents XSS attacks and ensures data integrity.

#### 2. Secure State Management
```typescript
// ✅ Validate state changes
const useSecureStore = create((set, get) => ({
  user: null,
  setUser: (user) => {
    // Validate user object structure
    if (!user || typeof user.id !== 'string') {
      throw new Error('Invalid user object');
    }
    set({ user });
  },
}));
```

**Why this works:** State validation prevents invalid data from corrupting your application state.

### Accessibility Best Practices

#### 1. Keyboard Navigation
```typescript
// ✅ Full keyboard support
const AccessibleWindow = ({ children, onClose }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Tab') {
      // Trap focus within window
      trapFocus(e);
    }
  };
  
  return (
    <div
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
};
```

**Why this works:** Keyboard navigation ensures your OS is usable by people who can't use a mouse.

#### 2. Screen Reader Support
```typescript
// ✅ Semantic HTML and ARIA labels
const AccessibleTaskbar = () => (
  <nav role="navigation" aria-label="Application taskbar">
    <ul role="list">
      {apps.map(app => (
        <li key={app.id} role="listitem">
          <button
            aria-label={`Launch ${app.name}`}
            onClick={() => launchApp(app.id)}
          >
            {app.name}
          </button>
        </li>
      ))}
    </ul>
  </nav>
);
```

**Why this works:** Proper ARIA labels and semantic HTML make your interface understandable to screen readers.

### Performance Monitoring

#### 1. Bundle Size Optimization
```typescript
// ✅ Lazy loading for better performance
const LazyCalculator = lazy(() => import('./Calculator'));
const LazyNotepad = lazy(() => import('./Notepad'));

const AppLauncher = ({ appId }) => {
  const AppComponent = useMemo(() => {
    switch(appId) {
      case 'calculator': return LazyCalculator;
      case 'notepad': return LazyNotepad;
      default: return null;
    }
  }, [appId]);
  
  return (
    <Suspense fallback={<AppLoadingSpinner />}>
      <AppComponent />
    </Suspense>
  );
};
```

**Why this works:** Lazy loading reduces initial bundle size and improves startup performance.

#### 2. Memory Management
```typescript
// ✅ Proper cleanup to prevent memory leaks
const useWindowManager = () => {
  useEffect(() => {
    const handleResize = () => updateWindowSizes();
    window.addEventListener('resize', handleResize);
    
    // Cleanup event listeners
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Cleanup intervals and timeouts
  useEffect(() => {
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);
};
```

**Why this works:** Proper cleanup prevents memory leaks that can slow down or crash your application over time.


## 🔐 Advanced OS Security Concepts in MituOS

### Security Model Mapping

#### 1. Access Control Lists (ACL)
```
Real OS ACL ←→ MituOS Permission System
├── User Permissions ←→ Component Access Rights
├── Group Permissions ←→ App Category Permissions  
├── File Permissions ←→ Data Access Control
└── Execute Permissions ←→ App Launch Rights
```

**Code Implementation:**
```typescript
// src/lib/security/accessControl.ts
interface Permission {
  resource: string;
  actions: ('read' | 'write' | 'execute' | 'delete')[];
  granted: boolean;
}

/**
 * 🎯 LEARNING FOCUS: Access Control Implementation
 * - Permission-based security model
 * - Resource protection patterns
 * - Security policy enforcement
 */
export class AccessControlManager {
  private permissions: Map<string, Permission[]> = new Map();

  // 📚 Permission Check Pattern
  hasPermission(userId: string, resource: string, action: string): boolean {
    const userPermissions = this.permissions.get(userId) || [];
    return userPermissions.some(p => 
      p.resource === resource && 
      p.actions.includes(action as any) && 
      p.granted
    );
  }

  // 📚 Secure Resource Access
  secureAccess<T>(userId: string, resource: string, action: string, callback: () => T): T | null {
    if (this.hasPermission(userId, resource, action)) {
      return callback();
    }
    console.warn(`Access denied: ${userId} cannot ${action} ${resource}`);
    return null;
  }
}
```

#### 2. Sandboxing and Isolation
```
Real OS Sandboxing ←→ MituOS App Isolation
├── Process Isolation ←→ Component Boundary Enforcement
├── Memory Protection ←→ State Isolation Patterns
├── File System Isolation ←→ Data Namespace Separation
└── Network Isolation ←→ API Access Control
```

**Implementation Example:**
```typescript
// src/lib/security/sandbox.ts
interface SandboxConfig {
  allowedAPIs: string[];
  memoryLimit: number;
  storageQuota: number;
  networkAccess: boolean;
}

/**
 * 🎯 LEARNING FOCUS: Application Sandboxing
 * - Resource limitation patterns
 * - API access control
 * - Security boundary enforcement
 */
export class AppSandbox {
  constructor(private config: SandboxConfig) {}

  // 📚 API Access Control Pattern
  executeInSandbox<T>(appId: string, operation: () => T): Promise<T> {
    return new Promise((resolve, reject) => {
      try {
        // 💡 Simulate resource monitoring
        const startMemory = this.getCurrentMemoryUsage();
        
        const result = operation();
        
        const endMemory = this.getCurrentMemoryUsage();
        const memoryUsed = endMemory - startMemory;
        
        if (memoryUsed > this.config.memoryLimit) {
          throw new Error(`Memory limit exceeded: ${memoryUsed}MB > ${this.config.memoryLimit}MB`);
        }
        
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  private getCurrentMemoryUsage(): number {
    // 💡 Browser memory API simulation
    return (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0;
  }
}
```

## ⚡ Real-Time System Concepts

### Real-Time Processing Patterns

#### 1. Task Scheduling Algorithms
```
Real OS Scheduling ←→ MituOS Priority Management
├── Round Robin ←→ Component Update Cycles
├── Priority Queue ←→ Window Z-Index Management
├── Deadline Scheduling ←→ Animation Frame Scheduling
└── Rate Monotonic ←→ Periodic Task Management
```

**Implementation:**
```typescript
// src/lib/scheduler/taskScheduler.ts
interface Task {
  id: string;
  priority: number;
  deadline: number;
  execute: () => void;
  period?: number; // For periodic tasks
}

/**
 * 🎯 LEARNING FOCUS: Real-Time Task Scheduling
 * - Priority-based scheduling algorithms
 * - Deadline management
 * - Resource allocation strategies
 */
export class RealTimeScheduler {
  private taskQueue: Task[] = [];
  private running = false;

  // 📚 Priority Queue Implementation
  addTask(task: Task): void {
    this.taskQueue.push(task);
    // Sort by priority (higher number = higher priority)
    this.taskQueue.sort((a, b) => b.priority - a.priority);
  }

  // 📚 Deadline-Aware Scheduling
  start(): void {
    if (this.running) return;
    this.running = true;

    const scheduleNext = () => {
      if (!this.running || this.taskQueue.length === 0) return;

      const now = Date.now();
      const nextTask = this.taskQueue.find(task => task.deadline > now);

      if (nextTask) {
        const index = this.taskQueue.indexOf(nextTask);
        this.taskQueue.splice(index, 1);

        try {
          nextTask.execute();
          
          // 💡 Re-schedule periodic tasks
          if (nextTask.period) {
            this.addTask({
              ...nextTask,
              deadline: now + nextTask.period
            });
          }
        } catch (error) {
          console.error(`Task ${nextTask.id} failed:`, error);
        }
      }

      // 📚 Use requestAnimationFrame for smooth scheduling
      requestAnimationFrame(scheduleNext);
    };

    scheduleNext();
  }
}
```

#### 2. Interrupt Handling Simulation
```
Real OS Interrupts ←→ MituOS Event System
├── Hardware Interrupts ←→ DOM Events
├── Software Interrupts ←→ Custom Events
├── Interrupt Handlers ←→ Event Listeners
└── Interrupt Priority ←→ Event Bubbling Control
```

**Code Example:**
```typescript
// src/lib/events/interruptHandler.ts
interface Interrupt {
  type: string;
  priority: number;
  handler: (data: any) => void;
  maskable: boolean;
}

/**
 * 🎯 LEARNING FOCUS: Interrupt Handling Patterns
 * - Priority-based interrupt processing
 * - Interrupt masking and nesting
 * - System responsiveness optimization
 */
export class InterruptController {
  private handlers: Map<string, Interrupt[]> = new Map();
  private maskedInterrupts: Set<string> = new Set();
  private processingStack: string[] = [];

  // 📚 Interrupt Registration Pattern
  registerHandler(interrupt: Interrupt): void {
    const existing = this.handlers.get(interrupt.type) || [];
    existing.push(interrupt);
    // Sort by priority for efficient processing
    existing.sort((a, b) => b.priority - a.priority);
    this.handlers.set(interrupt.type, existing);
  }

  // 📚 Interrupt Processing with Priority
  async triggerInterrupt(type: string, data: any): Promise<void> {
    // Check if interrupt is masked
    if (this.maskedInterrupts.has(type)) {
      console.log(`Interrupt ${type} is masked, queuing for later`);
      return;
    }

    const handlers = this.handlers.get(type) || [];
    this.processingStack.push(type);

    try {
      // 💡 Process handlers in priority order
      for (const handler of handlers) {
        if (!handler.maskable || !this.maskedInterrupts.has(type)) {
          await handler.handler(data);
        }
      }
    } finally {
      this.processingStack.pop();
    }
  }

  // 📚 Interrupt Masking for Critical Sections
  maskInterrupt(type: string): void {
    this.maskedInterrupts.add(type);
  }

  unmaskInterrupt(type: string): void {
    this.maskedInterrupts.delete(type);
  }
}
```

## 🌐 Distributed System Patterns

### Microservices Architecture in Frontend

#### 1. Service Discovery and Communication
```
Distributed Services ←→ MituOS App Ecosystem
├── Service Registry ←→ App Registry Store
├── Load Balancing ←→ Resource Distribution
├── Circuit Breaker ←→ Error Boundary Pattern
└── API Gateway ←→ Centralized App Communication
```

**Implementation:**
```typescript
// src/lib/distributed/serviceRegistry.ts
interface ServiceEndpoint {
  id: string;
  name: string;
  version: string;
  health: 'healthy' | 'unhealthy' | 'degraded';
  capabilities: string[];
  lastHeartbeat: number;
}

/**
 * 🎯 LEARNING FOCUS: Service Discovery Patterns
 * - Dynamic service registration
 * - Health monitoring
 * - Load balancing strategies
 */
export class ServiceRegistry {
  private services: Map<string, ServiceEndpoint> = new Map();
  private healthCheckInterval: NodeJS.Timeout;

  constructor() {
    // 📚 Periodic Health Checks
    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks();
    }, 30000); // Check every 30 seconds
  }

  // 📚 Service Registration Pattern
  registerService(service: ServiceEndpoint): void {
    service.lastHeartbeat = Date.now();
    this.services.set(service.id, service);
    console.log(`Service registered: ${service.name} v${service.version}`);
  }

  // 📚 Service Discovery with Load Balancing
  discoverService(capability: string): ServiceEndpoint | null {
    const availableServices = Array.from(this.services.values())
      .filter(service => 
        service.capabilities.includes(capability) && 
        service.health === 'healthy'
      );

    if (availableServices.length === 0) return null;

    // 💡 Simple round-robin load balancing
    const randomIndex = Math.floor(Math.random() * availableServices.length);
    return availableServices[randomIndex];
  }

  private async performHealthChecks(): Promise<void> {
    const now = Date.now();
    const healthTimeout = 60000; // 1 minute

    for (const [id, service] of this.services.entries()) {
      if (now - service.lastHeartbeat > healthTimeout) {
        service.health = 'unhealthy';
        console.warn(`Service ${service.name} marked as unhealthy`);
      }
    }
  }
}
```

#### 2. Event-Driven Architecture
```
Event Sourcing ←→ MituOS State Management
├── Event Store ←→ Action History Log
├── Event Handlers ←→ Reducer Functions
├── Snapshots ←→ State Persistence
└── Replay ←→ Time Travel Debugging
```

**Advanced Implementation:**
```typescript
// src/lib/events/eventSourcing.ts
interface DomainEvent {
  id: string;
  type: string;
  aggregateId: string;
  data: any;
  timestamp: number;
  version: number;
}

/**
 * 🎯 LEARNING FOCUS: Event Sourcing Patterns
 * - Immutable event logs
 * - State reconstruction from events
 * - Temporal queries and debugging
 */
export class EventStore {
  private events: DomainEvent[] = [];
  private snapshots: Map<string, any> = new Map();
  private eventHandlers: Map<string, ((event: DomainEvent) => void)[]> = new Map();

  // 📚 Event Persistence Pattern
  async appendEvent(event: Omit<DomainEvent, 'id' | 'timestamp'>): Promise<void> {
    const domainEvent: DomainEvent = {
      ...event,
      id: this.generateId(),
      timestamp: Date.now(),
    };

    this.events.push(domainEvent);
    
    // 💡 Trigger event handlers
    const handlers = this.eventHandlers.get(event.type) || [];
    handlers.forEach(handler => handler(domainEvent));

    // 📚 Create snapshot every 100 events for performance
    if (this.events.length % 100 === 0) {
      await this.createSnapshot(event.aggregateId);
    }
  }

  // 📚 State Reconstruction Pattern
  async getAggregateState(aggregateId: string, upToVersion?: number): Promise<any> {
    // Start with latest snapshot
    let state = this.snapshots.get(aggregateId) || {};
    
    // Apply events since snapshot
    const relevantEvents = this.events
      .filter(e => e.aggregateId === aggregateId)
      .filter(e => upToVersion ? e.version <= upToVersion : true)
      .sort((a, b) => a.version - b.version);

    return relevantEvents.reduce((currentState, event) => {
      return this.applyEvent(currentState, event);
    }, state);
  }

  // 📚 Time Travel Debugging
  async replayEvents(fromTimestamp: number, toTimestamp: number): Promise<DomainEvent[]> {
    return this.events.filter(e => 
      e.timestamp >= fromTimestamp && e.timestamp <= toTimestamp
    );
  }

  private applyEvent(state: any, event: DomainEvent): any {
    // 💡 Event-specific state transformations
    switch (event.type) {
      case 'WindowCreated':
        return { ...state, windows: [...(state.windows || []), event.data] };
      case 'WindowClosed':
        return { ...state, windows: state.windows?.filter((w: any) => w.id !== event.data.id) };
      default:
        return state;
    }
  }

  private async createSnapshot(aggregateId: string): Promise<void> {
    const currentState = await this.getAggregateState(aggregateId);
    this.snapshots.set(aggregateId, currentState);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

## 🚀 Performance Optimization Techniques

### Advanced Performance Patterns

#### 1. Memory Pool Management
```typescript
// src/lib/performance/memoryPool.ts
/**
 * 🎯 LEARNING FOCUS: Memory Pool Optimization
 * - Object reuse patterns
 * - Garbage collection reduction
 * - Memory fragmentation prevention
 */
export class MemoryPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  private resetFn: (obj: T) => void;

  constructor(createFn: () => T, resetFn: (obj: T) => void, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    
    // 📚 Pre-allocate objects
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(createFn());
    }
  }

  // 📚 Object Acquisition Pattern
  acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    // 💡 Create new object if pool is empty
    return this.createFn();
  }

  // 📚 Object Return Pattern
  release(obj: T): void {
    this.resetFn(obj);
    this.pool.push(obj);
  }
}

// Usage example for window objects
const windowPool = new MemoryPool(
  () => ({ id: '', title: '', content: null, position: { x: 0, y: 0 } }),
  (window) => {
    window.id = '';
    window.title = '';
    window.content = null;
    window.position = { x: 0, y: 0 };
  }
);
```

#### 2. Lazy Loading and Code Splitting
```typescript
// src/lib/performance/lazyLoader.ts
/**
 * 🎯 LEARNING FOCUS: Dynamic Loading Patterns
 * - Code splitting strategies
 * - Resource optimization
 * - User experience enhancement
 */
export class LazyAppLoader {
  private loadedApps: Map<string, any> = new Map();
  private loadingPromises: Map<string, Promise<any>> = new Map();

  // 📚 Dynamic Import Pattern
  async loadApp(appId: string): Promise<any> {
    // Return cached app if already loaded
    if (this.loadedApps.has(appId)) {
      return this.loadedApps.get(appId);
    }

    // Return existing promise if already loading
    if (this.loadingPromises.has(appId)) {
      return this.loadingPromises.get(appId);
    }

    // 💡 Create loading promise
    const loadingPromise = this.dynamicImport(appId);
    this.loadingPromises.set(appId, loadingPromise);

    try {
      const app = await loadingPromise;
      this.loadedApps.set(appId, app);
      this.loadingPromises.delete(appId);
      return app;
    } catch (error) {
      this.loadingPromises.delete(appId);
      throw error;
    }
  }

  private async dynamicImport(appId: string): Promise<any> {
    // 📚 Dynamic import with error handling
    switch (appId) {
      case 'notepad':
        return import('@/apps/notepad/Notepad');
      case 'calculator':
        return import('@/apps/calculator/Calculator');
      case 'file-manager':
        return import('@/apps/file-manager/FileManager');
      default:
        throw new Error(`Unknown app: ${appId}`);
    }
  }
}
```


## 🎮 Advanced Interactive Examples

### Example 9: Custom App Development Workshop (🟢 Beginner)

Learn to create your own app from scratch with step-by-step guidance:

```typescript
// 📝 Step 1: Create app component structure
// src/apps/my-app/MyApp.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface MyAppProps {
  windowId: string;
}

export const MyApp: React.FC<MyAppProps> = ({ windowId }) => {
  // 🎯 Learning Point: Component state management
  const [content, setContent] = useState('Hello MituOS!');
  
  // 🎯 Learning Point: Event handling in desktop apps
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  return (
    <motion.div 
      className="p-4 h-full bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-lg font-bold mb-4">My Custom App</h2>
      
      {/* 🎯 Learning Point: Form controls in desktop environment */}
      <div className="space-y-4">
        <input
          type="text"
          value={content}
          onChange={handleContentChange}
          className="w-full p-2 border rounded"
          placeholder="Type something..."
        />
        
        <div className="p-4 bg-gray-100 rounded">
          <strong>Output:</strong> {content}
        </div>
      </div>
    </motion.div>
  );
};
```

**🎓 Educational Concepts:**
- **Component Architecture**: How desktop apps are structured as React components
- **State Management**: Local state vs global state in desktop applications
- **Event Handling**: Processing user interactions in a desktop environment
- **Animation Integration**: Using Framer Motion for smooth app transitions

### Example 10: Multi-Window Communication (🔴 Advanced)

Implement inter-window communication similar to OS inter-process communication:

```typescript
// 📡 Step 1: Create communication service
// src/lib/windowCommunication.ts

class WindowCommunicationService {
  private channels = new Map<string, Set<string>>();
  private messageHandlers = new Map<string, (data: any) => void>();

  // 🎯 Learning Point: Publisher-Subscriber pattern (like OS message queues)
  subscribe(windowId: string, channel: string, handler: (data: any) => void) {
    if (!this.channels.has(channel)) {
      this.channels.set(channel, new Set());
    }
    this.channels.get(channel)!.add(windowId);
    this.messageHandlers.set(`${windowId}:${channel}`, handler);
  }

  // 🎯 Learning Point: Broadcasting messages (like OS signals)
  broadcast(channel: string, data: any, senderWindowId: string) {
    const subscribers = this.channels.get(channel);
    if (subscribers) {
      subscribers.forEach(windowId => {
        if (windowId !== senderWindowId) {
          const handler = this.messageHandlers.get(`${windowId}:${channel}`);
          if (handler) {
            handler(data);
          }
        }
      });
    }
  }

  // 🎯 Learning Point: Cleanup (like process termination)
  unsubscribe(windowId: string, channel: string) {
    const subscribers = this.channels.get(channel);
    if (subscribers) {
      subscribers.delete(windowId);
      this.messageHandlers.delete(`${windowId}:${channel}`);
    }
  }
}

export const windowComm = new WindowCommunicationService();
```

**🎓 Educational Concepts:**
- **Inter-Process Communication**: How processes communicate in real operating systems
- **Message Queues**: Asynchronous communication patterns
- **Event-Driven Architecture**: Reactive programming in desktop environments
- **Resource Management**: Proper cleanup and memory management

### Example 11: Virtual File System Implementation (🔴 Advanced)

Create a virtual file system that mimics real OS file operations:

```typescript
// 🗂️ Step 1: Define file system structure
// src/lib/virtualFileSystem.ts

interface VirtualFile {
  id: string;
  name: string;
  type: 'file' | 'directory';
  content?: string;
  size: number;
  created: Date;
  modified: Date;
  parent?: string;
  children?: string[];
  permissions: {
    read: boolean;
    write: boolean;
    execute: boolean;
  };
}

class VirtualFileSystem {
  private files = new Map<string, VirtualFile>();
  private currentDirectory = '/';

  constructor() {
    // 🎯 Learning Point: Initialize root directory (like OS boot process)
    this.createDirectory('/', 'root');
  }

  // 🎯 Learning Point: File creation (like OS system calls)
  createFile(path: string, name: string, content: string = ''): string {
    const fileId = `${path}/${name}`.replace('//', '/');
    const file: VirtualFile = {
      id: fileId,
      name,
      type: 'file',
      content,
      size: content.length,
      created: new Date(),
      modified: new Date(),
      parent: path,
      permissions: { read: true, write: true, execute: false }
    };

    this.files.set(fileId, file);
    
    // Update parent directory
    const parent = this.files.get(path);
    if (parent && parent.type === 'directory') {
      parent.children = parent.children || [];
      parent.children.push(fileId);
    }

    return fileId;
  }

  // 🎯 Learning Point: Directory operations (like mkdir command)
  createDirectory(path: string, name: string): string {
    const dirId = `${path}/${name}`.replace('//', '/');
    const directory: VirtualFile = {
      id: dirId,
      name,
      type: 'directory',
      size: 0,
      created: new Date(),
      modified: new Date(),
      parent: path === '/' ? undefined : path,
      children: [],
      permissions: { read: true, write: true, execute: true }
    };

    this.files.set(dirId, directory);
    return dirId;
  }

  // 🎯 Learning Point: File reading (like OS file I/O)
  readFile(path: string): string | null {
    const file = this.files.get(path);
    if (file && file.type === 'file' && file.permissions.read) {
      return file.content || '';
    }
    return null;
  }

  // 🎯 Learning Point: Directory listing (like ls command)
  listDirectory(path: string): VirtualFile[] {
    const dir = this.files.get(path);
    if (dir && dir.type === 'directory' && dir.permissions.read) {
      return (dir.children || [])
        .map(childId => this.files.get(childId))
        .filter(Boolean) as VirtualFile[];
    }
    return [];
  }
}

export const vfs = new VirtualFileSystem();
```

**🎓 Educational Concepts:**
- **File System Architecture**: How operating systems organize and manage files
- **Inode Concepts**: File metadata and directory structures
- **Permissions System**: Access control in operating systems
- **Path Resolution**: How file paths are resolved in hierarchical systems

### Example 12: Process Scheduler Simulation (🔴 Advanced)

Implement a simple process scheduler to understand OS scheduling:

```typescript
// ⚡ Step 1: Define process structure
// src/lib/processScheduler.ts

interface Process {
  pid: string;
  name: string;
  priority: number;
  burstTime: number;
  remainingTime: number;
  state: 'ready' | 'running' | 'waiting' | 'terminated';
  createdAt: number;
  lastExecuted?: number;
}

class ProcessScheduler {
  private processes = new Map<string, Process>();
  private readyQueue: string[] = [];
  private runningProcess: string | null = null;
  private timeQuantum = 100; // milliseconds

  // 🎯 Learning Point: Process creation (like fork() system call)
  createProcess(name: string, burstTime: number, priority: number = 0): string {
    const pid = `proc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const process: Process = {
      pid,
      name,
      priority,
      burstTime,
      remainingTime: burstTime,
      state: 'ready',
      createdAt: Date.now()
    };

    this.processes.set(pid, process);
    this.addToReadyQueue(pid);
    
    return pid;
  }

  // 🎯 Learning Point: Priority-based scheduling
  private addToReadyQueue(pid: string) {
    const process = this.processes.get(pid);
    if (!process) return;

    // Insert based on priority (higher priority first)
    let insertIndex = this.readyQueue.length;
    for (let i = 0; i < this.readyQueue.length; i++) {
      const queueProcess = this.processes.get(this.readyQueue[i]);
      if (queueProcess && queueProcess.priority < process.priority) {
        insertIndex = i;
        break;
      }
    }
    
    this.readyQueue.splice(insertIndex, 0, pid);
    process.state = 'ready';
  }

  // 🎯 Learning Point: Context switching
  private contextSwitch() {
    if (this.runningProcess) {
      const currentProcess = this.processes.get(this.runningProcess);
      if (currentProcess && currentProcess.remainingTime > 0) {
        // Preempt current process
        this.addToReadyQueue(this.runningProcess);
      }
    }

    // Select next process
    if (this.readyQueue.length > 0) {
      this.runningProcess = this.readyQueue.shift()!;
      const nextProcess = this.processes.get(this.runningProcess);
      if (nextProcess) {
        nextProcess.state = 'running';
        nextProcess.lastExecuted = Date.now();
      }
    } else {
      this.runningProcess = null;
    }
  }

  // 🎯 Learning Point: Process execution simulation
  executeTimeSlice(): { completed: string[], running: string | null } {
    const completed: string[] = [];

    if (this.runningProcess) {
      const process = this.processes.get(this.runningProcess);
      if (process) {
        // Simulate execution
        const executionTime = Math.min(this.timeQuantum, process.remainingTime);
        process.remainingTime -= executionTime;

        if (process.remainingTime <= 0) {
          // Process completed
          process.state = 'terminated';
          completed.push(this.runningProcess);
          this.runningProcess = null;
        }
      }
    }

    // Schedule next process if needed
    if (!this.runningProcess && this.readyQueue.length > 0) {
      this.contextSwitch();
    }

    return { completed, running: this.runningProcess };
  }

  // 🎯 Learning Point: System monitoring
  getSystemStatus() {
    const processes = Array.from(this.processes.values());
    return {
      totalProcesses: processes.length,
      readyProcesses: processes.filter(p => p.state === 'ready').length,
      runningProcesses: processes.filter(p => p.state === 'running').length,
      terminatedProcesses: processes.filter(p => p.state === 'terminated').length,
      readyQueue: this.readyQueue.length,
      currentProcess: this.runningProcess
    };
  }
}

export const scheduler = new ProcessScheduler();
```

**🎓 Educational Concepts:**
- **Process Scheduling**: How operating systems manage CPU time allocation
- **Context Switching**: The mechanism of switching between processes
- **Priority Queues**: Data structures used in OS scheduling algorithms
- **Time Slicing**: Round-robin scheduling implementation

## 🔬 Hands-On Exercises

### Exercise 1: Build a Text Editor App
Create a fully functional text editor with the following features:
- File operations (new, open, save)
- Text formatting (bold, italic, font size)
- Find and replace functionality
- Auto-save capability

### Exercise 2: Implement Window Snapping
Add window snapping functionality similar to Windows Aero Snap:
- Drag to edges for half-screen snap
- Corner snapping for quarter-screen
- Keyboard shortcuts for window arrangement

### Exercise 3: Create a System Resource Monitor
Build a real-time system monitor that displays:
- Active applications and their resource usage
- Memory consumption visualization
- CPU usage simulation
- Network activity indicators

### Exercise 4: Design a Virtual Desktop System
Implement multiple virtual desktops:
- Switch between different desktop environments
- Move windows between desktops
- Desktop-specific wallpapers and settings


## 🎮 Advanced Interactive Learning Modules

### Module 1: Virtual Memory Management Simulator (🔴 Advanced)

**Objective**: Understand how operating systems manage virtual memory, page tables, and memory allocation.

```typescript
// src/learning-modules/memory-simulator.ts

interface MemoryPage {
  id: number;
  virtualAddress: number;
  physicalAddress: number | null;
  isLoaded: boolean;
  isDirty: boolean;
  lastAccessed: number;
  processId: string;
}

interface PageTableEntry {
  virtualPage: number;
  physicalFrame: number | null;
  present: boolean;
  dirty: boolean;
  accessed: boolean;
}

class VirtualMemoryManager {
  private pageTable: Map<number, PageTableEntry> = new Map();
  private physicalMemory: (MemoryPage | null)[] = [];
  private swapSpace: Map<number, MemoryPage> = new Map();
  private readonly PAGE_SIZE = 4096; // 4KB pages
  private readonly PHYSICAL_FRAMES = 64; // 256KB physical memory
  
  constructor() {
    // Initialize physical memory frames
    this.physicalMemory = new Array(this.PHYSICAL_FRAMES).fill(null);
  }

  /**
   * 🎓 LEARNING CONCEPT: Page Fault Handling
   * When a process accesses a virtual address that's not in physical memory,
   * the OS must handle the page fault by loading the page from storage.
   */
  handlePageFault(virtualAddress: number, processId: string): boolean {
    const virtualPage = Math.floor(virtualAddress / this.PAGE_SIZE);
    
    console.log(`📋 Page Fault: Process ${processId} accessing virtual page ${virtualPage}`);
    
    // Check if page exists in swap space
    if (this.swapSpace.has(virtualPage)) {
      return this.loadFromSwap(virtualPage, processId);
    }
    
    // Allocate new page
    return this.allocateNewPage(virtualPage, processId);
  }

  /**
   * 🎓 LEARNING CONCEPT: Page Replacement Algorithm (LRU)
   * When physical memory is full, we need to evict a page using
   * Least Recently Used (LRU) algorithm.
   */
  private findLRUFrame(): number {
    let lruFrame = 0;
    let oldestTime = Date.now();
    
    for (let i = 0; i < this.PHYSICAL_FRAMES; i++) {
      const page = this.physicalMemory[i];
      if (page && page.lastAccessed < oldestTime) {
        oldestTime = page.lastAccessed;
        lruFrame = i;
      }
    }
    
    return lruFrame;
  }

  private loadFromSwap(virtualPage: number, processId: string): boolean {
    const swappedPage = this.swapSpace.get(virtualPage);
    if (!swappedPage) return false;

    // Find free frame or evict using LRU
    let frameIndex = this.physicalMemory.findIndex(frame => frame === null);
    
    if (frameIndex === -1) {
      frameIndex = this.findLRUFrame();
      this.evictPage(frameIndex);
    }

    // Load page into physical memory
    const page: MemoryPage = {
      ...swappedPage,
      physicalAddress: frameIndex * this.PAGE_SIZE,
      isLoaded: true,
      lastAccessed: Date.now()
    };

    this.physicalMemory[frameIndex] = page;
    this.pageTable.set(virtualPage, {
      virtualPage,
      physicalFrame: frameIndex,
      present: true,
      dirty: false,
      accessed: true
    });

    this.swapSpace.delete(virtualPage);
    
    console.log(`✅ Page loaded from swap: Virtual ${virtualPage} → Physical Frame ${frameIndex}`);
    return true;
  }

  private evictPage(frameIndex: number): void {
    const page = this.physicalMemory[frameIndex];
    if (!page) return;

    const virtualPage = Math.floor(page.virtualAddress / this.PAGE_SIZE);
    
    // If page is dirty, write to swap
    if (page.isDirty) {
      this.swapSpace.set(virtualPage, { ...page, isLoaded: false });
      console.log(`💾 Page swapped out: Virtual ${virtualPage} (dirty)`);
    }

    // Update page table
    this.pageTable.set(virtualPage, {
      virtualPage,
      physicalFrame: null,
      present: false,
      dirty: page.isDirty,
      accessed: false
    });

    this.physicalMemory[frameIndex] = null;
  }

  /**
   * 🎓 LEARNING CONCEPT: Memory Translation
   * Convert virtual addresses to physical addresses using page tables
   */
  translateAddress(virtualAddress: number, processId: string): number | null {
    const virtualPage = Math.floor(virtualAddress / this.PAGE_SIZE);
    const offset = virtualAddress % this.PAGE_SIZE;
    
    const pageEntry = this.pageTable.get(virtualPage);
    
    if (!pageEntry || !pageEntry.present) {
      // Page fault - need to load page
      if (this.handlePageFault(virtualAddress, processId)) {
        const updatedEntry = this.pageTable.get(virtualPage);
        if (updatedEntry && updatedEntry.physicalFrame !== null) {
          return updatedEntry.physicalFrame * this.PAGE_SIZE + offset;
        }
      }
      return null; // Translation failed
    }
    
    // Update access time for LRU
    const frame = this.physicalMemory[pageEntry.physicalFrame!];
    if (frame) {
      frame.lastAccessed = Date.now();
      pageEntry.accessed = true;
    }
    
    return pageEntry.physicalFrame! * this.PAGE_SIZE + offset;
  }

  // Memory statistics for learning
  getMemoryStats() {
    const usedFrames = this.physicalMemory.filter(frame => frame !== null).length;
    const swappedPages = this.swapSpace.size;
    
    return {
      physicalMemoryUsage: `${usedFrames}/${this.PHYSICAL_FRAMES} frames`,
      swappedPages,
      pageTableEntries: this.pageTable.size,
      memoryUtilization: ((usedFrames / this.PHYSICAL_FRAMES) * 100).toFixed(1) + '%'
    };
  }
}

// Usage Example with Educational Commentary
export function createMemoryLearningDemo() {
  const vmm = new VirtualMemoryManager();
  
  console.log("🎓 Virtual Memory Management Demo");
  console.log("==================================");
  
  // Simulate process memory access patterns
  const processA = "proc_calculator";
  const processB = "proc_notepad";
  
  // Access pattern that will cause page faults
  const addresses = [0x1000, 0x2000, 0x3000, 0x1500, 0x2500];
  
  addresses.forEach((addr, index) => {
    console.log(`\n📍 Step ${index + 1}: Process ${processA} accessing address 0x${addr.toString(16)}`);
    const physicalAddr = vmm.translateAddress(addr, processA);
    
    if (physicalAddr !== null) {
      console.log(`✅ Translation successful: 0x${addr.toString(16)} → 0x${physicalAddr.toString(16)}`);
    } else {
      console.log(`❌ Translation failed for address 0x${addr.toString(16)}`);
    }
    
    console.log("📊 Memory Stats:", vmm.getMemoryStats());
  });
}
```

**🎓 Key Learning Outcomes:**
- **Virtual Memory**: How processes see a larger address space than physical memory
- **Page Faults**: What happens when accessing non-resident pages
- **Page Replacement**: LRU algorithm for managing limited physical memory
- **Address Translation**: Converting virtual to physical addresses
- **Swap Space**: Using storage as extended memory

### Module 2: Process Synchronization & Deadlock Prevention (🔴 Advanced)

**Objective**: Learn about process synchronization, mutexes, semaphores, and deadlock prevention.

```typescript
// src/learning-modules/synchronization-simulator.ts

interface Resource {
  id: string;
  name: string;
  isLocked: boolean;
  lockedBy: string | null;
  waitQueue: string[];
}

interface ProcessState {
  id: string;
  name: string;
  state: 'ready' | 'running' | 'blocked' | 'terminated';
  heldResources: string[];
  requestedResources: string[];
  priority: number;
}

class DeadlockDetector {
  private processes: Map<string, ProcessState> = new Map();
  private resources: Map<string, Resource> = new Map();
  private waitForGraph: Map<string, string[]> = new Map();

  /**
   * 🎓 LEARNING CONCEPT: Banker's Algorithm for Deadlock Prevention
   * This algorithm ensures that resource allocation never leads to deadlock
   * by checking if the system remains in a "safe state" after allocation.
   */
  checkSafeState(processId: string, resourceIds: string[]): boolean {
    // Create a simulation of the allocation
    const simulation = this.createSimulation();
    
    // Try to allocate resources in simulation
    for (const resourceId of resourceIds) {
      if (!this.canAllocateResource(simulation, processId, resourceId)) {
        console.log(`🚫 Unsafe allocation: ${processId} requesting ${resourceId}`);
        return false;
      }
    }
    
    // Check if we can find a safe sequence
    const safeSequence = this.findSafeSequence(simulation);
    
    if (safeSequence.length > 0) {
      console.log(`✅ Safe state maintained. Safe sequence: ${safeSequence.join(' → ')}`);
      return true;
    }
    
    console.log(`⚠️ Potential deadlock detected for allocation to ${processId}`);
    return false;
  }

  /**
   * 🎓 LEARNING CONCEPT: Wait-For Graph for Deadlock Detection
   * A directed graph where edges represent waiting relationships.
   * A cycle in this graph indicates a deadlock.
   */
  detectDeadlock(): string[] {
    this.buildWaitForGraph();
    
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const deadlockedProcesses: string[] = [];
    
    for (const processId of this.processes.keys()) {
      if (!visited.has(processId)) {
        if (this.hasCycleDFS(processId, visited, recursionStack, deadlockedProcesses)) {
          console.log(`🔄 Deadlock cycle detected involving: ${deadlockedProcesses.join(', ')}`);
          return deadlockedProcesses;
        }
      }
    }
    
    return [];
  }

  private buildWaitForGraph(): void {
    this.waitForGraph.clear();
    
    for (const [processId, process] of this.processes) {
      const waitingFor: string[] = [];
      
      // Check what this process is waiting for
      for (const resourceId of process.requestedResources) {
        const resource = this.resources.get(resourceId);
        if (resource && resource.isLocked && resource.lockedBy !== processId) {
          waitingFor.push(resource.lockedBy!);
        }
      }
      
      this.waitForGraph.set(processId, waitingFor);
    }
  }

  private hasCycleDFS(
    processId: string, 
    visited: Set<string>, 
    recursionStack: Set<string>,
    deadlockedProcesses: string[]
  ): boolean {
    visited.add(processId);
    recursionStack.add(processId);
    
    const neighbors = this.waitForGraph.get(processId) || [];
    
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (this.hasCycleDFS(neighbor, visited, recursionStack, deadlockedProcesses)) {
          deadlockedProcesses.push(processId);
          return true;
        }
      } else if (recursionStack.has(neighbor)) {
        // Cycle found
        deadlockedProcesses.push(processId, neighbor);
        return true;
      }
    }
    
    recursionStack.delete(processId);
    return false;
  }

  /**
   * 🎓 LEARNING CONCEPT: Resource Allocation with Prevention
   * Implement resource allocation that prevents deadlock using
   * ordered resource allocation strategy.
   */
  allocateResource(processId: string, resourceId: string): boolean {
    const process = this.processes.get(processId);
    const resource = this.resources.get(resourceId);
    
    if (!process || !resource) {
      console.log(`❌ Invalid process (${processId}) or resource (${resourceId})`);
      return false;
    }
    
    if (resource.isLocked) {
      if (resource.lockedBy === processId) {
        console.log(`ℹ️ Process ${processId} already holds resource ${resourceId}`);
        return true;
      }
      
      // Check for potential deadlock before adding to wait queue
      if (!this.checkSafeState(processId, [resourceId])) {
        console.log(`🚫 Resource allocation denied to prevent deadlock`);
        return false;
      }
      
      // Add to wait queue
      resource.waitQueue.push(processId);
      process.requestedResources.push(resourceId);
      process.state = 'blocked';
      
      console.log(`⏳ Process ${processId} waiting for resource ${resourceId}`);
      return false;
    }
    
    // Allocate resource
    resource.isLocked = true;
    resource.lockedBy = processId;
    process.heldResources.push(resourceId);
    process.state = 'running';
    
    console.log(`✅ Resource ${resourceId} allocated to process ${processId}`);
    return true;
  }

  releaseResource(processId: string, resourceId: string): void {
    const process = this.processes.get(processId);
    const resource = this.resources.get(resourceId);
    
    if (!process || !resource || resource.lockedBy !== processId) {
      console.log(`❌ Cannot release resource ${resourceId} from process ${processId}`);
      return;
    }
    
    // Release resource
    resource.isLocked = false;
    resource.lockedBy = null;
    process.heldResources = process.heldResources.filter(r => r !== resourceId);
    
    console.log(`🔓 Resource ${resourceId} released by process ${processId}`);
    
    // Wake up waiting process (FIFO)
    if (resource.waitQueue.length > 0) {
      const nextProcessId = resource.waitQueue.shift()!;
      const nextProcess = this.processes.get(nextProcessId);
      
      if (nextProcess) {
        nextProcess.requestedResources = nextProcess.requestedResources.filter(r => r !== resourceId);
        this.allocateResource(nextProcessId, resourceId);
      }
    }
  }

  // Add process and resource management methods
  addProcess(id: string, name: string, priority: number = 0): void {
    this.processes.set(id, {
      id,
      name,
      state: 'ready',
      heldResources: [],
      requestedResources: [],
      priority
    });
  }

  addResource(id: string, name: string): void {
    this.resources.set(id, {
      id,
      name,
      isLocked: false,
      lockedBy: null,
      waitQueue: []
    });
  }

  getSystemState() {
    return {
      processes: Array.from(this.processes.values()),
      resources: Array.from(this.resources.values()),
      waitForGraph: Object.fromEntries(this.waitForGraph)
    };
  }
}

// Educational Demo
export function createSynchronizationDemo() {
  const detector = new DeadlockDetector();
  
  console.log("🎓 Process Synchronization & Deadlock Prevention Demo");
  console.log("====================================================");
  
  // Setup system
  detector.addProcess("P1", "Calculator", 1);
  detector.addProcess("P2", "Notepad", 2);
  detector.addProcess("P3", "File Manager", 1);
  
  detector.addResource("R1", "Printer");
  detector.addResource("R2", "Scanner");
  detector.addResource("R3", "Network");
  
  // Simulate resource allocation that could lead to deadlock
  console.log("\n📋 Step 1: P1 requests Printer");
  detector.allocateResource("P1", "R1");
  
  console.log("\n📋 Step 2: P2 requests Scanner");
  detector.allocateResource("P2", "R2");
  
  console.log("\n📋 Step 3: P1 requests Scanner (will wait)");
  detector.allocateResource("P1", "R2");
  
  console.log("\n📋 Step 4: P2 requests Printer (potential deadlock!)");
  detector.allocateResource("P2", "R1");
  
  // Check for deadlock
  console.log("\n🔍 Checking for deadlock...");
  const deadlocked = detector.detectDeadlock();
  
  if (deadlocked.length > 0) {
    console.log(`⚠️ Deadlock detected! Processes: ${deadlocked.join(', ')}`);
  } else {
    console.log("✅ No deadlock detected");
  }
  
  console.log("\n📊 Final System State:");
  console.log(JSON.stringify(detector.getSystemState(), null, 2));
}
```

**🎓 Key Learning Outcomes:**
- **Deadlock Conditions**: Understanding the four necessary conditions
- **Prevention vs Detection**: Different strategies for handling deadlocks
- **Banker's Algorithm**: Safe state checking for resource allocation
- **Wait-For Graphs**: Visual representation of process dependencies
- **Resource Ordering**: Prevention strategy using ordered allocation

### Module 3: File System Implementation with Journaling (🔴 Advanced)

**Objective**: Build a complete file system with journaling for crash recovery.

```typescript
// src/learning-modules/filesystem-simulator.ts

interface INode {
  id: number;
  name: string;
  type: 'file' | 'directory';
  size: number;
  permissions: number;
  owner: string;
  created: Date;
  modified: Date;
  accessed: Date;
  blocks: number[];
  parent: number | null;
  children: number[];
}

interface DataBlock {
  id: number;
  data: Uint8Array;
  checksum: string;
  isAllocated: boolean;
}

interface JournalEntry {
  id: number;
  timestamp: Date;
  operation: 'create' | 'delete' | 'modify' | 'move';
  target: number; // inode id
  oldData?: any;
  newData?: any;
  committed: boolean;
}

/**
 * 🎓 LEARNING CONCEPT: Journaling File System
 * A journaling file system maintains a journal (log) of changes
 * before they are committed to the main file system structures.
 * This enables recovery from crashes and maintains consistency.
 */
class JournalingFileSystem {
  private inodes: Map<number, INode> = new Map();
  private dataBlocks: Map<number, DataBlock> = new Map();
  private journal: JournalEntry[] = [];
  private freeInodes: number[] = [];
  private freeBlocks: number[] = [];
  private nextInodeId = 1;
  private nextBlockId = 1;
  private nextJournalId = 1;
  
  constructor(private totalInodes = 1024, private totalBlocks = 4096) {
    this.initializeFileSystem();
  }

  private initializeFileSystem(): void {
    // Initialize free lists
    for (let i = 1; i <= this.totalInodes; i++) {
      this.freeInodes.push(i);
    }
    for (let i = 1; i <= this.totalBlocks; i++) {
      this.freeBlocks.push(i);
    }
    
    // Create root directory (inode 0)
    this.createRootDirectory();
    
    console.log(`🗂️ File system initialized: ${this.totalInodes} inodes, ${this.totalBlocks} blocks`);
  }

  private createRootDirectory(): void {
    const rootInode: INode = {
      id: 0,
      name: '/',
      type: 'directory',
      size: 0,
      permissions: 0o755,
      owner: 'root',
      created: new Date(),
      modified: new Date(),
      accessed: new Date(),
      blocks: [],
      parent: null,
      children: []
    };
    
    this.inodes.set(0, rootInode);
    this.freeInodes.shift(); // Remove inode 0 from free list
  }

  /**
   * 🎓 LEARNING CONCEPT: Write-Ahead Logging (WAL)
   * All changes are first written to the journal before being
   * applied to the actual file system structures.
   */
  private writeToJournal(entry: Omit<JournalEntry, 'id' | 'timestamp' | 'committed'>): number {
    const journalEntry: JournalEntry = {
      id: this.nextJournalId++,
      timestamp: new Date(),
      committed: false,
      ...entry
    };
    
    this.journal.push(journalEntry);
    console.log(`📝 Journal entry ${journalEntry.id}: ${entry.operation} on inode ${entry.target}`);
    
    return journalEntry.id;
  }

  private commitJournalEntry(journalId: number): void {
    const entry = this.journal.find(e => e.id === journalId);
    if (entry) {
      entry.committed = true;
      console.log(`✅ Journal entry ${journalId} committed`);
    }
  }

  /**
   * 🎓 LEARNING CONCEPT: Crash Recovery
   * After a crash, the file system can recover by replaying
   * uncommitted journal entries or rolling back partial changes.
   */
  recoverFromCrash(): void {
    console.log("🔄 Starting crash recovery...");
    
    const uncommittedEntries = this.journal.filter(e => !e.committed);
    
    if (uncommittedEntries.length === 0) {
      console.log("✅ No recovery needed - all operations were committed");
      return;
    }
    
    console.log(`🔧 Found ${uncommittedEntries.length} uncommitted operations`);
    
    // Replay or rollback uncommitted entries
    for (const entry of uncommittedEntries) {
      console.log(`🔄 Recovering operation: ${entry.operation} on inode ${entry.target}`);
      
      switch (entry.operation) {
        case 'create':
          this.rollbackCreate(entry);
          break;
        case 'delete':
          this.rollbackDelete(entry);
          break;
        case 'modify':
          this.rollbackModify(entry);
          break;
      }
    }
    
    // Clean up journal
    this.journal = this.journal.filter(e => e.committed);
    console.log("✅ Crash recovery completed");
  }

  /**
   * 🎓 LEARNING CONCEPT: File Creation with Atomic Operations
   * File creation involves multiple steps that must all succeed
   * or all fail to maintain consistency.
   */
  createFile(parentPath: string, fileName: string, content: string = ''): number | null {
    const parentInode = this.resolvePath(parentPath);
    if (!parentInode || parentInode.type !== 'directory') {
      console.log(`❌ Parent directory not found: ${parentPath}`);
      return null;
    }
    
    // Check if file already exists
    if (this.findChildByName(parentInode, fileName)) {
      console.log(`❌ File already exists: ${fileName}`);
      return null;
    }
    
    // Allocate inode
    const inodeId = this.freeInodes.shift();
    if (inodeId === undefined) {
      console.log("❌ No free inodes available");
      return null;
    }
    
    // Start journal transaction
    const journalId = this.writeToJournal({
      operation: 'create',
      target: inodeId,
      newData: { parentId: parentInode.id, fileName, content }
    });
    
    try {
      // Create inode
      const newInode: INode = {
        id: inodeId,
        name: fileName,
        type: 'file',
        size: content.length,
        permissions: 0o644,
        owner: 'user',
        created: new Date(),
        modified: new Date(),
        accessed: new Date(),
        blocks: [],
        parent: parentInode.id,
        children: []
      };
      
      // Allocate data blocks if needed
      if (content.length > 0) {
        const blocksNeeded = Math.ceil(content.length / 4096);
        const allocatedBlocks = this.allocateDataBlocks(blocksNeeded);
        
        if (allocatedBlocks.length < blocksNeeded) {
          throw new Error("Insufficient disk space");
        }
        
        newInode.blocks = allocatedBlocks;
        this.writeDataToBlocks(allocatedBlocks, content);
      }
      
      // Update parent directory
      parentInode.children.push(inodeId);
      parentInode.modified = new Date();
      
      // Store inode
      this.inodes.set(inodeId, newInode);
      
      // Commit transaction
      this.commitJournalEntry(journalId);
      
      console.log(`✅ File created: ${parentPath}/${fileName} (inode ${inodeId})`);
      return inodeId;
      
    } catch (error) {
      console.log(`❌ File creation failed: ${error}`);
      // Rollback will be handled by recovery if system crashes
      return null;
    }
  }

  /**
   * 🎓 LEARNING CONCEPT: Directory Traversal and Path Resolution
   * Converting file paths to inode references through directory traversal
   */
  private resolvePath(path: string): INode | null {
    if (path === '/') {
      return this.inodes.get(0) || null;
    }
    
    const parts = path.split('/').filter(part => part !== '');
    let currentInode = this.inodes.get(0); // Start from root
    
    for (const part of parts) {
      if (!currentInode || currentInode.type !== 'directory') {
        return null;
      }
      
      const childInode = this.findChildByName(currentInode, part);
      if (!childInode) {
        return null;
      }
      
      currentInode = childInode;
      currentInode.accessed = new Date(); // Update access time
    }
    
    return currentInode;
  }

  private findChildByName(parentInode: INode, name: string): INode | null {
    for (const childId of parentInode.children) {
      const childInode = this.inodes.get(childId);
      if (childInode && childInode.name === name) {
        return childInode;
      }
    }
    return null;
  }

  private allocateDataBlocks(count: number): number[] {
    const allocated: number[] = [];
    
    for (let i = 0; i < count && this.freeBlocks.length > 0; i++) {
      const blockId = this.freeBlocks.shift()!;
      allocated.push(blockId);
      
      // Initialize data block
      this.dataBlocks.set(blockId, {
        id: blockId,
        data: new Uint8Array(4096),
        checksum: '',
        isAllocated: true
      });
    }
    
    return allocated;
  }

  private writeDataToBlocks(blockIds: number[], content: string): void {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    
    let offset = 0;
    for (const blockId of blockIds) {
      const block = this.dataBlocks.get(blockId);
      if (!block) continue;
      
      const chunkSize = Math.min(4096, data.length - offset);
      block.data.set(data.slice(offset, offset + chunkSize));
      block.checksum = this.calculateChecksum(block.data);
      
      offset += chunkSize;
      if (offset >= data.length) break;
    }
  }

  private calculateChecksum(data: Uint8Array): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash + data[i]) & 0xffffffff;
    }
    return hash.toString(16);
  }

  // Recovery helper methods
  private rollbackCreate(entry: JournalEntry): void {
    const inode = this.inodes.get(entry.target);
    if (inode) {
      // Free allocated blocks
      for (const blockId of inode.blocks) {
        this.freeBlocks.push(blockId);
        this.dataBlocks.delete(blockId);
      }
      
      // Remove from parent
      if (inode.parent !== null) {
        const parent = this.inodes.get(inode.parent);
        if (parent) {
          parent.children = parent.children.filter(id => id !== entry.target);
        }
      }
      
      // Free inode
      this.inodes.delete(entry.target);
      this.freeInodes.push(entry.target);
    }
  }

  private rollbackDelete(entry: JournalEntry): void {
    // Restore from oldData if available
    if (entry.oldData) {
      this.inodes.set(entry.target, entry.oldData);
    }
  }

  private rollbackModify(entry: JournalEntry): void {
    // Restore old data
    if (entry.oldData) {
      const inode = this.inodes.get(entry.target);
      if (inode) {
        Object.assign(inode, entry.oldData);
      }
    }
  }

  // Utility methods for demonstration
  listDirectory(path: string): string[] {
    const dirInode = this.resolvePath(path);
    if (!dirInode || dirInode.type !== 'directory') {
      return [];
    }
    
    return dirInode.children.map(childId => {
      const child = this.inodes.get(childId);
      return child ? child.name : '';
    }).filter(name => name !== '');
  }

  getFileSystemStats() {
    return {
      totalInodes: this.totalInodes,
      usedInodes: this.totalInodes - this.freeInodes.length,
      totalBlocks: this.totalBlocks,
      usedBlocks: this.totalBlocks - this.freeBlocks.length,
      journalEntries: this.journal.length,
      uncommittedEntries: this.journal.filter(e => !e.committed).length
    };
  }
}

// Educational Demo
export function createFileSystemDemo() {
  console.log("🎓 Journaling File System Demo");
  console.log("==============================");
  
  const fs = new JournalingFileSystem(64, 256);
  
  // Create some files and directories
  console.log("\n📁 Creating directory structure...");
  fs.createFile('/', 'documents', ''); // This would be a directory in full implementation
  fs.createFile('/', 'readme.txt', 'Welcome to MituOS!');
  fs.createFile('/', 'config.json', '{"theme": "dark", "language": "en"}');
  
  console.log("\n📋 Directory listing for /:");
  console.log(fs.listDirectory('/'));
  
  console.log("\n📊 File System Statistics:");
  console.log(fs.getFileSystemStats());
  
  // Simulate crash and recovery
  console.log("\n💥 Simulating system crash...");
  console.log("🔄 Restarting system...");
  fs.recoverFromCrash();
  
  console.log("\n📊 Post-recovery Statistics:");
  console.log(fs.getFileSystemStats());
}
```

**🎓 Key Learning Outcomes:**
- **Journaling**: Write-ahead logging for crash recovery
- **Atomic Operations**: Ensuring consistency during file operations
- **Inode Structure**: How file metadata is stored and managed
- **Block Allocation**: Managing disk space efficiently
- **Path Resolution**: Converting file paths to inode references
- **Crash Recovery**: Restoring system consistency after failures

---

## 🎯 Practical Implementation Challenges

### Challenge 1: Build a Multi-User System (🔴 Advanced)
Implement user authentication, permissions, and process isolation:
- User login/logout system
- File permission checking (read/write/execute)
- Process ownership and privilege separation
- Secure inter-user communication

### Challenge 2: Create a Package Manager (🟡 Intermediate)
Build a system for installing and managing applications:
- Package dependency resolution
- Version management
- Automatic updates
- Rollback capabilities

### Challenge 3: Implement Virtual Desktops (🟡 Intermediate)
Create multiple desktop environments:
- Desktop switching animations
- Per-desktop wallpapers and settings
- Window persistence across desktops
- Keyboard shortcuts for desktop management

### Challenge 4: Build a Network File System (🔴 Advanced)
Implement remote file access:
- Client-server communication
- Caching for performance
- Conflict resolution
- Offline synchronization

---

## 🔬 Research Extensions

### Academic Research Topics
1. **Distributed Operating Systems**: Explore how MituOS concepts could scale across multiple machines
2. **Real-Time Systems**: Implement priority-based scheduling with deadline guarantees
3. **Security Models**: Research and implement advanced security paradigms
4. **Performance Optimization**: Study and apply OS-level performance tuning techniques

### Industry Applications
1. **Cloud Computing**: How MituOS patterns apply to containerization and orchestration
2. **Mobile Operating Systems**: Adapting desktop OS concepts for mobile platforms
3. **Embedded Systems**: Scaling down OS concepts for resource-constrained environments
4. **Quantum Computing**: Exploring OS concepts for quantum computing platforms

---

*Made with ❤️ for learning. Star this repo if you found it helpful!*
