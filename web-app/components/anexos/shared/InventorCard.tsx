'use client';

import { useState, useEffect } from 'react';
import { Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Inventor {
  id: string;
  nome: string;
  cpf: string;
  rg: string;
  email: string;
  telefone: string;
  departamento: string;
  cargo: string;
  participacao: number;
  justificativa: string;
}

interface InventorCardProps {
  inventor: Inventor;
  onUpdate: (inventor: Inventor) => void;
  onRemove: () => void;
  canRemove: boolean;
  totalParticipacao: number;
  index: number;
}

// ============================================================================
// CPF VALIDATION
// ============================================================================

function validarCPF(cpf: string): boolean {
  // Remove non-digits
  const cpfLimpo = cpf.replace(/\D/g, '');

  // Check if has 11 digits
  if (cpfLimpo.length !== 11) return false;

  // Check if all digits are the same
  if (/^(\d)\1+$/.test(cpfLimpo)) return false;

  // Calculate first verification digit
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo[i]) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(cpfLimpo[9])) return false;

  // Calculate second verification digit
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo[i]) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(cpfLimpo[10])) return false;

  return true;
}

function formatCPF(cpf: string): string {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function InventorCard({
  inventor,
  onUpdate,
  onRemove,
  canRemove,
  totalParticipacao,
  index,
}: InventorCardProps) {
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Validate CPF on change
  useEffect(() => {
    const cpfLimpo = inventor.cpf.replace(/\D/g, '');
    if (cpfLimpo.length === 11) {
      if (!validarCPF(inventor.cpf)) {
        setCpfError('CPF inválido');
      } else {
        setCpfError(null);
      }
    } else if (cpfLimpo.length > 0) {
      setCpfError('CPF incompleto');
    } else {
      setCpfError(null);
    }
  }, [inventor.cpf]);

  // Validate email on change
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (inventor.email.length > 0 && !emailRegex.test(inventor.email)) {
      setEmailError('Email inválido');
    } else {
      setEmailError(null);
    }
  }, [inventor.email]);

  const updateField = (field: keyof Inventor, value: string | number) => {
    onUpdate({ ...inventor, [field]: value });
  };

  const participacaoStatus =
    Math.abs(totalParticipacao - 100) < 0.01
      ? 'valid'
      : totalParticipacao > 100
      ? 'exceeded'
      : 'insufficient';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Inventor {index + 1}
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

      <div className="grid md:grid-cols-2 gap-4">
        {/* Nome Completo */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={inventor.nome}
            onChange={(e) => updateField('nome', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="João Silva Santos"
          />
        </div>

        {/* CPF */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CPF <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formatCPF(inventor.cpf)}
            onChange={(e) => updateField('cpf', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              cpfError ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="000.000.000-00"
            maxLength={14}
          />
          {cpfError && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {cpfError}
            </p>
          )}
        </div>

        {/* RG */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            RG <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={inventor.rg}
            onChange={(e) => updateField('rg', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="1234567"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-mail <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={inventor.email}
            onChange={(e) => updateField('email', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              emailError ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="joao.silva@upe.br"
          />
          {emailError && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {emailError}
            </p>
          )}
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formatPhone(inventor.telefone)}
            onChange={(e) => updateField('telefone', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="(81) 99999-9999"
            maxLength={15}
          />
        </div>

        {/* Departamento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Departamento <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={inventor.departamento}
            onChange={(e) => updateField('departamento', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Departamento de Engenharia"
          />
        </div>

        {/* Cargo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cargo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={inventor.cargo}
            onChange={(e) => updateField('cargo', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Professor Adjunto"
          />
        </div>

        {/* % Participação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            % Participação <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={inventor.participacao}
              onChange={(e) => updateField('participacao', parseFloat(e.target.value) || 0)}
              step="0.01"
              min="0"
              max="100"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${
                participacaoStatus === 'valid'
                  ? 'border-green-500 bg-green-50'
                  : participacaoStatus === 'exceeded'
                  ? 'border-red-500 bg-red-50'
                  : participacaoStatus === 'insufficient'
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-gray-300'
              }`}
              placeholder="50.00"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              %
            </span>
          </div>
        </div>

        {/* Justificativa */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Justificativa da Participação <span className="text-red-500">*</span>
          </label>
          <textarea
            value={inventor.justificativa}
            onChange={(e) => updateField('justificativa', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            placeholder="Descreva a contribuição técnica do inventor para a invenção..."
          />
          <p className="mt-1 text-xs text-gray-500">
            {inventor.justificativa.length} caracteres (mínimo 50)
          </p>
        </div>
      </div>

      {/* Validation Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {participacaoStatus === 'valid' && (
            <span className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Soma: {totalParticipacao.toFixed(2)}%
            </span>
          )}
          {participacaoStatus === 'exceeded' && (
            <span className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Soma: {totalParticipacao.toFixed(2)}% (excede 100%)
            </span>
          )}
          {participacaoStatus === 'insufficient' && (
            <span className="text-xs text-yellow-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Soma: {totalParticipacao.toFixed(2)}% (deve ser 100%)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
