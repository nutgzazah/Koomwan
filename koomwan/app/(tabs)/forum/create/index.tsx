import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    ScrollView
  } from "react-native";
  import React from "react";
  import Card from "../../../../global/components/Card";
  
  const mockProfile = require("../../../../assets/BeginnerSetup/Bot-Gender-Female.png")
  
  export default function ForumScreen() {
    return (
      <SafeAreaView className="flex-1">
        <ScrollView>
          <Card>

          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }
  