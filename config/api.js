// Configuração da API
export const API_CONFIG = {
  // URL base da API - ajuste conforme necessário
  BASE_URL: 'http://localhost:3000',
  
  // Timeout das requisições (em milissegundos)
  TIMEOUT: 10000,
  
  // Headers padrão
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Endpoints da API
export const API_ENDPOINTS = {
  TAREFAS: '/tarefas',
  TAREFA_BY_ID: (id) => `/tarefas/${id}`,
};

// Configuração para desenvolvimento em dispositivo físico
// Se estiver testando em um dispositivo físico, descomente e ajuste o IP:
// export const API_CONFIG = {
//   BASE_URL: 'http://192.168.1.100:3000', // Substitua pelo IP da sua máquina
//   TIMEOUT: 10000,
//   HEADERS: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   },
// }; 