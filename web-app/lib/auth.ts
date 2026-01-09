// Autenticação JWT para o Sistema de Gestão de Propriedade Intelectual UPE

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from './db';

// Interfaces
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthUser extends JWTPayload {
  iat: number;
  exp: number;
}

// Configurações JWT
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Gera um token JWT para um usuário
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

/**
 * Verifica e decodifica um token JWT
 */
export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch (error) {
    return null;
  }
}

/**
 * Decodifica um token sem verificar (para leitura do payload)
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Hasheia uma senha usando bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verifica se uma senha corresponde ao hash armazenado
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Busca um usuário por email (para login)
 */
export async function findUserByEmail(email: string) {
  return prisma.usuario.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      nome: true,
      role: true,
      senha: true, // Necessário para verificação de senha
      cpf: true,
      telefone: true,
      departamento: true,
      instituicao: true,
      ativo: true,
      ultimoLoginAt: true,
      createdAt: true,
    },
  });
}

/**
 * Busca um usuário por ID (para requisições autenticadas)
 */
export async function findUserById(id: string) {
  return prisma.usuario.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      nome: true,
      role: true,
      cpf: true,
      telefone: true,
      departamento: true,
      instituicao: true,
      ativo: true,
      ultimoLoginAt: true,
      createdAt: true,
    },
  });
}

/**
 * Atualiza o último login do usuário
 */
export async function updateLastLogin(userId: string): Promise<void> {
  await prisma.usuario.update({
    where: { id: userId },
    data: { ultimoLoginAt: new Date() },
  });
}

/**
 * Cria um novo usuário
 */
export async function createUser(data: {
  email: string;
  nome: string;
  senha: string;
  role?: string;
  cpf?: string;
  telefone?: string;
  departamento?: string;
}) {
  const hashedPassword = await hashPassword(data.senha);

  return prisma.usuario.create({
    data: {
      email: data.email,
      nome: data.nome,
      senha: hashedPassword,
      role: (data.role as any) || 'INVENTOR',
      cpf: data.cpf,
      telefone: data.telefone,
      departamento: data.departamento,
    },
    select: {
      id: true,
      email: true,
      nome: true,
      role: true,
      cpf: true,
      telefone: true,
      departamento: true,
      createdAt: true,
    },
  });
}

/**
 * Extrai o token do cabeçalho Authorization
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}
