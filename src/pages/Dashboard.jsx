import React, { useEffect } from 'react';
import {
    Headphones,
    Calendar,
    BookOpen,
    MessageCircle,
    Users,
    ArrowRight,
    PlusCircle,
    PenSquare,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import useStore from '../store/store';
const upcomingSessions = [
    {
        id: '1',
        doctor: 'Dr. Sarah Miller',
        date: 'Tomorrow, 10:00 AM',
    },
    {
        id: '2',
        doctor: 'Dr. Michael Chen',
        date: 'May 15, 2:30 PM',
    },
];

const journalEntries = [
    {
        id: '1',
        title: 'Morning Reflection',
        date: '2 days ago',
        excerpt:
            "Today I woke up feeling more energetic than usual. The breathing exercises from yesterday's session really helped with my anxiety...",
    },
    {
        id: '2',
        title: 'Weekly Progress',
        date: '5 days ago',
        excerpt:
            "This week has been challenging but I'm proud of how I've been managing stress. The techniques Dr. Miller suggested are making a difference...",
    },
];
const Dashboard = () => {
  const { User } = useStore(); // Access User from Zustand
    const user = User.name; // Get the user's name
    return (
        <>
        <Navbar/>
        <div
            className="min-h-screen bg-white p-4 sm:p-6 lg:p-8"
            >
            <div className="max-w-4xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                    >
                    <h1
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500"
                        >
                        Welcome back, {user ? `${user}` : "Loading..."}!
                    </h1>
                    <p className="text-gray-500 text-sm sm:text-base">
                        Let's continue your mental wellness journey
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
                    >
                    <div
                        className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] rounded-lg p-4"
                        >
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-purple-500" />
                            <h2 className="text-gray-900 font-semibold">Free Plan</h2>
                        </div>
                        <p className="text-gray-500 text-sm">
                            Current subscription
                        </p>
                    </div>

                    <div
                        className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] rounded-lg p-4"
                        >
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-500" />
                            <h2 className="text-gray-900 font-semibold">2 Sessions</h2>
                        </div>
                        <p className="text-gray-500 text-sm">
                            Booked this month
                        </p>
                    </div>

                    <div
                        className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] rounded-lg p-4"
                        >
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-green-500" />
                            <h2 className="text-gray-900 font-semibold">7 Entries</h2>
                        </div>
                        <p className="text-gray-500 text-sm">
                            Journal activity
                        </p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="space-y-4"
                            >
                            <span
                                className="bg-gradient-to-r from-purple-100 to-blue-100 text-gray-900 border-0 shadow-sm shadow-purple-500/20 px-3 py-1 rounded-full text-sm"
                                >
                                Overview
                            </span>
                            <div className="space-y-2">
                                <button
                                    className="w-full text-gray-700 hover:bg-gray-100 hover:text-blue-600 text-left p-2 rounded-md"
                                    >
                                    Counselling
                                </button>
                                <button
                                    className="w-full text-gray-700 hover:bg-gray-100 hover:text-green-600 text-left p-2 rounded-md"
                                    >
                                    Journal
                                </button>
                                <button
                                    className="w-full text-gray-700 hover:bg-gray-100 hover:text-purple-600 text-left p-2 rounded-md"
                                >
                                    Manas Chatbot
                                </button>
                                <button
                                    className="w-full text-gray-700 hover:bg-gray-100 hover:text-yellow-600 text-left p-2 rounded-md"
                                >
                                    Community
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                            >
                            <div className="bg-gradient-to-br from-purple-100/90 to-white/90 text-gray-900 border border-gray-200 shadow-md rounded-lg p-4">
                                <h2 className="text-lg font-semibold">
                                    Upgrade to Premium
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    Get unlimited access to all features and premium content.
                                </p>
                                <button
                                    className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-md mt-4"
                                    >
                                    Upgrade Now
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    <div className="md:col-span-3 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            >
                            <div
                                className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-md rounded-lg p-4"
                                >
                                <div className="flex items-center gap-2 mb-4">
                                    <Calendar className="w-6 h-6 text-blue-500" />
                                    <h2 className="text-gray-900 text-xl font-semibold">
                                        Your Dashboard
                                    </h2>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Upcoming Sessions
                                </h3>
                                <div className="space-y-4">
                                    {upcomingSessions.map((session) => (
                                        <div
                                        key={session.id}
                                        className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-4">
                                                <Headphones className="w-5 h-5 text-purple-500" />
                                                <div>
                                                    <p className="text-gray-900 font-medium">
                                                        {session.doctor}
                                                    </p>
                                                    <p className="text-gray-500 text-sm">
                                                        {session.date}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                className={`text-white border ${
                                                    session.id === '1'
                                                        ? 'border-green-500 bg-green-500/90 text-white hover:bg-green-600'
                                                        : 'border-purple-500 bg-purple-500/90 text-white hover:bg-purple-600'
                                                    } px-4 py-1 rounded-md text-sm`}
                                                    >
                                                {session.id === '1' ? 'Join' : 'Reschedule'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    className="text-blue-500 border-blue-500/30 hover:bg-blue-50/50 w-full py-2 rounded-md mt-4 border"
                                    >
                                    Book a new session
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                            className="space-y-6"
                            >
                            <div
                                className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-md rounded-lg p-4"
                                >
                                <div className="flex items-center gap-2 mb-4">
                                    <BookOpen className="w-6 h-6 text-green-500" />
                                    <h2 className="text-gray-900 text-xl font-semibold">
                                        Journal Entries
                                    </h2>
                                </div>
                                <p className="text-gray-500 text-sm mb-4">
                                    Your latest journal entries
                                </p>
                                <div className="space-y-4">
                                    {journalEntries.map((entry) => (
                                        <div
                                        key={entry.id}
                                        className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {entry.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm">
                                                {entry.date}
                                            </p>
                                            <p className="text-gray-700 mt-2">
                                                {entry.excerpt}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className='flex justify-between items-center mt-4'>
                                    <button
                                        className="text-green-500 border-green-500/30 hover:bg-green-50/50 border px-4 py-1 rounded-md"
                                        >
                                        New Journal Entry
                                    </button>
                                    <button
                                        className="text-blue-500 hover:text-blue-700 px-0"
                                    >
                                        View All
                                    </button>
                                </div>
                            </div>

                            <div
                                className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-md rounded-lg p-4"
                                >
                                <h2 className="text-gray-900 text-xl font-semibold mb-4">
                                    Quick Actions
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        className="text-blue-500 border-blue-500/30 hover:bg-blue-50/50 flex items-center gap-2 py-2 rounded-md border"
                                        >
                                        <Calendar className="w-4 h-4" />
                                        Book a Session
                                    </button>
                                    <button
                                        className="text-green-500 border-green-500/30 hover:bg-green-50/50 flex items-center gap-2 py-2 rounded-md border"
                                        >
                                        <PenSquare className="w-4 h-4" />
                                        Write Journal
                                    </button>
                                    <button
                                        className="text-purple-500 border-purple-500/30 hover:bg-purple-50/50 flex items-center gap-2 py-2 rounded-md border"
                                        >
                                        <MessageCircle className="w-4 h-4" />
                                        Chat with Manas
                                    </button>
                                    <button
                                        className="text-yellow-500 border-yellow-500/30 hover:bg-yellow-50/50 flex items-center gap-2 py-2 rounded-md border"
                                        >
                                        <Users className="w-4 h-4" />
                                        Community Feed
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
                                        </>
    );
};

export default Dashboard;
