// Controlador de usuário (usuario)
// Simulação de dados em memória
let usuarios = [
  { id: 1, nome: 'João', email: 'joao@email.com' },
  { id: 2, nome: 'Maria', email: 'maria@email.com' }
];

export function listarUsuarios() {
  return usuarios;
}

export function adicionarUsuario(usuario) {
  usuario.id = Date.now();
  usuarios.push(usuario);
}

export function editarUsuario(id, novoUsuario) {
  usuarios = usuarios.map(u => u.id === id ? { ...u, ...novoUsuario } : u);
}

export function excluirUsuario(id) {
  usuarios = usuarios.filter(u => u.id !== id);
}
