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
  Eye,
  EyeOff,
} from 'lucide-react';
import { TipoPatente, apiCriarPedido } from '@/lib/mock-api';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface FormData {
  tipoPatente: TipoPatente.PI | TipoPatente.MU;
  titulo: string;
  problema: string;
  solucao: string;
  estadoTecnica: string;
  vantagens: string;
  palavrasChave: string;
  resumo: string;
}

interface ValidationRule {
  min: number;
  max: number;
  recommendedMin?: number;
  recommendedMax?: number;
}

interface ValidationStatus {
  isValid: boolean;
  isEmpty: boolean;
  isInRange: boolean;
  isRecommended: boolean;
  message: string;
  count: number;
}

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

const VALIDATION_RULES: Record<keyof Omit<FormData, 'tipoPatente'>, ValidationRule> = {
  titulo: {
    min: 1,
    max: 150,
    recommendedMin: 50,
    recommendedMax: 120,
  },
  problema: {
    min: 100,
    max: 1000,
    recommendedMin: 400,
    recommendedMax: 600,
  },
  solucao: {
    min: 500,
    max: 4000,
    recommendedMin: 1500,
    recommendedMax: 2500,
  },
  estadoTecnica: {
    min: 200,
    max: 2000,
    recommendedMin: 800,
    recommendedMax: 1200,
  },
  vantagens: {
    min: 100,
    max: 1500,
    recommendedMin: 400,
    recommendedMax: 800,
  },
  palavrasChave: {
    min: 50,
    max: 100,
    recommendedMin: 70,
    recommendedMax: 90,
  },
  resumo: {
    min: 50,
    max: 200,
    recommendedMin: 100,
    recommendedMax: 150,
  },
};

const STORAGE_KEY = 'formulario-pi-mu-rascunho';
const AUTOSAVE_INTERVAL = 30000; // 30 seconds

// ============================================================================
// GOTCHAS & TIPS
// ============================================================================

