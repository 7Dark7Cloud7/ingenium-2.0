const bi = (pt, en) => ({ pt, en });

const match = (id, leftPt, leftEn, pieceId, piecePt, pieceEn) => ({
  id,
  left: bi(leftPt, leftEn),
  pieceId,
  piece: bi(piecePt, pieceEn)
});

const extra = (id, pt, en) => ({ id, text: bi(pt, en) });

const worksheetPrompts = {
  "L1-01": bi("1) ℕ, ℤ, ℚ e ℝ: −3, 0, 1/2, √9, √5, −1,5", "1) ℕ, ℤ, ℚ and ℝ: −3, 0, 1/2, √9, √5, −1.5"),
  "L1-02": bi("2) a) 2x − (x − 3)\nb) (x² − 4)/(x − 2), x ≠ 2", "2) a) 2x − (x − 3)\nb) (x² − 4)/(x − 2), x ≠ 2"),
  "L1-03": bi("3) Resolva a inequação:\nx² + x − 6 ≤ 0", "3) Solve the inequality:\nx² + x − 6 ≤ 0"),
  "L1-04": bi("4) Simplifique:\n√8 + √18 − √2", "4) Simplify:\n√8 + √18 − √2"),
  "L1-05": bi("5) Resolva:\na) 2^(x+1) = 8\nb) log₂(x − 1) = 2", "5) Solve:\na) 2^(x+1) = 8\nb) log₂(x − 1) = 2"),
  "L1-06": bi("6) Determine o domínio real de:\na) f(x) = 1/(x − 2)\nb) g(x) = √(x − 4)\nc) h(x) = ln(x + 2)", "6) Find the real domain of:\na) f(x) = 1/(x − 2)\nb) g(x) = √(x − 4)\nc) h(x) = ln(x + 2)"),
  "L1-07": bi("7) Para f(x) = x² − 1, determine os zeros, o vértice e o sentido da abertura.", "7) For f(x) = x² − 1, find the zeros, vertex and direction of opening."),
  "L1-08": bi("8) Considere f(x) = x + 2 e g(x) = x². Determine:\n(f + g)(x), (f ∘ g)(x) e (g ∘ f)(x).", "8) Let f(x) = x + 2 and g(x) = x². Find:\n(f + g)(x), (f ∘ g)(x) and (g ∘ f)(x)."),
  "L1-09": bi("9) Num triângulo retângulo, o cateto oposto a α mede 3 e a hipotenusa mede 5. Determine sen α e cos α.", "9) In a right triangle, the side opposite α is 3 and the hypotenuse is 5. Find sin α and cos α."),
  "L1-10": bi("10) Determine a equação da recta que passa por A(0, 1) e B(2, 5).", "10) Find the line through A(0, 1) and B(2, 5)."),
  "L1-11": bi("11) Derive f(x) = 2x² + 3x − 1.", "11) Differentiate f(x) = 2x² + 3x − 1."),
  "L1-12": bi("12) Calcule a primitiva de:\n∫(x² + 2x + 1) dx", "12) Find the antiderivative of:\n∫(x² + 2x + 1) dx"),
  "L1-13": bi("13) Esboce a região sob y = x, acima do eixo Ox, entre x = 0 e x = 2. Calcule a área usando a fórmula do triângulo.", "13) Sketch the region under y = x, above the x-axis, from x = 0 to x = 2. Find its area using the triangle formula."),
  "L2-01": bi("1) ℕ, ℤ, ℚ e ℝ: −5, 0, 3/4, √16, √7, −2,35", "1) ℕ, ℤ, ℚ and ℝ: −5, 0, 3/4, √16, √7, −2.35"),
  "L2-02": bi("2) Simplifique:\na) 3x − 2(x − 4)\nb) (x² − 9)/(x − 3), x ≠ 3", "2) Simplify:\na) 3x − 2(x − 4)\nb) (x² − 9)/(x − 3), x ≠ 3"),
  "L2-03": bi("3) Resolva a inequação:\nx² − 4x − 5 ≤ 0", "3) Solve the inequality:\nx² − 4x − 5 ≤ 0"),
  "L2-04": bi("4) Simplifique:\n√50 − 2√8 + √18", "4) Simplify:\n√50 − 2√8 + √18"),
  "L2-05": bi("5) Resolva:\na) 3^(x+1) = 81\nb) log_{√2}(x − 1) = 3", "5) Solve:\na) 3^(x+1) = 81\nb) log_{√2}(x − 1) = 3"),
  "L2-06": bi("6) Determine o domínio real de:\na) f(x) = 1/(x − 4)\nb) g(x) = √(2x − 6)\nc) h(x) = ln(x + 1)", "6) Find the real domain of:\na) f(x) = 1/(x − 4)\nb) g(x) = √(2x − 6)\nc) h(x) = ln(x + 1)"),
  "L2-07": bi("7) Para f(x) = x² − 4, determine os zeros, o vértice e esboce o gráfico.", "7) For f(x) = x² − 4, find the zeros, vertex and sketch the graph."),
  "L2-08": bi("8) Considere f(x) = x + 1 e g(x) = x². Determine:\n(f + g)(x), (f ∘ g)(x) e (g ∘ f)(x).", "8) Let f(x) = x + 1 and g(x) = x². Find:\n(f + g)(x), (f ∘ g)(x) and (g ∘ f)(x)."),
  "L2-09": bi("9) Num triângulo rectângulo, relativamente a um ângulo α, o cateto oposto mede 3 e a hipotenusa mede 5. Determine sen α e cos α.", "9) In a right triangle, relative to angle α, the opposite leg is 3 and the hypotenuse is 5. Find sin α and cos α."),
  "L2-10": bi("10) Determine a equação da recta que passa pelos pontos A(1, 2) e B(3, 6).", "10) Find the equation of the line through A(1, 2) and B(3, 6)."),
  "L2-11": bi("11) Derive:\nf(x) = 3x² − 4x + 7", "11) Differentiate:\nf(x) = 3x² − 4x + 7"),
  "L2-12": bi("12) Calcule a primitiva de:\n∫(3x² − 6x − 2) dx", "12) Find the antiderivative of:\n∫(3x² − 6x − 2) dx"),
  "L2-13": bi("13) Esboce a região sob a recta y = 2x, acima do eixo Ox, entre x = 0 e x = 2. Calcule a área por meio da fórmula da área do triângulo.", "13) Sketch the region under y = 2x, above the x-axis, between x = 0 and x = 2. Find its area using the triangle area formula.")
};

