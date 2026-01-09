import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Minimize2, LogIn } from 'lucide-react'
import { chatApi } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../hooks/useTheme'
import { Link } from 'react-router-dom'

interface Message {
  id: number
  content: string
  sender_type: 'visitor' | 'admin'
  created_at: string
  user?: {
    name: string
  }
}

interface Conversation {
  id: number
  messages: Message[]
}

const ChatWithAccount = () => {
  const { isDark } = useTheme()
  const { isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const loadConversation = useCallback(async () => {
    if (!isAuthenticated) return

    setIsLoading(true)
    try {
      const response = await chatApi.createAuthenticatedConversation()
      setConversation(response.data.data.conversation)
    } catch (error) {
      console.error('Error loading conversation:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  const loadMessages = useCallback(async () => {
    if (!conversation) return

    try {
      const response = await chatApi.getMessages(conversation.id)
      if (response.data.success) {
        setConversation(prev => {
          if (!prev) return null
          return {
            ...prev,
            messages: response.data.data,
          }
        })
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }, [conversation])

  // Charger la conversation
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadConversation()
    }
  }, [isOpen, isAuthenticated, loadConversation])

  // Polling pour les nouveaux messages
  useEffect(() => {
    if (isOpen && conversation && isAuthenticated) {
      const interval = setInterval(() => {
        loadMessages()
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [isOpen, conversation, isAuthenticated, loadMessages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !conversation) return

    setIsSending(true)
    try {
      await chatApi.sendMessage(conversation.id, message)
      setMessage('')
      await loadMessages()
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Erreur lors de l\'envoi du message')
    } finally {
      setIsSending(false)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation?.messages])

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-2xl z-50 hover:shadow-purple-500/50 transition-shadow"
        >
          <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-96 h-[calc(100vh-4rem)] sm:h-[600px] max-h-[600px] rounded-t-2xl sm:rounded-2xl glass-effect border border-purple-500/20 shadow-2xl z-50 flex flex-col ${
              isMinimized ? 'h-16' : ''
            }`}
            style={{
              backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-purple-500/20 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                <h3 className="font-bold text-white [data-theme='light']:text-dark-500 text-sm sm:text-base">
                  Chat avec Compte
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 sm:p-1 hover:bg-purple-500/20 rounded transition-colors touch-manipulation"
                  aria-label="Minimiser"
                >
                  <Minimize2 className="w-5 h-5 sm:w-4 sm:h-4 text-secondary-400" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 sm:p-1 hover:bg-purple-500/20 rounded transition-colors touch-manipulation"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5 sm:w-4 sm:h-4 text-secondary-400" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {!isAuthenticated ? (
                  <div className="flex-1 p-4 sm:p-6 flex flex-col justify-center items-center text-center overflow-y-auto">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                      <LogIn className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold text-white [data-theme='light']:text-dark-500 mb-2">
                      Connexion requise
                    </h4>
                    <p className="text-xs sm:text-sm text-secondary-400 mb-6 px-4">
                      Connectez-vous pour accéder à votre historique de conversations
                    </p>
                    <Link to="/login" className="btn-primary text-sm sm:text-base px-6 py-2">
                      Se connecter
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-0">
                      {isLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : conversation?.messages.length === 0 ? (
                        <div className="text-center py-8 text-secondary-400">
                          <p>Aucun message. Commencez la conversation !</p>
                        </div>
                      ) : (
                        conversation?.messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender_type === 'visitor' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[85%] sm:max-w-[75%] rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 text-sm sm:text-base ${
                                msg.sender_type === 'visitor'
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-secondary-700 text-white [data-theme="light"]:bg-secondary-200 [data-theme="light"]:text-dark-500'
                              }`}
                            >
                              {msg.sender_type === 'admin' && msg.user && (
                                <p className="text-xs font-semibold mb-1 opacity-70">
                                  {msg.user.name}
                                </p>
                              )}
                              <p className="text-sm">{msg.content}</p>
                              <p className="text-xs opacity-60 mt-1">
                                {new Date(msg.created_at).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-purple-500/20 flex-shrink-0">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Tapez votre message..."
                          className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg glass-effect border border-purple-500/20 focus:border-purple-500/50 focus:outline-none text-white [data-theme='light']:text-dark-500 placeholder:text-secondary-400"
                          style={{
                            backgroundColor: isDark ? 'rgba(31, 41, 55, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                          }}
                          disabled={isSending}
                        />
                        <button
                          type="submit"
                          disabled={isSending || !message.trim()}
                          className="btn-primary px-3 sm:px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                          style={{
                            background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                          }}
                        >
                          {isSending ? (
                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatWithAccount

