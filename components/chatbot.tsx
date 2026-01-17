'use client';

import { useState, useEffect, useRef } from 'react';
import { useChatbot } from '@/hooks/useChatbot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
// WelcomeScreen removed from main chat flow — conversation starts automatically
import { Send } from 'lucide-react';

/**
 * Nettoie le markdown des réponses du bot
 * Supprime les ** pour le gras, ## pour les titres, etc.
 */
function cleanMarkdown(text: string): string {
  if (!text) return text;
  
  return text
    // Supprimer les ** pour le gras (groupe de capture pour garder le contenu)
    .replace(/\*\*(.+?)\*\*/g, '$1')
    // Supprimer les * pour l'italique (mais pas les listes à puces qui commencent par * suivi d'un espace)
    .replace(/(?<!^|\n)\*([^*\n]+?)\*(?!\*)/g, '$1')
    // Supprimer les # pour les titres au début de ligne
    .replace(/^#{1,6}\s+/gm, '')
    // Supprimer les ` pour le code inline
    .replace(/`([^`]+?)`/g, '$1')
    // Supprimer les underscores pour le gras/italique
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    // Nettoyer les espaces multiples et les sauts de ligne excessifs
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

export function Chatbot() {
  const { isStarted, chatState, demarrerChat, traiterReponseUtilisateur, envoyerMessage, reinitialiserChat, stopBotResponse } = useChatbot();
  const [messageInput, setMessageInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      envoyerMessage(messageInput);
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatState.messages, chatState.isLoading]);

  // Démarrer automatiquement la conversation au montage si nécessaire
  useEffect(() => {
    if (!isStarted) {
      demarrerChat();
    }
  }, [isStarted, demarrerChat]);

  // Le chat s'affiche dès le rendu; le message de bienvenue est récupéré automatiquement.

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          🎓 Assistant d'Orientation IUC
        </h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={reinitialiserChat}
          className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
        >
          Recommencer
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="space-y-4 py-4 max-w-4xl mx-auto">
            {chatState.messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Message du bot ou de l'utilisateur */}
                <div
                  className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white ml-12 rounded-br-md'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white mr-12 rounded-bl-md border'
                  }`}
                >
                  <div className="whitespace-pre-line text-sm leading-relaxed">
                    {message.type === 'bot' ? cleanMarkdown(message.contenu) : message.contenu}
                  </div>
                </div>
                
                {/* Suggestions en dessous du message du bot uniquement */}
                {message.type === 'bot' && message.options && message.options.length > 0 && (
                  <div className="mt-3 ml-12 max-w-[85%] w-full space-y-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                      Suggestions :
                    </p>
                    {message.options.map((option, optionIndex) => (
                      <Button
                        key={optionIndex}
                        variant="outline"
                        size="sm"
                        onClick={() => traiterReponseUtilisateur(option)}
                        className="w-full justify-start text-sm whitespace-normal break-words text-left hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:border-blue-700 dark:hover:text-blue-300 transition-colors shadow-sm"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {chatState.isLoading && (
              <div className="flex justify-start animate-in slide-in-from-bottom-2">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-bl-md border shadow-sm mr-12">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Assistant réfléchit...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t">
          <div className="max-w-4xl mx-auto flex gap-3">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Écrivez votre question ou suggestion..."
              disabled={chatState.isLoading}
              className="flex-1 rounded-full border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
            />
            {/* Stop button shown when bot is typing */}
            {chatState.isTyping ? (
              <Button onClick={stopBotResponse} className="rounded-full bg-red-600 hover:bg-red-700 px-4">
                Stop
              </Button>
            ) : (
              <Button 
                onClick={handleSendMessage} 
                disabled={chatState.isLoading || !messageInput.trim()}
                className="rounded-full bg-blue-600 hover:bg-blue-700 px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}