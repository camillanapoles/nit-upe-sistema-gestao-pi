'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Save,
  Send,
  AlertCircle,
  CheckCircle2,
  Info,
  Lightbulb,
  ArrowLeft,
  Upload,
  X,
  FileCode,
  CheckCircle,
} from 'lucide-react';
import { apiCriarPedidoCII } from '@/lib/mock-api';
import { createPedido, updatePedido, getPedidoByPedidoId, type Pedido } from '@/lib/pedido-storage';
import {
  validateEfeitoTecnicoRealtime,
  validateMetricaRealtime,
  FormularioCIIFormData,
} from '@/lib/validations/cii';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface FormData {
  // Metadados
  titulo: string;
  versao: string;
  plataforma: string;
  // Efeito Técnico
  descricaoEfeitoTecnico: string;
  metricaQuantitativa: string;
  tipoEfeitoTecnico: string;
  // Funcionalidade
  funcionalidades: string;
  inputs: string;
  outputs: string;
  // Hardware
  processador: string;
  memoriaRAM: string;
  armazenamento: string;
  // Fluxograma
  descricaoFluxo: string;
  arquivoFluxograma: File | null;
  // Tripla Reivindicação
  resumoMetodo: string;
  resumoSistema: string;
  resumoMidia: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY = 'formulario-cii-rascunho';
const PEDIDO_ID_KEY = 'formulario-cii-pedido-id';
const AUTOSAVE_INTERVAL = 30000; // 30 seconds

const PLATAFORMAS = ['Windows', 'Linux', 'MacOS', 'Web', 'Mobile', 'Embedded'];
const TIPOS_EFEITO = ['Performance', 'Memória', 'Segurança', 'Precisão', 'Latência', 'Outro'];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface FileUploadProps {
  label: string;
  accept: string;
  maxSize: number;
  file: File | null;
  onFileChange: (file: File | null) => void;
  required?: boolean;
  hint?: string;
}

function FileUpload({ label, accept, maxSize, file, onFileChange, required = false, hint }: FileUploadProps) {
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError('');

    if (!selectedFile) {
      if (required) {
        setError('Este arquivo é obrigatório');
      }
      onFileChange(null);
      return;
    }

    // Validate file type
    if (!selectedFile.type.match(accept)) {
      setError(`Arquivo deve ser do tipo: ${accept}`);
      return;
    }

    // Validate file size
    const sizeMB = selectedFile.size / (1024 * 1024);
    if (sizeMB > maxSize) {
      setError(`Arquivo deve ter no máximo ${maxSize} MB (atual: ${sizeMB.toFixed(2)} MB)`);
      return;
    }

    onFileChange(selectedFile);
  };

  const handleRemove = () => {
    onFileChange(null);
    setError('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {!file ? (
        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center text-gray-500">
            <Upload className="h-10 w-10 mb-2" />
            <p className="text-sm font-medium">Clique para fazer upload</p>
            <p className="text-xs text-gray-400 mt-1">
              Máximo {maxSize} MB • {accept}
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}

      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  isTextarea?: boolean;
  rows?: number;
  hint?: string;
  minLength?: number;
  maxLength?: number;
  validation?: (value: string) => { isValid: boolean; message: string };
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  isTextarea = false,
  rows = 4,
  hint,
  minLength,
  maxLength,
  validation,
}: TextFieldProps) {
  const validationStatus = validation ? validation(value) : null;
  const isInRange = !minLength || !maxLength || (value.length >= minLength && value.length <= maxLength);

  const borderColors = validationStatus
    ? validationStatus.isValid
      ? 'focus:ring-green-500 focus:border-green-500 border-green-500'
      : 'focus:ring-red-500 focus:border-red-500 border-red-500'
    : 'focus:ring-blue-500 focus:border-blue-500 border-gray-300';

  const InputComponent = isTextarea ? 'textarea' : 'input';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {value.length > 0 && (
          <span className={`text-xs ${isInRange ? 'text-green-600' : 'text-red-600'}`}>
            {value.length}/{maxLength || '∞'}
          </span>
        )}
      </div>

      <InputComponent
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 border rounded-lg shadow-sm transition-colors ${borderColors} ${
          isTextarea ? 'resize-y' : ''
        }`}
      />

      {validationStatus && (
        <div className={`flex items-center gap-2 text-sm ${
          validationStatus.isValid ? 'text-green-600' : 'text-red-600'
        }`}>
          {validationStatus.isValid ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {validationStatus.message}
        </div>
      )}

      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
  hint?: string;
}

function SelectField({ label, value, onChange, options, required = false, hint }: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Selecione...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function FormularioCII() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    titulo: '',
    versao: '',
    plataforma: '',
    descricaoEfeitoTecnico: '',
    metricaQuantitativa: '',
    tipoEfeitoTecnico: '',
    funcionalidades: '',
    inputs: '',
    outputs: '',
    processador: '',
    memoriaRAM: '',
    armazenamento: '',
    descricaoFluxo: '',
    arquivoFluxograma: null,
    resumoMetodo: '',
    resumoSistema: '',
    resumoMidia: '',
  });

  // UI state
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPedido, setCurrentPedido] = useState<Pedido | null>(null);

  // Auto-save interval ref
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);

  // Sections definition
  const sections = [
    { title: 'Metadados', icon: '📋' },
    { title: 'Efeito Técnico', icon: '⚡' },
    { title: 'Funcionalidade', icon: '⚙️' },
    { title: 'Hardware', icon: '💻' },
    { title: 'Fluxograma', icon: '📊' },
    { title: 'Tripla Reivindicação', icon: '📜' },
    { title: 'Revisão', icon: '✅' },
  ];

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    // Check for existing draft on mount
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    const savedPedidoId = localStorage.getItem(PEDIDO_ID_KEY);

    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.titulo || parsed.descricaoEfeitoTecnico) {
          setHasDraft(true);
          setShowDraftModal(true);

          // Also load the pedido if exists
          if (savedPedidoId) {
            const pedido = getPedidoByPedidoId(savedPedidoId);
            if (pedido) {
              setCurrentPedido(pedido);
            }
          }
        }
      } catch (e) {
        // Invalid draft, ignore
      }
    }

    // Set up auto-save interval
    autoSaveRef.current = setInterval(() => {
      saveDraft(true);
    }, AUTOSAVE_INTERVAL);

    return () => {
      if (autoSaveRef.current) {
        clearInterval(autoSaveRef.current);
      }
    };
  }, []);

  // Save draft whenever form data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft(true);
    }, 2000); // Debounce

    return () => clearTimeout(timer);
  }, [formData]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const saveDraft = useCallback(
    (silent: boolean = false) => {
      setIsSaving(true);
      try {
        // Don't save File objects in localStorage
        const draftToSave = { ...formData, arquivoFluxograma: null };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draftToSave));

        // Create or update pedido when form has required fields
        if (formData.titulo && formData.descricaoEfeitoTecnico) {
          const savedPedidoId = localStorage.getItem(PEDIDO_ID_KEY);

          if (!savedPedidoId && !currentPedido) {
            // Create new pedido
            const novoPedido = createPedido({
              tipo: 'CII' as any,
              titulo: formData.titulo,
              problema: formData.descricaoEfeitoTecnico,
              solucao: formData.resumoMetodo || '',
            });
            localStorage.setItem(PEDIDO_ID_KEY, novoPedido.pedidoId);
            setCurrentPedido(novoPedido);
          } else if (currentPedido) {
            // Update existing pedido
            updatePedido(currentPedido.id, {
              titulo: formData.titulo,
              formData: {
                tipo: 'CII' as any,
                titulo: formData.titulo,
                problema: formData.descricaoEfeitoTecnico,
                solucao: formData.resumoMetodo || '',
              },
            });
            // Reload pedido to get updated state
            const updated = getPedidoByPedidoId(currentPedido.pedidoId);
            if (updated) setCurrentPedido(updated);
          }
        }

        setLastSaved(new Date());
        if (!silent) {
          console.log('Rascunho salvo');
        }
      } catch (e) {
        console.error('Erro ao salvar rascunho:', e);
      } finally {
        setIsSaving(false);
      }
    },
    [formData, currentPedido]
  );

  const restoreDraft = useCallback(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData((prev) => ({ ...prev, ...parsed, arquivoFluxograma: null }));
        setHasDraft(false);
        setShowDraftModal(false);
      } catch (e) {
        console.error('Erro ao restaurar rascunho:', e);
      }
    }
  }, []);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PEDIDO_ID_KEY);
    setHasDraft(false);
    setShowDraftModal(false);
    setCurrentPedido(null);
  }, []);

  const updateField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const validateCurrentSection = useCallback((): boolean => {
    switch (currentSection) {
      case 0:
        return formData.titulo.length > 0 && formData.plataforma.length > 0;
      case 1:
        return (
          formData.descricaoEfeitoTecnico.length >= 200 &&
          formData.descricaoEfeitoTecnico.length <= 2000 &&
          formData.metricaQuantitativa.length >= 100 &&
          formData.metricaQuantitativa.length <= 500 &&
          formData.tipoEfeitoTecnico.length > 0
        );
      case 2:
        return (
          formData.funcionalidades.length >= 200 &&
          formData.inputs.length >= 100 &&
          formData.outputs.length >= 100
        );
      case 3:
        return (
          formData.processador.length > 0 &&
          formData.memoriaRAM.length > 0 &&
          formData.armazenamento.length > 0
        );
      case 4:
        return (
          formData.descricaoFluxo.length >= 200 &&
          formData.arquivoFluxograma !== null
        );
      case 5:
        return (
          formData.resumoMetodo.length > 0 &&
          formData.resumoSistema.length > 0 &&
          formData.resumoMidia.length > 0
        );
      default:
        return true;
    }
  }, [currentSection, formData]);

  const nextSection = useCallback(() => {
    if (!validateCurrentSection()) {
      return;
    }
    setCurrentSection((prev) => Math.min(sections.length - 1, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [validateCurrentSection, sections.length]);

  const prevSection = useCallback(() => {
    setCurrentSection((prev) => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateCurrentSection()) {
        setSubmitError('Por favor, revise os campos obrigatórios');
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        // Ensure pedido exists
        let pedidoId = currentPedido?.pedidoId;

        if (!pedidoId) {
          const novoPedido = createPedido({
            tipo: 'CII' as any,
            titulo: formData.titulo,
            problema: formData.descricaoEfeitoTecnico,
            solucao: formData.resumoMetodo || '',
          });
          pedidoId = novoPedido.pedidoId;
          setCurrentPedido(novoPedido);
        }

        // Clear draft on successful submission
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(PEDIDO_ID_KEY);

        setSubmitSuccess(true);

        // Redirect to confirmation page after showing success
        setTimeout(() => {
          router.push(`/confirmacao?pedidoId=${pedidoId}`);
        }, 2000);
      } catch (error) {
        setSubmitError('Erro ao submeter pedido. Por favor, tente novamente.');
        console.error('Erro ao submeter:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, router, validateCurrentSection, currentPedido]
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-600 text-white p-3 rounded-xl">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Formulário CII
              </h1>
              <p className="text-sm text-gray-500">
                Computer Implemented Invention (Patente de Software com Efeito Técnico)
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
                  <Info className="h-5 w-5" />
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

        {/* Success Modal */}
        {submitSuccess && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl text-center">
              <div className="bg-green-100 text-green-600 p-4 rounded-full inline-flex mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pedido submetido com sucesso!</h3>
              <p className="text-gray-600 mb-4">
                Seu pedido CII foi enviado para análise. Você será redirecionado para o dashboard.
              </p>
              <div className="animate-pulse text-sm text-gray-500">Redirecionando...</div>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between overflow-x-auto">
            {sections.map((section, index) => (
              <div key={index} className="flex items-center flex-1 min-w-max">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm ${
                      index <= currentSection
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index < currentSection ? <CheckCircle2 className="h-5 w-5" /> : section.icon}
                  </div>
                  <span
                    className={`text-xs mt-1 ${
                      index <= currentSection ? 'text-purple-600 font-medium' : 'text-gray-500'
                    }`}
                  >
                    {section.title}
                  </span>
                </div>
                {index < sections.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      index < currentSection ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

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
          {/* Section 0: Metadados */}
          {currentSection === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Metadados do Software
              </h2>

              <div className="space-y-6">
                <TextField
                  label="Título do Software"
                  value={formData.titulo}
                  onChange={(value) => updateField('titulo', value)}
                  placeholder="Ex: Sistema de Análise de Imagens Médicas por IA"
                  required
                  maxLength={150}
                  hint="Nome claro e conciso do software. Máximo 150 caracteres."
                />

                <TextField
                  label="Versão"
                  value={formData.versao}
                  onChange={(value) => updateField('versao', value)}
                  placeholder="1.0.0"
                  hint="Versão seguindo padrão SemVer (ex: 1.0.0). Opcional."
                />

                <SelectField
                  label="Plataforma"
                  value={formData.plataforma}
                  onChange={(value) => updateField('plataforma', value)}
                  options={PLATAFORMAS}
                  required
                  hint="Ambiente de execução principal do software."
                />
              </div>
            </div>
          )}

          {/* Section 1: Efeito Técnico */}
          {currentSection === 1 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Efeito Técnico (CRÍTICO)
              </h2>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">
                      Por que o efeito técnico é crucial?
                    </h4>
                    <p className="text-sm text-blue-700">
                      Para patente de software (CII), é obrigatório explicar como o software melhora
                      o hardware ou o processamento de dados. Não basta dizer que é "mais rápido" -
                      é necessário explicar tecnicamente como isso acontece.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <TextField
                  label="Descrição do Efeito Técnico"
                  value={formData.descricaoEfeitoTecnico}
                  onChange={(value) => updateField('descricaoEfeitoTecnico', value)}
                  placeholder="Ex: O algoritmo reduz o uso de memória em 30% através de compressão LZ4 adaptativa, permitindo processamento em dispositivos com 2GB de RAM..."
                  required
                  isTextarea
                  rows={6}
                  minLength={200}
                  maxLength={2000}
                  validation={validateEfeitoTecnicoRealtime}
                  hint="Explique tecnicamente como o software melhora o hardware ou processamento. Use termos técnicos (processador, memória, algoritmo). 200-2000 caracteres."
                />

                <TextField
                  label="Métrica Quantitativa"
                  value={formData.metricaQuantitativa}
                  onChange={(value) => updateField('metricaQuantitativa', value)}
                  placeholder="Ex: Redução de 30% no uso de memória, tempo de processamento reduzido de 5s para 500ms..."
                  required
                  isTextarea
                  rows={4}
                  minLength={100}
                  maxLength={500}
                  validation={validateMetricaRealtime}
                  hint="Mensuração objetiva da melhoria. OBRIGATÓRIO usar percentual (%) ou unidade de tempo (ms, s, min). 100-500 caracteres."
                />

                <SelectField
                  label="Tipo de Efeito Técnico"
                  value={formData.tipoEfeitoTecnico}
                  onChange={(value) => updateField('tipoEfeitoTecnico', value)}
                  options={TIPOS_EFEITO}
                  required
                  hint="Categoria principal da melhoria técnica."
                />
              </div>
            </div>
          )}

          {/* Section 2: Funcionalidade */}
          {currentSection === 2 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="text-2xl">⚙️</span>
                Descrição Funcional
              </h2>

              <div className="space-y-6">
                <TextField
                  label="Funcionalidades Principais"
                  value={formData.funcionalidades}
                  onChange={(value) => updateField('funcionalidades', value)}
                  placeholder="Descreva o que o software faz..."
                  required
                  isTextarea
                  rows={6}
                  minLength={200}
                  maxLength={2000}
                  hint="O que o software faz? Liste as principais funcionalidades. 200-2000 caracteres."
                />

                <TextField
                  label="Inputs (Entradas)"
                  value={formData.inputs}
                  onChange={(value) => updateField('inputs', value)}
                  placeholder="Ex: Imagens DICOM, metadados do paciente, parâmetros de configuração..."
                  required
                  isTextarea
                  rows={4}
                  minLength={100}
                  maxLength={1000}
                  hint="Quais dados o sistema recebe? 100-1000 caracteres."
                />

                <TextField
                  label="Outputs (Saídas)"
                  value={formData.outputs}
                  onChange={(value) => updateField('outputs', value)}
                  placeholder="Ex: Relatório de diagnóstico, mapa de calor, arquivo de resultados..."
                  required
                  isTextarea
                  rows={4}
                  minLength={100}
                  maxLength={1000}
                  hint="Quais dados/processos o sistema gera? 100-1000 caracteres."
                />
              </div>
            </div>
          )}

          {/* Section 3: Hardware */}
          {currentSection === 3 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="text-2xl">💻</span>
                Requisitos de Hardware
              </h2>

              <div className="space-y-6">
                <TextField
                  label="Processador"
                  value={formData.processador}
                  onChange={(value) => updateField('processador', value)}
                  placeholder="Ex: Intel Core i5 ou equivalente, arquitetura x64"
                  required
                  maxLength={100}
                  hint="Arquitetura e velocidade mínima. Máximo 100 caracteres."
                />

                <TextField
                  label="Memória RAM"
                  value={formData.memoriaRAM}
                  onChange={(value) => updateField('memoriaRAM', value)}
                  placeholder="Ex: 4 GB RAM mínimo, 8 GB recomendado"
                  required
                  maxLength={100}
                  hint="Memória mínima necessária. Máximo 100 caracteres."
                />

                <TextField
                  label="Armazenamento"
                  value={formData.armazenamento}
                  onChange={(value) => updateField('armazenamento', value)}
                  placeholder="Ex: 500 MB de espaço livre em disco"
                  required
                  maxLength={100}
                  hint="Espaço em disco necessário. Máximo 100 caracteres."
                />
              </div>
            </div>
          )}

          {/* Section 4: Fluxograma */}
          {currentSection === 4 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Fluxograma BPMN
              </h2>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">
                      Fluxograma é OBRIGATÓRIO para CII
                    </h4>
                    <p className="text-sm text-yellow-700">
                      Diferente de PI/MU, CII exige fluxograma em bloco (BPMN) que mostre o algoritmo.
                      <strong>Não use prints de tela ou código-fonte</strong> - isso invalida a patente.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <TextField
                  label="Descrição Textual do Fluxo"
                  value={formData.descricaoFluxo}
                  onChange={(value) => updateField('descricaoFluxo', value)}
                  placeholder="Descreva as etapas do algoritmo em ordem..."
                  required
                  isTextarea
                  rows={6}
                  minLength={200}
                  maxLength={2000}
                  hint="Descrição textual das etapas do algoritmo. 200-2000 caracteres."
                />

                <FileUpload
                  label="Arquivo do Fluxograma (PDF)"
                  accept="application/pdf"
                  maxSize={10}
                  file={formData.arquivoFluxograma}
                  onFileChange={(file) => updateField('arquivoFluxograma', file)}
                  required
                  hint="Diagrama visual em blocos (BPMN/Flowchart). Máximo 10MB."
                />
              </div>
            </div>
          )}

          {/* Section 5: Tripla Reivindicação */}
          {currentSection === 5 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="text-2xl">📜</span>
                Tripla Reivindicação (CII)
              </h2>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-800 mb-1">
                      Estratégia de Tripla Reivindicação
                    </h4>
                    <p className="text-sm text-purple-700">
                      Para máxima proteção, patentes CII devem ter 3 reivindicações independentes:
                      Método (o algoritmo), Sistema (o hardware/software), e Meio de Armazenamento
                      (o código em mídia). Estes campos servem como rascunho para o redator.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <TextField
                  label="Resumo do Método"
                  value={formData.resumoMetodo}
                  onChange={(value) => updateField('resumoMetodo', value)}
                  placeholder="Ex: Um método de análise de imagens médicas compreendendo: receber imagem DICOM, aplicar rede neural convolucional..."
                  required
                  isTextarea
                  rows={4}
                  maxLength={500}
                  hint="Rascunho da reivindicação de método (algoritmo). Máximo 500 caracteres."
                />

                <TextField
                  label="Resumo do Sistema"
                  value={formData.resumoSistema}
                  onChange={(value) => updateField('resumoSistema', value)}
                  placeholder="Ex: Um sistema de análise de imagens compreendendo: processador, memória, módulo de processamento de imagem..."
                  required
                  isTextarea
                  rows={4}
                  maxLength={500}
                  hint="Rascunho da reivindicação de sistema (hardware + software). Máximo 500 caracteres."
                />

                <TextField
                  label="Resumo de Meio de Armazenamento"
                  value={formData.resumoMidia}
                  onChange={(value) => updateField('resumoMidia', value)}
                  placeholder="Ex: Um meio de armazenamento não transitório de computador com código executável que, quando executado..."
                  required
                  isTextarea
                  rows={4}
                  maxLength={500}
                  hint="Rascunho da reivindicação de mídia (código em armazenamento). Máximo 500 caracteres."
                />
              </div>
            </div>
          )}

          {/* Section 6: Revisão e Envio */}
          {currentSection === 6 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="text-2xl">✅</span>
                Revisão e Envio
              </h2>

              <div className="space-y-6">
                {/* Anexos Status */}
                {currentPedido && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-purple-900 flex items-center gap-2">
                        <FileCode className="h-4 w-4" />
                        Anexos do Pedido
                      </h3>
                      <span className="text-xs text-purple-600 font-mono">{currentPedido.pedidoId}</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {[
                        { key: 'a' as const, label: 'A', obrigatorio: true },
                        { key: 'b' as const, label: 'B', obrigatorio: true },
                        { key: 'c' as const, label: 'C', obrigatorio: true },
                        { key: 'f' as const, label: 'F', obrigatorio: false },
                      ].map((anexo) => {
                        const completo = currentPedido.anexosCompletos[anexo.key];
                        return (
                          <div
                            key={anexo.key}
                            className={`flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-sm font-medium ${
                              completo
                                ? 'bg-green-100 text-green-700 border border-green-300'
                                : anexo.obrigatorio
                                  ? 'bg-red-100 text-red-700 border border-red-300'
                                  : 'bg-gray-100 text-gray-500 border border-gray-300'
                            }`}
                          >
                            {completo ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <AlertCircle className="h-3 w-3" />
                            )}
                            <span>{anexo.label}</span>
                            {anexo.obrigatorio && <span className="text-xs">*</span>}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-purple-700">
                        Anexos obrigatórios:{' '}
                        <strong>
                          {['a', 'b', 'c'].filter((k) => currentPedido.anexosCompletos[k as keyof typeof currentPedido.anexosCompletos]).length}/3
                        </strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => router.push(`/anexos?pedidoId=${currentPedido.pedidoId}`)}
                        className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
                      >
                        <FileCode className="h-4 w-4" />
                        {['a', 'b', 'c'].filter((k) => currentPedido.anexosCompletos[k as keyof typeof currentPedido.anexosCompletos]).length === 0
                          ? 'Adicionar Anexos'
                          : 'Ver Anexos'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Resumo do Pedido CII</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-gray-500 uppercase">Título</span>
                      <p className="font-medium">{formData.titulo}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase">Plataforma</span>
                      <p className="font-medium">{formData.plataforma}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 uppercase">Efeito Técnico</span>
                    <p className="text-sm text-gray-700 line-clamp-3">{formData.descricaoEfeitoTecnico}</p>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 uppercase">Métrica</span>
                    <p className="text-sm text-gray-700">{formData.metricaQuantitativa}</p>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 uppercase">Funcionalidades</span>
                    <p className="text-sm text-gray-700 line-clamp-2">{formData.funcionalidades}</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-xs text-gray-500 uppercase">Processador</span>
                      <p className="text-sm text-gray-700">{formData.processador}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase">RAM</span>
                      <p className="text-sm text-gray-700">{formData.memoriaRAM}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase">Armazenamento</span>
                      <p className="text-sm text-gray-700">{formData.armazenamento}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 uppercase">Arquivo de Fluxograma</span>
                    <p className="text-sm text-gray-700">
                      {formData.arquivoFluxograma ? formData.arquivoFluxograma.name : 'Não anexado'}
                    </p>
                  </div>
                </div>

                {/* Error message */}
                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800">Erro na submissão</h4>
                      <p className="text-sm text-red-700">{submitError}</p>
                    </div>
                  </div>
                )}

                {/* Confirm checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="confirm"
                    className="mt-1 h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    required
                  />
                  <label htmlFor="confirm" className="text-sm text-gray-600">
                    Confirmo que as informações fornecidas são verdadeiras e autorizo o NIT/UPE a
                    processar este pedido de patente CII.
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6">
            <button
              type="button"
              onClick={prevSection}
              disabled={currentSection === 0}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            <div className="flex gap-3">
              {/* Save Draft Button */}
              <button
                type="button"
                onClick={() => saveDraft(false)}
                className="flex items-center gap-2 px-6 py-3 border border-purple-600 rounded-lg text-purple-600 hover:bg-purple-50"
              >
                <Save className="h-4 w-4" />
                Salvar Rascunho
              </button>

              {currentSection < sections.length - 1 ? (
                <button
                  type="button"
                  onClick={nextSection}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!validateCurrentSection()}
                >
                  Próxima
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !validateCurrentSection()}
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
                      Submeter Pedido CII
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Footer Info */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            Os dados são salvos automaticamente no seu navegador a cada 30 segundos. Você pode
            fechar esta página e continuar depois.
          </p>
        </div>
      </div>
    </div>
  );
}
