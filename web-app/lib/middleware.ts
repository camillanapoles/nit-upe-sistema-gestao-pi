// Middleware de Autenticação para API Routes

import { NextRequest } from 'next/server';
import { extractTokenFromHeader, verifyToken, findUserById } from './auth';
import { errorResponse } from './validations';
import type { ApiErrorResponse } from './validations';

/**
 * Middleware de autenticação para API Routes
 * Extrai o token JWT do cabeçalho Authorization e retorna o usuário autenticado
 */
export async function authenticateRequest(
  request: NextRequest
): Promise<{ userId: string; email: string; role: string } | ApiErrorResponse> {
  const authHeader = request.headers.get('authorization');
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return errorResponse('UNAUTHORIZED', 'Token de autenticação não fornecido');
  }

  const payload = verifyToken(token);
  if (!payload) {
    return errorResponse('UNAUTHORIZED', 'Token inválido ou expirado');
  }

  // Verificar se o usuário ainda existe e está ativo
  const user = await findUserById(payload.userId);
  if (!user) {
    return errorResponse('UNAUTHORIZED', 'Usuário não encontrado');
  }

  if (!user.ativo) {
    return errorResponse('FORBIDDEN', 'Usuário desativado');
  }

  return {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
}

/**
 * Middleware para verificar se o usuário tem permissão (role-based)
 */
export function requireRole(allowedRoles: string[], userRole: string): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Tipos de erro HTTP para respostas consistentes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;
