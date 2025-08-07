
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, Download, Star, TrendingUp, Filter, Grid3X3, 
  List, Heart, Settings, User, ShoppingCart, Play,
  Image, Music, Code, Gamepad2, BookOpen, Calculator,
  Camera, Mail, Calendar, Terminal, FileText, Palette, Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface App {
  id: string
  name: string
  developer: string
  description: string
  icon: any
  rating: number
  downloads: string
  price: string
  category: string
  screenshots: string[]
  size: string
  version: string
  featured: boolean
  trending: boolean
}

const sampleApps: App[] = [
  {
    id: "1",
    name: "SNova AI Assistant",
    developer: "Sierro Inc.",
    description: "Advanced AI assistant powered by SNova technology. Get help with coding, writing, and complex tasks.",
    icon: Code,
    rating: 4.9,
    downloads: "10M+",
    price: "Free",
    category: "Productivity",
    screenshots: [],
    size: "125 MB",
    version: "3.2.1",
    featured: true,
    trending: true
  },
  {
    id: "2",
    name: "Sierro Browser Pro",
    developer: "Sierro Inc.",
    description: "Lightning-fast web browser with advanced privacy features and built-in ad blocking.",
    icon: Globe,
    rating: 4.8,
    downloads: "50M+",
    price: "Free",
    category: "Internet",
    screenshots: [],
    size: "89 MB",
    version: "12.4.0",
    featured: true,
    trending: false
  },
  {
    id: "3",
    name: "PhotoMaster Studio",
    developer: "Creative Labs",
    description: "Professional photo editing with AI-powered enhancements and filters.",
    icon: Camera,
    rating: 4.7,
    downloads: "25M+",
    price: "$29.99",
    category: "Photography",
    screenshots: [],
    size: "245 MB",
    version: "8.1.5",
    featured: false,
    trending: true
  },
  {
    id: "4",
    name: "CodeForge IDE",
    developer: "Developer Tools Inc.",
    description: "Complete integrated development environment for modern programming languages.",
    icon: Code,
    rating: 4.6,
    downloads: "15M+",
    price: "$49.99",
    category: "Developer Tools",
    screenshots: [],
    size: "412 MB",
    version: "2024.1",
    featured: false,
    trending: false
  },
  {
    id: "5",
    name: "GameCenter Elite",
    developer: "Gaming Studios",
    description: "Ultimate gaming platform with thousands of games and social features.",
    icon: Gamepad2,
    rating: 4.5,
    downloads: "100M+",
    price: "Free",
    category: "Games",
    screenshots: [],
    size: "156 MB",
    version: "5.7.2",
    featured: true,
    trending: true
  }
]

export default function SierroStoreApp() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [apps, setApps] = useState<App[]>(sampleApps)
  const [selectedApp, setSelectedApp] = useState<App | null>(null)
  const [installedApps, setInstalledApps] = useState<string[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])

  const categories = ["All", "Productivity", "Games", "Photography", "Developer Tools", "Internet", "Music", "Education"]

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || app.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredApps = apps.filter(app => app.featured)
  const trendingApps = apps.filter(app => app.trending)

  const handleInstall = (app: App) => {
    setInstalledApps(prev => [...prev, app.id])
    // Simulate installation
    setTimeout(() => {
      alert(`${app.name} installed successfully!`)
    }, 1000)
  }

  const toggleWishlist = (appId: string) => {
    setWishlist(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    )
  }

  if (selectedApp) {
    return (
      <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="h-full overflow-auto">
          {/* App Detail Header */}
          <div className="bg-white dark:bg-gray-800 p-6 border-b">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedApp(null)}
              className="mb-4"
            >
              ← Back to Store
            </Button>
            
            <div className="flex gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center">
                <selectedApp.icon className="w-12 h-12 text-white" />
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedApp.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  by {selectedApp.developer}
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{selectedApp.rating}</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">
                    {selectedApp.downloads} downloads
                  </span>
                  <Badge variant="secondary">{selectedApp.category}</Badge>
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    onClick={() => handleInstall(selectedApp)}
                    disabled={installedApps.includes(selectedApp.id)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {installedApps.includes(selectedApp.id) ? "Installed" : 
                     selectedApp.price === "Free" ? "Install" : `Buy ${selectedApp.price}`}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => toggleWishlist(selectedApp.id)}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${wishlist.includes(selectedApp.id) ? 'fill-current text-red-500' : ''}`} />
                    {wishlist.includes(selectedApp.id) ? "In Wishlist" : "Add to Wishlist"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* App Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-4">About</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  {selectedApp.description}
                </p>
                
                <h3 className="text-xl font-semibold mb-4">What's New</h3>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold mb-2">Version {selectedApp.version}</h4>
                  <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Performance improvements</li>
                    <li>• Bug fixes and stability enhancements</li>
                    <li>• New features and UI improvements</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold mb-4">Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Size</span>
                      <span>{selectedApp.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Version</span>
                      <span>{selectedApp.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Category</span>
                      <span>{selectedApp.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Developer</span>
                      <span>{selectedApp.developer}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Sierro Store
              </h1>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search apps, games, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Categories */}
          <div className="px-6 pb-4">
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Featured Apps */}
          {selectedCategory === "All" && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Featured Apps
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredApps.map(app => (
                  <motion.div
                    key={app.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => setSelectedApp(app)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center">
                        <app.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{app.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{app.developer}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {app.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold">{app.rating}</span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">
                        {app.price}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* All Apps */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {selectedCategory === "All" ? "All Apps" : selectedCategory}
            </h2>
            
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredApps.map(app => (
                  <motion.div
                    key={app.id}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedApp(app)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center mb-3">
                      <app.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1 truncate">{app.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 truncate">
                      {app.developer}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs">{app.rating}</span>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">
                        {app.price}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApps.map(app => (
                  <motion.div
                    key={app.id}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedApp(app)}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center">
                        <app.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate">{app.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 truncate">{app.developer}</p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 mt-1">
                          {app.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-lg font-bold text-blue-600">{app.price}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm">{app.rating}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
