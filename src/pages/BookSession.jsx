import React, { useEffect, useState } from 'react';
import { Client, Databases } from 'appwrite';
import MentorCard from '../components/MentorCard';
import Navbar from '../components/Navbar';
import MoodMigoLoading from '../components/Loading';
import PaymentPortal from './Premium';

function BookSession() {
  const [Mentors, setMentors] = useState([]);
  const [Rendering, setRendering] = useState(true);
  const [sessionBooking, setSessionBooking] = useState(false);

  useEffect(() => {
    const getMentors = async () => {
      const client = new Client()
        .setEndpoint('https://fra.cloud.appwrite.io/v1')
        .setProject('6826c7d8002c4477cb81');

      const database = new Databases(client);
      const mentorsRes = await database.listDocuments(
        '6826d3a10039ef4b9444',
        '6826dd9700303a5efb90'
      );
      setMentors(mentorsRes.documents);
      setRendering(false);
    };
    getMentors();
  }, []);

  const handleSessioncheck = () => {
    setSessionBooking(true);
  };

  if (Rendering) {
    return <MoodMigoLoading />;
  }

  return (
    <>
      <Navbar />
      <div className="bg-blue-100 min-h-screen p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
          {Mentors.map((mentor, index) => (
            <div key={index} className="w-full h-full flex">
              <MentorCard
                username={mentor.username}
                bio={mentor.bio}
                MentorID={mentor.id}
                specialties={mentor.specialties}
                Charges={mentor.Charges}
                profilephoto={mentor.profilephoto}
                session={handleSessioncheck}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Modal Rendered Here */}
      <PaymentPortal
        isOpen={sessionBooking}
        onClose={() => setSessionBooking(false)}
      />
    </>
  );
}

export default BookSession;
