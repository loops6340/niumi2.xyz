import { fail, redirect } from "@sveltejs/kit";
import {
  generateToken,
  setAuthCookie,
} from "$lib/auth/jwt";


import bcrypt from "bcrypt";
import type { Actions } from "./$types";
import { createUser, getUserByName } from "$lib/db";

export const actions = {
  register: async ({ cookies, request }) => {
    const data = await request.formData();
    const name = data.get("name");
    const password = data.get("password");

    // Wrap all registration logic in a separate async function
    const registerUser = async () => {
      try {
        // Email validation
        if (typeof name !== "string" || !name) {
          return {
            success: false,
            error: "invalid-input",
            message: "Pon un nombre :'v",
          };
        }

        // Email format validation
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (!emailRegex.test(name)) {
        //   return {
        //     success: false,
        //     error: "invalid-input",
        //     message: "Please enter a valid email address",
        //   };
        // }

        // Password validation
        if (typeof password !== "string" || password.length < 6) {
          return {
            success: false,
            error: "invalid-input",
            message: "La contraseña debe tener al menos 6 caracteres :'v",
          };
        }

        // Check if user already exists
        const existingUser = await getUserByName(name);
        if (existingUser) {
          return {
            success: false,
            error: "user-exists",
            message: "Una cuenta con este nombre ya existe",
          };
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(
          password,
          saltRounds
        );

        const user = await createUser(
          name,
          hashedPassword,
        );

        console.log("User Created");

        if (!user) {
          return {
            success: false,
            error: "database-error",
            message: "Failed to create account - database error",
          };
        }

        const tokenPayload = {
          userId: user.id,
          name: user.name,
        };
		console.log(tokenPayload)
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
    const result = await registerUser();

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
