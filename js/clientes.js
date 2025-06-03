import { cadastrarCliente, listarClientes } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const formCliente = document.getElementById('form-cliente');
    const tabelaClientes = document.getElementById('corpo-tabela-clientes');
    const btnFiltrar = document.getElementById('btn-filtrar');
    
    // Carregar clientes ao abrir a página
    carregarClientes();
    
    // Evento de submit do formulário
    formCliente.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (validarFormularioCliente()) {
            const cliente = {
                nome: document.getElementById('nome').value.trim(),
                cpfCnpj: document.getElementById('cpf-cnpj').value.trim(),
                email: document.getElementById('email').value.trim(),
                endereco: document.getElementById('endereco').value.trim()
            };
            
            try {
                await cadastrarCliente(cliente);
                alert('Cliente cadastrado com sucesso!');
                formCliente.reset();
                carregarClientes();
            } catch (erro) {
                alert('Erro ao cadastrar cliente: ' + erro.message);
            }
        }
    });
    
    // Evento do botão de filtrar
    btnFiltrar.addEventListener('click', () => {
        carregarClientes();
    });
    
    // Função para validar o formulário
    function validarFormularioCliente() {
        let valido = true;
        const nome = document.getElementById('nome').value.trim();
        const cpfCnpj = document.getElementById('cpf-cnpj').value.trim();
        const email = document.getElementById('email').value.trim();
        const endereco = document.getElementById('endereco').value.trim();
        
        // Validar nome
        if (nome.length < 3) {
            document.getElementById('nome-error').textContent = 'Nome deve ter pelo menos 3 caracteres';
            valido = false;
        } else {
            document.getElementById('nome-error').textContent = '';
        }
        
        // Validar CPF/CNPJ
        const cpfCnpjNumeros = cpfCnpj.replace(/\D/g, '');
        if (cpfCnpjNumeros.length !== 11 && cpfCnpjNumeros.length !== 14) {
            document.getElementById('cpf-cnpj-error').textContent = 'CPF deve ter 11 dígitos ou CNPJ 14 dígitos';
            valido = false;
        } else {
            document.getElementById('cpf-cnpj-error').textContent = '';
        }
        
        // Validar e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('email-error').textContent = 'E-mail inválido';
            valido = false;
        } else {
            document.getElementById('email-error').textContent = '';
        }
        
        // Validar endereço
        if (endereco.length < 5) {
            document.getElementById('endereco-error').textContent = 'Endereço deve ter pelo menos 5 caracteres';
            valido = false;
        } else {
            document.getElementById('endereco-error').textContent = '';
        }
        
        return valido;
    }
    
    // Função para carregar e exibir clientes
    async function carregarClientes() {
        const filtroNome = document.getElementById('filtro-nome').value.trim();
        const filtroCpfCnpj = document.getElementById('filtro-cpf-cnpj').value.trim();
        
        const filtros = {};
        if (filtroNome) filtros.nome = filtroNome;
        if (filtroCpfCnpj) filtros.cpfCnpj = filtroCpfCnpj;
        
        try {
            const clientes = await listarClientes(filtros);
            exibirClientes(clientes);
        } catch (erro) {
            console.error('Erro ao carregar clientes:', erro);
            tabelaClientes.innerHTML = '<tr><td colspan="4">Erro ao carregar clientes</td></tr>';
        }
    }
    
    // Função para exibir clientes na tabela
    function exibirClientes(clientes) {
        if (clientes.length === 0) {
            tabelaClientes.innerHTML = '<tr><td colspan="4">Nenhum cliente encontrado</td></tr>';
            return;
        }
        
        tabelaClientes.innerHTML = clientes.map(cliente => `
            <tr>
                <td>${cliente.nome}</td>
                <td>${formatarCpfCnpj(cliente.cpfCnpj)}</td>
                <td>${cliente.email}</td>
                <td>${cliente.endereco}</td>
            </tr>
        `).join('');
    }
    
    // Função para formatar CPF/CNPJ
    function formatarCpfCnpj(cpfCnpj) {
        const numeros = cpfCnpj.replace(/\D/g, '');
        
        if (numeros.length === 11) {
            return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (numeros.length === 14) {
            return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
        
        return cpfCnpj;
    }
});