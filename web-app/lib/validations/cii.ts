import { z } from 'zod';

/**
 * Zod Validation Schema for CII (Computer Implemented Invention)
 * Based on SPEC_FORMULARIO_CII.md
 */

// Palavras-chave técnicas que indicam efeito técnico válido
const TECHNICAL_KEYWORDS = [
  'processador', 'cpu', 'memória', 'ram', 'hardware', 'algoritmo',
  'otimiza', 'reduz', 'aumenta', 'melhora', 'acelera', 'diminui',
  'latência', 'throughput', 'performance', 'desempenho', 'eficiência',
  'compressão', ' criptografia', 'processamento', 'computação',
  'armazenamento', 'banco de dados', 'rede', 'protocolo', 'servidor'
];

// Validação de efeito técnico - não pode ser vago
const validateEfeitoTecnico = (value: string) => {
  const words = value.toLowerCase().split(/\s+/);
  const hasTechnicalKeyword = words.some(word =>
    TECHNICAL_KEYWORDS.some(keyword => word.includes(keyword))
  );

  if (!hasTechnicalKeyword) {
    return false;
  }

  // Verificar comprimento
  if (value.length < 200 || value.length > 2000) {
    return false;
  }

  return true;
};

// Validação de métrica quantitativa - deve ter % ou tempo
const validateMetrica = (value: string) => {
  const hasPercentage = /%\s*(?:redução|aumento|melhoria|diminuição)?/i.test(value);
  const hasTime = /\d+\s*(?:ms|milissegundos?|s|segundos?|min|minutos?|h|horas?)/i.test(value);

  return hasPercentage || hasTime;
};

export const FormularioCIISchema = z.object({
  // Metadados do Pedido
  titulo: z.string()
    .min(1, 'Título é obrigatório')
    .max(150, 'Título deve ter no máximo 150 caracteres'),

  versao: z.string().optional().refine(
    (val) => {
      if (!val) return true; // Opcional
      const semverRegex = /^\d+\.\d+\.\d+$/;
      return semverRegex.test(val);
    },
    { message: 'Versão deve seguir o padrão SemVer (ex: 1.0.0)' }
  ),

  plataforma: z.enum(['Windows', 'Linux', 'MacOS', 'Web', 'Mobile', 'Embedded'], {
    errorMap: () => ({ message: 'Plataforma é obrigatória' })
  }),

  // Efeito Técnico (CRÍTICO)
  descricaoEfeitoTecnico: z.string()
    .min(200, 'Descrição deve ter no mínimo 200 caracteres')
    .max(2000, 'Descrição deve ter no máximo 2000 caracteres')
    .refine(validateEfeitoTecnico, {
      message: 'Descrição deve conter termos técnicos específicos (ex: processador, memória, algoritmo) e explicar como o software melhora o hardware'
    }),

  metricaQuantitativa: z.string()
    .min(100, 'Métrica deve ter no mínimo 100 caracteres')
    .max(500, 'Métrica deve ter no máximo 500 caracteres')
    .refine(validateMetrica, {
      message: 'Métrica deve conter percentual (%) ou unidade de tempo (ms, s, min)'
    }),

  tipoEfeitoTecnico: z.enum(['Performance', 'Memória', 'Segurança', 'Precisão', 'Latência', 'Outro'], {
    errorMap: () => ({ message: 'Tipo de efeito técnico é obrigatório' })
  }),

  // Descrição Funcional
  funcionalidades: z.string()
    .min(200, 'Funcionalidades devem ter no mínimo 200 caracteres')
    .max(2000, 'Funcionalidades devem ter no máximo 2000 caracteres'),

  inputs: z.string()
    .min(100, 'Inputs devem ter no mínimo 100 caracteres')
    .max(1000, 'Inputs devem ter no máximo 1000 caracteres'),

  outputs: z.string()
    .min(100, 'Outputs devem ter no mínimo 100 caracteres')
    .max(1000, 'Outputs devem ter no máximo 1000 caracteres'),

  // Requisitos de Hardware
  processador: z.string()
    .max(100, 'Descrição do processador deve ter no máximo 100 caracteres'),

  memoriaRAM: z.string()
    .max(100, 'Descrição da memória deve ter no máximo 100 caracteres'),

  armazenamento: z.string()
    .max(100, 'Descrição do armazenamento deve ter no máximo 100 caracteres'),

  // Fluxograma BPMN
  descricaoFluxo: z.string()
    .min(200, 'Descrição do fluxo deve ter no mínimo 200 caracteres')
    .max(2000, 'Descrição do fluxo deve ter no máximo 2000 caracteres'),

  arquivoFluxograma: z.any().optional().refine(
    (file) => {
      if (!file) return false; // Obrigatório
      return file instanceof File && file.type === 'application/pdf';
    },
    { message: 'Fluxograma deve ser um arquivo PDF' }
  ).refine(
    (file) => {
      if (!file || !(file instanceof File)) return true;
      return file.size <= 10 * 1024 * 1024; // 10MB
    },
    { message: 'Fluxograma deve ter no máximo 10MB' }
  ),

  // Tripla Reivindicação
  resumoMetodo: z.string()
    .max(500, 'Resumo do método deve ter no máximo 500 caracteres'),

  resumoSistema: z.string()
    .max(500, 'Resumo do sistema deve ter no máximo 500 caracteres'),

  resumoMidia: z.string()
    .max(500, 'Resumo de mídia deve ter no máximo 500 caracteres'),
});

