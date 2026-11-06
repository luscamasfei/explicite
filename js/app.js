'use strict';

/* ---------- Dados do diagnóstico ---------- */

const SETORES = {
  varejo: { nome: 'Varejo', notas: {
    infra: 'No varejo, o caixa precisa continuar vendendo sem internet: exija do PDV um modo de contingência offline.',
    sistemas: 'Integre PDV, loja virtual e estoque para que cada venda baixe o saldo em todos os canais.',
    ia: 'Bons pontos de partida no varejo são as dúvidas sobre pedidos e trocas e a sugestão de reposição, sempre com revisão humana.',
    gov: 'Restrinja o acesso ao cadastro de clientes e nunca guarde números de cartão em planilhas.'
  }},
  industria: { nome: 'Indústria', notas: {
    infra: 'Na indústria, o que controla máquina deve continuar operando sem internet: mantenha esse controle local e leve cópias para a nuvem.',
    sistemas: 'Ligue o apontamento de produção ao ERP para que estoque e custo reflitam o que saiu da fábrica.',
    ia: 'Comece por relatórios de manutenção e de qualidade, em que a IA resume e uma pessoa técnica valida.',
    gov: 'Separe a rede das máquinas da rede administrativa e proteja projetos e fórmulas, que são segredo industrial.'
  }},
  servicos: { nome: 'Serviços', notas: {
    infra: 'Em serviços, o principal ativo são documentos: use armazenamento em nuvem com versionamento e permissão por projeto.',
    sistemas: 'Ligue proposta, contrato, horas e faturamento para saber a margem real de cada cliente.',
    ia: 'Resumos de reunião, triagem de chamados e minutas de proposta dão retorno rápido, desde que alguém revise antes do envio.',
    gov: 'Confira as cláusulas de confidencialidade dos contratos antes de usar dados de clientes em qualquer IA.'
  }},
  saude: { nome: 'Saúde', notas: {
    infra: 'Na saúde, agenda e prontuário não podem parar: exija do fornecedor um SLA de disponibilidade e criptografia dos dados.',
    sistemas: 'Integre agenda, prontuário e faturamento de convênios para acabar com a redigitação na recepção.',
    ia: 'Use IA em tarefas administrativas, como confirmação de consultas. A decisão clínica é sempre de um profissional de saúde.',
    gov: 'Dados de saúde são dados pessoais sensíveis (LGPD, art. 11): limite o acesso por função, registre quem acessa e não os coloque em IAs públicas.'
  }},
  educacao: { nome: 'Educação', notas: {
    infra: 'Na educação, matrícula e provas criam picos de acesso: prefira serviços em nuvem que escalem nesses períodos.',
    sistemas: 'Integre matrícula, financeiro e plataforma de aulas para manter um cadastro único de cada aluno.',
    ia: 'Comece pelo atendimento da secretaria e defina regras claras para o uso de IA por professores e alunos.',
    gov: 'Dados de crianças e adolescentes devem ser tratados no melhor interesse deles (LGPD, art. 14).'
  }},
  outro: { nome: 'Outro setor', notas: {} }
};

const PORTES = ['Até 9', '10 a 49', '50 a 249', '250 ou mais'];

const SOFTWARES = {
  pronto: 'Pronto de mercado',
  medida: 'Desenvolvido sob medida',
  legado: 'Legado, instalado em servidor'
};

const MODELOS = {
  pronto: { sigla: 'SaaS', texto: 'Como a empresa usa software de mercado, o caminho mais simples é contratar a versão em nuvem: Google Workspace ou Microsoft 365 para e-mail e arquivos, e um ERP em nuvem. O fornecedor cuida de servidor, atualização e disponibilidade.' },
  medida: { sigla: 'PaaS', texto: 'Como a empresa tem aplicações próprias, publique-as em plataformas gerenciadas, como Azure App Service, Google Cloud Run ou AWS Elastic Beanstalk, com banco de dados gerenciado. A equipe cuida do código e a plataforma cuida do servidor. E-mail e arquivos podem ir para SaaS.' },
  legado: { sigla: 'IaaS', texto: 'Como o sistema depende de instalação em servidor, mova-o primeiro para máquinas virtuais na AWS, Azure ou GCP, sem reescrever nada. Depois, planeje a troca por uma solução SaaS, porque em IaaS a empresa continua responsável por atualizar e proteger o servidor.' }
};

const link2 = c => c.porte >= 1
  ? ' Com a operação na nuvem, a internet vira ponto único de falha: contrate um segundo link de outra operadora ou um failover 4G/5G.'
  : ' Tenha um plano para quedas de internet, como um roteador 4G/5G de reserva.';

