import { useState } from 'react';
import { StyleSheet, View, Button, Pressable } from 'react-native';
import { TextInput, Divider, Text } from 'react-native-paper';


export default function App() {
  const [cep, setCep] = useState('');
  const [dadosCep, setDadosCep] = useState([])

  //Função para formatar o CEP
  const buscaCep = (value) => {
    let url = `https://viacep.com.br/ws/${value}/json`;
    fetch(url)
      .then((response) => { return response.json() }).then((data) => {
        console.log(data)
        setDadosCep(data);
      })
      .catch((error) => {
        console.error('Erro ao buscar CEP: ', error);
      });
  }

  return (
    <View style={styles.container}>
      <Text> Consulta o CEP: </Text>
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          width: 200,
          marginTop: 10
        }}
        label="Digite o CEP"
        placeholder="123456789"
        keyboardType="numeric"
        onChangeText={(text) => { setCep(text) }}
      ></TextInput>
      <Pressable>
        <Text style={{
          backgroundColor: 'purple',
          color: 'white',
          padding: 10,
          marginTop: 10,
          borderRadius: 5,
        }} onPress={() => buscaCep(cep)}>
          Buscar CEP
        </Text>
      </Pressable>

      <Text style={{ marginTop: 20 }}> 
      CEP: {cep}
      </Text>

      {dadosCep.length === 0 ? (
        <Text>Nenhum CEP encotrado! </Text>
      ) : (
        <View style={{ marginTop: 20, backgroundColor: 'white', padding: 10, borderRadius: 5 }}>
          <TextInput
            label='Rua'
            value={dadosCep.logradouro}
            editable={false}
            style={{ marginBottom: 10 }}
          />
          <Text>Logradouro: {dadosCep.logradouro}</Text>
          <Divider />
          <Text>Bairro: {dadosCep.bairro}</Text>
          <Divider />
          <Text>Cidade: {dadosCep.localidade}</Text>
          <Divider />
          <Text>Estado: {dadosCep.uf}</Text>
          <Divider />
          <Pressable style={{
            backgroundColor: 'red',
            padding: 10,
            borderRadius: 5,
            width: 100
          }} onPress={() => buscaCep(cep)}>
            <Text>Deletar</Text>
          </Pressable>
        </View>
      )}
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
