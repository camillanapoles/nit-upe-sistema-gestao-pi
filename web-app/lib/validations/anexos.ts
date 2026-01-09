// ============================================================================
// VALIDATION SCHEMAS FOR ANEXOS (Zod)
// ============================================================================

import { z } from 'zod';

// ============================================================================
// ANEXO A - BUSCA DE ANTERIORIDADE (19 campos)
// ============================================================================

export const BaseConsultadaSchema = z.object({
  consultada: z.boolean(),
  data: z.string().optional(),
  url: z.string().url().optional(),
});

export const DocumentoRelevanteSchema = z.object({
  id: z.string(),
  numero: z.string().min(1, 'Número é obrigatório'),
  titulo: z.string().min(10, 'Título deve ter no mínimo 10 caracteres').max(300),
  resumo: z.string().min(100, 'Resumo deve ter no mínimo 100 caracteres').max(2000),
  relevancia: z.enum(['Alta', 'Média', 'Baixa']),
  similaridades: z.string().min(50, 'Similaridades deve ter no mínimo 50 caracteres').max(2000),
  diferencas: z.string().min(50, 'Diferenças deve ter no mínimo 50 caracteres').max(2000),
  url: z.string().url('URL inválida'),
  dataPublicacao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
});

export const AnexoASchema = z.object({
  // Cabeçalho (2 campos)
  dataBusca: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  responsavel: z.string().min(5, 'Responsável deve ter no mínimo 5 caracteres'),

  // Termos de busca (3 campos)
  termoBusca1: z.string().min(3, 'Termo deve ter no mínimo 3 caracteres'),
  termoBusca2: z.string().min(3, 'Termo deve ter no mínimo 3 caracteres'),
  termoBusca3: z.string().min(3, 'Termo deve ter no mínimo 3 caracteres'),

  // Bases consultadas (3 bases x 3 campos = 9 campos)
  baseInpi: BaseConsultadaSchema,
  baseEspacenet: BaseConsultadaSchema,
  baseGooglePatents: BaseConsultadaSchema,

  // Top 3 Documentos Relevantes (3 x 8 campos = 24)
  documentosRelevantes: z
    .array(DocumentoRelevanteSchema)
    .min(1, 'Pelo menos 1 documento relevante é obrigatório')
    .max(3, 'Máximo de 3 documentos relevantes'),

  // Conclusão (2 campos)
  éNova: z.boolean(),
  justificativaNovidade: z
    .string()
    .min(200, 'Justificativa deve ter no mínimo 200 caracteres')
    .max(2000, 'Justificativa deve ter no máximo 2000 caracteres'),
})
  .refine((data) => data.documentosRelevantes.some((d) => d.relevancia === 'Alta'), {
    message: 'Pelo menos 1 documento deve ter relevância Alta',
    path: ['documentosRelevantes'],
  })
  .refine((data) => {
    const dataBusca = new Date(data.dataBusca);
    const hoje = new Date();
    return dataBusca <= hoje;
  }, 'Data da busca deve ser menor ou igual a hoje');

export type AnexoAInput = z.infer<typeof AnexoASchema>;

// ============================================================================
// ANEXO B - MATRIZ PROBLEMA X SOLUÇÃO (20 campos)
// ============================================================================

export const SolucaoExistenteSchema = z.object({
  id: z.string(),
  nome: z.string().min(5, 'Nome deve ter no mínimo 5 caracteres').max(100),
  descricao: z.string().min(100, 'Descrição deve ter no mínimo 100 caracteres').max(2000),
  quemUsa: z.string().min(20, 'Quem usa deve ter no mínimo 20 caracteres').max(500),
  comoFunciona: z.string().min(100, 'Como funciona deve ter no mínimo 100 caracteres').max(2000),
  limitacoes: z.string().min(50, 'Limitações é OBRIGATÓRIO (mínimo 50 caracteres)').max(2000),
});

export const VantagemComparativaSchema = z.object({
  metrica: z.string().min(1, 'Métrica é obrigatória'),
  valorSolucaoA: z.coerce.number().min(0, 'Valor deve ser positivo'),
  valorSuaInvencao: z.coerce.number().min(0, 'Valor deve ser positivo'),
  unidade: z.string().min(1, 'Unidade é obrigatória'),
  porcentagemMelhoria: z.number().readonly(), // Calculado automaticamente
});

