import React, { useState, useEffect, useRef } from 'react';
import { SendHorizonal } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useStore } from '../store/store';
import { getResponse } from '../gemini/Manas';
import db from '../appwrite/databases.js';
import { Query, Permission, Role } from 'appwrite';

const ManasChatbot = () => {
    const user = useStore((state) => state.User);
    const userID = user?.id;

    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    // Fetch previous messages when component mounts
    useEffect(() => {
        const fetchMessages = async () => {
            if (!userID) return;

            try {
                const res = await db.manas.list([
                    Query.equal('userID', userID),
                    Query.limit(1)
                ]);

                if (res.documents.length > 0) {
                    setMessages(res.documents[0].messages || []);
                } else {
                    console.log("No previous chat found for user.");
                }
            } catch (err) {
                console.error('Failed to load previous messages:', err);
            }
        };

        fetchMessages();
    }, [userID]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!prompt.trim() || !userID) return;

        const userMessage = { user: prompt, model: null };
        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setPrompt('');
        setLoading(true);

        try {
            const response = await getResponse(prompt);
            const modelMessage = { ...userMessage, model: response?.response || 'Something went wrong.' };

            const finalMessages = [...updatedMessages.slice(0, -1), modelMessage];
            setMessages(finalMessages);

            // Save message to DB: check if doc exists, else create
            const res = await db.manas.list([
                Query.equal('userID', userID),
                Query.limit(1)
            ]);

            if (res.documents.length > 0) {
                const docID = res.documents[0].$id;
                await db.manas.update(docID, {
                    messages: finalMessages
                });
            } else {
                await db.manas.create({
                    userID,
                    messages: finalMessages
                }, [
                    Permission.read(Role.user(userID)),
                    Permission.update(Role.user(userID))
                ]);
            }
        } catch (err) {
            console.error('Failed to send message:', err);
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
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                        onClick={sendMessage}
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
