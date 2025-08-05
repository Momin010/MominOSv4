"use client"

import { useState, useEffect } from "react"
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
  List,
  Upload,
  Download,
  Edit3,
  Star,
  MoreVertical,
  Home,
  Desktop,
  HardDrive,
  Network
} from "lucide-react"
import { useAppStore, type FileEntry } from "@/app/lib/store"
import { fileSystemService } from "@/app/lib/file-system"

export default function FileExplorerApp() {
  const { currentPath, files, setCurrentPath, addFile, removeFile, updateFile } = useAppStore()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [showNewFileDialog, setShowNewFileDialog] = useState(false)
  const [newFileName, setNewFileName] = useState("")
  const [newFileType, setNewFileType] = useState<'file' | 'folder'>('file')

  // Get files in current path
  const filesInCurrentPath = files.filter(file => file.path === currentPath)
  
  const filteredFiles = filesInCurrentPath.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getFileIcon = (file: FileEntry) => {
    return <span className="text-2xl">{file.icon}</span>
  }

  const handleFileClick = (file: FileEntry) => {
    if (file.type === 'folder') {
      setCurrentPath(file.path + '/' + file.name)
    } else {
      // Handle file opening - could open in appropriate app
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

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      if (newFileType === 'file') {
        fileSystemService.createFile(newFileName, '', currentPath)
      } else {
        fileSystemService.createFolder(newFileName, currentPath)
      }
      setNewFileName("")
      setShowNewFileDialog(false)
    }
  }

  const handleDeleteFile = (fileId: string) => {
    fileSystemService.deleteFile(fileId)
    setSelectedItems(prev => prev.filter(id => id !== fileId))
  }

  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach(file => {
        fileSystemService.uploadFile(file, currentPath)
      })
    }
  }

  const handleDownloadFile = (fileId: string) => {
    fileSystemService.downloadFile(fileId)
  }

  const getFileTypeColor = (file: FileEntry) => {
    switch (file.type) {
      case 'folder': return 'text-blue-400'
      case 'file':
        const extension = file.name.split('.').pop()?.toLowerCase()
        if (extension === 'pdf') return 'text-red-400'
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension || '')) return 'text-green-400'
        if (['mp3', 'wav', 'flac', 'aac'].includes(extension || '')) return 'text-purple-400'
        if (['mp4', 'avi', 'mov', 'mkv'].includes(extension || '')) return 'text-orange-400'
        if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) return 'text-yellow-400'
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