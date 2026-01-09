// ============================================================================
// SISTEMA DE GERENCIAMENTO DE PEDIDOS (localStorage)
// ============================================================================

export enum TipoPatente {
  PI = 'PI',
  MU = 'MU',
  CII = 'CII',
  RPC = 'RPC'
}

export enum StatusPedido {
  RASCUNHO = 'RASCUNHO',
  SUBMETIDO = 'SUBMETIDO',
  EM_ANALISE = 'EM_ANALISE',
  APROVADO = 'APROVADO',
  REPROVADO = 'REPROVADO'
}

export interface PedidoFormData {
  // Dados do formulário principal
  tipo: TipoPatente;
  titulo: string;
  problema: string;
  solucao: string;
  estadoTecnica?: string;
  vantagens?: string;
  palavrasChave?: string;
}

export interface AnexosData {
  a?: any; // AnexoAData
  b?: any; // AnexoBData
  c?: any; // AnexoCData
  f?: any; // AnexoFData
}

export interface Pedido {
  id: string;
  pedidoId: string; // ID compartilhado entre formulário e anexos
  tipo: TipoPatente;
  titulo: string;
  formData: PedidoFormData;
  anexos: AnexosData;
  status: StatusPedido;
  anexosCompletos: {
    a: boolean;
    b: boolean;
    c: boolean;
    f: boolean;
  };
  dataCriacao: Date;
  dataSubmissao?: Date;
  protocolo?: string;
}

