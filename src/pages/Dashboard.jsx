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

const journalEntries = [
  { id: '1', title: 'Morning Reflection', date: '2 days ago', excerpt: "Today I woke up feeling more energetic..." },
  { id: '2', title: 'Weekly Progress', date: '5 days ago', excerpt: "This week has been challenging..." },
];

const Dashboard = () => {
  const navigate = useNavigate();
const today = new Date();
const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
  // Zustand states and setters
  const user = useStore(state => state.User);
  const setUser = useStore(state => state.setUser);
  const score = useStore(state => state.score);
  const setScore = useStore(state => state.setScore);

  // Local state
  const [updateDate, setUpdateDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [numberOfBlogs, setNumberOfBlogs] = useState(0);
  const [url,setUrl]=useState("")
  const [professionals, setProfessionals] = useState([]);
  // Appwrite client and database instances
  const newClient = new Client()
    .setEndpoint("https://fra.cloud.appwrite.io/v1")
    .setProject("6826c7d8002c4477cb81");
  const newDatabases = new Databases(newClient);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user account info
        const tempUser = await account.get();
        setUser({
          id: tempUser.$id,
          name: tempUser.name,
          email: tempUser.email,
          password: '',
          isLoggedIn: true,
        });

        // Fetch latest questionnaire score
        const scoreResponse = await db.UsersAttributes.list([
          Query.equal('UserId', tempUser.$id),
        ]);
        if (scoreResponse.documents.length > 0) {
          setScore(scoreResponse.documents[0].Score);
        } else {
          setScore(null);
        }

        // Fetch professionals linked to the user
        try {
          const client = new Client()
            .setEndpoint("https://fra.cloud.appwrite.io/v1")
            .setProject("6826c7d8002c4477cb81");
          const database = new Databases(client);

          const response = await database.listDocuments(
            "6826d3a10039ef4b9444",
            "68275039000cb886ff5c",
            [Query.equal("ClientId", tempUser.$id)]
          );
          console.log(response)

          if (response.documents.length > 0) {
            setProfessionals(response.documents);

            // Example: extract URL field if exists (replace 'urlFieldName' with actual field)
            // const firstUrl = response.documents[0]?.meetingurl || '';
            // setUrl(firstUrl);
            
            // console.log(professionals)
          } else {
            setUrl('');
          }
        } catch (error) {
          toast.error("Can't fetch any professionals");
          // console.error(error);
        }

        // Fetch total blogs count
        const blogResponse = await db.blog.list([]);
        setNumberOfBlogs(blogResponse.total ?? 0);

        // Load last assessment date from localStorage
        const storedDate = localStorage.getItem("lastAssessmentDate");
        setUpdateDate(storedDate);

      } catch (error) {
        // console.error("User fetch failed:", error);
        setUser(null);
        setScore(null);
        // Optionally redirect to login if unauthorized
        // navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setUser, setScore, navigate]);

  // Debug log url state
  // console.log('URL:', url);

  if (isLoading) return <MoodMigoLoading />;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-500 text-transparent bg-clip-text tracking-tight">
              Welcome back,{' '}
              <span className="font-extrabold bg-gradient-to-r from-blue-600 to-purple-500 text-transparent bg-clip-text">
                {user?.name || 'User'}
              </span>
              !
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">Your personalized mental wellness hub.</p>
            <p className="text-gray-600 text-sm sm:text-base mt-2">Let's continue your mental wellness journey</p>
          </motion.div>

          {/* Quick Actions */}
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
                  <h2 className="text-gray-900 font-semibold text-lg">Fill The Questionnaire</h2>
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
                <p className="text-gray-500 text-sm">⁠Community Posts</p>
              </div>
            </button>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar */}
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
                      ⁠Last Updated on: {updateDate || 'N/A'}
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
                  <h2 className="text-lg font-semibold">Upgrade to Premium</h2>
                  <p className="text-gray-500 text-sm">
                    Get unlimited access to all features and premium content.
                  </p>
                  <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-md mt-4 transition-colors">
                    Upgrade Now
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Upcoming Sessions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 border border-gray-200 shadow-md">
                  <h3 className="text-gray-900 font-bold mb-4 text-lg">Upcoming Sessions</h3>
                  {professionals.length === 0 && (
                    <p className="text-gray-500 text-sm">No upcoming sessions.</p>
                  )}
                  <div className="space-y-4">
                    {professionals.map((session) => (
                      <div
                        key={session.$id}
                        className="bg-gray-50 p-5 rounded-lg border border-gray-200 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <Headphones className="w-6 h-6 text-purple-500" />
                          <div>
                            <p className="text-gray-900 font-medium text-base">{session.name}</p>
                            <p className="text-gray-500 text-sm">
                              {session.date}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {session.time}
                            </p>
                          </div>
                        </div>
                        {session.date === formattedDate ? <button
  className={`text-white border px-5 py-2 rounded-md text-sm transition-colors 
    
       border-green-500 bg-green-500/90 hover:bg-green-600`
      
  }
  onClick={() => window.open(session.meetingurl, '_blank')}
>
  join
</button>:<></>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className='py-2'>

                  <button
  onClick={() => navigate('/sessions')}
  className="bg-gradient-to-r  from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm font-semibold"
>
  Request New Session
</button>
  </div>

              </motion.div>

              {/* Journal Entries */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 border border-gray-200 shadow-md">
                  <h3 className="text-gray-900 font-bold mb-4 text-lg">Recent Journal Entries</h3>
                  {journalEntries.map(entry => (
                    <div
                      key={entry.id}
                      className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4"
                    >
                      <h4 className="text-gray-800 font-semibold text-md">{entry.title}</h4>
                      <p className="text-gray-500 text-xs mb-2">{entry.date}</p>
                      <p className="text-gray-600 text-sm">{entry.excerpt}</p>
                    </div>
                  ))}
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
