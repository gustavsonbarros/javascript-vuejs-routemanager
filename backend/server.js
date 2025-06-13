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
let rotas = [];
let idAtualRotas = 1;
let entregas = [];
let idAtualEntregas = 1;



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


app.get('/rotas', (req, res) => {
    res.json(rotas);
});

app.post('/rotas', (req, res) => {
    const rota = { 
        id: idAtualRotas++,
        origem: req.body.origem,
        destino: req.body.destino,
        distancia: req.body.distancia,
        tempoEstimado: req.body.tempoEstimado
    };
    rotas.push(rota);
    res.status(201).json(rota);
});

app.put('/rotas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = rotas.findIndex(r => r.id === id);
    if (index !== -1) {
        rotas[index] = { id, ...req.body };
        res.json(rotas[index]);
    } else {
        res.status(404).send('Rota não encontrada');
    }
});

app.delete('/rotas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    rotas = rotas.filter(r => r.id !== id);
    res.status(204).send();
});


app.get('/entregas', (req, res) => {
    res.json(entregas);
});

app.post('/entregas', (req, res) => {
    const entrega = { 
        id: idAtualEntregas++,
        clienteId: req.body.clienteId,
        encomendaId: req.body.encomendaId,
        rotaId: req.body.rotaId,
        dataEstimada: req.body.dataEstimada,
        status: req.body.status || 'em_preparo'
    };
    entregas.push(entrega);
    res.status(201).json(entrega);
});

app.put('/entregas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = entregas.findIndex(e => e.id === id);
    if (index !== -1) {
        entregas[index] = { id, ...entregas[index], ...req.body };
        res.json(entregas[index]);
    } else {
        res.status(404).send('Entrega não encontrada');
    }
});

app.delete('/entregas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    entregas = entregas.filter(e => e.id !== id);
    res.status(204).send();
});

// Adicionar junto com os outros endpoints
app.get('/entregas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const entrega = entregas.find(e => e.id === id);
    if (entrega) {
        res.json(entrega);
    } else {
        res.status(404).send('Entrega não encontrada');
    }
});


// Adicionar junto com os outros endpoints
app.get('/centros', (req, res) => {
    res.json([
        { id: 1, nome: "Centro Norte", cidade: "São Paulo", capacidade: 5000 },
        { id: 2, nome: "Centro Sul", cidade: "Curitiba", capacidade: 3000 },
        { id: 3, nome: "Centro Leste", cidade: "Rio de Janeiro", capacidade: 4000 }
    ]);
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));