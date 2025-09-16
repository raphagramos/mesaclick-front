import React, { useState, useEffect, useMemo } from "react";
import styled, { ThemeProvider } from "styled-components/native";
import { Alert, FlatList } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, Lanche, PedidoInput } from "../../types";
import { theme } from "../styles/theme";
import { useLanches } from "../store/useLanches";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
import Input from "../components/Input";
import { usePedidos } from "../store/usePedidos";
import { useAuth } from "../store/useAuth";

const Container = styled.SafeAreaView`
  flex: 1;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.text};
`;

const Subtle = styled.Text`
  color: ${({ theme }) => theme.colors.subtle};
  margin-bottom: 8px;
`;

const TotalText = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-vertical: 12px;
`;

type Props = NativeStackScreenProps<RootStackParamList, "New">;

export default function CadastroPedidoScreen({ navigation }: Props) {
  const { lanches, fetchLanches } = useLanches();
  const { addPedido } = usePedidos();
  const { restauranteId } = useAuth();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [customIngredients, setCustomIngredients] = useState<Record<number, string[]>>({});
  const [note, setNote] = useState("");
  const [mesa, setMesa] = useState("");

  useEffect(() => {
    if (restauranteId) fetchLanches();
  }, [restauranteId]);

  function toggleLanche(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

    const lanche = lanches.find((l) => l.id === id);
    if (lanche?.ingredientes?.length) {
      navigation.navigate("PedidoCustom", {
        lancheId: id,
        selectedIngredients: customIngredients[id],
        mode: "pedido",
        onReturn: (selectedNames: string[]) => {
          setCustomIngredients((prev) => ({
            ...prev,
            [id]: selectedNames,
          }));
        },
      });
    }
  }

  const valorTotal = useMemo(() => {
    return selectedIds.reduce((total, id) => {
      const lanche = lanches.find((l) => l.id === id);
      return total + (lanche?.valor ?? 0);
    }, 0);
  }, [selectedIds, lanches]);

  async function salvarPedido() {
    if (!restauranteId) {
      Alert.alert("Erro", "Restaurante não definido.");
      return;
    }
    if (selectedIds.length === 0) {
      Alert.alert("Atenção", "Selecione ao menos um lanche.");
      return;
    }
    if (!mesa.trim()) {
      Alert.alert("Atenção", "Informe o número da mesa.");
      return;
    }

    const lanchesDoPedido = selectedIds.map((id) => {
      const lanche = lanches.find((l) => l.id === id)!;
      const originalNames = lanche.ingredientes;
      const selectedNames = customIngredients[id] ?? originalNames;
      const removidos = originalNames.filter((name) => !selectedNames.includes(name));

      return {
        lancheId: lanche.id,
        ingredients: removidos,
      };
    });

    try {
      const payload: PedidoInput & { valorTotal: number } = {
        mesa: mesa.trim(),
        note,
        lanches: lanchesDoPedido,
        restauranteId,
        valorTotal,
      };

      const orderId = await addPedido(payload);

      Alert.alert("Sucesso", `Pedido #${orderId} criado.`);
      navigation.goBack();
    } catch (error) {
      console.error("Falha ao salvar o pedido:", error);
      Alert.alert(
        "Erro",
        "Não foi possível salvar o pedido. Verifique os dados e tente novamente."
      );
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Title>Adicionar Lanches ao Pedido</Title>
        <Subtle>Selecione os lanches que deseja adicionar:</Subtle>

        <FlatList
          data={lanches}
          keyExtractor={(item: Lanche) => item.id.toString()}
          renderItem={({ item }) => (
            <Checkbox
              label={item.nome}
              checked={selectedIds.includes(item.id)}
              onPress={() => toggleLanche(item.id)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
        />

        <TotalText>
          Valor Total: {valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </TotalText>

        <Input
          placeholder="Número da mesa"
          value={mesa}
          onChangeText={setMesa}
          keyboardType="numeric"
        />

        <Input
          placeholder="Observações do pedido"
          value={note}
          onChangeText={setNote}
        />

        <Button title="Salvar Pedido" variant="success" onPress={salvarPedido} />
      </Container>
    </ThemeProvider>
  );
}
