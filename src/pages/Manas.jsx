import React, { useState, useEffect, useRef } from 'react';
import { SendHorizonal } from 'lucide-react';
import Navbar from '../components/Navbar';
import { getResponse } from '../gemini/Manas';

const ManasChatbot = () => {
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    // Scroll to bottom on new message
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

        try {
            const result = await getResponse(prompt);
            const modelResponse = result?.response || "Sorry, I couldn’t respond.";

            const finalMessages = [
                ...updatedMessages.slice(0, -1),
                { ...userMessage, model: modelResponse }
            ];
            setMessages(finalMessages);
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Chat Header */}
            <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 p-4 flex items-center gap-4 shadow-sm">
                <MessageCircle className="w-6 h-6 text-purple-500" />
                <h1 className="text-xl font-semibold text-gray-900">Manas Chatbot</h1>
            </div>

            {/* Message Display Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className={`flex w-fit max-w-[90%] sm:max-w-[70%] rounded-xl p-3 shadow-md ${message.sender === 'user'
                                ? 'bg-blue-100 text-blue-800 ml-auto'
                                : 'bg-purple-100 text-purple-800'}`}
                        >
                            <p className="text-sm">{message.text}</p>
                        </motion.div>
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
                <div ref={messagesEndRef} /> {/* Ref for scrolling to bottom */}
            </div>

            {/* Input Area */}
            <div className="bg-white/90 backdrop-blur-md border-t border-gray-200 p-4">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        className="flex-1 bg-gray-50 text-gray-900 border border-gray-300 rounded-md p-2 placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500"
                        ref={inputRef}
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        className="bg-purple-500 hover:bg-purple-600 text-white rounded-md p-2 shadow-md"
                        disabled={isBotTyping}
                    >
                        <Send className="w-5 h-5" />
                    </motion.button>
                </div>
                <p className="text-gray-500 text-xs mt-1">
                    Press Enter to send, Shift+Enter for a new line.
                </p>
            </div>
        </div>
    );
};

export default ManasChatbot;
