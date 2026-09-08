// ========================
// GERENCIAMENTO DE ESTADO
// ========================

const state = {
    notasGeradas: [],
    notaAtual: null
};

// ========================
// ELEMENTOS DO DOM
// ========================

const form = {
    nomeDoimplantador: document.getElementById('nomeDoimplantador'),
    clienteEmpresa: document.getElementById('clienteEmpresa'),
    tipoReuniao: document.getElementById('tipoReuniao'),
    dataReuniao: document.getElementById('dataReuniao'),
    duracao: document.getElementById('duracao'),
    participantes: document.getElementById('participantes'),
    apresentado: document.querySelectorAll('.apresentado'),
    pendente: document.querySelectorAll('.pendente'),
    proximosPassos: document.getElementById('proximosPassos'),
    upsell: document.querySelectorAll('.upsell'),
    obsUpsell: document.getElementById('obsUpsell'),
    observacoes: document.getElementById('observacoes'),
    videoLinks: document.getElementById('videoLinks')
};

const buttons = {
    gerarNota: document.getElementById('gerarNota'),
    limpar: document.getElementById('limpar'),
    addVideoBtn: document.getElementById('addVideoBtn'),
    copiarNota: document.getElementById('copiarNota'),
    salvarNota: document.getElementById('salvarNota'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn')
};

const elements = {
    preview: document.getElementById('preview'),
    historyList: document.getElementById('historyList')
};

// ========================
// INICIALIZAÇÃO
// ========================

document.addEventListener('DOMContentLoaded', function() {
    // Carregar dados persistidos
    carregarDadosPersistidos();
    carregarHistorico();

    // Event listeners para checkboxes
    form.apresentado.forEach(checkbox => {
        checkbox.addEventListener('change', gerarPreview);
    });

    form.pendente.forEach(checkbox => {
        checkbox.addEventListener('change', gerarPreview);
    });

    form.upsell.forEach(checkbox => {
        checkbox.addEventListener('change', gerarPreview);
    });

    // Event listeners para inputs
    form.clienteEmpresa.addEventListener('input', gerarPreview);
    form.tipoReuniao.addEventListener('input', gerarPreview);
    form.dataReuniao.addEventListener('input', gerarPreview);
    form.duracao.addEventListener('input', gerarPreview);
    form.participantes.addEventListener('input', gerarPreview);
    form.proximosPassos.addEventListener('input', gerarPreview);
    form.obsUpsell.addEventListener('input', gerarPreview);
    form.observacoes.addEventListener('input', gerarPreview);

    // Event listeners para botões
    buttons.gerarNota.addEventListener('click', salvarNotaNoHistorico);
    buttons.limpar.addEventListener('click', limparFormulario);
    buttons.addVideoBtn.addEventListener('click', adicionarCampoVideo);
    buttons.copiarNota.addEventListener('click', copiarNota);
    buttons.salvarNota.addEventListener('click', salvarNotaLocalmente);
    buttons.clearHistoryBtn.addEventListener('click', limparHistorico);

    // Event delegation para remover links de video
    form.videoLinks.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-video-btn')) {
            e.target.parentElement.remove();
            gerarPreview();
        }
    });

    // Salvar nome do implantador no localStorage quando mudar
    form.nomeDoimplantador.addEventListener('input', function() {
        localStorage.setItem('nomeDoimplantador', this.value);
    });

    // Salvar links de video quando forem alterados
    form.videoLinks.addEventListener('input', function(e) {
        if (e.target.classList.contains('video-link')) {
            gerarPreview();
        }
    });

    // Preview inicial
    gerarPreview();
});

// ========================
// PERSISTÊNCIA DE DADOS
// ========================

function carregarDadosPersistidos() {
    const nomeSalvo = localStorage.getItem('nomeDoimplantador');
    if (nomeSalvo) {
        form.nomeDoimplantador.value = nomeSalvo;
    }
}

