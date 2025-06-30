# 🐳 Configuração do Docker Hub para GitHub Actions

## Problema
Erro de autenticação 401 ao fazer push para o Docker Hub:
```
ERROR: failed to build: failed to solve: failed to fetch oauth token: unexpected status from GET request to https://auth.docker.io/token?scope=repository%3Aluizriato%2Fcicd%3Apull%2Cpush&service=registry.docker.io: 401 Unauthorized
```

## Solução: Configurar Access Token do Docker Hub

### 1. Criar Access Token no Docker Hub

1. **Acesse o Docker Hub**: https://hub.docker.com
2. **Faça login** na sua conta
3. **Vá em Account Settings**:
   - Clique no seu avatar (canto superior direito)
   - Selecione **"Account Settings"**
4. **Acesse Security**:
   - No menu lateral, clique em **"Security"**
5. **Crie um novo Access Token**:
   - Clique em **"New Access Token"**
   - **Nome**: `github-actions` (ou qualquer nome descritivo)
   - **Permissões**: Selecione `Read & Write`
   - Clique em **"Generate"**
6. **Copie o token** (você só verá uma vez!)

### 2. Adicionar Secrets no GitHub

1. **Vá para seu repositório**:
   - Acesse: `https://github.com/luizriato/cicd`
   - Clique em **"Settings"** (aba superior)

2. **Acesse Secrets**:
   - No menu lateral, clique em **"Secrets and variables"**
   - Selecione **"Actions"**

3. **Adicione os secrets**:

#### Secret 1: DOCKER_USERNAME
- Clique em **"New repository secret"**
- **Nome**: `DOCKER_USERNAME`
- **Valor**: Seu username do Docker Hub (ex: `luizriato`)

#### Secret 2: DOCKER_PASSWORD
- Clique em **"New repository secret"**
- **Nome**: `DOCKER_PASSWORD`
- **Valor**: O token que você criou no passo 1 (NÃO sua senha normal!)

### 3. Verificar Configuração

Seus secrets devem ficar assim:
```
DOCKER_USERNAME = luizriato
DOCKER_PASSWORD = dckr_pat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Testar a Configuração

1. **Faça um commit e push** para a branch `main`
2. **Vá para a aba Actions** no GitHub
3. **Monitore o job "Build Docker Image"**
4. **Verifique se o login no Docker Hub funciona**

## Troubleshooting

### Erro 401 Persiste
- Verifique se o token não expirou
- Confirme se as permissões são `Read & Write`
- Teste o login localmente:
  ```bash
  docker login -u luizriato -p seu_token_aqui
  ```

### Erro de Permissões
- Verifique se o repositório Docker existe
- Confirme se você tem permissões de push no repositório
- Crie o repositório se não existir

### Token Expirado
- Tokens do Docker Hub expiram automaticamente
- Crie um novo token e atualize o secret `DOCKER_PASSWORD`

## Estrutura do Repositório Docker

O workflow vai criar imagens com o nome:
```
docker.io/luizriato/cicd:latest
docker.io/luizriato/cicd:main
docker.io/luizriato/cicd:1.0.xxxxxxxxx
```

## Próximos Passos

1. ✅ Configurar Access Token do Docker Hub
2. ✅ Adicionar secrets no GitHub
3. ✅ Fazer commit e push
4. ✅ Verificar se o build funciona
5. ✅ Configurar deploy no Render

## Links Úteis

- [Docker Hub Access Tokens](https://docs.docker.com/docker-hub/access-tokens/)
- [GitHub Actions Docker Login](https://github.com/docker/login-action)
- [Docker Build Push Action](https://github.com/docker/build-push-action)

# 🐳 Configuração do Docker Hub

## Passos para configurar o Docker Hub para o pipeline CI/CD

### 1. Criar conta no Docker Hub

1. Acesse https://hub.docker.com
2. Clique em "Sign Up"
3. Preencha os dados necessários
4. Confirme seu email

### 2. Criar repositório

1. Faça login no Docker Hub
2. Clique em "Create Repository"
3. Configure:
   - **Repository Name**: Deve ser igual ao nome do repositório GitHub
   - **Visibility**: Public (recomendado) ou Private
   - **Description**: "API de Gerenciamento de Tarefas"
4. Clique em "Create"

### 3. Gerar Access Token

1. Vá em **Account Settings** > **Security**
2. Clique em **New Access Token**
3. Configure:
   - **Token name**: `github-actions`
   - **Access permissions**: Read & Write
4. Clique em **Generate**
5. **Copie o token** (você não conseguirá vê-lo novamente)

### 4. Configurar secrets no GitHub

Adicione os seguintes secrets no seu repositório GitHub:

```bash
DOCKER_USERNAME=seu_usuario_docker_hub
DOCKER_PASSWORD=seu_access_token_aqui
```

### 5. Verificar configuração

O pipeline irá automaticamente:

1. Fazer login no Docker Hub
2. Build da imagem Docker
3. Push da imagem para o repositório
4. Criar tags automáticas

### 6. Estrutura das tags

O pipeline criará as seguintes tags:

- `latest` - Sempre a versão mais recente
- `main` - Versão da branch main
- `v1.0.1234567890` - Versão específica (timestamp)
- `sha-abc123` - Commit específico

### 7. Verificar imagens

Após o primeiro deploy, você verá as imagens em:
```
https://hub.docker.com/r/seu_usuario/seu_repositorio
```

### 8. Comandos úteis

```bash
# Login manual no Docker Hub
docker login

# Pull da imagem
docker pull seu_usuario/seu_repositorio:latest

# Executar imagem localmente
docker run -p 3000:3000 seu_usuario/seu_repositorio:latest

# Ver tags disponíveis
docker images seu_usuario/seu_repositorio
```

### 9. Troubleshooting

#### Erro de autenticação:
- Verifique se o DOCKER_USERNAME está correto
- Use o Access Token como DOCKER_PASSWORD, não a senha normal
- Confirme se o token tem permissões de Read & Write

#### Erro de push:
- Verifique se o repositório existe no Docker Hub
- Confirme se o nome do repositório está correto
- Verifique se o repositório não está privado (se for, configure autenticação)

#### Imagem não aparece:
- Aguarde alguns minutos após o push
- Verifique os logs do GitHub Actions
- Confirme se o pipeline foi executado com sucesso

### 10. Monitoramento

- **Docker Hub**: Verifique as imagens em https://hub.docker.com
- **GitHub Actions**: Monitore o pipeline em https://github.com/seu_usuario/seu_repositorio/actions
- **Logs**: Verifique os logs do job "Build Docker Image"

---

**Importante**: O nome do repositório no Docker Hub deve ser exatamente igual ao nome do repositório no GitHub. 