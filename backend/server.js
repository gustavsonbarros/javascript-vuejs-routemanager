const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


let clientes = [];
let encomendas = [];
let idAtualClientes = 1;
let idAtualEncomendas = 1;


app.get('/clientes', (req, res) => {
    res.json(clientes);
});

app.post('/clientes', (req, res) => {
    const cliente = { id: idAtualClientes++, ...req.body };
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


app.get('/encomendas', (req, res) => {
    const { tipo, pesoMinimo, pesoMaximo } = req.query;
    let resultado = encomendas;

    
    if (tipo) {
        resultado = resultado.filter(e => e.tipo === tipo);
    }
    if (pesoMinimo) {
        resultado = resultado.filter(e => e.peso >= parseFloat(pesoMinimo));
    }
    if (pesoMaximo) {
        resultado = resultado.filter(e => e.peso <= parseFloat(pesoMaximo));
    }

    res.json(resultado);
});

app.post('/encomendas', (req, res) => {
    const encomenda = { 
        id: idAtualEncomendas++, 
        peso: parseFloat(req.body.peso),
        tipo: req.body.tipo,
        descricao: req.body.descricao || '',
        enderecoEntrega: req.body.enderecoEntrega
    };
    encomendas.push(encomenda);
    res.status(201).json(encomenda);
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));