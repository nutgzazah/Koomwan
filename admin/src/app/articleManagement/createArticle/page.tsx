'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BlogInterface } from "@/interfaces/blogInterface";

const CreateArticle: React.FC = () => {
  const [blog, setBlog] = useState<Partial<BlogInterface>>({
    title: "",
    publish_date: "",
    category: [],
    image: "",
    content: "",
    ref: "",
  });
   const router = useRouter();

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
    console.log("Blog submitted: ", blog);
    router.push("/articleManagement")
  };

  const handleCancel = () => {
    router.back()
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div>
        <label className="text-bold_detail" htmlFor="title">ชื่อบทความ</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="ชื่อบทความ"
          value={blog.title || ""}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div>
        <label className="text-bold_detail" htmlFor="ref">อ้างอิง</label>
        <input
          type="text"
          id="ref"
          name="ref"
          placeholder="อ้างอิง"
          value={blog.ref || ""}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div>
        <label className="text-bold_detail">หมวดหมู่</label>
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

      <div>
        <label className="text-bold_detail" htmlFor="image">รูปภาพ</label>
        <input
          type="text"
          id="image"
          name="image"
          placeholder="URL ของรูปภาพ"
          value={blog.image || ""}
          onChange={handleChange}
          className="input"
        />
        <div className="mt-4 w-full h-48 border-dashed border-2 rounded-md flex items-center justify-center">
          <span className="text-gray-500">เพิ่มรูปภาพ</span>
        </div>
      </div>

      <div>
        <label className="text-bold_detail" htmlFor="content">เนื้อหา</label>
        <textarea
          id="content"
          name="content"
          placeholder="กรอกเนื้อหา"
          value={blog.content || ""}
          onChange={handleChange}
          className="input h-64"
        ></textarea>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={handleSubmit}
          className="btn blue-btn short-btn"
        >
          ส่งบทความ
        </button>
        <button
          onClick={handleCancel}  
          className="btn white-btn short-btn"
        >
          ยกเลิก
        </button>
      </div>
    </div>
  );
};

export default CreateArticle;
