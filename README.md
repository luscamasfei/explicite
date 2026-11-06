# 🚀 Explicite — Consultoria em Transformação Digital

🔗 **Acesse o Aplicativo Online (GitHub Pages):** [Clique aqui para abrir o App](https://luscamasfei.github.io/explicite/)

## 👥 Especialistas Responsáveis (Autores)
- **Lucas Maffei**
- **Unidade Curricular:** Exploração Digital e Fundamentos Tecnológicos (Objetos de Conhecimento 05 e 06)

---

## 🎯 1. O Problema Empresarial e Objetivo do Aplicativo

Pequenas e médias empresas sabem que precisam modernizar a operação, mas não sabem por onde começar: mantêm um computador comum como servidor, controlam vendas em planilhas soltas, usam IA sem método e compartilham senhas. O Explicite é a **Opção B, Diagnóstico 360º de Maturidade Digital**. Com 8 perguntas, ele calcula o Índice de Maturidade Digital (0 a 100%), classifica a empresa em um de quatro estágios (Iniciante, Em Transição, Conectada ou Líder Digital) e emite um laudo com um plano de ação priorizado.

## 🏛 2. Os 4 Pilares de Boas Práticas Aplicados no Diagnóstico

- **☁ Infraestrutura e Migração para a Nuvem:** avalia onde os sistemas rodam e como é feito o backup. Indica SaaS, PaaS ou IaaS conforme o tipo de software da empresa (de mercado, sob medida ou legado) e recomenda backup 3-2-1, teste de restauração, redundância de link e FinOps.
- **🔄 Sistemas Empresariais (ERP/CRM) e Fluxo de Dados:** avalia a integração entre as áreas e o uso de indicadores. Orienta a saída das planilhas, a integração de CRM e ERP por API, a fonte única de dados e os dashboards gerenciais.
- **🤖 IA Generativa e Automação No-Code:** avalia o tratamento de tarefas repetitivas e o uso de IA pela equipe. Orienta o mapeamento de gargalos, os pilotos com ganho medido e a revisão humana (human-in-the-loop) contra alucinações.
- **🛡 Governança, Ética e Segurança Digital (LGPD):** avalia o controle de acesso e o tratamento de dados pessoais. Recomenda MFA, menor privilégio, política de uso de IA, anonimização e adequação à LGPD, com ajustes para setor e porte.

### Regras do motor de cálculo

| Regra | Como funciona |
| :--- | :--- |
| Pontuação | Cada resposta vale de 0 a 3 pontos. Pilar = soma das 2 perguntas ÷ 6. Índice geral = soma das 8 perguntas ÷ 24. |
| Estágios | Iniciante até 34%, Em Transição de 35% a 59%, Conectada de 60% a 84%, Líder Digital a partir de 85%. |
| Trava de risco | Sem backup, com senhas compartilhadas ou com dados pessoais em IA pública, o estágio fica limitado a Em Transição, seja qual for a nota. |
| Prioridade das ações | Peso = pontos que faltam na pergunta, em dobro nas perguntas críticas (backup, acesso e LGPD). Peso 4 ou mais: até 30 dias. Peso 2 ou 3: 30 a 90 dias. Peso 1: 90 a 180 dias. |
| Personalização | O texto muda conforme a resposta de cada pergunta, o setor, o número de colaboradores e o tipo de software. |

### Requisitos atendidos

| Requisito | Implementação |
| :--- | :--- |
| RF01 Identificação | Nome, setor, colaboradores e software principal. |
| RF02 Coleta por pilares | 8 perguntas, 2 por pilar. |
| RF03 Motor de score | Nota geral e sub-notas em JavaScript, sem recarregar a página. |
| RF04 Dashboard | Gráfico radar (Chart.js) e tabela de notas por pilar. |
| RF05 Laudo | Plano de boas práticas gerado a partir das respostas. |
| RF06 Demo e exportação | Botões "Carregar caso exemplo" e "Imprimir / salvar laudo em PDF" (`window.print()`). |
| RNF01 Single-file | Tudo em `index.html`, com Tailwind e Chart.js por CDN. |
| RNF02 Responsivo | Layout testado em computador e celular. |
| RNF03 Privacy by Design | Nada é enviado nem salvo. O aviso está no rodapé. |
| RNF04 Documentação | Este arquivo. |

## 🛠 3. IAs Generativas e Ferramentas Utilizadas

| Ferramenta / IA | Como foi utilizada no projeto |
| :--- | :--- |
| **Claude Code (Claude Opus 5.5)** | Leitura dos PDFs da aula, definição das perguntas, pesos e regras de negócio, redação das recomendações, geração do código HTML/JS, testes automatizados e rascunho deste README. |
| **TailwindCSS & Chart.js (CDN)** | Estilização responsiva e gráfico radar dinâmico de maturidade. |
| **GitHub & GitHub Pages** | Versionamento de código e publicação em nuvem estática (PaaS/CDN). |

## 🧠 4. Diário de Construção: Como Construímos e Refinamos o App

1. **Concepção e Engenharia de Prompt:** em vez de digitar um prompt, enviamos à IA os dois PDFs da aula (apresentação e guia de requisitos), que incluem o Prompt Mestre. A IA escolheu a Opção B por ser a que o Prompt Mestre descreve e foi além dele em três pontos: a trava de risco, a indicação de SaaS, PaaS ou IaaS pelo tipo de software e as recomendações por setor e porte.
2. **Ajustes e Refinamentos Técnicos:** durante a construção, pedimos para renomear o aplicativo com o prompt `O nome do aplicativo tem que ser "Explicite"`. Com isso, mudaram o título, o logo, o carimbo do laudo e o prefixo do protocolo. Depois da primeira publicação, pedimos `Deixe o site o mais bonito possível utilizando CSS e JavaScript`. A IA criou um conceito visual ligado ao nome do app: tarjas que se abrem a cada resposta, marca-texto, carimbo com textura de tinta e contagem animada das notas, respeitando quem prefere menos movimento. Os testes automatizados em navegador conferiram os cálculos, a trava de risco, a atualização do laudo e a versão para impressão.
3. **Principal Aprendizado:** _[Preencher com o seu aprendizado pessoal sobre Transformação Digital, Nuvem e IA.]_
