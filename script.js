document.addEventListener('DOMContentLoaded', function () {
    const formAtendimento = document.getElementById('formAtendimento');
    const tabelaEmAndamento = document.querySelector('#emAndamento tbody');
    const tabelaZeloInforma = document.querySelector('#zeloInforma tbody');
    const tabelaFinalizado = document.querySelector('#finalizado tbody');
    const tabelaCancelado = document.querySelector('#cancelado tbody');

    let atendimentos = JSON.parse(localStorage.getItem('atendimentos')) || [];
    
    document.getElementById('limparAtendimentos').addEventListener('click', function() {
    if (confirm('ATENÇÃO: Isso apagará TODOS os atendimentos permanentemente. Deseja continuar?')) {
        localStorage.removeItem('atendimentos');
        atendimentos = [];
        
        // Limpa visualmente todas as tabelas
        tabelaEmAndamento.innerHTML = '';
        tabelaZeloInforma.innerHTML = '';
        tabelaFinalizado.innerHTML = '';
        tabelaCancelado.innerHTML = '';
        
        alert('Todos os atendimentos foram removidos com sucesso!');
    }
});

    document.getElementById('gerarAtendimentoExemplo').addEventListener('click', function() {
        const nomesTitulares = ['João Silva', 'Maria Oliveira', 'Carlos Souza', 'Ana Pereira', 'Pedro Costa'];
        const nomesFalecidos = ['José Santos', 'Antônio Ferreira', 'Francisco Almeida', 'Paulo Rodrigues', 'Lucas Lima'];
        const cidadesEstados = ['São Paulo/SP', 'Rio de Janeiro/RJ', 'Belo Horizonte/MG', 'Porto Alegre/RS', 'Curitiba/PR'];
        const prestadores = ['Funerária Paz Eterna', 'Memorial Serviços', 'Lar Celestial', 'Ultima Homenagem', 'Descanso Eterno'];
        const modalidades = ['MAWDY', 'PET', 'B2C', 'B2B'];
        const statusOptions = ['emAndamento', 'zeloInforma', 'finalizado', 'cancelado'];
        const atendentes = ['Ana Carolina', 'Bruno Oliveira', 'Camila Santos', 'Daniel Costa', 'Elaine Pereira', 'Fernando Souza', 'Gabriela Lima', 'Hugo Almeida'];
        const grupos = ['G1', 'G2', 'G3'];
        
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

    formAtendimento.addEventListener('submit', function (e) {
        e.preventDefault();

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

        if (!numeroVegas || !cpfTitular || !nomeTitular || !nomeFalecido || !cidadeEstado || !prestador || !status || !modalidade || !atendente || !grupo) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

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

    function mostrarPopupConfirmacaoSalvar() {
        const modalConfirmacaoSalvar = document.getElementById('modalConfirmacaoSalvar');
        modalConfirmacaoSalvar.style.display = 'flex';

        setTimeout(() => {
            modalConfirmacaoSalvar.style.display = 'none';
            window.location.href = 'index.html';
        }, 2000);
    }

    document.getElementById('fecharConfirmacaoSalvar').addEventListener('click', function () {
        document.getElementById('modalConfirmacaoSalvar').style.display = 'none';
        window.location.href = 'index.html';
    });

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

    document.getElementById('abrirModal').addEventListener('click', function () {
        document.getElementById('modal').style.display = 'flex';
    });

    function fecharModal() {
        document.getElementById('modal').style.display = 'none';
    }

    document.querySelector('.fecharModal').addEventListener('click', fecharModal);

    function abrirDetalhes(numeroVegas) {
        window.location.href = `detalhes.html?numeroVegas=${numeroVegas}`;
    }

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

    document.getElementById('campoPesquisa').addEventListener('input', function () {
        const termo = this.value.trim().toLowerCase();
        filtrarAtendimentos(termo);
    });

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

    document.getElementById('filtroModalidade').addEventListener('change', function () {
        filtrarAtendimentos(document.getElementById('campoPesquisa').value.trim().toLowerCase());
    });

    document.getElementById('filtroGrupo').addEventListener('change', function () {
        filtrarAtendimentos(document.getElementById('campoPesquisa').value.trim().toLowerCase());
    });

    function carregarAtendimentos() {
        atendimentos.forEach(atendimento => {
            atualizarTabela(atendimento);
        });
    }

    carregarAtendimentos();
});