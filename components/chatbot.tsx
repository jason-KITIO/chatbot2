'use client';

import { useState, useEffect, useRef } from 'react';
import { useChatbot } from '@/hooks/useChatbot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WelcomeScreen } from '@/components/welcome-screen';
import { Send } from 'lucide-react';

export function Chatbot() {
  const { isStarted, chatState, demarrerChat, traiterReponseUtilisateur, envoyerMessage, reinitialiserChat } = useChatbot();
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

  if (!isStarted) {
    return <WelcomeScreen onStart={demarrerChat} />;
  }

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
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white ml-12 rounded-br-md'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white mr-12 rounded-bl-md border'
                  }`}
                >
                  <div className="whitespace-pre-line text-sm leading-relaxed">{message.contenu}</div>
                  
                  {message.options && (
                    <div className="mt-4 space-y-2">
                      {message.options.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => traiterReponseUtilisateur(option)}
                          className="w-full justify-start text-sm hover:bg-blue-50 hover:border-blue-200 transition-colors"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
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
            <Button 
              onClick={handleSendMessage} 
              disabled={chatState.isLoading || !messageInput.trim()}
              className="rounded-full bg-blue-600 hover:bg-blue-700 px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}