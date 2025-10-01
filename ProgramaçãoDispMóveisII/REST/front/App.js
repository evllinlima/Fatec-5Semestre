import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListarAlunos from "./telas/listarAlunos";
import AdicionarAlunos from "./telas/adicionarAlunos";
import VerAluno from "./telas/verAluno";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#20c997',
    secondary: '#00796b',
    background: '#e8fbf6',
    surface: '#ffffff',
    onPrimary: '#ffffff'
  },
  roundness: 8,
};

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="ListarAlunos"
          screenOptions={{
            headerStyle: { backgroundColor: theme.colors.primary },
            headerTintColor: theme.colors.onPrimary,
          }}
        >
          <Stack.Screen
            name="ListarAlunos"
            component={ListarAlunos}
            options={{ title: "Lista de Usuários" }}
          />
          <Stack.Screen
            name="AdicionarAlunos"
            component={AdicionarAlunos}
            options={{ title: "Adicionar Usuário" }}
          />
          <Stack.Screen
            name="VerAluno"
            component={VerAluno}
            options={{ title: "Visualizar Aluno" }}
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({});
