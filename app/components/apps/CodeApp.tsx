
"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Code, 
  File, 
  Folder, 
  Plus, 
  Save, 
  Search, 
  Replace, 
  Play, 
  Square, 
  GitBranch,
  Settings,
  Terminal,
  FileText,
  Image,
  Database,
  Globe,
  Braces,
  Hash,
  Type,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  X,
  Copy,
  Scissors,
  Clipboard,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut
} from "lucide-react"

interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  content?: string
  children?: FileItem[]
  language?: string
  path: string
  modified?: boolean
}

interface Tab {
  id: string
  name: string
  content: string
  language: string
  path: string
  modified: boolean
}

export default function CodeApp() {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'src',
      type: 'folder',
      path: '/src',
      children: [
        {
          id: '2',
          name: 'App.tsx',
          type: 'file',
          content: `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to MominOS Code Editor</h1>
        <p>Start building amazing applications!</p>
      </header>
    </div>
  );
}

export default App;`,
          language: 'typescript',
          path: '/src/App.tsx',
          modified: false
        },
        {
          id: '3',
          name: 'index.ts',
          type: 'file',
          content: `// Entry point for the application
import { createApp } from './app';
import { setupRouter } from './router';
import { initializeDatabase } from './database';

async function bootstrap() {
  try {
    await initializeDatabase();
    const app = createApp();
    setupRouter(app);
    
    app.listen(3000, () => {
      console.log('Server running on http://localhost:3000');
    });
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();`,
          language: 'typescript',
          path: '/src/index.ts',
          modified: false
        }
      ]
    },
    {
      id: '4',
      name: 'styles',
      type: 'folder',
      path: '/styles',
      children: [
        {
          id: '5',
          name: 'main.css',
          type: 'file',
          content: `/* Main stylesheet for MominOS applications */
:root {
  --primary-color: #8b5cf6;
  --secondary-color: #10b981;
  --background: #0f172a;
  --surface: #1e293b;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--background);
  color: var(--text-primary);
  line-height: 1.6;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
}`,
          language: 'css',
          path: '/styles/main.css',
          modified: false
        }
      ]
    },
    {
      id: '6',
      name: 'package.json',
      type: 'file',
      content: `{
  "name": "mominos-project",
  "version": "1.0.0",
  "description": "A MominOS application",
  "main": "src/index.ts",
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.0.0",
    "nodemon": "^3.0.0",
    "jest": "^29.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  },
  "keywords": ["mominos", "desktop", "app"],
  "author": "MominOS Developer",
  "license": "MIT"
}`,
      language: 'json',
      path: '/package.json',
      modified: false
    }
  ])

  const [tabs, setTabs] = useState<Tab[]>([])
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [replaceQuery, setReplaceQuery] = useState("")
  const [fontSize, setFontSize] = useState(14)
  const [wordWrap, setWordWrap] = useState(true)
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [theme, setTheme] = useState('dark')
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['1', '4'])

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') return Folder
    
    const ext = file.name.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'tsx':
      case 'ts':
      case 'js':
      case 'jsx':
        return Code
      case 'css':
      case 'scss':
      case 'less':
        return Hash
      case 'html':
      case 'htm':
        return Globe
      case 'json':
        return Braces
      case 'md':
      case 'txt':
        return FileText
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return Image
      case 'sql':
        return Database
      default:
        return File
    }
  }

  const getLanguageFromFile = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'ts':
      case 'tsx':
        return 'typescript'
      case 'js':
      case 'jsx':
        return 'javascript'
      case 'css':
        return 'css'
      case 'html':
        return 'html'
      case 'json':
        return 'json'
      case 'md':
        return 'markdown'
      case 'py':
        return 'python'
      case 'java':
        return 'java'
      case 'cpp':
      case 'cc':
      case 'cxx':
        return 'cpp'
      case 'c':
        return 'c'
      default:
        return 'text'
    }
  }

  const openFile = (file: FileItem) => {
    if (file.type === 'folder' || !file.content) return

    const existingTab = tabs.find(tab => tab.path === file.path)
    if (existingTab) {
      setActiveTab(existingTab.id)
      return
    }

    const newTab: Tab = {
      id: file.id,
      name: file.name,
      content: file.content,
      language: file.language || getLanguageFromFile(file.name),
      path: file.path,
      modified: false
    }

    setTabs(prev => [...prev, newTab])
    setActiveTab(newTab.id)
  }

  const closeTab = (tabId: string) => {
    setTabs(prev => prev.filter(tab => tab.id !== tabId))
    if (activeTab === tabId) {
      const remainingTabs = tabs.filter(tab => tab.id !== tabId)
      setActiveTab(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1].id : null)
    }
  }

  const updateTabContent = (tabId: string, content: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, content, modified: true }
        : tab
    ))
  }

  const saveFile = () => {
    if (!activeTab) return
    
    setTabs(prev => prev.map(tab => 
      tab.id === activeTab 
        ? { ...tab, modified: false }
        : tab
    ))
    
    // In a real app, you would save to the file system
    console.log('File saved:', activeTab)
  }

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    )
  }

  const renderFileTree = (items: FileItem[], level = 0) => {
    return items.map(file => {
      const Icon = getFileIcon(file)
      const isExpanded = expandedFolders.includes(file.id)
      
      return (
        <div key={file.id}>
          <motion.div
            className={`flex items-center gap-2 p-2 hover:bg-white/10 cursor-pointer ${
              activeTab === file.id ? 'bg-white/20' : ''
            }`}
            style={{ paddingLeft: `${12 + level * 16}px` }}
            onClick={() => file.type === 'folder' ? toggleFolder(file.id) : openFile(file)}
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            {file.type === 'folder' && (
              isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
            )}
            <Icon className={`w-4 h-4 ${
              file.type === 'folder' ? 'text-blue-400' : 'text-gray-400'
            }`} />
            <span className="text-white text-sm">{file.name}</span>
            {file.modified && <div className="w-2 h-2 bg-orange-400 rounded-full" />}
          </motion.div>
          {file.type === 'folder' && file.children && isExpanded && (
            <div>{renderFileTree(file.children, level + 1)}</div>
          )}
        </div>
      )
    })
  }

  const activeTabData = tabs.find(tab => tab.id === activeTab)

  return (
    <div className="h-full bg-black/20 backdrop-blur-xl flex flex-col">
      {/* Header */}
      <div className="glass-topbar p-2 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-purple-400" />
            <span className="text-white font-medium">Code Editor</span>
          </div>
          <div className="flex items-center gap-1">
            <motion.button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="glass-button p-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Folder className="w-4 h-4 text-white" />
            </motion.button>
            <motion.button
              onClick={() => setShowSearch(!showSearch)}
              className="glass-button p-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Search className="w-4 h-4 text-white" />
            </motion.button>
            <motion.button
              onClick={saveFile}
              className="glass-button p-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Save className="w-4 h-4 text-white" />
            </motion.button>
            <motion.button
              className="glass-button p-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Play className="w-4 h-4 text-green-400" />
            </motion.button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Lines: {activeTabData?.content.split('\n').length || 0}</span>
          <span>Language: {activeTabData?.language || 'None'}</span>
          <span>Encoding: UTF-8</span>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <motion.div
          className="p-4 border-b border-white/10 glass-card"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input flex-1 text-white placeholder-gray-400"
            />
            <input
              type="text"
              placeholder="Replace..."
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              className="glass-input flex-1 text-white placeholder-gray-400"
            />
            <motion.button
              className="glass-button px-3 py-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Replace className="w-4 h-4 text-white" />
            </motion.button>
          </div>
        </motion.div>
      )}

      <div className="flex-1 flex">
        {/* Sidebar */}
        {!sidebarCollapsed && (
          <div className="w-64 glass-card border-r border-white/10">
            <div className="p-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium text-sm">Explorer</span>
                <motion.button
                  className="glass-button p-1 ml-auto"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus className="w-3 h-3 text-white" />
                </motion.button>
              </div>
            </div>
            <div className="overflow-auto">
              {renderFileTree(files)}
            </div>
          </div>
        )}

        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          {tabs.length > 0 && (
            <div className="flex items-center gap-0 border-b border-white/10 overflow-x-auto">
              {tabs.map(tab => (
                <motion.div
                  key={tab.id}
                  className={`flex items-center gap-2 px-3 py-2 border-r border-white/10 cursor-pointer min-w-0 ${
                    activeTab === tab.id ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <span className="text-white text-sm truncate">{tab.name}</span>
                  {tab.modified && <div className="w-2 h-2 bg-orange-400 rounded-full" />}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation()
                      closeTab(tab.id)
                    }}
                    className="text-gray-400 hover:text-white"
                    whileHover={{ scale: 1.1 }}
                  >
                    <X className="w-3 h-3" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Editor Content */}
          <div className="flex-1 relative">
            {activeTabData ? (
              <div className="h-full flex">
                {/* Line Numbers */}
                {showLineNumbers && (
                  <div className="w-12 bg-black/30 border-r border-white/10 p-2 text-right text-gray-500 text-sm font-mono overflow-hidden">
                    {activeTabData.content.split('\n').map((_, i) => (
                      <div key={i} className="leading-6">{i + 1}</div>
                    ))}
                  </div>
                )}
                
                {/* Code Editor */}
                <textarea
                  ref={textareaRef}
                  value={activeTabData.content}
                  onChange={(e) => updateTabContent(activeTabData.id, e.target.value)}
                  className="flex-1 bg-transparent text-white font-mono p-4 outline-none resize-none leading-6"
                  style={{ 
                    fontSize: `${fontSize}px`,
                    whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
                    wordWrap: wordWrap ? 'break-word' : 'normal'
                  }}
                  spellCheck={false}
                  placeholder="Start coding..."
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No file selected</p>
                  <p className="text-sm">Open a file from the explorer to start coding</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="glass-topbar p-2 border-t border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4 text-gray-400">
          <div className="flex items-center gap-1">
            <GitBranch className="w-3 h-3" />
            <span>main</span>
          </div>
          {activeTabData && (
            <>
              <span>Ln 1, Col 1</span>
              <span>{activeTabData.language}</span>
              <span>Spaces: 2</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <motion.button
            onClick={() => setFontSize(Math.max(10, fontSize - 1))}
            className="hover:text-white"
            whileHover={{ scale: 1.1 }}
          >
            <ZoomOut className="w-3 h-3" />
          </motion.button>
          <span>{fontSize}px</span>
          <motion.button
            onClick={() => setFontSize(Math.min(24, fontSize + 1))}
            className="hover:text-white"
            whileHover={{ scale: 1.1 }}
          >
            <ZoomIn className="w-3 h-3" />
          </motion.button>
          <motion.button
            onClick={() => setWordWrap(!wordWrap)}
            className={`hover:text-white ${wordWrap ? 'text-purple-400' : ''}`}
            whileHover={{ scale: 1.1 }}
          >
            <Type className="w-3 h-3" />
          </motion.button>
          <motion.button
            onClick={() => setShowLineNumbers(!showLineNumbers)}
            className={`hover:text-white ${showLineNumbers ? 'text-purple-400' : ''}`}
            whileHover={{ scale: 1.1 }}
          >
            <Hash className="w-3 h-3" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
