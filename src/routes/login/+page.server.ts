import { fail, redirect } from "@sveltejs/kit";
import {
  generateToken,
  setAuthCookie,
} from "$lib/auth/jwt";


import type { Actions } from "./$types";
import { validateUserCredentials } from "$lib/db";

export const actions = {
  login: async ({ cookies, request }) => {
    const data = await request.formData();
    const name = data.get("name");
    const password = data.get("password");

    // Wrap all registration logic in a separate async function
    const loginUser = async () => {
      try {
        // Email validation
        if (typeof name !== "string" || !name) {
          return {
            success: false,
            error: "invalid-input",
            message: "pon un nombre :'v",
          };
        }

        // Password validation
        if (typeof password !== "string" || password.length < 6) {
          return {
            success: false,
            error: "invalid-input",
            message: "La contraseña debe tener al menos 6 caracteres :'v",
          };
        }

        const user = await validateUserCredentials(name, password)!

        if (user === null) {
          return {
            success: false,
            error: "login-failed",
            message: "Credenciales inválidas",
          };
        }

        const tokenPayload = {
          userId: user!.id,
          name: user!.name,
        };

        const accessToken = generateToken(tokenPayload);
        setAuthCookie(cookies, accessToken);
        return { success: true };
      } catch (error) {
        console.error("Registration error:", error);
        return {
          success: false,
          error: "registration-failed",
          message: "Failed to create account",
        };
      }
    };

    // Execute the registration process
    const result = await loginUser();

    if (!result.success) {
      // Map error types to appropriate HTTP status codes and response formats
      switch (result.error) {
        case "user-exists":
          return fail(400, {
            invalid: true,
            message: result.message,
          });

        case "invalid-input":
          return fail(400, {
            invalid: true,
            message: result.message,
          });

        case "connection-error":
          return fail(503, { error: true, message: result.message });

        case "database-error":
        case "registration-failed":
        default:
          return fail(500, { error: true, message: result.message });
      }
    }
    // Registration succeeded, perform redirect
    throw redirect(302, "/");
  },
} satisfies Actions;
