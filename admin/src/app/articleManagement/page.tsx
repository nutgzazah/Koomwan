'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BlogInterface } from "@/interfaces/blogInterface";
import blogs from "../../data/blog.json";
import BlogCard from "./components/blogCard";
import Link from "next/link";
import SearchCategory from "./components/Category";

export default function BlogManagement() {
  const router = useRouter();
  const blogList = blogs as BlogInterface[];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredBlogs = blogList.filter((blog) => {
    const searchInFields = `${blog.title}`.toLowerCase();
    return searchInFields.includes(searchTerm.toLowerCase());
  });

  const filteredCategory =
    selectedCategory === "All"
      ? filteredBlogs
      : filteredBlogs.filter((blog) =>
          blog.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  const handleCreateBlog = () => {
    const session = true; 
    if (!session) {
      router.push("/login");
    } else {
      router.push("/articleManagement/createArticle");
    }
  };

  return (
    <div className="flex min-h-screen space-y-3">
      <div className="w-full p-4">
        {/* Page Title */}
        <h2 className="text-display text-secondary text-left border-b-2 pb-4 mb-4">
          จัดการบทความ
        </h2>

        {/* Search Input */}
        <div className="w-full flex gap-2">
          <input
            type="text"
            placeholder="ค้นหาด้วยชื่อบทความ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 mb-4 rounded border-2 focus:outline-slate-400"
          />
          <SearchCategory
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <button
            onClick={handleCreateBlog}
            className="bg-zinc-950 p-0 text-white leading-none border rounded-3xl w-10 h-10 min-w-10 min-h-10 flex justify-center items-center hover:shadow hover:bg-zinc-800"
          >
            <p className="flex font-bold text-center self-center">+</p>
          </button>
        </div>

        {/* Blog List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategory.length > 0 ? (
            filteredCategory.map((blog) => (
              <Link
                key={blog.blog_id}
                href={`/articleManagement/${blog.blog_id}`}
                passHref
              >
                <div>
                  <BlogCard
                    title={blog.title}
                    author={blog.author}
                    image={blog.image}
                    categories={
                      Array.isArray(blog.category) ? blog.category : [blog.category]
                    }
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
