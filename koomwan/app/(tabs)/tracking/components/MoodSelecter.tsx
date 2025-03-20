import { 
  Text, 
  TouchableOpacity, 
  Image, 
  ScrollView 
} from 'react-native';
import React from 'react';

//Prepair For Selected Mood
interface MoodSelecterProps {
  selectedMood: string | null;
  onSelect: (mood: string) => void;
}
//Label Seven Of Mood Types
const moods = [
  { id: 'laughing', icon: require("../../../../assets/Tracking/mood-laughing.png"), label: 'หัวเราะ' },
  { id: 'happy', icon: require("../../../../assets/Tracking/mood-happy.png"), label: 'ความสุข' },
  { id: 'neutral', icon: require("../../../../assets/Tracking/mood-neutral.png"), label: 'เฉยๆ' },
  { id: 'irritated', icon: require("../../../../assets/Tracking/mood-irritated.png"), label: 'หงุดหงิด' },
  { id: 'sick', icon: require("../../../../assets/Tracking/mood-sick.png"), label: 'ป่วย' },
  { id: 'crying', icon: require("../../../../assets/Tracking/mood-crying.png"), label: 'เศร้า' },
  { id: 'angry', icon: require("../../../../assets/Tracking/mood-angry.png"), label: 'โกรธ' },
];


//Selected Mood Change To Primary Background And Text Change To Card Color
export const MoodSelecter: React.FC<MoodSelecterProps> = ({ selectedMood, onSelect }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row space-x-4 p-2 ">
      {moods.map((mood) => (
        <TouchableOpacity
          key={mood.id}
          onPress={() => onSelect(mood.id)}
          className={`items-center py-5 px-8 rounded-xl mx-1.5 mt-2 ${selectedMood === mood.id ? 'bg-primary' : 'bg-background'}`}
        >
          <Image source={mood.icon} className="w-12 h-12" resizeMode="contain" />
          <Text className={`text-button font-sans ${selectedMood === mood.id ? 'text-card' : 'text-secondary'}`}>{mood.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default MoodSelecter;