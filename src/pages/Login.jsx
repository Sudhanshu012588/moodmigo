import React, { useEffect, useState } from "react";
import { account } from "../appwrite/config";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../appwrite/Auth";
import { ID } from "appwrite";
const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

   login(user.email, user.password)
      .then((response) => {
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Login error:", error);
        alert("Failed to log in: " + error.message);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e9ecf4] via-[#f2edf8] to-[#eaf6eb]">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500">
          MoodMigo
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-900">
          Welcome Back!
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Log in to continue your mental wellness journey.
        </p>

        <form onSubmit={handleFormSubmit}>
          <div className="mb-4 text-left">
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={user.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="mb-4 text-left">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-700">Password</label>
              <Link to="/forgot-password" className="text-sm text-purple-500 hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={user.password}
              onChange={handleInputChange}
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
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
