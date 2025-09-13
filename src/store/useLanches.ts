import { create } from "zustand";
import { useAuth } from "./useAuth";
import { Lanche } from "../../types";

type LancheState = {
  lanches: Lanche[];
  fetchLanches: () => Promise<void>;
  addLanche: (nome: string, ingredientes: string[]) => Promise<void>;
  removeLanche: (id: number) => Promise<void>;
  updateIngredients: (lancheId: number, ingredientes: string[]) => Promise<void>;
  getById: (id: number) => Lanche | undefined;
};

export const useLanches = create<LancheState>((set, get) => ({
  lanches: [],

  fetchLanches: async () => {
    const { restauranteId } = useAuth.getState();
    if (!restauranteId) return;

    const res = await fetch(`https://mesaclick.shop/lanches?restauranteId=${restauranteId}`);
    const data: Lanche[] = await res.json();
    set({ lanches: data });
  },

  addLanche: async (nome, ingredientes) => {
    const { restauranteId } = useAuth.getState();
    if (!restauranteId) throw new Error("Restaurante não definido");

    const lancheParaEnviar = { nome, ingredientes, restauranteId };
    const res = await fetch("https://mesaclick.shop/lanches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lancheParaEnviar),
    });
    if (!res.ok) throw new Error("Falha ao criar lanche");

    const newLanche: Lanche = await res.json();
    set({ lanches: [newLanche, ...get().lanches] });
  },

  removeLanche: async (id) => {
    const { restauranteId } = useAuth.getState();
    if (!restauranteId) throw new Error("Restaurante não definido");

    await fetch(`https://mesaclick.shop/lanches/${id}?restauranteId=${restauranteId}`, { method: "DELETE" });
    set({ lanches: get().lanches.filter((l) => l.id !== id) });
  },

  updateIngredients: async (lancheId, ingredientes) => {
    const { restauranteId } = useAuth.getState();
    if (!restauranteId) throw new Error("Restaurante não definido");

    const lancheExistente = get().lanches.find((l) => l.id === lancheId);
    if (!lancheExistente) return;

    const dadosParaAtualizar = { ...lancheExistente, ingredientes, restauranteId };
    const res = await fetch(`https://mesaclick.shop/lanches/${lancheId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosParaAtualizar),
    });
    const updated: Lanche = await res.json();
    set({ lanches: get().lanches.map((l) => (l.id === lancheId ? updated : l)) });
  },

  getById: (id) => get().lanches.find((l) => l.id === id),
}));
