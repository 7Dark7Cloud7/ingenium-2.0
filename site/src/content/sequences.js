const bi = (pt, en) => ({ pt, en });

export const sequencesModule = {
  id: "sequences",
  icon: "route",
  title: bi("Matemática · Sucessões", "Mathematics · Sequences"),
  description: bi("Do primeiro padrão à resolução autónoma de exercícios, passo a passo.", "From the first pattern to solving exercises independently, one step at a time."),
  lessonIds: [
    "sequence-basics", "sequence-patterns", "sequence-terms", "sequence-finite-infinite",
    "sequence-types", "arithmetic-sequences", "sequence-general-term", "sequence-notebook-formula",
    "sequence-decreasing", "sequence-fractions", "sequence-geometric", "sequence-method", "sequence-checkpoint"
  ]
};

const makeLesson = ({id, title, kicker, duration=7, analogy, concept, formula, diagramType="sequence-basics", diagramTitle, diagramCaption, sections, prompt, steps, answer, question, options, correct, why, exercise, hint}) => ({
  id, module:"sequences", duration, title:bi(title[0],title[1]), kicker:bi(kicker[0],kicker[1]),
  analogy:bi(analogy[0],analogy[1]), concept:bi(concept[0],concept[1]), formula:bi(formula[0],formula[1]),
  diagram:{type:diagramType,title:bi(diagramTitle[0],diagramTitle[1]),caption:bi(diagramCaption[0],diagramCaption[1])},
  sections:sections.map(s=>({heading:bi(s[0][0],s[0][1]),body:bi(s[1][0],s[1][1])})),
  example:{prompt:bi(prompt[0],prompt[1]),steps:steps.map(s=>bi(s[0],s[1])),answer:bi(answer[0],answer[1])},
  check:{question:bi(question[0],question[1]),options:options.map(o=>bi(o[0],o[1])),correct,why:bi(why[0],why[1])},
  exercise:bi(exercise[0],exercise[1]), hint:hint ? bi(hint[0],hint[1]) : undefined
});

