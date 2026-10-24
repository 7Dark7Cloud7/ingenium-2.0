const bi = (pt, en) => ({ pt, en });

// Curriculum map transcribed from the uploaded “AULA 1 - INTRODUÇÃO ALGA2026_2027.pdf”.
// Topic names follow the ALGA programme; this is a roadmap, not a claim that lessons are already written.
export const algebraSyllabus = {
  code: 'ALGA',
  title: bi('Álgebra Linear e Geometria Analítica', 'Linear Algebra & Analytic Geometry'),
  subtitle: bi(
    'Coordenadas, vectores, matrizes e sistemas lineares — ferramentas matemáticas usadas na Engenharia.',
    'Coordinates, vectors, matrices and linear systems — mathematical tools used in engineering.'
  ),
  semester: bi('I Semestre · 2026/2027', 'Semester I · 2026/2027'),
  intro: bi(
    'Na Engenharia, a ALGA liga a representação geométrica ao cálculo: pontos, rectas, planos, vectores e matrizes ajudam a descrever forças, fluxos e dados.',
    'In engineering, ALGA connects geometric representation with calculation: points, lines, planes, vectors and matrices help describe forces, flows and data.'
  ),
  units: [
    {
      id: 'analytic-geometry',
      title: bi('Geometria Analítica', 'Analytic Geometry'),
      topics: [
        bi('Sistemas de coordenadas: cartesianas, polares, cilíndricas e esféricas.', 'Coordinate systems: Cartesian, polar, cylindrical and spherical.'),
        bi('Representações cartesianas de rectas e planos.', 'Cartesian representations of lines and planes.'),
        bi('Vectores, coordenadas e operações com vectores.', 'Vectors, coordinates and vector operations.'),
        bi('Produtos internos, bases, complementos e projecções ortogonais.', 'Inner products, bases, complements and orthogonal projections.'),
        bi('Produtos externos e mistos; distâncias e ângulos.', 'Cross and mixed products; distances and angles.'),
        bi('Incidência, paralelismo e superfícies da segunda ordem.', 'Incidence, parallelism and second-order surfaces.')
      ]
    },
    {
      id: 'matrices',
      title: bi('Matrizes e cálculo matricial', 'Matrices and Matrix Calculus'),
      topics: [
        bi('Definições e exemplos de matrizes.', 'Matrix definitions and examples.'),
        bi('Matrizes especiais e característica de uma matriz.', 'Special matrices and matrix rank.'),
        bi('Operações com matrizes e as suas propriedades.', 'Matrix operations and their properties.')
      ]
    },
    {
      id: 'linear-systems',
      title: bi('Sistemas de equações lineares', 'Systems of Linear Equations'),
      topics: [
        bi('Resolução e conjunto-solução de um sistema linear.', 'Solving a linear system and describing its solution set.'),
        bi('Métodos de eliminação de Gauss e de Gauss–Jordan.', 'Gaussian and Gauss–Jordan elimination.'),
        bi('Cálculo da matriz inversa.', 'Finding the inverse matrix.')
      ]
    },
    {
      id: 'determinants',
      title: bi('Determinantes', 'Determinants'),
      topics: [
        bi('Definição e exemplos.', 'Definition and examples.'),
        bi('Teorema de Laplace e propriedades dos determinantes.', 'Laplace expansion and determinant properties.'),
        bi('Matriz inversa pelo método dos cofactores.', 'Finding the inverse matrix using cofactors.')
      ]
    },
    {
      id: 'eigenvalues',
      title: bi('Valores próprios e vectores próprios', 'Eigenvalues and Eigenvectors'),
      topics: [
        bi('Equação característica.', 'Characteristic equation.'),
        bi('Polinómio característico.', 'Characteristic polynomial.')
      ]
    },
    {
      id: 'diagonalization',
      title: bi('Diagonalização de matrizes', 'Matrix Diagonalization'),
      topics: [
        bi('Matrizes semelhantes.', 'Similar matrices.'),
        bi('Matrizes diagonalizáveis.', 'Diagonalizable matrices.')
      ]
    }
  ],
  openingTopics: [
    bi('Sistemas de coordenadas cartesianas no plano (2D).', 'Cartesian coordinate systems in the plane (2D).'),
    bi('Representação de pontos no plano.', 'Representing points in the plane.'),
    bi('Distância entre dois pontos.', 'Distance between two points.'),
    bi('Representações de rectas no plano.', 'Representing lines in the plane.'),
    bi('Perímetro e área de um triângulo.', 'Triangle perimeter and area.')
  ],
  nextTopics: [
    bi('Sistema cartesiano no espaço (3D) e representação de pontos.', 'Cartesian coordinates in space (3D) and point representation.'),
    bi('Sistema de coordenadas polares.', 'Polar coordinate system.')
  ]
};
