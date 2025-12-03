// Configuração da API MongoDB (substitua pela URL do seu backend)
const API_BASE_URL = 'http://seu-servidor.com/api'; // Altere para sua URL

// Interface base para itens do banco
export interface BaseItem {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Exemplo de interface para dados genéricos
export interface DataItem extends BaseItem {
  name: string;
  description?: string;
}

// Headers padrão para requisições
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Função auxiliar para tratar erros
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erro na requisição');
  }
  return response.json();
}

// Criar item
export async function createItem(item: Omit<DataItem, '_id' | 'createdAt' | 'updatedAt'>): Promise<DataItem> {
  const response = await fetch(`${API_BASE_URL}/items`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(item),
  });
  
  return handleResponse<DataItem>(response);
}

// Ler todos os itens
export async function getAllItems(): Promise<DataItem[]> {
  const response = await fetch(`${API_BASE_URL}/items`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  
  return handleResponse<DataItem[]>(response);
}

// Ler item por ID
export async function getItemById(id: string): Promise<DataItem> {
  const response = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  
  return handleResponse<DataItem>(response);
}

// Atualizar item
export async function updateItem(id: string, item: Partial<Omit<DataItem, '_id' | 'createdAt'>>): Promise<DataItem> {
  const response = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: 'PUT',
    headers: defaultHeaders,
    body: JSON.stringify(item),
  });
  
  return handleResponse<DataItem>(response);
}

// Deletar item
export async function deleteItem(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: 'DELETE',
    headers: defaultHeaders,
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erro ao deletar');
  }
}

// Deletar todos os itens
export async function deleteAllItems(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/items`, {
    method: 'DELETE',
    headers: defaultHeaders,
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erro ao deletar todos');
  }
}

// Configurar URL base da API
export function setApiBaseUrl(url: string): void {
  // Se precisar alterar a URL dinamicamente
  console.log(`MongoDB API URL: ${url}`);
}

// Verificar conexão com o servidor
export async function checkConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: defaultHeaders,
    });
    return response.ok;
  } catch {
    return false;
  }
}
