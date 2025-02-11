import React from "react";
import { View } from "react-native";

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <View
      className="bg-background h-6 w-3/4 rounded mx-auto mt2"
      style={{ borderWidth: 1, borderColor: "#007bff" }} 
    >
      <View
        className="bg-primary h-full rounded"
        style={{ width: `${progress}%` }}
      />
    </View>
  );
};

export default ProgressBar;