export type FormularioCIIFormData = z.infer<typeof FormularioCIISchema>;

// Função auxiliar para validar efeito técnico em tempo real
export function validateEfeitoTecnicoRealtime(value: string): {
  isValid: boolean;
  hasTechnicalTerms: boolean;
  isInRange: boolean;
  message: string;
} {
  const isInRange = value.length >= 200 && value.length <= 2000;
  const words = value.toLowerCase().split(/\s+/);
  const hasTechnicalKeyword = words.some(word =>
    TECHNICAL_KEYWORDS.some(keyword => word.includes(keyword))
  );

  const isValid = isInRange && hasTechnicalKeyword;

  let message = '';
  if (value.length === 0) {
    message = 'Campo obrigatório (200-2000 caracteres)';
  } else if (value.length < 200) {
    message = `Mínimo de 200 caracteres (atual: ${value.length})`;
  } else if (value.length > 2000) {
    message = `Máximo de 2000 caracteres (atual: ${value.length})`;
  } else if (!hasTechnicalKeyword) {
    message = 'Adicione termos técnicos (ex: processador, memória, algoritmo)';
  } else {
    message = 'Efeito técnico bem descrito';
  }

  return {
    isValid,
    hasTechnicalTerms: hasTechnicalKeyword,
    isInRange,
    message
  };
}

// Função auxiliar para validar métrica em tempo real
export function validateMetricaRealtime(value: string): {
  isValid: boolean;
  hasPercentage: boolean;
  hasTimeUnit: boolean;
  isInRange: boolean;
  message: string;
} {
  const isInRange = value.length >= 100 && value.length <= 500;
  const hasPercentage = /%/i.test(value);
  const hasTimeUnit = /\d+\s*(?:ms|s|min|h)/i.test(value);

  const isValid = isInRange && (hasPercentage || hasTimeUnit);

  let message = '';
  if (value.length === 0) {
    message = 'Campo obrigatório (100-500 caracteres)';
  } else if (value.length < 100) {
    message = `Mínimo de 100 caracteres (atual: ${value.length})`;
  } else if (value.length > 500) {
    message = `Máximo de 500 caracteres (atual: ${value.length})`;
  } else if (!hasPercentage && !hasTimeUnit) {
    message = 'Adicione percentual (%) ou unidade de tempo (ms, s, min)';
  } else {
    message = 'Métrica bem definida';
  }

  return {
    isValid,
    hasPercentage,
    hasTimeUnit,
    isInRange,
    message
  };
}
