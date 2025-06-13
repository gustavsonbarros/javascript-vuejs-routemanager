document.getElementById('btn-rastrear').addEventListener('click', async () => {
    const codigo = document.getElementById('codigo-rastreio').value.trim();
    const resultadoDiv = document.getElementById('resultado-rastreio');

    if (!codigo) {
        resultadoDiv.innerHTML = '<p class="erro">Por favor, informe um código de rastreio</p>';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/entregas/${codigo}`);
        if (!response.ok) {
            throw new Error('Entrega não encontrada');
        }
        
        const entrega = await response.json();
        
        // Formatar a saída
        let html = `
            <h3>Status da Entrega #${entrega.id}</h3>
            <p><strong>Status:</strong> ${formatarStatus(entrega.status)}</p>
            <p><strong>Última atualização:</strong> ${new Date().toLocaleString()}</p>
        `;
        
        resultadoDiv.innerHTML = html;
    } catch (error) {
        resultadoDiv.innerHTML = `<p class="erro">${error.message}</p>`;
    }
});

function formatarStatus(status) {
    const statusMap = {
        'em_preparo': 'Em preparo',
        'a_caminho': 'A caminho',
        'entregue': 'Entregue'
    };
    return statusMap[status] || status;
}