const boardStarts = {
  "L1-01": bi("−3, 0, 1/2, √9, √5, −1,5", "−3, 0, 1/2, √9, √5, −1.5"),
  "L1-02": bi("a) 2x − (x − 3)\nb) (x² − 4)/(x − 2), x ≠ 2", "a) 2x − (x − 3)\nb) (x² − 4)/(x − 2), x ≠ 2"),
  "L1-03": bi("x² + x − 6 ≤ 0", "x² + x − 6 ≤ 0"),
  "L1-04": bi("√8 + √18 − √2", "√8 + √18 − √2"),
  "L1-05": bi("a) 2^(x+1) = 8\nb) log_{2}(x − 1) = 2", "a) 2^(x+1) = 8\nb) log_{2}(x − 1) = 2"),
  "L1-06": bi("f(x) = 1/(x − 2)\ng(x) = √(x − 4)\nh(x) = ln(x + 2)", "f(x) = 1/(x − 2)\ng(x) = √(x − 4)\nh(x) = ln(x + 2)"),
  "L1-07": bi("f(x) = x² − 1", "f(x) = x² − 1"),
  "L1-08": bi("f(x) = x + 2     ·     g(x) = x²", "f(x) = x + 2     ·     g(x) = x²"),
  "L1-09": bi("cateto oposto = 3     ·     hipotenusa = 5", "opposite = 3     ·     hypotenuse = 5"),
  "L1-10": bi("A(0, 1)     ·     B(2, 5)", "A(0, 1)     ·     B(2, 5)"),
  "L1-11": bi("f(x) = 2x² + 3x − 1", "f(x) = 2x² + 3x − 1"),
  "L1-12": bi("∫(x² + 2x + 1) dx", "∫(x² + 2x + 1) dx"),
  "L1-13": bi("y = x     ·     0 ≤ x ≤ 2", "y = x     ·     0 ≤ x ≤ 2"),
  "L2-01": bi("−5, 0, 3/4, √16, √7, −2,35", "−5, 0, 3/4, √16, √7, −2.35"),
  "L2-02": bi("a) 3x − 2(x − 4)\nb) (x² − 9)/(x − 3), x ≠ 3", "a) 3x − 2(x − 4)\nb) (x² − 9)/(x − 3), x ≠ 3"),
  "L2-03": bi("x² − 4x − 5 ≤ 0", "x² − 4x − 5 ≤ 0"),
  "L2-04": bi("√50 − 2√8 + √18", "√50 − 2√8 + √18"),
  "L2-05": bi("a) 3^(x+1) = 81\nb) log_{√2}(x − 1) = 3", "a) 3^(x+1) = 81\nb) log_{√2}(x − 1) = 3"),
  "L2-06": bi("f(x) = 1/(x − 4)\ng(x) = √(2x − 6)\nh(x) = ln(x + 1)", "f(x) = 1/(x − 4)\ng(x) = √(2x − 6)\nh(x) = ln(x + 1)"),
  "L2-07": bi("f(x) = x² − 4", "f(x) = x² − 4"),
  "L2-08": bi("f(x) = x + 1     ·     g(x) = x²", "f(x) = x + 1     ·     g(x) = x²"),
  "L2-09": bi("cateto oposto = 3     ·     hipotenusa = 5", "opposite = 3     ·     hypotenuse = 5"),
  "L2-10": bi("A(1, 2)     ·     B(3, 6)", "A(1, 2)     ·     B(3, 6)"),
  "L2-11": bi("f(x) = 3x² − 4x + 7", "f(x) = 3x² − 4x + 7"),
  "L2-12": bi("∫(3x² − 6x − 2) dx", "∫(3x² − 6x − 2) dx"),
  "L2-13": bi("y = 2x     ·     0 ≤ x ≤ 2", "y = 2x     ·     0 ≤ x ≤ 2")
};

