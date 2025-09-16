import React from "react";
import styled, { useTheme } from "styled-components/native";
import { TextInputProps } from "react-native";

interface Props extends TextInputProps {
  // permite adicionar props extras se precisar
}

const StyledInput = styled.TextInput<{ inputColor?: string }>`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 12px 14px;
  margin-top: 8px;
  margin-bottom: 8px;
  background-color: ${({ theme }) => theme.colors.background || "#fff"};
  color: ${({ inputColor, theme }) => inputColor || theme.colors.text};
  font-size: 16px;
`;

export default function Input(props: Props) {
  const theme = useTheme();

  return (
    <StyledInput
      placeholderTextColor={theme.colors.placeholder || "#888"}
      {...props}
    />
  );
}
