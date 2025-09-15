import React, { useEffect } from "react";
import styled, { ThemeProvider } from "styled-components/native";
import { Image } from "react-native";
import Button from "../components/Button";
import { theme } from "../styles/theme";
import AddIcon from "../../assets/cadastro.svg";
import NewIcon from "../../assets/new_order.svg";
import SearchIcon from "../../assets/consulta_pedido.svg";
import ListIcon from "../../assets/pedidos.svg";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { usePedidos } from "../store/usePedidos";
import { useLanches } from "../store/useLanches";

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

const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 12px;
`;

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const { fetchPedidos } = usePedidos();
  const { fetchLanches } = useLanches();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchPedidos().catch(err => console.error("Erro fetchPedidos:", err));
      fetchLanches().catch(err => console.error("Erro fetchLanches:", err));
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

        <Grid>
          <Button
            title="Cadastro"
            icon={AddIcon}
            onPress={() => navigation.navigate("Lanches")}
          />
          <Button
            title="Novo Pedido"
            icon={NewIcon}
            variant="success"
            onPress={() => navigation.navigate("New")}
          />
          <Button
            title="Consultar Pedidos"
            icon={SearchIcon}
            variant="info"
            onPress={() => navigation.navigate("ConsultarPedidos")}
          />
          <Button
            title="Listagem Produtos"
            icon={ListIcon}
            variant="info"
            onPress={() => navigation.navigate("ProductLists")}
          />
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
