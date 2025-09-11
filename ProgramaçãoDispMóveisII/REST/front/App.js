import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';


export default function App() {
  // ip // atlas
  //const url ='http://localhost:3000'; 
  const url = 'http://192.168.1.248:3000';
  //const url ='http://10.0.2.2:3000'; 

  // useEffect(() => { }, [])

  // exebir o dados na tela
  const ExibirDados = (urlX) => {
    fetch(urlX)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      }).catch((error) => {
        console.error('Erro:', error);
      });
  }

  // inserir
  const inserirUsuario = (urlX) => {
    fetch(urlX + '/inserir', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Maria'

      }),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      }
    }).then((resp) => resp.json())
      .then((data) => {
        console.log(data);
      }).catch((error) => {
        console.error('Erro:', error);
      });
  }

  // DELETAR
  const deletarId = (urlX) => {
    fetch(urlX + '/deletar/68b8d1d05c80b4878f82ea47', {
      method: 'DELETE'
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
      }).catch((error) => {
        console.error('Erro:', error);
      });
  }

  // Alterar
  const updateDados = (urlX) => {
    fetch(urlX + '/alterar/??', {
      method: 'PUT',
      body: JSON.stringify({
        name: 'TESTE'
      }),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      }
    }).then((resp) => resp.json())
      .then((data) => {
        console.log(data);
      });
  }

  return (
    <View style={styles.container}>
      <Button
        title='Exibir Dados' onPress={() => ExibirDados(url)} />
      <Button
        title='Inserir Dados' onPress={() => inserirUsuario(url)} />

      <Button title='Deletar ID' onPress={() => deletarId(url)} />

      <Button title='Alterar Dados' onPress={() => updateDados(url)} />
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
