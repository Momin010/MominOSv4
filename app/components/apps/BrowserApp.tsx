"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  ArrowRight, 
  RefreshCw, 
  Home, 
  Search, 
  Bookmark,
  BookmarkPlus,
  Settings,
  ExternalLink,
  Lock,
  Globe
} from "lucide-react"

interface Bookmark {
  id: string
  title: string
  url: string
  icon: string
}

export default function BrowserApp() {
  const [currentUrl, setCurrentUrl] = useState("https://www.google.com")
  const [urlInput, setUrlInput] = useState("https://www.google.com")
  const [isLoading, setIsLoading] = useState(false)
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    { id: '1', title: 'Google', url: 'https://www.google.com', icon: '🔍' },
    { id: '2', title: 'GitHub', url: 'https://github.com', icon: '🐙' },
    { id: '3', title: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '📚' },
    { id: '4', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', icon: '📖' },
  ])
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleNavigate = (url: string) => {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`
    setCurrentUrl(fullUrl)
    setUrlInput(fullUrl)
    setIsLoading(true)
    
    // Add to history
    const newHistory = [...history.slice(0, historyIndex + 1), fullUrl]
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleGoBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      const url = history[newIndex]
      setCurrentUrl(url)
      setUrlInput(url)
    }
  }

  const handleGoForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      const url = history[newIndex]
      setCurrentUrl(url)
      setUrlInput(url)
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }

  const handleBookmarkAdd = () => {
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      title: currentUrl.split('/')[2] || 'New Bookmark',
      url: currentUrl,
      icon: '🔖'
    }
    setBookmarks([...bookmarks, newBookmark])
  }

  const handleBookmarkRemove = (id: string) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id))
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    // Handle error - maybe show a custom error page
  }

  return (
    <div className="h-full bg-black/20 backdrop-blur-xl flex flex-col">
      {/* Header */}
      <div className="glass-topbar p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <motion.button
            onClick={handleGoBack}
            disabled={historyIndex <= 0}
            className="glass-button p-2 disabled:opacity-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </motion.button>
          <motion.button
            onClick={handleGoForward}
            disabled={historyIndex >= history.length - 1}
            className="glass-button p-2 disabled:opacity-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowRight className="w-4 h-4 text-white" />
          </motion.button>
          <motion.button
            onClick={handleRefresh}
            className="glass-button p-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <RefreshCw className={`w-4 h-4 text-white ${isLoading ? 'animate-spin' : ''}`} />
          </motion.button>
          <motion.button
            onClick={() => handleNavigate("https://www.google.com")}
            className="glass-button p-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Home className="w-4 h-4 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Address Bar */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1">
            <Lock className="w-4 h-4 text-green-400" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleNavigate(urlInput)
                }
              }}
              className="glass-input flex-1 text-white placeholder-gray-400"
              placeholder="Search or enter address"
            />
          </div>
          <motion.button
            onClick={() => handleNavigate(urlInput)}
            className="glass-button px-4 py-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search className="w-4 h-4 text-white" />
          </motion.button>
          <motion.button
            onClick={handleBookmarkAdd}
            className="glass-button p-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <BookmarkPlus className="w-4 h-4 text-white" />
          </motion.button>
          <motion.button
            onClick={() => setShowBookmarks(!showBookmarks)}
            className="glass-button p-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bookmark className="w-4 h-4 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Bookmarks Bar */}
      {showBookmarks && (
        <motion.div
          className="p-4 border-b border-white/10"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            {bookmarks.map((bookmark) => (
              <motion.div
                key={bookmark.id}
                className="glass-card px-3 py-2 cursor-pointer flex items-center gap-2"
                onClick={() => handleNavigate(bookmark.url)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">{bookmark.icon}</span>
                <span className="text-white text-sm">{bookmark.title}</span>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleBookmarkRemove(bookmark.id)
                  }}
                  className="text-red-400 hover:text-red-300"
                  whileHover={{ scale: 1.1 }}
                >
                  ×
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Browser Content */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
            <motion.div
              className="glass-card p-6 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <RefreshCw className="w-8 h-8 text-white animate-spin mx-auto mb-2" />
              <p className="text-white">Loading...</p>
            </motion.div>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          src={currentUrl}
          className="w-full h-full border-0"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          title="Browser"
        />
      </div>

      {/* Status Bar */}
      <div className="glass-topbar p-2 border-t border-white/10">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>{currentUrl}</span>
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3" />
            <span>Secure Connection</span>
          </div>
        </div>
      </div>
    </div>
  )
} 