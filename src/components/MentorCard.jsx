import React,{useState,useEffect} from 'react';
import { motion } from 'framer-motion'; // Import motion
import { useStore } from '../store/store';
import { Client,Databases, Query } from 'appwrite';

const MentorCard = ({ username, bio, specialties, Charges,session,MentorID,profilephoto }) => {
  // Ensure specialties is an array, splitting by comma if it's a string
  
const [bookedSlots, setBookedSlots] = useState([]);
  const specialtiesArray = Array.isArray(specialties)
    ? specialties
    : specialties ? specialties.split(',').map(s => s.trim()) : [];


    const setMentorId = useStore((state)=>state.setMentorId)
    const sendsessionreq = ()=>{
        session()
        setMentorId(MentorID);
    }

    useEffect(() => {
  const getBookedSessions = async () => {
    const client = new Client().setEndpoint("https://fra.cloud.appwrite.io/v1").setProject("6826c7d8002c4477cb81");
    const database = new Databases(client);

    const appointments = await database.listDocuments(
      '6826d3a10039ef4b9444',
      '68275039000cb886ff5c',
      [Query.equal('Mentorid', MentorID)]
    );

    const slots = appointments.documents.map(doc => doc.PreferedDate);
    setBookedSlots(slots); // ✅ triggers re-render
  };

  getBookedSessions();
}, [MentorID]); // 🧠 also make sure to add MentorID to dependency array

    

  return (
    <motion.div // Use motion.div for animation
      className="bg-white shadow-md rounded-xl p-6 w-full max-w-xs sm:max-w-sm lg:max-w-xs mx-auto my-0 border border-gray-100 flex flex-col justify-between h-full transform transition-transform duration-300 hover:scale-102 hover:shadow-xl"
      initial={{ opacity: 0, y: 50 }} // Initial state for animation
      animate={{ opacity: 1, y: 0 }}   // Animate to this state
      transition={{ duration: 0.5, ease: "easeOut" }} // Transition properties
      whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }} // Animation on hover
      whileTap={{ scale: 0.98 }} // Animation on tap/click
    >
      {/* Top section: Avatar, Name, Bio */}
      <div>
        <div className="flex items-start mb-4">
          {/* Avatar - using a consistent grey background with the 'Avatar' text from the image */}
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-semibold mr-4 flex-shrink-0">
            <img src={profilephoto} alt="" />
          </div>
          <div className="flex-grow">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">{username}</h2>
            <p className="text-sm text-gray-600 leading-snug line-clamp-3">{bio}</p>
          </div>
        </div>

        {/* Specialties section */}
        <div className="mb-4">
          <p className="text-base font-medium text-gray-700 mb-2 flex items-center">
            <span className="material-icons text-gray-700 mr-2 text-lg">psychology</span> {/* Icon for Specialties */}
            Specialties:
          </p>
          <div className="flex flex-wrap gap-2">
            {specialtiesArray.map((specialty, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>
            

  {bookedSlots.length > 0 && (
  <div className="mt-6">
    <div className="flex items-center mb-2 text-sm text-red-600 font-medium">
      
      <p>Some slots are already booked. Please choose a unique time to avoid conflicts.</p>
    </div>

    <div className="flex flex-wrap gap-3">
      {bookedSlots.map((slot, index) => (
        <div
          key={index}
          className="bg-red-50 text-red-700 border border-red-300 px-4 py-2 rounded-lg text-sm font-medium shadow hover:bg-red-100 transition"
        >
          {new Date(slot).toLocaleString()}
        </div>
      ))}
    </div>
  </div>
)}


      {/* Charges and Book a Session button */}
      <div className="mt-auto pt-4 border-t border-gray-100"> {/* Added border-t for separation */}
        {Charges && (
          <p className="text-base text-gray-700 mb-3">
            <span className="font-semibold text-gray-800">Charges:</span>{Charges[0]==='₹'?Charges:`₹${Charges}`} per session
          </p>
        )}
        <button className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md"
            onClick={sendsessionreq}
        >
          Book A Session
        </button>
      </div>
    </motion.div>
  );
};

export default MentorCard;