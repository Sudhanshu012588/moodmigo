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
        <div className="flex flex-col h-screen">
            <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 p-4 flex items-center gap-4 shadow-sm">
                <MessageCircle className="w-6 h-6 text-purple-500" />
                <h1 className="text-xl font-semibold text-gray-900">Manarah Chatbot</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                    {messages.map((message, index) => (
                        <React.Fragment key={index}>
                            {message.user && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex w-fit ml-auto max-w-[90%] sm:max-w-[70%] rounded-xl p-3 shadow-md bg-blue-100 text-blue-800"
                                >
                                    <p className="text-sm">{message.user}</p>
                                </motion.div>
                            )}
                            {message.model && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex w-fit max-w-[90%] sm:max-w-[70%] rounded-xl p-3 shadow-md bg-purple-100 text-purple-800"
                                >
                                    <p className="text-sm">{message.model}</p>
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
                        className="flex items-center gap-2 bg-purple-100 text-purple-800 rounded-xl p-3 max-w-[80%]"
                    >
                        <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                        <span className="text-sm">Typing...</span>
                    </motion.div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="bg-white/90 backdrop-blur-md border-t border-gray-200 p-4">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        className="flex-1 bg-gray-50 text-gray-900 border border-gray-300 rounded-md p-2 placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500"
                        ref={inputRef}
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSend}
                        className="bg-purple-500 hover:bg-purple-600 text-white rounded-md p-2 shadow-md"
                        disabled={isBotTyping}
                    >
                        <Send className="w-5 h-5" />
                    </motion.button>
                </div>
                <p className="text-gray-500 text-xs mt-1">
                    we are not storing any chat. Feel free to ask anything.
                </p>
            </div>
        </div>
                                    </>
    );
};

export default ManasChatbot;
