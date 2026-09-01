import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { AuthUser } from "@/lib/api/auth.service";

/**
 * JWT Helper untuk session management
 * 
 * - Token expires: 7 days
 * - Secret from env
 * - HttpOnly cookies
 */

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-key-change-in-production-please-min-32-chars"
);

const COOKIE_NAME = "auth-token";
const TOKEN_EXPIRES_IN = "7d";

export interface SessionPayload {
  userId: string;
  email: string;
  roleId: string;
  iat: number;
  exp: number;
}

/**
 * Create JWT token
 */
export async function createToken(user: AuthUser): Promise<string> {
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    roleId: user.roleId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRES_IN)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify JWT token
 */
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Set session cookie
 */
export async function setSession(user: AuthUser) {
  const token = await createToken(user);
  const cookieStore = await cookies();
  
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

/**
 * Get session dari cookie
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME);

  if (!token) {
    return null;
  }

  return await verifyToken(token.value);
}

/**
 * Clear session cookie
 */
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
