import React, { useState, useEffect } from "react";
import { View, FlatList, Modal, TextInput } from "react-native";
import {
  listarUsuarios,
  excluirUsuario,
  editarUsuario,
} from "../controllers/usuarioController";
import { Card, Paragraph, IconButton, FAB, Text, useTheme } from "react-native-paper";

export default function ListarAlunos({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [editing, setEditing] = useState(null);

  /**
   * Função para carregar a lista de usuários
   */
  async function load() {
    const list = await listarUsuarios();
    setUsuarios(list);
  }

  // carregar ao montar e ao voltar à tela
  useEffect(() => {
    load();
    const unsubscribe = navigation.addListener("focus", () => {
      load();
    });
    return unsubscribe;
  }, [navigation]);

  /**
   * Função para excluir um usuário
   * @param {*} id
   */
  const handleExcluir = async (id) => {
    await excluirUsuario(id);
    load();
  };

  /**
   * Função para enviar a edição
   */
  const submitEdit = async () => {
    if (!editing) return;
    await editarUsuario(editing.id, {
      nome: editing.nome,
      email: editing.email,
    });
    setEditing(null);
    load();
  };

  const theme = useTheme();

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList
        data={usuarios}
        keyExtractor={(item) => (item._id || item.id).toString()}
        renderItem={({ item }) => (
          <Card style={{ marginVertical: 6 }}>
            <Card.Title
              title={item.nome}
              subtitle={item.email}
              right={(props) => (
                <View style={{ flexDirection: "row" }}>
                  <IconButton
                    {...props}
                    icon="eye"
                    onPress={() =>
                      navigation.navigate("VerAluno", {
                        id: item._id || item.id,
                      })
                    }
                  />
                  <IconButton
                    {...props}
                    icon="pencil"
                    onPress={() =>
                      navigation.navigate("AdicionarAlunos", { aluno: item })
                    }
                  />
                  <IconButton
                    {...props}
                    icon="delete"
                    onPress={() => handleExcluir(item._id || item.id)}
                  />
                </View>
              )}
            />
            <Card.Content>
              <Paragraph>
                {item.endereco
                  ? item.endereco.cidade + " - " + (item.endereco.estado || "")
                  : ""}
              </Paragraph>
            </Card.Content>
          </Card>
        )}
      />

      <FAB
        icon="plus"
        label="Adicionar"
        color={theme.colors.onPrimary}
        style={{ position: "absolute", right: 16, bottom: 16, backgroundColor: theme.colors.primary }}
        onPress={() => navigation.navigate("AdicionarAlunos")}
      />

      <Modal visible={!!editing} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        >
          <View
            style={{
              width: "90%",
              backgroundColor: "#fff",
              padding: 16,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
              Editar Usuário
            </Text>
            <Text>Nome:</Text>
            <TextInput
              value={editing?.nome}
              onChangeText={(texto) => setEditing((alunoAnterior) => ({ ...alunoAnterior, nome: texto }))}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 8,
                marginBottom: 8,
              }}
            />
            <Text>Email:</Text>
            <TextInput
              value={editing?.email}
              onChangeText={(texto) => setEditing((alunoAnterior) => ({ ...alunoAnterior, email: texto }))}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 8,
                marginBottom: 12,
              }}
            />
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <IconButton icon="close" onPress={() => setEditing(null)} />
              <IconButton icon="content-save" onPress={submitEdit} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
