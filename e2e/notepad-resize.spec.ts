import { test, expect } from '@playwright/test';

test.describe('Notepad Resize Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport to ensure proper element visibility
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Navigate to the app
    await page.goto('http://172.171.199.162:3000');
    
    // Dismiss NextJS dev overlay if present
    // Dismiss NextJS dev overlay more aggressively
    try {
      await page.evaluate(() => {
        const overlay = document.querySelector('[data-nextjs-dev-overlay]');
        if (overlay) overlay.remove();
        const portal = document.querySelector('nextjs-portal');
        if (portal) portal.remove();
      });
      await page.waitForTimeout(1000);
    } catch (e) {
      // Continue if overlay handling fails
    }
    
    // Wait for the desktop to load
    await page.waitForSelector('.fixed.inset-0.overflow-hidden.select-none', { timeout: 10000 });
    
    // Wait for taskbar to be ready - using actual taskbar class structure
    await page.waitForSelector('.fixed.bottom-0.left-0.right-0.h-12.bg-black\\/80', { timeout: 5000 });
    
    // Ensure start button is visible and stable
    await page.waitForSelector('.start-button', { state: 'visible', timeout: 5000 });
  });

  test('should open notepad and verify resize handles are present', async ({ page }) => {
    // Click the start button in taskbar - look for the actual button structure
    const startButton = page.locator('.start-button');
    
    // Wait for start button to be visible and clickable
    await startButton.waitFor({ state: 'visible', timeout: 5000 });
    await startButton.click();
    
    // Take screenshot to debug
    await page.screenshot({ path: 'debug-after-click.png' });
    
    // Wait for start menu to appear
    await page.waitForSelector('.fixed.bottom-14.left-2', { timeout: 3000 });
    
    // Look for notepad in start menu
    const notepadOption = page.locator('text=Notepad').first();
    await notepadOption.waitFor({ state: 'visible', timeout: 3000 });
    await notepadOption.click();
    
    // Wait for notepad window to appear
    await page.waitForSelector('.fixed.bg-black\\/95', { timeout: 5000 });
    
    // Verify window is present
    const notepadWindow = page.locator('.fixed.bg-black\\/95').first();
    await expect(notepadWindow).toBeVisible();
    
    // Check for resize handles
    const resizeHandles = page.locator('.cursor-se-resize, .cursor-sw-resize, .cursor-ne-resize, .cursor-nw-resize');
    await expect(resizeHandles.first()).toBeVisible();
  });

  test('should resize notepad window using corner handle', async ({ page }) => {
    // Open notepad
    const startButton = page.locator('.start-button');
    
    await startButton.waitFor({ state: 'visible', timeout: 5000 });
    
    // Dismiss NextJS dev overlay if present
    await page.evaluate(() => {
      const overlay = document.querySelector('[data-nextjs-dev-overlay]');
      if (overlay) overlay.remove();
    });
    
    await startButton.scrollIntoViewIfNeeded();
    await startButton.click();
    
    await page.waitForSelector('.fixed.bottom-14.left-2', { timeout: 3000 });
    
    const notepadOption = page.locator('text=Notepad').first();
    await notepadOption.waitFor({ state: 'visible', timeout: 3000 });
    await notepadOption.click();
    
    // Wait for window
    await page.waitForSelector('.fixed.bg-black\\/95', { timeout: 5000 });
    const notepadWindow = page.locator('.fixed.bg-black\\/95').first();
    
    // Get initial window size
    const initialBox = await notepadWindow.boundingBox();
    expect(initialBox).toBeTruthy();
    
    // Find bottom-right resize handle
    const resizeHandle = page.locator('.cursor-se-resize').first();
    await expect(resizeHandle).toBeVisible();
    
    // Perform resize by dragging the handle
    await resizeHandle.hover();
    await page.mouse.down();
    await page.mouse.move(initialBox!.x + initialBox!.width + 100, initialBox!.y + initialBox!.height + 50);
    await page.mouse.up();
    
    // Wait a moment for the resize to take effect
    await page.waitForTimeout(500);
    
    // Get new window size
    const newBox = await notepadWindow.boundingBox();
    expect(newBox).toBeTruthy();
    
    // Verify the window has been resized
    expect(newBox!.width).toBeGreaterThan(initialBox!.width);
    expect(newBox!.height).toBeGreaterThan(initialBox!.height);
  });

  test('should maintain minimum size constraints during resize', async ({ page }) => {
    // Open notepad
    const startButton = page.locator('.start-button');
    
    await startButton.waitFor({ state: 'visible', timeout: 5000 });
    await startButton.click();
    
    await page.waitForSelector('.fixed.bottom-14.left-2', { timeout: 3000 });
    
    const notepadOption = page.locator('text=Notepad').first();
    await notepadOption.waitFor({ state: 'visible', timeout: 3000 });
    await notepadOption.click();
    
    await page.waitForSelector('.fixed.bg-black\\/95', { timeout: 5000 });
    const notepadWindow = page.locator('.fixed.bg-black\\/95').first();
    
    // Get initial window size
    const initialBox = await notepadWindow.boundingBox();
    expect(initialBox).toBeTruthy();
    
    // Find bottom-right resize handle and try to make window very small
    const resizeHandle = page.locator('.cursor-se-resize').first();
    await resizeHandle.hover();
    await page.mouse.down();
    
    // Try to resize to very small dimensions (should be constrained by minimum size)
    await page.mouse.move(initialBox!.x + initialBox!.width - 150, initialBox!.y + initialBox!.height - 150);
    await page.mouse.up();
    
    await page.waitForTimeout(500);
    
    // Verify minimum size constraints
    const finalBox = await notepadWindow.boundingBox();
    expect(finalBox!.width).toBeGreaterThanOrEqual(300); // Based on Window.tsx minimum
    expect(finalBox!.height).toBeGreaterThanOrEqual(200); // Based on Window.tsx minimum
  });
});
