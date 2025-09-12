import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useAuth } from "../store/useAuth";

export default function RegisterScreen() {
  const register = useAuth((state) => state.register);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleRegister = async () => {
    try {
      await register(nome, email, senha);
      Alert.alert("Sucesso", "Restaurante registrado com sucesso!");
    } catch (err) {
      Alert.alert("Erro", "Falha ao registrar");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Restaurante</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do restaurante"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <Button title="Registrar" onPress={handleRegister} />
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
