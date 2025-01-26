import Image from "next/image";
import React from "react";

interface BlogCardProps {
    title: string;
    author: string;
    image: string; 
    categories: string[];
}

export default function BlogCard({ title, author, image, categories }: BlogCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border w-96 overflow-hidden">
      {/* Blog Image */}
      <div className="w-full h-64 relative bg-gray-200">
        {image ? (
          <Image
            src={image}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        ) : (
          <div className="flex justify-center items-center w-full h-full">
            <p className="text-gray-500">No Image Available</p>
          </div>
        )}
      </div>

      {/* Blog Content */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {title}
          </h2>

          {/* Edit Button */}
          <button className="p-1 bg-blue-100 text-blue-600 text-sm font-medium rounded hover:bg-blue-200">
            แก้ไข
          </button>
        </div>

        <p className="text-sm text-gray-500">เขียนโดย: {author}</p>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
