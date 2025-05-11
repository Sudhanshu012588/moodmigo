import React from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e9ecf4] via-[#f2edf8] to-[#eaf6eb]">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
        {/* Move MoodMigo logo/title here */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500">
            MoodMigo
          </h1>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">
          Welcome Signup to MoodMigo
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Sign up for your mental wellness journey
        </p>

        <form>
          <div className="mb-4 text-left">
            <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
            <input
              type="text"
              placeholder="Enter your Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div className="mb-4 text-left">
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div className="mb-4 text-left">
            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div className="mb-4 text-left">
            <label className="block text-sm font-medium mb-1 text-gray-700">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your Password"
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
          Already have an account?{" "}
          <Link to="/signup" className="text-purple-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
