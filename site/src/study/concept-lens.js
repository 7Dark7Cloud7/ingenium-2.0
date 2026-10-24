import { stripKey, termsOverlap } from './summary-thread.js';

const CONCEPT_LIBRARY = [
  {
    id: 'velocity',
    keys: ['velocidade', 'velocidade media', 'velocity', 'speed', 'rapidez'],
    icon: 'car',
    wiki: { pt: 'Velocidade', en: 'Velocity' },
    pt: {
      analogy: 'É como o conta-quilómetros: mostra a rapidez com que a posição muda, não o tempo total da viagem.',
      application: { title: 'GPS, carros e desporto', text: 'A velocidade média aparece nos trajetos do GPS, nos velocímetros e nos tempos de uma corrida. O mesmo percurso pode ter velocidades diferentes em cada instante.' },
      mistake: 'Confundir velocidade com aceleração. A velocidade diz como a posição muda; a aceleração diz como a própria velocidade muda.',
    },
    en: {
      analogy: 'It is like a speedometer: it shows how fast position changes, not how long the whole trip took.',
      application: { title: 'GPS, cars and sport', text: 'Average speed appears in GPS routes, speedometers and race timings. The same journey can have different speeds at each moment.' },
      mistake: 'Confusing velocity with acceleration. Velocity describes how position changes; acceleration describes how velocity itself changes.',
    },
  },
  {
    id: 'acceleration',
    keys: ['aceleracao', 'aceleration', 'acceleration'],
    icon: 'phone',
    wiki: { pt: 'Aceleração', en: 'Acceleration' },
    pt: {
      analogy: 'Carregar no acelerador, travar ou virar o volante são três formas de mudar o movimento — as três podem ser aceleração.',
      application: { title: 'Telemóvel e travões', text: 'O acelerómetro do telemóvel deteta mudanças de movimento e roda o ecrã. Num carro, sensores de aceleração ajudam o ABS e os airbags a reagir em milissegundos.' },
      mistake: 'Pensar que acelerar é só aumentar a rapidez. Travar e mudar de direção também produzem aceleração.',
    },
    en: {
      analogy: 'Pressing the accelerator, braking or turning the wheel are three ways of changing motion — all three can be acceleration.',
      application: { title: 'Phones and brakes', text: 'A phone accelerometer detects changes in motion and rotates the screen. In a car, acceleration sensors help ABS and airbags react in milliseconds.' },
      mistake: 'Thinking acceleration only means speeding up. Braking and changing direction also produce acceleration.',
    },
  },
  {
    id: 'force',
    keys: ['forca', 'forcas', 'force', 'forces', 'newton'],
    icon: 'robot',
    wiki: { pt: 'Força', en: 'Force' },
    pt: {
      analogy: 'Uma força é um empurrão ou um puxão. Se duas pessoas empurram a mesma caixa em sentidos opostos com a mesma intensidade, ela não acelera.',
      application: { title: 'Pontes, travões e robôs', text: 'Pontes distribuem forças para o solo, os travões transformam movimento em calor e uma garra robótica controla a força para não esmagar o objeto.' },
      mistake: 'Associar força a movimento. Um objeto parado pode ter várias forças a atuar, desde que se equilibrem.',
    },
    en: {
      analogy: 'A force is a push or a pull. If two people push the same box in opposite directions with equal strength, it does not accelerate.',
      application: { title: 'Bridges, brakes and robots', text: 'Bridges spread forces into the ground, brakes turn motion into heat, and a robot gripper controls force so it does not crush the object.' },
      mistake: 'Linking force directly to motion. A stationary object can have several forces acting on it as long as they balance.',
    },
  },
  {
    id: 'energy',
    keys: ['energia', 'energy', 'energia cinetica', 'kinetic energy', 'energia potencial', 'potential energy'],
    icon: 'bolt',
    wiki: { pt: 'Energia', en: 'Energy' },
    pt: {
      analogy: 'A energia é como dinheiro guardado em várias contas: pode mudar de conta, mas o total de um sistema fechado mantém-se.',
      application: { title: 'Travagem regenerativa e montanhas-russas', text: 'Um carro elétrico recupera parte da energia ao travar. Numa montanha-russa, a energia potencial no topo transforma-se em energia cinética na descida.' },
      mistake: 'Achar que a energia desaparece quando um objeto para. Ela transforma-se noutra forma, muitas vezes em calor.',
    },
    en: {
      analogy: 'Energy is like money kept in several accounts: it can move between accounts, but the total in a closed system stays the same.',
      application: { title: 'Regenerative braking and roller coasters', text: 'An electric car recovers part of the energy when braking. On a roller coaster, potential energy at the top turns into kinetic energy on the way down.' },
      mistake: 'Thinking energy disappears when an object stops. It changes form, often into heat.',
    },
  },
  {
    id: 'free-fall',
    keys: ['queda livre', 'free fall', 'gravidade', 'gravity'],
    icon: 'fall',
    wiki: { pt: 'Queda livre', en: 'Free fall' },
    pt: {
      analogy: 'Sem resistência do ar, uma pena e um martelo caem lado a lado — a gravidade dá-lhes a mesma aceleração.',
      application: { title: 'Paraquedas e quedas de telemóvel', text: 'O paraquedas aumenta a resistência do ar e reduz a velocidade terminal. Os testes de queda de telemóveis usam a mesma física para prever danos.' },
      mistake: 'Achar que um objeto mais pesado cai sempre mais depressa. Sem ar, todos caem com a mesma aceleração.',
    },
    en: {
      analogy: 'Without air resistance, a feather and a hammer fall side by side — gravity gives them the same acceleration.',
      application: { title: 'Parachutes and phone drop tests', text: 'A parachute increases air resistance and lowers terminal speed. Phone drop tests use the same physics to predict damage.' },
      mistake: 'Thinking a heavier object always falls faster. Without air, all objects fall with the same acceleration.',
    },
  },
  {
    id: 'kinematics',
    keys: ['cinematica', 'kinematics', 'movimento', 'motion', 'deslocamento', 'displacement'],
    icon: 'route',
    wiki: { pt: 'Cinemática', en: 'Kinematics' },
    pt: {
      analogy: 'A cinemática é o filme do movimento: descreve onde o objeto está, com que rapidez se move e como isso muda, sem perguntar ainda qual foi a força.',
      application: { title: 'Animação, robótica e desporto', text: 'Videojogos interpolam posições, braços robóticos planeiam trajetórias e analistas usam trajetórias de atletas para melhorar técnicas.' },
      mistake: 'Misturar posição, velocidade e aceleração nos mesmos eixos sem olhar às unidades e ao significado de cada gráfico.',
    },
    en: {
      analogy: 'Kinematics is the movie of motion: it describes where an object is, how fast it moves and how that changes, before asking which force caused it.',
      application: { title: 'Animation, robotics and sport', text: 'Video games interpolate positions, robot arms plan paths, and analysts study athlete trajectories to improve technique.' },
      mistake: 'Mixing position, velocity and acceleration on the same axes without checking units and what each graph means.',
    },
  },
  {
    id: 'matrix',
    keys: ['matriz', 'matrizes', 'matrix', 'matrices', 'determinante', 'determinant'],
    icon: 'cube',
    wiki: { pt: 'Matriz (matemática)', en: 'Matrix (mathematics)' },
    pt: {
      analogy: 'Uma matriz é uma máquina de transformar setas: recebe um vetor e devolve outro, rodado, esticado ou refletido.',
      application: { title: 'Gráficos 3D, robótica e imagens', text: 'Jogos usam matrizes para mover e rodar objetos, robôs para mudar de referencial e filtros de imagem para combinar píxeis.' },
      mistake: 'Multiplicar matrizes pela ordem errada. Em geral, AB não é igual a BA.',
    },
    en: {
      analogy: 'A matrix is a machine for transforming arrows: it takes a vector and returns another one, rotated, stretched or reflected.',
      application: { title: '3D graphics, robotics and images', text: 'Games use matrices to move and rotate objects, robots to change reference frames, and image filters to combine pixels.' },
      mistake: 'Multiplying matrices in the wrong order. In general, AB is not equal to BA.',
    },
  },
  {
    id: 'vector',
    keys: ['vetor', 'vetores', 'vector', 'vectors', 'grandeza vetorial'],
    icon: 'vector',
    wiki: { pt: 'Vetor', en: 'Euclidean vector' },
    pt: {
      analogy: 'Um vetor é uma seta com comprimento e direção. «5 km a norte» é diferente de «5 km a sul», mesmo com o mesmo número.',
      application: { title: 'GPS, forças e jogos', text: 'O GPS combina deslocamentos com direção, as forças somam-se como setas e os motores físicos dos jogos usam vetores para mover objetos.' },
      mistake: 'Somar apenas os valores numéricos e ignorar as direções.',
    },
    en: {
      analogy: 'A vector is an arrow with length and direction. “5 km north” differs from “5 km south” even though the number is the same.',
      application: { title: 'GPS, forces and games', text: 'GPS combines displacements with direction, forces add like arrows, and game physics engines use vectors to move objects.' },
      mistake: 'Adding only the numbers and ignoring directions.',
    },
  },
  {
    id: 'derivative',
    keys: ['derivada', 'derivative', 'diferenciacao', 'differentiation'],
    icon: 'chart',
    wiki: { pt: 'Derivada', en: 'Derivative' },
    pt: {
      analogy: 'A derivada é o velocímetro de um gráfico: mostra a rapidez com que a curva sobe ou desce num ponto.',
      application: { title: 'Otimização e inteligência artificial', text: 'Derivadas encontram o melhor ponto de uma função, calculam velocidade instantânea e orientam o treino de redes neuronais.' },
      mistake: 'Confundir o valor da função com a sua derivada. A função pode ser positiva e estar a descer.',
    },
    en: {
      analogy: 'A derivative is the speedometer of a graph: it shows how fast the curve rises or falls at a point.',
      application: { title: 'Optimisation and AI', text: 'Derivatives find a function’s best point, compute instantaneous velocity and guide the training of neural networks.' },
      mistake: 'Confusing the value of a function with its derivative. A function can be positive while decreasing.',
    },
  },
  {
    id: 'integral',
    keys: ['integral', 'integrais', 'integral definida', 'integral indefinida'],
    icon: 'sigma',
    wiki: { pt: 'Integral', en: 'Integral' },
    pt: {
      analogy: 'Integrar é somar fatias muito finas. Uma pilha de fatias finas pode formar uma área, um volume ou uma quantidade acumulada.',
      application: { title: 'Energia, áreas e sinais', text: 'Integrais calculam áreas e volumes, acumulam potência ao longo do tempo para dar energia e filtram sinais em eletrónica.' },
      mistake: 'Achar que a integral é sempre uma área geométrica. Também pode representar quantidades acumuladas.',
    },
    en: {
      analogy: 'Integrating is adding very thin slices. A stack of thin slices can make an area, a volume or an accumulated quantity.',
      application: { title: 'Energy, areas and signals', text: 'Integrals compute areas and volumes, accumulate power over time into energy, and filter signals in electronics.' },
      mistake: 'Thinking an integral is always a geometric area. It can also represent accumulated quantities.',
    },
  },
  {
    id: 'function',
    keys: ['funcao', 'funcoes', 'function', 'functions', 'dominio', 'contradominio'],
    icon: 'spark',
    wiki: { pt: 'Função (matemática)', en: 'Function (mathematics)' },
    pt: {
      analogy: 'Uma função é uma máquina com uma entrada e uma saída: para cada valor que metes, devolve um resultado bem definido.',
      application: { title: 'Sensores e controlo', text: 'Curvas de calibração convertem a leitura de um sensor em temperatura ou distância, e controladores usam funções para decidir a resposta de um motor.' },
      mistake: 'Confundir a função com um único par entrada-saída; a regra tem de valer para todos os valores do domínio.',
    },
    en: {
      analogy: 'A function is a machine with one input and one output: for each value you put in, it returns a well-defined result.',
      application: { title: 'Sensors and control', text: 'Calibration curves turn a sensor reading into temperature or distance, and controllers use functions to decide a motor response.' },
      mistake: 'Confusing a function with a single input-output pair; the rule must hold for every value in the domain.',
    },
  },
  {
    id: 'limit',
    keys: ['limite', 'limites', 'limit', 'limits', 'convergencia', 'convergence'],
    icon: 'target',
    wiki: { pt: 'Limite (matemática)', en: 'Limit (mathematics)' },
    pt: {
      analogy: 'Um limite é o destino de uma viagem: não interessa se chegas ao ponto exato, mas para onde os passos se aproximam.',
      application: { title: 'Métodos numéricos', text: 'Computadores aproximam respostas com sequências; o limite diz se essa aproximação estabiliza e com que erro.' },
      mistake: 'Achar que o limite é sempre o valor da função no ponto. A função pode nem estar definida aí.',
    },
    en: {
      analogy: 'A limit is the destination of a journey: what matters is where the steps approach, not whether you land exactly on the point.',
      application: { title: 'Numerical methods', text: 'Computers approximate answers with sequences; the limit tells you whether the approximation settles and with what error.' },
      mistake: 'Thinking the limit is always the function value at that point. The function may not even be defined there.',
    },
  },
  {
    id: 'atom',
    keys: ['atomo', 'atomos', 'atom', 'atoms', 'eletrao', 'eletroes', 'electron', 'electrons'],
    icon: 'atom',
    wiki: { pt: 'Átomo', en: 'Atom' },
    pt: {
      analogy: 'O átomo é como um estádio: o núcleo é uma ervilha no centro e os eletrões são nuvens muito espalhadas pelas bancadas.',
      application: { title: 'Semicondutores e LEDs', text: 'O comportamento dos eletrões nos átomos explica porque o silício conduz melhor em certas condições e porque um LED emite luz.' },
      mistake: 'Imaginar o átomo como uma bola maciça. A maior parte é espaço vazio e os eletrões não são bolinhas em órbitas perfeitas.',
    },
    en: {
      analogy: 'An atom is like a stadium: the nucleus is a pea at the centre and the electrons are clouds spread across the stands.',
      application: { title: 'Semiconductors and LEDs', text: 'Electron behaviour in atoms explains why silicon conducts better under certain conditions and why an LED emits light.' },
      mistake: 'Imagining an atom as a solid ball. Most of it is empty space and electrons are not tiny balls in perfect orbits.',
    },
  },
  {
    id: 'molecule',
    keys: ['molecula', 'moleculas', 'molecule', 'molecules', 'ligacao covalente', 'covalent bond'],
    icon: 'flask',
    wiki: { pt: 'Molécula', en: 'Molecule' },
    pt: {
      analogy: 'Uma molécula é uma equipa de átomos com uma forma própria. A mesma equipa pode comportar-se de maneira diferente se mudar de posição.',
      application: { title: 'Medicamentos, materiais e plásticos', text: 'A forma das moléculas decide como um fármaco encaixa num recetor e porque um plástico é flexível ou rígido.' },
      mistake: 'Achar que a fórmula molecular diz tudo. Dois compostos com os mesmos átomos podem ter propriedades diferentes.',
    },
    en: {
      analogy: 'A molecule is a team of atoms with its own shape. The same team can behave differently if it changes position.',
      application: { title: 'Medicines, materials and plastics', text: 'Molecular shape decides how a drug fits a receptor and why a plastic is flexible or rigid.' },
      mistake: 'Thinking the molecular formula says everything. Two compounds with the same atoms can have different properties.',
    },
  },
  {
    id: 'reaction',
    keys: ['reacao', 'reacoes', 'reaction', 'reactions', 'reagente', 'reagent', 'produto', 'product'],
    icon: 'flask',
    wiki: { pt: 'Reação química', en: 'Chemical reaction' },
    pt: {
      analogy: 'Numa reação, os átomos são peças de Lego que se separam e voltam a encaixar de outra maneira. As peças não desaparecem.',
      application: { title: 'Combustão, baterias e corrosão', text: 'A combustão liberta energia, as baterias movem iões entre elétrodos e a corrosão ataca metais por reações com o ambiente.' },
      mistake: 'Achar que uma reação faz desaparecer matéria. Os átomos reorganizam-se e a massa conserva-se.',
    },
    en: {
      analogy: 'In a reaction, atoms are Lego pieces that come apart and snap together differently. The pieces do not disappear.',
      application: { title: 'Combustion, batteries and corrosion', text: 'Combustion releases energy, batteries move ions between electrodes, and corrosion attacks metals through reactions with the environment.' },
      mistake: 'Thinking a reaction makes matter disappear. Atoms rearrange and mass is conserved.',
    },
  },
  {
    id: 'mole',
    keys: ['mole', 'mol', 'molécula-grama', 'avogadro'],
    icon: 'layers',
    wiki: { pt: 'Mol', en: 'Mole (unit)' },
    pt: {
      analogy: 'O mol é como uma dúzia: não mede massa, conta partículas. Uma dúzia de ovos e uma dúzia de berlindes têm o mesmo número, não a mesma massa.',
      application: { title: 'Dosagens e produção industrial', text: 'Indústrias usam moles para saber quanto reagente é preciso e quanto produto esperar de uma reação.' },
      mistake: 'Confundir massa com quantidade de matéria. Um mol de átomos leves pesa menos do que um mol de átomos pesados.',
    },
    en: {
      analogy: 'A mole is like a dozen: it counts particles, not mass. A dozen eggs and a dozen marbles have the same count, not the same mass.',
      application: { title: 'Dosing and industrial production', text: 'Industries use moles to know how much reagent is needed and how much product a reaction should yield.' },
      mistake: 'Confusing mass with amount of substance. A mole of light atoms weighs less than a mole of heavy atoms.',
    },
  },
  {
    id: 'ph',
    keys: ['ph', 'acidez', 'acidity', 'acido', 'acid', 'base'],
    icon: 'flask',
    wiki: { pt: 'pH', en: 'pH' },
    pt: {
      analogy: 'A escala de pH é como uma régua de acidez. Cada passo inteiro representa uma mudança de dez vezes na concentração de iões H+.',
      application: { title: 'Água potável e agricultura', text: 'O pH controla o tratamento da água, a absorção de nutrientes pelas plantas e a conservação de alimentos.' },
      mistake: 'Achar que pH 3 é apenas um pouco mais ácido do que pH 4. A diferença é de cerca de dez vezes na concentração de H+.',
    },
    en: {
      analogy: 'The pH scale is a ruler for acidity. Each whole step represents a tenfold change in H+ ion concentration.',
      application: { title: 'Drinking water and agriculture', text: 'pH controls water treatment, how plants absorb nutrients and food preservation.' },
      mistake: 'Thinking pH 3 is only slightly more acidic than pH 4. The difference is about ten times the H+ concentration.',
    },
  },
  {
    id: 'current',
    keys: ['corrente eletrica', 'corrente', 'current', 'ampere', 'amperes'],
    icon: 'bolt',
    wiki: { pt: 'Corrente elétrica', en: 'Electric current' },
    pt: {
      analogy: 'A corrente é o caudal de um rio de eletrões. A tensão é a diferença de altura que faz o rio correr.',
      application: { title: 'Circuitos, motores e baterias', text: 'A corrente alimenta motores e circuitos; os disjuntores protegem a instalação quando passa demasiada corrente.' },
      mistake: 'Confundir corrente com tensão. Uma pilha pode ter tensão sem haver corrente até o circuito fechar.',
    },
    en: {
      analogy: 'Current is the flow of a river of electrons. Voltage is the height difference that makes the river run.',
      application: { title: 'Circuits, motors and batteries', text: 'Current powers motors and circuits; breakers protect an installation when too much current flows.' },
      mistake: 'Confusing current with voltage. A battery can have voltage without current until the circuit closes.',
    },
  },
  {
    id: 'voltage',
    keys: ['tensao', 'voltagem', 'voltage', 'potencial eletrico', 'electric potential'],
    icon: 'bolt',
    wiki: { pt: 'Tensão elétrica', en: 'Voltage' },
    pt: {
      analogy: 'A tensão é a diferença de pressão numa canalização: cria a possibilidade de movimento, mas não é o movimento em si.',
      application: { title: 'Redes elétricas e eletrónica', text: 'A rede elétrica mantém uma tensão estável para que aparelhos funcionem, e conversores ajustam tensões para chips e motores.' },
      mistake: 'Dizer que a tensão «flui». A tensão é uma diferença de potencial entre dois pontos.',
    },
    en: {
      analogy: 'Voltage is like the pressure difference in a pipe: it creates the possibility of flow, but is not the flow itself.',
      application: { title: 'Power grids and electronics', text: 'The grid maintains a stable voltage for appliances, and converters adjust voltages for chips and motors.' },
      mistake: 'Saying voltage “flows”. Voltage is a potential difference between two points.',
    },
  },
  {
    id: 'torque',
    keys: ['torque', 'binario', 'momento', 'moment'],
    icon: 'wrench',
    wiki: { pt: 'Binário (física)', en: 'Torque' },
    pt: {
      analogy: 'Torque é a eficácia de uma força para fazer rodar algo. Empurrar a porta junto à dobradiça quase não a abre; empurrar longe dela abre.',
      application: { title: 'Motores, parafusos e braços robóticos', text: 'O torque de um motor decide a força de uma junta robótica; a chave dinamométrica controla o aperto de um parafuso.' },
      mistake: 'Confundir torque com força. O torque também depende da distância entre a força e o eixo de rotação.',
    },
    en: {
      analogy: 'Torque is how effectively a force makes something turn. Pushing a door near the hinge barely opens it; pushing far from the hinge works.',
      application: { title: 'Motors, bolts and robot arms', text: 'Motor torque determines a robot joint’s strength; a torque wrench controls how tightly a bolt is tightened.' },
      mistake: 'Confusing torque with force. Torque also depends on the distance between the force and the rotation axis.',
    },
  },
  {
    id: 'friction',
    keys: ['atrito', 'friccao', 'friction'],
    icon: 'car',
    wiki: { pt: 'Atrito', en: 'Friction' },
    pt: {
      analogy: 'O atrito é o preço do contacto: sem ele não consegues andar nem travar, mas ele também aquece e desgasta as peças.',
      application: { title: 'Travões, pneus e chão', text: 'Os travões usam atrito para parar o carro e os pneus usam-no para transmitir movimento ao chão. Já num rolamento, o atrito é reduzido ao mínimo.' },
      mistake: 'Achar que o atrito é sempre mau. Sem atrito, não conseguirias caminhar nem segurar um lápis.',
    },
    en: {
      analogy: 'Friction is the price of contact: without it you cannot walk or brake, but it also heats and wears parts.',
      application: { title: 'Brakes, tyres and floors', text: 'Brakes use friction to stop a car and tyres use it to transmit motion to the ground. In a bearing, friction is reduced to a minimum.' },
      mistake: 'Thinking friction is always bad. Without it you could not walk or hold a pencil.',
    },
  },
  {
    id: 'wave',
    keys: ['onda', 'ondas', 'wave', 'waves', 'frequencia', 'frequency', 'comprimento de onda'],
    icon: 'relative',
    wiki: { pt: 'Onda', en: 'Wave' },
    pt: {
      analogy: 'Uma onda transporta energia sem levar o meio consigo: a onda passa no estádio, mas as pessoas voltam ao mesmo lugar.',
      application: { title: 'Wi-Fi, som e ultrassons', text: 'Wi-Fi e rádio transportam informação em ondas eletromagnéticas; o som e os ultrassons permitem falar e fazer ecografias.' },
      mistake: 'Confundir frequência com velocidade. A frequência conta oscilações por segundo; a velocidade diz quão depressa a onda avança.',
    },
    en: {
      analogy: 'A wave carries energy without carrying the medium: a stadium wave passes while people return to the same seat.',
      application: { title: 'Wi-Fi, sound and ultrasound', text: 'Wi-Fi and radio carry information on electromagnetic waves; sound and ultrasound let us speak and make medical images.' },
      mistake: 'Confusing frequency with speed. Frequency counts oscillations per second; speed says how fast the wave travels.',
    },
  },
  {
    id: 'circuit',
    keys: ['circuito', 'circuitos', 'circuit', 'resistencia', 'resistance', 'ohm'],
    icon: 'cpu',
    wiki: { pt: 'Circuito elétrico', en: 'Electrical network' },
    pt: {
      analogy: 'Um circuito é uma pista fechada: se houver uma corte, os carros não completam a volta. A fonte dá energia, os componentes usam-na.',
      application: { title: 'Eletrónica e mecatrónica', text: 'Sensores, microcontroladores e motores formam circuitos; a resistência e a tensão determinam a corrente em cada ramo.' },
      mistake: 'Achar que a corrente escolhe apenas o caminho de menor resistência. Num circuito paralelo, ela divide-se pelos ramos.',
    },
    en: {
      analogy: 'A circuit is a closed track: if there is a cut, the cars cannot complete a lap. The source supplies energy and the components use it.',
      application: { title: 'Electronics and mechatronics', text: 'Sensors, microcontrollers and motors form circuits; resistance and voltage determine the current in each branch.' },
      mistake: 'Thinking current only takes the path of least resistance. In a parallel circuit, it splits across branches.',
    },
  },
  {
    id: 'control',
    keys: ['controlo', 'controle', 'control', 'sistema de controlo', 'feedback', 'realimentacao'],
    icon: 'robot',
    wiki: { pt: 'Teoria de controlo', en: 'Control theory' },
    pt: {
      analogy: 'Controlar é como regular o chuveiro: medes a temperatura, comparas com o que queres e corriges a torneira. É um ciclo, não uma ação única.',
      application: { title: 'Drones, termostatos e robôs', text: 'Drones ajustam hélices para manter a posição, termostatos mantêm a temperatura e braços robóticos corrigem o erro face ao alvo.' },
      mistake: 'Achar que controlar é só ligar e desligar. Um bom controlo mede o resultado e corrige o erro continuamente.',
    },
    en: {
      analogy: 'Control is like adjusting a shower: you measure the temperature, compare it with what you want and correct the tap. It is a loop, not a single action.',
      application: { title: 'Drones, thermostats and robots', text: 'Drones adjust rotors to hold position, thermostats hold temperature and robot arms correct their error against a target.' },
      mistake: 'Thinking control is just switching on and off. Good control measures the result and continuously corrects the error.',
    },
  },
];

