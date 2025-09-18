import React, { useEffect } from "react";
import { ScrollView, Alert, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { usePedidos } from "../store/usePedidos"; 
import { useLanches } from "../store/useLanches"; 
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
`;

const FilterRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Button = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 10px 16px;
  border-radius: 8px;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: 600;
`;

const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
`;

const CardText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
`;

export default function RelatorioScreen() {
  const { pedidos, loading, fetchPedidos } = usePedidos();
  const { getById, fetchLanches } = useLanches();
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [showStartPicker, setShowStartPicker] = React.useState(false);
  const [showEndPicker, setShowEndPicker] = React.useState(false);

  useEffect(() => {
    console.log("📲 Entrou na tela Relatório");
    fetchPedidos();
    fetchLanches(); // garante que os lanches estão no store
  }, []);

  const filteredPedidos = pedidos.filter((p) => {
    const data = new Date(p.createdAt);
    const start = new Date(startDate.setHours(0, 0, 0, 0));
    const end = new Date(endDate.setHours(23, 59, 59, 999));
    const isInRange = data >= start && data <= end;
    console.log(`📌 Pedido ${p.id} - Dentro do período?`, isInRange);
    return isInRange;
  });

  useEffect(() => {
    console.log("📋 Pedidos no store:", pedidos);
    console.log("📋 Pedidos filtrados:", filteredPedidos);
  }, [pedidos, startDate, endDate]);

  const exportPDF = async () => {
    try {
      const html = `
        <h1 style="text-align: center;">Relatório de Pedidos</h1>
        <p style="text-align: center;">Período: ${startDate.toLocaleDateString()} até ${endDate.toLocaleDateString()}</p>
        <table border="1" cellspacing="0" cellpadding="5" width="100%">
          <tr>
            <th>Mesa</th><th>Status</th><th>Nota</th><th>Lanches</th><th>Total</th>
          </tr>
          ${filteredPedidos
            .map(
              (p) => `
              <tr>
                <td>${p.mesa}</td>
                <td>${p.status}</td>
                <td>${p.note || "-"}</td>
                <td>
                  ${p.lanches
                    .map((l) => {
                      const lanche = getById(l.lancheId);
                      return lanche
                        ? `${lanche.nome} (${lanche.ingredientes.join(", ")}) - R$ ${lanche.valor.toFixed(2)}`
                        : `Lanche ${l.lancheId} - R$ ${l.valor.toFixed(2)}`;
                    })
                    .join("<br/>")}
                </td>
                <td>R$ ${p.valorTotal.toFixed(2)}</td>
              </tr>`
            )
            .join("")}
        </table>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Não foi possível gerar o PDF");
    }
  };

  return (
    <Container>
      <Title>Relatório de Pedidos</Title>

      {/* Filtros */}
      <FilterRow>
        <Button onPress={() => setShowStartPicker(true)}>
          <ButtonText>Início: {startDate.toLocaleDateString()}</ButtonText>
        </Button>
        <Button onPress={() => setShowEndPicker(true)}>
          <ButtonText>Fim: {endDate.toLocaleDateString()}</ButtonText>
        </Button>
      </FilterRow>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          onChange={(e, date) => {
            setShowStartPicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          onChange={(e, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredPedidos.map((pedido) => (
            <Card key={pedido.id}>
              <CardText>Mesa: {pedido.mesa}</CardText>
              <CardText>Status: {pedido.status}</CardText>
              <CardText>Nota: {pedido.note || "-"}</CardText>

              {pedido.lanches.map((l) => {
                const lancheInfo = getById(l.lancheId);
                return (
                  <CardText key={l.id}>
                    {lancheInfo
                      ? `${lancheInfo.nome}: ${lancheInfo.ingredientes.join(", ")} - R$ ${lancheInfo.valor.toFixed(2)}`
                      : `Lanche ${l.lancheId} - R$ ${l.valor.toFixed(2)}`}
                  </CardText>
                );
              })}

              <CardText>Total: R$ {pedido.valorTotal.toFixed(2)}</CardText>
            </Card>
          ))}

          <Button
            onPress={exportPDF}
            style={{ marginTop: 16, alignSelf: "center" }}
          >
            <ButtonText>Exportar PDF</ButtonText>
          </Button>
        </ScrollView>
      )}
    </Container>
  );
}
