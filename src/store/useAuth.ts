import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

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
    console.log("[Auth] login iniciado:", email);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      console.log("[Auth] login response status:", res.status);

      // Lê como texto primeiro
      const text = await res.text();
      console.log("[Auth] login raw response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.warn("[Auth] resposta não é JSON, usando raw text");
        data = { message: text };
      }

      if (!res.ok) throw new Error(data?.message || "Falha no login");

      await AsyncStorage.setItem("auth", JSON.stringify(data));
      set({ token: data.token, restauranteId: data.restauranteId, nome: data.nome });
      console.log("[Auth] login bem-sucedido!");
    } catch (err) {
      console.error("[Auth] erro no login:", err);
      throw err;
    }
  },

  register: async (nome, email, senha) => {
    console.log("[Auth] register iniciado:", nome, email, `${API_URL}`);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      console.log("[Auth] register response status:", res.status);

      const text = await res.text();
      console.log("[Auth] register raw response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.warn("[Auth] resposta não é JSON, usando raw text");
        data = { message: text };
      }

      if (!res.ok) throw new Error(data?.message || "Falha no registro");

      await AsyncStorage.setItem("auth", JSON.stringify(data));
      set({ token: data.token, restauranteId: data.restauranteId, nome: data.nome });
      console.log("[Auth] registro bem-sucedido!");
    } catch (err) {
      console.error("[Auth] erro no registro:", err);
      throw err;
    }
  },

  logout: async () => {
    console.log("[Auth] logout iniciado");
    await AsyncStorage.removeItem("auth");
    set({ token: null, restauranteId: null, nome: null });
    console.log("[Auth] logout concluído");
  },

  loadAuth: async () => {
    console.log("[Auth] carregando auth do AsyncStorage");
    const json = await AsyncStorage.getItem("auth");
    if (json) {
      const data = JSON.parse(json);
      set({ token: data.token, restauranteId: data.restauranteId, nome: data.nome });
      console.log("[Auth] auth carregado:", data);
    } else {
      console.log("[Auth] nenhum auth encontrado");
    }
  },
}));
