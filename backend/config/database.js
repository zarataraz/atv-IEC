const { Pool } = require('pg');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.RENDER === 'true' || process.env.DB_SSL === 'true'
    ? { rejectUnauthorized: false }
    : false
};


const pool = new Pool(dbConfig);

// Função para inicializar o banco de dados
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    
    // Criar tabela de tarefas se não existir
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS tarefas (
        id SERIAL PRIMARY KEY,
        descricao VARCHAR(255) NOT NULL,
        status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'completa')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await client.query(createTableQuery);
    
    // Inserir dados de exemplo se a tabela estiver vazia
    const result = await client.query('SELECT COUNT(*) as count FROM tarefas');
    
    if (parseInt(result.rows[0].count) === 0) {
      const insertQuery = `
        INSERT INTO tarefas (descricao, status) VALUES 
        ('Estudar React Native', 'pendente'),
        ('Fazer exercícios', 'completa')
      `;
      await client.query(insertQuery);
      console.log('Dados de exemplo inseridos no banco de dados');
    }
    
    client.release();
    console.log('Banco de dados inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    throw error;
  }
}

module.exports = { pool, initializeDatabase }; 