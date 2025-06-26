import React, { useState } from 'react';
import { useStore } from '../store/store';
import { toast } from 'react-toastify';
import { Client,ID } from 'appwrite';
import { Databases } from "appwrite";
// import { Database } from 'lucide-react';
function PaymentPortal({ isOpen, onClose }) {
  const mentorId = useStore((state)=>state.mentorId)
  const setMentorId = useStore((state)=>state.setMentorId)
  const User = useStore((state)=>state.User)
  const [form, setForm] = useState({
    ClientID:User.id,
    MentorID:mentorId,
    name: '',
    email: '',
    transactionId: '',
    transactionDateTime: '',
    prefferedDateTime: '',
  });


  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));


  };

  const submitToAppwrite = async()=>{
    const client = new Client()
    
    .setEndpoint("https://fra.cloud.appwrite.io/v1")
    .setProject("6826c7d8002c4477cb81");

    const databases = new Databases(client);
    try{

      await databases.createDocument(
        "6826d3a10039ef4b9444",
        "68275039000cb886ff5c",
        ID.unique(),
        {
        Mentorid:mentorId,
        ClientId:form.ClientID,
        paymentDate:form.transactionDateTime,
        PreferedDate:form.prefferedDateTime,
        username:form.name,
        transactionId:form.transactionId,
        PaymentVerified:false,
        AppointmentVerified:false
      }

    ).then((sessioncreation)=>{
      toast.success("Session created ")
      setForm({
      name: '',
    email: '',
    transactionId: '',
    transactionDateTime: '',
    prefferedDateTime: '',
     })
    })
  }catch(error){
    console.error(error)
    toast.error("can't request session")
  }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    toast.success('Session Requested');

    await submitToAppwrite()
    
    onClose(); // Close after submission
  };
  
  const setToDefault = async()=>{
     setForm({
      name: '',
    email: '',
    transactionId: '',
    transactionDateTime: '',
    prefferedDateTime: '',
     })
    setMentorId("")
  }
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50  bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 md:p-10 w-full max-w-3xl relative">
        {/* Close button */}
        <button
          onClick={()=>{
            setToDefault()
            onClose();

          }}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold text-center text-[#3f3d56] mb-6">
          MoodMigo Payment Confirmation,
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* QR Code */}
          <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg p-4 border">
            <img src="/scanner.jpg" alt="QR Code" className="max-w-full max-h-48" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 space-y-4">
            <InputField label="Name" name="name" value={form.name} onChange={handleChange} />
            <InputField label="Email" type="email" name="email" value={form.email} onChange={handleChange} />
            <InputField label="Transaction ID" name="transactionId" value={form.transactionId} onChange={handleChange} />
            <InputField label="Transaction Date & Time" type="datetime-local" name="transactionDateTime" value={form.transactionDateTime} onChange={handleChange} />
            <InputField label="Preferred Date & Time" type="datetime-local" name="prefferedDateTime" value={form.prefferedDateTime} onChange={handleChange} />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition"
            >
              Confirm Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        required
      />
    </div>
  );
}

export default PaymentPortal;
