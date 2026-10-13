import { AuthError, type SupabaseClient } from '@supabase/supabase-js';
import { ChatsService } from './ChatService';
import * as Validations from '$lib/validation';
import StorageService from './StorageService';

interface EditUserDataProps {
	id: string;
	name?: string;
	password?: string;
	avatarURL?: string;
}

export class UserService {
	async getUserByName(name: string) {
		const { data, error } = await this.getProfilesTable().select('*').eq('name', name).single();
		return { data, error };
	}
	supabaseClient: SupabaseClient;
	constructor(supabaseClient: SupabaseClient) {
		this.supabaseClient = supabaseClient;
	}

	private getProfilesTable() {
		return this.supabaseClient.from('profiles');
	}

	async editUserData(data: EditUserDataProps) {
		const { error } = await this.getProfilesTable()
			.update({ avatar_url: data.avatarURL })
			.eq('id', data.id);
		return { error };
	}

	async getAllUsersData() {
		const { data, error } = await this.getProfilesTable().select();
		return { data, error };
	}

	async register(name: string, identificator: string, password: string) {

			const validation = Validations.validateRegistration({
				identificator: identificator,
				password
			});

			if (validation instanceof Error) return { error: validation } 

			const { error } = await this.supabaseClient.auth.signUp({
				email: `${identificator.split(' ').join('-')}@niumi.xyz`,
				password: password,
				options: {
					emailRedirectTo: 'https://example.com/welcome'
				}
			});

			await this.supabaseClient.from('profiles').insert({
				name
			});

			if (error) return { error: new Error('Una cuenta con este nombre ya existe') }

			const chatsService = new ChatsService(this.supabaseClient);
			await chatsService.joinToDMChat('d4f2a9c3-4e50-4b91-adbb-379bae5625cf');
	}

  async login(identificator?: string, password?: string | null) {

		if (typeof identificator !== "string" || !identificator) {
          return {
			error: new AuthError("Pon un nombre :'v")
          };
        }

        // Password validation
        if (typeof password !== "string" || password.length < 6) {
          return {
			error: new AuthError("La contraseña debe tener al menos 6 caracteres :'v")
          };
        }

         console.log(`${identificator.split(" ").join("")}@niumi.xyz`)
         console.log(password)
		 
        const {error} = await this.supabaseClient.auth.signInWithPassword({
          email: `${identificator.split(" ").join("")}@niumi.xyz`,
          password: password
        })
	
        if (error) {
			console.log(error.toJSON())
          return {
            error: new AuthError("Credenciales inválidas")
          };
        }
  }

  async edit(avatar: File) {
	
    const storageService = new StorageService(this.supabaseClient)
    const userService = new UserService(this.supabaseClient)

         if (!avatar.name.includes("png") && !avatar.name.includes("jpg") && !avatar.name.includes("jpeg")) {
          return {
            error: new Error("Debes agregar una imagen")
          }
        }

        if (avatar.size > 3000000) {
          return {
            error: new Error("El archivo es muy pesado (> 3mb)")
          }
        }

        const { data, error } = await storageService.uploadAvatar(avatar)!

        if (error) {
          return {
            error: new Error("Hubo un error al subir la imagen")
          }
        }

        if (data == null) {
          return {
            success: false,
            error: new Error("No se detectó alguna imagen")
          }
        }

        const user = await this.supabaseClient.auth.getUser();

        await userService.editUserData({
          id: user.data.user!.id,
          avatarURL: storageService.getPublicURL(data.path)
        })
  }

	async getUser(id: string) {
		const query = this.getProfilesTable().select().eq('id', id);

		const { data, error } = await query;

		return { data: data?.[0], error: error };
	}
}
