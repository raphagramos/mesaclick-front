import React from "react";
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
  font-size: 26px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
`;
const RemovedText = styled.Text`
  font-style: italic;
  color: #888;
  font-weight: 400;
`;

const PedidoCard = styled.View`
  background-color: ${({ theme }) => theme.colors.card};
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 16px;
  elevation: 3;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
`;

const PedidoHeader = styled.Text`
  font-weight: 700;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const PedidoValor = styled.Text`
  font-weight: 800;
  font-size: 18px;
  color: #007acc;
  margin-bottom: 12px;
`;

const LancheText = styled.Text`
  font-size: 16px;
  margin-left: 12px;
  margin-bottom: 4px;
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
  margin-bottom: 12px;
`;

const StatusButton = styled(TouchableOpacity)<{ status: string }>`
  padding: 6px 14px;
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
    if (!restauranteId) return;

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

      const includedIngredients = l.ingredientes.filter(
        (nome) => !(ingredients ?? []).includes(nome)
      );

      return (
        <LancheText key={lancheId}>
          • {l.nome}
          {includedIngredients.length > 0 && (
            <>
              {" "}
              <RemovedText style={{ fontStyle: "italic", color: "#888" }}>
                (Sem {includedIngredients.join(", ")})
              </RemovedText>
            </>
          )}
        </LancheText>
      );
    });

  const formatValor = (valor: number | undefined) =>
    valor
      ? Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(valor)
      : "R$ 0,00";

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

              <PedidoValor>{formatValor(item.valorTotal)}</PedidoValor>

              {renderLanches(item)}

              {item.note && <NoteText>Obs: {item.note}</NoteText>}
            </PedidoCard>
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </Container>
    </ThemeProvider>
  );
}
