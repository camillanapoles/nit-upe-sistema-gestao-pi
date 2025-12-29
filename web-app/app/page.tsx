'use client';

import { useState, useEffect } from 'react';
import { FileText, TrendingUp, Users, Clock, CheckCircle, Zap, Shield, ArrowRight } from 'lucide-react';
import { apiObterEstatisticas, apiListarPedidos, TipoPatente } from '@/lib/mock-api';

export default function HomePage() {
  const [stats, setStats] = useState<any>(null);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const [estatisticas, listaPedidos] = await Promise.all([
        apiObterEstatisticas(),
        apiListarPedidos()
      ]);
      setStats(estatisticas);
      setPedidos(listaPedidos);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-blue-600 font-semibold">Carregando Sistema...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">NIT/UPE</h1>
                <p className="text-sm text-gray-500">Sistema de Gestão de Propriedade Intelectual</p>
              </div>
            </div>
            <nav className="flex space-x-4">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                Dashboard
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Novo Pedido
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            Projeto Crush - Engenharia de Contexto
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema Integral de Gestão de Propriedade Intelectual
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transformando o NIT/UPE em referência nacional em patentes de alta qualidade
            através de um sistema de ponta-a-ponta com auto-preenchimento inteligente.
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <KPICard
            icon={<TrendingUp className="h-6 w-6 text-green-600" />}
            label="Redução de Retrabalho"
            value={`${stats.kpis.reducaoRetrabalho}%`}
            color="green"
          />
          <KPICard
            icon={<Users className="h-6 w-6 text-blue-600" />}
            label="Satisfação UX"
            value={`${stats.kpis.satisfacaoUX}%`}
            color="blue"
          />
          <KPICard
            icon={<Clock className="h-6 w-6 text-purple-600" />}
            label="Primeira Devolutiva"
            value={`${stats.kpis.tempoPrimeiraDevolutiva} dias`}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <KPICard
            icon={<CheckCircle className="h-6 w-6 text-green-600" />}
            label="Taxa de Aprovação"
            value={`${stats.kpis.taxaAprovacaoEntrada}%`}
            color="green"
          />
          <KPICard
            icon={<Zap className="h-6 w-6 text-yellow-600" />}
            label="Tempo de Redação"
            value={`-${stats.kpis.tempoReducaoRedacao}%`}
            color="yellow"
          />
          <KPICard
            icon={<Shield className="h-6 w-6 text-blue-600" />}
            label="Taxa Deferimento INPI"
            value={`+${stats.kpis.taxaDeferimentoINPI - 50}%`}
            color="blue"
          />
        </div>

        {/* Pedidos Recentes */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Pedidos Recentes</h3>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protocolo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fase</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {pedido.protocolo || pedido.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <TipoPatenteBadge tipo={pedido.tipo} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                      {pedido.titulo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <FaseBadge fase={pedido.faseAtual} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={pedido.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Comece seu pedido de patente agora
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Nosso sistema com auto-preenchimento inteligente reduz o tempo de escrita
            em 50% e aumenta suas chances de aprovação.
          </p>
          <button className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
            Criar Novo Pedido
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </section>
    </div>
  );
}

function KPICard({ icon, label, value, color }: any) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <span className="text-3xl font-bold text-gray-900">{value}</span>
      </div>
      <h4 className="text-lg font-semibold text-gray-900 mb-2">{label}</h4>
      <p className="text-sm text-gray-500">Indicador de performance do sistema</p>
    </div>
  );
}

function TipoPatenteBadge({ tipo }: { tipo: string }) {
  const tipos: any = {
    PI: { label: 'PI', color: 'bg-blue-100 text-blue-800' },
    MU: { label: 'MU', color: 'bg-green-100 text-green-800' },
    CII: { label: 'CII', color: 'bg-purple-100 text-purple-800' },
    RPC: { label: 'RPC', color: 'bg-orange-100 text-orange-800' },
  };
  
  const { label, color } = tipos[tipo] || { label: tipo, color: 'bg-gray-100 text-gray-800' };
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded ${color}`}>
      {label}
    </span>
  );
}

function FaseBadge({ fase }: { fase: number }) {
  const fases: any = {
    1: { label: 'Preparação', color: 'bg-gray-100 text-gray-800' },
    2: { label: 'Submissão', color: 'bg-blue-100 text-blue-800' },
    3: { label: 'Análise', color: 'bg-yellow-100 text-yellow-800' },
    4: { label: 'Formalização', color: 'bg-purple-100 text-purple-800' },
    5: { label: 'Robustez', color: 'bg-green-100 text-green-800' },
  };
  
  const { label, color } = fases[fase] || { label: `Fase ${fase}`, color: 'bg-gray-100 text-gray-800' };
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded ${color}`}>
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statuses: any = {
    RASCUNHO: { label: 'Rascunho', color: 'bg-gray-100 text-gray-800' },
    EM_ANALISE: { label: 'Em Análise', color: 'bg-yellow-100 text-yellow-800' },
    APROVADO: { label: 'Aprovado', color: 'bg-green-100 text-green-800' },
    COM_RESSALVAS: { label: 'Com Ressalvas', color: 'bg-orange-100 text-orange-800' },
    REPROVADO: { label: 'Reprovado', color: 'bg-red-100 text-red-800' },
    DEPOSITADO: { label: 'Depositado', color: 'bg-blue-100 text-blue-800' },
  };
  
  const { label, color } = statuses[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  
  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${color}`}>
      {label}
    </span>
  );
}
