# Design Document - Formulários CII e RPC

## Overview

Este documento descreve as decisões de design arquiteturais para implementação dos formulários de Computer Implemented Invention (CII) e Registro de Programa de Computador (RPC) no sistema de gestão de propriedade intelectual da UPE.

## Arquitetura

### Estrutura de Componentes

```
web-app/
├── app/
│   ├── formulario-cii/
│   │   └── page.tsx              # Rota /formulario-cii
│   ├── formulario-rpc/
│   │   └── page.tsx              # Rota /formulario-rpc
│   └── page.tsx                  # Homepage atualizada
├── components/
│   └── forms/
│       ├── FormularioCII.tsx     # Componente principal CII
│       ├── FormularioRPC.tsx     # Componente principal RPC
│       ├── CampoTexto.tsx        # Reutilizável (do PI/MU)
│       ├── CampoSelect.tsx       # Reutilizável (do PI/MU)
│       └── UploadArquivo.tsx     # Novo componente de upload
└── lib/
    ├── validations.ts            # Schemas Zod atualizados
    └── mock-api.ts               # Endpoints CII/RPC
```

### Padrão de Reutilização

**Decisão**: Reutilizar componentes do formulário PI/MU sempre que possível.

**Justificativa**:
- Reduz duplicação de código
- Mantém consistência visual
- Facilita manutenção

**Componentes Reutilizáveis**:
- `CampoTexto` - campos de texto com validação
- `CampoSelect` - selects customizados
- `ContadorCaracteres` - contador com semaforização RAG
- `SalvamentoAutomatico` - hook de localStorage

**Componentes Novos (CII/RPC específicos)**:
- `CampoEfeitoTecnico` - validação especial (não vago)
- `CampoMetricaQuantitativa` - validação (% ou tempo)
- `CampoCPF` - máscara + validação algorítmica
- `UploadArquivo` - upload de arquivos com validação

## Validações

### Zod Schemas

**Estrutura**:
```typescript
// CII Schema
const FormularioCIISchema = z.object({
  titulo: z.string().min(1).max(150),
  versao: z.string().regex(/^\d+\.\d+\.\d+$/).optional(),
  plataforma: z.enum(['Windows', 'Linux', 'MacOS', 'Web', 'Mobile', 'Embedded']),
  efeitoTecnico: z.string()
    .min(200, 'Mínimo 200 caracteres')
    .max(2000, 'Máximo 2000 caracteres')
    .refine(naoVago, 'Efeito técnico não pode ser vago'),
  metricaQuantitativa: z.string()
    .min(100, 'Mínimo 100 caracteres')
    .max(500, 'Máximo 500 caracteres')
    .refem(contemPercentualOuTempo, 'Deve conter % ou tempo'),
  // ... demais campos
});

// RPC Schema
const FormularioRPCSchema = z.object({
  nomePrograma: z.string().min(3).max(150),
  versao: z.string().regex(/^\d+\.\d+\.\d+$/).optional(),
  linguagem: z.string(),
  plataforma: z.string(),
  descricaoFuncional: z.string().min(200).max(5000),
  nomeAutor: z.string().min(5).max(255),
  cpfAutor: z.string().refine(validarCPF, 'CPF inválido'),
  emailAutor: z.string().email(),
  tipoVinculo: z.string(),
  vinculoUPE: z.enum(['Sim', 'Não']),
  codigoFonte: z.any() // File upload
    .refine(extensaoZip, 'Apenas arquivos .zip')
    .refine(tamanhoMax50MB, 'Máximo 50MB'),
  manualUsuario: z.any() // File upload
    .refine(extensaoPDF, 'Apenas arquivos .pdf')
    .refine(tamanhoMax10MB, 'Máximo 10MB'),
  executavel: z.any().optional(), // Opcional
});
```

### Validação de CPF

**Algoritmo**: Implementar validação completa do CPF brasileiro (dígitos verificadores).

**Máscara**: Formato visual 000.000.000-00.

### Validação de Efeito Técnico (CII)

**Regra**: Não pode ser vago (ex: "melhora performance").

**Validação**:
- Deve conter palavras-chave técnicas (hardware, memória, CPU, latência, etc.)
- Deve especificar melhoria quantitativa (% ou tempo)
- Lista de palavras proibidas (vagas, genéricas)

### Validação de Métrica Quantitativa (CII)

**Regra**: Obrigatório uso de percentual (%) ou tempo (ms, s, min).

**Regex**: `/\d+(\.\d+)?%|\d+\s*(ms|s|min|seg|hora)/i`

## Upload de Arquivos

### Estratégia

**Fase 1 (Atual)**: Upload simulado com API mock
- Armazenar metadados no localStorage
- Validar extensão e tamanho no cliente
- Simular upload com timeout

**Fase 2 (Futura)**: Upload real com backend
- Endpoint POST /api/upload
- Armazenamento em filesystem ou S3
- Validação de conteúdo no servidor (ZIP)

### Validações no Cliente

```typescript
// PDF Upload (fluxograma/manual)
const validarPDF = (file: File) => {
  const extensoesValidas = ['.pdf'];
  const tamanhoMaximo = 10 * 1024 * 1024; // 10MB

  if (!extensoesValidas.some(ext => file.name.endsWith(ext))) {
    throw new Error('Apenas arquivos PDF');
  }

  if (file.size > tamanhoMaximo) {
    throw new Error('Máximo 10MB');
  }

  return true;
};

// ZIP Upload (código-fonte)
const validarZIP = (file: File) => {
  const extensoesValidas = ['.zip'];
  const tamanhoMaximo = 50 * 1024 * 1024; // 50MB

  if (!extensoesValidas.some(ext => file.name.endsWith(ext))) {
    throw new Error('Apenas arquivos ZIP');
  }

  if (file.size > tamanhoMaximo) {
    throw new Error('Máximo 50MB');
  }

  return true;
};
```

