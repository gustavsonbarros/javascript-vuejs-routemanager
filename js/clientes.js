// js/clientes.js
import {
    obterClientes,
    cadastrarCliente,
    atualizarCliente,
    deletarCliente
} from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-cliente');
    const tabela = document.getElementById('corpo-tabela-clientes');

    let editandoId = null;

    async function renderizarClientes() {
        const clientes = await obterClientes();
        tabela.innerHTML = '';

        if (clientes.length === 0) {
            tabela.innerHTML = '<tr class="sem-resultados"><td colspan="5">Nenhum cliente cadastrado</td></tr>';
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
                await deletarCliente(btn.dataset.id);
                renderizarClientes();
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
                }
            });
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const cliente = {
            nome: document.getElementById('nome').value,
            cpfCnpj: document.getElementById('cpf-cnpj').value,
            email: document.getElementById('email').value,
            endereco: document.getElementById('endereco').value
        };

        if (editandoId) {
            await atualizarCliente(editandoId, cliente);
            editandoId = null;
        } else {
            await cadastrarCliente(cliente);
        }

        form.reset();
        renderizarClientes();
    });

    renderizarClientes();
});
