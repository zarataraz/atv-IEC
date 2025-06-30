const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Importações locais
const { initializeDatabase } = require('./config/database');
const { logger, requestLogger, errorLogger, flushLogs } = require('./config/logger');
const swaggerSpecs = require('./config/swagger');
const swaggerUi = require('swagger-ui-express');

// Rotas
const tarefasRoutes = require('./routes/tarefas');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações específicas para o Render
const isRender = process.env.RENDER === 'true';
const isProduction = process.env.NODE_ENV === 'production';

// Debug das variáveis de ambiente
console.log('🔍 Debug ambiente:', {
  NODE_ENV: process.env.NODE_ENV,
  RENDER: process.env.RENDER,
  DB_HOST: process.env.DB_HOST ? '***' : 'não definido',
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  BETTERSTACK_SOURCE_TOKEN: process.env.BETTERSTACK_SOURCE_TOKEN ? '***' : 'não definido'
});

// Middlewares de segurança
app.use(helmet({
  contentSecurityPolicy: isRender ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  } : undefined,
}));

// Middleware de logging
app.use(morgan('combined'));
app.use(requestLogger);

// Middleware de CORS com origem dinâmica
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://backendapicicd.onrender.com',
      'http://localhost:3000',
      'http://localhost:8080',
      'http://localhost:3001',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Libera pré-flight CORS
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  swaggerOptions: {
    validatorUrl: null,
    supportedSubmitMethods: ['get', 'post', 'put', 'delete'],
    docExpansion: 'list',
    filter: true,
    showRequestHeaders: true
  },
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API de Gerenciamento de Tarefas - Documentação'
}));

// Endpoint para o JSON do Swagger (opcional)
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpecs);
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Rota de teste da API
 *     tags: [Teste]
 *     responses:
 *       200:
 *         description: API funcionando corretamente
 */
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Gerenciamento de Tarefas funcionando!',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    render: isRender,
    ssl: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verificação de saúde da API
 *     tags: [Teste]
 *     responses:
 *       200:
 *         description: API saudável
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    render: isRender
  });
});

// Rotas da API
app.use('/tarefas', tarefasRoutes);

// Middleware de tratamento de erros
app.use(errorLogger);

// Tratamento de rotas não encontradas
app.use('*', (req, res) => {
  logger.warn('Rota não encontrada', { 
    method: req.method, 
    url: req.originalUrl,
    ip: req.ip 
  });
  res.status(404).json({ 
    error: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// Tratamento de erros globais
app.use((error, req, res, next) => {
  logger.error('Erro não tratado', {
    error: error.message,
    stack: error.stack,
    method: req.method,
    url: req.url
  });
  
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo deu errado'
  });
});

// Inicialização do servidor
async function startServer() {
  try {
    console.log('🔌 Tentando conectar ao banco de dados...');
    await initializeDatabase();
    console.log('✅ Banco de dados conectado com sucesso!');
    
    app.listen(PORT, '0.0.0.0', () => {
      logger.info('Servidor iniciado com sucesso', {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        render: isRender,
        timestamp: new Date().toISOString()
      });

      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📚 Documentação disponível em: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error('Erro ao inicializar servidor', { error: error.message });
    console.error('❌ Erro ao inicializar servidor:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM recebido, encerrando servidor graciosamente');
  await flushLogs();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT recebido, encerrando servidor graciosamente');
  await flushLogs();
  process.exit(0);
});

// Inicia o servidor
startServer();
