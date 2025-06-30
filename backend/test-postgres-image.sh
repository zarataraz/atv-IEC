#!/bin/bash

# Script para testar a imagem PostgreSQL localmente
# Uso: ./test-postgres-image.sh

set -e

echo "🐘 Testando imagem PostgreSQL localmente..."

# Parar e remover container existente se houver
echo "🧹 Limpando containers existentes..."
docker stop postgres-test 2>/dev/null || true
docker rm postgres-test 2>/dev/null || true

# Remover volume se existir
echo "🗑️  Removendo volume existente..."
docker volume rm postgres_test_data 2>/dev/null || true

# Construir imagem localmente
echo "🔨 Construindo imagem PostgreSQL..."
docker build -f Dockerfile.postgres -t postgres-test:local .

# Executar container
echo "🚀 Iniciando container PostgreSQL..."
docker run -d \
  --name postgres-test \
  -p 5432:5432 \
  -e POSTGRES_DB=tarefas_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -v postgres_test_data:/var/lib/postgresql/data \
  postgres-test:local

# Aguardar PostgreSQL inicializar
echo "⏳ Aguardando PostgreSQL inicializar..."
sleep 10

# Verificar se o container está rodando
echo "🔍 Verificando status do container..."
if docker ps | grep -q postgres-test; then
    echo "✅ Container PostgreSQL está rodando"
else
    echo "❌ Container PostgreSQL não está rodando"
    docker logs postgres-test
    exit 1
fi

# Testar conexão
echo "🔌 Testando conexão com o banco..."
docker exec postgres-test pg_isready -U postgres -d tarefas_db

# Verificar se a tabela foi criada
echo "📋 Verificando estrutura do banco..."
docker exec postgres-test psql -U postgres -d tarefas_db -c "\dt"

# Verificar dados de exemplo
echo "📊 Verificando dados de exemplo..."
docker exec postgres-test psql -U postgres -d tarefas_db -c "SELECT * FROM tarefas;"

# Testar conexão via Node.js (se disponível)
if command -v node &> /dev/null; then
    echo "🧪 Testando conexão via Node.js..."
    node -e "
    const { Pool } = require('pg');
    const pool = new Pool({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'password',
        database: 'tarefas_db'
    });
    
    pool.query('SELECT COUNT(*) as count FROM tarefas', (err, res) => {
        if (err) {
            console.error('❌ Erro na conexão Node.js:', err.message);
            process.exit(1);
        } else {
            console.log('✅ Conexão Node.js bem-sucedida. Tarefas encontradas:', res.rows[0].count);
        }
        pool.end();
    });
    " || echo "⚠️  Teste Node.js falhou (dependências não instaladas)"
fi

echo ""
echo "🎉 Teste concluído com sucesso!"
echo ""
echo "📝 Informações do container:"
echo "   - Nome: postgres-test"
echo "   - Porta: 5432"
echo "   - Usuário: postgres"
echo "   - Senha: password"
echo "   - Banco: tarefas_db"
echo ""
echo "🔗 Para conectar via psql:"
echo "   docker exec -it postgres-test psql -U postgres -d tarefas_db"
echo ""
echo "🛑 Para parar o container:"
echo "   docker stop postgres-test"
echo ""
echo "🗑️  Para remover o container:"
echo "   docker rm postgres-test"
echo ""
echo "💾 Para remover o volume:"
echo "   docker volume rm postgres_test_data" 