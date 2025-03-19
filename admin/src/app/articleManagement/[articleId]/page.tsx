"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BlogInterface } from "@/interfaces/blogInterface";
import Link from "next/link";
import axios from "axios";
import { formatDate } from "@/utils/formatDate.";
import BlogImageHandler from "@/utils/blogImageHandler";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080";

const ArticleId: React.FC = () => {
  const { articleId } = useParams();
  const [blog, setBlog] = useState<BlogInterface | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!articleId) return;
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/admin/blog/${articleId}`);
        console.log("Fetched blog data:", response.data);
        setBlog(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };
    fetchBlog();
  }, [articleId]);

  useEffect(() => {
    const loadImageUrl = async () => {
      if (!blog?.image) {
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching blog image using getCurrentBlogImage: ${blog.image}`);
        const fetchedImageUrl = await BlogImageHandler.getCurrentBlogImage(blog.image);
        setImageUrl(fetchedImageUrl || `${BASE_URL}/uploads/${blog.image}`);
      } catch (error) {
        console.error("Error fetching image URL:", error);
        setImageUrl(`${BASE_URL}/uploads/${blog.image}`);
      } finally {
        setLoading(false);
      }
    };

    if (blog?.image) {
      loadImageUrl();
    }
  }, [blog]);

  if (!blog) {
    return (
      <div className="text-center p-4">
        <h1 className="text-detail_2 text-abnormal">ไม่พบบทความ</h1>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {/* Edit Button */}
      <div className="absolute top-0 right-0">
        <Link href={`/articleManagement/${articleId}/editArticle`}>
          <button className="p-2 btn blue-btn rounded-md">แก้ไข</button>
        </Link>
      </div>

      {/* Header Section */}
      <h2 className="text-headline_3 text-secondary">{blog.title}</h2>
      <p className="text-detail_3 text-secondary">เขียนเมื่อ {formatDate(blog.date)}</p>

      {/* Category */}
      <div className="flex items-center space-x-2 mb-4">
        <p className="text-detail_3 text-secondary">หมวดหมู่ :</p>
        {Array.isArray(blog.category) ? (
          blog.category.map((cat) => (
            <span key={cat} className="btn lightblue-btn p-2 rounded-md">{cat}</span>
          ))
        ) : (
          <span className="btn lightblue-btn p-2 rounded-md">{blog.category}</span>
        )}
      </div>

      {/* Image */}
      <div className="w-full h-64 md:h-80 lg:h-96 mb-6 overflow-hidden rounded-md">
        {!loading && (
          <Image
            src={imageUrl}
            alt={blog.title}
            width={300}
            height={300}
            className="w-full h-full object-cover rounded-md"
          />
        )}
      </div>

      {/* Content */}
      <div className="text-detail_2 text-secondary leading-relaxed">{blog.content}</div>
    </div>
  );
};

export default ArticleId;
