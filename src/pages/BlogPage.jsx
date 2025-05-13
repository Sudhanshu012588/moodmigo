import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar.jsx";
import db from "../appwrite/databases.js";
import { toast } from "react-toastify";
import { useStore } from "../store/store";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Import animation components

const inputVariants = {
  initial: { height: 0, opacity: 0, overflow: "hidden" },
  animate: { height: "auto", opacity: 1, overflow: "visible", transition: { duration: 0.3 } },
  exit: { height: 0, opacity: 0, overflow: "hidden", transition: { duration: 0.3 } },
};

export default function BlogSection() {
  const User = useStore((state) => state.User);
  const [blogs, setBlogs] = useState([]);
  const [showInputSection, setShowInputSection] = useState(false);
  const [blogInput, setBlogInput] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const inputSectionRef = useRef(null);

  // Fetch existing blogs on mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await db.blog.list([]);
        setBlogs(response.documents);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setError("Failed to load blogs. Please try again later.");
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await db.blog.create({
        Author: User.name || "Anonymous",
        title: blogInput.title,
        content: blogInput.content,
      });

      // Immediately update the blog list without re-fetching
      setBlogs((prev) => [response, ...prev]);
      toast.success("Blog created successfully!");
      setBlogInput({ title: "", content: "" });
      setShowInputSection(false); // Hide input after successful submission
    } catch (err) {
      toast.error("Failed to create blog.");
    }
  };

  const handleWriteBlogClick = () => {
    setShowInputSection(!showInputSection);
  };

  return (
    <>
      <Navbar />

      {/* Write a Blog Button */}
      <div className="py-6 px-4 bg-gray-100 flex justify-end">
        <button
          onClick={handleWriteBlogClick}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {showInputSection ? "Cancel Writing" : "Write a Blog"}
        </button>
      </div>

      {/* Blog Input Section with Animation */}
      <AnimatePresence>
        {showInputSection && (
          <motion.div
            ref={inputSectionRef}
            className="bg-gradient-to-br from-[#f0f4fa] via-[#f9f5fc] to-[#f0f7f2] flex flex-col items-center justify-center py-8 px-4"
            variants={inputVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-xl shadow-md space-y-4 w-full max-w-2xl"
            >
              <h2 className="text-xl font-bold text-gray-800">Create a Blog</h2>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={blogInput.title}
                  onChange={handleChange}
                  placeholder="Enter blog title"
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={blogInput.content}
                  onChange={handleChange}
                  placeholder="Write your blog content here...!! Limit 1000 words"
                  rows={6}
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
              >
                Post Blog
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blog Display Section (YouTube Comment Style) */}
      <div className="py-12 px-4 bg-gradient-to-br from-[#f0f4fa] via-[#f9f5fc] to-[#f0f7f2]">
        <h2 className="text-3xl font-bold text-center text-purple-600 mb-8">Community Blogs</h2>
        {loading ? (
          <div className="text-center text-gray-600">Loading blogs...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-gray-600">No blogs posted yet. Be the first!</div>
        ) : (
          <div className="space-y-8"> {/* Increased space between blogs */}
            {blogs.map((blog, idx) => (
              <Link key={idx} to={`/blog/${blog.$id}`} className="block hover:shadow-md transition-shadow duration-300 bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {/* Placeholder for user avatar (you might fetch this) */}
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                      {blog.Author ? blog.Author.charAt(0).toUpperCase() : "A"}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800">{blog.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">By {blog.Author || "Anonymous"}</p>
                    <p className="text-gray-700">{blog.content}</p>
                    {/* You could add like/dislike buttons, reply, etc. here */}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}