import React, { useEffect, useState } from 'react';
import {
  Headphones, Calendar, BookOpen, MessageCircle, Users,Camera 
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
import { useMemo } from "react";

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const Dashboard = () => {
// Imports and constants
const navigate = useNavigate();
const today = new Date();
const formattedDate = today.toLocaleDateString("en-US", {
  month: "numeric",
  day: "numeric",
  year: "numeric",
});

// Zustand states
const user = useStore(state => state.User);
const setUser = useStore(state => state.setUser);
const score = useStore(state => state.score);
const setScore = useStore(state => state.setScore);

// Local states
const [numberOfTimes, setNumberOfTimes] = useState(0);
const [updateDate, setUpdateDate] = useState(null);
const [isLoading, setIsLoading] = useState(true);
const [numberOfBlogs, setNumberOfBlogs] = useState(0);
const [url, setUrl] = useState("");
const [professionals, setProfessionals] = useState([]);
const [journalEntries, setJournalEntries] = useState([]);
const [verifiedSessions, setVerifiedSessions] = useState([]);
 const [profileImageFile, setProfileImageFile] = useState(null); // Renamed for clarity
  const [coverImageFile, setCoverImageFile] = useState(null); // New state for cover image upload
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null); // State for image preview
  const [coverImagePreview, setCoverImagePreview] = useState(null); // State for cover image preview

const moods = [
  { emoji: "😄", label: "Happy" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😠", label: "Angry" },
  { emoji: "😰", label: "Anxious" },
];

const getEmojiForMood = (moodLabel) => {
  const found = moods.find(m => m.label.toLowerCase() === moodLabel.toLowerCase());
  return found ? found.emoji : "❓";
};

const fetchUserData = async () => {
  try {
    const tempUser = await account.get();
    setUser({
      id: tempUser.$id,
      name: tempUser.name,
      email: tempUser.email,
      password: '',
      isLoggedIn: true,
    });

    const scoreResponse = await db.UsersAttributes.list([
      Query.equal('UserId', tempUser.$id),
    ]);

    if (scoreResponse.documents.length > 0) {
      const doc = scoreResponse.documents[0];
      setScore(doc.newScore);
      setNumberOfTimes(doc.NumberOfTimesFilled);
      setUpdateDate(doc.lastUpdatedDate);
    } else {
      setScore(null);
    }

    const client = new Client().setEndpoint("https://fra.cloud.appwrite.io/v1").setProject("6826c7d8002c4477cb81");
    const database = new Databases(client);

    const proResponse = await database.listDocuments(
      "6826d3a10039ef4b9444",
      "68275039000cb886ff5c",
      [Query.equal("ClientId", tempUser.$id)]
    );

    if (proResponse.documents.length > 0) {
      setProfessionals(proResponse.documents);
    } else {
      setUrl("");
    }

    const blogResponse = await db.blog.list([]);
    setNumberOfBlogs(blogResponse.total ?? 0);

  } catch (error) {
    setUser(null);
    setScore(null);
  } finally {
    setIsLoading(false);
  }
};

const fetchJournals = async () => {
  const client = new Client().setEndpoint("https://fra.cloud.appwrite.io/v1").setProject("6820683500148a9573af");
  const database = new Databases(client);

  const response = await database.listDocuments("6820add100102346d8b7", "682ab3ed000b1c6f984c",[Query.equal("creatorid", user.id)]);
  if (response.documents.length > 0) {
    setJournalEntries(response.documents);
  }
};

const fetchVerifiedSessions = async () => {
  if (!user?.id) return;
  const client = new Client().setEndpoint("https://fra.cloud.appwrite.io/v1").setProject("6826c7d8002c4477cb81");
  const database = new Databases(client);

  const response = await database.listDocuments(
    "6826d3a10039ef4b9444",
    "68275039000cb886ff5c",
    [Query.equal("ClientId", user.id)]
  );

  const todayDateStr = today.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });

  const filtered = response.documents.filter(doc => doc.date === todayDateStr);
  setVerifiedSessions(filtered);
};
const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file)
    if (file) {
      setProfileImageFile(file);
      setProfilePhotoPreview(URL.createObjectURL(file)); // Create a preview URL
    }
  };

 const handleCoverImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setCoverImageFile(file); // Assuming you have this in useState
    console.log("Selected file:", coverImageFile);
  }
};

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "preset"); // Ensure this preset is configured in Cloudinary

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dzczys4gk/image/upload`, // Replace with your Cloudinary cloud name
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error("Cloudinary upload failed: " + data.error.message);
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };
const handleCoverUpload = async () => {
    if (!coverImageFile) {
      toast.success("Please select a cover image first.");
      return;
    }

    setUploadingCover(true);
    try {
      const imageUrl = await uploadImageToCloudinary(coverImageFile);
      const payload = {
        id: user.id,
        coverImage: imageUrl,
      };

       const client = new Client()
      .setEndpoint("https://fra.cloud.appwrite.io/v1")
      .setProject("6820683500148a9573af");

    const database = new Databases(client);
    const userattribute = await database.listDocuments(
      '6820add100102346d8b7',
      '6825e61f00204ab15ecf',
      [Query.equal('UserId', user.id)]
    );

    if (userattribute.total > 0) {
      const docId = userattribute.documents[0].$id;

      await database.updateDocument(
        '6820add100102346d8b7',
        '6825e61f00204ab15ecf',
        docId,
        {
          coverimage: imageUrl,
        }
      );

      setUser({ ...user, coverimage: imageUrl });
      toast.success("Cover image updated successfully!");
    }
    } catch (error) {
      console.error("Error updating cover image:", error);
      toast.success("Failed to update cover image.");
    } finally {
      setUploadingCover(false);
      setCoverImageFile(null); // Clear the selected file
    }
  };

  const handleProfileUpload = async () => {
  if (!profileImageFile) {
    toast.error("Please select a profile image first.");
    return;
  }

  setUploadingProfile(true);

  try {
    const imageUrl = await uploadImageToCloudinary(profileImageFile);

    const payload = {
      id: user.id,
      profilePhoto: imageUrl,
    };

    const client = new Client()
      .setEndpoint("https://fra.cloud.appwrite.io/v1")
      .setProject("6820683500148a9573af");

    const database = new Databases(client);
    const userattribute = await database.listDocuments(
      '6820add100102346d8b7',
      '6825e61f00204ab15ecf',
      [Query.equal('UserId', user.id)]
    );

    if (userattribute.total > 0) {
      const docId = userattribute.documents[0].$id;

      await database.updateDocument(
        '6820add100102346d8b7',
        '6825e61f00204ab15ecf',
        docId,
        {
          profilepicture: imageUrl,
        }
      );

      setUser({ ...user, profilepicture: imageUrl });
      toast.success("Profile image updated successfully!");
    } else {
      toast.error("User document not found.");
    }
  } catch (error) {
    console.error("Error updating profile image:", error);
    toast.error("Failed to update profile image.");
  } finally {
    setUploadingProfile(false);
    setProfileImageFile(null);
  }
};

const setprofilepictures = async () => {
  const client = new Client()
    .setEndpoint("https://fra.cloud.appwrite.io/v1")
    .setProject("6820683500148a9573af");

  const database = new Databases(client);
  const userattribute = await database.listDocuments(
    '6820add100102346d8b7',
    '6825e61f00204ab15ecf',
    [Query.equal('UserId', user.id)]
  );

  if (userattribute.total > 0) {
    const document = userattribute.documents[0];
    setUser({
      profilepicture:document.profilepicture,
      coverimage:document.coverimage
    })
  }
};
useEffect(() => {


    setprofilepictures();
}, []); // Add `user.id` as a dependency

useEffect(() => {
  console.log(user.profilepicture)
}, [user.profilepicture])



useEffect(() => {
  setprofilepictures();
  fetchUserData();
  fetchJournals();
}, [setUser, setScore]);

useEffect(() => {
  fetchVerifiedSessions();
  setprofilepictures();
}, [user?.id]);
  const date = new Date();
const todayFormatted = date.toLocaleString("en-US", {
          month: "numeric",
          day: "numeric",
          year: "numeric",
        }).replace(",", ""); 
  if (isLoading) return <MoodMigoLoading />;

  return (
   <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
        <div className="w-full space-y-12 ">

          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center relative"
          >
            {/* Cover Section */}
{/* Cover Section */}
<div className="relative h-80 group bg-gray-300 dark:bg-gray-700 overflow-hidden rounded-b-xl">
  {/* Make entire cover area clickable */}
  <label htmlFor="cover-upload" className="block w-full h-full cursor-pointer">
    <img
      src={user.coverimage}
      alt="Cover"
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
  </label>

  {/* Hidden input for cover */}
  <input
    id="cover-upload"
    type="file"
    accept="image/*"
    onChange={(e) => {
      console.log("Cover image changed");
      handleCoverImageChange(e); // this should set coverImageFile
    }}
    disabled={uploadingCover}
    className="hidden"
  />

  {/* Camera icon in bottom right */}
  <label
    htmlFor="cover-upload"
    className="absolute bottom-3 right-3 z-10 bg-blue-600 p-2 rounded-full text-white shadow-md cursor-pointer hover:bg-blue-700 transition"
  >
    <Camera className="w-5 h-5" />
  </label>

  {/* Upload Button */}
  {coverImageFile && (
    <button
      onClick={handleCoverUpload}
      disabled={uploadingCover}
      className="absolute bottom-3 left-1/2 mb-50 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs hover:bg-green-600 shadow-md transition whitespace-nowrap z-20"
    >
      {uploadingCover ? "Uploading..." : "Save Photo"}
    </button>
  )}
</div>

{/* Profile Section */}
<div className="relative group w-max mx-auto -mt-16">
  {/* Make profile image clickable */}
  <label htmlFor="profile-upload" className="block relative w-max cursor-pointer">
    <img
      src={user.profilepicture}
      alt="Profile"
      className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
      loading="lazy"
    />
  </label>

  {/* Hidden input for profile */}
  <input
    id="profile-upload"
    type="file"
    accept="image/*"
    onChange={(e) => {
      console.log("Profile image changed");
      handleProfileImageChange(e); // this should set profileImageFile
    }}
    disabled={uploadingProfile}
    className="hidden"
  />

  {/* Camera icon in bottom-right of profile image */}
  <label
    htmlFor="profile-upload"
    className="absolute bottom-2 right-2 z-10 bg-blue-600 p-2 rounded-full text-white shadow-md cursor-pointer hover:bg-blue-700 transition-opacity opacity-100 sm:opacity-0 group-hover:opacity-100"
  >
    <Camera className="w-4 h-4" />
  </label>

  {/* Upload Button */}
  {profileImageFile && (
    <button
      onClick={handleProfileUpload}
      disabled={uploadingProfile}
      className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs hover:bg-green-600 shadow-md transition whitespace-nowrap z-20"
    >
      {uploadingProfile ? "Uploading..." : "Save Photo"}
    </button>
  )}
</div>



            <div className="mt-20 sm:mt-24">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 to-purple-600 text-transparent bg-clip-text">
                Welcome back, <span>{user?.name || 'User'}</span>!
              </h1>
              <p className="mt-2 text-gray-700 text-base sm:text-lg max-w-xl mx-auto">
                Your personalized mental wellness hub. Let's continue your journey.
              </p>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className='p-6 sm:p-8 lg:p-12 space-y-10'>

          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                label: 'MANARAH',
                description: 'Your mental health companion.',
                icon: <Users className="w-7 h-7 text-purple-600" />,
                onClick: () => navigate('/chat'),
              },
              {
                label: 'Fill the Questionnaire',
                description: 'Click here to fill our questionnaire',
                icon: <Calendar className="w-7 h-7 text-blue-600" />,
                onClick: () => navigate('/questionnaire'),
              },
              {
                label: `${numberOfBlogs} Blogs`,
                description: 'Community Posts',
                icon: <MessageCircle className="w-7 h-7 text-yellow-500" />,
                onClick: () => navigate('/blog'),
              }
            ].map(({ label, description, icon, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="bg-white/90 backdrop-blur-md border border-gray-300 shadow-md hover:shadow-xl hover:scale-[1.04] transition-all rounded-xl p-7 flex flex-col focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                <div className="flex items-center gap-4">{icon}<h2 className="text-xl font-semibold text-gray-900">{label}</h2></div>
                <p className="text-sm sm:text-base text-gray-600 mt-2">{description}</p>
              </button>
            ))}
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

            {/* Left Column - Progress */}
            <div className="lg:col-span-1 space-y-10">
              {numberOfTimes > 1 ? (
                <motion.div
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col items-center bg-gradient-to-tr from-purple-100 to-blue-100 rounded-2xl p-8 shadow-lg">
                    <span className="text-sm font-medium px-5 py-2 rounded-full bg-gradient-to-r from-purple-300 to-blue-300 text-gray-900 shadow-md">
                      Your Progress
                    </span>
                    <div className="mt-6">
                      <CircularProgress score={score} />
                    </div>
                    <span className="mt-6 text-sm text-gray-700 bg-gradient-to-r from-purple-200 to-blue-200 px-4 py-2 rounded-full shadow-md">
                      Last Updated on: {updateDate || 'N/A'}
                    </span>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-gradient-to-r from-purple-200 to-blue-200 text-gray-800 px-5 py-3 rounded-2xl text-sm font-semibold shadow-sm border border-purple-300">
                  <div className="flex items-center gap-3">
                    <span role="img" aria-label="calendar">📅</span>
                    <p>Please complete the questionnaire again after 42 days to track your progress.</p>
                  </div>
                  <div className="bg-white/70 px-4 py-2 rounded-full border border-purple-300 text-xs">
                    Last Updated: {updateDate || 'N/A'}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="lg:col-span-3 space-y-12">

              {/* Upcoming Sessions */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.6 }}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-8 border border-gray-300 shadow-lg"
              >
                <h3 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">
                  Upcoming Sessions
                </h3>
                {professionals.length === 0 ? (
                  <p className="text-gray-500 text-center">No upcoming sessions.</p>
                ) : (
                  <div className="space-y-6">
                    {professionals.map((session) => (
                      <div
                        key={session.$id}
                        className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-5">
                          <Headphones className="w-7 h-7 text-purple-600" />
                          <div>
                            <p className="text-lg font-semibold text-gray-900">{session.name}</p>
                            <p className="text-sm text-gray-600">{session.date}</p>
                            <p className="text-sm text-gray-600">{session.time}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => window.open(session.meetingurl, '_blank')}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-sm font-semibold border border-green-600 shadow-md"
                        >
                          Join
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-6 text-center">
                  <button
                    onClick={() => navigate('/sessions')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-7 py-3 rounded-xl shadow-lg hover:shadow-xl transition-transform hover:scale-105 text-sm font-semibold"
                  >
                    Request New Session
                  </button>
                </div>
              </motion.div>

              {/* Journal Entries */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.6 }}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-8 border border-gray-300 shadow-lg max-w-3xl mx-auto"
              >
                <h3 className="text-2xl font-extrabold text-gray-900 mb-8 text-center">
                  Recent Journal Entries
                </h3>

                {journalEntries.length === 0 ? (
                  <p className="text-base text-center text-gray-500">No entries yet.</p>
                ) : (
                  journalEntries.map((entry) => (
                    <div
                      key={entry.$id}
                      className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-3xl">{getEmojiForMood(entry.Mood)}</span>
                        <h4 className="text-xl font-semibold text-gray-900">{entry.Mood}</h4>
                        <span className="ml-auto text-xs italic text-gray-400 select-none">
                          {new Date(entry.$createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-line text-gray-700">{entry.Body}</p>
                    </div>
                  ))
                )}

                <div className="flex gap-5 mt-6">
                  <button
                    onClick={() => navigate('/journal')}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-transform hover:scale-105 text-base font-semibold"
                  >
                    New Journal Entry
                  </button>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
        </div>
      </div>
    </>

  );
};

export default Dashboard;
