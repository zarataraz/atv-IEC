require('dotenv').config();
const { logger, flushLogs } = require('./config/logger');

console.log('🧪 Testando integração com BetterStack Logtail...');
console.log('Token presente:', process.env.BETTERSTACK_SOURCE_TOKEN ? '✅ Sim' : '❌ Não');

// Teste de logs de diferentes níveis
logger.info('Teste de log INFO - Integração com BetterStack Logtail', {
  test: true,
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV || 'development'
});

logger.warn('Teste de log WARN - Aviso importante', {
  test: true,
  message: 'Este é um teste de aviso'
});

logger.error('Teste de log ERROR - Erro simulado', {
  test: true,
  error: 'Erro de teste para verificar integração',
  stack: 'Error: Test error\n    at test-betterstack.js:15:1'
});

// Garantir que todos os logs sejam enviados
flushLogs().then(() => {
  console.log('✅ Testes enviados. Verifique o dashboard do BetterStack em alguns segundos.');
  console.log('📊 Dashboard: https://logs.betterstack.com');
}).catch(err => {
  console.error('❌ Erro ao enviar logs:', err);
}); 