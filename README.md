# 📋 Gerador de Notas — Implantação Técnica

Uma ferramenta web profissional para gerar notas de reuniões de implantação técnica de forma rápida e contextualizada.

## ✨ Características

- ✅ **Nome do Implantador** - Salvo automaticamente no navegador (localStorage)
- ✅ **Histórico de Notas** - Acesse notas anteriores diretamente da sidebar
- ✅ **Notas Profissionais** - Transforme dados simples em textos narrativos completos
- ✅ **Múltiplas Funcionalidades** - Inclui Contatos, Upsell com Migração para API Oficial
- ✅ **Campo Livre** - Próximos passos sem opções pré-definidas
- ✅ **Múltiplas Gravações** - Adicione vários links de vídeo
- ✅ **Copiar/Baixar** - Copie a nota ou baixe como arquivo .txt

## 🎯 Funcionalidades Principais

### 1. Nome do Implantador
Salva seu nome automaticamente no navegador. Não é apagado ao clicar em "Limpar" - é uma preferência persistente.

### 2. Histórico de Notas Recentes
Todas as notas geradas são salvas localmente. Clique em qualquer nota anterior para restaurá-la.

### 3. Estrutura Profissional
A nota segue um formato narrativo completo:
```
IMPLANTAÇÃO TÉCNICA / [TIPO] ([IMPLANTADOR])

[Cliente] — Reunião de implantação técnica realizada.

Data da conclusão: [DATA].

A reunião teve duração de [DURAÇÃO] e contou com a presença de [PARTICIPANTES].

Durante a reunião, foram apresentadas e/ou realizadas as seguintes configurações e funcionalidades: [ITENS].

Para a continuidade da implantação, ficaram pendentes os seguintes pontos:
• [PENDÊNCIA 1]
• [PENDÊNCIA 2]
...

Próximos passos:
[TEXTO LIVRE]

Possível upsell:
• [OPÇÃO 1]

Observações:
[OBSERVAÇÕES]

GRAVAÇÃO:
[LINK 1]
[LINK 2]
```

## 🔧 Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Design responsivo e profissional
- **JavaScript Puro** - Sem dependências externas
- **localStorage** - Persistência de dados no navegador

## 📱 Compatibilidade

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Tablet
- ✅ Mobile (com layout responsivo)

## 🚀 Como Usar

1. Acesse: **https://mari-couto.github.io/Gerador-notas/**
2. Preencha os campos da reunião
3. Selecione as funcionalidades apresentadas e pendências
4. Escreva os próximos passos
5. Clique em **"Gerar Nota"** para salvar no histórico
6. Copie ou baixe a nota gerada

## 💾 Armazenamento

Todos os dados são salvos **localmente no seu navegador** usando localStorage:
- Nome do implantador
- Histórico de notas (últimas 20)
- Nenhum dado é enviado para servidor

## 📝 Campos Disponíveis

### Informações da Reunião
- Nome do Implantador (persistido)
- Cliente/Empresa
- Tipo/Número da Reunião
- Data da Conclusão
- Duração
- Participantes

### Seleções
- **Apresentado/Realizado:** Configurações iniciais, Chatbot, Funil, Dashboard, Relatórios, JetVoice, Contatos
- **Pendências:** Mesmas opções
- **Possível Upsell:** Migração para API Oficial, Customizações avançadas, Consultoria especializada, Treinamento completo

### Texto Livre
- Próximos passos
- Observações sobre upsell
- Observações gerais
- Links de gravação (múltiplos)

## 🎨 Design

Interface limpa e profissional com:
- Sidebar com histórico de notas
- Preview em tempo real
- Botões de ação clara
- Feedback visual de operações
- Design responsivo para todos os dispositivos

---

Desenvolvido com ❤️ por Marina Couto
