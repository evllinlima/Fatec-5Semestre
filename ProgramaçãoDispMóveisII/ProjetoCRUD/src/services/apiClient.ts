import * as SQLite from 'expo-sqlite';
import axios from 'axios';

/**
 * Cliente HTTP para comunicação com API MongoDB
 * Detecta automaticamente o backend preferido (SQLite ou MongoDB)
 */

// Configuração de timeout e retry para requisições HTTP
const API_BASE_URL = 'http://192.168.0.30:3001/api'; // Ajuste o IP conforme necessário
const REQUEST_TIMEOUT = 10000; // 10 segundos

export class SkincareAPI {
  private token: string | null = null;
  private useLocalDB: boolean = true; // Padrão: SQLite local

  constructor(useLocalDB = true) {
    this.useLocalDB = useLocalDB;
  }

  setToken(token: string) {
    this.token = token;
  }

  setUseLocalDB(useLocal: boolean) {
    this.useLocalDB = useLocal;
  }

  isUsingLocalDB() {
    return this.useLocalDB;
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
    };
  }

  // ===== AUTENTICAÇÃO =====

  async register(email: string, password: string, name: string) {
    try {
      if (this.useLocalDB) {
        // Usar SQLite local
        const { createUser } = await import('../services/sqliteService');
        const userId = await createUser(email, password, name);
        // Simular token local
        this.token = `local_token_${userId}`;
        return { success: true, token: this.token, userId };
      } else {
        // Usar API MongoDB
        const response = await axios.post(`${API_BASE_URL}/auth/register`, {
          email,
          password,
          name,
        }, { timeout: REQUEST_TIMEOUT });
        this.token = response.data.token;
        // Retornar resposta da API em português
        return response.data;
      }
    } catch (error) {
      console.error('Erro ao registrar:', error);
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        throw new Error('Timeout: API não está respondendo. Verifique se está rodando.');
      }
      if (axios.isAxiosError(error) && error.message.includes('Network Error')) {
        throw new Error('Erro de conexão: Não foi possível conectar à API.');
      }
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      if (this.useLocalDB) {
        // Usar SQLite local
        const { getUserByEmail } = await import('../services/sqliteService');
        const user = await getUserByEmail(email);
        if (user && user.password === password) {
          this.token = `local_token_${user.id}`;
          return {
            success: true,
            token: this.token,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              skinType: user.skinType,
            },
          };
        }
        throw new Error('Email ou senha incorretos');
      } else {
        // Usar API MongoDB
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
          email,
          password,
        }, { timeout: REQUEST_TIMEOUT });
        this.token = response.data.token;
        // Retornar resposta da API em português
        return response.data;
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        throw new Error('Timeout: API não está respondendo. Verifique se está rodando.');
      }
      if (axios.isAxiosError(error) && error.message.includes('Network Error')) {
        throw new Error('Erro de conexão: Não foi possível conectar à API.');
      }
      throw error;
    }
  }

  async getProfile() {
    try {
      if (this.useLocalDB) {
        // Token local contém o ID do usuário
        const userId = parseInt(this.token?.split('_')[2] || '0');
        const { getUserById } = await import('../services/sqliteService');
        const user = await getUserById(userId);
        return { user: { ...user, id: user?.id } };
      } else {
        const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
          headers: this.getHeaders(),
          timeout: REQUEST_TIMEOUT,
        });
        return response.data;
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        throw new Error('Timeout: API não está respondendo.');
      }
      throw error;
    }
  }

  async updateProfile(name: string, skinType?: string) {
    try {
      if (this.useLocalDB) {
        const userId = parseInt(this.token?.split('_')[2] || '0');
        const { updateUser } = await import('../services/sqliteService');
        await updateUser(userId, { name, skinType });
        return { success: true, message: 'Perfil atualizado' };
      } else {
        const response = await axios.put(
          `${API_BASE_URL}/auth/profile`,
          { name, skinType },
          { headers: this.getHeaders(), timeout: REQUEST_TIMEOUT }
        );
        return response.data;
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        throw new Error('Timeout: API não está respondendo.');
      }
      throw error;
    }
  }

  // ===== PRODUTOS =====

  async createProduct(product: {
    name: string;
    category: string;
    observation?: string;
    photo?: string;
  }) {
    try {
      if (this.useLocalDB) {
        const userId = parseInt(this.token?.split('_')[2] || '0');
        const { createProduct } = await import('../services/sqliteService');
        const productId = await createProduct({ ...product, userId });
        return { success: true, productId };
      } else {
        // Normalizar categoria para lowercase (API espera minúsculas)
        const normalizedProduct = {
          ...product,
          category: product.category.toLowerCase(),
        };
        const response = await axios.post(`${API_BASE_URL}/products`, normalizedProduct, {
          headers: this.getHeaders(),
          timeout: REQUEST_TIMEOUT,
        });
        return response.data;
      }
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        throw new Error('Timeout: API não está respondendo.');
      }
      throw error;
    }
  }

  async getProducts() {
    try {
      if (this.useLocalDB) {
        const userId = parseInt(this.token?.split('_')[2] || '0');
        const { getProductsByUserId } = await import('../services/sqliteService');
        const products = await getProductsByUserId(userId);
        return { products };
      } else {
        const response = await axios.get(`${API_BASE_URL}/products`, {
          headers: this.getHeaders(),
          timeout: REQUEST_TIMEOUT,
        });
        return response.data;
      }
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        throw new Error('Timeout: API não está respondendo.');
      }
      throw error;
    }
  }

  async getProduct(id: number | string) {
    try {
      if (this.useLocalDB) {
        const { getProductById } = await import('../services/sqliteService');
        const product = await getProductById(typeof id === 'string' ? parseInt(id) : id);
        return { product };
      } else {
        const response = await axios.get(`${API_BASE_URL}/products/${id}`, {
          headers: this.getHeaders(),
          timeout: REQUEST_TIMEOUT,
        });
        return response.data;
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        throw new Error('Timeout: API não está respondendo.');
      }
      throw error;
    }
  }

  async updateProduct(id: number | string, product: Partial<any>) {
    try {
      if (this.useLocalDB) {
        const { updateProduct } = await import('../services/sqliteService');
        await updateProduct(typeof id === 'string' ? parseInt(id) : id, product);
        return { success: true, message: 'Produto atualizado' };
      } else {
        // Normalizar categoria para lowercase se existir
        const normalizedProduct = {
          ...product,
          ...(product.category && { category: product.category.toLowerCase() }),
        };
        const response = await axios.put(`${API_BASE_URL}/products/${id}`, normalizedProduct, {
          headers: this.getHeaders(),
          timeout: REQUEST_TIMEOUT,
        });
        return response.data;
      }
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        throw new Error('Timeout: API não está respondendo.');
      }
      throw error;
    }
  }

  async deleteProduct(id: number | string) {
    try {
      if (this.useLocalDB) {
        const { deleteProduct } = await import('../services/sqliteService');
        await deleteProduct(typeof id === 'string' ? parseInt(id) : id);
        return { success: true };
      } else {
        const response = await axios.delete(`${API_BASE_URL}/products/${id}`, {
          headers: this.getHeaders(),
          timeout: REQUEST_TIMEOUT,
        });
        return response.data;
      }
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        throw new Error('Timeout: API não está respondendo.');
      }
      throw error;
    }
  }

  // ===== ETAPAS DA ROTINA =====

  async createRoutineStep(step: {
    name: string;
    timeOfDay: 'morning' | 'night';
    productId?: number | string;
  }) {
    try {
      if (this.useLocalDB) {
        const userId = parseInt(this.token?.split('_')[2] || '0');
        const { createRoutineStep } = await import('../services/sqliteService');
        const stepId = await createRoutineStep({ ...step, userId } as any);
        return { success: true, stepId };
      } else {
        const response = await axios.post(`${API_BASE_URL}/routineSteps`, step, {
          headers: this.getHeaders(),
          timeout: REQUEST_TIMEOUT,
        });
        return response.data;
      }
    } catch (error) {
      console.error('Erro ao criar etapa:', error);
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        throw new Error('Timeout: API não está respondendo.');
      }
      throw error;
    }
  }

  async getRoutineSteps() {
    try {
      if (this.useLocalDB) {
        const userId = parseInt(this.token?.split('_')[2] || '0');
        const { getRoutineStepsByUserId } = await import('../services/sqliteService');
        const steps = await getRoutineStepsByUserId(userId);
        const morning = steps.filter((s) => s.timeOfDay === 'morning');
        const night = steps.filter((s) => s.timeOfDay === 'night');
        return { morning: { steps: morning }, night: { steps: night } };
      } else {
        const response = await axios.get(`${API_BASE_URL}/routineSteps`, {
          headers: this.getHeaders(),
          timeout: REQUEST_TIMEOUT,
        });
        return response.data;
      }
    } catch (error) {
      console.error('Erro ao listar etapas:', error);
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        throw new Error('Timeout: API não está respondendo.');
      }
      throw error;
    }
  }

  async getRoutineStep(id: number | string) {
    try {
      if (this.useLocalDB) {
        const { getRoutineStepById } = await import('../services/sqliteService');
        const step = await getRoutineStepById(typeof id === 'string' ? parseInt(id) : id);
        return { step };
      } else {
        const response = await axios.get(`${API_BASE_URL}/routineSteps/${id}`, {
          headers: this.getHeaders(),
          timeout: REQUEST_TIMEOUT,
        });
        return response.data;
      }
    } catch (error) {
      console.error('Erro ao buscar etapa:', error);
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        throw new Error('Timeout: API não está respondendo.');
      }
      throw error;
    }
  }

  async updateRoutineStep(id: number | string, step: Partial<any>) {
    try {
      if (this.useLocalDB) {
        const { updateRoutineStep } = await import('../services/sqliteService');
        await updateRoutineStep(typeof id === 'string' ? parseInt(id) : id, step);
        return { success: true, message: 'Etapa atualizada' };
      } else {
        const response = await axios.put(`${API_BASE_URL}/routineSteps/${id}`, step, {
          headers: this.getHeaders(),
          timeout: REQUEST_TIMEOUT,
        });
        return response.data;
      }
    } catch (error) {
      console.error('Erro ao atualizar etapa:', error);
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        throw new Error('Timeout: API não está respondendo.');
      }
      throw error;
    }
  }

  async deleteRoutineStep(id: number | string) {
    try {
      if (this.useLocalDB) {
        const { deleteRoutineStep } = await import('../services/sqliteService');
        await deleteRoutineStep(typeof id === 'string' ? parseInt(id) : id);
        return { success: true };
      } else {
        const response = await axios.delete(`${API_BASE_URL}/routineSteps/${id}`, {
          headers: this.getHeaders(),
          timeout: REQUEST_TIMEOUT,
        });
        return response.data;
      }
    } catch (error) {
      console.error('Erro ao deletar etapa:', error);
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        throw new Error('Timeout: API não está respondendo.');
      }
      throw error;
    }
  }

  // ===== SINCRONIZAÇÃO E VALIDAÇÃO =====

  /**
   * Valida integridade dos dados no SQLite
   */
  async validateSQLiteData(): Promise<{
    usersCount: number;
    productsCount: number;
    routineStepsCount: number;
    isValid: boolean;
  }> {
    try {
      const db = await SQLite.openDatabaseAsync('projeto_crud.db');

      // Contar registros
      const usersResult = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM users'
      );
      const productsResult = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM products'
      );
      const stepsResult = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM routineSteps'
      );

      // Validar referências (foreign keys)
      const orphanedProducts = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM products WHERE userId NOT IN (SELECT id FROM users)'
      );

      const isValid =
        (orphanedProducts?.count || 0) === 0 &&
        (usersResult?.count || 0) >= 0;

      return {
        usersCount: usersResult?.count || 0,
        productsCount: productsResult?.count || 0,
        routineStepsCount: stepsResult?.count || 0,
        isValid,
      };
    } catch (error) {
      console.error('Erro ao validar dados SQLite:', error);
      return {
        usersCount: 0,
        productsCount: 0,
        routineStepsCount: 0,
        isValid: false,
      };
    }
  }

  /**
   * Sincroniza dados do SQLite com MongoDB
   */
  async syncToMongoDB(): Promise<{ synced: number; failed: number }> {
    try {
      const userId = parseInt(this.token?.split('_')[2] || '0');
      const { getProductsByUserId, getRoutineStepsByUserId } = await import(
        '../services/sqliteService'
      );

      let synced = 0;
      let failed = 0;

      // Sincronizar produtos
      const products = await getProductsByUserId(userId);
      for (const product of products) {
        try {
          await axios.post(
            `${API_BASE_URL}/products`,
            {
              name: product.name,
              category: product.category,
              observation: product.observation,
              photo: product.photo,
            },
            { headers: this.getHeaders() }
          );
          synced++;
        } catch (error) {
          failed++;
        }
      }

      // Sincronizar etapas
      const steps = await getRoutineStepsByUserId(userId);
      for (const step of steps) {
        try {
          await axios.post(
            `${API_BASE_URL}/routineSteps`,
            {
              name: step.name,
              timeOfDay: step.timeOfDay,
              productId: step.productId,
            },
            { headers: this.getHeaders() }
          );
          synced++;
        } catch (error) {
          failed++;
        }
      }

      return { synced, failed };
    } catch (error) {
      console.error('Erro ao sincronizar com MongoDB:', error);
      return { synced: 0, failed: 0 };
    }
  }
}

// Instância única (singleton)
export const skincareAPI = new SkincareAPI(true); // Padrão: SQLite local
