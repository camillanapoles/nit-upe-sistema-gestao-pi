// POST /api/auth/login - Autenticação de usuário

import { NextRequest, NextResponse } from 'next/server';
import { validateRequest, LoginSchema, successResponse, errorResponse } from '@/lib/validations';
import { findUserByEmail, verifyPassword, generateToken, updateLastLogin } from '@/lib/auth';
import { HTTP_STATUS } from '@/lib/middleware';

/**
 * POST /api/auth/login
 * Autentica um usuário e retorna um token JWT
 *
 * Body:
 * - email: string
 * - senha: string
 *
 * Response:
 * - success: true
 * - data: {
 *     user: { id, email, nome, role, ... },
 *     token: string
 *   }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const validation = await validateRequest(LoginSchema, body);

    if (!validation.success) {
      return NextResponse.json(validation, { status: HTTP_STATUS.BAD_REQUEST });
    }

    const { email, senha } = validation.data;

    // Find user
    const user = await findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        errorResponse('UNAUTHORIZED', 'Credenciais inválidas'),
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    // Check if user is active
    if (!user.ativo) {
      return NextResponse.json(
        errorResponse('FORBIDDEN', 'Usuário desativado. Entre em contato com o administrador.'),
        { status: HTTP_STATUS.FORBIDDEN }
      );
    }

    // Verify password
    const passwordValid = await verifyPassword(senha, user.senha);

    if (!passwordValid) {
      return NextResponse.json(
        errorResponse('UNAUTHORIZED', 'Credenciais inválidas'),
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    // Update last login
    await updateLastLogin(user.id);

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Return user and token (without password)
    const { senha: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      successResponse({
        user: userWithoutPassword,
        token,
      }),
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return NextResponse.json(
      errorResponse('INTERNAL_ERROR', 'Erro ao fazer login'),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