const SUBJECT_APPLICATIONS = {
  physics: [
    { icon: 'car', title: 'Segurança de um carro', text: 'Os travões convertem energia cinética em calor e os sensores de aceleração ajudam os airbags a abrir no momento certo.' },
    { icon: 'robot', title: 'Robôs que se movem', text: 'Braços robóticos planeiam posições, velocidades e acelerações para chegarem ao alvo sem colidir.' },
    { icon: 'phone', title: 'O teu telemóvel', text: 'Acelerómetros, giroscópios e GPS usam princípios da física para saber onde estás e como te moves.' },
  ],
  math: [
    { icon: 'route', title: 'Rotas e horários', text: 'Funções e otimização ajudam aplicações de mapas a comparar caminhos, tempos e consumos.' },
    { icon: 'cube', title: 'Jogos e animação', text: 'Transformações matemáticas movem câmaras, personagens e objetos em cada fotograma.' },
    { icon: 'chart', title: 'Dados e previsões', text: 'Modelos matemáticos resumem dados e permitem comparar cenários antes de decidir.' },
  ],
  algebra: [
    { icon: 'cube', title: 'Gráficos 3D', text: 'Matrizes transformam os vértices de um modelo em jogos, filmes e simulações.' },
    { icon: 'robot', title: 'Robótica', text: 'Rotações, mudanças de referencial e cinemática usam matrizes e vetores.' },
    { icon: 'camera', title: 'Imagens digitais', text: 'Filtros, compressão e reconhecimento de imagem usam operações lineares sobre grandes conjuntos de números.' },
  ],
  chemistry: [
    { icon: 'bolt', title: 'Baterias', text: 'Reações de oxidação-redução armazenam e libertam energia elétrica de forma controlada.' },
    { icon: 'flask', title: 'Água potável', text: 'O pH e as reações de precipitação ajudam a remover impurezas no tratamento da água.' },
    { icon: 'layers', title: 'Materiais', text: 'As ligações entre átomos explicam a dureza, a condução e a flexibilidade dos materiais.' },
  ],
  general: [
    { icon: 'compass', title: 'Projetos de engenharia', text: 'Medir, modelar, testar e corrigir: o mesmo ciclo aparece em qualquer projeto técnico.' },
    { icon: 'chart', title: 'Decisões com dados', text: 'Comparar alternativas com critérios claros evita escolhas só por intuição.' },
    { icon: 'book', title: 'Comunicação técnica', text: 'Explicar o problema, o método e o resultado é tão importante como obter o número.' },
  ],
};

