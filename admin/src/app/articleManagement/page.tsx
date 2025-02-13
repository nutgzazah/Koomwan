'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BlogInterface } from "@/interfaces/blogInterface";
import BlogCard from "./components/blogCard";
import SearchCategory from "./components/Category";

export default function BlogManagement() {
  const router = useRouter();
  const [blogList, setBlogList] = useState<BlogInterface[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/admin/blog");
        console.log("Fetched blog data:", response.data.data);
        setBlogList(response.data.data);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };

    fetchBlogs();
  }, []);

  // Filter by search term
  const filteredBlogs = blogList.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter by category
  const filteredCategory =
    selectedCategory === "ทั้งหมด"
      ? filteredBlogs
      : filteredBlogs.filter((blog) => {
          const categories = Array.isArray(blog.category) ? blog.category : [blog.category];
          return categories.some((cat) => cat.toLowerCase() === selectedCategory.toLowerCase());
        });

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
            {filteredCategory.map(({ _id, title, image, category }) => (
              <div 
                key={_id} 
                className="w-full cursor-pointer"
                onClick={() => router.push(`/articleManagement/${_id}`)}
              >
                {/* เว้นรูปไว้ก่อน */}
                <BlogCard
                  blog_id={_id}
                  title={title}
                  // image={image}
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
