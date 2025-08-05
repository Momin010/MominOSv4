
"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  X, 
  Minimize2,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Brain,
  Zap,
  Globe,
  Search,
  Settings,
  Calculator,
  Calendar,
  Mail,
  Music,
  Terminal,
  Code,
  Camera,
  FileText
} from "lucide-react"

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  actions?: Action[]
}

interface Action {
  type: 'open_app' | 'open_url' | 'search' | 'system_command'
  label: string
  value: string
  icon?: any
}

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
  onOpenApp: (appId: string) => void
  position: { x: number; y: number }
}

export default function AIAssistant({ isOpen, onClose, onOpenApp, position }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm Momin, your AI assistant. I can help you navigate MominOS, open applications, browse the web, or answer questions. What would you like to do?",
      timestamp: new Date(),
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const processUserInput = async (input: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

    const response = generateAIResponse(input.toLowerCase())
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: response.content,
      timestamp: new Date(),
      actions: response.actions
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsTyping(false)

    // Auto-speak response if enabled
    if (isSpeaking) {
      speakText(response.content)
    }
  }

  const generateAIResponse = (input: string): { content: string; actions?: Action[] } => {
    // App opening commands
    if (input.includes('open') || input.includes('launch') || input.includes('start')) {
      if (input.includes('calculator') || input.includes('calc')) {
        return {
          content: "Opening Calculator for you!",
          actions: [{ type: 'open_app', label: 'Open Calculator', value: 'calculator', icon: Calculator }]
        }
      }
      if (input.includes('browser') || input.includes('chrome') || input.includes('web')) {
        return {
          content: "Launching Browser to browse the web!",
          actions: [{ type: 'open_app', label: 'Open Browser', value: 'browser', icon: Globe }]
        }
      }
      if (input.includes('calendar')) {
        return {
          content: "Opening Calendar to manage your schedule!",
          actions: [{ type: 'open_app', label: 'Open Calendar', value: 'calendar', icon: Calendar }]
        }
      }
      if (input.includes('mail') || input.includes('email')) {
        return {
          content: "Opening Mail to check your messages!",
          actions: [{ type: 'open_app', label: 'Open Mail', value: 'mail', icon: Mail }]
        }
      }
      if (input.includes('music') || input.includes('audio') || input.includes('player')) {
        return {
          content: "Starting Music app for your listening pleasure!",
          actions: [{ type: 'open_app', label: 'Open Music', value: 'music', icon: Music }]
        }
      }
      if (input.includes('terminal') || input.includes('console') || input.includes('command')) {
        return {
          content: "Opening Terminal for command line access!",
          actions: [{ type: 'open_app', label: 'Open Terminal', value: 'terminal', icon: Terminal }]
        }
      }
      if (input.includes('code') || input.includes('editor') || input.includes('programming')) {
        return {
          content: "Launching Code Editor for development!",
          actions: [{ type: 'open_app', label: 'Open Code', value: 'code', icon: Code }]
        }
      }
      if (input.includes('photos') || input.includes('images') || input.includes('gallery')) {
        return {
          content: "Opening Photos to view your images!",
          actions: [{ type: 'open_app', label: 'Open Photos', value: 'photos', icon: Camera }]
        }
      }
      if (input.includes('files') || input.includes('explorer') || input.includes('folder')) {
        return {
          content: "Opening File Explorer to browse your files!",
          actions: [{ type: 'open_app', label: 'Open Files', value: 'files', icon: FileText }]
        }
      }
      if (input.includes('settings') || input.includes('preferences') || input.includes('config')) {
        return {
          content: "Opening Settings to customize your system!",
          actions: [{ type: 'open_app', label: 'Open Settings', value: 'settings', icon: Settings }]
        }
      }
    }

    // Web browsing commands
    if (input.includes('search') || input.includes('google') || input.includes('find')) {
      const searchTerm = input.replace(/(search|google|find)\s+(for\s+)?/g, '').trim()
      if (searchTerm) {
        return {
          content: `Searching for "${searchTerm}" on the web!`,
          actions: [
            { type: 'open_url', label: `Search: ${searchTerm}`, value: `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`, icon: Search },
            { type: 'open_app', label: 'Open Browser', value: 'browser', icon: Globe }
          ]
        }
      }
    }

    if (input.includes('youtube')) {
      return {
        content: "Opening YouTube for video content!",
        actions: [{ type: 'open_url', label: 'Open YouTube', value: 'https://www.youtube.com', icon: Globe }]
      }
    }

    if (input.includes('github')) {
      return {
        content: "Opening GitHub for code repositories!",
        actions: [{ type: 'open_url', label: 'Open GitHub', value: 'https://www.github.com', icon: Globe }]
      }
    }

    // System information
    if (input.includes('time') || input.includes('clock')) {
      const now = new Date()
      return {
        content: `The current time is ${now.toLocaleTimeString()}. Today is ${now.toLocaleDateString()}.`
      }
    }

    if (input.includes('weather')) {
      return {
        content: "I'd love to check the weather for you! Let me open a weather service.",
        actions: [{ type: 'open_url', label: 'Check Weather', value: 'https://weather.com', icon: Globe }]
      }
    }

    // AI capabilities showcase
    if (input.includes('help') || input.includes('what can you do') || input.includes('capabilities')) {
      return {
        content: "I'm your intelligent OS assistant! I can:\n\n• Open any application instantly\n• Browse the web and search for information\n• Manage your system settings\n• Provide real-time information\n• Execute voice commands\n• Learn from your usage patterns\n\nJust tell me what you need, and I'll make it happen!",
        actions: [
          { type: 'open_app', label: 'Show All Apps', value: 'launcher', icon: Sparkles },
          { type: 'open_app', label: 'System Settings', value: 'settings', icon: Settings }
        ]
      }
    }

    // Personality responses
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return {
        content: "Hello! I'm Momin, your AI companion. I'm here to make your MominOS experience seamless and intelligent. How can I assist you today?"
      }
    }

    if (input.includes('thank') || input.includes('thanks')) {
      return {
        content: "You're very welcome! I'm always here to help. Is there anything else you'd like me to do?"
      }
    }

    // Default intelligent response
    return {
      content: `I understand you're asking about "${input}". While I'm continuously learning, I can help you with opening applications, browsing the web, or system tasks. Would you like me to search for more information about this?`,
      actions: [
        { type: 'open_url', label: `Search: ${input}`, value: `https://www.google.com/search?q=${encodeURIComponent(input)}`, icon: Search },
        { type: 'open_app', label: 'Open Browser', value: 'browser', icon: Globe }
      ]
    }
  }

  const executeAction = (action: Action) => {
    switch (action.type) {
      case 'open_app':
        onOpenApp(action.value)
        break
      case 'open_url':
        window.open(action.value, '_blank')
        break
      case 'search':
        window.open(`https://www.google.com/search?q=${encodeURIComponent(action.value)}`, '_blank')
        break
    }
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1.1
      utterance.volume = 0.8
      window.speechSynthesis.speak(utterance)
    }
  }

  const toggleListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(!isListening)
      // Voice recognition implementation would go here
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed z-50"
        style={{ 
          left: position.x + dragOffset.x, 
          top: position.y + dragOffset.y 
        }}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        drag
        dragMomentum={false}
        onDrag={(event, info) => {
          setDragOffset({ x: info.offset.x, y: info.offset.y })
        }}
      >
        <motion.div 
          className={`bg-black/30 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl ${
            isMinimized ? 'w-16 h-16' : 'w-96 h-[500px]'
          }`}
          style={{
            boxShadow: '0 32px 80px -12px rgba(0, 0, 0, 0.4), 0 0 40px rgba(139, 92, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
          whileHover={{ 
            boxShadow: '0 32px 80px -12px rgba(0, 0, 0, 0.5), 0 0 60px rgba(139, 92, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-xl flex items-center justify-center"
                animate={{ 
                  rotate: isTyping ? [0, 5, -5, 0] : 0,
                  scale: isListening ? [1, 1.1, 1] : 1
                }}
                transition={{ 
                  rotate: { duration: 0.5, repeat: isTyping ? Infinity : 0 },
                  scale: { duration: 1, repeat: isListening ? Infinity : 0 }
                }}
              >
                <Brain className="w-4 h-4 text-white" />
              </motion.div>
              {!isMinimized && (
                <div>
                  <h3 className="text-white font-semibold text-sm">Momin AI</h3>
                  <p className="text-gray-300 text-xs">
                    {isTyping ? 'Thinking...' : isListening ? 'Listening...' : 'Ready to assist'}
                  </p>
                </div>
              )}
            </div>
            
            {!isMinimized && (
              <div className="flex items-center gap-1">
                <motion.button
                  onClick={() => setIsSpeaking(!isSpeaking)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSpeaking ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                </motion.button>
                <motion.button
                  onClick={toggleListening}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isListening ? 'bg-red-500/20 text-red-400' : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                </motion.button>
                <motion.button
                  onClick={() => setIsMinimized(true)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Minimize2 className="w-3 h-3" />
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-3 h-3" />
                </motion.button>
              </div>
            )}
            
            {isMinimized && (
              <motion.button
                onClick={() => setIsMinimized(false)}
                className="absolute inset-0 rounded-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
            )}
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto max-h-80 space-y-3">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <motion.div
                        className={`p-3 rounded-2xl ${
                          message.type === 'user' 
                            ? 'bg-purple-500/30 border border-purple-400/30 text-white' 
                            : 'bg-white/10 border border-white/10 text-gray-100'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-line">
                          {message.content}
                        </p>
                        <p className="text-xs opacity-60 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </motion.div>
                      
                      {message.actions && (
                        <motion.div 
                          className="mt-2 space-y-1"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          {message.actions.map((action, index) => {
                            const Icon = action.icon || Zap
                            return (
                              <motion.button
                                key={index}
                                onClick={() => executeAction(action)}
                                className="flex items-center gap-2 w-full p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white/90 hover:text-white transition-all duration-200 text-sm"
                                whileHover={{ scale: 1.02, x: 2 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Icon className="w-4 h-4" />
                                {action.label}
                              </motion.button>
                            )
                          })}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-white/10 border border-white/10 rounded-2xl p-3">
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-purple-400 rounded-full"
                            animate={{ 
                              opacity: [0.3, 1, 0.3],
                              scale: [0.8, 1, 0.8]
                            }}
                            transition={{ 
                              duration: 1.5, 
                              repeat: Infinity, 
                              delay: i * 0.2 
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && inputValue.trim()) {
                        processUserInput(inputValue.trim())
                      }
                    }}
                    placeholder="Ask me anything or give me a command..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all duration-200 text-sm"
                    disabled={isTyping}
                  />
                  <motion.button
                    onClick={() => {
                      if (inputValue.trim()) {
                        processUserInput(inputValue.trim())
                      }
                    }}
                    disabled={!inputValue.trim() || isTyping}
                    className="p-2 rounded-xl bg-purple-500/30 hover:bg-purple-500/40 disabled:bg-white/10 disabled:opacity-50 text-white transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
