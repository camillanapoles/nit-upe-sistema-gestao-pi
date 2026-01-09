'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Send, AlertCircle, BookOpen, Plus } from 'lucide-react';
import { FiguraInput, ReivindicacaoInput, type Figura, type Reivindicacao } from './shared';
import type { AnexoCInput } from '@/lib/validations/anexos';

// ============================================================================
// FORM DATA TYPE
// ============================================================================

interface AnexoCFormData extends AnexoCInput {}

const STORAGE_KEY = 'anexo-c-rascunho';

// ============================================================================
// INITIAL STATE
// ============================================================================

const getInitialState = (): AnexoCFormData => ({
  titulo: '',
  campoInvencao: '',
  estadoTecnica: '',
  objetivos: '',
  caracteristicas: '',
  vantagens: '',
  componentes: '',
  funcionamento: '',
  modoRealizacao: '',
  parametros: '',
  figuras: [],
  reivindicacoes: [],
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AnexoC() {
  const router = useRouter();
  const [formData, setFormData] = useState<AnexoCFormData>(getInitialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);

  // Check for draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.titulo) {
          setShowDraftModal(true);
        }
      } catch (e) {
        console.error('Error parsing draft:', e);
      }
    }
  }, []);

  // Auto-save on change
  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData]);

  const saveDraft = useCallback((silent: boolean = false) => {
    setIsSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      setLastSaved(new Date());
    } catch (e) {
      console.error('Erro ao salvar rascunho:', e);
    } finally {
      setIsSaving(false);
    }
  }, [formData]);

  const restoreDraft = useCallback(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData(parsed);
        setShowDraftModal(false);
      } catch (e) {
        console.error('Erro ao restaurar rascunho:', e);
      }
    }
  }, []);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setShowDraftModal(false);
  }, []);

  const updateField = useCallback(<K extends keyof AnexoCFormData>(
    field: K,
    value: AnexoCFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const addFigura = useCallback(() => {
    if (formData.figuras.length >= 20) {
      return;
    }

    const novaFigura: Figura = {
      id: Date.now().toString(),
      numero: formData.figuras.length + 1,
      descricao: '',
      referenciasNumericas: '',
    };

    updateField('figuras', [...formData.figuras, novaFigura]);
  }, [formData.figuras, updateField]);

  const updateFigura = useCallback((id: string, figura: Figura) => {
    const updated = formData.figuras.map((f) => (f.id === id ? figura : f));
    updateField('figuras', updated);
  }, [formData.figuras, updateField]);

  const removeFigura = useCallback((id: string) => {
    const updated = formData.figuras.filter((f) => f.id !== id);
    updateField('figuras', updated);
  }, [formData.figuras, updateField]);

  const addReivindicacao = useCallback(() => {
    if (formData.reivindicacoes.length >= 10) {
      return;
    }

    const novaReivindicacao: Reivindicacao = {
      id: Date.now().toString(),
      numero: formData.reivindicacoes.length + 1,
      texto: `${formData.reivindicacoes.length + 1}. `,
    };

    updateField('reivindicacoes', [...formData.reivindicacoes, novaReivindicacao]);
  }, [formData.reivindicacoes, updateField]);

  const updateReivindicacao = useCallback((id: string, reiv: Reivindicacao) => {
    const updated = formData.reivindicacoes.map((r) => (r.id === id ? reiv : r));
    updateField('reivindicacoes', updated);
  }, [formData.reivindicacoes, updateField]);

  const removeReivindicacao = useCallback((id: string) => {
    if (formData.reivindicacoes.length <= 3) {
      return; // Mínimo 3 reivindicações
    }
    const updated = formData.reivindicacoes.filter((r) => r.id !== id);
    // Renumber
    const renumbered = updated.map((r, i) => ({ ...r, numero: i + 1 }));
    updateField('reivindicacoes', renumbered);
  }, [formData.reivindicacoes, updateField]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    const errors: string[] = [];

    if (!formData.titulo || formData.titulo.length < 10) {
      errors.push('Título deve ter no mínimo 10 caracteres');
    }
    if (!formData.campoInvencao || formData.campoInvencao.length < 10) {
      errors.push('Campo da invenção deve ter no mínimo 10 caracteres');
    }
    if (!formData.estadoTecnica || formData.estadoTecnica.length < 500) {
      errors.push('Estado da técnica deve ter no mínimo 500 caracteres');
    }
    if (formData.reivindicacoes.length < 3) {
      errors.push('Mínimo de 3 reivindicações é obrigatório');
    }
    if (formData.reivindicacoes.length > 10) {
      errors.push('Máximo de 10 reivindicações');
    }

    if (errors.length > 0) {
      setSubmitError(errors.join('; '));
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      console.log('Anexo C saved:', formData);
      localStorage.removeItem(STORAGE_KEY);

      setTimeout(() => {
        router.push('/anexos');
      }, 2000);
    } catch (error) {
      setSubmitError('Erro ao submeter. Por favor, tente novamente.');
      console.error('Erro ao submeter:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/anexos')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar aos Anexos
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-600 text-white p-3 rounded-xl">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Anexo C - Memorial Descritivo</h1>
              <p className="text-sm text-gray-500">Documento técnico central do pedido de patente</p>
            </div>
          </div>
        </div>

        {/* Draft Modal */}
        {showDraftModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-100 text-yellow-600 p-2 rounded-full">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">Rascunho encontrado</h3>
              </div>
              <p className="text-gray-600 mb-6">Deseja continuar?</p>
              <div className="flex gap-3">
                <button onClick={clearDraft} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Descartar</button>
                <button onClick={restoreDraft} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Continuar</button>
              </div>
            </div>
          </div>
        )}

        {/* Auto-save indicator */}
        <div className="flex items-center justify-end gap-2 mb-4 text-sm text-gray-500">
          {isSaving ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full" />
              Salvando...
            </>
          ) : lastSaved ? (
            <>Salvo às {lastSaved.toLocaleTimeString()}</>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cabeçalho */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Cabeçalho</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => updateField('titulo', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Título da invenção"
                />
                <p className="mt-1 text-xs text-gray-500">{formData.titulo.length}/150 (mínimo 10)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campo da Invenção <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.campoInvencao}
                  onChange={(e) => updateField('campoInvencao', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: Dispositivos médicos, Tratamento de tecidos..."
                />
                <p className="mt-1 text-xs text-gray-500">{formData.campoInvencao.length}/500 (mínimo 10)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado da Técnica <span className="text-red-500">*</span></label>
                <textarea
                  value={formData.estadoTecnica}
                  onChange={(e) => updateField('estadoTecnica', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y"
                  placeholder="Descreva o estado atual da técnica..."
                />
                <p className="mt-1 text-xs text-gray-500">{formData.estadoTecnica.length}/5000 (mínimo 500)</p>
              </div>
            </div>
          </div>

          {/* Sumário */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Sumário</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Objetivos <span className="text-red-500">*</span></label>
                <textarea
                  value={formData.objetivos}
                  onChange={(e) => updateField('objetivos', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y"
                  placeholder="Objetivos da invenção..."
                />
                <p className="mt-1 text-xs text-gray-500">{formData.objetivos.length}/2000 (mínimo 100)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Características <span className="text-red-500">*</span></label>
                <textarea
                  value={formData.caracteristicas}
                  onChange={(e) => updateField('caracteristicas', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y"
                  placeholder="Características principais..."
                />
                <p className="mt-1 text-xs text-gray-500">{formData.caracteristicas.length}/3000 (mínimo 200)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vantagens <span className="text-red-500">*</span></label>
                <textarea
                  value={formData.vantagens}
                  onChange={(e) => updateField('vantagens', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y"
                  placeholder="Vantagens em relação ao estado da técnica..."
                />
                <p className="mt-1 text-xs text-gray-500">{formData.vantagens.length}/2000 (mínimo 100)</p>
              </div>
            </div>
          </div>

          {/* Descrição Detalhada */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Descrição Detalhada</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Componentes <span className="text-red-500">*</span></label>
                <textarea
                  value={formData.componentes}
                  onChange={(e) => updateField('componentes', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y"
                  placeholder="Componentes e partes da invenção..."
                />
                <p className="mt-1 text-xs text-gray-500">{formData.componentes.length}/3000 (mínimo 200)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Funcionamento <span className="text-red-500">*</span></label>
                <textarea
                  value={formData.funcionamento}
                  onChange={(e) => updateField('funcionamento', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y"
                  placeholder="Como a invenção funciona..."
                />
                <p className="mt-1 text-xs text-gray-500">{formData.funcionamento.length}/4000 (mínimo 300)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modo de Realização <span className="text-red-500">*</span></label>
                <textarea
                  value={formData.modoRealizacao}
                  onChange={(e) => updateField('modoRealizacao', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y"
                  placeholder="Modo preferencial de realização..."
                />
                <p className="mt-1 text-xs text-gray-500">{formData.modoRealizacao.length}/3000 (mínimo 200)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parâmetros <span className="text-red-500">*</span></label>
                <textarea
                  value={formData.parametros}
                  onChange={(e) => updateField('parametros', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y"
                  placeholder="Parâmetros técnicos, faixas, dimensões..."
                />
                <p className="mt-1 text-xs text-gray-500">{formData.parametros.length}/2000 (mínimo 100)</p>
              </div>
            </div>
          </div>

          {/* Figuras */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Figuras / Desenhos</h2>
              {formData.figuras.length < 20 && (
                <button
                  type="button"
                  onClick={addFigura}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Figura
                </button>
              )}
            </div>
            {formData.figuras.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhuma figura adicionada ainda.</p>
            ) : (
              <div className="space-y-4">
                {formData.figuras.map((figura) => (
                  <FiguraInput
                    key={figura.id}
                    figura={figura}
                    onUpdate={(f) => updateFigura(figura.id, f)}
                    onRemove={() => removeFigura(figura.id)}
                    canRemove={true}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Reivindicações */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Reivindicações</h2>
              {formData.reivindicacoes.length < 10 && (
                <button
                  type="button"
                  onClick={addReivindicacao}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Reivindicação
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {formData.reivindicacoes.length}/10 reivindicações (mínimo 3)
            </p>
            {formData.reivindicacoes.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhuma reivindicação adicionada ainda.</p>
            ) : (
              <div className="space-y-4">
                {formData.reivindicacoes.map((reiv) => (
                  <ReivindicacaoInput
                    key={reiv.id}
                    reivindicacao={reiv}
                    onUpdate={(r) => updateReivindicacao(reiv.id, r)}
                    onRemove={() => removeReivindicacao(reiv.id)}
                    canRemove={formData.reivindicacoes.length > 3}
                    totalReivindicacoes={formData.reivindicacoes.length}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Error */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Erro na submissão</h4>
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={() => saveDraft(false)}
              className="flex items-center gap-2 px-6 py-3 border border-green-600 rounded-lg text-green-600 hover:bg-green-50"
            >
              <Save className="h-4 w-4" />
              Salvar Rascunho
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Salvar Anexo C
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
