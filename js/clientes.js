import { cadastrarCliente, listarClientes } from './api.js';

// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    let resto;
    
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
}

// Função para validar CNPJ
function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) return false;
    
    tamanho += 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(1))) return false;
    
    return true;
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

document.addEventListener('DOMContentLoaded', () => {
    const formCliente = document.getElementById('form-cliente');
    const tabelaClientes = document.getElementById('corpo-tabela-clientes');
    const btnFiltrar = document.getElementById('btn-filtrar');
    const cpfCnpjInput = document.getElementById('cpf-cnpj');

    // Carregar clientes ao abrir a página
    carregarClientes();
    
    // Formatação automática do CPF/CNPJ enquanto digita
    cpfCnpjInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        } else {
            value = value.replace(/^(\d{2})(\d)/, '$1.$2');
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
        }
        
        e.target.value = value;
        document.getElementById('cpf-cnpj-error').textContent = '';
    });
    
    // Evento de submit do formulário
    formCliente.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (validarFormularioCliente()) {
            const confirmacao = confirm('Tem certeza que deseja cadastrar este cliente?');
            if (!confirmacao) return;
            
            const cliente = {
                nome: document.getElementById('nome').value.trim(),
                cpfCnpj: cpfCnpjInput.value.replace(/\D/g, ''),
                email: document.getElementById('email').value.trim(),
                endereco: document.getElementById('endereco').value.trim()
            };
            
            try {
                await cadastrarCliente(cliente);
                mostrarMensagem('Cliente cadastrado com sucesso!', 'sucesso');
                formCliente.reset();
                carregarClientes();
            } catch (erro) {
                mostrarMensagem('Erro ao cadastrar cliente: ' + erro.message, 'erro');
            }
        }
    });
    
    // Evento do botão de filtrar
    btnFiltrar.addEventListener('click', () => {
        carregarClientes();
    });
    
    // Função para mostrar mensagens
    function mostrarMensagem(texto, tipo) {
        const mensagem = document.createElement('div');
        mensagem.className = `mensagem ${tipo}`;
        mensagem.textContent = texto;
        document.body.appendChild(mensagem);
        
        setTimeout(() => {
            mensagem.classList.add('fade-out');
            setTimeout(() => mensagem.remove(), 300);
        }, 3000);
    }
    
    // Função para validar o formulário
    function validarFormularioCliente() {
        let valido = true;
        const nome = document.getElementById('nome').value.trim();
        const cpfCnpj = cpfCnpjInput.value.replace(/\D/g, '');
        const email = document.getElementById('email').value.trim();
        const endereco = document.getElementById('endereco').value.trim();
        
        // Validações
        if (nome.length < 3) {
            document.getElementById('nome-error').textContent = 'Nome deve ter pelo menos 3 caracteres';
            valido = false;
        } else {
            document.getElementById('nome-error').textContent = '';
        }
        
        if (cpfCnpj.length === 11) {
            if (!validarCPF(cpfCnpj)) {
                document.getElementById('cpf-cnpj-error').textContent = 'CPF inválido';
                valido = false;
            } else {
                document.getElementById('cpf-cnpj-error').textContent = '';
            }
        } else if (cpfCnpj.length === 14) {
            if (!validarCNPJ(cpfCnpj)) {
                document.getElementById('cpf-cnpj-error').textContent = 'CNPJ inválido';
                valido = false;
            } else {
                document.getElementById('cpf-cnpj-error').textContent = '';
            }
        } else {
            document.getElementById('cpf-cnpj-error').textContent = 'CPF deve ter 11 dígitos ou CNPJ 14 dígitos';
            valido = false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('email-error').textContent = 'E-mail inválido';
            valido = false;
        } else {
            document.getElementById('email-error').textContent = '';
        }
        
        if (endereco.length < 5) {
            document.getElementById('endereco-error').textContent = 'Endereço deve ter pelo menos 5 caracteres';
            valido = false;
        } else {
            document.getElementById('endereco-error').textContent = '';
        }
        
        return valido;
    }
    
    // Função para carregar clientes
    async function carregarClientes() {
        const loading = document.createElement('div');
        loading.className = 'loading-spinner';
        tabelaClientes.innerHTML = '';
        tabelaClientes.appendChild(loading);
        
        const filtroNome = document.getElementById('filtro-nome').value.trim();
        const filtroCpfCnpj = document.getElementById('filtro-cpf-cnpj').value.trim();
        
        const filtros = {};
        if (filtroNome) filtros.nome = filtroNome;
        if (filtroCpfCnpj) filtros.cpfCnpj = filtroCpfCnpj.replace(/\D/g, '');
        
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
});