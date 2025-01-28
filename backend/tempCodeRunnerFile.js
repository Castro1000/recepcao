const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app); // Criar servidor HTTP
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"]
  }
});

const PORT = 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: '192.168.1.28', // IP do servidor MySQL
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

// **Conexão WebSocket**
io.on("connection", (socket) => {
  console.log("Novo cliente conectado: " + socket.id);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado: " + socket.id);
  });
});

// **Cadastrar novo atendimento**
app.post('/api/atendimentos', (req, res) => {
  const { modelo, placa, cor } = req.body;

  if (!modelo || !placa || !cor) {
    return res.status(400).json({ error: 'Todos os campos (modelo, placa, cor) são obrigatórios.' });
  }

  const query = 'INSERT INTO atendimento (modelo, placa, cor, status) VALUES (?, ?, ?, "em andamento")';
  db.query(query, [modelo, placa, cor], (err, result) => {
    if (err) {
      console.error('Erro ao inserir atendimento:', err);
      return res.status(500).json({ error: 'Erro ao inserir atendimento' });
    }

    res.status(201).json({ message: 'Atendimento inserido com sucesso', id: result.insertId });
  });
});

// **Buscar todos os atendimentos "em andamento"**
app.get('/api/clientes', (req, res) => {
  const query = 'SELECT * FROM atendimento WHERE status = "em andamento"';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar clientes:', err);
      return res.status(500).json({ error: 'Erro ao buscar clientes' });
    }

    res.status(200).json(results);
  });
});

// **Finalizar atendimento e notificar a recepção**
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

    // Buscar os dados do carro finalizado
    db.query("SELECT * FROM atendimento WHERE id = ?", [clienteId], (err, rows) => {
      if (err || rows.length === 0) {
        return res.status(500).json({ error: 'Erro ao buscar dados do carro finalizado' });
      }

      const carroFinalizado = rows[0];

      // **Envia para todas as telas conectadas via WebSocket**
      io.emit("carroFinalizado", carroFinalizado);

      res.status(200).json({ message: 'Atendimento finalizado com sucesso', carro: carroFinalizado });
    });
  });
});

// **Iniciar o servidor**
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
