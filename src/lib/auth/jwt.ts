import jwt from "jsonwebtoken";

import type { Cookies } from "@sveltejs/kit";
import { dev } from "$app/environment";
import { JWT_SECRET } from "$env/static/private";

// Configuration for authentication cookies
export const COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  secure: !dev, // Only use secure in production
  sameSite: "strict" as const,
  maxAge: 60 * 60, // 1 hour in seconds
};

/**
 * Set authentication cookie in the response
 */
export const setAuthCookie = (
  cookies: Cookies,
  accessToken: string
): void => {
  cookies.set("access_token", accessToken, COOKIE_OPTIONS);
};

/**
 * Clear authentication cookies
 */
export const clearAuthCookies = (cookies: Cookies): void => {
  cookies.delete("access_token", { path: "/" });
  cookies.delete("user", { path: "/" }); // Clear the existing user cookie as well
};

/**
 * Get authentication token from cookies
 */
export const getAuthToken = (
  cookies: Cookies
): string | undefined => {
  return cookies.get("access_token");
};

export interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

interface TokenResponse {
  success: boolean;
  message?: string;
  user?: Omit<JwtPayload, "iat" | "exp">;
  error?: unknown;
}


const ACCESS_TOKEN_EXPIRY = "24h"; // 1 hour

/**
 * Generate a JWT token for a user
 */
export const generateToken = (
  payload: Omit<JwtPayload, "iat" | "exp">
): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

/**
 * Verify the validity of a JWT token
 */
export const verifyToken = (token: string): TokenResponse => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return {
      success: true,
      user: {
        id: decoded.id,

      },
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Invalid token",
      error,
    };
  }
};


export const authenticateRequest = (
  cookies: Cookies
): TokenResponse => {
  const accessToken = getAuthToken(cookies);

  if (!accessToken) {
    return {
      success: false,
      message: "No authentication token found",
    };
  }

  return verifyToken(accessToken);
};

