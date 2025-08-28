import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem('chat-widget-open');
    return saved ? JSON.parse(saved) : false;
  });
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chat-messages');
    if (saved) {
      const parsedMessages = JSON.parse(saved);
      return parsedMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    }
    return [
      {
        role: 'assistant',
        content: 'Hi! I\'m here to help you with your car rental needs. How can I assist you today?',
        timestamp: new Date()
      }
    ];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Persist messages to localStorage
  useEffect(() => {
    localStorage.setItem('chat-messages', JSON.stringify(messages));
  }, [messages]);

  // Persist open state to localStorage
  useEffect(() => {
    localStorage.setItem('chat-widget-open', JSON.stringify(isOpen));
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare conversation history for the API (excluding current user message)
      const conversation = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      console.log('🚀 About to send chat request:', { 
        message: messageToSend, 
        conversationLength: conversation.length,
        conversation: conversation.slice(-10) // Log last 10 messages for debugging
      });
      console.log('🔧 Supabase client ready:', !!supabase);

      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          message: messageToSend,
          conversation
        }
      });

      console.log('📨 Chat response received:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data || !data.reply) {
        console.error('Invalid response data:', data);
        throw new Error('Invalid response from chat service');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Chat Error",
        description: "Sorry, I'm having trouble responding. Please try again.",
        variant: "destructive",
      });
      
      // Add error message to chat
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I\'m experiencing technical difficulties. Please try again in a moment.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      ) : (
        <div className="bg-background border border-border rounded-lg shadow-xl w-96 h-[500px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground rounded-t-lg">
            <h3 className="font-semibold">Chat Support</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <div className="text-sm prose prose-sm max-w-none">
                      {message.role === 'user' ? (
                        <p>{message.content}</p>
                      ) : (
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="text-sm">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                            h1: ({ children }) => <h1 className="text-base font-bold mb-2">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-sm font-bold mb-1">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
                            a: ({ href, children }) => {
                              if (href?.startsWith('/')) {
                                return (
                                  <Link 
                                    to={href} 
                                    className="text-primary hover:text-primary/80 underline font-medium"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    {children}
                                  </Link>
                                );
                              }
                              return (
                                <a 
                                  href={href} 
                                  className="text-primary hover:text-primary/80 underline font-medium"
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  {children}
                                </a>
                              );
                            },
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      )}
                    </div>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-muted-foreground rounded-lg p-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Typing...</span>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;