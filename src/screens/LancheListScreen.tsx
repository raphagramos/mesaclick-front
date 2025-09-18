import React from "react";
import styled, { ThemeProvider } from "styled-components/native";
import { theme } from "../styles/theme";
import LancheIcon from "../../assets/pedidos.svg";
import RefriIcon from "../../assets/refri.svg";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
`;

const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 12px;
`;

// Card no mesmo estilo do Home
const CardButton = styled.TouchableOpacity.attrs({
  style: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
})`
  width: 48%;
  aspect-ratio: 1;
  background-color: #fff;
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 16px;
  align-items: center;
  justify-content: center;
`;

const CardTitle = styled.Text`
  margin-top: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  flex-wrap: wrap;
`;

type Props = NativeStackScreenProps<RootStackParamList, "Lanches">;

export default function LancheListScreen({ navigation }: Props) {
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Grid>
          <CardButton
            onPress={() =>
              navigation.navigate("CadastroLanche", { comIngredientes: true })
            }
          >
            <LancheIcon width={32} height={32} fill={theme.colors.info} />
            <CardTitle>Cadastrar Lanche/Prato</CardTitle>
          </CardButton>

          <CardButton
            onPress={() =>
              navigation.navigate("CadastroLanche", { comIngredientes: false })
            }
          >
            <RefriIcon width={32} height={32} fill={theme.colors.primary} />
            <CardTitle>Cadastrar Item Simples</CardTitle>
          </CardButton>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
