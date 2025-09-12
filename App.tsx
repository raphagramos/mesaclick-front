import { ThemeProvider } from "styled-components/native";
import { theme } from "./src/styles/theme";
import AppNavigator from "./src/navigation/AppNavigator";
import 'react-native-get-random-values';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppNavigator />
    </ThemeProvider>
  );
}