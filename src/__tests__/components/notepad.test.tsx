import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Notepad } from '@/apps/notepad/Notepad'

// Mock the window store
const mockWindowStore = {
  windows: new Map(),
  activeWindowId: 'notepad-1',
  createWindow: jest.fn(),
  closeWindow: jest.fn(),
  focusWindow: jest.fn(),
  minimizeWindow: jest.fn(),
  maximizeWindow: jest.fn(),
  updateWindow: jest.fn(),
  setWindowPosition: jest.fn(),
  setWindowSize: jest.fn(),
}

jest.mock('@/stores/window/windowStore', () => ({
  useWindowStore: () => mockWindowStore,
}))

describe('Notepad Component', () => {
  const defaultProps = {
    windowId: 'notepad-1',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders notepad with default content', () => {
    render(<Notepad {...defaultProps} />)
    
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByDisplayValue(/Welcome to MituOS Notepad/)).toBeInTheDocument()
    expect(screen.getByTitle('Save (Ctrl+S)')).toBeInTheDocument()
    expect(screen.getByTitle('Open (Ctrl+O)')).toBeInTheDocument()
  })

  it('allows typing in the text area', async () => {
    const user = userEvent.setup()
    render(<Notepad {...defaultProps} />)
    
    const textArea = screen.getByRole('textbox')
    await user.type(textArea, 'Hello, World!')
    
    expect(textArea).toHaveValue('Welcome to MituOS Notepad!\n\nStart typing your notes here...Hello, World!')
  })

  it('has save and open buttons in toolbar', async () => {
    render(<Notepad {...defaultProps} />)
    
    const saveButton = screen.getByTitle('Save (Ctrl+S)')
    const openButton = screen.getByTitle('Open (Ctrl+O)')
    
    expect(saveButton).toBeInTheDocument()
    expect(openButton).toBeInTheDocument()
  })
  it('handles new file creation', async () => {
    const user = userEvent.setup()
    render(<Notepad {...defaultProps} />)
    
    // First type some content
    const textArea = screen.getByRole('textbox')
    await user.type(textArea, 'Some content')
    
    // Test that content was added
    expect(textArea).toHaveValue('Welcome to MituOS Notepad!\n\nStart typing your notes here...Some content')
    
    // Test clear functionality by simulating Ctrl+A and Delete
    await user.keyboard('{Control>}a{/Control}')
    await user.keyboard('{Delete}')
    
    // Text area should be cleared
    expect(textArea).toHaveValue('')
  })

  it('handles window resize functionality', async () => {
    const user = userEvent.setup()
    render(<Notepad {...defaultProps} />)
    
    // Simulate window resize
    const resizeEvent = new Event('resize')
    window.dispatchEvent(resizeEvent)
    
    // Check if the component handles resize properly
    const textArea = screen.getByRole('textbox')
    expect(textArea).toBeInTheDocument()
    
    // Verify that the textarea remains functional after resize
    await user.type(textArea, ' Additional text after resize')
    expect(textArea.value).toContain('Additional text after resize')
  })

  it('updates window title when content changes', async () => {
    const user = userEvent.setup()
    render(<Notepad {...defaultProps} />)
    
    const textArea = screen.getByRole('textbox')
    await user.type(textArea, 'New content')
    
    // Should update window title to indicate unsaved changes
    expect(mockWindowStore.updateWindow).toHaveBeenCalledWith(
      'notepad-1',
      expect.objectContaining({
        title: expect.stringContaining('*')
      })
    )
  })

  it('handles keyboard shortcuts', async () => {
    const user = userEvent.setup()
    render(<Notepad {...defaultProps} />)
    
    const textArea = screen.getByRole('textbox')
    await user.type(textArea, 'Test content')
    
    // Test Ctrl+A (Select All)
    await user.keyboard('{Control>}a{/Control}')
    
    // Test Ctrl+S (Save)
    await user.keyboard('{Control>}s{/Control}')
    
    // Verify save functionality was triggered
    expect(mockWindowStore.updateWindow).toHaveBeenCalled()
  })

  it('handles toolbar functionality', async () => {
    const user = userEvent.setup();
    render(<Notepad windowId="test-window" />);
    
    // Test that toolbar buttons are present
    const boldButton = screen.getByRole('button', { name: /bold/i });
    const italicButton = screen.getByRole('button', { name: /italic/i });
    const underlineButton = screen.getByRole('button', { name: /underline/i });
    
    expect(boldButton).toBeInTheDocument();
    expect(italicButton).toBeInTheDocument();
    expect(underlineButton).toBeInTheDocument();
  });

  it('maintains content when window is minimized and restored', async () => {
    const user = userEvent.setup()
    render(<Notepad {...defaultProps} />)
    
    const textArea = screen.getByRole('textbox')
    await user.type(textArea, 'Persistent content')
    
    // Simulate minimize
    mockWindowStore.minimizeWindow('notepad-1')
    
    // Content should still be there
    expect(textArea).toHaveValue('Welcome to MituOS Notepad!\n\nStart typing your notes here...Persistent content')
  })
})
