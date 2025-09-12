import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthState = {
  token: string | null;
  restauranteId: number | null;
  nome: string | null;
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  loadAuth: () => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
  token: null,
  restauranteId: null,
  nome: null,

  login: async (email, senha) => {
    const res = await fetch("http://18.222.146.1:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    if (!res.ok) throw new Error("Falha no login");

    const data = await res.json();
    await AsyncStorage.setItem("auth", JSON.stringify(data));
    set({ token: data.token, restauranteId: data.restauranteId, nome: data.nome });
  },

  register: async (nome, email, senha) => {
    const res = await fetch("http://18.222.146.1:8080/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });

    if (!res.ok) throw new Error("Falha no registro");

    const data = await res.json();
    await AsyncStorage.setItem("auth", JSON.stringify(data));
    set({ token: data.token, restauranteId: data.restauranteId, nome: data.nome });
  },

  logout: async () => {
    await AsyncStorage.removeItem("auth");
    set({ token: null, restauranteId: null, nome: null });
  },

  loadAuth: async () => {
    const json = await AsyncStorage.getItem("auth");
    if (json) {
      const data = JSON.parse(json);
      set({ token: data.token, restauranteId: data.restauranteId, nome: data.nome });
    }
  },
}));
