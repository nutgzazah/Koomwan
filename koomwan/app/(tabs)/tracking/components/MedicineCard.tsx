import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

interface MedicineCardProps {
  medicine: {
    id: number | string;
    name: string;
    type?: string;
    details?: string;
    image?: any;
  };
  isSelected?: boolean;
  isAdditional?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
}

const MedicineCard: React.FC<MedicineCardProps> = ({
  medicine,
  isSelected = false,
  isAdditional = false,
  onSelect,
  onDelete,
}) => {
  return (
    <View className="border rounded-lg p-4 mb-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {!isAdditional && (
            <TouchableOpacity onPress={onSelect} className="mr-4">
              <View
                className={`w-6 h-6 rounded border-2 ${
                  isSelected ? 'bg-primary border-primary' : 'border-gray-300'
                }`}
              >
                {isSelected && <Text className="text-white text-center">✓</Text>}
              </View>
            </TouchableOpacity>
          )}

          {medicine.image && (
            <Image
              source={medicine.image}
              className="w-16 h-16 rounded-lg mr-4"
            />
          )}

          <View className="flex-1">
            <Text className="font-bold text-lg">{medicine.name}</Text>
            {medicine.type && <Text className="text-gray-600">{medicine.type}</Text>}
            {medicine.details && <Text className="text-gray-600 text-sm mt-1">{medicine.details}</Text>}
          </View>
        </View>

        {isAdditional && onDelete && (
          <TouchableOpacity onPress={onDelete} className="ml-4">
            <Image
              source={require('../../../../assets/Tracking/trash.png')}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default MedicineCard;
