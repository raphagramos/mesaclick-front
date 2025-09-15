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
  const [secure, setSecure] = useState(true); 

  const handleRegister = async () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Erro", "Digite um e-mail válido.");
      return;
    }

    try {
      await register(nome, email, senha);
      Alert.alert("Sucesso", "Restaurante registrado com sucesso!");
    } catch (err) {
      Alert.alert("Erro", "Falha ao registrar");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        extraScrollHeight={40}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag" // 👈 fecha teclado ao puxar pra baixo
        alwaysBounceVertical={true}   // 👈 força scroll mesmo se o conteúdo for pequeno
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

        {/* Campo de senha com botão de olho */}
        <View style={styles.passwordWrapper}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Senha"
            placeholderTextColor="#888"
            secureTextEntry={secure}
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity
            onPress={() => setSecure((prev) => !prev)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={secure ? "eye-off" : "eye"}
              size={22}
              color="#555"
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
  },
  passwordWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 14,
  },
  eyeButton: {
    paddingHorizontal: 12,
  },
  buttonWrapper: { width: "100%", marginTop: 8 },
});
