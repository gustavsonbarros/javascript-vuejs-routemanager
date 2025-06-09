// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let clientes = [];
let idAtual = 1;

app.get('/clientes', (req, res) => {
    res.json(clientes);
});

app.post('/clientes', (req, res) => {
    const cliente = { id: idAtual++, ...req.body };
    clientes.push(cliente);
    res.status(201).json(cliente);
});

app.put('/clientes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = clientes.findIndex(c => c.id === id);
    if (index !== -1) {
        clientes[index] = { id, ...req.body };
        res.json(clientes[index]);
    } else {
        res.status(404).send('Cliente não encontrado');
    }
});

app.delete('/clientes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    clientes = clientes.filter(c => c.id !== id);
    res.status(204).send();
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
