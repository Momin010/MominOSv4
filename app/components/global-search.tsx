"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, FileText, Folder, Settings, Calculator, Music, Image, Code, Terminal, Mail, Calendar, Chrome, X, Command } from "lucide-react"
import { useAppStore } from "@/app/lib/store"
import { fileSystemService } from "@/app/lib/file-system"

interface SearchResult {
  id: string
  type: 'file' | 'folder' | 'app' | 'setting' | 'action'
  title: string
  description: string
  icon: any
  action: () => void
  score: number
}

export default function GlobalSearch() {
  const { files, addNotification } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Available apps
  const apps = [
    { id: 'calculator', name: 'Calculator', description: 'Scientific calculator', icon: Calculator },
    { id: 'file-explorer', name: 'File Explorer', description: 'Browse and manage files', icon: Folder },
    { id: 'music', name: 'Music Player', description: 'Play audio files', icon: Music },
    { id: 'photos', name: 'Photos', description: 'View and edit images', icon: Image },
    { id: 'code', name: 'Code Editor', description: 'Edit text and code files', icon: Code },
    { id: 'terminal', name: 'Terminal', description: 'Command line interface', icon: Terminal },
    { id: 'email', name: 'Email', description: 'Send and receive emails', icon: Mail },
    { id: 'calendar', name: 'Calendar', description: 'Manage schedule and events', icon: Calendar },
    { id: 'browser', name: 'Browser', description: 'Browse the web', icon: Chrome },
    { id: 'settings', name: 'Settings', description: 'System preferences', icon: Settings },
  ]

  // Search functions
  const searchFiles = (query: string): SearchResult[] => {
    const searchResults = fileSystemService.searchFiles(query)
    return searchResults.map(file => ({
      id: file.id,
      type: file.type as 'file' | 'folder',
      title: file.name,
      description: `${file.type === 'folder' ? 'Folder' : 'File'} • ${file.path}`,
      icon: file.type === 'folder' ? Folder : FileText,
      action: () => {
        addNotification({
          type: 'info',
          title: 'Opening File',
          message: `Opening ${file.name}`,
          duration: 3000
        })
      },
      score: query.toLowerCase().includes(file.name.toLowerCase()) ? 1 : 0.5
    }))
  }

  const searchApps = (query: string): SearchResult[] => {
    return apps
      .filter(app => 
        app.name.toLowerCase().includes(query.toLowerCase()) ||
        app.description.toLowerCase().includes(query.toLowerCase())
      )
      .map(app => ({
        id: app.id,
        type: 'app',
        title: app.name,
        description: app.description,
        icon: app.icon,
        action: () => {
          addNotification({
            type: 'success',
            title: 'Opening App',
            message: `Opening ${app.name}`,
            duration: 3000
          })
        },
        score: 1
      }))
  }

  const searchSettings = (query: string): SearchResult[] => {
    const settingsOptions = [
      { name: 'Display Settings', description: 'Change screen resolution and brightness' },
      { name: 'Sound Settings', description: 'Adjust volume and audio preferences' },
      { name: 'Network Settings', description: 'Configure WiFi and network connections' },
      { name: 'Privacy Settings', description: 'Manage privacy and security options' },
      { name: 'System Updates', description: 'Check for system updates' },
    ]

    return settingsOptions
      .filter(setting => 
        setting.name.toLowerCase().includes(query.toLowerCase()) ||
        setting.description.toLowerCase().includes(query.toLowerCase())
      )
      .map(setting => ({
        id: setting.name.toLowerCase().replace(' ', '-'),
        type: 'setting',
        title: setting.name,
        description: setting.description,
        icon: Settings,
        action: () => {
          addNotification({
            type: 'info',
            title: 'Opening Settings',
            message: `Opening ${setting.name}`,
            duration: 3000
          })
        },
        score: 0.8
      }))
  }

  const searchActions = (query: string): SearchResult[] => {
    const actions = [
      { name: 'Take Screenshot', description: 'Capture screen image' },
      { name: 'Empty Trash', description: 'Permanently delete files in trash' },
      { name: 'Restart System', description: 'Restart the operating system' },
      { name: 'Sleep Mode', description: 'Put system to sleep' },
      { name: 'Lock Screen', description: 'Lock the screen' },
    ]

    return actions
      .filter(action => 
        action.name.toLowerCase().includes(query.toLowerCase()) ||
        action.description.toLowerCase().includes(query.toLowerCase())
      )
      .map(action => ({
        id: action.name.toLowerCase().replace(' ', '-'),
        type: 'action',
        title: action.name,
        description: action.description,
        icon: Command,
        action: () => {
          addNotification({
            type: 'warning',
            title: 'System Action',
            message: `Executing ${action.name}`,
            duration: 3000
          })
        },
        score: 0.6
      }))
  }

  // Perform search
  useEffect(() => {
    if (query.trim()) {
      const allResults = [
        ...searchFiles(query),
        ...searchApps(query),
        ...searchSettings(query),
        ...searchActions(query)
      ]
      
      // Sort by relevance score
      allResults.sort((a, b) => b.score - a.score)
      setResults(allResults.slice(0, 10))
      setSelectedIndex(0)
    } else {
      setResults([])
    }
  }, [query])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        setQuery("")
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleResultSelect = (result: SearchResult) => {
    result.action()
    setIsOpen(false)
    setQuery("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault()
      handleResultSelect(results[selectedIndex])
    }
  }

  return (
    <>
      {/* Search Trigger */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Search</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-white/50 bg-white/10 rounded">
          <Command className="w-3 h-3" />
          K
        </kbd>
      </motion.button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="w-full max-w-2xl mx-4"
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search files, apps, settings..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-12 pr-4 py-4 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-white/10 text-white/50 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Results */}
              {results.length > 0 && (
                <motion.div
                  className="mt-4 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {results.map((result, index) => {
                    const Icon = result.icon
                    return (
                      <motion.button
                        key={result.id}
                        onClick={() => handleResultSelect(result)}
                        className={`w-full flex items-center gap-3 p-4 hover:bg-white/10 transition-colors ${
                          index === selectedIndex ? 'bg-white/10' : ''
                        }`}
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="text-white font-medium">{result.title}</h4>
                          <p className="text-white/60 text-sm">{result.description}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <kbd className="px-2 py-1 text-xs font-medium text-white/50 bg-white/10 rounded">
                            Enter
                          </kbd>
                        </div>
                      </motion.button>
                    )
                  })}
                </motion.div>
              )}

              {/* No Results */}
              {query && results.length === 0 && (
                <motion.div
                  className="mt-4 p-8 text-center text-white/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No results found for "{query}"</p>
                  <p className="text-sm mt-1">Try different keywords or check your spelling</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}