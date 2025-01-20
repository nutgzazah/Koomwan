import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity
} from "react-native";
import React from "react";
import ForumCard from "./components/ForumCard";

export default function ForumScreen() {
  return (
    <SafeAreaView className="flex-1">
      <TouchableOpacity>
        <View className="searchbox">

        </View>
        <View className="filterbox">

        </View>
        <View>
          <ForumCard/>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
