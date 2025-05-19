import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { getResponse } from '../gemini/Manas';
import { toast } from 'react-toastify';

const ManasChatbot = () => {
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const chatEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!prompt.trim()) return;

        const userMessage = { user: prompt, model: null };
        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setPrompt('');
        setLoading(true);
        setIsBotTyping(true);

        try {
            const result = await getResponse(prompt);
            const modelResponse = result?.response || "Sorry, I couldn’t respond.";

            const finalMessages = [
                ...updatedMessages.slice(0, -1),
                { ...userMessage, model: modelResponse }
            ];
            setMessages(finalMessages);
        } catch (error) {
            toast.error("Error fetching response. Please try again later.");
        } finally {
            setLoading(false);
            setIsBotTyping(false);
        }
    };

    return (
        <>
  <Navbar />
  <div className="flex flex-col h-screen bg-gradient-to-b from-purple-50 to-white">
    {/* Header */}
    <div className="bg-white/95 backdrop-blur-md border-b border-gray-300 p-5 flex items-center gap-4 shadow-md sticky top-0 z-10">
      <MessageCircle className="w-7 h-7 text-purple-600" />
      <h1 className="text-2xl font-bold text-gray-900 select-none">
        Manarah Chatbot
      </h1>
    </div>

    {/* Chat Messages */}
    <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-50">
      <AnimatePresence>
        {messages.map((message, index) => (
          <React.Fragment key={index}>
            {message.user && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex w-fit ml-auto max-w-[90%] sm:max-w-[70%] rounded-2xl p-4 shadow-lg bg-blue-200 text-blue-900 text-lg leading-relaxed break-words"
              >
                <p>{message.user}</p>
              </motion.div>
            )}
            {message.model && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex w-fit max-w-[90%] sm:max-w-[70%] rounded-2xl p-4 shadow-lg bg-purple-200 text-purple-900 text-lg leading-relaxed break-words"
              >
                <p>{message.model}</p>
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </AnimatePresence>

      {isBotTyping && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-3 bg-purple-200 text-purple-900 rounded-2xl p-3 max-w-[80%] shadow-lg"
        >
          <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
          <span className="text-base font-medium">Typing...</span>
        </motion.div>
      )}
      <div ref={chatEndRef} />
    </div>

    {/* Input Area */}
    <div className="bg-white/95 backdrop-blur-md border-t border-gray-300 p-6 sticky bottom-0 z-10 shadow-inner">
      <div className="flex items-center gap-3 max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Type your message..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 bg-gray-100 text-gray-900 border border-gray-300 rounded-2xl px-5 py-3 placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
          ref={inputRef}
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition"
          disabled={isBotTyping}
          aria-label="Send message"
        >
          <Send className="w-6 h-6" />
        </motion.button>
      </div>
      <p className="text-gray-500 text-sm mt-2 text-center select-none">
        We are&nbsp;<strong>not</strong>&nbsp;storing any chat. Feel free to ask
        anything.
      </p>
    </div>
  </div>
</>

    );
};

export default ManasChatbot;
