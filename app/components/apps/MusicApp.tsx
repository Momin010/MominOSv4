"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Shuffle,
  Repeat,
  Heart,
  List,
  Search,
  Plus
} from "lucide-react"

interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  cover: string
  liked: boolean
}

export default function MusicApp() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(75)
  const [isMuted, setIsMuted] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  // Mock playlist
  const playlist: Song[] = [
    {
      id: '1',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      album: 'A Night at the Opera',
      duration: '5:55',
      cover: '/placeholder.jpg',
      liked: true
    },
    {
      id: '2',
      title: 'Hotel California',
      artist: 'Eagles',
      album: 'Hotel California',
      duration: '6:30',
      cover: '/placeholder.jpg',
      liked: false
    },
    {
      id: '3',
      title: 'Stairway to Heaven',
      artist: 'Led Zeppelin',
      album: 'Led Zeppelin IV',
      duration: '8:02',
      cover: '/placeholder.jpg',
      liked: true
    },
    {
      id: '4',
      title: 'Imagine',
      artist: 'John Lennon',
      album: 'Imagine',
      duration: '3:03',
      cover: '/placeholder.jpg',
      liked: false
    },
    {
      id: '5',
      title: 'Hey Jude',
      artist: 'The Beatles',
      album: 'The Beatles 1967-1970',
      duration: '7:11',
      cover: '/placeholder.jpg',
      liked: true
    }
  ]

  const filteredPlaylist = playlist.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause()
    } else {
      audioRef.current?.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSongSelect = (song: Song) => {
    setCurrentSong(song)
    setIsPlaying(true)
    // In a real app, you would load the audio file here
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="h-full bg-black/20 backdrop-blur-xl flex flex-col">
      {/* Header */}
      <div className="glass-topbar p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-white font-semibold">Music Player</h2>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="glass-button p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <List className="w-4 h-4 text-white" />
            </motion.button>
            <motion.button
              className="glass-button p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Search className="w-4 h-4 text-white" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-white/10">
        <input
          type="text"
          placeholder="Search songs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="glass-input w-full text-white placeholder-gray-400"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Playlist */}
        <div className={`${showPlaylist ? 'w-1/2' : 'w-full'} p-4 overflow-auto`}>
          <div className="space-y-2">
            {filteredPlaylist.map((song) => (
              <motion.div
                key={song.id}
                className={`glass-card p-3 cursor-pointer ${
                  currentSong?.id === song.id ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => handleSongSelect(song)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg glass-icon flex items-center justify-center">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{song.title}</div>
                    <div className="text-gray-400 text-sm">{song.artist}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">{song.duration}</span>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Toggle like
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className={`w-4 h-4 ${song.liked ? 'text-red-400 fill-current' : 'text-gray-400'}`} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Now Playing */}
        {showPlaylist && currentSong && (
          <div className="w-1/2 p-4 border-l border-white/10">
            <div className="glass-card p-6 text-center">
              <div className="w-32 h-32 rounded-full glass-icon mx-auto mb-4 flex items-center justify-center">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">{currentSong.title}</h3>
              <p className="text-gray-400 mb-4">{currentSong.artist}</p>
              <p className="text-gray-500 text-sm mb-6">{currentSong.album}</p>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                  <motion.div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <motion.button
                  className="glass-button p-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Shuffle className={`w-4 h-4 ${shuffle ? 'text-purple-400' : 'text-white'}`} />
                </motion.button>
                <motion.button
                  className="glass-button p-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <SkipBack className="w-4 h-4 text-white" />
                </motion.button>
                <motion.button
                  onClick={handlePlayPause}
                  className="glass-button p-3"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
                </motion.button>
                <motion.button
                  className="glass-button p-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <SkipForward className="w-4 h-4 text-white" />
                </motion.button>
                <motion.button
                  className="glass-button p-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Repeat className={`w-4 h-4 ${repeat ? 'text-purple-400' : 'text-white'}`} />
                </motion.button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={toggleMute}
                  className="glass-button p-1"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                </motion.button>
                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <span className="text-white text-sm w-8">{volume}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} />
    </div>
  )
} 