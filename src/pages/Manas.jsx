import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Loader2,Video  } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// Assuming these are external components/functions you want to keep
import Navbar from '../components/Navbar';
import { getResponse } from '../gemini/Manas';
import { toast } from 'react-toastify';
import { useStore } from '../store/store.jsx';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import {persona} from "../gemini/Userpersona.js"
import {VideoSol} from "../gemini/Userpersona.js"
// Custom CSS to hide the scrollbar for a cleaner look
const scrollbarHideCss = `
  /* Hide scrollbar for Chrome, Safari and Opera */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  .scrollbar-hide {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
`;

const ManasChatbot = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const User = useStore((state) => state.User);

  const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

  const encrypt = (text) => CryptoJS.AES.encrypt(text, SECRET_KEY).toString();

  const decrypt = (cipherText) => {
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
      return '[Decryption Failed]';
    }
  };

  const fetchMessages = async () => {
    if (!User?.id) return;

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/manarah/get`, {
        userid: User.id,
      });

      const messageObject = res.data?.message;

      if (messageObject && Array.isArray(messageObject.messages)) {
        const decryptedMessages = messageObject.messages.map((m) => ({
          user: decrypt(m.message),
          model: decrypt(m.reply),
        }));
        setMessages(decryptedMessages);
      } else {
        toast.error('Malformed response from server.');
        console.warn('Unexpected response structure:', res.data);
      }
    } catch (err) {
      toast.error('Failed to fetch chats.');
      console.error(err);
    }
  };

  const createPersona = async () => {
  try {
    const conversation = messages
      .map(m => `User: ${m.user}\nManarah: ${m.model}`)
      .join("\n");

    const personaText = await persona(conversation);
    console.log(personaText)
    await VideoSol(personaText)
  } catch (err) {
    console.error("Persona generation failed:", err);
  }
};


  const saveEncryptedMessage = async (msg, reply) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/manarah/savechat`, {
        userID: User.id,
        message: encrypt(msg),
        reply: encrypt(reply),
      });
    } catch (err) {
      toast.error("Couldn't save your message.");
      console.error(err);
    }
  };

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMsg = { user: prompt, model: null };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setPrompt('');
    setLoading(true);
    setIsBotTyping(true);

    try {
      const result = await getResponse(prompt);
      const reply = result?.response || 'Sorry, no response.';

      const fullMessage = { user: prompt, model: reply };
      setMessages((prev) => [...prev.slice(0, -1), fullMessage]);
      await saveEncryptedMessage(prompt, reply);
    } catch (err) {
      toast.error('Error getting response.');
      console.error(err);
    } finally {
      setLoading(false);
      setIsBotTyping(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [User?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <style>{scrollbarHideCss}</style>
      <Navbar />
      <div className="flex flex-col h-screen bg-gray-50 font-sans antialiased">
        {/* Chatbot Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
          <MessageCircle className="w-7 h-7 text-blue-500" />
          <h1 className="text-2xl font-semibold text-gray-900 select-none">Manarah Chatbot</h1>
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <React.Fragment key={i}>
                {/* User Message Bubble */}
                {msg.user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex w-fit ml-auto max-w-[90%] sm:max-w-[70%] rounded-t-3xl rounded-bl-3xl p-4 shadow-md bg-purple-500 text-white text-lg leading-relaxed break-words"
                  >
                    <p>{msg.user}</p>
                  </motion.div>
                )}
                {/* Bot Message Bubble */}
                {msg.model && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex w-fit max-w-[90%] sm:max-w-[70%] rounded-t-3xl rounded-br-3xl p-4 shadow-md bg-gray-200 text-gray-800 text-lg leading-relaxed break-words"
                  >
                    <p>{msg.model}</p>
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isBotTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 bg-gray-200 text-gray-800 rounded-2xl p-3 max-w-[80%] shadow-md"
            >
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="text-base font-medium">Typing...</span>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4 sticky bottom-0 z-10 shadow-inner">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <input
              type="text"
              placeholder="End-to-end encryption for every message."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              ref={inputRef}
              className="flex-1 bg-gray-100 text-gray-900 border border-gray-300 rounded-full px-5 py-3 placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              disabled={isBotTyping || loading}
              aria-label="Send"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-6 h-6" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={createPersona}
              disabled={isBotTyping || loading}
              aria-label="Send"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Video className='w-6 h-6 '/>
            </motion.button>
              
          </div>
        </div>
      </div>
    </>
  );
};

export default ManasChatbot;