const STORAGE_KEY = 'prof_inpi_pedidos';
const PEDIDO_ID_PREFIX = 'PED-';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generatePedidoId(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${PEDIDO_ID_PREFIX}${dateStr}-${random}`;
}

function generateProtocolo(): string {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `PROT-${year}-${random}`;
}

// ============================================================================
// STORAGE FUNCTIONS
// ============================================================================

export function getPedidos(): Pedido[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return parsed.map((p: any) => ({
      ...p,
      dataCriacao: new Date(p.dataCriacao),
      dataSubmissao: p.dataSubmissao ? new Date(p.dataSubmissao) : undefined,
    }));
  } catch (e) {
    console.error('Erro ao carregar pedidos:', e);
    return [];
  }
}

export function savePedidos(pedidos: Pedido[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pedidos));
  } catch (e) {
    console.error('Erro ao salvar pedidos:', e);
  }
}

export function getPedidoById(id: string): Pedido | null {
  const pedidos = getPedidos();
  return pedidos.find(p => p.id === id) || null;
}

export function getPedidoByPedidoId(pedidoId: string): Pedido | null {
  const pedidos = getPedidos();
  return pedidos.find(p => p.pedidoId === pedidoId) || null;
}

// ============================================================================
// CRUD OPERATIONS
// ============================================================================

export function createPedido(formData: PedidoFormData): Pedido {
  const pedidos = getPedidos();

  const novoPedido: Pedido = {
    id: Date.now().toString(),
    pedidoId: generatePedidoId(),
    tipo: formData.tipo,
    titulo: formData.titulo || 'Sem título',
    formData,
    anexos: {},
    status: StatusPedido.RASCUNHO,
    anexosCompletos: { a: false, b: false, c: false, f: false },
    dataCriacao: new Date(),
  };

  pedidos.push(novoPedido);
  savePedidos(pedidos);

  return novoPedido;
}

export function updatePedido(id: string, updates: Partial<Pedido>): Pedido | null {
  const pedidos = getPedidos();
  const index = pedidos.findIndex(p => p.id === id);

  if (index === -1) return null;

  pedidos[index] = { ...pedidos[index], ...updates };
  savePedidos(pedidos);

  return pedidos[index];
}

export function updatePedidoByPedidoId(pedidoId: string, updates: Partial<Pedido>): Pedido | null {
  const pedidos = getPedidos();
  const index = pedidos.findIndex(p => p.pedidoId === pedidoId);

  if (index === -1) return null;

  pedidos[index] = { ...pedidos[index], ...updates };
  savePedidos(pedidos);

  return pedidos[index];
}

export function deletePedido(id: string): boolean {
  const pedidos = getPedidos();
  const filtered = pedidos.filter(p => p.id !== id);

  if (filtered.length === pedidos.length) return false;

  savePedidos(filtered);
  return true;
}

// ============================================================================
// ANEXOS OPERATIONS
// ============================================================================

export function updateAnexo(pedidoId: string, anexoTipo: 'a' | 'b' | 'c' | 'f', anexoData: any): Pedido | null {
  const pedido = getPedidoByPedidoId(pedidoId);
  if (!pedido) return null;

  const anexosAtualizados = {
    ...pedido.anexos,
    [anexoTipo]: anexoData
  };

  // Verificar se o anexo está completo
  const anexoCompleto = validateAnexoCompleto(anexoTipo, anexoData);

  return updatePedidoByPedidoId(pedidoId, {
    anexos: anexosAtualizados,
    anexosCompletos: {
      ...pedido.anexosCompletos,
      [anexoTipo]: anexoCompleto
    }
  });
}

function validateAnexoCompleto(tipo: 'a' | 'b' | 'c' | 'f', data: any): boolean {
  if (!data) return false;

  switch (tipo) {
    case 'a':
      return !!(
        data.responsavel &&
        data.termoBusca1 && data.termoBusca2 && data.termoBusca3 &&
        data.documentosRelevantes && data.documentosRelevantes.length > 0 &&
        data.éNova !== undefined &&
        data.justificativaNovidade && data.justificativaNovidade.length >= 200
      );

    case 'b':
      return !!(
        data.problemaTitulo && data.problemaDescricao &&
        data.solucoesExistentes && data.solucoesExistentes.length >= 2 &&
        data.solucaoPropostaTitulo && data.solucaoPropostaDescricao
      );

    case 'c':
      return !!(
        data.titulo && data.campoInvencao && data.estadoTecnica &&
        data.reivindicacoes && data.reivindicacoes.length >= 3
      );

    case 'f':
      return !!(
        data.inventores && data.inventores.length > 0 &&
        data.declaracaoOriginalidade &&
        data.declaracaoCessaoDireitos
      );

    default:
      return false;
  }
}

export function getAnexoStatus(pedidoId: string): { a: boolean; b: boolean; c: boolean; f: boolean } {
  const pedido = getPedidoByPedidoId(pedidoId);
  if (!pedido) return { a: false, b: false, c: false, f: false };
  return pedido.anexosCompletos;
}

export function getAnexosObrigatoriosStatus(pedidoId: string): { completos: number; total: number } {
  const status = getAnexoStatus(pedidoId);
  const obrigatorios = ['a', 'b', 'c'] as const;
  const completos = obrigatorios.filter(t => status[t]).length;
  return { completos, total: obrigatorios.length };
}

// ============================================================================
// SUBMISSAO
// ============================================================================

export function submeterPedido(pedidoId: string): { success: boolean; protocolo?: string; error?: string } {
  const pedido = getPedidoByPedidoId(pedidoId);
  if (!pedido) {
    return { success: false, error: 'Pedido não encontrado' };
  }

  // Verificar anexos obrigatórios
  const { completos, total } = getAnexosObrigatoriosStatus(pedidoId);
  if (completos < total) {
    return { success: false, error: `Anexos obrigatórios incompletos (${completos}/${total})` };
  }

  const protocolo = generateProtocolo();

  updatePedidoByPedidoId(pedidoId, {
    status: StatusPedido.SUBMETIDO,
    dataSubmissao: new Date(),
    protocolo
  });

  return { success: true, protocolo };
}

// ============================================================================
// FILTERS
// ============================================================================

export function getPedidosByTipo(tipo: TipoPatente): Pedido[] {
  return getPedidos().filter(p => p.tipo === tipo);
}

export function getPedidosByStatus(status: StatusPedido): Pedido[] {
  return getPedidos().filter(p => p.status === status);
}

export function getRascunhos(): Pedido[] {
  return getPedidosByStatus(StatusPedido.RASCUNHO);
}

export function getSubmetidos(): Pedido[] {
  return getPedidos().filter(p => p.status === StatusPedido.SUBMETIDO);
}
