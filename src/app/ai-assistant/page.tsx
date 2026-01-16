'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export default function AIAssistantPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      text: 'Hello! How can I assist you?',
      timestamp: new Date(),
    },
  ]);
  const [inputMode, setInputMode] = useState<'idle' | 'keyboard' | 'voice'>('idle');
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponses: Record<string, string> = {
        'inquiry raise karo': 'Theek hai. Inquiry bana rahe hain. Kaunse vehicle ke liye?',
        'hello': 'Hello! How can I help you today?',
        'hi': 'Hi there! What would you like to do?',
      };

      const lowerText = text.toLowerCase().trim();
      const response = aiResponses[lowerText] || 'I understand. How else can I help you?';

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Gemini-like Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top gradient fade */}
        <div className="absolute top-0 left-0 right-0 h-[150px] bg-gradient-to-b from-white via-white to-transparent z-20" />
        
        {/* Main gradient container */}
        <div className="absolute top-[80px] left-0 right-0 bottom-[80px] overflow-hidden rounded-[40px]">
          {/* Base gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#ffeaec] via-[#f8b4b8] to-[#e5383b]" />
          
          {/* Animated orbs with Gemini-like effects */}
          <div 
            className="gemini-orb orb-1"
            style={{
              position: 'absolute',
              width: '150%',
              height: '150%',
              top: '-25%',
              left: '-25%',
              background: 'radial-gradient(ellipse at center, rgba(255,100,100,0.6) 0%, rgba(255,150,150,0.3) 30%, transparent 70%)',
              mixBlendMode: 'soft-light',
              filter: 'blur(40px)',
              transform: 'rotate(-15deg)',
              transformOrigin: 'center center',
            }}
          />
          
          <div 
            className="gemini-orb orb-2"
            style={{
              position: 'absolute',
              width: '120%',
              height: '120%',
              top: '20%',
              left: '-10%',
              background: 'radial-gradient(ellipse at center, rgba(244,67,54,0.5) 0%, rgba(255,200,200,0.2) 40%, transparent 70%)',
              mixBlendMode: 'soft-light',
              filter: 'blur(30px)',
              transform: 'rotate(15deg)',
              transformOrigin: 'center center',
            }}
          />
          
          <div 
            className="gemini-orb orb-3"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: '40%',
              left: '10%',
              background: 'radial-gradient(ellipse at center, rgba(255,180,180,0.7) 0%, rgba(229,56,59,0.3) 30%, transparent 60%)',
              mixBlendMode: 'soft-light',
              filter: 'blur(25px)',
              transform: 'rotate(-10deg)',
              transformOrigin: 'center center',
            }}
          />
          
          {/* Glowing ring effect */}
          <div 
            className="gemini-ring"
            style={{
              position: 'absolute',
              width: '80%',
              height: '80%',
              top: '30%',
              left: '10%',
              borderRadius: '50%',
              outline: '20px rgba(244,67,54,0.3) solid',
              outlineOffset: '-10px',
              filter: 'blur(20px)',
              mixBlendMode: 'soft-light',
            }}
          />
          
          {/* Floating particles */}
          <div className="particles">
            <div className="particle particle-1" />
            <div className="particle particle-2" />
            <div className="particle particle-3" />
            <div className="particle particle-4" />
          </div>
        </div>
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-gradient-to-t from-white via-white to-transparent z-20" />
      </div>

      {/* Content */}
      <div className="relative z-20 flex-1 flex flex-col">
        {/* Messages Area - positioned in the gradient zone */}
        <div className="flex-1 px-4 pt-[180px] pb-32 overflow-y-auto">
          <div className="max-w-[500px] mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.type === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                {message.type === 'ai' ? (
                  <div className="w-[44px] h-[44px] rounded-full bg-white flex items-center justify-center shadow-lg shrink-0 border-2 border-white/50">
                    <div className="text-[#e5383b] text-[10px] font-bold leading-none text-center">
                      <div>ETNA</div>
                      <div className="text-[6px] font-normal">SPARES</div>
                    </div>
                  </div>
                ) : (
                  <div className="w-[44px] h-[44px] rounded-full bg-white overflow-hidden shrink-0 shadow-lg border-2 border-white/50">
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <svg width="22" height="22" viewBox="0 0 20 20" fill="#666">
                        <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z"/>
                      </svg>
                    </div>
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className={`max-w-[75%] ${
                    message.type === 'user'
                      ? 'text-right'
                      : 'text-left'
                  }`}
                >
                  <p 
                    className="text-white text-[20px] font-semibold leading-relaxed"
                    style={{ 
                      textShadow: '0 2px 8px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)' 
                    }}
                  >
                    {message.text}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Keyboard Input (when active) */}
        {inputMode === 'keyboard' && (
          <div className="fixed bottom-[100px] left-0 right-0 px-4 z-30">
            <div className="max-w-[500px] mx-auto">
              <div className="bg-white rounded-full shadow-lg flex items-center p-2 border border-gray-200">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage(inputText);
                      setInputMode('idle');
                    }
                  }}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 outline-none text-[16px]"
                  autoFocus
                />
                <button
                  onClick={() => {
                    handleSendMessage(inputText);
                    setInputMode('idle');
                  }}
                  className="w-[40px] h-[40px] bg-[#e5383b] rounded-full flex items-center justify-center"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Input Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white px-4 pb-6 pt-4 z-20">
          <div className="max-w-[500px] mx-auto flex items-center justify-between">
            {/* Keyboard Button */}
            <button
              onClick={() => setInputMode(inputMode === 'keyboard' ? 'idle' : 'keyboard')}
              className={`w-[56px] h-[56px] rounded-[12px] flex items-center justify-center transition-all
                ${inputMode === 'keyboard' 
                  ? 'bg-[#e5383b] text-white' 
                  : 'bg-[#fce4e6] text-[#e5383b]'}`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 5H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/>
              </svg>
            </button>

            {/* Microphone Button (Center) */}
            <button
              onClick={handleVoiceInput}
              className={`w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all
                border-4 ${isListening 
                  ? 'border-[#e5383b] bg-[#e5383b] text-white animate-pulse' 
                  : 'border-[#fce4e6] bg-white text-[#e5383b]'}`}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1 1.93c-3.94-.49-7-3.85-7-7.93h2c0 3.31 2.69 6 6 6s6-2.69 6-6h2c0 4.08-3.06 7.44-7 7.93V20h4v2H8v-2h4v-4.07z"/>
              </svg>
            </button>

            {/* Scan/Search Button */}
            <button
              className="w-[56px] h-[56px] rounded-[12px] bg-[#fce4e6] flex items-center justify-center text-[#e5383b]"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <path d="M14 14h7v3.5a3.5 3.5 0 01-3.5 3.5H14v-7z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* CSS for Gemini-like animations */}
      <style jsx>{`
        /* Gemini Orb Animations */
        .orb-1 {
          animation: orbFloat1 15s ease-in-out infinite;
        }
        
        .orb-2 {
          animation: orbFloat2 12s ease-in-out infinite;
        }
        
        .orb-3 {
          animation: orbFloat3 18s ease-in-out infinite;
        }
        
        .gemini-ring {
          animation: ringPulse 8s ease-in-out infinite;
        }
        
        /* Floating Particles */
        .particles {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        
        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          filter: blur(2px);
        }
        
        .particle-1 {
          width: 8px;
          height: 8px;
          top: 20%;
          left: 30%;
          animation: particleFloat 10s ease-in-out infinite;
        }
        
        .particle-2 {
          width: 6px;
          height: 6px;
          top: 50%;
          left: 70%;
          animation: particleFloat 12s ease-in-out infinite 2s;
        }
        
        .particle-3 {
          width: 10px;
          height: 10px;
          top: 70%;
          left: 20%;
          animation: particleFloat 14s ease-in-out infinite 4s;
        }
        
        .particle-4 {
          width: 5px;
          height: 5px;
          top: 40%;
          left: 80%;
          animation: particleFloat 11s ease-in-out infinite 1s;
        }
        
        /* Keyframe Animations */
        @keyframes orbFloat1 {
          0%, 100% {
            transform: rotate(-15deg) translate(0, 0) scale(1);
            opacity: 0.7;
          }
          25% {
            transform: rotate(-10deg) translate(30px, -40px) scale(1.1);
            opacity: 0.9;
          }
          50% {
            transform: rotate(-20deg) translate(-20px, 30px) scale(0.95);
            opacity: 0.6;
          }
          75% {
            transform: rotate(-12deg) translate(15px, 20px) scale(1.05);
            opacity: 0.8;
          }
        }
        
        @keyframes orbFloat2 {
          0%, 100% {
            transform: rotate(15deg) translate(0, 0) scale(1);
            opacity: 0.6;
          }
          33% {
            transform: rotate(20deg) translate(-40px, 30px) scale(1.15);
            opacity: 0.8;
          }
          66% {
            transform: rotate(10deg) translate(30px, -25px) scale(0.9);
            opacity: 0.5;
          }
        }
        
        @keyframes orbFloat3 {
          0%, 100% {
            transform: rotate(-10deg) translate(0, 0) scale(1);
            opacity: 0.5;
          }
          20% {
            transform: rotate(-5deg) translate(25px, 35px) scale(1.1);
            opacity: 0.7;
          }
          40% {
            transform: rotate(-15deg) translate(-35px, -20px) scale(0.95);
            opacity: 0.6;
          }
          60% {
            transform: rotate(-8deg) translate(20px, -35px) scale(1.08);
            opacity: 0.8;
          }
          80% {
            transform: rotate(-12deg) translate(-20px, 25px) scale(1);
            opacity: 0.6;
          }
        }
        
        @keyframes ringPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.5;
          }
        }
        
        @keyframes particleFloat {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.4;
          }
          25% {
            transform: translate(20px, -30px);
            opacity: 0.8;
          }
          50% {
            transform: translate(-15px, -50px);
            opacity: 0.3;
          }
          75% {
            transform: translate(25px, -20px);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}
