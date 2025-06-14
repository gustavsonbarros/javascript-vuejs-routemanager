const API_URL_CLIENTES = 'http://localhost:3000/clientes';
const API_URL_ENCOMENDAS = 'http://localhost:3000/encomendas';
const API_URL_ROTAS = 'http://localhost:3000/rotas';
const API_URL_ENTREGAS = 'http://localhost:3000/entregas';

// Funções para Clientes
export async function obterClientes() {
    const resposta = await fetch(API_URL_CLIENTES);
    return resposta.json();
}

export async function cadastrarCliente(cliente) {
    const resposta = await fetch(API_URL_CLIENTES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
    });
    return resposta.json();
}

export async function atualizarCliente(id, cliente) {
    const resposta = await fetch(`${API_URL_CLIENTES}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
    });
    return resposta.json();
}

export async function deletarCliente(id) {
    const resposta = await fetch(`${API_URL_CLIENTES}/${id}`, {
        method: 'DELETE'
    });
    return resposta.ok;
}

// Funções para Encomendas (CORREÇÃO PRINCIPAL AQUI)
export async function obterEncomendas() {
    const resposta = await fetch(API_URL_ENCOMENDAS);
    return resposta.json();
}

export async function listarEncomendas(filtros = {}) {
    const params = new URLSearchParams();
    
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.pesoMinimo) params.append('pesoMinimo', filtros.pesoMinimo);
    if (filtros.pesoMaximo) params.append('pesoMaximo', filtros.pesoMaximo);

    const resposta = await fetch(`${API_URL_ENCOMENDAS}?${params.toString()}`);
    return resposta.json();
}

export async function cadastrarEncomenda(encomenda) {
    const resposta = await fetch(API_URL_ENCOMENDAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(encomenda)
    });
    return resposta.json();
}

// Funções para Rotas
export async function obterRotas() {
    const resposta = await fetch(API_URL_ROTAS);
    return resposta.json();
}

export async function cadastrarRota(rota) {
    const resposta = await fetch(API_URL_ROTAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rota)
    });
    return resposta.json();
}

export async function atualizarRota(id, rota) {
    const resposta = await fetch(`${API_URL_ROTAS}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rota)
    });
    return resposta.json();
}

export async function deletarRota(id) {
    const resposta = await fetch(`${API_URL_ROTAS}/${id}`, {
        method: 'DELETE'
    });
    return resposta.ok;
}

// Funções para Entregas
export async function obterEntregas() {
    const resposta = await fetch(API_URL_ENTREGAS);
    return resposta.json();
}

export async function cadastrarEntrega(entrega) {
    const resposta = await fetch(API_URL_ENTREGAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entrega)
    });
    return resposta.json();
}

export async function atualizarEntrega(id, entrega) {
    const resposta = await fetch(`${API_URL_ENTREGAS}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entrega)
    });
    return resposta.json();
}

export async function deletarEntrega(id) {
    const resposta = await fetch(`${API_URL_ENTREGAS}/${id}`, {
        method: 'DELETE'
    });
    return resposta.ok;
}