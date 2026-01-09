// Schemas de Validação Zod para o Sistema de Gestão de Propriedade Intelectual UPE

import { z } from 'zod';

// ============================================
// Enums (para uso nos schemas e frontend)
// ============================================

export const TipoPatenteEnum = z.enum(['PI', 'MU', 'CII', 'RPC'], {
  errorMap: () => ({ message: 'Tipo deve ser PI, MU, CII ou RPC' }),
});

export const StatusPedidoEnum = z.enum(
  ['RASCUNHO', 'SUBMETIDO', 'EM_ANALISE', 'APROVADO', 'COM_RESSALVAS', 'REPROVADO', 'DEPOSITADO'],
  {
    errorMap: () => ({ message: 'Status inválido' }),
  }
);

export const FaseAtualEnum = z.enum(['PREPARACAO', 'SUBMISSAO', 'ANALISE', 'FORMALIZACAO', 'ROBUSTEZ'], {
  errorMap: () => ({ message: 'Fase inválida' }),
});

export const RoleEnum = z.enum(['INVENTOR', 'AVALIADOR', 'ADMIN'], {
  errorMap: () => ({ message: 'Role deve ser INVENTOR, AVALIADOR ou ADMIN' }),
});

// ============================================
// API Response Format
// ============================================

export const ApiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    fields: z.record(z.string()).optional(),
  }),
});

export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;

export const ApiSuccessResponseSchema = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    success: z.literal(true),
    data,
  });

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

// ============================================
// Pedido de Patente
// ============================================

// Limites de caracteres conforme especificações
const LIMITES = {
  TITULO_MAX: 150,
  PROBLEMA_MIN: 100,
  PROBLEMA_MAX: 1000,
  SOLUCAO_MIN: 500,
  SOLUCAO_MAX: 4000,
  ESTADO_TECNICA_MIN: 200,
  ESTADO_TECNICA_MAX: 2000,
  VANTAGENS_MIN: 100,
  VANTAGENS_MAX: 1500,
  PALAVRAS_CHAVE_MIN: 50,
  PALAVRAS_CHAVE_MAX: 200,
  RESUMO_MIN: 50,
  RESUMO_MAX: 2000,
};

export const CriarPedidoSchema = z.object({
  tipo: TipoPatenteEnum,
  titulo: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(LIMITES.TITULO_MAX, `Título deve ter no máximo ${LIMITES.TITULO_MAX} caracteres`),
  problema: z
    .string()
    .min(LIMITES.PROBLEMA_MIN, `Problema deve ter no mínimo ${LIMITES.PROBLEMA_MIN} caracteres`)
    .max(LIMITES.PROBLEMA_MAX, `Problema deve ter no máximo ${LIMITES.PROBLEMA_MAX} caracteres`),
  solucao: z
    .string()
    .min(LIMITES.SOLUCAO_MIN, `Solução deve ter no mínimo ${LIMITES.SOLUCAO_MIN} caracteres`)
    .max(LIMITES.SOLUCAO_MAX, `Solução deve ter no máximo ${LIMITES.SOLUCAO_MAX} caracteres`),
  estadoTecnica: z
    .string()
    .min(LIMITES.ESTADO_TECNICA_MIN, `Estado da técnica deve ter no mínimo ${LIMITES.ESTADO_TECNICA_MIN} caracteres`)
    .max(LIMITES.ESTADO_TECNICA_MAX, `Estado da técnica deve ter no máximo ${LIMITES.ESTADO_TECNICA_MAX} caracteres`),
  vantagens: z
    .string()
    .min(LIMITES.VANTAGENS_MIN, `Vantagens deve ter no mínimo ${LIMITES.VANTAGENS_MIN} caracteres`)
    .max(LIMITES.VANTAGENS_MAX, `Vantagens deve ter no máximo ${LIMITES.VANTAGENS_MAX} caracteres`),
  palavrasChave: z
    .string()
    .min(LIMITES.PALAVRAS_CHAVE_MIN, `Palavras-chave deve ter no mínimo ${LIMITES.PALAVRAS_CHAVE_MIN} caracteres`)
    .max(LIMITES.PALAVRAS_CHAVE_MAX, `Palavras-chave deve ter no máximo ${LIMITES.PALAVRAS_CHAVE_MAX} caracteres`),
  resumo: z
    .string()
    .min(LIMITES.RESUMO_MIN, `Resumo deve ter no mínimo ${LIMITES.RESUMO_MIN} caracteres`)
    .max(LIMITES.RESUMO_MAX, `Resumo deve ter no máximo ${LIMITES.RESUMO_MAX} caracteres`)
    .optional(),
});

