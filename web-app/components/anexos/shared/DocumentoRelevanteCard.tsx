'use client';

import { ExternalLink, AlertCircle } from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type Relevancia = 'Alta' | 'Média' | 'Baixa';

export interface DocumentoRelevante {
  id: string;
  numero: string;
  titulo: string;
  resumo: string;
  relevancia: Relevancia;
  similaridades: string;
  diferencas: string;
  url: string;
  dataPublicacao: string;
}

interface DocumentoRelevanteCardProps {
  documento: DocumentoRelevante;
  onUpdate: (documento: DocumentoRelevante) => void;
  index: number;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DocumentoRelevanteCard({
  documento,
  onUpdate,
  index,
}: DocumentoRelevanteCardProps) {
  const updateField = (field: keyof DocumentoRelevante, value: string | Relevancia) => {
    onUpdate({ ...documento, [field]: value });
  };

  const getRelevanciaColor = (relevancia: Relevancia) => {
    switch (relevancia) {
      case 'Alta':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Média':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Baixa':
        return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Documento {index}
        </h3>
        <select
          value={documento.relevancia}
          onChange={(e) => updateField('relevancia', e.target.value as Relevancia)}
          className={`px-3 py-1 text-sm font-medium rounded-lg border cursor-pointer ${getRelevanciaColor(
            documento.relevancia
          )}`}
        >
          <option value="Alta">Alta Relevância</option>
          <option value="Média">Média Relevância</option>
          <option value="Baixa">Baixa Relevância</option>
        </select>
      </div>

      {/* Alert about Alta Relevância */}
      {documento.relevancia === 'Alta' && (
        <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Documento de Alta Relevância</p>
              <p className="text-xs mt-1">
                Este documento é muito similar à sua invenção. Certifique-se de descrever
                claramente as diferenças no campo "Diferenças em Relação à Sua Invenção".
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Número do Documento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número do Documento <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={documento.numero}
            onChange={(e) => updateField('numero', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: PI1234567-8, US2023123456, EP3456789"
          />
          <p className="mt-1 text-xs text-gray-500">
            Número de patente (INPI, USPTO, EPO, etc.)
          </p>
        </div>

        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={documento.titulo}
            onChange={(e) => updateField('titulo', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Título da patente ou documento"
          />
          <p className="mt-1 text-xs text-gray-500">
            {documento.titulo.length}/300 caracteres (mínimo 10)
          </p>
        </div>

        {/* Resumo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resumo do Documento <span className="text-red-500">*</span>
          </label>
          <textarea
            value={documento.resumo}
            onChange={(e) => updateField('resumo', e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            placeholder="Resuma o conteúdo do documento em 2-3 parágrafos..."
          />
          <p className="mt-1 text-xs text-gray-500">
            {documento.resumo.length}/2000 caracteres (mínimo 100)
          </p>
        </div>

        {/* Similaridades */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Similaridades com Sua Invenção <span className="text-red-500">*</span>
          </label>
          <textarea
            value={documento.similaridades}
            onChange={(e) => updateField('similaridades', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            placeholder="Liste os elementos técnicos que são similares à sua invenção..."
          />
          <p className="mt-1 text-xs text-gray-500">
            {documento.similaridades.length}/2000 caracteres (mínimo 50)
          </p>
        </div>

        {/* Diferenças */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Diferenças em Relação à Sua Invenção <span className="text-red-500">*</span>
          </label>
          <textarea
            value={documento.diferencas}
            onChange={(e) => updateField('diferencas', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            placeholder="Destaque os elementos que tornam sua invenção única e diferente..."
          />
          <p className="mt-1 text-xs text-gray-500">
            {documento.diferencas.length}/2000 caracteres (mínimo 50)
          </p>
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL do Documento <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="url"
              value={documento.url}
              onChange={(e) => updateField('url', e.target.value)}
              className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://..."
            />
            {documento.url && (
              <a
                href={documento.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Link para o documento na base de patentes
          </p>
        </div>

        {/* Data de Publicação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Publicação <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={documento.dataPublicacao}
            onChange={(e) => updateField('dataPublicacao', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            Data de publicação ou depósito da patente
          </p>
        </div>
      </div>
    </div>
  );
}
