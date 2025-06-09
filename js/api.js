const API_URL_CLIENTES = 'http://localhost:3000/clientes';
const API_URL_ENCOMENDAS = 'http://localhost:3000/encomendas';


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