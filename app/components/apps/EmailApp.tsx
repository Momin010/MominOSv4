"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Mail, 
  Send, 
  Trash2, 
  Star, 
  StarOff, 
  Reply, 
  Forward, 
  Archive,
  Search,
  Plus,
  Filter,
  RefreshCw,
  Paperclip,
  Bold,
  Italic,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight
} from "lucide-react"

interface Email {
  id: string
  from: string
  subject: string
  preview: string
  date: string
  read: boolean
  starred: boolean
  attachments: boolean
}

interface ComposeEmail {
  to: string
  subject: string
  body: string
}

export default function EmailApp() {
  const [selectedFolder, setSelectedFolder] = useState('inbox')
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [showCompose, setShowCompose] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [composeEmail, setComposeEmail] = useState<ComposeEmail>({
    to: '',
    subject: '',
    body: ''
  })

  // Mock emails
  const emails: Email[] = [
    {
      id: '1',
      from: 'john@example.com',
      subject: 'Project Update - Q1 Results',
      preview: 'Hi team, I wanted to share the Q1 results with everyone...',
      date: '2 hours ago',
      read: false,
      starred: true,
      attachments: true
    },
    {
      id: '2',
      from: 'sarah@company.com',
      subject: 'Meeting Tomorrow at 10 AM',
      preview: 'Just a reminder about our team meeting tomorrow...',
      date: '4 hours ago',
      read: true,
      starred: false,
      attachments: false
    },
    {
      id: '3',
      from: 'support@service.com',
      subject: 'Your subscription has been renewed',
      preview: 'Thank you for your continued support...',
      date: '1 day ago',
      read: true,
      starred: false,
      attachments: false
    },
    {
      id: '4',
      from: 'newsletter@tech.com',
      subject: 'Weekly Tech Digest',
      preview: 'Here are the latest developments in technology...',
      date: '2 days ago',
      read: true,
      starred: true,
      attachments: true
    },
    {
      id: '5',
      from: 'hr@company.com',
      subject: 'New Employee Welcome',
      preview: 'Please join us in welcoming our new team member...',
      date: '3 days ago',
      read: false,
      starred: false,
      attachments: false
    }
  ]

  const filteredEmails = emails.filter(email => 
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.from.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email)
    email.read = true
  }

  const handleStarToggle = (emailId: string) => {
    const email = emails.find(e => e.id === emailId)
    if (email) {
      email.starred = !email.starred
    }
  }

  const handleCompose = () => {
    setShowCompose(true)
    setSelectedEmail(null)
  }

  const handleSend = () => {
    // In a real app, you would send the email here
    console.log('Sending email:', composeEmail)
    setShowCompose(false)
    setComposeEmail({ to: '', subject: '', body: '' })
  }

  const handleDelete = (emailId: string) => {
    // In a real app, you would delete the email here
    console.log('Deleting email:', emailId)
    setSelectedEmail(null)
  }

  return (
    <div className="h-full bg-black/20 backdrop-blur-xl flex">
      {/* Sidebar */}
      <div className="w-64 glass-card border-r border-white/10">
        <div className="p-4">
          <motion.button
            onClick={handleCompose}
            className="glass-button w-full mb-4 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            Compose
          </motion.button>
          
          <div className="space-y-2">
            <motion.button
              onClick={() => setSelectedFolder('inbox')}
              className={`w-full text-left p-2 rounded-lg ${
                selectedFolder === 'inbox' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              📥 Inbox ({emails.filter(e => !e.read).length})
            </motion.button>
            <motion.button
              onClick={() => setSelectedFolder('starred')}
              className={`w-full text-left p-2 rounded-lg ${
                selectedFolder === 'starred' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              ⭐ Starred ({emails.filter(e => e.starred).length})
            </motion.button>
            <motion.button
              onClick={() => setSelectedFolder('sent')}
              className={`w-full text-left p-2 rounded-lg ${
                selectedFolder === 'sent' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              📤 Sent
            </motion.button>
            <motion.button
              onClick={() => setSelectedFolder('drafts')}
              className={`w-full text-left p-2 rounded-lg ${
                selectedFolder === 'drafts' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              📝 Drafts
            </motion.button>
            <motion.button
              onClick={() => setSelectedFolder('trash')}
              className={`w-full text-left p-2 rounded-lg ${
                selectedFolder === 'trash' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              🗑️ Trash
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="glass-topbar p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-white font-semibold">Email</h2>
              <motion.button
                className="glass-button p-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <RefreshCw className="w-4 h-4 text-white" />
              </motion.button>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                className="glass-button p-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Filter className="w-4 h-4 text-white" />
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
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-10 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Email List and Detail */}
        <div className="flex-1 flex">
          {/* Email List */}
          <div className="w-1/2 border-r border-white/10 overflow-auto">
            <div className="space-y-1 p-2">
              {filteredEmails.map((email) => (
                <motion.div
                  key={email.id}
                  className={`glass-card p-3 cursor-pointer ${
                    selectedEmail?.id === email.id ? 'ring-2 ring-purple-500' : ''
                  } ${!email.read ? 'bg-white/10' : ''}`}
                  onClick={() => handleEmailClick(email)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start gap-3">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStarToggle(email.id)
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {email.starred ? (
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      ) : (
                        <StarOff className="w-4 h-4 text-gray-400" />
                      )}
                    </motion.button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${!email.read ? 'text-white' : 'text-gray-300'}`}>
                          {email.from}
                        </span>
                        <span className="text-gray-400 text-xs">{email.date}</span>
                      </div>
                      <div className={`text-sm ${!email.read ? 'text-white' : 'text-gray-300'}`}>
                        {email.subject}
                      </div>
                      <div className="text-gray-400 text-xs truncate">
                        {email.preview}
                      </div>
                    </div>
                    {email.attachments && (
                      <Paperclip className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Email Detail */}
          <div className="w-1/2 p-4">
            {selectedEmail ? (
              <div className="glass-card p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-lg font-semibold">{selectedEmail.subject}</h3>
                  <div className="flex items-center gap-2">
                    <motion.button
                      className="glass-button p-2"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Reply className="w-4 h-4 text-white" />
                    </motion.button>
                    <motion.button
                      className="glass-button p-2"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Forward className="w-4 h-4 text-white" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(selectedEmail.id)}
                      className="glass-button p-2 text-red-400"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-gray-400 text-sm">From: {selectedEmail.from}</div>
                  <div className="text-gray-400 text-sm">Date: {selectedEmail.date}</div>
                </div>
                <div className="text-white">
                  {selectedEmail.preview}
                  <br /><br />
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </div>
              </div>
            ) : showCompose ? (
              <div className="glass-card p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-lg font-semibold">Compose Email</h3>
                  <motion.button
                    onClick={handleSend}
                    className="glass-button px-4 py-2 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </motion.button>
                </div>
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="To:"
                    value={composeEmail.to}
                    onChange={(e) => setComposeEmail({...composeEmail, to: e.target.value})}
                    className="glass-input w-full text-white placeholder-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Subject:"
                    value={composeEmail.subject}
                    onChange={(e) => setComposeEmail({...composeEmail, subject: e.target.value})}
                    className="glass-input w-full text-white placeholder-gray-400"
                  />
                  <textarea
                    placeholder="Write your message..."
                    value={composeEmail.body}
                    onChange={(e) => setComposeEmail({...composeEmail, body: e.target.value})}
                    className="glass-input w-full h-64 resize-none text-white placeholder-gray-400"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <Mail className="w-16 h-16 mx-auto mb-4" />
                  <p>Select an email to read</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 