function salvarFormulario() {
    const dados = {
        clienteEmpresa: form.clienteEmpresa.value,
        tipoReuniao: form.tipoReuniao.value,
        dataReuniao: form.dataReuniao.value,
        duracao: form.duracao.value,
        participantes: form.participantes.value,
        apresentado: Array.from(form.apresentado)
            .filter(cb => cb.checked)
            .map(cb => cb.value),
        pendente: Array.from(form.pendente)
            .filter(cb => cb.checked)
            .map(cb => cb.value),
        proximosPassos: form.proximosPassos.value,
        upsell: Array.from(form.upsell)
            .filter(cb => cb.checked)
            .map(cb => cb.value),
        obsUpsell: form.obsUpsell.value,
        observacoes: form.observacoes.value,
        videoLinks: Array.from(document.querySelectorAll('.video-link'))
            .map(input => input.value)
            .filter(url => url.trim() !== '')
    };
    return dados;
}

function restaurarFormulario(dados) {
    form.clienteEmpresa.value = dados.clienteEmpresa || '';
    form.tipoReuniao.value = dados.tipoReuniao || '';
    form.dataReuniao.value = dados.dataReuniao || '';
    form.duracao.value = dados.duracao || '';
    form.participantes.value = dados.participantes || '';
    form.proximosPassos.value = dados.proximosPassos || '';
    form.obsUpsell.value = dados.obsUpsell || '';
    form.observacoes.value = dados.observacoes || '';

    // Restaurar checkboxes de apresentado
    form.apresentado.forEach(cb => {
        cb.checked = dados.apresentado && dados.apresentado.includes(cb.value);
    });

    // Restaurar checkboxes de pendente
    form.pendente.forEach(cb => {
        cb.checked = dados.pendente && dados.pendente.includes(cb.value);
    });

    // Restaurar checkboxes de upsell
    form.upsell.forEach(cb => {
        cb.checked = dados.upsell && dados.upsell.includes(cb.value);
    });

    // Restaurar videos
    const videoContainer = document.getElementById('videoLinks');
    videoContainer.innerHTML = '';
    
    if (dados.videoLinks && dados.videoLinks.length > 0) {
        dados.videoLinks.forEach(url => {
            const linkItem = document.createElement('div');
            linkItem.className = 'video-link-item';
            linkItem.innerHTML = `
                <input type="url" class="video-link" value="${url}" placeholder="Cole o link da gravação aqui">
                <button type="button" class="remove-video-btn">✕</button>
            `;
            videoContainer.appendChild(linkItem);
        });
    } else {
        const linkItem = document.createElement('div');
        linkItem.className = 'video-link-item';
        linkItem.innerHTML = `
            <input type="url" class="video-link" placeholder="Cole o link da gravação aqui">
            <button type="button" class="remove-video-btn">✕</button>
        `;
        videoContainer.appendChild(linkItem);
    }

    gerarPreview();
}

// ========================
// GERAÇÃO DE PREVIEW
// ========================

