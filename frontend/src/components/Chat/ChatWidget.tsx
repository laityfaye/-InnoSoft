import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Minimize2 } from 'lucide-react'
import { chatApi } from '../../services/api'
import { useTheme } from '../../hooks/useTheme'

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
  session_id: string
  messages: Message[]
}

const ChatWidget = () => {
  const { isDark } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [visitorName, setVisitorName] = useState('')
  const [visitorEmail, setVisitorEmail] = useState('')
  const [showNameForm, setShowNameForm] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Récupérer ou créer un session_id
  useEffect(() => {
    let storedSessionId = localStorage.getItem('chat_session_id')
    if (!storedSessionId) {
      storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('chat_session_id', storedSessionId)
    }
    setSessionId(storedSessionId)
  }, [])

  const loadConversation = useCallback(async () => {
    if (!sessionId) return

    setIsLoading(true)
    try {
      const response = await chatApi.createAnonymousConversation({
        session_id: sessionId,
        name: visitorName || undefined,
        email: visitorEmail || undefined,
      })
      setConversation(response.data.data.conversation)
    } catch (error) {
      console.error('Error loading conversation:', error)
    } finally {
      setIsLoading(false)
    }
  }, [sessionId, visitorName, visitorEmail])

  const loadMessages = useCallback(async () => {
    if (!conversation || !conversation.id || !sessionId) return

    try {
      const response = await chatApi.getMessages(conversation.id, sessionId)
      if (response.data.success && response.data.data) {
        // Trier les messages par date de création
        const sortedMessages = [...response.data.data].sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
        
        // Vérifier si les messages ont changé avant de mettre à jour
        setConversation(prev => {
          if (!prev) return null
          
          // Comparer le nombre de messages pour éviter les mises à jour inutiles
          if (prev.messages.length === sortedMessages.length) {
            const prevIds = prev.messages.map(m => m.id).join(',')
            const newIds = sortedMessages.map(m => m.id).join(',')
            if (prevIds === newIds) {
              return prev // Pas de changement
            }
          }
          
          return {
            ...prev,
            messages: sortedMessages,
          }
        })
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }, [conversation?.id, sessionId])

  // Charger la conversation
  useEffect(() => {
    if (isOpen && sessionId && !showNameForm) {
      loadConversation()
    }
  }, [isOpen, sessionId, showNameForm, loadConversation])

  // Polling pour les nouveaux messages
  useEffect(() => {
    if (isOpen && conversation?.id && !showNameForm && sessionId) {
      // Charger immédiatement
      loadMessages()
      
      // Puis charger toutes les 2 secondes pour une meilleure réactivité
      const interval = setInterval(() => {
        loadMessages()
      }, 2000) // Vérifier toutes les 2 secondes

      return () => clearInterval(interval)
    }
  }, [isOpen, conversation?.id, showNameForm, sessionId, loadMessages])

  const handleStartChat = async () => {
    // Le nom et l'email sont optionnels - on peut commencer directement
    setShowNameForm(false)
    await loadConversation()
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !conversation || !sessionId) return

    setIsSending(true)
    try {
      await chatApi.sendMessage(conversation.id, message, sessionId)
      setMessage('')
      // Recharger les messages immédiatement après l'envoi
      setTimeout(() => {
        loadMessages()
      }, 500)
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
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-2xl z-50 hover:shadow-primary-500/50 transition-shadow"
        >
          <MessageSquare className="w-8 h-8 text-white" />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 w-96 h-[600px] rounded-2xl glass-effect border border-primary-500/20 shadow-2xl z-50 flex flex-col ${
              isMinimized ? 'h-16' : ''
            }`}
            style={{
              backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-primary-500/20">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-primary-400" />
                <h3 className="font-bold text-white [data-theme='light']:text-dark-500">
                  Chat Rapide
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-primary-500/20 rounded transition-colors"
                >
                  <Minimize2 className="w-4 h-4 text-secondary-400" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-primary-500/20 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-secondary-400" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {showNameForm ? (
                  <div className="flex-1 p-6 flex flex-col justify-center">
                    <h4 className="text-lg font-semibold text-white [data-theme='light']:text-dark-500 mb-2">
                      Commencer une conversation
                    </h4>
                    <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600 mb-4">
                      Optionnel : vos informations nous aident à vous identifier et à vous répondre de manière personnalisée
                    </p>
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        placeholder="Votre nom (optionnel)"
                        className="w-full px-4 py-2 rounded-lg glass-effect border border-primary-500/20 focus:border-primary-500/50 focus:outline-none text-white [data-theme='light']:text-dark-500 placeholder:text-secondary-400"
                        style={{
                          backgroundColor: isDark ? 'rgba(31, 41, 55, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                        }}
                      />
                      <input
                        type="email"
                        value={visitorEmail}
                        onChange={(e) => setVisitorEmail(e.target.value)}
                        placeholder="Votre email (optionnel)"
                        className="w-full px-4 py-2 rounded-lg glass-effect border border-primary-500/20 focus:border-primary-500/50 focus:outline-none text-white [data-theme='light']:text-dark-500 placeholder:text-secondary-400"
                        style={{
                          backgroundColor: isDark ? 'rgba(31, 41, 55, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                        }}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleStartChat}
                          className="flex-1 btn-primary py-2"
                        >
                          Commencer
                        </button>
                        <button
                          onClick={() => {
                            setVisitorName('')
                            setVisitorEmail('')
                            handleStartChat()
                          }}
                          className="btn-secondary py-2 px-4"
                          title="Commencer sans informations"
                        >
                          Passer
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {isLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : !conversation?.messages || conversation.messages.length === 0 ? (
                        <div className="text-center py-8 text-secondary-400">
                          <p>Aucun message. Commencez la conversation !</p>
                        </div>
                      ) : (
                        conversation.messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender_type === 'visitor' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                                msg.sender_type === 'visitor'
                                  ? 'bg-primary-500 text-white'
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
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-primary-500/20">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Tapez votre message..."
                          className="flex-1 px-4 py-2 rounded-lg glass-effect border border-primary-500/20 focus:border-primary-500/50 focus:outline-none text-white [data-theme='light']:text-dark-500 placeholder:text-secondary-400"
                          style={{
                            backgroundColor: isDark ? 'rgba(31, 41, 55, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                          }}
                          disabled={isSending}
                        />
                        <button
                          type="submit"
                          disabled={isSending || !message.trim()}
                          className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSending ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Send className="w-5 h-5" />
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

export default ChatWidget

