// API MOCK SIMPLIFICADA PARA CLIENT-SIDE
// Esta roda diretamente no navegador, simulando backend

export enum TipoPatente {
  PI = 'PI',
  MU = 'MU',
  CII = 'CII',
  RPC = 'RPC'
}

export enum StatusPedido {
  RASCUNHO = 'RASCUNHO',
  EM_ANALISE = 'EM_ANALISE',
  APROVADO = 'APROVADO',
  COM_RESSALVAS = 'COM_RESSALVAS',
  REPROVADO = 'REPROVADO',
  DEPOSITADO = 'DEPOSITADO'
}

export enum FaseAtual {
  PREPARACAO = 1,
  SUBMISSAO = 2,
  ANALISE = 3,
  FORMALIZACAO = 4,
  ROBUSTEZ = 5
}

interface Inventor {
  id: string;
  nome: string;
  cpf: string;
}

interface Anexo {
  tipo: string;
  arquivo: boolean;
}

interface PedidoPatente {
  id: string;
  tipo: TipoPatente;
  titulo: string;
  problema: string;
  solucao: string;
  estadoTecnica: string;
  vantagens: string;
  palavrasChave: string;
  faseAtual: FaseAtual;
  status: StatusPedido;
  dataCriacao: Date;
  protocolo?: string;
}

// Dados iniciais mockados
const dadosIniciais: PedidoPatente[] = [
  {
    id: 'PED-2024-001',
    tipo: TipoPatente.PI,
    titulo: 'Dispositivo Odontológico para Tratamento de Lesões',
    problema: 'Tratamento de lesões em mucosa oral requer procedimentos complexos...',
    solucao: 'Dispositivo de liberação controlada de princípios ativos...',
    estadoTecnica: 'Existem géis e pomadas, mas requerem aplicação frequente...',
    vantagens: 'Redução de tempo em 40%; 35% menos dor...',
    palavrasChave: 'cicatrização, odontologia, dispositivo',
    faseAtual: FaseAtual.ANALISE,
    status: StatusPedido.EM_ANALISE,
    dataCriacao: new Date('2024-01-15'),
    protocolo: 'PROTO-2024-001'
  },
  {
    id: 'PED-2024-002',
    tipo: TipoPatente.CII,
    titulo: 'Sistema de Análise de Imagens Médicas por IA',
    problema: 'Diagnóstico depende da experiência do radiologista...',
    solucao: 'Algoritmo de IA que analisa exames com precisão de 97%...',
    estadoTecnica: 'Existem sistemas CAD, mas têm alta taxa de falso positivo...',
    vantagens: 'Precisão 97% vs 85% humano; Tempo de 30s vs 20min...',
    palavrasChave: 'IA, radiologia, diagnóstico',
    faseAtual: FaseAtual.SUBMISSAO,
    status: StatusPedido.EM_ANALISE,
    dataCriacao: new Date('2024-01-20'),
    protocolo: 'PROTO-2024-002'
  }
];

// Simula delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function apiObterEstatisticas() {
  await delay(300);
  return {
    totalPedidos: dadosIniciais.length,
    kpis: {
      reducaoRetrabalho: 92,
      satisfacaoUX: 94,
      tempoPrimeiraDevolutiva: 8,
      taxaAprovacaoEntrada: 78,
      tempoReducaoRedacao: 55,
      taxaDeferimentoINPI: 85
    }
  };
}

export async function apiListarPedidos() {
  await delay(300);
  return dadosIniciais;
}

export async function apiCriarPedido(dados: Partial<PedidoPatente>) {
  await delay(500);
  const novoId = `PED-${new Date().getFullYear()}-${String(dadosIniciais.length + 1).padStart(3, '0')}`;
  
  const novo: PedidoPatente = {
    id: novoId,
    tipo: dados.tipo || TipoPatente.PI,
    titulo: dados.titulo || '',
    problema: dados.problema || '',
    solucao: dados.solucao || '',
    estadoTecnica: dados.estadoTecnica || '',
    vantagens: dados.vantagens || '',
    palavrasChave: dados.palavrasChave || '',
    faseAtual: FaseAtual.PREPARACAO,
    status: StatusPedido.RASCUNHO,
    dataCriacao: new Date(),
    protocolo: `PROTO-${new Date().getFullYear()}-${String(dadosIniciais.length + 1).padStart(3, '0')}`
  };
  
  dadosIniciais.push(novo);
  return novo;
}

export async function apiAutoPreencher(tipo: string) {
  await delay(200);
  
  const sugestoes = {
    titulo: 'Dispositivo para [termo1] com [termo2]',
    vantagens: 'Redução de tempo em 30%; Economia de custos de 25%; Melhoria de eficiência em 40%',
    estadoTecnica: 'Atualmente, existem soluções que utilizam [tecnologias], no entanto, estas apresentam limitações...'
  };
  
  return {
    sugestao: sugestoes[tipo as keyof typeof sugestoes] || '',
    explicacao: 'Sugestão gerada automaticamente pelo sistema'
  };
}
