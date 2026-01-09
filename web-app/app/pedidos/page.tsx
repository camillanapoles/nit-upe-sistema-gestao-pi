'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  Filter,
  Plus,
  Search,
  Eye,
} from 'lucide-react';
import {
  getPedidos,
  deletePedido,
  TipoPatente,
  StatusPedido,
  type Pedido,
} from '@/lib/pedido-storage';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PedidosDashboard() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = () => {
    const todos = getPedidos();
    setPedidos(todos.sort((a, b) => b.dataCriacao.getTime() - a.dataCriacao.getTime()));
  };

  const pedidosFiltrados = pedidos.filter((p) => {
    const matchTipo = filtroTipo === 'todos' || p.tipo === filtroTipo;
    const matchStatus = filtroStatus === 'todos' || p.status === filtroStatus;
    const matchBusca =
      !busca ||
      p.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      p.pedidoId.toLowerCase().includes(busca.toLowerCase());
    return matchTipo && matchStatus && matchBusca;
  });

  const handleDelete = async (id: string, titulo: string) => {
    if (confirm(`Tem certeza que deseja excluir o pedido "${titulo}"?`)) {
      deletePedido(id);
      loadPedidos();
    }
  };

  const handleContinuar = (pedido: Pedido) => {
    // Redireciona para o formulário apropriado
    switch (pedido.tipo) {
      case TipoPatente.PI:
      case TipoPatente.MU:
        router.push(`/formulario-pi-mu?pedidoId=${pedido.pedidoId}`);
        break;
      case TipoPatente.CII:
        router.push(`/formulario-cii?pedidoId=${pedido.pedidoId}`);
        break;
      case TipoPatente.RPC:
        router.push(`/formulario-rpc?pedidoId=${pedido.pedidoId}`);
        break;
    }
  };

  const getStatusBadge = (status: StatusPedido) => {
    switch (status) {
      case StatusPedido.SUBMETIDO:
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
            <CheckCircle2 className="h-3 w-3" />
            Submetido
          </span>
        );
      case StatusPedido.RASCUNHO:
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
            <Clock className="h-3 w-3" />
            Rascunho
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
            {status}
          </span>
        );
    }
  };

  const getTipoBadge = (tipo: TipoPatente) => {
    const cores: Record<TipoPatente, string> = {
      [TipoPatente.PI]: 'bg-blue-100 text-blue-800',
      [TipoPatente.MU]: 'bg-green-100 text-green-800',
      [TipoPatente.CII]: 'bg-purple-100 text-purple-800',
      [TipoPatente.RPC]: 'bg-orange-100 text-orange-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${cores[tipo]}`}>
        {tipo}
      </span>
    );
  };

  const getAnexosProgress = (pedido: Pedido) => {
    const obrigatorios = ['a', 'b', 'c'] as const;
    const completos = obrigatorios.filter((t) => pedido.anexosCompletos[t]).length;
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              completos === 3 ? 'bg-green-500' : completos > 0 ? 'bg-yellow-500' : 'bg-gray-400'
            }`}
            style={{ width: `${(completos / 3) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-600">{completos}/3</span>
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-3 rounded-xl">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Meus Pedidos</h1>
                <p className="text-sm text-gray-500">
                  Gerencie seus pedidos de patente e rascunhos
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Novo Pedido
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-2xl font-bold text-gray-900">{pedidos.length}</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-sm text-gray-500">Rascunhos</div>
            <div className="text-2xl font-bold text-yellow-600">
              {pedidos.filter((p) => p.status === StatusPedido.RASCUNHO).length}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-sm text-gray-500">Submetidos</div>
            <div className="text-2xl font-bold text-green-600">
              {pedidos.filter((p) => p.status === StatusPedido.SUBMETIDO).length}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-sm text-gray-500">Anexos Completos</div>
            <div className="text-2xl font-bold text-blue-600">
              {pedidos.filter((p) => {
                const completos = Object.values(p.anexosCompletos).filter(Boolean).length;
                return completos >= 3;
              }).length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filtros:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos os tipos</option>
                <option value={TipoPatente.PI}>PI</option>
                <option value={TipoPatente.MU}>MU</option>
                <option value={TipoPatente.CII}>CII</option>
                <option value={TipoPatente.RPC}>RPC</option>
              </select>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos os status</option>
                <option value={StatusPedido.RASCUNHO}>Rascunho</option>
                <option value={StatusPedido.SUBMETIDO}>Submetido</option>
              </select>
            </div>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por título ou ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Pedidos List */}
        {pedidosFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum pedido encontrado
            </h3>
            <p className="text-gray-500 mb-6">
              {pedidos.length === 0
                ? 'Comece criando seu primeiro pedido de patente'
                : 'Tente ajustar os filtros ou a busca'}
            </p>
            {pedidos.length === 0 && (
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Criar Pedido
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {pedidosFiltrados.map((pedido) => (
              <div
                key={pedido.id}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getTipoBadge(pedido.tipo)}
                      {getStatusBadge(pedido.status)}
                      {pedido.protocolo && (
                        <span className="text-xs text-gray-500">
                          Protocolo: <span className="font-mono">{pedido.protocolo}</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {pedido.titulo}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span>ID: {pedido.pedidoId}</span>
                      <span>Criado em: {formatDate(pedido.dataCriacao)}</span>
                      {pedido.dataSubmissao && (
                        <span>Submetido em: {formatDate(pedido.dataSubmissao)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">Anexos:</span>
                      {getAnexosProgress(pedido)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {pedido.status === StatusPedido.RASCUNHO ? (
                      <>
                        <button
                          onClick={() => handleContinuar(pedido)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          <Eye className="h-4 w-4" />
                          Continuar
                        </button>
                        <button
                          onClick={() => handleDelete(pedido.id, pedido.titulo)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => router.push(`/anexos?pedidoId=${pedido.pedidoId}`)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                      >
                        <Eye className="h-4 w-4" />
                        Ver Detalhes
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
