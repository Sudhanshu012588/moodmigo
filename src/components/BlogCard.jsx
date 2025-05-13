import React from "react";

export default function BlogCard({ author, content }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6 max-w-3xl mx-auto transition hover:shadow-lg border border-gray-100">
      <div className="text-sm text-gray-500 mb-2">Written by</div>
      <h3 className="text-lg font-semibold text-purple-700 mb-3">{author}</h3>
      <p className="text-gray-800 leading-relaxed">{content}</p>
    </div>
  );
}
