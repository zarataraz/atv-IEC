# 📊 Configuração do BetterStack com Logtail

## Passos para configurar o BetterStack para logging centralizado

### 1. Criar conta no BetterStack

1. Acesse https://betterstack.com
2. Clique em "Get Started"
3. Faça login com GitHub (recomendado)
4. Complete o cadastro

### 2. Criar Log Source

1. No dashboard do BetterStack, clique em **"Add Source"**
2. Selecione **"Application Logs"**
3. Escolha **"Node.js"** como plataforma
4. Dê um nome para o source (ex: "Tarefas API")

### 3. Configurar Log Source

#### Informações Básicas:
- **Source Name**: `tarefas-api-logs`
- **Description**: "Logs da API de Gerenciamento de Tarefas"
- **Platform**: Node.js
- **Environment**: Production

#### Configurações Avançadas:
- **Log Level**: Info (recomendado)
- **Retention**: 30 days (padrão)
- **Timezone**: UTC (recomendado)

### 4. Obter Source Token

Após criar o Log Source:

1. Clique no source criado
2. Vá em **"Settings"** > **"Source Token"**
3. **Copie o token** (você precisará dele)

### 5. Instalar dependências

```bash
cd backend
npm install @logtail/winston @logtail/node
```

### 6. Configurar no projeto

#### Local (.env):
```env
BETTERSTACK_SOURCE_TOKEN=seu_source_token_aqui
```

#### GitHub Secrets:
```bash
BETTERSTACK_SOURCE_TOKEN=seu_source_token_aqui
```

### 7. Verificar configuração

#### Script de verificação:
```bash
cd backend
node verify-token.js
```

Este script irá:
- Verificar se o token está configurado
- Mostrar informações sobre o token
- Dar instruções se algo estiver errado

### 8. Testar integração

#### Script de teste automático:
```bash
cd backend
node test-betterstack.js
```

Este script irá:
- Verificar se o token está configurado
- Enviar logs de teste (INFO, WARN, ERROR)
- Mostrar o status da integração

#### Teste manual:
1. Configure o token no arquivo `.env`
2. Execute a aplicação: `npm start`
3. Faça algumas requisições para a API
4. Verifique se os logs aparecem no BetterStack

### 9. Troubleshooting - Erro 401/Unauthorized

Se você receber erro 401 (Unauthorized):

#### Verificações:
1. **Token válido**: Confirme se o token está correto e não expirou
2. **Source ativo**: Verifique se o Log Source não foi deletado
3. **Token correto**: Use o token do Source Token, não do API Token
4. **Formato correto**: O token deve ter pelo menos 20 caracteres

#### Soluções:
1. **Gerar novo token**: Vá em Settings > Source Token > Regenerate
2. **Verificar source**: Confirme se o source está ativo no dashboard
3. **Verificar token**: Execute `node verify-token.js` para verificar o token
4. **Reiniciar aplicação**: Após alterar o token, reinicie o servidor

### 10. Configurar alertas (opcional)

1. Vá em **"Alerts"** no BetterStack
2. Clique em **"Create Alert"**
3. Configure:
   - **Name**: "API Errors"
   - **Condition**: Error level logs
   - **Notification**: Email/Slack
   - **Threshold**: 1 error in 5 minutes

### 11. Configurar dashboards (opcional)

1. Vá em **"Dashboards"**
2. Crie um novo dashboard
3. Adicione widgets para:
   - Log volume por hora
   - Error rate
   - Response time
   - Top endpoints

### 12. URLs importantes

- **Dashboard**: https://logs.betterstack.com
- **Seu Log Source**: https://logs.betterstack.com/sources/seu_source_id
- **Documentação**: https://betterstack.com/docs/

### 13. Estrutura dos logs

O projeto envia os seguintes tipos de logs:

#### Request Logs:
```json
{
  "level": "info",
  "message": "Request completed",
  "method": "GET",
  "url": "/tarefas",
  "status": 200,
  "duration": "45ms",
  "userAgent": "curl/7.68.0",
  "ip": "192.168.1.1",
  "service": "tarefas-api"
}
```

#### Error Logs:
```json
{
  "level": "error",
  "message": "Application error",
  "error": "Database connection failed",
  "stack": "Error: connect ECONNREFUSED...",
  "method": "GET",
  "url": "/tarefas",
  "service": "tarefas-api"
}
```

#### Application Logs:
```json
{
  "level": "info",
  "message": "Servidor iniciado com sucesso",
  "port": 3000,
  "environment": "production",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "service": "tarefas-api"
}
```

### 14. Monitoramento

#### Logs em tempo real:
- Acesse o dashboard do Log Source
- Veja logs chegando em tempo real
- Use filtros para encontrar logs específicos

#### Métricas:
- **Log Volume**: Número de logs por hora/dia
- **Error Rate**: Taxa de erros
- **Response Time**: Tempo de resposta
- **Top Endpoints**: Endpoints mais acessados

### 15. Troubleshooting geral

#### Logs não aparecem:
1. Verifique se o token está correto com `node verify-token.js`
2. Confirme se o source foi criado
3. Execute o script de teste: `node test-betterstack.js`
4. Verifique se a aplicação está enviando logs

#### Erro de autenticação (401):
1. Verifique se o token está válido
2. Confirme se o source não foi deletado
3. Gere um novo token se necessário
4. Use o token do Source Token, não do API Token

#### Logs duplicados:
1. Verifique se não há múltiplas instâncias
2. Confirme se o logger está configurado corretamente
3. Use filtros para remover duplicatas

### 16. Comandos úteis

```bash
# Verificar configuração do token
cd backend
node verify-token.js

# Testar integração com BetterStack
node test-betterstack.js

# Testar logs localmente
curl http://localhost:3000/tarefas

# Ver logs no BetterStack
# (via dashboard web)

# Testar logs em produção
curl https://seu-servico.onrender.com/tarefas
```

### 17. Configurações avançadas

#### Log Levels:
- **Error**: Erros críticos
- **Warn**: Avisos importantes
- **Info**: Informações gerais
- **Debug**: Informações detalhadas

#### Filtros:
- Use filtros para encontrar logs específicos
- Filtre por nível, método, status, etc.
- Salve filtros favoritos

#### Retenção:
- Configure retenção de logs (7-90 dias)
- Exporte logs importantes
- Configure backup automático

---

**Importante**: 
- Mantenha o Source Token seguro e nunca o commite no repositório
- Use o script `verify-token.js` para verificar a configuração
- Use o script `test-betterstack.js` para testar a integração
- Em caso de erro 401, verifique se está usando o Source Token correto
- O token deve vir de Settings > Source Token, não de API Tokens 