const SUBJECT_LABELS = {
  physics: { pt: 'Física', en: 'Physics' },
  math: { pt: 'Matemática', en: 'Mathematics' },
  algebra: { pt: 'ALGA', en: 'ALGA' },
  chemistry: { pt: 'Química', en: 'Chemistry' },
  general: { pt: 'Geral', en: 'General' },
};

function matchedEntry(term) {
  const key = stripKey(term);
  if (!key) return null;
  return CONCEPT_LIBRARY.find((entry) => entry.keys.some((candidate) => termsOverlap(key, candidate))) || null;
}

function copyFor(entry, lang) {
  return entry ? entry[lang === 'en' ? 'en' : 'pt'] : null;
}

function sentenceWithTerm(analysis, term, candidates) {
  return candidates.find((sentence) => {
    const normalized = stripKey(sentence);
    return normalized.includes(stripKey(term));
  }) || '';
}

function uniqueByTitle(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = stripKey(item.title);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function buildOnlineLinks(analysis = {}, { lang = 'pt', title = '' } = {}) {
  const isPt = lang !== 'en';
  const firstDefinition = analysis.definitions?.[0]?.term;
  const firstKeyword = analysis.keywords?.[0]?.term;
  const concept = String(firstDefinition || firstKeyword || title || '').trim();
  const query = concept || (isPt ? 'engenharia mecatrónica' : 'mechatronics engineering');
  return {
    concept,
    query,
    links: [
      {
        id: 'wikipedia',
        label: 'Wikipédia',
        description: isPt ? 'Definição e contexto' : 'Definition and context',
        url: `https://${isPt ? 'pt' : 'en'}.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}`,
      },
      {
        id: 'khan',
        label: 'Khan Academy',
        description: isPt ? 'Explicações e exercícios' : 'Explanations and practice',
        url: isPt
          ? `https://pt.khanacademy.org/search?page_search_query=${encodeURIComponent(query)}`
          : `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(query)}`,
      },
      {
        id: 'youtube',
        label: 'YouTube',
        description: isPt ? 'Vídeos explicativos' : 'Explainer videos',
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${query} ${isPt ? 'explicação' : 'explained'}`)}`,
      },
    ],
  };
}

export function buildWikipediaSearchUrl(term, lang = 'pt') {
  return `https://${lang === 'en' ? 'en' : 'pt'}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(String(term || ''))}&srlimit=1&format=json&origin=*`;
}

export function buildConceptLens(analysis = {}, { lang = 'pt', title = '' } = {}) {
  const isPt = lang !== 'en';
  const subject = SUBJECT_LABELS[analysis.subject] ? analysis.subject : 'general';
  const terms = [];
  const seenTerms = new Set();
  for (const definition of analysis.definitions || []) {
    const key = stripKey(definition.term);
    if (!key || seenTerms.has(key)) continue;
    seenTerms.add(key);
    terms.push({ term: definition.term, definition: definition.predicate, sentence: definition.sentence, kind: 'definition' });
  }
  for (const keyword of analysis.keywords || []) {
    const key = stripKey(keyword.term);
    if (!key || seenTerms.has(key)) continue;
    seenTerms.add(key);
    terms.push({ term: keyword.term, definition: '', sentence: '', kind: 'keyword' });
  }

  const usedEntries = new Set();
  const concepts = [];
  for (const item of terms) {
    if (concepts.length >= 4) break;
    const entry = matchedEntry(item.term);
    if (entry && usedEntries.has(entry.id)) continue;
    if (entry) usedEntries.add(entry.id);
    const copy = copyFor(entry, lang);
    const why = sentenceWithTerm(analysis, item.term, analysis.keyIdeas || [])
      || analysis.centralIdea
      || item.sentence
      || '';
    const subjectApps = SUBJECT_APPLICATIONS[subject];
    const fallbackApp = subjectApps[concepts.length % subjectApps.length];
    concepts.push({
      term: item.term,
      definition: item.definition || (isPt ? 'O teu texto usa este termo, mas ainda não o define de forma explícita.' : 'Your text uses this term but does not define it explicitly yet.'),
      definitionSentence: item.sentence,
      why,
      analogy: copy?.analogy || '',
      application: copy?.application || { title: fallbackApp.title, text: fallbackApp.text },
      mistake: copy?.mistake || (isPt
        ? 'Reconhecer a palavra não chega. Tenta usá-la numa frase tua, com um exemplo.'
        : 'Recognising the word is not enough. Try using it in a sentence of your own, with an example.'),
      wikiTerm: entry?.wiki?.[isPt ? 'pt' : 'en'] || item.term,
      icon: entry?.icon || 'spark',
      curated: Boolean(entry),
      needsDefinition: !item.definition,
    });
  }

  if (!concepts.length) {
    const fallback = String(analysis.centralIdea || analysis.title || title || (isPt ? 'o teu tema' : 'your topic')).trim();
    const subjectApps = SUBJECT_APPLICATIONS[subject];
    concepts.push({
      term: title || analysis.title || (isPt ? 'Ideia central' : 'Central idea'),
      definition: fallback,
      definitionSentence: analysis.centralIdea || '',
      why: analysis.keyIdeas?.[1] || analysis.centralIdea || '',
      analogy: '',
      application: subjectApps[0],
      mistake: isPt ? 'Não tentes decorar tudo de uma vez. Escolhe uma ideia e explica-a em voz alta.' : 'Do not try to memorise everything at once. Pick one idea and explain it out loud.',
      wikiTerm: title || analysis.title || '',
      icon: 'compass',
      curated: false,
      needsDefinition: false,
    });
  }

  const subjectApps = SUBJECT_APPLICATIONS[subject].map((item) => ({ ...item, kicker: SUBJECT_LABELS[subject][isPt ? 'pt' : 'en'], source: 'subject' }));
  const conceptApps = concepts.map((concept) => ({
    icon: concept.icon,
    title: concept.application.title,
    text: concept.application.text,
    kicker: concept.term,
    source: concept.curated ? 'concept' : 'subject',
  }));
  const applications = uniqueByTitle([...conceptApps, ...subjectApps]).slice(0, 4);

  const online = buildOnlineLinks(analysis, { lang, title });
  const labNodes = concepts.map((concept) => ({
    term: concept.term,
    detail: concept.definition,
    application: concept.application.title,
    applicationText: concept.application.text,
    icon: concept.icon,
  }));

  return {
    subject,
    subjectLabel: SUBJECT_LABELS[subject][isPt ? 'pt' : 'en'],
    concepts,
    applications,
    online,
    lab: {
      title: isPt ? 'Laboratório prático 3D' : 'Practical 3D lab',
      intro: isPt
        ? 'Um cenário real construído para esta matéria: um braço robótico para álgebra, um drone para física, uma molécula para química. Arrasta para rodar e seleciona os pontos para veres onde cada conceito é usado.'
        : 'A real scene built for this subject: a robot arm for algebra, a drone for physics, a molecule for chemistry. Drag to rotate and select the points to see where each concept is used.',
      nodes: labNodes,
    },
    note: isPt
      ? 'As analogias e aplicações são conteúdo geral do tema, não frases inventadas a partir do teu resumo. Confirma com o professor quando for para avaliação.'
      : 'Analogies and applications are general subject knowledge, not sentences invented from your summary. Check with your teacher for assessed work.',
  };
}
