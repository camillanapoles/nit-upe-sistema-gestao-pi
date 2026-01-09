// ============================================================================
// MOCK API PARA ANEXOS (Client-side)
// ============================================================================

import { type AnexoAInput } from '@/lib/validations/anexos';
import { type AnexoBInput } from '@/lib/validations/anexos';
import { type AnexoCInput } from '@/lib/validations/anexos';
import { type AnexoFInput } from '@/lib/validations/anexos';

// Simula delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================================
// ANEXO A - BUSCA DE ANTERIORIDADE
// ============================================================================

export interface AnexoACreateData {
  pedidoId: string;
  dataBusca: string;
  responsavel: string;
  termoBusca1: string;
  termoBusca2: string;
  termoBusca3: string;
  baseInpi: { consultada: boolean; data: string; url: string };
  baseEspacenet: { consultada: boolean; data: string; url: string };
  baseGooglePatents: { consultada: boolean; data: string; url: string };
  documentosRelevantes: any[];
  éNova: boolean;
  justificativaNovidade: string;
}

export async function apiCriarAnexoA(dados: AnexoACreateData) {
  await delay(800);

  // Salvar no localStorage
  const storageKey = `anexo-a-${dados.pedidoId}`;
  localStorage.setItem(storageKey, JSON.stringify(dados));

  // Atualizar storage de pedidos
  const { updateAnexo } = await import('./pedido-storage');
  updateAnexo(dados.pedidoId, 'a', dados);

  return {
    success: true,
    anexoId: `ANX-A-${dados.pedidoId}`,
    message: 'Anexo A salvo com sucesso'
  };
}

export async function apiGetAnexoA(pedidoId: string) {
  await delay(300);

  const storageKey = `anexo-a-${pedidoId}`;
  const data = localStorage.getItem(storageKey);

  if (!data) {
    return { success: false, error: 'Anexo A não encontrado' };
  }

  return { success: true, data: JSON.parse(data) };
}

// ============================================================================
// ANEXO B - MATRIZ PROBLEMA X SOLUÇÃO
// ============================================================================

export interface AnexoBCreateData {
  pedidoId: string;
  problemaTitulo: string;
  problemaDescricao: string;
  problemaQuemSofre: string;
  problemaComoSeManifesta: string;
  solucoesExistentes: any[];
  solucaoPropostaTitulo: string;
  solucaoPropostaDescricao: string;
  solucaoPropostaComoFunciona: string;
  solucaoPropostaInovacao: string;
  solucaoPropostaDiferencial: string;
  vantagensComparativas: any[];
}

export async function apiCriarAnexoB(dados: AnexoBCreateData) {
  await delay(800);

  const storageKey = `anexo-b-${dados.pedidoId}`;
  localStorage.setItem(storageKey, JSON.stringify(dados));

  const { updateAnexo } = await import('./pedido-storage');
  updateAnexo(dados.pedidoId, 'b', dados);

  return {
    success: true,
    anexoId: `ANX-B-${dados.pedidoId}`,
    message: 'Anexo B salvo com sucesso'
  };
}

export async function apiGetAnexoB(pedidoId: string) {
  await delay(300);

  const storageKey = `anexo-b-${pedidoId}`;
  const data = localStorage.getItem(storageKey);

  if (!data) {
    return { success: false, error: 'Anexo B não encontrado' };
  }

  return { success: true, data: JSON.parse(data) };
}

// ============================================================================
// ANEXO C - MEMORIAL DESCRITIVO
// ============================================================================

export interface AnexoCCreateData {
  pedidoId: string;
  titulo: string;
  campoInvencao: string;
  estadoTecnica: string;
  objetivos: string;
  caracteristicas: string;
  vantagens: string;
  componentes: string;
  funcionamento: string;
  modoRealizacao: string;
  parametros: string;
  figuras: any[];
  reivindicacoes: any[];
}

export async function apiCriarAnexoC(dados: AnexoCCreateData) {
  await delay(800);

  const storageKey = `anexo-c-${dados.pedidoId}`;
  localStorage.setItem(storageKey, JSON.stringify(dados));

  const { updateAnexo } = await import('./pedido-storage');
  updateAnexo(dados.pedidoId, 'c', dados);

  return {
    success: true,
    anexoId: `ANX-C-${dados.pedidoId}`,
    message: 'Anexo C salvo com sucesso'
  };
}

export async function apiGetAnexoC(pedidoId: string) {
  await delay(300);

  const storageKey = `anexo-c-${pedidoId}`;
  const data = localStorage.getItem(storageKey);

  if (!data) {
    return { success: false, error: 'Anexo C não encontrado' };
  }

  return { success: true, data: JSON.parse(data) };
}

// ============================================================================
// ANEXO F - QUALIFICAÇÃO DE INVENTORES
// ============================================================================

export interface AnexoFCreateData {
  pedidoId: string;
  inventores: any[];
  sisgen: {
    usaBiodiversidade: boolean;
    numeroSisgen: string;
    especie: string;
    origem: string;
  };
  financiamento: {
    financiamentoExterno: boolean;
    agencia: string;
    numeroProcesso: string;
    valor: string;
  };
  declaracaoOriginalidade: boolean;
  declaracaoCessaoDireitos: boolean;
  assinaturaDigital?: any;
}

