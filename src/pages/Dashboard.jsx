import React, { useEffect, useState } from 'react';
import {
  Headphones, Calendar, BookOpen, MessageCircle, Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useStore } from '../store/store';
import { account } from '../appwrite/config';
import MoodMigoLoading from '../components/Loading';
import db from '../appwrite/databases';
import CircularProgress from '../components/ProgressTracker';
import { Query, Client, Databases } from 'appwrite';
import { toast } from 'react-toastify';
import { useMemo } from "react";

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const Dashboard = () => {
// Imports and constants
const navigate = useNavigate();
const today = new Date();
const formattedDate = today.toLocaleDateString("en-US", {
  month: "numeric",
  day: "numeric",
  year: "numeric",
});

// Zustand states
const user = useStore(state => state.User);
const setUser = useStore(state => state.setUser);
const score = useStore(state => state.score);
const setScore = useStore(state => state.setScore);

// Local states
const [numberOfTimes, setNumberOfTimes] = useState(0);
const [updateDate, setUpdateDate] = useState(null);
const [isLoading, setIsLoading] = useState(true);
const [numberOfBlogs, setNumberOfBlogs] = useState(0);
const [url, setUrl] = useState("");
const [professionals, setProfessionals] = useState([]);
const [journalEntries, setJournalEntries] = useState([]);
const [verifiedSessions, setVerifiedSessions] = useState([]);

const moods = [
  { emoji: "😄", label: "Happy" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😠", label: "Angry" },
  { emoji: "😰", label: "Anxious" },
];

const getEmojiForMood = (moodLabel) => {
  const found = moods.find(m => m.label.toLowerCase() === moodLabel.toLowerCase());
  return found ? found.emoji : "❓";
};

const fetchUserData = async () => {
  try {
    const tempUser = await account.get();
    setUser({
      id: tempUser.$id,
      name: tempUser.name,
      email: tempUser.email,
      password: '',
      isLoggedIn: true,
    });

    const scoreResponse = await db.UsersAttributes.list([
      Query.equal('UserId', tempUser.$id),
    ]);

    if (scoreResponse.documents.length > 0) {
      const doc = scoreResponse.documents[0];
      setScore(doc.newScore);
      setNumberOfTimes(doc.NumberOfTimesFilled);
      setUpdateDate(doc.lastUpdatedDate);
    } else {
      setScore(null);
    }

    const client = new Client().setEndpoint("https://fra.cloud.appwrite.io/v1").setProject("6826c7d8002c4477cb81");
    const database = new Databases(client);

    const proResponse = await database.listDocuments(
      "6826d3a10039ef4b9444",
      "68275039000cb886ff5c",
      [Query.equal("ClientId", tempUser.$id)]
    );

    if (proResponse.documents.length > 0) {
      setProfessionals(proResponse.documents);
    } else {
      setUrl("");
    }

    const blogResponse = await db.blog.list([]);
    setNumberOfBlogs(blogResponse.total ?? 0);

  } catch (error) {
    setUser(null);
    setScore(null);
  } finally {
    setIsLoading(false);
  }
};

const fetchJournals = async () => {
  const client = new Client().setEndpoint("https://fra.cloud.appwrite.io/v1").setProject("6820683500148a9573af");
  const database = new Databases(client);

  const response = await database.listDocuments("6820add100102346d8b7", "682ab3ed000b1c6f984c");
  if (response.documents.length > 0) {
    setJournalEntries(response.documents);
  }
};

const fetchVerifiedSessions = async () => {
  if (!user?.id) return;
  const client = new Client().setEndpoint("https://fra.cloud.appwrite.io/v1").setProject("6826c7d8002c4477cb81");
  const database = new Databases(client);

  const response = await database.listDocuments(
    "6826d3a10039ef4b9444",
    "68275039000cb886ff5c",
    [Query.equal("ClientId", user.id)]
  );

  const todayDateStr = today.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });

  const filtered = response.documents.filter(doc => doc.date === todayDateStr);
  setVerifiedSessions(filtered);
};

useEffect(() => {
  fetchUserData();
  fetchJournals();
}, [setUser, setScore]);

useEffect(() => {
  fetchVerifiedSessions();
}, [user?.id]);
  const date = new Date();
