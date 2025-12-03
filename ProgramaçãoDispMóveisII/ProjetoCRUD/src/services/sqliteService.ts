import * as SQLite from 'expo-sqlite';

// Interface base para itens do banco
export interface BaseItem {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Usuario
export interface User extends BaseItem {
  id: number;
  email: string;
  password: string;
  name: string;
  skinType?: string;
}

// Produto de Skincare
export interface Product extends BaseItem {
  id: number;
  userId: number;
  name: string;
  category: string;
  photo?: string;
  observation?: string;
}

// Etapa da Rotina
export interface RoutineStep extends BaseItem {
  id: number;
  userId: number;
  name: string;
  timeOfDay: 'morning' | 'night';
  productId?: number;
}

let db: SQLite.SQLiteDatabase | null = null;

// Inicializar banco de dados
export async function initDatabase(): Promise<void> {
  db = await SQLite.openDatabaseAsync('projeto_crud.db');
  
  // Criar tabelas
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      skinType TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      photo TEXT,
      observation TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS routineSteps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      name TEXT NOT NULL,
      timeOfDay TEXT NOT NULL,
      productId INTEGER,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(productId) REFERENCES products(id) ON DELETE SET NULL
    );
  `);
  
  console.log('SQLite: Banco de dados inicializado');
}

// ===== USUARIOS =====

export async function createUser(email: string, password: string, name: string): Promise<number> {
  if (!db) await initDatabase();
  
  const result = await db!.runAsync(
    'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
    [email, password, name]
  );
  
  return result.lastInsertRowId;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  if (!db) await initDatabase();
  
  const user = await db!.getFirstAsync<User>(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return user || null;
}

export async function getUserById(id: number): Promise<User | null> {
  if (!db) await initDatabase();
  
  const user = await db!.getFirstAsync<User>(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  return user || null;
}

export async function updateUser(id: number, updates: Partial<Omit<User, 'id' | 'createdAt' | 'email'>>): Promise<void> {
  if (!db) await initDatabase();
  
  const setClause: string[] = [];
  const values: any[] = [];
  
  if (updates.password !== undefined) {
    setClause.push('password = ?');
    values.push(updates.password);
  }
  if (updates.name !== undefined) {
    setClause.push('name = ?');
    values.push(updates.name);
  }
  if (updates.skinType !== undefined) {
    setClause.push('skinType = ?');
    values.push(updates.skinType);
  }
  
  setClause.push('updatedAt = CURRENT_TIMESTAMP');
  values.push(id);
  
  await db!.runAsync(
    `UPDATE users SET ${setClause.join(', ')} WHERE id = ?`,
    values
  );
}

// ===== PRODUTOS =====

export async function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
  if (!db) await initDatabase();
  
  const result = await db!.runAsync(
    'INSERT INTO products (userId, name, category, photo, observation) VALUES (?, ?, ?, ?, ?)',
    [product.userId, product.name, product.category, product.photo || null, product.observation || null]
  );
  
  return result.lastInsertRowId;
}

export async function getProductsByUserId(userId: number): Promise<Product[]> {
  if (!db) await initDatabase();
  
  const products = await db!.getAllAsync<Product>(
    'SELECT * FROM products WHERE userId = ? ORDER BY createdAt DESC',
    [userId]
  );
  return products;
}

export async function getProductById(id: number): Promise<Product | null> {
  if (!db) await initDatabase();
  
  const product = await db!.getFirstAsync<Product>(
    'SELECT * FROM products WHERE id = ?',
    [id]
  );
  return product || null;
}

export async function updateProduct(id: number, product: Partial<Omit<Product, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
  if (!db) await initDatabase();
  
  const updates: string[] = [];
  const values: any[] = [];
  
  if (product.name !== undefined) {
    updates.push('name = ?');
    values.push(product.name);
  }
  if (product.category !== undefined) {
    updates.push('category = ?');
    values.push(product.category);
  }
  if (product.photo !== undefined) {
    updates.push('photo = ?');
    values.push(product.photo);
  }
  if (product.observation !== undefined) {
    updates.push('observation = ?');
    values.push(product.observation);
  }
  
  updates.push('updatedAt = CURRENT_TIMESTAMP');
  values.push(id);
  
  await db!.runAsync(
    `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
    values
  );
}

export async function deleteProduct(id: number): Promise<void> {
  if (!db) await initDatabase();
  
  await db!.runAsync('DELETE FROM products WHERE id = ?', [id]);
}

// ===== ROTINA =====

export async function createRoutineStep(step: Omit<RoutineStep, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
  if (!db) await initDatabase();
  
  const result = await db!.runAsync(
    'INSERT INTO routineSteps (userId, name, timeOfDay, productId) VALUES (?, ?, ?, ?)',
    [step.userId, step.name, step.timeOfDay, step.productId || null]
  );
  
  return result.lastInsertRowId;
}

export async function getRoutineStepsByUserId(userId: number): Promise<RoutineStep[]> {
  if (!db) await initDatabase();
  
  const steps = await db!.getAllAsync<RoutineStep>(
    'SELECT * FROM routineSteps WHERE userId = ? ORDER BY createdAt ASC',
    [userId]
  );
  return steps;
}

export async function getRoutineStepById(id: number): Promise<RoutineStep | null> {
  if (!db) await initDatabase();
  
  const step = await db!.getFirstAsync<RoutineStep>(
    'SELECT * FROM routineSteps WHERE id = ?',
    [id]
  );
  return step || null;
}

export async function updateRoutineStep(id: number, step: Partial<Omit<RoutineStep, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
  if (!db) await initDatabase();
  
  const updates: string[] = [];
  const values: any[] = [];
  
  if (step.name !== undefined) {
    updates.push('name = ?');
    values.push(step.name);
  }
  if (step.timeOfDay !== undefined) {
    updates.push('timeOfDay = ?');
    values.push(step.timeOfDay);
  }
  if (step.productId !== undefined) {
    updates.push('productId = ?');
    values.push(step.productId);
  }
  
  updates.push('updatedAt = CURRENT_TIMESTAMP');
  values.push(id);
  
  await db!.runAsync(
    `UPDATE routineSteps SET ${updates.join(', ')} WHERE id = ?`,
    values
  );
}

export async function deleteRoutineStep(id: number): Promise<void> {
  if (!db) await initDatabase();
  
  await db!.runAsync('DELETE FROM routineSteps WHERE id = ?', [id]);
}

// Fechar conexão
export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}
