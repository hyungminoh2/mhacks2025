'use client'

import { useState } from 'react'
import { PaperAirplaneIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Message {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm here to help you with cryptocurrency calculations. What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const sendMessage = () => {
    if (!inputMessage.trim()) return

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate bot response with more realistic responses
    setTimeout(() => {
      const responses = [
        "I can help you calculate your crypto portfolio value. What coins are you holding?",
        "Bitcoin is currently showing strong support levels. Would you like me to analyze the current market trends?",
        "For crypto calculations, I can help with profit/loss, DCA strategies, or portfolio diversification. What interests you most?",
        "That's a great question! Let me process the current market data for you...",
        "I'm analyzing the latest cryptocurrency data. What specific calculation would you like me to help with?"
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const botResponse: Message = {
        id: messages.length + 2,
        text: randomResponse,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-white">Solvend Crypto AI</h1>
                <p className="text-sm text-gray-400">Your crypto calculation assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-400">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="mx-auto max-w-4xl h-[calc(100vh-120px)] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${message.isUser
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-700 text-gray-100'
                  }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-lg bg-gray-700 text-gray-100">
                <div className="flex space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-700 p-6 bg-gray-800">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about crypto prices, calculations, portfolio analysis..."
              className="flex-1 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim()}
              className="bg-indigo-500 hover:bg-indigo-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setInputMessage("Calculate my portfolio value")}
              className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors"
            >
              Portfolio Value
            </button>
            <button
              onClick={() => setInputMessage("What's the current Bitcoin price?")}
              className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors"
            >
              Bitcoin Price
            </button>
            <button
              onClick={() => setInputMessage("Help me with DCA strategy")}
              className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors"
            >
              DCA Strategy
            </button>
            <button
              onClick={() => setInputMessage("Analyze market trends")}
              className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors"
            >
              Market Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}