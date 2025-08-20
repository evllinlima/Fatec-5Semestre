import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";

const estilo = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    width: 100,
  },
  label: {
    color: "#545454",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

const Alert = () => {
  return (
    console.log('Quero ir embora ja deu!!!')
  );
};

const Campos = () => {
  let label = "Nome :";
  const [campo, setCampo] = useState("");

  return (
    <View>
      <Text style= {[estilo.label, {fontSize: 12}]}>{label}</Text>
      <TextInput style={estilo.input}
        onChangeText={(text) => {
          setCampo(text);
        }}
      />
      <Button title="Ver" onPress={() => {Alert()}} />
      <Text>Digitado {campo}</Text>
    </View>
  );
};

export default Campos;
