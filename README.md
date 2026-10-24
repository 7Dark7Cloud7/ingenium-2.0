# Ingenium 2.0

Plataforma de estudo **local-first** para mecatrónica: Matemática, Física,
Química e ALGA (Álgebra Linear e Geometria Analítica). Site estático — sem
build, sem backend, sem contas.

**App publicada:** https://ingenium-2-0.vercel.app
**Criado pelos irmãos Bulezi** — Rafael Bulezi & Afonso Bulezi.

## Porquê

O objetivo do Ingenium é explicar bem: que o aluno entenda o conceito, veja
onde ele aparece na vida real e consiga demonstrar que aprendeu. Por isso cada
resumo não fica numa lista — abre explicação, mundo real, mapa mental, cartões,
métodos de estudo, teste e áudio.

## O que faz

### Resumos (colar → aprender)

Cola o teu texto (mínimo 120 caracteres) e o Ingenium lê-o de forma
determinística, citando sempre a frase de origem:

- **Explicação** — ideia central, ideias-chave, definições, estrutura e
  critérios de cobertura (definições, exemplos, quantidades, ligações causais,
  fecho) com o que ainda falta;
- **Mundo real** — aplicações, analogias e erros comuns por conceito, mais a
  ligação a artigos da Wikipédia;
- **Mapa** — mapa mental gerado das tuas frases, exportável em SVG;
- **Cartões** — definição, completar frases e flashcards com a frase-fonte;
- **Métodos** — recordação ativa, repetição espaçada, palácio da memória e
  intercalação, com calendário de revisões;
- **Teste** — escolha múltipla gerada só a partir do texto colado;
- **Áudio** — a explicação ouvida como aula, com secções, progresso e
  velocidade; usa a voz já instalada no dispositivo.

Não é IA generativa: não inventa factos nem chama serviços de IA. Se o texto
for insuficiente para um teste fiável, diz isso em vez de gerar perguntas fracas.

### Laboratório 3D prático

Cada resumo abre um cenário 3D (Canvas 2D com projeção própria) escolhido pela
matéria, para ver a aplicação em vez de uma imagem decorativa:

| Matéria | Cenário |
|---|---|
| ALGA / Matemática linear | braço robótico a transformar vetores |
| Física | drone com trajetória parabólica |
| Química | molécula de água e ligações |
| Matemática | sucessões e crescimento |
| Geral | sistema de ideias ligadas |

Arrasta para rodar, setas para inclinar, toca num nó para ver a aplicação
prática. As legendas deixam de se sobrepor e são suprimidas em ecrã pequeno.

### Turma (hub de sala de aula)

Cria uma turma com código de convite e partilha com os colegas no mesmo
dispositivo/importando o pacote de turma:

- **Avisos** do professor(a), com tipo, data e fixar;
- **Materiais** (notas, provas antigas, ficheiros de apoio) com texto extraído;
- **Programa** — datas e avaliações da turma;
- **Grupos de estudo** privados por omissão, com tópico, local, hora e lotação;
- **Colegas** com papel de estudante ou professor(a);
- **Pacote de turma** `.json` para exportar e importar (dedupe por id/hash).

O número de estudante é autodeclarado: nada valida credenciais institucionais.
Os resumos pessoais nunca entram no pacote de turma.

### Modo aula / projetor

Apresenta um resumo em slides (16:9), com o cenário 3D como slide, setas para
avançar e Escape para sair.

### Plano de estudo

Cola o calendário do semestre, uma linha por item:

```text
ALGA — Álgebra Linear
Terça 08:00-10:00 Sala 12
Exame de Física — 05/11/2026 às 09:00
Entrega do relatório de Química: 30/10/2026 às 23:59
Prova de Matemática 12 de novembro de 2026
```

Aceita `dd/mm/aaaa`, `aaaa-mm-dd`, «12 de novembro de 2026», `hoje` e `amanhã`;
o horário semanal aceita o dia da semana em qualquer posição; uma disciplina
escrita só como título etiqueta as linhas seguintes. O plano separa avaliações
de aulas semanais, cruza as datas com as lições por concluir, distribui
revisão/prática/revisão final, marca sessões feitas e exporta `.ics` com
eventos, aulas recorrentes e lembretes de 15 minutos. Sem datas, usa um
percurso de reserva baseado nas lições por concluir.

