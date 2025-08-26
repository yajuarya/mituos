import { test, expect } from '@playwright/test';

test.describe('MituOS Desktop Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the desktop to load
    await page.waitForSelector('[data-testid="desktop"]', { timeout: 10000 });
  });

  test('should load desktop with taskbar', async ({ page }) => {
    // Check if desktop is visible
    await expect(page.locator('[data-testid="desktop"]')).toBeVisible();
    
    // Check if taskbar is visible
    await expect(page.locator('[data-testid="taskbar"]')).toBeVisible();
    
    // Check if start button is visible
    await expect(page.locator('[data-testid="start-button"]')).toBeVisible();
  });

  test('should open start menu and display apps', async ({ page }) => {
    // Click start button
    await page.locator('[data-testid="start-button"]').scrollIntoViewIfNeeded();
    await page.click('[data-testid="start-button"]', { force: true });
    
    // Wait for start menu to appear
    await expect(page.locator('[data-testid="start-menu"]')).toBeVisible();
    
    // Check if apps are listed
    await expect(page.locator('text=Notepad')).toBeVisible();
    await expect(page.locator('text=Calculator')).toBeVisible();
    await expect(page.locator('text=File Manager')).toBeVisible();
  });

  test('should open notepad application', async ({ page }) => {
    // Open start menu
    await page.click('[data-testid="start-button"]', { force: true });
    await expect(page.locator('[data-testid="start-menu"]')).toBeVisible();
    
    // Click on Notepad
    await page.click('text=Notepad');
    
    // Wait for notepad window to appear
    await expect(page.locator('[data-testid="window-notepad"]')).toBeVisible();
    
    // Check if notepad content is visible
    await expect(page.locator('textarea')).toBeVisible();
    
    // Check window title
    await expect(page.locator('[data-testid="window-title"]')).toContainText('Notepad');
  });

  test('should test notepad resize functionality', async ({ page }) => {
    // Open notepad
    await page.click('[data-testid="start-button"]', { force: true });
    await page.click('text=Notepad');
    await expect(page.locator('[data-testid="window-notepad"]')).toBeVisible();
    
    // Get initial window size
    const windowElement = page.locator('[data-testid="window-notepad"]');
    const initialBox = await windowElement.boundingBox();
    expect(initialBox).toBeTruthy();
    
    // Find resize handle (bottom-right corner)
    const resizeHandle = page.locator('[data-testid="resize-handle"]');
    await expect(resizeHandle).toBeVisible();
    
    // Perform resize by dragging the resize handle
    await resizeHandle.hover();
    await page.mouse.down();
    await page.mouse.move(initialBox!.x + initialBox!.width + 100, initialBox!.y + initialBox!.height + 100);
    await page.mouse.up();
    
    // Wait for resize to complete
    await page.waitForTimeout(500);
    
    // Get new window size
    const newBox = await windowElement.boundingBox();
    expect(newBox).toBeTruthy();
    
    // Verify window was resized
    expect(newBox!.width).toBeGreaterThan(initialBox!.width);
    expect(newBox!.height).toBeGreaterThan(initialBox!.height);
    
    // Verify textarea is still functional after resize
    const textarea = page.locator('textarea');
    await textarea.fill('Testing resize functionality');
    await expect(textarea).toHaveValue('Testing resize functionality');
  });

  test('should test window drag functionality', async ({ page }) => {
    // Open notepad
    await page.click('[data-testid="start-button"]', { force: true });
    await page.click('text=Notepad');
    await expect(page.locator('[data-testid="window-notepad"]')).toBeVisible();
    
    // Get initial window position
    const windowElement = page.locator('[data-testid="window-notepad"]');
    const initialBox = await windowElement.boundingBox();
    expect(initialBox).toBeTruthy();
    
    // Drag window by title bar
    const titleBar = page.locator('[data-testid="window-title-bar"]');
    await titleBar.hover();
    await page.mouse.down();
    await page.mouse.move(initialBox!.x + 200, initialBox!.y + 100);
    await page.mouse.up();
    
    // Wait for move to complete
    await page.waitForTimeout(500);
    
    // Get new window position
    const newBox = await windowElement.boundingBox();
    expect(newBox).toBeTruthy();
    
    // Verify window was moved
    expect(Math.abs(newBox!.x - (initialBox!.x + 200))).toBeLessThan(10);
    expect(Math.abs(newBox!.y - (initialBox!.y + 100))).toBeLessThan(10);
  });

  test('should test window minimize and restore', async ({ page }) => {
    // Open notepad
    await page.click('[data-testid="start-button"]', { force: true });
    await page.click('text=Notepad');
    await expect(page.locator('[data-testid="window-notepad"]')).toBeVisible();
    
    // Add some content
    await page.fill('textarea', 'Test content for minimize/restore');
    
    // Minimize window
    await page.click('[data-testid="minimize-button"]');
    
    // Window should not be visible
    await expect(page.locator('[data-testid="window-notepad"]')).not.toBeVisible();
    
    // Check if window appears in taskbar
    await expect(page.locator('[data-testid="taskbar-item-notepad"]')).toBeVisible();
    
    // Restore window by clicking taskbar item
    await page.click('[data-testid="taskbar-item-notepad"]');
    
    // Window should be visible again
    await expect(page.locator('[data-testid="window-notepad"]')).toBeVisible();
    
    // Content should be preserved
    await expect(page.locator('textarea')).toHaveValue('Test content for minimize/restore');
  });

  test('should test window maximize and restore', async ({ page }) => {
    // Open notepad
    await page.click('[data-testid="start-button"]', { force: true });
    await page.click('text=Notepad');
    await expect(page.locator('[data-testid="window-notepad"]')).toBeVisible();
    
    // Get initial window size
    const windowElement = page.locator('[data-testid="window-notepad"]');
    const initialBox = await windowElement.boundingBox();
    expect(initialBox).toBeTruthy();
    
    // Maximize window
    await page.click('[data-testid="maximize-button"]');
    
    // Wait for maximize animation
    await page.waitForTimeout(500);
    
    // Get maximized window size
    const maxBox = await windowElement.boundingBox();
    expect(maxBox).toBeTruthy();
    
    // Window should be larger (close to screen size)
    expect(maxBox!.width).toBeGreaterThan(initialBox!.width);
    expect(maxBox!.height).toBeGreaterThan(initialBox!.height);
    
    // Restore window
    await page.click('[data-testid="maximize-button"]');
    
    // Wait for restore animation
    await page.waitForTimeout(500);
    
    // Get restored window size
    const restoredBox = await windowElement.boundingBox();
    expect(restoredBox).toBeTruthy();
    
    // Should be back to original size (approximately)
    expect(Math.abs(restoredBox!.width - initialBox!.width)).toBeLessThan(10);
    expect(Math.abs(restoredBox!.height - initialBox!.height)).toBeLessThan(10);
  });

  test('should test multiple windows management', async ({ page }) => {
    // Open notepad
    await page.click('[data-testid="start-button"]', { force: true });
    await page.click('text=Notepad');
    await expect(page.locator('[data-testid="window-notepad"]')).toBeVisible();
    
    // Close start menu by clicking elsewhere
    await page.click('[data-testid="desktop"]');
    
    // Open calculator
    await page.click('[data-testid="start-button"]', { force: true });
    await page.click('text=Calculator');
    await expect(page.locator('[data-testid="window-calculator"]')).toBeVisible();
    
    // Both windows should be visible
    await expect(page.locator('[data-testid="window-notepad"]')).toBeVisible();
    await expect(page.locator('[data-testid="window-calculator"]')).toBeVisible();
    
    // Both should appear in taskbar
    await expect(page.locator('[data-testid="taskbar-item-notepad"]')).toBeVisible();
    await expect(page.locator('[data-testid="taskbar-item-calculator"]')).toBeVisible();
    
    // Click on notepad window to focus it
    await page.click('[data-testid="window-notepad"]');
    
    // Notepad should be on top (higher z-index)
    const notepadZIndex = await page.locator('[data-testid="window-notepad"]').evaluate(el => 
      window.getComputedStyle(el).zIndex
    );
    const calculatorZIndex = await page.locator('[data-testid="window-calculator"]').evaluate(el => 
      window.getComputedStyle(el).zIndex
    );
    
    expect(parseInt(notepadZIndex)).toBeGreaterThan(parseInt(calculatorZIndex));
  });

  test('should test notepad text editing functionality', async ({ page }) => {
    // Open notepad
    await page.click('[data-testid="start-button"]', { force: true });
    await page.click('text=Notepad');
    await expect(page.locator('[data-testid="window-notepad"]')).toBeVisible();
    
    const textarea = page.locator('textarea');
    
    // Test typing
    await textarea.fill('Hello, MituOS!');
    await expect(textarea).toHaveValue('Hello, MituOS!');
    
    // Test selection and replacement
    await textarea.selectText();
    await textarea.fill('New content');
    await expect(textarea).toHaveValue('New content');
    
    // Test keyboard shortcuts
    await textarea.press('Control+a');
    await textarea.press('Control+c');
    await textarea.press('End');
    await textarea.press('Enter');
    await textarea.press('Control+v');
    
    await expect(textarea).toHaveValue('New content\nNew content');
  });

  test('should handle window close functionality', async ({ page }) => {
    // Open notepad
    await page.click('[data-testid="start-button"]', { force: true });
    await page.click('text=Notepad');
    await expect(page.locator('[data-testid="window-notepad"]')).toBeVisible();
    
    // Add some content
    await page.fill('textarea', 'Content to be lost');
    
    // Close window
    await page.click('[data-testid="close-button"]');
    
    // Window should not be visible
    await expect(page.locator('[data-testid="window-notepad"]')).not.toBeVisible();
    
    // Should not appear in taskbar
    await expect(page.locator('[data-testid="taskbar-item-notepad"]')).not.toBeVisible();
  });
});
