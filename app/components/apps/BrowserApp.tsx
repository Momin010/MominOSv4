
"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  Globe,
  Star,
  Download,
  Shield,
  Eye,
  EyeOff,
  MoreHorizontal,
  Plus,
  X,
  Menu
} from "lucide-react"

interface Bookmark {
  id: string
  title: string
  url: string
  icon: string
  favicon?: string
}

interface Tab {
  id: string
  title: string
  url: string
  favicon?: string
  isActive: boolean
  isLoading: boolean
}

interface HistoryItem {
  id: string
  url: string
  title: string
  timestamp: number
  favicon?: string
}

export default function BrowserApp() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'New Tab', url: 'about:newtab', isActive: true, isLoading: false }
  ])
  const [activeTabId, setActiveTabId] = useState('1')
  const [urlInput, setUrlInput] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    { id: '1', title: 'Google', url: 'https://www.google.com', icon: '🔍', favicon: 'https://www.google.com/favicon.ico' },
    { id: '2', title: 'GitHub', url: 'https://github.com', icon: '🐙', favicon: 'https://github.com/favicon.ico' },
    { id: '3', title: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '📚' },
    { id: '4', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', icon: '📖' },
    { id: '5', title: 'YouTube', url: 'https://www.youtube.com', icon: '📺' },
    { id: '6', title: 'Reddit', url: 'https://www.reddit.com', icon: '🔗' },
  ])
  
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [downloads, setDownloads] = useState<any[]>([])
  const [showDevTools, setShowDevTools] = useState(false)

  const activeTab = tabs.find(tab => tab.id === activeTabId)
  const webviewRefs = useRef<{ [key: string]: HTMLIFrameElement | null }>({})

  const createNewTab = (url = 'about:newtab') => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: 'New Tab',
      url,
      isActive: true,
      isLoading: url !== 'about:newtab'
    }
    
    setTabs(prev => prev.map(t => ({ ...t, isActive: false })).concat(newTab))
    setActiveTabId(newTab.id)
    setUrlInput(url === 'about:newtab' ? '' : url)
  }

  const closeTab = (tabId: string) => {
    const tabIndex = tabs.findIndex(tab => tab.id === tabId)
    const newTabs = tabs.filter(tab => tab.id !== tabId)
    
    if (newTabs.length === 0) {
      createNewTab()
      return
    }
    
    setTabs(newTabs)
    
    if (activeTabId === tabId) {
      const newActiveIndex = Math.max(0, tabIndex - 1)
      setActiveTabId(newTabs[newActiveIndex].id)
    }
  }

  const navigateTab = (tabId: string, url: string) => {
    const normalizedUrl = normalizeUrl(url)
    
    // Check if this is a commonly blocked site
    if (isBlockedSite(normalizedUrl)) {
      setTabs(prev => prev.map(tab => 
        tab.id === tabId 
          ? { 
              ...tab, 
              url: `iframe-blocked-${normalizedUrl}`, 
              isLoading: false, 
              title: 'Blocked Content' 
            }
          : tab
      ))
    } else {
      setTabs(prev => prev.map(tab => 
        tab.id === tabId 
          ? { ...tab, url: normalizedUrl, isLoading: true, title: 'Loading...' }
          : tab
      ))
    }

    if (tabId === activeTabId) {
      setUrlInput(normalizedUrl)
    }

    // Add to history
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      url: normalizedUrl,
      title: url,
      timestamp: Date.now()
    }
    setHistory(prev => [historyItem, ...prev].slice(0, 100))
  }

  const normalizeUrl = (url: string): string => {
    if (url.startsWith('about:')) return url
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.') && !url.includes(' ')) {
        return `https://${url}`
      } else {
        return `https://www.google.com/search?q=${encodeURIComponent(url)}`
      }
    }
    return url
  }

  const handleUrlSubmit = () => {
    if (activeTab) {
      navigateTab(activeTab.id, urlInput)
    }
  }

  const handleBack = () => {
    if (activeTab) {
      const webview = webviewRefs.current[activeTab.id]
      if (webview && webview.contentWindow) {
        webview.contentWindow.history.back()
      }
    }
  }

  const handleForward = () => {
    if (activeTab) {
      const webview = webviewRefs.current[activeTab.id]
      if (webview && webview.contentWindow) {
        webview.contentWindow.history.forward()
      }
    }
  }

  const handleRefresh = () => {
    if (activeTab) {
      const webview = webviewRefs.current[activeTab.id]
      if (webview) {
        webview.src = webview.src
        setTabs(prev => prev.map(tab => 
          tab.id === activeTab.id ? { ...tab, isLoading: true } : tab
        ))
      }
    }
  }

  const handleBookmarkAdd = () => {
    if (activeTab && activeTab.url !== 'about:newtab') {
      const newBookmark: Bookmark = {
        id: Date.now().toString(),
        title: activeTab.title || 'New Bookmark',
        url: activeTab.url,
        icon: '🔖'
      }
      setBookmarks(prev => [...prev, newBookmark])
    }
  }

  // List of sites that commonly block iframe embedding
  const blockedSites = [
    'youtube.com', 'google.com', 'facebook.com', 'twitter.com', 'x.com',
    'instagram.com', 'linkedin.com', 'netflix.com', 'amazon.com', 'github.com'
  ]

  const isBlockedSite = (url: string): boolean => {
    return blockedSites.some(site => url.toLowerCase().includes(site))
  }

  const handleIframeLoad = (tabId: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId ? { ...tab, isLoading: false } : tab
    ))

    const webview = webviewRefs.current[tabId]
    if (webview && webview.contentDocument) {
      try {
        const title = webview.contentDocument.title || 'Untitled'
        setTabs(prev => prev.map(tab => 
          tab.id === tabId ? { ...tab, title } : tab
        ))
      } catch (e) {
        // Cross-origin restrictions
        console.log('Cross-origin restrictions prevent access to iframe content')
      }
    }
  }

  const handleIframeError = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId)
    if (tab && isBlockedSite(tab.url)) {
      setTabs(prev => prev.map(t => 
        t.id === tabId 
          ? { ...t, url: `iframe-blocked-${t.url}`, title: 'Blocked Content', isLoading: false }
          : t
      ))
    }
  }

  const NewTabPage = () => (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-800 dark:text-gray-200 mb-4">
            New Tab
          </h1>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search or type URL"
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const url = (e.target as HTMLInputElement).value
                  if (activeTab) {
                    navigateTab(activeTab.id, url)
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {bookmarks.slice(0, 8).map(bookmark => (
            <motion.div
              key={bookmark.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md cursor-pointer transition-shadow"
              onClick={() => activeTab && navigateTab(activeTab.id, bookmark.url)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-2xl mb-2">{bookmark.icon}</div>
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                {bookmark.title}
              </div>
            </motion.div>
          ))}
        </div>

        {history.length > 0 && (
          <div>
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
              Recently Visited
            </h2>
            <div className="grid gap-2">
              {history.slice(0, 5).map(item => (
                <motion.div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => activeTab && navigateTab(activeTab.id, item.url)}
                  whileHover={{ x: 4 }}
                >
                  <Globe className="w-4 h-4 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{item.url}</div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="h-full bg-white dark:bg-gray-900 flex flex-col">
      {/* Tab Bar */}
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center flex-1 min-w-0">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-2 border-r border-gray-200 dark:border-gray-600 min-w-0 max-w-[200px] cursor-pointer ${
                tab.isActive ? 'bg-white dark:bg-gray-900' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTabId(tab.id)}
            >
              <div className="w-4 h-4 flex-shrink-0">
                {tab.isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                ) : (
                  <Globe className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                {tab.title}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  closeTab(tab.id)
                }}
                className="w-4 h-4 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            onClick={() => createNewTab()}
            className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-1">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleForward}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          >
            <RefreshCw className={`w-4 h-4 ${activeTab?.isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => createNewTab()}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
            <Lock className="w-4 h-4 text-green-500 flex-shrink-0" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
              placeholder="Search or enter address"
              className="flex-1 bg-transparent text-gray-800 dark:text-gray-200 text-sm focus:outline-none"
            />
          </div>

          <button
            onClick={() => setShowBookmarks(!showBookmarks)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          >
            <Star className="w-4 h-4" />
          </button>
          <button
            onClick={handleBookmarkAdd}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          >
            <BookmarkPlus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPrivate(!isPrivate)}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${
              isPrivate ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {isPrivate ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Bookmarks Bar */}
      <AnimatePresence>
        {showBookmarks && (
          <motion.div
            className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-x-auto"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {bookmarks.map(bookmark => (
              <button
                key={bookmark.id}
                onClick={() => activeTab && navigateTab(activeTab.id, bookmark.url)}
                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm whitespace-nowrap"
              >
                <span>{bookmark.icon}</span>
                <span className="text-gray-700 dark:text-gray-300">{bookmark.title}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <div className="flex-1 relative">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`absolute inset-0 ${tab.isActive ? 'block' : 'hidden'}`}
          >
            {tab.url === 'about:newtab' ? (
              <NewTabPage />
            ) : (
              <iframe
                ref={el => webviewRefs.current[tab.id] = el}
                src={tab.url}
                className="w-full h-full border-0"
                onLoad={() => handleIframeLoad(tab.id)}
                onError={() => handleIframeError(tab.id)}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
                title={`Tab ${tab.id}`}
                style={{ display: tab.url.includes('iframe-blocked') ? 'none' : 'block' }}
              />
              
              {/* Show blocked content message */}
              {tab.url.includes('iframe-blocked') && (
                <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <div className="text-center p-8 max-w-md">
                    <Globe className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Can't display this page
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      This website cannot be displayed in a frame due to security restrictions.
                    </p>
                    <motion.button
                      onClick={() => window.open(tab.url.replace('iframe-blocked-', ''), '_blank')}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open in new tab
                    </motion.button>
                  </div>
                </div>
              )}
            )}
          </div>
        ))}

        {activeTab?.isLoading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-10">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
