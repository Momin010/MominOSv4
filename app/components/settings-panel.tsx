"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, Palette, Monitor, Volume2, Wifi, Battery, Bell, Shield, User, X } from "lucide-react"
import { useAppStore } from "@/app/lib/store"

export default function SettingsPanel() {
  const { settings, updateSettings, addNotification } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('appearance')

  const tabs = [
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'display', name: 'Display', icon: Monitor },
    { id: 'sound', name: 'Sound', icon: Volume2 },
    { id: 'network', name: 'Network', icon: Wifi },
    { id: 'power', name: 'Power', icon: Battery },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'user', name: 'User', icon: User },
  ]

  const handleSettingChange = (key: string, value: any) => {
    updateSettings({ [key]: value })
    addNotification({
      type: 'success',
      title: 'Setting Updated',
      message: `${key} has been updated`,
      duration: 2000
    })
  }

  return (
    <>
      {/* Settings Trigger */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Settings className="w-5 h-5" />
      </motion.button>

      {/* Settings Modal */}
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
              className="w-full max-w-4xl h-[600px] bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-white text-xl font-semibold">Settings</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-64 bg-white/5 border-r border-white/10 p-4">
                  <nav className="space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            activeTab === tab.id
                              ? 'bg-white/20 text-white'
                              : 'text-white/70 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{tab.name}</span>
                        </button>
                      )
                    })}
                  </nav>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {activeTab === 'appearance' && (
                        <div>
                          <h3 className="text-white text-lg font-semibold mb-4">Appearance</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="text-white/80 text-sm font-medium mb-2 block">Theme</label>
                              <select
                                value={settings.theme}
                                onChange={(e) => handleSettingChange('theme', e.target.value)}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                              >
                                <option value="dark">Dark</option>
                                <option value="light">Light</option>
                                <option value="auto">Auto</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-white/80 text-sm font-medium mb-2 block">Accent Color</label>
                              <div className="flex gap-2">
                                {['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'].map((color) => (
                                  <button
                                    key={color}
                                    onClick={() => handleSettingChange('accentColor', color)}
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                                      settings.accentColor === color ? 'border-white scale-110' : 'border-white/20'
                                    }`}
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="text-white/80 text-sm font-medium mb-2 block">Dock Position</label>
                              <select
                                value={settings.dockPosition}
                                onChange={(e) => handleSettingChange('dockPosition', e.target.value)}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                              >
                                <option value="bottom">Bottom</option>
                                <option value="top">Top</option>
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                              </select>
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="text-white/80 text-sm font-medium">Animations</label>
                              <button
                                onClick={() => handleSettingChange('animations', !settings.animations)}
                                className={`w-12 h-6 rounded-full transition-colors ${
                                  settings.animations ? 'bg-purple-500' : 'bg-white/20'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 bg-white rounded-full transition-transform ${
                                    settings.animations ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'sound' && (
                        <div>
                          <h3 className="text-white text-lg font-semibold mb-4">Sound</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <label className="text-white/80 text-sm font-medium">System Sound</label>
                              <button
                                onClick={() => handleSettingChange('sound', !settings.sound)}
                                className={`w-12 h-6 rounded-full transition-colors ${
                                  settings.sound ? 'bg-purple-500' : 'bg-white/20'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 bg-white rounded-full transition-transform ${
                                    settings.sound ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>
                            <div>
                              <label className="text-white/80 text-sm font-medium mb-2 block">Volume</label>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={settings.sound ? 70 : 0}
                                onChange={(e) => handleSettingChange('sound', parseInt(e.target.value) > 0)}
                                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'notifications' && (
                        <div>
                          <h3 className="text-white text-lg font-semibold mb-4">Notifications</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <label className="text-white/80 text-sm font-medium">Enable Notifications</label>
                              <button
                                onClick={() => handleSettingChange('notifications', !settings.notifications)}
                                className={`w-12 h-6 rounded-full transition-colors ${
                                  settings.notifications ? 'bg-purple-500' : 'bg-white/20'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 bg-white rounded-full transition-transform ${
                                    settings.notifications ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="text-white/80 text-sm font-medium">Auto Save</label>
                              <button
                                onClick={() => handleSettingChange('autoSave', !settings.autoSave)}
                                className={`w-12 h-6 rounded-full transition-colors ${
                                  settings.autoSave ? 'bg-purple-500' : 'bg-white/20'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 bg-white rounded-full transition-transform ${
                                    settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'user' && (
                        <div>
                          <h3 className="text-white text-lg font-semibold mb-4">User Settings</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="text-white/80 text-sm font-medium mb-2 block">Language</label>
                              <select
                                value={settings.language}
                                onChange={(e) => handleSettingChange('language', e.target.value)}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                              >
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="fr">Français</option>
                                <option value="de">Deutsch</option>
                                <option value="ja">日本語</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-white/80 text-sm font-medium mb-2 block">Timezone</label>
                              <select
                                value={settings.timezone}
                                onChange={(e) => handleSettingChange('timezone', e.target.value)}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                              >
                                <option value="UTC">UTC</option>
                                <option value="America/New_York">Eastern Time</option>
                                <option value="America/Chicago">Central Time</option>
                                <option value="America/Denver">Mountain Time</option>
                                <option value="America/Los_Angeles">Pacific Time</option>
                                <option value="Europe/London">London</option>
                                <option value="Europe/Paris">Paris</option>
                                <option value="Asia/Tokyo">Tokyo</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}