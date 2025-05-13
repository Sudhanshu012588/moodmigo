import React from "react";
import BlogCard from "../components/BlogCard";
import Navbar from "../components/Navbar.jsx";
import Bloginput from "../components/Bloginput.jsx";
import { useState } from "react";
export default function BlogSection() {

  const [blogs, setblog] = useState([]);
  return (
    <>
    <Navbar/>
    <div className="bg-gradient-to-br from-[#f0f4fa] via-[#f9f5fc] to-[#f0f7f2] flex flex-col items-center justify-center min-h-screen py-1 px-4">
      
    <Bloginput />
    </div>
    <div className="py-12 px-4 bg-gradient-to-br from-[#f0f4fa] via-[#f9f5fc] to-[#f0f7f2]">
      <h2 className="text-3xl font-bold text-center text-purple-600 mb-8">Community Blogs</h2>
      <div className="space-y-6">
        {blogs.map((blog, idx) => (
            <BlogCard key={idx} author={blog.author} content={blog.content} />
        ))}
      </div>
    </div>
        </>
  );
}
