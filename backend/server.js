require('dotenv').config();

// 1. Importar os pacotes necessários
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// 2. Inicializar o Express
const app = express(); // <<< ESTA LINHA ESTAVA FALTANDO E É FUNDAMENTAL

// 3. Configurar os Middlewares (devem vir antes das rotas)
app.use(cors()); // Habilita o CORS para todas as requisições
app.use(express.json()); // Habilita o servidor a entender JSON no corpo das requisições

// 4. Configurar a Conexão com o PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Usa a URL do banco de dados do ambiente
  ssl: {
    rejectUnauthorized: false
  }
});

// 5. DEFINIÇÃO DAS ROTAS (ENDPOINTS) DA API

// ROTA RAIZ para Health Check
app.get('/', (req, res) => {
    res.send('API da To-Do List está no ar!');
});

// ROTA GET: Obter todas as tarefas
app.get('/tasks', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro no servidor');
  }
});

// ROTA POST: Criar uma nova tarefa
app.post('/tasks', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).send('O título é obrigatório');
    }
    const newTask = await pool.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
      [title]
    );
    res.status(201).json(newTask.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro no servidor');
  }
});

// ROTA PUT: Atualizar o status de uma tarefa
app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params; // Pega o ID da URL
    const { status } = req.body; // Pega o novo status do corpo da requisição

    if (!status) {
      return res.status(400).send('O novo status é obrigatório');
    }

    const updatedTask = await pool.query(
      'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (updatedTask.rowCount === 0) {
      return res.status(404).send('Tarefa não encontrada');
    }

    res.json(updatedTask.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro no servidor');
  }
});

// 6. Iniciar o Servidor (esta deve ser a ÚLTIMA coisa no arquivo)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});