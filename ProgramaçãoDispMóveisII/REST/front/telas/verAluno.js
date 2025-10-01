import React, { useEffect, useState } from "react";
import { ScrollView, View, ActivityIndicator, Alert } from "react-native";
import { Card, Title, Paragraph, Button, Text } from "react-native-paper";

export default function VerAluno({ route, navigation }) {
  const { id } = route.params || {};
  const [aluno, setAluno] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /** * Função para carregar aluno pelo ID
     */
    async function load() {
      try {
        const res = await fetch(`http://10.0.2.2:3000/${id}`);
        const json = await res.json();
        setAluno(json);
      } catch (err) {
        console.warn("Erro ao carregar aluno", err);
        Alert.alert("Erro", "Não foi possível carregar o aluno");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  if (!aluno)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Aluno não encontrado</Text>
      </View>
    );

  const endereco = aluno.endereco || {};

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Card>
        <Card.Content>
          <Title>{aluno.nome}</Title>
          <Paragraph>Email: {aluno.email || "—"}</Paragraph>
          <Paragraph>ID: {aluno._id}</Paragraph>

          <Paragraph style={{ marginTop: 12, fontWeight: "bold" }}>
            Endereço
          </Paragraph>
          <Paragraph>CEP: {endereco.cep || "—"}</Paragraph>
          <Paragraph>Rua: {endereco.logradouro || "—"}</Paragraph>
          <Paragraph>Cidade: {endereco.cidade || "—"}</Paragraph>
          <Paragraph>Bairro: {endereco.bairro || "—"}</Paragraph>
          <Paragraph>Estado: {endereco.estado || "—"}</Paragraph>
          <Paragraph>Número: {endereco.numero || "—"}</Paragraph>
          <Paragraph>Complemento: {endereco.complemento || "—"}</Paragraph>

          <Paragraph style={{ marginTop: 12, fontWeight: "bold" }}>
            Cursos
          </Paragraph>
          {aluno.cursos && aluno.cursos.length > 0 ? (
            aluno.cursos.map((c, i) => <Paragraph key={i}>- {c}</Paragraph>)
          ) : (
            <Paragraph>—</Paragraph>
          )}
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={() => navigation.goBack()}>
            Voltar
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}
