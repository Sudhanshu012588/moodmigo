import React, { useState, useEffect } from 'react';
import { useStore } from '../store/store';
import Navbar from '../components/Navbar';
import { Client, Databases, ID, Query } from 'appwrite';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function PaymentPortal() {
  const user = useStore((state) => state.User);
  const mentor = useStore((state) => state.mentorId);
  const setpaymentstate = useStore((state) => state.setpaymentstate);

  const [MentorId, setMentorId] = useState('');
  const [bookedslot, setBookedSlots] = useState([]);
  const [form, setForm] = useState({
    id: user?.id || '',
    name: user?.name || '',
    email: user?.email || '',
    transactionId: '',
    transactionDateTime: '',
    prefferedDateTime: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const getMentorData = async () => {
      const client = new Client().setEndpoint("https://fra.cloud.appwrite.io/v1").setProject("6826c7d8002c4477cb81");
      const database = new Databases(client);

      try {
        const res = await database.listDocuments(
          "6826d3a10039ef4b9444",
          "6826dd9700303a5efb90",
          [Query.equal('username', mentor)]
        );

        const mentorDoc = res.documents[0];
        if (mentorDoc) {
          setMentorId(mentorDoc.id);

          const appointment = await database.listDocuments(
            "6826d3a10039ef4b9444",
            "68275039000cb886ff5c",
            [Query.equal("Mentorid", mentorDoc.id)]
          );

          console.log(appointment.documents)

          const slots = appointment.documents.map(doc => doc.date);
          setBookedSlots(slots);
        }
      } catch (err) {
        toast.error("Error fetching mentor or booked slots.");
        console.error(err);
      }
    };

    getMentorData();
  }, [mentor]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log(bookedslot)

    if (name === "prefferedDateTime" && bookedslot.includes(value)) {
      toast.error("This time slot is already booked. Please select another.");
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (bookedslot.includes(form.prefferedDateTime)) {
      toast.error("This slot was just booked. Please choose another.");
      return;
    }

    try {
      const client = new Client().setEndpoint("https://fra.cloud.appwrite.io/v1").setProject("6820683500148a9573af");
      const database = new Databases(client);

      await database.createDocument(
        "6820add100102346d8b7",
        "68280ac50027ed33d5d2",
        ID.unique(),
        {
          username: user.name,
          Clientid: form.id,
          PaymentId: form.transactionId,
          Mentorid: MentorId,
          PaymentDateandTime: form.transactionDateTime,
          prefferedDateTime: form.prefferedDateTime,
          Verified: false
        }
      );

      setpaymentstate(true);
      toast.success("Verification request generated!");
      navigate("/sessionbook");
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#f9f9ff] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 md:p-12 w-full max-w-4xl">
          <h2 className="text-3xl font-semibold text-center text-[#3f3d56] mb-8">
            MoodMigo Payment Confirmation
          </h2>

          <div className="flex flex-col md:flex-row gap-10">
            {/* QR Code */}
            <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg p-6 border">
              <img src="/scanner.jpg" alt="QR Code" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                <input
                  type="text"
                  name="transactionId"
                  value={form.transactionId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Date & Time</label>
                <input
                  type="datetime-local"
                  name="transactionDateTime"
                  value={form.transactionDateTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date & Time</label>
                <input
                  type="datetime-local"
                  name="prefferedDateTime"
                  value={form.prefferedDateTime}
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 16)}
                  max={new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().slice(0, 16)}
                  // step="3600"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />

                {bookedslot.length > 0 && (
                  <div className="mt-2 text-sm text-red-600">
                    <strong>Booked Slots:</strong>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {bookedslot.map((slot, index) => (
                        <li key={index}>{slot}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition duration-200"
              >
                Confirm Payment
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentPortal;
