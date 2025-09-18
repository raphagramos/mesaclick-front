import { create } from "zustand";
import { useAuth } from "./useAuth";
import { Pedido, PedidoInput } from "../../types";
import { API_URL } from "@env";

type PedidoState = {
  pedidos: Pedido[];
  loading: boolean; // <-- adiciona isso
  fetchPedidos: () => Promise<void>;
  addPedido: (p: PedidoInput) => Promise<number>;
  updateStatus: (id: number, status: string) => Promise<void>;
  deletePedido: (id: number) => Promise<void>;
};

export const usePedidos = create<PedidoState>((set, get) => ({
  pedidos: [],
  loading: false, // <-- inicializa aqui

  fetchPedidos: async () => {
    const { restauranteId } = useAuth.getState();
    if (!restauranteId) {
      console.warn(
        "⚠️ Restaurante não definido, não será possível buscar pedidos."
      );
      return;
    }

    console.log("🔄 Buscando pedidos do restaurante:", restauranteId);

    set({ loading: true });
    try {
      const res = await fetch(
        `${API_URL}/pedidos?restauranteId=${restauranteId}`
      );
      console.log("📡 Status da requisição:", res.status);

      if (!res.ok) throw new Error("Falha ao buscar pedidos");

      const data: Pedido[] = await res.json();
      console.log("✅ Pedidos recebidos do backend:", data);

      set({ pedidos: data });
    } catch (err) {
      console.error("❌ Erro no fetchPedidos:", err);
    } finally {
      set({ loading: false });
    }
  },

  addPedido: async (p: PedidoInput & { valorTotal?: number }) => {
    set({ loading: true });
    try {
      const { restauranteId } = useAuth.getState();
      if (!restauranteId) throw new Error("Restaurante não definido");

      const payload = {
        ...p,
        restauranteId,
        valorTotal: p.valorTotal ?? 0,
        data: new Date().toISOString(),
      };

      const res = await fetch(`${API_URL}/pedidos`, {
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
    } finally {
      set({ loading: false });
    }
  },

  updateStatus: async (id, status) => {
    set({ loading: true });
    try {
      const { restauranteId } = useAuth.getState();
      if (!restauranteId) throw new Error("Restaurante não definido");

      const payload = { status, restauranteId };
      const res = await fetch(`${API_URL}/pedidos/${id}/status`, {
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
    } finally {
      set({ loading: false });
    }
  },

  deletePedido: async (id) => {
    set({ loading: true });
    try {
      const { restauranteId } = useAuth.getState();
      if (!restauranteId) throw new Error("Restaurante não definido");

      const res = await fetch(
        `${API_URL}/pedidos/${id}?restauranteId=${restauranteId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Erro ao deletar pedido:", errorText);
        throw new Error("Falha ao deletar pedido");
      }

      set({ pedidos: get().pedidos.filter((p) => p.id !== id) });
    } finally {
      set({ loading: false });
    }
  },
}));
