document.addEventListener('DOMContentLoaded', function () {
    // Elementos da página principal
    const formAtendimento = document.getElementById('formAtendimento');
    const tabelaEmAndamento = document.querySelector('#emAndamento tbody');
    const tabelaZeloInforma = document.querySelector('#zeloInforma tbody');
    const tabelaFinalizado = document.querySelector('#finalizado tbody');
    const tabelaCancelado = document.querySelector('#cancelado tbody');

    // Carrega atendimentos do localStorage ou inicializa array vazio
    let atendimentos = JSON.parse(localStorage.getItem('atendimentos')) || [];
    
    // Limpa todos os atendimentos após confirmação
    document.getElementById('limparAtendimentos').addEventListener('click', function() {
        if (confirm('ATENÇÃO: Isso apagará TODOS os atendimentos permanentemente. Deseja continuar?')) {
            localStorage.removeItem('atendimentos');
            atendimentos = [];
            
            tabelaEmAndamento.innerHTML = '';
            tabelaZeloInforma.innerHTML = '';
            tabelaFinalizado.innerHTML = '';
            tabelaCancelado.innerHTML = '';
            
            alert('Todos os atendimentos foram removidos com sucesso!');
        }
    });

    // Gera um atendimento de exemplo com dados aleatórios
    document.getElementById('gerarAtendimentoExemplo').addEventListener('click', function() {
        const nomesTitulares = ['João Silva', 'Maria Oliveira', 'Carlos Souza', 'Ana Pereira', 'Pedro Costa'];
        const nomesFalecidos = ['José Santos', 'Antônio Ferreira', 'Francisco Almeida', 'Paulo Rodrigues', 'Lucas Lima'];
        const cidadesEstados = ['São Paulo/SP', 'Rio de Janeiro/RJ', 'Belo Horizonte/MG', 'Porto Alegre/RS', 'Curitiba/PR'];
        const prestadores = ['Funerária Paz Eterna', 'Memorial Serviços', 'Lar Celestial', 'Ultima Homenagem', 'Descanso Eterno'];
        const modalidades = ['MAWDY', 'PET', 'B2C', 'B2B'];
        const statusOptions = ['emAndamento', 'zeloInforma', 'finalizado', 'cancelado'];
        const atendentes = ['Ana Carolina', 'Bruno Oliveira', 'Camila Santos', 'Daniel Costa', 'Elaine Pereira', 'Fernando Souza', 'Gabriela Lima', 'Hugo Almeida'];
        const grupos = ['G1', 'G2', 'G3'];
        
        // Gera dados aleatórios para o atendimento de exemplo
        const numeroVegas = Math.floor(Math.random() * 9000) + 1000;
        const cpfTitular = `${Math.floor(Math.random() * 900) + 100}.${Math.floor(Math.random() * 900) + 100}.${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}`;
        const nomeTitular = nomesTitulares[Math.floor(Math.random() * nomesTitulares.length)];
        const nomeFalecido = nomesFalecidos[Math.floor(Math.random() * nomesFalecidos.length)];
        const cidadeEstado = cidadesEstados[Math.floor(Math.random() * cidadesEstados.length)];
        const prestador = prestadores[Math.floor(Math.random() * prestadores.length)];
        const modalidade = modalidades[Math.floor(Math.random() * modalidades.length)];
        const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
        const atendente = atendentes[Math.floor(Math.random() * atendentes.length)];
        const grupo = grupos[Math.floor(Math.random() * grupos.length)];
        
        // Cria objeto do atendimento de exemplo
        const atendimento = {
            numeroVegas: numeroVegas.toString(),
            cpfTitular,
            nomeTitular,
            nomeFalecido,
            cidadeEstado,
            prestador,
            modalidade,
            status,
            atendente,
            grupo,
            observacoes: [
                `${atendente} - ${new Date().toLocaleString()} - Primeiro contato realizado com sucesso`,
                `${atendente} - ${new Date().toLocaleString()} - Documentação pendente de envio`,
                `${atendente} - ${new Date().toLocaleString()} - Aguardando retorno do cliente`
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
        
        atendimentos.push(atendimento);
        localStorage.setItem('atendimentos', JSON.stringify(atendimentos));
        atualizarTabela(atendimento);
        
        alert(`Atendimento de exemplo #${numeroVegas} criado com sucesso!\nAtendente: ${atendente}\nGrupo: ${grupo}`);
    });

    // Adiciona novo atendimento
    formAtendimento.addEventListener('submit', function (e) {
        e.preventDefault();

        // Obtém valores dos campos do formulário
        const numeroVegas = document.getElementById('numeroVegas').value.trim();
        const cpfTitular = document.getElementById('cpfTitular').value.trim();
        const nomeTitular = document.getElementById('nomeTitular').value.trim();
        const nomeFalecido = document.getElementById('nomeFalecido').value.trim();
        const cidadeEstado = document.getElementById('cidadeEstado').value.trim();
        const prestador = document.getElementById('prestador').value.trim();
        const atendente = document.getElementById('atendente').value;
        const modalidade = document.getElementById('modalidade').value;
        const grupo = document.getElementById('grupo').value;
        const status = document.getElementById('status').value;

        // Valida campos obrigatórios
        if (!numeroVegas || !cpfTitular || !nomeTitular || !nomeFalecido || !cidadeEstado || !prestador || !status || !modalidade || !atendente || !grupo) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Cria objeto do novo atendimento
        const atendimento = {
            numeroVegas,
            cpfTitular,
            nomeTitular,
            nomeFalecido,
            cidadeEstado,
            prestador,
            atendente,
            modalidade,
            grupo,
            status,
            observacoes: [],
            checklist: {
                rgTitular: false,
                rgFalecido: false,
                declaracaoObito: false,
                notaFiscal: false,
                orcamento: false,
                autorizacao: false,
                pesquisaAssinada: false,
                comprovanteEndereco: false
            }
        };

        atendimentos.push(atendimento);
        localStorage.setItem('atendimentos', JSON.stringify(atendimentos));
        atualizarTabela(atendimento);
        mostrarPopupConfirmacaoSalvar();
        fecharModal();
        formAtendimento.reset();
    });

    // Mostra popup de confirmação ao salvar atendimento
    function mostrarPopupConfirmacaoSalvar() {
        const modalConfirmacaoSalvar = document.getElementById('modalConfirmacaoSalvar');
        modalConfirmacaoSalvar.style.display = 'flex';

        setTimeout(() => {
            modalConfirmacaoSalvar.style.display = 'none';
            window.location.href = 'index.html';
        }, 2000);
    }

    // Fecha popup de confirmação
    document.getElementById('fecharConfirmacaoSalvar').addEventListener('click', function () {
        document.getElementById('modalConfirmacaoSalvar').style.display = 'none';
        window.location.href = 'index.html';
    });

    // Atualiza tabela com dados do atendimento
    function atualizarTabela(atendimento) {
        const row = document.createElement('tr');
        row.setAttribute('data-grupo', atendimento.grupo);
        row.setAttribute('data-modalidade', atendimento.modalidade);
        row.innerHTML = `
            <td>${atendimento.numeroVegas}</td>
            <td>${atendimento.cpfTitular}</td>
            <td>${atendimento.nomeTitular}</td>
            <td>${atendimento.nomeFalecido}</td>
            <td>${atendimento.cidadeEstado}</td>
            <td>${atendimento.prestador}</td>
            <td>${atendimento.modalidade}</td>
            <td>${atendimento.grupo}</td>
            <td>${atendimento.atendente}</td>
        `;

        row.addEventListener('click', () => abrirDetalhes(atendimento.numeroVegas));

        // Adiciona linha na tabela correspondente ao status
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

    // Abre modal para adicionar novo atendimento
    document.getElementById('abrirModal').addEventListener('click', function () {
        document.getElementById('modal').style.display = 'flex';
    });

    // Fecha modal
    function fecharModal() {
        document.getElementById('modal').style.display = 'none';
    }

    document.querySelector('.fecharModal').addEventListener('click', fecharModal);

    // Abre página de detalhes do atendimento
    function abrirDetalhes(numeroVegas) {
        window.location.href = `detalhes.html?numeroVegas=${numeroVegas}`;
    }

    // Controla navegação entre abas
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

    // Filtra atendimentos conforme texto digitado
    document.getElementById('campoPesquisa').addEventListener('input', function () {
        const termo = this.value.trim().toLowerCase();
        filtrarAtendimentos(termo);
    });

    // Aplica filtros nas tabelas de atendimentos
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

    // Filtra linhas de uma tabela específica
    function filtrarTabela(linhas, termo) {
        const filtroModalidade = document.getElementById('filtroModalidade').value;
        const filtroGrupo = document.getElementById('filtroGrupo').value;

        linhas.forEach(linha => {
            const textoLinha = linha.textContent.toLowerCase();
            const modalidadeLinha = linha.getAttribute('data-modalidade');
            const grupoLinha = linha.getAttribute('data-grupo');
            
            const correspondeTermo = textoLinha.includes(termo);
            const correspondeModalidade = (filtroModalidade === 'todas' || modalidadeLinha === filtroModalidade);
            const correspondeGrupo = (filtroGrupo === 'todos' || grupoLinha === filtroGrupo);
            
            linha.style.display = (correspondeTermo && correspondeModalidade && correspondeGrupo) ? '' : 'none';
        });
    }

    // Aplica filtro quando modalidade é alterada
    document.getElementById('filtroModalidade').addEventListener('change', function () {
        filtrarAtendimentos(document.getElementById('campoPesquisa').value.trim().toLowerCase());
    });

    // Aplica filtro quando grupo é alterado
    document.getElementById('filtroGrupo').addEventListener('change', function () {
        filtrarAtendimentos(document.getElementById('campoPesquisa').value.trim().toLowerCase());
    });

    // Carrega todos os atendimentos ao iniciar a página
    function carregarAtendimentos() {
        atendimentos.forEach(atendimento => {
            atualizarTabela(atendimento);
        });
    }

    carregarAtendimentos();
});