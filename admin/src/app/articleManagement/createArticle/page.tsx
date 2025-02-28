'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BlogInterface } from "@/interfaces/blogInterface";
import axios from "axios";

const CreateArticle: React.FC = () => {
  const [blog, setBlog] = useState<Partial<BlogInterface>>({
    title: "",
    date: "",
    category: [],
    image: "",
    content: "",
    ref: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const categories = [
    "การดูแลสุขภาพ",
    "ความรู้",
    "โภชนาการ",
    "การออกกำลังกาย",
    "โรค",
    "ผู้ป่วยเบาหวาน",
    "อื่นๆ",
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

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!blog.title) errors.title = 'กรุณาใส่ชื่อบทความ';
    if (!blog.category || blog.category.length === 0) errors.category = 'กรุณาเลือกหมวดหมู่';
    if (!blog.content) errors.content = 'กรุณาใส่เนื้อหา';
    if (!blog.ref) errors.ref = 'กรุณาใส่แหล่งอ้างอิง';
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      const blogData = {
        ...blog,
        date: new Date().toISOString(),
        category: Array.isArray(blog.category) ? blog.category.join(", ") : blog.category,
      };
  
      await axios.post("http://localhost:8080/api/v1/admin/addBlog", blogData, {
        headers: { "Content-Type": "application/json" },
      });
  
      router.push("/articleManagement");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setServerError(error.response.data.message || "An error occurred");
      } else {
        setServerError("An unexpected error occurred");
      }
    }
  };  

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {serverError && <p className="text-red-500">{serverError}</p>}
      
      <div>
        <label className="text-bold_detail" htmlFor="title">ชื่อบทความ</label>
        <input type="text" id="title" name="title" placeholder="ชื่อบทความ" value={blog.title || ""} onChange={handleChange} className="input" />
        {errors.title && <p className="text-red-500 mt-2">{errors.title}</p>}
      </div>

      <div>
        <label className="text-bold_detail" htmlFor="ref">อ้างอิง</label>
        <input type="text" id="ref" name="ref" placeholder="อ้างอิง" value={blog.ref || ""} onChange={handleChange} className="input" />
        {errors.ref && <p className="text-red-500 mt-2">{errors.ref}</p>}
      </div>

      <div>
        <label className="text-bold_detail">หมวดหมู่</label>
        <div className="flex flex-wrap gap-4">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2">
              <input type="checkbox" checked={blog.category?.includes(category) || false} onChange={() => handleCategoryChange(category)} className="w-4 h-4" />
              {category}
            </label>
          ))}
        </div>
        {errors.category && <p className="text-red-500 mt-2">{errors.category}</p>}
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
        <textarea id="content" name="content" placeholder="กรอกเนื้อหา" value={blog.content || ""} onChange={handleChange} className="input h-64"></textarea>
        {errors.content && <p className="text-red-500 mt-2">{errors.content}</p>}
      </div>

      <div className="flex justify-center space-x-4">
        <button onClick={handleSubmit} className="btn blue-btn short-btn">ส่งบทความ</button>
        <button onClick={handleCancel} className="btn white-btn short-btn">ยกเลิก</button>
      </div>
    </div>
  );
};

export default CreateArticle;
