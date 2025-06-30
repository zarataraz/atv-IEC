# Adicionar Contribuidor festmedeiros

## Passos para adicionar o usuário festmedeiros como contribuidor:

### 1. Via Interface Web do GitHub

1. Acesse o repositório no GitHub
2. Vá para a aba "Settings" (Configurações)
3. No menu lateral, clique em "Collaborators and teams"
4. Clique em "Add people"
5. Digite o username: `festmedeiros`
6. Selecione as permissões adequadas (recomendado: "Write" para permitir push)
7. Clique em "Add [username] to this repository"

### 2. Via GitHub CLI (se disponível)

```bash
# Instalar GitHub CLI se não tiver
# https://cli.github.com/

# Fazer login
gh auth login

# Adicionar colaborador
gh repo add-collaborator SEU_USUARIO/SEU_REPOSITORIO festmedeiros --permission write
```

### 3. Verificar se foi adicionado

```bash
# Listar colaboradores
gh repo view --json collaborators
```

### 4. Permissões Recomendadas

- **Write**: Permite push direto no repositório
- **Read**: Apenas visualização (não recomendado para este projeto)

### 5. Notificação

O usuário festmedeiros receberá um email convidando para colaborar no repositório.

---

**Importante**: Certifique-se de que o usuário festmedeiros existe no GitHub antes de tentar adicioná-lo. 