const PILARES = [
  {
    id: 'infra', nome: 'Infraestrutura e nuvem', curto: 'Nuvem', eixo: 'Nuvem',
    descricao: 'Onde os dados moram e o que acontece quando algo falha.',
    perguntas: [
      {
        id: 'hospedagem', texto: 'Onde rodam os sistemas e arquivos da empresa?',
        opcoes: [
          'Em um computador de escritório que faz papel de servidor',
          'Em um servidor local dedicado, sem redundância',
          'Parte na nuvem, parte em servidor local',
          'Na nuvem, com alta disponibilidade e custos acompanhados'
        ],
        rec: [
          { t: 'Tirar os sistemas do computador que faz papel de servidor', d: c => `Uma falha nessa máquina para a operação inteira. Migre primeiro o sistema mais crítico, usando o modelo ${MODELOS[c.software].sigla} indicado neste laudo.` + link2(c) },
          { t: 'Planejar a saída do servidor local sem redundância', d: c => `Faça o inventário de sistemas, volumes de dados e contratos, e defina a ordem de migração para ${MODELOS[c.software].sigla}. Até lá, tenha um plano de recuperação com tempo de retorno definido.` + link2(c) },
          { t: 'Concluir a migração e controlar os custos (FinOps)', d: c => 'Defina uma data para desligar o que ainda roda localmente. Na nuvem, identifique os recursos por área, configure alertas de orçamento e revise a fatura todo mês.' + link2(c) },
          { t: 'Manter a disponibilidade e a disciplina de custos', d: () => 'Simule uma falha ao menos uma vez por ano para comprovar a alta disponibilidade. Continue eliminando recursos ociosos e revisando os contratos de nuvem.' }
        ]
      },
      {
        id: 'backup', critica: true, texto: 'Como é feito o backup?',
        opcoes: [
          'Não há rotina de backup definida',
          'Manual, em HD externo',
          'Automático na nuvem, sem teste de restauração',
          'Automático na regra 3-2-1, com restauração testada'
        ],
        rec: [
          { t: 'Implantar backup automático imediatamente', d: () => 'Sem backup, uma falha de disco ou um ataque de ransomware pode encerrar a operação. Ative hoje um backup automático em nuvem dos dados críticos e evolua para a regra 3-2-1: 3 cópias, em 2 mídias diferentes, com 1 fora da empresa.' },
          { t: 'Trocar o HD externo por backup automático 3-2-1', d: () => 'Backup manual depende de memória e fica exposto ao mesmo incêndio, furto ou ransomware que atingir o escritório. Automatize a cópia para a nuvem e mantenha 3 cópias, em 2 mídias, com 1 fora da empresa.' },
          { t: 'Testar a restauração do backup', d: () => 'Backup que nunca foi restaurado é uma suposição. Agende um teste trimestral, meça quanto tempo leva e mantenha uma cópia imutável, que um ransomware não consiga apagar.' },
          { t: 'Manter os testes de restauração', d: () => 'Registre o resultado de cada teste e reveja a cobertura sempre que um sistema novo entrar em operação.' }
        ]
      }
    ]
  },
  {
    id: 'sistemas', nome: 'Sistemas e fluxo de dados', curto: 'Sistemas', eixo: 'Sistemas',
    descricao: 'Se vendas, finanças e operação enxergam os mesmos números.',
    perguntas: [
      {
        id: 'integracao', texto: 'Como são controlados clientes, vendas e finanças?',
        opcoes: [
          'Em planilhas soltas, WhatsApp e e-mail',
          'Uma área tem sistema, as outras usam planilha',
          'ERP e CRM separados, com digitação dupla ou exportação manual',
          'ERP e CRM integrados por API, com fonte única de dados'
        ],
        rec: [
          { t: 'Centralizar os dados e sair das planilhas soltas', d: c => `Escolha ${c.porte <= 1 ? 'um ERP em nuvem para pequenas empresas, que já inclua financeiro e estoque' : 'um ERP que cubra financeiro, estoque e operação'} e defina um responsável por cadastro. Migre clientes, produtos e contas antes de desligar as planilhas.` },
          { t: 'Levar as áreas restantes para um sistema integrado', d: () => 'Mapeie as planilhas que sustentam a operação e substitua primeiro as que têm mais retrabalho. Adote um CRM que converse com o ERP desde o início.' },
          { t: 'Integrar CRM e ERP por API', d: () => 'A venda fechada no CRM deve gerar pedido e cobrança no ERP sem nova digitação. Use a API dos sistemas ou uma ferramenta de integração no-code, como Make, Zapier ou n8n, e defina qual sistema é o dono de cada dado.' },
          { t: 'Proteger a fonte única de dados', d: () => 'Monitore falhas nas integrações e faça revisões periódicas da qualidade dos cadastros, para evitar duplicidades.' }
        ]
      },
      {
        id: 'indicadores', texto: 'Como a gestão acompanha os indicadores?',
        opcoes: [
          'Não acompanha, ou só quando alguém pede',
          'Com relatórios manuais, uma vez por mês',
          'Com dashboards que nem sempre batem entre as áreas',
          'Com dashboards em tempo real e definições únicas'
        ],
        rec: [
          { t: 'Definir os indicadores essenciais do negócio', d: () => 'Escolha de 3 a 5 números que orientam decisões, como faturamento, margem e inadimplência, e nomeie um responsável por cada um. Revise-os toda semana.' },
          { t: 'Automatizar os relatórios gerenciais', d: () => 'Conecte os sistemas a uma ferramenta como Looker Studio ou Power BI. O tempo gasto para montar o relatório passa a ser usado na análise.' },
          { t: 'Unificar a definição dos indicadores', d: () => 'Documente como cada indicador é calculado e de qual sistema ele vem. Se as áreas usam fórmulas diferentes, nenhum dashboard resolve a divergência.' },
          { t: 'Usar os dados para antecipar decisões', d: () => 'Acrescente metas e alertas aos dashboards e revise os indicadores que ninguém mais usa.' }
        ]
      }
    ]
  },
  {
    id: 'ia', nome: 'IA generativa e automação', curto: 'IA e automação', eixo: 'IA',
    descricao: 'Quanto trabalho repetitivo ainda passa pelas mãos da equipe.',
    perguntas: [
      {
        id: 'automacao', texto: 'Como são tratadas as tarefas repetitivas?',
        opcoes: [
          'Tudo é feito manualmente',
          'Há iniciativas pontuais de algumas pessoas',
          'Há fluxos no-code em alguns processos, sem medição de resultado',
          'Os processos são mapeados, automatizados e têm ganho medido'
        ],
        rec: [
          { t: 'Mapear os gargalos manuais', d: () => 'Peça para cada área listar as tarefas repetitivas e as horas gastas por semana. Escolha uma tarefa frequente, de baixo risco, e automatize-a como piloto.' },
          { t: 'Transformar iniciativas isoladas em processo', d: () => 'Documente o que já funciona, troque contas pessoais por contas da empresa e defina um responsável por cada automação, para que ela não dependa de uma única pessoa.' },
          { t: 'Medir o ganho das automações', d: () => 'Registre as horas gastas antes e depois de cada fluxo, além da taxa de erro. Use esses números para decidir qual processo automatizar em seguida.' },
          { t: 'Ampliar as automações com governança', d: () => 'Mantenha um inventário dos fluxos, com responsável e monitoramento de falhas, e reavalie os ganhos a cada semestre.' }
        ]
      },
      {
        id: 'usoia', texto: 'Como a equipe usa IA generativa?',
        opcoes: [
          'Cada pessoa usa por conta própria, sem critério nem revisão',
          'Ainda não usamos',
          'Em tarefas definidas, com revisão informal',
          'Com humano no comando, verificação de erros e ganho medido'
        ],
        rec: [
          { t: 'Dar método ao uso de IA que já acontece', d: () => 'Descubra quais ferramentas estão em uso e para quê. Defina as tarefas permitidas, ofereça uma ferramenta corporativa e exija revisão humana de tudo que sair para clientes.' },
          { t: 'Fazer um piloto de IA com revisão humana', d: () => 'Escolha uma tarefa interna, como resumir reuniões ou rascunhar respostas, sem dados pessoais. Meça o tempo economizado por 30 dias antes de ampliar.' },
          { t: 'Formalizar a revisão humana (human-in-the-loop)', d: () => 'Defina quem revisa cada tipo de saída e como conferir fatos, números e citações, porque a IA pode inventar informações com aparência convincente.' },
          { t: 'Manter a qualidade do uso de IA', d: () => 'Reavalie periodicamente ferramentas e prompts, compartilhe os que funcionam e continue medindo erros e ganhos.' }
        ]
      }
    ]
  },
  {
    id: 'gov', nome: 'Governança, ética e segurança', curto: 'Segurança e LGPD', eixo: 'Segurança',
    descricao: 'Quem acessa o quê e como os dados pessoais são protegidos.',
    perguntas: [
      {
        id: 'acesso', critica: true, texto: 'Como é o controle de acesso aos sistemas?',
        opcoes: [
          'Senhas compartilhadas, sem autenticação em duas etapas',
          'Contas individuais, sem autenticação em duas etapas',
          'MFA nas contas principais, com acessos raramente revisados',
          'MFA em todas as contas, menor privilégio e revisão periódica'
        ],
        rec: [
          { t: 'Acabar com as senhas compartilhadas', d: () => 'Com senha compartilhada, não há como saber quem fez o quê. Crie contas individuais, adote um gerenciador de senhas e ative o MFA, começando por e-mail, banco e sistemas de gestão.' },
          { t: 'Ativar MFA em todas as contas', d: () => 'Comece por e-mail, administradores e financeiro. O MFA barra a maior parte dos acessos feitos com senhas vazadas e está incluído na maioria dos serviços em nuvem.' },
          { t: 'Aplicar o menor privilégio e revisar os acessos', d: c => `Dê a cada pessoa só o acesso que a função exige e revise as permissões a cada trimestre. Remova os acessos no dia do desligamento.${c.porte >= 2 ? ' Nesse porte, o login único (SSO) centraliza esse controle e abre caminho para uma abordagem Zero Trust.' : ''}` },
          { t: 'Evoluir para Zero Trust', d: () => 'Continue revisando os acessos e passe a verificar também o dispositivo e o contexto de cada login, em vez de confiar em quem já está na rede.' }
        ]
      },
      {
        id: 'lgpd', critica: true, texto: 'Como a empresa lida com a LGPD e com dados em IAs?',
        opcoes: [
          'Dados de clientes são colados em IAs públicas, sem política',
          'Conhecemos a LGPD, mas não há ações concretas nem política de IA',
          'Há política escrita e treinamento pontual, com mapeamento parcial dos dados',
          'Dados mapeados, canal do titular, anonimização e treinamento recorrente'
        ],
        rec: [
          { t: 'Parar de colocar dados pessoais em IAs públicas', d: c => `Comunique a proibição hoje mesmo e ofereça uma alternativa: ferramenta corporativa ou dados anonimizados. Depois, publique uma política curta de uso de IA e mapeie quais dados pessoais a empresa trata.${lgpdPorte(c)}` },
          { t: 'Sair do conhecimento para a adequação à LGPD', d: c => `Mapeie quais dados pessoais são coletados, com qual finalidade e base legal, e quem os acessa (art. 37). Publique uma política de uso de IA que proíba dados pessoais em ferramentas públicas.${lgpdPorte(c)}` },
          { t: 'Completar o mapeamento e tornar o treinamento recorrente', d: () => 'Termine o inventário de dados, anonimize o que for para testes ou IA e faça treinamentos periódicos. Prepare um plano de incidentes: quando houver risco ou dano relevante, ANPD e titulares devem ser comunicados em até 3 dias úteis (Resolução CD/ANPD nº 15/2024).' },
          { t: 'Manter a conformidade viva', d: () => 'Reveja o inventário a cada novo sistema, avalie fornecedores e simule um incidente por ano. Em projetos novos, aplique Privacy by Design desde o início.' }
        ]
      }
    ]
  }
];

