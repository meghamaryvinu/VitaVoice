import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Mic, Send, Volume2 } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';

export const Chat = () => {
  const navigate = useNavigate();
  const { chatHistory, addChatMessage } = useApp();
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    // Add welcome message if chat is empty
    if (chatHistory.length === 0) {
      addChatMessage({
        sender: 'assistant',
        text: 'Hello! I\'m VitaVoice, your healthcare assistant. How can I help you today?',
        hasVoice: true
      });
    }
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;

    addChatMessage({
      sender: 'user',
      text: input,
      hasVoice: false
    });

    setInput('');

    // Simulate AI response
    setTimeout(() => {
      addChatMessage({
        sender: 'assistant',
        text: 'I understand you\'re experiencing some symptoms. Could you please describe them in more detail?',
        hasVoice: true
      });
    }, 1000);
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInput('I have been having a headache for 2 days');
      }, 2000);
    }
  };

  return (
    <div className="h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/home')}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </motion.button>
        <div>
          <h1 className="font-semibold text-lg text-[#1E293B]">VitaVoice Assistant</h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#059669]" />
            <span className="text-sm text-gray-600">Online</span>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="ml-auto w-10 h-10 rounded-full bg-[#2563EB]/10 flex items-center justify-center"
        >
          <Volume2 className="w-5 h-5 text-[#2563EB]" />
        </motion.button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {chatHistory.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : ''}`}>
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-[#2563EB] text-white rounded-tr-sm'
                    : 'bg-white text-[#1E293B] rounded-tl-sm shadow-sm border border-gray-100'
                }`}
              >
                <p className="text-base leading-relaxed">{message.text}</p>
              </div>
              {message.hasVoice && message.sender === 'assistant' && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="mt-2 flex items-center gap-2 text-xs text-[#2563EB]"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen</span>
                </motion.button>
              )}
              <span className="text-xs text-gray-500 mt-1 block">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Waveform when recording */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 60 }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 py-3 bg-white border-t border-gray-200 flex items-center justify-center gap-1"
        >
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: [12, 32, 12] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
              className="w-1 bg-[#2563EB] rounded-full"
            />
          ))}
        </motion.div>
      )}

      {/* Input */}
      <div className="bg-white px-4 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 bg-transparent outline-none text-base text-[#1E293B] placeholder:text-gray-500"
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleVoiceToggle}
            className={`w-14 h-14 rounded-full flex items-center justify-center ${
              isListening ? 'bg-[#DC2626]' : 'bg-[#2563EB]'
            } shadow-lg`}
          >
            <Mic className="w-6 h-6 text-white" />
          </motion.button>
          {input && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              className="w-14 h-14 rounded-full bg-[#059669] flex items-center justify-center shadow-lg"
            >
              <Send className="w-6 h-6 text-white" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};
