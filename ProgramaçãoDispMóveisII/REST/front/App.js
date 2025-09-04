import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function App() {
  //ip // atlas
  const url = 'http://192.168.50.91:3000'; // verificar o ip com o comando ifconfig no terminal
  // função para exibir os dados
  const ExibirDados = (url) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
  }


return (
    <View style={styles.container}>
      <Button title="Exibir Dados" onPress={() => ExibirDados(url)} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
