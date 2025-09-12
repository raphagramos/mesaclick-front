import React, { useMemo } from "react";
import styled, { ThemeProvider } from "styled-components/native";
import { FlatList, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, Pedido, Lanche } from "../../types";
import { theme } from "../styles/theme";
import { usePedidos } from "../store/usePedidos";
import { useLanches } from "../store/useLanches";
import { useAuth } from "../store/useAuth";

const Container = styled.SafeAreaView`
  flex: 1;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
`;

const PedidoCard = styled.View`
  background-color: ${({ theme }) => theme.colors.card};
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  elevation: 3;
`;

const PedidoHeader = styled.Text`
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.text};
`;

const LancheText = styled.Text`
  font-size: 16px;
  margin-left: 8px;
  color: ${({ theme }) => theme.colors.text};
`;

const NoteText = styled.Text`
  font-style: italic;
  color: ${({ theme }) => theme.colors.subtle};
  margin-top: 8px;
`;

const StatusRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const StatusButton = styled(TouchableOpacity)<{ status: string }>`
  align-self: flex-start;
  padding: 6px 12px;
  border-radius: 20px;
  background-color: ${({ status }) =>
    status === "novo"
      ? "#D99000"
      : status === "em preparação"
      ? "#007ACC"
      : status === "pronto"
      ? "#00B050"
      : "#FF0000"};
`;

const StatusText = styled.Text`
  color: #fff;
  font-weight: 700;
`;

type Props = NativeStackScreenProps<RootStackParamList, "ConsultarPedidos">;

export default function ConsultarPedidosScreen({ navigation }: Props) {
  const { pedidos, updateStatus, deletePedido } = usePedidos();
  const { getById } = useLanches();
  const { restauranteId } = useAuth();

  const toggleStatus = async (pedido: Pedido) => {
    if (!restauranteId) return; // evita ações sem restaurante definido

    const novoStatus =
      pedido.status === "novo"
        ? "em preparação"
        : pedido.status === "em preparação"
        ? "pronto"
        : "novo";

    try {
      await updateStatus(pedido.id, novoStatus);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  const finalizePedido = async (id: number) => {
    if (!restauranteId) return;

    try {
      await deletePedido(id);
    } catch (err) {
      console.error("Erro ao finalizar pedido:", err);
    }
  };

  const renderLanches = (pedido: Pedido) =>
    pedido.lanches?.map(({ lancheId, ingredients }) => {
      const l: Lanche | undefined = getById(lancheId);
      if (!l) return null;

      // Ingredientes incluídos (não removidos)
      const includedIngredients = l.ingredientes.filter(
        (nome) => !(ingredients ?? []).includes(nome)
      );

      return (
        <LancheText key={lancheId}>
          • {l.nome}
          {includedIngredients.length > 0
            ? ` (Ingredientes: ${includedIngredients.join(", ")})`
            : ""}
        </LancheText>
      );
    });

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Title>Pedidos</Title>

        <FlatList
          data={pedidos || []}
          keyExtractor={(item: Pedido) => item.id.toString()}
          renderItem={({ item }: { item: Pedido }) => (
            <PedidoCard>
              <StatusRow>
                <StatusButton
                  status={item.status}
                  onPress={() => toggleStatus(item)}
                >
                  <StatusText>{item.status.toUpperCase()}</StatusText>
                </StatusButton>

                {item.status === "pronto" && (
                  <StatusButton
                    status="finalizar"
                    style={{ marginLeft: "auto" }}
                    onPress={() => finalizePedido(item.id)}
                  >
                    <StatusText>FINALIZAR</StatusText>
                  </StatusButton>
                )}
              </StatusRow>

              <PedidoHeader>
                Pedido #{item.id} - Mesa {item.mesa}
              </PedidoHeader>

              {renderLanches(item)}

              {item.note ? <NoteText>Obs: {item.note}</NoteText> : null}
            </PedidoCard>
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </Container>
    </ThemeProvider>
  );
}
