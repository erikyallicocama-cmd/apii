import React, { useState, useRef, useEffect } from 'react';
import { FormattedText } from '../ui/FormattedText';
import { AnimatedLogo } from '../ui/AnimatedLogo';
import { AiSidebar } from './AiSidebar';
import { aiService } from '../../services/aiService';
import { AI_MODELS, AI_MODEL_OPTIONS } from '../../constants';
import type { AiRequestDTO, AiResponseDTO } from '../../types/api';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface AiChatProps {
  onBack: () => void;
}

export const AiChat: React.FC<AiChatProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(AI_MODELS.GEMINI_FLASH);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messageOrder, setMessageOrder] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewChat = () => {
    // Reiniciar estado para nueva conversación
    setCurrentConversationId(null);
    setMessageOrder(0);
    setMessages([]);
    setInput('');
  };

  const handleLoadChat = async (conversationId: string) => {
    try {
      // Cargar la conversación específica usando el nuevo endpoint
      const conversation = await aiService.getConversation(conversationId);
      
      // Establecer el conversationId actual y el próximo messageOrder
      setCurrentConversationId(conversationId);
      setMessageOrder(conversation.length);
      
      // Convertir a formato de mensajes para el chat
      const loadedMessages: Message[] = [];
      
      conversation.forEach(item => {
        // Agregar mensaje del usuario
        loadedMessages.push({
          id: `${item.id}-user`,
          content: item.prompt,
          isUser: true,
          timestamp: new Date(item.createdAt)
        });
        
        // Agregar respuesta de la IA
        loadedMessages.push({
          id: `${item.id}-ai`,
          content: item.response,
          isUser: false,
          timestamp: new Date(item.createdAt)
        });
      });
      
      setMessages(loadedMessages);
      console.log(`Loaded conversation ${conversationId} with ${loadedMessages.length} messages`);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      let response: AiResponseDTO;
      
      // Si no hay conversationId, iniciar nueva conversación
      if (!currentConversationId || messageOrder === 0) {
        const aiRequestData: AiRequestDTO = {
          prompt: currentInput,
          model: selectedModel
        };
        
        response = await aiService.generate(aiRequestData);
        
        // Actualizar el conversationId con el que devuelve el backend
        setCurrentConversationId(response.conversationId);
        setMessageOrder(response.messageOrder);
      } else {
        // Continuar conversación existente
        const continueData = {
          prompt: currentInput,
          model: selectedModel,
          conversationId: currentConversationId
        };
        
        response = await aiService.continueConversation(currentConversationId, continueData);
        setMessageOrder(response.messageOrder);
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response || 'No se pudo generar una respuesta.',
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Sidebar */}
      <AiSidebar
        onNewChat={handleNewChat}
        onLoadChat={handleLoadChat}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header - Nuevo Diseño */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 px-6 py-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="group flex items-center space-x-2 text-white/90 hover:text-white transition-all duration-200 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm"
              >
                <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-semibold">Inicio</span>
              </button>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-2xl">
                <div className="relative">
                  <AnimatedLogo size="sm" className="" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-lg"></div>
                </div>
                <div>
                  <h1 className="font-bold text-white text-base">Asistente Inteligente</h1>
                  <p className="text-xs text-white/80">En línea • Listo para ayudar</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="appearance-none text-sm border-2 border-white/20 rounded-xl px-4 py-2.5 pr-10 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all cursor-pointer font-semibold"
                >
                  {AI_MODEL_OPTIONS.map((model) => (
                    <option key={model.value} value={model.value} className="text-gray-900">
                      {model.label}
                    </option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2.5 rounded-xl text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-emerald-200 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
                <span className="text-5xl">💭</span>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-3">¡Inicia tu conversación!</h3>
              <p className="text-gray-600 max-w-md text-lg">Hazme cualquier pregunta y obtén respuestas instantáneas.</p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-slide-in-${message.isUser ? 'left' : 'right'}`}
            >
              <div className={`flex ${message.isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3 ${message.isUser ? 'space-x-reverse' : ''} max-w-4xl`}>
                {/* Avatar - Nuevo Diseño */}
                <div className={`flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg ${
                  message.isUser 
                    ? 'bg-gradient-to-br from-orange-400 to-amber-500' 
                    : 'bg-gradient-to-br from-teal-500 to-emerald-600'
                }`}>
                  <span className="text-2xl">{message.isUser ? '👨' : '🧠'}</span>
                </div>
                
                {/* Message Content - Nuevo Diseño */}
                <div className={`flex-1 ${message.isUser ? 'max-w-xl' : 'max-w-3xl'}`}>
                  <div className={`rounded-3xl shadow-lg ${
                    message.isUser 
                      ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white' 
                      : 'bg-white border-2 border-teal-100'
                  }`}>
                    <div className="px-6 py-4">
                      {message.isUser ? (
                        <p className="text-base leading-relaxed font-medium">{message.content}</p>
                      ) : (
                        <FormattedText 
                          text={message.content} 
                          className="text-base leading-relaxed text-gray-800"
                        />
                      )}
                    </div>
                  </div>
                  <div className={`flex items-center space-x-2 mt-2 px-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <p className="text-xs text-gray-500 font-medium">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {message.isUser && (
                      <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex items-start space-x-3 max-w-4xl">
                <div className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🧠</span>
                </div>
                <div className="bg-white border-2 border-teal-100 rounded-3xl shadow-lg px-6 py-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input - Nuevo Diseño */}
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border-t-2 border-teal-200 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-4 bg-white rounded-3xl shadow-xl border-2 border-teal-200 p-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu pregunta aquí..."
                className="flex-1 resize-none border-0 bg-transparent px-4 py-3 focus:outline-none text-gray-900 placeholder-gray-500 max-h-32 text-base"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="flex-shrink-0 bg-gradient-to-r from-teal-500 to-emerald-600 text-white p-4 rounded-2xl hover:from-teal-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                title="Enviar mensaje"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-600 text-center mt-4 font-medium">
              <kbd className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg text-sm font-semibold">Enter</kbd> para enviar • <kbd className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg text-sm font-semibold">Shift + Enter</kbd> para salto de línea
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
