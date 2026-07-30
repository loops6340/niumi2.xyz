import { fail, redirect } from "@sveltejs/kit";
import {
  generateToken,
  setAuthCookie,
} from "$lib/auth/jwt";
import jwt from 'jsonwebtoken'

import type { Actions } from "./$types";
import { editUserData } from "$lib/db";
import { getAvatarPublicURL, uploadAvatar } from "$lib/storage";

export const actions = {
  edit: async ({ cookies, request }) => {
    const data = await request.formData();
    // const name = data.get("name");
    // const password = data.get("password");
    const avatar = data.get("avatar") as File;

    const editUser = async () => {
      try {

        // if (typeof name !== "string" || !name) {
        //   return {
        //     success: false,
        //     error: "invalid-input",
        //     message: "pon un nombre :'v",
        //   };
        // }

        // // Password validation
        // if (typeof password !== "string" || password.length < 6) {
        //   return {
        //     success: false,
        //     error: "invalid-input",
        //     message: "La contraseña debe tener al menos 6 caracteres :'v",
        //   };
        // }

        // const user = await validateUserCredentials(name, password)!

        // if (user === null) {
        //   return {
        //     success: false,
        //     error: "login-failed",
        //     message: "Credenciales inválidas",
        //   };
        // }

         if (!avatar.name.includes("png") && !avatar.name.includes("jpg") && !avatar.name.includes("jpeg")) {
          return {
            success: false,
            error: "registration-failed",
            message: "debes enviar una imagen...",
          }
        }

        if (avatar.size > 3000000) {
          return {
            success: false,
            error: "registration-failed",
            message: "El archivo es muy pesado (> 3mb)",
          }
        }

        const { data, error } = await uploadAvatar(avatar)!

        if (error) {
          return {
            success: false,
            error: "registration-failed",
            message: "Hubo un error al subir la imagen",
          }
        }

        if (data == null) {
          return {
            success: false,
            error: "registration-failed",
            message: "No se detectó alguna imagen",
          }
        }

        const previousAccessToken = cookies.get("access_token")!

        const user = jwt.decode(previousAccessToken) as jwt.JwtPayload;

        await editUserData({
          id: user.id,
          avatarURL: getAvatarPublicURL(data.path)
        })


        const tokenPayload = {
          id: user.id,
          name: user.name,
          avatarURL: getAvatarPublicURL(data.path)
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

    const result = await editUser();

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
