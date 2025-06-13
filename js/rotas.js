import {
    obterRotas,
    cadastrarRota,
    atualizarRota,
    deletarRota
} from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-rota');
    const tabela = document.getElementById('corpo-tabela-rotas');
    const filtroOrigem = document.getElementById('filtro-origem');
    const filtroDestino = document.getElementById('filtro-destino');
    const btnFiltrar = document.getElementById('btn-filtrar-rotas');
    const btnLimpar = document.getElementById('btn-limpar-filtros-rotas');

    let editandoId = null;

    async function renderizarRotas(filtros = {}) {
        try {
            let rotas = await obterRotas();
            
            if (filtros.origem) {
                rotas = rotas.filter(rota => 
                    rota.origem.toLowerCase().includes(filtros.origem.toLowerCase())
                );
            }
            
            if (filtros.destino) {
                rotas = rotas.filter(rota => 
                    rota.destino.toLowerCase().includes(filtros.destino.toLowerCase())
                );
            }

            tabela.innerHTML = '';

            if (rotas.length === 0) {
                tabela.innerHTML = '<tr class="sem-resultados"><td colspan="5">Nenhuma rota encontrada</td></tr>';
                return;
            }

            rotas.forEach(rota => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${rota.origem}</td>
                    <td>${rota.destino}</td>
                    <td>${rota.distancia} km</td>
                    <td>${rota.tempoEstimado} horas</td>
                    <td>
                        <button class="btn-editar" data-id="${rota.id}">Editar</button>
                        <button class="btn-deletar" data-id="${rota.id}">Excluir</button>
                    </td>
                `;
                tabela.appendChild(tr);
            });

            document.querySelectorAll('.btn-deletar').forEach(btn => {
                btn.addEventListener('click', async () => {
                    if (confirm('Tem certeza que deseja excluir esta rota?')) {
                        await deletarRota(btn.dataset.id);
                        await renderizarRotas();
                    }
                });
            });

            document.querySelectorAll('.btn-editar').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const rotas = await obterRotas();
                    const rota = rotas.find(r => r.id == btn.dataset.id);
                    if (rota) {
                        document.getElementById('origem').value = rota.origem;
                        document.getElementById('destino').value = rota.destino;
                        document.getElementById('distancia').value = rota.distancia;
                        document.getElementById('tempo').value = rota.tempoEstimado;
                        editandoId = rota.id;
                    }
                });
            });

        } catch (error) {
            console.error('Erro ao renderizar rotas:', error);
            tabela.innerHTML = '<tr class="sem-resultados"><td colspan="5">Erro ao carregar rotas</td></tr>';
        }
    }

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const rota = {
            origem: document.getElementById('origem').value,
            destino: document.getElementById('destino').value,
            distancia: parseFloat(document.getElementById('distancia').value),
            tempoEstimado: parseFloat(document.getElementById('tempo').value)
        };

        try {
            if (editandoId) {
                await atualizarRota(editandoId, rota);
                editandoId = null;
            } else {
                await cadastrarRota(rota);
            }

            form.reset();
            await renderizarRotas();
        } catch (error) {
            console.error('Erro ao salvar rota:', error);
            alert('Ocorreu um erro ao salvar a rota');
        }
    });

    btnFiltrar?.addEventListener('click', () => {
        renderizarRotas({
            origem: filtroOrigem?.value || '',
            destino: filtroDestino?.value || ''
        });
    });

    btnLimpar?.addEventListener('click', () => {
        filtroOrigem.value = '';
        filtroDestino.value = '';
        renderizarRotas();
    });

    renderizarRotas();
});