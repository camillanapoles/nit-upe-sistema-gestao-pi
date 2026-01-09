'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  Edit,
  Search,
  GitCompare,
  BookOpen,
  Users,
  Send,
} from 'lucide-react';
import {
  getPedidoByPedidoId,
  submeterPedido,
  TipoPatente,
  type Pedido,
} from '@/lib/pedido-storage';

// ============================================================================
// INNER COMPONENT (with useSearchParams)
// ============================================================================

function ConfirmacaoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pedidoId = searchParams.get('pedidoId');

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [anexosData, setAnexosData] = useState<{
    a: any;
    b: any;
    c: any;
    f: any;
  }>({ a: null, b: null, c: null, f: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pedidoId) {
      router.push('/');
      return;
    }

    const p = getPedidoByPedidoId(pedidoId);
    if (!p) {
      setError('Pedido não encontrado');
      return;
    }
    setPedido(p);

    // Carregar status dos anexos
    setAnexosData({ a: p.anexos.a, b: p.anexos.b, c: p.anexos.c, f: p.anexos.f });
  }, [pedidoId, router]);

  const getAnexoStatus = (tipo: 'a' | 'b' | 'c' | 'f') => {
    const completo = pedido?.anexosCompletos[tipo];

    if (completo) {
      return (
        <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
          <CheckCircle2 className="h-3 w-3" />
          Completo
        </span>
      );
    }

    return (
      <span className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
        Pendente
      </span>
    );
  };

  const anexosObrigatoriosCompletos = pedido
    ? ['a', 'b', 'c'].filter(t => pedido.anexosCompletos[t as keyof typeof pedido.anexosCompletos]).length
    : 0;

  const handleSubmit = async () => {
    if (!confirmado || !pedido) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const resultado = submeterPedido(pedido.pedidoId);

      if (!resultado.success) {
        setError(resultado.error || 'Erro ao submeter pedido');
        setIsSubmitting(false);
        return;
      }

      router.push(
        `/sucesso?pedidoId=${pedido.pedidoId}&protocolo=${resultado.protocolo}&tipo=${pedido.tipo}`
      );
    } catch (e) {
      setError('Erro ao submeter pedido. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  const editarAnexo = (tipo: string) => {
    router.push(`/anexos/${tipo}?pedidoId=${pedidoId}`);
  };

  const editarFormulario = () => {
    if (!pedido) return;

    switch (pedido.tipo) {
      case TipoPatente.PI:
      case TipoPatente.MU:
        router.push(`/formulario-pi-mu?pedidoId=${pedidoId}`);
        break;
      case TipoPatente.CII:
        router.push(`/formulario-cii?pedidoId=${pedidoId}`);
        break;
      case TipoPatente.RPC:
        router.push(`/formulario-rpc?pedidoId=${pedidoId}`);
        break;
    }
  };

  if (!pedido) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">{error || 'Carregando...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-3 rounded-xl">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Revisão e Submissão</h1>
              <p className="text-sm text-gray-500">
                Revise todos os dados antes de submeter seu pedido
              </p>
            </div>
          </div>
        </div>

        {/* Alerta - Anexos Obrigatórios */}
        {anexosObrigatoriosCompletos < 3 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800">Anexos Obrigatórios Incompletos</h4>
              <p className="text-sm text-red-700">
                Você precisa completar os Anexos A, B e C antes de submeter o pedido.
                {anexosObrigatoriosCompletos > 0 && ` (${anexosObrigatoriosCompletos}/3 completos)`}
              </p>
            </div>
          </div>
        )}

        {/* Resumo do Formulário */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Dados do Formulário</h2>
            <button
              onClick={editarFormulario}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
            >
              <Edit className="h-4 w-4" />
              Editar
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-500 uppercase">Tipo</span>
              <p className="font-medium">{pedido.tipo}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase">ID</span>
              <p className="font-mono text-sm">{pedido.pedidoId}</p>
            </div>
            <div className="md:col-span-2">
              <span className="text-xs text-gray-500 uppercase">Título</span>
              <p className="font-medium">{pedido.titulo}</p>
            </div>
            {pedido.formData.problema && (
              <div className="md:col-span-2">
                <span className="text-xs text-gray-500 uppercase">Problema</span>
                <p className="text-sm text-gray-700 line-clamp-2">{pedido.formData.problema}</p>
              </div>
            )}
          </div>
        </div>

        {/* Status dos Anexos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status dos Anexos</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Anexo A */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Anexo A</span>
                </div>
                {getAnexoStatus('a')}
              </div>
              <p className="text-xs text-gray-500">Busca de Anterioridade</p>
            </div>

            {/* Anexo B */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <GitCompare className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Anexo B</span>
                </div>
                {getAnexoStatus('b')}
              </div>
              <p className="text-xs text-gray-500">Matriz Problema x Solução</p>
            </div>

            {/* Anexo C */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Anexo C</span>
                </div>
                {getAnexoStatus('c')}
              </div>
              <p className="text-xs text-gray-500">Memorial Descritivo</p>
            </div>

            {/* Anexo F */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-600" />
                  <span className="font-medium">Anexo F</span>
                </div>
                {getAnexoStatus('f')}
              </div>
              <p className="text-xs text-gray-500">Qualificação de Inventores</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              <span className="text-red-600 font-medium">*</span> Anexos A, B e C são obrigatórios para submissão
            </p>
          </div>
        </div>

        {/* Confirmação */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Declaração</h2>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={confirmado}
              onChange={(e) => setConfirmado(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              Declaro que todas as informações fornecidas são verdadeiras e autorizo o NIT/UPE a
              processar este pedido de patente. Entendo que informações falsas podem resultar na
              rejeição do pedido e em sanções legais.
            </span>
          </label>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800">Erro</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Voltar e Editar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!confirmado || anexosObrigatoriosCompletos < 3 || isSubmitting}
            className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Processando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submeter Pedido
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT (with Suspense)
// ============================================================================

export default function ConfirmacaoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4 flex items-center justify-center">
        <div className="text-center text-gray-600">Carregando...</div>
      </div>
    }>
      <ConfirmacaoContent />
    </Suspense>
  );
}
