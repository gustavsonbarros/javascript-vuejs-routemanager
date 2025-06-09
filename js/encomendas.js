import { cadastrarEncomenda, listarEncomendas } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const formEncomenda = document.getElementById('form-encomenda');
    const tabelaEncomendas = document.getElementById('corpo-tabela-encomendas');
    const btnFiltrar = document.getElementById('btn-filtrar-encomendas');
    
    
    carregarEncomendas();
    
    
    formEncomenda.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (validarFormularioEncomenda()) {
            const encomenda = {
                peso: parseFloat(document.getElementById('peso').value),
                tipo: document.getElementById('tipo').value,
                descricao: document.getElementById('descricao').value.trim(),
                enderecoEntrega: document.getElementById('endereco-entrega').value.trim()
            };
            
            try {
                await cadastrarEncomenda(encomenda);
                alert('Encomenda cadastrada com sucesso!');
                formEncomenda.reset();
                carregarEncomendas();
            } catch (erro) {
                alert('Erro ao cadastrar encomenda: ' + erro.message);
            }
        }
    });
    
    
    btnFiltrar.addEventListener('click', () => {
        carregarEncomendas();
    });
    
    // Função para validar o formulário
    function validarFormularioEncomenda() {
        let valido = true;
        const peso = parseFloat(document.getElementById('peso').value);
        const tipo = document.getElementById('tipo').value;
        const enderecoEntrega = document.getElementById('endereco-entrega').value.trim();
        
        // Validar peso
        if (isNaN(peso) || peso <= 0) {
            document.getElementById('peso-error').textContent = 'Peso deve ser maior que 0';
            valido = false;
        } else {
            document.getElementById('peso-error').textContent = '';
        }
        
        // Validar tipo
        if (!tipo) {
            document.getElementById('tipo-error').textContent = 'Selecione um tipo';
            valido = false;
        } else {
            document.getElementById('tipo-error').textContent = '';
        }
        
        // Validar endereço de entrega
        if (enderecoEntrega.length < 5) {
            document.getElementById('endereco-entrega-error').textContent = 'Endereço deve ter pelo menos 5 caracteres';
            valido = false;
        } else {
            document.getElementById('endereco-entrega-error').textContent = '';
        }
        
        return valido;
    }
    
    // Função para carregar e exibir encomendas
    async function carregarEncomendas() {
        const filtroTipo = document.getElementById('filtro-tipo').value;
        const pesoMinimo = document.getElementById('peso-minimo').value;
        const pesoMaximo = document.getElementById('peso-maximo').value;
        
        const filtros = {};
        if (filtroTipo) filtros.tipo = filtroTipo;
        if (pesoMinimo) filtros.pesoMinimo = pesoMinimo;
        if (pesoMaximo) filtros.pesoMaximo = pesoMaximo;
        
        try {
            const encomendas = await listarEncomendas(filtros);
            exibirEncomendas(encomendas);
        } catch (erro) {
            console.error('Erro ao carregar encomendas:', erro);
            tabelaEncomendas.innerHTML = '<tr><td colspan="4">Erro ao carregar encomendas</td></tr>';
        }
    }
    
    // Função para exibir encomendas na tabela
    function exibirEncomendas(encomendas) {
        if (encomendas.length === 0) {
            tabelaEncomendas.innerHTML = '<tr><td colspan="4">Nenhuma encomenda encontrada</td></tr>';
            return;
        }
        
        tabelaEncomendas.innerHTML = encomendas.map(encomenda => `
            <tr>
                <td>${encomenda.peso.toFixed(2)} kg</td>
                <td>${formatarTipo(encomenda.tipo)}</td>
                <td>${encomenda.descricao || '-'}</td>
                <td>${encomenda.enderecoEntrega}</td>
            </tr>
        `).join('');
    }
    
    // Função para formatar o tipo
    function formatarTipo(tipo) {
        const tipos = {
            documento: 'Documento',
            caixa: 'Caixa',
            palete: 'Palete'
        };
        return tipos[tipo] || tipo;
    }
});