import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListarAlunos from './telas/listarAlunos';
import AdicionarAlunos from './telas/adicionarAlunos';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ListarAlunos">
        <Stack.Screen name="ListarAlunos" component={ListarAlunos} options={{ title: 'Lista de Usuários' }} />
        <Stack.Screen name="AdicionarAlunos" component={AdicionarAlunos} options={{ title: 'Adicionar Usuário' }} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