export type CriarPedidoInput = z.infer<typeof CriarPedidoSchema>;

export const AtualizarPedidoSchema = CriarPedidoSchema.partial().extend({
  status: StatusPedidoEnum.optional(),
  faseAtual: FaseAtualEnum.optional(),
});

export type AtualizarPedidoInput = z.infer<typeof AtualizarPedidoSchema>;

// ============================================
// Autenticação
// ============================================

export const RegisterSchema = z
  .object({
    email: z.string().email('Email inválido'),
    nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(200),
    senha: z
      .string()
      .min(8, 'Senha deve ter no mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
      .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
      .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
    confirmarSenha: z.string(),
    cpf: z.string().optional(),
    telefone: z.string().optional(),
    departamento: z.string().optional(),
    role: RoleEnum.optional(),
  })
  .refine(data => data.senha === data.confirmarSenha, {
    message: 'Senhas não conferem',
    path: ['confirmarSenha'],
  });

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

// ============================================
// Query Parameters
// ============================================

export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type PaginationInput = z.infer<typeof PaginationSchema>;

export const PedidoQuerySchema = PaginationSchema.extend({
  status: StatusPedidoEnum.optional(),
  tipo: TipoPatenteEnum.optional(),
  inventorId: z.string().uuid().optional(),
  search: z.string().optional(),
});

export type PedidoQueryInput = z.infer<typeof PedidoQuerySchema>;

// ============================================
// Helpers de Validação
// ============================================

/**
 * Valida dados de entrada e retorna erro formatado ou dados tipados
 */
export async function validateRequest<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): Promise<{ success: true; data: z.infer<T> } | ApiErrorResponse> {
  const result = await schema.safeParseAsync(data);

  if (!result.success) {
    const fields: Record<string, string> = {};
    result.error.errors.forEach(err => {
      const path = err.path.join('.');
      fields[path] = err.message;
    });

    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Dados de entrada inválidos',
        fields,
      },
    };
  }

  return { success: true, data: result.data };
}

/**
 * Cria uma resposta de erro padrão
 */
export function errorResponse(code: string, message: string, fields?: Record<string, string>): ApiErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      fields,
    },
  };
}

/**
 * Cria uma resposta de sucesso padrão
 */
export function successResponse<T>(data: T): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
  };
}

// ============================================
// RAG (Red/Amber/Green) Status Helpers
// ============================================

/**
 * Get RAG status for character count validation
 * Green: Within recommended range
 * Amber: Within limits but outside recommended
 * Red: Outside acceptable limits
 */
export function getRAGStatusForField(
  fieldName: keyof Pick<typeof LIMITES, 'TITULO_MAX' | 'PROBLEMA_MIN' | 'PROBLEMA_MAX' | 'SOLUCAO_MIN' | 'SOLUCAO_MAX' | 'ESTADO_TECNICA_MIN' | 'ESTADO_TECNICA_MAX' | 'VANTAGENS_MIN' | 'VANTAGENS_MAX' | 'PALAVRAS_CHAVE_MIN' | 'PALAVRAS_CHAVE_MAX'>,
  currentCount: number
): 'green' | 'amber' | 'red' {
  const recommendedRanges: Record<string, { min: number; max: number }> = {
    titulo: { min: 50, max: 120 },
    problema: { min: 400, max: 600 },
    solucao: { min: 1500, max: 2500 },
    estadoTecnica: { min: 800, max: 1200 },
    vantagens: { min: 400, max: 800 },
    palavrasChave: { min: 70, max: 90 },
  };

  const limits: Record<string, { min: number; max: number }> = {
    titulo: { min: 1, max: LIMITES.TITULO_MAX },
    problema: { min: LIMITES.PROBLEMA_MIN, max: LIMITES.PROBLEMA_MAX },
    solucao: { min: LIMITES.SOLUCAO_MIN, max: LIMITES.SOLUCAO_MAX },
    estadoTecnica: { min: LIMITES.ESTADO_TECNICA_MIN, max: LIMITES.ESTADO_TECNICA_MAX },
    vantagens: { min: LIMITES.VANTAGENS_MIN, max: LIMITES.VANTAGENS_MAX },
    palavrasChave: { min: LIMITES.PALAVRAS_CHAVE_MIN, max: LIMITES.PALAVRAS_CHAVE_MAX },
  };

  const limit = limits[fieldName];
  if (!limit) return 'amber';

  // Check if outside limits (red)
  if (currentCount < limit.min || currentCount > limit.max) {
    return 'red';
  }

  // Check if within recommended range (green)
  const recommended = recommendedRanges[fieldName];
  if (recommended && currentCount >= recommended.min && currentCount <= recommended.max) {
    return 'green';
  }

  // Otherwise amber (within limits but not recommended)
  return 'amber';
}

