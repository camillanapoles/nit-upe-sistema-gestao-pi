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
} from 'lucide-react';
import { apiCriarPedidoRPC } from '@/lib/mock-api';
import {
  validateCPFRealtime,
  formatCPF,
  validateFileSize,
  FormularioRPCFormData,
} from '@/lib/validations/rpc';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface FormData {
  // Dados do Programa
  nomePrograma: string;
  versao: string;
  linguagem: string;
  plataforma: string;
  descricaoFuncional: string;
  // Dados do Autor
  nomeAutor: string;
  cpfAutor: string;
  emailAutor: string;
  tipoVinculo: string;
  vinculoUPE: string;
  // Arquivos
  codigoFonte: File | null;
  executavel: File | null;
  manualUsuario: File | null;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY = 'formulario-rpc-rascunho';
const AUTOSAVE_INTERVAL = 30000; // 30 seconds

const LINGUAGENS = [
  'Python',
  'Java',
  'C++',
  'C',
  'C#',
  'JavaScript',
  'TypeScript',
  'PHP',
  'Ruby',
  'Go',
  'Rust',
  'Swift',
  'Kotlin',
  'Outros'
];

const PLATAFORMAS = ['Windows', 'Linux', 'MacOS', 'Web', 'Mobile', 'Multiplataforma'];

const TIPOS_VINCULO = [
  'Empregado',
  'Estagiário',
  'Bolsista',
  'Professor',
  'Pesquisador',
  'Outro'
];

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
  icon?: React.ReactNode;
}

