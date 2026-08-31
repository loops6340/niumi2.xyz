import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { UserService } from "$lib/db/UserService";

export const actions = {
  register: async ({ request, locals }) => {
    const data = await request.formData();
    const name = data.get("name");
    const password = data.get("password");

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
          const userService = new UserService(locals.supabase)

          const { error } = await userService.registerUser(name, password)

          if (error) {
            return {
              success: false,
              error: "user-exists",
              message: "Una cuenta con este nombre ya existe",
            };
          }

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

    const result = await registerUser();

    if (!result.success) {
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
    throw redirect(302, "/");
  },
} satisfies Actions;
