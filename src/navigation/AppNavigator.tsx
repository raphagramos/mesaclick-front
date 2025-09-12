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

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const restauranteId = useAuth((state) => state.restauranteId);

  return (
    <NavigationContainer>
      <Header title={""}/>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {restauranteId ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Lanches" component={LancheListScreen} />
            <Stack.Screen name="CadastroLanche" component={CadastroLancheScreen} />
            <Stack.Screen name="ProductLists" component={ProductList} />
            <Stack.Screen name="New" component={CadastroPedidoScreen} />
            <Stack.Screen name="Pedido" component={PedidoScreen} />
            <Stack.Screen name="PedidoCustom" component={PedidoCustomScreen} />
            <Stack.Screen name="ConsultarPedidos" component={ConsultarPedidosScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="RegisterRestaurant" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
