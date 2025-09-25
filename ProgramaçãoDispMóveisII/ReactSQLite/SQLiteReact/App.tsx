import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { criarBanco, criarTabela, inserirUsuario, selectTodos } from './Conf/Bd';
import { use, useEffect } from 'react';
import { SQLiteDatabase } from 'expo-sqlite';


export default function App() {
  async function main() {
    const db = await criarBanco();
    if (db) criarTabela(db);
   // inserirUsuario(db, "Evellin", "evellin@example.com");
    const registro = selectTodos(db);

    for(const linhas of registro ){
      console.log(linhas.ID_USUARIO, linhas.NOME_USUARIO, linhas.EMAIL_USUARIO);
    }
  }

  useEffect(() => {
    main();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
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