function lgpdPorte(c) {
  return c.porte <= 1
    ? ' Micro e pequenas empresas podem ter regras simplificadas (Resolução CD/ANPD nº 2/2022), mas continuam obrigadas a manter um canal de contato com os titulares.'
    : ' Indique o encarregado pelo tratamento de dados (art. 41) e publique o canal de contato com os titulares.';
}

const ESTAGIOS = [
  { nome: 'Iniciante', min: 0, cor: '#B3261E', resumo: 'A operação depende de pessoas e arquivos soltos, e os riscos de parada e perda de dados são altos. As primeiras ações devem proteger o que já existe.' },
  { nome: 'Em Transição', min: 35, cor: '#8A5A00', resumo: 'Já existem sistemas e iniciativas digitais, mas eles ainda não conversam entre si. O maior ganho agora vem de integrar, padronizar e fechar as falhas de segurança.' },
  { nome: 'Conectada', min: 60, cor: '#2742C8', resumo: 'Os sistemas conversam e a gestão usa dados para decidir. Falta fechar as lacunas restantes e medir melhor os resultados.' },
  { nome: 'Líder Digital', min: 85, cor: '#1B6E4B', resumo: 'Nuvem, dados, IA e segurança já fazem parte da rotina. O foco passa a ser a melhoria contínua.' }
];

