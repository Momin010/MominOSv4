"use client"

import React, { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FolderOpen, 
  File, 
  ArrowLeft, 
  Home, 
  Search,
  Grid3X3,
  List,
  Upload,
  Download,
  Trash2,
  Copy,
  Move,
  Plus,
  MoreVertical,
  Image,
  FileText,
  Music,
  Video
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StorageManager, type FileSystemItem } from "@/app/lib/storage"

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
  const [files, setFiles] = useState<FileSystemItem[]>([])
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [showContextMenu, setShowContextMenu] = useState<{ x: number; y: number; item?: FileSystemItem } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const storage = StorageManager.getInstance()

  React.useEffect(() => {
    setFiles(storage.loadFileSystem())
  }, [])

  const saveFiles = useCallback((newFiles: FileSystemItem[]) => {
    setFiles(newFiles)
    storage.saveFileSystem(newFiles)
  }, [storage])

  const getCurrentDirectoryFiles = useCallback(() => {
    if (currentPath === "/") {
      return files.filter(file => !file.parent)
    }
    const currentDir = files.find(f => f.id === currentPath)
    if (!currentDir?.children) return []
    return files.filter(file => currentDir.children?.includes(file.id))
  }, [files, currentPath])


  const filteredFiles = getCurrentDirectoryFiles().filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getFileIcon = (file: FileSystemItem) => {
    if (file.type === 'folder') return FolderOpen

    const extension = file.name.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return Image
      case 'txt':
      case 'doc':
      case 'docx':
        return FileText
      case 'mp3':
      case 'wav':
      case 'flac':
        return Music
      case 'mp4':
      case 'avi':
      case 'mkv':
        return Video
      default:
        return File
    }
  }

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetId?: string) => {
    e.preventDefault()
    if (!draggedItem) return

    const draggedFile = files.find(f => f.id === draggedItem)
    const targetFile = targetId ? files.find(f => f.id === targetId) : null

    if (!draggedFile) return

    // Only allow dropping into folders
    if (targetFile && targetFile.type !== 'folder') return

    const newFiles = files.map(file => {
      if (file.id === draggedItem) {
        return {
          ...file,
          parent: targetFile?.id || undefined
        }
      }

      // Update old parent
      if (file.id === draggedFile.parent) {
        return {
          ...file,
          children: file.children?.filter(id => id !== draggedItem) || []
        }
      }

      // Update new parent
      if (file.id === targetFile?.id) {
        return {
          ...file,
          children: [...(file.children || []), draggedItem]
        }
      }

      return file
    })

    saveFiles(newFiles)
    setDraggedItem(null)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || [])

    const newFiles = uploadedFiles.map((file, index) => ({
      id: `upload_${Date.now()}_${index}`,
      name: file.name,
      type: 'file' as const,
      size: file.size.toString(), // Ensure size is a string as in mockFiles
      modified: new Date().toISOString(), // Ensure modified is a string
      parent: currentPath === "/" ? undefined : currentPath,
      content: file.type.startsWith('text/') ? 'File uploaded successfully' : undefined
    }))

    const updatedFiles = [...files, ...newFiles]

    // Update parent directory if needed
    if (currentPath !== "/") {
      const parentIndex = updatedFiles.findIndex(f => f.id === currentPath)
      if (parentIndex !== -1) {
        updatedFiles[parentIndex] = {
          ...updatedFiles[parentIndex],
          children: [
            ...(updatedFiles[parentIndex].children || []),
            ...newFiles.map(f => f.id)
          ]
        }
      }
    }

    saveFiles(updatedFiles)
  }

  const createNewFolder = () => {
    const newFolder: FileSystemItem = {
      id: `folder_${Date.now()}`,
      name: 'New Folder',
      type: 'folder',
      modified: new Date().toISOString(), // Ensure modified is a string
      parent: currentPath === "/" ? undefined : currentPath,
      children: []
    }

    const updatedFiles = [...files, newFolder]

    if (currentPath !== "/") {
      const parentIndex = updatedFiles.findIndex(f => f.id === currentPath)
      if (parentIndex !== -1) {
        updatedFiles[parentIndex] = {
          ...updatedFiles[parentIndex],
          children: [...(updatedFiles[parentIndex].children || []), newFolder.id]
        }
      }
    }

    saveFiles(updatedFiles)
  }

  const deleteItem = (itemId: string) => {
    const newFiles = files.filter(file => {
      // Remove the item and all its children recursively
      if (file.id === itemId) return false
      if (file.parent === itemId) return false
      return true
    })

    // Update parent to remove reference
    const item = files.find(f => f.id === itemId)
    if (item?.parent) {
      const parentIndex = newFiles.findIndex(f => f.id === item.parent)
      if (parentIndex !== -1) {
        newFiles[parentIndex] = {
          ...newFiles[parentIndex],
          children: newFiles[parentIndex].children?.filter(id => id !== itemId) || []
        }
      }
    }

    saveFiles(newFiles)
    setShowContextMenu(null)
  }

  const handleContextMenu = (e: React.MouseEvent, item: FileSystemItem) => {
    e.preventDefault()
    setShowContextMenu({
      x: e.clientX,
      y: e.clientY,
      item
    })
  }

  const navigateToFolder = (folderId: string) => {
    setCurrentPath(folderId)
    setSearchQuery("")
  }

  const goBack = () => {
    const currentDir = files.find(f => f.id === currentPath)
    if (currentDir?.parent) {
      setCurrentPath(currentDir.parent)
    } else {
      setCurrentPath("/")
    }
  }

  const getFileTypeColor = (file: FileSystemItem) => {
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
              onClick={goBack}
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
              <Home className="w-4 h-4 text-white" />
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
              {viewMode === 'grid' ? <List className="w-4 h-4 text-white" /> : <Grid3X3 className="w-4 h-4 text-white" />}
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
          <Input
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
          <Button onClick={createNewFolder} className="glass-button px-3 py-1 text-sm">
            <Plus className="w-4 h-4 mr-1" />
            New Folder
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            multiple
          />
          <Button onClick={() => fileInputRef.current?.click()} className="glass-button px-3 py-1 text-sm">
            <Upload className="w-4 h-4 mr-1" />
            Upload
          </Button>
          <Button className="glass-button px-3 py-1 text-sm">
            <Copy className="w-4 h-4 mr-1" />
            Copy
          </Button>
          <Button className="glass-button px-3 py-1 text-sm">
            <Move className="w-4 h-4 mr-1" />
            Move
          </Button>
          <Button className="glass-button px-3 py-1 text-sm text-red-400">
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      {/* File Grid/List */}
      <div className="flex-1 p-4 overflow-auto" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, currentPath)}>
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-4 gap-4">
            {filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                className={`glass-card p-4 cursor-pointer ${
                  selectedItems.includes(file.id) ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => file.type === 'folder' ? navigateToFolder(file.id) : console.log("Opening file:", file.name)}
                onContextMenu={(e) => handleContextMenu(e, file)}
                onDragStart={(e) => handleDragStart(e, file.id)}
                draggable
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-lg glass-icon flex items-center justify-center mb-2 ${getFileTypeColor(file)}`}>
                    {React.createElement(getFileIcon(file), { className: "w-6 h-6" })}
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
                onClick={() => file.type === 'folder' ? navigateToFolder(file.id) : console.log("Opening file:", file.name)}
                onContextMenu={(e) => handleContextMenu(e, file)}
                onDragStart={(e) => handleDragStart(e, file.id)}
                draggable
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg glass-icon flex items-center justify-center ${getFileTypeColor(file)}`}>
                    {React.createElement(getFileIcon(file), { className: "w-5 h-5" })}
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

      {/* Context Menu */}
      {showContextMenu && (
        <div
          className="fixed glass-card p-2 z-10"
          style={{ top: showContextMenu.y, left: showContextMenu.x }}
        >
          {showContextMenu.item && (
            <>
              <button onClick={() => deleteItem(showContextMenu.item!.id)} className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-white/10 rounded">
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </button>
              {showContextMenu.item.type === 'folder' && (
                <button onClick={() => navigateToFolder(showContextMenu.item!.id)} className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-white/10 rounded">
                  <ArrowRight className="w-4 h-4 mr-2" /> Open
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}