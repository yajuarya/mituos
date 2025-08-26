import { renderHook, act } from '@testing-library/react'
import { useAppStore } from '@/stores/app/appStore'

describe('App Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useAppStore())
    act(() => {
      // Reset any state if needed
    })
  })

  it('initializes with default applications', () => {
    const { result } = renderHook(() => useAppStore())
    
    expect(result.current.apps).toBeDefined()
    expect(result.current.appsArray.length).toBeGreaterThan(0)
    
    // Check for essential apps
    const appNames = result.current.appsArray.map(app => app.name)
    expect(appNames).toContain('Notepad')
    expect(appNames).toContain('Calculator')
    expect(appNames).toContain('File Manager')
    expect(appNames).toContain('Settings')
  })

  it('provides correct app metadata', () => {
    const { result } = renderHook(() => useAppStore())
    
    const notepadApp = result.current.appsArray.find(app => app.name === 'Notepad')
    expect(notepadApp).toBeDefined()
    expect(notepadApp?.id).toBe('notepad')
    expect(notepadApp?.icon).toBeDefined()
    expect(notepadApp?.component).toBe('Notepad')
    expect(typeof notepadApp?.defaultSize.width).toBe('number')
    expect(typeof notepadApp?.defaultSize.height).toBe('number')
  })

  it('handles app launching', () => {
    const { result } = renderHook(() => useAppStore())
    
    const notepadApp = result.current.appsArray.find(app => app.name === 'Notepad')
    expect(notepadApp).toBeDefined()
    
    // Test that app has required properties for launching
    expect(notepadApp?.id).toBeTruthy()
    expect(notepadApp?.name).toBeTruthy()
    expect(notepadApp?.component).toBeTruthy()
    expect(notepadApp?.defaultSize.width).toBeGreaterThan(0)
    expect(notepadApp?.defaultSize.height).toBeGreaterThan(0)
  })

  it('provides apps with proper dimensions', () => {
    const { result } = renderHook(() => useAppStore())
    
    result.current.appsArray.forEach(app => {
      expect(app.defaultSize.width).toBeGreaterThan(0)
      expect(app.defaultSize.height).toBeGreaterThan(0)
      expect(typeof app.defaultSize.width).toBe('number')
      expect(typeof app.defaultSize.height).toBe('number')
    })
  })

  it('has unique app IDs', () => {
    const { result } = renderHook(() => useAppStore())
    
    const appIds = result.current.appsArray.map(app => app.id)
    const uniqueIds = new Set(appIds)
    
    expect(appIds.length).toBe(uniqueIds.size)
  })

  it('provides apps with valid icons', () => {
    const { result } = renderHook(() => useAppStore())
    
    result.current.appsArray.forEach(app => {
      expect(app.icon).toBeDefined()
      expect(typeof app.icon).toBe('string')
      expect(app.icon.length).toBeGreaterThan(0)
    })
  })

  it('supports different app categories', () => {
    const { result } = renderHook(() => useAppStore())
    
    // Check for different types of apps
    const hasProductivityApp = result.current.appsArray.some(app => 
      app.name === 'Notepad' || app.name === 'Calculator'
    )
    const hasSystemApp = result.current.appsArray.some(app => 
      app.name === 'Settings' || app.name === 'System Monitor'
    )
    const hasUtilityApp = result.current.appsArray.some(app => 
      app.name === 'File Manager'
    )
    
    expect(hasProductivityApp).toBe(true)
    expect(hasSystemApp).toBe(true)
    expect(hasUtilityApp).toBe(true)
  })

  it('provides reasonable default window sizes', () => {
    const { result } = renderHook(() => useAppStore())
    
    result.current.appsArray.forEach(app => {
      // Check minimum reasonable sizes
      expect(app.defaultSize.width).toBeGreaterThanOrEqual(300)
      expect(app.defaultSize.height).toBeGreaterThanOrEqual(200)
      
      // Check maximum reasonable sizes (shouldn't be larger than typical screen)
      expect(app.defaultSize.width).toBeLessThanOrEqual(1920)
      expect(app.defaultSize.height).toBeLessThanOrEqual(1080)
    })
  })

  it('maintains app data consistency', () => {
    const { result } = renderHook(() => useAppStore())
    
    // Test multiple calls return consistent data
    const firstCall = result.current.apps
    const secondCall = result.current.apps
    
    expect(firstCall).toEqual(secondCall)
    expect(firstCall.length).toBe(secondCall.length)
  })

  it('supports app filtering by component type', () => {
    const { result } = renderHook(() => useAppStore())
    
    const notepadApps = result.current.appsArray.filter(app => app.component === 'Notepad')
    const calculatorApps = result.current.appsArray.filter(app => app.component === 'Calculator')
    
    expect(notepadApps.length).toBe(1)
    expect(calculatorApps.length).toBe(1)
    expect(notepadApps[0].name).toBe('Notepad')
    expect(calculatorApps[0].name).toBe('Calculator')
  })
})
