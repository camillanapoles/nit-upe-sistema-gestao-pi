'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  FileText,
  Download,
  Home,
  FolderOpen,
} from 'lucide-react';

// ============================================================================
// INNER COMPONENT (with useSearchParams)
// ============================================================================

function SucessoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [confettiActive, setConfettiActive] = useState(true);

  const pedidoId = searchParams.get('pedidoId') || 'N/A';
  const protocolo = searchParams.get('protocolo') || 'N/A';
  const tipo = searchParams.get('tipo') || 'PI';

  useEffect(() => {
    const timer = setTimeout(() => setConfettiActive(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadComprovante = () => {
    const content = `
COMPROVANTE DE SUBMISSÃO
========================

Protocolo: ${protocolo}
Pedido ID: ${pedidoId}
Tipo: ${tipo}
Data: ${new Date().toLocaleString('pt-BR')}

STATUS: SUBMETIDO ✓

Este comprovante atesta que o pedido foi submetido com sucesso
ao NIT/UPE e está em análise técnica.

---
Núcleo de Inovação Tecnológica (NIT)
Universidade de Pernambuco (UPE)
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprovante-${pedidoId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 px-4 flex items-center justify-center">
      {confettiActive && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'][
                  Math.floor(Math.random() * 5)
                ],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pedido Submetido com Sucesso!
          </h1>
          <p className="text-gray-600 mb-8">
            Seu pedido foi recebido pelo NIT/UPE e está em análise
          </p>

          <div className="bg-green-50 rounded-xl p-6 mb-8 border border-green-200">
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div>
                <span className="text-xs text-gray-500 uppercase">Protocolo</span>
                <p className="text-xl font-bold text-green-800 font-mono">{protocolo}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase">Pedido ID</span>
                <p className="text-xl font-bold text-gray-800 font-mono">{pedidoId}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase">Tipo</span>
                <p className="text-lg font-medium text-gray-800">{tipo}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase">Data</span>
                <p className="text-lg font-medium text-gray-800">
                  {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Próximos Passos
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Você receberá um email de confirmação em breve</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">→</span>
                <span>Seu pedido será analisado pela equipe técnica do NIT</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">→</span>
                <span>Você será notificado sobre o resultado da análise</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">→</span>
                <span>Acompanhe o status do seu pedido na seção "Meus Pedidos"</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDownloadComprovante}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              Download Comprovante
            </button>
            <button
              onClick={() => router.push('/pedidos')}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <FolderOpen className="h-4 w-4" />
              Ver Meus Pedidos
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <Home className="h-4 w-4" />
              Voltar ao Início
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Para dúvidas, entre em contato com o{' '}
          <a href="mailto:nit@upe.br" className="text-blue-600 hover:underline">
            nit@upe.br
          </a>
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT (with Suspense)
// ============================================================================

export default function SucessoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 px-4 flex items-center justify-center">
        <div className="text-center text-gray-600">Carregando...</div>
      </div>
    }>
      <SucessoContent />
    </Suspense>
  );
}
