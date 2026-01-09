'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Send, AlertCircle, Users, Plus, CheckCircle2 } from 'lucide-react';
import { InventorCard, type Inventor } from './shared';
import type { AnexoFInput } from '@/lib/validations/anexos';

// ============================================================================
// FORM DATA TYPE
// ============================================================================

interface SisGenData {
  usaBiodiversidade: boolean;
  numeroSisgen: string;
  especie: string;
  origem: string;
}

interface FinanciamentoData {
  financiamentoExterno: boolean;
  agencia: string;
  numeroProcesso: string;
  valor: string;
}

interface AnexoFFormData extends Omit<AnexoFInput, 'sisgen' | 'financiamento'> {
  sisgen: SisGenData;
  financiamento: FinanciamentoData;
}

const STORAGE_KEY = 'anexo-f-rascunho';

// ============================================================================
// INITIAL STATE
// ============================================================================

const getInitialState = (): AnexoFFormData => ({
  inventores: [],
  sisgen: {
    usaBiodiversidade: false,
    numeroSisgen: '',
    especie: '',
    origem: '',
  },
  financiamento: {
    financiamentoExterno: false,
    agencia: '',
    numeroProcesso: '',
    valor: '',
  },
  declaracaoOriginalidade: false,
  declaracaoCessaoDireitos: false,
  assinaturaDigital: undefined,
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AnexoF() {
  const router = useRouter();
  const [formData, setFormData] = useState<AnexoFFormData>(getInitialState);
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
        if (parsed.inventores && parsed.inventores.length > 0) {
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

  const updateField = useCallback(<K extends keyof AnexoFFormData>(
    field: K,
    value: AnexoFFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const addInventor = useCallback(() => {
    const novoInventor: Inventor = {
      id: Date.now().toString(),
      nome: '',
      cpf: '',
      rg: '',
      email: '',
      telefone: '',
      departamento: '',
      cargo: '',
      participacao: 0,
      justificativa: '',
    };

    updateField('inventores', [...formData.inventores, novoInventor]);
  }, [formData.inventores, updateField]);

  const updateInventor = useCallback((id: string, inventor: Inventor) => {
    const updated = formData.inventores.map((inv) => (inv.id === id ? inventor : inv));
    updateField('inventores', updated);
  }, [formData.inventores, updateField]);

  const removeInventor = useCallback((id: string) => {
    if (formData.inventores.length <= 1) {
      return; // Mínimo 1 inventor
    }
    const updated = formData.inventores.filter((inv) => inv.id !== id);
    updateField('inventores', updated);
  }, [formData.inventores, updateField]);

  const totalParticipacao = formData.inventores.reduce(
    (acc, inv) => acc + inv.participacao,
    0
  );

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    const errors: string[] = [];

    if (formData.inventores.length === 0) {
      errors.push('Pelo menos 1 inventor é obrigatório');
    }
    if (Math.abs(totalParticipacao - 100) > 0.01) {
      errors.push('A soma de % participação deve ser exatamente 100%');
    }
    if (!formData.declaracaoOriginalidade) {
      errors.push('Declaração de originalidade é obrigatória');
    }
    if (!formData.declaracaoCessaoDireitos) {
      errors.push('Declaração de cessão de direitos é obrigatória');
    }
    if (formData.sisgen.usaBiodiversidade) {
      if (!formData.sisgen.numeroSisgen || !formData.sisgen.especie || !formData.sisgen.origem) {
        errors.push('Campos SisGen são obrigatórios quando usa biodiversidade');
      }
    }
    if (formData.financiamento.financiamentoExterno) {
      if (!formData.financiamento.agencia || !formData.financiamento.numeroProcesso || !formData.financiamento.valor) {
        errors.push('Campos de financiamento são obrigatórios quando há financiamento externo');
      }
    }

    if (errors.length > 0) {
      setSubmitError(errors.join('; '));
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      console.log('Anexo F saved:', formData);
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
  }, [formData, router, totalParticipacao]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8 px-4">
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
            <div className="bg-orange-600 text-white p-3 rounded-xl">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Anexo F - Qualificação de Inventores</h1>
              <p className="text-sm text-gray-500">
                Titularidade, obrigações legais e conformidade (SisGen, Financiamento)
              </p>
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
                <button onClick={restoreDraft} className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">Continuar</button>
              </div>
            </div>
          </div>
        )}

        {/* Auto-save indicator */}
        <div className="flex items-center justify-end gap-2 mb-4 text-sm text-gray-500">
          {isSaving ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-orange-600 border-t-transparent rounded-full" />
              Salvando...
            </>
          ) : lastSaved ? (
            <>Salvo às {lastSaved.toLocaleTimeString()}</>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inventores */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Inventores</h2>
              <button
                type="button"
                onClick={addInventor}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                Adicionar Inventor
              </button>
            </div>

            {/* Soma % participação */}
            {formData.inventores.length > 0 && (
              <div className={`mb-4 p-4 rounded-lg border ${
                Math.abs(totalParticipacao - 100) < 0.01
                  ? 'bg-green-50 border-green-200'
                  : totalParticipacao > 100
                  ? 'bg-red-50 border-red-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center gap-2">
                  {Math.abs(totalParticipacao - 100) < 0.01 ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    Math.abs(totalParticipacao - 100) < 0.01
                      ? 'text-green-800'
                      : 'text-yellow-800'
                  }`}>
                    Soma de % Participação: {totalParticipacao.toFixed(2)}%
                    {Math.abs(totalParticipacao - 100) >= 0.01 && ' (deve ser 100%)'}
                  </span>
                </div>
              </div>
            )}

            {formData.inventores.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhum inventor adicionado ainda. Clique em "Adicionar Inventor".
              </p>
            ) : (
              <div className="space-y-4">
                {formData.inventores.map((inventor, index) => (
                  <InventorCard
                    key={inventor.id}
                    inventor={inventor}
                    onUpdate={(inv) => updateInventor(inventor.id, inv)}
                    onRemove={() => removeInventor(inventor.id)}
                    canRemove={formData.inventores.length > 1}
                    totalParticipacao={totalParticipacao}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>

          {/* SisGen */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">SisGen - Biodiversidade</h2>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.sisgen.usaBiodiversidade}
                    onChange={(e) =>
                      updateField('sisgen', {
                        ...formData.sisgen,
                        usaBiodiversidade: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    A invenção utiliza biodiversidade brasileira?
                  </span>
                </label>
                <p className="mt-1 text-xs text-gray-500 ml-6">
                  Se sim, preencha os campos abaixo (obrigatório conforme Lei 13.123/2015)
                </p>
              </div>

              {formData.sisgen.usaBiodiversidade && (
                <div className="ml-6 space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número SisGen <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.sisgen.numeroSisgen}
                      onChange={(e) =>
                        updateField('sisgen', { ...formData.sisgen, numeroSisgen: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="UUID do SisGen"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Espécie <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.sisgen.especie}
                      onChange={(e) =>
                        updateField('sisgen', { ...formData.sisgen, especie: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Nome científico da espécie"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Origem <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.sisgen.origem}
                      onChange={(e) =>
                        updateField('sisgen', { ...formData.sisgen, origem: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Selecione...</option>
                      <option value="patrimonio_genetico">Patrimônio Genético</option>
                      <option value="conhecimento_tradicional">Conhecimento Tradicional</option>
                      <option value="ambos">Ambos</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Financiamento */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Financiamento Externo</h2>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.financiamento.financiamentoExterno}
                    onChange={(e) =>
                      updateField('financiamento', {
                        ...formData.financiamento,
                        financiamentoExterno: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Há financiamento externo para a pesquisa/desenvolvimento?
                  </span>
                </label>
                <p className="mt-1 text-xs text-gray-500 ml-6">
                  Se sim, preencha os campos abaixo
                </p>
              </div>

              {formData.financiamento.financiamentoExterno && (
                <div className="ml-6 grid md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Agência <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.financiamento.agencia}
                      onChange={(e) =>
                        updateField('financiamento', {
                          ...formData.financiamento,
                          agencia: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="CNPq, FACEPE, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número Processo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.financiamento.numeroProcesso}
                      onChange={(e) =>
                        updateField('financiamento', {
                          ...formData.financiamento,
                          numeroProcesso: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor (R$) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.financiamento.valor}
                      onChange={(e) =>
                        updateField('financiamento', {
                          ...formData.financiamento,
                          valor: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="R$ 50.000,00"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Declarações */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Declarações Obrigatórias</h2>
            <div className="space-y-4">
              <div>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.declaracaoOriginalidade}
                    onChange={(e) => updateField('declaracaoOriginalidade', e.target.checked)}
                    className="mt-1 h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">
                    Declaro que a invenção é original e foi desenvolvida pelos inventores listados acima,
                    sem violar direitos de propriedade intelectual de terceiros. <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>
              <div>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.declaracaoCessaoDireitos}
                    onChange={(e) => updateField('declaracaoCessaoDireitos', e.target.checked)}
                    className="mt-1 h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">
                    Declaro que os inventores cedem, irrevogavelmente e em caráter exclusivo, os direitos
                    de propriedade intelectual sobre esta invenção à UPE (Universidade de Pernambuco). <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>
            </div>
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
              className="flex items-center gap-2 px-6 py-3 border border-orange-600 rounded-lg text-orange-600 hover:bg-orange-50"
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
                  Salvar Anexo F
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
