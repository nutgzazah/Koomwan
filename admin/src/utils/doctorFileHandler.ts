import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080";

class DoctorFileHandler {
  /**
   * Fetch Cloudflare R2 image URL for a doctor.
   * @param imagePath - The stored image path in the format "doctor/filename.png"
   * @returns - The full image URL from Cloudflare
   */
  static async getCurrentDoctorImage(imagePath: string): Promise<string | null> {
    try {
      if (!imagePath) return null;

      let folder = "doctor";
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

  /**
   * Fetch Cloudflare R2 file URL (Image/PDF).
   * @param filePath - Path stored in R2 (e.g., "documents/filename.pdf")
   * @returns - The full URL to the file
   */
  static async getFileUrl(filePath: string): Promise<string | null> {
    try {
      if (!filePath) return null;

      let folder = "documents"; // Default folder for PDFs
      let fileName = filePath;

      // Extract folder and file name if it's a full path
      if (filePath.includes("/")) {
        const parts = filePath.split("/");
        folder = parts[0];
        fileName = parts[1];
      }

      console.log(`Fetching file URL from: ${BASE_URL}/api/v1/storage/getFileUrl?fileName=${fileName}&folder=${folder}`);

      const response = await axios.get(`${BASE_URL}/api/v1/storage/getFileUrl`, {
        params: { fileName, folder },
        headers: { "Cache-Control": "no-cache" },
      });

      console.log("File URL fetched:", response.data);

      return response.data.success ? response.data.url : null;
    } catch (error) {
      console.error("Error fetching file URL:", error);
      return null;
    }
  }
}

// ✅ Fix: Only one default export
export default DoctorFileHandler;
