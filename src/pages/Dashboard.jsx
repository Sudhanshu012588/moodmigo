import React, { useEffect, useState } from 'react';
import {
  Headphones, Calendar, BookOpen, MessageCircle,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useStore } from '../store/store';
import { account } from '../appwrite/config';
import MoodMigoLoading from '../components/Loading';
import db from '../appwrite/databases';
import CircularProgress from '../components/ProgressTracker';
import { Query } from 'appwrite';

const upcomingSessions = [
  { id: '1', doctor: 'Dr. Sarah Miller', date: 'Tomorrow, 10:00 AM' },
  { id: '2', doctor: 'Dr. Michael Chen', date: 'May 15, 2:30 PM' },
];

const journalEntries = [
  { id: '1', title: 'Morning Reflection', date: '2 days ago', excerpt: "Today I woke up feeling more energetic..." },
  { id: '2', title: 'Weekly Progress', date: '5 days ago', excerpt: "This week has been challenging..." },
];

const Dashboard = () => {
  const navigate = useNavigate();

  // Zustand states and setters
  const user = useStore(state => state.User);
  const setUser = useStore(state => state.setUser);
  const score = useStore(state => state.score);
  const setScore = useStore(state => state.setScore);
const [updateDate, setUpdateDate] = useState(null);
  // Local UI states
  const [isLoading, setIsLoading] = useState(true);
  const [numberOfBlogs, setNumberOfBlogs] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user info
        const tempUser = await account.get();
        setUser({
          id: tempUser.$id,
          name: tempUser.name,
          email: tempUser.email,
          password: '',
          isLoggedIn: true,
        });

        // Fetch latest questionnaire score for the user
        const scoreResponse = await db.UsersAttributes.list([
          Query.equal('UserId', tempUser.$id),
        ]);
        setScore(scoreResponse.documents[0].Score);
        
        // Fetch total number of blogs
        const blogResponse = await db.blog.list([]);

        setNumberOfBlogs(blogResponse.total ?? 0);
        const storedDate = localStorage.getItem("lastAssessmentDate");
      setUpdateDate(storedDate);
      } catch (error) {
        console.error("User fetch failed:", error);
        setUser(null);
        setScore(null);
        // Optionally redirect to login page if unauthorized
        // navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setUser, setScore, navigate]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
           <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-indigo-700 tracking-tight">
                Welcome back, <span className="font-extrabold text-indigo-900">{user.name}</span>!
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">Your personalized mental wellness hub.</p>
            </div>
            <p className="text-gray-600 text-sm sm:text-base mt-2">Let's continue your mental wellness journey</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <button
              onClick={() => navigate('/chat')}
              className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-xl p-6 flex flex-col justify-between"
              aria-label="Go to MANARAH chat"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-purple-500" />
                  <h2 className="text-gray-900 font-semibold text-lg">MANARAH</h2>
                </div>
                <p className="text-gray-500 text-sm">Your mental health companion.</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/questionnaire')}
              className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-xl p-6 flex flex-col justify-between"
              aria-label="Fill the questionnaire"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-blue-500" />
                  <h2 className="text-gray-900 font-semibold text-lg">Fill The questionnaire</h2>
                </div>
                <p className="text-gray-500 text-sm">Click here to fill our questionnaire</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/blog')}
              className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-xl p-6 flex flex-col justify-between"
              aria-label="View Blogs"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-gray-900 font-semibold text-lg">{numberOfBlogs} Blogs</h2>
                </div>
                <p className="text-gray-500 text-sm">Community posts</p>
              </div>
            </button>
          </motion.div>

          <div className="grid grid-cols-1  lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="space-y-6"
              >
                <div className="flex flex-col items-center">
            <div className="flex justify-center mb-2">
                <span className="bg-gradient-to-r from-purple-100 to-blue-100 text-gray-900 border-0 shadow-sm shadow-purple-500/20 px-4 py-2 rounded-full text-sm inline-flex items-center">
                    Your Progress
                </span>
            </div>
            <div className="flex items-center justify-center">
                <CircularProgress score={score} />
            </div>
            <div className="flex justify-center mt-2">
                <span className="bg-gradient-to-r from-purple-100 to-blue-100 text-gray-900 border-0 shadow-sm shadow-purple-500/20 px-4 py-2 rounded-full text-sm inline-flex items-center">
                    Last Update on: {updateDate}
                </span>
            </div>
        </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <div className="bg-gradient-to-br from-purple-100/90 to-white/90 text-gray-900 border border-gray-200 shadow-md rounded-xl p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Upgrade to Premium</h2>
                  <p className="text-gray-500 text-sm">Get unlimited access to all features and premium content.</p>
                  <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-md mt-4 transition-colors">
                    Upgrade Now
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-3 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-md rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <Calendar className="w-7 h-7 text-blue-500" />
                    <h2 className="text-gray-900 text-2xl font-semibold">Your Dashboard</h2>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h3>
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div
                        key={session.id}
                        className="bg-gray-50 p-5 rounded-lg border border-gray-200 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <Headphones className="w-6 h-6 text-purple-500" />
                          <div>
                            <p className="text-gray-900 font-medium text-base">{session.doctor}</p>
                            <p className="text-gray-500 text-sm">{session.date}</p>
                          </div>
                        </div>
                        <button
                          className={`text-white border px-5 py-2 rounded-md text-sm transition-colors ${
                            session.id === '1'
                              ? 'border-green-500 bg-green-500/90 hover:bg-green-600'
                              : 'border-purple-500 bg-purple-500/90 hover:bg-purple-600'
                          }`}
                        >
                          {session.id === '1' ? 'Join' : 'Reschedule'}
                        </button>
                      </div>
                    ))}
                  </div>
                  <button className="text-blue-500 border-blue-500/30 hover:bg-blue-50/50 w-full py-3 rounded-md mt-6 border transition-colors">
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
                <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-md rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <BookOpen className="w-7 h-7 text-green-500" />
                    <h2 className="text-gray-900 text-2xl font-semibold">Journal Entries</h2>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">Your latest journal entries</p>
                  <div className="space-y-5">
                    {journalEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="bg-gray-50 p-5 rounded-lg border border-gray-200 space-y-2 group"
                      >
                        <h3 className="text-lg font-semibold text-gray-900">{entry.title}</h3>
                        <p className="text-gray-500 text-sm">{entry.date}</p>
                        <p className="text-gray-700 mt-2 line-clamp-2">{entry.excerpt}</p>
                        <button className="text-blue-500 transition-colors hover:text-blue-600 inline-flex items-center gap-1.5">
                          Read more
                        </button>
                      </div>
                    ))}
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
