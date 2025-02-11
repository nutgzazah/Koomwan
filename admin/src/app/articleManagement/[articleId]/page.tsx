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
      <p className="text-detail_3 text-secondary">เขียนเมื่อ {blog.publish_date}</p>

      {/* Category */}
      <div className="flex items-center space-x-2 mb-4">
        <p className='text-detail_3 text-secondary'>หมวดหมู่ : </p>
        {blog.category.map((cat) => (
          <span
            key={cat}
            className="btn lightblue-btn p-2 rounded-md"
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
      <div className="text-detail_2 text-secondary leading-relaxed">
        {blog.content}
      </div>
    </div>
  );
};

export default ArticleId;
