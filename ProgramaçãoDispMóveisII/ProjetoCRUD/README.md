# 📚 DOCUMENTAÇÃO COMPLETA - PROJETO SKINCARE APP

**Data**: 2 de dezembro de 2025  
**Status**: ✅ Completo e Testado  
**Versão**: 1.0

---

## 📑 ÍNDICE

1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Arquitetura e Tecnologias](#arquitetura-e-tecnologias)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Como Começar](#como-começar)
5. [Fluxo de Autenticação](#fluxo-de-autenticação)
6. [Fluxo de Produtos](#fluxo-de-produtos)
7. [Fluxo de Rotinas](#fluxo-de-rotinas)
8. [Sistema Dual-Backend](#sistema-dual-backend)
9. [Tradução para Português](#tradução-para-português)
10. [Testes e Validação](#testes-e-validação)
11. [Troubleshooting](#troubleshooting)
12. [Endpoints da API](#endpoints-da-api)

---

## 🎯 Visão Geral do Projeto

### O que é?
Um aplicativo mobile completo de skincare desenvolvido com **React Native + TypeScript** que permite gerenciar produtos de cuidados com a pele e criar rotinas personalizadas. O app possui integração com dois tipos de banco de dados:
- **SQLite Local** para persistência offline
- **MongoDB + Express API** para sincronização em nuvem

### Objetivo Principal
Fornecer aos usuários uma ferramenta intuitiva para:
- ✅ Registrar e gerenciar produtos de skincare
- ✅ Criar rotinas personalizadas (manhã/noite)
- ✅ Organizar etapas do cuidado
- ✅ Sincronizar dados entre dispositivos (via MongoDB)
- ✅ Funcionar offline (via SQLite)

### Público-Alvo
- Usuários brasileiros interessados em skincare
- Pessoas que desejam organizar sua rotina de cuidados
- Usuários que querem sincronizar dados entre dispositivos

---

## 🏗️ Arquitetura e Tecnologias

### Frontend Stack
```
┌─────────────────────────────────────┐
│        React Native + Expo          │
│        TypeScript 5.9.2             │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        │             │
    ┌───▼────┐   ┌───▼─────┐
    │ SQLite │   │ Axios   │
    │ Local  │   │ HTTP    │
    └────────┘   └─────────┘
```

### Backend Stack
```
┌─────────────────────────────────────┐
│     Node.js + Express + TypeScript   │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────────┐
        │                 │
    ┌───▼──────┐    ┌────▼─────┐
    │ MongoDB  │    │ Mongoose  │
    │ Atlas    │    │ 7.5.0     │
    └──────────┘    └───────────┘
```

### Tecnologias Principais

| Parte | Tecnologia | Versão | Propósito |
|-------|-----------|--------|----------|
| Frontend | React Native | 0.81.4 | Interface mobile |
| Frontend | Expo | ~54 | Plataforma de desenvolvimento |
| Frontend | TypeScript | ~5.9.2 | Type safety |
| Frontend | Axios | ^1.13.2 | Requisições HTTP |
| Frontend | expo-sqlite | latest | Banco de dados local |
| Backend | Node.js | 18+ | Runtime |
| Backend | Express | latest | Framework web |
| Backend | MongoDB | 7+ | Banco de dados |
| Backend | Mongoose | ~7.5.0 | ODM |
| Auth | JWT | jsonwebtoken ^9.0.0 | Autenticação |
| Security | Helmet | latest | Headers de segurança |
| Security | CORS | latest | Cross-Origin |

---

## 📁 Estrutura de Pastas

```
ProjetoCRUD/
├── 📄 Documentação
│   ├── DOCUMENTACAO_COMPLETA.md (este arquivo)
│   ├── COMECE_AQUI.md
│   ├── SETUP_COMPLETO.md
│   ├── README.md
│   └── ... outros .md
│
├── 📱 Frontend (React Native)
│   ├── App.tsx (componente raiz)
│   ├── index.ts
│   ├── src/
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx (autenticação e login)
│   │   │   ├── DatabaseContext.tsx (seleção de banco)
│   │   │   └── index.ts
│   │   │
│   │   ├── screens/ (14+ telas)
│   │   │   ├── SplashScreen.tsx
│   │   │   ├── DatabaseSelectionScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── MyProductsScreen.tsx
│   │   │   ├── AddProductScreen.tsx
│   │   │   ├── EditProductScreen.tsx
│   │   │   ├── ProductDetailsScreen.tsx
│   │   │   ├── MyRoutineScreen.tsx
│   │   │   ├── AddRoutineStepScreen.tsx
│   │   │   ├── EditRoutineStepScreen.tsx
│   │   │   ├── RoutineStepDetailsScreen.tsx
│   │   │   ├── ProfileScreen.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── services/
│   │   │   ├── apiClient.ts (cliente HTTP)
│   │   │   ├── sqliteService.ts (local DB)
│   │   │   ├── categoryUtils.ts (categorias)
│   │   │   ├── axiosConfig.ts
│   │   │   ├── axiosInstance.ts
│   │   │   ├── mongoService.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── tests/
│   │   │   └── sqliteTests.ts
│   │   │
│   │   └── assets/
│   │
│   ├── app.json (Expo config)
│   ├── tsconfig.json
│   └── package.json
│
├── ⚙️ Backend (Node.js + Express)
│   ├── API_SKINCARE/
│   │   ├── src/
│   │   │   ├── index.ts (servidor principal)
│   │   │   ├── config.ts (configurações)
│   │   │   │
│   │   │   ├── middleware/
│   │   │   │   └── auth.ts (JWT)
│   │   │   │
│   │   │   ├── models/
│   │   │   │   ├── User.ts
│   │   │   │   ├── Product.ts
│   │   │   │   └── RoutineStep.ts
│   │   │   │
│   │   │   └── routes/
│   │   │       ├── auth.ts
│   │   │       ├── products.ts
│   │   │       └── routineSteps.ts
│   │   │
│   │   ├── .env.example
│   │   ├── tsconfig.json
│   │   ├── package.json
│   │   └── 📄 Documentação
│   │       ├── API_DOCS.md
│   │       ├── TEST_ENDPOINTS.md
│   │       └── TESTE_TRADUCAO.md
│   │
│   └── .gitignore
│
└── .gitignore
```

---

## 🚀 Como Começar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- MongoDB Atlas conta (para usar MongoDB)
- Um emulador iOS/Android ou Expo Go no celular

### Instalação do Frontend

1. **Clonar o repositório**
   ```bash
   git clone https://github.com/evllinlima/Fatec-5Semestre.git
   cd Fatec-5Semestre/ProgramaçãoDispMóveisII/ProjetoCRUD
   ```

2. **Instalar dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configurar variáveis (se necessário)**
   ```bash
   # Verificar api.ts para URL da API
   # Padrão: http://192.168.0.30:3001/api
   ```

4. **Iniciar o app**
   ```bash
   npm start
   # ou
   expo start
   ```

5. **Abrir no emulador**
   - Pressione `i` para iOS
   - Pressione `a` para Android
   - Ou escaneie o QR code com Expo Go

### Instalação do Backend

1. **Navegar para a API**
   ```bash
   cd API_SKINCARE
   ```

2. **Instalar dependências**
   ```bash
   npm install
   ```

3. **Configurar variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```

4. **Editar .env com suas credenciais**
   ```bash
   PORT=3001
   MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/skincare_db
   JWT_SECRET=sua_chave_secreta_aqui
   JWT_EXPIRY=7d
   NODE_ENV=development
   ```

5. **Iniciar o servidor**
   ```bash
   npm start
   # ou com nodemon
   npm run dev
   ```

   Você verá:
   ```
   🚀 Servidor rodando em http://localhost:3001
   📝 Ambiente: development
   ✅ MongoDB conectado com sucesso
   ```

---

## 🔐 Fluxo de Autenticação

### Arquitetura de Autenticação

```
┌──────────────┐
│ Tela Login   │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ AuthContext.signIn() │
└──────┬───────────────┘
       │
       ├─ Verifica databaseType (SQLite ou MongoDB)
       │
       ├─ SE SQLite:
       │  ├─ Busca user no SQLite
       │  ├─ Valida senha
       │  ├─ Cria token local: "local_token_<id>"
       │  └─ Retorna user
       │
       └─ SE MongoDB:
          ├─ POST /api/auth/login
          ├─ API valida email/senha
          ├─ API retorna JWT token
          ├─ Armazena token em memoria
          └─ Retorna usuario { id, email, name, skinType }
```

### Fluxo Detalhado de Login

#### 1. **Usuário insere credenciais**
```
LoginScreen.tsx → email + password
```

#### 2. **Chamada AuthContext**
```typescript
const { signIn } = useAuth();
const success = await signIn(email, password);
```

#### 3. **AuthContext verifica banco selecionado**
```typescript
const databaseType = dbContext.databaseType; // 'sqlite' | 'mongodb'
```

#### 4a. **Se SQLite (Local)**
```typescript
const dbUser = await getUserByEmail(email);
if (dbUser && dbUser.password === password) {
  skincareAPI.setUseLocalDB(true);
  skincareAPI.setToken(`local_token_${dbUser.id}`);
  setUser(dbUser);
  return true;
}
```

#### 4b. **Se MongoDB (Online)**
```typescript
const resp = await skincareAPI.login(email, password);
// POST /api/auth/login

// Resposta:
// {
//   "mensagem": "Login realizado com sucesso",
//   "token": "eyJhbGciOiJIUzI1NiIs...",
//   "usuario": {
//     "id": "507f1f77bcf86cd799439011",
//     "email": "user@example.com",
//     "name": "João Silva",
//     "skinType": "mista"
//   }
// }

skincareAPI.setUseLocalDB(false);
skincareAPI.setToken(resp.token);
setUser(resp.usuario);
```

#### 5. **Navegação para Home**
```
Se sucesso → HomeScreen
Se erro → Mostrar alerta
```

### Fluxo de Registro

Semelhante ao login, mas:

```
RegisterScreen → email + password + name + confirmPassword
       ↓
AuthContext.signUp()
       ↓
Validações locais:
  - Todos os campos preenchidos?
  - Senhas conferem?
  - Senha tem 6+ caracteres?
       ↓
SE SQLite:
  - Verifica se email já existe
  - Cria novo user no SQLite
  ↓
SE MongoDB:
  - POST /api/auth/register
  - API valida dados
  - API cria user no MongoDB
  - Retorna token + usuario
```

### Estrutura de Segurança

```
┌─────────────────────────────────────┐
│         Frontend (React Native)      │
│                                     │
│  Token armazenado em memória        │
│  (não persiste em storage)          │
└──────────────┬──────────────────────┘
               │
        ┌──────▼──────┐
        │ Axios       │
        │ Interceptor │
        └──────┬──────┘
               │
    Authorization: Bearer <token>
               │
        ┌──────▼──────────────┐
        │ Backend Express     │
        │                     │
        │ middleware/auth.ts  │
        │ - Verifica token    │
        │ - JWT.verify()      │
        │ - Extrai userId     │
        └─────────────────────┘
```

### Campos de Resposta (Português)

| Campo | Tipo | Exemplo |
|-------|------|---------|
| `mensagem` | string | "Login realizado com sucesso" |
| `token` | string | "eyJhbGciOi..." |
| `usuario.id` / `usuario._id` | string/ObjectId | "507f1f77bcf86cd799439011" |
| `usuario.email` | string | "user@example.com" |
| `usuario.name` | string | "João Silva" |
| `usuario.skinType` | string | "normal" / "oleosa" / "seca" / "mista" / "sensível" |

---

## 🛍️ Fluxo de Produtos

### Diagrama de Fluxo

```
┌─────────────────────┐
│   MyProductsScreen  │ (lista produtos)
└──────┬──────────────┘
       │
       ├─ GET /api/products (carregar lista)
       │
       ├─ [+] Novo Produto
       │  └─ AddProductScreen
       │     ├─ Nome
       │     ├─ Categoria (7 opções)
       │     ├─ Observação
       │     └─ POST /api/products
       │
       ├─ Tocar produto
       │  └─ ProductDetailsScreen
       │     ├─ Exibir detalhes
       │     ├─ [✏️ Editar]
       │     │  └─ EditProductScreen
       │     │     └─ PUT /api/products/:id
       │     │
       │     └─ [🗑️ Deletar]
       │        └─ DELETE /api/products/:id
       │
       └─ Swipe/Pull para atualizar
          └─ GET /api/products
```

### Modelo de Dados (Product)

```typescript
// Estrutura MongoDB
{
  _id: ObjectId,
  userId: ObjectId (referência User),
  name: string (obrigatório),
  category: string (enum: ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen', 'mask', 'other']),
  observation: string (opcional),
  photo: string (opcional, URL),
  createdAt: Date,
  updatedAt: Date
}

// Estrutura SQLite
{
  id: INTEGER (PK),
  userId: INTEGER (FK),
  name: TEXT (não nulo),
  category: TEXT (não nulo),
  observation: TEXT,
  photo: TEXT,
  createdAt: DATETIME,
  updatedAt: DATETIME
}
```

### Categorias e Labels

```javascript
const CATEGORY_VALUES = [
  'cleanser',      // 🧴 Limpador
  'toner',         // 💧 Tônico
  'serum',         // ✨ Sérum
  'moisturizer',   // 💧 Hidratante
  'sunscreen',     // ☀️ Protetor Solar
  'mask',          // 🎭 Máscara
  'other'          // 💄 Outro
];
```

### Endpoints de Produtos

#### Criar Produto
```bash
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Sérum Vitamina C",
  "category": "serum",
  "observation": "Aplicar pela manhã",
  "photo": "https://..."
}

Response 201:
{
  "mensagem": "Produto criado com sucesso",
  "product": {
    "_id": "507f...",
    "userId": "507f...",
    "name": "Sérum Vitamina C",
    "category": "serum",
    "observation": "Aplicar pela manhã",
    "photo": "https://...",
    "createdAt": "2024-12-02T10:30:00Z",
    "updatedAt": "2024-12-02T10:30:00Z"
  }
}
```

#### Listar Produtos
```bash
GET /api/products
Authorization: Bearer <token>

Response 200:
{
  "count": 5,
  "products": [
    { ... produto 1 },
    { ... produto 2 },
    ...
  ]
}
```

#### Buscar Produto por ID
```bash
GET /api/products/:id
Authorization: Bearer <token>

Response 200:
{
  "product": { ... }
}
```

#### Atualizar Produto
```bash
PUT /api/products/:id
Authorization: Bearer <token>

{
  "name": "Sérum Vitamina C Premium",
  "observation": "Aplicar 2x por semana"
}

Response 200:
{
  "mensagem": "Produto atualizado com sucesso",
  "product": { ... }
}
```

#### Deletar Produto
```bash
DELETE /api/products/:id
Authorization: Bearer <token>

Response 200:
{
  "mensagem": "Produto deletado com sucesso"
}
```

---

## 🔄 Fluxo de Rotinas

### Diagrama de Fluxo

```
┌─────────────────────┐
│   MyRoutineScreen   │ (manhã + noite)
└──────┬──────────────┘
       │
       ├─ Manhã
       │  ├─ [+] Nova Etapa
       │  │  └─ AddRoutineStepScreen
       │  │     ├─ Nome da etapa
       │  │     ├─ Produto (opcional)
       │  │     └─ POST /api/routineSteps
       │  │
       │  └─ Listar etapas manhã
       │     ├─ GET /api/routineSteps (filtrar morning)
       │     ├─ Tocar etapa
       │     │  └─ RoutineStepDetailsScreen
       │     │     ├─ [✏️ Editar]
       │     │     │  └─ PUT /api/routineSteps/:id
       │     │     │
       │     │     └─ [🗑️ Deletar]
       │     │        └─ DELETE /api/routineSteps/:id
       │
       └─ Noite
          ├─ [+] Nova Etapa
          │  └─ AddRoutineStepScreen (timeOfDay: 'night')
          │
          └─ Listar etapas noite
             └─ GET /api/routineSteps (filtrar night)
```

### Modelo de Dados (RoutineStep)

```typescript
// Estrutura MongoDB
{
  _id: ObjectId,
  userId: ObjectId (referência User),
  name: string (obrigatório),
  timeOfDay: string (enum: ['morning', 'night']),
  productId: ObjectId (referência Product, opcional),
  createdAt: Date,
  updatedAt: Date
}

// Estrutura SQLite
{
  id: INTEGER (PK),
  userId: INTEGER (FK),
  name: TEXT (não nulo),
  timeOfDay: TEXT (não nulo),
  productId: INTEGER (FK, opcional),
  createdAt: DATETIME,
  updatedAt: DATETIME
}
```

### Endpoints de Rotinas

#### Criar Etapa
```bash
POST /api/routineSteps
Authorization: Bearer <token>

{
  "name": "Limpar rosto",
  "timeOfDay": "morning",
  "productId": "507f..." (opcional)
}

Response 201:
{
  "mensagem": "Etapa da rotina criada com sucesso",
  "step": {
    "_id": "507f...",
    "userId": "507f...",
    "name": "Limpar rosto",
    "timeOfDay": "morning",
    "productId": "507f...",
    "createdAt": "2024-12-02T10:30:00Z",
    "updatedAt": "2024-12-02T10:30:00Z"
  }
}
```

#### Listar Etapas
```bash
GET /api/routineSteps
Authorization: Bearer <token>

Response 200:
{
  "count": 4,
  "morning": {
    "count": 2,
    "steps": [
      { "id": "...", "name": "Limpar", "timeOfDay": "morning" },
      { "id": "...", "name": "Tônico", "timeOfDay": "morning" }
    ]
  },
  "night": {
    "count": 2,
    "steps": [
      { "id": "...", "name": "Sérum", "timeOfDay": "night" },
      { "id": "...", "name": "Hidratante", "timeOfDay": "night" }
    ]
  }
}
```

---

## 🔀 Sistema Dual-Backend

### Conceito Principal

O app suporta **dois modos de funcionamento** simultâneos:

```
┌──────────────────────┐
│ DatabaseSelectionScreen │
└──────┬───────────────┘
       │
       ├─ SQLite (Local)
       │  └─ Dados armazenados localmente no dispositivo
       │     └─ Funciona offline
       │
       └─ MongoDB (Online)
          └─ Dados armazenados em servidor remoto
             └─ Requer conexão internet
```

### Fluxo de Seleção

```
1. App inicia
   ↓
2. SplashScreen (1s)
   ↓
3. DatabaseSelectionScreen
   - Usuário escolhe SQLite ou MongoDB
   - DatabaseContext.setDatabaseType()
   ↓
4. skincareAPI.setUseLocalDB(type === 'sqlite')
   ↓
5. Navega para LoginScreen
   ↓
6. Todas as operações usam o banco selecionado
```

### Implementação em apiClient.ts

```typescript
export class SkincareAPI {
  private useLocalDB: boolean = true;

  setUseLocalDB(useLocal: boolean) {
    this.useLocalDB = useLocal;
  }

  async getProducts() {
    if (this.useLocalDB) {
      // Usa SQLite
      const products = await getProductsByUserId(userId);
      return { products };
    } else {
      // Usa API MongoDB
      const response = await axios.get(`${API_BASE_URL}/products`, {
        headers: this.getHeaders(),
        timeout: REQUEST_TIMEOUT,
      });
      return response.data;
    }
  }
}
```

### Comparação SQLite vs MongoDB

| Aspecto | SQLite | MongoDB |
|---------|--------|---------|
| **Armazenamento** | Local (dispositivo) | Servidor (nuvem) |
| **Conexão** | Não requer | Requer internet |
| **Offline** | ✅ Funciona | ❌ Não funciona |
| **Múltiplos dispositivos** | ❌ Isolado | ✅ Sincronizado |
| **Velocidade** | ⚡ Rápido | 🌐 Mais lento |
| **Segurança** | 🔒 Local | 🔐 Servidor |
| **Limite de dados** | 📦 Limitado | 📊 Escalável |

### Sincronização Manual

```typescript
// Sincronizar dados SQLite para MongoDB
const result = await skincareAPI.syncToMongoDB();
// {
//   "synced": 15,
//   "failed": 2
// }
```

---

## 🌍 Tradução para Português

### Abordagem de Tradução

Todos os textos visíveis ao usuário estão em **Português Brasileiro**:

### O que foi traduzido

#### ✅ Frontend
- Seções de código: `// ===== AUTENTICAÇÃO =====`
- Labels de categorias: `Cleanser → Limpador`
- Mensagens de erro em Alerts
- Comentários de código
- Placeholders de input

#### ✅ Backend
- Mensagens de sucesso: `"Produto criado com sucesso"`
- Mensagens de erro: `"Email ou senha incorretos"`
- Validações: `"Email é obrigatório"`
- Campos de resposta: `message → mensagem`, `user → usuario`, `error → erro`

#### ✅ Categorias com Emojis
```typescript
cleanser: '🧴 Limpador'
toner: '💧 Tônico'
serum: '✨ Sérum'
moisturizer: '💧 Hidratante'
sunscreen: '☀️ Protetor Solar'
mask: '🎭 Máscara'
other: '💄 Outro'
```

### O que NÃO foi traduzido (Correto)

- **Enum values**: `morning`, `night`, `cleanser`, `toner`, etc (são dados)
- **Propriedades de objetos**: `email`, `name`, `password`, `skinType`
- **URLs da API**: `/api/products`, `/api/auth`
- **Nomes de variáveis internas**: `userId`, `productId`

### Estrutura de Resposta em Português

```json
{
  "mensagem": "Usuário criado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "João Silva",
    "skinType": "mista"
  }
}
```

---

## 🧪 Testes e Validação

### Testes de Autenticação

#### Teste 1: Registro com SQLite
```bash
1. Abrir app
2. Selecionar SQLite
3. Tocar "Criar Conta"
4. Preencher: email, senha, nome, confirmar senha
5. Tocar "Registrar"
6. Verificar: Alerta "Conta criada com sucesso!"
7. Verificar: Navega para HomeScreen
```

#### Teste 2: Login com MongoDB
```bash
1. Abrir app
2. Selecionar MongoDB
3. Preencher email + senha válidos
4. Tocar "Entrar"
5. Verificar: Alerta "Login realizado com sucesso"
6. Verificar: Exibe HomeScreen com nome do usuário
7. Verificar: Console não mostra erro "Cannot read property 'id'"
```

### Testes de Produtos

#### Teste 3: Criar Produto
```bash
1. Estar logado
2. Ir para "Meus Produtos"
3. Tocar "+"
4. Preencher:
   - Nome: "Sérum Vitamina C"
   - Categoria: "Sérum"
   - Observação: "Aplicar pela manhã"
5. Tocar "Adicionar"
6. Verificar: Alerta "Produto adicionado!"
7. Verificar: Produto aparece na lista
8. Verificar se MongoDB:
   - POST /api/products retorna 201
   - Resposta contém "mensagem": "Produto criado com sucesso"
```

#### Teste 4: Listar Produtos
```bash
1. Ir para "Meus Produtos"
2. Verificar: Lista carrega produtos
3. Se SQLite: Lê de banco local
4. Se MongoDB: GET /api/products retorna 200
5. Verificar: Labels em português (Limpador, Tônico, Sérum, etc)
```

### Testes de Rotinas

#### Teste 5: Criar Etapa da Rotina
```bash
1. Estar logado
2. Ir para "Minha Rotina"
3. Tocar "+" em Manhã
4. Preencher:
   - Nome: "Limpar rosto"
   - Produto: (opcional)
5. Tocar "Adicionar"
6. Verificar: Alerta "Etapa adicionada!"
7. Verificar: Etapa aparece na seção Manhã
```

### Teste com cURL (MongoDB)

#### Health Check
```bash
curl http://192.168.0.30:3001/health

Response:
{
  "status": "API funcionando",
  "timestamp": "2024-12-02T10:30:00.000Z"
}
```

#### Registrar Usuário
```bash
curl -X POST http://192.168.0.30:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "password": "senha123",
    "name": "Usuário Teste"
  }'

Response:
{
  "mensagem": "Usuário criado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": "507f1f77bcf86cd799439011",
    "email": "teste@exemplo.com",
    "name": "Usuário Teste"
  }
}
```

#### Criar Produto
```bash
TOKEN="seu_token_aqui"

curl -X POST http://192.168.0.30:3001/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sérum Vitamina C",
    "category": "serum",
    "observation": "Aplicar pela manhã"
  }'

Response:
{
  "mensagem": "Produto criado com sucesso",
  "product": {
    "_id": "507f...",
    "userId": "507f...",
    "name": "Sérum Vitamina C",
    "category": "serum",
    "observation": "Aplicar pela manhã",
    "createdAt": "2024-12-02T10:30:00Z"
  }
}
```

---

## 🔧 Troubleshooting

### Erro: "Cannot read property 'id' of undefined"

**Causa**: API retorna `usuario` mas código tenta acessar `user`

**Solução**:
```typescript
// ❌ Errado
const profile = resp.user;

// ✅ Correto
const profile = resp.usuario;
if (profile && (profile.id || profile._id)) {
  // usar profile
}
```

### Erro: "API não está respondendo"

**Possíveis causas**:
1. Backend não está rodando
2. URL da API está incorreta
3. Firewall bloqueando conexão
4. MongoDB não está conectado

**Solução**:
```bash
# 1. Verificar se backend está rodando
curl http://192.168.0.30:3001/health

# 2. Verificar logs do backend
npm run dev

# 3. Verificar se MongoDB está conectado
# No console deve exibir: "✅ MongoDB conectado com sucesso"

# 4. Atualizar IP em src/services/apiClient.ts
const API_BASE_URL = 'http://SEU_IP:3001/api';
```

### Erro: "Email já está cadastrado"

**Causa**: Usuário com este email já existe no banco

**Solução**:
```
Use um email diferente ou remova o usuário anterior do MongoDB
```

### Erro: "Categoria inválida"

**Causa**: Categoria não existe no enum

**Solução**:
```typescript
// Categorias válidas (lowercase):
'cleanser'
'toner'
'serum'
'moisturizer'
'sunscreen'
'mask'
'other'

// Não usar PascalCase ou outras categorias
```

### App mostra erro de conexão com MongoDB selecionado

**Causa**: 
- Conexão à internet fraca
- MongoDB não configurado corretamente
- Timeout (10 segundos)

**Solução**:
1. Verificar conexão WiFi
2. Verificar `.env` do backend:
   ```
   MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/skincare_db
   ```
3. Considerar usar SQLite enquanto testa

### Dados do SQLite não sincronizam com MongoDB

**Causa**: Sincronização manual ainda não foi chamada

**Solução**:
```typescript
// Chamar sincronização manualmente
const result = await skincareAPI.syncToMongoDB();
console.log(`Sincronizados: ${result.synced}, Falhados: ${result.failed}`);
```

---

## 📡 Endpoints da API

### Base URL
```
http://192.168.0.30:3001/api
```

### Autenticação

#### POST `/auth/register`
Criar novo usuário

**Request**:
```json
{
  "email": "user@example.com",
  "password": "senha123",
  "name": "João Silva"
}
```

**Response 201**:
```json
{
  "mensagem": "Usuário criado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "João Silva"
  }
}
```

#### POST `/auth/login`
Fazer login

**Request**:
```json
{
  "email": "user@example.com",
  "password": "senha123"
}
```

**Response 200**:
```json
{
  "mensagem": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "João Silva",
    "skinType": "mista"
  }
}
```

#### GET `/auth/profile`
Obter perfil do usuário autenticado

**Headers**:
```
Authorization: Bearer <token>
```

**Response 200**:
```json
{
  "usuario": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "João Silva",
    "skinType": "mista",
    "createdAt": "2024-12-02T10:30:00Z"
  }
}
```

#### PUT `/auth/profile`
Atualizar perfil do usuário

**Headers**:
```
Authorization: Bearer <token>
```

**Request**:
```json
{
  "name": "João Silva Updated",
  "skinType": "oleosa"
}
```

**Response 200**:
```json
{
  "mensagem": "Perfil atualizado com sucesso",
  "usuario": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "João Silva Updated",
    "skinType": "oleosa"
  }
}
```

### Produtos

#### POST `/products`
Criar novo produto

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request**:
```json
{
  "name": "Sérum Vitamina C",
  "category": "serum",
  "observation": "Aplicar pela manhã",
  "photo": "https://..."
}
```

**Response 201**:
```json
{
  "mensagem": "Produto criado com sucesso",
  "product": {
    "_id": "507f...",
    "userId": "507f...",
    "name": "Sérum Vitamina C",
    "category": "serum",
    "observation": "Aplicar pela manhã",
    "photo": "https://...",
    "createdAt": "2024-12-02T10:30:00Z",
    "updatedAt": "2024-12-02T10:30:00Z"
  }
}
```

#### GET `/products`
Listar todos os produtos do usuário

**Headers**:
```
Authorization: Bearer <token>
```

**Response 200**:
```json
{
  "count": 5,
  "products": [
    {
      "_id": "507f...",
      "name": "Sérum Vitamina C",
      "category": "serum",
      ...
    }
  ]
}
```

#### GET `/products/:id`
Obter produto específico

**Response 200**:
```json
{
  "product": {
    "_id": "507f...",
    "name": "Sérum Vitamina C",
    ...
  }
}
```

#### PUT `/products/:id`
Atualizar produto

**Request**:
```json
{
  "name": "Sérum Vitamina C Premium",
  "observation": "Usar 2x por semana"
}
```

**Response 200**:
```json
{
  "mensagem": "Produto atualizado com sucesso",
  "product": { ... }
}
```

#### DELETE `/products/:id`
Deletar produto

**Response 200**:
```json
{
  "mensagem": "Produto deletado com sucesso"
}
```

### Etapas da Rotina

#### POST `/routineSteps`
Criar nova etapa

**Request**:
```json
{
  "name": "Limpar rosto",
  "timeOfDay": "morning",
  "productId": "507f..." (opcional)
}
```

**Response 201**:
```json
{
  "mensagem": "Etapa da rotina criada com sucesso",
  "step": { ... }
}
```

#### GET `/routineSteps`
Listar etapas separadas por turno

**Response 200**:
```json
{
  "count": 4,
  "morning": {
    "count": 2,
    "steps": [ ... ]
  },
  "night": {
    "count": 2,
    "steps": [ ... ]
  }
}
```

#### GET `/routineSteps/:id`
Obter etapa específica

**Response 200**:
```json
{
  "step": { ... }
}
```

#### PUT `/routineSteps/:id`
Atualizar etapa

**Request**:
```json
{
  "name": "Limpar rosto bem",
  "timeOfDay": "morning"
}
```

**Response 200**:
```json
{
  "mensagem": "Etapa atualizada com sucesso",
  "step": { ... }
}
```

#### DELETE `/routineSteps/:id`
Deletar etapa

**Response 200**:
```json
{
  "mensagem": "Etapa deletada com sucesso"
}
```

---

## 📊 Resumo de Recursos

### Telas Implementadas (14+)
✅ Splash Screen  
✅ Database Selection  
✅ Login  
✅ Register  
✅ Home  
✅ My Products (lista)  
✅ Add Product  
✅ Edit Product  
✅ Product Details  
✅ My Routine (manhã + noite)  
✅ Add Routine Step  
✅ Edit Routine Step  
✅ Routine Step Details  
✅ Profile  

### Funcionalidades Principais
✅ Autenticação JWT  
✅ Dual-Backend (SQLite + MongoDB)  
✅ CRUD completo de produtos  
✅ CRUD completo de rotinas  
✅ Gerenciamento de perfil  
✅ Categorias com 7 opções  
✅ Tudo em português  
✅ Interface intuitiva  
✅ Validações robustas  
✅ Tratamento de erros  

### Segurança
✅ JWT Tokens  
✅ Senha criptografada (bcrypt)  
✅ CORS configurado  
✅ Helmet para headers de segurança  
✅ Validação de dados  
✅ Verificação de autorização  

---



