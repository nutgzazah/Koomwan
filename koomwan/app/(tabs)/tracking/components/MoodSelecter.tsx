import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface Props {
  selectedMood: string | null;
  onSelect: (mood: 'happy' | 'normal' | 'sad') => void;
}

export const MoodSelector: React.FC<Props> = ({ selectedMood, onSelect }) => {
  const moods = [
    { id: 'happy', emoji: '😊', label: 'ความสุข' },
    { id: 'normal', emoji: '😐', label: 'ปกติ' },
    { id: 'sad', emoji: '😢', label: 'เศร้า' }
  ] as const;

  return (
    <View className="flex-row justify-around">
      {moods.map((mood) => (
        <TouchableOpacity
          key={mood.id}
          onPress={() => onSelect(mood.id as 'happy' | 'normal' | 'sad')}
          className={`items-center p-4 rounded-lg ${
            selectedMood === mood.id ? 'bg-blue-100' : ''
          }`}
        >
          <Text className="text-3xl mb-2">{mood.emoji}</Text>
          <Text className="text-sm text-gray-600">{mood.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};