### Importar PDF e fotos

PDFs e imagens (PNG/JPEG/WebP) são lidos no navegador: texto nativo com pdf.js
e OCR local com tesseract.js (`por+eng`) para páginas digitalizadas. Limites:
20 MB por ficheiro, 30 páginas, 10 páginas de OCR, 20 000 caracteres. O ficheiro
nunca é enviado — só as bibliotecas são carregadas de CDN (precisa de internet
na primeira utilização).

## Privacidade e limites

- Resumos, turma, programa, progresso, tema e voz ficam **só no `localStorage`
  deste navegador** (chave principal `ingenium2-kinematics-v1`).
- **Não há sincronização automática entre dispositivos**, nem contas, nem
  servidor, nem telemetria. Partilhar = exportar/importar o pacote `.json`.
- A UI nunca promete contas, sincronização ou verificação institucional.
- Grupos de estudo são privados por omissão e sem visibilidade entre grupos.
- Limite de 40 resumos guardados (os mais antigos saem).
- Datas lidas são apoio de organização — confirma sempre na plataforma da escola.
- Prática nunca é nota oficial; o «professor(a)» num pacote local não é
  verificação de identidade.
- Em projetor e telemóvel tudo foi verificado a 390×844 sem overflow horizontal.
- Interface em português e inglês; tema **clássico** (papel/cal/lima, o
  original) por omissão e tema **roxo** alternável, ambos com contraste AA
  auditado.

## Correr localmente

```bash
cd ingenium-2.0
npm start          # http://127.0.0.1:4173/ (PORT=xxxx para mudar)
```

Não há dependências nem passo de build — `serve.mjs` é só um servidor estático
com `no-store` para desenvolvimento.

## Testes

```bash
node --test              # 57 testes
```

Cobrem os motores determinísticos: resumos (definições, cartões, quiz,
cobertura, ligações), plano (datas, cabeçalhos de disciplina, horário semanal,
sessões, `.ics`), motor de turma (papéis, dedupe de pacotes), importação de
ficheiros (validação, limpeza de texto, hifenização portuguesa) e métodos de
estudo.

## Estrutura

```text
site/
  index.html            entrada estática + arranque do tema sem flash
  styles.css            sistema visual paper/ink/lime (clássico)
  classroom.css         hub de turma e modo aula
  audio.css             leitor de aulas em áudio
  study-lab.css         painel do laboratório 3D
  theme.css             overrides do tema roxo e continuidade clássica
  vercel.json           outputDirectory "." + cache-control
  src/
    main.js             estado, rotas hash, eventos e renderização
    content/            cinemática, ALGA, sequências, ficha de exercícios,
                        níveis de prática e ferramentas de estudo
    study/
      summary-engine.js   análise determinística de resumos
      concept-lens.js     analogias, aplicações e erros comuns
      wiki-lens.js        ligações a artigos da Wikipédia
      learning-methods.js recordação ativa, espaçamento, palácio da memória
      planner-engine.js   datas, plano adaptativo e exportação .ics
      classroom-engine.js turma, avisos, materiais, grupos, pacotes
      file-import.js      pdf.js + tesseract.js, limites e limpeza
      summary-thread.js   continuidade entre resumos
    ui/                 páginas (resumos, plano, turma, apresentação,
                        disciplinas), laboratório 3D, mapa mental,
                        aula em áudio e ícones
tests/                  57 testes dos motores (node:test)
tools/make-fixture-pdf.py  gera fixtures de PDF para teste
fixtures/               PDF de exemplo usado na verificação de importação
serve.mjs               servidor estático local
```

## Deploy

O projeto é 100% estático. Em `site/`, `vercel.json` define
`outputDirectory: "."` e `cache-control: no-store` para HTML, CSS e `src/` — as
alterações aparecem no primeiro carregamento seguinte. As rotas são por hash
(`#summaries`, `#planner`, `#classroom`, `#present/<id>`), por isso não precisam
de rewrites.

```bash
cd ingenium-2.0/site
vercel --prod      # a partir da pasta site/
```

## Nota sobre o código-fonte

Este repositório é a fonte da app publicada em
`ingenium-2-0.vercel.app`. Publicar = fazer push e depois deploy a partir de
`site/`.
