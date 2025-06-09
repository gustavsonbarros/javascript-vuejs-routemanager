const API_URL = 'http://localhost:3000/clientes';

export async function obterClientes() {
    const resposta = await fetch(API_URL);
    return resposta.json();
}

export async function cadastrarCliente(cliente) {
    const resposta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
    });
    return resposta.json();
}

export async function atualizarCliente(id, cliente) {
    const resposta = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
    });
    return resposta.json();
}

export async function deletarCliente(id) {
    const resposta = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    return resposta.ok;
}
