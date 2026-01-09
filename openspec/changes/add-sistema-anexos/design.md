# Design Document - Sistema de Anexos (A/B/C/F)

## Overview

Sistema completo de anexos obrigatórios para patenteamento INPI: Busca de Anterioridade (A), Matriz Problema x Solução (B), Memorial Descritivo (C), Qualificação de Inventores (F).

## Arquitetura

### Estrutura de Componentes

```
web-app/
├── app/
│   ├── anexos/
│   │   ├── page.tsx              # Dashboard de anexos
│   │   ├── a/
│   │   │   └── page.tsx          # Anexo A
│   │   ├── b/
│   │   │   └── page.tsx          # Anexo B
│   │   ├── c/
│   │   │   └── page.tsx          # Anexo C
│   │   └── f/
│   │       └── page.tsx          # Anexo F
├── components/
│   ├── anexos/
│   │   ├── AnexoA.tsx
│   │   ├── AnexoB.tsx
│   │   ├── AnexoC.tsx
│   │   ├── AnexoF.tsx
│   │   └── shared/
│   │       ├── InventorCard.tsx           # Anexo F (reutilizável)
│   │       ├── SolucaoExistenteCard.tsx   # Anexo B (reutilizável)
│   │       ├── DocumentoRelevanteCard.tsx # Anexo A (reutilizável)
│   │       ├── ReivindicacaoInput.tsx     # Anexo C (reutilizável)
│   │       └── FiguraInput.tsx            # Anexo C (reutilizável)
└── lib/
    ├── validations/
    │   └── anexos.ts           # Schemas Zod
    └── mock-api-anexos.ts      # Endpoints mock
```

## Estrutura de Dados

### Modelagem de Dados

**Anexo A - Busca Anterioridade**:
```typescript
interface AnexoAData {
  cabecalho: {
    dataBusca: Date;
    responsavel: string;
  };
  termosBusca: string[3];  // Termo 1, 2, 3
  basesConsultadas: {
    inpi: { habilitado: boolean; data: Date; url: string };
    espacenet: { habilitado: boolean; data: Date; url: string };
    googlePatents: { habilitado: boolean; data: Date; url: string };
  };
  documentosRelevantes: Array<{
    titulo: string;
    numero: string;
    dataPublicacao: Date;
    inventor: string;
    titular: string;
    resumo: string;
    lacuna: string;
    relevancia: 'Alta' | 'Média' | 'Baixa';
    justificativa: string;
  }>;  // Máx 3 documentos
  conclusao: {
    eNova: boolean;
    justificativa: string;
  };
}
```

**Anexo B - Matriz Problema x Solução**:
```typescript
interface AnexoBData {
  problema: {
    titulo: string;
    descricao: string;
    quemSofre: string;
    comoSeManifesta: string;
  };
  solucoesExistentes: Array<{
    nome: string;
    descricao: string;
    vantagens: string;
    limitacoes: string;  // OBRIGATÓRIO
    referencias: string;
  }>;  // 3 soluções (A, B, C)
  solucaoProposta: {
    titulo: string;
    descricao: string;
    comoFunciona: string;
    diferencial: string;
  };
  vantagensComparativas: Array<{
    metrica: string;
    valorSolucaoA: number;
    valorSuaInvencao: number;
    porcentagemMelhoria: number;  // Calculado
    justificativa: string;
  }>;  // 4 métricas
}
```

**Anexo C - Memorial Descritivo**:
```typescript
interface AnexoCData {
  cabecalho: {
    titulo: string;
    campoInvencao: string;
    estadoTecnica: string;
  };
  sumario: {
    objetivos: string;
    caracteristicas: string;
    vantagens: string;
  };
  descricaoDetalhada: {
    componentes: string;
    funcionamento: string;
    modoRealizacao: string;
    parametros: string;
  };
  desenhos: Array<{
    numero: string;        // Fig. 1, Fig. 2...
    descricao: string;
    arquivo: File | null;
    referencias: string;   // 1: Bloco, 2: Dispositivo
  }>;
  reivindicacoes: Array<{
    numero: number;        // 1, 2, 3...
    texto: string;
    tipo: 'independente' | 'dependente';
  }>;  // Mínimo 3, máximo 10
}
```

**Anexo F - Qualificação de Inventores**:
```typescript
interface AnexoFData {
  inventores: Array<{
    nome: string;
    cpf: string;
    rg: string;
    email: string;
    telefone: string;
    departamento: string;
    cargo: string;
    participacao: number;  // 0-100
    justificativa: string;
  }>;  // N inventores
  sisgen: {
    usaBiodiversidade: boolean;
    numeroSisgen?: string;       // Condicional
    especie?: string;            // Condicional
    origemMaterial?: string;     // Condicional
  };
  financiamento: {
    financiamentoExterno: boolean;
    agencia?: string;            // Condicional
    numeroProcesso?: string;     // Condicional
    valorFinanciado?: number;    // Condicional
  };
  declaracoes: {
    originalidade: boolean;
    cessaoDireitos: boolean;
    assinaturaDigital?: File;    // Upload ou assinatura eletrônica
  };
}
```

