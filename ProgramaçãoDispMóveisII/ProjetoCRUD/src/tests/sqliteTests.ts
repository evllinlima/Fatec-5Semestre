/**
 * Script de testes para validar SQLite e sincronização com MongoDB
 * Executar: npx expo run
 */

import { initDatabase } from '../services/sqliteService';
import { SkincareAPI } from '../services/apiClient';

const testResults: { name: string; status: 'PASS' | 'FAIL'; message: string }[] = [];

const logTest = (name: string, status: 'PASS' | 'FAIL', message: string) => {
  testResults.push({ name, status, message });
  console.log(`${status === 'PASS' ? '✅' : '❌'} ${name}: ${message}`);
};

export async function runSQLiteTests() {
  console.log('\n🧪 Iniciando testes de SQLite...\n');

  try {
    // Teste 1: Inicializar banco
    try {
      await initDatabase();
      logTest('Inicializar DB', 'PASS', 'Banco de dados inicializado');
    } catch (error) {
      logTest('Inicializar DB', 'FAIL', String(error));
      return;
    }

    // Teste 2: Criar usuário
    const { createUser, getUserByEmail } = await import('../services/sqliteService');
    let userId: number;
    try {
      userId = await createUser('teste@example.com', 'senha123', 'Usuário Teste');
      logTest('Criar usuário', 'PASS', `Usuário criado com ID: ${userId}`);
    } catch (error) {
      logTest('Criar usuário', 'FAIL', String(error));
      return;
    }

    // Teste 3: Buscar usuário
    try {
      const user = await getUserByEmail('teste@example.com');
      if (user && user.id === userId) {
        logTest('Buscar usuário', 'PASS', `Usuário recuperado: ${user.name}`);
      } else {
        logTest('Buscar usuário', 'FAIL', 'Usuário não encontrado ou dados incorretos');
      }
    } catch (error) {
      logTest('Buscar usuário', 'FAIL', String(error));
    }

    // Teste 4: Criar produtos
    const { createProduct, getProductsByUserId } = await import('../services/sqliteService');
    try {
      const productIds = [];
      const produtos = [
        { name: 'Cleanser', category: 'cleanser', observation: 'Para manhã e noite' },
        { name: 'Tônico', category: 'toner', observation: 'Após limpeza' },
        { name: 'Sérum Vitamina C', category: 'serum', observation: 'Apenas manhã' },
        { name: 'Hidratante', category: 'moisturizer', observation: 'Aplicar em seguida' },
      ];

      for (const produto of produtos) {
        const id = await createProduct({ userId, ...produto });
        productIds.push(id);
      }

      logTest('Criar produtos', 'PASS', `${productIds.length} produtos criados`);
    } catch (error) {
      logTest('Criar produtos', 'FAIL', String(error));
    }

    // Teste 5: Buscar todos os produtos do usuário
    try {
      const products = await getProductsByUserId(userId);
      if (products.length === 4) {
        logTest('Listar produtos', 'PASS', `${products.length} produtos recuperados`);
      } else {
        logTest('Listar produtos', 'FAIL', `Esperado 4 produtos, obtive ${products.length}`);
      }
    } catch (error) {
      logTest('Listar produtos', 'FAIL', String(error));
    }

    // Teste 6: Criar etapas de rotina
    const { createRoutineStep, getRoutineStepsByUserId } = await import(
      '../services/sqliteService'
    );
    try {
      const morningSteps = [
        { userId, name: 'Limpeza facial', timeOfDay: 'morning' },
        { userId, name: 'Aplicar tônico', timeOfDay: 'morning' },
        { userId, name: 'Sérum Vitamina C', timeOfDay: 'morning' },
        { userId, name: 'Hidratante', timeOfDay: 'morning' },
      ];

      const nightSteps = [
        { userId, name: 'Limpeza facial', timeOfDay: 'night' },
        { userId, name: 'Aplicar tônico', timeOfDay: 'night' },
        { userId, name: 'Hidratante noturno', timeOfDay: 'night' },
      ];

      for (const step of [...morningSteps, ...nightSteps]) {
        await createRoutineStep(step as any);
      }

      logTest('Criar etapas', 'PASS', `7 etapas de rotina criadas`);
    } catch (error) {
      logTest('Criar etapas', 'FAIL', String(error));
    }

    // Teste 7: Listar etapas por período
    try {
      const steps = await getRoutineStepsByUserId(userId);
      const morning = steps.filter((s) => s.timeOfDay === 'morning');
      const night = steps.filter((s) => s.timeOfDay === 'night');

      if (morning.length === 4 && night.length === 3) {
        logTest('Separar por período', 'PASS', `Manhã: ${morning.length}, Noite: ${night.length}`);
      } else {
        logTest(
          'Separar por período',
          'FAIL',
          `Esperado 4 manhã e 3 noite, obtive ${morning.length} e ${night.length}`
        );
      }
    } catch (error) {
      logTest('Separar por período', 'FAIL', String(error));
    }

    // Teste 8: Atualizar usuário
    const { updateUser, getUserById } = await import('../services/sqliteService');
    try {
      await updateUser(userId, { name: 'Usuário Atualizado', skinType: 'mista' });
      const updatedUser = await getUserById(userId);

      if (updatedUser?.name === 'Usuário Atualizado' && updatedUser?.skinType === 'mista') {
        logTest('Atualizar usuário', 'PASS', 'Perfil atualizado com sucesso');
      } else {
        logTest('Atualizar usuário', 'FAIL', 'Dados não foram atualizados corretamente');
      }
    } catch (error) {
      logTest('Atualizar usuário', 'FAIL', String(error));
    }

    // Teste 9: Atualizar produto
    const { getProductById, updateProduct } = await import('../services/sqliteService');
    try {
      const products = await getProductsByUserId(userId);
      if (products.length > 0) {
        const productId = products[0].id;
        await updateProduct(productId, { observation: 'Observação atualizada' });

        const updated = await getProductById(productId);
        if (updated?.observation === 'Observação atualizada') {
          logTest('Atualizar produto', 'PASS', 'Produto atualizado');
        } else {
          logTest('Atualizar produto', 'FAIL', 'Produto não foi atualizado');
        }
      }
    } catch (error) {
      logTest('Atualizar produto', 'FAIL', String(error));
    }

    // Teste 10: Deletar produto
    const { deleteProduct } = await import('../services/sqliteService');
    try {
      const products = await getProductsByUserId(userId);
      if (products.length > 0) {
        const productId = products[0].id;
        await deleteProduct(productId);

        const deleted = await getProductById(productId);
        if (!deleted) {
          logTest('Deletar produto', 'PASS', 'Produto deletado com sucesso');
        } else {
          logTest('Deletar produto', 'FAIL', 'Produto ainda existe');
        }
      }
    } catch (error) {
      logTest('Deletar produto', 'FAIL', String(error));
    }

    // Teste 11: Validar integridade
    const api = new SkincareAPI(true);
    api.setToken(`local_token_${userId}`);

    try {
      const validation = await api.validateSQLiteData();
      if (validation.isValid) {
        logTest(
          'Validar integridade',
          'PASS',
          `Usuários: ${validation.usersCount}, Produtos: ${validation.productsCount}, Etapas: ${validation.routineStepsCount}`
        );
      } else {
        logTest('Validar integridade', 'FAIL', 'Dados corrompidos ou inconsistentes');
      }
    } catch (error) {
      logTest('Validar integridade', 'FAIL', String(error));
    }

    // Resumo
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMO DOS TESTES');
    console.log('='.repeat(50));

    const passed = testResults.filter((r) => r.status === 'PASS').length;
    const failed = testResults.filter((r) => r.status === 'FAIL').length;
    const total = testResults.length;

    console.log(`✅ Aprovados: ${passed}/${total}`);
    console.log(`❌ Falhados: ${failed}/${total}`);
    console.log(`📈 Taxa de sucesso: ${((passed / total) * 100).toFixed(2)}%\n`);

    if (failed > 0) {
      console.log('❌ Testes que falharam:');
      testResults
        .filter((r) => r.status === 'FAIL')
        .forEach((r) => console.log(`  - ${r.name}: ${r.message}`));
    }

    return testResults;
  } catch (error) {
    console.error('❌ Erro fatal nos testes:', error);
    return testResults;
  }
}

// Exportar para teste manual
export { testResults };
