
"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Terminal, 
  X, 
  Copy, 
  Maximize2, 
  Minimize2,
  Settings,
  Folder,
  History
} from "lucide-react"

interface TerminalLine {
  id: string
  type: 'command' | 'output' | 'error'
  content: string
  timestamp: Date
}

export default function TerminalApp() {
  const [currentPath, setCurrentPath] = useState("~")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentInput, setCurrentInput] = useState("")
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '1',
      type: 'output',
      content: 'Welcome to MominOS Terminal v1.0.0',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'output',
      content: 'Type "help" for available commands',
      timestamp: new Date()
    }
  ])
  const [theme, setTheme] = useState('dark')
  const [fontSize, setFontSize] = useState(14)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  const executeCommand = (command: string) => {
    const trimmedCommand = command.trim()
    if (!trimmedCommand) return

    // Add command to history
    setCommandHistory(prev => [...prev, trimmedCommand])
    setHistoryIndex(-1)

    // Add command line
    const commandLine: TerminalLine = {
      id: Date.now().toString(),
      type: 'command',
      content: `${currentPath} $ ${trimmedCommand}`,
      timestamp: new Date()
    }

    // Process command
    const args = trimmedCommand.split(' ')
    const cmd = args[0].toLowerCase()
    let output = ''
    let outputType: 'output' | 'error' = 'output'

    switch (cmd) {
      case 'help':
        output = `Available commands:
help        - Show this help message
clear       - Clear the terminal
ls          - List directory contents
pwd         - Print working directory
cd          - Change directory
date        - Show current date and time
echo        - Echo text
whoami      - Show current user
uname       - System information
history     - Show command history
mkdir       - Create directory
touch       - Create file
cat         - Display file contents
cp          - Copy files
mv          - Move files
rm          - Remove files
ps          - Show processes
top         - Show system resources
ping        - Ping a host
curl        - Make HTTP requests
git         - Git commands
npm         - Node.js package manager
python      - Python interpreter
node        - Node.js interpreter`
        break

      case 'clear':
        setLines([])
        setCurrentInput("")
        return

      case 'ls':
        output = `Documents/    Pictures/     Music/        Videos/
Downloads/    Desktop/      Public/       Templates/
report.pdf    photo.jpg     song.mp3      video.mp4
script.js     README.md     package.json  .gitignore`
        break

      case 'pwd':
        output = `/home/user${currentPath === '~' ? '' : currentPath}`
        break

      case 'cd':
        const newPath = args[1] || '~'
        if (newPath === '..') {
          const pathParts = currentPath.split('/').filter(p => p)
          pathParts.pop()
          setCurrentPath(pathParts.length ? '/' + pathParts.join('/') : '~')
        } else if (newPath === '~' || newPath === '/') {
          setCurrentPath('~')
        } else {
          setCurrentPath(newPath.startsWith('/') ? newPath : `${currentPath}/${newPath}`)
        }
        output = ''
        break

      case 'date':
        output = new Date().toString()
        break

      case 'echo':
        output = args.slice(1).join(' ')
        break

      case 'whoami':
        output = 'user'
        break

      case 'uname':
        output = 'MominOS 1.0.0 x86_64'
        break

      case 'history':
        output = commandHistory.map((cmd, i) => `${i + 1}  ${cmd}`).join('\n')
        break

      case 'mkdir':
        if (args[1]) {
          output = `Directory '${args[1]}' created`
        } else {
          output = 'mkdir: missing directory name'
          outputType = 'error'
        }
        break

      case 'touch':
        if (args[1]) {
          output = `File '${args[1]}' created`
        } else {
          output = 'touch: missing file name'
          outputType = 'error'
        }
        break

      case 'cat':
        if (args[1]) {
          output = `Contents of ${args[1]}:\nThis is a sample file content.\nLorem ipsum dolor sit amet...`
        } else {
          output = 'cat: missing file name'
          outputType = 'error'
        }
        break

      case 'ps':
        output = `PID    COMMAND
1      /sbin/init
123    systemd
456    desktop.tsx
789    terminal-app
1011   node server.js`
        break

      case 'top':
        output = `Tasks: 42 total, 1 running, 41 sleeping
%Cpu(s): 12.5 us, 2.1 sy, 0.0 ni, 85.2 id
Memory: 8192MB total, 4096MB used, 4096MB free`
        break

      case 'ping':
        const host = args[1] || 'google.com'
        output = `PING ${host} (142.250.191.14): 56 data bytes
64 bytes from 142.250.191.14: icmp_seq=0 ttl=54 time=12.345 ms
64 bytes from 142.250.191.14: icmp_seq=1 ttl=54 time=11.234 ms
--- ${host} ping statistics ---
2 packets transmitted, 2 packets received, 0.0% packet loss`
        break

      case 'curl':
        const url = args[1] || 'https://httpbin.org/json'
        output = `{
  "slideshow": {
    "author": "MominOS",
    "date": "date of publication",
    "slides": [
      {
        "title": "Sample response",
        "type": "all"
      }
    ],
    "title": "Sample Slide Show"
  }
}`
        break

      case 'git':
        if (args[1] === 'status') {
          output = `On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  modified:   desktop.tsx
  modified:   terminal-app.tsx

no changes added to commit (use "git add" to commit)`
        } else if (args[1] === 'log') {
          output = `commit a1b2c3d4e5f6 (HEAD -> main)
Author: User <user@example.com>
Date:   ${new Date().toDateString()}

    Add terminal app functionality`
        } else {
          output = `usage: git [--version] [--help] [-C <path>] [-c <name>=<value>]
           [--exec-path[=<path>]] [--html-path] [--man-path] [--info-path]
           [-p | --paginate | -P | --no-pager] [--no-replace-objects] [--bare]
           [--git-dir=<path>] [--work-tree=<path>] [--namespace=<name>]
           <command> [<args>]`
        }
        break

      case 'npm':
        if (args[1] === 'version' || args[1] === '-v') {
          output = `{
  npm: '10.2.4',
  node: '20.10.0',
  v8: '11.3.244.8',
  uv: '1.46.0',
  zlib: '1.2.13',
  brotli: '1.0.9',
  ares: '1.20.1',
  modules: '115',
  nghttp2: '1.57.0',
  napi: '9',
  llhttp: '8.1.1',
  openssl: '3.0.12'
}`
        } else {
          output = `Usage: npm <command>

where <command> is one of:
    access, adduser, audit, bin, bugs, c, cache, ci, cit,
    clean-install, clean-install-test, completion, config,
    create, ddp, dedupe, deprecate, dist-tag, docs, doctor,
    edit, exec, explain, explore, find-dupes, fund, get, help,
    help-search, hook, i, init, install, install-ci-test,
    install-test, it, link, list, ln, login, logout, ls,
    outdated, owner, pack, ping, prefix, profile, prune,
    publish, rebuild, repo, restart, root, run, run-script, s,
    se, search, set, shrinkwrap, star, stars, start, stop, t,
    team, test, token, tst, un, uninstall, unpublish, unstar,
    up, update, v, version, view, whoami`
        }
        break

      case 'python':
        output = `Python 3.11.0 (main, Oct 24 2022, 18:26:48) [GCC 9.4.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> print("Hello from MominOS Terminal!")
Hello from MominOS Terminal!
>>> exit()`
        break

      case 'node':
        output = `Welcome to Node.js v20.10.0.
Type ".help" for more information.
> console.log("Hello from Node.js in MominOS!")
Hello from Node.js in MominOS!
undefined
> process.exit()`
        break

      default:
        output = `${cmd}: command not found`
        outputType = 'error'
    }

    // Add lines to terminal
    const newLines: TerminalLine[] = [commandLine]
    if (output) {
      newLines.push({
        id: (Date.now() + 1).toString(),
        type: outputType,
        content: output,
        timestamp: new Date()
      })
    }

    setLines(prev => [...prev, ...newLines])
    setCurrentInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1)
        if (newIndex === commandHistory.length - 1 || historyIndex === commandHistory.length - 1) {
          setHistoryIndex(-1)
          setCurrentInput("")
        } else {
          setHistoryIndex(newIndex)
          setCurrentInput(commandHistory[newIndex])
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      // Simple tab completion for common commands
      const commands = ['help', 'clear', 'ls', 'pwd', 'cd', 'date', 'echo', 'whoami', 'uname', 'history', 'mkdir', 'touch', 'cat', 'git', 'npm', 'python', 'node']
      const matches = commands.filter(cmd => cmd.startsWith(currentInput))
      if (matches.length === 1) {
        setCurrentInput(matches[0])
      }
    } else if (e.ctrlKey && e.key === 'c') {
      e.preventDefault()
      setLines(prev => [...prev, {
        id: Date.now().toString(),
        type: 'command',
        content: `${currentPath} $ ${currentInput}^C`,
        timestamp: new Date()
      }])
      setCurrentInput("")
    }
  }

  const copyToClipboard = () => {
    const terminalContent = lines.map(line => line.content).join('\n')
    navigator.clipboard.writeText(terminalContent)
  }

  return (
    <div className="h-full bg-black/95 backdrop-blur-xl flex flex-col font-mono">
      {/* Header */}
      <div className="glass-topbar p-2 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-green-400" />
          <span className="text-white text-sm font-medium">Terminal</span>
          <span className="text-gray-400 text-xs">{currentPath}</span>
        </div>
        <div className="flex items-center gap-1">
          <motion.button
            onClick={copyToClipboard}
            className="glass-button p-1 text-xs"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Copy className="w-3 h-3 text-white" />
          </motion.button>
          <motion.button
            onClick={() => setLines([])}
            className="glass-button p-1 text-xs"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-3 h-3 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="flex-1 p-4 overflow-auto text-sm leading-relaxed"
        style={{ fontSize: `${fontSize}px` }}
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line) => (
          <motion.div
            key={line.id}
            className={`mb-1 ${
              line.type === 'command' ? 'text-green-400' :
              line.type === 'error' ? 'text-red-400' :
              'text-gray-300'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
          >
            <pre className="whitespace-pre-wrap font-mono">{line.content}</pre>
          </motion.div>
        ))}

        {/* Input Line */}
        <div className="flex items-center text-green-400">
          <span className="mr-2">{currentPath} $</span>
          <input
            ref={inputRef}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-white font-mono"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="glass-topbar p-2 border-t border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4 text-gray-400">
          <span>Lines: {lines.length}</span>
          <span>History: {commandHistory.length}</span>
          <span>Path: {currentPath}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Terminal Ready</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