const question = (id, topicPt, topicEn, promptPt, promptEn, pairs, extras, explanationPt, explanationEn) => ({
  id,
  topic: bi(topicPt, topicEn),
  prompt: bi(promptPt, promptEn),
  worksheet: worksheetPrompts[id] || bi(promptPt, promptEn),
  boardStart: boardStarts[id] || bi(promptPt, promptEn),
  pairs: pairs.map(({ piece, ...pair }) => pair),
  pieces: [...pairs.map(pair => ({ id: pair.pieceId, text: pair.piece })), ...extras],
  explanation: bi(explanationPt, explanationEn)
});

const sets = (id, number, numberEn, classificationPt, classificationEn) =>
  match(id, number, numberEn, id + "-set", classificationPt, classificationEn);

export const gameLevels = [
  {
    id: 1,
    title: bi("Preparação", "Warm-up"),
    subtitle: bi("Os mesmos temas da prova, com números e passos mais simples.", "The same test topics, with gentler numbers and steps."),
    badge: bi("Aprendiz de Matemática", "Math Apprentice"),
    passMark: 10,
    questions: [
      question("L1-01", "Conjuntos numéricos", "Number sets",
        "Liga cada número à classificação que descreve os conjuntos a que pertence. Considera 0 ∈ ℕ.",
        "Match each number to the classification of the sets it belongs to. Assume 0 ∈ ℕ.",
        [
          sets("n1", "−3", "−3", "ℤ, ℚ e ℝ · inteiro negativo", "ℤ, ℚ and ℝ · negative integer"),
          sets("n2", "0", "0", "ℕ, ℤ, ℚ e ℝ", "ℕ, ℤ, ℚ and ℝ"),
          sets("n3", "1/2", "1/2", "ℚ e ℝ · racional não inteiro positivo", "ℚ and ℝ · positive non-integer rational"),
          sets("n4", "√9", "√9", "ℕ, ℤ, ℚ e ℝ · inteiro positivo", "ℕ, ℤ, ℚ and ℝ · positive integer"),
          sets("n5", "√5", "√5", "ℝ \\ ℚ · irracional", "ℝ \\ ℚ · irrational"),
          sets("n6", "−1,5", "−1.5", "ℚ e ℝ · racional não inteiro negativo", "ℚ and ℝ · negative non-integer rational")
        ],
        [extra("n-wrong-1", "ℕ apenas · natural não nulo", "ℕ only · non-zero natural"), extra("n-wrong-2", "ℝ \\ ℚ · irracional negativo", "ℝ \\ ℚ · negative irrational")],
        "Um número natural também é inteiro, racional e real. Uma fracção ou decimal finito é racional; √5 é irracional.",
        "A natural number is also an integer, rational and real. A fraction or terminating decimal is rational; √5 is irrational."),
      question("L1-02", "Expressões", "Expressions",
        "Liga cada etapa ao resultado correcto para simplificar as duas expressões.",
        "Match each step to the correct result while simplifying both expressions.",
        [
          match("e1", "Distribuir o sinal em 2x − (x − 3)", "Expand 2x − (x − 3)", "e1-p", "2x − x + 3", "2x − x + 3"),
          match("e2", "Simplificar a expressão anterior", "Simplify the previous expression", "e2-p", "x + 3", "x + 3"),
          match("e3", "Factorizar x² − 4", "Factor x² − 4", "e3-p", "(x − 2)(x + 2)", "(x − 2)(x + 2)"),
          match("e4", "Simplificar (x² − 4)/(x − 2), x ≠ 2", "Simplify (x² − 4)/(x − 2), x ≠ 2", "e4-p", "x + 2", "x + 2")
        ],
        [extra("e-wrong-1", "x − 3", "x − 3"), extra("e-wrong-2", "(x − 2)²", "(x − 2)²")],
        "Primeiro distribui o sinal negativo: −(x−3)=−x+3. Na fracção, usa x²−4=(x−2)(x+2) e mantém x≠2.",
        "First distribute the negative sign: −(x−3)=−x+3. For the fraction, use x²−4=(x−2)(x+2) and keep x≠2."),
      question("L1-03", "Inequações", "Inequalities",
        "Ordena as ideias para resolver x² + x − 6 ≤ 0 fazendo as correspondências.",
        "Match the steps for solving x² + x − 6 ≤ 0.",
        [
          match("i1", "Factorizar o polinómio", "Factor the polynomial", "i1-p", "(x + 3)(x − 2) ≤ 0", "(x + 3)(x − 2) ≤ 0"),
          match("i2", "Encontrar os zeros", "Find the roots", "i2-p", "x = −3 e x = 2", "x = −3 and x = 2"),
          match("i3", "Intervalo onde a expressão é não positiva", "Interval where the expression is non-positive", "i3-p", "−3 ≤ x ≤ 2", "−3 ≤ x ≤ 2")
        ],
        [extra("i-wrong-1", "x ≤ −3 ou x ≥ 2", "x ≤ −3 or x ≥ 2")],
        "A parábola abre para cima, por isso é não positiva entre as raízes −3 e 2, incluindo-as.",
        "The parabola opens upward, so it is non-positive between the roots −3 and 2, including both endpoints."),
      question("L1-04", "Radicais", "Surds",
        "Simplifica √8 + √18 − √2. Liga cada radical à sua forma simplificada e depois ao resultado.",
        "Simplify √8 + √18 − √2. Match each radical to its simplified form, then to the result.",
        [
          match("r1", "√8", "√8", "r1-p", "2√2", "2√2"),
          match("r2", "√18", "√18", "r2-p", "3√2", "3√2"),
          match("r3", "−√2", "−√2", "r3-p", "−√2", "−√2"),
          match("r4", "Resultado final", "Final result", "r4-p", "4√2", "4√2")
        ],
        [extra("r-wrong-1", "6√2", "6√2")],
        "Os radicais tornam-se 2√2 + 3√2 − √2; soma os coeficientes para obter 4√2.",
        "The surds become 2√2 + 3√2 − √2; add the coefficients to get 4√2."),
      question("L1-05", "Expoentes e logaritmos", "Powers and logarithms",
        "Liga cada etapa aos resultados para resolver 2^(x+1)=8 e log₂(x−1)=2.",
        "Match each step to the results for solving 2^(x+1)=8 and log₂(x−1)=2.",
        [
          match("p1", "Escrever 8 como potência de 2", "Write 8 as a power of 2", "p1-p", "8 = 2³", "8 = 2³"),
          match("p2", "Resolver x + 1 = 3", "Solve x + 1 = 3", "p2-p", "x = 2", "x = 2"),
          match("p3", "Passar log₂(x−1)=2 para forma exponencial", "Convert log₂(x−1)=2 to exponential form", "p3-p", "x − 1 = 2²", "x − 1 = 2²"),
          match("p4", "Resolver x − 1 = 4", "Solve x − 1 = 4", "p4-p", "x = 5", "x = 5")
        ],
        [extra("p-wrong-1", "x = 3", "x = 3"), extra("p-wrong-2", "x = 4", "x = 4")],
        "Na equação exponencial, iguala os expoentes. No logaritmo, log₂(x−1)=2 significa x−1=2².",
        "For the exponential equation, equate the exponents. The logarithm means x−1=2²."),
      question("L1-06", "Domínio de funções", "Function domains",
        "Liga cada função à condição necessária e ao seu domínio real.",
        "Match each function to its restriction and real domain.",
        [
          match("d1", "f(x)=1/(x−2)", "f(x)=1/(x−2)", "d1-p", "x ≠ 2", "x ≠ 2"),
          match("d2", "Domínio de f", "Domain of f", "d2-p", "ℝ \\ {2}", "ℝ \\ {2}"),
          match("d3", "g(x)=√(x−4)", "g(x)=√(x−4)", "d3-p", "x − 4 ≥ 0", "x − 4 ≥ 0"),
          match("d4", "Domínio de g", "Domain of g", "d4-p", "x ≥ 4", "x ≥ 4"),
          match("d5", "h(x)=ln(x+2)", "h(x)=ln(x+2)", "d5-p", "x + 2 > 0", "x + 2 > 0"),
          match("d6", "Domínio de h", "Domain of h", "d6-p", "x > −2", "x > −2")
        ],
        [extra("d-wrong-1", "x ≥ 2", "x ≥ 2")],
        "O denominador não pode ser zero, o radicando tem de ser não negativo e o argumento do logaritmo tem de ser positivo.",
        "The denominator cannot be zero, the square-root radicand must be non-negative, and the logarithm argument must be positive."),
      question("L1-07", "Funções quadráticas", "Quadratic functions",
        "Para f(x)=x²−1, liga cada característica à descrição correcta.",
        "For f(x)=x²−1, match each feature to its description.",
        [
          match("q1", "Zeros da função", "Function zeros", "q1-p", "x = −1 e x = 1", "x = −1 and x = 1"),
          match("q2", "Vértice", "Vertex", "q2-p", "(0, −1)", "(0, −1)"),
          match("q3", "Sentido da abertura", "Direction of opening", "q3-p", "Para cima", "Upward")
        ],
        [extra("q-wrong-1", "Para baixo", "Downward"), extra("q-wrong-2", "(0, 1)", "(0, 1)")],
        "x²−1=(x−1)(x+1), o vértice é (0,−1) e o coeficiente de x² positivo faz a parábola abrir para cima.",
        "x²−1=(x−1)(x+1), the vertex is (0,−1), and a positive x² coefficient makes the parabola open upward."),
      question("L1-08", "Operações com funções", "Function operations",
        "Considera f(x)=x+2 e g(x)=x². Liga cada operação à sua expressão.",
        "Let f(x)=x+2 and g(x)=x². Match each operation to its expression.",
        [
          match("f1", "(f+g)(x)", "(f+g)(x)", "f1-p", "x² + x + 2", "x² + x + 2"),
          match("f2", "(f∘g)(x)=f(g(x))", "(f∘g)(x)=f(g(x))", "f2-p", "x² + 2", "x² + 2"),
          match("f3", "(g∘f)(x)=g(f(x))", "(g∘f)(x)=g(f(x))", "f3-p", "(x + 2)²", "(x + 2)²")
        ],
        [extra("f-wrong-1", "2x + 2", "2x + 2")],
        "Na composição, calcula primeiro a função que está dentro dos parênteses: f(g(x)) e g(f(x)) não são a mesma coisa.",
        "For composition, apply the inner function first: f(g(x)) and g(f(x)) are not the same."),
      question("L1-09", "Trigonometria", "Trigonometry",
        "Num triângulo 3–4–5, o cateto oposto a α mede 3. Liga cada razão ao valor correcto.",
        "In a 3–4–5 triangle, the side opposite α is 3. Match each ratio to its value.",
        [
          match("t1", "Hipotenusa", "Hypotenuse", "t1-p", "5", "5"),
          match("t2", "Cateto adjacente", "Adjacent side", "t2-p", "4", "4"),
          match("t3", "sen α", "sin α", "t3-p", "3/5", "3/5"),
          match("t4", "cos α", "cos α", "t4-p", "4/5", "4/5")
        ],
        [extra("t-wrong-1", "5/3", "5/3")],
        "O cateto adjacente é 4, pois 3²+4²=5². Seno é oposto/hipotenusa e cosseno é adjacente/hipotenusa.",
        "The adjacent side is 4 because 3²+4²=5². Sine is opposite/hypotenuse; cosine is adjacent/hypotenuse."),
      question("L1-10", "Equação da recta", "Line equations",
        "A recta passa por A(0,1) e B(2,5). Liga os passos à equação final.",
        "A line passes through A(0,1) and B(2,5). Match the steps to the final equation.",
        [
          match("l1", "Calcular o declive", "Calculate the slope", "l1-p", "(5−1)/(2−0) = 2", "(5−1)/(2−0) = 2"),
          match("l2", "Usar a forma y=mx+b", "Use the form y=mx+b", "l2-p", "y = 2x + b", "y = 2x + b"),
          match("l3", "Substituir A(0,1)", "Substitute A(0,1)", "l3-p", "b = 1", "b = 1"),
          match("l4", "Equação final", "Final equation", "l4-p", "y = 2x + 1", "y = 2x + 1")
        ],
        [extra("l-wrong-1", "y = 2x − 1", "y = 2x − 1")],
        "O declive é 2. Como A tem x=0 e y=1, a ordenada na origem é 1; logo y=2x+1.",
        "The slope is 2. Since A has x=0 and y=1, the y-intercept is 1, so y=2x+1."),
      question("L1-11", "Derivadas", "Derivatives",
        "Liga cada termo da função f(x)=2x²+3x−1 à sua derivada.",
        "Match each term of f(x)=2x²+3x−1 to its derivative.",
        [
          match("v1", "Derivada de 2x²", "Derivative of 2x²", "v1-p", "4x", "4x"),
          match("v2", "Derivada de 3x", "Derivative of 3x", "v2-p", "3", "3"),
          match("v3", "Derivada de −1", "Derivative of −1", "v3-p", "0", "0"),
          match("v4", "Derivada da função completa", "Derivative of the whole function", "v4-p", "4x + 3", "4x + 3")
        ],
        [extra("v-wrong-1", "4x² + 3", "4x² + 3")],
        "Aplica a regra da potência a cada termo; a derivada de uma constante é zero.",
        "Apply the power rule to each term; the derivative of a constant is zero."),
      question("L1-12", "Primitivas", "Antiderivatives",
        "Liga cada termo de x²+2x+1 à sua primitiva e monta a primitiva completa.",
        "Match each term of x²+2x+1 to its antiderivative and build the full result.",
        [
          match("a1", "Primitiva de x²", "Antiderivative of x²", "a1-p", "x³/3", "x³/3"),
          match("a2", "Primitiva de 2x", "Antiderivative of 2x", "a2-p", "x²", "x²"),
          match("a3", "Primitiva de 1", "Antiderivative of 1", "a3-p", "x", "x"),
          match("a4", "Adicionar a constante", "Add the constant", "a4-p", " + C", " + C"),
          match("a5", "Primitiva completa", "Full antiderivative", "a5-p", "x³/3 + x² + x + C", "x³/3 + x² + x + C")
        ],
        [extra("a-wrong-1", "3x² + 2x + 1", "3x² + 2x + 1")],
        "Integra termo a termo e acrescenta sempre a constante de integração C.",
        "Integrate term by term and always add the integration constant C."),
      question("L1-13", "Área por triângulo", "Area using a triangle",
        "A região está sob y=x, acima do eixo Ox, entre x=0 e x=2. Liga as medidas e calcula a área.",
        "The region is under y=x, above the x-axis, from x=0 to x=2. Match the measurements and calculate the area.",
        [
          match("ar1", "Base do triângulo", "Triangle base", "ar1-p", "base = 2 unidades", "base = 2 units"),
          match("ar2", "Altura em x=2", "Height at x=2", "ar2-p", "altura y(2) = 2 unidades", "height y(2) = 2 units"),
          match("ar3", "Fórmula da área", "Area formula", "ar3-p", "A = (base × altura)/2", "A = (base × height)/2"),
          match("ar4", "Área final", "Final area", "ar4-p", "A = 2 unidades²", "A = 2 square units")
        ],
        [extra("ar-wrong-1", "A = 4 unidades²", "A = 4 square units")],
        "No ponto x=2, y=2. Assim, A=(2×2)/2=2 unidades quadradas.",
        "At x=2, y=2. So A=(2×2)/2=2 square units.")
    ]
  },
  {
    id: 2,
    title: bi("Teste de Matemática", "Mathematics Test"),
    subtitle: bi("Os 13 exercícios que identificaste na prova, em puzzles de correspondência.", "The 13 exercises you transcribed, turned into matching puzzles."),
    badge: bi("Desafiante de Matemática", "Math Challenger"),
    passMark: 10,
    questions: [
      question("L2-01", "Conjuntos numéricos", "Number sets",
        "Associa cada número aos conjuntos a que pertence. Considera 0 ∈ ℕ.",
        "Match each number to the sets it belongs to. Assume 0 ∈ ℕ.",
        [
          sets("s1", "−5", "−5", "ℤ, ℚ e ℝ · inteiro negativo", "ℤ, ℚ and ℝ · negative integer"),
          sets("s2", "0", "0", "ℕ, ℤ, ℚ e ℝ", "ℕ, ℤ, ℚ and ℝ"),
          sets("s3", "3/4", "3/4", "ℚ e ℝ · racional não inteiro positivo", "ℚ and ℝ · positive non-integer rational"),
          sets("s4", "√16", "√16", "ℕ, ℤ, ℚ e ℝ · inteiro positivo", "ℕ, ℤ, ℚ and ℝ · positive integer"),
          sets("s5", "√7", "√7", "ℝ \\ ℚ · irracional", "ℝ \\ ℚ · irrational"),
          sets("s6", "−2,35", "−2.35", "ℚ e ℝ · racional não inteiro negativo", "ℚ and ℝ · negative non-integer rational")
        ],
        [extra("s-wrong-1", "ℕ apenas", "ℕ only"), extra("s-wrong-2", "ℤ mas não ℚ", "ℤ but not ℚ")],
        "−5 é inteiro e racional; 0 e √16 são naturais (nesta convenção); 3/4 e −2,35 são racionais não inteiros; √7 é irracional real.",
        "−5 is an integer and rational; 0 and √16 are natural in this convention; 3/4 and −2.35 are non-integer rationals; √7 is irrational and real."),
      question("L2-02", "Expressões e simplificação", "Expressions and simplification",
        "Liga as etapas correctas para 3x−2(x−4) e (x²−9)/(x−3), considerando x≠3.",
        "Match the correct steps for 3x−2(x−4) and (x²−9)/(x−3), with x≠3.",
        [
          match("e1", "Distribuir −2 em 3x−2(x−4)", "Distribute −2 in 3x−2(x−4)", "e1-p", "3x − 2x + 8", "3x − 2x + 8"),
          match("e2", "Combinar termos semelhantes", "Combine like terms", "e2-p", "x + 8", "x + 8"),
          match("e3", "Factorizar x²−9", "Factor x²−9", "e3-p", "(x − 3)(x + 3)", "(x − 3)(x + 3)"),
          match("e4", "Simplificar a fracção", "Simplify the fraction", "e4-p", "x + 3, com x ≠ 3", "x + 3, with x ≠ 3")
        ],
        [extra("e-wrong-1", "x − 8", "x − 8"), extra("e-wrong-2", "x − 3", "x − 3")],
        "Distribuir −2 muda os sinais dentro dos parênteses. Para a fracção, factoriza a diferença de quadrados e mantém a restrição x≠3.",
        "Distributing −2 changes the signs inside the brackets. For the fraction, factor the difference of squares and keep x≠3."),
      question("L2-03", "Inequações", "Inequalities",
        "Resolve x²−4x−5≤0 correspondendo cada passo.",
        "Solve x²−4x−5≤0 by matching each step.",
        [
          match("i1", "Factorizar", "Factor", "i1-p", "(x − 5)(x + 1) ≤ 0", "(x − 5)(x + 1) ≤ 0"),
          match("i2", "Encontrar os zeros", "Find the roots", "i2-p", "x = −1 e x = 5", "x = −1 and x = 5"),
          match("i3", "Escolher o intervalo válido", "Choose the valid interval", "i3-p", "−1 ≤ x ≤ 5", "−1 ≤ x ≤ 5")
        ],
        [extra("i-wrong-1", "x ≤ −1 ou x ≥ 5", "x ≤ −1 or x ≥ 5")],
        "A parábola abre para cima e fica abaixo ou sobre o eixo Ox entre as raízes −1 e 5.",
        "The parabola opens upward and lies on or below the x-axis between roots −1 and 5."),
      question("L2-04", "Radicais", "Surds",
        "Simplifica √50−2√8+√18. Liga os radicais e a combinação final.",
        "Simplify √50−2√8+√18. Match the surds and the final combination.",
        [
          match("r1", "√50", "√50", "r1-p", "5√2", "5√2"),
          match("r2", "−2√8", "−2√8", "r2-p", "−4√2", "−4√2"),
          match("r3", "√18", "√18", "r3-p", "3√2", "3√2"),
          match("r4", "Combinação final", "Final combination", "r4-p", "5√2 − 4√2 + 3√2 = 4√2", "5√2 − 4√2 + 3√2 = 4√2")
        ],
        [extra("r-wrong-1", "6√2", "6√2")],
        "Extrai os quadrados perfeitos: √50=5√2, √8=2√2 e √18=3√2. Depois combina os coeficientes.",
        "Extract the perfect squares: √50=5√2, √8=2√2 and √18=3√2. Then combine the coefficients."),
      question("L2-05", "Expoentes e logaritmos", "Powers and logarithms",
        "Liga os passos para resolver 3^(x+1)=81 e log_{√2}(x−1)=3.",
        "Match the steps for solving 3^(x+1)=81 and log_{√2}(x−1)=3.",
        [
          match("p1", "Escrever 81 como potência de 3", "Write 81 as a power of 3", "p1-p", "81 = 3⁴", "81 = 3⁴"),
          match("p2", "Resolver x+1=4", "Solve x+1=4", "p2-p", "x = 3", "x = 3"),
          match("p3", "Converter log_{√2}(x−1)=3", "Convert log_{√2}(x−1)=3", "p3-p", "x − 1 = (√2)³", "x − 1 = (√2)³"),
          match("p4", "Simplificar (√2)³", "Simplify (√2)³", "p4-p", "2√2", "2√2"),
          match("p5", "Isolar x", "Solve for x", "p5-p", "x = 1 + 2√2", "x = 1 + 2√2")
        ],
        [extra("p-wrong-1", "x = 4", "x = 4"), extra("p-wrong-2", "x = 1 + √6", "x = 1 + √6")],
        "81=3⁴. Na segunda equação, a forma exponencial é x−1=(√2)³=2√2.",
        "81=3⁴. In the second equation, the exponential form is x−1=(√2)³=2√2."),
      question("L2-06", "Domínio real", "Real domains",
        "Determina os domínios de f(x)=1/(x−4), g(x)=√(2x−6) e h(x)=ln(x+1).",
        "Find the domains of f(x)=1/(x−4), g(x)=√(2x−6) and h(x)=ln(x+1).",
        [
          match("d1", "Condição do denominador de f", "Restriction from the denominator of f", "d1-p", "x − 4 ≠ 0", "x − 4 ≠ 0"),
          match("d2", "Domínio de f", "Domain of f", "d2-p", "ℝ \\ {4}", "ℝ \\ {4}"),
          match("d3", "Condição do radicando de g", "Restriction on the radicand of g", "d3-p", "2x − 6 ≥ 0", "2x − 6 ≥ 0"),
          match("d4", "Domínio de g", "Domain of g", "d4-p", "x ≥ 3", "x ≥ 3"),
          match("d5", "Condição do argumento de h", "Restriction on the argument of h", "d5-p", "x + 1 > 0", "x + 1 > 0"),
          match("d6", "Domínio de h", "Domain of h", "d6-p", "x > −1", "x > −1")
        ],
        [extra("d-wrong-1", "x > 3", "x > 3 (not the domain of g)")],
        "O denominador não pode ser zero; a raiz quadrada exige radicando ≥0; o argumento de ln tem de ser estritamente positivo.",
        "The denominator cannot be zero; a square root requires a non-negative radicand; the argument of ln must be strictly positive."),
      question("L2-07", "Funções quadráticas", "Quadratic functions",
        "Para f(x)=x²−4, associa os zeros, o vértice e o sentido da abertura.",
        "For f(x)=x²−4, match the zeros, vertex, and direction of opening.",
        [
          match("q1", "Zeros", "Zeros", "q1-p", "x = −2 e x = 2", "x = −2 and x = 2"),
          match("q2", "Vértice", "Vertex", "q2-p", "(0, −4)", "(0, −4)"),
          match("q3", "Abertura da parábola", "Parabola opening", "q3-p", "Para cima", "Upward")
        ],
        [extra("q-wrong-1", "Para baixo", "Downward"), extra("q-wrong-2", "(0, 4)", "(0, 4)")],
        "x²−4=0 dá x=±2. Sem termo em x, o vértice está no eixo Oy, em (0,−4); a parábola abre para cima.",
        "x²−4=0 gives x=±2. With no x term, the vertex lies on the y-axis at (0,−4); the parabola opens upward."),
      question("L2-08", "Operações e composição", "Operations and composition",
        "Para f(x)=x+1 e g(x)=x², associa (f+g)(x), (f∘g)(x) e (g∘f)(x).",
        "For f(x)=x+1 and g(x)=x², match (f+g)(x), (f∘g)(x) and (g∘f)(x).",
        [
          match("f1", "(f+g)(x)", "(f+g)(x)", "f1-p", "x² + x + 1", "x² + x + 1"),
          match("f2", "(f∘g)(x)=f(g(x))", "(f∘g)(x)=f(g(x))", "f2-p", "x² + 1", "x² + 1"),
          match("f3", "(g∘f)(x)=g(f(x))", "(g∘f)(x)=g(f(x))", "f3-p", "(x + 1)²", "(x + 1)²")
        ],
        [extra("f-wrong-1", "2x + 1", "2x + 1")],
        "Soma as funções termo a termo. Para a composição, substitui a função interior antes de simplificar.",
        "Add the functions term by term. For composition, substitute the inner function before simplifying."),
      question("L2-09", "Trigonometria", "Trigonometry",
        "O cateto oposto mede 3 e a hipotenusa mede 5. Liga as medidas e as razões relativamente a α.",
        "The opposite side is 3 and the hypotenuse is 5. Match the lengths and ratios relative to α.",
        [
          match("t1", "Cateto adjacente", "Adjacent side", "t1-p", "4", "4"),
          match("t2", "Hipotenusa", "Hypotenuse", "t2-p", "5", "5"),
          match("t3", "sen α", "sin α", "t3-p", "3/5", "3/5"),
          match("t4", "cos α", "cos α", "t4-p", "4/5", "4/5")
        ],
        [extra("t-wrong-1", "5/4", "5/4")],
        "Pelo teorema de Pitágoras, o cateto adjacente é √(5²−3²)=4. Depois usa oposto/hipotenusa e adjacente/hipotenusa.",
        "By Pythagoras, the adjacent side is √(5²−3²)=4. Then use opposite/hypotenuse and adjacent/hypotenuse."),
      question("L2-10", "Equação da recta", "Line equation",
        "Determina a recta que passa por A(1,2) e B(3,6). Liga os passos à equação.",
        "Find the line through A(1,2) and B(3,6). Match the steps to its equation.",
        [
          match("l1", "Calcular o declive", "Calculate the slope", "l1-p", "(6−2)/(3−1) = 2", "(6−2)/(3−1) = 2"),
          match("l2", "Usar a forma y=mx+b", "Use the form y=mx+b", "l2-p", "y = 2x + b", "y = 2x + b"),
          match("l3", "Substituir A(1,2)", "Substitute A(1,2)", "l3-p", "2 = 2·1 + b, logo b = 0", "2 = 2·1 + b, so b = 0"),
          match("l4", "Equação final", "Final equation", "l4-p", "y = 2x", "y = 2x")
        ],
        [extra("l-wrong-1", "y = 2x + 1", "y = 2x + 1")],
        "O declive é 2. Substituindo A(1,2), obténs b=0; portanto a recta é y=2x.",
        "The slope is 2. Substituting A(1,2) gives b=0, so the line is y=2x."),
      question("L2-11", "Derivadas", "Derivatives",
        "Deriva f(x)=3x²−4x+7, associando cada termo à sua derivada.",
        "Differentiate f(x)=3x²−4x+7 by matching each term to its derivative.",
        [
          match("v1", "Derivada de 3x²", "Derivative of 3x²", "v1-p", "6x", "6x"),
          match("v2", "Derivada de −4x", "Derivative of −4x", "v2-p", "−4", "−4"),
          match("v3", "Derivada de 7", "Derivative of 7", "v3-p", "0", "0"),
          match("v4", "Derivada completa", "Full derivative", "v4-p", "6x − 4", "6x − 4")
        ],
        [extra("v-wrong-1", "6x² − 4", "6x² − 4")],
        "A regra da potência transforma 3x² em 6x; a derivada de −4x é −4 e a da constante 7 é zero.",
        "The power rule turns 3x² into 6x; the derivative of −4x is −4 and the derivative of constant 7 is zero."),
      question("L2-12", "Primitivas", "Antiderivatives",
        "Calcula a primitiva de ∫(3x²−6x−2) dx. Liga cada termo à sua primitiva e combina-os.",
        "Find the antiderivative of ∫(3x²−6x−2) dx. Match each term to its antiderivative and combine them.",
        [
          match("a1", "Primitiva de 3x²", "Antiderivative of 3x²", "a1-p", "x³", "x³"),
          match("a2", "Primitiva de −6x", "Antiderivative of −6x", "a2-p", "−3x²", "−3x²"),
          match("a3", "Primitiva de −2", "Antiderivative of −2", "a3-p", "−2x", "−2x"),
          match("a4", "Adicionar a constante", "Add the constant", "a4-p", " + C", " + C"),
          match("a5", "Primitiva completa", "Full antiderivative", "a5-p", "x³ − 3x² − 2x + C", "x³ − 3x² − 2x + C")
        ],
        [extra("a-wrong-1", "6x − 6", "6x − 6")],
        "Integra termo a termo: ∫3x²dx=x³, ∫−6xdx=−3x² e ∫−2dx=−2x. Acrescenta C.",
        "Integrate term by term: ∫3x²dx=x³, ∫−6xdx=−3x² and ∫−2dx=−2x. Add C."),
      question("L2-13", "Área por triângulo", "Area using a triangle",
        "A região fica sob y=2x, acima do eixo Ox, de x=0 a x=2. Associa as medidas e calcula a área.",
        "The region is under y=2x, above the x-axis, from x=0 to x=2. Match the dimensions and calculate the area.",
        [
          match("ar1", "Base entre x=0 e x=2", "Base from x=0 to x=2", "ar1-p", "2", "2"),
          match("ar2", "Altura em x=2 (y=2x)", "Height at x=2 (y=2x)", "ar2-p", "4", "4"),
          match("ar3", "Fórmula da área do triângulo", "Triangle area formula", "ar3-p", "A = (base × altura)/2", "A = (base × height)/2"),
          match("ar4", "Área final", "Final area", "ar4-p", "A = 4 unidades²", "A = 4 square units")
        ],
        [extra("ar-wrong-1", "A = 8 unidades²", "A = 8 square units")],
        "Quando x=2, y=4. A região é um triângulo de base 2 e altura 4, logo A=(2×4)/2=4.",
        "At x=2, y=4. The region is a triangle with base 2 and height 4, so A=(2×4)/2=4.")
    ]
  }
];
