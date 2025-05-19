import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import { Client,Databases,ID } from "appwrite";
import { Database } from "lucide-react";
import { toast } from "react-toastify";
import { useStore } from "../store/store";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
const moods = [
  { emoji: "😄", label: "Happy" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😠", label: "Angry" },
  { emoji: "😰", label: "Anxious" },
];
const JournalEntry = () => {
    const [selectedMood, setSelectedMood] = useState(null);
    const [entryDate, setEntryDate] = useState(new Date());
    const [entryText, setEntryText] = useState("");
    const user = useStore((state)=>state.User.id)
    const setJournal = async()=>{
        const client = new Client()
        client.setEndpoint('https://fra.cloud.appwrite.io/v1').setProject("6820683500148a9573af")
        const database = new Databases(client)
        try {
            const setResponse = await database.createDocument("6820add100102346d8b7","682ab3ed000b1c6f984c",ID.unique(),{
                "Mood":selectedMood,
                "Body":entryText,
                "creatorid":user
            }).then(()=>{
                toast.success("Entry Marked")
            })
            
        } catch (error) {
            toast.error("Can't create Entry",error)        }
            
        }
        const handleSubmit = (e) => {
            e.preventDefault();
            
            
            setJournal();
            
        };
        const navigate = useNavigate()
        
        return (
            <>
    <Navbar/>
    <motion.div
      className="max-w-xl mx-auto p-6 mt-8 bg-white shadow-xl rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 New Journal Entry</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            How are you feeling today?
          </label>
          <div className="flex gap-3 mt-2">
            {moods.map((mood) => (
              <button
                key={mood.label}
                type="button"
                className={`text-2xl p-2 rounded-full transition ${
                  selectedMood === mood.label
                    ? "bg-blue-100 ring-2 ring-blue-400"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedMood(mood.label)}
              >
                {mood.emoji}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Date</label>
          <DatePicker
            selected={entryDate}
            onChange={(date) => setEntryDate(date)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            dateFormat="MMMM d, yyyy"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Your thoughts</label>
          <textarea
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Write anything you feel..."
            value={entryText}
            onChange={(e) => setEntryText(e.target.value)}
            required
            />
        </div>

      <div className="flex justify-end gap-5 mt-6">
  <button
    type="button" 
    onClick={() => navigate('/dashboard')}
    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105 text-base font-semibold"
  >
    Back
  </button>
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    type="submit"
    className="bg-blue-600 text-white px-8 py-4 rounded-xl shadow-md transition duration-300 hover:bg-blue-700 text-base font-semibold"
  >
    Save Entry
  </motion.button>
</div>


      </form>
    </motion.div>
              </>
  );
};

export default JournalEntry;
