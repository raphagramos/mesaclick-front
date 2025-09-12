import React, { useMemo, useState } from "react";
import styled, { ThemeProvider } from "styled-components/native";
import { Alert, FlatList } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { theme } from "../styles/theme";
import { useLanches } from "../store/useLanches";
import { usePedidos } from "../store/usePedidos";
import IngredientFlag from "../components/IngredientFlag";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuth } from "../store/useAuth";

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
`;

const Subtle = styled.Text`
  color: ${({ theme }) => theme.colors.subtle};
  margin-bottom: 8px;
`;

type Props = NativeStackScreenProps<RootStackParamList, "Pedido">;

function PedidoScreen({ route, navigation }: Props) {
  const { lancheId } = route.params;
  const { getById } = useLanches();
  const { addPedido } = usePedidos();
  const { restauranteId } = useAuth();
  const lanche = getById(lancheId);
  const [note, setNote] = useState("");
  const [mesa, setMesa] = useState("");

  // 🔹 Inicializa flags usando índice como chave
  const [flags, setFlags] = useState<Record<number, boolean>>(() => {
    if (!lanche?.ingredientes) return {};
    return Object.fromEntries(
      lanche.ingredientes.map((_, index) => [index, true])
    );
  });

  // 🔹 Ingredientes desmarcados
  const excludedNames = useMemo(() => {
    if (!lanche?.ingredientes) return [];
    return lanche.ingredientes.filter((_, index) => flags[index] === false);
  }, [flags, lanche]);

  if (!lanche) {
    return (
      <ThemeProvider theme={theme}>
        <Container>
          <Subtle>Ops, lanche não encontrado.</Subtle>
          <Button title="Voltar" onPress={() => navigation.goBack()} />
        </Container>
      </ThemeProvider>
    );
  }

  async function salvar() {
    if (!mesa.trim()) {
      Alert.alert("Atenção", "Informe o número da mesa.");
      return;
    }

    if (!restauranteId) {
      // 🔹 verifica null
      Alert.alert("Erro", "Restaurante não definido.");
      return;
    }

    try {
      const orderId = await addPedido({
        mesa: mesa.trim(),
        note,
        restauranteId, 
        lanches: [
          {
            lancheId: lanche!.id,
            ingredients: excludedNames,
          },
        ],
      });

      Alert.alert("Pedido salvo", `Pedido #${orderId} criado.`);
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Erro",
        "Não foi possível salvar o pedido. Verifique os dados e tente novamente."
      );
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Title>{lanche.nome}</Title>
        <Subtle>
          Marque para INCLUIR — desmarque o que o cliente NÃO quer.
        </Subtle>

        <FlatList
          data={lanche.ingredientes ?? []}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <IngredientFlag
              ingredient={{ id: index, name: item }}
              value={flags[index] ?? true}
              onChange={(next: boolean) =>
                setFlags((prev) => ({ ...prev, [index]: next }))
              }
            />
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
        />

        <Input
          placeholder="Número da mesa"
          value={mesa}
          onChangeText={setMesa}
          keyboardType="numeric"
        />

        <Input
          placeholder="Observações (ex.: ponto da carne, pouco sal)"
          value={note}
          onChangeText={setNote}
        />

        {excludedNames.length > 0 ? (
          <Subtle>Sem: {excludedNames.join(", ")}</Subtle>
        ) : (
          <Subtle>Nenhum ingrediente removido.</Subtle>
        )}

        <Button title="Salvar Pedido" variant="success" onPress={salvar} />
      </Container>
    </ThemeProvider>
  );
}

export default PedidoScreen;
