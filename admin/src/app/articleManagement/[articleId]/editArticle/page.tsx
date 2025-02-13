'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BlogInterface } from "@/interfaces/blogInterface";
import Image from "next/image";
import axios from "axios";
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
  const { articleId } = useParams() as { articleId: string };
  const [blog, setBlog] = useState<BlogInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchBlog = async () => {
      if (!articleId) return;
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/admin/blog/${articleId}`);
        console.log("Fetched blog data:", response.data);
        
        setBlog({
          ...response.data.data,
          category: Array.isArray(response.data.data.category) 
            ? response.data.data.category 
            : typeof response.data.data.category === "string"
            ? response.data.data.category.split(",").map((c: string) => c.trim()) 
            : [],
        });
      } catch (error) {
        console.error("Error fetching blog data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBlog();
  }, [articleId]);
  
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
      const updatedCategories = Array.isArray(blog.category)
        ? blog.category.includes(category)
          ? blog.category.filter((c) => c !== category)
          : [...blog.category, category]
        : [category];
  
      setBlog({
        ...blog,
        category: updatedCategories,
      });
    }
  };
  

  const handleSubmit = async () => {
    if (blog) {
      try {
        const blogData = {
          ...blog,
          category: Array.isArray(blog.category) ? blog.category.join(", ") : blog.category, 
        };
  
        await axios.put(`http://localhost:8080/api/v1/admin/editBlog/${articleId}`, blogData);
        router.push("/articleManagement");
      } catch (error) {
        console.error("Error updating blog:", error);
      }
    }
  };

  const handleDelete = () => {
    setIsDeletePopupOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!articleId) {
      console.error("Error: articleId is undefined");
      return;
    }
  
    try {
      console.log("Deleting blog:", articleId);
      await axios.delete(`http://localhost:8080/api/v1/admin/deleteBlog/${articleId}`);
  
      setIsDeletePopupOpen(false);
      router.push("/articleManagement"); 
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };
  

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (!blog) {
    return <div className="text-center p-4">ไม่พบบทความ</div>;
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
        <label className="text-bold_detail" htmlFor="ref">อ้างอิง</label>
        <input
          type="text"
          id="ref"
          name="ref"
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

      {/* รูปภาพเว้นไว้ก่อน */}
      {/* <div>
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
      </div> */}

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
        <button onClick={handleDelete} className="w-fit text-abnormal hover:underline">ลบบทความ</button>
      </div>
      
      <div className="flex justify-center space-x-4">
        <button onClick={handleSubmit} className="btn blue-btn short-btn">ส่งบทความ</button>
        <button onClick={() => router.back()} className="btn white-btn short-btn">ยกเลิก</button>
      </div>

      {isDeletePopupOpen && blog?._id && (
        <DeletePopup 
          onClose={() => setIsDeletePopupOpen(false)} 
          onConfirm={handleDeleteConfirm} 
          articleId={blog._id} 
        />
      )}


    </div>
  );
};

export default EditBlogForm;
