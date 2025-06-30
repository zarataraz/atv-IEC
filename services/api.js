import axios from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '../config/api';

// Configuração do axios
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Interceptor para logs (útil para debug)
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Erro na resposta:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Serviços da API
export const tarefasService = {
  // Buscar todas as tarefas
  listarTarefas: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.TAREFAS);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar tarefas: ' + error.message);
    }
  },

  // Criar nova tarefa
  criarTarefa: async (tarefa) => {
    try {
      const response = await api.post(API_ENDPOINTS.TAREFAS, tarefa);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao criar tarefa: ' + error.message);
    }
  },

  // Atualizar tarefa existente
  atualizarTarefa: async (id, tarefa) => {
    try {
      const response = await api.put(API_ENDPOINTS.TAREFA_BY_ID(id), tarefa);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao atualizar tarefa: ' + error.message);
    }
  },

  // Excluir tarefa
  excluirTarefa: async (id) => {
    try {
      const response = await api.delete(API_ENDPOINTS.TAREFA_BY_ID(id));
      return response.data;
    } catch (error) {
      throw new Error('Erro ao excluir tarefa: ' + error.message);
    }
  },

  // Alternar status da tarefa
  alternarStatus: async (tarefa) => {
    try {
      const novoStatus = tarefa.status === 'completa' ? 'pendente' : 'completa';
      const response = await api.put(API_ENDPOINTS.TAREFA_BY_ID(tarefa.id), {
        ...tarefa,
        status: novoStatus,
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao alternar status: ' + error.message);
    }
  },
};

// Função para testar conexão com a API
export const testarConexao = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw new Error('Erro ao conectar com a API: ' + error.message);
  }
};

export default api; 