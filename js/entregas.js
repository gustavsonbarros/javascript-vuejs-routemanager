import {
    obterEntregas,
    cadastrarEntrega,
    atualizarEntrega,
    obterClientes,
    obterEncomendas,
    obterRotas
} from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('form-entrega');
    const tabela = document.getElementById('corpo-tabela-entregas');
    const selectCliente = document.getElementById('cliente');
    const selectEncomenda = document.getElementById('encomenda');
    const selectRota = document.getElementById('rota');
    const filtroStatus = document.getElementById('filtro-status');
    const btnFiltrar = document.getElementById('btn-filtrar-entregas');

    let editandoId = null;

    // Carregar selects
    async function carregarSelects() {
        const [clientes, encomendas, rotas] = await Promise.all([
            obterClientes(),
            obterEncomendas(),
            obterRotas()
        ]);

        selectCliente.innerHTML = clientes.map(c => 
            `<option value="${c.id}">${c.nome}</option>`
        ).join('');

        selectEncomenda.innerHTML = encomendas.map(e => 
            `<option value="${e.id}">${e.descricao || 'Sem descrição'} (${e.peso}kg)</option>`
        ).join('');

        selectRota.innerHTML = rotas.map(r => 
            `<option value="${r.id}">${r.origem} → ${r.destino}</option>`
        ).join('');
    }

    async function renderizarEntregas(filtros = {}) {
        try {
            let entregas = await obterEntregas();
            
            if (filtros.status) {
                entregas = entregas.filter(e => e.status === filtros.status);
            }

            tabela.innerHTML = '';

            if (entregas.length === 0) {
                tabela.innerHTML = '<tr class="sem-resultados"><td colspan="6">Nenhuma entrega encontrada</td></tr>';
                return;
            }

            // Aqui precisaríamos carregar os dados relacionados (cliente, encomenda, rota)
            // Para simplificar, vou mostrar apenas os IDs
            entregas.forEach(entrega => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${entrega.id}</td>
                    <td>Cliente ID: ${entrega.clienteId}</td>
                    <td>Encomenda ID: ${entrega.encomendaId}</td>
                    <td>
                        <select class="status-entrega" data-id="${entrega.id}">
                            <option value="em_preparo" ${entrega.status === 'em_preparo' ? 'selected' : ''}>Em preparo</option>
                            <option value="a_caminho" ${entrega.status === 'a_caminho' ? 'selected' : ''}>A caminho</option>
                            <option value="entregue" ${entrega.status === 'entregue' ? 'selected' : ''}>Entregue</option>
                        </select>
                    </td>
                    <td>${entrega.dataEstimada || '--'}</td>
                    <td>
                        <button class="btn-deletar" data-id="${entrega.id}">Excluir</button>
                    </td>
                `;
                tabela.appendChild(tr);
            });

            document.querySelectorAll('.btn-deletar').forEach(btn => {
                btn.addEventListener('click', async () => {
                    if (confirm('Tem certeza que deseja excluir esta entrega?')) {
                        await deletarEntrega(btn.dataset.id);
                        await renderizarEntregas();
                    }
                });
            });

            document.querySelectorAll('.status-entrega').forEach(select => {
                select.addEventListener('change', async (e) => {
                    await atualizarEntrega(e.target.dataset.id, { status: e.target.value });
                });
            });

        } catch (error) {
            console.error('Erro ao renderizar entregas:', error);
            tabela.innerHTML = '<tr class="sem-resultados"><td colspan="6">Erro ao carregar entregas</td></tr>';
        }
    }

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const entrega = {
            clienteId: parseInt(selectCliente.value),
            encomendaId: parseInt(selectEncomenda.value),
            rotaId: parseInt(selectRota.value),
            dataEstimada: document.getElementById('data').value,
            status: 'em_preparo'
        };

        try {
            if (editandoId) {
                await atualizarEntrega(editandoId, entrega);
                editandoId = null;
            } else {
                await cadastrarEntrega(entrega);
            }

            form.reset();
            await renderizarEntregas();
        } catch (error) {
            console.error('Erro ao salvar entrega:', error);
            alert('Ocorreu um erro ao salvar a entrega');
        }
    });

    btnFiltrar?.addEventListener('click', () => {
        renderizarEntregas({
            status: filtroStatus?.value || ''
        });
    });

    // Inicializar
    await carregarSelects();
    await renderizarEntregas();
});