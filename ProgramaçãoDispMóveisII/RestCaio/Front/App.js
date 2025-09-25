import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';

export default function App() {
  // URL do servidor
  const url = 'http://192.168.50.73:3000';
  
  // Estados para controlar as telas
  const [telaAtual, setTelaAtual] = useState('menu'); // menu, adicionar, lista
  const [alunos, setAlunos] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  
  // Estados para o formulário de adicionar/editar aluno
  const [formData, setFormData] = useState({
    matricula: '',
    nome: '',
    cep: '',
    logradouro: '',
    cidade: '',
    bairro: '',
    estado: '',
    numero: '',
    complemento: '',
    cursos: ''
  });

  // BUSCAR CEP NA API VIA CEP
  const buscarCep = async (cep) => {
    try {
      const cepLimpo = cep.replace(/\D/g, '');
      if (cepLimpo.length !== 8) {
        Alert.alert('Erro', 'CEP deve ter 8 dígitos');
        return;
      }

      const response = await fetch(`${url}/buscar-cep/${cepLimpo}`);
      const data = await response.json();
      
      if (data.erro) {
        Alert.alert('Erro', 'CEP não encontrado');
        return;
      }

      setFormData(prev => ({
        ...prev,
        logradouro: data.logradouro,
        cidade: data.localidade,
        bairro: data.bairro,
        estado: data.uf
      }));
    } catch (error) {
      Alert.alert('Erro', 'Erro ao buscar CEP');
    }
  };

  // LISTAR ALUNOS
  const listarAlunos = async () => {
    try {
      const response = await fetch(`${url}/alunos`);
      const data = await response.json();
      setAlunos(data);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar alunos');
    }
  };

  // ADICIONAR ALUNO
  const adicionarAluno = async () => {
    try {
      const { matricula, nome, cep, logradouro, cidade, bairro, estado, numero, complemento, cursos } = formData;
      
      if (!matricula || !nome || !cep) {
        Alert.alert('Erro', 'Preencha pelo menos matrícula, nome e CEP');
        return;
      }

      const cursosArray = cursos ? cursos.split(',').map(curso => curso.trim()) : [];

      const alunoData = {
        matricula,
        nome,
        endereco: {
          cep,
          logradouro,
          cidade,
          bairro,
          estado,
          numero,
          complemento
        },
        cursos: cursosArray
      };

      const response = await fetch(`${url}/alunos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alunoData)
      });

      const result = await response.json();
      
      if (response.ok) {
        Alert.alert('Sucesso', 'Aluno adicionado com sucesso!');
        limparFormulario();
        setTelaAtual('menu');
      } else {
        Alert.alert('Erro', result.erro || 'Erro ao adicionar aluno');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao adicionar aluno');
    }
  };

  // ATUALIZAR ALUNO
  const atualizarAluno = async () => {
    try {
      const { matricula, nome, cep, logradouro, cidade, bairro, estado, numero, complemento, cursos } = formData;
      
      const cursosArray = cursos ? cursos.split(',').map(curso => curso.trim()) : [];

      const alunoData = {
        matricula,
        nome,
        endereco: {
          cep,
          logradouro,
          cidade,
          bairro,
          estado,
          numero,
          complemento
        },
        cursos: cursosArray
      };

      const response = await fetch(`${url}/alunos/${alunoSelecionado._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alunoData)
      });

      const result = await response.json();
      
      if (response.ok) {
        Alert.alert('Sucesso', 'Aluno atualizado com sucesso!');
        limparFormulario();
        setTelaAtual('lista');
        listarAlunos();
      } else {
        Alert.alert('Erro', result.erro || 'Erro ao atualizar aluno');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar aluno');
    }
  };

  // DELETAR ALUNO
  const deletarAluno = async (id) => {
    Alert.alert(
      'Confirmar',
      'Tem certeza que deseja deletar este aluno?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${url}/alunos/${id}`, {
                method: 'DELETE'
              });

              if (response.ok) {
                Alert.alert('Sucesso', 'Aluno deletado com sucesso!');
                listarAlunos();
              } else {
                const result = await response.json();
                Alert.alert('Erro', result.erro || 'Erro ao deletar aluno');
              }
            } catch (error) {
              Alert.alert('Erro', 'Erro ao deletar aluno');
            }
          }
        }
      ]
    );
  };

  // LIMPAR FORMULÁRIO
  const limparFormulario = () => {
    setFormData({
      matricula: '',
      nome: '',
      cep: '',
      logradouro: '',
      cidade: '',
      bairro: '',
      estado: '',
      numero: '',
      complemento: '',
      cursos: ''
    });
    setAlunoSelecionado(null);
  };

  // EDITAR ALUNO
  const editarAluno = (aluno) => {
    setAlunoSelecionado(aluno);
    setFormData({
      matricula: aluno.matricula,
      nome: aluno.nome,
      cep: aluno.endereco.cep,
      logradouro: aluno.endereco.logradouro || '',
      cidade: aluno.endereco.cidade || '',
      bairro: aluno.endereco.bairro || '',
      estado: aluno.endereco.estado || '',
      numero: aluno.endereco.numero || '',
      complemento: aluno.endereco.complemento || '',
      cursos: aluno.cursos.join(', ')
    });
    setTelaAtual('adicionar');
  };

  // RENDERIZAR TELA DO MENU
  const renderMenu = () => (
    <View style={styles.container}>
      <Text style={styles.titulo}>Sistema de Alunos</Text>
      
      <Button
        title='ADICIONAR ALUNO'
        onPress={() => {
          limparFormulario();
          setTelaAtual('adicionar');
        }}
      />

      <Button
        title='LISTAR ALUNOS'
        onPress={() => {
          listarAlunos();
          setTelaAtual('lista');
        }}
      />
    </View>
  );

  // RENDERIZAR TELA DE ADICIONAR/EDITAR
  const renderAdicionar = () => (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>
        {alunoSelecionado ? 'EDITAR ALUNO' : 'ADICIONAR ALUNO'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Matrícula"
        value={formData.matricula}
        onChangeText={(text) => setFormData(prev => ({ ...prev, matricula: text }))}
      />

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={formData.nome}
        onChangeText={(text) => setFormData(prev => ({ ...prev, nome: text }))}
      />

      <View style={styles.cepContainer}>
        <TextInput
          style={[styles.input, styles.cepInput]}
          placeholder="CEP"
          value={formData.cep}
          onChangeText={(text) => setFormData(prev => ({ ...prev, cep: text }))}
        />
        <Button
          title="Buscar"
          onPress={() => buscarCep(formData.cep)}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Logradouro"
        value={formData.logradouro}
        onChangeText={(text) => setFormData(prev => ({ ...prev, logradouro: text }))}
      />

      <TextInput
        style={styles.input}
        placeholder="Cidade"
        value={formData.cidade}
        onChangeText={(text) => setFormData(prev => ({ ...prev, cidade: text }))}
      />

      <TextInput
        style={styles.input}
        placeholder="Bairro"
        value={formData.bairro}
        onChangeText={(text) => setFormData(prev => ({ ...prev, bairro: text }))}
      />

      <TextInput
        style={styles.input}
        placeholder="Estado"
        value={formData.estado}
        onChangeText={(text) => setFormData(prev => ({ ...prev, estado: text }))}
      />

      <TextInput
        style={styles.input}
        placeholder="Número"
        value={formData.numero}
        onChangeText={(text) => setFormData(prev => ({ ...prev, numero: text }))}
      />

      <TextInput
        style={styles.input}
        placeholder="Complemento"
        value={formData.complemento}
        onChangeText={(text) => setFormData(prev => ({ ...prev, complemento: text }))}
      />

      <TextInput
        style={styles.input}
        placeholder="Cursos (separados por vírgula)"
        value={formData.cursos}
        onChangeText={(text) => setFormData(prev => ({ ...prev, cursos: text }))}
      />

      <View style={styles.buttonContainer}>
        <Button
          title={alunoSelecionado ? 'ATUALIZAR' : 'ADICIONAR'}
          onPress={alunoSelecionado ? atualizarAluno : adicionarAluno}
        />
        
        <Button
          title="CANCELAR"
          onPress={() => {
            limparFormulario();
            setTelaAtual('menu');
          }}
        />
      </View>
    </ScrollView>
  );

  // RENDERIZAR TELA DE LISTA
  const renderLista = () => (
    <View style={styles.container}>
      <Text style={styles.titulo}>LISTA DE ALUNOS</Text>
      
      <Button
        title="VOLTAR AO MENU"
        onPress={() => setTelaAtual('menu')}
      />

      <ScrollView style={styles.listaContainer}>
        {alunos.length === 0 ? (
          <Text style={styles.textoVazio}>Nenhum aluno cadastrado</Text>
        ) : (
          alunos.map((aluno) => (
            <View key={aluno._id} style={styles.alunoCard}>
              <Text style={styles.alunoNome}>{aluno.nome}</Text>
              <Text style={styles.alunoMatricula}>Matrícula: {aluno.matricula}</Text>
              <Text style={styles.alunoEndereco}>
                {aluno.endereco.logradouro}, {aluno.endereco.numero} - {aluno.endereco.cidade}/{aluno.endereco.estado}
              </Text>
              
              <View style={styles.botoesAcao}>
                <TouchableOpacity
                  style={[styles.botaoAcao, styles.botaoVer]}
                  onPress={() => {
                    setAlunoSelecionado(aluno);
                    setTelaAtual('detalhes');
                  }}
                >
                  <Text style={styles.textoBotao}>VER</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.botaoAcao, styles.botaoEditar]}
                  onPress={() => editarAluno(aluno)}
                >
                  <Text style={styles.textoBotao}>EDITAR</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.botaoAcao, styles.botaoDeletar]}
                  onPress={() => deletarAluno(aluno._id)}
                >
                  <Text style={styles.textoBotao}>DELETAR</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );

  // RENDERIZAR TELA DE DETALHES
  const renderDetalhes = () => (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>DETALHES DO ALUNO</Text>
      
      {alunoSelecionado && (
        <View style={styles.detalhesContainer}>
          <Text style={styles.detalheTitulo}>Nome:</Text>
          <Text style={styles.detalheTexto}>{alunoSelecionado.nome}</Text>
          
          <Text style={styles.detalheTitulo}>Matrícula:</Text>
          <Text style={styles.detalheTexto}>{alunoSelecionado.matricula}</Text>
          
          <Text style={styles.detalheTitulo}>Endereço:</Text>
          <Text style={styles.detalheTexto}>
            {alunoSelecionado.endereco.logradouro}, {alunoSelecionado.endereco.numero}
          </Text>
          <Text style={styles.detalheTexto}>
            {alunoSelecionado.endereco.complemento}
          </Text>
          <Text style={styles.detalheTexto}>
            {alunoSelecionado.endereco.bairro} - {alunoSelecionado.endereco.cidade}/{alunoSelecionado.endereco.estado}
          </Text>
          <Text style={styles.detalheTexto}>CEP: {alunoSelecionado.endereco.cep}</Text>
          
          <Text style={styles.detalheTitulo}>Cursos:</Text>
          <Text style={styles.detalheTexto}>
            {alunoSelecionado.cursos.length > 0 ? alunoSelecionado.cursos.join(', ') : 'Nenhum curso cadastrado'}
          </Text>
        </View>
      )}
      
      <Button
        title="VOLTAR À LISTA"
        onPress={() => setTelaAtual('lista')}
      />
    </ScrollView>
  );

  // RENDERIZAR TELA ATUAL
  const renderTelaAtual = () => {
    switch (telaAtual) {
      case 'adicionar':
        return renderAdicionar();
      case 'lista':
        return renderLista();
      case 'detalhes':
        return renderDetalhes();
      default:
        return renderMenu();
    }
  };

  return (
    <View style={styles.container}>
      {renderTelaAtual()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    fontSize: 16,
  },
  cepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  cepInput: {
    flex: 1,
    marginRight: 10,
    marginBottom: 0,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  listaContainer: {
    width: '100%',
    maxHeight: 400,
  },
  alunoCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  alunoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  alunoMatricula: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  alunoEndereco: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  botoesAcao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botaoAcao: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    minWidth: 70,
    alignItems: 'center',
  },
  botaoVer: {
    backgroundColor: '#007bff',
  },
  botaoEditar: {
    backgroundColor: '#28a745',
  },
  botaoDeletar: {
    backgroundColor: '#dc3545',
  },
  textoBotao: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  textoVazio: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 50,
  },
  detalhesContainer: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  detalheTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  detalheTexto: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
});