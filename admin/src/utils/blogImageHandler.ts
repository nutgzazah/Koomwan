import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080"; // Use NEXT_PUBLIC for client-side access

export default class BlogImageHandler {
  /**
   * ดึง URL ของรูปภาพบทความ
   * @param imagePath path ของรูปภาพ
   * @returns URL ของรูปภาพที่โหลดสำเร็จ หรือ null ถ้าโหลดไม่สำเร็จ
   */
  static async getCurrentBlogImage(imagePath: string): Promise<string | null> {
    try {
      const [folder, fileName] = imagePath.includes("/") ? imagePath.split("/") : ["blogImage", imagePath];
      
      console.log(`Fetching image URL from: ${BASE_URL}/api/v1/storage/getFileUrl?fileName=${fileName}&folder=${folder}`);
      
      const response = await axios.get(`${BASE_URL}/api/v1/storage/getFileUrl`, {
        params: { fileName, folder },
        headers: { "Cache-Control": "no-cache" },
      });
      
      console.log("Image URL fetched:", response.data);
      
      return response.data.success ? response.data.url : `${BASE_URL}/uploads/${imagePath}`;
    } catch (error) {
      console.error("Error fetching image URL:", error);
      return `${BASE_URL}/uploads/${imagePath}`;
    }
  }
 

  /**
   * อัปโหลดรูปภาพบทความใหม่
   * @param imageFile ไฟล์รูปภาพที่ต้องการอัปโหลด
   * @param articleId ไอดีของบทความที่ต้องการอัปโหลดรูป
   * @returns URL ของรูปที่อัปโหลดสำเร็จ หรือ null ถ้าอัปโหลดล้มเหลว
   */
  static async uploadBlogImage(imageFile: File, articleId: string): Promise<string | null> {
    if (!imageFile) return null;

    try {
      console.log("Preparing to upload blog image");

      const formData = new FormData();
      formData.append("image", imageFile);

      console.log("Uploading image to:", `${BASE_URL}/api/v1/admin/editBlog/${articleId}`);
      console.log("FormData contains:", formData.get("image"));

      const response = await axios.put(`${BASE_URL}/api/v1/admin/editBlog/${articleId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Full upload response:", response.data); // ✅ Debug response จาก backend

      const imageUrl = response.data.blog?.image || response.data.imageUrl || response.data.image || response.data.url || null;

      if (!imageUrl) {
        console.error("Upload failed: Missing imageUrl in response", response.data);
        return null;
      }

      console.log("Image uploaded successfully:", imageUrl);
      return imageUrl;
    } catch (error) {
      console.error("Error uploading blog image:", error);
      return null;
    }
}

  /**
   * **📌 New Function**: Handles the entire process of changing a blog image:
   * 1. Uploads the new image.
   * 2. Updates the blog post with the new image.
   * 3. Deletes the old image from Cloudflare R2 (if necessary).
   * 
   * @param articleId ไอดีของบทความ
   * @param imageFile ไฟล์รูปภาพใหม่ที่ต้องการอัปโหลด
   * @returns Object `{ success: boolean, newImageFileName: string | null }`
   */
  static async changeBlogImage(
    articleId: string, 
    imageFile: File
  ): Promise<{ success: boolean; newImageFileName: string | null }> {
    try {
      // 1️⃣ Get current blog image before making changes
      const blogResponse = await axios.get(`${BASE_URL}/api/v1/admin/blog/${articleId}`);
      const currentImageFileName = blogResponse.data.data?.image || null;
      console.log("Current blog image:", currentImageFileName);
      
      // 2️⃣ Upload new image
      const newImagePath = await this.uploadBlogImage(imageFile, articleId);
      if (!newImagePath) {
        return { success: false, newImageFileName: null };
      }
      
      // Extract filename from path
      const newImageFileName = newImagePath.split("/").pop()!;
      console.log("New blog image:", newImageFileName);
      
      // 3️⃣ Update blog post with new image
      const updateSuccess = await this.updateBlogImage(articleId, newImageFileName);
      if (!updateSuccess) {
        return { success: false, newImageFileName: null };
      }
      
      // 4️⃣ Delete old image if it exists and isn't the default placeholder
      if (currentImageFileName && 
          currentImageFileName !== "defaultBlogImage.png" &&
          currentImageFileName !== newImageFileName) {
        console.log("Deleting old blog image:", currentImageFileName);
        await this.deleteBlogImage(currentImageFileName);
      }
      
      return { success: true, newImageFileName };
    } catch (error) {
      console.error("Error during blog image change process:", error);
      return { success: false, newImageFileName: null };
    }
  }

  /**
   * ลบรูปภาพบทความออกจาก Cloudflare R2
   * @param fileName ชื่อไฟล์รูปที่ต้องการลบ
   * @param folder โฟลเดอร์ที่ใช้เก็บรูปภาพ (default: "blogImage")
   * @returns `true` ถ้าลบสำเร็จ, `false` ถ้าล้มเหลว
   */
  static async deleteBlogImage(
    fileName: string,
    folder: string = "blogImage"
  ): Promise<boolean> {
    if (!fileName || fileName === "defaultBlogImage.png") {
      // Don't attempt to delete the default blog image
      return false;
    }

    try {
      console.log(`Attempting to delete blog image: ${fileName} from folder: ${folder}`);

      const response = await axios.delete(`${BASE_URL}/api/v1/storage/deleteFile`, {
        headers: { "Content-Type": "application/json" },
        data: { folder, fileName },
      });

      console.log(`Blog image deletion response:`, response.data);
      return true;
    } catch (error) {
      console.error(`Error deleting blog image ${fileName}:`, error);
      return false;
    }
  }
}
