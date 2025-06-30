require('dotenv').config();

console.log('🔍 Verificando configuração do BetterStack...\n');

// Verificar se o token está presente
if (!process.env.BETTERSTACK_SOURCE_TOKEN) {
  console.log('❌ BETTERSTACK_SOURCE_TOKEN não encontrado no arquivo .env');
  console.log('📝 Adicione a seguinte linha ao seu arquivo .env:');
  console.log('BETTERSTACK_SOURCE_TOKEN=seu_token_aqui\n');
  process.exit(1);
}

const token = process.env.BETTERSTACK_SOURCE_TOKEN;

console.log('✅ Token encontrado no .env');
console.log(`📋 Token: ${token.substring(0, 8)}...${token.substring(token.length - 4)}`);
console.log(`📏 Comprimento: ${token.length} caracteres`);

// Verificar formato do token
if (token.length < 20) {
  console.log('⚠️  Token parece muito curto. Tokens do BetterStack geralmente têm mais de 20 caracteres.');
}

if (token.includes('your_') || token.includes('example') || token.includes('placeholder')) {
  console.log('❌ Token parece ser um placeholder. Substitua pelo token real do BetterStack.');
  process.exit(1);
}

console.log('\n📋 Para obter um token válido:');
console.log('1. Acesse https://logs.betterstack.com');
console.log('2. Crie um novo Log Source ou use um existente');
console.log('3. Vá em Settings > Source Token');
console.log('4. Copie o token e cole no arquivo .env');
console.log('5. Reinicie a aplicação\n');

console.log('🧪 Para testar o token, execute:');
console.log('node test-betterstack.js\n');

console.log('📊 Dashboard do BetterStack:');
console.log('https://logs.betterstack.com'); 