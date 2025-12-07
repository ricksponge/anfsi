import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, X, Cpu, ShieldCheck } from 'lucide-react';
import { Message, SystemStatus } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
  setStatus: (status: SystemStatus) => void;
}

// Fix for framer-motion type mismatch issues
const MotionDiv = motion.div as any;

const Terminal: React.FC<TerminalProps> = ({ isOpen, onClose, setStatus }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      text: 'SECURE CONNECTION ESTABLISHED. ANFSI TACTICAL AI ONLINE.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setStatus(SystemStatus.ANALYZING);

    try {
      const responseText = await sendMessageToGemini(messages, input);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setStatus(SystemStatus.SECURE);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  if (!isOpen) return null;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      className="absolute bottom-10 right-4 md:right-10 w-[95vw] md:w-[500px] h-[600px] glass-panel rounded-lg flex flex-col overflow-hidden z-50 font-sans"
    >
      {/* Header */}
      <div className="bg-cyber-blue/90 p-3 border-b border-cyber-primary/30 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-cyber-cyan animate-pulse" />
          <span className="font-display text-cyber-cyan tracking-wider">TACTICAL ASSISTANT</span>
        </div>
        <button onClick={onClose} className="hover:text-cyber-cyan transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] p-3 rounded-sm border-l-2 text-sm md:text-base ${
                msg.role === 'user' 
                  ? 'border-cyber-primary bg-cyber-primary/10 text-white' 
                  : msg.role === 'system'
                  ? 'border-yellow-500 bg-yellow-500/10 text-yellow-200 font-mono text-xs'
                  : 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan'
              }`}
            >
              {msg.role !== 'user' && msg.role !== 'system' && (
                <div className="flex items-center space-x-1 mb-1 opacity-70 text-xs uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" />
                  <span>ANFSI Core</span>
                </div>
              )}
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="flex space-x-1 items-center p-3 text-cyber-cyan text-xs font-mono">
                    <span className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    <span className="ml-2">DECRYPTING RESPONSE...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-cyber-primary/30 bg-cyber-blue/50 flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ENTER COMMAND OR QUERY..."
          className="flex-1 bg-transparent border border-cyber-primary/30 text-white px-3 py-2 focus:outline-none focus:border-cyber-cyan font-mono text-sm placeholder-white/30"
          autoFocus
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="bg-cyber-primary/20 hover:bg-cyber-primary/40 text-cyber-cyan border border-cyber-primary/50 px-4 py-2 transition-all disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </MotionDiv>
  );
};

export default Terminal;