### Validações no Servidor (Futura)

**ZIP Content Validation**:
- Extrair e listar arquivos
- Verificar extensões de código (.py, .js, .java, .cpp, etc.)
- Rejeitar se não houver arquivos de código
- Verificar por arquivos suspeitos (.exe, .dll, .so)

## Integração com API Mock

### Endpoints CII

```typescript
// web-app/lib/mock-api.ts

export async function apiCriarPedidoCII(data: FormularioCIIData) {
  // Simular delay de rede
  await delay(1000);

  // Validar efeito técnico
  if (!data.efeitoTecnico.includes('hardware') &&
      !data.efeitoTecnico.includes('memória') &&
      !data.efeitoTecnico.includes('CPU')) {
    throw new Error('Efeito técnico deve mencionar hardware');
  }

  // Gerar ID mock
  const pedido = {
    id: uuidv4(),
    tipo: 'CII',
    ...data,
    status: 'RASCUNHO',
    createdAt: new Date().toISOString(),
  };

  // Salvar no localStorage (simulando backend)
  salvarPedidoLocalStorage(pedido);

  return pedido;
}
```

### Endpoints RPC

```typescript
// web-app/lib/mock-api.ts

export async function apiCriarPedidoRPC(data: FormularioRPCData) {
  // Simular delay de rede
  await delay(1000);

  // Validar CPF
  if (!validarCPF(data.cpfAutor)) {
    throw new Error('CPF inválido');
  }

  // Gerar ID mock
  const pedido = {
    id: uuidv4(),
    tipo: 'RPC',
    ...data,
    status: 'RASCUNHO',
    createdAt: new Date().toISOString(),
  };

  // Salvar no localStorage (simulando backend)
  salvarPedidoLocalStorage(pedido);

  return pedido;
}
```

## UX/UI Considerations

### Semaforização RAG (Red/Amber/Green)

**CII - Efeito Técnico** (campo crítico):
- 🟢 Verde: 1000-1500 caracteres + palavras-chave técnicas
- 🟡 Amarelo: 200-999 ou 1501-2000 caracteres
- 🔴 Vermelho: <200 ou >2000 caracteres ou sem palavras-chave

**RPC - CPF** (campo crítico):
- 🟢 Verde: CPF válido (algoritmo)
- 🟡 Amarelo: Formato correto, não validado ainda
- 🔴 Vermelho: Formato incorreto ou CPF inválido

### Tooltips de Ajuda

**CII - Efeito Técnico**:
> "Descreva como seu software melhora o hardware ou processamento técnico. Exemplo: 'O algoritmo reduz o uso de memória em 30% através de compressão LZ4 em tempo real'."

**RPC - Código-Fonte**:
> "Compacte todo o código-fonte (.zip). Inclua arquivos .py, .js, .java, etc. Não inclua binários compilados."

## Segurança

### Validações de Segurança

**Upload de Arquivos**:
- Validar extensão no cliente e servidor
- Limitar tamanho máximo
- Escanear conteúdo (fase 2)
- Armazenar fora de public/

**CPF**:
- Nunca armazenar CPF não criptografado
- Usar bcrypt ou hash no backend
- Não exibir CPF completo na UI (apenas últimos 3 dígitos)

**XSS Prevention**:
- Sanitizar todos os inputs de texto
- Usar `dangerouslySetInnerHTML` apenas quando necessário
- Implementar Content Security Policy (CSP)

## Performance

### Otimizações

**Lazy Loading**:
- Carregar componentes de upload apenas quando necessário
- Não carregar arquivos grandes na memória

**Debouncing**:
- Debounce validações de texto (300ms)
- Debounce salvamento automático (1s)

**Code Splitting**:
- Separar código de CII e RPC em chunks diferentes
- Usar dynamic import para formulários pesados

## Acessibilidade

### ARIA Labels

**Upload de Arquivos**:
```tsx
<button
  aria-label="Fazer upload de fluxograma em PDF"
  aria-describedby="upload-help"
>
  <UploadIcon />
  Upload Fluxograma
</button>
<p id="upload-help">
  Formato PDF, máximo 10MB
</p>
```

### Navegação por Teclado

- Tab order lógico nos formulários
- Enter para submeter formulário
- Escape para cancelar
- Shift+Tab para navegar para trás

## Testes

### Estratégia de Testes

**Unitários**:
- Validadores de CPF
- Validadores de efeito técnico
- Validadores de métrica quantitativa

**Integração**:
- Submissão de formulário CII
- Submissão de formulário RPC
- Upload de arquivos

**E2E**:
- Fluxo completo: homepage → formulário → submissão → dashboard

## Decisões Pendentes

1. **Editor de Fluxograma BPMN**: Implementar editor integrado ou apenas upload PDF?
   - **Decisão**: Apenas upload PDF por enquanto

2. **Validação de ZIP no Cliente**: Válido apenas extensão ou abrir e validar conteúdo?
   - **Decisão**: Apenas extensão e tamanho no cliente; conteúdo no servidor (fase 2)

3. **Geração de Termo de Cessão (RPC)**: Implementar agora ou depois?
   - **Decisão**: Depois (próxima proposta)

## Referências

- Especificação CII: `SPEC_FORMULARIO_CII.md`
- Especificação RPC: `SPEC_FORMULARIO_RPC.md`
- Documentação Zod: https://zod.dev/
- WIPO Software Patents: https://www.wipo.int/patents/en/topics/software/
- INPI RPC: https://www.gov.br/inpi/pt-br/servicos/registro-de-programa-de-computador