/**
 * Get validation message for a field based on current count
 */
export function getFieldValidationMessage(
  fieldName: string,
  currentCount: number,
  isWordCount: boolean = false
): string {
  const limits: Record<string, { min: number; max: number }> = {
    titulo: { min: 1, max: LIMITES.TITULO_MAX },
    problema: { min: LIMITES.PROBLEMA_MIN, max: LIMITES.PROBLEMA_MAX },
    solucao: { min: LIMITES.SOLUCAO_MIN, max: LIMITES.SOLUCAO_MAX },
    estadoTecnica: { min: LIMITES.ESTADO_TECNICA_MIN, max: LIMITES.ESTADO_TECNICA_MAX },
    vantagens: { min: LIMITES.VANTAGENS_MIN, max: LIMITES.VANTAGENS_MAX },
    palavrasChave: { min: LIMITES.PALAVRAS_CHAVE_MIN, max: LIMITES.PALAVRAS_CHAVE_MAX },
  };

  const limit = limits[fieldName];
  if (!limit) return `${currentCount} ${isWordCount ? 'palavras' : 'caracteres'}`;

  const unit = isWordCount ? 'palavras' : 'caracteres';

  if (currentCount === 0) {
    return `Campo obrigatório (${limit.min}-${limit.max} ${unit})`;
  }
  if (currentCount < limit.min) {
    return `Mínimo de ${limit.min} ${unit} (atual: ${currentCount})`;
  }
  if (currentCount > limit.max) {
    return `Máximo de ${limit.max} ${unit} (atual: ${currentCount})`;
  }

  return `Dentro dos limites (${currentCount} ${unit})`;
}

/**
 * Count words in a string
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

// ============================================
// Gotcha Warnings for Common Mistakes
// ============================================

export const GOTCHA_WARNINGS = {
  biotecnologia: [
    { pattern: /temperatura\s+ambiente/i, message: 'Use faixas numéricas específicas (ex: 20°C a 25°C)' },
    { pattern: /otimizado|otimiza/gi, message: 'Substitua por métricas específicas' },
    { pattern: /rápido|lento/gi, message: 'Quantifique a velocidade (ex: redução de X%)' },
  ],
  software: [
    { pattern: /print\s+de\s+tela|screenshot/gi, message: 'Use fluxogramas em blocos' },
    { pattern: /código\s+fonte|código/gi, message: 'Use descrição funcional em vez de código' },
    { pattern: /software/gi, message: 'Verifique se sua invenção deve ser CII (Carta de Invenção de Informática)' },
  ],
  produto: [
    { pattern: /fotografia|foto/gi, message: 'Use desenhos técnicos P&B' },
    { pattern: /cores?|colorido/gi, message: 'Use P&B com hachuras para indicar diferentes materiais' },
  ],
};

/**
 * Get relevant gotcha warnings for a given text
 */
export function getGotchaWarnings(
  text: string,
  type: keyof typeof GOTCHA_WARNINGS = 'biotecnologia'
): string[] {
  const warnings: string[] = [];
  const gotchas = GOTCHA_WARNINGS[type] || [];

  for (const gotcha of gotchas) {
    if (gotcha.pattern.test(text)) {
      warnings.push(gotcha.message);
    }
  }

  return warnings;
}