export const sequenceLessons = [
  makeLesson({
    id:"sequence-basics", title:["O que é uma sucessão?","What is a sequence?"], kicker:["LIÇÃO 1 · COMEÇAR DO ZERO","LESSON 1 · START FROM ZERO"], duration:6,
    analogy:["Imagina que tens blocos de construção. Pões um, depois outro, depois outro. A ordem importa: o primeiro bloco não é o terceiro. Uma sucessão é parecida com uma fila organizada de números.","Imagine you have building blocks. You place one, then another, then another. The order matters: the first block is not the third. A sequence is like an organised row of numbers."],
    concept:["Uma sucessão é uma lista ordenada de termos. Muitas vezes, os números seguem uma regra.","A sequence is an ordered list of terms. Often, the numbers follow a rule."],
    formula:["2, 4, 6, 8, 10","2, 4, 6, 8, 10"], diagramType:"sequence-basics",
    diagramTitle:["Uma fila, em ordem","A row, in order"], diagramCaption:["Cada número ocupa uma posição própria.","Every number occupies its own position."],
    sections:[
      [["Olha para os blocos","Look at the blocks"],["Imagina cinco blocos alinhados e numerados de 1 a 5. Lê-os da esquerda para a direita: primeiro, segundo, terceiro, quarto, quinto. A ordem faz parte da informação.","Imagine five blocks lined up and numbered 1 to 5. Read them from left to right: first, second, third, fourth, fifth. The order is part of the information."]],
      [["Agora, troca os blocos por números","Now replace the blocks with numbers"],["Vê esta sucessão: 2, 4, 6, 8, 10. Os números não estão ao acaso: cada um é 2 unidades maior do que o anterior. Noutra sucessão, 5, 10, 15, 20, a regra seria adicionar 5.","Look at this sequence: 2, 4, 6, 8, 10. The numbers are not random: each is 2 greater than the one before. In another sequence, 5, 10, 15, 20, the rule would be to add 5."]],
      [["A grande ideia","The big idea"],["Uma sucessão é uma lista ordenada. Uma regra pode dizer-nos como os termos são escolhidos. Vamos descobrir como encontrar essas regras, sem tentar decorar tudo de uma vez.","A sequence is an ordered list. A rule can tell us how its terms are chosen. We will learn how to find those rules instead of trying to memorise everything at once."]]
    ],
    prompt:["Na lista 1, 2, 3, 4, 5, o que torna esta lista uma sucessão?","In the list 1, 2, 3, 4, 5, what makes it a sequence?"],
    steps:[["Os números estão organizados numa ordem.","The numbers are arranged in an order."],["Cada número ocupa um lugar na lista; a regra aqui é adicionar 1.","Each number has a place in the list; the rule here is to add 1."]],
    answer:["É uma lista ordenada de números, com uma regra simples: adicionar 1.","It is an ordered list of numbers with a simple rule: add 1."],
    question:["Qual destas opções é uma sucessão?","Which of these is a sequence?"], options:[["Um único número isolado","One isolated number"],["Uma lista ordenada de números","An ordered list of numbers"],["O sinal de multiplicação","The multiplication sign"]],correct:1,
    why:["Uma sucessão é uma lista ordenada de termos.","A sequence is an ordered list of terms."],
    exercise:["Escreve uma sucessão de cinco números em que adicionas 2 de cada vez.","Write a sequence of five numbers where you add 2 each time."],
    hint:["Podes começar em 2: 2, 4, ...","You could start at 2: 2, 4, ..."]
  }),
  makeLesson({
    id:"sequence-patterns", title:["Descobre a regra","Discover the rule"], kicker:["LIÇÃO 2 · DETETIVE DE PADRÕES","LESSON 2 · PATTERN DETECTIVE"], duration:7,
    analogy:["Vamos brincar aos detetives. Recebes algumas pistas e tens de descobrir o que acontece de um número para o seguinte.","Let's play detective. You are given a few clues and need to work out what happens from one number to the next."],
    concept:["Comparar termos vizinhos ajuda-nos a descobrir o padrão, mas nem todas as sucessões usam a mesma regra.","Comparing neighbouring terms helps reveal the pattern, but not every sequence uses the same rule."],
    formula:["3, 6, 9, 12, 15, …","3, 6, 9, 12, 15, …"],diagramType:"sequence-patterns",
    diagramTitle:["Segue os saltos","Follow the jumps"],diagramCaption:["Cada salto tem o mesmo tamanho: +3.","Each jump has the same size: +3."],
    sections:[
      [["Qual é o próximo número?","What number comes next?"],["Olha para 3, 6, 9, 12, 15, … Cada vez que avançamos, adicionamos 3. Para descobrir o próximo termo, fazemos 15 + 3 = 18.","Look at 3, 6, 9, 12, 15, … Each time we move forward, we add 3. To find the next term, calculate 15 + 3 = 18."]],
      [["Compara vizinhos","Compare neighbours"],["Calcula as diferenças: 6 − 3 = 3; 9 − 6 = 3; 12 − 9 = 3. Como a diferença se mantém, adicionar 3 é uma regra que explica os termos apresentados.","Calculate the differences: 6 − 3 = 3; 9 − 6 = 3; 12 − 9 = 3. Since the difference stays the same, adding 3 explains the terms shown."]],
      [["Nem todos os padrões somam","Not every pattern adds"],["Em 2, 4, 8, 16, cada termo é o dobro do anterior. Noutros padrões, os números podem diminuir ou alternar. Com poucos termos pode haver mais do que uma regra possível; procuramos a regra pretendida pelo exercício.","In 2, 4, 8, 16, each term is double the previous one. Other patterns can decrease or alternate. With only a few terms, more than one rule may fit; we look for the rule intended by the exercise."]]
    ],
    prompt:["Descobre a regra e o próximo termo: 4, 7, 10, 13, …","Find the rule and next term: 4, 7, 10, 13, …"],
    steps:[["7 − 4 = 3, 10 − 7 = 3 e 13 − 10 = 3.","7 − 4 = 3, 10 − 7 = 3, and 13 − 10 = 3."],["A regra é adicionar 3. Portanto, 13 + 3 = 16.","The rule is to add 3. Therefore, 13 + 3 = 16."]],
    answer:["Adicionar 3; o próximo termo é 16.","Add 3; the next term is 16."],
    question:["O que vem a seguir: 3, 6, 9, 12, …?","What comes next: 3, 6, 9, 12, …?"],options:[["14","14"],["15","15"],["18","18"]],correct:1,
    why:["O salto é +3, por isso 12 + 3 = 15.","The jump is +3, so 12 + 3 = 15."],
    exercise:["Indica a regra e os dois termos seguintes: 20, 17, 14, 11, …","State the rule and the next two terms: 20, 17, 14, 11, …"],
    hint:["Compara cada termo com o seguinte: a diferença é positiva ou negativa?","Compare each term with the next: is the difference positive or negative?"]
  }),
  makeLesson({
    id:"sequence-terms",title:["O que é um termo?","What is a term?"],kicker:["LIÇÃO 3 · DAR NOME ÀS PARTES","LESSON 3 · NAMING THE PARTS"],duration:7,
    analogy:["Pensa numa fila de lugares numerados numa sala. O lugar 3 é a posição; a pessoa sentada nele é o que encontras nessa posição. Numa sucessão, também distinguimos o lugar do número.","Think of numbered seats in a classroom. Seat 3 is the position; the person sitting there is what you find at that position. In a sequence, we also distinguish the place from the number."],
    concept:["Cada número individual de uma sucessão é um termo. A notação a₁, a₂, a₃ indica o termo em cada posição.","Each individual number in a sequence is a term. The notation a₁, a₂, a₃ identifies the term at each position."],
    formula:["a₁ = 5   ·   a₂ = 8   ·   a₃ = 11","a₁ = 5   ·   a₂ = 8   ·   a₃ = 11"],diagramType:"sequence-basics",
    diagramTitle:["Posição e termo","Position and term"],diagramCaption:["O índice pequeno indica a posição.","The small index tells you the position."],
    sections:[
      [["Conhece a notação","Meet the notation"],["Na sucessão 5, 8, 11, 14, o primeiro termo é 5, o segundo é 8 e o terceiro é 11. Escrevemos a₁ = 5, a₂ = 8 e a₃ = 11. A letra a é uma etiqueta; o pequeno número indica qual termo queremos.","In 5, 8, 11, 14, the first term is 5, the second is 8, and the third is 11. We write a₁ = 5, a₂ = 8, and a₃ = 11. The letter a is a label; the small number tells us which term we mean."]],
      [["Não deixes a notação assustar-te","Don't let the notation scare you"],["a₃ não significa “a vezes 3” nem significa que o valor seja 3. Significa simplesmente “o termo que está na terceira posição”. É uma abreviatura para não termos de escrever uma frase inteira.","a₃ does not mean “a times 3” or that the value is 3. It simply means “the term in the third position”. It is shorthand so we do not have to write a whole sentence."]],
      [["Conta da esquerda para a direita","Count from left to right"],["A posição 1 é o primeiro termo, a posição 2 é o segundo, e assim sucessivamente. Mantém esta ordem ao ler qualquer sucessão.","Position 1 is the first term, position 2 is the second, and so on. Keep this order when reading any sequence."]]
    ],
    prompt:["Na sucessão 4, 7, 10, 13, qual é o terceiro termo?","In 4, 7, 10, 13, what is the third term?"],
    steps:[["Conta: 4 é o primeiro e 7 é o segundo.","Count: 4 is first and 7 is second."],["O terceiro é 10, logo a₃ = 10.","The third is 10, so a₃ = 10."]],
    answer:["a₃ = 10.","a₃ = 10."],
    question:["Se a₁ = 6, o que significa?","If a₁ = 6, what does it mean?"],options:[["O primeiro termo é 6","The first term is 6"],["A sucessão tem seis termos","The sequence has six terms"],["O sexto termo é 1","The sixth term is 1"]],correct:0,
    why:["O índice 1 indica a primeira posição.","The index 1 indicates the first position."],
    exercise:["Na sucessão 6, 9, 12, 15, 18, escreve a₂ e a₄.","In 6, 9, 12, 15, 18, write a₂ and a₄."],
    hint:["Conta os números a partir da esquerda; não uses o índice como valor.","Count from the left; do not use the index as the value."]
  }),
  makeLesson({
    id:"sequence-finite-infinite",title:["Posição não é valor","Position is not value"],kicker:["LIÇÃO 4 · DUAS IDEIAS DIFERENTES","LESSON 4 · TWO DIFFERENT IDEAS"],duration:6,
    analogy:["A etiqueta de uma caixa diz onde a caixa está; não diz o que está dentro dela. O número da posição funciona como uma etiqueta.","A box label tells you where the box is; it does not tell you what is inside. A position number works like a label."],
    concept:["A posição diz onde o termo está; o valor diz qual é o número nessa posição.","Position tells you where a term is; value tells you which number is at that position."],
    formula:["Posição 1 → 5   ·   Posição 2 → 8   ·   Posição 3 → 11","Position 1 → 5   ·   Position 2 → 8   ·   Position 3 → 11"],diagramType:"sequence-basics",
    diagramTitle:["Onde está? O que vale?","Where is it? What is its value?"],diagramCaption:["O terceiro termo tem posição 3 e valor 11.","The third term has position 3 and value 11."],
    sections:[
      [["Lê a tabela","Read the table"],["Na sucessão 5, 8, 11, 14, 17, a posição 5 contém o valor 17. O quinto termo não é 5: o 5 diz-nos onde olhar, e 17 é o número que encontramos.","In 5, 8, 11, 14, 17, position 5 contains the value 17. The fifth term is not 5: 5 tells us where to look, and 17 is the number we find."]],
      [["Vamos separar as duas coisas","Let's separate the two things"],["Posição = lugar na lista. Valor = número nesse lugar. Esta diferença torna-se muito importante quando começamos a usar fórmulas como aₙ, em que n representa uma posição.","Position = place in the list. Value = number at that place. This distinction becomes important when we use formulas such as aₙ, where n represents a position."]],
      [["Testa a ideia","Test the idea"],["Na sucessão 2, 5, 8, 11, o terceiro termo tem posição 3, mas o valor é 8. Primeiro identifica o lugar; depois lê o número que está lá.","In 2, 5, 8, 11, the third term has position 3, but its value is 8. First identify the place; then read the number there."]]
    ],
    prompt:["Na sucessão 5, 8, 11, 14, 17, qual é o valor do quinto termo?","In 5, 8, 11, 14, 17, what is the value of the fifth term?"],
    steps:[["O quinto termo está na posição 5.","The fifth term is at position 5."],["O número nessa posição é 17.","The number at that position is 17."]],
    answer:["Posição: 5. Valor: 17.","Position: 5. Value: 17."],
    question:["Na sucessão 2, 5, 8, 11, qual é o valor do terceiro termo?","In 2, 5, 8, 11, what is the value of the third term?"],options:[["3","3"],["8","8"],["11","11"]],correct:1,
    why:["Contando os termos, o terceiro número é 8.","Counting the terms, the third number is 8."],
    exercise:["Cria uma tabela com a posição e o valor para 10, 20, 30, 40.","Create a table with position and value for 10, 20, 30, 40."],
    hint:["A posição começa em 1, mesmo que o primeiro valor seja 10.","Position starts at 1, even if the first value is 10."]
  }),
  makeLesson({
    id:"sequence-types",title:["Uma sucessão pode parar ou continuar","A sequence can stop or continue"],kicker:["LIÇÃO 5 · FINITA OU INFINITA","LESSON 5 · FINITE OR INFINITE"],duration:6,
    analogy:["Uma lista de alunos presentes hoje tem um último nome. A contagem dos números naturais, por outro lado, não tem um último número: podes sempre continuar.","A list of students present today has a final name. Counting natural numbers has no final number: you can always continue."],
    concept:["Uma sucessão finita tem um número limitado de termos; uma sucessão infinita continua sem um último termo.","A finite sequence has a limited number of terms; an infinite sequence continues without a final term."],
    formula:["Finita: 2, 4, 6, 8   ·   Infinita: 2, 4, 6, 8, …","Finite: 2, 4, 6, 8   ·   Infinite: 2, 4, 6, 8, …"],diagramType:"sequence-patterns",
    diagramTitle:["O significado de …","What … means"],diagramCaption:["As reticências significam “e assim sucessivamente”.","The ellipsis means “and so on”."],
    sections:[
      [["Sucessão finita","Finite sequence"],["Uma sucessão finita tem um número limitado de termos. Por exemplo, 2, 4, 6, 8 tem quatro termos se a lista terminar aí. Podemos contar todos os termos.","A finite sequence has a limited number of terms. For example, 2, 4, 6, 8 has four terms if the list ends there. We can count every term."]],
      [["Sucessão infinita","Infinite sequence"],["A sucessão 2, 4, 6, 8, … pode continuar sem fim, adicionando 2. Os três pontos, chamados reticências, indicam “e assim sucessivamente”. Não precisamos de escrever todos os termos para mostrar que a regra continua.","The sequence 2, 4, 6, 8, … can continue forever by adding 2. The three dots, called an ellipsis, mean “and so on”. We do not need to write every term to show the rule continues."]],
      [["As reticências não são uma regra por si só","The ellipsis is not a rule by itself"],["Os três pontos indicam que há mais termos, mas a regra tem de ser entendida pelo contexto ou dada no exercício. Com poucos números, várias regras podem encaixar nos mesmos termos apresentados.","The dots indicate more terms, but the rule must be understood from context or given in the exercise. With only a few numbers, several rules can fit the terms shown."]]
    ],
    prompt:["A lista 1, 2, 3, 4 termina aí. Como a classificamos?","The list 1, 2, 3, 4 ends there. How do we classify it?"],
    steps:[["A lista apresenta quatro termos e diz que termina.","The list shows four terms and says it ends."],["Tem um número limitado de termos, por isso é finita.","It has a limited number of terms, so it is finite."]],
    answer:["É uma sucessão finita.","It is a finite sequence."],
    question:["O que significam os três pontos em 5, 10, 15, …?","What do the three dots mean in 5, 10, 15, …?"],options:[["A resposta é sempre zero","The answer is always zero"],["A lista continua segundo a regra pretendida","The list continues according to the intended rule"],["A sucessão tem exatamente três termos","The sequence has exactly three terms"]],correct:1,
    why:["As reticências querem dizer “e assim sucessivamente”.","The ellipsis means “and so on”."],
    exercise:["Dá um exemplo de uma sucessão finita e outro de uma infinita.","Give one example of a finite sequence and one of an infinite sequence."],
    hint:["Uma pode terminar após quatro termos; a outra pode continuar com reticências.","One can end after four terms; the other can continue with an ellipsis."]
  }),
  makeLesson({
    id:"arithmetic-sequences",title:["Três tipos comuns de sucessões","Three common types of sequences"],kicker:["LIÇÃO 6 · RECONHECER PADRÕES","LESSON 6 · RECOGNISE PATTERNS"],duration:8,
    analogy:["Pensa em três instruções diferentes: “adiciona 3”, “multiplica por 2” e “aumenta o denominador”. Cada instrução cria um padrão diferente.","Think of three different instructions: “add 3”, “multiply by 2”, and “increase the denominator”. Each instruction creates a different pattern."],
    concept:["Sucessões aritméticas mantêm a mesma diferença; sucessões geométricas mantêm o mesmo fator multiplicativo; outras regras podem produzir frações.","Arithmetic sequences keep the same difference; geometric sequences keep the same multiplication factor; other rules can produce fractions."],
    formula:["Aritmética: 2, 5, 8, 11   ·   Geométrica: 2, 4, 8, 16   ·   Frações: 1, 1/2, 1/3, 1/4","Arithmetic: 2, 5, 8, 11   ·   Geometric: 2, 4, 8, 16   ·   Fractions: 1, 1/2, 1/3, 1/4"],diagramType:"arithmetic-sequence",
    diagramTitle:["Três regras, três resultados","Three rules, three results"],diagramCaption:["Observa o que muda de um termo para o seguinte.","Notice what changes from one term to the next."],
    sections:[
      [["Tipo 1: aritmética","Type 1: arithmetic"],["Em 2, 5, 8, 11, adicionamos 3 de cada vez. A diferença entre termos consecutivos é constante. Também podemos subtrair sempre o mesmo número, como em 13, 10, 7, 4.","In 2, 5, 8, 11, we add 3 each time. The difference between consecutive terms is constant. We can also subtract the same number each time, as in 13, 10, 7, 4."]],
      [["Tipo 2: geométrica","Type 2: geometric"],["Em 2, 4, 8, 16, multiplicamos por 2. Não adicionamos uma quantidade fixa; multiplicamos cada termo pelo mesmo fator.","In 2, 4, 8, 16, we multiply by 2. We do not add a fixed amount; we multiply each term by the same factor."]],
      [["Tipo 3: sucessões com frações","Type 3: sequences with fractions"],["Em 1, 1/2, 1/3, 1/4, o numerador mantém-se em 1 e o denominador aumenta. Nem todas as sucessões são aritméticas ou geométricas. O teu caderno também usa inteiros, números negativos e frações.","In 1, 1/2, 1/3, 1/4, the numerator stays 1 while the denominator increases. Not every sequence is arithmetic or geometric. Your notebook also uses whole numbers, negative numbers and fractions."]]
    ],
    prompt:["Qual é o tipo da sucessão 2, 4, 8, 16, …?","What type is the sequence 2, 4, 8, 16, …?"],
    steps:[["Compara termos consecutivos: 4 é 2 × 2; 8 é 4 × 2.","Compare consecutive terms: 4 is 2 × 2; 8 is 4 × 2."],["O fator é sempre 2, por isso é geométrica.","The factor is always 2, so it is geometric."]],
    answer:["É geométrica: cada termo é multiplicado por 2.","It is geometric: each term is multiplied by 2."],
    question:["Qual é uma sucessão aritmética?","Which is an arithmetic sequence?"],options:[["2, 4, 8, 16","2, 4, 8, 16"],["1, 4, 7, 10","1, 4, 7, 10"],["1, 2, 4, 7","1, 2, 4, 7"]],correct:1,
    why:["A diferença é sempre +3: 4−1, 7−4 e 10−7.","The difference is always +3: 4−1, 7−4, and 10−7."],
    exercise:["Classifica 10, 7, 4, 1 e 3, 6, 12, 24. Explica a regra de cada uma.","Classify 10, 7, 4, 1 and 3, 6, 12, 24. Explain each rule."],
    hint:["Na primeira subtrai-se 3; na segunda multiplica-se por 2.","The first subtracts 3; the second multiplies by 2."]
  }),
  makeLesson({
    id:"sequence-general-term",title:["O segredo: a fórmula do termo geral","The secret: the general-term formula"],kicker:["LIÇÃO 7 · CALCULAR QUALQUER POSIÇÃO","LESSON 7 · CALCULATE ANY POSITION"],duration:10,
    analogy:["Imagina que uma escada começa no degrau 5 e cada degrau seguinte é 3 unidades mais alto. Para chegar ao quarto degrau, sobes três vezes, não quatro. O número de saltos é sempre uma unidade menor do que a posição final.","Imagine a staircase starting at height 5, with each next step 3 units higher. To reach step four, you climb three times, not four. The number of jumps is always one less than the final position."],
    concept:["O termo geral calcula diretamente o valor de uma posição n. Numa sucessão aritmética, usamos o primeiro termo e o número de saltos.","The general term calculates the value at position n directly. In an arithmetic sequence, we use the first term and the number of jumps."],
    formula:["aₙ = a₁ + (n − 1)d","aₙ = a₁ + (n − 1)d"],diagramType:"sequence-general",
    diagramTitle:["Da posição ao valor","From position to value"],diagramCaption:["Introduz n e a regra calcula o termo.","Enter n and the rule calculates the term."],
    sections:[
      [["Porque precisamos de uma fórmula?","Why do we need a formula?"],["Na sucessão 5, 8, 11, 14, …, podemos continuar a escrever números até ao décimo termo. Mas se alguém perguntar pelo termo 100, escrever todos os anteriores demora muito. Uma fórmula dá-nos um atalho.","In 5, 8, 11, 14, …, we could keep writing numbers until the tenth term. But if someone asks for the 100th term, writing all the previous terms takes a long time. A formula gives us a shortcut."]],
      [["Construímos a regra","Let's build the rule"],["O primeiro termo é 5. Para chegar ao segundo, adicionamos 3 uma vez; para o terceiro, adicionamos 3 duas vezes; para o quarto, três vezes. Para chegar à posição n, adicionamos 3 exactamente n−1 vezes: aₙ = 5 + 3(n−1).","The first term is 5. To reach the second, we add 3 once; to reach the third, twice; to reach the fourth, three times. To reach position n, we add 3 exactly n−1 times: aₙ = 5 + 3(n−1)."]],
      [["O que significa cada símbolo?","What does each symbol mean?"],["aₙ é o termo que procuramos; a₁ é o primeiro termo; n é a posição desejada; d é a diferença comum, ou seja, o valor que adicionamos em cada salto. Não precisas de decorar as letras sem sentido: cada uma representa uma parte da história.","aₙ is the term we want; a₁ is the first term; n is the desired position; d is the common difference, the amount added at each jump. Do not memorise meaningless letters: each represents one part of the story."]],
      [["Vamos calcular o décimo termo","Let's find the tenth term"],["Temos a₁=5, d=3 e n=10. Então a₁₀ = 5 + (10−1)×3 = 5 + 9×3 = 5 + 27 = 32. Encontrámos o termo sem escrever a lista inteira.","We have a₁=5, d=3 and n=10. So a₁₀ = 5 + (10−1)×3 = 5 + 9×3 = 5 + 27 = 32. We found the term without writing the whole list."]]
    ],
    prompt:["Calcula o décimo termo de 5, 8, 11, 14, …","Find the tenth term of 5, 8, 11, 14, …"],
    steps:[["Identifica a₁=5, d=3 e n=10.","Identify a₁=5, d=3 and n=10."],["Substitui: a₁₀=5+(10−1)×3=5+9×3.","Substitute: a₁₀=5+(10−1)×3=5+9×3."],["Calcula 9×3=27 e depois 5+27=32.","Calculate 9×3=27, then 5+27=32."]],
    answer:["a₁₀ = 32.","a₁₀ = 32."],
    question:["Se a₁=6, d=2 e n=4, quanto vale a₄?","If a₁=6, d=2 and n=4, what is a₄?"],options:[["10","10"],["12","12"],["14","14"]],correct:1,
    why:["a₄=6+(4−1)×2=6+6=12.","a₄=6+(4−1)×2=6+6=12."],
    exercise:["Calcula o 20.º termo de 2, 5, 8, 11, … sem escrever os 20 termos.","Find the 20th term of 2, 5, 8, 11, … without writing all 20 terms."],
    hint:["Usa aₙ=a₁+(n−1)d. Identifica primeiro a₁, d e n.","Use aₙ=a₁+(n−1)d. First identify a₁, d, and n."]
  }),
  makeLesson({
    id:"sequence-notebook-formula",title:["Duas fórmulas, a mesma sucessão","Two formulas, the same sequence"],kicker:["LIÇÃO 8 · LIGAR AO CADERNO","LESSON 8 · CONNECT TO YOUR NOTEBOOK"],duration:8,
    analogy:["É como escrever a mesma ideia de duas maneiras: “três moedas a mais do que duas” e “duas mais três moedas” podem descrever a mesma quantidade.","It is like expressing the same idea in two ways: “three coins more than two” and “two plus three coins” can describe the same amount."],
    concept:["Uma fórmula pode ter formas equivalentes. Simplificar a expressão não altera os valores que ela produz.","A formula can have equivalent forms. Simplifying an expression does not change the values it produces."],
    formula:["aₙ = 5 + 3(n − 1) = 2 + 3n","aₙ = 5 + 3(n − 1) = 2 + 3n"],diagramType:"sequence-general",
    diagramTitle:["Duas rotas, mesmo resultado","Two routes, same result"],diagramCaption:["As duas expressões produzem os mesmos termos.","Both expressions produce the same terms."],
    sections:[
      [["A fórmula do teu caderno","The formula in your notebook"],["O teu caderno usa aₙ = 2 + 3n. Vamos ver o que acontece: para n=1, a₁=2+3=5; para n=2, a₂=2+6=8; para n=3, a₃=2+9=11. A sucessão é 5, 8, 11, 14, …","Your notebook uses aₙ = 2 + 3n. Let's see what happens: for n=1, a₁=2+3=5; for n=2, a₂=2+6=8; for n=3, a₃=2+9=11. The sequence is 5, 8, 11, 14, …"]],
      [["De onde vem o 2?","Where does the 2 come from?"],["Começámos com aₙ=5+3(n−1). Desenvolve os parênteses: 5+3n−3. Junta 5−3 e obténs 2+3n. Por isso, aₙ=5+3(n−1) e aₙ=2+3n são duas formas da mesma regra.","We started with aₙ=5+3(n−1). Expand the brackets: 5+3n−3. Combine 5−3 and get 2+3n. So aₙ=5+3(n−1) and aₙ=2+3n are two forms of the same rule."]],
      [["Uma lição importante","An important lesson"],["As fórmulas podem parecer diferentes e ainda assim dar exactamente as mesmas respostas. Para ter confiança, substitui uma posição nas duas e compara o resultado.","Formulas can look different and still give exactly the same answers. To check, substitute a position into both and compare the result."]]
    ],
    prompt:["Simplifica 5 + 3(n − 1).","Simplify 5 + 3(n − 1)."],
    steps:[["Distribui o 3: 5 + 3n − 3.","Distribute 3: 5 + 3n − 3."],["Combina 5−3=2: fica 2+3n.","Combine 5−3=2: the result is 2+3n."]],
    answer:["2 + 3n. É equivalente à expressão original.","2 + 3n. It is equivalent to the original expression."],
    question:["Qual é a forma simplificada de 5+3(n−1)?","What is the simplified form of 5+3(n−1)?"],options:[["8+3n","8+3n"],["2+3n","2+3n"],["5+3n","5+3n"]],correct:1,
    why:["5+3n−3=2+3n.","5+3n−3=2+3n."],
    exercise:["Mostra que 7+2(n−1) é equivalente a 5+2n.","Show that 7+2(n−1) is equivalent to 5+2n."],
    hint:["Distribui primeiro o 2 e depois combina os números constantes.","First distribute 2, then combine the constant numbers."]
  }),
  makeLesson({
    id:"sequence-decreasing",title:["E quando os números diminuem?","What if the numbers decrease?"],kicker:["LIÇÃO 9 · DIFERENÇAS NEGATIVAS","LESSON 9 · NEGATIVE DIFFERENCES"],duration:7,
    analogy:["Pensa num elevador que desce três andares de cada vez. A posição fica mais baixa a cada movimento; em matemática, representamos esse salto com −3.","Think of an elevator that goes down three floors at a time. Its level gets lower with each move; in mathematics, we represent that jump with −3."],
    concept:["Uma sucessão aritmética pode diminuir. A diferença comum é negativa quando subtraímos sempre o mesmo número.","An arithmetic sequence can decrease. The common difference is negative when we subtract the same number each time."],
    formula:["13, 10, 7, 4, 1, …   ·   d = −3","13, 10, 7, 4, 1, …   ·   d = −3"],diagramType:"arithmetic-sequence",
    diagramTitle:["Um salto para baixo","A downward jump"],diagramCaption:["Subtrair 3 é o mesmo que adicionar −3.","Subtracting 3 is the same as adding −3."],
    sections:[
      [["Lê o sinal negativo","Read the negative sign"],["Na sucessão 13, 10, 7, 4, 1, subtraímos 3 em cada passo. A diferença é d=10−13=−3. O sinal negativo indica que o valor diminui.","In 13, 10, 7, 4, 1, we subtract 3 at every step. The difference is d=10−13=−3. The negative sign tells us the value decreases."]],
      [["Usa a fórmula normalmente","Use the formula as usual"],["A fórmula continua a ser aₙ=a₁+(n−1)d. Agora d=−3. Para encontrar o sexto termo: a₆=13+(6−1)(−3)=13+5(−3)=13−15=−2.","The formula is still aₙ=a₁+(n−1)d. Now d=−3. To find the sixth term: a₆=13+(6−1)(−3)=13+5(−3)=13−15=−2."]],
      [["Liga ao exercício do caderno","Connect to the notebook exercise"],["Para aₙ=3−2n, substitui n=1, 2, 3, 4: obténs 1, −1, −3, −5. A diferença é −2 em cada passo. Não há nada especial a fazer: substitui a posição e calcula com atenção aos sinais.","For aₙ=3−2n, substitute n=1, 2, 3, 4: you get 1, −1, −3, −5. The difference is −2 at every step. Nothing special is required: substitute the position and calculate carefully with the signs."]]
    ],
    prompt:["Calcula o sexto termo de 13, 10, 7, 4, 1, …","Find the sixth term of 13, 10, 7, 4, 1, …"],
    steps:[["a₁=13, d=−3 e n=6.","a₁=13, d=−3 and n=6."],["a₆=13+(6−1)(−3)=13+5(−3).","a₆=13+(6−1)(−3)=13+5(−3)."],["a₆=13−15=−2.","a₆=13−15=−2."]],
    answer:["O sexto termo é −2.","The sixth term is −2."],
    question:["Qual é a diferença comum de 8, 5, 2, −1, …?","What is the common difference of 8, 5, 2, −1, …?"],options:[["+3","+3"],["−3","−3"],["−2","−2"]],correct:1,
    why:["Cada termo é 3 unidades menor: 5−8=−3.","Each term is 3 smaller: 5−8=−3."],
    exercise:["Usa aₙ=3−2n para escrever os primeiros cinco termos.","Use aₙ=3−2n to write the first five terms."],
    hint:["Substitui n por 1, depois 2, depois 3, e assim sucessivamente.","Substitute n=1, then 2, then 3, and so on."]
  }),
  makeLesson({
    id:"sequence-fractions",title:["Quando aparecem frações","When fractions appear"],kicker:["LIÇÃO 10 · SUBSTITUIR E SIMPLIFICAR","LESSON 10 · SUBSTITUTE AND SIMPLIFY"],duration:8,
    analogy:["Imagina uma receita em que a posição n muda o denominador. Primeiro descobres o denominador; só depois fazes a divisão e simplificas, se for possível.","Imagine a recipe where position n changes the denominator. First find the denominator; only then divide and simplify if possible."],
    concept:["Uma fórmula pode produzir frações. Substitui a posição, calcula os parênteses e simplifica o resultado quando possível.","A formula can produce fractions. Substitute the position, calculate the brackets, and simplify the result when possible."],
    formula:["aₙ = 2/(n + 1)","aₙ = 2/(n + 1)"],diagramType:"sequence-fractions",
    diagramTitle:["A posição muda o denominador","Position changes the denominator"],diagramCaption:["Cada valor de n produz uma fracção diferente.","Each value of n produces a different fraction."],
    sections:[
      [["Substitui a posição","Substitute the position"],["O teu caderno usa aₙ=2/(n+1). Para o primeiro termo, n=1: a₁=2/(1+1)=2/2=1. Para o segundo, n=2: a₂=2/(2+1)=2/3.","Your notebook uses aₙ=2/(n+1). For the first term, n=1: a₁=2/(1+1)=2/2=1. For the second, n=2: a₂=2/(2+1)=2/3."]],
      [["Calcula os primeiros termos","Calculate the first terms"],["Para n=3, a₃=2/(3+1)=2/4=1/2. Para n=4, a₄=2/(4+1)=2/5. A sucessão é 1, 2/3, 1/2, 2/5, …","For n=3, a₃=2/(3+1)=2/4=1/2. For n=4, a₄=2/(4+1)=2/5. The sequence is 1, 2/3, 1/2, 2/5, …"]],
      [["Uma rotina simples para fracções","A simple routine for fractions"],["Substitui n; calcula o denominador; divide o numerador pelo denominador; simplifica se conseguires. Por exemplo, 2/4 simplifica-se para 1/2 porque dividimos ambos por 2. Esta sucessão não tem diferença constante, por isso não é aritmética.","Substitute n; calculate the denominator; divide the numerator by the denominator; simplify if possible. For example, 2/4 simplifies to 1/2 because we divide both by 2. This sequence has no constant difference, so it is not arithmetic."]]
    ],
    prompt:["Calcula os primeiros quatro termos de aₙ=2/(n+1).","Find the first four terms of aₙ=2/(n+1)."],
    steps:[["n=1: 2/(1+1)=2/2=1.","n=1: 2/(1+1)=2/2=1."],["n=2: 2/(2+1)=2/3.","n=2: 2/(2+1)=2/3."],["n=3: 2/4=1/2; n=4: 2/5.","n=3: 2/4=1/2; n=4: 2/5."]],
    answer:["1, 2/3, 1/2, 2/5.","1, 2/3, 1/2, 2/5."],
    question:["Se aₙ=2/(n+1), quanto vale a₃?","If aₙ=2/(n+1), what is a₃?"],options:[["2/3","2/3"],["1/2","1/2"],["2/5","2/5"]],correct:1,
    why:["Substitui n=3: 2/(3+1)=2/4=1/2.","Substitute n=3: 2/(3+1)=2/4=1/2."],
    exercise:["Calcula os primeiros três termos de aₙ=4/(n+1).","Find the first three terms of aₙ=4/(n+1)."],
    hint:["Começa por n=1. Lembra-te de calcular o denominador antes de dividir.","Start with n=1. Remember to calculate the denominator before dividing."]
  }),
  makeLesson({
    id:"sequence-geometric",title:["Sucessões de multiplicação","Multiplication sequences"],kicker:["LIÇÃO 11 · SUCESSÕES GEOMÉTRICAS","LESSON 11 · GEOMETRIC SEQUENCES"],duration:8,
    analogy:["Imagina uma folha que duplicas a cada passo. Uma folha, duas, quatro, oito… O total cresce depressa porque multiplicas, em vez de adicionares sempre a mesma quantidade.","Imagine a sheet you double at each step. One sheet, two, four, eight… The total grows quickly because you multiply instead of adding the same amount each time."],
    concept:["Numa sucessão geométrica, cada termo obtém-se multiplicando o anterior por um mesmo fator chamado razão.","In a geometric sequence, each term is obtained by multiplying the previous one by the same factor, called the common ratio."],
    formula:["aₙ = a₁ · rⁿ⁻¹","aₙ = a₁ · rⁿ⁻¹"],diagramType:"sequence-patterns",
    diagramTitle:["Multiplica pelo mesmo factor","Multiply by the same factor"],diagramCaption:["De 3 para 6, 12 e 24, multiplicamos sempre por 2.","From 3 to 6, 12 and 24, we always multiply by 2."],
    sections:[
      [["Como reconhecer o padrão","How to recognise the pattern"],["Na sucessão 3, 6, 12, 24, 48, cada termo é o dobro do anterior. A razão é r=2. A diferença não é constante: primeiro aumenta 3, depois 6, depois 12.","In 3, 6, 12, 24, 48, each term is double the previous one. The ratio is r=2. The difference is not constant: first it increases by 3, then 6, then 12."]],
      [["A fórmula","The formula"],["A fórmula é aₙ=a₁·rⁿ⁻¹. a₁ é o primeiro termo, r é o factor de multiplicação e n é a posição. O expoente n−1 aparece porque, do primeiro termo até à posição n, fazemos n−1 multiplicações.","The formula is aₙ=a₁·rⁿ⁻¹. a₁ is the first term, r is the multiplication factor, and n is the position. The exponent n−1 appears because we make n−1 multiplications to move from the first term to position n."]],
      [["Calcula o quinto termo","Find the fifth term"],["Para 3, 6, 12, 24, …, temos a₁=3, r=2 e n=5. Então a₅=3×2⁽⁵⁻¹⁾=3×2⁴=3×16=48. Não precisas de dominar todas as sucessões hoje: distingue primeiro somar sempre a mesma quantidade de multiplicar sempre pelo mesmo factor.","For 3, 6, 12, 24, …, we have a₁=3, r=2 and n=5. So a₅=3×2⁽⁵⁻¹⁾=3×2⁴=3×16=48. You do not need to master every sequence today: first distinguish adding the same amount from multiplying by the same factor."]]
    ],
    prompt:["Encontra o quinto termo de 3, 6, 12, 24, …","Find the fifth term of 3, 6, 12, 24, …"],
    steps:[["a₁=3, r=2, n=5.","a₁=3, r=2, n=5."],["a₅=3×2⁽⁵⁻¹⁾=3×2⁴.","a₅=3×2⁽⁵⁻¹⁾=3×2⁴."],["2⁴=16, então 3×16=48.","2⁴=16, so 3×16=48."]],
    answer:["O quinto termo é 48.","The fifth term is 48."],
    question:["Qual é a razão de 5, 10, 20, 40, …?","What is the common ratio of 5, 10, 20, 40, …?"],options:[["+5","+5"],["2","2"],["5","5"]],correct:1,
    why:["Cada termo é multiplicado por 2.","Each term is multiplied by 2."],
    exercise:["Usa aₙ=2×3ⁿ⁻¹ para calcular os primeiros quatro termos.","Use aₙ=2×3ⁿ⁻¹ to calculate the first four terms."],
    hint:["Substitui n por 1, 2, 3 e 4; calcula primeiro a potência.","Substitute n=1, 2, 3, and 4; calculate the power first."]
  }),
  makeLesson({
    id:"sequence-method",title:["Como resolver um exercício de sucessões","How to solve a sequence exercise"],kicker:["LIÇÃO 12 · UM MÉTODO QUE PODES REPETIR","LESSON 12 · A REPEATABLE METHOD"],duration:7,
    analogy:["Quando montas um móvel, segues uma ordem: lês as instruções, identificas as peças e só depois apertas os parafusos. Em matemática, uma rotina simples evita erros desnecessários.","When assembling furniture, you follow an order: read the instructions, identify the pieces, then tighten the screws. In mathematics, a simple routine prevents avoidable mistakes."],
    concept:["Identifica o que é pedido, escolhe a regra, substitui os valores, calcula por ordem e verifica o resultado.","Identify what is being asked, choose the rule, substitute values, calculate in order, and check the result."],
    formula:["Ler → Identificar → Substituir → Calcular → Verificar","Read → Identify → Substitute → Calculate → Check"],diagramType:"sequence-general",
    diagramTitle:["Cinco passos","Five steps"],diagramCaption:["Segue a mesma rotina até se tornar natural.","Follow the same routine until it becomes natural."],
    sections:[
      [["1. Lê a pergunta","1. Read the question"],["Estás a pedir os primeiros termos? Um termo numa posição específica? A regra? Lê o enunciado antes de começar a calcular.","Are you asked for the first terms, a term at a particular position, or the rule? Read the question before calculating."]],
      [["2. Identifica a informação","2. Identify the information"],["Se tens uma sucessão escrita, procura o padrão. Se tens uma fórmula, identifica a posição n que precisas de substituir. Numa sucessão aritmética, procura a₁ e d; numa geométrica, procura a₁ e r.","If a sequence is written out, look for its pattern. If you have a formula, identify the position n to substitute. For an arithmetic sequence, find a₁ and d; for a geometric sequence, find a₁ and r."]],
      [["3. Calcula e verifica","3. Calculate and check"],["Substitui com cuidado. Respeita parênteses, sinais negativos, potências e fracções. No fim, verifica se a resposta faz sentido: numa sucessão que subtrai 3, os termos devem descer 3 de cada vez.","Substitute carefully. Respect brackets, negative signs, powers and fractions. At the end, check whether the answer makes sense: in a sequence that subtracts 3, terms should go down by 3 each time."]]
    ],
    prompt:["Dada aₙ=4+2(n−1), calcula a₃.","Given aₙ=4+2(n−1), find a₃."],
    steps:[["A posição pedida é 3, por isso substituímos n=3.","The requested position is 3, so substitute n=3."],["a₃=4+2(3−1)=4+2×2.","a₃=4+2(3−1)=4+2×2."],["a₃=4+4=8. Verifica: 4, 6, 8.","a₃=4+4=8. Check: 4, 6, 8."]],
    answer:["a₃=8.","a₃=8."],
    question:["Qual é o primeiro passo num exercício?","What is the first step in an exercise?"],options:[["Multiplicar tudo","Multiply everything"],["Ler o que a pergunta pede","Read what the question asks"],["Escolher um número ao acaso","Choose a random number"]],correct:1,
    why:["Se não identificares o que procuras, podes aplicar a regra errada.","If you do not identify what you are looking for, you may use the wrong rule."],
    exercise:["Usa aₙ=7−2(n−1) para calcular a₁, a₂ e a₃.","Use aₙ=7−2(n−1) to calculate a₁, a₂ and a₃."],
    hint:["Substitui n por 1, 2 e 3, uma vez de cada vez.","Substitute n=1, 2, and 3, one at a time."]
  }),
  makeLesson({
    id:"sequence-checkpoint",title:["Agora é a tua vez!","Your turn!"],kicker:["LIÇÃO 13 · CONFIRMAR O QUE APRENDESTE","LESSON 13 · CHECK WHAT YOU HAVE LEARNED"],duration:8,
    analogy:["Chegaste ao momento de experimentar sozinho. Não precisas de ser rápido. Lê cada pergunta, pensa na regra e tenta antes de espreitar a explicação.","Now it is time to try on your own. You do not need to be fast. Read each question, think about the rule, and try before looking at the explanation."],
    concept:["Uma boa resposta mostra que consegues explicar a ideia, não apenas reconhecer uma fórmula.","A good answer shows that you can explain the idea, not just recognise a formula."],
    formula:["Compreender → Resolver → Verificar","Understand → Solve → Check"],diagramType:"sequence-patterns",
    diagramTitle:["A tua revisão","Your review"],diagramCaption:["Cada pequena pergunta reforça uma peça da ideia.","Each small question reinforces one part of the idea."],
    sections:[
      [["Antes de responder","Before answering"],["Lembra-te: uma sucessão é uma lista ordenada; um termo é um número dessa lista; a posição diz onde procurar e o valor diz o que encontramos. Compara diferenças para reconhecer uma sucessão aritmética.","Remember: a sequence is an ordered list; a term is one number in that list; position tells you where to look and value tells you what you find. Compare differences to recognise an arithmetic sequence."]],
      [["Quando há uma fórmula","When there is a formula"],["Substitui a posição indicada. Para uma sucessão aritmética, usa aₙ=a₁+(n−1)d. Para uma geométrica, usa aₙ=a₁rⁿ⁻¹. Se aparecerem fracções, calcula o denominador antes de dividir.","Substitute the indicated position. For an arithmetic sequence, use aₙ=a₁+(n−1)d. For a geometric sequence, use aₙ=a₁rⁿ⁻¹. If fractions appear, calculate the denominator before dividing."]],
      [["Aprender com um erro","Learn from a mistake"],["Se a resposta não estiver certa, não é sinal para desistir. Volta ao passo onde a regra foi aplicada, verifica a posição substituída e calcula outra vez com calma.","If the answer is wrong, that is not a reason to give up. Return to the step where the rule was applied, check the substituted position, and calculate again calmly."]]
    ],
    prompt:["Se aₙ=2n+1, quanto vale a₂?","If aₙ=2n+1, what is a₂?"],
    steps:[["Substitui n=2: a₂=2×2+1.","Substitute n=2: a₂=2×2+1."],["Calcula 4+1=5.","Calculate 4+1=5."]],
    answer:["a₂=5.","a₂=5."],
    question:["Qual é uma sucessão aritmética?","Which is an arithmetic sequence?"],options:[["2, 4, 8, 16","2, 4, 8, 16"],["1, 4, 7, 10","1, 4, 7, 10"],["1, 2, 4, 7","1, 2, 4, 7"]],correct:1,
    why:["A diferença entre termos é sempre +3.","The difference between terms is always +3."],
    exercise:["Sem consultar as lições anteriores, explica com as tuas palavras o que significa a₄ e calcula o quarto termo de 3, 6, 9, 12, …","Without checking earlier lessons, explain in your own words what a₄ means and find the fourth term of 3, 6, 9, 12, …"],
    hint:["a₄ é o valor na quarta posição. Conta os termos ou usa a regra +3.","a₄ is the value at position four. Count the terms or use the +3 rule."]
  })
];
