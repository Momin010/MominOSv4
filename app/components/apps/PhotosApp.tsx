
"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Image, 
  Upload, 
  Download, 
  Trash2, 
  Edit, 
  Share, 
  Heart, 
  Star, 
  Grid, 
  List, 
  Search, 
  Filter, 
  RotateCw, 
  RotateCcw, 
  Crop, 
  Sliders, 
  Palette, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Eye, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Maximize2, 
  X, 
  Plus,
  Calendar,
  MapPin,
  Camera,
  Tag,
  Folder,
  Sun,
  Contrast,
  Zap
} from "lucide-react"

interface Photo {
  id: string
  name: string
  src: string
  thumbnail: string
  size: string
  dimensions: string
  dateTaken: string
  location: string
  camera: string
  tags: string[]
  favorite: boolean
  edited: boolean
}

interface Album {
  id: string
  name: string
  thumbnail: string
  photoCount: number
  photos: string[]
}

export default function PhotosApp() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])
  const [showEditor, setShowEditor] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBy, setFilterBy] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [showSlideshow, setShowSlideshow] = useState(false)
  const [slideshowIndex, setSlideshowIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [currentTab, setCurrentTab] = useState<'photos' | 'albums' | 'favorites'>('photos')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock photo data
  const photos: Photo[] = [
    {
      id: '1',
      name: 'sunset-beach.jpg',
      src: '/placeholder.jpg',
      thumbnail: '/placeholder.jpg',
      size: '2.4 MB',
      dimensions: '3840×2160',
      dateTaken: '2024-01-15 18:30',
      location: 'Malibu Beach, CA',
      camera: 'Canon EOS R5',
      tags: ['sunset', 'beach', 'nature'],
      favorite: true,
      edited: false
    },
    {
      id: '2',
      name: 'mountain-vista.jpg',
      src: '/placeholder.jpg',
      thumbnail: '/placeholder.jpg',
      size: '3.1 MB',
      dimensions: '4032×3024',
      dateTaken: '2024-01-14 10:15',
      location: 'Rocky Mountains, CO',
      camera: 'Sony A7R V',
      tags: ['mountain', 'landscape', 'snow'],
      favorite: false,
      edited: true
    },
    {
      id: '3',
      name: 'city-lights.jpg',
      src: '/placeholder.jpg',
      thumbnail: '/placeholder.jpg',
      size: '1.8 MB',
      dimensions: '2560×1440',
      dateTaken: '2024-01-13 21:45',
      location: 'New York City, NY',
      camera: 'iPhone 15 Pro',
      tags: ['city', 'night', 'urban'],
      favorite: true,
      edited: false
    },
    {
      id: '4',
      name: 'forest-path.jpg',
      src: '/placeholder.jpg',
      thumbnail: '/placeholder.jpg',
      size: '2.7 MB',
      dimensions: '3200×2400',
      dateTaken: '2024-01-12 14:20',
      location: 'Redwood National Park, CA',
      camera: 'Nikon D850',
      tags: ['forest', 'nature', 'trees'],
      favorite: false,
      edited: false
    },
    {
      id: '5',
      name: 'ocean-wave.jpg',
      src: '/placeholder.jpg',
      thumbnail: '/placeholder.jpg',
      size: '3.3 MB',
      dimensions: '4096×2731',
      dateTaken: '2024-01-11 07:00',
      location: 'Big Sur, CA',
      camera: 'Canon EOS R6 Mark II',
      tags: ['ocean', 'waves', 'seascape'],
      favorite: true,
      edited: true
    },
    {
      id: '6',
      name: 'desert-dunes.jpg',
      src: '/placeholder.jpg',
      thumbnail: '/placeholder.jpg',
      size: '2.1 MB',
      dimensions: '3000×2000',
      dateTaken: '2024-01-10 16:30',
      location: 'Death Valley, CA',
      camera: 'Fujifilm X-T5',
      tags: ['desert', 'sand', 'landscape'],
      favorite: false,
      edited: false
    }
  ]

  const albums: Album[] = [
    {
      id: '1',
      name: 'Nature & Landscapes',
      thumbnail: '/placeholder.jpg',
      photoCount: 24,
      photos: ['1', '2', '4', '5', '6']
    },
    {
      id: '2',
      name: 'City Life',
      thumbnail: '/placeholder.jpg',
      photoCount: 12,
      photos: ['3']
    },
    {
      id: '3',
      name: 'Travel Adventures',
      thumbnail: '/placeholder.jpg',
      photoCount: 18,
      photos: ['1', '2', '3', '4', '5', '6']
    }
  ]

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         photo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    switch (filterBy) {
      case 'favorites':
        return matchesSearch && photo.favorite
      case 'edited':
        return matchesSearch && photo.edited
      case 'recent':
        const isRecent = new Date(photo.dateTaken) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        return matchesSearch && isRecent
      default:
        return matchesSearch
    }
  })

  const sortedPhotos = [...filteredPhotos].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'size':
        return parseFloat(b.size) - parseFloat(a.size)
      case 'date':
      default:
        return new Date(b.dateTaken).getTime() - new Date(a.dateTaken).getTime()
    }
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      // Handle file upload logic here
      console.log('Files to upload:', files)
    }
  }

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    )
  }

  const toggleFavorite = (photoId: string) => {
    // In a real app, this would update the database
    console.log('Toggle favorite:', photoId)
  }

  const deletePhotos = (photoIds: string[]) => {
    // In a real app, this would delete from storage
    console.log('Delete photos:', photoIds)
    setSelectedPhotos([])
  }

  const startSlideshow = (startIndex = 0) => {
    setSlideshowIndex(startIndex)
    setShowSlideshow(true)
    setIsPlaying(true)
  }

  const PhotoCard = ({ photo, index }: { photo: Photo; index: number }) => (
    <motion.div
      className={`relative glass-card overflow-hidden cursor-pointer ${
        selectedPhotos.includes(photo.id) ? 'ring-2 ring-purple-500' : ''
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setSelectedPhoto(photo)}
      onContextMenu={(e) => {
        e.preventDefault()
        togglePhotoSelection(photo.id)
      }}
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={photo.thumbnail}
          alt={photo.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity">
          <div className="absolute bottom-2 left-2 right-2">
            <p className="text-white text-sm font-medium truncate">{photo.name}</p>
            <p className="text-gray-300 text-xs">{photo.dateTaken}</p>
          </div>
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
          {photo.favorite && (
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <Heart className="w-3 h-3 text-white fill-current" />
            </div>
          )}
          {photo.edited && (
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <Edit className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        <motion.button
          className="absolute bottom-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            startSlideshow(index)
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Play className="w-4 h-4 text-white" />
        </motion.button>
      </div>
    </motion.div>
  )

  const AlbumCard = ({ album }: { album: Album }) => (
    <motion.div
      className="glass-card p-4 cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="aspect-square relative overflow-hidden rounded-lg mb-3">
        <img
          src={album.thumbnail}
          alt={album.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {album.photoCount} photos
        </div>
      </div>
      <h3 className="text-white font-medium">{album.name}</h3>
    </motion.div>
  )

  return (
    <div className="h-full bg-black/20 backdrop-blur-xl flex flex-col">
      {/* Header */}
      <div className="glass-topbar p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Image className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">Photos</span>
            </div>
            <div className="flex items-center gap-1">
              {['photos', 'albums', 'favorites'].map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setCurrentTab(tab as any)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    currentTab === tab
                      ? 'bg-white/20 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => fileInputRef.current?.click()}
              className="glass-button px-3 py-2 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Upload className="w-4 h-4" />
              Import
            </motion.button>
            <motion.button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="glass-button p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search photos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-10 text-white placeholder-gray-400"
            />
          </div>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="glass-input text-white"
          >
            <option value="all">All Photos</option>
            <option value="favorites">Favorites</option>
            <option value="edited">Edited</option>
            <option value="recent">Recent</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="glass-input text-white"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">
        {currentTab === 'photos' && (
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
              : 'grid-cols-1'
          }`}>
            {sortedPhotos.map((photo, index) => (
              <PhotoCard key={photo.id} photo={photo} index={index} />
            ))}
          </div>
        )}

        {currentTab === 'albums' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {albums.map(album => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        )}

        {currentTab === 'favorites' && (
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
              : 'grid-cols-1'
          }`}>
            {photos.filter(photo => photo.favorite).map((photo, index) => (
              <PhotoCard key={photo.id} photo={photo} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Photo Viewer Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="relative max-w-7xl max-h-full p-4" onClick={(e) => e.stopPropagation()}>
              <motion.img
                src={selectedPhoto.src}
                alt={selectedPhoto.name}
                className="max-w-full max-h-full object-contain"
                style={{ transform: `scale(${zoom / 100})` }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: zoom / 100, opacity: 1 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              />
              
              {/* Controls */}
              <div className="absolute top-4 right-4 flex gap-2">
                <motion.button
                  onClick={() => setZoom(Math.max(50, zoom - 25))}
                  className="glass-button p-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ZoomOut className="w-4 h-4 text-white" />
                </motion.button>
                <motion.button
                  onClick={() => setZoom(Math.min(200, zoom + 25))}
                  className="glass-button p-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ZoomIn className="w-4 h-4 text-white" />
                </motion.button>
                <motion.button
                  onClick={() => setShowEditor(true)}
                  className="glass-button p-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Edit className="w-4 h-4 text-white" />
                </motion.button>
                <motion.button
                  onClick={() => setSelectedPhoto(null)}
                  className="glass-button p-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>
              </div>

              {/* Info Panel */}
              <div className="absolute bottom-4 left-4 glass-card p-4 max-w-sm">
                <h3 className="text-white font-semibold mb-2">{selectedPhoto.name}</h3>
                <div className="space-y-1 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>{selectedPhoto.dateTaken}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    <span>{selectedPhoto.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Camera className="w-3 h-3" />
                    <span>{selectedPhoto.camera}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image className="w-3 h-3" />
                    <span>{selectedPhoto.dimensions} • {selectedPhoto.size}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-3 h-3" />
                    <div className="flex gap-1">
                      {selectedPhoto.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-white/20 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Editor Modal */}
      <AnimatePresence>
        {showEditor && selectedPhoto && (
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="h-full flex">
              {/* Editor Toolbar */}
              <div className="w-64 glass-card border-r border-white/10 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Photo Editor</h3>
                  <motion.button
                    onClick={() => setShowEditor(false)}
                    className="text-gray-400 hover:text-white"
                    whileHover={{ scale: 1.1 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Adjustments</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-300 text-sm">Brightness</span>
                        <input type="range" min="0" max="100" defaultValue="50" className="flex-1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Contrast className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-300 text-sm">Contrast</span>
                        <input type="range" min="0" max="100" defaultValue="50" className="flex-1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-300 text-sm">Saturation</span>
                        <input type="range" min="0" max="100" defaultValue="50" className="flex-1" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-2">Tools</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <motion.button
                        className="glass-button p-2 flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Crop className="w-4 h-4" />
                        Crop
                      </motion.button>
                      <motion.button
                        className="glass-button p-2 flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <RotateCw className="w-4 h-4" />
                        Rotate
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Editor Canvas */}
              <div className="flex-1 flex items-center justify-center p-4">
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Status Bar */}
      <div className="glass-topbar p-2 border-t border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4 text-gray-400">
          <span>{sortedPhotos.length} photos</span>
          {selectedPhotos.length > 0 && (
            <span>{selectedPhotos.length} selected</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedPhotos.length > 0 && (
            <>
              <motion.button
                onClick={() => deletePhotos(selectedPhotos)}
                className="text-red-400 hover:text-red-300"
                whileHover={{ scale: 1.1 }}
              >
                <Trash2 className="w-3 h-3" />
              </motion.button>
              <motion.button
                className="text-gray-400 hover:text-white"
                whileHover={{ scale: 1.1 }}
              >
                <Share className="w-3 h-3" />
              </motion.button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
