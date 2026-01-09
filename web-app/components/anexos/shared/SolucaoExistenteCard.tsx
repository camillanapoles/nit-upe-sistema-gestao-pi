'use client';

import { Trash2, AlertCircle } from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface SolucaoExistente {
  id: string;
  nome: string;
  descricao: string;
  quemUsa: string;
  comoFunciona: string;
  limitacoes: string; // CRÍTICO - OBRIGATÓRIO
}

interface SolucaoExistenteCardProps {
  solucao: SolucaoExistente;
  onUpdate: (solucao: SolucaoExistente) => void;
  onRemove: () => void;
  canRemove: boolean;
  index: number;
  letra: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SolucaoExistenteCard({
  solucao,
  onUpdate,
  onRemove,
  canRemove,
  index,
  letra,
}: SolucaoExistenteCardProps) {
  const updateField = (field: keyof SolucaoExistente, value: string) => {
    onUpdate({ ...solucao, [field]: value });
  };

  const isLimitacoesValid = solucao.limitacoes.trim().length >= 50;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Solução Existente {letra}
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

      {/* Alert about Limitações */}
      <div className={`mb-4 p-3 rounded-lg border ${
        isLimitacoesValid
          ? 'bg-green-50 border-green-200'
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-start gap-2">
          <AlertCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
            isLimitacoesValid ? 'text-green-600' : 'text-yellow-600'
          }`} />
          <div className="text-sm">
            <p className={`font-medium ${
              isLimitacoesValid ? 'text-green-800' : 'text-yellow-800'
            }`}>
              Campo "Limitações" é OBRIGATÓRIO
            </p>
            <p className={`text-xs mt-1 ${
              isLimitacoesValid ? 'text-green-700' : 'text-yellow-700'
            }`}>
              Descreva claramente as deficiências desta solução. Isso é essencial para demonstrar
              atividade inventiva da sua invenção. Mínimo 50 caracteres.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Nome da Solução */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Solução <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={solucao.nome}
            onChange={(e) => updateField('nome', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Método Tradicional de Tratamento"
          />
          <p className="mt-1 text-xs text-gray-500">
            {solucao.nome.length}/100 caracteres (mínimo 5)
          </p>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição Detalhada <span className="text-red-500">*</span>
          </label>
          <textarea
            value={solucao.descricao}
            onChange={(e) => updateField('descricao', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            placeholder="Descreva como esta solução funciona..."
          />
          <p className="mt-1 text-xs text-gray-500">
            {solucao.descricao.length}/2000 caracteres (mínimo 100)
          </p>
        </div>

        {/* Quem Usa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quem Usa? <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={solucao.quemUsa}
            onChange={(e) => updateField('quemUsa', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Hospitais, clínicas, indústria farmacêutica..."
          />
          <p className="mt-1 text-xs text-gray-500">
            {solucao.quemUsa.length}/500 caracteres (mínimo 20)
          </p>
        </div>

        {/* Como Funciona */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Como Funciona? <span className="text-red-500">*</span>
          </label>
          <textarea
            value={solucao.comoFunciona}
            onChange={(e) => updateField('comoFunciona', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            placeholder="Descreva o mecanismo de funcionamento..."
          />
          <p className="mt-1 text-xs text-gray-500">
            {solucao.comoFunciona.length}/2000 caracteres (mínimo 100)
          </p>
        </div>

        {/* Limitações - CRÍTICO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Limitações e Deficiências <span className="text-red-500">*</span>
          </label>
          <textarea
            value={solucao.limitacoes}
            onChange={(e) => updateField('limitacoes', e.target.value)}
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y ${
              isLimitacoesValid
                ? 'border-green-500 bg-green-50'
                : 'border-yellow-500 bg-yellow-50'
            }`}
            placeholder="Descreva CLARAMENTE as limitações, problemas, deficiências ou falhas desta solução existente..."
          />
          <p className={`mt-1 text-xs flex items-center gap-1 ${
            isLimitacoesValid ? 'text-green-600' : 'text-yellow-600'
          }`}>
            <AlertCircle className="h-3 w-3" />
            {solucao.limitacoes.length}/2000 caracteres (mínimo 50) - Campo OBRIGATÓRIO para NAI
          </p>
        </div>
      </div>
    </div>
  );
}
