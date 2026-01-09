// GET /api/auth/me - Perfil do usuário autenticado

import { NextRequest, NextResponse } from 'next/server';
import { findUserById, generateToken } from '@/lib/auth';
import { authenticateRequest, HTTP_STATUS } from '@/lib/middleware';
import { successResponse, errorResponse } from '@/lib/validations';
import { prisma } from '@/lib/db';

/**
 * GET /api/auth/me
 * Retorna os dados do usuário autenticado
 *
 * Headers:
 * - Authorization: Bearer <token>
 *
 * Response:
 * - success: true
 * - data: { user }
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await authenticateRequest(request);

    // Verificar se é erro
    if ('success' in authResult) {
      return NextResponse.json(authResult, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    // Se não for erro, tem userId
    const { userId, email, role } = authResult;

    // Buscar usuário completo
    const user = await findUserById(userId);

    if (!user) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Usuário não encontrado'),
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    // Buscar estatísticas do usuário
    const [totalPedidos, pedidosRecentes] = await Promise.all([
      // Total de pedidos do usuário
      prisma.pedido.count({
        where: { inventorId: user.id },
      }),
      // Pedidos recentes (últimos 5)
      prisma.pedido.findMany({
        where: { inventorId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          numeroPedido: true,
          titulo: true,
          tipo: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json(
      successResponse({
        user,
        stats: {
          totalPedidos,
          pedidosRecentes,
        },
      }),
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return NextResponse.json(
      errorResponse('INTERNAL_ERROR', 'Erro ao buscar perfil'),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
