document.addEventListener('DOMContentLoaded', function () {
    // Elementos do formulário e da página
    const formEditar = document.getElementById('editarAtendimento');
    const listaObservacoes = document.getElementById('listaObservacoes');
    const campoObservacoes = document.getElementById('observacoes');
    const btnAdicionarObservacao = document.getElementById('adicionarObservacao');

    // Obtém o número Vegas da URL
    const urlParams = new URLSearchParams(window.location.search);
    const numeroVegas = urlParams.get('numeroVegas');

    // Carrega atendimentos do localStorage ou inicializa array vazio
    let atendimentos = JSON.parse(localStorage.getItem('atendimentos')) || [];
    
    // Encontra o atendimento específico pelo número Vegas
    const atendimento = atendimentos.find(at => at.numeroVegas === numeroVegas);

    // Redireciona se o atendimento não for encontrado
    if (!atendimento) {
        alert('Atendimento não encontrado!');
        window.location.href = 'index.html';
        return;
    }

    // Inicializa checklist se não existir
    if (!atendimento.checklist) {
        atendimento.checklist = {
            rgTitular: false,
            rgFalecido: false,
            declaracaoObito: false,
            notaFiscal: false,
            orcamento: false,
            autorizacao: false,
            pesquisaAssinada: false,
            comprovanteEndereco: false
        };
    }

    // Define grupo padrão se não existir
    if (!atendimento.grupo) {
        atendimento.grupo = 'G1';
    }

    // Carrega dados do atendimento nos campos do formulário
    function carregarDados() {
        document.getElementById('numeroVegas').value = atendimento.numeroVegas;
        document.getElementById('cpfTitular').value = atendimento.cpfTitular;
        document.getElementById('nomeTitular').value = atendimento.nomeTitular;
        document.getElementById('nomeFalecido').value = atendimento.nomeFalecido;
        document.getElementById('cidadeEstado').value = atendimento.cidadeEstado;
        document.getElementById('prestador').value = atendimento.prestador;
        document.getElementById('atendente').value = atendimento.atendente || '';
        document.getElementById('modalidade').value = atendimento.modalidade || 'MAWDY';
        document.getElementById('grupo').value = atendimento.grupo || 'G1';
        document.getElementById('status').value = atendimento.status;

        atualizarListaObservacoes();

        // Preenche checkboxes do checklist
        document.getElementById('checklistRGTitular').checked = atendimento.checklist.rgTitular;
        document.getElementById('checklistRGFalecido').checked = atendimento.checklist.rgFalecido;
        document.getElementById('checklistDeclaracaoObito').checked = atendimento.checklist.declaracaoObito;
        document.getElementById('checklistNotaFiscal').checked = atendimento.checklist.notaFiscal;
        document.getElementById('checklistOrcamento').checked = atendimento.checklist.orcamento;
        document.getElementById('checklistAutorizacao').checked = atendimento.checklist.autorizacao;
        document.getElementById('checklistPesquisaAssinada').checked = atendimento.checklist.pesquisaAssinada;
        document.getElementById('checklistComprovanteEndereco').checked = atendimento.checklist.comprovanteEndereco;
    }

    // Atualiza a lista de observações na interface
    function atualizarListaObservacoes() {
        listaObservacoes.innerHTML = '';

        if (atendimento.observacoes) {
            atendimento.observacoes.forEach(obs => {
                const li = document.createElement('li');
                li.innerHTML = obs.replace(/\n/g, '<br>');
                listaObservacoes.appendChild(li);
            });
        }
    }

    // Adiciona nova observação ao atendimento
    btnAdicionarObservacao.addEventListener('click', function () {
        const observacao = campoObservacoes.value.trim();

        if (observacao) {
            if (!atendimento.observacoes) {
                atendimento.observacoes = [];
            }

            const dataHora = new Date().toLocaleString();
            const atendenteAtual = document.getElementById('atendente').value || 'Sem atendente';
            const observacaoCompleta = `[${atendenteAtual}] - ${dataHora} - ${observacao}`;
            
            atendimento.observacoes.push(observacaoCompleta);

            atualizarListaObservacoes();
            campoObservacoes.value = '';
            localStorage.setItem('atendimentos', JSON.stringify(atendimentos));
        }
    });

    // Salva alterações no atendimento
    formEditar.addEventListener('submit', function (e) {
        e.preventDefault();

        // Atualiza dados do atendimento
        atendimento.cpfTitular = document.getElementById('cpfTitular').value;
        atendimento.nomeTitular = document.getElementById('nomeTitular').value;
        atendimento.nomeFalecido = document.getElementById('nomeFalecido').value;
        atendimento.cidadeEstado = document.getElementById('cidadeEstado').value;
        atendimento.prestador = document.getElementById('prestador').value;
        atendimento.atendente = document.getElementById('atendente').value;
        atendimento.modalidade = document.getElementById('modalidade').value;
        atendimento.grupo = document.getElementById('grupo').value;
        atendimento.status = document.getElementById('status').value;

        // Atualiza checklist
        atendimento.checklist.rgTitular = document.getElementById('checklistRGTitular').checked;
        atendimento.checklist.rgFalecido = document.getElementById('checklistRGFalecido').checked;
        atendimento.checklist.declaracaoObito = document.getElementById('checklistDeclaracaoObito').checked;
        atendimento.checklist.notaFiscal = document.getElementById('checklistNotaFiscal').checked;
        atendimento.checklist.orcamento = document.getElementById('checklistOrcamento').checked;
        atendimento.checklist.autorizacao = document.getElementById('checklistAutorizacao').checked;
        atendimento.checklist.pesquisaAssinada = document.getElementById('checklistPesquisaAssinada').checked;
        atendimento.checklist.comprovanteEndereco = document.getElementById('checklistComprovanteEndereco').checked;

        localStorage.setItem('atendimentos', JSON.stringify(atendimentos));
        alert('Atendimento atualizado com sucesso!');
        window.location.href = 'index.html';
    });

    // Fecha a página de detalhes
    function fecharDetalhes() {
        window.location.href = 'index.html';
    }

    document.querySelector('.fecharDetalhes').addEventListener('click', fecharDetalhes);

    // Abre modal de confirmação para deletar atendimento
    document.getElementById('deletarAtendimento').addEventListener('click', function () {
        const modalConfirmacao = document.getElementById('modalConfirmacao');
        modalConfirmacao.style.display = 'flex';
    });

    // Confirma deleção do atendimento
    document.getElementById('confirmarDelecao').addEventListener('click', function () {
        atendimentos = atendimentos.filter(at => at.numeroVegas !== numeroVegas);
        localStorage.setItem('atendimentos', JSON.stringify(atendimentos));
        document.getElementById('modalConfirmacao').style.display = 'none';
        window.location.href = 'index.html';
    });

    // Cancela deleção do atendimento
    document.getElementById('cancelarDelecao').addEventListener('click', function () {
        document.getElementById('modalConfirmacao').style.display = 'none';
    });

    // Inicializa a página carregando os dados
    carregarDados();
});