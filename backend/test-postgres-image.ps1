# Script PowerShell para testar a imagem PostgreSQL localmente
# Uso: .\test-postgres-image.ps1

Write-Host "🐘 Testando imagem PostgreSQL localmente..." -ForegroundColor Green

# Parar e remover container existente se houver
Write-Host "🧹 Limpando containers existentes..." -ForegroundColor Yellow
docker stop postgres-test 2>$null
docker rm postgres-test 2>$null

# Remover volume se existir
Write-Host "🗑️  Removendo volume existente..." -ForegroundColor Yellow
docker volume rm postgres_test_data 2>$null

# Construir imagem localmente
Write-Host "🔨 Construindo imagem PostgreSQL..." -ForegroundColor Yellow
docker build -f Dockerfile.postgres -t postgres-test:local .

# Executar container
Write-Host "🚀 Iniciando container PostgreSQL..." -ForegroundColor Yellow
docker run -d `
  --name postgres-test `
  -p 5432:5432 `
  -e POSTGRES_DB=tarefas_db `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=password `
  -v postgres_test_data:/var/lib/postgresql/data `
  postgres-test:local

# Aguardar PostgreSQL inicializar
Write-Host "⏳ Aguardando PostgreSQL inicializar..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar se o container está rodando
Write-Host "🔍 Verificando status do container..." -ForegroundColor Yellow
$containerRunning = docker ps | Select-String "postgres-test"
if ($containerRunning) {
    Write-Host "✅ Container PostgreSQL está rodando" -ForegroundColor Green
} else {
    Write-Host "❌ Container PostgreSQL não está rodando" -ForegroundColor Red
    docker logs postgres-test
    exit 1
}

# Testar conexão
Write-Host "🔌 Testando conexão com o banco..." -ForegroundColor Yellow
docker exec postgres-test pg_isready -U postgres -d tarefas_db

# Verificar se a tabela foi criada
Write-Host "📋 Verificando estrutura do banco..." -ForegroundColor Yellow
docker exec postgres-test psql -U postgres -d tarefas_db -c "\dt"

# Verificar dados de exemplo
Write-Host "📊 Verificando dados de exemplo..." -ForegroundColor Yellow
docker exec postgres-test psql -U postgres -d tarefas_db -c "SELECT * FROM tarefas;"

# Testar conexão via Node.js (se disponível)
if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "🧪 Testando conexão via Node.js..." -ForegroundColor Yellow
    try {
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
        "
    } catch {
        Write-Host "⚠️  Teste Node.js falhou (dependências não instaladas)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎉 Teste concluído com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Informações do container:" -ForegroundColor Cyan
Write-Host "   - Nome: postgres-test"
Write-Host "   - Porta: 5432"
Write-Host "   - Usuário: postgres"
Write-Host "   - Senha: password"
Write-Host "   - Banco: tarefas_db"
Write-Host ""
Write-Host "🔗 Para conectar via psql:" -ForegroundColor Cyan
Write-Host "   docker exec -it postgres-test psql -U postgres -d tarefas_db"
Write-Host ""
Write-Host "🛑 Para parar o container:" -ForegroundColor Cyan
Write-Host "   docker stop postgres-test"
Write-Host ""
Write-Host "🗑️  Para remover o container:" -ForegroundColor Cyan
Write-Host "   docker rm postgres-test"
Write-Host ""
Write-Host "💾 Para remover o volume:" -ForegroundColor Cyan
Write-Host "   docker volume rm postgres_test_data" 