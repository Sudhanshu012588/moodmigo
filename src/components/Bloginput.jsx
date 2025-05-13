import React, { useState } from "react";
import db from "../appwrite/databases";
const InputBlog = () => {
  const [formData, setFormData] = useState([]); // array of blog entries
  const [blog, setBlog] = useState({
    title: "",
    content: "",
  }); // current blog being edited

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    // Add current blog to array
    setFormData((prevData) => [...prevData, blog]);

    console.log("All blogs so far:", [...formData, blog]);

    // Reset blog input
    setBlog({
      title: "",
      content: "",
    });
    await db.blog.create(
      {
        title: blog.title,
        content: blog.content,
      },
      ["any"],
      "unique()"
    )
      .then((response) => {
        console.log("Blog created successfully:", response);
      })
      .catch((error) => {
        console.error("Error creating blog:", error);
      });
  };

  return (
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
          value={blog.title}
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
          value={blog.content}
          onChange={handleChange}
          placeholder="Write your blog content here..."
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
  );
};

export default InputBlog;
