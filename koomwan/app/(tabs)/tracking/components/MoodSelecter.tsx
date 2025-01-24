import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';


//Fix The Eror Change Prop To Set Name
interface MoodSelecterProps {
  selectedMood: string | null;
  onSelect: (mood: 'lol' | 'happy' | 'normal' | 'moody' | 'sick' | 'cry' | 'angry') => void;
}

export const MoodSelecter: React.FC<MoodSelecterProps> = ({ selectedMood, onSelect }) => {
  const moods = [
    { id: 'lol', emoji: '😊', label: 'หัวเราะ' },
    { id: 'happy', emoji: '😐', label: 'ความสุข' },
    { id: 'normal', emoji: '😢', label: 'เฉยๆ' },
    { id: 'moody', emoji: '😊', label: 'หงุดหงิด' },
    { id: 'sick', emoji: '😐', label: 'ป่วย' },
    { id: 'cry', emoji: '😢', label: 'เศร้า' },
    { id: 'angry', emoji: '😢', label: 'โกรธ' },
  ] as const;

  return (
    <View className="flex-row justify-around">
      {moods.map((mood) => (
        <TouchableOpacity
          key={mood.id}
          onPress={() => onSelect(mood.id as 'lol' | 'happy' | 'normal' | 'moody' | 'sick' | 'cry' | 'angry')}
          className={`items-center p-4 rounded-lg ${
            selectedMood === mood.id ? 'bg-primary' : ''
          }`}
        >
          <Text className="text-3xl mb-2">{mood.emoji}</Text>
          <Text className="text-sm text-gray-600">{mood.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};