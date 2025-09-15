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
} from "react-native";
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
    } catch (err) {
      Alert.alert("Erro", "Credenciais inválidas");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        extraScrollHeight={40} // 👈 empurra mais quando teclado abre
        enableOnAndroid={true} // 👈 garante que funcione no Android
      >
        <Image source={require("../../assets/IconLogin.png")} style={styles.logo} />
        <Text style={styles.title}>MesaClick</Text>
        <Text style={styles.subtitle}>Gestão de pedidos para restaurantes</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#888"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

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
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 },
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
  buttonWrapper: { width: "100%", marginTop: 8 },
});
