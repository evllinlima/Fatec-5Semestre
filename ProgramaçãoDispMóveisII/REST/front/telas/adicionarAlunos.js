import React, { useState, useEffect } from "react";
import { ScrollView, View, Alert } from "react-native";
import {
  adicionarUsuario,
  editarUsuario,
} from "../controllers/usuarioController";
import { TextInput, Button, Chip, Title, Paragraph } from "react-native-paper";

export default function AdicionarAlunos({ navigation, route }) {
  // matrícula removida — usaremos _id do Mongo para identificar
  const aluno = route?.params?.aluno || null;
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [estado, setEstado] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  // cursos selecionados como array
  const [cursosSelected, setCursosSelected] = useState([]);
  const availableCourses = [
    "Desenvolvimento de Software Multiplataforma",
    "Controle de Obras",
    "Ciência de Dados para Negócios",
  ];

  /**
   * Função para adicionar ou editar aluno
   */
  const handleAdicionar = async () => {
    if (!nome) return Alert.alert("Validação", "Nome é obrigatório");
    try {
      const payload = {
        nome,
        email,
        endereco: {
          cep,
          logradouro,
          cidade,
          bairro,
          estado,
          numero,
          complemento,
        },
        cursos: cursosSelected,
      };

      // se tiver aluno edita, senão, cria
      if (aluno) {
        const updated = await editarUsuario(aluno._id || aluno.id, payload);
      } else {
        const created = await adicionarUsuario(payload);
      }

      // limpar campos e voltar
      setNome("");
      setEmail("");
      setCep("");
      setLogradouro("");
      setCidade("");
      setBairro("");
      setEstado("");
      setNumero("");
      setComplemento("");
      setCursosSelected([]);
      navigation.goBack();
    } catch (err) {
      Alert.alert(
        "Erro",
        err.message || "Não foi possível adicionar/editar o usuário"
      );
    }
  };

  // preenche o formulário se estiver em modo edição
  useEffect(() => {
    if (aluno) {
      setNome(aluno.nome || "");
      setEmail(aluno.email || "");
      const e = aluno.endereco || {};
      setCep(e.cep || "");
      setLogradouro(e.logradouro || "");
      setCidade(e.cidade || "");
      setBairro(e.bairro || "");
      setEstado(e.estado || "");
      setNumero(e.numero || "");
      setComplemento(e.complemento || "");
      setCursosSelected(Array.isArray(aluno.cursos) ? aluno.cursos : []);
    }
  }, [aluno]);

  /** * Função para buscar endereço via CEP usando a API ViaCEP
   * @param {*} cepValue
   */

  async function fetchViaCep(cepValue) {
    const raw = (cepValue || cep || "").replace(/[^0-9]/g, "");
    if (!raw || raw.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
      const json = await res.json();
      if (!json || json.erro) return;
      setLogradouro(json.logradouro || "");
      setCidade(json.localidade || "");
      setBairro(json.bairro || "");
      setEstado(json.uf || "");
    } catch (err) {
      console.warn("ViaCEP erro", err);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Title style={{ marginBottom: 8 }}>
        {aluno ? "Editar Aluno" : "Novo Aluno"}
      </Title>
      <TextInput
        label="Nome"
        value={nome}
        mode="outlined"
        onChangeText={setNome}
        style={{ marginBottom: 8 }}
      />
      <TextInput
        label="Email"
        value={email}
        mode="outlined"
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{ marginBottom: 8 }}
      />

      <Paragraph style={{ marginTop: 8, marginBottom: 4 }}>Endereço</Paragraph>
      <TextInput
        label="CEP"
        value={cep}
        mode="outlined"
        onChangeText={setCep}
        onBlur={() => fetchViaCep()}
        style={{ marginBottom: 8 }}
      />
      <Button
        mode="outlined"
        onPress={() => fetchViaCep(cep)}
        style={{ marginBottom: 8 }}
      >
        Buscar CEP
      </Button>
      <TextInput
        label="Rua"
        value={logradouro}
        mode="outlined"
        onChangeText={setLogradouro}
        style={{ marginBottom: 8 }}
      />
      <TextInput
        label="Cidade"
        value={cidade}
        mode="outlined"
        onChangeText={setCidade}
        style={{ marginBottom: 8 }}
      />
      <TextInput
        label="Bairro"
        value={bairro}
        mode="outlined"
        onChangeText={setBairro}
        style={{ marginBottom: 8 }}
      />
      <TextInput
        label="Estado"
        value={estado}
        mode="outlined"
        onChangeText={setEstado}
        style={{ marginBottom: 8 }}
      />
      <TextInput
        label="Número"
        value={numero}
        mode="outlined"
        onChangeText={setNumero}
        style={{ marginBottom: 8 }}
      />
      <TextInput
        label="Complemento"
        value={complemento}
        mode="outlined"
        onChangeText={setComplemento}
        style={{ marginBottom: 8 }}
      />

      <Paragraph style={{ marginTop: 8 }}>
        Cursos (toque para selecionar)
      </Paragraph>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginVertical: 8 }}>
        {availableCourses.map((curso) => {
          const selected = cursosSelected.includes(curso);
          return (
            <Chip
              key={curso}
              mode={selected ? "flat" : "outlined"}
              selected={selected}
              onPress={() =>
                setCursosSelected((prev) =>
                  selected ? prev.filter((cursoAnterior) => cursoAnterior !== curso) : [...prev, curso]
                )
              }
              style={{ margin: 4 }}
            >
              {curso}
            </Chip>
          );
        })}
      </View>

      <Button mode="contained" onPress={handleAdicionar}>
        {aluno ? "Salvar" : "Adicionar"}
      </Button>
    </ScrollView>
  );
}
