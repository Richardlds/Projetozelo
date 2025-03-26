// script.js
document.addEventListener('DOMContentLoaded', function () {
    const formAtendimento = document.getElementById('formAtendimento');
    const tabelaEmAndamento = document.querySelector('#emAndamento tbody');
    const tabelaZeloInforma = document.querySelector('#zeloInforma tbody');
    const tabelaFinalizado = document.querySelector('#finalizado tbody');
    const tabelaCancelado = document.querySelector('#cancelado tbody');

    // Inicializa o array de atendimentos
    let atendimentos = JSON.parse(localStorage.getItem('atendimentos')) || [];

    // Função para gerar um atendimento aleatório de exemplo
    document.getElementById('gerarAtendimentoExemplo').addEventListener('click', function() {
        // Dados fictícios para geração
        const nomesTitulares = ['João Silva', 'Maria Oliveira', 'Carlos Souza', 'Ana Pereira', 'Pedro Costa'];
        const nomesFalecidos = ['José Santos', 'Antônio Ferreira', 'Francisco Almeida', 'Paulo Rodrigues', 'Lucas Lima'];
        const cidadesEstados = ['São Paulo/SP', 'Rio de Janeiro/RJ', 'Belo Horizonte/MG', 'Porto Alegre/RS', 'Curitiba/PR'];
        const prestadores = ['Funerária Paz Eterna', 'Memorial Serviços', 'Lar Celestial', 'Ultima Homenagem', 'Descanso Eterno'];
        const modalidades = ['MAWDY', 'PET', 'B2C', 'B2B'];
        const statusOptions = ['emAndamento', 'zeloInforma', 'finalizado', 'cancelado'];
        
        // Gera dados aleatórios
        const numeroVegas = Math.floor(Math.random() * 9000) + 1000;
        const cpfTitular = `${Math.floor(Math.random() * 900) + 100}.${Math.floor(Math.random() * 900) + 100}.${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}`;
        const nomeTitular = nomesTitulares[Math.floor(Math.random() * nomesTitulares.length)];
        const nomeFalecido = nomesFalecidos[Math.floor(Math.random() * nomesFalecidos.length)];
        const cidadeEstado = cidadesEstados[Math.floor(Math.random() * cidadesEstados.length)];
        const prestador = prestadores[Math.floor(Math.random() * prestadores.length)];
        const modalidade = modalidades[Math.floor(Math.random() * modalidades.length)];
        const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
        
        // Cria o objeto do atendimento
        const atendimento = {
            numeroVegas: numeroVegas.toString(),
            cpfTitular,
            nomeTitular,
            nomeFalecido,
            cidadeEstado,
            prestador,
            modalidade,
            status,
            observacoes: [
                'Primeiro contato realizado com sucesso',
                'Documentação pendente de envio',
                'Aguardando retorno do cliente'
            ],
            checklist: {
                rgTitular: Math.random() > 0.5,
                rgFalecido: Math.random() > 0.5,
                declaracaoObito: Math.random() > 0.5,
                notaFiscal: Math.random() > 0.5,
                orcamento: Math.random() > 0.5,
                autorizacao: Math.random() > 0.5,
                pesquisaAssinada: Math.random() > 0.5,
                comprovanteEndereco: Math.random() > 0.5
            }
        };
        
        // Adiciona e salva o atendimento
        atendimentos.push(atendimento);
        localStorage.setItem('atendimentos', JSON.stringify(atendimentos));
        atualizarTabela(atendimento);
        
        alert(`Atendimento de exemplo #${numeroVegas} criado com sucesso!`);
    });

    // Função para adicionar atendimento
    formAtendimento.addEventListener('submit', function (e) {
        e.preventDefault();

        // Captura os dados do formulário
        const numeroVegas = document.getElementById('numeroVegas').value.trim();
        const cpfTitular = document.getElementById('cpfTitular').value.trim();
        const nomeTitular = document.getElementById('nomeTitular').value.trim();
        const nomeFalecido = document.getElementById('nomeFalecido').value.trim();
        const cidadeEstado = document.getElementById('cidadeEstado').value.trim();
        const prestador = document.getElementById('prestador').value.trim();
        const modalidade = document.getElementById('modalidade').value;
        const status = document.getElementById('status').value;

        // Validação dos campos
        if (!numeroVegas || !cpfTitular || !nomeTitular || !nomeFalecido || !cidadeEstado || !prestador || !status || !modalidade) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Cria e salva o atendimento
        const atendimento = {
            numeroVegas,
            cpfTitular,
            nomeTitular,
            nomeFalecido,
            cidadeEstado,
            prestador,
            modalidade,
            status,
            observacoes: [],
        };

        atendimentos.push(atendimento);
        localStorage.setItem('atendimentos', JSON.stringify(atendimentos));
        atualizarTabela(atendimento);
        mostrarPopupConfirmacaoSalvar();
        fecharModal();
        formAtendimento.reset();
    });

    // Função para mostrar o pop-up de confirmação de salvamento
    function mostrarPopupConfirmacaoSalvar() {
        const modalConfirmacaoSalvar = document.getElementById('modalConfirmacaoSalvar');
        modalConfirmacaoSalvar.style.display = 'flex';

        setTimeout(() => {
            modalConfirmacaoSalvar.style.display = 'none';
            window.location.href = 'index.html';
        }, 2000);
    }

    // Fechar modal de confirmação de salvamento
    document.getElementById('fecharConfirmacaoSalvar').addEventListener('click', function () {
        document.getElementById('modalConfirmacaoSalvar').style.display = 'none';
        window.location.href = 'index.html';
    });

    // Função para atualizar a tabela
    function atualizarTabela(atendimento) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${atendimento.numeroVegas}</td>
            <td>${atendimento.cpfTitular}</td>
            <td>${atendimento.nomeTitular}</td>
            <td>${atendimento.nomeFalecido}</td>
            <td>${atendimento.cidadeEstado}</td>
            <td>${atendimento.prestador}</td>
            <td>${atendimento.modalidade}</td>
        `;

        row.addEventListener('click', () => abrirDetalhes(atendimento.numeroVegas));

        if (atendimento.status === 'emAndamento') {
            tabelaEmAndamento.appendChild(row);
        } else if (atendimento.status === 'zeloInforma') {
            tabelaZeloInforma.appendChild(row);
        } else if (atendimento.status === 'finalizado') {
            tabelaFinalizado.appendChild(row);
        } else if (atendimento.status === 'cancelado') {
            tabelaCancelado.appendChild(row);
        }
    }

    // Função para abrir a modal de adicionar atendimento
    document.getElementById('abrirModal').addEventListener('click', function () {
        document.getElementById('modal').style.display = 'flex';
    });

    // Função para fechar a modal
    function fecharModal() {
        document.getElementById('modal').style.display = 'none';
    }

    // Fechar modal ao clicar no "X"
    document.querySelector('.fecharModal').addEventListener('click', fecharModal);

    // Função para abrir os detalhes do atendimento
    function abrirDetalhes(numeroVegas) {
        window.location.href = `detalhes.html?numeroVegas=${numeroVegas}`;
    }

    // Adicionar eventos aos botões das abas
    document.querySelectorAll('.abaLink').forEach(botao => {
        botao.addEventListener('click', function () {
            const aba = this.getAttribute('data-aba');

            document.querySelectorAll('.abaLink').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            document.querySelectorAll('.abaConteudo').forEach(tabela => {
                tabela.classList.remove('active');
            });

            document.getElementById(aba).classList.add('active');
        });
    });

    // Adicionar evento de input no campo de pesquisa
    document.getElementById('campoPesquisa').addEventListener('input', function () {
        const termo = this.value.trim().toLowerCase();
        filtrarAtendimentos(termo);
    });

    // Função para filtrar atendimentos
    function filtrarAtendimentos(termo) {
        const linhasEmAndamento = document.querySelectorAll('#emAndamento tbody tr');
        const linhasZeloInforma = document.querySelectorAll('#zeloInforma tbody tr');
        const linhasFinalizado = document.querySelectorAll('#finalizado tbody tr');
        const linhasCancelado = document.querySelectorAll('#cancelado tbody tr');

        filtrarTabela(linhasEmAndamento, termo);
        filtrarTabela(linhasZeloInforma, termo);
        filtrarTabela(linhasFinalizado, termo);
        filtrarTabela(linhasCancelado, termo);
    }

    // Função para filtrar uma tabela específica
    function filtrarTabela(linhas, termo) {
        linhas.forEach(linha => {
            const textoLinha = linha.textContent.toLowerCase();
            linha.style.display = textoLinha.includes(termo) ? '' : 'none';
        });
    }

    // Adicionar evento de mudança no campo de filtro por modalidade
    document.getElementById('filtroModalidade').addEventListener('change', function () {
        const modalidade = this.value;
        filtrarPorModalidade(modalidade);
    });

    // Função para filtrar atendimentos por modalidade
    function filtrarPorModalidade(modalidade) {
        const todasLinhas = document.querySelectorAll('tbody tr');
        todasLinhas.forEach(linha => {
            const textoModalidade = linha.querySelector('td:nth-child(7)').textContent;
            linha.style.display = (modalidade === 'todas' || textoModalidade === modalidade) ? '' : 'none';
        });
    }

    // Carregar atendimentos ao abrir a página
    function carregarAtendimentos() {
        atendimentos.forEach(atendimento => {
            atualizarTabela(atendimento);
        });
    }

    // Carrega os atendimentos ao abrir a página
    carregarAtendimentos();
});
