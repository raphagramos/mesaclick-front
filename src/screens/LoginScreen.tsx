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
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { Ionicons } from "@expo/vector-icons"; // ou react-native-vector-icons

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const login = useAuth((state) => state.login);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false); // controla visibilidade da senha

  const handleLogin = async () => {
    try {
      Keyboard.dismiss();
      await login(email, senha);
      Alert.alert("Sucesso", "Login efetuado com sucesso!");
    } catch (err) {
      Alert.alert("Erro", "Credenciais inválidas");
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      extraScrollHeight={40}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.inner}>
          <Image
            source={require("../../assets/IconLogin.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>MesaClick</Text>
          <Text style={styles.subtitle}>
            Gestão de pedidos para restaurantes
          </Text>

          {/* Email */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {/* Senha com olho */}
          <View style={styles.senhaWrapper}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Senha"
              placeholderTextColor="#888"
              secureTextEntry={!showSenha} // alterna visibilidade
              value={senha}
              onChangeText={setSenha}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowSenha(!showSenha)}
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
            <Button title="Entrar" onPress={handleLogin} color="#ff6600" />
          </View>

          <View style={{ marginTop: 20 }}>
            <Button
              title="Registrar restaurante"
              onPress={() => navigation.navigate("Registro")}
              color="#555"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  inner: {
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
  },
  eyeButton: {
    padding: 8,
    marginLeft: -40, // sobrepõe o botão no input
  },
  buttonWrapper: { width: "100%", marginTop: 8 },
});
