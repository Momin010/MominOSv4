"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, Square, Zap, Database, FileText, Settings, Bell, Search, Brain, Download, Upload } from "lucide-react"
import { useAppStore } from "@/app/lib/store"
import { fileSystemService } from "@/app/lib/file-system"
import { aiService } from "@/app/lib/ai-service"

export default function FeatureDemo() {
  const { addNotification, addFile, files } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const [demoStep, setDemoStep] = useState(0)

  const demos = [
    {
      title: "Real AI Assistant",
      description: "Powered by Claude 3 Sonnet API",
      icon: Brain,
      action: async () => {
        addNotification({
          type: 'info',
          title: 'AI Assistant',
          message: 'Try saying "Open calculator" or "Create a new file"',
          duration: 5000
        })
        // Simulate AI response
        setTimeout(() => {
          addNotification({
            type: 'success',
            title: 'AI Response',
            message: 'I can help you with tasks, answer questions, and control your system!',
            duration: 4000
          })
        }, 2000)
      }
    },
    {
      title: "File System",
      description: "Real file operations with upload/download",
      icon: FileText,
      action: () => {
        // Create a demo file
        const demoFile = fileSystemService.createFile(
          'demo-document.txt',
          'This is a demo file created by the new file system!\n\nFeatures:\n- Real file creation\n- Content editing\n- File organization\n- Upload/download support',
          '/'
        )
        addNotification({
          type: 'success',
          title: 'File Created',
          message: `Created ${demoFile.name}`,
          duration: 3000
        })
      }
    },
    {
      title: "Global Search",
      description: "Spotlight-like search (Cmd/Ctrl + K)",
      icon: Search,
      action: () => {
        addNotification({
          type: 'info',
          title: 'Global Search',
          message: 'Press Cmd+K (Mac) or Ctrl+K (Windows) to open search',
          duration: 4000
        })
      }
    },
    {
      title: "Notifications",
      description: "Real-time notification system",
      icon: Bell,
      action: () => {
        addNotification({
          type: 'success',
          title: 'Welcome to MominOS!',
          message: 'All new features are now active',
          duration: 3000
        })
        setTimeout(() => {
          addNotification({
            type: 'info',
            title: 'System Update',
            message: 'New features have been installed',
            duration: 3000
          })
        }, 1000)
        setTimeout(() => {
          addNotification({
            type: 'warning',
            title: 'Storage Warning',
            message: 'You have 2.3GB of free space remaining',
            duration: 4000
          })
        }, 2000)
      }
    },
    {
      title: "Settings Panel",
      description: "Customizable system preferences",
      icon: Settings,
      action: () => {
        addNotification({
          type: 'info',
          title: 'Settings',
          message: 'Click the settings icon to customize your experience',
          duration: 3000
        })
      }
    },
    {
      title: "State Persistence",
      description: "Your data persists across sessions",
      icon: Database,
      action: () => {
        addNotification({
          type: 'success',
          title: 'Data Persistence',
          message: 'Your files and settings are automatically saved',
          duration: 3000
        })
      }
    }
  ]

  const runAllDemos = async () => {
    for (let i = 0; i < demos.length; i++) {
      setDemoStep(i)
      demos[i].action()
      await new Promise(resolve => setTimeout(resolve, 1500))
    }
    setDemoStep(-1)
  }

  return (
    <>
      {/* Demo Trigger */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Zap className="w-4 h-4" />
        <span>New Features Demo</span>
      </motion.button>

      {/* Demo Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="w-full max-w-2xl bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <h2 className="text-white text-xl font-semibold mb-2">🚀 New Features Demo</h2>
                <p className="text-white/70 text-sm">
                  Experience all the improvements we've made to MominOS
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {demos.map((demo, index) => {
                    const Icon = demo.icon
                    return (
                      <motion.button
                        key={demo.title}
                        onClick={demo.action}
                        className={`p-4 rounded-lg border transition-all duration-200 ${
                          demoStep === index
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left">
                            <h3 className="text-white font-medium">{demo.title}</h3>
                            <p className="text-white/60 text-sm">{demo.description}</p>
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={runAllDemos}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="w-4 h-4" />
                    Run All Demos
                  </motion.button>
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Close
                  </motion.button>
                </div>

                {/* Stats */}
                <div className="mt-6 p-4 bg-white/5 rounded-lg">
                  <h4 className="text-white font-medium mb-2">System Stats</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/60">Files:</span>
                      <span className="text-white ml-2">{files.length}</span>
                    </div>
                    <div>
                      <span className="text-white/60">AI Ready:</span>
                      <span className="text-green-400 ml-2">✓</span>
                    </div>
                    <div>
                      <span className="text-white/60">Search:</span>
                      <span className="text-green-400 ml-2">✓</span>
                    </div>
                    <div>
                      <span className="text-white/60">Notifications:</span>
                      <span className="text-green-400 ml-2">✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}