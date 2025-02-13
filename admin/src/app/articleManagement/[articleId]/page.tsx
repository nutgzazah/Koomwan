'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BlogInterface } from '@/interfaces/blogInterface';
import Link from 'next/link';
import axios from 'axios';
import { formatDate } from '@/utils/formatDate.';

const ArticleId: React.FC = () => {
  const { articleId } = useParams();
  const [blog, setBlog] = useState<BlogInterface | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!articleId) return;

      try {
        const response = await axios.get(`http://localhost:8080/api/v1/admin/blog/${articleId}`);
        console.log("Fetched blog data:", response.data);

        setBlog(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };

    fetchBlog();
  }, [articleId]);

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
          <button className="p-2 btn blue-btn rounded-md">
            แก้ไข
          </button>
        </Link>
      </div>

      {/* Header Section */}
      <h2 className="text-headline_3 text-secondary">{blog.title}</h2>
      <p className="text-detail_3 text-secondary">เขียนเมื่อ {formatDate(blog.date)}</p>


      {/* Category */}
      <div className="flex items-center space-x-2 mb-4">
        <p className='text-detail_3 text-secondary'>หมวดหมู่ : </p>
        {Array.isArray(blog.category) 
          ? blog.category.map((cat) => (
              <span key={cat} className="btn lightblue-btn p-2 rounded-md">
                {cat}
              </span>
            ))
          : (
            <span className="btn lightblue-btn p-2 rounded-md">
              {blog.category}
            </span>
          )
        }
      </div>


      {/* Image */}
      <div className="w-full h-auto mb-6">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-auto object-cover rounded-md"
        />
      </div>

      {/* Content */}
      <div className="text-detail_2 text-secondary leading-relaxed">
        {blog.content}
      </div>
    </div>
  );
};

export default ArticleId;
