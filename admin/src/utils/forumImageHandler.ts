import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080";

class ForumImageHandler {
  /**
   * Fetch Cloudflare R2 image URL for a doctor.
   * @param imagePath - The stored image path in the format "doctor/filename.png"
   * @returns - The full image URL from Cloudflare
   */
  static async getCurrentForumImage(imagePath: string): Promise<string | null> {
    try {
      if (!imagePath) return null;

      let folder = "forumImage";
      let fileName = imagePath;

      // Extract folder and file name if it's a full path
      if (imagePath.includes("/")) {
        const parts = imagePath.split("/");
        folder = parts[0];
        fileName = parts[1];
      }

      console.log(`Fetching image URL from: ${BASE_URL}/api/v1/storage/getFileUrl?fileName=${fileName}&folder=${folder}`);

      const response = await axios.get(`${BASE_URL}/api/v1/storage/getFileUrl`, {
        params: { fileName, folder },
        headers: { "Cache-Control": "no-cache" },
      });

      console.log("Image URL fetched:", response.data);

      return response.data.success ? response.data.url : null;
    } catch (error) {
      console.error("Error fetching image URL:", error);
      return null;
    }
  }
}

export default ForumImageHandler;
