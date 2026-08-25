export type CourseArea =
  | "fundamentos"
  | "solidos"
  | "projeto"
  | "manufatura"
  | "termofluidos"
  | "formacao"
  | "conclusao";

export type CourseKind = "disciplina" | "bloco-optativo" | "estagio";

export type Course = {
  id: string;
  code: string;
  name: string;
  semester: number;
  area: CourseArea;
  hours: number;
  weeklyClasses: number;
  kind?: CourseKind;
  equivalents?: string[];
  prerequisitePaths?: string[][];
  prerequisiteText?: string;
  requiredHours?: number;
  requiredFrom?: number;
  syllabus: string;
  sourceNote?: string;
};

export type ElectiveArea = {
  id: string;
  label: string;
  description: string;
  examples: string[];
};

export const curriculumRules = {
  curriculumCode: "20061",
  sourceDate: "22/08/2026",
  totalHours: 4374,
  cneHours: 3600,
  electiveHours: 576,
  specialBlockLimit: 162,
  extraCourseLimit: 108,
  minimumSemesters: 8,
  maximumSemesters: 18,
  minimumWeeklyClasses: 13,
  maximumWeeklyClasses: 29,
};

export const areaLabels: Record<CourseArea, string> = {
  fundamentos: "Fundamentos",
  solidos: "Sólidos & dinâmica",
  projeto: "Projeto",
  manufatura: "Materiais & manufatura",
  termofluidos: "Termofluidos",
  formacao: "Formação profissional",
  conclusao: "Conclusão do curso",
};

