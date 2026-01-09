'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Send, CheckCircle2, AlertCircle, Search, Calendar, User } from 'lucide-react';
import { DocumentoRelevanteCard, type DocumentoRelevante } from './shared';
import type { AnexoAInput } from '@/lib/validations/anexos';

// ============================================================================
// FORM DATA TYPE
// ============================================================================

interface AnexoAFormData extends Omit<AnexoAInput, 'documentosRelevantes'> {
  documentosRelevantes: DocumentoRelevante[];
}

const STORAGE_KEY = 'anexo-a-rascunho';
const AUTOSAVE_INTERVAL = 30000;

// ============================================================================
// INITIAL STATE
// ============================================================================

const getInitialState = (): AnexoAFormData => ({
  dataBusca: new Date().toISOString().split('T')[0],
  responsavel: '',
  termoBusca1: '',
  termoBusca2: '',
  termoBusca3: '',
  baseInpi: { consultada: false, data: '', url: '' },
  baseEspacenet: { consultada: false, data: '', url: '' },
  baseGooglePatents: { consultada: false, data: '', url: '' },
  documentosRelevantes: [],
  éNova: undefined as any,
  justificativaNovidade: '',
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AnexoA() {
  const router = useRouter();
  const [formData, setFormData] = useState<AnexoAFormData>(getInitialState);
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
        if (parsed.responsavel || parsed.termoBusca1) {
          setShowDraftModal(true);
        }
      } catch (e) {
        console.error('Error parsing draft:', e);
      }
    }

    autoSaveRef.current = setInterval(() => {
      saveDraft(true);
    }, AUTOSAVE_INTERVAL);

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
      if (!silent) {
        console.log('Rascunho salvo');
      }
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

  const updateField = useCallback(<K extends keyof AnexoAFormData>(
    field: K,
    value: AnexoAFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const addDocumentoRelevante = useCallback(() => {
    if (formData.documentosRelevantes.length >= 3) {
      return;
    }

    const novoDoc: DocumentoRelevante = {
      id: Date.now().toString(),
      numero: '',
      titulo: '',
      resumo: '',
      relevancia: 'Média',
      similaridades: '',
      diferencas: '',
      url: '',
      dataPublicacao: '',
    };

    updateField('documentosRelevantes', [...formData.documentosRelevantes, novoDoc]);
  }, [formData.documentosRelevantes, updateField]);

  const updateDocumentoRelevante = useCallback((id: string, doc: DocumentoRelevante) => {
    const updated = formData.documentosRelevantes.map((d) => (d.id === id ? doc : d));
    updateField('documentosRelevantes', updated);
  }, [formData.documentosRelevantes, updateField]);

  const removeDocumentoRelevante = useCallback((id: string) => {
    const updated = formData.documentosRelevantes.filter((d) => d.id !== id);
    updateField('documentosRelevantes', updated);
  }, [formData.documentosRelevantes, updateField]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    const errors: string[] = [];

    if (!formData.responsavel) errors.push('Responsável é obrigatório');
    if (!formData.termoBusca1 || !formData.termoBusca2 || !formData.termoBusca3) {
      errors.push('Todos os 3 termos de busca são obrigatórios');
    }
    if (formData.documentosRelevantes.length === 0) {
      errors.push('Pelo menos 1 documento relevante é obrigatório');
    }
    if (!formData.documentosRelevantes.some((d) => d.relevancia === 'Alta')) {
      errors.push('Pelo menos 1 documento deve ter relevância Alta');
    }
    if (formData.éNova === undefined) {
      errors.push('Responda: É nova?');
    }
    if (!formData.justificativaNovidade || formData.justificativaNovidade.length < 200) {
      errors.push('Justificativa deve ter no mínimo 200 caracteres');
    }

    if (errors.length > 0) {
      setSubmitError(errors.join('; '));
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // TODO: Call API to save
      console.log('Anexo A saved:', formData);

      // Clear draft on successful submission
      localStorage.removeItem(STORAGE_KEY);

      // Redirect to dashboard after showing success
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

  const isFormValid = () => {
    return (
      formData.responsavel &&
      formData.termoBusca1 &&
      formData.termoBusca2 &&
      formData.termoBusca3 &&
      formData.documentosRelevantes.length > 0 &&
      formData.documentosRelevantes.some((d) => d.relevancia === 'Alta') &&
      formData.éNova !== undefined &&
      formData.justificativaNovidade.length >= 200
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
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
            <div className="bg-blue-600 text-white p-3 rounded-xl">
              <Search className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Anexo A - Busca de Anterioridade</h1>
              <p className="text-sm text-gray-500">
                Comprovação de novidade através de busca em bases de patentes
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
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
              Salvando...
            </>
          ) : lastSaved ? (
            <>Salvo às {lastSaved.toLocaleTimeString()}</>
          ) : null}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cabeçalho */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Cabeçalho da Busca
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data da Busca <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dataBusca}
                  onChange={(e) => updateField('dataBusca', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsável <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.responsavel}
                  onChange={(e) => updateField('responsavel', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome do responsável pela busca"
                />
              </div>
            </div>
          </div>

          {/* Termos de Busca */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              Termos de Busca
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((num) => (
                <div key={num}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Termo {num} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={(formData as any)[`termoBusca${num}` as keyof AnexoAFormData]}
                    onChange={(e) => updateField(`termoBusca${num}` as any, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Termo de busca ${num}`}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Mínimo 3 caracteres
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bases Consultadas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Bases Consultadas</h2>
            <div className="space-y-4">
              {[
                { key: 'baseInpi' as const, label: 'INPI', url: 'https://www.gov.br/inpi' },
                { key: 'baseEspacenet' as const, label: 'Espacenet', url: 'https://worldwide.espacenet.com' },
                { key: 'baseGooglePatents' as const, label: 'Google Patents', url: 'https://patents.google.com' },
              ].map((base) => (
                <div key={base.key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="checkbox"
                      id={base.key}
                      checked={(formData[base.key] as any).consultada}
                      onChange={(e) =>
                        updateField(base.key, {
                          ...(formData[base.key] as any),
                          consultada: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={base.key} className="font-medium text-gray-700">
                      {base.label}
                    </label>
                  </div>
                  {(formData[base.key] as any).consultada && (
                    <div className="grid md:grid-cols-2 gap-3 ml-7">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Data</label>
                        <input
                          type="date"
                          value={(formData[base.key] as any).data}
                          onChange={(e) =>
                            updateField(base.key, {
                              ...(formData[base.key] as any),
                              data: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">URL</label>
                        <input
                          type="url"
                          value={(formData[base.key] as any).url}
                          onChange={(e) =>
                            updateField(base.key, {
                              ...(formData[base.key] as any),
                              url: e.target.value,
                            })
                          }
                          placeholder="https://..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Documentos Relevantes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Documentos Relevantes</h2>
              {formData.documentosRelevantes.length < 3 && (
                <button
                  type="button"
                  onClick={addDocumentoRelevante}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  + Adicionar Documento
                </button>
              )}
            </div>
            {formData.documentosRelevantes.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhum documento relevante adicionado ainda.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.documentosRelevantes.map((doc, index) => (
                  <DocumentoRelevanteCard
                    key={doc.id}
                    documento={doc}
                    onUpdate={(d) => updateDocumentoRelevante(doc.id, d)}
                    index={index + 1}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Conclusão */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Conclusão da Busca</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  É Nova? <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="éNova"
                      checked={formData.éNova === true}
                      onChange={() => updateField('éNova', true)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span>Sim</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="éNova"
                      checked={formData.éNova === false}
                      onChange={() => updateField('éNova', false)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span>Não</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Justificativa da Novidade <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.justificativaNovidade}
                  onChange={(e) => updateField('justificativaNovidade', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                  placeholder="Justifique por que sua invenção é nova em relação aos documentos encontrados..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.justificativaNovidade.length}/2000 caracteres (mínimo 200)
                </p>
              </div>
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
              className="flex items-center gap-2 px-6 py-3 border border-blue-600 rounded-lg text-blue-600 hover:bg-blue-50"
            >
              <Save className="h-4 w-4" />
              Salvar Rascunho
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
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
                  Salvar Anexo A
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
