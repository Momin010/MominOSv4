// File System Service for MominOS
import { useAppStore, type FileEntry } from './store'

export interface FileUploadResult {
  success: boolean
  file?: FileEntry
  error?: string
}

export interface FileSystemStats {
  totalFiles: number
  totalFolders: number
  totalSize: number
  lastModified: Date
}

class FileSystemService {
  private readonly STORAGE_KEY = 'mominos-filesystem'
  private readonly MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

  constructor() {
    this.initializeDefaultFiles()
  }

  private initializeDefaultFiles() {
    const store = useAppStore.getState()
    if (store.files.length === 0) {
      // Create default file structure
      const defaultFiles: FileEntry[] = [
        {
          id: 'folder-documents',
          name: 'Documents',
          type: 'folder',
          size: 0,
          modified: new Date(),
          path: '/',
          icon: '📁'
        },
        {
          id: 'folder-pictures',
          name: 'Pictures',
          type: 'folder',
          size: 0,
          modified: new Date(),
          path: '/',
          icon: '📸'
        },
        {
          id: 'folder-music',
          name: 'Music',
          type: 'folder',
          size: 0,
          modified: new Date(),
          path: '/',
          icon: '🎵'
        },
        {
          id: 'folder-downloads',
          name: 'Downloads',
          type: 'folder',
          size: 0,
          modified: new Date(),
          path: '/',
          icon: '⬇️'
        },
        {
          id: 'file-welcome',
          name: 'Welcome.txt',
          type: 'file',
          size: 256,
          modified: new Date(),
          path: '/',
          content: 'Welcome to MominOS!\n\nThis is your personal digital workspace. You can:\n- Create and organize files\n- Upload and manage documents\n- Store your photos and music\n- Keep your work organized\n\nEnjoy your new desktop experience!',
          icon: '📄'
        }
      ]

      defaultFiles.forEach(file => store.addFile(file))
    }
  }

  // Get files in current directory
  getFilesInPath(path: string): FileEntry[] {
    const store = useAppStore.getState()
    return store.files.filter(file => file.path === path)
  }

  // Get file by ID
  getFileById(id: string): FileEntry | null {
    const store = useAppStore.getState()
    return store.files.find(file => file.id === id) || null
  }

  // Create new file
  createFile(name: string, content: string = '', path: string = '/'): FileEntry {
    const store = useAppStore.getState()
    const newFile: FileEntry = {
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      type: 'file',
      size: new Blob([content]).size,
      modified: new Date(),
      path,
      content,
      icon: this.getFileIcon(name)
    }

    store.addFile(newFile)
    return newFile
  }

  // Create new folder
  createFolder(name: string, path: string = '/'): FileEntry {
    const store = useAppStore.getState()
    const newFolder: FileEntry = {
      id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      type: 'folder',
      size: 0,
      modified: new Date(),
      path,
      icon: '📁'
    }

    store.addFile(newFolder)
    return newFolder
  }

  // Update file content
  updateFile(id: string, content: string): boolean {
    const store = useAppStore.getState()
    const file = store.files.find(f => f.id === id)
    
    if (file && file.type === 'file') {
      store.updateFile(id, {
        content,
        size: new Blob([content]).size,
        modified: new Date()
      })
      return true
    }
    return false
  }

  // Delete file/folder
  deleteFile(id: string): boolean {
    const store = useAppStore.getState()
    const file = store.files.find(f => f.id === id)
    
    if (file) {
      // If it's a folder, delete all files inside it
      if (file.type === 'folder') {
        const filesInFolder = store.files.filter(f => f.path.startsWith(file.path + '/' + file.name))
        filesInFolder.forEach(f => store.removeFile(f.id))
      }
      
      store.removeFile(id)
      return true
    }
    return false
  }

  // Move file/folder
  moveFile(id: string, newPath: string): boolean {
    const store = useAppStore.getState()
    const file = store.files.find(f => f.id === id)
    
    if (file) {
      store.updateFile(id, {
        path: newPath,
        modified: new Date()
      })
      return true
    }
    return false
  }

  // Rename file/folder
  renameFile(id: string, newName: string): boolean {
    const store = useAppStore.getState()
    const file = store.files.find(f => f.id === id)
    
    if (file) {
      store.updateFile(id, {
        name: newName,
        modified: new Date(),
        icon: file.type === 'file' ? this.getFileIcon(newName) : '📁'
      })
      return true
    }
    return false
  }