export const courses: Course[] = [
  {
    id: "EGR5213",
    code: "EGR5213",
    name: "Representação Gráfica Espacial",
    semester: 1,
    area: "fundamentos",
    hours: 54,
    weeklyClasses: 3,
    syllabus:
      "Sistema visual humano, projeção ortogonal, geometria descritiva, verdadeira grandeza, interseção, seção, planificação e modelagem.",
  },
  {
    id: "EMC5004",
    code: "EMC5004",
    name: "Introdução à Engenharia Mecânica",
    semester: 1,
    area: "formacao",
    hours: 72,
    weeklyClasses: 4,
    syllabus:
      "Atuação do engenheiro mecânico, estrutura do curso, normas, laboratórios, equipamentos, processos e ferramentas da Engenharia.",
  },
  {
    id: "EQA5119",
    code: "EQA5119",
    name: "Química Tecnológica",
    semester: 1,
    area: "fundamentos",
    hours: 72,
    weeklyClasses: 4,
    equivalents: ["EQA5116"],
    syllabus:
      "Combustão, combustíveis, água potável e industrial, metais e ligas, cerâmicas, polímeros e corrosão.",
  },
  {
    id: "FSC5101",
    code: "FSC5101",
    name: "Física I",
    semester: 1,
    area: "fundamentos",
    hours: 72,
    weeklyClasses: 4,
    equivalents: ["FSC5102"],
    syllabus:
      "Cinemática, dinâmica, estática e leis de conservação da energia e do momento linear.",
  },
  {
    id: "INE5201",
    code: "INE5201",
    name: "Introdução à Ciência da Computação",
    semester: 1,
    area: "fundamentos",
    hours: 54,
    weeklyClasses: 3,
    equivalents: ["INE5231"],
    syllabus:
      "Sistemas de computação, algoritmos, representação, programação e aplicações científicas e tecnológicas.",
  },
  {
    id: "MTM3110",
    code: "MTM3110",
    name: "Cálculo 1",
    semester: 1,
    area: "fundamentos",
    hours: 72,
    weeklyClasses: 4,
    equivalents: ["MTM3101", "MTM5161", "MTM5801"],
    syllabus:
      "Limites, continuidade, derivadas, aplicações, otimização e integrais definidas e indefinidas.",
  },
  {
    id: "EGR5214",
    code: "EGR5214",
    name: "Desenho e Modelagem Geométrica",
    semester: 2,
    area: "fundamentos",
    hours: 108,
    weeklyClasses: 6,
    equivalents: ["EGR5604 + EGR5623"],
    prerequisitePaths: [["EGR5213"]],
    syllabus:
      "Desenho técnico, vistas, cotagem, tolerâncias, ajustes, CAD, modelagem e representação de elementos e conjuntos mecânicos.",
  },
  {
    id: "EMC5132",
    code: "EMC5132",
    name: "Estática",
    semester: 2,
    area: "solidos",
    hours: 72,
    weeklyClasses: 4,
    equivalents: ["FSC5050", "FSC5103"],
    prerequisitePaths: [["FSC5101", "MTM3110"]],
    prerequisiteText:
      "Física I (ou equivalente) e Cálculo 1 (ou equivalente).",
    syllabus:
      "Equilíbrio de partículas e corpos rígidos, estruturas, vigas, treliças, reações, esforços internos, centroides, inércia e cabos.",
  },
  {
    id: "FSC5002",
    code: "FSC5002",
    name: "Física II",
    semester: 2,
    area: "fundamentos",
    hours: 72,
    weeklyClasses: 4,
    equivalents: ["FSC5112", "FSC5132", "FSC5137"],
    prerequisitePaths: [["FSC5101", "MTM3110"]],
    prerequisiteText:
      "Física I (ou equivalente) e Cálculo 1 (ou equivalente).",
    syllabus:
      "Rotação de corpos rígidos, oscilações, ondas, fluidos, temperatura, calor, termodinâmica e teoria cinética dos gases.",
  },
  {
    id: "FSC5122",
    code: "FSC5122",
    name: "Física Experimental I",
    semester: 2,
    area: "fundamentos",
    hours: 54,
    weeklyClasses: 3,
    equivalents: ["FSC5124"],
    syllabus:
      "Experimentos de mecânica, acústica e termologia, com montagem, medição e análise dos resultados.",
  },
  {
    id: "MTM3120",
    code: "MTM3120",
    name: "Cálculo 2",
    semester: 2,
    area: "fundamentos",
    hours: 72,
    weeklyClasses: 4,
    equivalents: ["MTM3102", "MTM5162", "MTM5803"],
    prerequisitePaths: [["MTM3110"]],
    syllabus:
      "Técnicas de integração, integrais impróprias, álgebra vetorial, retas, planos, superfícies e funções de várias variáveis.",
  },
  {
    id: "MTM3121",
    code: "MTM3121",
    name: "Álgebra Linear",
    semester: 2,
    area: "fundamentos",
    hours: 72,
    weeklyClasses: 4,
    equivalents: ["MTM3112", "MTM5245", "MTM5812"],
    syllabus:
      "Matrizes, determinantes, sistemas lineares, espaços vetoriais, transformações lineares, autovalores e diagonalização.",
  },
  {
    id: "EMC5128",
    code: "EMC5128",
    name: "Mecânica dos Sólidos A",
    semester: 3,
    area: "solidos",
    hours: 72,
    weeklyClasses: 4,
    prerequisitePaths: [["EMC5132", "MTM3121"]],
    syllabus:
      "Modelos estruturais, esforços internos, tensão e deformação, lei de Hooke, flexão, cisalhamento, torção e solicitações compostas.",
  },
  {
    id: "EMC5201",
    code: "EMC5201",
    name: "Materiais de Engenharia",
    semester: 3,
    area: "manufatura",
    hours: 72,
    weeklyClasses: 4,
    equivalents: ["EMC5101 + EMC5102"],
    syllabus:
      "Estrutura, defeitos, difusão, propriedades e processamento de metais, cerâmicas e polímeros, incluindo transformações e tratamentos térmicos.",
    sourceNote:
      "O PDF oficial não apresenta Química Tecnológica como pré-requisito; EMC5101 e EMC5102 aparecem apenas como equivalência conjunta.",
  },
  {
    id: "EMC5223",
    code: "EMC5223",
    name: "Estatística e Metrologia para Engenheiros",
    semester: 3,
    area: "manufatura",
    hours: 72,
    weeklyClasses: 4,
    equivalents: ["EMC5222 + INE5108"],
    prerequisitePaths: [["MTM3110"]],
    syllabus:
      "Probabilidade, estatística, distribuições, inferência, regressão, incerteza, calibração, rastreabilidade e sistemas de medição.",
  },
  {
    id: "EMC5405",
    code: "EMC5405",
    name: "Fundamentos da Termodinâmica",
    semester: 3,
    area: "termofluidos",
    hours: 72,
    weeklyClasses: 4,
    equivalents: ["EMC5401"],
    prerequisitePaths: [["FSC5002", "MTM3120"]],
    syllabus:
      "Primeira e segunda leis, entropia, equilíbrio termodinâmico, gases reais, equações de estado, propriedades e transições de fase.",
  },
  {
    id: "INE5202",
    code: "INE5202",
    name: "Cálculo Numérico em Computadores",
    semester: 3,
    area: "fundamentos",
    hours: 72,
    weeklyClasses: 4,
    equivalents: ["INE5232"],
    prerequisitePaths: [["INE5201"]],
    syllabus:
      "Erros numéricos, raízes de equações, sistemas lineares e não lineares, interpolação, ajuste, integração e equações diferenciais.",
  },
  {
    id: "MTM3103",
    code: "MTM3103",
    name: "Cálculo 3",
    semester: 3,
    area: "fundamentos",
    hours: 72,
    weeklyClasses: 4,
    equivalents: ["MTM5163", "MTM5804"],
    prerequisitePaths: [["MTM3120"]],
    syllabus:
      "Integrais múltiplas, curvas e superfícies, campos escalares e vetoriais, integrais de linha e teoremas de Green, Stokes e Divergência.",
  },
  {
    id: "MTM3131",
    code: "MTM3131",
    name: "Equações Diferenciais Ordinárias",
    semester: 3,
    area: "fundamentos",
    hours: 72,
    weeklyClasses: 4,
    equivalents: ["MTM3102", "MTM5162", "MTM5814"],
    prerequisitePaths: [["MTM3110"]],
    syllabus:
      "Equações diferenciais ordinárias de primeira ordem e de ordem superior, transformada de Laplace e sistemas de equações diferenciais.",
  },
  {
    id: "EMC5138",
    code: "EMC5138",
    name: "Mecânica dos Sólidos B",
    semester: 4,
    area: "solidos",
    hours: 108,
    weeklyClasses: 6,
    equivalents: ["EMC5121 + EMC5129"],
    prerequisitePaths: [["EMC5128"]],
    syllabus:
      "Campos de tensão e deslocamento, vigas hiperestáticas, flambagem, elementos finitos, critérios de falha, fadiga e tensões residuais.",
  },
  {
    id: "EMC5302",
    code: "EMC5302",
    name: "Metodologia de Projeto em Engenharia Mecânica",
    semester: 4,
    area: "projeto",
    hours: 72,
    weeklyClasses: 4,
    prerequisitePaths: [["EGR5214", "EMC5004"]],
    syllabus:
      "Processo de desenvolvimento de produtos, planejamento, especificação, concepção, projeto preliminar e detalhado, prototipagem e testes.",
  },
  {
    id: "EMC5361",
    code: "EMC5361",
    name: "Dinâmica de Corpos Rígidos",
    semester: 4,
    area: "solidos",
    hours: 72,
    weeklyClasses: 4,
    equivalents: ["FSC5207"],
    prerequisitePaths: [["FSC5101", "MTM3120"]],
    syllabus:
      "Cinemática e dinâmica plana e tridimensional de corpos rígidos, trabalho e energia, impulso, tensor de inércia e equações de Lagrange.",
  },
  {
    id: "EMC5407",
    code: "EMC5407",
    name: "Mecânica dos Fluidos I",
    semester: 4,
    area: "termofluidos",
    hours: 72,
    weeklyClasses: 4,
    equivalents: ["EMC5445"],
    prerequisitePaths: [["EMC5405", "EMC5132"], ["MTM3103"]],
    prerequisiteText:
      "Conforme o PDF: (EMC5401 ou EMC5405) e (EMC5132 ou FSC5050 ou FSC5103), ou uma das equivalências de Cálculo 3.",
    syllabus:
      "Estática dos fluidos, leis de conservação, escoamento invíscido e viscoso incompressível, análise dimensional, semelhança e escoamento interno.",
    sourceNote:
      "A disponibilidade segue literalmente os caminhos alternativos impressos no PDF oficial. Em caso de divergência operacional, prevalece o CAGR.",
  },
  {
    id: "EMC5418",
    code: "EMC5418",
    name: "Termodinâmica Aplicada",
    semester: 4,
    area: "termofluidos",
    hours: 54,
    weeklyClasses: 3,
    equivalents: ["EMC5406"],
    prerequisitePaths: [["EMC5405"]],
    syllabus:
      "Exergia, ciclos de potência e refrigeração, misturas, psicrometria, combustíveis, combustão, reações químicas e células a combustível.",
  },
  {
    id: "MTM3104",
    code: "MTM3104",
    name: "Cálculo 4",
    semester: 4,
    area: "fundamentos",
    hours: 72,
    weeklyClasses: 4,
    equivalents: ["MTM5164", "MTM5802", "MTM5814"],
    prerequisitePaths: [["MTM3131"]],
    syllabus:
      "Sequências e séries, séries de potências e Fourier e equações diferenciais parciais da onda, calor e Laplace.",
  },
  {
    id: "EMC5110",
    code: "EMC5110",
    name: "Laboratório em Propriedades Mecânicas",
    semester: 5,
    area: "manufatura",
    hours: 54,
    weeklyClasses: 3,
    prerequisitePaths: [["EMC5138", "EMC5201"]],
    syllabus:
      "Ensaios de tração, deformação, constantes elásticas, ductilidade, tenacidade, impacto, fadiga e flexão de sólidos frágeis.",
  },
  {
    id: "EMC5123",
    code: "EMC5123",
    name: "Mecanismos",
    semester: 5,
    area: "solidos",
    hours: 54,
    weeklyClasses: 3,
    prerequisitePaths: [["EMC5361"]],
    prerequisiteText: "Dinâmica de Corpos Rígidos ou FSC5207.",
    syllabus:
      "Conceitos e notação de mecanismos, tipos, síntese dimensional de mecanismos articulados e análise cinemática de cames.",
  },
  {
    id: "EMC5202",
    code: "EMC5202",
    name: "Usinagem dos Materiais",
    semester: 5,
    area: "manufatura",
    hours: 72,
    weeklyClasses: 4,
    equivalents: ["EMC5240"],
    prerequisitePaths: [["EMC5201"]],
    syllabus:
      "Processos de usinagem, máquinas-ferramenta, variáveis e fenômenos de processo, ferramentas, desgaste, custos, produtividade e integridade superficial.",
  },
  {
    id: "EMC5203",
    code: "EMC5203",
    name: "Conformação de Metais e Moldagem de Polímeros",
    semester: 5,
    area: "manufatura",
    hours: 72,
    weeklyClasses: 4,
    equivalents: ["EMC5241 + EMC5261"],
    prerequisitePaths: [["EMC5201", "EMC5223"]],
    syllabus:
      "Forjamento, laminação, trefilação, extrusão, conformação de chapas e processos de moldagem de polímeros.",
  },
  {
    id: "EMC5410",
    code: "EMC5410",
    name: "Laboratório em Ciências Térmicas",
    semester: 5,
    area: "termofluidos",
    hours: 36,
    weeklyClasses: 2,
    prerequisitePaths: [["EMC5405"]],
    syllabus:
      "Medição de temperatura, pressão, fluxo de calor, velocidade e vazão, com experimentos, balanços de energia e avaliação de rendimentos.",
  },
  {
    id: "EMC5417",
    code: "EMC5417",
    name: "Transmissão de Calor",
    semester: 5,
    area: "termofluidos",
    hours: 72,
    weeklyClasses: 4,
    equivalents: ["EMC5403"],
    prerequisitePaths: [["EMC5405", "INE5201", "MTM3103"]],
    prerequisiteText:
      "Fundamentos da Termodinâmica, programação e Cálculo 3, admitidas as equivalências indicadas no PDF.",
    syllabus:
      "Condução unidimensional, bidimensional e transiente, métodos numéricos, radiação térmica e troca radiativa entre superfícies.",
  },
  {
    id: "EMC5419",
    code: "EMC5419",
    name: "Mecânica de Fluidos II",
    semester: 5,
    area: "termofluidos",
    hours: 54,
    weeklyClasses: 3,
    equivalents: ["EMC5408"],
    prerequisitePaths: [["EMC5407", "MTM3104"]],
    prerequisiteText:
      "Mecânica dos Fluidos I e Cálculo 4, com as alternativas/equivalências impressas no PDF.",
    syllabus:
      "Escoamentos turbulentos, escoamento externo viscoso incompressível, máquinas de fluxo e escoamento compressível.",
  },
  {
    id: "FSC5113",
    code: "FSC5113",
    name: "Física III",
    semester: 5,
    area: "fundamentos",
    hours: 72,
    weeklyClasses: 4,
    equivalents: ["FSC5133"],
    prerequisitePaths: [["MTM3110"]],
    syllabus:
      "Campo e potencial elétrico, capacitores, corrente, força eletromotriz, campo magnético e indução eletromagnética.",
  },
  {
    id: "EEL5113",
    code: "EEL5113",
    name: "Eletrotécnica Geral",
    semester: 6,
    area: "formacao",
    hours: 36,
    weeklyClasses: 2,
    equivalents: ["EEL5114"],
    prerequisitePaths: [["FSC5113"]],
    syllabus:
      "Eletricidade básica, circuitos elétricos, transformadores, motores e medidas elétricas.",
  },
  {
    id: "EMC5005",
    code: "EMC5005",
    name: "Projeto Integrado em Engenharia Mecânica",
    semester: 6,
    area: "projeto",
    hours: 72,
    weeklyClasses: 4,
    prerequisitePaths: [["EMC5302", "INE5202"]],
    prerequisiteText:
      "Metodologia de Projeto e INE5202 ou sua equivalente INE5232.",
    syllabus:
      "Planejamento e execução de projeto, especificações, concepção, modelagem, simulação e avaliação de modelo ou protótipo.",
  },
  {
    id: "EMC5210",
    code: "EMC5210",
    name: "Laboratório em Manufatura e Metrologia",
    semester: 6,
    area: "manufatura",
    hours: 72,
    weeklyClasses: 4,
    prerequisitePaths: [["EMC5202", "EMC5203", "EMC5223", "EMC5302"]],
    syllabus:
      "Atividades práticas de metrologia, fundição, conformação, usinagem e processamento de polímeros.",
  },
  {
    id: "EMC5335",
    code: "EMC5335",
    name: "Elementos de Máquinas",
    semester: 6,
    area: "solidos",
    hours: 90,
    weeklyClasses: 5,
    equivalents: ["EMC5330 + EMC5332"],
    prerequisitePaths: [["EMC5123", "EMC5138"]],
    syllabus:
      "Engrenagens, parafusos, molas, eixos, ligações cubo-eixo, mancais, redutores, acoplamentos, freios, embreagens, correias e correntes.",
  },
  {
    id: "EMC5336",
    code: "EMC5336",
    name: "Controle de Sistemas Dinâmicos",
    semester: 6,
    area: "solidos",
    hours: 72,
    weeklyClasses: 4,
    prerequisitePaths: [["MTM3104"]],
    prerequisiteText: "Cálculo 4 ou uma das equivalências indicadas no PDF.",
    syllabus:
      "Sistemas realimentados, modelos dinâmicos mecânicos, elétricos e eletromecânicos, resposta dinâmica, lugar das raízes e resposta em frequência.",
    sourceNote:
      "Esta disciplina obrigatória estava ausente na primeira versão do fluxograma interativo.",
  },
  {
    id: "EMC5404",
    code: "EMC5404",
    name: "Transmissão de Calor II",
    semester: 6,
    area: "termofluidos",
    hours: 54,
    weeklyClasses: 3,
    prerequisitePaths: [["EMC5407", "EMC5417"]],
    syllabus:
      "Convecção, camada limite, turbulência, escoamentos internos e externos, convecção natural, ebulição, condensação e trocadores de calor.",
  },
  {
    id: "EMC5443",
    code: "EMC5443",
    name: "Fundamentos de Sistemas Hidráulicos e Pneumáticos",
    semester: 6,
    area: "termofluidos",
    hours: 54,
    weeklyClasses: 3,
    prerequisitePaths: [["EMC5407"]],
    requiredFrom: 20141,
    syllabus:
      "Fluidos, bombas, atuadores, válvulas, acumuladores, dimensionamento hidráulico, comandos pneumáticos e geração e distribuição de ar comprimido.",
    sourceNote:
      "Obrigatória para estudantes com matrícula no curso a partir de 2014.1, conforme a observação do currículo oficial.",
  },
  {
    id: "EMC5003",
    code: "EMC5003",
    name: "Tecnologia e Desenvolvimento",
    semester: 7,
    area: "formacao",
    hours: 54,
    weeklyClasses: 3,
    requiredHours: 1500,
    syllabus:
      "Ciência, tecnologia e sociedade, desenvolvimento tecnológico e social, modelos de produção, risco, impactos e questões éticas e políticas.",
  },
  {
    id: "EMC5006",
    code: "EMC5006",
    name: "Eletrônica",
    semester: 7,
    area: "formacao",
    hours: 72,
    weeklyClasses: 4,
    equivalents: ["EMC5281"],
    prerequisitePaths: [["EEL5113"]],
    syllabus:
      "Circuitos, instrumentos, transdução, processamento de sinais, eletrônica analógica e digital, microcontroladores e aquisição de dados.",
  },
  {
    id: "EMC5140",
    code: "EMC5140",
    name: "Controle de Vibrações",
    semester: 7,
    area: "solidos",
    hours: 72,
    weeklyClasses: 4,
    prerequisitePaths: [["EMC5138", "EMC5361", "MTM3104"]],
    prerequisiteText:
      "Mecânica dos Sólidos B, Dinâmica de Corpos Rígidos e Cálculo 4, admitidas as equivalências do PDF.",
    syllabus:
      "Movimentos vibratórios, resposta de sistemas lineares, modelagem, medição, máquinas rotativas e técnicas de controle de vibrações.",
  },
  {
    id: "EMC5204",
    code: "EMC5204",
    name: "Soldagem",
    semester: 7,
    area: "manufatura",
    hours: 36,
    weeklyClasses: 2,
    equivalents: ["EMC5262"],
    prerequisitePaths: [["EEL5113", "EMC5201"]],
    syllabus:
      "Soldagem a arco, fontes, processos TIG, MIG/MAG, eletrodo revestido e arame tubular, efeitos térmicos, soldabilidade e descontinuidades.",
  },
  {
    id: "ENS5146",
    code: "ENS5146",
    name: "Introdução à Engenharia Ambiental",
    semester: 7,
    area: "formacao",
    hours: 36,
    weeklyClasses: 2,
    equivalents: ["ECZ5102"],
    requiredHours: 1500,
    syllabus:
      "Crise ambiental, processos e controle de poluição, gestão e normas ambientais, produção mais limpa, economia e legislação.",
  },
  {
    id: "EPS5229",
    code: "EPS5229",
    name: "Organização Industrial",
    semester: 7,
    area: "formacao",
    hours: 54,
    weeklyClasses: 3,
    equivalents: ["EPS5209"],
    requiredHours: 1500,
    syllabus:
      "Administração, organização e métodos, planejamento, estruturas organizacionais, pessoal, motivação, liderança e projetos empresariais.",
  },
  {
    id: "EMC5021",
    code: "EMC5021",
    name: "Planejamento do Trabalho de Curso",
    semester: 8,
    area: "conclusao",
    hours: 36,
    weeklyClasses: 2,
    requiredHours: 2200,
    syllabus:
      "Planejamento técnico do trabalho com orientador, cronograma, metodologia, ferramentas e levantamento bibliográfico.",
  },
  {
    id: "OPTATIVA1",
    code: "OPTATIVA I",
    name: "Bloco de Disciplinas Optativas I",
    semester: 8,
    area: "conclusao",
    hours: 360,
    weeklyClasses: 20,
    kind: "bloco-optativo",
    requiredHours: 2200,
    syllabus:
      "Primeiro bloco de integralização das optativas profissionais previstas no currículo, totalizando 360 H/A.",
  },
  {
    id: "EMC5022",
    code: "EMC5022",
    name: "Trabalho de Curso",
    semester: 9,
    area: "conclusao",
    hours: 180,
    weeklyClasses: 10,
    prerequisitePaths: [["EMC5021"]],
    syllabus:
      "Aplicação prática dos conhecimentos do curso por meio de trabalho técnico ou científico no nível atribuído ao engenheiro mecânico.",
  },
  {
    id: "OPTATIVA2",
    code: "OPTATIVA II",
    name: "Bloco de Disciplinas Optativas II",
    semester: 9,
    area: "conclusao",
    hours: 216,
    weeklyClasses: 12,
    kind: "bloco-optativo",
    syllabus:
      "Segundo bloco de integralização das optativas profissionais, completando as 576 H/A exigidas pelo currículo.",
  },
  {
    id: "EMC5522",
    code: "EMC5522",
    name: "Estágio Profissional em Engenharia Mecânica",
    semester: 10,
    area: "conclusao",
    hours: 522,
    weeklyClasses: 22,
    kind: "estagio",
    requiredHours: 2500,
    syllabus:
      "Vivência profissional em indústria, pesquisa ou empresa, aplicação dos conhecimentos técnicos e desenvolvimento das relações profissionais.",
  },
];

