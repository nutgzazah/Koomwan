'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BlogInterface } from '@/interfaces/blogInterface';
import Link from 'next/link';
import axios from 'axios';
import { formatDate } from '@/utils/formatDate.';

const BASE_URL = 'http://localhost:8080'; 

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
    const fetchImageUrl = async () => {
      if (!blog?.image) {
        setLoading(false);
        return;
      }

      try {
        let folder = "blogImage";
        let fileName = blog.image;

        if (blog.image.includes("/")) {
          const parts = blog.image.split("/");
          folder = parts[0];
          fileName = parts[1];
        }

        const response = await axios.get(`${BASE_URL}/api/v1/storage/getFileUrl`, {
          params: { fileName, folder },
        });

        setImageUrl(response.data.success ? response.data.url : `${BASE_URL}/uploads/${blog.image}`);
      } catch (error) {
        console.error("Error fetching image URL:", error);
        setImageUrl(`${BASE_URL}/uploads/${blog.image}`);
      } finally {
        setLoading(false);
      }
    };

    if (blog?.image) {
      fetchImageUrl();
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
        <p className='text-detail_3 text-secondary'>หมวดหมู่ :</p>
        {Array.isArray(blog.category) ? (
          blog.category.map((cat) => (
            <span key={cat} className="btn lightblue-btn p-2 rounded-md">{cat}</span>
          ))
        ) : (
          <span className="btn lightblue-btn p-2 rounded-md">{blog.category}</span>
        )}
      </div>

      {/* Image */}
      <div className="w-full h-64 md:h-80 lg:h-96 mb-6 overflow-hidden rounded-md"> {/* Set fixed height and responsive adjustments */}
        {!loading && (
          <img
            src={imageUrl}
            alt={blog.title}
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
