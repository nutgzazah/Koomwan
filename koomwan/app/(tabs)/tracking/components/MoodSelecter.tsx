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
  { id: 'impassive', icon: require("../../../../assets/Tracking/mood-impassive.png"), label: 'เฉยๆ' },
  { id: 'frustrated', icon: require("../../../../assets/Tracking/mood-frustrated.png"), label: 'หงุดหงิด' },
  { id: 'ill', icon: require("../../../../assets/Tracking/mood-ill.png"), label: 'ป่วย' },
  { id: 'sad', icon: require("../../../../assets/Tracking/mood-sad.png"), label: 'เศร้า' },
  { id: 'angry', icon: require("../../../../assets/Tracking/mood-angry.png"), label: 'โกรธ' },
];


//Selected Mood Change To Primary Background And Text Change To Card Color
export const MoodSelecter: React.FC<MoodSelecterProps> = ({ selectedMood, onSelect }) => {
  return (
    <ScrollView 
    horizontal 
    className="flex-row space-x-4 p-2"
    showsHorizontalScrollIndicator={false}
    >
      {moods.map((mood) => (
        <TouchableOpacity
          key={mood.id}
          onPress={() => onSelect(mood.id)}
          className={`items-center px-9 py-3 mx-2 rounded-xl border border-gray ${
            selectedMood === mood.id ? 'bg-primary' : 'bg-background'
          }`}
        >
          <Image source={mood.icon} className="w-12 h-12" resizeMode="contain" />
          <Text className={`text-description font-sans font-bold ${selectedMood === mood.id ? 'text-card' : 'text-secondary'}`}>{mood.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default MoodSelecter;