const PATAMAR = 60;

const ROTULOS = { hospedagem: 'Hospedagem', backup: 'Backup', integracao: 'ERP e CRM', indicadores: 'Indicadores', automacao: 'Automação', usoia: 'Uso de IA', acesso: 'Acessos', lgpd: 'LGPD' };

const DEMO = {
  empresa: 'Distribuidora Sol Nascente (fictícia)', setor: 'varejo', porte: 1, software: 'legado',
  respostas: { hospedagem: 1, backup: 1, integracao: 1, indicadores: 2, automacao: 1, usoia: 2, acesso: 1, lgpd: 0 }
};

/* ---------- Motor de cálculo ---------- */

function calcular(respostas) {
  const pilares = PILARES.map(p => {
    const pontos = p.perguntas.reduce((s, q) => s + respostas[q.id], 0);
    return { id: p.id, nome: p.nome, curto: p.curto, eixo: p.eixo, nota: Math.round(pontos / (3 * p.perguntas.length) * 100) };
  });
  const todas = PILARES.flatMap(p => p.perguntas.map(q => ({ ...q, pilar: p.id, pilarCurto: p.curto })));
  const geral = Math.round(todas.reduce((s, q) => s + respostas[q.id], 0) / (3 * todas.length) * 100);

  let indice = 0;
  ESTAGIOS.forEach((e, i) => { if (geral >= e.min) indice = i; });

  const riscos = todas.filter(q => q.critica && respostas[q.id] === 0);
  const travado = riscos.length > 0 && indice > 1;
  if (travado) indice = 1;

  const notaDe = id => pilares.find(p => p.id === id).nota;
  const acoes = todas
    .map((q, ordem) => {
      const nivel = respostas[q.id];
      const peso = (3 - nivel) * (q.critica ? 2 : 1);
      return { q, nivel, peso, ordem, prazo: peso >= 4 ? 'Até 30 dias' : peso >= 2 ? '30 a 90 dias' : peso === 1 ? '90 a 180 dias' : 'Contínuo' };
    })
    .sort((a, b) => b.peso - a.peso || notaDe(a.q.pilar) - notaDe(b.q.pilar) || a.ordem - b.ordem);

  return { pilares, geral, estagio: ESTAGIOS[indice], travado, riscos, acoes };
}

