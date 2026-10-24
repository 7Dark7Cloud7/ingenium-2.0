const bi = (pt, en) => ({ pt, en });

// Formula triangles and quick-reference shortcuts ported from Ingenium, adapted for the 2.0 interface.
export const triangleFormulas = [
  {
    "id": "m-geometry",
    "subject": "math",
    "title": {
      "pt": "Geometria",
      "en": "Geometry"
    },
    "top": {
      "symbol": "A",
      "label": {
        "pt": "área",
        "en": "area"
      },
      "spoken": {
        "pt": "a área",
        "en": "the area"
      }
    },
    "left": {
      "symbol": "b",
      "label": {
        "pt": "base",
        "en": "base"
      },
      "spoken": {
        "pt": "a base",
        "en": "the base"
      }
    },
    "right": {
      "symbol": "h",
      "label": {
        "pt": "altura",
        "en": "height"
      },
      "spoken": {
        "pt": "a altura",
        "en": "the height"
      }
    },
    "base": {
      "pt": "A área de um rectângulo é a base vezes a altura. Se souberes a área e um dos lados, divides para descobrir o outro.",
      "en": "The area of a rectangle is the base times the height. If you know the area and one side, you divide to find the other."
    },
    "details": [
      {
        "title": {
          "pt": "Como usar",
          "en": "How to use it"
        },
        "text": {
          "pt": "Tapa a grandeza que queres descobrir. Com o dedo a tapar A, ficas com A = b × h. A tapar b, ficas com b = A ÷ h. A posição no triângulo dá-te a conta certa — não precisas de decorar três fórmulas.",
          "en": "Cover the quantity you want to find. With your finger over A, you get A = b × h. Cover b and you get b = A ÷ h. The spot in the triangle gives you the right operation — you don't need to memorize three formulas."
        }
      },
      {
        "title": {
          "pt": "No exame",
          "en": "On the exam"
        },
        "text": {
          "pt": "Um rectângulo de 8 cm por 3 cm tem área 8 × 3 = 24 cm². Escreve sempre a unidade: centímetro vezes centímetro dá centímetro quadrado.",
          "en": "A rectangle 8 cm by 3 cm has area 8 × 3 = 24 cm². Always write the unit: centimeter times centimeter gives square centimeters."
        }
      }
    ]
  },
  {
    "id": "m-probability",
    "subject": "math",
    "title": {
      "pt": "Probabilidade e estatística",
      "en": "Probability and statistics"
    },
    "top": {
      "symbol": "F",
      "label": {
        "pt": "favoráveis",
        "en": "favorable"
      },
      "spoken": {
        "pt": "os casos favoráveis",
        "en": "the favorable cases"
      }
    },
    "left": {
      "symbol": "P",
      "label": {
        "pt": "probabilidade",
        "en": "probability"
      },
      "spoken": {
        "pt": "a probabilidade",
        "en": "the probability"
      }
    },
    "right": {
      "symbol": "T",
      "label": {
        "pt": "total",
        "en": "total"
      },
      "spoken": {
        "pt": "o total de casos",
        "en": "the total number of cases"
      }
    },
    "base": {
      "pt": "A probabilidade é a divisão entre casos favoráveis e casos possíveis. O resultado anda sempre entre 0 e 1 — ou entre 0% e 100%.",
      "en": "Probability is the favorable cases divided by the possible cases. The result always stays between 0 and 1 — or between 0% and 100%."
    },
    "details": [
      {
        "title": {
          "pt": "Como usar",
          "en": "How to use it"
        },
        "text": {
          "pt": "Tapa P e divides os favoráveis pelo total. Tapa F e multiplicas P pelo total. Tapa T e divides os favoráveis pela probabilidade. É o mesmo gesto para qualquer pergunta.",
          "en": "Cover P and divide the favorable cases by the total. Cover F and multiply P by the total. Cover T and divide the favorable cases by the probability. It's the same move for any question."
        }
      },
      {
        "title": {
          "pt": "No exame",
          "en": "On the exam"
        },
        "text": {
          "pt": "3 bolas vermelhas em 5 no total: P = 3 ÷ 5 = 0,6, ou 60%. Se o enunciado pede percentagem, multiplica o resultado por 100 e escreve o símbolo %.",
          "en": "3 red balls out of 5 in total: P = 3 ÷ 5 = 0.6, or 60%. If the question asks for a percentage, multiply the result by 100 and write the % sign."
        }
      }
    ]
  },
  {
    "id": "p-motion",
    "subject": "physics",
    "title": {
      "pt": "Movimento",
      "en": "Motion"
    },
    "top": {
      "symbol": "Δs",
      "label": {
        "pt": "distância",
        "en": "distance"
      },
      "spoken": {
        "pt": "a distância",
        "en": "the distance"
      }
    },
    "left": {
      "symbol": "v",
      "label": {
        "pt": "velocidade",
        "en": "speed"
      },
      "spoken": {
        "pt": "a velocidade",
        "en": "the speed"
      }
    },
    "right": {
      "symbol": "Δt",
      "label": {
        "pt": "tempo",
        "en": "time"
      },
      "spoken": {
        "pt": "o tempo",
        "en": "the time"
      }
    },
    "base": {
      "pt": "Se tens duas das três — distância, velocidade, tempo — tapa a terceira no triângulo e a conta aparece.",
      "en": "If you have two of the three — distance, speed, time — cover the third one in the triangle and the math appears."
    },
    "details": [
      {
        "title": {
          "pt": "Como usar",
          "en": "How to use it"
        },
        "text": {
          "pt": "Distância: tapa Δs e multiplicas v por Δt. Velocidade: tapa v e divides Δs por Δt. Tempo: tapa Δt e divides Δs por v. Dividir é sempre o gesto de isolar.",
          "en": "Distance: cover Δs and multiply v by Δt. Speed: cover v and divide Δs by Δt. Time: cover Δt and divide Δs by v. Dividing is always the move that isolates a quantity."
        }
      },
      {
        "title": {
          "pt": "No exame",
          "en": "On the exam"
        },
        "text": {
          "pt": "120 m em 6 s → v = 120 ÷ 6 = 20 m/s. Responde com a unidade certa: m/s, não só 20. Se pedirem em km/h, converte: multiplica por 3,6.",
          "en": "120 m in 6 s → v = 120 ÷ 6 = 20 m/s. Answer with the right unit: m/s, not just 20. If they want km/h, convert: multiply by 3.6."
        }
      }
    ]
  },
  {
    "id": "p-newton",
    "subject": "physics",
    "title": {
      "pt": "Leis de Newton",
      "en": "Newton's laws"
    },
    "top": {
      "symbol": "F",
      "label": {
        "pt": "força",
        "en": "force"
      },
      "spoken": {
        "pt": "a força",
        "en": "the force"
      }
    },
    "left": {
      "symbol": "m",
      "label": {
        "pt": "massa",
        "en": "mass"
      },
      "spoken": {
        "pt": "a massa",
        "en": "the mass"
      }
    },
    "right": {
      "symbol": "a",
      "label": {
        "pt": "aceleração",
        "en": "acceleration"
      },
      "spoken": {
        "pt": "a aceleração",
        "en": "the acceleration"
      }
    },
    "base": {
      "pt": "A força é a massa vezes a aceleração. Mais massa ou mais aceleração dão sempre mais força.",
      "en": "Force is mass times acceleration. More mass or more acceleration always gives more force."
    },
    "details": [
      {
        "title": {
          "pt": "Como usar",
          "en": "How to use it"
        },
        "text": {
          "pt": "Tapa F e multiplicas m por a. Tapa m e divides F por a. Tapa a e divides F por m. Antes de dividir, confirma que as unidades estão no SI: kg, m/s², N.",
          "en": "Cover F and multiply m by a. Cover m and divide F by a. Cover a and divide F by m. Before you divide, check that the units are in SI: kg, m/s², N."
        }
      },
      {
        "title": {
          "pt": "No exame",
          "en": "On the exam"
        },
        "text": {
          "pt": "20 N aplicados numa massa de 4 kg → a = 20 ÷ 4 = 5 m/s². Repara que o enunciado deu a força e não a aceleração: o triângulo existe precisamente para isso.",
          "en": "20 N applied to a mass of 4 kg → a = 20 ÷ 4 = 5 m/s². Notice the question gave you the force, not the acceleration: the triangle exists for exactly that."
        }
      }
    ]
  },
  {
    "id": "p-forces",
    "subject": "physics",
    "title": {
      "pt": "Forças e atrito",
      "en": "Forces and friction"
    },
    "top": {
      "symbol": "P",
      "label": {
        "pt": "peso",
        "en": "weight"
      },
      "spoken": {
        "pt": "o peso",
        "en": "the weight"
      }
    },
    "left": {
      "symbol": "m",
      "label": {
        "pt": "massa",
        "en": "mass"
      },
      "spoken": {
        "pt": "a massa",
        "en": "the mass"
      }
    },
    "right": {
      "symbol": "g",
      "label": {
        "pt": "gravidade",
        "en": "gravity"
      },
      "spoken": {
        "pt": "a gravidade",
        "en": "the gravity"
      }
    },
    "base": {
      "pt": "O peso é a força da gravidade sobre a massa: massa vezes gravidade. Nas contas do exame, usa g = 10 m/s².",
      "en": "Weight is the force of gravity acting on a mass: mass times gravity. In exam calculations, use g = 10 m/s²."
    },
    "details": [
      {
        "title": {
          "pt": "Como usar",
          "en": "How to use it"
        },
        "text": {
          "pt": "Tapa P e multiplicas m por g. Tapa m e divides P por g. Tapa g e divides P por m — assim descobres a gravidade de outro planeta.",
          "en": "Cover P and multiply m by g. Cover m and divide P by g. Cover g and divide P by m — this is how you find the gravity of another planet."
        }
      },
      {
        "title": {
          "pt": "No exame",
          "en": "On the exam"
        },
        "text": {
          "pt": "6 kg × 10 = 60 N. Peso é em newtons (N) e massa é em quilogramas (kg): são grandezas diferentes, e o enunciado paga por essa distinção.",
          "en": "6 kg × 10 = 60 N. Weight is in newtons (N) and mass is in kilograms (kg): they are different quantities, and the question pays for that distinction."
        }
      }
    ]
  },
  {
    "id": "p-energy",
    "subject": "physics",
    "title": {
      "pt": "Trabalho, energia e potência",
      "en": "Work, energy and power"
    },
    "top": {
      "symbol": "W",
      "label": {
        "pt": "trabalho",
        "en": "work"
      },
      "spoken": {
        "pt": "o trabalho",
        "en": "the work"
      }
    },
    "left": {
      "symbol": "P",
      "label": {
        "pt": "potência",
        "en": "power"
      },
      "spoken": {
        "pt": "a potência",
        "en": "the power"
      }
    },
    "right": {
      "symbol": "t",
      "label": {
        "pt": "tempo",
        "en": "time"
      },
      "spoken": {
        "pt": "o tempo",
        "en": "the time"
      }
    },
    "base": {
      "pt": "O trabalho mede a energia gasta: potência vezes tempo. Mais potência ou mais tempo, mais energia.",
      "en": "Work measures the energy used: power times time. More power or more time means more energy."
    },
    "details": [
      {
        "title": {
          "pt": "Como usar",
          "en": "How to use it"
        },
        "text": {
          "pt": "Tapa W e multiplicas P por t. Tapa P e divides W por t — descobres a potência a partir da energia gasta. Tapa t e divides W por P.",
          "en": "Cover W and multiply P by t. Cover P and divide W by t — that gives you the power from the energy used. Cover t and divide W by P."
        }
      },
      {
        "title": {
          "pt": "No exame",
          "en": "On the exam"
        },
        "text": {
          "pt": "50 W durante 4 s → W = 50 × 4 = 200 J. Atenção às letras: J (joule) para energia e W (watt) para potência — não troques.",
          "en": "50 W for 4 s → W = 50 × 4 = 200 J. Watch the letters: J (joule) for energy and W (watt) for power — don't swap them."
        }
      }
    ]
  },
  {
    "id": "p-momentum",
    "subject": "physics",
    "title": {
      "pt": "Quantidade de movimento",
      "en": "Momentum"
    },
    "top": {
      "symbol": "p",
      "label": {
        "pt": "movimento",
        "en": "momentum"
      },
      "spoken": {
        "pt": "a quantidade de movimento",
        "en": "the momentum"
      }
    },
    "left": {
      "symbol": "m",
      "label": {
        "pt": "massa",
        "en": "mass"
      },
      "spoken": {
        "pt": "a massa",
        "en": "the mass"
      }
    },
    "right": {
      "symbol": "v",
      "label": {
        "pt": "velocidade",
        "en": "velocity"
      },
      "spoken": {
        "pt": "a velocidade",
        "en": "the velocity"
      }
    },
    "base": {
      "pt": "A quantidade de movimento é a massa vezes a velocidade. Uma carrinha lenta pode ter mais embalo do que uma bola muito rápida.",
      "en": "Momentum is mass times velocity. A slow van can have more momentum than a very fast ball."
    },
    "details": [
      {
        "title": {
          "pt": "Como usar",
          "en": "How to use it"
        },
        "text": {
          "pt": "Tapa p e multiplicas m por v. Tapa m e divides p por v. Tapa v e divides p por m. O gesto é o mesmo de sempre: multiplicar por baixo, dividir para isolar.",
          "en": "Cover p and multiply m by v. Cover m and divide p by v. Cover v and divide p by m. The move is the same as always: multiply the bottom pair, divide to isolate."
        }
      },
      {
        "title": {
          "pt": "No exame",
          "en": "On the exam"
        },
        "text": {
          "pt": "2 kg a 6 m/s → p = 2 × 6 = 12 kg·m/s. A unidade junta as duas grandezas: quilograma metro por segundo.",
          "en": "2 kg at 6 m/s → p = 2 × 6 = 12 kg·m/s. The unit joins the two quantities: kilogram meter per second."
        }
      }
    ]
  },
  {
    "id": "p-fluids",
    "subject": "physics",
    "title": {
      "pt": "Pressão e fluidos",
      "en": "Pressure and fluids"
    },
    "top": {
      "symbol": "F",
      "label": {
        "pt": "força",
        "en": "force"
      },
      "spoken": {
        "pt": "a força",
        "en": "the force"
      }
    },
    "left": {
      "symbol": "p",
      "label": {
        "pt": "pressão",
        "en": "pressure"
      },
      "spoken": {
        "pt": "a pressão",
        "en": "the pressure"
      }
    },
    "right": {
      "symbol": "A",
      "label": {
        "pt": "área",
        "en": "area"
      },
      "spoken": {
        "pt": "a área",
        "en": "the area"
      }
    },
    "base": {
      "pt": "A pressão é a força espalhada por uma área. A mesma força numa área pequena faz muito mais pressão.",
      "en": "Pressure is a force spread over an area. The same force on a small area makes much more pressure."
    },
    "details": [
      {
        "title": {
          "pt": "Como usar",
          "en": "How to use it"
        },
        "text": {
          "pt": "Tapa p e divides F por A. Tapa F e multiplicas p por A. Tapa A e divides F por p. Repara: área pequena aumenta o resultado — é por isso que o prego fino entra na madeira.",
          "en": "Cover p and divide F by A. Cover F and multiply p by A. Cover A and divide F by p. Notice: a small area makes the result bigger — that's why a thin nail goes into wood."
        }
      },
      {
        "title": {
          "pt": "No exame",
          "en": "On the exam"
        },
        "text": {
          "pt": "200 N numa área de 4 m² → p = 200 ÷ 4 = 50 Pa. A unidade é o pascal (Pa), que é o mesmo que newton por metro quadrado.",
          "en": "200 N on an area of 4 m² → p = 200 ÷ 4 = 50 Pa. The unit is the pascal (Pa), which is the same as a newton per square meter."
        }
      }
    ]
  },
  {
    "id": "p-electricity",
    "subject": "physics",
    "title": {
      "pt": "Electricidade e circuitos",
      "en": "Electricity and circuits"
    },
    "top": {
      "symbol": "V",
      "label": {
        "pt": "tensão",
        "en": "voltage"
      },
      "spoken": {
        "pt": "a tensão",
        "en": "the voltage"
      }
    },
    "left": {
      "symbol": "I",
      "label": {
        "pt": "corrente",
        "en": "current"
      },
      "spoken": {
        "pt": "a corrente",
        "en": "the current"
      }
    },
    "right": {
      "symbol": "R",
      "label": {
        "pt": "resistência",
        "en": "resistance"
      },
      "spoken": {
        "pt": "a resistência",
        "en": "the resistance"
      }
    },
    "base": {
      "pt": "A tensão é a corrente vezes a resistência: a lei de Ohm. Se souberes dois dos três valores, o terceiro sai daqui.",
      "en": "Voltage is current times resistance: Ohm's law. If you know two of the three values, the third one comes from here."
    },
    "details": [
      {
        "title": {
          "pt": "Como usar",
          "en": "How to use it"
        },
        "text": {
          "pt": "Tapa V e multiplicas I por R. Tapa I e divides V por R. Tapa R e divides V por I. Confirma as unidades: volt (V), ampere (A) e ohm (Ω).",
          "en": "Cover V and multiply I by R. Cover I and divide V by R. Cover R and divide V by I. Check the units: volt (V), ampere (A) and ohm (Ω)."
        }
      },
      {
        "title": {
          "pt": "No exame",
          "en": "On the exam"
        },
        "text": {
          "pt": "12 V num resistor de 6 Ω → I = 12 ÷ 6 = 2 A. Depois podes puxar a potência com P = V × I: 12 × 2 = 24 W.",
          "en": "12 V across a 6 Ω resistor → I = 12 ÷ 6 = 2 A. Then you can take the power with P = V × I: 12 × 2 = 24 W."
        }
      }
    ]
  },
  {
    "id": "p-waves",
    "subject": "physics",
    "title": {
      "pt": "Ondas e óptica",
      "en": "Waves and optics"
    },
    "top": {
      "symbol": "v",
      "label": {
        "pt": "velocidade",
        "en": "speed"
      },
      "spoken": {
        "pt": "a velocidade",
        "en": "the speed"
      }
    },
    "left": {
      "symbol": "f",
      "label": {
        "pt": "frequência",
        "en": "frequency"
      },
      "spoken": {
        "pt": "a frequência",
        "en": "the frequency"
      }
    },
    "right": {
      "symbol": "λ",
      "label": {
        "pt": "comprimento",
        "en": "wavelength"
      },
      "spoken": {
        "pt": "o comprimento de onda",
        "en": "the wavelength"
      }
    },
    "base": {
      "pt": "A velocidade de uma onda é a frequência vezes o comprimento de onda. Passos mais longos ou mais frequentes andam mais depressa.",
      "en": "The speed of a wave is the frequency times the wavelength. Longer steps, or more steps per second, mean more speed."
    },
    "details": [
      {
        "title": {
          "pt": "Como usar",
          "en": "How to use it"
        },
        "text": {
          "pt": "Tapa v e multiplicas f por λ. Tapa f e divides v por λ. Tapa λ e divides v por f. O λ é o comprimento de onda — a distância entre duas cristas.",
          "en": "Cover v and multiply f by λ. Cover f and divide v by λ. Cover λ and divide v by f. The λ is the wavelength — the distance between two crests."
        }
      },
      {
        "title": {
          "pt": "No exame",
          "en": "On the exam"
        },
        "text": {
          "pt": "5 Hz × 2 m → v = 10 m/s. Frequência é em hertz (Hz), que é uma onda por segundo; comprimento de onda é em metros.",
          "en": "5 Hz × 2 m → v = 10 m/s. Frequency is in hertz (Hz), which is one wave per second; wavelength is in meters."
        }
      }
    ]
  }
];

