import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
  } from "react";
  import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
  
  // Define the shape of the context state
  interface AuthState {
    user: any; // Replace `any` with the actual user type if you have it
    token: string;
  }
  
  // Define the context type
  type AuthContextType = [AuthState, React.Dispatch<React.SetStateAction<AuthState>>];
  
  // Create context with default value
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  // Define the provider's props
  interface AuthProviderProps {
    children: ReactNode;
  }
  
  // AuthProvider component
  const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    // Global state
    const [state, setState] = useState<AuthState>({
      user: null,
      token: "",
    });

    let token = state && state.token

    //Default Axios Setting
    axios.defaults.headers.common["Authorization"]=  `Bearer ${token}`
  
    // Initialize local storage data
    useEffect(() => {
      const loadLocalStorageData = async () => {
        try {
          const data = await AsyncStorage.getItem("@auth");
          if (data) {
            const loginData = JSON.parse(data);
            setState((prevState) => ({
              ...prevState,
              user: loginData?.user || null,
              token: loginData?.token || "",
            }));
          }
        } catch (error) {
          console.error("Error loading auth data:", error);
        }
      };
      loadLocalStorageData();
    }, []);
  
    // Ensure the provider value is properly typed
    return (
      <AuthContext.Provider value={[state, setState]}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  // Custom hook to use the AuthContext
  const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };
  
  export { AuthContext, AuthProvider, useAuth };
  