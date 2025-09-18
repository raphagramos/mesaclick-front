import React, { useEffect } from "react";
import styled, { ThemeProvider } from "styled-components/native";
import { Image, StyleSheet } from "react-native";
import { theme } from "../styles/theme";

import AddIcon from "../../assets/cadastro.svg";
import NewIcon from "../../assets/new_order.svg";
import ReportsIcon from "../../assets/reports.svg";
import SearchIcon from "../../assets/consulta_pedido.svg";
import ListIcon from "../../assets/pedidos.svg";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { usePedidos } from "../store/usePedidos";
import { useLanches } from "../store/useLanches";

const cardShadow = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3, // Android
  },
});

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
`;

const Header = styled.View`
  align-items: center;
  margin-bottom: 24px;
`;

const AppLogo = styled(Image)`
  width: 72px;
  height: 72px;
  margin-bottom: 8px;
`;

const Title = styled.Text`
  font-size: 26px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const List = styled.View`
  margin-top: 16px;
`;

const CardButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  border-radius: 14px;
  padding: 16px 20px;
  margin-bottom: 14px;
`;

const IconWrapper = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
`;

const CardTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const { fetchPedidos } = usePedidos();
  const { fetchLanches } = useLanches();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchPedidos().catch((err) => console.error("Erro fetchPedidos:", err));
      fetchLanches().catch((err) => console.error("Erro fetchLanches:", err));
    });
    return unsubscribe;
  }, [navigation, fetchPedidos, fetchLanches]);

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Header>
          <AppLogo source={require("../../assets/IconLogin.png")} />
          <Title>Mesa Click</Title>
        </Header>

        <List>
          <CardButton
            style={cardShadow.shadow}
            onPress={() => navigation.navigate("Lanches")}
          >
            <IconWrapper>
              <AddIcon width={28} height={28} fill={theme.colors.primary} />
            </IconWrapper>
            <CardTitle>Cadastro</CardTitle>
          </CardButton>

          <CardButton
            style={cardShadow.shadow}
            onPress={() => navigation.navigate("New")}
          >
            <IconWrapper>
              <NewIcon width={28} height={28} fill={theme.colors.success} />
            </IconWrapper>
            <CardTitle>Novo Pedido</CardTitle>
          </CardButton>

          <CardButton
            style={cardShadow.shadow}
            onPress={() => navigation.navigate("ConsultarPedidos")}
          >
            <IconWrapper>
              <SearchIcon width={28} height={28} fill={theme.colors.info} />
            </IconWrapper>
            <CardTitle>Consultar Pedidos</CardTitle>
          </CardButton>

          <CardButton
            style={cardShadow.shadow}
            onPress={() => navigation.navigate("ProductLists")}
          >
            <IconWrapper>
              <ListIcon width={28} height={28} fill={theme.colors.info} />
            </IconWrapper>
            <CardTitle>Listagem Produtos</CardTitle>
          </CardButton>

          <CardButton
            style={cardShadow.shadow}
            onPress={() => navigation.navigate("Relatorios")}
          >
            <IconWrapper>
              <ReportsIcon width={28} height={28} fill={theme.colors.info} />
            </IconWrapper>
            <CardTitle>Relatórios</CardTitle>
          </CardButton>
        </List>
      </Container>
    </ThemeProvider>
  );
}