export const AnexoBSchema = z.object({
  // Problema identificado (4 campos)
  problemaTitulo: z.string().min(5, 'Título deve ter no mínimo 5 caracteres').max(100),
  problemaDescricao: z
    .string()
    .min(300, 'Descrição deve ter no mínimo 300 caracteres')
    .max(5000),
  problemaQuemSofre: z.string().min(20, 'Quem sofre deve ter no mínimo 20 caracteres').max(500),
  problemaComoSeManifesta: z
    .string()
    .min(50, 'Como se manifesta deve ter no mínimo 50 caracteres')
    .max(1000),

  // 3 Soluções Existentes (3 x 5 campos = 15)
  solucoesExistentes: z
    .array(SolucaoExistenteSchema)
    .min(2, 'Pelo menos 2 soluções existentes são obrigatórias')
    .max(3, 'Máximo de 3 soluções existentes'),

  // Solução Proposta (5 campos)
  solucaoPropostaTitulo: z.string().min(5, 'Título deve ter no mínimo 5 caracteres').max(100),
  solucaoPropostaDescricao: z
    .string()
    .min(300, 'Descrição deve ter no mínimo 300 caracteres')
    .max(5000),
  solucaoPropostaComoFunciona: z
    .string()
    .min(100, 'Como funciona deve ter no mínimo 100 caracteres')
    .max(2000),
  solucaoPropostaInovacao: z
    .string()
    .min(100, 'Inovação deve ter no mínimo 100 caracteres')
    .max(2000),
  solucaoPropostaDiferencial: z
    .string()
    .min(100, 'Diferencial deve ter no mínimo 100 caracteres')
    .max(2000),

  // 4 Vantagens Comparativas
  vantagensComparativas: z.array(VantagemComparativaSchema).length(4),
});

export type AnexoBInput = z.infer<typeof AnexoBSchema>;

// ============================================================================
// ANEXO C - MEMORIAL DESCRITIVO (18 campos)
// ============================================================================

export const FiguraSchema = z.object({
  id: z.string(),
  numero: z.number().int().positive(),
  descricao: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres').max(200),
  arquivo: z.any().optional(), // File object
  arquivoUrl: z.string().optional(),
  referenciasNumericas: z
    .string()
    .min(10, 'Referências numéricas deve ter no mínimo 10 caracteres'),
});

export const ReivindicacaoSchema = z.object({
  id: z.string(),
  numero: z.number().int().positive(),
  texto: z.string().min(100, 'Texto deve ter no mínimo 100 caracteres'),
});

export const AnexoCSchema = z.object({
  // Cabeçalho (3 campos)
  titulo: z.string().min(10, 'Título deve ter no mínimo 10 caracteres').max(150),
  campoInvencao: z.string().min(10, 'Campo deve ter no mínimo 10 caracteres').max(500),
  estadoTecnica: z.string().min(500, 'Estado da técnica deve ter no mínimo 500 caracteres').max(5000),

  // Sumário (3 campos)
  objetivos: z.string().min(100, 'Objetivos deve ter no mínimo 100 caracteres').max(2000),
  caracteristicas: z
    .string()
    .min(200, 'Características deve ter no mínimo 200 caracteres')
    .max(3000),
  vantagens: z.string().min(100, 'Vantagens deve ter no mínimo 100 caracteres').max(2000),

  // Descrição Detalhada (4 campos)
  componentes: z.string().min(200, 'Componentes deve ter no mínimo 200 caracteres').max(3000),
  funcionamento: z.string().min(300, 'Funcionamento deve ter no mínimo 300 caracteres').max(4000),
  modoRealizacao: z
    .string()
    .min(200, 'Modo de realização deve ter no mínimo 200 caracteres')
    .max(3000),
  parametros: z.string().min(100, 'Parâmetros deve ter no mínimo 100 caracteres').max(2000),

  // Desenhos/Figuras
  figuras: z.array(FiguraSchema).min(0).max(20),

  // Reivindicações (mínimo 3, máximo 10)
  reivindicacoes: z
    .array(ReivindicacaoSchema)
    .min(3, 'Mínimo de 3 reivindicações é obrigatório')
    .max(10, 'Máximo de 10 reivindicações'),
})
  .refine((data) => {
    // Validar formato da primeira reivindicação (independente)
    const primeira = data.reivindicacoes[0];
    if (!primeira) return false;
    const regex = /^1\.\s+Um\s+/i;
    return regex.test(primeira.texto);
  }, 'A primeira reivindicação deve ser independente e começar com "1. Um" ou "1. Uma"')
  .refine((data) => {
    // Validar formato das reivindicações dependentes (2+)
    for (let i = 1; i < data.reivindicacoes.length; i++) {
      const reiv = data.reivindicacoes[i];
      const regex = new RegExp(
        `^${reiv.numero}\\.\\s+.*\\s+de\\s+acordo\\s+com\\s+a\\s+reivindica[çc][ãa]o\\s+\\d+`,
        'i'
      );
      if (!regex.test(reiv.texto)) {
        return false;
      }
    }
    return true;
  }, 'Reivindicações 2+ devem ser dependentes e seguir o formato "N. O ... de acordo com a reivindicação X..."');

