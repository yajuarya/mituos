import { renderHook, act } from '@testing-library/react'
import { useWindowStore } from '@/stores/window/windowStore'

describe('Window Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useWindowStore())
    act(() => {
      result.current.windows.clear()
    })
  })

  it('creates a new window with correct properties', () => {
    const { result } = renderHook(() => useWindowStore())
    
    act(() => {
      result.current.createWindow({
        id: 'test-window',
        title: 'Test Window',
        component: 'notepad',
        x: 100,
        y: 100,
        width: 800,
        height: 600,
      })
    })

    const window = result.current.windows.get('test-window')
    expect(window).toBeDefined()
    expect(window?.title).toBe('Test Window')
    expect(window?.position.x).toBe(100)
    expect(window?.position.y).toBe(100)
    expect(window?.size.width).toBe(800)
    expect(window?.size.height).toBe(600)
    expect(window?.isMinimized).toBe(false)
    expect(window?.isMaximized).toBe(false)
  })

  it('handles window resize correctly', () => {
    const { result } = renderHook(() => useWindowStore())
    
    // Create a window first
    act(() => {
      result.current.createWindow({
        id: 'resize-test',
        title: 'Resize Test',
        component: 'notepad',
        x: 100,
        y: 100,
        width: 800,
        height: 600,
      })
    })

    // Test resize functionality
    act(() => {
      result.current.updateWindowSize('resize-test', { width: 1000, height: 700 })
    })

    const window = result.current.windows.get('resize-test')
    expect(window?.size.width).toBe(1000)
    expect(window?.size.height).toBe(700)
  })

  it('enforces minimum window size constraints', () => {
    const { result } = renderHook(() => useWindowStore())
    
    act(() => {
      result.current.createWindow({
        id: 'min-size-test',
        title: 'Min Size Test',
        component: 'notepad',
        x: 100,
        y: 100,
        width: 800,
        height: 600,
      })
    })

    // Try to resize below minimum
    act(() => {
      result.current.updateWindowSize('min-size-test', { width: 50, height: 50 })
    })

    const window = result.current.windows.get('min-size-test')
    // Should enforce minimum size (typically 200x150)
    expect(window?.size.width).toBeGreaterThanOrEqual(200)
    expect(window?.size.height).toBeGreaterThanOrEqual(150)
  })

  it('handles window position updates', () => {
    const { result } = renderHook(() => useWindowStore())
    
    act(() => {
      result.current.createWindow({
        id: 'position-test',
        title: 'Position Test',
        component: 'notepad',
        x: 100,
        y: 100,
        width: 800,
        height: 600,
      })
    })

    act(() => {
      result.current.updateWindowPosition('position-test', { x: 200, y: 300 })
    })

    const window = result.current.windows.get('position-test')
    expect(window?.position.x).toBe(200)
    expect(window?.position.y).toBe(300)
  })

  it('handles window maximize and restore', () => {
    const { result } = renderHook(() => useWindowStore())
    
    act(() => {
      result.current.createWindow({
        id: 'maximize-test',
        title: 'Maximize Test',
        component: 'notepad',
        x: 100,
        y: 100,
        width: 800,
        height: 600,
      })
    })

    // Maximize window
    act(() => {
      result.current.maximizeWindow('maximize-test')
    })

    let window = result.current.windows.get('maximize-test')
    expect(window?.isMaximized).toBe(true)
    
    // Should store original dimensions
    expect(window?.originalWidth).toBe(800)
    expect(window?.originalHeight).toBe(600)
    expect(window?.originalX).toBe(100)
    expect(window?.originalY).toBe(100)

    // Restore window
    act(() => {
      result.current.maximizeWindow('maximize-test') // Toggle back
    })

    window = result.current.windows.get('maximize-test')
    expect(window?.isMaximized).toBe(false)
    expect(window?.size.width).toBe(800)
    expect(window?.size.height).toBe(600)
    expect(window?.position.x).toBe(100)
    expect(window?.position.y).toBe(100)
  })

  it('handles window minimize and restore', () => {
    const { result } = renderHook(() => useWindowStore())
    
    act(() => {
      result.current.createWindow({
        id: 'minimize-test',
        title: 'Minimize Test',
        component: 'notepad',
        x: 100,
        y: 100,
        width: 800,
        height: 600,
      })
    })

    act(() => {
      result.current.minimizeWindow('minimize-test')
    })

    const window = result.current.windows.get('minimize-test')
    expect(window?.isMinimized).toBe(true)
    expect(result.current.activeWindowId).not.toBe('minimize-test')
  })

  it('focuses window correctly', () => {
    const { result } = renderHook(() => useWindowStore())
    
    // Create multiple windows
    act(() => {
      result.current.createWindow({
        id: 'window1',
        title: 'Window 1',
        component: 'notepad',
        x: 100,
        y: 100,
        width: 800,
        height: 600,
      })
      result.current.createWindow({
        id: 'window2',
        title: 'Window 2',
        component: 'calculator',
        x: 200,
        y: 200,
        width: 400,
        height: 500,
      })
    })

    act(() => {
      result.current.focusWindow('window1')
    })

    expect(result.current.activeWindowId).toBe('window1')
    
    const window1 = result.current.windows.get('window1')
    const window2 = result.current.windows.get('window2')
    
    expect(window1?.zIndex).toBeGreaterThan(window2?.zIndex || 0)
  })

  it('closes window correctly', () => {
    const { result } = renderHook(() => useWindowStore())
    
    act(() => {
      result.current.createWindow({
        id: 'close-test',
        title: 'Close Test',
        component: 'notepad',
        x: 100,
        y: 100,
        width: 800,
        height: 600,
      })
    })

    expect(result.current.windows.has('close-test')).toBe(true)

    act(() => {
      result.current.closeWindow('close-test')
    })

    expect(result.current.windows.has('close-test')).toBe(false)
  })

  it('handles screen boundary constraints', () => {
    const { result } = renderHook(() => useWindowStore())
    
    // Mock screen dimensions
    Object.defineProperty(global.window, 'innerWidth', { value: 1920 })
    Object.defineProperty(global.window, 'innerHeight', { value: 1080 })
    
    act(() => {
      result.current.createWindow({
        id: 'boundary-test',
        title: 'Boundary Test',
        component: 'notepad',
        x: 100,
        y: 100,
        width: 800,
        height: 600,
      })
    })

    // Try to move window outside screen bounds
    act(() => {
      result.current.updateWindowPosition('boundary-test', { x: 2000, y: -100 })
    })

    const window = result.current.windows.get('boundary-test')
    // Should constrain to screen bounds
    expect(window?.position.x).toBeLessThan(1920)
    expect(window?.position.y).toBeGreaterThanOrEqual(0)
  })
})
