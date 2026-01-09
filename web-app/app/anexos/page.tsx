'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Search,
  GitCompare,
  BookOpen,
  Users,
  ArrowRight,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type AnexoType = 'A' | 'B' | 'C' | 'F';

interface AnexoProgress {
  type: AnexoType;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  color: string;
  progress: number;
  status: 'pending' | 'in-progress' | 'completed';
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AnexosDashboard() {
  const router = useRouter();
  const [anexosProgress, setAnexosProgress] = useState<AnexoProgress[]>([
    {
      type: 'A',
      title: 'Anexo A',
      description: 'Busca de Anterioridade (19 campos)',
      icon: <Search className="h-6 w-6" />,
      route: '/anexos/a',
      color: 'blue',
      progress: 0,
      status: 'pending',
    },
    {
      type: 'B',
      title: 'Anexo B',
      description: 'Matriz Problema x Solução (20 campos)',
      icon: <GitCompare className="h-6 w-6" />,
      route: '/anexos/b',
      color: 'purple',
      progress: 0,
      status: 'pending',
    },
    {
      type: 'C',
      title: 'Anexo C',
      description: 'Memorial Descritivo (18 campos)',
      icon: <BookOpen className="h-6 w-6" />,
      route: '/anexos/c',
      color: 'green',
      progress: 0,
      status: 'pending',
    },
    {
      type: 'F',
      title: 'Anexo F',
      description: 'Qualificação de Inventores (20 campos x N)',
      icon: <Users className="h-6 w-6" />,
      route: '/anexos/f',
      color: 'orange',
      progress: 0,
      status: 'pending',
    },
  ]);

  useEffect(() => {
    // Load progress from localStorage for each anexo
    const loadProgress = () => {
      const updated = anexosProgress.map((anexo) => {
        const storageKey = `anexo-${anexo.type.toLowerCase()}-rascunho`;
        const savedData = localStorage.getItem(storageKey);

        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            // Calculate progress based on filled fields
            const progress = calculateProgress(anexo.type, parsed);
            return {
              ...anexo,
              progress,
              status: (progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'pending') as 'pending' | 'in-progress' | 'completed',
            };
          } catch (e) {
            console.error(`Error parsing ${storageKey}:`, e);
          }
        }

        return anexo;
      });

      setAnexosProgress(updated);
    };

    loadProgress();
  }, []);

  const calculateProgress = (type: AnexoType, data: any): number => {
    // Simplified progress calculation
    // In a real implementation, this would check all required fields
    if (!data) return 0;

    const fields = Object.keys(data).filter((key) => {
      const value = data[key];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
      return value && value.toString().trim().length > 0;
    });

    // Approximate field counts per anexo
    const totalFields: Record<AnexoType, number> = {
      A: 19,
      B: 20,
      C: 18,
      F: 20, // Base count, varies by number of inventors
    };

    return Math.min(100, Math.round((fields.length / totalFields[type]) * 100));
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, any> = {
      blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        border: 'border-blue-200',
        hover: 'hover:border-blue-400 hover:bg-blue-50',
      },
      purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-600',
        border: 'border-purple-200',
        hover: 'hover:border-purple-400 hover:bg-purple-50',
      },
      green: {
        bg: 'bg-green-100',
        text: 'text-green-600',
        border: 'border-green-200',
        hover: 'hover:border-green-400 hover:bg-green-50',
      },
      orange: {
        bg: 'bg-orange-100',
        text: 'text-orange-600',
        border: 'border-orange-200',
        hover: 'hover:border-orange-400 hover:bg-orange-50',
      },
    };
    return colors[color] || colors.blue;
  };

  const getStatusBadge = (status: 'pending' | 'in-progress' | 'completed') => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-green-600">
            <CheckCircle2 className="h-3 w-3" />
            Concluído
          </span>
        );
      case 'in-progress':
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-yellow-600">
            <Clock className="h-3 w-3" />
            Em Progresso
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
            Pendente
          </span>
        );
    }
  };

  const completedCount = anexosProgress.filter((a) => a.status === 'completed').length;
  const overallProgress = Math.round(
    anexosProgress.reduce((acc, a) => acc + a.progress, 0) / anexosProgress.length
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
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
              <h1 className="text-2xl font-bold text-gray-900">Sistema de Anexos INPI</h1>
              <p className="text-sm text-gray-500">
                Anexos obrigatórios para o processo de patenteamento
              </p>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Progresso Geral</h2>
              <p className="text-sm text-gray-500">
                {completedCount} de {anexosProgress.length} anexos concluídos
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{overallProgress}%</div>
              <p className="text-xs text-gray-500">completo</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Recommended Flow */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-start gap-4">
            <TrendingUp className="h-6 w-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Fluxo Recomendado</h3>
              <p className="text-blue-100 mb-4">
                Siga a ordem recomendada para garantir preenchimento completo e evitar retrabalho:
              </p>
              <div className="flex items-center gap-3 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-lg font-medium">A</span>
                <ArrowRight className="h-4 w-4" />
                <span className="bg-white/20 px-3 py-1 rounded-lg font-medium">B</span>
                <ArrowRight className="h-4 w-4" />
                <span className="bg-white/20 px-3 py-1 rounded-lg font-medium">C</span>
                <ArrowRight className="h-4 w-4" />
                <span className="bg-white/20 px-3 py-1 rounded-lg font-medium">F</span>
              </div>
            </div>
          </div>
        </div>

        {/* Anexos Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {anexosProgress.map((anexo) => {
            const colorClasses = getColorClasses(anexo.color);

            return (
              <button
                key={anexo.type}
                onClick={() => router.push(anexo.route)}
                className={`bg-white border-2 rounded-xl p-6 text-left transition-all ${colorClasses.border} ${colorClasses.hover} hover:shadow-lg`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${colorClasses.bg} ${colorClasses.text}`}>
                    {anexo.icon}
                  </div>
                  {getStatusBadge(anexo.status)}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">{anexo.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{anexo.description}</p>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Progresso</span>
                    <span className="text-xs font-medium text-gray-700">{anexo.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        anexo.progress === 100
                          ? 'bg-green-500'
                          : anexo.progress > 0
                          ? 'bg-blue-500'
                          : 'bg-gray-400'
                      }`}
                      style={{ width: `${anexo.progress}%` }}
                    />
                  </div>
                </div>

                <div className={`flex items-center gap-1 text-sm ${colorClasses.text} font-medium`}>
                  {anexo.status === 'completed' ? 'Revisar' : 'Preencher'}
                  <ArrowRight className="h-4 w-4" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sobre os Anexos INPI
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-600" />
                Anexo A - Busca de Anterioridade
              </h4>
              <p className="text-sm text-gray-600">
                Comprova a novidade da invenção através de busca em bases de patentes (INPI,
                Espacenet, Google Patentes).
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <GitCompare className="h-4 w-4 text-purple-600" />
                Anexo B - Matriz Problema x Solução
              </h4>
              <p className="text-sm text-gray-600">
                Demonstra atividade inventiva através de comparação com soluções existentes e
                cálculo de melhoria percentual.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-green-600" />
                Anexo C - Memorial Descritivo
              </h4>
              <p className="text-sm text-gray-600">
                Documento técnico central do pedido de patente com descrição detalhada, figuras e
                reivindicações (mínimo 3).
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-orange-600" />
                Anexo F - Qualificação de Inventores
              </h4>
              <p className="text-sm text-gray-600">
                Define titularidade, obrigações legais e conformidade (SisGen, Financiamento,
                Declarações).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
