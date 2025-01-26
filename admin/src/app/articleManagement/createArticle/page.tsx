'use client';

import React, { useState } from "react";
import { BlogInterface } from "@/interfaces/blogInterface";

const CreateArticle: React.FC = () => {
  const [blog, setBlog] = useState<Partial<BlogInterface>>({
    title: "",
    author: "",
    publish_date: "",
    category: [],
    image: "",
    content: "",
  });

  const categories = [
    "การดูแลสุขภาพ",
    "ความรู้",
    "โภชนาการ",
    "การออกกำลังกาย",
    "โรค",
    "จิตใจ",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (category: string) => {
    setBlog((prev) => {
      const updatedCategories = prev.category?.includes(category)
        ? prev.category.filter((cat) => cat !== category)
        : [...(prev.category || []), category];
      return { ...prev, category: updatedCategories };
    });
  };

  const handleSubmit = () => {
    // Submit logic goes here
    console.log("Blog submitted: ", blog);
  };

  return (
    <div className="p-8 w-full">
      <h2 className="text-3xl font-bold mb-8">จัดการบทความ</h2>

      <div className="mb-6">
        <label className="block font-bold mb-2" htmlFor="title">เพิ่มบทความ</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="ชื่อบทความ"
          value={blog.title || ""}
          onChange={handleChange}
          className="px-4 py-2 border rounded-md focus:outline-none w-full text-lg"
        />
      </div>

      <div className="mb-6">
        <label className="block font-bold mb-2" htmlFor="author">ผู้เขียน</label>
        <input
          type="text"
          id="author"
          name="author"
          placeholder="ผู้เขียน"
          value={blog.author || ""}
          onChange={handleChange}
          className="px-4 py-2 border rounded-md focus:outline-none w-full text-lg"
        />
      </div>

      <div className="mb-6">
        <label className="block font-bold mb-2">หมวดหมู่</label>
        <div className="flex flex-wrap gap-4">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={blog.category?.includes(category) || false}
                onChange={() => handleCategoryChange(category)}
                className="w-4 h-4"
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block font-bold mb-2" htmlFor="image">รูปภาพ</label>
        <input
          type="text"
          id="image"
          name="image"
          placeholder="URL ของรูปภาพ"
          value={blog.image || ""}
          onChange={handleChange}
          className="px-4 py-2 border rounded-md focus:outline-none w-full text-lg"
        />
        <div className="mt-4 w-full h-48 border-dashed border-2 rounded-md flex items-center justify-center">
          <span className="text-gray-500">เพิ่มรูปภาพ</span>
        </div>
      </div>

      <div className="mb-6">
        <label className="block font-bold mb-2" htmlFor="content">เนื้อหา</label>
        <textarea
          id="content"
          name="content"
          placeholder="กรอกเนื้อหา"
          value={blog.content || ""}
          onChange={handleChange}
          className="px-4 py-2 border rounded-md focus:outline-none w-full h-40 text-lg"
        ></textarea>
      </div>

      <div className="flex justify-between">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          ส่งบทความ
        </button>
        <button
          className="bg-gray-300 text-black px-6 py-2 rounded-md hover:bg-gray-400"
        >
          ยกเลิก
        </button>
      </div>
    </div>
  );
};

export default CreateArticle;
