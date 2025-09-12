import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useAuth } from "../store/useAuth";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const login = useAuth((state) => state.login);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, senha);
      Alert.alert("Sucesso", "Login efetuado com sucesso!");
      // 🚀 Não precisa chamar navigation, AppNavigator troca automaticamente para Home
    } catch (err) {
      Alert.alert("Erro", "Credenciais inválidas");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Restaurante</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <Button title="Entrar" onPress={handleLogin} />
      <View style={{ marginTop: 12 }}>
        <Button
          title="Registrar restaurante"
          onPress={() => navigation.navigate("RegisterRestaurant")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
  },
});
