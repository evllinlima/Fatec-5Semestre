const BASE_URLS = ["http://10.0.2.2:3000", "http://localhost:3000"];

function pickBase() {
  return BASE_URLS[0];
}

/** * Lista todos os usuários
 * @returns
 */
export async function listarUsuarios() {
  try {
    const res = await fetch(`${pickBase()}/`);
    const data = await res.json();
    if (Array.isArray(data))
      return data.map((usuario) => ({ ...usuario, id: usuario._id || usuario.id }));
    return [];
  } catch (err) {
    console.warn("Erro ao listar usuários:", err);
    return [];
  }
}

/** * Adiciona um novo usuário
 * @param {*} usuario
 * @returns
 */
export async function adicionarUsuario(usuario) {
  try {
    const res = await fetch(`${pickBase()}/inserir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });
    const json = await res.json();
    if (!res.ok)
      throw new Error(
        json && json.message ? json.message : "erro ao adicionar"
      );
    return json;
  } catch (err) {
    console.warn("Erro ao adicionar usuário:", err);
    throw err;
  }
}

/** * Edita um usuário pelo ID
 * @param {*} id
 * @param {*} novoUsuario
 * @returns
 */
export async function editarUsuario(id, novoUsuario) {
  try {
    const res = await fetch(`${pickBase()}/alterar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoUsuario),
    });
    const json = await res.json();
    if (!res.ok)
      throw new Error(json && json.message ? json.message : "erro ao editar");
    return json;
  } catch (err) {
    console.warn("Erro ao editar usuário:", err);
    throw err;
  }
}

/** * Exclui um usuário pelo ID
 * @param {*} id
 * @returns
 */
export async function excluirUsuario(id) {
  try {
    const res = await fetch(`${pickBase()}/deletar/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (err) {
    console.warn("Erro ao excluir usuário:", err);
    throw err;
  }
}
