import { useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';

export default function App() {
  const [cep, setCep] = useState('');

  //Função para formatar o CEP
  const buscaCep = (value) => {
    let url = `https://viacep.com.br/ws/${value}/json`;
    fetch(url)
      .then((response) => { return response.json() }).then((data) => { console.log(data) })
      .catch((error) => {
        console.error('Erro ao buscar CEP: ', error);
      });
  }

  return (
    <View style={styles.container}>
      <Text> Digite o CEP: </Text>
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          width: 200,
          marginTop: 10
        }} placeholder="123456789"
        keyboardType="numeric"
        onChangeText={(text) => { setCep(text) }}></TextInput>
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