export async function apiCriarAnexoF(dados: AnexoFCreateData) {
  await delay(800);

  const storageKey = `anexo-f-${dados.pedidoId}`;
  localStorage.setItem(storageKey, JSON.stringify(dados));

  const { updateAnexo } = await import('./pedido-storage');
  updateAnexo(dados.pedidoId, 'f', dados);

  return {
    success: true,
    anexoId: `ANX-F-${dados.pedidoId}`,
    message: 'Anexo F salvo com sucesso'
  };
}

export async function apiGetAnexoF(pedidoId: string) {
  await delay(300);

  const storageKey = `anexo-f-${pedidoId}`;
  const data = localStorage.getItem(storageKey);

  if (!data) {
    return { success: false, error: 'Anexo F não encontrado' };
  }

  return { success: true, data: JSON.parse(data) };
}

// ============================================================================
// STATUS DE ANEXOS
// ============================================================================

export interface AnexosStatus {
  pedidoId: string;
  anexos: {
    a: boolean;
    b: boolean;
    c: boolean;
    f: boolean;
  };
  obrigatoriosCompletos: number;
  obrigatoriosTotal: number;
  todosCompletos: boolean;
}

export async function apiGetAnexosStatus(pedidoId: string) {
  await delay(200);

  const { getAnexoStatus, getAnexosObrigatoriosStatus } = await import('./pedido-storage');
  const status = getAnexoStatus(pedidoId);
  const { completos, total } = getAnexosObrigatoriosStatus(pedidoId);

  return {
    success: true,
    data: {
      pedidoId,
      anexos: status,
      obrigatoriosCompletos: completos,
      obrigatoriosTotal: total,
      todosCompletos: completos === total
    } as AnexosStatus
  };
}

// ============================================================================
// VALIDAÇÃO DE ANEXOS
// ============================================================================

export async function apiValidarAnexoA(dados: Partial<AnexoACreateData>) {
  await delay(300);

  const errors: string[] = [];

  if (!dados.responsavel) errors.push('Responsável é obrigatório');
  if (!dados.termoBusca1 || !dados.termoBusca2 || !dados.termoBusca3) {
    errors.push('Todos os 3 termos de busca são obrigatórios');
  }
  if (!dados.documentosRelevantes || dados.documentosRelevantes.length === 0) {
    errors.push('Pelo menos 1 documento relevante é obrigatório');
  }
  if (!dados.documentosRelevantes?.some((d: any) => d.relevancia === 'Alta')) {
    errors.push('Pelo menos 1 documento deve ter relevância Alta');
  }
  if (dados.éNova === undefined) {
    errors.push('Responda: É nova?');
  }
  if (!dados.justificativaNovidade || dados.justificativaNovidade.length < 200) {
    errors.push('Justificativa deve ter no mínimo 200 caracteres');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export async function apiValidarAnexoB(dados: Partial<AnexoBCreateData>) {
  await delay(300);

  const errors: string[] = [];

  if (!dados.problemaTitulo || dados.problemaTitulo.length < 5) {
    errors.push('Título do problema deve ter no mínimo 5 caracteres');
  }
  if (!dados.problemaDescricao || dados.problemaDescricao.length < 300) {
    errors.push('Descrição do problema deve ter no mínimo 300 caracteres');
  }
  if (!dados.solucoesExistentes || dados.solucoesExistentes.length < 2) {
    errors.push('Pelo menos 2 soluções existentes são obrigatórias');
  }
  if (!dados.solucaoPropostaTitulo || dados.solucaoPropostaTitulo.length < 5) {
    errors.push('Título da solução proposta deve ter no mínimo 5 caracteres');
  }
  if (!dados.solucaoPropostaDescricao || dados.solucaoPropostaDescricao.length < 300) {
    errors.push('Descrição da solução proposta deve ter no mínimo 300 caracteres');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export async function apiValidarAnexoC(dados: Partial<AnexoCCreateData>) {
  await delay(300);

  const errors: string[] = [];

  if (!dados.titulo || dados.titulo.length < 10) {
    errors.push('Título deve ter no mínimo 10 caracteres');
  }
  if (!dados.campoInvencao || dados.campoInvencao.length < 10) {
    errors.push('Campo da invenção deve ter no mínimo 10 caracteres');
  }
  if (!dados.estadoTecnica || dados.estadoTecnica.length < 500) {
    errors.push('Estado da técnica deve ter no mínimo 500 caracteres');
  }
  if (!dados.reivindicacoes || dados.reivindicacoes.length < 3) {
    errors.push('Mínimo de 3 reivindicações é obrigatório');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export async function apiValidarAnexoF(dados: Partial<AnexoFCreateData>) {
  await delay(300);

  const errors: string[] = [];

  if (!dados.inventores || dados.inventores.length === 0) {
    errors.push('Pelo menos 1 inventor é obrigatório');
  }

  const totalParticipacao = dados.inventores?.reduce((acc: number, inv: any) => acc + (inv.participacao || 0), 0) || 0;
  if (Math.abs(totalParticipacao - 100) > 0.01) {
    errors.push('A soma de % participação deve ser exatamente 100%');
  }

  if (!dados.declaracaoOriginalidade) {
    errors.push('Declaração de originalidade é obrigatória');
  }
  if (!dados.declaracaoCessaoDireitos) {
    errors.push('Declaração de cessão de direitos é obrigatória');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
