// POST /api/auth/register - Registro de novo usuário

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validateRequest, RegisterSchema, successResponse, errorResponse } from '@/lib/validations';
import { createUser } from '@/lib/auth';
import { HTTP_STATUS } from '@/lib/middleware';

/**
 * POST /api/auth/register
 * Registra um novo usuário no sistema
 *
 * Body:
 * - email: string (email válido, único)
 * - nome: string (mínimo 3 caracteres)
 * - senha: string (mínimo 8 caracteres, maiúscula, minúscula, número)
 * - confirmarSenha: string (deve ser igual a senha)
 * - cpf: string (opcional, único)
 * - telefone: string (opcional)
 * - departamento: string (opcional)
 * - role: 'INVENTOR' | 'AVALIADOR' | 'ADMIN' (opcional, default: INVENTOR)
 *
 * Nota: Em produção, o role padrão deve ser sempre INVENTOR.
 * Apenas administradores podem promover usuários para outros roles.
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const validation = await validateRequest(RegisterSchema, body);

    if (!validation.success) {
      return NextResponse.json(validation, { status: HTTP_STATUS.BAD_REQUEST });
    }

    const { email, nome, senha, cpf, telefone, departamento, role } = validation.data;

    // Verificar se email já existe
    const existingUserByEmail = await prisma.usuario.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        errorResponse('CONFLICT', 'Email já cadastrado', { email: 'Email já cadastrado' }),
        { status: HTTP_STATUS.CONFLICT }
      );
    }

    // Verificar se CPF já existe (se fornecido)
    if (cpf) {
      const existingUserByCpf = await prisma.usuario.findUnique({
        where: { cpf },
      });

      if (existingUserByCpf) {
        return NextResponse.json(
          errorResponse('CONFLICT', 'CPF já cadastrado', { cpf: 'CPF já cadastrado' }),
          { status: HTTP_STATUS.CONFLICT }
        );
      }
    }

    // Em produção, apenas INVENTOR pode ser criado via registro público
    const userRole = process.env.NODE_ENV === 'production' ? 'INVENTOR' : (role || 'INVENTOR');

    // Create user
    const user = await createUser({
      email,
      nome,
      senha,
      role: userRole,
      cpf,
      telefone,
      departamento,
    });

    return NextResponse.json(successResponse(user), { status: HTTP_STATUS.CREATED });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return NextResponse.json(
      errorResponse('INTERNAL_ERROR', 'Erro ao registrar usuário'),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
