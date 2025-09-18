import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import { listarUsuarios, excluirUsuario, editarUsuario } from '../controllers/usuarioController';

export default function ListarAlunos({ navigation }) {
	const [usuarios, setUsuarios] = useState(listarUsuarios());

	const handleExcluir = (id) => {
		excluirUsuario(id);
		setUsuarios(listarUsuarios());
	};

	const handleEditar = (id) => {
		Alert.prompt('Editar Usuário', 'Novo nome:', [
			{
				text: 'Cancelar',
				style: 'cancel',
			},
			{
				text: 'OK',
				onPress: novoNome => {
					editarUsuario(id, { nome: novoNome });
					setUsuarios(listarUsuarios());
				}
			}
		]);
	};

	return (
		<View style={{ flex: 1, padding: 16 }}>
			<Button title="Adicionar Usuário" onPress={() => navigation.navigate('AdicionarAlunos')} />
			<FlatList
				data={usuarios}
				keyExtractor={item => item.id.toString()}
				renderItem={({ item }) => (
					<View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
						<Text style={{ flex: 1 }}>{item.nome} ({item.email})</Text>
						<TouchableOpacity onPress={() => handleEditar(item.id)} style={{ marginHorizontal: 8 }}>
							<Text style={{ color: 'blue' }}>Editar</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => handleExcluir(item.id)}>
							<Text style={{ color: 'red' }}>Excluir</Text>
						</TouchableOpacity>
					</View>
				)}
			/>
		</View>
	);
}
