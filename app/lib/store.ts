import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type User } from './auth'

// Types
export interface Window {
  id: string
  title: string
  icon: any
  x: number
  y: number
  width: number
  height: number
  minimized: boolean
  maximized: boolean
  component: string
  snapped?: "left" | "right" | null
  isResizing?: boolean
  zIndex: number
}

export interface FileEntry {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: number
  modified: Date
  path: string
  icon?: string
  content?: string
  metadata?: Record<string, any>
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto'
  accentColor: string
  dockPosition: 'bottom' | 'top' | 'left' | 'right'
  animations: boolean
  sound: boolean
  notifications: boolean
  autoSave: boolean
  language: string
  timezone: string
}

export interface AppState {
  // User & Authentication
  user: User | null
  isLoggedIn: boolean
  
  // Windows & UI
  windows: Window[]
  activeWindow: string | null
  nextZIndex: number
  
  // File System
  files: FileEntry[]
  currentPath: string
  clipboard: FileEntry[]
  
  // Settings
  settings: UserSettings
  
  // AI Assistant
  aiMessages: any[]
  aiEnabled: boolean
  
  // System
  notifications: any[]
  systemInfo: {
    battery: number
    wifi: boolean
    volume: number
    time: Date
  }
  
  // Actions
  setUser: (user: User | null) => void
  setLoggedIn: (loggedIn: boolean) => void
  
  // Window Management
  addWindow: (window: Omit<Window, 'id' | 'zIndex'>) => void
  updateWindow: (id: string, updates: Partial<Window>) => void
  removeWindow: (id: string) => void
  setActiveWindow: (id: string | null) => void
  bringToFront: (id: string) => void
  
  // File System
  addFile: (file: FileEntry) => void
  updateFile: (id: string, updates: Partial<FileEntry>) => void
  removeFile: (id: string) => void
  setCurrentPath: (path: string) => void
  setClipboard: (files: FileEntry[]) => void
  
  // Settings
  updateSettings: (settings: Partial<UserSettings>) => void
  
  // AI Assistant
  addAIMessage: (message: any) => void
  setAIEnabled: (enabled: boolean) => void
  
  // System
  addNotification: (notification: any) => void
  removeNotification: (id: string) => void
  updateSystemInfo: (info: Partial<AppState['systemInfo']>) => void
}

// Default settings
const defaultSettings: UserSettings = {
  theme: 'dark',
  accentColor: '#8b5cf6',
  dockPosition: 'bottom',
  animations: true,
  sound: true,
  notifications: true,
  autoSave: true,
  language: 'en',
  timezone: 'UTC'
}

// Default system info
const defaultSystemInfo = {
  battery: 85,
  wifi: true,
  volume: 70,
  time: new Date()
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isLoggedIn: false,
      windows: [],
      activeWindow: null,
      nextZIndex: 1,
      files: [],
      currentPath: '/',
      clipboard: [],
      settings: defaultSettings,
      aiMessages: [],
      aiEnabled: true,
      notifications: [],
      systemInfo: defaultSystemInfo,
      
      // User actions
      setUser: (user) => set({ user }),
      setLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
      
      // Window management
      addWindow: (window) => {
        const id = `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const zIndex = get().nextZIndex
        set((state) => ({
          windows: [...state.windows, { ...window, id, zIndex }],
          activeWindow: id,
          nextZIndex: zIndex + 1
        }))
      },
      
      updateWindow: (id, updates) => {
        set((state) => ({
          windows: state.windows.map(w => 
            w.id === id ? { ...w, ...updates } : w
          )
        }))
      },
      
      removeWindow: (id) => {
        set((state) => ({
          windows: state.windows.filter(w => w.id !== id),
          activeWindow: state.activeWindow === id ? null : state.activeWindow
        }))
      },
      
      setActiveWindow: (id) => {
        set({ activeWindow: id })
      },
      
      bringToFront: (id) => {
        const zIndex = get().nextZIndex
        set((state) => ({
          windows: state.windows.map(w => 
            w.id === id ? { ...w, zIndex } : w
          ),
          activeWindow: id,
          nextZIndex: zIndex + 1
        }))
      },
      
      // File system
      addFile: (file) => {
        set((state) => ({
          files: [...state.files, file]
        }))
      },
      
      updateFile: (id, updates) => {
        set((state) => ({
          files: state.files.map(f => 
            f.id === id ? { ...f, ...updates } : f
          )
        }))
      },
      
      removeFile: (id) => {
        set((state) => ({
          files: state.files.filter(f => f.id !== id)
        }))
      },
      
      setCurrentPath: (path) => {
        set({ currentPath: path })
      },
      
      setClipboard: (files) => {
        set({ clipboard: files })
      },
      
      // Settings
      updateSettings: (settings) => {
        set((state) => ({
          settings: { ...state.settings, ...settings }
        }))
      },
      
      // AI Assistant
      addAIMessage: (message) => {
        set((state) => ({
          aiMessages: [...state.aiMessages, message]
        }))
      },
      
      setAIEnabled: (enabled) => {
        set({ aiEnabled: enabled })
      },
      
      // System
      addNotification: (notification) => {
        const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        set((state) => ({
          notifications: [...state.notifications, { ...notification, id }]
        }))
      },
      
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }))
      },
      
      updateSystemInfo: (info) => {
        set((state) => ({
          systemInfo: { ...state.systemInfo, ...info }
        }))
      }
    }),
    {
      name: 'mominos-storage',
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        settings: state.settings,
        files: state.files,
        currentPath: state.currentPath,
        aiMessages: state.aiMessages,
        aiEnabled: state.aiEnabled
      })
    }
  )
)