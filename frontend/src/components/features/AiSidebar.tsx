import React, { useState, useEffect } from 'react';
import { aiService } from '../../services/aiService';
import type { AiResponse } from '../../types/api';

interface ChatHistoryItem {
  conversationId: string;
  title: string;
  timestamp: string;
  preview: string;
  messageCount: number;
  lastMessage: string;
}

interface AiSidebarProps {
  onNewChat: () => void;
  onLoadChat?: (conversationId: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const AiSidebar: React.FC<AiSidebarProps> = ({
  onNewChat,
  onLoadChat,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'history' | 'archived' | 'docs'>('history');
  const [isDeactivateMode, setIsDeactivateMode] = useState(false);
  const [selectedConversations, setSelectedConversations] = useState<Set<string>>(new Set());
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [archivedHistory, setArchivedHistory] = useState<ChatHistoryItem[]>([]);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    if (activeSection === 'archived') {
      loadArchivedHistory();
    }
  }, [activeSection]);

  const loadChatHistory = async () => {
    try {
      setIsLoading(true);
      const response = await aiService.getHistory({ page: 0, size: 50 });
      
      // Agrupar mensajes por conversationId
      const conversationsMap = new Map<string, AiResponse[]>();
      
      response.forEach((item) => {
        const { conversationId } = item;
        if (!conversationsMap.has(conversationId)) {
          conversationsMap.set(conversationId, []);
        }
        conversationsMap.get(conversationId)!.push(item);
      });
      
      // Convertir a items de historial agrupados por conversación
      const historyItems: ChatHistoryItem[] = Array.from(conversationsMap.entries()).map(([conversationId, messages]) => {
        // Ordenar mensajes por messageOrder
        const sortedMessages = messages.sort((a, b) => a.messageOrder - b.messageOrder);
        const firstMessage = sortedMessages[0];
        const lastMessage = sortedMessages[sortedMessages.length - 1];
        
        return {
          conversationId,
          title: firstMessage.prompt.length > 30 
            ? `${firstMessage.prompt.slice(0, 30)}...` 
            : firstMessage.prompt,
          timestamp: new Date(lastMessage.createdAt).toLocaleDateString(),
          preview: lastMessage.response.slice(0, 50) + (lastMessage.response.length > 50 ? '...' : ''),
          messageCount: sortedMessages.length,
          lastMessage: lastMessage.response
        };
      });
      
      // Ordenar por fecha más reciente
      historyItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setChatHistory(historyItems);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadArchivedHistory = async () => {
    try {
      setIsLoading(true);
      // Obtener todas las conversaciones (activas e inactivas)
      const allConversations = await aiService.getAllHistory({ page: 0, size: 100 });
      const activeConversations = await aiService.getHistory({ page: 0, size: 50 });
      
      // Obtener IDs de conversaciones activas
      const activeConversationIds = new Set(
        activeConversations.map(item => item.conversationId)
      );
      
      // Filtrar solo las conversaciones inactivas
      const inactiveConversations = allConversations.filter(
        item => !activeConversationIds.has(item.conversationId)
      );
      
      // Agrupar conversaciones inactivas por conversationId
      const conversationsMap = new Map<string, AiResponse[]>();
      
      inactiveConversations.forEach((item) => {
        const { conversationId } = item;
        if (!conversationsMap.has(conversationId)) {
          conversationsMap.set(conversationId, []);
        }
        conversationsMap.get(conversationId)!.push(item);
      });
      
      // Convertir a items de historial
      const archivedItems: ChatHistoryItem[] = Array.from(conversationsMap.entries()).map(([conversationId, messages]) => {
        const sortedMessages = messages.sort((a, b) => a.messageOrder - b.messageOrder);
        const firstMessage = sortedMessages[0];
        const lastMessage = sortedMessages[sortedMessages.length - 1];
        
        return {
          conversationId,
          title: firstMessage.prompt.length > 30 
            ? `${firstMessage.prompt.slice(0, 30)}...` 
            : firstMessage.prompt,
          timestamp: new Date(lastMessage.createdAt).toLocaleDateString(),
          preview: lastMessage.response.slice(0, 50) + (lastMessage.response.length > 50 ? '...' : ''),
          messageCount: sortedMessages.length,
          lastMessage: lastMessage.response
        };
      });
      
      archivedItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setArchivedHistory(archivedItems);
    } catch (error) {
      console.error('Error loading archived history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatClick = (conversationId: string) => {
    if (!isDeactivateMode) {
      onLoadChat?.(conversationId);
    }
  };

  const toggleDeleteMode = () => {
    setIsDeactivateMode(!isDeactivateMode);
    setSelectedConversations(new Set());
  };

  const handleCheckboxChange = (conversationId: string, checked: boolean) => {
    const newSelected = new Set(selectedConversations);
    if (checked) {
      newSelected.add(conversationId);
    } else {
      newSelected.delete(conversationId);
    }
    setSelectedConversations(newSelected);
  };

  const deactivateSelectedConversations = async () => {
    if (selectedConversations.size === 0) return;
    
    try {
      setIsDeactivating(true);
      
      // Desactivar todas las conversaciones seleccionadas
      const deactivatePromises = Array.from(selectedConversations).map(conversationId =>
        aiService.deactivateConversation(conversationId)
      );
      
      await Promise.all(deactivatePromises);
      
      // Recargar el historial
      await loadChatHistory();
      
      // Salir del modo eliminación
      setIsDeactivateMode(false);
      setSelectedConversations(new Set());
    } catch (error) {
      console.error('Error deactivating conversations:', error);
    } finally {
      setIsDeactivating(false);
    }
  };

  const reactivateSelectedConversations = async () => {
    if (selectedConversations.size === 0) return;
    
    try {
      setIsDeactivating(true);
      
      // Reactivar todas las conversaciones seleccionadas
      const reactivatePromises = Array.from(selectedConversations).map(conversationId =>
        aiService.reactivateConversation(conversationId)
      );
      
      await Promise.all(reactivatePromises);
      
      // Recargar ambos historiales
      await loadArchivedHistory();
      await loadChatHistory();
      
      // Salir del modo de reactivación
      setIsDeactivateMode(false);
      setSelectedConversations(new Set());
    } catch (error) {
      console.error('Error reactivating conversations:', error);
    } finally {
      setIsDeactivating(false);
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-14 bg-gradient-to-b from-teal-700 to-emerald-800 text-white flex flex-col items-center py-4 space-y-4 shadow-xl">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
          title="Expandir sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <button
          onClick={onNewChat}
          className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 transition-all shadow-lg"
          title="Nuevo chat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="w-72 bg-gradient-to-b from-teal-700 via-emerald-700 to-emerald-800 text-white flex flex-col h-full shadow-2xl">
      {/* Header */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Conversaciones</h2>
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm"
            title="Colapsar sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        
        <button
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-3 px-4 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Conversación
        </button>
      </div>

      {/* Navigation */}
      <div className="p-5 border-b border-white/10">
        <div className="grid grid-cols-3 gap-2 bg-white/5 p-1.5 rounded-2xl mb-4 backdrop-blur-sm">
          <button
            onClick={() => setActiveSection('history')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'history'
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Recientes
          </button>
          <button
            onClick={() => setActiveSection('archived')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'archived'
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Archivadas
          </button>
          <button
            onClick={() => setActiveSection('docs')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'docs'
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Ayuda
          </button>
        </div>

        {/* Delete/Reactivate Mode Controls */}
        {(activeSection === 'history' || activeSection === 'archived') && (
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={toggleDeleteMode}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                isDeactivateMode
                  ? activeSection === 'archived' 
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isDeactivateMode 
                ? 'Cancelar' 
                : activeSection === 'archived' 
                  ? 'Restaurar' 
                  : 'Archivar'}
            </button>
            
            {isDeactivateMode && (
              <button
                onClick={activeSection === 'archived' ? reactivateSelectedConversations : deactivateSelectedConversations}
                disabled={selectedConversations.size === 0 || isDeactivating}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                  selectedConversations.size > 0 && !isDeactivating
                    ? activeSection === 'archived'
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-white/5 text-white/40 cursor-not-allowed'
                }`}
              >
                {isDeactivating 
                  ? activeSection === 'archived' ? 'Restaurando...' : 'Archivando...'
                  : activeSection === 'archived'
                    ? `Restaurar (${selectedConversations.size})`
                    : `Archivar (${selectedConversations.size})`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeSection === 'history' && (
          <div className="p-5">
            <h3 className="text-sm font-bold text-white/60 mb-4 uppercase tracking-wide">Historial</h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            ) : chatHistory.length > 0 ? (
              <div className="space-y-3">
                {chatHistory.map((chat) => (
                  <div
                    key={chat.conversationId}
                    className={`relative p-4 rounded-2xl bg-white/10 hover:bg-white/15 transition-all group backdrop-blur-sm shadow-lg hover:shadow-xl ${
                      isDeactivateMode ? 'pr-12' : ''
                    }`}
                  >
                    {/* Checkbox en modo eliminación */}
                    {isDeactivateMode && (
                      <div className="absolute right-3 top-3">
                        <input
                          type="checkbox"
                          checked={selectedConversations.has(chat.conversationId)}
                          onChange={(e) => handleCheckboxChange(chat.conversationId, e.target.checked)}
                          className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                        />
                      </div>
                    )}
                    
                    {/* Contenido del chat */}
                    <button
                      onClick={() => handleChatClick(chat.conversationId)}
                      className={`w-full text-left ${isDeactivateMode ? 'pr-6' : ''}`}
                      disabled={isDeactivateMode}
                    >
                      <div className="font-medium text-sm text-white mb-1 truncate">
                        {chat.title}
                      </div>
                      <div className="text-xs text-gray-400 mb-1 flex justify-between">
                        <span>{chat.timestamp}</span>
                        <span>{chat.messageCount} mensajes</span>
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {chat.preview}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No hay conversaciones aún</p>
                <p className="text-xs mt-1">Inicia un nuevo chat para comenzar</p>
              </div>
            )}
          </div>
        )}

        {activeSection === 'archived' && (
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Conversaciones Archivadas</h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            ) : archivedHistory.length > 0 ? (
              <div className="space-y-2">
                {archivedHistory.map((chat) => (
                  <div
                    key={chat.conversationId}
                    className={`relative p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors group opacity-75 ${
                      isDeactivateMode ? 'pr-12' : ''
                    }`}
                  >
                    {/* Checkbox en modo reactivación */}
                    {isDeactivateMode && (
                      <div className="absolute right-3 top-3">
                        <input
                          type="checkbox"
                          checked={selectedConversations.has(chat.conversationId)}
                          onChange={(e) => handleCheckboxChange(chat.conversationId, e.target.checked)}
                          className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                        />
                      </div>
                    )}
                    
                    {/* Contenido del chat */}
                    <button
                      onClick={() => handleChatClick(chat.conversationId)}
                      className={`w-full text-left ${isDeactivateMode ? 'pr-6' : ''}`}
                      disabled={isDeactivateMode}
                    >
                      <div className="font-medium text-sm text-white mb-1 truncate flex items-center">
                        <svg className="w-3 h-3 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        {chat.title}
                      </div>
                      <div className="text-xs text-gray-400 mb-1 flex justify-between">
                        <span>{chat.timestamp}</span>
                        <span>{chat.messageCount} mensajes</span>
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {chat.preview}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <p className="text-sm">No hay conversaciones archivadas</p>
                <p className="text-xs mt-1">Las conversaciones archivadas aparecerán aquí</p>
              </div>
            )}
          </div>
        )}

        {activeSection === 'docs' && (
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Documentación</h3>
            <div className="space-y-2">
              <a
                href="https://ai.google.dev/gemini-api/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <div className="font-medium text-sm text-white mb-1">
                  Gemini API Docs
                </div>
                <div className="text-xs text-gray-400">
                  Documentación oficial de la API
                </div>
              </a>
              
              <a
                href="https://ai.google.dev/gemini-api/docs/models/gemini"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <div className="font-medium text-sm text-white mb-1">
                  Modelos Disponibles
                </div>
                <div className="text-xs text-gray-400">
                  Información sobre modelos Gemini
                </div>
              </a>
              
              <a
                href="https://ai.google.dev/gemini-api/docs/prompting"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <div className="font-medium text-sm text-white mb-1">
                  Guía de Prompting
                </div>
                <div className="text-xs text-gray-400">
                  Mejores prácticas para prompts
                </div>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-5 border-t border-white/10">
        <div className="text-xs text-white/50 text-center font-medium">
          ⚡ Powered by AI Technology
        </div>
      </div>
    </div>
  );
};
