import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar.jsx";
import db from "../appwrite/databases.js";
import { toast } from "react-toastify";
import { useStore } from "../store/store";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp } from "lucide-react";
import {Client,Databases} from "appwrite"
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await db.blog.create({
        Author: User.name || "Anonymous",
        title: blogInput.title,
        content: blogInput.content,
        profilephoto: User.profilepicture || "",
      });

      setBlogs((prev) => [response, ...prev]);
      toast.success("Blog created successfully!");
      setBlogInput({ title: "", content: "" });
      setShowInputSection(false);
    } catch (err) {
      toast.error("Failed to create blog.");
    }
  };

  const handleWriteBlogClick = () => {
    setShowInputSection(!showInputSection);
  };

  const handleLike = async (id) => {
  try {
    const client = new Client()
      .setEndpoint('https://fra.cloud.appwrite.io/v1')
      .setProject('6820683500148a9573af');

    const database = new Databases(client);

    // Get the existing blog document
    const doc = await database.getDocument(
      '6820add100102346d8b7', // Database ID
      '6822e8c100362034035e', // Collection ID
      id                      // Document ID
    );

    console.log("Likes",doc.Likes)

    // Update the 'Likes' field
    await database.updateDocument(
      '6820add100102346d8b7',
      '6822e8c100362034035e',
      id,
      {
        Likes: (doc.Likes || 0) + 1,
      }
    );

    toast.success(`Liked the blog by ${doc.Author}`);
  } catch (error) {
    console.error(error);
    toast.error("Can't like the blog. Please login again.");
  }
};

  return (
    <>
      <Navbar />

      <div className="py-6 px-6 bg-gradient-to-br from-[#ece9fe]  to-[#f9faff] flex justify-end ">
        <button
          onClick={handleWriteBlogClick}
          className="bg-gradient-to-r from-[#7f5af0] to-[#5c4fd6] hover:from-[#6d4ef6] hover:to-[#4d3ed3] text-white font-medium py-2 px-5 rounded-lg shadow-md"
        >
          {showInputSection ? "Cancel Writing" : "Write a Blog"}
        </button>
      </div>

      <AnimatePresence>
        {showInputSection && (
          <motion.div
            ref={inputSectionRef}
            className="bg-[#fafaff] flex flex-col items-center justify-center py-10 px-4"
            variants={inputVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-3xl "
            >
              <h2 className="text-2xl font-semibold text-[#3b3b3b] mb-4">Share Your Thoughts</h2>

              <input
                id="title"
                name="title"
                type="text"
                value={blogInput.title}
                onChange={handleChange}
                placeholder="Enter a captivating title"
                className="w-full border border-gray-300 px-4 py-2 mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f5af0]"
                required
              />

              <textarea
                id="content"
                name="content"
                value={blogInput.content}
                onChange={handleChange}
                placeholder="Write your blog content here..."
                rows={6}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f5af0]"
                required
              />

              <button
                type="submit"
                className="mt-4 w-full bg-gradient-to-r from-[#7f5af0] to-[#5c4fd6] text-white py-2 rounded-md hover:from-[#6d4ef6] hover:to-[#4d3ed3]"
              >
                Post Blog
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="py-12 px-6 bg-gradient-to-br from-[#f9faff] to-[#ece9fe] min-h-[60vh]">
        <h2 className="text-4xl font-bold text-center text-[#5c4fd6] mb-10">Community Blogs</h2>
        {loading ? (
          <div className="text-center text-gray-600">Loading blogs...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-gray-600">No blogs posted yet. Be the first!</div>
        ) : (
          <div className="space-y-8 max-w-5xl mx-auto">
            {blogs.map((blog, idx) => (
              <div className="bg-[#ede9ff] p-5 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#ede9ff] flex items-center justify-center text-[#5c4fd6] font-bold text-lg">
                    {blog.profilephoto ? (
                      <img src={blog.profilephoto} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      blog.Author ? blog.Author.charAt(0).toUpperCase() : "A"
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-[#2e2e2e] text-lg mb-1">{blog.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">By {blog.Author || "Anonymous"}</p>
                    <p className="text-[#444] mb-4 leading-relaxed">{blog.content}</p>
                    <button
                      onClick={()=>handleLike(blog.$id)}
                      className="flex items-center gap-2 text-sm bg-[#ede9ff] text-[#5c4fd6] hover:bg-[#ddd7ff] font-medium py-1.5 px-4 rounded-full transition"
                    >
                      {blog.Likes}
                      <ThumbsUp size={16} /> Like
                    </button>
                  </div>
                </div>
                </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}