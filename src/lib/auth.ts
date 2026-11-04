import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import prisma from './prisma';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'legality-secure-jwt-secret-key-32-chars-long-minimum'
);

export const AUTH_COOKIE_NAME = 'legality_token';

export interface UserJwtPayload {
  userId: string;
  email: string;
  role: string;
  fullName: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signToken(payload: UserJwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<UserJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as UserJwtPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const decoded = await verifyToken(token);
    if (!decoded?.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        clientProfile: true,
        employeeProfile: true,
      },
    });

    if (!user || !user.isActive) return null;

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      phone: user.phone,
      clientProfile: user.clientProfile,
      employeeProfile: user.employeeProfile,
    };
  } catch (error) {
    console.error('getCurrentUser error:', error);
    return null;
  }
}

