import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../../config";

/**
 * Service to handle profile image operations including uploading and deleting
 */
export default class ProfileImageHandler {
  /**
   * Handles the entire process of changing a profile image:
   * 1. Uploads the new image
   * 2. Updates the user profile with the new image
   * 3. Deletes the old image from Cloudflare R2
   * 
   * @param userId User ID
   * @param imageFile New image file to upload
   * @param token Authentication token
   * @returns Object with success status and new image filename
   */
  static async changeProfileImage(
    userId: string, 
    imageFile: any, 
    token: string
  ): Promise<{ success: boolean; newImageFileName: string | null }> {
    try {
      // Get current profile image before making changes
      const currentImageFileName = await this.getCurrentProfileImage();
      console.log("Current profile image:", currentImageFileName);
      
      // 1. Upload new image
      const newImagePath = await this.uploadProfileImage(imageFile, token);
      if (!newImagePath) {
        return { success: false, newImageFileName: null };
      }
      
      // Extract filename from path
      const newImageFileName = newImagePath.split("/").pop()!;
      console.log("New profile image:", newImageFileName);
      
      // 2. Update user profile with new image
      const updateSuccess = await this.updateUserProfileImage(
        userId,
        newImageFileName,
        token
      );
      
      if (!updateSuccess) {
        return { success: false, newImageFileName: null };
      }
      
      // 3. Delete old image if it exists and isn't the default avatar
      if (currentImageFileName && 
          currentImageFileName !== "koomwanAvatar01.png" &&
          currentImageFileName !== newImageFileName) {
        console.log("Deleting old image:", currentImageFileName);
        await this.deleteProfileImage(currentImageFileName, token);
      }
      
      return { success: true, newImageFileName };
    } catch (error) {
      console.error("Error during profile image change process:", error);
      return { success: false, newImageFileName: null };
    }
  }

  /**
   * Gets the current user's profile image filename from AsyncStorage
   */
  static async getCurrentProfileImage(): Promise<string | null> {
    try {
      const authData = await AsyncStorage.getItem("@auth");
      if (!authData) return null;

      const auth = JSON.parse(authData);
      return auth.user.image || null;
    } catch (error) {
      console.error("Error getting current profile image:", error);
      return null;
    }
  }

  /**
   * Uploads a new profile image to Cloudflare R2
   */
  static async uploadProfileImage(imageFile: any, token: string): Promise<string | null> {
    if (!imageFile || !token) return null;

    try {
      console.log("Preparing to upload profile image");

      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("folder", "user"); // Using "user" folder for profile images

      const response = await axios.post(
        `${BASE_URL}/api/v1/storage/uploadFile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.R2filePath) {
        console.log("Image uploaded successfully:", response.data.R2filePath);
        return response.data.R2filePath;
      } else {
        console.error("Upload response missing R2filePath:", response.data);
        return null;
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      return null;
    }
  }

  /**
   * Updates user profile with new image filename and updates AsyncStorage
   */
  static async updateUserProfileImage(
    userId: string,
    imageFileName: string,
    token: string
  ): Promise<boolean> {
    try {
      // Update in database
      const response = await axios.put(
        `${BASE_URL}/api/v1/user/update/${userId}`,
        { image: imageFileName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data || !response.data.success) {
        console.error("Failed to update profile image in database:", response.data);
        return false;
      }

      // Update in AsyncStorage
      const authData = await AsyncStorage.getItem("@auth");
      if (authData) {
        const auth = JSON.parse(authData);
        auth.user.image = imageFileName;
        await AsyncStorage.setItem("@auth", JSON.stringify(auth));
      }

      return true;
    } catch (error) {
      console.error("Error updating user profile image:", error);
      return false;
    }
  }

  /**
   * Deletes an image from Cloudflare R2
   */
  static async deleteProfileImage(
    fileName: string,
    token: string,
    folder: string = "user"
  ): Promise<boolean> {
    if (!fileName || !token || fileName === "koomwanAvatar01.png") {
      // Don't attempt to delete the default avatar
      return false;
    }

    try {
      console.log(`Attempting to delete image: ${fileName} from folder: ${folder}`);

      const response = await axios.delete(
        `${BASE_URL}/api/v1/storage/deleteFile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            folder,
            fileName,
          },
        }
      );

      console.log(`Image deletion response:`, response.data);
      return true;
    } catch (error) {
      console.error(`Error deleting image ${fileName}:`, error);
      return false;
    }
  }
}