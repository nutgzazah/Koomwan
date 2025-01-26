'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import blogs from '../../../../data/blog.json';
import { BlogInterface } from "@/interfaces/blogInterface";
import Image from "next/image";

const categories = [
  "การดูแลสุขภาพ",
  "ความรู้",
  "โภชนาการ",
  "การออกกำลังกาย",
  "โรค",
  "จิตใจ",
];

const EditBlogForm: React.FC = () => {
  const { articleId } = useParams();
  const [blog, setBlog] = useState<BlogInterface | null>(null);
  const blogList = blogs as BlogInterface[];
  const router = useRouter();

  useEffect(() => {
    const foundBlog = blogList.find((b) => b.blog_id === articleId);
    if (foundBlog) {
      setBlog(foundBlog);
    }
  }, [articleId, blogList]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (blog) {
      const { name, value } = e.target;
      setBlog({
        ...blog,
        [name]: value,
      });
    }
  };

  const handleCategoryChange = (category: string) => {
    if (blog) {
      const updatedCategories = blog.category.includes(category)
        ? blog.category.filter((c) => c !== category)
        : [...blog.category, category];

      setBlog({
        ...blog,
        category: updatedCategories,
      });
    }
  };

  const handleSubmit = () => {
    if (blog) {
      console.log("Updated Blog:", blog);
    }
  };

  const handleDelete = () => {
    console.log("delete");
  }

  if (!blog) {
    return <div>Loading...</div>;
  }

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
          value={blog.title}
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
          value={blog.author}
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
                checked={blog.category.includes(category)}
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
          value={blog.image}
          onChange={handleChange}
          className="px-4 py-2 border rounded-md focus:outline-none w-full text-lg"
        />
        <div className="mt-4 w-full h-48 border-dashed border-2 rounded-md flex items-center justify-center">
          <Image src={blog.image} alt="Blog Image" width={200} height={200} />
        </div>
      </div>

      <div className="mb-6">
        <label className="block font-bold mb-2" htmlFor="content">เนื้อหา</label>
        <textarea
          id="content"
          name="content"
          placeholder="กรอกเนื้อหา"
          value={blog.content}
          onChange={handleChange}
          className="px-4 py-2 border rounded-md focus:outline-none w-full h-40 text-lg"
        ></textarea>
      </div>
<div className="w-full flex justify-end">
    <button
        onClick={handleDelete}
        className="w-fit text-red-500"
      >ลบบทความ
      </button>
</div>
      

      <div className="flex justify-between">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          ส่งบทความ
        </button>
        <button
          onClick={() => router.back()}
          className="bg-gray-300 text-black px-6 py-2 rounded-md hover:bg-gray-400"
        >
          ยกเลิก
        </button>
      </div>
    </div>
  );
};

export default EditBlogForm;