const GOTCHAS_BY_TYPE = {
  BIOTECNOLOGIA: [
    { wrong: 'temperatura ambiente', right: '20°C a 25°C' },
    { wrong: 'otimizado', right: 'faixas numéricas específicas' },
    { wrong: 'rápido', right: 'tempo reduzido em X%' },
  ],
  SOFTWARE: [
    { wrong: 'prints de tela', right: 'fluxogramas em blocos' },
    { wrong: 'código-fonte', right: 'descrição funcional' },
    { wrong: 'software sem efeito técnico', right: 'definir efeito técnico claro' },
  ],
  PRODUTO: [
    { wrong: 'fotografias', right: 'desenhos técnicos P&B' },
    { wrong: 'cores', right: 'P&B com hachuras' },
  ],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function validateField(
  name: keyof typeof VALIDATION_RULES,
  value: string,
  isWordCount = false
): ValidationStatus {
  const rule = VALIDATION_RULES[name];
  const count = isWordCount ? countWords(value) : value.length;

  const isEmpty = count === 0;
  const isBelowMin = count < rule.min;
  const isAboveMax = count > rule.max;
  const isValid = !isEmpty && !isBelowMin && !isAboveMax;

  const isRecommended =
    isValid &&
    (!rule.recommendedMin || count >= rule.recommendedMin) &&
    (!rule.recommendedMax || count <= rule.recommendedMax);

  let message = '';
  if (isEmpty) {
    message = `Campo obrigatório (${rule.min}-${rule.max} ${isWordCount ? 'palavras' : 'caracteres'})`;
  } else if (isBelowMin) {
    message = `Mínimo de ${rule.min} ${isWordCount ? 'palavras' : 'caracteres'} (atual: ${count})`;
  } else if (isAboveMax) {
    message = `Máximo de ${rule.max} ${isWordCount ? 'palavras' : 'caracteres'} (atual: ${count})`;
  } else if (isRecommended) {
    message = `Tamanho adequado (${count} ${isWordCount ? 'palavras' : 'caracteres'})`;
  } else {
    message = `Dentro dos limites (${count} ${isWordCount ? 'palavras' : 'caracteres'})`;
  }

  return {
    isValid,
    isEmpty,
    isInRange: !isBelowMin && !isAboveMax,
    isRecommended,
    message,
    count,
  };
}

function getRAGStatus(validation: ValidationStatus): 'green' | 'amber' | 'red' {
  if (!validation.isInRange) return 'red';
  if (validation.isRecommended) return 'green';
  return 'amber';
}

function getRAGClasses(status: 'green' | 'amber' | 'red'): string {
  const classes = {
    green: 'border-green-500 bg-green-50 text-green-700',
    amber: 'border-yellow-500 bg-yellow-50 text-yellow-700',
    red: 'border-red-500 bg-red-50 text-red-700',
  };
  return classes[status];
}

function getRAGIcon(status: 'green' | 'amber' | 'red'): React.ReactNode {
  const icons = {
    green: <CheckCircle2 className="h-4 w-4" />,
    amber: <AlertCircle className="h-4 w-4" />,
    red: <AlertCircle className="h-4 w-4" />,
  };
  return icons[status];
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface FieldValidationIndicatorProps {
  validation: ValidationStatus;
  isWordCount?: boolean;
}

function FieldValidationIndicator({
  validation,
  isWordCount = false,
}: FieldValidationIndicatorProps) {
  const status = getRAGStatus(validation);
  const classes = getRAGClasses(status);

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${classes}`}>
      {getRAGIcon(status)}
      <span className="text-sm font-medium">{validation.message}</span>
      <span className="ml-auto text-xs opacity-75">
        {validation.count}/{isWordCount ? '200' : VALIDATION_RULES.titulo.max}
      </span>
    </div>
  );
}

interface TextFieldProps {
  label: string;
  name: keyof typeof VALIDATION_RULES;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  isTextarea?: boolean;
  rows?: number;
  hint?: string;
  isWordCount?: boolean;
  showGotcha?: boolean;
  gotchaType?: keyof typeof GOTCHAS_BY_TYPE;
}

function TextField({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  isTextarea = false,
  rows = 4,
  hint,
  isWordCount = false,
  showGotcha = false,
  gotchaType,
}: TextFieldProps) {
  const validation = validateField(name, value, isWordCount);
  const status = getRAGStatus(validation);
  const [showGotchaTip, setShowGotchaTip] = useState(false);

  const borderColors = {
    green: 'focus:ring-green-500 focus:border-green-500 border-green-500',
    amber: 'focus:ring-yellow-500 focus:border-yellow-500 border-yellow-500',
    red: 'focus:ring-red-500 focus:border-red-500 border-red-500',
  };

  const borderColor = value.length > 0 ? borderColors[status] : 'focus:ring-blue-500 focus:border-blue-500 border-gray-300';

  const InputComponent = isTextarea ? 'textarea' : 'input';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {(showGotcha && gotchaType) && (
          <button
            type="button"
            onClick={() => setShowGotchaTip(!showGotchaTip)}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Lightbulb className="h-3 w-3" />
            Dica
          </button>
        )}
      </div>

      <InputComponent
        id={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 border rounded-lg shadow-sm transition-colors ${borderColor} ${
          isTextarea ? 'resize-y' : ''
        }`}
      />

      {showGotchaTip && gotchaType && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800 font-medium mb-2">Evite usar:</p>
          <ul className="text-xs text-blue-700 space-y-1">
            {GOTCHAS_BY_TYPE[gotchaType].map((gotcha, i) => (
              <li key={i}>
                <span className="line-through text-red-600">{gotcha.wrong}</span>
                {' → '}
                <span className="text-green-700">{gotcha.right}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hint && <p className="text-xs text-gray-500">{hint}</p>}

      <FieldValidationIndicator validation={validation} isWordCount={isWordCount} />
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function FormularioPI() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    tipoPatente: TipoPatente.PI,
    titulo: '',
    problema: '',
    solucao: '',
    estadoTecnica: '',
    vantagens: '',
    palavrasChave: '',
    resumo: '',
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
  const [showPreview, setShowPreview] = useState(false);

  // Auto-save interval ref
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);

  // Sections definition
  const sections = [
    { title: 'Tipo de Patente', icon: '📋' },
    { title: 'Resumo Técnico', icon: '📝' },
    { title: 'Revisão e Envio', icon: '✅' },
  ];

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    // Check for existing draft on mount
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.titulo || parsed.problema || parsed.solucao) {
          setHasDraft(true);
          setShowDraftModal(true);
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
    },
    [formData]
  );

  const restoreDraft = useCallback(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData(parsed);
        setHasDraft(false);
        setShowDraftModal(false);
      } catch (e) {
        console.error('Erro ao restaurar rascunho:', e);
      }
    }
  }, []);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHasDraft(false);
    setShowDraftModal(false);
  }, []);

  const updateField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const validateCurrentSection = useCallback((): boolean => {
    if (currentSection === 0) {
      return formData.tipoPatente === TipoPatente.PI || formData.tipoPatente === TipoPatente.MU;
    }
    if (currentSection === 1) {
      const requiredFields: (keyof Omit<FormData, 'tipoPatente'>)[] = [
        'titulo',
        'problema',
        'solucao',
        'estadoTecnica',
        'vantagens',
        'palavrasChave',
      ];
      return requiredFields.every(
        (field) => validateField(field, formData[field], field === 'resumo').isValid
      );
    }
    return true;
  }, [currentSection, formData]);

  const goToSection = useCallback(
    (section: number) => {
      if (section > currentSection && !validateCurrentSection()) {
        return false;
      }
      setCurrentSection(section);
      return true;
    },
    [currentSection, validateCurrentSection]
  );

  const nextSection = useCallback(() => {
    if (goToSection(currentSection + 1)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentSection, goToSection]);

  const prevSection = useCallback(() => {
    setCurrentSection((prev) => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate all fields
      const requiredFields: (keyof Omit<FormData, 'tipoPatente'>)[] = [
        'titulo',
        'problema',
        'solucao',
        'estadoTecnica',
        'vantagens',
        'palavrasChave',
      ];

      const invalidFields = requiredFields.filter(
        (field) => !validateField(field, formData[field], field === 'resumo').isValid
      );

      if (invalidFields.length > 0) {
        setSubmitError(
          `Por favor, preencha corretamente os campos: ${invalidFields.join(', ')}`
        );
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const result = await apiCriarPedido({
          tipo: formData.tipoPatente,
          titulo: formData.titulo,
          problema: formData.problema,
          solucao: formData.solucao,
          estadoTecnica: formData.estadoTecnica,
          vantagens: formData.vantagens,
          palavrasChave: formData.palavrasChave,
        });

        // Clear draft on successful submission
        localStorage.removeItem(STORAGE_KEY);

        setSubmitSuccess(true);

        // Redirect to dashboard after showing success
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } catch (error) {
        setSubmitError('Erro ao submeter pedido. Por favor, tente novamente.');
        console.error('Erro ao submeter:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, router]
  );

  const isFormValid = useCallback(() => {
    const requiredFields: (keyof Omit<FormData, 'tipoPatente'>)[] = [
      'titulo',
      'problema',
      'solucao',
      'estadoTecnica',
      'vantagens',
      'palavrasChave',
    ];
    return requiredFields.every(
      (field) => validateField(field, formData[field], field === 'resumo').isValid
    );
  }, [formData]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
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
            <div className="bg-blue-600 text-white p-3 rounded-xl">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Formulário de Pedido de Patente
              </h1>
              <p className="text-sm text-gray-500">
                Submissão de PI (Patente de Invenção) ou MU (Modelo de Utilidade)
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
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
                Seu pedido foi enviado para análise. Você será redirecionado para o dashboard.
              </p>
              <div className="animate-pulse text-sm text-gray-500">Redirecionando...</div>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            {sections.map((section, index) => (
              <div key={index} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm ${
                      index <= currentSection
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index < currentSection ? <CheckCircle2 className="h-5 w-5" /> : section.icon}
                  </div>
                  <span
                    className={`text-xs mt-1 ${
                      index <= currentSection ? 'text-blue-600 font-medium' : 'text-gray-500'
                    }`}
                  >
                    {section.title}
                  </span>
                </div>
                {index < sections.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      index < currentSection ? 'bg-blue-600' : 'bg-gray-200'
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
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
              Salvando...
            </>
          ) : lastSaved ? (
            <>Salvo às {lastSaved.toLocaleTimeString()}</>
          ) : null}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 0: Tipo de Patente */}
          {currentSection === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Tipo de Patente
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* PI Card */}
                <label
                  className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    formData.tipoPatente === TipoPatente.PI
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="tipoPatente"
                    value={TipoPatente.PI}
                    checked={formData.tipoPatente === TipoPatente.PI}
                    onChange={(e) => updateField('tipoPatente', e.target.value as TipoPatente.PI)}
                    className="sr-only"
                  />
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        formData.tipoPatente === TipoPatente.PI
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {formData.tipoPatente === TipoPatente.PI && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Patente de Invenção (PI)</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Proteção para invenções de alto impacto, com maior rigor de
                        novidade e atividade inventiva.
                      </p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li>• Vigência de 20 anos</li>
                        <li>• Requer exame de mérito</li>
                        <li>• Maior abrangência de proteção</li>
                      </ul>
                    </div>
                  </div>
                </label>

                {/* MU Card */}
                <label
                  className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    formData.tipoPatente === TipoPatente.MU
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="tipoPatente"
                    value={TipoPatente.MU}
                    checked={formData.tipoPatente === TipoPatente.MU}
                    onChange={(e) => updateField('tipoPatente', e.target.value as TipoPatente.MU)}
                    className="sr-only"
                  />
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        formData.tipoPatente === TipoPatente.MU
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {formData.tipoPatente === TipoPatente.MU && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Modelo de Utilidade (MU)</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Proteção para melhorias funcionais em objetos já conhecidos,
                        com processo mais simples.
                      </p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li>• Vigência de 15 anos</li>
                        <li>• Sem exame de mérito</li>
                        <li>• Depósito mais rápido</li>
                      </ul>
                    </div>
                  </div>
                </label>
              </div>

              {/* Info box about software */}
              {formData.tipoPatente === TipoPatente.PI && (
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-1">
                        Atenção: Software com efeito técnico
                      </h4>
                      <p className="text-sm text-yellow-700">
                        Se sua invenção envolve software, verifique se ela se enquadra como
                        Carta de Invenção de Informática (CII), que exige reivindicação
                        tripla: MÉTODO + SISTEMA + MEIO DE ARMAZENAMENTO.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section 1: Resumo Técnico */}
          {currentSection === 1 && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  Resumo Técnico
                </h2>

                <div className="space-y-8">
                  {/* Título */}
                  <TextField
                    label="Título da Invenção"
                    name="titulo"
                    value={formData.titulo}
                    onChange={(value) => updateField('titulo', value)}
                    placeholder="Ex: Dispositivo para tratamento de lesões em mucosa oral com liberação controlada"
                    required
                    hint="Seja claro e conciso. Evite nomes fantasia. Máximo 150 caracteres."
                  />

                  {/* Problema/Dor */}
                  <TextField
                    label="Problema / Dor"
                    name="problema"
                    value={formData.problema}
                    onChange={(value) => updateField('problema', value)}
                    placeholder="Descreva o problema técnico que sua invenção resolve..."
                    required
                    isTextarea
                    rows={5}
                    hint="Qual é a dor do mercado? O que está faltando nas soluções atuais? 100-1000 caracteres."
                    showGotcha
                    gotchaType="BIOTECNOLOGIA"
                  />

                  {/* Solução Técnica */}
                  <TextField
                    label="Solução Técnica"
                    name="solucao"
                    value={formData.solucao}
                    onChange={(value) => updateField('solucao', value)}
                    placeholder="Descreva sua invenção de forma técnica e detalhada..."
                    required
                    isTextarea
                    rows={8}
                    hint="Como sua invenção resolve o problema? Evite adjetivos qualitativos. Use métricas. 500-4000 caracteres."
                  />

                  {/* Estado da Técnica */}
                  <TextField
                    label="Estado da Técnica"
                    name="estadoTecnica"
                    value={formData.estadoTecnica}
                    onChange={(value) => updateField('estadoTecnica', value)}
                    placeholder="Descreva as soluções existentes no mercado..."
                    required
                    isTextarea
                    rows={5}
                    hint="O que já existe? Quais são as limitações das soluções atuais? 200-2000 caracteres."
                  />

                  {/* Vantagens */}
                  <TextField
                    label="Vantagens"
                    name="vantagens"
                    value={formData.vantagens}
                    onChange={(value) => updateField('vantagens', value)}
                    placeholder="Liste os benefícios técnicos ou econômicos mensuráveis..."
                    required
                    isTextarea
                    rows={4}
                    hint="Use métricas (%, R$, tempo). Ex: Redução de 40% no tempo, economia de 25% nos custos. 100-1500 caracteres."
                  />

                  {/* Palavras-chave */}
                  <TextField
                    label="Palavras-chave"
                    name="palavrasChave"
                    value={formData.palavrasChave}
                    onChange={(value) => updateField('palavrasChave', value)}
                    placeholder="cicatrização, odontologia, dispositivo, liberação controlada"
                    required
                    hint="Termos indexadores para busca de anterioridade. Separe por vírgula. 50-100 caracteres."
                  />

                  {/* Resumo (opcional, word count) */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-700">Resumo (Opcional)</h3>
                      <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {showPreview ? 'Ocultar' : 'Mostrar'}
                      </button>
                    </div>

                    {showPreview && (
                      <TextField
                        label=""
                        name="resumo"
                        value={formData.resumo}
                        onChange={(value) => updateField('resumo', value)}
                        placeholder="Resumo conciso da invenção em 50-200 palavras..."
                        isTextarea
                        rows={4}
                        isWordCount
                        hint="Este é um resumo opcional para facilitar a triagem inicial. 50-200 palavras."
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Revisão e Envio */}
          {currentSection === 2 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="text-2xl">✅</span>
                Revisão e Envio
              </h2>

              <div className="space-y-6">
                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-gray-500 uppercase">Tipo</span>
                      <p className="font-medium">{formData.tipoPatente}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase">Título</span>
                      <p className="font-medium">{formData.titulo || 'Não preenchido'}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 uppercase">Problema</span>
                    <p className="text-sm text-gray-700 line-clamp-3">{formData.problema || 'Não preenchido'}</p>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 uppercase">Solução</span>
                    <p className="text-sm text-gray-700 line-clamp-3">{formData.solucao || 'Não preenchido'}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-gray-500 uppercase">Vantagens</span>
                      <p className="text-sm text-gray-700 line-clamp-2">{formData.vantagens || 'Não preenchido'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase">Palavras-chave</span>
                      <p className="text-sm text-gray-700">{formData.palavrasChave || 'Não preenchido'}</p>
                    </div>
                  </div>
                </div>

                {/* Validation Summary */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700">Validação de Campos</h3>
                  {(Object.keys(VALIDATION_RULES) as Array<keyof typeof VALIDATION_RULES>).map(
                    (field) => {
                      const validation = validateField(field, formData[field], field === 'resumo');
                      const status = getRAGStatus(validation);

                      return (
                        <div key={field} className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm capitalize text-gray-600">{field}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{validation.count} {field === 'resumo' ? 'palavras' : 'caracteres'}</span>
                            {getRAGIcon(status)}
                          </div>
                        </div>
                      );
                    }
                  )}
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

                {/* Submit warning */}
                {!isFormValid() && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Formulário incompleto</h4>
                      <p className="text-sm text-yellow-700">
                        Por favor, revise os campos marcados em vermelho ou amarelo antes de
                        submeter.
                      </p>
                    </div>
                  </div>
                )}

                {/* Confirm checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="confirm"
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    required
                  />
                  <label htmlFor="confirm" className="text-sm text-gray-600">
                    Confirmo que as informações fornecidas são verdadeiras e autorizo o NIT/UPE a
                    processar este pedido de patente.
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
                className="flex items-center gap-2 px-6 py-3 border border-blue-600 rounded-lg text-blue-600 hover:bg-blue-50"
              >
                <Save className="h-4 w-4" />
                Salvar Rascunho
              </button>

              {currentSection < sections.length - 1 ? (
                <button
                  type="button"
                  onClick={nextSection}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentSection === 0 ? false : !validateCurrentSection()}
                >
                  Próxima
                </button>
              ) : (
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
                      Submeter Pedido
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
