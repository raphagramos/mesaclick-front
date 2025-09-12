import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  restaurantId: string | null;
  restaurantName: string | null; 
  login: (id: string, nome: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  restaurantId: null,
  restaurantName: null,
  login: async () => {},
  logout: async () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const id = await AsyncStorage.getItem("restaurantId");
      const name = await AsyncStorage.getItem("restaurantName");
      if (id) setRestaurantId(id);
      if (name) setRestaurantName(name);
    };
    loadData();
  }, []);

  const login = async (id: string, nome: string) => {
    await AsyncStorage.setItem("restaurantId", id);
    await AsyncStorage.setItem("restaurantName", nome);
    setRestaurantId(id);
    setRestaurantName(nome);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("restaurantId");
    await AsyncStorage.removeItem("restaurantName");
    setRestaurantId(null);
    setRestaurantName(null);
  };

  return (
    <AuthContext.Provider value={{ restaurantId, restaurantName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
