import React, { useState } from "react";
import { Link, NavigationType } from "react-router-dom";
import { account, ID } from "../appwrite/config";
import { login, signup } from "../appwrite/Auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import axios from "axios";


export default function Signup() {
  
  const navigator = useNavigate()
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  async function sendEmail() {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/send-email`, {
      to: user.email,
      subject: "Welcome to MoodMigo – Your Mental Wellness Companion 💙",
      text: `Hi ${user.name}

Welcome to MoodMigo 🎉 We’re so glad you’ve joined our community!

At MoodMigo, we believe that mental wellness is a journey — and we’re here to walk beside you every step of the way. With your new account, you can now:

🧘 Book online counselling sessions with certified experts

📝 Journal your thoughts and track your emotions daily

🤖 Chat with MANARAH, our AI wellness assistant

👥 Connect with a supportive community that understands you

✨ Your journey to better mental health starts today.

👉 Get Started with MoodMigo

We’re excited to see how MoodMigo can support your growth and wellness.
If you ever need help, just reach out — we’re always here for you 💙

Warmly,
The MoodMigo Team`,
    });

    console.log("Email sent:", response.data);
    alert("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    alert("Failed to send email.");
  }
}

  const handleSubmit = async(e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = user;

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all the fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    await signup(user.name, user.email, user.password).then(()=>{
      sendEmail();
      toast.success("Account created successfully, Login to continue");
      navigator('/')}).catch((error)=>{toast.success("Login to continue")});
  };
  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e9ecf4] via-[#f2edf8] to-[#eaf6eb]">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500">
            MoodMigo
          </h1>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">
          Welcome! Signup to MoodMigo
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Sign up for your mental wellness journey
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-left">
            <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
            <input
              name="name"
              type="text"
              value={user.name}
              onChange={handleChange}
              placeholder="Enter your Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
          </div>
          <div className="mb-4 text-left">
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
          </div>
          <div className="mb-4 text-left">
            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Enter your Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
          </div>
          <div className="mb-4 text-left">
            <label className="block text-sm font-medium mb-1 text-gray-700">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={user.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 text-white font-semibold py-2 rounded-md hover:bg-purple-600 transition duration-200 click:focus:ring-2 focus:ring-purple-400"
            >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
            </>
  );
}
