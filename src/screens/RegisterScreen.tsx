import React, { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../store/useAuth";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {
  const register = useAuth((state) => state.register);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);

  const handleRegister = async () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Erro", "Digite um e-mail válido.");
      return;
    }

    try {
      Keyboard.dismiss();
      await register(nome, email, senha);
      Alert.alert("Sucesso", "Restaurante registrado com sucesso!");
    } catch (err) {
      Alert.alert("Erro", "Falha ao registrar");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        extraScrollHeight={40}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require("../../assets/IconLogin.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Registro</Text>
        <Text style={styles.subtitle}>Crie sua conta no MesaClick</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome do restaurante"
          placeholderTextColor="#888"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Senha com olho igual ao login */}
        <View style={styles.senhaWrapper}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Senha"
            placeholderTextColor="#888"
            secureTextEntry={!showSenha}
            value={senha}
            onChangeText={setSenha}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setShowSenha((prev) => !prev)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={showSenha ? "eye-off" : "eye"}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonWrapper}>
          <Button title="Registrar" onPress={handleRegister} color="#ff6600" />
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: { width: 100, height: 100, marginBottom: 20, borderRadius: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 8, color: "#333" },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 24 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 14,
    borderRadius: 8,
    backgroundColor: "#fff",
    color: "#000",
  },
  senhaWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    padding: 4,
  },
  buttonWrapper: { width: "100%", marginTop: 8 },
});
