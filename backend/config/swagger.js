const swaggerJsdoc = require('swagger-jsdoc');

// Detectar ambiente
const isRender = process.env.RENDER === 'true';
const isProduction = process.env.NODE_ENV === 'production';

// Configurar servidores baseado no ambiente
const servers = [
  {
    url: 'http://localhost:3000',
    description: 'Servidor de Desenvolvimento'
  }
];

// Adicionar servidor do Render se estiver em produção
if (isRender || isProduction) {
  servers.push({
    url: 'https://backendapicicd.onrender.com',
    description: 'Servidor de Produção (Render)'
  });
}

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gerenciamento de Tarefas',
      version: '1.0.0',
      description: 'API REST para gerenciamento de tarefas com CRUD completo',
      contact: {
        name: 'Desenvolvedor',
        email: 'dev@example.com'
      }
    },
    servers: servers,
    components: {
      schemas: {
        Tarefa: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da tarefa'
            },
            descricao: {
              type: 'string',
              description: 'Descrição da tarefa'
            },
            status: {
              type: 'string',
              enum: ['pendente', 'em_andamento', 'completa'],
              description: 'Status da tarefa'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensagem de erro'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './server.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs; 