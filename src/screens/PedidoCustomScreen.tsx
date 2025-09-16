import React, { useState, useMemo } from "react";
import styled, { ThemeProvider } from "styled-components/native";
import { FlatList, TextInput, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, Ingredient } from "../../types";
import { theme } from "../styles/theme";
import { useLanches } from "../store/useLanches";
import Button from "../components/Simplebutton";
import Checkbox from "../components/Checkbox";

const Container = styled.SafeAreaView`
  flex: 1;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Title = styled.Text<{ size?: number; bold?: boolean }>`
  font-size: ${({ size }) => size ?? 22}px;
  font-weight: ${({ bold }) => (bold ? "800" : "normal")};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
`;

const Input = styled(TextInput)`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 8px;
  border-radius: 8px;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.text};
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const DeleteText = styled.Text`
  color: red;
  font-size: 18px;
  font-weight: bold;
  padding: 4px 8px;
`;

type Props = NativeStackScreenProps<RootStackParamList, "PedidoCustom">;

let nextId = 1000;

export default function PedidoCustomScreen({ route, navigation }: Props) {
  const { lancheId, mode, onReturn, selectedIngredients } = route.params;
  const { getById, updateIngredients } = useLanches();
  const lancheOriginal = getById(lancheId);

  const ingredientesComId: Ingredient[] = useMemo(
    () =>
      (lancheOriginal?.ingredientes ?? []).map((name) => ({
        id: nextId++,
        name,
      })),
    [lancheOriginal?.ingredientes]
  );

  const [ingredientes, setIngredientes] = useState<Ingredient[]>(ingredientesComId);
  const [newIngredient, setNewIngredient] = useState("");
  const [valor, setValor] = useState<string>(
    lancheOriginal?.valor != null
      ? formatCurrency(Number(lancheOriginal.valor))
      : ""
  );

  const [flags, setFlags] = useState<Record<number, boolean>>(
    () =>
      Object.fromEntries(
        ingredientesComId.map((i) => [
          i.id,
          selectedIngredients ? selectedIngredients.includes(i.name) : true,
        ])
      ) as Record<number, boolean>
  );

  const allowIngredients = mode === "cadastro" && (lancheOriginal?.ingredientes?.length ?? 0) > 0;

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function addIngredient() {
    if (!newIngredient.trim()) return;
    const novos = newIngredient
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0)
      .map((name): Ingredient => ({ id: nextId++, name }));

    setIngredientes((prev) => [...prev, ...novos]);
    setFlags((prev) => {
      const updated = { ...prev };
      novos.forEach((i) => (updated[i.id] = true));
      return updated;
    });
    setNewIngredient("");
  }

  function deleteIngredient(id: number) {
    setIngredientes((prev) => prev.filter((i) => i.id !== id));
    setFlags((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  }

  function salvar() {
    const nomes = ingredientes.map((i) => i.name);

    const valorNum = Number(valor.replace(/[^0-9,-]+/g, "").replace(",", "."));
    if (isNaN(valorNum) || valorNum <= 0) {
      alert("Informe um valor válido.");
      return;
    }

    if (mode === "cadastro" && lancheOriginal) {
      updateIngredients(lancheId, nomes, valorNum);
    }

    if (onReturn) {
      const selecionados = ingredientes
        .filter((i) => flags[i.id])
        .map((i) => i.name);
      onReturn(selecionados);
    }

    navigation.goBack();
  }

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Title>{lancheOriginal?.nome}</Title>
{mode !== "pedido" && (
  <>
        <Title size={16} bold style={{ marginBottom: 4 }}>
          Valor:
        </Title>
        <Input
          placeholder="0,00"
          placeholderTextColor={theme.colors.subtle}
          value={valor}
          onChangeText={(text) => {
            const clean = text.replace(/\D/g, "");
            const numberValue = Number(clean) / 100;
            setValor(formatCurrency(numberValue));
          }}
          keyboardType="numeric"
        />
</>)}
        {allowIngredients && (
          <>
            <Input
              placeholder="Adicione múltiplos, separados por ','"
              placeholderTextColor={theme.colors.subtle}
              value={newIngredient}
              onChangeText={setNewIngredient}
              onSubmitEditing={addIngredient}
            />
            <Button title="Adicionar ingrediente" onPress={addIngredient} />
          </>
        )}

        <FlatList
          data={ingredientes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Row>
              {mode === "pedido" ? (
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
                  onPress={() =>
                    setFlags((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                  }
                >
                  <Checkbox
                    label={item.name}
                    checked={flags[item.id] ?? true}
                    onPress={() =>
                      setFlags((prev) => ({ ...prev, [item.id]: !(prev[item.id] ?? true) }))
                    }
                  />
                </TouchableOpacity>
              ) : (
                <Title size={16} style={{ fontWeight: "normal" }}>
                  {item.name}
                </Title>
              )}

              {allowIngredients && (
                <TouchableOpacity onPress={() => deleteIngredient(item.id)}>
                  <DeleteText>✕</DeleteText>
                </TouchableOpacity>
              )}
            </Row>
          )}
        />

        <Button title="Salvar" onPress={salvar} />
      </Container>
    </ThemeProvider>
  );
}
