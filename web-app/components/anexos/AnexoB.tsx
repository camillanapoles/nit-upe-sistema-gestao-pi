'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Send, AlertCircle, GitCompare, Plus, Trash2 } from 'lucide-react';
import { SolucaoExistenteCard, type SolucaoExistente } from './shared';
import type { AnexoBInput } from '@/lib/validations/anexos';

// ============================================================================
// FORM DATA TYPE
// ============================================================================

interface VantagemComparativa {
  id: string;
  metrica: string;
  valorSolucaoA: number;
  valorSuaInvencao: number;
  unidade: string;
  porcentagemMelhoria: number;
}

interface AnexoBFormData extends Omit<AnexoBInput, 'vantagensComparativas'> {
  vantagensComparativas: VantagemComparativa[];
}

const STORAGE_KEY = 'anexo-b-rascunho';

// ============================================================================
// INITIAL STATE
// ============================================================================

const getInitialState = (): AnexoBFormData => ({
  problemaTitulo: '',
  problemaDescricao: '',
  problemaQuemSofre: '',
  problemaComoSeManifesta: '',
  solucoesExistentes: [],
  solucaoPropostaTitulo: '',
  solucaoPropostaDescricao: '',
  solucaoPropostaComoFunciona: '',
  solucaoPropostaInovacao: '',
  solucaoPropostaDiferencial: '',
  vantagensComparativas: [
    { id: '1', metrica: '', valorSolucaoA: 0, valorSuaInvencao: 0, unidade: '', porcentagemMelhoria: 0 },
    { id: '2', metrica: '', valorSolucaoA: 0, valorSuaInvencao: 0, unidade: '', porcentagemMelhoria: 0 },
    { id: '3', metrica: '', valorSolucaoA: 0, valorSuaInvencao: 0, unidade: '', porcentagemMelhoria: 0 },
    { id: '4', metrica: '', valorSolucaoA: 0, valorSuaInvencao: 0, unidade: '', porcentagemMelhoria: 0 },
  ],
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calcularPorcentagemMelhoria(valorA: number, valorB: number): number {
  if (valorA === 0) return 0;
  return ((valorA - valorB) / valorA) * 100;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AnexoB() {
  const router = useRouter();
  const [formData, setFormData] = useState<AnexoBFormData>(getInitialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);

  // Check for draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.problemaTitulo) {
          setShowDraftModal(true);
        }
      } catch (e) {
        console.error('Error parsing draft:', e);
      }
    }

    autoSaveRef.current = setInterval(() => {
      saveDraft(true);
    }, 30000);

    return () => {
      if (autoSaveRef.current) {
        clearInterval(autoSaveRef.current);
      }
    };
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

  const updateField = useCallback(<K extends keyof AnexoBFormData>(
    field: K,
    value: AnexoBFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const addSolucaoExistente = useCallback(() => {
    if (formData.solucoesExistentes.length >= 3) {
      return;
    }

    const letras = ['A', 'B', 'C'];
    const novaSolucao: SolucaoExistente = {
      id: Date.now().toString(),
      nome: '',
      descricao: '',
      quemUsa: '',
      comoFunciona: '',
      limitacoes: '',
    };

    updateField('solucoesExistentes', [...formData.solucoesExistentes, novaSolucao]);
  }, [formData.solucoesExistentes, updateField]);

  const updateSolucaoExistente = useCallback((id: string, solucao: SolucaoExistente) => {
    const updated = formData.solucoesExistentes.map((s) => (s.id === id ? solucao : s));
    updateField('solucoesExistentes', updated);
  }, [formData.solucoesExistentes, updateField]);

  const removeSolucaoExistente = useCallback((id: string) => {
    if (formData.solucoesExistentes.length <= 2) {
      return; // Mínimo 2 soluções
    }
    const updated = formData.solucoesExistentes.filter((s) => s.id !== id);
    updateField('solucoesExistentes', updated);
  }, [formData.solucoesExistentes, updateField]);

  const updateVantagemComparativa = useCallback(
    (id: string, field: keyof VantagemComparativa, value: string | number) => {
      const updated = formData.vantagensComparativas.map((v) => {
        if (v.id === id) {
          const updatedV = { ...v, [field]: value };
          // Recalculate percentage if values change
          if (field === 'valorSolucaoA' || field === 'valorSuaInvencao') {
            updatedV.porcentagemMelhoria = calcularPorcentagemMelhoria(
              updatedV.valorSolucaoA,
              updatedV.valorSuaInvencao
            );
          }
          return updatedV;
        }
        return v;
      });
      updateField('vantagensComparativas', updated);
    },
    [formData.vantagensComparativas, updateField]
  );

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    const errors: string[] = [];

    if (!formData.problemaTitulo || formData.problemaTitulo.length < 5) {
      errors.push('Título do problema deve ter no mínimo 5 caracteres');
    }
    if (!formData.problemaDescricao || formData.problemaDescricao.length < 300) {
      errors.push('Descrição do problema deve ter no mínimo 300 caracteres');
    }
    if (formData.solucoesExistentes.length < 2) {
      errors.push('Pelo menos 2 soluções existentes são obrigatórias');
    }
    if (!formData.solucoesExistentes.every((s) => s.limitacoes && s.limitacoes.length >= 50)) {
      errors.push('Todas as soluções existentes devem ter Limitações preenchidas (mínimo 50 caracteres)');
    }
    if (!formData.solucaoPropostaTitulo || formData.solucaoPropostaTitulo.length < 5) {
      errors.push('Título da solução proposta deve ter no mínimo 5 caracteres');
    }
    if (!formData.solucaoPropostaDescricao || formData.solucaoPropostaDescricao.length < 300) {
      errors.push('Descrição da solução proposta deve ter no mínimo 300 caracteres');
    }

    if (errors.length > 0) {
      setSubmitError(errors.join('; '));
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // TODO: Call API to save
      console.log('Anexo B saved:', formData);

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-8 px-4">
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
            <div className="bg-purple-600 text-white p-3 rounded-xl">
              <GitCompare className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Anexo B - Matriz Problema x Solução</h1>
              <p className="text-sm text-gray-500">
                Demonstração de atividade inventiva através de comparação
              </p>
            </div>
          </div>
        </div>

        {/* Draft Restore Modal */}
        {showDraftModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-100 text-yellow-600 p-2 rounded-full">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">Rascunho encontrado</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Encontramos um rascunho salvo. Deseja continuar de onde parou?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={clearDraft}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Descartar
                </button>
                <button
                  onClick={restoreDraft}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Auto-save indicator */}
        <div className="flex items-center justify-end gap-2 mb-4 text-sm text-gray-500">
          {isSaving ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full" />
              Salvando...
            </>
          ) : lastSaved ? (
            <>Salvo às {lastSaved.toLocaleTimeString()}</>
          ) : null}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Problema Identificado */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Problema Identificado</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.problemaTitulo}
                  onChange={(e) => updateField('problemaTitulo', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ex: Tratamento ineficiente de lesões em mucosa oral"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.problemaTitulo.length}/100 caracteres (mínimo 5)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição Detalhada <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.problemaDescricao}
                  onChange={(e) => updateField('problemaDescricao', e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y"
                  placeholder="Descreva o problema em detalhes..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.problemaDescricao.length}/5000 caracteres (mínimo 300)
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quem Sofre? <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.problemaQuemSofre}
                    onChange={(e) => updateField('problemaQuemSofre', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Pacientes, hospitais, indústria..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.problemaQuemSofre.length}/500 (mínimo 20)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Como se Manifesta? <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.problemaComoSeManifesta}
                    onChange={(e) => updateField('problemaComoSeManifesta', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Sintomas, custos, ineficiências..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.problemaComoSeManifesta.length}/1000 (mínimo 50)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Soluções Existentes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Soluções Existentes</h2>
              {formData.solucoesExistentes.length < 3 && (
                <button
                  type="button"
                  onClick={addSolucaoExistente}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Solução
                </button>
              )}
            </div>
            {formData.solucoesExistentes.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhuma solução existente adicionada ainda. Mínimo 2.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.solucoesExistentes.map((solucao, index) => (
                  <SolucaoExistenteCard
                    key={solucao.id}
                    solucao={solucao}
                    onUpdate={(s) => updateSolucaoExistente(solucao.id, s)}
                    onRemove={() => removeSolucaoExistente(solucao.id)}
                    canRemove={formData.solucoesExistentes.length > 2}
                    index={index}
                    letra={String.fromCharCode(65 + index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Solução Proposta */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Solução Proposta</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.solucaoPropostaTitulo}
                  onChange={(e) => updateField('solucaoPropostaTitulo', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Título da sua invenção"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.solucaoPropostaTitulo.length}/100 (mínimo 5)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.solucaoPropostaDescricao}
                  onChange={(e) => updateField('solucaoPropostaDescricao', e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y"
                  placeholder="Descreva sua solução..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.solucaoPropostaDescricao.length}/5000 (mínimo 300)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Como Funciona? <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.solucaoPropostaComoFunciona}
                  onChange={(e) => updateField('solucaoPropostaComoFunciona', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y"
                  placeholder="Mecanismo de funcionamento..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.solucaoPropostaComoFunciona.length}/2000 (mínimo 100)
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inovação <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.solucaoPropostaInovacao}
                    onChange={(e) => updateField('solucaoPropostaInovacao', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y"
                    placeholder="O que torna sua solução inovadora?"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.solucaoPropostaInovacao.length}/2000 (mínimo 100)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diferencial <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.solucaoPropostaDiferencial}
                    onChange={(e) => updateField('solucaoPropostaDiferencial', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y"
                    placeholder="Diferencial competitivo..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.solucaoPropostaDiferencial.length}/2000 (mínimo 100)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vantagens Comparativas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Vantagens Comparativas</h2>
            <div className="space-y-4">
              {formData.vantagensComparativas.map((vantagem, index) => (
                <div key={vantagem.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Vantagem {index + 1}</h3>
                  <div className="grid md:grid-cols-5 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">Métrica</label>
                      <input
                        type="text"
                        value={vantagem.metrica}
                        onChange={(e) =>
                          updateVantagemComparativa(vantagem.id, 'metrica', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Ex: Tempo de cicatrização"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Solução A</label>
                      <input
                        type="number"
                        value={vantagem.valorSolucaoA || ''}
                        onChange={(e) =>
                          updateVantagemComparativa(
                            vantagem.id,
                            'valorSolucaoA',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Sua Inv.</label>
                      <input
                        type="number"
                        value={vantagem.valorSuaInvencao || ''}
                        onChange={(e) =>
                          updateVantagemComparativa(
                            vantagem.id,
                            'valorSuaInvencao',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Unidade</label>
                      <input
                        type="text"
                        value={vantagem.unidade}
                        onChange={(e) =>
                          updateVantagemComparativa(vantagem.id, 'unidade', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="dias"
                      />
                    </div>
                  </div>
                  {vantagem.valorSolucaoA > 0 && vantagem.valorSuaInvencao > 0 && (
                    <div className="mt-3 p-2 bg-gray-50 rounded text-center">
                      <span className="text-sm font-medium">
                        % Melhoria:{' '}
                        <span
                          className={
                            vantagem.porcentagemMelhoria > 0 ? 'text-green-600' : 'text-red-600'
                          }
                        >
                          {vantagem.porcentagemMelhoria.toFixed(2)}%
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Erro na submissão</h4>
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={() => saveDraft(false)}
              className="flex items-center gap-2 px-6 py-3 border border-purple-600 rounded-lg text-purple-600 hover:bg-purple-50"
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
                  Salvar Anexo B
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
