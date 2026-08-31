import { fail, redirect } from "@sveltejs/kit"

import type { Actions } from "./$types";
export const actions = {
  login: async ({ request, locals }) => {
    const data = await request.formData();
    const name = data.get("name");
    const password = data.get("password");

    const loginUser = async () => {
      try {
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

         console.log(`${name.split(" ").join("")}@niumi.xyz`)
         console.log(password)
        const {error} = await locals.supabase.auth.signInWithPassword({
          email: `${name.split(" ").join("")}@niumi.xyz`,
          password: password
        })

        if (error) {
          return {
            success: false,
            error: "login-failed",
            message: "credenciales inválidas",
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

    const result = await loginUser();

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
        case "login-failed":
        default:
          return fail(500, { error: true, message: result.message });
      }
    }
    throw redirect(302, "/");
  },
} satisfies Actions;