export const electiveAreas: ElectiveArea[] = [
  {
    id: "gerais",
    label: "Gerais e Bloco Especial",
    description:
      "Formação complementar, gestão, monitoria, empreendedorismo, segurança e temas interdisciplinares.",
    examples: [
      "EMC5031-EMC5033 · Atividades de Monitoria",
      "EPS5240 · Gerenciamento de Projetos",
      "EPS7013 · Empreendedorismo",
      "EMC5007 · Segurança do Trabalho",
    ],
  },
  {
    id: "projeto",
    label: "Análise Estrutural e Projeto",
    description:
      "Projeto mecânico, estruturas, vibrações, CAD/CAE/CAM, veículos, robótica e otimização.",
    examples: [
      "EMC5139 · Mecânica dos Sólidos C",
      "EMC5310 · Projeto de Estruturas",
      "EMC5353 · Mecânica dos Sólidos Computacional I",
      "EMC5358 · Dinâmica Veicular",
    ],
  },
  {
    id: "fabricacao",
    label: "Fabricação",
    description:
      "Conformação, usinagem, soldagem, metrologia, materiais, automação e manufatura.",
    examples: [
      "EMC5209 · Processos de Conformação Contínua",
      "EMC5236 · Medição de Grandezas Mecânicas",
      "EMC5272 · Processos de Soldagem",
      "EMC5605 · Fabricação Experimental",
    ],
  },
  {
    id: "termica",
    label: "Ciências Térmicas",
    description:
      "Fluidos, transferência de calor, energia, vapor, refrigeração, combustão e sistemas térmicos.",
    examples: [
      "EMC5414 · Geradores de Vapor",
      "EMC5415 · Trocadores de Calor",
      "EMC5471 · Geração e Distribuição de Vapor",
      "EMC5489 · Energias Renováveis",
    ],
  },
  {
    id: "pos-intercambio",
    label: "Pós-graduação e Intercâmbio",
    description:
      "Componentes validados de pós-graduação, intercâmbio e duplo diploma, conforme análise acadêmica.",
    examples: [
      "EMC5901-EMC5911 · Disciplinas de Pós-graduação",
      "EMC5950-EMC5990 · Intercâmbio e Duplo Diploma",
      "EMC5041-EMC5052 · Intercâmbio Extra Curso",
    ],
  },
];

export const courseById = Object.fromEntries(
  courses.map((course) => [course.id, course]),
) as Record<string, Course>;

export const semesterNumbers = Array.from({ length: 10 }, (_, index) => index + 1);

export const prerequisiteIds = (course: Course) =>
  Array.from(new Set((course.prerequisitePaths ?? []).flat()));
