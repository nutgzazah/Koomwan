'use client';

import React, { useState } from "react";
import { BlogInterface } from "@/interfaces/blogInterface";
import blogs from "../../data/blog.json";
import BlogCard from "./components/blogCard";
import Link from "next/link";

export default function BlogManagement() {
  const blogList = blogs as BlogInterface[];

  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredBlogs = blogList.filter((blog) => {
    const searchInFields = `${blog.title}`.toLowerCase();
    return searchInFields.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex min-h-screen space-y-3">
      <div className="w-full p-4">
        {/* Page Title */}
        <h2 className="text-display text-secondary text-left border-b-2 pb-4 mb-4">
          จัดการบทความ
        </h2>

        {/* Search Input */}
        <input
          type="text"
          placeholder="ค้นหาด้วยชื่อบทความ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-4 rounded border-2 focus:outline-slate-400"
        />

        {/* Blog List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <Link key={blog.blog_id} href={`/articleManagement/${blog.blog_id}`} passHref>
                <div>
                  <BlogCard
                    title={blog.title}
                    author={blog.author}
                    image={blog.image}
                    categories={Array.isArray(blog.category) ? blog.category : [blog.category]} // Ensure category is an array
                  />
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 text-center w-full col-span-full">
              ไม่พบบทความที่ตรงกับการค้นหา
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