function prioridadeDoPilar(nota) {
  return nota < 35 ? 'Alta' : nota < 60 ? 'Média' : nota < 85 ? 'Baixa' : 'Manter';
}

/* ---------- Interface ---------- */

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const TOTAL = PILARES.reduce((s, p) => s + p.perguntas.length, 0);
let grafico = null;
let estagioAnterior = null;
const barrasAnteriores = {};
const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function contar(el, valor, { de = Number(el.dataset.valor || 0), atraso = 0, duracao = 620 } = {}) {
  cancelAnimationFrame(el._contagem);
  clearTimeout(el._espera);
  el.dataset.valor = valor;
  if (semMovimento || de === valor) { el.textContent = valor; return; }
  el.textContent = de;
  el._espera = setTimeout(() => {
    const inicio = performance.now();
    const passo = agora => {
      const t = Math.min((agora - inicio) / duracao, 1);
      el.textContent = Math.round(de + (valor - de) * (1 - Math.pow(1 - t, 3)));
      if (t < 1) el._contagem = requestAnimationFrame(passo);
    };
    el._contagem = requestAnimationFrame(passo);
  }, atraso);
}

const observarMarca = 'IntersectionObserver' in window
  ? new IntersectionObserver(itens => itens.forEach(i => {
      if (i.isIntersecting) { i.target.classList.add('marcada'); observarMarca.unobserve(i.target); }
    }), { threshold: .8 })
  : null;

function marcar(el) {
  if (observarMarca && !semMovimento) observarMarca.observe(el);
  else el.classList.add('marcada');
}

function montarFormulario() {
  const preencher = (el, pares) => {
    el.innerHTML = '<option value="">Selecione</option>' + pares.map(([v, t]) => `<option value="${v}">${esc(t)}</option>`).join('');
  };
  preencher($('setor'), Object.entries(SETORES).map(([k, s]) => [k, s.nome]));
  preencher($('porte'), PORTES.map((t, i) => [i, t]));
  preencher($('software'), Object.entries(SOFTWARES));

  $('perguntas').innerHTML = PILARES.map(p => `
    <section class="py-9 border-b border-linha grid lg:grid-cols-[210px_1fr] scroll-mt-4 gap-x-8 gap-y-4" aria-labelledby="pilar-${p.id}">
      <div class="lg:sticky lg:top-6 self-start">
        <h2 id="pilar-${p.id}" class="titulo-largo text-2xl leading-tight">${esc(p.nome)}</h2>
        <p class="text-grafite mt-1.5 text-[15px]">${esc(p.descricao)}</p>
        <div class="pilar-nota" id="nota-${p.id}" hidden>
          <p class="pilar-num titulo-largo"><span data-num></span>%</p>
          <div class="barra-nota mt-2"><i style="width:0"></i></div>
        </div>
      </div>
      <div class="grid md:grid-cols-2 gap-x-6 gap-y-6">
        ${p.perguntas.map(q => `
          <fieldset>
            <legend class="font-semibold mb-2 text-[17px] leading-snug">${esc(q.texto)}</legend>
            ${q.opcoes.map((o, i) => `
              <label class="opcao"><input type="radio" name="${q.id}" value="${i}"><span>${esc(o)}</span></label>`).join('')}
          </fieldset>`).join('')}
      </div>
    </section>`).join('');

  $('trilha').innerHTML = PILARES.map(p => `
    <a href="#pilar-${p.id}" data-pilar="${p.id}"><span>${esc(p.eixo)}</span>${p.perguntas.map(() => '<i></i>').join('')}</a>`).join('');
  $('fantasma-linhas').innerHTML = PILARES.flatMap(p => p.perguntas.map(q => `<li data-q="${q.id}">${esc(ROTULOS[q.id])}</li>`)).join('');
}

