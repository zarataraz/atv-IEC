const winston = require('winston');
const { Logtail } = require("@logtail/node");
const { LogtailTransport } = require("@logtail/winston");
require('dotenv').config();

// Criar cliente Logtail se o token estiver configurado
let logtail = null;
if (process.env.BETTERSTACK_SOURCE_TOKEN) {
  logtail = new Logtail(process.env.BETTERSTACK_SOURCE_TOKEN, {
    endpoint: 'https://s1360540.eu-nbg-2.betterstackdata.com',
  });
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'tarefas-api' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // Adicionar transport do Logtail se configurado
    ...(logtail ? [new LogtailTransport(logtail)] : [])
  ]
});

// Middleware para requisições
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress
    };

    if (res.statusCode >= 400) {
      logger.error('Request failed', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });

  next();
};

// Middleware para erros
const errorLogger = (error, req, res, next) => {
  logger.error('Application error', {
    error: error.message,
    stack: error.stack,
    method: req.method,
    url: req.url,
    body: req.body,
    params: req.params,
    query: req.query
  });

  next(error);
};

// Função para garantir que todos os logs sejam enviados
const flushLogs = async () => {
  if (logtail) {
    await logtail.flush();
  }
};

module.exports = { logger, requestLogger, errorLogger, flushLogs };
