// URL base da API (substitua pela URL real quando disponível)
const BASE_URL = "http://localhost:3001/api";

function mostrarLoading() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(overlay);
    return overlay;
}

async function fazerRequisicao(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
        options.body = JSON.stringify(body);
    }

    try {
        const resposta = await fetch(`${BASE_URL}${endpoint}`, options);
        
        if (!resposta.ok) {
            throw new Error(`Erro na resposta: ${resposta.status}`);
        }
        
        return await resposta.json();
    } catch (erro) {
        console.error("Erro na requisição:", erro);
        throw erro;
    }
}


// Funções específicas para clientes
async function cadastrarCliente(cliente) {
    return fazerRequisicao('/clientes', 'POST', cliente);
}


async function listarClientes(filtros = {}) {
    const query = new URLSearchParams(filtros).toString();
    return fazerRequisicao(`/clientes?${query}`, 'GET');
}

// Funções específicas para encomendas
async function cadastrarEncomenda(encomenda) {
    return fazerRequisicao('/encomendas', 'POST', encomenda);
}

async function listarEncomendas(filtros = {}) {
    const query = new URLSearchParams(filtros).toString();
    return fazerRequisicao(`/encomendas?${query}`, 'GET');
}

// Exportando as funções para uso em outros arquivos
export {
    cadastrarCliente,
    listarClientes,
    cadastrarEncomenda,
    listarEncomendas
};