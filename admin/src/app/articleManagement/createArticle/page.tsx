'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BlogInterface } from "@/interfaces/blogInterface";
import axios from "axios";
import Image from "next/image";

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(blog.image || null);
  const router = useRouter();

  const categories = [
    "ความรู้",
    "โภชนาการ",
    "โรค",
    "ออกกำลังกาย",
    "แรงบันดาลใจ",
    "ข่าวสาร",
    "อื่นๆ",
  ];

  // Handles text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  // Handles category selection
  const handleCategoryChange = (category: string) => {
    setBlog((prev) => ({
      ...prev,
      category: prev.category?.includes(category)
        ? prev.category.filter((c) => c !== category)
        : [...(prev.category || []), category],
    }));
  };

  // Handles file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Validates input fields
  const validate = () => {
    const errors: Record<string, string> = {};
    if (!blog.title) errors.title = "กรุณาใส่ชื่อบทความ";
    if (!imageFile) errors.image = "กรุณาเพิ่มรูปภาพ";
    if (!blog.category || blog.category.length === 0) errors.category = "กรุณาเลือกหมวดหมู่";
    if (!blog.content) errors.content = "กรุณาใส่เนื้อหา";
    if (!blog.ref) errors.ref = "กรุณาใส่แหล่งอ้างอิง";
    return errors;
  };

  // Handles form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", blog.title || "");
      formData.append("content", blog.content || "");
      formData.append("category", Array.isArray(blog.category) ? blog.category.join(", ") : blog.category || "");
      formData.append("ref", blog.ref || "");

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.post("http://localhost:8080/api/v1/admin/addBlog", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.push("/articleManagement");
    } catch (error) {
      setServerError(
        axios.isAxiosError(error) && error.response
          ? error.response.data.message || "เกิดข้อผิดพลาด"
          : "เกิดข้อผิดพลาดที่ไม่คาดคิด"
      );
    }
  };

  // Handles cancel button click
  const handleCancel = () => {
    router.back();
  };


  return (
    <div className="w-full flex flex-col gap-4">
      {serverError && <p className="text-red-500">{serverError}</p>}

      {/* อัปโหลดรูปภาพ */}
      <div className="relative w-full h-64 flex justify-center items-center border border-gray-300 rounded-lg overflow-hidden">
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileChange}
        />
        {previewImage ? (
          <Image
            src={previewImage}
            alt="Preview"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-gray-200 text-gray-500 text-sm">
            คลิกเพื่ออัปโหลดรูปภาพ
          </div>
        )}
      </div>
      {errors.image && <p className="text-red-500">{errors.image}</p>}
      
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
