import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the type for the context data
type SignupData = {
  username: string;
  email: string;
  password: string;
  phone: string;
  first_name: string;
  last_name: string;
  occupation: string;
  expert: string;
  hospital: string;
};

type DoctorSignupContextType = {
  signupData: SignupData;
  setSignupData: React.Dispatch<React.SetStateAction<SignupData>>;
};

// Initial context state
const initialState: SignupData = {
  username: "",
  email: "",
  password: "",
  phone: "",
  first_name: "",
  last_name: "",
  occupation: "",
  expert: "",
  hospital: "",
};

// Create context with type
const DoctorSignupContext = createContext<DoctorSignupContextType | null>(null);

export const DoctorSignupProvider = ({ children }: { children: ReactNode }) => {
  const [signupData, setSignupData] = useState<SignupData>(initialState);

  return (
    <DoctorSignupContext.Provider value={{ signupData, setSignupData }}>
      {children}
    </DoctorSignupContext.Provider>
  );
};

// Custom hook for using the context
export const useDoctorSignup = (): DoctorSignupContextType => {
  const context = useContext(DoctorSignupContext);
  if (!context) {
    throw new Error(
      "useDoctorSignup must be used within a DoctorSignupProvider"
    );
  }
  return context;
};
