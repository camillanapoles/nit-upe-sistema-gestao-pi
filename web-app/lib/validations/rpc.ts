import { z } from 'zod';

/**
 * Zod Validation Schema for RPC (Registro de Programa de Computador)
 * Based on SPEC_FORMULARIO_RPC.md
 */

// Validação de CPF usando algoritmo oficial brasileiro
const validateCPF = (cpf: string): boolean => {
  // Remover formatação
  const cleanCPF = cpf.replace(/\D/g, '');

  // Verificar se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;

  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanCPF)) return false;

  // Calcular dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }

  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;

  if (digit !== parseInt(cleanCPF.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }

  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;

  if (digit !== parseInt(cleanCPF.charAt(10))) return false;

  return true;
};

// Máscara de CPF
export const formatCPF = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
  if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
};

export const FormularioRPCSchema = z.object({
  // Dados do Programa
  nomePrograma: z.string()
    .min(3, 'Nome do programa deve ter no mínimo 3 caracteres')
    .max(150, 'Nome do programa deve ter no máximo 150 caracteres'),

  versao: z.string().optional().refine(
    (val) => {
      if (!val) return true; // Opcional
      const semverRegex = /^\d+\.\d+\.\d+$/;
      return semverRegex.test(val);
    },
    { message: 'Versão deve seguir o padrão SemVer (ex: 1.0.0)' }
  ),

  linguagem: z.enum([
    'Python',
    'Java',
    'C++',
    'C',
    'C#',
    'JavaScript',
    'TypeScript',
    'PHP',
    'Ruby',
    'Go',
    'Rust',
    'Swift',
    'Kotlin',
    'Outros'
  ], {
    errorMap: () => ({ message: 'Linguagem é obrigatória' })
  }),

  plataforma: z.enum(['Windows', 'Linux', 'MacOS', 'Web', 'Mobile', 'Multiplataforma'], {
    errorMap: () => ({ message: 'Plataforma é obrigatória' })
  }),

  descricaoFuncional: z.string()
    .min(200, 'Descrição deve ter no mínimo 200 caracteres')
    .max(5000, 'Descrição deve ter no máximo 5000 caracteres'),

  // Dados do Autor
  nomeAutor: z.string()
    .min(5, 'Nome do autor deve ter no mínimo 5 caracteres')
    .max(255, 'Nome do autor deve ter no máximo 255 caracteres'),

  cpfAutor: z.string()
    .refine((val) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(val), {
      message: 'CPF deve estar no formato 000.000.000-00'
    })
    .refine((val) => validateCPF(val), {
      message: 'CPF inválido'
    }),

  emailAutor: z.string()
    .email('E-mail deve ser válido')
    .min(1, 'E-mail é obrigatório'),

  tipoVinculo: z.enum([
    'Empregado',
    'Estagiário',
    'Bolsista',
    'Professor',
    'Pesquisador',
    'Outro'
  ], {
    errorMap: () => ({ message: 'Tipo de vínculo é obrigatório' })
  }),

  vinculoUPE: z.enum(['Sim', 'Não'], {
    errorMap: () => ({ message: 'Vínculo com UPE é obrigatório' })
  }),

  // Arquivos de Upload
  codigoFonte: z.any().refine(
    (file) => {
      if (!file) return false; // Obrigatório
      return file instanceof File && file.type === 'application/zip' && file.name.endsWith('.zip');
    },
    { message: 'Código-fonte deve ser um arquivo ZIP' }
  ).refine(
    (file) => {
      if (!file || !(file instanceof File)) return true;
      return file.size <= 50 * 1024 * 1024; // 50MB
    },
    { message: 'Código-fonte deve ter no máximo 50MB' }
  ),

  executavel: z.any().optional().refine(
    (file) => {
      if (!file) return true; // Opcional
      if (!(file instanceof File)) return false;
      const validExtensions = ['.exe', '.app', '.deb', '.rpm'];
      return validExtensions.some(ext => file.name.endsWith(ext));
    },
    { message: 'Executável deve ter extensão .exe, .app, .deb ou .rpm' }
  ).refine(
    (file) => {
      if (!file || !(file instanceof File)) return true;
      return file.size <= 100 * 1024 * 1024; // 100MB
    },
    { message: 'Executável deve ter no máximo 100MB' }
  ),

  manualUsuario: z.any().refine(
    (file) => {
      if (!file) return false; // Obrigatório
      return file instanceof File && file.type === 'application/pdf';
    },
    { message: 'Manual deve ser um arquivo PDF' }
  ).refine(
    (file) => {
      if (!file || !(file instanceof File)) return true;
      return file.size <= 10 * 1024 * 1024; // 10MB
    },
    { message: 'Manual deve ter no máximo 10MB' }
  ),
});

export type FormularioRPCFormData = z.infer<typeof FormularioRPCSchema>;

// Função auxiliar para validar CPF em tempo real
export function validateCPFRealtime(value: string): {
  isValid: boolean;
  isFormatted: boolean;
  message: string;
} {
  const isFormatted = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value);

  if (!isFormatted) {
    return {
      isValid: false,
      isFormatted: false,
      message: 'Formato deve ser 000.000.000-00'
    };
  }

  const isValid = validateCPF(value);

  return {
    isValid,
    isFormatted: true,
    message: isValid ? 'CPF válido' : 'CPF inválido'
  };
}

// Função auxiliar para validar tamanho de arquivos
export function validateFileSize(
  file: File | null,
  maxSizeMB: number,
  fieldName: string
): {
  isValid: boolean;
  message: string;
  sizeMB: number;
} {
  if (!file) {
    return {
      isValid: false,
      message: `${fieldName} é obrigatório`,
      sizeMB: 0
    };
  }

  const sizeMB = file.size / (1024 * 1024);
  const isValid = sizeMB <= maxSizeMB;

  return {
    isValid,
    message: isValid
      ? `${fieldName} (${sizeMB.toFixed(2)} MB)`
      : `${fieldName} deve ter no máximo ${maxSizeMB} MB (atual: ${sizeMB.toFixed(2)} MB)`,
    sizeMB
  };
}
