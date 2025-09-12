// components/Header.tsx
import React from "react";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { Alert } from "react-native";
import { useAuth } from "../store/useAuth"; // seu hook de auth

const Container = styled.View`
  flex-direction: row;
  margin-top: 20px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const RightButtons = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px; /* espaçamento entre ícones */
`;

type Props = {
  title: string;
  showBack?: boolean;
};

export default function Header({ title, showBack = true }: Props) {
  const navigation = useNavigation();
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Deseja realmente fazer logout?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", style: "destructive", onPress: () => logout() },
      ]
    );
  };

  return (
    <Container>
      {showBack ? (
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          onPress={() => navigation.goBack()}
        />
      ) : (
        <Ionicons name="arrow-back" size={24} color="transparent" />
      )}

      <Title>{title}</Title>

      <RightButtons>
        <Ionicons
          name="home"
          size={24}
          color="black"
          onPress={() => navigation.navigate("Home" as never)}
        />
        <Ionicons
          name="log-out-outline"
          size={24}
          color="black"
          onPress={handleLogout}
        />
      </RightButtons>
    </Container>
  );
}
