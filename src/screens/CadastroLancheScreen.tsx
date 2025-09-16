import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components/native";
import Input from "../components/Input";
import Button from "../components/Simplebutton";
import { theme } from "../styles/theme";
import { useLanches } from "../store/useLanches";
import { useAuth } from "../store/useAuth";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { Alert, View } from "react-native";

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
`;

const Label = styled.Text`
  color: ${({ theme }) => theme.colors.subtle};
  margin-top: 8px;
`;

type Props = NativeStackScreenProps<RootStackParamList, "CadastroLanche">;

export default function CadastroLancheScreen({ navigation, route }: Props) {
  const { comIngredientes } = route.params;
  const { addLanche } = useLanches();
  const { restauranteId } = useAuth();

  const [nome, setNome] = useState<string>("");
  const [ingredientes, setIngredientes] = useState<string>("");
  const [valor, setValor] = useState<string>("");

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function handleValorChange(text: string) {
    const clean = text.replace(/\D/g, ""); // remove tudo que não é número
    const numberValue = Number(clean) / 100;
    setValor(formatCurrency(numberValue));
  }

  async function salvar() {
    if (!restauranteId) {
      return Alert.alert(
        "Erro",
        "Restaurante não definido. Faça login novamente."
      );
    }

    if (!nome.trim()) {
      return Alert.alert("Erro", "Informe o nome do item.");
    }

    // Converte valor formatado para número
    const valorNum = Number(valor.replace(/[^0-9,-]+/g, "").replace(",", "."));
    if (!valor.trim() || isNaN(valorNum) || valorNum <= 0) {
      return Alert.alert("Erro", "Informe um valor válido.");
    }

    const ingList = comIngredientes
      ? ingredientes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    if (comIngredientes && ingList.length === 0) {
      return Alert.alert("Erro", "Informe ao menos um ingrediente.");
    }

    try {
      await addLanche(nome.trim(), valorNum, ingList);
      Alert.alert("Sucesso", "Item cadastrado!");
      navigation.navigate("Lanches");
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível cadastrar o item.");
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Label>Nome do item</Label>
        <Input
          placeholder={comIngredientes ? "Ex.: X-Salada" : "Ex.: Coca-cola"}
          value={nome}
          onChangeText={setNome}
        />

        {comIngredientes && (
          <>
            <Label>Ingredientes (separe por vírgula)</Label>
            <Input
              placeholder="Ex.: pão, hambúrguer, queijo, alface, tomate, maionese"
              value={ingredientes}
              onChangeText={setIngredientes}
              multiline
            />
          </>
        )}

        <Label>Valor (R$)</Label>
        <Input
          placeholder="0,00"
          placeholderTextColor={theme.colors.subtle}
          value={valor}
          onChangeText={handleValorChange}
          keyboardType="numeric"
        />

        <View style={{ marginTop: 16 }}>
          <Button
            title="Salvar"
            variant="success"
            onPress={salvar}
            disabled={!restauranteId}
          />
        </View>
      </Container>
    </ThemeProvider>
  );
}