export type AnexoCInput = z.infer<typeof AnexoCSchema>;

// ============================================================================
// ANEXO F - QUALIFICAÇÃO DE INVENTORES (20 campos x N inventores)
// ============================================================================

export const InventorSchema = z.object({
  id: z.string(),
  nome: z.string().min(5, 'Nome deve ter no mínimo 5 caracteres'),
  cpf: z.string().refine((cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpfLimpo)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfLimpo[i]) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== parseInt(cpfLimpo[9])) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfLimpo[i]) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== parseInt(cpfLimpo[10])) return false;

    return true;
  }, 'CPF inválido'),

  rg: z.string().min(1, 'RG é obrigatório'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone é obrigatório'),
  departamento: z.string().min(3, 'Departamento é obrigatório'),
  cargo: z.string().min(3, 'Cargo é obrigatório'),
  participacao: z.number().min(0).max(100),
  justificativa: z.string().min(50, 'Justificativa deve ter no mínimo 50 caracteres'),
});

export const SisGenSchema = z.object({
  usaBiodiversidade: z.boolean(),
  numeroSisgen: z.string().optional(),
  especie: z.string().optional(),
  origem: z.string().optional(),
});

export const FinanciamentoSchema = z.object({
  financiamentoExterno: z.boolean(),
  agencia: z.string().optional(),
  numeroProcesso: z.string().optional(),
  valor: z.string().optional(),
});

export const AnexoFSchema = z.object({
  // Inventores
  inventores: z
    .array(InventorSchema)
    .min(1, 'Pelo menos 1 inventor é obrigatório')
    .refine((invs) => {
      const soma = invs.reduce((acc, inv) => acc + inv.participacao, 0);
      return Math.abs(soma - 100) < 0.01;
    }, 'A soma de % participação deve ser exatamente 100%'),

  // SisGen (4 campos condicionais)
  sisgen: SisGenSchema.refine(
    (data) => !data.usaBiodiversidade || (data.numeroSisgen && data.especie && data.origem),
    'Se usa biodiversidade, campos SisGen são obrigatórios'
  ),

  // Financiamento (4 campos condicionais)
  financiamento: FinanciamentoSchema.refine(
    (data) =>
      !data.financiamentoExterno ||
      (data.agencia && data.numeroProcesso && data.valor),
    'Se há financiamento externo, campos são obrigatórios'
  ),

  // Declarações (3 campos)
  declaracaoOriginalidade: z.boolean().refine((v) => v === true, {
    message: 'Declaração de originalidade é obrigatória',
  }),
  declaracaoCessaoDireitos: z.boolean().refine((v) => v === true, {
    message: 'Declaração de cessão de direitos é obrigatória',
  }),
  assinaturaDigital: z.any().optional(), // File object (certificado digital)
});

export type AnexoFInput = z.infer<typeof AnexoFSchema>;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function calcularPorcentagemMelhoria(valorA: number, valorB: number): number {
  if (valorA === 0) return 0;
  return ((valorA - valorB) / valorA) * 100;
}