  // Upload file
  async uploadFile(file: File, path: string = '/'): Promise<FileUploadResult> {
    try {
      if (file.size > this.MAX_FILE_SIZE) {
        return {
          success: false,
          error: `File size exceeds maximum limit of ${this.MAX_FILE_SIZE / 1024 / 1024}MB`
        }
      }

      const content = await this.readFileAsText(file)
      const newFile: FileEntry = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: 'file',
        size: file.size,
        modified: new Date(),
        path,
        content,
        icon: this.getFileIcon(file.name),
        metadata: {
          originalName: file.name,
          mimeType: file.type,
          lastModified: new Date(file.lastModified)
        }
      }

      const store = useAppStore.getState()
      store.addFile(newFile)

      return {
        success: true,
        file: newFile
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    }
  }

  // Download file
  downloadFile(id: string): void {
    const store = useAppStore.getState()
    const file = store.files.find(f => f.id === id)
    
    if (file && file.type === 'file') {
      const blob = new Blob([file.content || ''], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  // Search files
  searchFiles(query: string): FileEntry[] {
    const store = useAppStore.getState()
    const lowerQuery = query.toLowerCase()
    
    return store.files.filter(file => 
      file.name.toLowerCase().includes(lowerQuery) ||
      (file.content && file.content.toLowerCase().includes(lowerQuery))
    )
  }

  // Get file system statistics
  getStats(): FileSystemStats {
    const store = useAppStore.getState()
    const files = store.files.filter(f => f.type === 'file')
    const folders = store.files.filter(f => f.type === 'folder')
    const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0)
    const lastModified = store.files.length > 0 
      ? new Date(Math.max(...store.files.map(f => f.modified.getTime())))
      : new Date()

    return {
      totalFiles: files.length,
      totalFolders: folders.length,
      totalSize,
      lastModified
    }
  }

  // Get file icon based on extension
  private getFileIcon(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase()
    
    const iconMap: Record<string, string> = {
      // Documents
      'txt': '📄',
      'doc': '📄',
      'docx': '📄',
      'pdf': '📄',
      'rtf': '📄',
      
      // Images
      'jpg': '🖼️',
      'jpeg': '🖼️',
      'png': '🖼️',
      'gif': '🖼️',
      'bmp': '🖼️',
      'svg': '🖼️',
      
      // Audio
      'mp3': '🎵',
      'wav': '🎵',
      'flac': '🎵',
      'aac': '🎵',
      
      // Video
      'mp4': '🎬',
      'avi': '🎬',
      'mov': '🎬',
      'mkv': '🎬',
      
      // Code
      'js': '📝',
      'ts': '📝',
      'jsx': '📝',
      'tsx': '📝',
      'html': '📝',
      'css': '📝',
      'json': '📝',
      'py': '📝',
      'java': '📝',
      'cpp': '📝',
      'c': '📝',
      
      // Archives
      'zip': '📦',
      'rar': '📦',
      '7z': '📦',
      'tar': '📦',
      'gz': '📦',
      
      // Spreadsheets
      'xls': '📊',
      'xlsx': '📊',
      'csv': '📊',
      
      // Presentations
      'ppt': '📽️',
      'pptx': '📽️',
      
      // Data
      'xml': '📋',
      'sql': '🗄️',
      'db': '🗄️',
      'sqlite': '🗄️'
    }
    
    return iconMap[extension || ''] || '📄'
  }

  // Read file as text
  private readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = (e) => reject(e)
      reader.readAsText(file)
    })
  }

  // Export file system to JSON
  exportFileSystem(): string {
    const store = useAppStore.getState()
    return JSON.stringify(store.files, null, 2)
  }

  // Import file system from JSON
  importFileSystem(jsonData: string): boolean {
    try {
      const files: FileEntry[] = JSON.parse(jsonData)
      const store = useAppStore.getState()
      
      // Clear existing files
      store.files.forEach(file => store.removeFile(file.id))
      
      // Import new files
      files.forEach(file => store.addFile(file))
      
      return true
    } catch (error) {
      console.error('Failed to import file system:', error)
      return false
    }
  }

  // Get file preview (for images, documents, etc.)
  getFilePreview(id: string): string | null {
    const file = this.getFileById(id)
    if (!file || file.type !== 'file') return null
    
    const extension = file.name.split('.').pop()?.toLowerCase()
    
    // For text files, return content
    if (['txt', 'md', 'js', 'ts', 'html', 'css', 'json', 'py', 'java', 'cpp', 'c'].includes(extension || '')) {
      return file.content || null
    }
    
    // For images, return data URL if available
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension || '')) {
      // This would need to be implemented with actual image data
      return null
    }
    
    return null
  }
}

// Export singleton instance
export const fileSystemService = new FileSystemService()