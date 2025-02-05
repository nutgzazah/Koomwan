'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BlogInterface } from "@/interfaces/blogInterface";
import blogs from "../../data/blog.json";
import BlogCard from "./components/blogCard";
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
        blog.category.some(
          (cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
        )
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
    <div className="flex flex-col items-center min-h-screen w-full space-y-4">
        <div className="w-full flex gap-2">
          <input
            type="text"
            placeholder="ค้นหาด้วยชื่อบทความ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full input"
          />
          <SearchCategory
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <button
            onClick={handleCreateBlog}
            className="btn blue-btn px-5 rounded-full"
          >
            <p className="text-center">+</p>
          </button>
        </div>

      {/* Blog List */}
      <div className="w-full">
        {filteredCategory.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredCategory.map(({ blog_id, title, image, category }) => (
              <div 
                key={blog_id} 
                className="w-full cursor-pointer"
                onClick={() => router.push(`/articleManagement/${blog_id}`)}
              >
                <BlogCard
                  blog_id={blog_id}
                  title={title}
                  image={image}
                  category={Array.isArray(category) ? category : [category]}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center w-full min-h-[50vh] text-detail_2">
            <p className="text-center">ไม่พบบทความที่ตรงกับการค้นหา</p>
          </div>
        )}
      </div>
    </div>
  );
}
