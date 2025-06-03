// URL base da API (substitua pela URL real quando disponível)
const API_BASE_URL = 'https://sua-api-logistica.com/api';

// Função genérica para fazer requisições
async function fazerRequisicao(endpoint, metodo, dados = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const opcoes = {
        method: metodo,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (dados) {
        opcoes.body = JSON.stringify(dados);
    }

    try {
        const resposta = await fetch(url, opcoes);
        
        if (!resposta.ok) {
            throw new Error(`Erro na requisição: ${resposta.status}`);
        }
        
        return await resposta.json();
    } catch (erro) {
        console.error('Erro:', erro);
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