function lerFicha() {
  const respostas = {};
  PILARES.forEach(p => p.perguntas.forEach(q => {
    const marcada = document.querySelector(`input[name="${q.id}"]:checked`);
    if (marcada) respostas[q.id] = Number(marcada.value);
  }));
  return {
    empresa: $('empresa').value.trim(),
    setor: $('setor').value,
    porte: $('porte').value === '' ? null : Number($('porte').value),
    software: $('software').value,
    respostas
  };
}

function pendencias(f) {
  const lista = [];
  if (!f.empresa) lista.push('nome da empresa');
  if (!f.setor) lista.push('setor');
  if (f.porte === null) lista.push('colaboradores');
  if (!f.software) lista.push('software principal');
  const faltam = TOTAL - Object.keys(f.respostas).length;
  if (faltam) lista.push(faltam === 1 ? '1 pergunta' : `${faltam} perguntas`);
  return lista;
}

function juntar(lista) {
  return lista.length < 2 ? lista.join('') : lista.slice(0, -1).join(', ') + ' e ' + lista[lista.length - 1];
}

function protocolo(f, data) {
  const texto = f.empresa + JSON.stringify(f.respostas);
  let h = 7;
  for (const ch of texto) h = (h * 31 + ch.codePointAt(0)) % 65536;
  const dia = [data.getFullYear(), String(data.getMonth() + 1).padStart(2, '0'), String(data.getDate()).padStart(2, '0')].join('');
  return `EX-${dia}-${h.toString(16).toUpperCase().padStart(4, '0')}`;
}

function atualizarProgresso(f) {
  PILARES.forEach(p => {
    const feitas = p.perguntas.filter(q => f.respostas[q.id] !== undefined);
    document.querySelectorAll(`#trilha [data-pilar="${p.id}"] i`).forEach((pip, i) => pip.classList.toggle('feita', i < feitas.length));
    const caixa = $(`nota-${p.id}`);
    const completo = feitas.length === p.perguntas.length;
    const estavaOculta = caixa.hidden;
    caixa.hidden = !completo;
    const num = caixa.querySelector('[data-num]');
    const barra = caixa.querySelector('i');
    if (!completo) { num.dataset.valor = 0; barra.style.width = '0'; return; }
    const pontos = p.perguntas.reduce((soma, q) => soma + f.respostas[q.id], 0);
    const nota = Math.round(pontos / (3 * p.perguntas.length) * 100);
    contar(num, nota, estavaOculta ? { de: 0 } : {});
    requestAnimationFrame(() => { barra.style.width = `${nota}%`; });
  });
  document.querySelectorAll('#fantasma-linhas li').forEach(li => li.classList.toggle('aberta', f.respostas[li.dataset.q] !== undefined));
}

function atualizar() {
  const f = lerFicha();
  const falta = pendencias(f);
  const respondidas = Object.keys(f.respostas).length;
  const completa = falta.length === 0;
  const primeira = completa && $('laudo').hidden;

  atualizarProgresso(f);
  $('btn-ver').hidden = !completa;
  document.querySelector('.painel').classList.toggle('completa', completa);
  $('laudo').hidden = !completa;
  $('laudo-acoes').hidden = !completa;
  $('laudo-vazio').hidden = completa;

  if (!completa) {
    $('status-texto').textContent = `${respondidas} de ${TOTAL} perguntas respondidas`;
    $('laudo-vazio-texto').textContent = `Falta preencher: ${juntar(falta)}.`;
    estagioAnterior = null;
    return;
  }
  const r = calcular(f.respostas);
  $('status-texto').textContent = `Laudo emitido: ${r.geral}%, ${r.estagio.nome}`;
  renderizarLaudo(f, r, primeira);
}

