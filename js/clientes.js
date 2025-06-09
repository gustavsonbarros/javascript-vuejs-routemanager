
import {
    obterClientes,
    cadastrarCliente,
    atualizarCliente,
    deletarCliente
} from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('form-cliente');
    const tabela = document.getElementById('corpo-tabela-clientes');
    
    
    const filtroNome = document.getElementById('filtro-nome');
    const filtroCpfCnpj = document.getElementById('filtro-cpf-cnpj');
    const btnFiltrar = document.getElementById('btn-filtrar');
    const btnLimparFiltros = document.getElementById('btn-limpar-filtros');
    const totalClientesElement = document.getElementById('total-clientes'); 

    let editandoId = null;

    async function renderizarClientes(filtros = {}) {
        try {
            let clientes = await obterClientes();
            
            
            if (filtros.nome) {
                clientes = clientes.filter(cliente => 
                    cliente.nome.toLowerCase().includes(filtros.nome.toLowerCase())
                );
            }
            
            if (filtros.cpfCnpj) {
                clientes = clientes.filter(cliente => 
                    cliente.cpfCnpj.includes(filtros.cpfCnpj)
                );
            }

            tabela.innerHTML = '';

            
            if (totalClientesElement) {
                totalClientesElement.textContent = clientes.length;
            }

            if (clientes.length === 0) {
                tabela.innerHTML = '<tr class="sem-resultados"><td colspan="5">Nenhum cliente encontrado</td></tr>';
                return;
            }

            clientes.forEach(cliente => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${cliente.nome}</td>
                    <td>${cliente.cpfCnpj}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.endereco}</td>
                    <td>
                        <button class="btn-editar" data-id="${cliente.id}">Editar</button>
                        <button class="btn-deletar" data-id="${cliente.id}">Excluir</button>
                    </td>
                `;
                tabela.appendChild(tr);
            });

            
            document.querySelectorAll('.btn-deletar').forEach(btn => {
                btn.addEventListener('click', async () => {
                    if (confirm('Tem certeza que deseja excluir este cliente?')) {
                        await deletarCliente(btn.dataset.id);
                        await renderizarClientes();
                    }
                });
            });

            document.querySelectorAll('.btn-editar').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const clientes = await obterClientes();
                    const cliente = clientes.find(c => c.id == btn.dataset.id);
                    if (cliente) {
                        document.getElementById('nome').value = cliente.nome;
                        document.getElementById('cpf-cnpj').value = cliente.cpfCnpj;
                        document.getElementById('email').value = cliente.email;
                        document.getElementById('endereco').value = cliente.endereco;
                        editandoId = cliente.id;
                        
                        document.getElementById('cadastro-cliente')?.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                });
            });

        } catch (error) {
            console.error('Erro ao renderizar clientes:', error);
            tabela.innerHTML = '<tr class="sem-resultados"><td colspan="5">Erro ao carregar clientes</td></tr>';
        }
    }

    
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const cliente = {
            nome: document.getElementById('nome').value,
            cpfCnpj: document.getElementById('cpf-cnpj').value,
            email: document.getElementById('email').value,
            endereco: document.getElementById('endereco').value
        };

        try {
            if (editandoId) {
                await atualizarCliente(editandoId, cliente);
                editandoId = null;
            } else {
                await cadastrarCliente(cliente);
            }

            form.reset();
            await renderizarClientes();
        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
            alert('Ocorreu um erro ao salvar o cliente');
        }
    });

    btnFiltrar?.addEventListener('click', () => {
        renderizarClientes({
            nome: filtroNome?.value.trim() || '',
            cpfCnpj: filtroCpfCnpj?.value.trim() || ''
        });
    });

    btnLimparFiltros?.addEventListener('click', () => {
        if (filtroNome) filtroNome.value = '';
        if (filtroCpfCnpj) filtroCpfCnpj.value = '';
        renderizarClientes();
    });

    
    renderizarClientes();
});