function gerarPreview() {
    const clienteEmpresa = form.clienteEmpresa.value.trim();
    const tipoReuniao = form.tipoReuniao.value.trim();
    const nomeDoimplantador = form.nomeDoimplantador.value.trim();
    const dataReuniao = form.dataReuniao.value;
    const duracao = form.duracao.value.trim();
    const participantes = form.participantes.value.trim();
    
    const apresentado = Array.from(form.apresentado)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    const pendente = Array.from(form.pendente)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    const proximosPassos = form.proximosPassos.value.trim();
    
    const upsell = Array.from(form.upsell)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    const obsUpsell = form.obsUpsell.value.trim();
    const observacoes = form.observacoes.value.trim();
    
    const videoLinks = Array.from(document.querySelectorAll('.video-link'))
        .map(input => input.value.trim())
        .filter(url => url !== '');

    let nota = '';

    // Título
    if (tipoReuniao && nomeDoimplantador) {
        nota += `IMPLANTAÇÃO TÉCNICA / ${tipoReuniao} (${nomeDoimplantador})\n\n`;
    } else if (tipoReuniao) {
        nota += `IMPLANTAÇÃO TÉCNICA / ${tipoReuniao}\n\n`;
    } else {
        nota += `IMPLANTAÇÃO TÉCNICA\n\n`;
    }

    // Descrição introdutória
    if (clienteEmpresa) {
        nota += `${clienteEmpresa} — Reunião de implantação técnica realizada.\n\n`;
    } else {
        nota += `Reunião de implantação técnica realizada.\n\n`;
    }

    // Data
    if (dataReuniao) {
        const dataBR = formatarData(dataReuniao);
        nota += `Data da conclusão: ${dataBR}.\n\n`;
    }

    // Duração e participantes
    if (duracao || participantes) {
        let descricao = `A reunião`;
        if (duracao) {
            descricao += ` teve duração de ${duracao}`;
        }
        if (duracao && participantes) {
            descricao += ` e contou com a presença de ${participantes}`;
        } else if (participantes) {
            descricao += ` contou com a presença de ${participantes}`;
        }
        descricao += `.\n\n`;
        nota += descricao;
    }

    // Apresentado/Realizado
    if (apresentado.length > 0) {
        nota += `Durante a reunião, foram apresentadas e/ou realizadas as seguintes configurações e funcionalidades: ${apresentado.join(', ')}.\n\n`;
    }

    // Pendências
    if (pendente.length > 0) {
        nota += `Para a continuidade da implantação, ficaram pendentes os seguintes pontos:\n\n`;
        pendente.forEach(item => {
            nota += `• ${item}\n`;
        });
        nota += `\n`;
    }

    // Próximos passos
    nota += `Próximos passos:\n\n`;
    if (proximosPassos) {
        nota += `${proximosPassos}\n\n`;
    } else {
        nota += `[Campo livre para próximos passos]\n\n`;
    }

    // Possível Upsell
    if (upsell.length > 0) {
        nota += `Possível upsell:\n\n`;
        upsell.forEach(item => {
            nota += `• ${item}\n`;
        });
        if (obsUpsell) {
            nota += `\n${obsUpsell}\n\n`;
        } else {
            nota += `\n`;
        }
    }

    // Observações
    nota += `Observações:\n\n`;
    if (observacoes) {
        nota += `${observacoes}\n\n`;
    } else {
        nota += `[Observações]\n\n`;
    }

    // Gravação
    nota += `GRAVAÇÃO:\n\n`;
    if (videoLinks.length > 0) {
        videoLinks.forEach(link => {
            nota += `${link}\n`;
        });
    } else {
        nota += `[Link da gravação]\n`;
    }

    // Atualizar preview
    elements.preview.innerHTML = nota;
    elements.preview.classList.remove('placeholder');

    // Mostrar botões de ação
    buttons.copiarNota.style.display = 'block';
    buttons.salvarNota.style.display = 'block';

    // Salvar nota atual no estado
    state.notaAtual = {
        conteudo: nota,
        dados: {
            clienteEmpresa,
            tipoReuniao,
            nomeDoimplantador,
            dataReuniao,
            duracao,
            participantes,
            apresentado,
            pendente,
            proximosPassos,
            upsell,
            obsUpsell,
            observacoes,
            videoLinks
        }
    };
}

// ========================
// UTILITÁRIOS
// ========================

function formatarData(dataISO) {
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
}

function formatarDataBR(data) {
    const opcoes = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(data).toLocaleDateString('pt-BR', opcoes);
}

function adicionarCampoVideo() {
    const linkItem = document.createElement('div');
    linkItem.className = 'video-link-item';
    linkItem.innerHTML = `
        <input type="url" class="video-link" placeholder="Cole o link da gravação aqui">
        <button type="button" class="remove-video-btn">✕</button>
    `;
    form.videoLinks.appendChild(linkItem);
    gerarPreview();
}

// ========================
// AÇÕES DO FORMULÁRIO
// ========================

function limparFormulario() {
    // Limpar todos os campos exceto nome do implantador
    form.clienteEmpresa.value = '';
    form.tipoReuniao.value = '';
    form.dataReuniao.value = '';
    form.duracao.value = '';
    form.participantes.value = '';
    form.proximosPassos.value = '';
    form.obsUpsell.value = '';
    form.observacoes.value = '';

    // Desmarcar checkboxes
    form.apresentado.forEach(cb => cb.checked = false);
    form.pendente.forEach(cb => cb.checked = false);
    form.upsell.forEach(cb => cb.checked = false);

    // Limpar videos
    form.videoLinks.innerHTML = `
        <div class="video-link-item">
            <input type="url" class="video-link" placeholder="Cole o link da gravação aqui">
            <button type="button" class="remove-video-btn">✕</button>
        </div>
    `;

    // Gerar preview vazio
    gerarPreview();

    // Mostrar feedback
    mostrarFeedback('Formulário limpo! Nome do implantador mantido.', 'success');
}

