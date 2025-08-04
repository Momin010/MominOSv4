"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Folder, 
  File, 
  FileText, 
  Image, 
  Music, 
  Video, 
  Archive, 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Copy, 
  Scissors, 
  Clipboard,
  Search,
  Grid,
  List
} from "lucide-react"

interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: string
  modified: string
  icon: any
  path: string
}

export default function FileExplorerApp() {
  console.log("🔥 REAL FileExplorerApp rendered")
  const [currentPath, setCurrentPath] = useState("/")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)

  // Mock file system
  const mockFiles: FileItem[] = [
    { id: '1', name: 'Documents', type: 'folder', modified: '2024-01-15', icon: Folder, path: '/Documents' },
    { id: '2', name: 'Pictures', type: 'folder', modified: '2024-01-14', icon: Folder, path: '/Pictures' },
    { id: '3', name: 'Music', type: 'folder', modified: '2024-01-13', icon: Folder, path: '/Music' },
    { id: '4', name: 'report.pdf', type: 'file', size: '2.3 MB', modified: '2024-01-12', icon: FileText, path: '/report.pdf' },
    { id: '5', name: 'photo.jpg', type: 'file', size: '1.8 MB', modified: '2024-01-11', icon: Image, path: '/photo.jpg' },
    { id: '6', name: 'song.mp3', type: 'file', size: '4.2 MB', modified: '2024-01-10', icon: Music, path: '/song.mp3' },
    { id: '7', name: 'video.mp4', type: 'file', size: '15.7 MB', modified: '2024-01-09', icon: Video, path: '/video.mp4' },
    { id: '8', name: 'archive.zip', type: 'file', size: '8.1 MB', modified: '2024-01-08', icon: Archive, path: '/archive.zip' },
  ]

  const filteredFiles = mockFiles.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getFileIcon = (file: FileItem) => {
    const Icon = file.icon
    return <Icon className="w-6 h-6" />
  }

  const handleFileClick = (file: FileItem) => {
    if (file.type === 'folder') {
      setCurrentPath(file.path)
    } else {
      // Handle file opening
      console.log(`Opening file: ${file.name}`)
    }
  }

  const handleFileSelect = (fileId: string) => {
    setSelectedItems(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const getFileTypeColor = (file: FileItem) => {
    switch (file.type) {
      case 'folder': return 'text-blue-400'
      case 'file':
        if (file.name.endsWith('.pdf')) return 'text-red-400'
        if (file.name.endsWith('.jpg') || file.name.endsWith('.png')) return 'text-green-400'
        if (file.name.endsWith('.mp3')) return 'text-purple-400'
        if (file.name.endsWith('.mp4')) return 'text-orange-400'
        if (file.name.endsWith('.zip')) return 'text-yellow-400'
        return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="h-full bg-black/20 backdrop-blur-xl flex flex-col">
      {/* Header */}
      <div className="glass-topbar p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => setCurrentPath("/")}
              className="glass-button p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </motion.button>
            <motion.button
              onClick={() => setCurrentPath("/")}
              className="glass-button p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowRight className="w-4 h-4 text-white" />
            </motion.button>
            <span className="text-white font-medium">{currentPath}</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setShowSearch(!showSearch)}
              className="glass-button p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Search className="w-4 h-4 text-white" />
            </motion.button>
            <motion.button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="glass-button p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {viewMode === 'grid' ? <List className="w-4 h-4 text-white" /> : <Grid className="w-4 h-4 text-white" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <motion.div
          className="p-4 border-b border-white/10"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input w-full text-white placeholder-gray-400"
          />
        </motion.div>
      )}

      {/* Toolbar */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <motion.button
            className="glass-button px-3 py-1 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4 h-4 mr-1" />
            New
          </motion.button>
          <motion.button
            className="glass-button px-3 py-1 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Copy className="w-4 h-4 mr-1" />
            Copy
          </motion.button>
          <motion.button
            className="glass-button px-3 py-1 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Scissors className="w-4 h-4 mr-1" />
            Cut
          </motion.button>
          <motion.button
            className="glass-button px-3 py-1 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Clipboard className="w-4 h-4 mr-1" />
            Paste
          </motion.button>
          <motion.button
            className="glass-button px-3 py-1 text-sm text-red-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </motion.button>
        </div>
      </div>

      {/* File Grid/List */}
      <div className="flex-1 p-4 overflow-auto">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-4 gap-4">
            {filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                className={`glass-card p-4 cursor-pointer ${
                  selectedItems.includes(file.id) ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => handleFileClick(file)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  handleFileSelect(file.id)
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-lg glass-icon flex items-center justify-center mb-2 ${getFileTypeColor(file)}`}>
                    {getFileIcon(file)}
                  </div>
                  <span className="text-white text-sm font-medium truncate w-full">{file.name}</span>
                  {file.size && (
                    <span className="text-gray-400 text-xs">{file.size}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                className={`glass-card p-3 cursor-pointer ${
                  selectedItems.includes(file.id) ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => handleFileClick(file)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  handleFileSelect(file.id)
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg glass-icon flex items-center justify-center ${getFileTypeColor(file)}`}>
                    {getFileIcon(file)}
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-medium">{file.name}</span>
                    <div className="text-gray-400 text-xs">
                      {file.size && `${file.size} • `}{file.modified}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 