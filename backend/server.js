const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = 3001; // Porta do servidor

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: '192.168.1.28',
  user: 'root',
  password: '',
  database: 'filaatend',
  port: 3306, // Porta do MySQL
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    process.exit(1);
  }
  console.log('Conexão bem-sucedida com o banco de dados MySQL.');
});

// Endpoint para cadastrar um novo atendimento
app.post('/api/atendimentos', (req, res) => {
  console.log(req.body); // Para ver o conteúdo enviado pelo frontend
  const { modelo, placa, cor } = req.body;
  if (!modelo || !placa || !cor) {
    res.status(400).json({ error: 'Todos os campos (modelo, placa, cor) são obrigatórios.' });
    return;
  }
  const query = 'INSERT INTO atendimento (modelo, placa, cor, status) VALUES (?, ?, ?, "em andamento")';
  db.query(query, [modelo, placa, cor], (err, result) => {
    if (err) {
      console.error('Erro ao inserir atendimento:', err);
      res.status(500).json({ error: 'Erro ao inserir atendimento' });
      return;
    }
    res.status(201).json({ message: 'Atendimento inserido com sucesso', id: result.insertId });
  });
});

// Rota para buscar todos os atendimentos com status "em andamento"
app.get('/api/clientes', (req, res) => {
  const query = 'SELECT * FROM atendimento WHERE status = "em andamento"'; // Altere para filtrar por status "em andamento"
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar clientes:', err);
      res.status(500).json({ error: 'Erro ao buscar clientes' });
      return;
    }
    res.status(200).json(results);
  });
});

// Endpoint para finalizar um atendimento (marcar como finalizado)
app.put('/api/clientes/finalizar/:id', (req, res) => {
  const clienteId = req.params.id;
  const query = 'UPDATE atendimento SET status = "finalizado" WHERE id = ?';

  db.query(query, [clienteId], (err, result) => {
    if (err) {
      console.error('Erro ao finalizar atendimento:', err);
      return res.status(500).json({ error: 'Erro ao finalizar atendimento' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.status(200).json({ message: 'Atendimento finalizado com sucesso' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
