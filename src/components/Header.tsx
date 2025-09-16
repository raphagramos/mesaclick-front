// components/Header.tsx
import React from "react";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { Alert } from "react-native";
import { useAuth } from "../store/useAuth";

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
  flex: 1;
  text-align: center;
`;

const LeftButton = styled.View`
  width: 40px;
  align-items: flex-start;
`;

const RightButtons = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

type Props = {
  title: string;
};

export default function Header({ title }: Props) {
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
      <LeftButton>
        <Ionicons
          name="home"
          size={24}
          color="black"
          onPress={() => navigation.navigate("Home" as never)}
        />
      </LeftButton>

      <Title>{title}</Title>

      <RightButtons>
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
