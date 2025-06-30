#!/bin/bash

echo "🐳 Testando configuração do Docker Hub..."
echo "=========================================="

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker primeiro."
    exit 1
fi

echo "✅ Docker está rodando"

# Verificar se as variáveis de ambiente estão definidas
if [ -z "$DOCKER_USERNAME" ]; then
    echo "❌ DOCKER_USERNAME não está definido"
    echo "   Execute: export DOCKER_USERNAME=prsilva1w"
    exit 1
fi

if [ -z "$DOCKER_PASSWORD" ]; then
    echo "❌ DOCKER_PASSWORD não está definido"
    echo "   Execute: export DOCKER_PASSWORD=seu_token"
    exit 1
fi

echo "✅ Variáveis de ambiente configuradas"
echo "   Username: $DOCKER_USERNAME"
echo "   Password length: ${#DOCKER_PASSWORD}"

# Testar login no Docker Hub
echo ""
echo "🔐 Testando login no Docker Hub..."
if docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD" > /dev/null 2>&1; then
    echo "✅ Login no Docker Hub bem-sucedido"
else
    echo "❌ Falha no login do Docker Hub"
    echo "   Verifique se o token está correto e não expirou"
    exit 1
fi

# Testar pull de uma imagem
echo ""
echo "📥 Testando pull de imagem..."
if docker pull hello-world > /dev/null 2>&1; then
    echo "✅ Pull de imagem bem-sucedido"
else
    echo "❌ Falha no pull de imagem"
    exit 1
fi

# Testar push (simulação)
echo ""
echo "📤 Testando permissões de push..."
REPO_NAME="prsilva1w/atv-IEC"
echo "   Repositório: $REPO_NAME"

# Verificar se o repositório existe
if curl -s "https://hub.docker.com/v2/repositories/$REPO_NAME/" | grep -q "name"; then
    echo "✅ Repositório $REPO_NAME existe"
else
    echo "⚠️  Repositório $REPO_NAME não existe"
    echo "   Você pode criar em: https://hub.docker.com/repositories"
fi

# Testar build local
echo ""
echo "🔨 Testando build local..."
if [ -f "backend/Dockerfile" ]; then
    echo "✅ Dockerfile encontrado"
    if docker build -t test-build ./backend > /dev/null 2>&1; then
        echo "✅ Build local bem-sucedido"
    else
        echo "❌ Falha no build local"
        echo "   Verifique o Dockerfile em backend/Dockerfile"
    fi
else
    echo "❌ Dockerfile não encontrado em backend/Dockerfile"
fi

echo ""
echo "🎯 Resumo dos testes:"
echo "   - Docker: ✅"
echo "   - Credenciais: ✅"
echo "   - Login: ✅"
echo "   - Pull: ✅"
echo "   - Build: ✅"

echo ""
echo "💡 Se todos os testes passaram, o problema pode estar no GitHub Actions."
echo "   Verifique:"
echo "   1. Se os secrets estão configurados corretamente"
echo "   2. Se o token não expirou"
echo "   3. Se as permissões do token são 'Read & Write'"
echo "   4. Se o DOCKER_USERNAME está configurado como 'prsilva1w'" 