## Componentes Reutilizáveis

### 1. InventorCard (Anexo F)

**Props**:
```typescript
interface InventorCardProps {
  inventor: AnexoFData['inventores'][0];
  onUpdate: (inventor: AnexoFData['inventores'][0]) => void;
  onRemove: () => void;
  canRemove: boolean;  // Pelo menos 1 inventor obrigatório
  totalParticipacao: number;  // Para validação em tempo real
}
```

**Funcionalidades**:
- Edição inline dos 9 campos
- Validação de CPF em tempo real
- Feedback visual se soma > 100%
- Botão remover (desabilitado se apenas 1 inventor)

### 2. SolucaoExistenteCard (Anexo B)

**Props**:
```typescript
interface SolucaoExistenteCardProps {
  solucao: AnexoBData['solucoesExistentes'][0];
  index: number;  // A, B, C
  onUpdate: (solucao: AnexoBData['solucoesExistentes'][0]) => void;
  onRemove: () => void;
  canRemove: boolean;  // Mínimo 2 soluções obrigatórias
}
```

**Funcionalidades**:
- Campos collapse/expand
- Validação de limitações OBRIGATÓRIO
- Indicador visual de preenchimento

### 3. DocumentoRelevanteCard (Anexo A)

**Props**:
```typescript
interface DocumentoRelevanteCardProps {
  documento: AnexoAData['documentosRelevantes'][0];
  index: number;  // 1, 2, 3
  onUpdate: (documento: AnexoAData['documentosRelevantes'][0]) => void;
}
```

**Funcionalidades**:
- Upload automático de metadados (se URL fornecida)
- Indicador de relevância (Alta/Média/Baixa)
- Validação de campos obrigatórios

### 4. ReivindicacaoInput (Anexo C)

**Props**:
```typescript
interface ReivindicacaoInputProps {
  reivindicacao: AnexoCData['reivindicacoes'][0];
  index: number;
  onUpdate: (reivindicacao: AnexoCData['reivindicacoes'][0]) => void;
  onRemove: () => void;
  canRemove: boolean;  // Mínimo 3 obrigatórias
  reivindicacaoAnterior?: string;  // Para dependentes
}
```

**Funcionalidades**:
- Validação de formato ("1. Um...", "2. O ... de acordo com...")
- Sugestão automática para reivindicações dependentes
- Contador de caracteres
- Indicador de tipo (independente/dependente)

### 5. FiguraInput (Anexo C)

**Props**:
```typescript
interface FiguraInputProps {
  figura: AnexoCData['desenhos'][0];
  index: number;
  onUpdate: (figura: AnexoCData['desenhos'][0]) => void;
  onRemove: () => void;
}
```

**Funcionalidades**:
- Preview da imagem
- Validação de formato (PDF/TIFF)
- Upload drag-and-drop
- Geração automática do número (Fig. 1, Fig. 2...)

## Validações

### Zod Schemas

**Anexo A**:
```typescript
const AnexoASchema = z.object({
  cabecalho: z.object({
    dataBusca: z.date().max(new Date(), 'Data deve ser <= hoje'),
    responsavel: z.string().min(5),
  }),
  termosBusca: z.tuple([z.string().min(3), z.string().min(3), z.string().min(3)]),
  basesConsultadas: z.object({
    inpi: z.object({
      habilitado: z.boolean(),
      data: z.date().optional(),
      url: z.string().url().optional(),
    }).refine(val => !val.habilitado || (val.data && val.url), 'Se habilitado, data e URL são obrigatórias'),
    // ... mesma lógica para espacenet e googlePatents
  }),
  documentosRelevantes: z.array(z.object({
    titulo: z.string().max(255),
    numero: z.string(),
    dataPublicacao: z.date(),
    inventor: z.string().max(500),
    titular: z.string().max(255),
    resumo: z.string().min(200).max(2000),
    lacuna: z.string().min(200).max(2000),
    relevancia: z.enum(['Alta', 'Média', 'Baixa']),
    justificativa: z.string().max(500),
  })).min(1).max(3),
  conclusao: z.object({
    eNova: z.boolean(),
    justificativa: z.string().min(200).max(2000),
  }),
}).refine(data => {
  // Pelo menos 1 documento deve ser "Alta" relevância
  return data.documentosRelevantes.some(doc => doc.relevancia === 'Alta');
}, 'Pelo menos 1 documento deve ter relevância Alta');
```

**Anexo B**:
```typescript
const AnexoBSchema = z.object({
  // ... outros campos
  vantagensComparativas: z.array(z.object({
    metrica: z.string(),
    valorSolucaoA: z.number(),
    valorSuaInvencao: z.number(),
    porcentagemMelhoria: z.number(),  // Calculado
    justificativa: z.string().max(500),
  })).min(4),  // 4 métricas obrigatórias
}).transform(data => {
  // Calcular automaticamente % melhoria
  data.vantagensComparativas.forEach(m => {
    m.porcentagemMelhoria = ((m.valorSolucaoA - m.valorSuaInvencao) / m.valorSolucaoA) * 100;
  });
  return data;
});
```

