import React from "react";
import styled from "styled-components/native";
import Card from "./Card";
import Button from "../components/Simplebutton";
import { Lanche } from "../../types";

const Title = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const Subtle = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.subtle};
  margin-top: 4px;
`;

type Props = {
  lanche: Lanche;
  onOrder?: () => void;
  onRemove?: () => void;
};

export default function LancheCard({ lanche, onOrder, onRemove }: Props) {
  const ingredientNames =
    lanche.ingredientes && lanche.ingredientes.length > 0
      ? lanche.ingredientes.join(", ")
      : "Sem ingredientes";

  return (
    <Card>
      <Title>{lanche.nome}</Title>
      <Subtle>{ingredientNames}</Subtle>

      {onOrder && (
        <Button title="Editar produto" variant="success" onPress={onOrder} />
      )}

      {onRemove && (
        <Button title="Excluir" variant="danger" onPress={onRemove} />
      )}
    </Card>
  );
}
