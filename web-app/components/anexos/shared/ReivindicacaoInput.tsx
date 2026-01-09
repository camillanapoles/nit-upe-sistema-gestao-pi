'use client';

import { Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Reivindicacao {
  id: string;
  numero: number;
  texto: string;
}

interface ReivindicacaoInputProps {
  reivindicacao: Reivindicacao;
  onUpdate: (reivindicacao: Reivindicacao) => void;
  onRemove: () => void;
  canRemove: boolean;
  totalReivindicacoes: number;
}

// ============================================================================
// VALIDATION
// ============================================================================

function validarFormatoReivindicacao(texto: string, numero: number): {
  isValid: boolean;
  error?: string;
  tipo?: 'independente' | 'dependente';
} {
  const trimmed = texto.trim();

  // Check if starts with number
  const regexNumero = new RegExp(`^${numero}\\.`);
  if (!regexNumero.test(trimmed)) {
    return {
      isValid: false,
      error: `A reivindicação deve começar com "${numero}."`,
    };
  }

  // Check if it's the first claim (independent)
  if (numero === 1) {
    const regexIndependente = /^1\.\s+Um\s+/i;
    const regexIndependenteFem = /^1\.\s+Uma\s+/i;

    if (!regexIndependente.test(trimmed) && !regexIndependenteFem.test(trimmed)) {
      return {
        isValid: false,
        error: 'A primeira reivindicação deve ser independente e começar com "1. Um" ou "1. Uma"',
      };
    }

    return {
      isValid: true,
      tipo: 'independente',
    };
  }

  // For dependent claims (2+)
  const regexDependente = new RegExp(
    `^${numero}\\.\\s+.*\\s+de\\s+acordo\\s+com\\s+a\\s+reivindica[çc][ãa]o\\s+\\d+`,
    'i'
  );

  if (!regexDependente.test(trimmed)) {
    return {
      isValid: false,
      error: `Reivindicações dependentes devem seguir o formato: "${numero}. O [elemento] de acordo com a reivindicação X..."`,
    };
  }

  return {
    isValid: true,
    tipo: 'dependente',
  };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ReivindicacaoInput({
  reivindicacao,
  onUpdate,
  onRemove,
  canRemove,
  totalReivindicacoes,
}: ReivindicacaoInputProps) {
  const [validation, setValidation] = useState<{
    isValid: boolean;
    error?: string;
    tipo?: 'independente' | 'dependente';
  }>({ isValid: true });

  useEffect(() => {
    if (reivindicacao.texto.trim().length > 0) {
      setValidation(
        validarFormatoReivindicacao(reivindicacao.texto, reivindicacao.numero)
      );
    } else {
      setValidation({ isValid: true });
    }
  }, [reivindicacao.texto, reivindicacao.numero]);

  const updateTexto = (texto: string) => {
    onUpdate({ ...reivindicacao, texto });
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-6 relative transition-colors ${
      validation.isValid && reivindicacao.texto.trim().length > 0
        ? 'border-green-500'
        : !validation.isValid
        ? 'border-red-500'
        : 'border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Reivindicação {reivindicacao.numero}
        </h3>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Validation Alert */}
      {!validation.isValid && validation.error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 text-red-600 flex-shrink-0" />
            <div className="text-sm text-red-800">
              <p className="font-medium">Formato Inválido</p>
              <p className="text-xs mt-1">{validation.error}</p>
            </div>
          </div>
        </div>
      )}

      {validation.isValid && reivindicacao.texto.trim().length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
            <div className="text-sm text-green-800">
              <p className="font-medium">
                {validation.tipo === 'independente'
                  ? 'Reivindicação Independente'
                  : 'Reivindicação Dependente'}
              </p>
              <p className="text-xs mt-1">
                {validation.tipo === 'independente'
                  ? 'Formato correto para reivindicação independente'
                  : 'Formato correto para reivindicação dependente'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Type Indicator */}
      <div className="mb-3">
        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-lg ${
          reivindicacao.numero === 1
            ? 'bg-blue-100 text-blue-800'
            : 'bg-purple-100 text-purple-800'
        }`}>
          {reivindicacao.numero === 1 ? 'Independente' : 'Dependente'}
        </span>
      </div>

      {/* Text Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Texto da Reivindicação <span className="text-red-500">*</span>
        </label>
        <textarea
          value={reivindicacao.texto}
          onChange={(e) => updateTexto(e.target.value)}
          rows={6}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y font-mono text-sm ${
            validation.isValid && reivindicacao.texto.trim().length > 0
              ? 'border-green-500 bg-green-50'
              : !validation.isValid
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300'
          }`}
          placeholder={
            reivindicacao.numero === 1
              ? '1. Um dispositivo para tratamento de lesões em mucosa oral, caracterizado por compreender:'
              : `${reivindicacao.numero}. O dispositivo de acordo com a reivindicação 1, caracterizado por dito dispositivo compreender adicionalmente:`
          }
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {reivindicacao.texto.length} caracteres (mínimo 100)
          </p>
          <p className="text-xs text-gray-500">
            Total de reivindicações: {totalReivindicacoes}/10
          </p>
        </div>
      </div>

      {/* Format Help */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-700 font-medium mb-1">
          Formato esperado:
        </p>
        <p className="text-xs text-gray-600 font-mono">
          {reivindicacao.numero === 1
            ? '"1. Um [elemento principal], caracterizado por [características essenciais]:..."'
            : `"${reivindicacao.numero}. O [elemento] de acordo com a reivindicação X, caracterizado por [características adicionais]..."`
          }
        </p>
      </div>
    </div>
  );
}
