/**
 * @fileoverview Test Mocks for Browser APIs
 * 
 * This file provides mock implementations for browser APIs that are not available
 * in the Jest/JSDOM test environment. These mocks ensure tests can run without
 * relying on actual browser functionality.
 * 
 * Educational Purpose:
 * - Demonstrates how to mock browser APIs for testing
 * - Shows proper test isolation techniques
 * - Illustrates testing best practices for web applications
 */

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-object-url');
global.URL.revokeObjectURL = jest.fn();

// Mock File API
global.File = class MockFile {
  constructor(public content: string[], public name: string, public options?: any) {}
  
  text() {
    return Promise.resolve(this.content.join(''));
  }
  
  arrayBuffer() {
    return Promise.resolve(new ArrayBuffer(0));
  }
} as any;

// Mock FileReader
global.FileReader = class MockFileReader {
  result: string | null = null;
  error: any = null;
  readyState: number = 0;
  onload: ((event: any) => void) | null = null;
  onerror: ((event: any) => void) | null = null;
  onloadend: ((event: any) => void) | null = null;

  readAsText(file: any) {
    setTimeout(() => {
      this.readyState = 2;
      this.result = typeof file.content === 'string' ? file.content : file.content.join('');
      if (this.onload) {
        this.onload({ target: this });
      }
      if (this.onloadend) {
        this.onloadend({ target: this });
      }
    }, 0);
  }

  readAsDataURL(file: any) {
    setTimeout(() => {
      this.readyState = 2;
      this.result = 'data:text/plain;base64,dGVzdA==';
      if (this.onload) {
        this.onload({ target: this });
      }
      if (this.onloadend) {
        this.onloadend({ target: this });
      }
    }, 0);
  }
} as any;

// Mock HTMLCanvasElement
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Uint8ClampedArray(4) })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => ({ data: new Uint8ClampedArray(4) })),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = class MockResizeObserver {
  constructor(callback: any) {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
global.IntersectionObserver = class MockIntersectionObserver {
  constructor(callback: any, options?: any) {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
});

export {
  localStorageMock,
  sessionStorageMock
};
