import { useEffect, useState } from "react";
import { View, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BASE_URL from "../../config";
import React from "react";

interface ProfileImageProps {
  imageFileName?: string;
  size?: "small" | "medium" | "large";
  style?: object;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  imageFileName,
  size = "medium",
  style,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        if (!imageFileName) {
          // Use default image if no filename provided
          setImageUrl(`${BASE_URL}/uploads/koomwanAvatar01.png`);
          setLoading(false);
          return;
        }

        // Extract folder from filename pattern if it exists
        // Format is typically: folder/filename.ext
        let folder = "user";
        let fileName = imageFileName;

        if (imageFileName.includes("/")) {
          const parts = imageFileName.split("/");
          folder = parts[0];
          fileName = parts[1];
        }

        // Get auth token for API request
        const authData = await AsyncStorage.getItem("@auth");
        if (!authData) {
          setImageUrl(`${BASE_URL}/uploads/koomwanAvatar01.png`);
          setLoading(false);
          return;
        }

        const auth = JSON.parse(authData);
        const token = auth.token;

        // Request signed URL from backend
        const response = await axios.get(
          `${BASE_URL}/api/v1/storage/getFileUrl`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              fileName: fileName,
              folder: folder,
            },
          }
        );

        if (response.data.success) {
          setImageUrl(response.data.url);
        } else {
          // Fallback to direct URL if signed URL fails
          setImageUrl(`${BASE_URL}/uploads/${imageFileName}`);
        }
      } catch (error) {
        console.error("Error fetching image URL:", error);
        // Fallback to default image on error
        setImageUrl(`${BASE_URL}/uploads/koomwanAvatar01.png`);
      } finally {
        setLoading(false);
      }
    };

    fetchImageUrl();
  }, [imageFileName]);

  // Define sizes for different profile image options
  const sizeStyles = {
    small: { width: 40, height: 40, borderRadius: 20 },
    medium: { width: 100, height: 100, borderRadius: 50 },
    large: { width: 150, height: 150, borderRadius: 75 },
  };

  // Get size style or default to medium
  const sizeStyle = sizeStyles[size] || sizeStyles.medium;

  return (
    <View>
      {!loading && (
        <Image
          source={{ uri: imageUrl }}
          className={`bg-gray`}
          style={[sizeStyle, style]}
          resizeMode="cover"
        />
      )}
    </View>
  );
};

export default ProfileImage;
