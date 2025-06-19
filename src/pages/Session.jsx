import React, { useEffect, useState } from 'react';
import { useStore } from '../store/store';
import { Client, Databases, Query } from 'appwrite';
import Navbar from '../components/Navbar';
import DatePicker from 'react-datepicker';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';

function Session() {
  const mentor = useStore((state) => state.mentorId);
  const [mentorData, setMentorData] = useState([]);
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [confirmedSession, setConfirmedSession] = useState(null);
  const [BookedSlots,setBookedSlots]=useState([])
  const navigate = useNavigate();
  const location = useLocation();

  const getMentorDetails = async () => {
    const client = new Client();
    client.setEndpoint("https://fra.cloud.appwrite.io/v1").setProject("6826c7d8002c4477cb81");

    const database = new Databases(client);
    const res = await database.listDocuments(
      "6826d3a10039ef4b9444",
      "6826dd9700303a5efb90",
      [Query.equal('username', mentor)]
    );

    // console.log("id",res.documents[0])
    const appointmentRes = await database.listDocuments('6826d3a10039ef4b9444',"68275039000cb886ff5c",[Query.equal('Mentorid',res.documents[0].id)])
    // console.log("appointment",appointmentRes.documents[0])
  const slots = appointmentRes.documents.map(doc => doc.date);
    setBookedSlots(slots)
    console.log('Booked',slots)
    setMentorData(res.documents);
  };

  const handleBookNow = () => {
    navigate('/premium');
  };

  const handleScheduleSubmit = () => {
    setConfirmedSession({
      mentor: mentorData[0].username,
      date: selectedDate,
      time: selectedTime,
      charges: mentorData[0].Charges
    });
    setStep(2);

  };


  useEffect(()=>{
    getMentorDetails()
  },[])
  // When the user comes back from /premium, go to step 1 (schedule)
//   useEffect(() => {
//     console.log(confirmedSession)
//   }, [confirmedSession]);

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Session Booking</h1>

        {/* Mentor Info */}
        {mentorData.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <p><strong>Name:</strong> {mentorData[0].username}</p>
            <p><strong>Bio:</strong> {mentorData[0].bio}</p>
            <p><strong>Specialties:</strong> {mentorData[0].specialties}</p>
            <p><strong>Charges:</strong> ₹{mentorData[0].Charges}</p>

            {step === 0 && (
              <button
                onClick={handleBookNow}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Book Now
              </button>
            )}
          </div>
        )}

        {/* Step 2: Schedule Date & Time */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <h2 className="text-xl font-semibold mb-2">Select Date & Time</h2>
            <label className="block mb-3">
              <span className="text-gray-700">Date:</span>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                className="w-full mt-1 p-2 border rounded"
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
              />
            </label>

            <label className="block mb-3">
              <span className="text-gray-700">Time:</span>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full mt-1 p-2 border rounded"
              />
            </label>

            <button
              onClick={handleScheduleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Confirm Session
            </button>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 2 && confirmedSession && (
          <div className="bg-green-50 border border-green-400 text-green-700 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Session Confirmed 🎉</h2>
            <p><strong>Mentor:</strong> {confirmedSession.mentor}</p>
            <p><strong>Date:</strong> {confirmedSession.date.toLocaleDateString()}</p>
            <p><strong>Time:</strong> {confirmedSession.time}</p>
            <p><strong>Charges:</strong> ₹{confirmedSession.charges}</p>
          </div>
        )}
        {BookedSlots.length > 0 && (
                  <div className="mt-2 text-sm text-red-600">
                    <strong>Booked Slots:</strong>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {BookedSlots.map((slot, index) => (
                        <li key={index}>{slot}</li>
                      ))}
                    </ul>
                  </div>
                )}
      </div>
    </>
  );
}

export default Session;
