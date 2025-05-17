import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, UserPlus, MessageSquare, Calendar, FileText, Bell, CheckCircle, Clock,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useStore } from '../store/store';
import MoodMigoLoading from '../components/Loading';
import { Query } from 'appwrite';
import { toast } from 'react-toastify';
import { Account, Client, Databases, ID } from 'appwrite';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ProfessionalDashboard = () => {
  const navigate = useNavigate();
  const user = useStore(state => state.User);
  const setUser = useStore(state => state.setUser);

  const [isLoading, setIsLoading] = useState(true);
  const [sessionArray, setSessionsArray] = useState([]);
  const [confirmedAppointments, setConfirmedAppointments] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState(new Date());

  // Fetch logged-in professional user info
  useEffect(() => {
    const fetchProfessionalData = async () => {
      setIsLoading(true);
      try {
        const client = new Client()
          .setEndpoint("https://fra.cloud.appwrite.io/v1")
          .setProject("6826c7d8002c4477cb81");

        const account = new Account(client);
        const tempUser = await account.get('current');

        setUser({ ...tempUser, isLoggedIn: true, name: tempUser.name, id: tempUser.$id });
      } catch (error) {
        toast.error("Professional dashboard data fetch failed");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessionalData();
  }, [setUser]);

  // Fetch sessions and confirmed appointments
  useEffect(() => {
    if (!user?.id) return;

    const fetchSessionRequests = async () => {
      try {
        const client = new Client()
          .setEndpoint("https://fra.cloud.appwrite.io/v1")
          .setProject("6820683500148a9573af");

        const databases = new Databases(client);

        const response = await databases.listDocuments(
          "6820add100102346d8b7",
          "68280ac50027ed33d5d2",
          [Query.equal('Mentorid', user.id)]
        );

        setSessionsArray(response.documents.filter(doc => doc.confirmation === false));
        setConfirmedAppointments(response.documents.filter(doc => doc.confirmation === true));
      } catch (error) {
        toast.error("Server error fetching sessions");
      }
    };

    fetchSessionRequests();
  }, [user]);

  // Confirm a session and create appointment
 const handleConfirm = async (sessionId) => {
  try {
    const client = new Client()
      .setEndpoint("https://fra.cloud.appwrite.io/v1")
      .setProject("6820683500148a9573af");

    const databases = new Databases(client);

    await databases.updateDocument(
      "6820add100102346d8b7",
      "68280ac50027ed33d5d2",
      sessionId,
      { confirmation: true }
    );

    toast.success("Session confirmed!");

    // Also create appointment in professional project
    const proClient = new Client()
      .setEndpoint("https://fra.cloud.appwrite.io/v1")
      .setProject("6826c7d8002c4477cb81");

    const profDatabases = new Databases(proClient);

    const session = sessionArray.find(s => s.$id === sessionId);

    if (session) {
      await profDatabases.createDocument(
        "6826d3a10039ef4b9444",
        "68275039000cb886ff5c",
        ID.unique(),
        {
          Mentorid: session.Mentorid,
          ClientId: session.Clientid,
          date: session.date,
          time: session.time,
        }
      );
      toast.success("Appointment created!");
    }

    // Update local state: move session from unconfirmed to confirmed
    setSessionsArray(prev => prev.filter(s => s.$id !== sessionId));

    if (session) {
      setConfirmedAppointments(prev => [...prev, { ...session, confirmation: true }]);
    }

  } catch (error) {
    toast.error("Failed to confirm session");
    console.error(error);
  }
};


  // Handle actual date change and update document
  const handleDateChange = async (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    setRescheduleDate(date);

    if (!rescheduleId) return;

    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const client = new Client()
      .setEndpoint("https://fra.cloud.appwrite.io/v1")
      .setProject("6820683500148a9573af");

    const databases = new Databases(client);

    try {
      await databases.updateDocument(
        "6820add100102346d8b7",
        "68280ac50027ed33d5d2",
        rescheduleId,
        {
          date: dateStr,
          time: timeStr,
        }
      );

      toast.success("Rescheduled successfully");

      // Update local state with new date/time
      setSessionsArray(prev =>
        prev.map(s => s.$id === rescheduleId ? { ...s, date: dateStr, time: timeStr } : s)
      );

      setRescheduleId(null); // close datepicker
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to reschedule.");
    }
  };

 const handleDelete = async (documentId) => {
  if (!window.confirm("Are you sure you want to delete this session?")) {
    return; // User cancelled deletion
  }

  try {
    const client = new Client()
      .setEndpoint("https://fra.cloud.appwrite.io/v1")
      .setProject("6820683500148a9573af"); // Use the correct project ID

    const databases = new Databases(client);

    await databases.deleteDocument(
      "6820add100102346d8b7",   // databaseId
      "68280ac50027ed33d5d2",  // collectionId
      documentId               // the $id of the document to delete
    );

    toast.success("Session deleted successfully!");

    // Remove the deleted session from state to update UI
    setSessionsArray(prev => prev.filter(s => s.$id !== documentId));
    setConfirmedAppointments(prev => prev.filter(c => c.$id !== documentId));

  } catch (error) {
    console.error("Failed to delete document:", error);
    toast.error("Failed to delete the session.");
  }
};

  if (isLoading) return <MoodMigoLoading />;

  return (
    <>
      <Navbar />
      <main className="min-h-screen p-6 sm:p-8 lg:p-12 max-w-7xl mx-auto">
        <motion.div initial="hidden" animate="visible" className="space-y-10">
          <motion.header className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-4xl font-extrabold text-indigo-900">
                Professional, <span className="text-indigo-700">{user.name}</span>!
              </h1>
              <p className="mt-2 text-gray-600 text-lg">Your professional dashboard at a glance.</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <button className="relative bg-indigo-100 text-indigo-600 hover:bg-indigo-200 rounded-full p-3">
                <Bell className="w-6 h-6" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 px-2 py-1 text-xs font-bold text-red-100 bg-red-600 rounded-full">
                    {unreadMessages}
                  </span>
                )}
              </button>
              <button
                onClick={() => navigate('/clients/add')}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full"
              >
                <UserPlus className="inline w-5 h-5 mr-2" />
                Add Client
              </button>
            </div>
          </motion.header>

          <motion.section className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                iconBg: "bg-indigo-100 text-indigo-500",
                count: sessionArray.length,
                label: "Requested Appointments",
              },
              {
                icon: Calendar,
                iconBg: "bg-blue-100 text-blue-500",
                count: confirmedAppointments.length,
                label: "Upcoming Appointments",
              },
              {
                icon: MessageSquare,
                iconBg: "bg-green-100 text-green-500",
                count: unreadMessages,
                label: "Unread Messages",
              },
            ].map(({ icon: Icon, iconBg, count, label }, i) => (
              <div key={i} className="bg-white border rounded-xl p-6 flex items-center space-x-5 shadow-md">
                <div className={`${iconBg} rounded-md p-4`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{count}</h3>
                  <p className="text-gray-500 font-medium">{label}</p>
                </div>
              </div>
            ))}
          </motion.section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <motion.section className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md overflow-auto max-h-[600px]">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Upcoming Sessions</h2>
              {sessionArray.length > 0 ? (
                <div className="space-y-4">
                  {sessionArray.map(({ $id, username, date, time }) => (
                    <div key={$id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border hover:shadow-lg">
                      <div>
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-500" />
                          {username}
                        </h3>
                        <p className="text-gray-500 text-sm flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {date} at {time}
                        </p>
                        {rescheduleId === $id && (
                          <DatePicker
                            selected={rescheduleDate}
                            onChange={handleDateChange}
                            showTimeSelect
                            dateFormat="Pp"
                            className="mt-2 border p-2 rounded-md text-sm"
                            minDate={new Date()}
                          />
                        )}
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleConfirm($id)}
                          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-full text-sm flex items-center gap-1"
                        >
                          <CheckCircle className="w-5 h-5" /> Confirm
                        </button>
                        <button
                          onClick={() => handleShowReschedule($id, date)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-full text-sm"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleDelete($id)}
                          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-full text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No upcoming sessions found.</p>
              )}
            </motion.section>

           <motion.section 
  className="bg-gray-50 rounded-xl p-6 shadow-lg max-h-[600px] overflow-auto"
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Confirmed Appointments</h2>

  {confirmedAppointments.length > 0 ? (
    <ul className="space-y-4">
      {confirmedAppointments.map(({ $id, date, time, username }) => (
        <li 
          key={$id} 
          className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center space-x-4">
            {/* Placeholder avatar circle */}
            <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-semibold text-lg uppercase">
              {username.charAt(0)}
            </div>

            <div>
              <p className="text-gray-900 font-medium">{username}</p>
              <p className="text-sm text-gray-600">
                Session on <span className="font-semibold">{date}</span> at <span className="font-semibold">{time}</span>
              </p>
            </div>
          </div>

          {/* Optional: Add action buttons here */}
          {/* <button className="text-red-600 hover:text-red-800 font-semibold">Delete</button> */}
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500 italic">No confirmed appointments yet.</p>
  )}
</motion.section>

          </div>
        </motion.div>
      </main>
    </>
  );
};

export default ProfessionalDashboard;