function renderizarLaudo(f, r, primeira) {
  const folha = $('laudo');
  if (primeira && !semMovimento) {
    folha.classList.add('revelando');
    clearTimeout(folha._fim);
    folha._fim = setTimeout(() => folha.classList.remove('revelando'), 2200);
  }
  const ctx = { setor: f.setor, porte: f.porte, software: f.software };
  const agora = new Date();
  const modelo = MODELOS[f.software];

  $('l-protocolo').textContent = protocolo(f, agora);
  $('l-data').textContent = agora.toLocaleDateString('pt-BR');
  $('titulo-laudo').textContent = f.empresa;
  $('l-identificacao').textContent = `${SETORES[f.setor].nome}, ${PORTES[f.porte].toLowerCase()} colaboradores, software ${SOFTWARES[f.software].toLowerCase()}`;
  contar($('l-geral'), r.geral, primeira ? { de: 0, atraso: 650, duracao: 800 } : {});
  $('l-estagio').textContent = r.estagio.nome;
  $('l-resumo').textContent = r.estagio.resumo;

  const carimbo = $('l-carimbo');
  carimbo.style.setProperty('--tinta-carimbo', r.estagio.cor);
  if (estagioAnterior !== r.estagio.nome) {
    carimbo.classList.remove('batendo');
    void carimbo.offsetWidth;
    carimbo.classList.add('batendo');
    estagioAnterior = r.estagio.nome;
  }

  const trava = $('l-trava');
  trava.hidden = r.riscos.length === 0;
  if (r.riscos.length) {
    const nomes = r.riscos.map(q => ({ backup: 'falta de backup', acesso: 'senhas compartilhadas', lgpd: 'dados pessoais em IAs públicas' }[q.id]));
    trava.textContent = `Risco crítico: ${juntar(nomes)}. ` + (r.travado
      ? `Pela nota, a empresa seria classificada acima de Em Transição, mas ${r.riscos.length > 1 ? 'esses riscos limitam' : 'esse risco limita'} o estágio até a correção.`
      : `Resolva ${r.riscos.length > 1 ? 'esses pontos' : 'esse ponto'} antes de qualquer outro investimento.`);
  }

  $('l-tabela').innerHTML = r.pilares.map(p => `
    <tr class="border-t border-linha">
      <td class="py-2.5 pr-3"><span class="font-semibold">${esc(p.curto)}</span><div class="barra-nota mt-1.5"><i data-nota="${p.nota}" style="width:${primeira ? 0 : barrasAnteriores[p.id] ?? p.nota}%"></i></div></td>
      <td class="py-2.5 pr-4 text-right tabular-nums font-bold text-lg">${p.nota}%</td>
      <td class="py-2.5">${prioridadeDoPilar(p.nota)}</td>
    </tr>`).join('');
  r.pilares.forEach(p => { barrasAnteriores[p.id] = p.nota; });
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll('#l-tabela i').forEach(i => { i.style.width = `${i.dataset.nota}%`; });
  }));

  const notas = r.pilares.map(p => p.nota);
  const maior = Math.max(...notas), menor = Math.min(...notas);
  const comNota = n => juntar(r.pilares.filter(p => p.nota === n).map(p => p.curto));
  $('l-destaque').textContent = maior === menor
    ? 'Os quatro pilares estão no mesmo patamar, sem um gargalo isolado.'
    : `Ponto mais forte: ${comNota(maior)} (${maior}%). Principal gargalo: ${comNota(menor)} (${menor}%).`;

  const pendentes = r.acoes.filter(a => a.nivel < 3).slice(0, 3);
  $('l-prioridades').innerHTML = pendentes.length
    ? pendentes.map((a, i) => `
      <li class="flex gap-3 py-2.5 border-t border-linha">
        <span class="titulo-largo text-2xl leading-none text-carimbo w-5 flex-none">${i + 1}</span>
        <span class="grow"><span class="font-semibold${i === 0 ? ' marca-texto' : ''}">${esc(a.q.rec[a.nivel].t)}</span><span class="block text-sm text-grafite">${esc(a.q.pilarCurto)}, ${esc(a.prazo.toLowerCase())}</span></span>
      </li>`).join('')
    : '<li class="py-2.5 border-t border-linha">Nenhuma pendência. Siga as ações de manutenção de cada pilar.</li>';

  const primeiraAcao = document.querySelector('#l-prioridades .marca-texto');
  if (primeiraAcao) marcar(primeiraAcao);

  $('l-modelo-titulo').textContent = `Modelo de nuvem indicado: ${modelo.sigla}`;
  $('l-modelo').textContent = modelo.texto;

  $('l-plano').innerHTML = PILARES.map(p => {
    const nota = r.pilares.find(x => x.id === p.id).nota;
    const nota_setor = SETORES[f.setor].notas[p.id];
    const itens = r.acoes.filter(a => a.q.pilar === p.id);
    return `
      <div class="mt-7">
        <h4 class="titulo-largo text-xl flex justify-between gap-4 border-b border-tinta pb-1 sem-quebra"><span>${esc(p.nome)}</span><span class="tabular-nums">${nota}%</span></h4>
        ${nota_setor ? `<p class="texto-laudo mt-3 italic">${esc(nota_setor)}</p>` : ''}
        ${itens.map(a => {
          const rec = a.q.rec[a.nivel];
          return `<div class="mt-4 sem-quebra">
            <p class="font-semibold text-[17px] leading-snug">${esc(rec.t)} <span class="font-normal text-sm text-grafite whitespace-nowrap">(${esc(a.prazo.toLowerCase())})</span></p>
            <p class="texto-laudo mt-0.5">${esc(rec.d(ctx))}</p>
          </div>`;
        }).join('')}
      </div>`;
  }).join('');

  desenharGrafico(r);
}

