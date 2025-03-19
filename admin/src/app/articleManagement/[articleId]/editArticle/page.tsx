"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BlogInterface } from "@/interfaces/blogInterface";
import axios from "axios";
import DeletePopup from "./components/DeletePopup";
import BlogImageHandler from "@/utils/blogImageHandler";
import Image from "next/image";

const BASE_URL = "http://localhost:8080";

const categories = [
  "การดูแลสุขภาพ",
  "ความรู้",
  "โภชนาการ",
  "การออกกำลังกาย",
  "โรค",
  "ผู้ป่วยเบาหวาน",
  "อื่นๆ",
];

const EditBlogForm: React.FC = () => {
  const { articleId } = useParams() as { articleId?: string };
  const [blog, setBlog] = useState<BlogInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!articleId) return;
      setLoading(true);
      try {
        console.log(`Fetching blog data from: ${BASE_URL}/api/v1/admin/blog/${articleId}`);
        const response = await axios.get(`${BASE_URL}/api/v1/admin/blog/${articleId}`);
        console.log("Blog data fetched:", response.data);

        const data = response.data.data;
        setBlog({
          ...data,
          category: Array.isArray(data.category)
            ? data.category
            : typeof data.category === "string"
            ? data.category.split(",").map((c: string) => c.trim())
            : [],
        });

        if (data.image) {
          fetchImageUrl(data.image);
        }
      } catch (error) {
        console.error("Error fetching blog data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [articleId]);

  const fetchImageUrl = async (imagePath: string) => {
    try {
      const [folder, fileName] = imagePath.includes("/") ? imagePath.split("/") : ["blogImage", imagePath];
      console.log(`Fetching image URL from: ${BASE_URL}/api/v1/storage/getFileUrl?fileName=${fileName}&folder=${folder}`);
  
      const response = await axios.get(`${BASE_URL}/api/v1/storage/getFileUrl`, { params: { fileName, folder } });
      console.log("Image URL fetched:", response.data);
  
      setImageUrl(response.data.success ? response.data.url : `${BASE_URL}/uploads/${imagePath}`);
    } catch (error) {
      console.error("Error fetching image URL:", error);
      setImageUrl(`${BASE_URL}/uploads/${imagePath}`);
    }
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!blog) return;
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (category: string) => {
    if (!blog) return;
    setBlog({
      ...blog,
      category: blog.category.includes(category)
        ? blog.category.filter((c) => c !== category)
        : [...blog.category, category],
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected file:", file);
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async () => {
    if (!blog || !articleId) {
      setServerError("Invalid blog data or missing article ID.");
      return;
    }
  
    try {
      console.log(`Updating blog at: ${BASE_URL}/api/v1/admin/editBlog/${articleId}`);
  
      await axios.put(`${BASE_URL}/api/v1/admin/editBlog/${articleId}`, {
        ...blog,
        category: Array.isArray(blog.category) ? blog.category.join(", ") : blog.category,
      });
  
      if (imageFile) {
        console.log("Uploading new blog image...");
        const imageUrl = await BlogImageHandler.uploadBlogImage(imageFile, articleId);
  
        if (imageUrl) {
          console.log("New image uploaded:", imageUrl);
  
          await axios.put(`${BASE_URL}/api/v1/admin/editBlog/${articleId}`, {
            image: imageUrl,
          });
        } else {
          console.error("Failed to upload image.");
        }
      }
  
      router.push("/articleManagement");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(error.response?.data?.message || "Failed to update blog.");
      } else {
        setServerError("An unexpected error occurred.");
      }
      console.error("Error updating blog:", error);
    }
  };  

  const handleDelete = () => setIsDeletePopupOpen(true);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (!blog) return <div className="text-center p-4">ไม่พบบทความ</div>;

  return (
    <div className="w-full flex flex-col gap-4">
      {serverError && <p className="text-red-500">{serverError}</p>}

      {/* อัปโหลดรูปภาพ */}
      <div className="relative w-full h-64 flex justify-center items-center border border-gray-300 rounded-lg overflow-hidden">
        {previewImage ? (
          <Image src={previewImage} alt="New Preview" width={300} height={300} className="w-full h-full object-cover" />
        ) : imageUrl ? (
          <Image src={imageUrl} alt="Existing Image" width={300} height={300} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-gray-200 text-gray-500 text-sm">
            ไม่มีรูปภาพ
          </div>
        )}

        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 text-white text-lg font-semibold">
          <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
          คลิกเพื่ออัปโหลดรูปภาพใหม่
        </div>
      </div>

      <div>
        <label htmlFor="title">ชื่อบทความ</label>
        <input type="text" id="title" name="title" value={blog.title} onChange={handleChange} className="input" />
      </div>

      <div>
        <label htmlFor="ref">อ้างอิง</label>
        <input type="text" id="ref" name="ref" value={blog.ref} onChange={handleChange} className="input" />
      </div>

      <div>
        <label>หมวดหมู่</label>
        <div className="flex flex-wrap gap-4">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2">
              <input type="checkbox" checked={blog.category.includes(category)} onChange={() => handleCategoryChange(category)} />
              {category}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="content">เนื้อหา</label>
        <textarea id="content" name="content" value={blog.content} onChange={handleChange} className="input h-64"></textarea>
      </div>

      <div className="w-full flex justify-end">
        <button onClick={handleDelete} className="w-fit text-abnormal hover:underline">ลบบทความ</button>
      </div>

      <div className="flex justify-center space-x-4">
        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">ส่งบทความ</button>
        <button onClick={() => router.back()} className="px-4 py-2 bg-gray-300 rounded">ยกเลิก</button>
      </div>

      {isDeletePopupOpen && blog._id && <DeletePopup onClose={() => setIsDeletePopupOpen(false)} articleId={blog._id} />}
    </div>
  );
};

export default EditBlogForm;
