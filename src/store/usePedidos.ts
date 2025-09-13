import { create } from "zustand";
import { useAuth } from "./useAuth";
import { Pedido, PedidoInput } from "../../types";

type PedidoState = {
  pedidos: Pedido[];
  fetchPedidos: () => Promise<void>;
  addPedido: (p: PedidoInput) => Promise<number>;
  updateStatus: (id: number, status: string) => Promise<void>;
  deletePedido: (id: number) => Promise<void>;
};

export const usePedidos = create<PedidoState>((set, get) => ({
  pedidos: [],

  fetchPedidos: async () => {
    const { restauranteId } = useAuth.getState();
    if (!restauranteId) {
      console.warn(
        "Restaurante não definido, não será possível buscar pedidos."
      );
      return;
    }

    const res = await fetch(
      `https://mesaclick.shop/pedidos?restauranteId=${restauranteId}`
    );

    if (!res.ok) {
      throw new Error("Falha ao buscar pedidos");
    }

    const data: Pedido[] = await res.json();

    // 🔹 Agora não precisa filtrar no frontend, backend já retorna apenas os do restaurante
    set({ pedidos: data });
  },

  addPedido: async (p: PedidoInput) => {
    const { restauranteId } = useAuth.getState();
    if (!restauranteId) throw new Error("Restaurante não definido");

    // Inclui restauranteId no payload
    const payload = { ...p, restauranteId };

    // Log do payload enviado
    console.log(
      "Enviando pedido para o backend:",
      JSON.stringify(payload, null, 2)
    );

    const res = await fetch("https://mesaclick.shop/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Erro ao criar pedido:", errorText);
      throw new Error("Falha ao criar pedido");
    }

    const created: Pedido = await res.json();
    set({ pedidos: [created, ...get().pedidos] });
    return created.id;
  },

  updateStatus: async (id, status) => {
    const { restauranteId } = useAuth.getState();
    if (!restauranteId) throw new Error("Restaurante não definido");

    const payload = { status, restauranteId };

    const res = await fetch(`https://mesaclick.shop/pedidos/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Erro ao atualizar status:", errorText);
      throw new Error("Falha ao atualizar status");
    }

    const updated: Pedido = await res.json();
    set({ pedidos: get().pedidos.map((o) => (o.id === id ? updated : o)) });
  },

  deletePedido: async (id) => {
    const { restauranteId } = useAuth.getState();
    if (!restauranteId) throw new Error("Restaurante não definido");

    const res = await fetch(
      `https://mesaclick.shop/pedidos/${id}?restauranteId=${restauranteId}`,
      { method: "DELETE" }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Erro ao deletar pedido:", errorText);
      throw new Error("Falha ao deletar pedido");
    }

    set({ pedidos: get().pedidos.filter((p) => p.id !== id) });
  },
}));
