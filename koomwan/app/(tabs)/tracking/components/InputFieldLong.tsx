import React from "react";
import { 
    View, 
    Text, 
    TextInput, 
    Image, 
    KeyboardTypeOptions 
} from "react-native";
import DropdownChoice from "./DropDown";

interface InputFieldLongProps {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder: string;
  rightIcon?: any;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  editable?: boolean;
  errorMessage?: string;
  choices?: string[];
  selectedChoice?: string;
  onChoiceChange?: (choice: string) => void;
  onOtherTextChange?: (text: string) => void;
}

const InputFieldLong: React.FC<InputFieldLongProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  rightIcon,
  keyboardType = "default",
  maxLength,
  editable = true,
  errorMessage = "",
  choices,
  selectedChoice,
  onChoiceChange,
  onOtherTextChange
}) => {
  return (
    <View className="mb-2 px-1 w-full ">
      <Text className="text-description font-bold font-sans text-secondary mb-1 w-full ">{label}</Text>

      {choices ? (
        <DropdownChoice
          choices={choices}
          selectedChoice={selectedChoice || value}
          onChoiceChange={onChoiceChange}
          onOtherTextChange={onOtherTextChange}
        />
      ) : (
        <View className={`mb-1 w-full bg-background border ${errorMessage ? 'border-red-500' : 'border-gray'} rounded-lg flex-row items-center`}>
          <TextInput
           value={value}
           onChangeText={onChangeText}
           placeholder={placeholder}
           placeholderTextColor="gray"
           keyboardType={keyboardType}
           maxLength={maxLength}
           editable={editable}
           multiline={true}
           className="font-sans text-description flex-1 mx-1 w-full"
           style={{
            height: 135,
            textAlignVertical: "top", 
            paddingTop: 2, 
            paddingLeft: 1, 
            marginTop: 0, 
            flex: 0, 
           }}
           />
     {rightIcon && (
       <Image
        source={rightIcon}
        className="w-7 h-7 mr-3"
        />
      )}
   </View>

      )}

      {errorMessage && <Text className="font-sans text-red-500 text-description absolute bottom-[-15px] left-1"
       style={{ fontSize: 12 }}
       
      >{errorMessage}</Text>}
    </View>
  );
};

export default InputFieldLong