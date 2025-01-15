import React from 'react';
import * as Font from 'expo-font';
import { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import "./global.css"; 

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'K2D-Regular': require('./assets/fonts/K2D-Regular.ttf'),
        'K2D-Medium': require('./assets/fonts/K2D-Medium.ttf'),
        'K2D-Bold': require('./assets/fonts/K2D-Bold.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <Text>Loading Fonts...</Text>;
  }

  return (
//Test
    <View className="bg-background p-14">
      <Text className="text-title font-sans">Test K2D Title คุมหวาoน</Text>
      <Text className="text-display font-sans">Test K2D Display คุมหวาน</Text>
      <Text className="text-sub-button font-sans">Test K2D Body คุมหวาน</Text>
    </View>
  );
}