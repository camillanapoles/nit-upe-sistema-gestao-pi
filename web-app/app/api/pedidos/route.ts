// GET /api/pedidos - Listar pedidos de patente
// POST /api/pedidos - Criar novo pedido de patente

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validateRequest, CriarPedidoSchema, PedidoQuerySchema, successResponse, errorResponse } from '@/lib/validations';
import { authenticateRequest, HTTP_STATUS } from '@/lib/middleware';
import { TipoPatente, StatusPedido, FaseAtual } from '@prisma/client';

/**
 * GET /api/pedidos
 * Lista pedidos de patente com suporte a filtros e paginação
 *
 * Query params:
 * - page: número da página (default: 1)
 * - limit: itens por página (default: 20, max: 100)
 * - status: filtra por status (RASCUNHO, SUBMETIDO, etc.)
 * - tipo: filtra por tipo (PI, MU, CII, RPC)
 * - inventorId: filtra por inventor
 * - search: busca por título ou palavras-chave
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const queryValidation = await validateRequest(
      PedidoQuerySchema,
      Object.fromEntries(searchParams)
    );

    if (!queryValidation.success) {
      return NextResponse.json(queryValidation, { status: HTTP_STATUS.BAD_REQUEST });
    }

    const { page, limit, status, tipo, inventorId, search } = queryValidation.data;

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status as StatusPedido;
    }

    if (tipo) {
      where.tipo = tipo as TipoPatente;
    }

    if (inventorId) {
      where.inventorId = inventorId;
    }

    if (search) {
      where.OR = [
        { titulo: { contains: search, mode: 'insensitive' } },
        { palavrasChave: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Count total records
    const total = await prisma.pedido.count({ where });

    // Fetch paginated data
    const skip = (page - 1) * limit;
    const pedidos = await prisma.pedido.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        inventor: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        _count: {
          select: { anexos: true },
        },
      },
    });

    return NextResponse.json(
      successResponse({
        pedidos,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      }),
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    return NextResponse.json(
      errorResponse('INTERNAL_ERROR', 'Erro ao listar pedidos'),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

/**
 * POST /api/pedidos
 * Cria um novo pedido de patente
 *
 * Headers:
 * - Authorization: Bearer <token> (opcional para rascunhos)
 *
 * Body: conforme CriarPedidoSchema
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const validation = await validateRequest(CriarPedidoSchema, body);

    if (!validation.success) {
      return NextResponse.json(validation, { status: HTTP_STATUS.BAD_REQUEST });
    }

    // Verificar autenticação (opcional para rascunhos, mas recomendado)
    const authResult = await authenticateRequest(request);
    const inventorId = 'userId' in authResult ? authResult.userId : null;

    // Gerar número do pedido
    const year = new Date().getFullYear();
    const count = await prisma.pedido.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${year + 1}-01-01`),
        },
      },
    });
    const numeroPedido = `PED-${year}-${String(count + 1).padStart(4, '0')}`;

    // Create pedido
    const pedido = await prisma.pedido.create({
      data: {
        numeroPedido,
        tipo: validation.data.tipo as TipoPatente,
        titulo: validation.data.titulo,
        problema: validation.data.problema,
        solucao: validation.data.solucao,
        estadoTecnica: validation.data.estadoTecnica,
        vantagens: validation.data.vantagens,
        palavrasChave: validation.data.palavrasChave,
        resumo: validation.data.resumo,
        faseAtual: FaseAtual.PREPARACAO,
        status: StatusPedido.RASCUNHO,
        inventorId,
      },
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

    // Adicionar entrada no histórico
    await prisma.historico.create({
      data: {
        pedidoId: pedido.id,
        acao: 'CRIADO',
        valorNovo: `Pedido criado com status ${pedido.status}`,
        createdBy: inventorId,
      },
    });

    return NextResponse.json(successResponse(pedido), { status: HTTP_STATUS.CREATED });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return NextResponse.json(
      errorResponse('INTERNAL_ERROR', 'Erro ao criar pedido'),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
