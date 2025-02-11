import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import BreakLine from "../../../../global/components/BreakLine";
import Card from '../../../../global/components/Card';
import InputFieldOne from "../components/InputFieldOne";
import Dropdown from "../components/Dropdown";

interface Medicine {
  name: string;
  type: string;
  details: string;
  image: string | null;
}

interface AddMedicineCardProps {
  onAdd: (medicine: Medicine) => void;
  onCancel: () => void;
}

const AddMedicineCard: React.FC<AddMedicineCardProps> = ({ onAdd, onCancel }) => {
  const [newMedicine, setNewMedicine] = useState<Medicine>({
    name: '',
    type: '',
    details: '',
    image: null,
  });

  const [selectedType, setSelectedType] = useState<string>("");

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Please grant media library access to add an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      setNewMedicine({ ...newMedicine, image: result.assets[0].uri });
    }
  };

  const handleSubmit = () => {
    if (!newMedicine.name.trim()) {
      Alert.alert('กรุณากรอกชื่อยา');
      return;
    }

    if (!selectedType.trim()) {
      Alert.alert('กรุณาเลือกประเภทของยา');
      return;
    }

    onAdd({ ...newMedicine, type: selectedType });
  };

  return (
    <Card>
      <Text className="text-title font-bold font-sans text-secondary text-center mt-2">ยาเพิ่มเติม</Text>
      <BreakLine />

      <View className="mt-2">
        <TouchableOpacity
          onPress={pickImage}
          className="bg-background border border-gray rounded-lg p-20 items-center justify-center mb-1"
        >
          {newMedicine.image ? (
            <Image source={{ uri: newMedicine.image }} className="w-40 h-40 rounded-lg" />
          ) : (
            <Image source={require('../../../../assets/Tracking/add-image.png')} className="w-20 h-20 mb-2" />
          )}
        </TouchableOpacity>

        <InputFieldOne
          label="ชื่อยา"
          value={newMedicine.name}
          onChangeText={(text) => setNewMedicine({ ...newMedicine, name: text })}
          placeholder="ระบุชื่อยา"
        />

        <Text className="text-description font-bold font-sans text-secondary px-1 mb-2">ประเภท (Optional)</Text>
        <Dropdown
          choices={[
            'ยาเฉพาะโรค',
            'ยาสามัญประจำบ้าน',
            'ยาใช้ภายนอก',
            'ยาบำรุง',
            'ยาวิตามินและเกลือแร่เสริม',
            'อื่นๆ'
          ]}
          selectedChoice={selectedType}
          onChoiceChange={(choice) => setSelectedType(choice)}
          onOtherTextChange={(text) => setSelectedType(text)}
        />

        <InputFieldOne
          label="รายละเอียด (Optional)"
          value={newMedicine.details}
          onChangeText={(text) => setNewMedicine({ ...newMedicine, details: text })}
          placeholder="ระบุรายละเอียดยา"
          editable
        />

        <View className="flex-row justify-between mt-4">
          <TouchableOpacity onPress={onCancel} className="bg-gray-200 rounded-lg px-6 py-3 flex-1 mr-2">
            <Text className="text-button font-sans text-center">ยกเลิก</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit} className="bg-primary rounded-lg px-6 py-3 flex-1 ml-2">
            <Text className="text-button font-sans text-card text-center">บันทึก</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

export default AddMedicineCard;
