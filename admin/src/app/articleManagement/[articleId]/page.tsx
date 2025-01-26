'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { BlogInterface } from '@/interfaces/blogInterface';
import Link from 'next/link';
import blogs from '../../../data/blog.json';

const ArticleId: React.FC = () => {
  const { articleId } = useParams();
  const blogList = blogs as BlogInterface[];
  const blog = blogList.find((b) => b.blog_id === articleId);

  if (!blog) {
    return (
      <div className="text-center p-4">
        <h1 className="text-xl text-red-500">ไม่พบบทความ</h1>
      </div>
    );
  }

  return (
    <div className="w-full p-4 relative">
      {/* Edit Button */}
      <div className="absolute top-4 right-4">
        <Link href={`/articleManagement/${articleId}/editArticle`}>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            แก้ไข
          </button>
        </Link>
      </div>

      {/* Header Section */}
      <h2 className="text-display text-primary font-bold mb-2">{blog.title}</h2>
      <p className="text-sm text-gray-500 mb-4">เขียนเมื่อ {blog.publish_date} โดย {blog.author}</p>

      {/* Category and Tags */}
      <div className="flex items-center space-x-2 mb-4">
        {blog.category.map((cat) => (
          <span
            key={cat}
            className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm"
          >
            {cat}
          </span>
        ))}
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
      <div className="text-lg text-gray-800 leading-relaxed">
        {blog.content}
      </div>
    </div>
  );
};

export default ArticleId;
