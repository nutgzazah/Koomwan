import Image from "next/image";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import axios from "axios";

interface BlogCardProps {
  blog_id: string;
  title: string;
  image?: string;
  category?: string[];
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080";

export default function BlogCard({ blog_id, title, image, category = [] }: BlogCardProps) {
  const [imageUrl, setImageUrl] = useState("/uploads/koomwanAvatar01.png");

  const fetchImageUrl = useCallback(async () => {
    if (!image || image.startsWith("/uploads")) return;

    try {
      let folder = "blogImage";
      let fileName = image;

      const lastSlashIndex = image.lastIndexOf("/");
      if (lastSlashIndex !== -1) {
        folder = image.substring(0, lastSlashIndex);
        fileName = image.substring(lastSlashIndex + 1);
      }

      const response = await axios.get(`${BASE_URL}/api/v1/storage/getFileUrl`, {
        params: { fileName, folder },
      });

      setImageUrl(response.data.success ? response.data.url : `${BASE_URL}/uploads/${image}`);
    } catch (error) {
      console.error("Error fetching image URL:", error);
      setImageUrl(`${BASE_URL}/uploads/${image}`);
    }
  }, [image]);

  useEffect(() => {
    fetchImageUrl();
  }, [fetchImageUrl]);

  return (
    <div className="bg-card flex flex-col border rounded-md shadow-md w-full h-[500px] overflow-hidden">
      {/* Blog Image */}
      <div className="w-full h-80 relative bg-ourGray">
        <Image
          src={imageUrl}
          alt={title || "Blog Image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          className="rounded-t-md"
          priority
        />
      </div>

      {/* Blog Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-bold_detail text-secondary line-clamp-2">{title}</h2>

          <Link href={`/articleManagement/${blog_id}/editArticle`} passHref>
            <button className="p-2 btn blue-btn rounded-md" onClick={(e) => e.stopPropagation()}>
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
