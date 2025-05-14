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
        <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
            <Navbar />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx}>
                        <div className="flex justify-end mb-2">
                            <div className="bg-blue-600 text-white px-4 py-2 rounded-xl max-w-xs shadow">
                                {msg.user}
                            </div>
                        </div>
                        {msg.model && (
                            <div className="flex justify-start mb-2">
                                <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-xl max-w-xs shadow">
                                    {msg.model}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded-xl max-w-xs animate-pulse">
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={chatEndRef}></div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-gray-900 p-4 border-t border-gray-300 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        className="flex-1 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                        onClick={handleSend}
                        className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow transition"
                    >
                        <SendHorizonal className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManasChatbot;
