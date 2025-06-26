// ✅ Rewritten and Optimized ProfessionalDashboard

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, UserPlus, MessageSquare, Calendar, Camera } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useStore } from '../store/store';
import MoodMigoLoading from '../components/Loading';
import { Query, Client, Account, Databases } from 'appwrite';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';

const ProfessionalDashboard = () => {
  const navigate = useNavigate();
  const user = useStore(state => state.User);
  const setUser = useStore(state => state.setUser);

  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [showUploadBtn, setShowUploadBtn] = useState(false);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState(new Date());

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const client = new Client().setEndpoint("https://fra.cloud.appwrite.io/v1").setProject("6826c7d8002c4477cb81");
        const account = new Account(client);
        const db = new Databases(client);

        const currentUser = await account.get("current");
        const profAttrs = await db.listDocuments("6826d3a10039ef4b9444", "6826dd9700303a5efb90", [
          Query.equal("id", currentUser.$id)
        ]);

        const userData = {
          ...currentUser,
          isLoggedIn: true,
          profilepicture: profAttrs.documents[0]?.profilephoto || '',
          id: currentUser.$id
        };

        setUser(userData);

        const sessionRes = await db.listDocuments("6826d3a10039ef4b9444", "68275039000cb886ff5c", [
          Query.equal("Mentorid", currentUser.$id),
          Query.equal("AppointmentVerified", false)
        ]);
        setSessions(sessionRes.documents.filter(doc => doc.PaymentVerified === true));

        const meetRes = await db.listDocuments("6826d3a10039ef4b9444", "68275039000cb886ff5c", [
          Query.equal("Mentorid", currentUser.$id),
          Query.equal("AppointmentVerified", true)
        ]);
        setMeetings(meetRes.documents);

      } catch (error) {
        console.error(error);
        toast.error("Error loading dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [setUser]);

  const handleProfileUpload = async () => {
    if (!profileImageFile) return;
    setUploadingProfile(true);
    try {
      const formData = new FormData();
      formData.append("file", profileImageFile);
      formData.append("upload_preset", "preset");

      const res = await fetch("https://api.cloudinary.com/v1_1/dzczys4gk/image/upload", { method: 'POST', body: formData });
      const data = await res.json();

      if (data.secure_url) {
        const client = new Client().setEndpoint("https://fra.cloud.appwrite.io/v1").setProject("6826c7d8002c4477cb81");
        const db = new Databases(client);
        const userDoc = await db.listDocuments("6826d3a10039ef4b9444", "6826dd9700303a5efb90", [Query.equal('id', user.id)]);
        const docId = userDoc.documents[0]?.$id;

        if (docId) {
          await db.updateDocument("6826d3a10039ef4b9444", "6826dd9700303a5efb90", docId, { profilephoto: data.secure_url });
          setUser({ ...user, profilepicture: data.secure_url });
          toast.success("Profile updated!");
        }
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploadingProfile(false);
      setShowUploadBtn(false);
    }
  };

  const handleConfirm = async (session) => {
    try {
      const client = new Client().setEndpoint("https://fra.cloud.appwrite.io/v1").setProject("6826c7d8002c4477cb81");
      const db = new Databases(client);
      await db.updateDocument("6826d3a10039ef4b9444", "68275039000cb886ff5c", session.$id, {
        AppointmentVerified: true,
        meetingurl: `https://meet.jit.si/${session.$id}`
      });
      toast.success("Session confirmed!");
      window.location.reload();
    } catch (err) {
      toast.error("Confirmation failed");
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleId || !rescheduleDate) return;
    try {
      const client = new Client().setEndpoint("https://fra.cloud.appwrite.io/v1").setProject("6826c7d8002c4477cb81");
      const db = new Databases(client);
      await db.updateDocument("6826d3a10039ef4b9444", "68275039000cb886ff5c", rescheduleId, {
        PreferedDate: rescheduleDate
      });
      toast.success("Rescheduled successfully");
      window.location.reload();
    } catch (err) {
      toast.error("Reschedule failed");
    }
  };

  if (loading) return <MoodMigoLoading />;

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto py-8 px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <div>
              <label htmlFor="profile-upload" className="relative cursor-pointer">
                <img src={user.profilepicture || '/default-profile.jpg'} alt="Profile" className="w-28 h-28 rounded-full border" />
                <Camera className="absolute bottom-1 right-1 bg-indigo-600 text-white p-1 rounded-full w-6 h-6" />
              </label>
              <input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={(e) => {
                setProfileImageFile(e.target.files[0]);
                setShowUploadBtn(true);
              }} />
              {showUploadBtn && (
                <button onClick={handleProfileUpload} disabled={uploadingProfile} className="mt-2 bg-indigo-600 text-white py-1 px-4 rounded">
                  {uploadingProfile ? "Uploading..." : "Upload"}
                </button>
              )}
              <h1 className="text-3xl font-bold mt-4">Welcome, {user.name}</h1>
            </div>
            <button onClick={() => navigate('/clients/add')} className="mt-4 sm:mt-0 bg-green-600 text-white py-2 px-4 rounded-full">
              <UserPlus className="inline w-4 h-4 mr-2" /> Add Client
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[{ label: 'Requested Sessions', value: sessions.length, Icon: Users }, { label: 'Meetings', value: meetings.length, Icon: Calendar }, { label: 'Unread Messages', value: unreadMessages, Icon: MessageSquare }].map(({ label, value, Icon }, i) => (
              <div key={i} className="bg-white shadow rounded-lg p-4 flex items-center space-x-4">
                <Icon className="w-6 h-6 text-indigo-600" />
                <div>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-gray-600 text-sm">{label}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-3">Pending Session Requests</h2>
          {sessions.map(session => (
            <div key={session.$id} className="bg-white p-4 rounded shadow flex justify-between items-center mb-3">
              <div>
                <p className="font-medium">{session.username}</p>
                <p className="text-sm text-gray-500">{new Date(session.PreferedDate).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleConfirm(session)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Confirm</button>
                <button onClick={() => { setRescheduleId(session.$id); setRescheduleDate(new Date()); }} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Reschedule</button>
              </div>
            </div>
          ))}

          {rescheduleId && (
            <div className="mt-4">
              <DatePicker selected={rescheduleDate} onChange={setRescheduleDate} inline showTimeSelect dateFormat="Pp" minDate={new Date()} />
              <button onClick={handleReschedule} className="mt-2 bg-indigo-600 text-white py-1 px-4 rounded">Save</button>
              <button onClick={() => setRescheduleId(null)} className="ml-2 bg-gray-300 py-1 px-4 rounded">Cancel</button>
            </div>
          )}

          <h2 className="text-xl font-semibold mt-10 mb-3">Confirmed Meetings</h2>
          {meetings.length === 0 ? <p className="text-gray-500">No meetings confirmed yet.</p> : meetings.map(m => (
            <div key={m.$id} className="bg-white p-4 rounded shadow flex justify-between items-center mb-3">
              <div>
                <p className="font-medium">{m.username}</p>
                <p className="text-sm text-gray-500">{new Date(m.PreferedDate).toLocaleString()}</p>
              </div>
              <button onClick={() => window.open(m.meetingurl, '_blank')} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Join</button>
            </div>
          ))}
        </motion.div>
      </main>
    </>
  );
};

export default ProfessionalDashboard;
