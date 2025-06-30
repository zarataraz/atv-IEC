const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { logger } = require('../config/logger');

/**
 * @swagger
 * /tarefas:
 *   get:
 *     summary: Lista todas as tarefas
 *     tags: [Tarefas]
 *     responses:
 *       200:
 *         description: Lista de tarefas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tarefa'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tarefas ORDER BY created_at DESC');
    logger.info('Tarefas listadas com sucesso', { count: result.rows.length });
    res.json(result.rows);
  } catch (error) {
    logger.error('Erro ao listar tarefas', { error: error.message });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /tarefas/{id}:
 *   get:
 *     summary: Busca uma tarefa específica
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa
 *     responses:
 *       200:
 *         description: Tarefa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarefa'
 *       404:
 *         description: Tarefa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM tarefas WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      logger.warn('Tarefa não encontrada', { id });
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    
    logger.info('Tarefa encontrada', { id });
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Erro ao buscar tarefa', { error: error.message, id: req.params.id });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /tarefas:
 *   post:
 *     summary: Cria uma nova tarefa
 *     tags: [Tarefas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descricao
 *             properties:
 *               descricao:
 *                 type: string
 *                 description: Descrição da tarefa
 *               status:
 *                 type: string
 *                 enum: [pendente, em_andamento, completa]
 *                 default: pendente
 *                 description: Status da tarefa
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarefa'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', async (req, res) => {
  try {
    const { descricao, status = 'pendente' } = req.body;
    
    if (!descricao || descricao.trim() === '') {
      logger.warn('Tentativa de criar tarefa sem descrição');
      return res.status(400).json({ error: 'Descrição é obrigatória' });
    }

    const result = await pool.query(
      'INSERT INTO tarefas (descricao, status) VALUES ($1, $2) RETURNING *',
      [descricao.trim(), status]
    );

    logger.info('Tarefa criada com sucesso', { id: result.rows[0].id, descricao });
    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error('Erro ao criar tarefa', { error: error.message, body: req.body });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /tarefas/{id}:
 *   put:
 *     summary: Atualiza uma tarefa existente
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descricao:
 *                 type: string
 *                 description: Nova descrição da tarefa
 *               status:
 *                 type: string
 *                 enum: [pendente, em_andamento, completa]
 *                 description: Novo status da tarefa
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarefa'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Tarefa não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, status } = req.body;

    // Verificar se a tarefa existe
    const existing = await pool.query('SELECT * FROM tarefas WHERE id = $1', [id]);
    
    if (existing.rows.length === 0) {
      logger.warn('Tentativa de atualizar tarefa inexistente', { id });
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    if (descricao && descricao.trim() === '') {
      logger.warn('Tentativa de atualizar tarefa com descrição vazia', { id });
      return res.status(400).json({ error: 'Descrição não pode estar vazia' });
    }

    // Construir query de atualização dinamicamente
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (descricao !== undefined) {
      updates.push(`descricao = $${paramCount++}`);
      values.push(descricao.trim());
    }
    
    if (status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' });
    }
    
    values.push(id);
    
    await pool.query(
      `UPDATE tarefas SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount}`,
      values
    );

    const updatedTarefa = await pool.query('SELECT * FROM tarefas WHERE id = $1', [id]);
    
    logger.info('Tarefa atualizada com sucesso', { id, updates });
    res.json(updatedTarefa.rows[0]);
  } catch (error) {
    logger.error('Erro ao atualizar tarefa', { error: error.message, id: req.params.id });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /tarefas/{id}:
 *   delete:
 *     summary: Remove uma tarefa
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa
 *     responses:
 *       200:
 *         description: Tarefa removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 tarefa:
 *                   $ref: '#/components/schemas/Tarefa'
 *       404:
 *         description: Tarefa não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se a tarefa existe
    const existing = await pool.query('SELECT * FROM tarefas WHERE id = $1', [id]);
    
    if (existing.rows.length === 0) {
      logger.warn('Tentativa de remover tarefa inexistente', { id });
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    await pool.query('DELETE FROM tarefas WHERE id = $1', [id]);
    
    logger.info('Tarefa removida com sucesso', { id });
    res.json({ 
      message: 'Tarefa removida com sucesso', 
      tarefa: existing.rows[0] 
    });
  } catch (error) {
    logger.error('Erro ao remover tarefa', { error: error.message, id: req.params.id });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router; 