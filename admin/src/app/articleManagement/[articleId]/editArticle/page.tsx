'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import blogs from '../../../../data/blog.json';
import { BlogInterface } from "@/interfaces/blogInterface";
import Image from "next/image";
import DeletePopup from "./components/DeletePopup";

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
  const [ isDeletePopupOpen, setIsDeletePopupOpen ] = useState(false)

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
    setIsDeletePopupOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log("Deleting blog:", blog?.blog_id);
    setIsDeletePopupOpen(false);
    router.push("/articleManagement");
  };

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex flex-col gap-4">

      <div>
        <label className="text-bold_detail" htmlFor="title">ชื่อบทความ</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="ชื่อบทความ"
          value={blog.title}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div>
        <label className="text-bold_detail" htmlFor="author">อ้างอิง</label>
        <input
          type="text"
          id="author"
          name="author"
          placeholder="อ้างอิง"
          value={blog.ref}
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
                checked={blog.category.includes(category)}
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
          value={blog.image}
          onChange={handleChange}
          className="input"
        />
        <div className="mt-4 w-full h-48 border-dashed border-2 rounded-md flex items-center justify-center">
          <Image src={blog.image} alt="Blog Image" width={200} height={200} />
        </div>
      </div>

      <div>
        <label className="text-bold_detail" htmlFor="content">เนื้อหา</label>
        <textarea
          id="content"
          name="content"
          placeholder="กรอกเนื้อหา"
          value={blog.content}
          onChange={handleChange}
          className="input h-64"
        ></textarea>
      </div>
      <div className="w-full flex justify-end">
          <button
              onClick={handleDelete}
              className="w-fit text-abnormal hover:underline"
          >ลบบทความ
          </button>
      </div>
      
      <div className="flex justify-center space-x-4 mt-4">
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

      {isDeletePopupOpen && (
        <DeletePopup onClose={() => setIsDeletePopupOpen(false)} onConfirm={handleDeleteConfirm} />
      )}
    </div>
    
  );
};

export default EditBlogForm;
