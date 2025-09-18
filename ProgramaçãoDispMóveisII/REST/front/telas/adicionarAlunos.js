import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { adicionarUsuario } from '../controllers/usuarioController';

export default function AdicionarAlunos({ navigation }) {
	const [nome, setNome] = useState('');
	const [email, setEmail] = useState('');

	const handleAdicionar = () => {
		if (nome && email) {
			adicionarUsuario({ nome, email });
			setNome('');
			setEmail('');
			navigation.navigate('ListarAlunos');
		}
	};

	return (
		<View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
			<Text style={{ fontSize: 18, marginBottom: 8 }}>Nome:</Text>
			<TextInput
				style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 16, padding: 8 }}
				value={nome}
				onChangeText={setNome}
				placeholder="Digite o nome"
			/>
			<Text style={{ fontSize: 18, marginBottom: 8 }}>Email:</Text>
			<TextInput
				style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 16, padding: 8 }}
				value={email}
				onChangeText={setEmail}
				placeholder="Digite o email"
				keyboardType="email-address"
			/>
			<Button title="Adicionar" onPress={handleAdicionar} />
		</View>
	);
}