function copiarNota() {
    if (state.notaAtual) {
        const texto = state.notaAtual.conteudo;
        navigator.clipboard.writeText(texto).then(() => {
            mostrarFeedback('Nota copiada para a área de transferência!', 'success');
        }).catch(() => {
            mostrarFeedback('Erro ao copiar. Tente novamente.', 'error');
        });
    }
}

function mostrarFeedback(mensagem, tipo) {
    const feedback = document.createElement('div');
    feedback.className = `feedback-message ${tipo}`;
    feedback.textContent = mensagem;
    document.body.appendChild(feedback);

    setTimeout(() => {
        feedback.remove();
    }, 3000);
}

// ========================
// HISTÓRICO
// ========================

function salvarNotaNoHistorico() {
    if (!state.notaAtual) {
        mostrarFeedback('Nenhuma nota para salvar.', 'error');
        return;
    }

    const nota = {
        id: Date.now(),
        data: new Date().toLocaleDateString('pt-BR'),
        cliente: state.notaAtual.dados.clienteEmpresa || 'Sem cliente',
        tipoReuniao: state.notaAtual.dados.tipoReuniao || 'Reunião',
        implantador: state.notaAtual.dados.nomeDoimplantador || 'Não definido',
        conteudo: state.notaAtual.conteudo,
        dadosCompletos: state.notaAtual.dados
    };

    // Carregar histórico existente
    let historico = JSON.parse(localStorage.getItem('historicoNotas')) || [];

    // Adicionar nova nota no topo
    historico.unshift(nota);

    // Manter apenas as últimas 20 notas
    historico = historico.slice(0, 20);

    // Salvar no localStorage
    localStorage.setItem('historicoNotas', JSON.stringify(historico));

    // Atualizar exibição do histórico
    carregarHistorico();

    // Mostrar feedback
    mostrarFeedback('Nota salva no histórico!', 'success');
}

function carregarHistorico() {
    const historico = JSON.parse(localStorage.getItem('historicoNotas')) || [];

    if (historico.length === 0) {
        elements.historyList.innerHTML = '<p class="empty-history">Nenhuma nota gerada ainda</p>';
        return;
    }

    elements.historyList.innerHTML = '';

    historico.forEach(nota => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <span class="history-date">${nota.data}</span>
            <span class="history-info">${nota.cliente}</span>
            <span class="history-info">${nota.tipoReuniao} — ${nota.implantador}</span>
        `;

        item.addEventListener('click', () => restaurarNotaDoHistorico(nota));
        elements.historyList.appendChild(item);
    });
}

function restaurarNotaDoHistorico(nota) {
    restaurarFormulario(nota.dadosCompletos);
    mostrarFeedback('Nota restaurada do histórico!', 'success');

    // Rolar até o topo do formulário
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

function limparHistorico() {
    if (confirm('Tem certeza que deseja apagar todo o histórico de notas?')) {
        localStorage.removeItem('historicoNotas');
        carregarHistorico();
        mostrarFeedback('Histórico apagado.', 'success');
    }
}

function salvarNotaLocalmente() {
    if (!state.notaAtual) {
        mostrarFeedback('Nenhuma nota para salvar.', 'error');
        return;
    }

    // Preparar nome do arquivo
    const clienteEmpresa = state.notaAtual.dados.clienteEmpresa || 'nota';
    const data = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    const nomeArquivo = `Implantacao_${clienteEmpresa}_${data}.txt`;

    // Criar blob e download
    const blob = new Blob([state.notaAtual.conteudo], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nomeArquivo;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    mostrarFeedback('Nota baixada como arquivo de texto!', 'success');
}
