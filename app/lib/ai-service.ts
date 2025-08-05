// AI Service for MominOS
import { useAppStore } from './store'

const ANTHROPIC_API_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || 'your-api-key-here'
const API_BASE_URL = 'https://api.anthropic.com/v1'

export interface AIMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    intent?: string
    entities?: string[]
    confidence?: number
    actions?: AIAction[]
  }
}

export interface AIAction {
  type: 'open_app' | 'open_file' | 'open_url' | 'search' | 'system_command' | 'create_file' | 'send_email' | 'set_reminder'
  label: string
  value: string
  icon?: string
  description?: string
}

export interface AIResponse {
  content: string
  actions?: AIAction[]
  confidence: number
  intent: string
}

class AIService {
  private context: string = ''
  private conversationHistory: AIMessage[] = []

  constructor() {
    this.initializeContext()
  }

  private initializeContext() {
    this.context = `You are Momin, an advanced AI assistant for MominOS, a modern desktop operating system interface. You have the following capabilities:

1. **File Management**: Create, open, edit, and organize files
2. **App Management**: Launch and control applications
3. **System Commands**: Execute system-level operations
4. **Search**: Find files, apps, and information
5. **Communication**: Send emails, set reminders
6. **Context Awareness**: Understand the current state of the system

Current System State:
- Available Apps: Calculator, File Explorer, Music, Browser, Email, Calendar, Terminal, Settings, Code Editor, Photos
- File System: Hierarchical file structure with folders and files
- User Interface: Window-based desktop environment

When responding:
- Be helpful, concise, and natural
- Suggest relevant actions when appropriate
- Understand context from previous messages
- Provide actionable responses
- Use markdown formatting for better readability

Always respond in a friendly, helpful manner and suggest relevant actions when appropriate.`
  }

  async sendMessage(userInput: string): Promise<AIResponse> {
    try {
      // Add user message to history
      const userMessage: AIMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: userInput,
        timestamp: new Date()
      }
      this.conversationHistory.push(userMessage)

      // Prepare messages for API
      const messages = [
        { role: 'system', content: this.context },
        ...this.conversationHistory.slice(-10).map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ]

      // Call Anthropic API
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: messages,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      const assistantContent = data.content[0].text

      // Parse response for actions and intent
      const { content, actions, intent } = this.parseAIResponse(assistantContent, userInput)

      // Create assistant message
      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content,
        timestamp: new Date(),
        metadata: {
          intent,
          actions,
          confidence: 0.9
        }
      }
      this.conversationHistory.push(assistantMessage)

      // Update store
      const store = useAppStore.getState()
      store.addAIMessage(userMessage)
      store.addAIMessage(assistantMessage)

      return {
        content,
        actions,
        confidence: 0.9,
        intent
      }

    } catch (error) {
      console.error('AI Service Error:', error)
      
      // Fallback response
      const fallbackResponse: AIResponse = {
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        confidence: 0.5,
        intent: 'error'
      }

      return fallbackResponse
    }
  }

  private parseAIResponse(content: string, userInput: string): { content: string; actions?: AIAction[]; intent: string } {
    const actions: AIAction[] = []
    let intent = 'general'

    // Extract intent from user input
    const lowerInput = userInput.toLowerCase()
    
    if (lowerInput.includes('open') || lowerInput.includes('launch') || lowerInput.includes('start')) {
      intent = 'open_app'
      // Extract app name and suggest action
      const appMatch = lowerInput.match(/(?:open|launch|start)\s+(calculator|file|music|browser|email|calendar|terminal|settings|code|photos)/)
      if (appMatch) {
        actions.push({
          type: 'open_app',
          label: `Open ${appMatch[1]}`,
          value: appMatch[1],
          icon: this.getAppIcon(appMatch[1])
        })
      }
    } else if (lowerInput.includes('file') || lowerInput.includes('folder') || lowerInput.includes('document')) {
      intent = 'file_management'
      if (lowerInput.includes('create') || lowerInput.includes('new')) {
        actions.push({
          type: 'create_file',
          label: 'Create new file',
          value: 'new_file',
          icon: '📄'
        })
      } else if (lowerInput.includes('open') || lowerInput.includes('find')) {
        actions.push({
          type: 'open_file',
          label: 'Open file explorer',
          value: 'file_explorer',
          icon: '📁'
        })
      }
    } else if (lowerInput.includes('search') || lowerInput.includes('find')) {
      intent = 'search'
      actions.push({
        type: 'search',
        label: 'Search files and apps',
        value: userInput.replace(/search|find/gi, '').trim(),
        icon: '🔍'
      })
    } else if (lowerInput.includes('email') || lowerInput.includes('mail')) {
      intent = 'communication'
      actions.push({
        type: 'send_email',
        label: 'Open email app',
        value: 'email',
        icon: '📧'
      })
    } else if (lowerInput.includes('reminder') || lowerInput.includes('schedule')) {
      intent = 'reminder'
      actions.push({
        type: 'set_reminder',
        label: 'Set reminder',
        value: userInput,
        icon: '⏰'
      })
    }

    return { content, actions, intent }
  }

  private getAppIcon(appName: string): string {
    const icons: Record<string, string> = {
      calculator: '🧮',
      file: '📁',
      music: '🎵',
      browser: '🌐',
      email: '📧',
      calendar: '📅',
      terminal: '💻',
      settings: '⚙️',
      code: '📝',
      photos: '📸'
    }
    return icons[appName] || '📱'
  }

  // Voice synthesis
  async speakText(text: string): Promise<void> {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.0
      speechSynthesis.speak(utterance)
    }
  }

  // Voice recognition
  async startVoiceRecognition(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!('webkitSpeechRecognition' in window)) {
        reject(new Error('Speech recognition not supported'))
        return
      }

      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        resolve(transcript)
      }

      recognition.onerror = (event: any) => {
        reject(new Error(event.error))
      }

      recognition.start()
    })
  }

  // Execute AI actions
  async executeAction(action: AIAction): Promise<void> {
    const store = useAppStore.getState()

    switch (action.type) {
      case 'open_app':
        // This will be handled by the desktop component
        store.addNotification({
          type: 'success',
          title: 'Opening App',
          message: `Opening ${action.label}...`,
          duration: 3000
        })
        break

      case 'create_file':
        const newFile = {
          id: `file-${Date.now()}`,
          name: 'New Document.txt',
          type: 'file' as const,
          size: 0,
          modified: new Date(),
          path: store.currentPath,
          content: ''
        }
        store.addFile(newFile)
        store.addNotification({
          type: 'success',
          title: 'File Created',
          message: 'New file created successfully',
          duration: 3000
        })
        break

      case 'search':
        store.addNotification({
          type: 'info',
          title: 'Search',
          message: `Searching for: ${action.value}`,
          duration: 3000
        })
        break

      default:
        store.addNotification({
          type: 'info',
          title: 'Action',
          message: `Executing: ${action.label}`,
          duration: 3000
        })
    }
  }

  // Get conversation history
  getConversationHistory(): AIMessage[] {
    return this.conversationHistory
  }

  // Clear conversation history
  clearHistory(): void {
    this.conversationHistory = []
    const store = useAppStore.getState()
    store.aiMessages = []
  }
}

// Export singleton instance
export const aiService = new AIService()