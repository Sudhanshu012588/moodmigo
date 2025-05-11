import React, { useState } from "react";
import { account } from "../appwrite/config";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    if (!user.email || !user.password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      const session = await account.createEmailPasswordSession(user.email, user.password);
      console.log(session);
      alert("Login successful!");
      navigate("/dashboard"); // Navigate after successful login
    } catch (error) {
      console.error(error);
      alert("Error logging in: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e9ecf4] via-[#f2edf8] to-[#eaf6eb]">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500">
          MoodMigo
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">
          Welcome Back
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Sign in to continue your mental wellness journey
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-left">
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={user.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="mb-4 text-left">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
              <Link to="/forgot-password" className="text-sm text-purple-500 hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={user.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 text-white font-semibold py-2 rounded-md hover:bg-purple-600 transition duration-200"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-700">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-purple-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
