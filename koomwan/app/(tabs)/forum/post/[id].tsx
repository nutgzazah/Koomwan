import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView
} from "react-native";
import React from "react";
import ForumCard from "../components/ForumCard";
import CommentCard from "../components/CommentBox";

const mockProfile = require("../../../../assets/BeginnerSetup/Pen.png")

export default function ForumScreen() {
  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        <View className="searchbox">

        </View>
        <View className="filterbox">

        </View>
        <View>
          <ForumCard imageSource={mockProfile} viewComments={true} />
          <CommentCard/>
          <CommentCard/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