function desenharGrafico(r) {
  if (typeof Chart === 'undefined') {
    $('grafico').parentElement.hidden = true;
    $('grafico-legenda').hidden = true;
    $('grafico-falhou').hidden = false;
    return;
  }
  const notas = r.pilares.map(p => p.nota);
  const rotulos = r.pilares.map(p => [p.eixo, `${p.nota}%`]);
  if (grafico) {
    grafico.data.labels = rotulos;
    grafico.data.datasets[0].data = notas;
    grafico.update();
    return;
  }
  grafico = new Chart($('grafico'), {
    type: 'radar',
    data: {
      labels: rotulos,
      datasets: [
        { label: 'Sua empresa', data: notas, borderColor: '#2742C8', backgroundColor: 'rgba(39,66,200,.14)', borderWidth: 2.5, pointRadius: 4, pointHoverRadius: 7, pointHitRadius: 18, pointBackgroundColor: '#2742C8', pointBorderColor: '#FCFDFB', pointBorderWidth: 2 },
        { label: 'Patamar Conectada', data: r.pilares.map(() => PATAMAR), borderColor: '#6F8488', borderWidth: 2, borderDash: [4, 3], pointRadius: 0, pointHitRadius: 0, fill: false }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: semMovimento ? 0 : 650, easing: 'easeOutQuart' },
      scales: {
        r: {
          min: 0, max: 100,
          ticks: { stepSize: 25, display: false },
          grid: { color: '#D5E0DB' },
          angleLines: { color: '#D5E0DB' },
          pointLabels: { color: '#12343B', font: { family: 'Archivo', size: 13, weight: '600' } }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          filter: i => i.datasetIndex === 0,
          displayColors: false,
          backgroundColor: '#12343B',
          titleFont: { family: 'Archivo' }, bodyFont: { family: 'Archivo' },
          callbacks: { label: i => `Nota: ${i.raw}%` }
        }
      }
    }
  });
}

function aplicarFicha(d) {
  $('empresa').value = d.empresa;
  $('setor').value = d.setor;
  $('porte').value = d.porte;
  $('software').value = d.software;
  Object.entries(d.respostas).forEach(([id, nivel]) => {
    document.querySelector(`input[name="${id}"][value="${nivel}"]`).checked = true;
  });
  atualizar();
}

montarFormulario();
$('ficha').addEventListener('input', atualizar);
$('ficha').addEventListener('change', atualizar);
$('ficha').addEventListener('submit', e => e.preventDefault());
$('btn-demo').addEventListener('click', () => {
  aplicarFicha(DEMO);
  $('secao-laudo').scrollIntoView();
});
$('btn-limpar').addEventListener('click', () => {
  $('ficha').reset();
  atualizar();
});
$('btn-imprimir').addEventListener('click', () => window.print());
atualizar();

/* Abertura: nota de exemplo, marca-texto e inclinação da folha com o ponteiro */
contar($('vit-num'), 38, { de: 0, atraso: 1050, duracao: 800 });
setTimeout(() => $('vit-marca').classList.add('marcada'), semMovimento ? 0 : 2500);
if (!semMovimento && window.matchMedia('(hover: hover)').matches) {
  const abertura = $('abertura');
  const folhaExemplo = $('vit-folha');
  abertura.addEventListener('pointermove', e => {
    const caixa = abertura.getBoundingClientRect();
    folhaExemplo.style.setProperty('--ry', `${((e.clientX - caixa.left) / caixa.width - .5) * 9}deg`);
    folhaExemplo.style.setProperty('--rx', `${((e.clientY - caixa.top) / caixa.height - .5) * -7}deg`);
  });
  abertura.addEventListener('pointerleave', () => {
    folhaExemplo.style.setProperty('--ry', '0deg');
    folhaExemplo.style.setProperty('--rx', '0deg');
  });
}
