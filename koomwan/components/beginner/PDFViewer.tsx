import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system";

interface PDFViewerProps {
  uri: string;
  isVisible: boolean;
  onClose: () => void;
  fileName?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  uri,
  isVisible,
  onClose,
  fileName,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  // Create HTML to display PDF
  const generateHtml = (base64: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body { margin: 0; padding: 0; }
          #pdf-viewer {
            width: 100%;
            height: 100vh;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <iframe
          id="pdf-viewer"
          src="data:application/pdf;base64,${base64}"
          frameborder="0"
        ></iframe>
      </body>
    </html>
  `;

  // Convert URI to base64 and generate HTML
  const loadPDF = async () => {
    if (!uri) return;

    try {
      setIsLoading(true);
      setError("");

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (base64) {
        const html = generateHtml(base64);
        setHtmlContent(html);
      } else {
        setError("ไม่สามารถเปิดไฟล์ PDF ได้");
      }
    } catch (err) {
      console.error("Error loading PDF:", err);
      setError("เกิดข้อผิดพลาดในการแสดงไฟล์ PDF");
    } finally {
      setIsLoading(false);
    }
  };

  // Load PDF when modal becomes visible
  useEffect(() => {
    if (isVisible) {
      loadPDF();
    } else {
      // Reset states when modal is closed
      setHtmlContent(null);
      setError("");
      setIsLoading(true);
    }
  }, [isVisible, uri]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4 bg-card border-b border-gray">
            <View className="flex-1">
              <Text
                className="text-headline text-secondary font-medium"
                numberOfLines={1}
              >
                {fileName || "PDF Document"}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} className="ml-4">
              <Text className="text-button text-primary font-bold">ปิด</Text>
            </TouchableOpacity>
          </View>

          {/* PDF Viewer */}
          <View className="flex-1 bg-background">
            {error ? (
              <View className="flex-1 items-center justify-center">
                <Text className="text-abnormal text-description font-regular">
                  {error}
                </Text>
              </View>
            ) : htmlContent ? (
              <WebView
                originWhitelist={["*"]}
                source={{ html: htmlContent }}
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={() => setIsLoading(false)}
                className="flex-1"
                scalesPageToFit={true}
              />
            ) : null}
          </View>

          {/* Loading State */}
          {isLoading && !error && (
            <View className="absolute inset-0 items-center justify-center bg-background bg-opacity-50">
              <View className="bg-card p-4 rounded-lg shadow-lg">
                <ActivityIndicator size="large" color="#3972F0" />
                <Text className="text-description text-secondary font-regular mt-2">
                  กำลังโหลด PDF...
                </Text>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default PDFViewer;
