import React, { useMemo, useState } from "react";
import styled, { ThemeProvider } from "styled-components/native";
import { Alert, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { theme } from "../styles/theme";
import { useLanches } from "../store/useLanches";
import { usePedidos } from "../store/usePedidos";
import { useAuth } from "../store/useAuth";
import IngredientFlag from "../components/IngredientFlag";
import Button from "../components/Button";
import Input from "../components/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
`;

const Header = styled.View`
  align-items: center;
  margin-bottom: 16px;
`;

const AppLogo = styled(Image)`
  width: 56px;
  height: 56px;
  margin-bottom: 6px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

const Subtle = styled.Text`
  color: ${({ theme }) => theme.colors.subtle};
  margin-bottom: 12px;
  text-align: center;
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

  const [flags, setFlags] = useState<Record<number, boolean>>(() =>
    lanche?.ingredientes
      ? Object.fromEntries(lanche.ingredientes.map((_, i) => [i, true]))
      : {}
  );

  const excludedNames = useMemo(
    () =>
      lanche?.ingredientes?.filter((_, i) => flags[i] === false) ?? [],
    [flags, lanche]
  );

  if (!lanche) {
    return (
      <ThemeProvider theme={theme}>
        <Container>
          <Header>
            <AppLogo source={require("../../assets/icon.png")} />
          </Header>
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
      Alert.alert("Erro", "Restaurante não definido.");
      return;
    }

    try {
      const orderId = await addPedido({
        mesa: mesa.trim(),
        note,
        restauranteId,
        lanches: [{ lancheId: lanche!.id, ingredients: excludedNames }],
      });

      Alert.alert("Pedido salvo", `Pedido #${orderId} criado.`);
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar o pedido.");
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        extraScrollHeight={80} // dá um respiro extra quando o teclado abre
      >
        <Container>
          <Header>
            <AppLogo source={require("../../assets/IconLogin.png")} />
            <Title>{lanche.nome}</Title>
          </Header>

          <Subtle>
            Marque para INCLUIR — desmarque o que o cliente NÃO quer.
          </Subtle>

          {lanche.ingredientes?.map((item, index) => (
            <IngredientFlag
              key={index}
              ingredient={{ id: index, name: item }}
              value={flags[index] ?? true}
              onChange={(next: boolean) =>
                setFlags((prev) => ({ ...prev, [index]: next }))
              }
            />
          ))}

          <Input
            placeholder="Número da mesa"
            value={mesa}
            onChangeText={setMesa}
            keyboardType="numeric"
            placeholderTextColor={theme.colors.subtle}
          />

          <Input
            placeholder="Observações (ex.: ponto da carne, pouco sal)"
            value={note}
            onChangeText={setNote}
            placeholderTextColor={theme.colors.subtle}
          />

          {excludedNames.length > 0 ? (
            <Subtle>Sem: {excludedNames.join(", ")}</Subtle>
          ) : (
            <Subtle>Nenhum ingrediente removido.</Subtle>
          )}

          <Button title="Salvar Pedido" variant="success" onPress={salvar} />
        </Container>
      </KeyboardAwareScrollView>
    </ThemeProvider>
  );
}

export default PedidoScreen;
