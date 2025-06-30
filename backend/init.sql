-- Script de inicialização do banco de dados PostgreSQL
-- Este script é executado automaticamente quando o container PostgreSQL é criado

-- Criar tabela de tarefas
CREATE TABLE IF NOT EXISTS tarefas (
  id SERIAL PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'completa')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tarefas_updated_at 
    BEFORE UPDATE ON tarefas 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados de exemplo (apenas se a tabela estiver vazia)
INSERT INTO tarefas (descricao, status) 
SELECT 'Estudar React Native', 'pendente'
WHERE NOT EXISTS (SELECT 1 FROM tarefas);

INSERT INTO tarefas (descricao, status) 
SELECT 'Fazer exercícios', 'completa'
WHERE NOT EXISTS (SELECT 1 FROM tarefas WHERE descricao = 'Fazer exercícios');

INSERT INTO tarefas (descricao, status) 
SELECT 'Ler documentação da API', 'em_andamento'
WHERE NOT EXISTS (SELECT 1 FROM tarefas WHERE descricao = 'Ler documentação da API'); 