// import crypto from "crypto";
import bcrypt from "bcrypt";
import { supabase } from "./supabaseClient";

// [INSERT YOUR DATABASE CONNECTION SETUP CODE HERE]

export async function createUser(
  name: string,
  password: string,
) {
  try {
    // eslint-disable-next-line no-useless-catch
    try {

      const {data} = await  supabase.from("Users").insert([{name, password}]).select()
      // if (error) throw new Error()

      return data![0] as unknown as { id: string, name: string };
    } catch (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

interface EditUserDataProps {
  id: string;
  name?: string;
  password?: string;
  avatarURL?: string;
}

export async function editUserData(data: EditUserDataProps) {
      const { error } = await supabase.from("Users").update({ avatar_url: data.avatarURL }).eq("id", data.id)
      return { error }
}

export async function getUserByName(name: string) {
  try {

    let result = await supabase.from('Users').select("*")
    result = result.data?.find(e => e.name === name)

    return result || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function validateUserCredentials(
  name: string,
  passwd: string
) {
  try {
    // Get user by email from database
    const user = await getUserByName(name);
    console.log("getuserbyName", user)
    // If no user found with this email
    if (!user) {
      return null;
    }

    // Compare provided password with stored hash
    const isPasswordValid = await bcrypt.compare(
      passwd,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      user.password
    );

    if (!isPasswordValid) {
      return null;
    }

    // Update last login time of the user in database
    // Return user without password
    return user as unknown as {id: string, name: string, avatar_url: string};
  } catch (error) {
    console.error("Error validating credentials:", error);
    return null;
  }
}

// export async function updateLastLogin(
//   userId: string
// ) {
//   try {

//     // Update last login based on userId in database
//     ...

//     return true;
//   } catch (error) {
//     console.error("Error updating last login:", error);
//     return false;
//   }
// }

// export async function logJwtToken(
//   userId: string,
//   tokenValue: string,
//   issuedAt: Date,
//   expiresAt: Date
// ): Promise<void> {
//   try {

//     // log JWT token in database
//     ...

//   } catch (error) {
//     console.error("Error logging JWT token:", error);
//   }
// }