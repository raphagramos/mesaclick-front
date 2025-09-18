import { Key } from "react";

export type Ingredient = {
  id: number;
  name: string;
};

export type IngredientSelection = Ingredient & {
  selected: boolean;
};

// Lanche
export type Lanche = {
  id: number;
  nome: string;
  ingredientes: string[];
  valor: number;
};

// Pedido (input e retorno do backend)
export type PedidoInput = {
  mesa: string;
  note: string;
  restauranteId: number;
  lanches: {
    id: Key | null | undefined;
    valor: any;
    lancheId: number; // objeto, não mais lancheId
    ingredients: string[]; // nomes dos removidos
  }[];
  valorTotal: number;
};

export type Pedido = PedidoInput & {
  id: number;
  status: string;
  createdAt: string; // ISO string vinda do backend
  restauranteId: number;
  data: string;
};

// Navegação
export type RootStackParamList = {
  Home: undefined;
  Lanches: undefined;
  Registro: undefined;
  Login: undefined;
  CadastroLanche: { comIngredientes: boolean };
  ProductLists: undefined;
  Relatorios: undefined;
  Pedido: { lancheId: number }; // agora number
  PedidoCustom: {
    lancheId: number;
    selectedIngredients?: string[];
    onReturn?: (selected: string[]) => void;
    mode: "pedido" | "cadastro";
  };
  New: undefined;
  ConsultarPedidos: undefined;
};
