import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, UserPlus, MessageSquare, Calendar, Bell, CheckCircle, Clock,
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

  const [link,setLink]=useState("")

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
        const roomName = `${sessionId}`;
    const meetingUrl = `https://meet.jit.si/${roomName}`;
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
            meetingurl: meetingUrl
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

  // Show DatePicker for rescheduling
  const handleShowReschedule = (id, currentDate) => {
    setRescheduleId(id);
    setRescheduleDate(new Date(currentDate));
  };

  // Handle date change and update document
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

  const handleJoinMeeting = (id) => {
    const roomName = `${id}`;
    const meetingUrl = `https://meet.jit.si/${roomName}`;
    window.open(meetingUrl, "_blank");
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
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-gray-500">{label}</p>
                </div>
              </div>
            ))}
          </motion.section>

          {/* Unconfirmed session requests */}
          <motion.section>
            <h2 className="text-xl font-semibold mb-4">Session Requests</h2>
            {sessionArray.length === 0 ? (
              <p className="text-gray-500">No session requests at the moment.</p>
            ) : (
              sessionArray.map(({ $id, username, date, time }) => (
                <div key={$id} className="flex items-center justify-between bg-white shadow rounded p-4 mb-4">
                  <div>
                    <p><span className="font-semibold">Client:</span> {username}</p>
                    <p><span className="font-semibold">Date:</span> {date}</p>
                    <p><span className="font-semibold">Time:</span> {time}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleConfirm($id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleShowReschedule($id, date)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleDelete($id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Reschedule DatePicker */}
            {rescheduleId && (
              <div className="mb-6">
                <DatePicker
                  selected={rescheduleDate}
                  onChange={handleDateChange}
                  inline
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={new Date()}
                />
                <button
                  onClick={() => setRescheduleId(null)}
                  className="mt-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            )}
          </motion.section>

          {/* Confirmed Appointments */}
          <motion.section>
            <h2 className="text-xl font-semibold mb-4">Confirmed Appointments</h2>
            {confirmedAppointments.length === 0 ? (
              <p className="text-gray-500">No confirmed appointments.</p>
            ) : (
              confirmedAppointments.map(({ $id, username, date, time }) => (
                <div key={$id} className="flex items-center justify-between bg-white shadow rounded p-4 mb-4">
                  <div>
                    <p><span className="font-semibold">Client:</span> {username}</p>
                    <p><span className="font-semibold">Date:</span> {date}</p>
                    <p><span className="font-semibold">Time:</span> {time}</p>
                  </div>
                  <button
                    onClick={() => handleJoinMeeting($id)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  >
                    Join Meeting
                  </button>
                </div>
              ))
            )}
          </motion.section>
        </motion.div>
      </main>
    </>
  );
};

export default ProfessionalDashboard;
