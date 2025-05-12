import React, { useState } from "react";
import { Link, NavigationType } from "react-router-dom";
import { account, ID } from "../appwrite/config";
import { login, signup } from "../appwrite/Auth";
import { useNavigate } from "react-router-dom";



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

    await signup(user.name, user.email, user.password).then(navigator('/')).catch((error)=>{console.log(error)})
  };
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const { name, email, password, confirmPassword } = user;

//   if (!name || !email || !password || !confirmPassword) {
//     alert("Please fill all the fields");
//     return;
//   }

//   if (password !== confirmPassword) {
//     alert("Passwords do not match");
//     return;
//   }

//   try {
//     // Sign up the user
//     await signup(name, email, password);

//     // Log in the user immediately after signup
//     await account.createEmailSession(email, password);

//     // Optional: Fetch the current user (for confirmation or display)
//     const currentUser = await account.get();
//     console.log("Logged in as:", currentUser);

//     // Redirect to dashboard
//     navigator("/dashboard");
//   } catch (err) {
//     console.error("Signup or login failed:", err);
//     alert(err.message);
//   }
// };
  return (
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
            className="w-full bg-purple-500 text-white font-semibold py-2 rounded-md hover:bg-purple-600 transition duration-200"
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
  );
}
