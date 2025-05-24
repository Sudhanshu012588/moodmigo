import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Clock, CheckCircle } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import { Client, Databases, ID, Account } from 'appwrite';
import { useStore } from '../store/store';
import Navbar from '../components/Navbar';
import { account } from '../appwrite/config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MentorCard = ({ mentor, onBookSession }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isBooked, setIsBooked] = useState(false);
  const paymentState = useStore((state)=>state.paymentState)
  const setPaymentState = useStore((state)=>state.setpaymentstate)
  const user = useStore((state) => state.User);
  const navigate = useNavigate();
  const setMentor = useStore((state)=>state.setMentorId)

  // Check if user has premium access or payment status - 
  // Assuming you will update this state when user upgrades
  // For now, assuming user object has a boolean 'isPremium'
  // useEffect(() => {
  //   console.log(pa)
  // }, []);

  const handleBooking = () => {
    if (!selectedDate) {
      toast.info('Please select a date and time');
      return;
    }
    onBookSession(mentor.id, selectedDate);
    setIsBooked(true);
  };

  // Parse specialties, accept array or comma-separated string
  const specialties = Array.isArray(mentor.specialties)
    ? mentor.specialties
    : typeof mentor.specialties === 'string'
    ? mentor.specialties.split(',').map((s) => s.trim())
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition"
    >
      <div className="flex gap-4 items-center mb-4">
        <img
          src={mentor.avatar || 'https://placehold.co/100x100?text=Avatar'}
          alt={mentor.name}
          className="w-16 h-16 rounded-full border-2 border-purple-200 object-cover"
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{mentor.name}</h2>
          <p className="text-sm text-gray-500">{mentor.bio?.slice(0, 80)}...</p>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm text-gray-700 font-medium flex items-center gap-2">
          <Users size={16} /> Specialties:
        </h3>
        <div className="flex flex-wrap gap-2 mt-1">
          {specialties.map((s, i) => (
            <span
              key={i}
              className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded-full"
            >
              {s}
            </span>
          ))}
        </div>
        <h2 className="text-base font-medium mt-2 text-gray-700">
          <span className="font-semibold text-purple-600">Charges:</span> {mentor.charges} per session
        </h2>
      </div>
          <button
        type="button"
        onClick={() =>{ 
          setMentor(mentor.name)
          navigate('/sessionbook')}}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 ml-5 rounded-xl shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105 text-base font-semibold"
      >
        Book A Session
      </button>

      
    </motion.div>
  );
};

const MentorBooking = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const client = new Client()
          .setEndpoint('https://fra.cloud.appwrite.io/v1')
          .setProject('6826c7d8002c4477cb81');

        const databases = new Databases(client);
        const res = await databases.listDocuments('6826d3a10039ef4b9444', '6826dd9700303a5efb90');

        const formattedMentors = res.documents.map((doc) => ({
          id: doc.$id,
          name: doc.username || 'Unnamed',
          bio: doc.bio || '',
          avatar: doc.avatar || 'https://placehold.co/100x100?text=Avatar',
          specialties: doc.specialties,
          charges: doc.Charges,
          availableDates: doc.availableDates,
        }));

        setMentors(formattedMentors);
      } catch (error) {
        toast.error('Error fetching mentors.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const handleBookSession = async (mentorId, selectedDate) => {
    if (!selectedDate) return;

    const dateStr = selectedDate.toLocaleDateString();
    const timeStr = selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      const user = await account.get();

      const bookingObj = {
        MentorId: mentorId,
        ClientId: user.$id,
        username: user.name,
        date: dateStr,
        time: timeStr,
        Verified: false,
      };

      await createBooking(bookingObj);
    } catch (error) {
      toast.error("Couldn't complete the booking");
      console.error(error);
    }
  };

  const createBooking = async (bookingObj) => {
    try {
      const client = new Client()
        .setEndpoint('https://fra.cloud.appwrite.io/v1')
        .setProject('6820683500148a9573af');

      const databases = new Databases(client);

      await databases.createDocument(
        '6820add100102346d8b7',
        '68280ac50027ed33d5d2',
        ID.unique(),
        {
          Mentorid: bookingObj.MentorId,
          Clientid: bookingObj.ClientId,
          username: bookingObj.username,
          date: bookingObj.date,
          time: bookingObj.time,
          Verified: false,
        }
      );

      toast.success("Session Requested");
    } catch (error) {
      console.error("Error fixing session:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 text-transparent bg-clip-text mb-8 text-center">
          Request a Session with a Mentor
        </h1>

        {loading ? (
          <div className="text-center text-gray-500">Loading mentors...</div>
        ) : mentors.length === 0 ? (
          <div className="text-center text-gray-500">
            No mentors available at the moment. Please check back later.
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  onBookSession={handleBookSession}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 ml-5 rounded-xl shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105 text-base font-semibold"
      >
        Back
      </button>
    </>
  );
};

export default MentorBooking;