export const shortcutIntro = {
  "pt": "Fórmulas, mnemónicas e truques de uma linha. O que abre a cabeça antes de abrir o caderno.",
  "en": "Formulas, mnemonics and one-line shortcuts. What opens your head before you open the notebook."
};

export const shortcutKindNames = {
  mnemonic: bi('Mnemónica', 'Mnemonic'),
  shortcut: bi('Truque', 'Shortcut'),
  formula: bi('Fórmula', 'Formula')
};

export const studyShortcuts = [
  {
    "id": "shortcut-01",
    "subject": "math",
    "kind": "mnemonic",
    "title": {
      "pt": "SOH CAH TOA",
      "en": "SOH CAH TOA"
    },
    "formula": {
      "pt": "sen = O/H · cos = A/H · tg = O/A",
      "en": "sin = O/H · cos = A/H · tan = O/A"
    },
    "note": {
      "pt": "Seno: Oposto a Hipotenusa. Cosseno: Adjacente a Hipotenusa. Tangente: Oposto a Adjacente.",
      "en": "Sine: Opposite over Hypotenuse. Cosine: Adjacent over Hypotenuse. Tangent: Opposite over Adjacent."
    }
  },
  {
    "id": "shortcut-02",
    "subject": "math",
    "kind": "shortcut",
    "title": {
      "pt": "Tangente por dentro",
      "en": "Tangent from inside"
    },
    "formula": {
      "pt": "tg θ = sen θ / cos θ",
      "en": "tan θ = sin θ / cos θ"
    },
    "note": {
      "pt": "Se tens sen e cos, nunca precisas de mais nada.",
      "en": "If you have sine and cosine, you never need anything else."
    }
  },
  {
    "id": "shortcut-03",
    "subject": "math",
    "kind": "formula",
    "title": {
      "pt": "Identidade pitagórica",
      "en": "Pythagorean identity"
    },
    "formula": {
      "pt": "sen²θ + cos²θ = 1",
      "en": "sin²θ + cos²θ = 1"
    },
    "note": {
      "pt": "Serve para passar de uma razão para a outra. Raiz e um menos.",
      "en": "Moves you from one ratio to the other. Square root of one minus."
    }
  },
  {
    "id": "shortcut-04",
    "subject": "math",
    "kind": "mnemonic",
    "title": {
      "pt": "Sinais por quadrante",
      "en": "Signs by quadrant"
    },
    "formula": {
      "pt": "1.º T · 2.º S · 3.º T · 4.º C",
      "en": "1st A · 2nd S · 3rd T · 4th C"
    },
    "note": {
      "pt": "Todos, Senos, Tangentes, Cossenos — só o que nomeia é positivo.",
      "en": "All, Sine, Tangent, Cosine — only the named one is positive."
    }
  },
  {
    "id": "shortcut-05",
    "subject": "math",
    "kind": "formula",
    "title": {
      "pt": "Fórmula resolvente",
      "en": "Quadratic formula"
    },
    "formula": {
      "pt": "x = (−b ± √Δ) / 2a,  Δ = b² − 4ac",
      "en": "x = (−b ± √Δ) / 2a,  Δ = b² − 4ac"
    },
    "note": {
      "pt": "Delta primeiro, depois a resolvente. Nunca ao contrário.",
      "en": "Delta first, then the formula. Never the other way round."
    }
  },
  {
    "id": "shortcut-06",
    "subject": "math",
    "kind": "shortcut",
    "title": {
      "pt": "Ler o delta",
      "en": "Read the delta"
    },
    "formula": {
      "pt": "Δ > 0 · Δ = 0 · Δ < 0",
      "en": "Δ > 0 · Δ = 0 · Δ < 0"
    },
    "note": {
      "pt": "Duas raízes, uma raiz, nenhuma nos reais. Decide antes de calcular.",
      "en": "Two roots, one root, none in the reals. Decide before you calculate."
    }
  },
  {
    "id": "shortcut-07",
    "subject": "math",
    "kind": "shortcut",
    "title": {
      "pt": "Soma e produto",
      "en": "Sum and product"
    },
    "formula": {
      "pt": "x₁ + x₂ = −b/a · x₁ · x₂ = c/a",
      "en": "x₁ + x₂ = −b/a · x₁ · x₂ = c/a"
    },
    "note": {
      "pt": "De cabeça: duas raízes que somam e multiplicam certo. Funciona com números pequenos.",
      "en": "Mental maths: two roots that sum and multiply right. Works with small numbers."
    }
  },
  {
    "id": "shortcut-08",
    "subject": "math",
    "kind": "shortcut",
    "title": {
      "pt": "Vértice da parábola",
      "en": "Vertex of the parabola"
    },
    "formula": {
      "pt": "x_v = −b / 2a",
      "en": "x_v = −b / 2a"
    },
    "note": {
      "pt": "O meio das duas raízes. Dá o máximo ou o mínimo sem derivar.",
      "en": "The midpoint of the two roots. Gives the max or min without differentiating."
    }
  },
  {
    "id": "shortcut-09",
    "subject": "math",
    "kind": "formula",
    "title": {
      "pt": "Recta e declive",
      "en": "Line and slope"
    },
    "formula": {
      "pt": "m = (y₂ − y₁) / (x₂ − x₁) · y = mx + b",
      "en": "m = (y₂ − y₁) / (x₂ − x₁) · y = mx + b"
    },
    "note": {
      "pt": "b é onde corta o eixo vertical. Perpendiculares: m₁ · m₂ = −1.",
      "en": "b is where it crosses the vertical axis. Perpendiculars: m₁ · m₂ = −1."
    }
  },
  {
    "id": "shortcut-10",
    "subject": "math",
    "kind": "mnemonic",
    "title": {
      "pt": "E multiplica, OU soma",
      "en": "AND multiplies, OR adds"
    },
    "formula": {
      "pt": "P(A e B) = P(A)·P(B) · P(A ou B) = P(A)+P(B)",
      "en": "P(A and B) = P(A)·P(B) · P(A or B) = P(A)+P(B)"
    },
    "note": {
      "pt": "A palavra no enunciado diz a operação. Tira o «e» e o «ou» do texto.",
      "en": "The word in the question names the operation. Circle the and and the or."
    }
  },
  {
    "id": "shortcut-11",
    "subject": "math",
    "kind": "shortcut",
    "title": {
      "pt": "Probabilidade pelo contrário",
      "en": "Probability by the complement"
    },
    "formula": {
      "pt": "P = 1 − P(não acontece)",
      "en": "P = 1 − P(it never happens)"
    },
    "note": {
      "pt": "Quando o enunciado diz «pelo menos um», conta o nenhum e tira a 1.",
      "en": "When it says at least one, count the none and subtract from 1."
    }
  },
  {
    "id": "shortcut-12",
    "subject": "math",
    "kind": "mnemonic",
    "title": {
      "pt": "Moda, mediana, média",
      "en": "Mode, median, mean"
    },
    "formula": {
      "pt": "Mo = mais repetida · Me = do meio · μ = soma/n",
      "en": "mode = most often · median = middle · mean = sum/n"
    },
    "note": {
      "pt": "RAE ao contrário: Repetida, Ao meio, Em média. Ordena sempre antes de tirar a mediana.",
      "en": "Sort first, always. The median is worthless in an unordered list."
    }
  },
  {
    "id": "shortcut-13",
    "subject": "math",
    "kind": "shortcut",
    "title": {
      "pt": "Regra de três em cruz",
      "en": "Cross multiplication"
    },
    "formula": {
      "pt": "a/b = c/x → x = b·c / a",
      "en": "a/b = c/x → x = b·c / a"
    },
    "note": {
      "pt": "Multiplica em cruz, divide pelo de cima do lado que falta.",
      "en": "Multiply across, divide by the one on top of the side that is missing."
    }
  },
  {
    "id": "shortcut-14",
    "subject": "math",
    "kind": "formula",
    "title": {
      "pt": "Potências",
      "en": "Exponents"
    },
    "formula": {
      "pt": "a^m · a^n = a^(m+n)   (a^m)^n = a^(mn)   a^m / a^n = a^(m-n)",
      "en": "a^m · a^n = a^(m+n)   (a^m)^n = a^(mn)   a^m / a^n = a^(m-n)"
    },
    "note": {
      "pt": "Mesma base: multiplicar soma, potência de potência multiplica, dividir subtrai.",
      "en": "Same base: multiplying adds, a power of a power multiplies, dividing subtracts."
    }
  },
  {
    "id": "shortcut-15",
    "subject": "math",
    "kind": "shortcut",
    "title": {
      "pt": "Simplificar raízes",
      "en": "Simplifying radicals"
    },
    "formula": {
      "pt": "√72 = √(36·2) = 6√2",
      "en": "√72 = √(36·2) = 6√2"
    },
    "note": {
      "pt": "Procura o maior quadrado perfeito escondido dentro do número.",
      "en": "Look for the largest perfect square hiding inside the number."
    }
  },
  {
    "id": "shortcut-16",
    "subject": "math",
    "kind": "formula",
    "title": {
      "pt": "Logaritmos",
      "en": "Logarithms"
    },
    "formula": {
      "pt": "log_a b = x ⇔ aˣ = b",
      "en": "log_a b = x ⇔ aˣ = b"
    },
    "note": {
      "pt": "O log é só o expoente que procuras. log(ab) = log a + log b.",
      "en": "A log is just the exponent you are hunting for. log(ab) = log a + log b."
    }
  },
  {
    "id": "shortcut-17",
    "subject": "math",
    "kind": "mnemonic",
    "title": {
      "pt": "Soma de uma P.A.",
      "en": "Sum of an arithmetic sequence"
    },
    "formula": {
      "pt": "S = (a₁ + aₙ) · n / 2",
      "en": "S = (a₁ + aₙ) · n / 2"
    },
    "note": {
      "pt": "Gauss: junta o primeiro ao último, multiplica por metade dos termos.",
      "en": "Gauss: add the first to the last, multiply by half the terms."
    }
  },
  {
    "id": "shortcut-18",
    "subject": "math",
    "kind": "formula",
    "title": {
      "pt": "Termo geral",
      "en": "General term"
    },
    "formula": {
      "pt": "P.A.: aₙ = a₁ + (n−1)r · P.G.: aₙ = a₁·qⁿ⁻¹",
      "en": "A.P.: aₙ = a₁ + (n−1)r · G.P.: aₙ = a₁·qⁿ⁻¹"
    },
    "note": {
      "pt": "Na P.A. somas passos, na P.G. multiplicas passos. Um a menos que n.",
      "en": "Arithmetic adds steps, geometric multiplies them. One less than n."
    }
  },
  {
    "id": "shortcut-19",
    "subject": "math",
    "kind": "formula",
    "title": {
      "pt": "Pitágoras e ternos",
      "en": "Pythagoras and triples"
    },
    "formula": {
      "pt": "a² = b² + c²",
      "en": "a² = b² + c²"
    },
    "note": {
      "pt": "Só em triângulo rectângulo. Decora 3-4-5 e 5-12-13: aparecem quase sempre.",
      "en": "Right-angled triangles only. Memorise 3-4-5 and 5-12-13: they keep showing up."
    }
  },
  {
    "id": "shortcut-20",
    "subject": "math",
    "kind": "shortcut",
    "title": {
      "pt": "Áreas por comparação",
      "en": "Areas by comparison"
    },
    "formula": {
      "pt": "triângulo = b·h/2 · paralelogramo = b·h",
      "en": "triangle = b·h/2 · parallelogram = b·h"
    },
    "note": {
      "pt": "Todo o triângulo é metade do rectângulo à volta. Memória só para um.",
      "en": "Every triangle is half the rectangle around it. Memorise only one."
    }
  },
  {
    "id": "shortcut-21",
    "subject": "math",
    "kind": "formula",
    "title": {
      "pt": "Círculo",
      "en": "Circle"
    },
    "formula": {
      "pt": "A = πr² · perímetro = 2πr",
      "en": "A = πr² · circumference = 2πr"
    },
    "note": {
      "pt": "Área com quadrado, comprimento sem quadrado. O π só multiplica.",
      "en": "Area is squared, length is not. Pi only multiplies."
    }
  },
  {
    "id": "shortcut-22",
    "subject": "physics",
    "kind": "shortcut",
    "title": {
      "pt": "m/s para km/h",
      "en": "m/s to km/h"
    },
    "formula": {
      "pt": "× 3,6 (e ÷ 3,6 para voltar)",
      "en": "× 3.6 (and ÷ 3.6 to go back)"
    },
    "note": {
      "pt": "3,6 vem de 3600 s / 1000 m. Decora o número, não a origem.",
      "en": "3.6 comes from 3600 s / 1000 m. Memorise the number, not the derivation."
    }
  },
  {
    "id": "shortcut-23",
    "subject": "physics",
    "kind": "formula",
    "title": {
      "pt": "Cinemática",
      "en": "Kinematics"
    },
    "formula": {
      "pt": "v = Δs/Δt · v = v₀ + a·t · Δs = v₀t + a·t²/2",
      "en": "v = Δs/Δt · v = v₀ + a·t · Δs = v₀t + a·t²/2"
    },
    "note": {
      "pt": "Três equações, cinco grandezas: falta sempre uma, é essa que procuras.",
      "en": "Three equations, five quantities: one is always missing, and that is the one you want."
    }
  },
  {
    "id": "shortcut-24",
    "subject": "physics",
    "kind": "mnemonic",
    "title": {
      "pt": "Equação de Torricelli",
      "en": "Torricelli's equation"
    },
    "formula": {
      "pt": "v² = v₀² + 2a·Δs",
      "en": "v² = v₀² + 2a·Δs"
    },
    "note": {
      "pt": "Sem tempo no enunciado? Vai directo a esta. «v ao quadrado menos v zero ao quadrado».",
      "en": "No time in the question? Go straight here. v squared minus v-naught squared."
    }
  },
  {
    "id": "shortcut-25",
    "subject": "physics",
    "kind": "shortcut",
    "title": {
      "pt": "Travagem é aceleração negativa",
      "en": "Braking is negative acceleration"
    },
    "formula": {
      "pt": "v = 0 no fim",
      "en": "v = 0 at the end"
    },
    "note": {
      "pt": "Parar significa v final zero. O sinal de a faz-se sozinho se escolheres o sentido.",
      "en": "Stopping means final velocity zero. The sign of a sorts itself out if you pick an axis."
    }
  },
  {
    "id": "shortcut-26",
    "subject": "physics",
    "kind": "formula",
    "title": {
      "pt": "Leis de Newton",
      "en": "Newton's laws"
    },
    "formula": {
      "pt": "F = m·a · P = m·g · Fₐ = μ·N",
      "en": "F = m·a · W = m·g · F_f = μ·N"
    },
    "note": {
      "pt": "Força resultante, não força aplicada. Desenha sempre o diagrama primeiro.",
      "en": "Resultant force, not applied force. Draw the free-body diagram first, always."
    }
  },
  {
    "id": "shortcut-27",
    "subject": "physics",
    "kind": "shortcut",
    "title": {
      "pt": "Plano inclinado",
      "en": "Inclined plane"
    },
    "formula": {
      "pt": "Pₓ = P·sen θ · P_y = P·cos θ",
      "en": "Wₓ = W·sin θ · W_y = W·cos θ"
    },
    "note": {
      "pt": "O componente que desce é o do seno. Inclinação maior, seno maior, desliza mais.",
      "en": "The component that slides down is the sine one. Steeper slope, bigger sine, faster slide."
    }
  },
  {
    "id": "shortcut-28",
    "subject": "physics",
    "kind": "formula",
    "title": {
      "pt": "Trabalho e energia",
      "en": "Work and energy"
    },
    "formula": {
      "pt": "W = F·d·cos θ · Ec = m·v²/2 · Ep = m·g·h",
      "en": "W = F·d·cos θ · KE = m·v²/2 · PE = m·g·h"
    },
    "note": {
      "pt": "Trabalho precisa de deslocamento. Segurar uma mala não é trabalho.",
      "en": "Work needs displacement. Holding a suitcase is not work."
    }
  },
  {
    "id": "shortcut-29",
    "subject": "physics",
    "kind": "mnemonic",
    "title": {
      "pt": "Conservação de energia",
      "en": "Conservation of energy"
    },
    "formula": {
      "pt": "Ec + Ep = constante",
      "en": "KE + PE = constant"
    },
    "note": {
      "pt": "O que perdes em altura ganhas em velocidade. Sem atrito, a soma não muda.",
      "en": "What you lose in height you gain in speed. Without friction the sum never changes."
    }
  },
  {
    "id": "shortcut-30",
    "subject": "physics",
    "kind": "formula",
    "title": {
      "pt": "Potência",
      "en": "Power"
    },
    "formula": {
      "pt": "P = W/t = F·v",
      "en": "P = W/t = F·v"
    },
    "note": {
      "pt": "Potência é trabalho com pressa. Mesma força, mais velocidade, mais potência.",
      "en": "Power is work in a hurry. Same force, more speed, more power."
    }
  },
  {
    "id": "shortcut-31",
    "subject": "physics",
    "kind": "shortcut",
    "title": {
      "pt": "Quantidade de movimento",
      "en": "Momentum"
    },
    "formula": {
      "pt": "p = m·v · antes = depois",
      "en": "p = m·v · before = after"
    },
    "note": {
      "pt": "Em colisões e explosões, soma os p antes e iguala aos p depois. O mais pesado ganha.",
      "en": "In collisions and explosions, add the p before, set it equal to the p after. Heavier wins."
    }
  },
  {
    "id": "shortcut-32",
    "subject": "physics",
    "kind": "formula",
    "title": {
      "pt": "Pressão",
      "en": "Pressure"
    },
    "formula": {
      "pt": "p = F/A · p = ρ·g·h",
      "en": "p = F/A · p = ρ·g·h"
    },
    "note": {
      "pt": "Força mal distribuída faz muita pressão. Nos fluidos só interessa a profundidade.",
      "en": "Force spread thin makes big pressure. In fluids only depth matters."
    }
  },
  {
    "id": "shortcut-33",
    "subject": "physics",
    "kind": "mnemonic",
    "title": {
      "pt": "Empuxo de Arquimedes",
      "en": "Archimedes' buoyancy"
    },
    "formula": {
      "pt": "E = ρ_liquido · V_imerso · g",
      "en": "E = ρ_fluid · V_submerged · g"
    },
    "note": {
      "pt": "Empurra para cima o peso do líquido que deslocas. Flutua quem desloca mais.",
      "en": "It pushes up by the weight of the fluid you displace. Whoever displaces more, floats."
    }
  },
  {
    "id": "shortcut-34",
    "subject": "physics",
    "kind": "formula",
    "title": {
      "pt": "Lei de Ohm e potência",
      "en": "Ohm's law and power"
    },
    "formula": {
      "pt": "V = I·R · P = V·I",
      "en": "V = I·R · P = V·I"
    },
    "note": {
      "pt": "Triângulo V-I-R tapa o que falta. Potência é sempre o produto dos outros dois.",
      "en": "Cover what you want in the V-I-R triangle. Power is always the product of the other two."
    }
  },
  {
    "id": "shortcut-35",
    "subject": "physics",
    "kind": "shortcut",
    "title": {
      "pt": "Série e paralelo",
      "en": "Series and parallel"
    },
    "formula": {
      "pt": "série: R = R₁+R₂ · paralelo: 1/R = 1/R₁+1/R₂",
      "en": "series: R = R₁+R₂ · parallel: 1/R = 1/R₁+1/R₂"
    },
    "note": {
      "pt": "Série soma e aumenta. Paralelo reparte e diminui — o total é sempre menor que o menor.",
      "en": "Series adds and grows. Parallel splits and shrinks — the total is smaller than the smallest."
    }
  },
  {
    "id": "shortcut-36",
    "subject": "physics",
    "kind": "mnemonic",
    "title": {
      "pt": "Série ou paralelo?",
      "en": "Series or parallel?"
    },
    "formula": {
      "pt": "série: mesma corrente · paralelo: mesma tensão",
      "en": "series: same current · parallel: same voltage"
    },
    "note": {
      "pt": "Corrente não se divide em série; tensão não se divide em paralelo.",
      "en": "Current does not split in series; voltage does not split in parallel."
    }
  },
  {
    "id": "shortcut-37",
    "subject": "physics",
    "kind": "formula",
    "title": {
      "pt": "Ondas",
      "en": "Waves"
    },
    "formula": {
      "pt": "v = λ·f · T = 1/f",
      "en": "v = λ·f · T = 1/f"
    },
    "note": {
      "pt": "Período e frequência são invertidos um do outro. Sempre.",
      "en": "Period and frequency are each other's reciprocal. Always."
    }
  },
  {
    "id": "shortcut-38",
    "subject": "physics",
    "kind": "formula",
    "title": {
      "pt": "Calor sensível",
      "en": "Sensible heat"
    },
    "formula": {
      "pt": "Q = m·c·ΔT",
      "en": "Q = m·c·ΔT"
    },
    "note": {
      "pt": "ΔT é variação, não temperatura. Água exige muito c, metal exige pouco.",
      "en": "ΔT is a change, not a temperature. Water needs a lot of c, metal needs little."
    }
  },
  {
    "id": "shortcut-39",
    "subject": "physics",
    "kind": "shortcut",
    "title": {
      "pt": "Mão direita",
      "en": "Right-hand rule"
    },
    "formula": {
      "pt": "polegar = corrente · dedos = campo",
      "en": "thumb = current · fingers = field"
    },
    "note": {
      "pt": "Para força magnética e solenóides. Decide o sentido sem decorar regras de sinal.",
      "en": "For magnetic force and solenoids. Settles the direction without memorising sign rules."
    }
  },
  {
    "id": "shortcut-40",
    "subject": "physics",
    "kind": "shortcut",
    "title": {
      "pt": "Unidades primeiro",
      "en": "Units first"
    },
    "formula": {
      "pt": "kg, m, s, A, K",
      "en": "kg, m, s, A, K"
    },
    "note": {
      "pt": "Converte tudo para SI antes de calcular. A unidade do resultado diz se está certo.",
      "en": "Convert everything to SI before calculating. The unit of the answer tells you if it is right."
    }
  }
];
