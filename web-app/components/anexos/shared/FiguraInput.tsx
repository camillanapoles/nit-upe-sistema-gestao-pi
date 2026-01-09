'use client';

import { Trash2, Upload, FileImage, AlertCircle } from 'lucide-react';
import { useRef, useState } from 'react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Figura {
  id: string;
  numero: number;
  descricao: string;
  arquivo?: File;
  arquivoUrl?: string;
  referenciasNumericas: string;
}

interface FiguraInputProps {
  figura: Figura;
  onUpdate: (figura: Figura) => void;
  onRemove: () => void;
  canRemove: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function FiguraInput({
  figura,
  onUpdate,
  onRemove,
  canRemove,
}: FiguraInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const updateField = (field: keyof Figura, value: string | File | undefined) => {
    onUpdate({ ...figura, [field]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'image/tiff'];
    if (!validTypes.includes(file.type)) {
      setFileError('Apenas arquivos PDF ou TIFF são permitidos');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFileError('Arquivo muito grande. Máximo 10MB');
      return;
    }

    setFileError(null);
    updateField('arquivo', file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    updateField('arquivoUrl', url);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Figura {figura.numero}
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

      <div className="space-y-4">
        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição da Figura <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={figura.descricao}
            onChange={(e) => updateField('descricao', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Vista perspective do dispositivo"
          />
          <p className="mt-1 text-xs text-gray-500">
            {figura.descricao.length}/200 caracteres (mínimo 10)
          </p>
        </div>

        {/* Upload File */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Arquivo da Figura <span className="text-red-500">*</span>
          </label>

          {!figura.arquivo && !figura.arquivoUrl ? (
            <div
              onClick={handleUploadClick}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.tiff,.tif"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 font-medium mb-1">
                Clique para fazer upload
              </p>
              <p className="text-xs text-gray-500">
                PDF ou TIFF, máximo 10MB
              </p>
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <FileImage className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {figura.arquivo?.name || 'Arquivo carregado'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {figura.arquivo ? `${(figura.arquivo.size / 1024 / 1024).toFixed(2)} MB` : ''}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    updateField('arquivo', undefined);
                    updateField('arquivoUrl', undefined);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remover
                </button>
              </div>
            </div>
          )}

          {fileError && (
            <div className="mt-2 p-2 rounded bg-red-50 border border-red-200">
              <p className="text-xs text-red-700 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fileError}
              </p>
            </div>
          )}
        </div>

        {/* Referências Numéricas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Referências Numéricas <span className="text-red-500">*</span>
          </label>
          <textarea
            value={figura.referenciasNumericas}
            onChange={(e) => updateField('referenciasNumericas', e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y font-mono text-sm"
            placeholder="1: Bloco de suporte&#10;2: Dispositivo de liberação&#10;3: Camada de contato"
          />
          <p className="mt-1 text-xs text-gray-500">
            Liste cada elemento com seu número correspondente. Formato: "N: Descrição"
          </p>
        </div>
      </div>
    </div>
  );
}
