import Image from "next/image";
import React from "react";
import Link from "next/link";

interface BlogCardProps {
  blog_id: string;
  title: string;
  image?: string;
  category?: string[];
}

export default function BlogCard({ blog_id, title, image, category = [] }: BlogCardProps) {
  return (
    <div className="bg-card flex flex-col border rounded-md shadow-md w-full overflow-hidden">
      {/* Blog Image */}
      <div className="w-full h-80 relative bg-ourGray">
        {image ? (
          <Image
            src={image}
            alt={title || "Blog Image"}
            layout="fill"
            objectFit="cover"
            className="rounded-t-md"
          />
        ) : (
          <div className="flex justify-center items-center w-full h-full">
            <p className="text-ourGray">No Image Available</p>
          </div>
        )}
      </div>

      {/* Blog Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-bold_detail text-secondary line-clamp-2">{title}</h2>

          <Link href={`/articleManagement/${blog_id}/editArticle`} passHref>
            <button
              className="p-2 btn blue-btn rounded-md"
              onClick={(e) => e.stopPropagation()}
            >
              แก้ไข
            </button>
          </Link>
        </div>

        {/* Categories */}
        {category.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {category.map((cat, index) => (
              <span key={index} className="btn lightblue-btn p-2 rounded-md">
                {cat}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
