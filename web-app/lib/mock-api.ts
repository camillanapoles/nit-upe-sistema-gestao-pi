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

// ============================================================================
// CII API (Computer Implemented Invention)
// ============================================================================

interface PedidoCIIData {
  titulo: string;
  versao?: string;
  plataforma: string;
  descricaoEfeitoTecnico: string;
  metricaQuantitativa: string;
  tipoEfeitoTecnico: string;
  funcionalidades: string;
  inputs: string;
  outputs: string;
  processador: string;
  memoriaRAM: string;
  armazenamento: string;
  descricaoFluxo: string;
  resumoMetodo: string;
  resumoSistema: string;
  resumoMidia: string;
}

export async function apiCriarPedidoCII(dados: PedidoCIIData) {
  await delay(500);
  const novoId = `CII-${new Date().getFullYear()}-${String(dadosIniciais.length + 1).padStart(3, '0')}`;

  const novo: PedidoPatente = {
    id: novoId,
    tipo: TipoPatente.CII,
    titulo: dados.titulo,
    problema: `Efeito Técnico: ${dados.descricaoEfeitoTecnico}\nMétrica: ${dados.metricaQuantitativa}`,
    solucao: `Funcionalidades: ${dados.funcionalidades}\nInputs: ${dados.inputs}\nOutputs: ${dados.outputs}`,
    estadoTecnica: `Requisitos: ${dados.processador}, ${dados.memoriaRAM}, ${dados.armazenamento}`,
    vantagens: `Tipo: ${dados.tipoEfeitoTecnico}\nTripla Reivindicação: ${dados.resumoMetodo} | ${dados.resumoSistema} | ${dados.resumoMidia}`,
    palavrasChave: `${dados.plataforma}, ${dados.tipoEfeitoTecnico}, CII`,
    faseAtual: FaseAtual.PREPARACAO,
    status: StatusPedido.RASCUNHO,
    dataCriacao: new Date(),
    protocolo: `PROTO-${new Date().getFullYear()}-${String(dadosIniciais.length + 1).padStart(3, '0')}`
  };

  dadosIniciais.push(novo);
  return novo;
}

// ============================================================================
// RPC API (Registro de Programa de Computador)
// ============================================================================

interface PedidoRPCData {
  nomePrograma: string;
  versao?: string;
  linguagem: string;
  plataforma: string;
  descricaoFuncional: string;
  nomeAutor: string;
  cpfAutor: string;
  emailAutor: string;
  tipoVinculo: string;
  vinculoUPE: string;
}

export async function apiCriarPedidoRPC(dados: PedidoRPCData) {
  await delay(500);
  const novoId = `RPC-${new Date().getFullYear()}-${String(dadosIniciais.length + 1).padStart(3, '0')}`;

  const novo: PedidoPatente = {
    id: novoId,
    tipo: TipoPatente.RPC,
    titulo: dados.nomePrograma,
    problema: `Descrição: ${dados.descricaoFuncional}`,
    solucao: `Linguagem: ${dados.linguagem}\nPlataforma: ${dados.plataforma}`,
    estadoTecnica: `Autor: ${dados.nomeAutor} (${dados.cpfAutor})\nVínculo: ${dados.tipoVinculo}`,
    vantagens: `Vínculo UPE: ${dados.vinculoUPE}\nEmail: ${dados.emailAutor}`,
    palavrasChave: `${dados.plataforma}, ${dados.linguagem}, RPC`,
    faseAtual: FaseAtual.PREPARACAO,
    status: StatusPedido.RASCUNHO,
    dataCriacao: new Date(),
    protocolo: `PROTO-${new Date().getFullYear()}-${String(dadosIniciais.length + 1).padStart(3, '0')}`
  };

  dadosIniciais.push(novo);
  return novo;
}
