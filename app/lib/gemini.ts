
import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = 'AIzaSyDgmNy8PoFN03vnu0Z83vUxTpVUyJqtm74'

class GeminiService {
  private genAI: GoogleGenerativeAI
  private model: any
  private quotaExceeded: boolean = false

  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' })
  }

  async generateResponse(prompt: string): Promise<string> {
    // If quota is exceeded, use fallback
    if (this.quotaExceeded) {
      return this.getFallbackResponse(prompt)
    }

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Reset quota flag on successful response
      this.quotaExceeded = false
      return text
    } catch (error: any) {
      console.warn('Gemini API error:', error)
      
      // Check if it's a quota error
      if (error.message?.includes('quota') || error.message?.includes('limit') || error.status === 429) {
        this.quotaExceeded = true
        return this.getFallbackResponse(prompt)
      }
      
      // For other errors, also fallback
      return this.getFallbackResponse(prompt)
    }
  }

  private getFallbackResponse(input: string): string {
    const normalizedInput = input.toLowerCase()

    // App opening responses
    if (normalizedInput.includes('calculator') || normalizedInput.includes('math')) {
      return "I'll open the Calculator app for you! Perfect for all your mathematical calculations."
    }
    
    if (normalizedInput.includes('browser') || normalizedInput.includes('internet') || normalizedInput.includes('web')) {
      return "Opening the Browser! Ready to explore the web and discover new content."
    }
    
    if (normalizedInput.includes('calendar') || normalizedInput.includes('schedule') || normalizedInput.includes('appointment')) {
      return "Launching Calendar to help you stay organized and manage your schedule effectively!"
    }
    
    if (normalizedInput.includes('mail') || normalizedInput.includes('email')) {
      return "Opening your Mail application. Let's check those important messages and stay connected!"
    }
    
    if (normalizedInput.includes('music') || normalizedInput.includes('audio') || normalizedInput.includes('song')) {
      return "Starting the Music player! Time to enjoy your favorite tunes and discover new sounds."
    }
    
    if (normalizedInput.includes('terminal') || normalizedInput.includes('command') || normalizedInput.includes('console')) {
      return "Opening Terminal for advanced system access. Welcome to the command line interface!"
    }
    
    if (normalizedInput.includes('code') || normalizedInput.includes('programming') || normalizedInput.includes('editor')) {
      return "Launching the Code Editor! Ready to write some amazing code and build great software."
    }
    
    if (normalizedInput.includes('photos') || normalizedInput.includes('images') || normalizedInput.includes('pictures')) {
      return "Opening Photos to browse your visual memories and manage your image collection!"
    }
    
    if (normalizedInput.includes('files') || normalizedInput.includes('folder') || normalizedInput.includes('explorer')) {
      return "Opening File Explorer to navigate your files and manage your digital storage efficiently!"
    }
    
    if (normalizedInput.includes('settings') || normalizedInput.includes('preferences') || normalizedInput.includes('configure')) {
      return "Opening Settings to customize your MominOS experience and adjust system preferences!"
    }

    // Search responses
    if (normalizedInput.includes('search') || normalizedInput.includes('find') || normalizedInput.includes('google')) {
      const searchTerm = input.replace(/(search|google|find|look for)\s+(for\s+)?/gi, '').trim()
      return `I'll search for "${searchTerm}" across the web to find you the most relevant results!`
    }

    // Time and system info
    if (normalizedInput.includes('time') || normalizedInput.includes('clock')) {
      const now = new Date()
      return `It's currently ${now.toLocaleTimeString()} on ${now.toLocaleDateString()}. Hope you're having a great day!`
    }

    // Greetings
    if (normalizedInput.includes('hello') || normalizedInput.includes('hi') || normalizedInput.includes('hey')) {
      return "Hello! I'm Sierra, your intelligent AI assistant built into MominOS. I'm currently running in offline mode but still ready to help you navigate and use your system efficiently!"
    }

    // Help responses
    if (normalizedInput.includes('help') || normalizedInput.includes('what can you do')) {
      return "I'm Sierra, your AI assistant! Even in offline mode, I can help you:\n\n• Open any application instantly\n• Navigate the system efficiently\n• Provide basic system information\n• Execute common tasks\n• Guide you through MominOS features\n\nJust speak naturally - I understand context and can assist with most tasks!"
    }

    // Thanks
    if (normalizedInput.includes('thank') || normalizedInput.includes('thanks')) {
      return "You're very welcome! I'm always here to help make your MominOS experience smooth and productive."
    }

    // Default intelligent response
    return `I understand you're asking about "${input}". While I'm currently in offline mode, I can still help you navigate MominOS efficiently. Try asking me to open specific apps, search for information, or tell me what you'd like to accomplish!`
  }
}

export const geminiService = new GeminiService()
