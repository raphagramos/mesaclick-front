import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LancheListScreen from "../screens/LancheListScreen";
import CadastroLancheScreen from "../screens/CadastroLancheScreen";
import PedidoScreen from "../screens/PedidoScreen";
import CadastroPedidoScreen from "../screens/CadastroPedidos";
import ConsultarPedidosScreen from "../screens/ConsultaPedidos";
import PedidoCustomScreen from "../screens/PedidoCustomScreen";
import ProductList from "../screens/ProductsList";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { useAuth } from "../store/useAuth";
import { RootStackParamList } from "../../types";
import Header from "../components/Header";
import RelatorioScreen from "../screens/RelatorioScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const restauranteId = useAuth((state) => state.restauranteId);

  return (
    <NavigationContainer>
      <Stack.Navigator >
        {restauranteId ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ header: () => <Header title="Home" /> }}
            />
            <Stack.Screen
              name="Lanches"
              component={LancheListScreen}
              options={{ header: () => <Header title="Lanches" /> }}
            />
            <Stack.Screen
              name="CadastroLanche"
              component={CadastroLancheScreen}
              options={{ header: () => <Header title="Cadastro Lanche" /> }}
            />
            <Stack.Screen
              name="ProductLists"
              component={ProductList}
              options={{ header: () => <Header title="Produtos" /> }}
            />
            <Stack.Screen
              name="New"
              component={CadastroPedidoScreen}
              options={{ header: () => <Header title="Novo Pedido" /> }}
            />
            <Stack.Screen
              name="Pedido"
              component={PedidoScreen}
              options={{ header: () => <Header title="Pedido" /> }}
            />
            <Stack.Screen
              name="PedidoCustom"
              component={PedidoCustomScreen}
              options={{ header: () => <Header title="Pedido Custom" /> }}
            />
            <Stack.Screen
              name="ConsultarPedidos"
              component={ConsultarPedidosScreen}
              options={{ header: () => <Header title="Consultar Pedidos" /> }}
            />
             <Stack.Screen
              name="Relatorios"
              component={RelatorioScreen}
              options={{ header: () => <Header title="Relatórios" /> }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registro" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
