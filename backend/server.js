const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001; // Porta diferente do frontend

// Middlewares
app.use(cors()); // Permite conexão com o frontend
app.use(bodyParser.json());

// Banco de dados em memória
let clientes = [
  { id: 1, nome: "Cliente Exemplo", cpfCnpj: "12345678901", email: "exemplo@email.com", endereco: "Rua Teste, 123" }
];

let entregas = [
  { id: 1, clienteId: 1, status: "Em rota", enderecoEntrega: "Av. Principal, 456" }
];

// Rotas para Clientes
app.get('/api/clientes', (req, res) => {
  const { nome, cpfCnpj } = req.query;
  let resultado = clientes;
  
  if (nome) resultado = resultado.filter(c => c.nome.toLowerCase().includes(nome.toLowerCase()));
  if (cpfCnpj) resultado = resultado.filter(c => c.cpfCnpj.includes(cpfCnpj.replace(/\D/g, '')));
  
  res.json(resultado);
});

app.post('/api/clientes', (req, res) => {
  const novoCliente = { id: clientes.length + 1, ...req.body };
  clientes.push(novoCliente);
  res.status(201).json(novoCliente);
});

// Rotas para Entregas
app.get('/api/entregas', (req, res) => {
  res.json(entregas);
});

app.post('/api/entregas', (req, res) => {
  const novaEntrega = { id: entregas.length + 1, ...req.body };
  entregas.push(novaEntrega);
  res.status(201).json(novaEntrega);
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});