const todayFormatted = date.toLocaleString("en-US", {
          month: "numeric",
          day: "numeric",
          year: "numeric",
        }).replace(",", ""); 
  if (isLoading) return <MoodMigoLoading />;

  return (
    <>
  <Navbar />
  <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white p-6 sm:p-8 lg:p-12">
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 to-purple-600 text-transparent bg-clip-text">
          Welcome back,{' '}
          <span className="font-extrabold bg-gradient-to-r from-blue-700 to-purple-600 text-transparent bg-clip-text">
            {user?.name || 'User'}
          </span>
          !
        </h1>
        <p className="mt-2 text-gray-700 text-base sm:text-lg max-w-xl mx-auto">
          Your personalized mental wellness hub. Let's continue your mental wellness journey.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {[
          {
            onClick: () => navigate('/chat'),
            label: 'MANARAH',
            description: 'Your mental health companion.',
            icon: <Users className="w-7 h-7 text-purple-600" />,
            ariaLabel: 'Go to MANARAH chat',
          },
          {
            onClick: () => navigate('/questionnaire'),
            label: 'Fill the Questionnaire',
            description: 'Click here to fill our questionnaire',
            icon: <Calendar className="w-7 h-7 text-blue-600" />,
            ariaLabel: 'Fill the questionnaire',
          },
          {
            onClick: () => navigate('/blog'),
            label: `${numberOfBlogs} Blogs`,
            description: 'Community Posts',
            icon: <MessageCircle className="w-7 h-7 text-yellow-500" />,
            ariaLabel: 'View Blogs',
          },
        ].map(({ onClick, label, description, icon, ariaLabel }) => (
          <button
            key={label}
            onClick={onClick}
            aria-label={ariaLabel}
            className="bg-white/90 backdrop-blur-md border border-gray-300 shadow-md hover:shadow-xl transition-shadow duration-300 hover:scale-[1.04] rounded-xl p-7 flex flex-col justify-between focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-4">{icon}<h2 className="text-gray-900 font-semibold text-xl">{label}</h2></div>
              <p className="text-gray-600 text-sm sm:text-base">{description}</p>
            </div>
          </button>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-10">
          {numberOfTimes > 1 ? (
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-8"
            >
              <div className="flex flex-col items-center bg-gradient-to-tr from-purple-100 to-blue-100 rounded-2xl p-8 shadow-lg">
                <span className="text-sm font-medium px-5 py-2 rounded-full bg-gradient-to-r from-purple-300 to-blue-300 text-gray-900 inline-flex items-center shadow-md">
                  Your Progress
                </span>
                <div className="mt-6">
                  <CircularProgress score={score} />
                </div>
                <span className="mt-6 text-sm text-gray-700 px-4 py-2 rounded-full bg-gradient-to-r from-purple-200 to-blue-200 shadow-md inline-flex items-center">
                  Last Updated on: {updateDate || 'N/A'}
                </span>
              </div>
              
            </motion.div>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-gradient-to-r from-purple-200 to-blue-200 text-gray-800 px-5 py-3 rounded-2xl text-sm font-semibold shadow-sm border border-purple-300">
              <div className="flex items-center gap-3">
                <span role="img" aria-label="calendar" className="text-lg">
                  📅
                </span>
                <p>Please complete the questionnaire again after 42 days to track your progress.</p>
              </div>
              <div className="bg-white/70 text-gray-700 border border-purple-300 px-4 py-2 rounded-full text-xs shadow-sm">
                Last Updated: {updateDate || 'N/A'}
              </div>
            </div>
          )}
          
        </div>

        {/* Right Content */}
        <div className="lg:col-span-3 space-y-12">
          {/* Upcoming Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-8 border border-gray-300 shadow-lg"
          >
            <h3 className="text-gray-900 font-extrabold mb-6 text-2xl text-center">
              Upcoming Sessions
            </h3>
            {professionals.length === 0 ? (
              <p className="text-gray-500 text-center">No upcoming sessions.</p>
            ) : (
              <div className="space-y-6">
                {professionals.map((session) => (
                  <div
                    key={session.$id}
                    className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex items-center gap-5">
                      <Headphones className="w-7 h-7 text-purple-600" />
                      <div>
                        <p className="text-gray-900 font-semibold text-lg">{session.name}</p>
                        <p className="text-gray-600 text-sm">{session.date}</p>
                        <p className="text-gray-600 text-sm">{session.time}</p>
                      </div>
                    </div>

                        <button
                          onClick={() => window.open(session.meetingurl, '_blank')}
                          className="mt-2 text-white border border-green-600 bg-green-600 hover:bg-green-700 px-6 py-2 rounded-xl text-sm font-semibold transition-colors shadow-md"
                          aria-label={`Join session with ${session.ProfessionalName}`}
                        >
                          Join
                        </button>
                      

                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/sessions')}
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-7 py-3 rounded-xl shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105 text-sm font-semibold"
              >
                Request New Session
              </button>
            </div>
          </motion.div>

          {/* Journal Entries */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-8 border border-gray-300 shadow-lg max-w-3xl mx-auto"
          >
            <h3 className="text-gray-900 font-extrabold mb-8 text-2xl text-center">
              Recent Journal Entries
            </h3>

            {journalEntries.length === 0 ? (
              <p className="text-gray-500 text-center text-base">No entries yet.</p>
            ) : (
              journalEntries.map((entry) => (
                <div
                  key={entry.$id}
                  className="flex flex-col bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-3xl">{getEmojiForMood(entry.Mood)}</span>
                    <h4 className="text-gray-900 font-semibold text-xl">{entry.Mood}</h4>
                    <span className="ml-auto text-gray-400 text-xs italic select-none">
                      {new Date(entry.$createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{entry.Body}</p>
                </div>
              ))
            )}
            <div className="flex gap-5 mt-6">
  
  <button
    onClick={() => navigate('/journal')}
    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105 text-base font-semibold"
  >
    New Journal Entry
  </button>
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
