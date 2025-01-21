import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView
} from "react-native";
import React from "react";
import ForumCard from "./components/ForumCard";
import SearchBox from "../../../global/components/SearchBox";
import { useState } from "react";
import TwoChoiceFilterBox from "../../../global/components/FilterBox";
import Card from "../../../global/components/Card";

const mockProfile = require("../../../assets/BeginnerSetup/Bot-Gender-Female.png")

export default function ForumScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilterChoice, setCurrentFilterChoice] = useState(1);

  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        <View className="mx-6 my-4">
          <SearchBox
            value={searchQuery}
            fullSize={true}
            placeholder={"ค้นหา..."}
            onChangeText={setSearchQuery}
          />
        </View>
        <View className="mx-6 mb-4">
          <TwoChoiceFilterBox
            first_choice="ล่าสุด"
            second_choice="ยอดนิยม"
            first_onPress={(() => setCurrentFilterChoice(1))}
            second_onPress={(() => setCurrentFilterChoice(2))}
            current_choice={currentFilterChoice}
          />
        </View>
        <View className={"rounded-md bg-card mx-6 px-3 pt-4 pb-7"}>
          <View className="flex flex-row justify-between items-center">
            <Text>1</Text>
            <Text>1</Text>
            <Text>1</Text>
          </View>
        </View>
        <View>
          <ForumCard imageSource={mockProfile} />
          <ForumCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