function FileUpload({
  label,
  accept,
  maxSize,
  file,
  onFileChange,
  required = false,
  hint,
  icon
}: FileUploadProps) {
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
    if (!selectedFile.type.match(accept) && !selectedFile.name.endsWith('.zip')) {
      setError(`Arquivo deve ser do tipo: ${accept}`);
      return;
    }

    // Validate file size
    const validation = validateFileSize(selectedFile, maxSize, label);
    if (!validation.isValid) {
      setError(validation.message);
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
            {icon || <Upload className="h-10 w-10 mb-2" />}
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
              <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                {icon || <FileText className="h-6 w-6" />}
              </div>
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
  type?: 'text' | 'email';
  validation?: (value: string) => { isValid: boolean; message: string; [key: string]: any };
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
  type = 'text',
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
        {value.length > 0 && maxLength && (
          <span className={`text-xs ${isInRange ? 'text-green-600' : 'text-red-600'}`}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      <InputComponent
        type={type}
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

interface CPFFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  hint?: string;
}

function CPFField({ label, value, onChange, required = false, hint }: CPFFieldProps) {
  const validation = validateCPFRealtime(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const formatted = formatCPF(rawValue);
    onChange(formatted);
  };

  const borderColors = value.length > 0
    ? validation.isValid
      ? 'focus:ring-green-500 focus:border-green-500 border-green-500'
      : 'focus:ring-red-500 focus:border-red-500 border-red-500'
    : 'focus:ring-blue-500 focus:border-blue-500 border-gray-300';

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="000.000.000-00"
        maxLength={14}
        className={`w-full px-4 py-3 border rounded-lg shadow-sm transition-colors ${borderColors}`}
      />

      {value.length > 0 && (
        <div className={`flex items-center gap-2 text-sm ${
          validation.isValid ? 'text-green-600' : 'text-red-600'
        }`}>
          {validation.isValid ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {validation.message}
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

interface RadioGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  hint?: string;
}

function RadioGroup({ label, value, onChange, options, required = false, hint }: RadioGroupProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="flex gap-6">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>

      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function FormularioRPC() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    nomePrograma: '',
    versao: '',
    linguagem: '',
    plataforma: '',
    descricaoFuncional: '',
    nomeAutor: '',
    cpfAutor: '',
    emailAutor: '',
    tipoVinculo: '',
    vinculoUPE: '',
    codigoFonte: null,
    executavel: null,
    manualUsuario: null,
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

  // Auto-save interval ref
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);

  // Sections definition
  const sections = [
    { title: 'Dados do Programa', icon: '💾' },
    { title: 'Dados do Autor', icon: '👤' },
    { title: 'Arquivos', icon: '📁' },
    { title: 'Revisão', icon: '✅' },
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
        if (parsed.nomePrograma || parsed.nomeAutor) {
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
        // Don't save File objects in localStorage
        const draftToSave = {
          ...formData,
          codigoFonte: null,
          executavel: null,
          manualUsuario: null,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draftToSave));
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
        setFormData((prev) => ({
          ...prev,
          ...parsed,
          codigoFonte: null,
          executavel: null,
          manualUsuario: null,
        }));
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
    switch (currentSection) {
      case 0:
        return (
          formData.nomePrograma.length >= 3 &&
          formData.linguagem.length > 0 &&
          formData.plataforma.length > 0 &&
          formData.descricaoFuncional.length >= 200
        );
      case 1:
        return (
          formData.nomeAutor.length >= 5 &&
          validateCPFRealtime(formData.cpfAutor).isValid &&
          formData.emailAutor.length > 0 &&
          formData.tipoVinculo.length > 0 &&
          formData.vinculoUPE.length > 0
        );
      case 2:
        return formData.codigoFonte !== null && formData.manualUsuario !== null;
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
        await apiCriarPedidoRPC({
          nomePrograma: formData.nomePrograma,
          versao: formData.versao,
          linguagem: formData.linguagem,
          plataforma: formData.plataforma,
          descricaoFuncional: formData.descricaoFuncional,
          nomeAutor: formData.nomeAutor,
          cpfAutor: formData.cpfAutor,
          emailAutor: formData.emailAutor,
          tipoVinculo: formData.tipoVinculo,
          vinculoUPE: formData.vinculoUPE,
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
    [formData, router, validateCurrentSection]
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8 px-4">
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
            <div className="bg-orange-600 text-white p-3 rounded-xl">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Formulário RPC
              </h1>
              <p className="text-sm text-gray-500">
                Registro de Programa de Computador (Direito Autoral)
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
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
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
                Seu pedido RPC foi enviado para análise. Você será redirecionado para o dashboard.
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
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index < currentSection ? <CheckCircle2 className="h-5 w-5" /> : section.icon}
                  </div>
                  <span
                    className={`text-xs mt-1 ${
                      index <= currentSection ? 'text-orange-600 font-medium' : 'text-gray-500'
                    }`}
                  >
                    {section.title}
                  </span>
                </div>
                {index < sections.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      index < currentSection ? 'bg-orange-600' : 'bg-gray-200'
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
              <div className="animate-spin h-4 w-4 border-2 border-orange-600 border-t-transparent rounded-full" />
              Salvando...
            </>
          ) : lastSaved ? (
            <>Salvo às {lastSaved.toLocaleTimeString()}</>
          ) : null}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 0: Dados do Programa */}
          {currentSection === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="text-2xl">💾</span>
                Dados do Programa
              </h2>

              <div className="space-y-6">
                <TextField
                  label="Nome do Programa"
                  value={formData.nomePrograma}
                  onChange={(value) => updateField('nomePrograma', value)}
                  placeholder="Ex: Sistema de Gestão Acadêmica"
                  required
                  minLength={3}
                  maxLength={150}
                  hint="Nome comercial ou técnico do programa. 3-150 caracteres."
                />

                <TextField
                  label="Versão"
                  value={formData.versao}
                  onChange={(value) => updateField('versao', value)}
                  placeholder="1.0.0"
                  hint="Versão seguindo padrão SemVer (ex: 1.0.0). Opcional."
                />

                <SelectField
                  label="Linguagem de Programação"
                  value={formData.linguagem}
                  onChange={(value) => updateField('linguagem', value)}
                  options={LINGUAGENS}
                  required
                  hint="Linguagem principal do código-fonte."
                />

                <SelectField
                  label="Plataforma"
                  value={formData.plataforma}
                  onChange={(value) => updateField('plataforma', value)}
                  options={PLATAFORMAS}
                  required
                  hint="Ambiente de execução principal."
                />

                <TextField
                  label="Descrição Funcional"
                  value={formData.descricaoFuncional}
                  onChange={(value) => updateField('descricaoFuncional', value)}
                  placeholder="Descreva o que o software faz, suas principais funcionalidades e casos de uso..."
                  required
                  isTextarea
                  rows={8}
                  minLength={200}
                  maxLength={5000}
                  hint="Descrição detalhada das funcionalidades do programa. 200-5000 caracteres."
                />
              </div>
            </div>
          )}

          {/* Section 1: Dados do Autor */}
          {currentSection === 1 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="text-2xl">👤</span>
                Dados do Autor
              </h2>

              <div className="space-y-6">
                <TextField
                  label="Nome do Autor"
                  value={formData.nomeAutor}
                  onChange={(value) => updateField('nomeAutor', value)}
                  placeholder="Ex: João Silva Santos"
                  required
                  minLength={5}
                  maxLength={255}
                  hint="Nome civil completo do autor. 5-255 caracteres."
                />

                <CPFField
                  label="CPF do Autor"
                  value={formData.cpfAutor}
                  onChange={(value) => updateField('cpfAutor', value)}
                  required
                  hint="CPF válido para identificação fiscal."
                />

                <TextField
                  label="E-mail"
                  value={formData.emailAutor}
                  onChange={(value) => updateField('emailAutor', value)}
                  placeholder="autor@exemplo.com"
                  required
                  type="email"
                  hint="E-mail de contato do autor."
                />

                <SelectField
                  label="Tipo de Vínculo"
                  value={formData.tipoVinculo}
                  onChange={(value) => updateField('tipoVinculo', value)}
                  options={TIPOS_VINCULO}
                  required
                  hint="Relação do autor com a instituição."
                />

                <RadioGroup
                  label="Vínculo com a UPE"
                  value={formData.vinculoUPE}
                  onChange={(value) => updateField('vinculoUPE', value)}
                  options={[
                    { value: 'Sim', label: 'Sim' },
                    { value: 'Não', label: 'Não' },
                  ]}
                  required
                  hint="Se o autor é servidor ou estudante da UPE."
                />

                {formData.vinculoUPE === 'Sim' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800 mb-1">
                          Termo de Cessão de Direitos
                        </h4>
                        <p className="text-sm text-blue-700">
                          Como o autor possui vínculo com a UPE, será gerado automaticamente um
                          Termo de Cessão de Direitos Autorais para assinatura.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 2: Arquivos */}
          {currentSection === 2 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="text-2xl">📁</span>
                Arquivos para Upload
              </h2>

              <div className="space-y-6">
                <FileUpload
                  label="Código-Fonte (ZIP)"
                  accept=".zip,application/zip"
                  maxSize={50}
                  file={formData.codigoFonte}
                  onFileChange={(file) => updateField('codigoFonte', file)}
                  required
                  hint="Arquivo ZIP contendo todo o código-fonte. Obrigatório para registro no INPI."
                  icon={<FileText className="h-10 w-10" />}
                />

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-1">
                        Importante: Código-Fonte Completo
                      </h4>
                      <p className="text-sm text-yellow-700">
                        O INPI exige o depósito do código-fonte completo ou partes representativas.
                        O ZIP deve conter arquivos de código (.py, .java, .cpp, .js, etc.) e não apenas
                        documentação.
                      </p>
                    </div>
                  </div>
                </div>

                <FileUpload
                  label="Manual do Usuário (PDF)"
                  accept="application/pdf"
                  maxSize={10}
                  file={formData.manualUsuario}
                  onFileChange={(file) => updateField('manualUsuario', file)}
                  required
                  hint="Manual em PDF descrevendo instalação, uso e funcionalidades. Obrigatório para publicação."
                  icon={<FileText className="h-10 w-10" />}
                />

                <FileUpload
                  label="Executável (Opcional)"
                  accept=".exe,.app,.deb,.rpm"
                  maxSize={100}
                  file={formData.executavel}
                  onFileChange={(file) => updateField('executavel', file)}
                  hint="Binário compilado (se aplicável). Opcional."
                  icon={<FileText className="h-10 w-10" />}
                />
              </div>
            </div>
          )}

          {/* Section 3: Revisão e Envio */}
          {currentSection === 3 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="text-2xl">✅</span>
                Revisão e Envio
              </h2>

              <div className="space-y-6">
                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Resumo do Pedido RPC</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-gray-500 uppercase">Nome do Programa</span>
                      <p className="font-medium">{formData.nomePrograma}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase">Versão</span>
                      <p className="font-medium">{formData.versao || 'Não informada'}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-gray-500 uppercase">Linguagem</span>
                      <p className="font-medium">{formData.linguagem}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase">Plataforma</span>
                      <p className="font-medium">{formData.plataforma}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 uppercase">Descrição</span>
                    <p className="text-sm text-gray-700 line-clamp-3">{formData.descricaoFuncional}</p>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Dados do Autor</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-gray-500 uppercase">Nome</span>
                        <p className="font-medium">{formData.nomeAutor}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 uppercase">CPF</span>
                        <p className="font-medium">{formData.cpfAutor}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-xs text-gray-500 uppercase">E-mail</span>
                      <p className="text-sm text-gray-700">{formData.emailAutor}</p>
                    </div>
                    <div className="mt-3 grid md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-gray-500 uppercase">Vínculo</span>
                        <p className="text-sm text-gray-700">{formData.tipoVinculo}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 uppercase">Vínculo UPE</span>
                        <p className="text-sm text-gray-700">{formData.vinculoUPE}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Arquivos Anexados</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Código-Fonte:</span>
                        <span className="text-gray-700">
                          {formData.codigoFonte ? formData.codigoFonte.name : 'Não anexado'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Manual do Usuário:</span>
                        <span className="text-gray-700">
                          {formData.manualUsuario ? formData.manualUsuario.name : 'Não anexado'}
                        </span>
                      </div>
                      {formData.executavel && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">Executável:</span>
                          <span className="text-gray-700">{formData.executavel.name}</span>
                        </div>
                      )}
                    </div>
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
                    className="mt-1 h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    required
                  />
                  <label htmlFor="confirm" className="text-sm text-gray-600">
                    Confirmo que as informações fornecidas são verdadeiras e autorizo o NIT/UPE a
                    processar este pedido de registro RPC.
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
                className="flex items-center gap-2 px-6 py-3 border border-orange-600 rounded-lg text-orange-600 hover:bg-orange-50"
              >
                <Save className="h-4 w-4" />
                Salvar Rascunho
              </button>

              {currentSection < sections.length - 1 ? (
                <button
                  type="button"
                  onClick={nextSection}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      Submeter Pedido RPC
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