**Anexo C**:
```typescript
const AnexoCSchema = z.object({
  // ... outros campos
  reivindicacoes: z.array(z.object({
    numero: z.number().int().positive(),
    texto: z.string().min(100).max(5000),
    tipo: z.enum(['independente', 'dependente']),
  })).min(3).max(10).refine(reqs => {
    // Validar formato
    return reqs.every(req => {
      const pattern = req.tipo === 'independente'
        ? /^\d+\.\s+Um\s+/
        : /^\d+\.\s+O\s+.*\s+de\s+acordo\s+com\s+a\s+reivindicação\s+\d+/i;
      return pattern.test(req.texto);
    });
  }, 'Formato de reivindicação inválido'),
});
```

**Anexo F**:
```typescript
const AnexoFSchema = z.object({
  inventores: z.array(z.object({
    nome: z.string().min(5).max(255),
    cpf: z.string().refine(validarCPF, 'CPF inválido'),
    // ... outros campos
    participacao: z.number().min(0).max(100),
  })).min(1).refine(invs => {
    // Soma deve ser 100%
    const soma = invs.reduce((acc, inv) => acc + inv.participacao, 0);
    return Math.abs(soma - 100) < 0.01;  // Margem de erro para float
  }, 'A soma das participações deve ser 100%'),
  sisgen: z.object({
    usaBiodiversidade: z.boolean(),
    numeroSisgen: z.string().uuid().optional(),
    // ... campos condicionais
  }).refine(data => {
    if (data.usaBiodiversidade) {
      return !!(data.numeroSisgen && data.especie && data.origemMaterial);
    }
    return true;
  }, 'Se usa biodiversidade, campos SisGen são obrigatórios'),
  // ... financiamento com mesma lógica
  declaracoes: z.object({
    originalidade: z.boolean().refine(v => v === true, 'Declarar originalidade é obrigatório'),
    cessaoDireitos: z.boolean().refine(v => v === true, 'Declarar cessão é obrigatório'),
    assinaturaDigital: z.any().optional(),
  }),
});
```

## Validações Especiais

### 1. Cálculo de % Melhoria (Anexo B)

**Implementação React**:
```typescript
useEffect(() => {
  const vantagens = [...formData.vantagensComparativas];
  vantagens.forEach((v, index) => {
    if (v.valorSolucaoA && v.valorSuaInvencao) {
      v.porcentagemMelhoria = ((v.valorSolucaoA - v.valorSuaInvencao) / v.valorSolucaoA) * 100;
    }
  });
  setFormData({ ...formData, vantagensComparativas: vantagens });
}, [formData.vantagensComparativas.map(v => `${v.valorSolucaoA}-${v.valorSuaInvencao}`).join(',')]);
```

### 2. Validação de CPF (Anexo F)

**Algoritmo**:
```typescript
function validarCPF(cpf: string): boolean {
  // Remover máscara
  cpf = cpf.replace(/[^\d]/g, '');

  // Validar tamanho
  if (cpf.length !== 11) return false;

  // Validar dígitos repetidos
  if (/^(\d)\1+$/.test(cpf)) return false;

  // Calcular dígitos verificadores
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf[i]) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf[i]) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(cpf[10])) return false;

  return true;
}
```

### 3. Validação de Reivindicações (Anexo C)

**Regex**:
```typescript
// Independente: "1. Um sistema de..."
const regexIndependente = /^\d+\.\s+Um\s+Uma?\s+/i;

// Dependente: "2. O sistema de... de acordo com a reivindicação 1"
const regexDependente = /^\d+\.\s+O\s+(?:A\s+|As\s+)?\w+.*\s+de\s+acordo\s+com\s+a\s+reivindicação\s+\d+/i;
```

## Fluxo Recomendado

```
Formulário Principal (PI/MU/CII/RPC)
    ↓
Anexo A (Busca Anterioridade)
    ↓
Anexo B (Matriz Problema x Solução)
    ↓
Anexo C (Memorial Descritivo)
    ↓
Anexo F (Qualificação de Inventores)
    ↓
Submissão Completa
```

## Decisões Pendentes

1. **Ordem Obrigatória**: Devemos forçar a ordem A→B→C→F?
   - **Decisão**: Recomendar ordem, mas permitir acesso direto

2. **Persistência**: Como salvar multi-inventores, figuras, reivindicações?
   - **Decisão**: JSON.stringify no localStorage para rascunho

3. **Geração de PDF**: Implementar agora ou fase 2?
   - **Decisão**: Fase 2 - primeiro HTML, depois PDF

4. **Assinatura Digital**: Upload ou integração ICP-Brasil?
   - **Decisão**: Fase 2 - primeiro upload, depois integração
