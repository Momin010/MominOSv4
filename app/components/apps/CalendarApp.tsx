"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Calendar, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin,
  Users,
  Bell,
  Edit,
  Trash2,
  Search,
  Filter,
  Grid,
  List
} from "lucide-react"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  duration: string
  location: string
  attendees: string[]
  color: string
  allDay: boolean
}

export default function CalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Mock events
  const events: Event[] = [
    {
      id: '1',
      title: 'Team Meeting',
      description: 'Weekly team sync to discuss project progress',
      date: '2024-01-15',
      time: '10:00',
      duration: '1 hour',
      location: 'Conference Room A',
      attendees: ['john@company.com', 'sarah@company.com'],
      color: 'bg-blue-500',
      allDay: false
    },
    {
      id: '2',
      title: 'Client Presentation',
      description: 'Present quarterly results to key client',
      date: '2024-01-16',
      time: '14:00',
      duration: '2 hours',
      location: 'Virtual Meeting',
      attendees: ['client@example.com', 'john@company.com'],
      color: 'bg-green-500',
      allDay: false
    },
    {
      id: '3',
      title: 'Project Deadline',
      description: 'Final submission for Q1 project',
      date: '2024-01-20',
      time: '17:00',
      duration: 'All day',
      location: 'Office',
      attendees: ['team@company.com'],
      color: 'bg-red-500',
      allDay: true
    },
    {
      id: '4',
      title: 'Lunch with Sarah',
      description: 'Catch up over lunch',
      date: '2024-01-18',
      time: '12:00',
      duration: '1 hour',
      location: 'Downtown Cafe',
      attendees: ['sarah@company.com'],
      color: 'bg-purple-500',
      allDay: false
    }
  ]

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    const days = []
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return events.filter(event => event.date === dateString)
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setShowEventModal(true)
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setShowEventModal(true)
  }

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const formatTime = (time: string) => {
    return time
  }

  return (
    <div className="h-full bg-black/20 backdrop-blur-xl flex flex-col">
      {/* Header */}
      <div className="glass-topbar p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-white font-semibold">Calendar</h2>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={handlePreviousMonth}
                className="glass-button p-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </motion.button>
              <span className="text-white font-medium">{formatDate(currentDate)}</span>
              <motion.button
                onClick={handleNextMonth}
                className="glass-button p-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </motion.button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setViewMode('month')}
              className={`glass-button p-2 ${viewMode === 'month' ? 'bg-white/20' : ''}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Grid className="w-4 h-4 text-white" />
            </motion.button>
            <motion.button
              onClick={() => setViewMode('week')}
              className={`glass-button p-2 ${viewMode === 'week' ? 'bg-white/20' : ''}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <List className="w-4 h-4 text-white" />
            </motion.button>
            <motion.button
              onClick={() => setShowEventModal(true)}
              className="glass-button px-4 py-2 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
              New Event
            </motion.button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input w-full pl-10 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 p-4">
        <div className="glass-card p-6 h-full">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-gray-400 font-medium p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentDate).map((date, index) => (
              <motion.div
                key={index}
                className={`min-h-24 p-2 border border-white/10 rounded-lg cursor-pointer ${
                  date ? 'hover:bg-white/10' : ''
                } ${
                  date && date.toDateString() === new Date().toDateString() 
                    ? 'ring-2 ring-purple-500' 
                    : ''
                }`}
                onClick={() => date && handleDateClick(date)}
                whileHover={{ scale: date ? 1.02 : 1 }}
                whileTap={{ scale: date ? 0.98 : 1 }}
              >
                {date && (
                  <>
                    <div className="text-white font-medium mb-1">
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {getEventsForDate(date).slice(0, 2).map(event => (
                        <motion.div
                          key={event.id}
                          className={`text-xs p-1 rounded text-white truncate ${event.color}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEventClick(event)
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {event.title}
                        </motion.div>
                      ))}
                      {getEventsForDate(date).length > 2 && (
                        <div className="text-xs text-gray-400">
                          +{getEventsForDate(date).length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            className="glass-card p-6 w-96 max-h-96 overflow-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">
                {selectedEvent ? 'Edit Event' : 'New Event'}
              </h3>
              <motion.button
                onClick={() => {
                  setShowEventModal(false)
                  setSelectedEvent(null)
                }}
                className="text-gray-400 hover:text-white"
                whileHover={{ scale: 1.1 }}
              >
                ×
              </motion.button>
            </div>

            {selectedEvent ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium">{selectedEvent.title}</h4>
                  <p className="text-gray-400 text-sm">{selectedEvent.description}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span>{selectedEvent.time} - {selectedEvent.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Users className="w-4 h-4" />
                    <span>{selectedEvent.attendees.length} attendees</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    className="glass-button px-4 py-2 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </motion.button>
                  <motion.button
                    className="glass-button px-4 py-2 text-red-400"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Event title"
                  className="glass-input w-full text-white placeholder-gray-400"
                />
                <textarea
                  placeholder="Event description"
                  className="glass-input w-full h-20 resize-none text-white placeholder-gray-400"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    className="glass-input text-white"
                  />
                  <input
                    type="time"
                    className="glass-input text-white"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Location"
                  className="glass-input w-full text-white placeholder-gray-400"
                />
                <motion.button
                  className="glass-button w-full px-4 py-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Event
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
} 