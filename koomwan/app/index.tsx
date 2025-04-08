import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/authContext";

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    token: "",
    user: null,
  });

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");

        if (storedToken && storedUser) {
          setState({
            token: storedToken,
            user: JSON.parse(storedUser),
          });
        }
      } catch (error) {
        console.error("Error loading auth data:", error);
      }
    };

    loadAuthData();
  }, []);

  return (
    <AuthContext.Provider value={[state, setState]}>
      {children}
    </AuthContext.Provider>
  );
};
