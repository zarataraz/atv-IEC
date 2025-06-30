const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

// Função para fazer requisições com tratamento de erro
async function makeRequest(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message, 
      status: error.response?.status 
    };
  }
}

// Função para testar todos os endpoints
async function testAPI() {
  console.log('🧪 Iniciando testes da API...\n');
  
  // Teste 1: Health Check
  console.log('1️⃣ Testando Health Check...');
  const health = await makeRequest('GET', '/health');
  if (health.success) {
    console.log('✅ Health Check OK:', health.data);
  } else {
    console.log('❌ Health Check falhou:', health.error);
  }
  
  // Teste 2: Rota raiz
  console.log('\n2️⃣ Testando rota raiz...');
  const root = await makeRequest('GET', '/');
  if (root.success) {
    console.log('✅ Rota raiz OK:', root.data);
  } else {
    console.log('❌ Rota raiz falhou:', root.error);
  }
  
  // Teste 3: Listar tarefas (GET /tarefas)
  console.log('\n3️⃣ Testando listagem de tarefas...');
  const listTarefas = await makeRequest('GET', '/tarefas');
  if (listTarefas.success) {
    console.log('✅ Listagem OK:', listTarefas.data);
  } else {
    console.log('❌ Listagem falhou:', listTarefas.error);
  }
  
  // Teste 4: Criar tarefa (POST /tarefas)
  console.log('\n4️⃣ Testando criação de tarefa...');
  const novaTarefa = {
    descricao: 'Tarefa de teste criada via script',
    status: 'pendente'
  };
  const createTarefa = await makeRequest('POST', '/tarefas', novaTarefa);
  if (createTarefa.success) {
    console.log('✅ Criação OK:', createTarefa.data);
    const tarefaId = createTarefa.data.id;
    
    // Teste 5: Buscar tarefa específica (GET /tarefas/:id)
    console.log('\n5️⃣ Testando busca de tarefa específica...');
    const getTarefa = await makeRequest('GET', `/tarefas/${tarefaId}`);
    if (getTarefa.success) {
      console.log('✅ Busca específica OK:', getTarefa.data);
    } else {
      console.log('❌ Busca específica falhou:', getTarefa.error);
    }
    
    // Teste 6: Atualizar tarefa (PUT /tarefas/:id)
    console.log('\n6️⃣ Testando atualização de tarefa...');
    const updateData = {
      descricao: 'Tarefa atualizada via script',
      status: 'em_andamento'
    };
    const updateTarefa = await makeRequest('PUT', `/tarefas/${tarefaId}`, updateData);
    if (updateTarefa.success) {
      console.log('✅ Atualização OK:', updateTarefa.data);
    } else {
      console.log('❌ Atualização falhou:', updateTarefa.error);
    }
    
    // Teste 7: Deletar tarefa (DELETE /tarefas/:id)
    console.log('\n7️⃣ Testando exclusão de tarefa...');
    const deleteTarefa = await makeRequest('DELETE', `/tarefas/${tarefaId}`);
    if (deleteTarefa.success) {
      console.log('✅ Exclusão OK:', deleteTarefa.data);
    } else {
      console.log('❌ Exclusão falhou:', deleteTarefa.error);
    }
  } else {
    console.log('❌ Criação falhou:', createTarefa.error);
  }
  
  // Teste 8: Validações
  console.log('\n8️⃣ Testando validações...');
  
  // Tentar criar tarefa sem descrição
  const invalidTarefa = { status: 'pendente' };
  const invalidCreate = await makeRequest('POST', '/tarefas', invalidTarefa);
  if (!invalidCreate.success && invalidCreate.status === 400) {
    console.log('✅ Validação de descrição obrigatória OK');
  } else {
    console.log('❌ Validação de descrição falhou');
  }
  
  // Tentar atualizar tarefa inexistente
  const invalidUpdate = await makeRequest('PUT', '/tarefas/999999', { descricao: 'teste' });
  if (!invalidUpdate.success && invalidUpdate.status === 404) {
    console.log('✅ Validação de tarefa inexistente OK');
  } else {
    console.log('❌ Validação de tarefa inexistente falhou');
  }
  
  // Teste 9: Rota não encontrada
  console.log('\n9️⃣ Testando rota não encontrada...');
  const notFound = await makeRequest('GET', '/rota-inexistente');
  if (!notFound.success && notFound.status === 404) {
    console.log('✅ Tratamento de rota não encontrada OK');
  } else {
    console.log('❌ Tratamento de rota não encontrada falhou');
  }
  
  // Teste 10: Listar tarefas novamente para verificar estado final
  console.log('\n🔟 Testando listagem final...');
  const finalList = await makeRequest('GET', '/tarefas');
  if (finalList.success) {
    console.log('✅ Listagem final OK:', finalList.data);
  } else {
    console.log('❌ Listagem final falhou:', finalList.error);
  }
  
  console.log('\n🎉 Testes concluídos!');
  console.log('\n📚 Documentação Swagger disponível em: http://localhost:3000/api-docs');
}

// Executar testes
testAPI().catch(console.error); 