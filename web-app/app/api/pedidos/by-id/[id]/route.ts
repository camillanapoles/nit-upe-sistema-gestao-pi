// GET /api/pedidos/by-id/[id] - Detalhes de um pedido
// PUT /api/pedidos/by-id/[id] - Atualizar pedido
// DELETE /api/pedidos/by-id/[id] - Deletar pedido

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validateRequest, AtualizarPedidoSchema, successResponse, errorResponse } from '@/lib/validations';
import { authenticateRequest, requireRole, HTTP_STATUS } from '@/lib/middleware';
import { StatusPedido } from '@prisma/client';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/pedidos/by-id/[id]
 * Retorna os detalhes de um pedido específico
 */
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        inventor: {
          select: {
            id: true,
            nome: true,
            email: true,
            departamento: true,
          },
        },
        anexos: true,
        historico: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    });

    if (!pedido) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Pedido não encontrado'),
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    return NextResponse.json(successResponse(pedido), { status: HTTP_STATUS.OK });
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    return NextResponse.json(
      errorResponse('INTERNAL_ERROR', 'Erro ao buscar pedido'),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

/**
 * PUT /api/pedidos/by-id/[id]
 * Atualiza um pedido existente
 *
 * Headers:
 * - Authorization: Bearer <token> (obrigatório)
 *
 * Body: campos parciais do pedido (conforme AtualizarPedidoSchema)
 */
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    // Verificar autenticação
    const authResult = await authenticateRequest(request);

    // Verificar se é erro
    if ('success' in authResult) {
      return NextResponse.json(authResult, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    // Se não for erro, tem userId
    const { userId, role } = authResult;

    // Verificar se o pedido existe
    const pedido = await prisma.pedido.findUnique({
      where: { id },
    });

    if (!pedido) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Pedido não encontrado'),
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    // Verificar permissão: apenas o inventor ou admin/avaliador pode editar
    const isInventor = pedido.inventorId === userId;
    const canEdit = isInventor || requireRole(['ADMIN', 'AVALIADOR'], role);

    if (!canEdit) {
      return NextResponse.json(
        errorResponse('FORBIDDEN', 'Você não tem permissão para editar este pedido'),
        { status: HTTP_STATUS.FORBIDDEN }
      );
    }

    // Verificar se o pedido pode ser editado (não depositado)
    if (pedido.status === StatusPedido.DEPOSITADO) {
      return NextResponse.json(
        errorResponse('FORBIDDEN', 'Pedidos depositados não podem ser editados'),
        { status: HTTP_STATUS.FORBIDDEN }
      );
    }

    // Parse e validar request body
    const body = await request.json();
    const validation = await validateRequest(AtualizarPedidoSchema, body);

    if (!validation.success) {
      return NextResponse.json(validation, { status: HTTP_STATUS.BAD_REQUEST });
    }

    // Build update data (only include fields that are provided)
    const updateData: any = {};
    const allowedFields = [
      'tipo', 'titulo', 'problema', 'solucao', 'estadoTecnica',
      'vantagens', 'palavrasChave', 'resumo', 'status', 'faseAtual'
    ];

    for (const field of allowedFields) {
      if (field in validation.data) {
        (updateData as any)[field] = validation.data[field as keyof typeof validation.data];
      }
    }

    // Update pedido
    const updatedPedido = await prisma.pedido.update({
      where: { id },
      data: updateData,
      include: {
        inventor: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });

    // Adicionar entradas no histórico para campos alterados
    for (const [key, value] of Object.entries(updateData)) {
      await prisma.historico.create({
        data: {
          pedidoId: id,
          acao: 'ATUALIZADO',
          campo: key,
          valorNovo: String(value),
          createdBy: userId,
        },
      });
    }

    return NextResponse.json(successResponse(updatedPedido), { status: HTTP_STATUS.OK });
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    return NextResponse.json(
      errorResponse('INTERNAL_ERROR', 'Erro ao atualizar pedido'),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

/**
 * DELETE /api/pedidos/by-id/[id]
 * Deleta um pedido (soft delete via status ou hard delete)
 *
 * Headers:
 * - Authorization: Bearer <token> (obrigatório)
 *
 * Nota: Apenas rascunhos podem ser deletados. Pedidos em análise devem ser
 * marcados como REPROVADO ao invés de deletados.
 */
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    // Verificar autenticação
    const authResult = await authenticateRequest(request);

    // Verificar se é erro
    if ('success' in authResult) {
      return NextResponse.json(authResult, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    // Se não for erro, tem userId
    const { userId, role } = authResult;

    // Verificar se o pedido existe
    const pedido = await prisma.pedido.findUnique({
      where: { id },
    });

    if (!pedido) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Pedido não encontrado'),
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    // Verificar permissão: apenas o inventor ou admin pode deletar
    const isInventor = pedido.inventorId === userId;
    const canDelete = isInventor || requireRole(['ADMIN'], role);

    if (!canDelete) {
      return NextResponse.json(
        errorResponse('FORBIDDEN', 'Você não tem permissão para deletar este pedido'),
        { status: HTTP_STATUS.FORBIDDEN }
      );
    }

    // Apenas rascunhos podem ser deletados
    if (pedido.status !== StatusPedido.RASCUNHO) {
      return NextResponse.json(
        errorResponse('FORBIDDEN', 'Apenas pedidos em rascunho podem ser deletados'),
        { status: HTTP_STATUS.FORBIDDEN }
      );
    }

    // Hard delete (remove do banco)
    await prisma.pedido.delete({
      where: { id },
    });

    return NextResponse.json(
      successResponse({ message: 'Pedido deletado com sucesso' }),
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    console.error('Erro ao deletar pedido:', error);
    return NextResponse.json(
      errorResponse('INTERNAL_ERROR', 'Erro ao deletar pedido'),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
