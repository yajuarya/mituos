# MituOS 🖥️

A premium, production-ready web-based desktop operating system interface built with Next.js. Experience a complete desktop environment in your browser with extensible apps, modern UI components, and seamless user interactions.

![MituOS Desktop Interface](http://172.171.199.162:3000)

## Introduction

MituOS is a sophisticated web-based desktop operating system that brings the familiar desktop experience to your browser. Built with modern web technologies including Next.js, TypeScript, Tailwind CSS, and Framer Motion, it offers a premium user interface with extensible architecture for adding custom applications.

## Features

### 🎨 **Premium User Interface**
- Modern, responsive design with smooth animations
- Dark/Light theme support with system preference detection
- Customizable desktop wallpapers and themes
- Professional window management system

### 🚀 **Built-in Applications**
- **File Manager**: Navigate and manage files with intuitive interface
- **Notepad**: Rich text editor with syntax highlighting
- **Calculator**: Scientific calculator with advanced functions
- **System Monitor**: Real-time system performance monitoring
- **Settings**: Comprehensive system configuration panel

### 🔧 **Advanced Features**
- Resizable and draggable windows
- Multi-window management with taskbar
- Start menu with search functionality
- Context menus and keyboard shortcuts
- State persistence across sessions

### 🏗️ **Developer-Friendly**
- Modular architecture for easy app development
- TypeScript for type safety
- Zustand for state management
- Comprehensive testing with Playwright
- Hot reload development environment

## User Experience

MituOS provides an intuitive desktop experience with:
- **Familiar Interface**: Windows-like desktop environment
- **Smooth Interactions**: Fluid animations and transitions
- **Responsive Design**: Works seamlessly across devices
- **Accessibility**: WCAG compliant with keyboard navigation
- **Performance**: Optimized for fast loading and smooth operation

## Data Management

- **Local Storage**: User preferences and app data stored locally
- **State Persistence**: Window positions and app states maintained
- **File System Simulation**: Virtual file system for file management
- **Session Management**: Automatic state recovery on page reload

## Quickstart

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yajuarya/mituos.git
   cd mituos
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Currently, MituOS runs without external API dependencies. Future versions may require:

```env
# Future API integrations (examples)
# NEXT_PUBLIC_API_URL=your_api_endpoint
# NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## Project Structure

```
mituos/
├── src/
│   ├── app/                    # Next.js app directory
│   ├── components/             # React components
│   │   ├── desktop/           # Desktop-specific components
│   │   ├── window/            # Window management
│   │   ├── taskbar/           # Taskbar components
│   │   ├── apps/              # Built-in applications
│   │   └── ui/                # Reusable UI components
│   ├── stores/                # Zustand state stores
│   │   ├── window/            # Window state management
│   │   ├── desktop/           # Desktop state
│   │   └── app/               # Application state
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   ├── types/                 # TypeScript type definitions
│   └── apps/                  # Individual app implementations
├── e2e/                       # End-to-end tests
├── public/                    # Static assets
└── docs/                      # Documentation
```

## Usage Guide

### Opening Applications
- Click the Start button in the taskbar
- Search for applications in the Start menu
- Double-click desktop icons (if available)

### Window Management
- **Resize**: Drag window corners or edges
- **Move**: Drag the title bar
- **Minimize/Maximize**: Use window control buttons
- **Close**: Click the X button or use Alt+F4

### Keyboard Shortcuts
- `Ctrl + Alt + T`: Open Terminal (if available)
- `Alt + Tab`: Switch between windows
- `Win`: Open Start menu
- `F11`: Toggle fullscreen

## API Endpoints

MituOS currently operates as a client-side application. Future versions may include:

- `/api/files` - File system operations
- `/api/apps` - Application management
- `/api/settings` - User preferences
- `/api/themes` - Theme management

## Development

### Adding New Applications

1. Create app component in `src/apps/your-app/`
2. Register app in `src/stores/app/appStore.ts`
3. Add app icon and metadata
4. Implement window integration

### Testing

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run specific test
npx playwright test e2e/your-test.spec.ts
```

### Building for Production

```bash
npm run build
npm start
```

## Contributing

We welcome contributions to MituOS! Here's how you can help:

### Reporting Issues
- Use GitHub Issues to report bugs
- Provide detailed reproduction steps
- Include browser and OS information
- Add screenshots if applicable

### Pull Requests
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Setup
1. Follow the installation steps above
2. Install Playwright for E2E testing: `npx playwright install`
3. Run tests to ensure everything works
4. Start developing!

## License
## User Experience

MituOS provides an intuitive desktop environment that mirrors real operating system interactions:

### Educational Learning Path
- **Beginner**: Start with basic window operations and file management
- **Intermediate**: Explore process management and system monitoring
- **Advanced**: Dive into performance optimization and custom app development

### Interactive Features
- **Drag & Drop**: Learn file system operations through intuitive interactions
- **Multi-Window Management**: Understand process scheduling and memory management
- **Real-time Monitoring**: Observe system performance metrics and resource allocation

## Data Management

### Local Storage Strategy
- **Window States**: Persistent window positions and sizes using localStorage
- **App Preferences**: User settings and configurations stored locally
- **File System Simulation**: Virtual file system with hierarchical structure

### Performance Considerations
- **Lazy Loading**: Apps load only when needed, simulating OS process creation
- **Memory Management**: Efficient component unmounting and cleanup
- **State Optimization**: Zustand stores for minimal re-renders

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Application Configuration
NEXT_PUBLIC_APP_NAME=MituOS
NEXT_PUBLIC_APP_VERSION=1.0.0

# Development Settings
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# Educational Features
NEXT_PUBLIC_SHOW_TUTORIALS=true
NEXT_PUBLIC_CONCEPT_MAPPING=true
```

## Project Structure

```
src/
├── app/                    # Next.js 13+ app directory
│   ├── layout.tsx         # Root layout with educational meta tags
│   └── page.tsx           # Main desktop interface
├── components/            # Reusable UI components
│   ├── desktop/          # Desktop environment components
│   │   ├── Desktop.tsx   # 🎓 Main desktop with window management
│   │   └── Taskbar.tsx   # 🎓 System taskbar with app launcher
│   ├── window/           # Window management system
│   │   ├── Window.tsx    # 🎓 Draggable/resizable window component
│   │   └── WindowManager.tsx # 🎓 Multi-window orchestration
│   └── ui/               # Basic UI primitives
├── apps/                 # Built-in applications
│   ├── notepad/         # 🎓 Text editor with file operations
│   ├── calculator/      # 🎓 Scientific calculator
│   ├── file-manager/    # 🎓 File system browser
│   ├── settings/        # 🎓 System configuration
│   └── system-monitor/  # 🎓 Performance monitoring
├── stores/              # State management
│   ├── windowStore.ts   # 🎓 Window lifecycle management
│   ├── desktopStore.ts  # 🎓 Desktop state and interactions
│   └── appStore.ts      # 🎓 Application registry
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── types/               # TypeScript definitions
├── docs/                # Educational documentation
│   └── LEARNING_RESOURCES.md # 🎓 Comprehensive learning guide
└── __tests__/           # Test suites with educational comments
```

🎓 = Components with educational annotations and OS concept explanations

## Usage Guide

### For Learners

1. **Start with Basics**:
   ```bash
   # Clone and explore the codebase
   git clone https://github.com/yajuarya/mituos.git
   cd mituos
   npm install
   ```

2. **Follow Learning Path**:
   - Read `src/docs/LEARNING_RESOURCES.md` for concept mapping
   - Examine component annotations for OS theory connections
   - Run tests to understand system behavior

3. **Interactive Learning**:
   - Open multiple apps to see process management
   - Resize windows to understand memory allocation
   - Monitor system performance in real-time

### For Developers

1. **Adding New Apps**:
   ```typescript
   // Create app component in src/apps/your-app/
   // Register in src/stores/appStore.ts
   // Add educational annotations following existing patterns
   ```

2. **Educational Annotations**:
   ```typescript
   // 🎓 OS Concept: Process Creation
   // This component demonstrates how operating systems
   // manage application lifecycle and resource allocation
   ```

## API Endpoints

### Window Management API
- `windowStore.openWindow(appId, props)` - Create new process
- `windowStore.closeWindow(windowId)` - Terminate process
- `windowStore.focusWindow(windowId)` - Context switching
- `windowStore.minimizeWindow(windowId)` - Process suspension

### Desktop API  
- `desktopStore.addShortcut(app)` - Add desktop icon
- `desktopStore.removeShortcut(appId)` - Remove desktop icon
- `desktopStore.updateWallpaper(url)` - Change desktop background

### App Registry API
- `appStore.registerApp(appConfig)` - Register new application
- `appStore.getApp(appId)` - Retrieve app configuration
- `appStore.listApps()` - Get all available applications

## Development

### Educational Development Approach

This project follows **Learning-Driven Development (LDD)**:

1. **Code with Context**: Every component includes educational comments
2. **Theory Integration**: Real OS concepts mapped to code implementations
3. **Progressive Complexity**: Features organized from beginner to advanced
4. **Interactive Examples**: Small, isolated code snippets for learning

### Best Practices

```typescript
// ✅ Good: Educational annotation with OS concept
// 🎓 OS Concept: Inter-Process Communication (IPC)
// This event system simulates how processes communicate
// in real operating systems through message passing
const handleAppMessage = (message: AppMessage) => {
  // Implementation with learning context
};

// ❌ Avoid: Code without educational context
const handleMessage = (msg) => {
  // Implementation without learning value
};
```

### Testing Philosophy

- **TDD with Education**: Tests explain expected behavior and OS parallels
- **Behavioral Testing**: Focus on user interactions and system responses
- **Performance Testing**: Measure and explain resource usage patterns

### Running Tests

```bash
# Unit tests with educational output
npm test

# E2E tests with system behavior validation
npm run test:e2e

# Performance tests with resource monitoring
npm run test:performance
```

## Contributing

### Educational Contribution Guidelines

1. **Code Contributions**:
   - Add educational annotations for OS concepts
   - Include progressive complexity indicators
   - Provide interactive examples where applicable

2. **Documentation**:
   - Link code sections to OS theory
   - Create concept mapping diagrams
   - Write beginner-friendly explanations

3. **Testing**:
   - Write tests that explain system behavior
   - Include performance implications
   - Add educational comments in test cases

### Contribution Process

1. Fork the repository
2. Create feature branch: `git checkout -b feature/educational-enhancement`
3. Add educational annotations to your code
4. Write comprehensive tests with learning context
5. Update documentation with concept mappings
6. Submit pull request with educational impact description

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## About the Creator

**Yaju Arya**  
Full-stack developer passionate about creating innovative web experiences and educational technology.  
🌐 [yajuarya.com](http://yajuarya.com)

---

Made with ❤️. Star this repo if you found it helpful!
Made with ❤️. Star this repo if you found it helpful!
